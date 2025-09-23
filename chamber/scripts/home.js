/*** WEATHER ***/
// Porto, PT
const LAT = 41.1496;
const LON = -8.6109;

const OWM_KEY = (typeof window !== 'undefined' && window.OWM_KEY) ? window.OWM_KEY : '';

const els = {
    temp: document.querySelector('#temp'),
    icon: document.querySelector('#icon'),
    summary: document.querySelector('#summary'),
    forecast: document.querySelector('#weather-forecast'),
};

function k(el, value) { if (el) el.textContent = value; }

function iconUrl(code) {
    // Small, cacheable icon from OWM CDN
    return `https://openweathermap.org/img/wn/${code}@2x.png`;
}

function fmtDayName(date) {
    return date.toLocaleDateString(undefined, { weekday: 'short' }); // e.g., Mon
}

async function loadWeather() {
    if (!OWM_KEY || OWM_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
        k(els.summary, 'Add your OpenWeatherMap API key in scripts/config.js');
        return;
    }

    try {
        // Current
        const curUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${OWM_KEY}`;
        const curRes = await fetch(curUrl);
        if (!curRes.ok) throw new Error(`Weather HTTP ${curRes.status}`);
        const current = await curRes.json();

        const tempC = Math.round(current.main.temp);
        const desc = current.weather?.[0]?.description ?? '—';
        const ico = current.weather?.[0]?.icon ?? '01d';

        k(els.temp, tempC);
        if (els.icon) {
            els.icon.src = iconUrl(ico);
            // Icon is decorative (alt="" aria-hidden="true" set in HTML)
        }
        k(els.summary, desc.charAt(0).toUpperCase() + desc.slice(1));

        // 5‑day / 3‑hour forecast → pick next 3 days (midday if available)
        const fcUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${OWM_KEY}`;
        const fcRes = await fetch(fcUrl);
        if (!fcRes.ok) throw new Error(`Forecast HTTP ${fcRes.status}`);
        const forecast = await fcRes.json();

        const tz = forecast.city?.timezone ?? 0; // seconds
        // Build a map: dayKey -> best entry around midday
        const byDay = new Map();
        const nowUtcMs = Date.now();

        for (const item of forecast.list) {
            const utcMs = item.dt * 1000;
            if (utcMs < nowUtcMs) continue;
            const local = new Date(utcMs + tz * 1000);
            const dayKey = local.getUTCFullYear() + '-' + (local.getUTCMonth() + 1) + '-' + local.getUTCDate();
            const hour = local.getUTCHours(); // "localized" hours after offset trick

            // Prefer items near 12:00
            const score = Math.abs(12 - hour);
            const prev = byDay.get(dayKey);
            if (!prev || score < prev.score) {
                byDay.set(dayKey, { score, item, local });
            }
        }

        // Exclude "today" and take the next 3 unique days
        const todayKey = (() => {
            const d = new Date(nowUtcMs + tz * 1000);
            return d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate();
        })();

        const days = [...byDay.entries()]
            .filter(([key]) => key !== todayKey)
            .sort((a, b) => a[1].local - b[1].local)
            .slice(0, 3);

        // Render forecast
        els.forecast.innerHTML = '';
        for (const [, { item, local }] of days) {
            const dname = fmtDayName(local);
            const t = Math.round(item.main.temp);
            const d = item.weather?.[0]?.description ?? '';
            const ic = item.weather?.[0]?.icon ?? '01d';

            const card = document.createElement('div');
            card.className = 'forecast-day';
            card.innerHTML = `
        <div class="day" aria-label="${local.toLocaleDateString()}">${dname}</div>
        <img src="${iconUrl(ic)}" alt="${d}" width="48" height="48" />
        <div class="t">${t}°C</div>
        <div class="d">${d}</div>
      `;
            els.forecast.appendChild(card);
        }

        if (!els.forecast.children.length) {
            els.forecast.textContent = 'Forecast unavailable.';
        }
    } catch (err) {
        console.error(err);
        k(els.summary, 'Weather unavailable.');
    }
}

/*** SPOTLIGHTS ***/
const spotlightGrid = document.querySelector('#spotlight-grid');

function levelName(level) {
    return level === 3 ? 'Gold' : level === 2 ? 'Silver' : 'Member';
}
function telHref(s) {
    return `tel:${(s || '').replace(/[^\d+]/g, '')}`;
}
function createSpotlight(m) {
    const card = document.createElement('article');
    card.className = 'spotlight-card';

    const img = document.createElement('img');
    img.src = `./images/${m.image}`;
    img.alt = `${m.name} logo`;
    img.loading = 'lazy';
    img.width = 80; img.height = 80;
    img.onerror = () => { img.src = './images/placeholder.png'; img.alt = `${m.name}`; };

    const h3 = document.createElement('h3');
    h3.textContent = m.name;

    const meta = document.createElement('div');
    meta.className = 'member-meta';
    meta.innerHTML = `
    <div>${m.address}</div>
    <div><a href="${m.website}" rel="noopener noreferrer" target="_blank">${m.website}</a></div>
    <div><a href="${telHref(m.phone)}">${m.phone}</a></div>
    <div class="badge ${m.level === 3 ? 'gold' : 'silver'}">Level: ${levelName(m.level)}</div>
  `;

    card.append(img, h3, meta);
    return card;
}

function sample(arr, count) {
    // Fisher–Yates shuffle slice
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, count);
}

async function loadSpotlights() {
    try {
        const res = await fetch('./data/members.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Gold (3) or Silver (2) only
        const eligible = data.filter(m => m.level === 2 || m.level === 3);
        if (eligible.length === 0) {
            spotlightGrid.textContent = 'No spotlight members yet.';
            return;
        }

        const count = Math.min(eligible.length, Math.random() < 0.5 ? 2 : 3);
        const picks = sample(eligible, count);

        spotlightGrid.innerHTML = '';
        picks.forEach(m => spotlightGrid.appendChild(createSpotlight(m)));
    } catch (err) {
        console.error(err);
        spotlightGrid.textContent = 'Failed to load spotlights.';
    }
}

/*** INIT ***/
loadWeather();
loadSpotlights();
