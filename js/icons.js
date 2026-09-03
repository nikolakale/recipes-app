/* ====================================================================
   ILUSTRACIJE PO KATEGORIJI (fallback dok nema pravih fotografija)
==================================================================== */
const categoryStyle = {
  "Doručak": { tint: "var(--gold-tint)", color: "var(--gold-deep)" },
  "Užina": { tint: "var(--sage-tint)", color: "var(--sage-deep)" },
  "Dezert": { tint: "var(--rose-tint)", color: "var(--rose-deep)" },
  "Glavni obrok": { tint: "var(--olive-tint)", color: "var(--sage-deep)" },
};

const recipeIcons = {
  "palacinke-banana-jaje-cokolino": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="22" cy="18" rx="13" ry="4"/><ellipse cx="22" cy="25" rx="13" ry="4"/><ellipse cx="22" cy="32" rx="13" ry="4"/>
      <path d="M12 14q4 -6 10 -3" stroke="#6B4A2B" stroke-width="2"/>
      <circle cx="35" cy="13" r="3.2" fill="#E8D9A0" stroke="#C9A227" stroke-width="1.4"/>
      <circle cx="40" cy="18" r="2.6" fill="#E8D9A0" stroke="#C9A227" stroke-width="1.4"/>
    </svg>`,
  "chia-puding-voce-bademi": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 8h16v6l3 4v20a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V18l3-4V8z"/>
      <line x1="13.5" y1="27" x2="34.5" y2="27" stroke-width="1.6" stroke-dasharray="2 3"/>
      <circle cx="20" cy="15" r="2.6" fill="#B4483C" stroke="#8F3A31" stroke-width="1.2"/>
      <circle cx="27" cy="16" r="2.2" fill="#B4483C" stroke="#8F3A31" stroke-width="1.2"/>
      <ellipse cx="33" cy="14" rx="2.6" ry="1.6" fill="#D9C89A" stroke="#B8A276" stroke-width="1.1" transform="rotate(25 33 14)"/>
    </svg>`,
  "proteinski-brownie-solja": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 14h20v18a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5V14z"/>
      <path d="M32 18h4a4 4 0 0 1 0 8h-4"/>
      <path d="M18 8c0 2-2 2-2 4M25 8c0 2-2 2-2 4" stroke-width="1.8"/>
      <rect x="18" y="22" width="8" height="7" rx="1.4" fill="#6B4A2B" stroke="#4E3620" stroke-width="1.1"/>
    </svg>`,
  "no-bake-energy-bites": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="16" cy="28" r="8"/><circle cx="30" cy="30" r="8"/><circle cx="23" cy="17" r="8"/>
      <circle cx="20" cy="16" r="1" fill="#6B4A2B" stroke="none"/><circle cx="26" cy="19" r="1" fill="#6B4A2B" stroke="none"/>
      <circle cx="14" cy="27" r="1" fill="#6B4A2B" stroke="none"/><circle cx="31" cy="29" r="1" fill="#6B4A2B" stroke="none"/>
    </svg>`,
  "bananin-kolac-jaja-jogurt-kakao": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 34l15-21 15 21a3 3 0 0 1-3 4H12a3 3 0 0 1-3-4z"/>
      <path d="M15 34v-9M24 34v-13M33 34v-9"/>
      <path d="M14 15q10 -6 20 0" stroke="#6B4A2B" stroke-width="2"/>
    </svg>`,
  "grcki-jogurt-voce-badem-whey": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 20h30l-2.6 15a4 4 0 0 1-4 3.4H15.6a4 4 0 0 1-4-3.4L9 20z"/>
      <path d="M13 20a11 9 0 0 1 22 0"/>
      <circle cx="18" cy="16" r="2.4" fill="#B4483C" stroke="#8F3A31" stroke-width="1.1"/>
      <circle cx="25" cy="14.5" r="2" fill="#B4483C" stroke="#8F3A31" stroke-width="1.1"/>
      <ellipse cx="31" cy="16" rx="2.4" ry="1.5" fill="#D9C89A" stroke="#B8A276" stroke-width="1" transform="rotate(-20 31 16)"/>
    </svg>`,
  "grcki-jogurt-whey-kikiriki-puter-cokolada-voce": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 20h30l-2.6 15a4 4 0 0 1-4 3.4H15.6a4 4 0 0 1-4-3.4L9 20z"/>
      <path d="M13 20a11 9 0 0 1 22 0"/>
      <path d="M16 22q6 -4 8 0t8 0" stroke="#B8862F" stroke-width="1.8"/>
      <rect x="28" y="14" width="5" height="5" rx="1.2" fill="#6B4A2B" stroke="#4E3620" stroke-width="1"/>
    </svg>`,
  "bananin-kolac-jaja-jogurt-med-voce": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 34l15-21 15 21a3 3 0 0 1-3 4H12a3 3 0 0 1-3-4z"/>
      <path d="M15 34v-9M24 34v-13M33 34v-9"/>
      <circle cx="20" cy="17" r="2.2" fill="#B4483C" stroke="#8F3A31" stroke-width="1"/>
      <circle cx="27" cy="15.5" r="1.8" fill="#B4483C" stroke="#8F3A31" stroke-width="1"/>
    </svg>`,
  "proteinske-palacinke-whey-jaja-jogurt": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="24" cy="18" rx="13" ry="4"/><ellipse cx="24" cy="25" rx="13" ry="4"/><ellipse cx="24" cy="32" rx="13" ry="4"/>
      <rect x="21" y="10" width="6" height="4" rx="1" fill="#F3E7B8" stroke="#C9A227" stroke-width="1"/>
    </svg>`,
  "curetina-cimicuri-batat-senf-salata": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="24" cy="24" r="13"/>
      <path d="M8 14v10M8 14a2 2 0 0 1 4 0v10M40 14v20"/>
      <rect x="19" y="20" width="6" height="6" rx="1.3" fill="#D98B3E" stroke="#B06B24" stroke-width="1"/>
      <path d="M28 22c2-3 5-3 6-1-2 1-4 3-6 4z" fill="#6E8B4E" stroke="#4C6636" stroke-width="1"/>
    </svg>`,
  "cottage-sir-whey-kikiriki-puter": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 18h22l-2 18a3 3 0 0 1-3 2.6H18a3 3 0 0 1-3-2.6L13 18z"/>
      <ellipse cx="24" cy="18" rx="11" ry="3"/>
      <path d="M31 10l4 4-9 9-2-2z" stroke-width="1.8"/>
      <path d="M18 24q6 -3 8 0t8 0" stroke="#B8862F" stroke-width="1.6"/>
    </svg>`,
  "grcki-jogurt-whey-cokolada-maline-plazma": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 20h30l-2.6 15a4 4 0 0 1-4 3.4H15.6a4 4 0 0 1-4-3.4L9 20z"/>
      <path d="M13 20a11 9 0 0 1 22 0"/>
      <circle cx="17" cy="15" r="2.4" fill="#B4483C" stroke="#8F3A31" stroke-width="1.1"/>
      <circle cx="23" cy="13.5" r="2.1" fill="#B4483C" stroke="#8F3A31" stroke-width="1.1"/>
      <circle cx="29" cy="15.5" r="2.3" fill="#B4483C" stroke="#8F3A31" stroke-width="1.1"/>
      <rect x="18" y="19" width="5" height="3" rx="1" fill="#C9A96B" stroke="#A6874A" stroke-width="0.9" transform="rotate(12 18 19)"/>
    </svg>`,
};

