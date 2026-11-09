const categories = [['outfit', 'Dresses'], ['hair', 'Hair'], ['shoes', 'Shoes'], ['accessory', 'Extras']];
const catalog = {
  outfit: [['rose-dress', 'Rose satin', '👗', '#e88eae', 0, ['romantic', 'pink', 'gala']], ['moon-gown', 'Moon gown', '👗', '#8d7acb', 35, ['moonlight', 'purple', 'gala']], ['sunset-dress', 'Sunset', '👗', '#f4a361', 30, ['warm', 'gold', 'party']], ['garden-dress', 'Garden party', '👗', '#76b99b', 40, ['garden', 'green', 'romantic']], ['starlet-dress', 'Starlight', '👗', '#6f8fd5', 50, ['moonlight', 'blue', 'gala']]],
  hair: [['soft-waves', 'Soft waves', '💇🏻‍♀️', '#8c594a', 0, ['romantic', 'natural']], ['golden-bun', 'Golden bun', '💇🏼‍♀️', '#d2a44c', 25, ['gold', 'gala']], ['midnight-bob', 'Midnight bob', '💇🏽‍♀️', '#51435f', 30, ['moonlight', 'purple']], ['rose-braid', 'Rose braid', '💇🏾‍♀️', '#a65368', 35, ['pink', 'garden', 'romantic']]],
  shoes: [['pink-heels', 'Petal heels', '👠', '#e89bb7', 0, ['pink', 'romantic', 'gala']], ['moon-heels', 'Moon heels', '👠', '#9279c8', 25, ['moonlight', 'purple']], ['gold-shoes', 'Golden heels', '👠', '#e4b85d', 25, ['gold', 'warm', 'gala']], ['garden-shoes', 'Garden flats', '🥿', '#79ad8c', 20, ['garden', 'green']]],
  accessory: [['star-earrings', 'Star earrings', '✨', '#f3d170', 0, ['moonlight', 'gold', 'gala']], ['pearl-necklace', 'Pearl necklace', '📿', '#f4e9dc', 20, ['romantic', 'gala']], ['moon-crown', 'Moon crown', '👑', '#a899dd', 35, ['moonlight', 'purple']], ['flower-bag', 'Flower bag', '🌸', '#e995b5', 20, ['garden', 'pink', 'romantic']], ['sun-charm', 'Sun charm', '🌟', '#efa94e', 25, ['warm', 'gold', 'party']]]
};
const itemMap = {};
for (const [category, rows] of Object.entries(catalog)) for (const [id, name, emoji, color, price, tags] of rows) itemMap[id] = { id, category, name, emoji, color, price, tags };
const challenges = [
  { name: 'Moonlit Gala', icon: '🌙', desc: 'A night beneath the stars calls for a little sparkle and a dreamy touch.', tags: ['moonlight', 'purple', 'gala', 'gold'], color: '#9279c8' },
  { name: 'Garden Daydream', icon: '🌷', desc: 'Wander into a secret garden in soft, romantic pieces inspired by spring.', tags: ['garden', 'green', 'pink', 'romantic'], color: '#76b99b' },
  { name: 'Golden Hour', icon: '☀️', desc: 'Catch the last light in a warm look made for a magical evening.', tags: ['warm', 'gold', 'party', 'gala'], color: '#efa94e' },
  { name: 'Starlight Soirée', icon: '✨', desc: 'Bring the midnight sky to life with elegant colors and celestial details.', tags: ['moonlight', 'blue', 'purple', 'gala'], color: '#6f8fd5' }
];
const defaults = { name: 'Luna', coins: 120, stars: 0, owned: ['rose-dress', 'soft-waves', 'pink-heels', 'star-earrings'], equipped: { outfit: 'rose-dress', hair: 'soft-waves', shoes: 'pink-heels', accessory: 'star-earrings' }, tab: 'outfit', challenge: 0, completed: [] };
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('starlet-atelier-save') || 'null');
    if (!saved || typeof saved !== 'object') return structuredClone(defaults);
    const owned = Array.isArray(saved.owned) ? saved.owned.filter(id => itemMap[id]) : defaults.owned;
    return { ...structuredClone(defaults), ...saved, name: typeof saved.name === 'string' ? saved.name.slice(0, 16) : defaults.name, coins: Math.max(0, Number(saved.coins) || 0), stars: Math.max(0, Number(saved.stars) || 0), owned: [...new Set([...defaults.owned, ...owned])], equipped: { ...defaults.equipped, ...(saved.equipped || {}) }, tab: catalog[saved.tab] ? saved.tab : defaults.tab, challenge: Number.isInteger(saved.challenge) ? ((saved.challenge % challenges.length) + challenges.length) % challenges.length : 0, completed: Array.isArray(saved.completed) ? saved.completed.filter(Number.isInteger) : [] };
  } catch { return structuredClone(defaults); }
}
const state = loadState();
function save() { try { localStorage.setItem('starlet-atelier-save', JSON.stringify(state)); } catch { /* The game remains playable when storage is unavailable. */ } }
function selectedItem(category) { return itemMap[state.equipped[category]] || itemMap[defaults.equipped[category]]; }
function avatarSvg() {
  const dress = selectedItem('outfit'), hair = selectedItem('hair'), shoes = selectedItem('shoes'), accessory = selectedItem('accessory');
  const safe = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
  return `<defs><linearGradient id="skin" x2="0" y2="1"><stop stop-color="#f8d4c3"/><stop offset="1" stop-color="#e9ad9b"/></linearGradient><linearGradient id="dress" x2="1" y2="1"><stop stop-color="${safe(dress.color)}"/><stop offset="1" stop-color="${safe(dress.color)}" stop-opacity=".72"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#6c477c" flood-opacity=".16"/></filter></defs>
  <ellipse cx="150" cy="470" rx="71" ry="13" fill="#8c6b9b" opacity=".12"/>
  <g filter="url(#shadow)">
   <path d="M132 332h18v104h-18zM151 332h18v104h-18z" fill="url(#skin)"/><path d="M126 421q15-9 29 1l2 20q-18 10-36 0zM151 421q15-9 29 1l7 21q-17 9-37-1z" fill="${safe(shoes.color)}"/><path d="M137 434h18M160 434h17" stroke="#fff" stroke-width="3" opacity=".7"/>
   <path d="M123 199q-12 8-17 28l-22 70q-3 10 7 14t13-7l29-66M178 199q13 8 18 28l21 70q4 10-6 14t-14-7l-28-66" fill="url(#skin)" stroke="#df9d8e" stroke-width="2"/>
   <path d="M127 190q23-15 48 0l17 34-18 21 9 90q-34 25-70 0l10-90-18-21z" fill="url(#dress)" stroke="${safe(dress.color)}" stroke-width="2"/>
   <path d="M117 224q34 15 67 0M120 275q31 15 59 0M119 300q31 14 60 0" fill="none" stroke="#fff" stroke-width="2" opacity=".45"/><path d="M135 192q15 13 30 0" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>
   <path d="M137 162h28v39q-12 15-28 0z" fill="url(#skin)"/><ellipse cx="151" cy="123" rx="43" ry="53" fill="url(#skin)"/>
   <path d="M108 128q-13-56 34-70 44-8 51 35l-7 43q-8-16-12-36-30 20-65 12l-1 48q-18-11-8-32z" fill="${safe(hair.color)}"/>
   <path d="M123 128q8 6 15 0M163 128q8 6 15 0" fill="none" stroke="#5d4055" stroke-width="3" stroke-linecap="round"/><circle cx="131" cy="128" r="2" fill="#47334c"/><circle cx="171" cy="128" r="2" fill="#47334c"/><path d="M147 145q5 4 10 0" fill="none" stroke="#c77d81" stroke-width="2" stroke-linecap="round"/><circle cx="120" cy="145" r="7" fill="#ef9da5" opacity=".38"/><circle cx="181" cy="145" r="7" fill="#ef9da5" opacity=".38"/>
   <path d="M114 112q10-39 39-39 26 2 38 25-25-13-43-9-17 10-34 23" fill="${safe(hair.color)}"/><path d="M111 111q-11 38 4 74M191 108q12 37-3 70" fill="none" stroke="${safe(hair.color)}" stroke-width="9" stroke-linecap="round"/>
   <path d="M127 216l24 17 24-17" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/><path d="M151 235l-5 9 5 5 5-5z" fill="${safe(accessory.color)}"/><circle cx="116" cy="181" r="5" fill="${safe(accessory.color)}"/><circle cx="187" cy="181" r="5" fill="${safe(accessory.color)}"/>
   <text x="151" y="95" text-anchor="middle" font-size="22">${safe(accessory.emoji)}</text>
  </g>`;
}
function matchScore() {
  const challenge = challenges[state.challenge];
  let score = 35;
  for (const [category] of categories) {
    const item = selectedItem(category);
    const matches = item.tags.filter(tag => challenge.tags.includes(tag)).length;
    score += matches ? Math.min(18, 8 + (matches - 1) * 5) : 3;
  }
  return Math.min(100, score);
}
function renderChallenge() {
  const challenge = challenges[state.challenge];
  document.querySelector('#challengeName').textContent = challenge.name;
  document.querySelector('.challenge-icon').textContent = challenge.icon;
  document.querySelector('#challengeDesc').textContent = challenge.desc;
  document.querySelector('#challengeTags').innerHTML = challenge.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  const score = matchScore();
  document.querySelector('#matchBar').style.width = `${score}%`;
  document.querySelector('#matchText').textContent = `${score}%`;
}
function renderItems() {
  const active = state.tab;
  document.querySelector('#tabs').innerHTML = categories.map(([id, label]) => `<button class="tab ${active === id ? 'selected' : ''}" data-tab="${id}">${label}</button>`).join('');
  document.querySelector('#items').innerHTML = catalog[active].map(row => {
    const i = itemMap[row[0]], owned = state.owned.includes(i.id), equipped = state.equipped[active] === i.id;
    return `<button class="item ${equipped ? 'equipped' : ''} ${owned ? '' : 'locked'}" data-item="${i.id}" style="--swatch:${i.color}" aria-label="${i.name}${owned ? '' : `, ${i.price} coins`}"><span class="item-art">${i.emoji}</span><span class="item-name">${i.name}</span>${owned ? (equipped ? '<span class="check">✓</span>' : '') : `<span class="item-price">🪙 ${i.price}</span>`}</button>`;
  }).join('');
  document.querySelector('#wardrobeCount').textContent = `${state.owned.length} pieces`;
}
function render() {
  document.querySelector('#starCount').textContent = state.stars;
  document.querySelector('#coinCount').textContent = state.coins;
  document.querySelector('#avatarName').textContent = state.name;
  document.querySelector('#avatar').innerHTML = avatarSvg();
  renderItems(); renderChallenge();
  const done = state.completed.includes(state.challenge);
  document.querySelector('#submitBtn').disabled = done;
  document.querySelector('#submitBtn').innerHTML = done ? '✓ &nbsp; Challenge complete' : '✨ &nbsp; Show off this look';
}
function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message; toast.classList.add('show');
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2400);
}
document.querySelector('#tabs').addEventListener('click', e => {
  const button = e.target.closest('[data-tab]'); if (!button) return;
  state.tab = button.dataset.tab; save(); renderItems();
});
document.querySelector('#items').addEventListener('click', e => {
  const button = e.target.closest('[data-item]'); if (!button) return;
  const item = itemMap[button.dataset.item]; if (!item) return;
  if (!state.owned.includes(item.id)) {
    if (state.coins < item.price) { showToast('You need a few more coins for this piece.'); return; }
    state.coins -= item.price; state.owned.push(item.id); showToast(`${item.name} added to your wardrobe!`);
  }
  state.equipped[state.tab] = item.id; save(); render();
});
document.querySelector('#randomBtn').addEventListener('click', () => {
  const tags = challenges[state.challenge].tags;
  for (const [category] of categories) {
    const options = catalog[category].map(row => itemMap[row[0]]).filter(item => state.owned.includes(item.id));
    const matching = options.filter(item => item.tags.some(tag => tags.includes(tag)));
    const pool = matching.length ? matching : options;
    state.equipped[category] = pool[Math.floor(Math.random() * pool.length)].id;
  }
  save(); render(); showToast('A little styling magic ✨');
});
document.querySelector('#submitBtn').addEventListener('click', () => {
  if (state.completed.includes(state.challenge)) return;
  const score = matchScore(), coins = 25 + Math.round(score * .45), stars = score >= 80 ? 3 : score >= 50 ? 2 : 1;
  state.coins += coins; state.stars += stars; state.completed.push(state.challenge); save(); render();
  document.querySelector('#resultMedal').textContent = score >= 80 ? '🏆' : score >= 50 ? '🌟' : '💖';
  document.querySelector('#resultTitle').textContent = score >= 80 ? 'A star is born!' : score >= 50 ? 'Lovely styling!' : 'A sweet first look!';
  document.querySelector('#resultScore').textContent = score;
  document.querySelector('.notice').textContent = 'STYLE SCORE';
  document.querySelector('#resultCopy').textContent = score >= 80 ? 'You understood the mood perfectly. The whole room is looking your way!' : score >= 50 ? 'Your look has a lovely mood. Try matching more of the challenge colors for an even bigger score.' : 'Every star starts somewhere. Try adding a few challenge colors to your look!';
  document.querySelector('#resultReward').textContent = `+${stars} ✦   +${coins} 🪙`;
  document.querySelector('#continueBtn').textContent = 'Next challenge'; document.querySelector('#modal').classList.add('open');
});
document.querySelector('#continueBtn').addEventListener('click', () => {
  document.querySelector('#modal').classList.remove('open');
  if (state.completed.includes(state.challenge)) {
    state.challenge = (state.challenge + 1) % challenges.length;
    if (state.completed.length === challenges.length) state.completed = [];
    save(); render();
  }
});
document.querySelector('#modal').addEventListener('click', e => { if (e.target.id === 'modal') e.currentTarget.classList.remove('open'); });
document.querySelector('#nameBtn').addEventListener('click', () => {
  const name = prompt('What should we call your star?', state.name);
  if (name && name.trim()) { state.name = name.trim().slice(0, 16); save(); render(); showToast(`Looking lovely, ${state.name}!`); }
});
function openGacha() { document.querySelector('#gachaModal').classList.add('open'); }
function closeGacha() { document.querySelector('#gachaModal').classList.remove('open'); }
document.querySelector('.capsule-link').addEventListener('click', openGacha);
document.querySelector('#gachaClose').addEventListener('click', closeGacha);
document.querySelector('#gachaModal').addEventListener('click', e => {
  if (e.target.id === 'gachaModal') { closeGacha(); return; }
  const button = e.target.closest('[data-gacha]'); if (!button) return;
  const mode = button.dataset.gacha;
  const price = mode === 'single' ? 6 : mode === 'double' ? 10 : 35;
  const pulls = mode === 'double' ? 2 : 1;
  if (state.coins < price) { showToast('Not quite enough coins for this capsule.'); return; }
  state.coins -= price;
  const allItems = Object.values(itemMap);
  const rareItems = ['moon-gown', 'starlet-dress', 'rose-braid', 'midnight-bob', 'moon-crown', 'sun-charm'].map(id => itemMap[id]);
  const found = [];
  for (let i = 0; i < pulls; i++) {
    const pool = mode === 'rare' ? rareItems : allItems;
    const item = pool[Math.floor(Math.random() * pool.length)];
    if (state.owned.includes(item.id)) { state.coins += 12; found.push(`${item.name} (duplicate · +12 coins)`); }
    else { state.owned.push(item.id); found.push(`${item.emoji} ${item.name}`); }
  }
  save(); render(); closeGacha();
  document.querySelector('#resultMedal').textContent = '🎁';
  document.querySelector('#resultTitle').textContent = found.length > 1 ? 'Double delight!' : 'A little surprise!';
  document.querySelector('#resultScore').textContent = '✦';
  document.querySelector('.notice').textContent = 'CAPSULE FINDS';
  document.querySelector('#resultCopy').textContent = found.join(' · ');
  document.querySelector('#resultReward').textContent = `-${price} coins · ${state.owned.length} wardrobe pieces`;
  document.querySelector('#continueBtn').textContent = 'Back to styling';
  document.querySelector('#modal').classList.add('open');
});
document.querySelector('.nav').addEventListener('click', e => {
  const button = e.target.closest('[data-nav]'); if (!button) return;
  document.querySelectorAll('.nav button').forEach(item => item.classList.toggle('active', item === button));
  if (button.dataset.nav === 'gacha') { openGacha(); return; }
  if (button.dataset.nav === 'collection') { document.querySelector('.wardrobe').scrollIntoView({ behavior: 'smooth', block: 'center' }); showToast('Your closet, your rules.'); }
  if (button.dataset.nav === 'studio') document.querySelector('.studio').scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (button.dataset.nav === 'lookbook') {
    document.querySelector('#resultMedal').textContent = '📖'; document.querySelector('#resultTitle').textContent = 'Your lookbook';
    document.querySelector('#resultScore').textContent = state.stars; document.querySelector('.notice').textContent = 'TOTAL STARS EARNED';
    document.querySelector('#resultCopy').textContent = state.completed.length ? `You’ve styled ${state.completed.length} challenge${state.completed.length === 1 ? '' : 's'} so far. Keep collecting stars and creating new looks!` : 'Your story starts with the next look you create. Complete a challenge to add a page!';
    document.querySelector('#resultReward').textContent = `${state.owned.length} wardrobe pieces · ${state.coins} coins`;
    document.querySelector('#continueBtn').textContent = 'Back to styling'; document.querySelector('#modal').classList.add('open');
  }
});
render();
