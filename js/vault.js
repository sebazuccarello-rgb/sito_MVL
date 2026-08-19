let currentGroup = null;
let cleanup3dMain = null;
const CATEGORIES = Object.keys(VAULT_PROJECTS);

/* ── popola vault main grid dinamicamente ── */
const mainGrid = document.getElementById('vault-main-grid');
if (CATEGORIES.length === 0) {
  mainGrid.innerHTML = `<div style="grid-column:1/-1;padding:80px 0;text-align:center;font-size:11px;letter-spacing:0.3em;color:var(--text-dim)">// THE VAULT IS EMPTY — ADD FILES AND RUN SYNC.BAT</div>`;
} else {
  mainGrid.innerHTML = CATEGORIES.map((cat, i) => {
    const n = VAULT_PROJECTS[cat].length;
    return `
      <div class="fc" onclick="glitchOpen(this,'${cat}')">
        <div class="card-info">
          <div class="card-code">GRP_${String(i+1).padStart(3,'0')} //</div>
          <div class="card-name">${cat}</div>
          <div class="card-status"><div class="status-dot"></div><span class="status-text">${n} PROJECT${n!==1?'S':''}</span></div>
        </div>
      </div>`;
  }).join('');
}

/* ── popola group-pages e switcher dinamicamente ── */
const groupContainer = document.getElementById('group-pages-container');
const switcherEl     = document.getElementById('group-switcher');
groupContainer.innerHTML = CATEGORIES.map(cat =>
  `<div class="group-page folders-row" data-group="${cat}"></div>`
).join('');
switcherEl.innerHTML = CATEGORIES.map(cat => {
  const n = VAULT_PROJECTS[cat].length;
  return `<button class="switcher-btn" data-group="${cat}" onclick="openGroup('${cat}')">${cat}<span class="sw-count">${n}</span></button>`;
}).join('');

/* ── glitch → openGroup ── */
function glitchOpen(card, groupId) {
  if (card.classList.contains('glitching')) return;
  card.classList.add('glitching');
  setTimeout(() => { card.classList.remove('glitching'); openGroup(groupId); }, 420);
}

/* ── apri gruppo ── */
function openGroup(id) {
  currentGroup = id;
  const projects = VAULT_PROJECTS[id] || [];
  const n = projects.length;

  document.getElementById('grp-label').textContent = id + ' //';
  document.getElementById('grp-title').textContent = id;
  document.getElementById('grp-count').textContent = '// ' + n + ' PROJECT' + (n !== 1 ? 'S' : '');

  const groupPage = document.querySelector('.group-page[data-group="' + id + '"]');
  groupPage.innerHTML = n === 0
    ? `<div style="padding:80px 0;text-align:center;font-size:11px;letter-spacing:0.3em;color:var(--text-dim)">// NO FILES IN THIS CATEGORY YET</div>`
    : projects.map(p => {
        const mediaBg = p.type === 'video'
          ? `<video class="card-bg" data-src="${p.src}" muted playsinline preload="none" loop></video>`
          : `<img class="card-bg" src="${p.src}" alt="${p.name}" loading="lazy">`;
        return `
          <div class="folder-card" onclick="openProject('${p.id}')">
            <div class="folder-tab">
              <span class="tab-code">${p.code} //</span>
              <span class="tab-name">${p.name}</span>
              <span class="tab-arrow">→</span>
            </div>
            <div class="folder-body">
              ${mediaBg}
              <div class="card-overlay">
                <div class="overlay-tag">${p.tags.join(' — ')}</div>
              </div>
            </div>
          </div>`;
      }).join('');

  document.querySelectorAll('.group-page').forEach(p => p.classList.remove('active'));
  groupPage.classList.add('active');
  document.querySelectorAll('.switcher-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.group === id)
  );

  document.getElementById('vault-main').style.display         = 'none';
  document.getElementById('vault-project-view').style.display = 'none';
  document.getElementById('vault-group-view').style.display   = 'block';

  initCards();
  window.scrollTo(0, 0);
}

/* ── torna alla vault main ── */
function backToVault() {
  stopProjectMedia();
  document.getElementById('vault-group-view').style.display   = 'none';
  document.getElementById('vault-project-view').style.display = 'none';
  document.getElementById('vault-main').style.display         = 'block';
  window.scrollTo(0, 0);
}

