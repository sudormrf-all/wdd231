(function () {
    // ---------------- Last-visit message via localStorage ----------------
    const VISIT_KEY = 'pvc_discover_last_visit';
    const msgEl = document.getElementById('visit-message');

    function renderVisitMessage() {
        if (!msgEl) return;

        const now = Date.now();
        const lastRaw = localStorage.getItem(VISIT_KEY);

        if (!lastRaw) {
            msgEl.textContent = 'Welcome! Let us know if you have any questions.';
            localStorage.setItem(VISIT_KEY, String(now));
            return;
        }

        const last = parseInt(lastRaw, 10);
        if (Number.isNaN(last)) {
            msgEl.textContent = 'Welcome! Let us know if you have any questions.';
            localStorage.setItem(VISIT_KEY, String(now));
            return;
        }

        const diffMs = now - last;
        const dayMs = 24 * 60 * 60 * 1000;

        if (diffMs < dayMs) {
            msgEl.textContent = 'Back so soon! Awesome!';
        } else {
            const days = Math.floor(diffMs / dayMs);
            msgEl.textContent = `You last visited ${days} ${days === 1 ? 'day' : 'days'} ago.`;
        }

        // Update last visit timestamp
        localStorage.setItem(VISIT_KEY, String(now));
    }

    // ---------------- Gallery from JSON ----------------
    const gallery = document.getElementById('gallery');
    const AREAS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    async function loadPOI() {
        if (!gallery) return;
        try {
            const res = await fetch('./data/discover.json', { cache: 'no-store' });
            if (!res.ok) throw Error(await res.text());
            const items = await res.json();

            // Ensure exactly 8 items (if more, take first 8)
            const list = Array.isArray(items) ? items.slice(0, 8) : [];
            gallery.innerHTML = '';

            const frag = document.createDocumentFragment();
            list.forEach((item, idx) => {
                const area = AREAS[idx] || 'a';
                const card = document.createElement('article');
                card.className = 'poi-card';
                card.dataset.area = area;

                const title = item.name || 'Point of Interest';
                const addr = item.address || 'Porto, Portugal';
                const desc = item.description || '';
                const img = item.image || {};
                const src = img.src || './images/placeholder.png';
                const alt = img.alt || title;
                const width = img.width || 300;
                const height = img.height || 200;

                // Button opens a destination: prefer item.url; otherwise a Maps search
                const url = item.url && item.url !== '#'
                    ? item.url
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title + ' Porto Portugal')}`;

                card.innerHTML = `
          <h2>${title}</h2>
          <figure>
            <img src="${src}" alt="${alt}" width="${width}" height="${height}" loading="lazy" decoding="async">
          </figure>
          <address>${addr}</address>
          <p>${desc}</p>
          <button type="button" class="learn-more" data-url="${url}">Learn more</button>
        `;

                frag.appendChild(card);
            });

            gallery.appendChild(frag);

            // Wire up buttons after insertion (open safely)
            gallery.querySelectorAll('.learn-more[data-url]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const href = btn.getAttribute('data-url');
                    if (href) window.open(href, '_blank', 'noopener,noreferrer');
                });
            });

        } catch (err) {
            console.error('Discover gallery error:', err);
            gallery.innerHTML = '<p>Unable to load places of interest right now.</p>';
        }
    }

    // Kick off
    renderVisitMessage();
    loadPOI();
})();