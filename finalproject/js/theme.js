import { storage } from './storage.js';
function applyTheme(theme){ theme ? document.documentElement.setAttribute('data-theme', theme) : document.documentElement.removeAttribute('data-theme'); }
const saved = storage.get('theme'); if (saved) applyTheme(saved);
const toggle = document.getElementById('themeToggle');
if (toggle) toggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
    (!document.documentElement.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const next = isDark ? 'light' : 'dark'; storage.set('theme', next); applyTheme(next);
});
