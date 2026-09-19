/* ====================================================================
   Klijent za upload.php na korisnikovom serveru — Worker prosleđuje
   slike tamo preko HTTP-a (multipart/form-data), jer taj server nije
   dostupan sa Firestore-a/klijenta direktno. Vidi upload.php i README.md.
==================================================================== */

export async function uploadRecipeImage(env, filename, imageBase64){
  const uploadUrl = env.RECIPES_UPLOAD_URL;
  const token = env.RECIPES_UPLOAD_TOKEN;
  if (!uploadUrl) throw new Error("RECIPES_UPLOAD_URL nije podešen (Worker secret).");
  if (!token) throw new Error("RECIPES_UPLOAD_TOKEN nije podešen (Worker secret).");

  let binary;
  try {
    binary = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
  } catch {
    throw new Error("imageBase64 nije validan base64 string.");
  }

  const form = new FormData();
  form.append("image", new Blob([binary]), filename);

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: { "X-Upload-Token": token },
    body: form,
  });

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = null; }

  if (!res.ok || !data?.ok){
    throw new Error(`Upload slike nije uspeo (${res.status}): ${data?.error || text}`);
  }
  return data; // { ok, filename, path }
}
