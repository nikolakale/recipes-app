# Moji recepti — kontekst projekta

Lična kolekcija recepata (zdravi, high-protein obroci). Isti pattern kao
sestrinski projekat `gym-app` (React/PWA/Cloudflare Worker/Google auth) —
oba dele Firebase projekat `homeapps-c4df4` i Cloudflare nalog.

- **Frontend:** React (Vite), PWA (installable), hostovan kao Cloudflare
  Worker sa static assets (`recepti-app-web`) — NE Cloudflare Pages, vidi
  napomenu u "Poznata ograničenja". Ranije vanilla JS bez build koraka,
  hostovana na korisnikovom NAS-u — ta verzija je uklonjena, potpuno
  zamenjena ovim.
- **Podaci:** recepti žive u **Firestore-u** (Firebase projekat `homeapps-c4df4`),
  kolekcija `recipes`, jedan dokument po receptu (`id` = slug = ID dokumenta).
  Web app ih samo čita; pisanje ide preko Claude-a.
- **Ocene:** posebna kolekcija `ratings/{recipeId}` (`{rating: 1-5, updatedAt}`).
  Web app ovde piše direktno (zvezdice se klikću uživo).
- **Auth:** Google Sign-In (Firebase Authentication) na frontend-u — app je
  javno dostupna preko Cloudflare Worker URL-a, pa je i čitanje i pisanje
  Firestore-a ograničeno na prijavljene korisnike sa dozvoljenim email-om
  (allowlist u `firestore.rules`, trenutno samo `nikolakale@gmail.com`) —
  isti mehanizam kao gym-app. Sajt više NIJE javno čitljiv bez logina
  (ranija verzija je bila).
- **Slike:** žive u **Cloudflare R2** (bucket `recepti-images`), ne na
  korisnikovom NAS-u kao ranije (upload.php + Tailscale Funnel je
  uklonjen). `recipe.image` je puna javna R2 URL adresa ili `null`.

## Arhitektura

```
   PISANJE (dodaj / izmeni / obriši recept)
   ─────────────────────────────────────────

   Claude na desktopu              Claude na mobilnom / claude.ai
   (Claude Code)                   (MCP konektor "Moji recepti")
        │                                     │
        │ node scripts/*.mjs                  │ MCP alati: list_recipes,
        │ (firebase-admin,                    │ get_recipe, save_recipe,
        │  service account ključ)             │ delete_recipe,
        │                                     │ upload_recipe_image
        │                                     ▼
        │                        ┌─────────────────────────────────┐
        │                        │  Cloudflare Worker "recepti-mcp" │
        │                        │  recepti-mcp.…workers.dev/mcp   │
        │                        │  - OAuth 2.1 (login lozinka)    │
        │                        │  - Firestore REST + JWT potpis  │
        │                        │  - R2 binding (upload slika)    │
        │                        └───────┬─────────────────┬───────┘
        │                                │                 │
        └──────────────────┐   ┌─────────┘         ┌───────┘
                           ▼   ▼                   ▼
              ┌───────────────────────┐  ┌──────────────────────┐
              │  Firestore            │  │  R2 bucket           │
              │  homeapps-c4df4       │  │  recepti-images      │
              │  kolekcija "recipes"  │  │  (javni dev URL)     │
              │  rules: samo prijav-  │  └──────────┬───────────┘
              │  ljeni + allowlist    │             │
              └──────────┬─────────────┘             │
                         │  čitanje uživo (Firebase JS SDK)
                         ▼                           │
              ┌───────────────────────────────────────┴───┐
              │  FE app — React (Vite), Cloudflare Worker  │
              │  sa static assets ("recepti-app-web")      │
              │  src/firebase.js → auth gate + čitanje     │
              │  SAMO PRIKAZ recepata, ne piše u recipes.  │
              │  ratings: piše DIREKTNO (zvezdice).        │
              └─────────────────────────────────────────────┘

   ČITANJE recepata ide samo u jednom smeru: Firestore → FE app.
   FE app nema kredencijale za pisanje recepata i ne zna za recepti-mcp
   Worker. Slike (R2) se učitavaju direktno sa R2 javnog URL-a u <img>.

   UPLOAD SLIKA — sad ide preko istog Worker-a kao ostatak pisanja (R2
   binding), više NE preko odvojenog PHP endpointa/Tailscale Funnel-a
   (ta arhitektura je uklonjena — vidi git istoriju ako zatreba referenca).
```

