// Responsive nav
const menuToggle = document.querySelector('#menu-toggle');
const nav = document.querySelector('#site-nav');
menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    if (expanded) nav.setAttribute('hidden', '');
    else nav.removeAttribute('hidden');
});

// Footer info
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#lastmod').textContent = document.lastModified;
