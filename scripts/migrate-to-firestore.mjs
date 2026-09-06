/* ====================================================================
   Jednokratna migracija: js/data.js -> Firestore kolekcija "recipes".
   Pokreni: node scripts/migrate-to-firestore.mjs
   Traži service account ključ na SECRETS_PATH (podrazumevano ispod).
==================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SECRETS_PATH = process.env.FIREBASE_SERVICE_ACCOUNT
  || path.join(root, 'secrets', 'firebase', 'homeapps-c4df4-firebase-adminsdk-fbsvc-7a4960c667.json');

const serviceAccount = JSON.parse(fs.readFileSync(SECRETS_PATH, 'utf8'));
const seedPath = path.join(root, 'scripts', 'seed-recipes.json');
const recipes = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const batch = db.batch();
recipes.forEach((recipe, index) => {
  const ref = db.collection('recipes').doc(recipe.id);
  batch.set(ref, { ...recipe, order: index });
});

await batch.commit();
console.log(`Migrirano ${recipes.length} recepata u Firestore (kolekcija "recipes").`);
