/* CARDS viene da projects.js → LAB_CARDS (generato automaticamente) */
const CARDS = LAB_CARDS;

/* ── Layout mosaic: pattern di 40 posizioni, si ripete ogni 27 righe ── */
const TILE_ROWS = 27;
const MOSAIC = [
  /* Blocco A — 7 card, righe 1-4 */
  {c:'1/5',   r:'1/5' }, {c:'5/7',   r:'1/3' }, {c:'7/9',   r:'1/3' },
  {c:'9/13',  r:'1/3' }, {c:'5/7',   r:'3/5' }, {c:'7/11',  r:'3/5' },
  {c:'11/13', r:'3/5' },
  /* Blocco B — 7 card, righe 5-8 */
  {c:'1/3',   r:'5/9' }, {c:'3/6',   r:'5/7' }, {c:'6/10',  r:'5/7' },
  {c:'10/13', r:'5/7' }, {c:'3/7',   r:'7/9' }, {c:'7/10',  r:'7/9' },
  {c:'10/13', r:'7/9' },
  /* Blocco C — 6 card, righe 9-13 */
  {c:'1/5',   r:'9/12'  }, {c:'5/8',   r:'9/11'  }, {c:'8/13',  r:'9/12'  },
  {c:'5/8',   r:'11/14' }, {c:'1/5',   r:'12/14' }, {c:'8/13',  r:'12/14' },
  /* Blocco D — 6 card, righe 14-17 */
  {c:'1/4',   r:'14/16' }, {c:'4/9',   r:'14/18' }, {c:'9/13',  r:'14/16' },
  {c:'1/4',   r:'16/18' }, {c:'9/11',  r:'16/18' }, {c:'11/13', r:'16/18' },
  /* Blocco E — 5 card, righe 18-21 */
  {c:'1/5',   r:'18/22' }, {c:'5/8',   r:'18/20' }, {c:'8/13',  r:'18/20' },
  {c:'5/10',  r:'20/22' }, {c:'10/13', r:'20/22' },
  /* Blocco F — 9 card, righe 22-27 */
  {c:'1/3',   r:'22/26' }, {c:'3/7',   r:'22/24' }, {c:'7/11',  r:'22/24' },
  {c:'11/13', r:'22/26' }, {c:'3/6',   r:'24/26' }, {c:'6/11',  r:'24/26' },
  {c:'1/7',   r:'26/28' }, {c:'7/10',  r:'26/28' }, {c:'10/13', r:'26/28' },
];

/* applica posizione: tila il pattern ogni TILE_ROWS righe */
function applyLayout(card, idx) {
  const m      = MOSAIC[idx % MOSAIC.length];
  const offset = Math.floor(idx / MOSAIC.length) * TILE_ROWS;
  const [rs, re] = m.r.split('/').map(Number);
  card.style.gridColumn = m.c;
  card.style.gridRow    = `${rs + offset} / ${re + offset}`;
}

const grid = document.getElementById('film-grid');
CARDS.forEach((d, i) => {
  const card = document.createElement('div');
  card.className = 'fc';
  const media = d.type === 'video'
    ? `<video class="card-media" data-src="${d.src}" muted playsinline preload="none"></video>`
    : d.type === '3d'
      ? `<div class="card-media card-3d-thumb"><span class="icon-3d">// 3D MODEL</span><span class="label-3d">CLICK TO VIEW</span></div>`
      : `<img class="card-media" src="${d.src}" alt="${d.name}" loading="lazy">`;
  card.innerHTML = `
    ${media}
    <div class="card-info">
      <div class="card-code">${d.code} //</div>
      <div class="card-name">${d.name}</div>
      <div class="card-status"><div class="status-dot"></div><span class="status-text">ACTIVE</span></div>
    </div>`;
  applyLayout(card, i);
  grid.appendChild(card);
});

/* empty state */
if (CARDS.length === 0) document.getElementById('empty-state').classList.add('visible');

/* lazy-load video src when card enters viewport */
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const v = entry.target.querySelector('video[data-src]');
    if (v && !v.src) { v.src = v.dataset.src; }
    videoObserver.unobserve(entry.target);
  });
}, { rootMargin: '200px' });