function recipeIcon(r){
  return recipeIcons[r.id] || categoryIcon(r.category);
}

/* Prikazuje pravu fotografiju (recipe.image) ako postoji, uz siguran pad
   nazad na ilustraciju ako slika ne postoji ili se ne učita. */
function visualHTML(recipe, sizePercent){
  if (recipe.image){
    return `<img src="${recipe.image}" alt="${recipe.title}" data-fallback-id="${recipe.id}" data-size="${sizePercent}"
      style="width:100%;height:100%;object-fit:cover;display:block;" onerror="window.__iconFallback(this)">`;
  }
  return recipeIcon(recipe).replace('<svg ', `<svg style="width:${sizePercent};height:${sizePercent};" `);
}
window.__iconFallback = function(img){
  const r = recipes.find(x => x.id === img.dataset.fallbackId);
  const parent = img.parentElement;
  if (!parent || !r) return;
  parent.innerHTML = recipeIcon(r).replace('<svg ', `<svg style="width:${img.dataset.size || '60%'};height:${img.dataset.size || '60%'};" `);
};
function categoryIcon(cat){
  switch(cat){
    case "Doručak":
      return `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
        <ellipse cx="24" cy="18" rx="13" ry="4.4"/>
        <ellipse cx="24" cy="25" rx="13" ry="4.4"/>
        <ellipse cx="24" cy="32" rx="13" ry="4.4"/>
        <path d="M31 12c2 2 3 4 2 7" stroke-linecap="round"/>
      </svg>`;
    case "Užina":
      return `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 20h28l-2.5 15a4 4 0 0 1-4 3.4h-15a4 4 0 0 1-4-3.4L10 20z"/>
        <path d="M14 20a10 8 0 0 1 20 0"/>
        <circle cx="20" cy="16" r="1.6" fill="currentColor" stroke="none"/>
        <circle cx="27" cy="15" r="1.6" fill="currentColor" stroke="none"/>
      </svg>`;
    case "Dezert":
      return `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 34l14-20 14 20a3 3 0 0 1-3 4H13a3 3 0 0 1-3-4z"/>
        <path d="M17 34v-9M24 34v-12M31 34v-9"/>
        <circle cx="24" cy="10" r="2.4" fill="currentColor" stroke="none"/>
      </svg>`;
    default: // Glavni obrok
      return `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="24" cy="24" r="13"/>
        <circle cx="24" cy="24" r="6.5"/>
        <path d="M8 14v10M8 14a2 2 0 0 1 4 0v10M40 14v20"/>
      </svg>`;
  }
}

