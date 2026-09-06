# Moji recepti — kontekst projekta

Lična kolekcija recepata (zdravi, high-protein obroci).

- **Frontend:** mala vanilla JS SPA, bez build koraka, bez frameworka. Hostuje se
  kao statički sajt na korisnikovom serveru (ranije je bila Claude artifact).
- **Podaci:** recepti žive u **Firestore-u** (Firebase projekat `homeapps-c4df4`),
  kolekcija `recipes`, jedan dokument po receptu (`id` = slug = ID dokumenta).
  Web app ih samo čita; pisanje ide preko Claude-a.

## Arhitektura

```
   PISANJE (dodaj / izmeni / obriši recept)
   ─────────────────────────────────────────

   Claude na desktopu              Claude na mobilnom / claude.ai
   (Claude Code)                   (MCP konektor "Moji recepti")
        │                                     │
        │ node scripts/*.mjs                  │ MCP alati: list_recipes,
        │ (firebase-admin,                    │ get_recipe, save_recipe,
        │  service account ključ)             │ delete_recipe
        │                                     ▼
        │                        ┌─────────────────────────────────┐
        │                        │  Cloudflare Worker              │
        │                        │  recepti-mcp.…workers.dev/mcp   │
        │                        │  - OAuth 2.1 (login lozinka)    │
        │                        │  - Firestore REST + JWT potpis  │
        │                        └────────────────┬────────────────┘
        │                                         │
        └──────────────────┐   ┌──────────────────┘
                           ▼   ▼
              ┌───────────────────────────────────────┐
              │  Firebase / Firestore                 │
              │  projekat homeapps-c4df4              │
              │  kolekcija "recipes"                  │
              │  rules: čitanje svima, pisanje samo   │
              │         Admin SDK / Worker            │
              └──────────────────┬────────────────────┘
                                 │  čitanje uživo (Firebase JS SDK)
                                 ▼
              ┌───────────────────────────────────────┐
              │  FE app — statički sajt (korisnikov   │
              │  server). index.html + js/ + css/     │
              │  js/firebase-data.js → window.recipes │
              │  → initApp().  SAMO PRIKAZ, ne piše.  │
              └───────────────────────────────────────┘

   ČITANJE ide samo u jednom smeru: Firestore → FE app.
   FE app nema kredencijale za pisanje i ne zna za Worker.
```

## Struktura

```
index.html            — skelet stranice, referencira css/js fajlove
css/styles.css         — sav stil (jedan fajl), responsive (mobilni → 3-kolonski desktop)
js/data.js             — SAMO `CATEGORIES` niz (recepti više nisu ovde)
js/firebase-data.js    — (ES modul) učita recepte iz Firestore-a, napuni globalni
                          `window.recipes`, pa pozove `initApp()` iz app.js
js/icons.js            — kategorijske i po-receptu ilustracije (SVG) + visualHTML()
                          helper koji prikazuje pravu fotografiju ako postoji,
                          inače pada nazad na ilustraciju
js/shopping-list.js    — lista za kupovinu, čuva se u localStorage (per-browser)
js/app.js              — render funkcije (lista, detalji), hash-ruter, init
                          (initApp() se poziva tek kad recepti stignu iz Firestore-a)
img/                   — prave fotografije jela (.jpg/.webp)

firebase.json          — konfiguracija za `firebase-tools` (samo Firestore rules)
.firebaserc            — vezuje folder za projekat homeapps-c4df4
firestore.rules        — javno čitanje `recipes`, nikakvo pisanje preko klijenta

scripts/               — admin alati (Node, koriste firebase-admin + service account)
  migrate-to-firestore.mjs   — jednokratna migracija starog data.js → Firestore
  add-recipe.mjs             — doda/zameni recept iz JSON fajla
  delete-recipe.mjs          — obriše recept po id-ju
  deploy-firestore-rules.mjs — (rezerva; obično koristi firebase-tools CLI)
  seed-recipes.json          — zamrznut snapshot 12 recepata iz početne migracije

worker/                — Cloudflare Worker: MCP server za pisanje u bazu
  src/index.js         — OAuth 2.1 provider (workers-oauth-provider) + login stranica
  src/mcp-server.js    — definicije MCP alata (list/get/save/delete recipe)
  src/firestore.js     — Firestore REST klijent (JWT potpis preko Web Crypto)

secrets/               — NIKAD u git (u .gitignore). Sadrži:
  firebase/…-adminsdk-….json — service account ključ
  cloudflare-api-token.txt   — CF token za `wrangler deploy`
  oauth-passphrase.txt       — lozinka za login stranicu Worker-a
  cloudflare-mcp-token.txt   — (stari statični bearer, više se ne koristi)
```

## Kako se dodaju / menjaju recepti

Recepti se **ne edituju u kodu** — upisuju se u Firestore. Dva puta, oba idu preko Claude-a:

1. **Desktop (Claude Code):** `node scripts/add-recipe.mjs putanja/do/recepta.json`
   (i `delete-recipe.mjs <id>`). Koristi service account iz `secrets/`.
