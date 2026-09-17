<?php

declare(strict_types=1);

/**
 * Recepti — upload slika u img/ folder.
 *
 * Prima POST multipart/form-data zahtev sa poljem "image" i tajnim tokenom
 * (header X-Upload-Token ili POST polje "token"). Vidi README.md za uputstvo.
 *
 * Bezbednosne mere:
 * - fiksni tajni token (bez tokena/pogrešan token => 403, hash_equals zbog
 *   timing-safe poređenja, mala pauza da se oteža brute-force)
 * - cilj upisa je zaključan na img/ folder, ime fajla je sanitizovano i
 *   provereno realpath()-om da ostaje unutar tog foldera (bez path traversal)
 * - dozvoljene su samo slike: ekstenzija se ne uzima od klijenta, već se
 *   određuje iz stvarnog sadržaja fajla (getimagesize + finfo MIME), tako da
 *   se npr. "shell.php" prerušen u .jpg ne može ubaciti
 * - limit veličine fajla
 * - img/.htaccess dodatno sprečava izvršavanje PHP fajlova u tom folderu,
 *   za slučaj da ijedna od gornjih provera ikad zaobiđena
 */

header('Content-Type: application/json; charset=utf-8');

const IMG_DIR = __DIR__ . '/img';
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_MIME_TO_EXT = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
];

/** @return never */
function fail(int $status, string $message)
{
    http_response_code($status);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

function get_expected_token(): ?string
{
    $env = getenv('RECIPES_UPLOAD_TOKEN');
    if ($env !== false && $env !== '') {
        return $env;
    }

    $file = __DIR__ . '/secrets/upload-token.php';
    if (is_file($file)) {
        $value = require $file;
        if (is_string($value) && $value !== '') {
            return $value;
        }
    }

    return null;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail(405, 'Samo POST.');
}

$expectedToken = get_expected_token();
if ($expectedToken === null) {
    fail(500, 'Token nije podešen na serveru (RECIPES_UPLOAD_TOKEN ili secrets/upload-token.php).');
}

$providedToken = $_SERVER['HTTP_X_UPLOAD_TOKEN'] ?? ($_POST['token'] ?? '');
if (!is_string($providedToken) || $providedToken === '' || !hash_equals($expectedToken, $providedToken)) {
    // mala pauza da se oteža brute-force pogodaka tokena
    usleep(300_000);
    fail(403, 'Neispravan ili nedostajući token.');
}

if (!isset($_FILES['image']) || !is_array($_FILES['image'])) {
    fail(400, 'Nema fajla (očekivano multipart polje "image").');
}

$file = $_FILES['image'];

if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    fail(400, 'Greška pri upload-u (kod ' . (string) $file['error'] . ').');
}

if (!is_string($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
    fail(400, 'Neispravan upload.');
}

$size = (int) ($file['size'] ?? 0);
if ($size <= 0 || $size > MAX_BYTES) {
    fail(400, 'Fajl je prevelik ili prazan (max ' . (string) (MAX_BYTES / 1024 / 1024) . ' MB).');
}

// Provera da je fajl STVARNO slika — ne verujemo ekstenziji ni Content-Type
// headeru koji šalje klijent, oba se lako lažiraju.
if (@getimagesize($file['tmp_name']) === false) {
    fail(400, 'Fajl nije validna slika.');
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$detectedMime = $finfo->file($file['tmp_name']);
$extension = ALLOWED_MIME_TO_EXT[$detectedMime] ?? null;

if ($extension === null) {
    fail(400, 'Dozvoljeni formati slika: JPG, PNG, WEBP, GIF.');
}

if (!is_dir(IMG_DIR) || !is_writable(IMG_DIR)) {
    fail(500, 'img/ folder ne postoji ili nije upisiv.');
}

// Ime fajla: samo iz osnovnog imena (bez putanje iz klijenta), sanitizovano
// na [a-z0-9-], sa ekstenzijom određenom iz stvarnog sadržaja iznad.
$originalName = pathinfo((string) $file['name'], PATHINFO_FILENAME);
$safeName = strtolower(preg_replace('/[^a-zA-Z0-9-]+/', '-', $originalName) ?? '');
$safeName = trim($safeName, '-');
if ($safeName === '') {
    $safeName = 'slika';
}

$targetName = $safeName . '.' . $extension;
$targetPath = IMG_DIR . '/' . $targetName;

// Ne prepisuj postojeći fajl — dodaj brojač ako ime već postoji.
$counter = 1;
while (file_exists($targetPath)) {
    $targetName = $safeName . '-' . (string) $counter . '.' . $extension;
    $targetPath = IMG_DIR . '/' . $targetName;
    $counter++;
}

// Odbrana od path traversal: konačna putanja MORA biti unutar IMG_DIR.
$realImgDir = realpath(IMG_DIR);
if ($realImgDir === false || !str_starts_with($targetPath, $realImgDir . DIRECTORY_SEPARATOR)) {
    fail(400, 'Neispravna putanja.');
}

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    fail(500, 'Upload nije uspeo.');
}

chmod($targetPath, 0644);

echo json_encode([
    'ok' => true,
    'filename' => $targetName,
    'path' => './img/' . $targetName,
]);
