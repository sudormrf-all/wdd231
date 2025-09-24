(function () {
    const params = new URLSearchParams(window.location.search);

    function get(key) {
        const v = params.get(key);
        return v == null ? '' : v;
    }

    function setText(id, value) {
        const el = document.getElementById(id);
        if (!el) return;
        // Basic escape via textContent
        el.textContent = value || '—';
    }

    const first = get('firstName');
    const last = get('lastName');
    const email = get('email');
    const phone = get('phone');
    const org = get('organization');
    const ts = get('timestamp');

    // Format timestamp if it looks like ISO
    let tsDisplay = ts;
    if (ts && /^\d{4}-\d{2}-\d{2}T/.test(ts)) {
        try {
            const d = new Date(ts);
            tsDisplay = d.toLocaleString(undefined, {
                year: 'numeric', month: 'short', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        } catch { /* leave as-is */ }
    }

    setText('out-firstName', first);
    setText('out-lastName', last);
    setText('out-email', email);
    setText('out-phone', phone);
    setText('out-organization', org);
    setText('out-timestamp', tsDisplay);
})();