grid.querySelectorAll('.fc').forEach(card => videoObserver.observe(card));

/* hover preview per i video */
grid.querySelectorAll('.fc').forEach(card => {
  const v = card.querySelector('video.card-media');
  if (!v) return;
  card.addEventListener('mouseenter', () => {
    if (!v.src && v.dataset.src) v.src = v.dataset.src;
    v.currentTime = 0; v.play();
  });
  card.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
});

/* ── click: glitch → lightbox ── */
grid.addEventListener('click', e => {
  const card = e.target.closest('.fc');
  if (!card || card.classList.contains('glitching')) return;
  card.classList.add('glitching');
  setTimeout(() => {
    card.classList.remove('glitching');
    openLightbox(card);
  }, 420);
});

function openLightbox(card) {
  const cRect  = card.getBoundingClientRect();
  const media  = card.querySelector('.card-media');
  const code   = card.querySelector('.card-code')?.textContent || '';
  const name   = card.querySelector('.card-name')?.textContent || '';
  const is3d   = media?.classList.contains('card-3d-thumb');

  /* recupera src dalla card data */
  const cardIdx = [...document.querySelectorAll('.fc')].indexOf(card);
  const cardData = CARDS[cardIdx];

  let mediaHTML;
  if (is3d) {
    mediaHTML = `<div class="lb-3d-container" id="lb-3d-wrap"></div>`;
  } else if (media?.tagName === 'VIDEO') {
    mediaHTML = `<video src="${media.src || media.dataset.src}" autoplay loop muted playsinline></video>`;
  } else if (media?.tagName === 'IMG') {
    mediaHTML = `<img src="${media.src}" alt="${name}">`;
  } else {
    mediaHTML = `<div class="lb-placeholder">[ NO SIGNAL ]</div>`;
  }

  const overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.innerHTML = `
    <div class="lb-inner${is3d ? ' lb-inner--3d' : ''}">
      <div class="lb-close">[✕ CLOSE]</div>
      ${mediaHTML}
      <div class="lb-meta">
        <span class="lb-code">${code}</span>
        <span class="lb-name">${name}</span>
        ${is3d ? '<span class="lb-hint">drag to rotate · scroll to zoom</span>' : ''}
      </div>
    </div>`;
  document.body.appendChild(overlay);

  /* avvia viewer 3D dopo che il DOM è pronto */
  let cleanup3d = null;
  if (is3d && cardData) {
    requestAnimationFrame(() => {
      const wrap = document.getElementById('lb-3d-wrap');
      if (wrap && window.init3DViewer) cleanup3d = window.init3DViewer(wrap, cardData.src);
    });
  }

  const inner = overlay.querySelector('.lb-inner');
  const iRect = inner.getBoundingClientRect();
  const dx    = (cRect.left + cRect.width  / 2) - (iRect.left + iRect.width  / 2);
  const dy    = (cRect.top  + cRect.height / 2) - (iRect.top  + iRect.height / 2);
  const scale = Math.min(cRect.width / iRect.width, cRect.height / iRect.height);

  inner.style.transform  = `translate(${dx}px,${dy}px) scale(${scale})`;
  inner.style.opacity    = '0';
  inner.style.transition = 'none';

  requestAnimationFrame(() => requestAnimationFrame(() => {
    overlay.style.transition = 'background 0.55s ease';
    overlay.style.background = 'rgba(0,0,0,0.97)';
    inner.style.transition   = 'transform 0.82s cubic-bezier(0.16,1,0.3,1), opacity 0.28s ease';
    inner.style.transform    = 'translate(0,0) scale(1)';
    inner.style.opacity      = '1';
  }));

  const close = () => {
    if (cleanup3d) cleanup3d();
    overlay.classList.add('lb-closing');
    setTimeout(() => overlay.remove(), 280);
    document.removeEventListener('keydown', onKey);
  };
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  inner.querySelector('.lb-close').addEventListener('click', close);
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
}
