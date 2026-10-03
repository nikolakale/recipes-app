/* ====================================================================
   Jednokratno: prebacuje `image` polje 9 recepata sa "./img/..." (stari NAS)
   na javni R2 URL. Menja SAMO polje `image`, i to samo ako trenutna
   vrednost odgovara očekivanoj staroj putanji.
   Pokreni: node scripts/migrate-images-to-r2.mjs
==================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const R2_BASE = 'https://pub-831ec959efde4f9287af567989c1613f.r2.dev';

const MAP = {
  'cottage-sir-whey-kikiriki-puter': 'cottage-sir-whey-kikiriki-puter.jpg',
  'grcki-jogurt-whey-cokolada-maline-plazma': 'grcki-jogurt-whey-cokolada-maline-plazma.jpg',
  'proteinske-palacinke-whey-jaja-jogurt': 'proteinske-palacinke-whey-jaja-jogurt.jpg',
  'grcki-jogurt-javorov-sirup-banana-badem-whey': '1790069615358.png',
  'bananin-kolac-jaja-jogurt-kakao': 'bananin-kolac-jaja-jogurt-kakao.png',
  'zdravi-tiramisu-jogurt-cottage-whey': 'Protein-Tiramisu-Final-769x1024.jpg',
  'overnight-zobena-chia-whey': 'overnight-zobena-chia-whey.jpg',
  'cottage-sir-jogurt-whey-plazma-maline': '1790074781398.png',
  'proteinske-palacinke-banana-maline-cokolada': '1790068539109.png',
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const SECRETS_PATH = process.env.FIREBASE_SERVICE_ACCOUNT
  || path.join(root, 'secrets', 'firebase', 'homeapps-c4df4-firebase-adminsdk-fbsvc-7a4960c667.json');

initializeApp({ credential: cert(JSON.parse(fs.readFileSync(SECRETS_PATH, 'utf8'))) });
const db = getFirestore();

for (const [id, file] of Object.entries(MAP)){
  const ref = db.collection('recipes').doc(id);
  const snap = await ref.get();
  if (!snap.exists){ console.log(`SKIP ${id}: ne postoji`); continue; }
  const current = snap.data().image;
  const expectedOld = `./img/${file}`;
  const next = `${R2_BASE}/${file}`;
  if (current === next){ console.log(`OK   ${id}: već migriran`); continue; }
  if (current !== expectedOld){ console.log(`SKIP ${id}: neočekivana vrednost "${current}"`); continue; }
  await ref.update({ image: next });
  console.log(`DONE ${id}: ${expectedOld} -> ${next}`);
}
