// Responsive nav
const menuToggle = document.querySelector('#menu-toggle');
const nav = document.querySelector('#site-nav');

menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    if (expanded) nav.setAttribute('hidden', '');
    else nav.removeAttribute('hidden');
});


const mq = window.matchMedia('(min-width:760px)');
function syncNavHidden() {
    if (!nav) return;
    if (mq.matches) nav.removeAttribute('hidden');
    else nav.setAttribute('hidden', '');
}
syncNavHidden();
mq.addEventListener('change', syncNavHidden);



document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#lastmod').textContent = document.lastModified;