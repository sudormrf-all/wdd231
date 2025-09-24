(function () {
    // Fill hidden timestamp when the form loads
    const ts = document.getElementById('timestamp');
    if (ts) {
        // ISO gives a stable format for later parsing/display
        ts.value = new Date().toISOString();
    }

    // Open HTML <dialog> modals from "Benefits & details" links
    const links = document.querySelectorAll('.open-modal[data-modal]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('data-modal');
            const dlg = document.getElementById(id);
            if (dlg && typeof dlg.showModal === 'function') {
                dlg.showModal();
                // Close on backdrop click
                dlg.addEventListener('click', (evt) => {
                    const rect = dlg.getBoundingClientRect();
                    const inDialog =
                        rect.top <= evt.clientY && evt.clientY <= rect.top + rect.height &&
                        rect.left <= evt.clientX && evt.clientX <= rect.left + rect.width;
                    if (!inDialog) dlg.close();
                }, { once: true });
            }
        });
    });
})();