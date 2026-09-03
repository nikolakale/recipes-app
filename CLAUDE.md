# Moji recepti — kontekst projekta

Lična kolekcija recepata (zdravi, high-protein obroci). Mala vanilla JS SPA,
bez build koraka, bez frameworka — otvoriš `index.html` i radi.

## Struktura

```
index.html          — skelet stranice, referencira css/js fajlove
css/styles.css       — sav stil (jedan fajl)
js/data.js           — CATEGORIES + recipes[] (svi podaci o receptima)
js/icons.js          — kategorijske i po-receptu ilustracije (SVG) + visualHTML()
                        helper koji prikazuje pravu fotografiju ako postoji,
                        inače pada nazad na ilustraciju
js/shopping-list.js  — lista za kupovinu, čuva se u localStorage
js/app.js            — render funkcije (lista, detalji), navigacija, init
```

## Konvencije

- **Jezik:** sav sadržaj (UI tekst, nazivi recepata, komentari u kodu) je na srpskom.
- **Dodavanje novog recepta:** kopiraj jedan objekat iz `recipes` niza u `js/data.js`,
  izmeni polja, dodaj na kraj niza. Format prati markdown template koji koristim za
  recepte: naslov → opis → porcije → sastojci (u gramima) → koraci pripreme →
  napomene → tabela kalorija/proteina (po sastojku + total red).
- **`nutrition.hasProtein`** — neki stariji recepti nemaju podatak o proteinima
  (samo kalorije). Tabela u `app.js` automatski sakriva kolonu proteina kad je
  `hasProtein: false`.
- **`nutrition.totals`** — niz, ne pojedinačan objekat, jer neki recepti imaju
  i "Ukupno (X porcija)" i "Po porciji" red. Onaj sa `perServing: true` se koristi
  za prikaz na listi i u meta statistikama detalja.
- **Slike:** `recipe.image` je `null` dok nema prave fotografije — tad se koristi
  SVG ilustracija iz `js/icons.js` (`recipeIcons[recipe.id]`). Kad dodaš pravu
  fotografiju, samo upiši putanju (npr. `"img/recepti/naziv.jpg"`) i ona će se
  automatski prikazati, sa fallback-om nazad na ilustraciju ako se ne učita.
- **Nova ilustracija:** dodaj SVG string u `recipeIcons` objekat u `js/icons.js`
  pod istim `id` kao recept, viewBox `0 0 48 48`, stroke="currentColor" za linije
  (boja prati kategoriju), fiksne hex boje za akcente (bobice, čokolada, badem...).

## Dizajn sistem (već definisan u `css/styles.css`)

- Paleta: `--paper` (pozadina), `--card` (bela kartica), `--ink`/`--ink-soft` (tekst),
  `--gold`/`--sage`/`--rose` + tint varijante (akcentne boje po kategoriji).
- Tipografija: serif (`Iowan Old Style`/Georgia) za naslove i opise, sans-serif
  za UI tekst, monospace za brojeve (kalorije, proteini, količine).
- Estetika: topla "kartoteka recepata" — zaobljene kartice, fine linije, bez
  generičkih SaaS gradijenata.

## Poznata ograničenja / TODO

- Nema build/bundler koraka namerno — lako je otvoriti i menjati direktno.
  Ako projekat preraste u nešto veće (routing, komponente), razmisliti o Vite-u.
- Lista za kupovinu je per-browser (localStorage), ne per-account. Ako zatreba
  sinhronizacija između uređaja, treba pravi backend.
- Nema još prave fotografije nijednog jela — sve su ilustracije.
