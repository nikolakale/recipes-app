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
