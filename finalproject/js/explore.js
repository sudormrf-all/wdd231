import { $, $$, formatCurrency, clamp } from './utils.js';
import { storage } from './storage.js';
import { fetchIngredients } from './data.js';
import { setupDialog } from './modal.js';

const results = $('#results');
const stats = $('#stats');
const category = $('#category');
const price = $('#price');
const priceOut = $('#priceOut');
const search = $('#search');
const allergens = $$('.allergen');
const veganOnly = $('#veganOnly');
const sort = $('#sort');
const mixList = $('#mixList');
const mixTotal = $('#mixTotal');
const clearMixBtn = $('#clearMix');
const detailDialog = $('#detailDialog');
const detailBody = $('#detailBody');
const detailTitle = $('#detailTitle');
setupDialog(detailDialog);
priceOut.textContent = `$${Number(price.value).toFixed(2)}`;
price.addEventListener('input', () => { priceOut.textContent = `$${Number(price.value).toFixed(2)}`; apply(); });

let DATA = [];
let MIX = storage.get('mix', []);

function saveMix(){ storage.set('mix', MIX); renderMix(); }
function renderMix(){
  if (!MIX.length){
    mixList.innerHTML = '<li><em>No ingredients yet.</em></li>';
    mixTotal.textContent = '0 g • $0.00'; return;
  }
  const rows = MIX.map(row=>{
    const item = DATA.find(i => i.id === row.id);
    const cost = (row.grams/100) * item.pricePer100g;
    return `<li>
      <span>${item.name} <small>(${row.grams} g)</small></span>
      <span>${formatCurrency(cost)}</span>
      <button aria-label="Decrease grams" data-dec="${row.id}">−</button>
      <button aria-label="Increase grams" data-inc="${row.id}">+</button>
      <button aria-label="Remove from mix" data-remove="${row.id}">✕</button>
    </li>`;
  }).join('');
  mixList.innerHTML = rows;
  const totals = MIX.reduce((acc,row)=>{
    const item = DATA.find(i => i.id === row.id);
    acc.grams += row.grams;
    acc.cost += (row.grams/100) * item.pricePer100g;
    return acc;
  },{grams:0,cost:0});
  mixTotal.textContent = `${totals.grams} g • ${formatCurrency(totals.cost)}`;
}
mixList.addEventListener('click', (e)=>{
  const idDec = e.target.getAttribute('data-dec');
  const idInc = e.target.getAttribute('data-inc');
  const idRem = e.target.getAttribute('data-remove');
  if (idDec){ MIX = MIX.map(m => m.id===idDec ? { ...m, grams: clamp(m.grams-50, 50, 10000) } : m); saveMix(); }
  else if (idInc){ MIX = MIX.map(m => m.id===idInc ? { ...m, grams: m.grams+50 } : m); saveMix(); }
  else if (idRem){ MIX = MIX.filter(m => m.id!==idRem); saveMix(); }
});
clearMixBtn.addEventListener('click', () => { MIX = []; saveMix(); });

function allergenBadges(list){ if(!list?.length) return '<span class="badge">Allergen friendly</span>'; return list.map(a=>`<span class="badge">${a}</span>`).join(''); }
function cardTemplate(item){
  return `<article class="card" id="${item.id}">
    <h3>${item.name}</h3>
    <div class="meta">
      <span class="badge">${item.category}</span>
      <span class="badge">${item.vegan ? 'vegan' : 'non-vegan'}</span>
      <span>${item.origin}</span>
    </div>
    <p>${item.notes}</p>
    <div class="meta">
      <span>${item.caloriesPer100g} cal / 100g</span>
      <span>${formatCurrency(item.pricePer100g)} / 100g</span>
      <span>${item.rating.toFixed(1)}★</span>
    </div>
    <div class="meta">${allergenBadges(item.allergens)}</div>
    <div class="actions">
      <label class="sr-only" for="g-${item.id}">Grams for ${item.name}</label>
      <input id="g-${item.id}" type="number" min="50" max="1000" step="50" value="100" style="width:7ch" />
      <button class="button" data-add="${item.id}">Add to mix</button>
      <button class="button" data-detail="${item.id}">Details</button>
    </div>
  </article>`;
}
function openDetail(item){
  detailTitle.textContent = item.name;
  detailBody.innerHTML = `
    <p><strong>Origin:</strong> ${item.origin}</p>
    <p><strong>Nutrition per 100g:</strong></p>
    <ul>
      <li>Calories: ${item.caloriesPer100g}</li>
      <li>Protein: ${item.protein} g</li>
      <li>Fat: ${item.fat} g</li>
      <li>Carbs: ${item.carbs} g (sugars ${item.sugar} g, fiber ${item.fiber} g)</li>
      <li>Sodium: ${item.sodium} mg</li>
    </ul>
    <p>${item.notes}</p>`;
  if (typeof detailDialog.showModal === 'function') detailDialog.showModal(); else detailDialog.setAttribute('open','');
  detailDialog.querySelector('[data-close-dialog]').focus();
}
function normalize(s){ return String(s).toLowerCase().normalize('NFKD'); }
function apply(){
  const maxPrice = Number(price.value);
  const cat = category.value;
  const q = normalize(search.value || '');
  const exclude = allergens.filter(a=>a.checked).map(a=>a.value);
  let list = DATA.filter(i =>
    i.pricePer100g <= maxPrice &&
    (cat==='all' || i.category===cat) &&
    (q==='' || normalize(i.name+' '+i.notes+' '+i.origin).includes(q)) &&
    (exclude.every(a => !i.allergens.includes(a))) &&
    (!veganOnly.checked || i.vegan)
  );
  const s = sort.value;
  list.sort((a,b)=> s==='name' ? a.name.localeCompare(b.name) :
                    s==='price' ? a.pricePer100g - b.pricePer100g :
                    s==='calories' ? a.caloriesPer100g - b.caloriesPer100g :
                    s==='rating' ? b.rating - a.rating : 0);
  const avgPrice = list.length ? (list.reduce((acc,i)=>acc+i.pricePer100g,0)/list.length) : 0;
  stats.innerHTML = `<span><strong>${list.length}</strong> items</span> <span>avg price <strong>${formatCurrency(avgPrice)}</strong> / 100g</span>`;
  results.innerHTML = list.map(cardTemplate).join('');
}
results.addEventListener('click', (e)=>{
  const addId = e.target.getAttribute('data-add');
  const detailId = e.target.getAttribute('data-detail');
  if (addId){
    const grams = clamp(Number(document.getElementById(`g-${addId}`).value || 100), 50, 10000);
    const existing = MIX.find(m=>m.id===addId);
    if (existing) existing.grams = clamp(existing.grams + grams, 50, 10000);
    else MIX.push({ id: addId, grams });
    saveMix();
  } else if (detailId){
    openDetail(DATA.find(i=>i.id===detailId));
  }
});
async function init(){
  try{
    DATA = await fetchIngredients();
    renderMix(); apply();
    [category, price, search, veganOnly, sort, ...allergens].forEach(el=>{
      el.addEventListener('input', apply); el.addEventListener('change', apply);
    });
    if (location.hash){
      const id = location.hash.replace('#',''); setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}),300);
    }
  }catch(err){
    results.innerHTML = '<p role="alert">Could not load data. Try reloading the page.</p>'; stats.textContent = '';
  }
}
init();
