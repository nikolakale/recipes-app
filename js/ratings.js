/* ====================================================================
   OCENJIVANJE RECEPATA — 1-5 zvezdica. Čuva se u Firestore-u (kolekcija
   `ratings`, jedan dokument po receptu) da bi ocena bila ista na svim
   uređajima. Web app piše direktno preko `window.rateRecipe()` iz
   js/firebase-data.js — vidi napomenu uz firestore.rules. `ratingsCache`
   je samo lokalna kopija za brz prikaz, popuni se iz `window.ratings`
   kad recepti i ocene stignu iz Firestore-a. Default je "bez ocene" (0).
==================================================================== */
let ratingsCache = {};

function loadRatings(){
  ratingsCache = Object.assign({}, window.ratings);
}

function getRating(recipeId){
  return ratingsCache[recipeId] || 0;
}

function setRating(recipeId, value){
  ratingsCache[recipeId] = value; // optimistički prikaz, ne čekamo mrežu
  if (!value) delete ratingsCache[recipeId];
  window.rateRecipe(recipeId, value)
    .catch(e => console.error('Čuvanje ocene nije uspelo:', e));
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
