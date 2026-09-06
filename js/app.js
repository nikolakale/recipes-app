/* ====================================================================
   HELPERI
==================================================================== */
function getPerServingTotal(recipe){
  return recipe.nutrition.totals.find(t => t.perServing) || recipe.nutrition.totals[recipe.nutrition.totals.length - 1];
}

/* ====================================================================
   LIST VIEW
==================================================================== */
let activeCategory = "Sve";

function renderFilters(){
  const wrap = document.getElementById('filters');
  wrap.innerHTML = '';
  const cats = ["Sve", ...CATEGORIES];
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (cat === activeCategory ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => { activeCategory = cat; renderFilters(); renderList(); });
    wrap.appendChild(btn);
  });
}

function renderList(){
  const listEl = document.getElementById('list');
  const filtered = activeCategory === "Sve" ? recipes : recipes.filter(r => r.category === activeCategory);
  document.getElementById('listCount').textContent = filtered.length + (filtered.length === 1 ? ' recept' : ' recepata');

  listEl.innerHTML = '';
  if (!filtered.length){
    listEl.innerHTML = `<div class="empty-list">Nema recepata u ovoj kategoriji.</div>`;
    return;
  }

  filtered.forEach(r => {
    const style = categoryStyle[r.category] || categoryStyle["Užina"];
    const total = getPerServingTotal(r);
    const btn = document.createElement('button');
    btn.className = 'row-card';
    btn.innerHTML = `
      <span class="thumb" style="background:${style.tint}; color:${style.color};">${visualHTML(r, '62%')}</span>
      <span class="row-content">
        <span class="row-title">${r.title}</span>
        <span class="row-meta">
          <span class="cat">${r.category}</span>
          <span class="dot">·</span>
          <span class="stats">${total.kcal} kcal${r.nutrition.hasProtein ? ' · ' + total.protein : ''}</span>
        </span>
      </span>`;
    btn.addEventListener('click', () => {
      try { navigateToDetail(r.id); }
      catch(e){ console.error('Otvaranje recepta nije uspelo:', e); }
    });
    listEl.appendChild(btn);
  });
}

