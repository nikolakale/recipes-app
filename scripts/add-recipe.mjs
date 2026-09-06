/* ====================================================================
   Dodaje (ili ažurira, ako id već postoji) jedan recept u Firestore.
   Pokreni: node scripts/add-recipe.mjs putanja/do/recepta.json

   JSON fajl treba da prati isti oblik kao stari objekti iz js/data.js:
   { id, image, category, title, description, servings,
     ingredientGroups, steps, notes, nutrition, source }
==================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const recipeFile = process.argv[2];
if (!recipeFile){
  console.error('Upotreba: node scripts/add-recipe.mjs putanja/do/recepta.json');
  process.exit(1);
}

const SECRETS_PATH = process.env.FIREBASE_SERVICE_ACCOUNT
  || path.join(root, 'secrets', 'firebase', 'homeapps-c4df4-firebase-adminsdk-fbsvc-7a4960c667.json');

const serviceAccount = JSON.parse(fs.readFileSync(SECRETS_PATH, 'utf8'));
const recipe = JSON.parse(fs.readFileSync(path.resolve(recipeFile), 'utf8'));

if (!recipe.id) { console.error('Recept mora imati "id" polje.'); process.exit(1); }

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const ref = db.collection('recipes').doc(recipe.id);
const existingDoc = await ref.get();

let order;
if (existingDoc.exists){
  order = existingDoc.data().order;
} else {
  const last = await db.collection('recipes').orderBy('order', 'desc').limit(1).get();
  order = last.empty ? 0 : last.docs[0].data().order + 1;
}

await ref.set({ ...recipe, order });

console.log(existingDoc.exists
  ? `Ažuriran recept "${recipe.id}".`
  : `Dodat novi recept "${recipe.id}" (order: ${order}).`);
