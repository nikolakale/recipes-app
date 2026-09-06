/* ====================================================================
   Deploy-uje firestore.rules preko Firebase Rules REST API,
   koristeći service account (bez potrebe za `firebase login`).
   Pokreni: node scripts/deploy-firestore-rules.mjs
==================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleAuth } from 'google-auth-library';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SECRETS_PATH = process.env.FIREBASE_SERVICE_ACCOUNT
  || path.join(root, 'secrets', 'firebase', 'homeapps-c4df4-firebase-adminsdk-fbsvc-7a4960c667.json');

const serviceAccount = JSON.parse(fs.readFileSync(SECRETS_PATH, 'utf8'));
const projectId = serviceAccount.project_id;
const rulesContent = fs.readFileSync(path.join(root, 'firestore.rules'), 'utf8');

const auth = new GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});
const client = await auth.getClient();
const { token } = await client.getAccessToken();

async function api(method, url, body){
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

const base = 'https://firebaserules.googleapis.com/v1';

// 1) napravi novi ruleset
const ruleset = await api('POST', `${base}/projects/${projectId}/rulesets`, {
  source: { files: [{ name: 'firestore.rules', content: rulesContent }] },
});
console.log('Ruleset kreiran:', ruleset.name);

// 2) objavi ga kao aktivan release za Firestore (default baza)
const releaseName = `projects/${projectId}/releases/cloud.firestore`;
try {
  await api('POST', `${base}/projects/${projectId}/releases`, {
    name: releaseName,
    rulesetName: ruleset.name,
  });
  console.log('Release kreiran:', releaseName);
} catch (e) {
  if (String(e.message).includes('ALREADY_EXISTS') || String(e.message).includes('409')) {
    await api('PATCH', `${base}/${releaseName}`, { release: { name: releaseName, rulesetName: ruleset.name } });
    console.log('Release ažuriran:', releaseName);
  } else {
    throw e;
  }
}

console.log('Firestore security rules su aktivne.');