/* ====================================================================
   DETAIL VIEW
==================================================================== */
function renderDetail(r){
  const style = categoryStyle[r.category] || categoryStyle["Užina"];
  const hero = document.getElementById('hero');
  hero.style.background = style.tint;
  hero.style.color = style.color;
  document.getElementById('heroVisual').innerHTML = visualHTML(r, '56%');

  document.getElementById('tab').textContent = r.category;
  document.getElementById('title').textContent = r.title;
  document.getElementById('desc').textContent = r.description;

  const saveBtn = document.getElementById('saveBtn');
  saveBtn.classList.remove('saved');
  saveBtn.onclick = function(){ this.classList.toggle('saved'); };

  const meta = document.getElementById('meta');
  meta.innerHTML = '';
  const total = getPerServingTotal(r);
  meta.appendChild(stat(r.servings, 'Porcije'));
  meta.appendChild(stat(total.kcal, 'Kcal'));
  if (r.nutrition.hasProtein) meta.appendChild(stat(total.protein, 'Proteini'));
  // kopija za levu kolonu na desktopu (CSS bira koja se vidi)
  const metaSide = document.getElementById('metaSide');
  if (metaSide) metaSide.innerHTML = meta.innerHTML;

  const ingWrap = document.getElementById('ingredients');
  ingWrap.innerHTML = '';
  r.ingredientGroups.forEach(group => {
    if (group.name){
      const h = document.createElement('h4');
      h.className = 'group';
      h.textContent = group.name;
      ingWrap.appendChild(h);
    }
    const ul = document.createElement('ul');
    ul.className = 'ingredients';
    group.items.forEach(item => {
      const li = document.createElement('li');
      const alreadyAdded = isInShoppingList(item.name);
      li.innerHTML = `
        <span class="box"></span>
        <span class="ing-name">${item.name}</span>
        <span class="ing-amt">${item.amount}</span>
        <button class="ing-add ${alreadyAdded ? 'added' : ''}" aria-label="Dodaj na listu za kupovinu" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            ${alreadyAdded ? '<path d="M5 12l5 5L19 7"/>' : '<path d="M12 5v14M5 12h14"/>'}
          </svg>
        </button>`;
      const box = li.querySelector('.box');
      const nameEl = li.querySelector('.ing-name');
      [box, nameEl].forEach(el => el.addEventListener('click', () => li.classList.toggle('done')));
      const addBtn = li.querySelector('.ing-add');
      addBtn.addEventListener('click', () => {
        if (addBtn.classList.contains('added')) return;
        addToShoppingList(item.name, item.amount, r.title);
        addBtn.classList.add('added');
        addBtn.querySelector('svg').innerHTML = '<path d="M5 12l5 5L19 7"/>';
        updateBadge();
      });
      ul.appendChild(li);
    });
    ingWrap.appendChild(ul);
  });

  const stepsWrap = document.getElementById('steps');
  stepsWrap.innerHTML = '';
  r.steps.forEach((step, i) => {
    const li = document.createElement('li');
    const timerHtml = step.timer ? `<span class="timer">${step.timer}</span>` : '';
    li.innerHTML = `
      <span class="num">${i + 1}</span>
      <div class="step-body">
        <span class="step-title">${step.title}</span>
        <div class="step-text">${step.text}</div>
        ${timerHtml}
      </div>`;
    stepsWrap.appendChild(li);
  });

  const notesWrap = document.getElementById('notes');
  if (r.notes && r.notes.length){
    notesWrap.innerHTML = r.notes.map(n => `<p>${n}</p>`).join('');
    document.getElementById('notesSection').style.display = '';
  } else {
    document.getElementById('notesSection').style.display = 'none';
  }

  const ledgerCols = document.getElementById('ledgerCols');
  ledgerCols.innerHTML = r.nutrition.hasProtein
    ? '<col style="width:52%"><col style="width:24%"><col style="width:24%">'
    : '<col style="width:72%"><col style="width:28%">';

  const ledgerHead = document.getElementById('ledgerHead');
  const ledgerBody = document.getElementById('ledgerBody');
  ledgerHead.innerHTML = r.nutrition.hasProtein
    ? `<tr><th>Sastojak</th><th class="val">Kcal</th><th class="val">Proteini</th></tr>`
    : `<tr><th>Sastojak</th><th class="val">Kcal</th></tr>`;
  ledgerBody.innerHTML = '';
  r.nutrition.rows.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = r.nutrition.hasProtein
      ? `<td>${row.name}</td><td class="val">${row.kcal}</td><td class="val">${row.protein || '—'}</td>`
      : `<td>${row.name}</td><td class="val">${row.kcal}</td>`;
    ledgerBody.appendChild(tr);
  });
  r.nutrition.totals.forEach((t, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'total' + (idx > 0 ? ' sub' : '');
    tr.innerHTML = r.nutrition.hasProtein
      ? `<td>${t.name}</td><td class="val">${t.kcal}</td><td class="val">${t.protein || '—'}</td>`
      : `<td>${t.name}</td><td class="val">${t.kcal}</td>`;
    ledgerBody.appendChild(tr);
  });

  const src = document.getElementById('src');
  if (r.source){
    src.innerHTML = `Izvor: <a href="${r.source.url}" target="_blank" rel="noopener">${r.source.label}</a>`;
    src.style.display = '';
  } else {
    src.style.display = 'none';
  }

  placeNutrition();
  updateBadge();
}

function stat(value, label){
  const div = document.createElement('div');
  div.className = 'stat';
  div.innerHTML = `<span class="v">${value}</span><span class="l">${label}</span>`;
  return div;
}

