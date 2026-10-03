# Moji recepti

Lična kolekcija zdravih, high-protein recepata — React (Vite) + PWA frontend,
Cloudflare Worker/MCP backend, Firestore baza (isti Firebase projekat kao
`gym-app`). Prijava preko Google naloga (allowlist), isti pattern kao `gym-app`.

## Pokretanje lokalno

```bash
cd web
npm install
npm run dev
```

Frontend čita recepte uživo iz Firestore-a (`homeapps-c4df4`) — ne treba
lokalni backend za samo prikazivanje, samo prijava sa dozvoljenim Google
nalogom.

## Struktura

Vidi `CLAUDE.md` za pun opis arhitekture, modela podataka i konvencija — to
je fajl koji Claude Code čita automatski za kontekst projekta.

## Deploy

- **Frontend:** Cloudflare Worker sa static assets (`recepti-app-web`), iz
  `web/`: `npm run build && npx wrangler deploy`. Automatski preko GitHub
  Actions na push u `master` (vidi `.github/workflows/deploy-web.yml`).
- **Backend (MCP server):** Cloudflare Worker iz `worker/` (`npx wrangler
  deploy`). Automatski preko `.github/workflows/deploy-worker.yml`.

Detaljni koraci prve postavke (Firebase, Cloudflare, secrets) su u
`CLAUDE.md` → "Podešavanje".
