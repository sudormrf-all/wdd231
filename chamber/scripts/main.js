// Responsive nav (class/data toggle, no [hidden])
const menuToggle = document.querySelector('#menu-toggle');
const nav = document.querySelector('#site-nav');

if (menuToggle && nav) {
    // Initialize closed on mobile
    nav.setAttribute('data-open', 'false');
    menuToggle.setAttribute('aria-expanded', 'false');

    menuToggle.addEventListener('click', () => {
        const open = nav.getAttribute('data-open') === 'true';
        const next = !open;
        nav.setAttribute('data-open', String(next));
        menuToggle.setAttribute('aria-expanded', String(next));
    });
}

// Footer dates
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#lastmod').textContent = document.lastModified;
