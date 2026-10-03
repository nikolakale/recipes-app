/* ====================================================================
   Upload slika u Cloudflare R2 (bucket binding RECIPES_IMAGES). Zamenilo
   je stariji put preko upload.php na korisnikovom NAS-u (Tailscale Funnel)
   — vidi CLAUDE.md "Upload slika" i git istoriju za taj raniji pristup.
==================================================================== */

function sanitizeFilename(filename){
  const base = (filename || "recept").split(/[\\/]/).pop();
  const dot = base.lastIndexOf(".");
  const name = (dot > 0 ? base.slice(0, dot) : base)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "recept";
  const ext = dot > 0 ? base.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  return { name, ext };
}

const MAGIC_BYTES_TO_EXT = [
  { bytes: [0xff, 0xd8, 0xff], ext: "jpg" },
  { bytes: [0x89, 0x50, 0x4e, 0x47], ext: "png" },
  { bytes: [0x47, 0x49, 0x46, 0x38], ext: "gif" },
  // WEBP: "RIFF"....'WEBP' — proveravamo prva 4 bajta, WEBP marker je na offsetu 8
];

function detectExtAndType(bytes){
  for (const { bytes: sig, ext } of MAGIC_BYTES_TO_EXT){
    if (sig.every((b, i) => bytes[i] === b)) return { ext, contentType: `image/${ext === "jpg" ? "jpeg" : ext}` };
  }
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46
      && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50){
    return { ext: "webp", contentType: "image/webp" };
  }
  return null;
}

export async function uploadRecipeImage(env, filename, imageBase64){
  if (!env.RECIPES_IMAGES) throw new Error("RECIPES_IMAGES (R2 bucket binding) nije podešen.");
  if (!env.RECIPES_IMAGES_PUBLIC_URL) throw new Error("RECIPES_IMAGES_PUBLIC_URL nije podešen (Worker var/secret).");

  let bytes;
  try {
    bytes = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
  } catch {
    throw new Error("imageBase64 nije validan base64 string.");
  }
  if (bytes.length === 0 || bytes.length > 8 * 1024 * 1024){
    throw new Error("Slika je prazna ili prevelika (max 8 MB).");
  }

  const detected = detectExtAndType(bytes);
  if (!detected) throw new Error("Fajl nije prepoznat kao slika (podržano: JPG, PNG, WEBP, GIF).");

  const { name } = sanitizeFilename(filename);
  const key = `${name}-${Date.now().toString(36)}.${detected.ext}`;

  await env.RECIPES_IMAGES.put(key, bytes, {
    httpMetadata: { contentType: detected.contentType },
  });

  const base = env.RECIPES_IMAGES_PUBLIC_URL.replace(/\/+$/, "");
  return { ok: true, filename: key, path: `${base}/${key}` };
}