/* ====================================================================
   NAVIGACIJA
==================================================================== */
function showList(){
  document.getElementById('listView').style.display = 'block';
  document.getElementById('detailView').style.display = 'none';
  document.getElementById('navList').style.display = 'block';
  document.getElementById('navDetail').style.display = 'none';
  document.getElementById('listCount').style.display = 'inline';
  try { window.scrollTo(0,0); } catch(e){ /* ignore in restricted preview */ }
}
function showDetail(id){
  const r = recipes.find(x => x.id === id);
  if (!r) return;
  // prebaci prikaz PRVO, pre bilo čega što bi moglo da baci grešku
  document.getElementById('listView').style.display = 'none';
  document.getElementById('detailView').style.display = 'block';
  document.getElementById('navList').style.display = 'none';
  document.getElementById('navDetail').style.display = 'flex';
  document.getElementById('listCount').style.display = 'none';
  try { renderDetail(r); } catch(e){ console.error('renderDetail failed:', e); }
  try { window.scrollTo(0,0); } catch(e){ /* ignore in restricted preview */ }
}

/* ---- ruter (hash-based) — omogućava da back dugme na telefonu vrati na listu ---- */
function routeHash(id){
  return '#/recept/' + encodeURIComponent(id);
}
function navigateToDetail(id){
  history.pushState(null, '', routeHash(id));
  showDetail(id);
}
function navigateToList(){
  if (location.hash) history.pushState(null, '', location.pathname + location.search);
  showList();
}
function handleRoute(){
  const match = location.hash.match(/^#\/recept\/(.+)$/);
  const id = match ? decodeURIComponent(match[1]) : null;
  const r = id ? recipes.find(x => x.id === id) : null;
  if (r) showDetail(r.id);
  else showList();
}
window.addEventListener('popstate', handleRoute);

/* ---- raspored: na desktopu tabela kalorija ide u levu kolonu, ispod statistike ---- */
const desktopMQ = window.matchMedia('(min-width: 1000px)');
function placeNutrition(){
  const section = document.getElementById('nutritionSection');
  if (!section) return;
  if (desktopMQ.matches){
    document.querySelector('.card-media').appendChild(section);
  } else {
    document.querySelector('.card-body').insertBefore(section, document.getElementById('src'));
  }
}
desktopMQ.addEventListener('change', placeNutrition);

document.getElementById('navDetail').addEventListener('click', () => {
  if (location.hash) history.back();
  else showList();
});
document.getElementById('fabBtn').addEventListener('click', openSheet);
document.getElementById('sheetClose').addEventListener('click', closeSheet);
document.getElementById('overlay').addEventListener('click', closeSheet);
document.getElementById('clearBtn').addEventListener('click', () => {
  clearShoppingList();
  renderShoppingSheet();
  updateBadge();
  document.querySelectorAll('.ing-add.added').forEach(btn => {
    btn.classList.remove('added');
    btn.querySelector('svg').innerHTML = '<path d="M12 5v14M5 12h14"/>';
  });
});

/* ====================================================================
   INIT — pozvano iz js/firebase-data.js kad recepti stignu iz Firestore-a
==================================================================== */
function initApp(){
  renderFilters();
  if (window.recipesLoadError){
    document.getElementById('list').innerHTML = `<div class="empty-list">Nije moguće učitati recepte. Proveri internet konekciju i pokušaj ponovo.</div>`;
    document.getElementById('listCount').textContent = '';
  } else {
    renderList();
  }
  loadShoppingList();
  // ako je stranica otvorena direktno na linku recepta, ubaci "listu" ispod
  // u istoriju da back dugme (u appu ili na telefonu) uvek prvo vodi na listu
  if (/^#\/recept\//.test(location.hash)){
    const detailHash = location.hash;
    history.replaceState(null, '', location.pathname + location.search);
    history.pushState(null, '', detailHash);
  }
  handleRoute();
}
window.initApp = initApp;
