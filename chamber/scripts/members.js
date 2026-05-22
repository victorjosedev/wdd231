// members.js — fetches members.json and renders grid/list views
const dataPath = './data/members.json';
const directory = document.getElementById('directory');
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');
let membersData = [];

async function fetchMembers() {
  try {
    const res = await fetch(dataPath);
    membersData = await res.json();
    renderGrid();
  } catch (err) {
    console.error('Failed to load members', err);
    directory.innerHTML = '<p>Unable to load member data.</p>';
  }
}

function membershipBadge(level) {
  if (level === 3) return '<span class="badge level-3">Gold</span>';
  if (level === 2) return '<span class="badge level-2">Silver</span>';
  return '<span class="badge level-1">Member</span>';
}

function renderGrid() {
  directory.innerHTML = '';
  directory.classList.add('grid');
  directory.classList.remove('list');
  gridBtn.setAttribute('aria-pressed', 'true');
  listBtn.setAttribute('aria-pressed', 'false');

  membersData.forEach((m, i) => {
    const card = document.createElement('article');
    card.className = 'card';

    const img = document.createElement('img');
    // Reserve intrinsic size so layout doesn't shift when images load
    img.width = 140;
    img.height = 90;
    img.src = m.image;
    img.alt = m.name;
    img.decoding = 'async';
    // Make the first image higher priority for LCP; lazy-load others
    if (i === 0) {
      img.setAttribute('fetchpriority', 'high');
    } else {
      img.loading = 'lazy';
    }
    img.onerror = () => { img.src = 'images/placeholder.png'; };

    const name = document.createElement('h3');
    name.className = 'name';
    name.textContent = m.name;

    const desc = document.createElement('p');
    desc.className = 'meta';
    desc.textContent = m.description;

    const addr = document.createElement('p');
    addr.className = 'meta';
    addr.textContent = m.address + ' — ' + m.phone;

    const link = document.createElement('a');
    link.href = m.website;
    link.textContent = 'Visit website';
    link.target = '_blank';

    card.appendChild(img);
    card.appendChild(name);
    card.insertAdjacentHTML('beforeend', membershipBadge(m.membershipLevel));
    card.appendChild(desc);
    card.appendChild(addr);
    card.appendChild(link);

    directory.appendChild(card);
  });
}

function renderList() {
  directory.innerHTML = '';
  directory.classList.add('list');
  directory.classList.remove('grid');
  gridBtn.setAttribute('aria-pressed', 'false');
  listBtn.setAttribute('aria-pressed', 'true');

  membersData.forEach(m => {
    const item = document.createElement('div');
    item.className = 'list-item';

    const content = document.createElement('div');
    content.className = 'list-content';

    const name = document.createElement('h3');
    name.textContent = m.name;

    const badgeWrap = document.createElement('div');
    badgeWrap.innerHTML = membershipBadge(m.membershipLevel);

    const addr = document.createElement('p');
    addr.textContent = m.address;

    const phone = document.createElement('p');
    phone.textContent = m.phone;

    const link = document.createElement('a');
    link.href = m.website;
    link.textContent = m.website;
    link.target = '_blank';

    content.appendChild(name);
    content.appendChild(badgeWrap);
    content.appendChild(addr);
    content.appendChild(phone);
    content.appendChild(link);

    item.appendChild(content);
    directory.appendChild(item);
  });
}

// Event listeners
gridBtn.addEventListener('click', () => { renderGrid(); });
listBtn.addEventListener('click', () => { renderList(); });

// footer dynamic info
document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// initial load
fetchMembers();
