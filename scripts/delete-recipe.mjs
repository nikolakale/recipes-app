/* ====================================================================
   Briše jedan recept iz Firestore-a po id-ju.
   Pokreni: node scripts/delete-recipe.mjs id-recepta
==================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const id = process.argv[2];
if (!id){
  console.error('Upotreba: node scripts/delete-recipe.mjs id-recepta');
  process.exit(1);
}

const SECRETS_PATH = process.env.FIREBASE_SERVICE_ACCOUNT
  || path.join(root, 'secrets', 'firebase', 'homeapps-c4df4-firebase-adminsdk-fbsvc-7a4960c667.json');

const serviceAccount = JSON.parse(fs.readFileSync(SECRETS_PATH, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const ref = db.collection('recipes').doc(id);
const doc = await ref.get();
if (!doc.exists){
  console.error(`Recept "${id}" ne postoji.`);
  process.exit(1);
}
await ref.delete();
console.log(`Obrisan recept "${id}" (${doc.data().title}).`);
