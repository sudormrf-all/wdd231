const membersEl = document.querySelector('#members');
const gridBtn = document.querySelector('#gridBtn');
const listBtn = document.querySelector('#listBtn');

function setView(mode) {
    membersEl.classList.toggle('cards', mode === 'grid');
    membersEl.classList.toggle('list', mode === 'list');
    gridBtn.setAttribute('aria-pressed', String(mode === 'grid'));
    listBtn.setAttribute('aria-pressed', String(mode === 'list'));
}

function createMemberCard(m) {
    const card = document.createElement('article');
    card.className = 'member-card';

    const img = document.createElement('img');
    img.src = `./images/${m.image}`;
    img.alt = `${m.name} logo`;
    img.loading = 'lazy';
    img.width = 64; img.height = 64;

    const h3 = document.createElement('h3');
    h3.textContent = m.name;

    const meta = document.createElement('div');
    meta.className = 'member-meta';
    const level = m.level === 3 ? 'Gold' : m.level === 2 ? 'Silver' : 'Member';
    meta.innerHTML = `
    <div>${m.address}</div>
    <div><a href="${m.website}" rel="noopener" target="_blank">${m.website}</a></div>
    <div>${m.phone}</div>
    <div>Level: ${level}</div>
  `;

    card.append(img, h3, meta);
    return card;
}

async function loadMembers() {
    membersEl.textContent = 'Loading…';
    try {
        const res = await fetch('./data/members.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        membersEl.textContent = '';
        data.forEach(m => membersEl.appendChild(createMemberCard(m)));
        if (!data.length) membersEl.textContent = 'No members found.';
    } catch (err) {
        console.error(err);
        membersEl.textContent = 'Failed to load members.';
    }
}

// Events
gridBtn.addEventListener('click', () => setView('grid'));
listBtn.addEventListener('click', () => setView('list'));

// Init
setView('grid');
loadMembers();
