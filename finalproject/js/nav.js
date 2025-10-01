import { $$ } from './utils.js';
const menuBtn = document.getElementById('menuButton');
const nav = document.getElementById('primaryNav');
function setActiveLink(){
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('nav#primaryNav a').forEach(a => {
    const href = a.getAttribute('href');
    const isActive = href === path || (path === '' && href === 'index.html');
    a.classList.toggle('active', isActive);
    if (isActive) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
  });
}
if (menuBtn && nav){
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', e => { if (!nav.contains(e.target) && !menuBtn.contains(e.target)){ nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); } });
  setActiveLink();
}
