export function setupDialog(dialog){
  if(!dialog) return;
  const closeBtn = dialog.querySelector('[data-close-dialog]');
  closeBtn?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); dialog.close(); });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusables = [...dialog.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => !el.hasAttribute('disabled'));
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length-1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    } else if (e.key === 'Escape') { dialog.close(); }
  });
}
