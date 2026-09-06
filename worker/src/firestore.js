/* ====================================================================
   Minimalni Firestore REST klijent za Cloudflare Worker (bez Node SDK-a).
   Autentifikacija: service account JWT potpisan Web Crypto-jem, razmenjen
   za OAuth2 access token (isti flow kao firebase-admin, ručno urađen
   jer Workers runtime nema pristup Node-ovim kripto/fs modulima).
==================================================================== */

let cachedToken = null; // { token, expiresAt } — po Worker izolatu, best effort

function base64url(bytes){
  const bin = typeof bytes === 'string' ? bytes : String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getAccessToken(env){
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 30) return cachedToken.token;

  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = {
    iss: env.FIREBASE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;

  const pem = env.FIREBASE_PRIVATE_KEY
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  const keyBytes = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', keyBytes.buffer, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(signingInput)
  );
  const jwt = `${signingInput}.${base64url(signature)}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Google token exchange nije uspeo: ${JSON.stringify(data)}`);

  cachedToken = { token: data.access_token, expiresAt: now + data.expires_in };
  return cachedToken.token;
}

/* ---- konverzija JS <-> Firestore REST tipizovani format ---- */
function encodeValue(v){
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'string') return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(encodeValue) } };
  if (typeof v === 'object') return { mapValue: { fields: encodeFields(v) } };
  throw new Error(`Nepodržan tip vrednosti: ${typeof v}`);
}
function encodeFields(obj){
  const fields = {};
  for (const [k, v] of Object.entries(obj)) fields[k] = encodeValue(v);
  return fields;
}
function decodeValue(v){
  if (!v || 'nullValue' in v) return null;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return parseInt(v.integerValue, 10);
  if ('doubleValue' in v) return v.doubleValue;
  if ('stringValue' in v) return v.stringValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(decodeValue);
  if ('mapValue' in v) return decodeFields(v.mapValue.fields || {});
  return null;
}
function decodeFields(fields){
  const obj = {};
  for (const [k, v] of Object.entries(fields || {})) obj[k] = decodeValue(v);
  return obj;
}

function baseUrl(env){
  return `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;
}
function docIdFromName(name){
  return name.split('/').pop();
}

async function fsFetch(env, path, init){
  const token = await getAccessToken(env);
  const res = await fetch(`${baseUrl(env)}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(init && init.headers) },
  });
  if (!res.ok){
    const text = await res.text();
    throw new Error(`Firestore ${init?.method || 'GET'} ${path} -> ${res.status}: ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

export async function listRecipes(env){
  const data = await fsFetch(env, '/recipes?pageSize=300');
  const docs = data.documents || [];
  const recipes = docs.map(d => ({ id: docIdFromName(d.name), ...decodeFields(d.fields) }));
  recipes.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return recipes;
}

export async function getRecipe(env, id){
  try {
    const doc = await fsFetch(env, `/recipes/${encodeURIComponent(id)}`);
    return { id: docIdFromName(doc.name), ...decodeFields(doc.fields) };
  } catch (e){
    if (String(e.message).includes('404')) return null;
    throw e;
  }
}

export async function saveRecipe(env, id, data){
  await fsFetch(env, `/recipes/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields: encodeFields(data) }),
  });
}

export async function deleteRecipe(env, id){
  await fsFetch(env, `/recipes/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