## Struktura

```
web/                    — React (Vite) frontend, PWA (installable)
  index.html
  wrangler.jsonc          — Cloudflare Worker "recepti-app-web", servira ./dist kao
                             static assets (NE Pages — vidi "Poznata ograničenja")
  vite.config.js           — vite-plugin-pwa: generiše manifest.webmanifest + service
                              worker (Workbox precache) iz build output-a
  public/                  — ikonice (topla paleta, plate+pribor motiv): icon-192.png,
                              icon-512.png, apple-touch-icon.png, favicon.svg/png
  src/
    main.jsx              — ulazna tačka
    App.jsx                — auth gate (Login / access-denied / app), hash ruter
                              (lista ↔ detalj), učitava recepte+ocene tek posle logina
    firebase.js             — (ES modul) loadRecipesAndRatings() (read-only recipes +
                              ratings), watchAuthState/signInWithGoogle/signOutUser,
                              rateRecipe(id, value) (piše direktno u ratings)
    AppData.jsx              — React context: recepti, ocene (+setRating), lista za
                              kupovinu (+add/remove/clear), deljeno kroz stablo
    shoppingList.js           — localStorage read/write helperi (per-browser)
    icons.jsx                — kategorijske i po-receptu SVG ilustracije (portovano
                              1:1 iz stare vanilla verzije) + RecipeVisual komponenta
                              (prava fotografija sa fallback na ilustraciju)
    utils.js                  — getPerServingTotal() helper
    styles.css                 — sav stil, portovan 1:1 iz stare verzije + login/
                              install-banner sekcije (isti pattern kao gym-app)
    components/
      Login.jsx                 — "Prijavi se sa Google nalogom" ekran
      InstallPrompt.jsx           — banner "Instaliraj aplikaciju" (beforeinstallprompt
                                    na Android/desktop Chrome; ručni hint za iOS Safari)
      TopBar.jsx                   — naslov+broj recepata+odjava (lista) / nazad (detalj)
      CategoryFilters.jsx           — chip filteri po kategoriji
      RecipeList.jsx                 — grid kartica
      RecipeCard.jsx                   — jedna kartica (slika/ilustracija, naslov, meta)
      RecipeDetail.jsx                  — pun prikaz recepta; ista "dupliran sadržaj +
                                    CSS toggle" tehnika kao stari `.meta`/`.meta-side`
                                    par, sad i za rating/nutrition (desktop leva kolona
                                    vs mobilni tok) — vidi styles.css @media 1000px
      IngredientRow.jsx                  — sastojak: checkbox (precrtavanje) + dugme
                                    za dodavanje u listu za kupovinu
      NutritionTable.jsx                  — tabela kalorija/proteina
      RatingWidget.jsx                     — 5 zvezdica, piše preko AppData→firebase.js
      ShoppingList.jsx                      — FAB + bottom sheet

worker/                 — Cloudflare Worker "recepti-mcp": MCP server za pisanje u bazu
  src/
    index.js              — OAuth 2.1 provider (workers-oauth-provider) + login stranica
    mcp-server.js           — definicije MCP alata (list/get/save/delete recipe,
                              upload_recipe_image)
    firestore.js             — Firestore REST klijent (JWT potpis preko Web Crypto)
    image-upload.js           — upload u R2 (binding RECIPES_IMAGES), sanitizuje ime,
                              prepoznaje pravi tip fajla iz magic bytes (ne veruje
                              ekstenziji), vraća punu javnu R2 URL adresu

.github/workflows/      — GitHub Actions, auto-deploy na push u `master`
  deploy-worker.yml       — worker/** → npm ci + npx wrangler deploy (recepti-mcp)
  deploy-web.yml           — web/** → npm ci + npm run build + npx wrangler deploy
                              (recepti-app-web)
  (oba imaju i workflow_dispatch za ručno pokretanje; treba CLOUDFLARE_API_TOKEN
   kao GitHub repo secret — Settings → Secrets and variables → Actions)

scripts/                — admin alati (Node, koriste firebase-admin + service account)
  migrate-to-firestore.mjs   — jednokratna migracija starog data.js → Firestore
  add-recipe.mjs             — doda/zameni recept iz JSON fajla
  delete-recipe.mjs          — obriše recept po id-ju
  deploy-firestore-rules.mjs — (rezerva; obično koristi firebase-tools CLI)
  seed-recipes.json          — zamrznut snapshot 12 recepata iz početne migracije

img/                    — BACKUP fotografija jela (izvor istine za sliku je R2, ovo je
                           samo kopija u git-u za slučaj da treba ponovni upload)

firebase.json          — konfiguracija za `firebase-tools` (samo Firestore rules)
.firebaserc            — vezuje folder za projekat homeapps-c4df4
firestore.rules        — `recipes`/`ratings`: čitanje i pisanje samo za allowlist
                          (Google auth) — VAŽNO: mora sadržati i gym-app-ova pravila,
                          vidi napomenu u samom fajlu

secrets/               — NIKAD u git (u .gitignore). Sadrži:
  firebase/…-adminsdk-….json — service account ključ
  cloudflare-api-token.txt   — CF token za `wrangler deploy`
  oauth-passphrase.txt       — lozinka za login stranicu recepti-mcp Worker-a
  cloudflare-mcp-token.txt   — (stari statični bearer, više se ne koristi)
```