2. **Bilo koji uređaj (uklj. mobilni Claude):** MCP konektor **"Moji recepti"** u
   claude.ai podešavanjima → alati `list_recipes`, `get_recipe`, `save_recipe`,
   `delete_recipe`. Iza njega je Cloudflare Worker
   `https://recepti-mcp.nikolakale-recepti.workers.dev/mcp`.

Oblik objekta recepta (isti kao stari format iz data.js):
naslov → opis → porcije → sastojci → koraci → napomene → tabela kalorija/proteina.
Polja: `id, image, category, title, description, servings, ingredientGroups[],
steps[], notes[]?, nutrition{hasProtein, rows[], totals[]}, source?`.
`order` (int) se dodaje automatski i drži redosled na listi — ne diraj ga ručno.

- **`nutrition.hasProtein: false`** — tabela u `app.js` sakriva kolonu proteina.
- **`nutrition.totals`** — niz; red sa `perServing: true` se koristi za listu i meta
  statistike (neki recepti imaju i "Ukupno (X porcija)" i "Po porciji" red).
- **`category`** — tačno jedna od `CATEGORIES` iz `js/data.js`
  (Doručak, Užina, Dezert, Glavni obrok).
- **Slike:** `recipe.image` je putanja (npr. `"./img/naziv.jpg"`) ili `null`.
  Kad je `null` koristi se SVG ilustracija iz `js/icons.js` (`recipeIcons[id]`),
  a ako ni nje nema — generička ilustracija kategorije. Fotografije stoje u `img/`.
- **Nova ilustracija:** SVG string u `recipeIcons` u `js/icons.js` pod istim `id`,
  viewBox `0 0 48 48`, `stroke="currentColor"` za linije (boja prati kategoriju),
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
6. Posle autorizacije vidljiva su 4 alata. Grant se čuva u `OAUTH_KV`.

### Prva postavka od nule (disaster recovery)

**Firebase:** napravi projekat, uključi Firestore (Native mode). Web app config
(`apiKey`, `projectId`…) ide u `js/firebase-data.js`. Generiši service account
ključ (Project settings → Service accounts) → snimi u `secrets/firebase/`.
Onda: `node scripts/migrate-to-firestore.mjs` (puni bazu iz `seed-recipes.json`),
pa `npx firebase-tools deploy --only firestore:rules` (traži `firebase login`).

**Cloudflare:** napravi nalog + API token (template "Edit Cloudflare Workers") →
`secrets/cloudflare-api-token.txt`. Registruj `workers.dev` poddomen
(dashboard, ili `PUT /accounts/{id}/workers/subdomain` preko API-ja). Zatim iz
`worker/`: `npx wrangler kv namespace create OAUTH_KV` (ID u `wrangler.jsonc`),
postavi 4 secret-a (vidi dole), `npx wrangler deploy`. Generiši `AUTH_PASSPHRASE`
i snimi u `secrets/oauth-passphrase.txt`.

## Redeploy / operacije

Sve komande iz `worker/` foldera, sa CF tokenom iz env-a:

```
cd worker
export CLOUDFLARE_API_TOKEN=$(cat ../secrets/cloudflare-api-token.txt)
npx wrangler deploy                       # redeploy Worker-a
npx wrangler secret put <IME>             # izmena secret-a (čita vrednost sa stdin)
```

Worker secrets: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
(sve iz service account JSON-a), `AUTH_PASSPHRASE` (login lozinka).
KV namespace `OAUTH_KV` (`9024c53faae646b3adcad9df1df9bfa4`) čuva OAuth grantove.

Firestore rules (iz root foldera, sa `firebase login` autorizacijom korisnika):
```
npx firebase-tools deploy --only firestore:rules --project homeapps-c4df4
```

## Dizajn sistem (u `css/styles.css`)

- Paleta: `--paper` (pozadina), `--card` (bela kartica), `--ink`/`--ink-soft` (tekst),
  `--gold`/`--sage`/`--rose` + tint varijante (akcentne boje po kategoriji).
- Tipografija: serif (`Iowan Old Style`/Georgia) za naslove i opise, sans-serif
  za UI tekst, monospace za brojeve (kalorije, proteini, količine).
- Estetika: topla "kartoteka recepata" — zaobljene kartice, fine linije, bez
  generičkih SaaS gradijenata.
- Lista: kartice sa slikom gore i tekstom ispod; grid 2 kolone (mobilni) →
  3 kolone (≥700px). Detalj na desktopu (≥1000px): ilustracija + statistika +
  tabela kalorija u levoj koloni (sticky), sastojci/priprema desno.
- Jezik: sav sadržaj (UI, nazivi, komentari) je na srpskom.

## Poznata ograničenja / TODO

- Web app i dalje nema build korak (namerno). `scripts/` i `worker/` koriste npm.
- Lista za kupovinu je per-browser (localStorage), ne per-account.
- OAuth login Worker-a je jednokorisnički (jedna lozinka, hardkodiran `userId`);
  dovoljno za ličnu upotrebu, nije pravi multi-user auth.
- `scripts/seed-recipes.json` je zamrznut na stanju od početne migracije — nije
  izvor istine, samo backup. Firestore je izvor istine.
