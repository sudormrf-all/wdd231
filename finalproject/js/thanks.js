// thanks.js
import { $ } from './utils.js';

const container = $('#submission');

function asList(entries) {
  const dl = document.createElement('dl');
  dl.style.display = 'grid';
  dl.style.gridTemplateColumns = 'max-content 1fr';
  dl.style.gap = '.5rem 1rem';
  for (const [k,v] of entries) {
    const dt = document.createElement('dt');
    dt.textContent = k;
    dt.style.fontWeight = '600';
    const dd = document.createElement('dd');
    dd.textContent = v;
    dl.append(dt, dd);
  }
  return dl;
}

function parseMix(str) {
  if (!str) return [];
  return str.split(',').map(pair => {
    const [id, grams] = pair.split(':');
    return { id, grams: Number(grams) };
  });
}

function init() {
  const params = new URLSearchParams(location.search);
  if (![...params.keys()].length) {
    container.innerHTML = '<p>No data found. Please submit the form first.</p>';
    return;
  }
  const entries = [...params.entries()].map(([k,v]) => [k, v || '—']);
  container.appendChild(asList(entries));

  // If there's a mix, expand it nicely
  const mixParam = params.get('mix');
  if (mixParam) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = 'View selected mix (raw)';
    details.appendChild(summary);
    details.appendChild(document.createTextNode(mixParam));
    container.appendChild(details);
  }
}

init();
