/* ====================================================================
   OCENJIVANJE RECEPATA — 1-5 zvezdica, čuva se u localStorage (isti
   pristup kao lista za kupovinu: per-browser, ne per-account). Default
   je "bez ocene" (0) dok korisnik ne klikne zvezdicu.
==================================================================== */
const RATINGS_KEY = 'recipeRatings';
let ratingsCache = {};
let ratingsStorageUsable = true;

function loadRatings(){
  if (ratingsStorageUsable){
    try {
      const raw = localStorage.getItem(RATINGS_KEY);
      if (raw) ratingsCache = JSON.parse(raw);
    } catch(e){
      ratingsStorageUsable = false; // npr. privatni režim u nekim browserima
    }
  }
}

function persistRatings(){
  if (!ratingsStorageUsable) return;
  try { localStorage.setItem(RATINGS_KEY, JSON.stringify(ratingsCache)); }
  catch(e){ ratingsStorageUsable = false; }
}

function getRating(recipeId){
  return ratingsCache[recipeId] || 0;
}

function setRating(recipeId, value){
  if (value > 0) ratingsCache[recipeId] = value;
  else delete ratingsCache[recipeId];
  persistRatings();
}

const STAR_ICON = '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.4 6.9.7-5.2 4.7 1.5 6.9L12 17.8l-6.1 3.4 1.5-6.9-5.2-4.7 6.9-.7z"/></svg>';

function previewStars(wrap, value){
  wrap.querySelectorAll('.star').forEach(btn => {
    btn.classList.toggle('filled', Number(btn.dataset.value) <= value);
  });
}

function renderRatingWidget(recipeId){
  const wrap = document.getElementById('rating');
  wrap.dataset.recipeId = recipeId;
  const current = getRating(recipeId);
  wrap.innerHTML = '';
  for (let i = 1; i <= 5; i++){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'star' + (i <= current ? ' filled' : '');
    btn.dataset.value = i;
    btn.setAttribute('aria-label', `Oceni sa ${i} od 5 zvezdica`);
    btn.innerHTML = STAR_ICON;
    wrap.appendChild(btn);
  }
}

/* delegirani listeneri — vezuju se jednom, widget se samo popunjava iznova */
(function initRatingWidget(){
  const wrap = document.getElementById('rating');
  if (!wrap) return;
  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.star');
    if (!btn) return;
    const id = wrap.dataset.recipeId;
    const value = Number(btn.dataset.value);
    const newValue = value === getRating(id) ? 0 : value; // klik na istu zvezdicu briše ocenu
    setRating(id, newValue);
    renderRatingWidget(id);
  });
  wrap.addEventListener('mouseover', (e) => {
    const btn = e.target.closest('.star');
    if (btn) previewStars(wrap, Number(btn.dataset.value));
  });
  wrap.addEventListener('mouseleave', () => {
    previewStars(wrap, getRating(wrap.dataset.recipeId));
  });
})();
