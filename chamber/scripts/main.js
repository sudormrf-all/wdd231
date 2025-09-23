
const menuToggle = document.querySelector('#menu-toggle');
const nav = document.querySelector('#site-nav');


nav?.removeAttribute('hidden');


function setNavOpen(open) {
    if (!menuToggle || !nav) return;
    nav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
}

menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    setNavOpen(!open);
});


const mq = window.matchMedia('(min-width:760px)');
function syncNavToViewport() {
    if (!nav || !menuToggle) return;
    setNavOpen(mq.matches);
}
syncNavToViewport();
mq.addEventListener('change', syncNavToViewport);
