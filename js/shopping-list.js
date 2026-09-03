/* ====================================================================
   LISTA ZA KUPOVINU — čuva se preko localStorage, deljena između svih
   recepata na istom sajtu/domenu. Ako localStorage nije dostupan
   (npr. privatni/incognito režim u nekim browserima), radi samo u
   memoriji dok je stranica otvorena — ne ruši aplikaciju.

   Napomena: kad je ova app radila kao Claude artifact, koristila je
   window.storage (specifičan API dostupan samo unutar Claude-a, jer
   sandboxed iframe u kom se artifacts renderuju blokira i kolačiće i
   localStorage). Sad kad je ovo pravi sajt na tvom serveru, localStorage
   je ispravan i trajan izbor.
==================================================================== */
const SHOP_KEY = 'shoppingList';
let shoppingListCache = [];
let storageUsable = true;

function loadShoppingList(){
  if (storageUsable){
    try {
      const raw = localStorage.getItem(SHOP_KEY);
      if (raw) shoppingListCache = JSON.parse(raw);
    } catch(e){
      storageUsable = false; // npr. privatni režim u nekim browserima
    }
  }
  updateBadge();
}

function persistShoppingList(){
  if (!storageUsable) return;
  try { localStorage.setItem(SHOP_KEY, JSON.stringify(shoppingListCache)); }
  catch(e){ storageUsable = false; }
}

function getShoppingList(){ return shoppingListCache; }

function isInShoppingList(name){
  return shoppingListCache.some(i => i.name.toLowerCase() === name.toLowerCase());
}
function addToShoppingList(name, amount, recipeTitle){
  if (shoppingListCache.some(i => i.name.toLowerCase() === name.toLowerCase())) return;
  shoppingListCache.push({ id: Date.now() + '-' + Math.random().toString(36).slice(2,7), name, amount, recipe: recipeTitle });
  persistShoppingList();
}
function removeFromShoppingList(id){
  shoppingListCache = shoppingListCache.filter(i => i.id !== id);
  persistShoppingList();
}
function clearShoppingList(){
  shoppingListCache = [];
  persistShoppingList();
}

function updateBadge(){
  const count = getShoppingList().length;
  const badge = document.getElementById('fabBadge');
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);
}

function renderShoppingSheet(){
  const list = getShoppingList();
  const body = document.getElementById('sheetBody');
  const foot = document.getElementById('sheetFoot');
  if (!list.length){
    body.innerHTML = `<div class="empty">Lista je prazna.<br>Dodaj sastojke koji ti nedostaju.</div>`;
    foot.style.display = 'none';
    return;
  }
  const ul = document.createElement('ul');
  ul.className = 'shop-list';
  list.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="shop-name">${item.name}${item.recipe ? `<span class="from">${item.recipe}</span>` : ''}</span>
      <span class="shop-amt">${item.amount || ''}</span>
      <button class="shop-remove" aria-label="Ukloni">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>`;
    li.querySelector('.shop-remove').addEventListener('click', () => {
      removeFromShoppingList(item.id);
      renderShoppingSheet();
      updateBadge();
    });
    ul.appendChild(li);
  });
  body.innerHTML = '';
  body.appendChild(ul);
  foot.style.display = 'block';
}

function openSheet(){
  renderShoppingSheet();
  document.getElementById('overlay').classList.add('open');
  document.getElementById('sheet').classList.add('open');
}
function closeSheet(){
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('sheet').classList.remove('open');
}
