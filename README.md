# Moji recepti

Lična kolekcija zdravih, high-protein recepata — mala vanilla JS aplikacija,
bez build koraka.

## Pokretanje lokalno

Nije potreban `npm install` da bi radilo — samo treba pravi lokalni server
(ne `file://`, jer moduli/fetch ne rade preko `file://` u nekim browserima).

```bash
npx serve .
# ili, ako imaš Python:
python3 -m http.server 5173
```

Zatim otvori `http://localhost:5173` (ili port koji ti javi terminal).

## Struktura

Vidi `CLAUDE.md` za pun opis strukture i konvencija — to je fajl koji Claude
Code čita automatski za kontekst projekta.

## Deploy

Statični fajlovi — može na bilo koji static hosting (Netlify, Vercel, GitHub
Pages, ili tvoj sopstveni server). Samo prebaci ceo folder.

Izuzetak je `upload.php` (upload slika, vidi dole) — za njega je potreban
server sa PHP podrškom (npr. tvoj sopstveni hosting). Netlify/Vercel/GitHub
Pages ne izvršavaju PHP, pa `upload.php` na njima jednostavno neće raditi
(nije problem ako ga i ne deploy-uješ tamo).

## Upload slika (`upload.php`)

Mali PHP endpoint za dodavanje slika recepata direktno u `img/` folder na
serveru, zaštićen fiksnim tajnim tokenom. Koristan kad hoćeš da dodaš sliku
recepta a nemaš (S)FTP pristup pri ruci — samo `curl` ili prost HTML formular.

**Bezbednost, ukratko:**
- Zahteva tačan tajni token (header `X-Upload-Token` ili POST polje `token`,
  poređenje je timing-safe preko `hash_equals`). Bez tokena ili sa pogrešnim
  → `403`.
- Prima samo slike — tip fajla se ne uzima iz onoga što klijent tvrdi
  (ime/ekstenzija/`Content-Type`), već iz stvarnog sadržaja fajla
  (`getimagesize` + MIME iz `finfo`). Dozvoljeno: JPG, PNG, WEBP, GIF.
- Fajl uvek završi u `img/` folderu — ime se sanitizuje i dodatno provera
  (`realpath`) da rezultujuća putanja ne izlazi iz tog foldera (bez path
  traversal-a), postojeći fajlovi se ne prepisuju.
- Max veličina fajla 8 MB.
- `img/.htaccess` dodatno onemogućava izvršavanje skripti u tom folderu
  (odbrana ako server koristi Apache), za slučaj da nešto ipak proturi
  gornje provere.

### Podešavanje tokena (jednom, na serveru)

Token se **ne** čuva u kodu. Generiši jedan nasumičan:

```bash
php -r "echo bin2hex(random_bytes(32));"
```

Onda ga postavi na serveru na **jedan** od dva načina:

1. **Environment varijabla** `RECIPES_UPLOAD_TOKEN` (preferirano, ako imaš
   pristup konfiguraciji servera/PHP-FPM pool-a), ili
2. **Fajl** `secrets/upload-token.php` (folder `secrets/` je već u
   `.gitignore` — nikad se ne commit-uje):

   ```bash
   cp secrets/upload-token.php.example secrets/upload-token.php
   # zameni 'OVDE-UPISI-SVOJ-TAJNI-TOKEN' generisanim tokenom iz koraka gore
   ```

`upload.php` prvo provera environment varijablu, pa fajl.

### Korišćenje

**Preko `curl`:**

```bash
curl -X POST https://tvoj-sajt.example/upload.php \
  -H "X-Upload-Token: <tvoj-token>" \
  -F "image=@/putanja/do/slike.jpg"
```

Odgovor (uspeh):

```json
{"ok": true, "filename": "slike.jpg", "path": "./img/slike.jpg"}
```

Vrednost iz `path` je ono što ide u `image` polje recepta (vidi `CLAUDE.md` →
"Kako se dodaju / menjaju recepti").

**Preko HTML formulara** (npr. lokalno, da ne kucaš `curl` svaki put — sačuvaj
kao `.html` i otvori u browseru):

```html
<form action="https://tvoj-sajt.example/upload.php" method="post" enctype="multipart/form-data">
  <input type="text" name="token" placeholder="tajni token">
  <input type="file" name="image" accept="image/*">
  <button type="submit">Upload</button>
</form>
```

**Preko Claude (automatski, MCP konektor "Moji recepti"):**

Ako je `RECIPES_UPLOAD_URL`/`RECIPES_UPLOAD_TOKEN` podešen na Cloudflare Worker-u
(vidi `CLAUDE.md` → "Upload slika"), Claude može direktno da zove alat
`upload_recipe_image` iz bilo koje sesije koja ima konektor — nije potreban
ni `curl` ni formular. Worker onda sam šalje POST na `upload.php`.

Napomena: **Claude Code na webu/u cloud sandboxu ne može ovo pozvati
direktno** (izlazni internet iz tog sandboxa je ograničen na uzak allowlist),
pa taj put ide isključivo preko Worker-a, ne direktno.

### Napomene

- Endpoint prima samo `POST`; svaki drugi metod vraća `405`.
- Greške se vraćaju kao JSON (`{"ok": false, "error": "..."}"`) sa odgovarajućim
  HTTP status kodom (`400`/`403`/`405`/`500`).
- Koristi HTTPS na serveru gde je `upload.php` deploy-ovan — token putuje u
  header/POST telu, i bez HTTPS-a je vidljiv na mreži.
- **Ne ostavljaj placeholder token** (`OVDE-UPISI-SVOJ-TAJNI-TOKEN` iz
  `secrets/upload-token.php.example`) kao stvarni token — on je javno vidljiv
  (u ovom repo-u i u istoriji razgovora), pa ne pruža nikakvu zaštitu. Generiši
  pravi nasumičan token (vidi gore) čim server postane dostupan van tvoje
  lokalne mreže (npr. preko Tailscale Funnel-a ili sličnog).
