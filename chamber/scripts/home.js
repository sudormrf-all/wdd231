// scripts/home.js
// Weather + Spotlights for index.html

// ----- Weather -----
const LAT = 41.1496;      // Porto
const LON = -8.6109;      // Porto
const OWM_BASE = 'https://api.openweathermap.org/data/2.5/onecall?lat=41.149&lon=-8.6109&exclude=hourly,daily&appid={c34649f8dbe4f28aa24125e8c55a0ac6}'; // e.g., .../data/2.5

async function getJSON(url) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
}

function formatDay(ts, locale = 'en-GB') {
    return new Date(ts).toLocaleDateString(locale, { weekday: 'short' });
}

async function loadCurrentWeather() {
    const url = `${OWM_BASE}/weather?lat=${LAT}&lon=${LON}&units=metric&lang=en&appid=${OWM_KEY}`;
    const data = await getJSON(url);
    const temp = Math.round(data.main.temp);
    const desc = data.weather?.[0]?.description ?? '—';
    document.querySelector('#temp').textContent = temp;
    document.querySelector('#desc').textContent = desc;
}

async function loadForecast3Day() {
    const url = `${OWM_BASE}/forecast?lat=${LAT}&lon=${LON}&units=metric&lang=en&appid=${OWM_KEY}`;
    const data = await getJSON(url);

    // Group by date (YYYY-MM-DD), pick around 12:00:00 when available
    const byDate = new Map();
    for (const entry of data.list) {
        const [dateStr, timeStr] = entry.dt_txt.split(' ');
        if (!byDate.has(dateStr)) byDate.set(dateStr, []);
        byDate.get(dateStr).push(entry);
    }

    // Choose next 3 distinct future dates (skip today if mostly past)
    const todayISO = new Date().toISOString().slice(0, 10);
    const futureDates = [...byDate.keys()].filter(d => d >= todayISO).slice(0, 4); // gather a bit more, then trim
    const picks = [];
    for (const d of futureDates) {
        const entries = byDate.get(d);
        // Prefer 12:00:00, fallback to middle item
        let pick = entries.find(e => e.dt_txt.endsWith('12:00:00')) ?? entries[Math.floor(entries.length / 2)];
        picks.push(pick);
    }
    // Ensure exactly 3 days
    const three = picks.slice(0, 3);

    const ul = document.querySelector('#forecast-list');
    ul.innerHTML = '';
    for (const e of three) {
        const li = document.createElement('li');
        li.className = 'forecast-day';
        const day = formatDay(e.dt * 1000);
        const t = Math.round(e.main.temp);
        const dsc = e.weather?.[0]?.description ?? '—';
        li.textContent = `${day}: ${t}°C — ${dsc}`;
        ul.appendChild(li);
    }
}

async function initWeather() {
    try {
        await loadCurrentWeather();
        await loadForecast3Day();
    } catch (err) {
        console.error('Weather error', err);
    }
}
// ----- Spotlights -----
const MEMBERS_JSON = './data/members.json'; // same JSON i use in directory.js

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function createSpotlightCard(m) {
    const card = document.createElement('article');
    card.className = 'spotlight-card';

    const img = document.createElement('img');
    img.src = m.logo; // ensure local path in your repo
    img.alt = `${m.name} logo`;
    img.width = 180;
    img.height = 180;
    img.loading = 'lazy';

    const h3 = document.createElement('h3');
    h3.textContent = m.name;

    const pPhone = document.createElement('p');
    pPhone.textContent = m.phone;

    const pAddr = document.createElement('p');
    pAddr.textContent = m.address;

    const a = document.createElement('a');
    a.href = m.website;
    a.textContent = 'Visit website';
    a.rel = 'noopener';

    const pLevel = document.createElement('p');
    pLevel.className = 'level';
    pLevel.textContent = `Membership: ${m.membership}`;

    card.append(img, h3, pPhone, pAddr, a, pLevel);
    return card;
}

async function initSpotlights() {
    try {
        const data = await (await fetch(MEMBERS_JSON)).json();
        const goldSilver = data.members.filter(m =>
            /^(gold|silver)$/i.test(m.membership)
        );
        shuffle(goldSilver);
        const count = Math.random() < 0.5 ? 2 : 3;
        const picks = goldSilver.slice(0, count);

        const wrap = document.querySelector('#spotlights');
        wrap.innerHTML = '';
        picks.forEach(m => wrap.appendChild(createSpotlightCard(m)));
    } catch (err) {
        console.error('Spotlights error', err);
    }
}

// ----- Init -----
document.addEventListener('DOMContentLoaded', () => {
    initWeather();
    initSpotlights();
});