/* ── apri pagina singolo progetto ── */
function openProject(id) {
  let p = null;
  for (const cat of Object.keys(VAULT_PROJECTS)) {
    p = VAULT_PROJECTS[cat].find(proj => proj.id === id);
    if (p) break;
  }
  if (!p) return;
  currentGroup = p.group;

  /* header */
  document.getElementById('proj-code').textContent         = p.code + ' //';
  document.getElementById('proj-name').textContent         = p.name;
  document.getElementById('proj-tags-display').textContent = p.tags.join('  —  ');
  document.getElementById('proj-back-btn').textContent     = '← ' + p.group.toUpperCase();
  document.getElementById('header-page-title').textContent = '[' + p.code + '\\\\' + p.name + ']';

  /* media principale */
  const wrap = document.getElementById('proj-media-wrap');
  cleanup3dMain = null;
  if (p.type === 'video') {
    wrap.innerHTML = `<video src="${p.src}" autoplay loop muted playsinline controls preload="none"></video>`;
  } else if (p.type === '3d') {
    wrap.innerHTML = `<div class="vault-3d-container" id="vault-3d-main"></div>`;
    requestAnimationFrame(() => {
      const c = document.getElementById('vault-3d-main');
      if (c && window.init3DViewer) cleanup3dMain = window.init3DViewer(c, p.src);
    });
  } else {
    wrap.innerHTML = `<img src="${p.src}" alt="${p.name}">`;
  }
  /* tag row */
  const tagsHtml = p.tags.map(t => `<span class="proj-meta-tag">${t}</span>`).join('');
  wrap.insertAdjacentHTML('afterend', `<div class="proj-meta" id="proj-meta-tags">${tagsHtml}</div>`);

  /* WIP grid */
  const grid = document.getElementById('wip-grid');
  if (p.wip && p.wip.length > 0) {
    grid.innerHTML = p.wip.map(w => {
      const media = w.src
        ? (w.type === 'video'
            ? `<video class="wip-media" data-src="${w.src}" muted playsinline preload="none"></video>`
            : w.type === '3d'
              ? `<div class="wip-media wip-3d-thumb"><span style="font-size:9px;letter-spacing:.25em;color:var(--teal)">// 3D</span></div>`
              : `<img class="wip-media" src="${w.src}" alt="${w.desc}" loading="lazy">`)
        : `<div class="wip-placeholder"><span class="wip-placeholder-code">${w.step} //</span><span class="wip-placeholder-status">PENDING</span></div>`;
      return `<div class="wip-card" data-src="${w.src||''}" data-type="${w.type}" data-step="${w.step}" data-desc="${w.desc}">${media}<div class="wip-info"><div class="wip-step">${w.step} //</div><div class="wip-desc">${w.desc}</div></div></div>`;
    }).join('');
  } else {
    /* placeholder quando i WIP non sono ancora stati caricati */
    grid.innerHTML = [1,2,3,4].map(n => `
      <div class="wip-card">
        <div class="wip-placeholder">
          <span class="wip-placeholder-code">WIP_0${n} //</span>
          <span class="wip-placeholder-status">— PENDING UPLOAD —</span>
        </div>
        <div class="wip-info">
          <div class="wip-step">WIP_0${n} //</div>
          <div class="wip-desc">PENDING</div>
        </div>
      </div>`).join('');
  }

  /* lazy-load wip videos */
  const wipObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const v = entry.target.querySelector('video[data-src]');
      if (v && !v.src) v.src = v.dataset.src;
      wipObserver.unobserve(entry.target);
    });
  }, { rootMargin: '200px' });
  grid.querySelectorAll('.wip-card').forEach(c => wipObserver.observe(c));

  /* click → lightbox WIP */
  grid.addEventListener('click', e => {
    const card = e.target.closest('.wip-card[data-src]');
    if (!card || !card.dataset.src) return;
    openWipLightbox(card.dataset.src, card.dataset.type, card.dataset.step, card.dataset.desc);
  });

  /* mostra project view */
  document.getElementById('vault-group-view').style.display   = 'none';
  document.getElementById('vault-project-view').style.display = 'block';
  window.scrollTo(0, 0);
}

/* ── torna al gruppo dal progetto ── */
function backToGroup() {
  stopProjectMedia();
  /* pulisce meta tags dinamici */
  const mt = document.getElementById('proj-meta-tags');
  if (mt) mt.remove();
  document.getElementById('header-page-title').textContent = '[SCAN\\\\THE_VAULT]';
  document.getElementById('vault-project-view').style.display = 'none';
  openGroup(currentGroup);
}

/* ── lightbox per i WIP ── */
let cleanupWipLb = null;
function openWipLightbox(src, type, step, desc) {
  let mediaHTML, is3d = type === '3d';
  if (is3d) {
    mediaHTML = `<div class="wip-lb-3d-wrap" id="wip-lb-3d"></div>`;
  } else if (type === 'video') {
    mediaHTML = `<video src="${src}" autoplay loop muted playsinline controls></video>`;
  } else {
    mediaHTML = `<img src="${src}" alt="${desc}">`;
  }

  const overlay = document.createElement('div');
  overlay.className = 'wip-lb-overlay';
  overlay.innerHTML = `
    <div class="wip-lb-inner">
      <span class="wip-lb-close">[✕ CLOSE]</span>
      ${mediaHTML}
      <div class="wip-lb-meta">
        <span class="wip-lb-step">${step} //</span>
        <span class="wip-lb-desc">${desc}</span>
        ${is3d ? '<span class="wip-lb-hint">drag to rotate · scroll to zoom</span>' : ''}
      </div>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('wip-lb-open'));

  if (is3d) {
    requestAnimationFrame(() => {
      const wrap = document.getElementById('wip-lb-3d');
      if (wrap && window.init3DViewer) cleanupWipLb = window.init3DViewer(wrap, src);
    });
  }

  const close = () => {
    if (cleanupWipLb) { cleanupWipLb(); cleanupWipLb = null; }
    overlay.classList.remove('wip-lb-open');
    overlay.classList.add('wip-lb-closing');
    setTimeout(() => overlay.remove(), 400);
    document.removeEventListener('keydown', onKey);
  };
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('.wip-lb-close').addEventListener('click', close);
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
}

function stopProjectMedia() {
  document.querySelectorAll('#proj-media-wrap video').forEach(v => { v.pause(); v.src = ''; });
  if (cleanup3dMain) { cleanup3dMain(); cleanup3dMain = null; }
}

/* ── z-index + lazy-load + hover video per le folder-card del gruppo attivo ── */
function initCards() {
  const cards = document.querySelectorAll('.group-page.active .folder-card');
  cards.forEach((c, i) => { c.style.zIndex = i + 1; });
  cards.forEach(card => {
    const v = card.querySelector('video.card-bg');
    if (!v) return;
    v.addEventListener('timeupdate', () => { if (v.currentTime >= 5) v.currentTime = 0; });
    card.addEventListener('mouseenter', () => {
      if (!v.src && v.dataset.src) v.src = v.dataset.src;
      v.currentTime = 0; v.play();
    });
    card.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
  });
}
