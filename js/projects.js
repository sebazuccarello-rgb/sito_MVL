/* ══════════════════════════════════════════════════════════
   FILE AUTO-GENERATO da sync.mjs — non modificare manualmente.

   STRUTTURA CARTELLE:
     projects/laboratory/NOMEPROGETTO_WIPn.ext       → Laboratory
     projects/vault/CATEGORIA/NOMEPROGETTO_DEF.ext   → Vault

   Per aggiornare: aggiungi i file nelle cartelle e lancia SYNC.bat
══════════════════════════════════════════════════════════ */
const ALL_PROJECTS = [
  /* — nessun file trovato — */
];

/* ── parse: estrae nome, wip/def, categoria, isDef dal nome file ── */
function _parseFile(file) {
  const m = file.match(/^(.+?)_(WIP\d+)(?:_([A-Z]+))?(_DEF)?$/i);
  if (!m) return null;
  return {
    projectName: m[1].toUpperCase(),
    wipNum:      m[2] ? m[2].toUpperCase() : null,
    category:    m[3] ? m[3].toUpperCase() : null,
    isDef:       !!m[4]
  };
}

/* ── chiavi dei progetti che hanno già un DEF ── */
const _defKeys = new Set(
  ALL_PROJECTS
    .map(e => _parseFile(e.file))
    .filter(p => p?.isDef)
    .map(p => `${p.projectName}__${p.category}`)
);

/* ── LAB_CARDS: WIP senza DEF corrispondente ── */
const LAB_CARDS = ALL_PROJECTS
  .map(e => ({ ...e, _p: _parseFile(e.file) }))
  .filter(e => e._p && !e._p.isDef && !_defKeys.has(`${e._p.projectName}__${e._p.category}`))
  .map(e => ({ src: e.src, type: e.type, code: e._p.wipNum, name: e._p.projectName }));

/* ── VAULT_PROJECTS: DEF raggruppati per categoria ── */
const VAULT_PROJECTS = {};
ALL_PROJECTS.forEach(entry => {
  const p = _parseFile(entry.file);
  if (!p || !p.isDef) return;
  if (!VAULT_PROJECTS[p.category]) VAULT_PROJECTS[p.category] = [];

  const wips = ALL_PROJECTS
    .filter(e => {
      const ep = _parseFile(e.file);
      return ep && !ep.isDef && ep.projectName === p.projectName && ep.category === p.category;
    })
    .sort((a, b) => {
      const na = parseInt(_parseFile(a.file).wipNum?.replace(/\D/g, '') || 0);
      const nb = parseInt(_parseFile(b.file).wipNum?.replace(/\D/g, '') || 0);
      return na - nb;
    })
    .map(e => {
      const ep = _parseFile(e.file);
      return { src: e.src, type: e.type, step: ep.wipNum, desc: ep.projectName + ' — ' + ep.wipNum };
    });

  const idx = VAULT_PROJECTS[p.category].length + 1;
  VAULT_PROJECTS[p.category].push({
    id:    `${p.category}_${String(idx).padStart(3,'0')}`,
    code:  `${p.category}_${String(idx).padStart(3,'0')}`,
    name:  p.projectName,
    src:   entry.src,
    type:  entry.type,
    group: p.category,
    tags:  [p.category],
    wip:   wips
  });
});