## Kako se dodaju / menjaju recepti

Recepti se **ne edituju u kodu** — upisuju se u Firestore. Dva puta, oba idu preko Claude-a:

1. **Desktop (Claude Code):** `node scripts/add-recipe.mjs putanja/do/recepta.json`
   (i `delete-recipe.mjs <id>`). Koristi service account iz `secrets/`.
2. **Bilo koji uređaj (uklj. mobilni Claude):** MCP konektor **"Moji recepti"** u
   claude.ai podešavanjima → alati `list_recipes`, `get_recipe`, `save_recipe`,
   `delete_recipe`, `upload_recipe_image`. Iza njega je Cloudflare Worker
   `https://recepti-mcp.nikolakale-recepti.workers.dev/mcp`.
   `upload_recipe_image` prima base64 sadržaj slike i ime, upload-uje u R2 bucket
   preko Worker binding-a i vraća punu javnu URL adresu za `image` polje.

Oblik objekta recepta (isti kao stari format):
naslov → opis → porcije → sastojci → koraci → napomene → tabela kalorija/proteina.
Polja: `id, image, category, title, description, servings, ingredientGroups[],
steps[], notes[]?, nutrition{hasProtein, rows[], totals[]}, source?`.
`order` (int) se dodaje automatski i drži redosled na listi — ne diraj ga ručno.

- **`nutrition.hasProtein: false`** — tabela u `NutritionTable.jsx` sakriva kolonu
  proteina.
- **`nutrition.totals`** — niz; red sa `perServing: true` se koristi za listu i meta
  statistike (neki recepti imaju i "Ukupno (X porcija)" i "Po porciji" red).
- **`category`** — tačno jedna od `CATEGORIES` iz `web/src/data.js`
  (Doručak, Užina, Dezert, Glavni obrok).
- **Slike:** `recipe.image` je puna URL adresa (R2 javni URL ili eksterni hotlink,
  npr. sa allrecipes.com/wellious.co za par starijih recepata) ili `null`. Kad je
  `null` koristi se SVG ilustracija iz `web/src/icons.jsx` (`recipeIcons[id]`), a ako
  ni nje nema — generička ilustracija kategorije.
- **Nova ilustracija:** SVG string u `recipeIcons` u `web/src/icons.jsx` pod istim
  `id`, viewBox `0 0 48 48`, `stroke="currentColor"` za linije (boja prati kategoriju),
  fiksne hex boje za akcente (bobice, čokolada, badem…).

## Podešavanje

### Povezivanje MCP konektora (novi uređaj / ponovno povezivanje)

1. claude.ai → **Settings → Connectors → Add custom connector**
2. **Name:** `Moji recepti`
3. **URL:** `https://recepti-mcp.nikolakale-recepti.workers.dev/mcp`
4. OAuth Client ID / Secret — **ostavi prazno** (Claude sam otkrije OAuth preko
   `/.well-known/…` sa Worker-a).
