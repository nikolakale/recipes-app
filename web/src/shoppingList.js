/* ====================================================================
   LISTA ZA KUPOVINU — čuva se preko localStorage, per-browser (ne
   per-account — vidi CLAUDE.md "Poznata ograničenja"). Ako localStorage
   nije dostupan (npr. privatni režim), samo se ne perzistira između
   poseta, ne ruši aplikaciju.
==================================================================== */
const SHOP_KEY = 'shoppingList';

export function loadShoppingList(){
  try {
    const raw = localStorage.getItem(SHOP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function persistShoppingList(list){
  try { localStorage.setItem(SHOP_KEY, JSON.stringify(list)); }
  catch { /* privatni režim ili localStorage isključen — radi samo u memoriji */ }
}
