// contact.js
import { $, $$, formatCurrency } from './utils.js';
import { storage } from './storage.js';

const mixPreview = $('#mixPreview');
const mixPreviewTotal = $('#mixPreviewTotal');
const mixDataField = $('#mixData');
const form = $('#contactForm');

const DATA_URL = 'data/ingredients.json';
let DATA = [];
let MIX = storage.get('mix', []);

async function loadData() {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error('Failed to load ingredients');
  return await res.json();
}

function renderPreview() {
  if (!MIX.length) {
    mixPreview.innerHTML = '<li><em>No ingredients saved. Go add some from Explore.</em></li>';
    mixPreviewTotal.textContent = '0 g • $0.00';
    mixDataField.value = '';
    return;
  }
  const rows = MIX.map(row => {
    const item = DATA.find(i => i.id === row.id);
    const cost = (row.grams/100) * item.pricePer100g;
    return `<li><span>${item.name} <small>(${row.grams} g)</small></span><span>${formatCurrency(cost)}</span></li>`;
  }).join('');
  mixPreview.innerHTML = rows;

  const totals = MIX.reduce((acc, row) => {
    const item = DATA.find(i => i.id === row.id);
    acc.grams += row.grams;
    acc.cost += (row.grams/100) * item.pricePer100g;
    return acc;
  }, { grams:0, cost:0 });
  mixPreviewTotal.textContent = `${totals.grams} g • ${formatCurrency(totals.cost)}`;

  // pack data to a compact string for the hidden field
  mixDataField.value = MIX.map(m => `${m.id}:${m.grams}`).join(',');
}

async function init() {
  try {
    DATA = await loadData();
    renderPreview();
  } catch {
    mixPreview.innerHTML = '<li role="alert">Could not load your saved mix. Try again later.</li>';
  }

  // save name to localStorage for convenience
  const nameInput = $('#name');
  nameInput.addEventListener('input', () => storage.set('userName', nameInput.value));
  const savedName = storage.get('userName', '');
  if (savedName) nameInput.value = savedName;
}

form?.addEventListener('submit', (e) => {
  // simple client-side validation example
  if (!$('#agree').checked) {
    e.preventDefault();
    alert('Please confirm your information is correct.');
  }
});

init();