5. Klikni Connect → otvara se login stranica Worker-a → unesi lozinku iz
   `secrets/oauth-passphrase.txt`.
6. Posle autorizacije vidljivo je 5 alata. Grant se čuva u `OAUTH_KV`.

### Prva postavka od nule (disaster recovery)

**Firebase:** koristi POSTOJEĆI projekat `homeapps-c4df4` (isti kao gym-app) — ne
pravi novi. Uključi Firestore (Native mode) i Authentication → Google Sign-In (ako
već nije, npr. preko gym-app postavke — Authentication je po projektu, ne po app-u).
Web app config (`apiKey`, `projectId`…) ide u `web/src/firebase.js`. Generiši service
account ključ (Project settings → Service accounts) → snimi u `secrets/firebase/`.
Onda: `node scripts/migrate-to-firestore.mjs` (puni bazu iz `seed-recipes.json`).

Za deploy `firestore.rules` sa ovim service account ključem, `firebase-tools deploy`
ne radi (nedostaje IAM rola za `serviceusage.googleapis.com` proveru) — koristi
Admin SDK direktno (vidi gym-app CLAUDE.md "Prva postavka od nule" za tačan
kod-snippet obrasca `getSecurityRules(app).releaseFirestoreRulesetFromSource(...)`).
**PRE deploy-a pročitaj napomenu u `firestore.rules`** — mora sadržati i gym-app
pravila, inače ih ovaj deploy briše.

Authentication → Settings → Authorized domains → dodaj domen na kom je
`recepti-app-web` deploy-ovan (npr. `recepti-app-web.<nalog>.workers.dev`) — bez
ovoga `signInWithPopup` neće raditi sa te domene.

**Cloudflare:** napravi nalog + API token (template "Edit Cloudflare Workers") →
`secrets/cloudflare-api-token.txt`. Iz `worker/`: `npx wrangler kv namespace create
OAUTH_KV` (ID u `wrangler.jsonc`), `npx wrangler r2 bucket create recepti-images`,
`npx wrangler r2 bucket dev-url enable recepti-images` (daje javni `*.r2.dev` URL —
upiši ga kao `RECIPES_IMAGES_PUBLIC_URL` u `wrangler.jsonc` vars), postavi ostale
secrets (vidi "Redeploy / operacije"), `npx wrangler deploy`. Iz `web/`: `npm install
&& npm run build && npx wrangler deploy` (kreira `recepti-app-web` Worker).

## Redeploy / operacije

Sve komande iz odgovarajućeg foldera, sa CF tokenom iz env-a:

```
export CLOUDFLARE_API_TOKEN=$(cat secrets/cloudflare-api-token.txt)
cd worker && npx wrangler deploy              # redeploy MCP Worker-a
cd web && npm run build && npx wrangler deploy # redeploy frontend-a
npx wrangler secret put <IME>                 # izmena secret-a (čita vrednost sa stdin)
```

**Normalno:** samo `git push` u `master` sa izmenama u `worker/` ili `web/` — GitHub
Actions sam redeploy-uje (vidi `.github/workflows/`, treba `CLOUDFLARE_API_TOKEN`
kao GitHub repo secret).

Worker (`recepti-mcp`) secrets/vars: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`,
`FIREBASE_PRIVATE_KEY` (sve iz service account JSON-a), `AUTH_PASSPHRASE` (login
lozinka za MCP konektor), `RECIPES_IMAGES_PUBLIC_URL` (R2 bucket javni dev URL, plain
var — nije tajna). KV namespace `OAUTH_KV` (`9024c53faae646b3adcad9df1df9bfa4`) čuva
OAuth grantove. R2 binding `RECIPES_IMAGES` → bucket `recepti-images`.

Firestore rules (iz root foldera, sa `firebase login` autorizacijom korisnika):
```
npx firebase-tools deploy --only firestore:rules --project homeapps-c4df4
```
(ili Admin SDK metod ako CLI ne radi sa service account-om — vidi "Prva postavka").

**Dodavanje još nekog na allowlist:** preko **Admin taba** u app-u (vidljiv samo
adminu `nikolakale@gmail.com`, dugme "Admin" u zaglavlju liste, ruta `#/admin`).
Korisnik bez pristupa se prijavi Google-om → app upiše `accessRequests/{uid}`
(`{email, displayName, requestedAt}`) → admin klikne "Dozvoli", što upiše
`allowedUsers/{email}` (email malim slovima) i obriše zahtev; "Ukloni" briše
`allowedUsers` dokument. `isAllowedRecipesUser()` u `firestore.rules` = admin ILI
postoji `allowedUsers/{email}`. Admin email je hardkodiran u `firestore.rules`
(`isAdmin()`) i u `web/src/firebase.js` (`ADMIN_EMAIL`, samo za prikaz taba).
Gym-app pravila i dalje koriste hardkodiran email. Izmena samih pravila i dalje
traži ručni deploy — commit i push ne menjaju live rules (namerno).

## Dizajn sistem (u `web/src/styles.css`)

- Paleta: `--paper` (pozadina), `--card` (bela kartica), `--ink`/`--ink-soft` (tekst),
  `--gold`/`--sage`/`--rose` + tint varijante (akcentne boje po kategoriji).
- Tipografija: serif (`Iowan Old Style`/Georgia) za naslove i opise, sistemski
  sans-serif za UI tekst, monospace za brojeve (kalorije, proteini, količine).
- Estetika: topla "kartoteka recepata" — zaobljene kartice, fine linije, bez
  generičkih SaaS gradijenata.
- Lista: kartice sa slikom gore i tekstom ispod; grid 2 kolone (mobilni) →
  3 kolone (≥700px). Detalj na desktopu (≥1000px): ilustracija + statistika +
  ocena + tabela kalorija u levoj koloni (sticky), sastojci/priprema desno —
  implementirano dupliranim renderom (mobilna i desktop kopija) + CSS
  `display:none` toggle po breakpoint-u, ne DOM-move kao stara vanilla verzija.
- Jezik: sav sadržaj (UI, nazivi, komentari) je na srpskom.

## Poznata ograničenja / TODO

- **Cloudflare Pages nije korišćen** — isti razlog kao gym-app: CF aktivno
  potiskuje Pages za nove projekte (dashboard "Create application" flow nema više
  klasičnu Pages opciju, `wrangler pages deploy` na CI-ju baca grešku). Rešenje:
  `web/wrangler.jsonc` sa `assets.directory` servira frontend kao običan Worker
  (`recepti-app-web`) — fiksan `*.workers.dev` poddomen.
- **Deljeni Firebase projekat:** `firestore.rules` u ovom repou MORA sadržati i
  gym-app-ova pravila (kopirana su, vidi komentar u fajlu) jer
  `firebase deploy --only firestore:rules` prepisuje ceo ruleset projekta. Ako se
  pravila u gym-app/firestore.rules promene, ručno preneti izmenu i ovde (i obrnuto).
- Lista za kupovinu je i dalje per-browser (localStorage), ne per-account.
- OAuth login recepti-mcp Worker-a je jednokorisnički (jedna lozinka, hardkodiran
  `userId`); dovoljno za ličnu upotrebu, nije pravi multi-user auth. Google Sign-In
  na frontend-u je odvojen mehanizam (za same korisnike sajta, ne za Claude/MCP).
  Firebase Auth allowlist trenutno ima samo jedan email — proširi u
  `firestore.rules` ako zatreba pristup drugom nalogu.
  - Nema real-time listener-a za ocene; ocena sa drugog uređaja se vidi tek posle
  refresh-a (kao ni pre).
- `scripts/seed-recipes.json` je zamrznut na stanju od početne migracije — nije
  izvor istine, samo backup. Firestore je izvor istine.
- React bundle je ~835KB (mahom Firebase SDK) — nije optimizovano code-splitting-om,
  isti kompromis kao gym-app; prihvatljivo za ličnu app.
- Par starijih recepata i dalje ima eksterno hotlinkovanu sliku (allrecipes.com,
  wellious.co) umesto R2 URL-a — nije migrirano jer je već radilo, nema razloga da
  se dira dok se ne zameni ta slika iz drugog razloga.
