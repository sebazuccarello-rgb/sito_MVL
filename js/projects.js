/* ══════════════════════════════════════════════════════════
   FILE AUTO-GENERATO da sync.mjs — non modificare manualmente.

   STRUTTURA CARTELLE:
     projects/laboratory/NOMEPROGETTO_WIPn.ext       → Laboratory
     projects/vault/CATEGORIA/NOMEPROGETTO_DEF.ext   → Vault

   Per aggiornare: aggiungi i file nelle cartelle e lancia SYNC.bat
══════════════════════════════════════════════════════════ */
const ALL_PROJECTS = [
  { file:'ACTING_WIP1', src:'projects/laboratory/Acting_WIP1.webp', type:'img' },
  { file:'ACTING_WIP2', src:'projects/laboratory/Acting_WIP2.mp4', type:'video' },
  { file:'ACTING_WIP3', src:'projects/laboratory/Acting_WIP3.mp4', type:'video' },
  { file:'GOOFY_WIP1_TEXTURING', src:'projects/laboratory/Goofy_WIP1.fbx', type:'3d' },
  { file:'GOOFY_WIP2_TEXTURING', src:'projects/laboratory/Goofy_WIP2.webp', type:'img' },
  { file:'GOOFY_WIP3_TEXTURING', src:'projects/laboratory/Goofy_WIP3.webp', type:'img' },
  { file:'GOOFY_WIP4_TEXTURING', src:'projects/laboratory/Goofy_WIP4.webp', type:'img' },
  { file:'GOOFY_WIP5_TEXTURING', src:'projects/laboratory/Goofy_WIP5.webp', type:'img' },
  { file:'GOOFY_WIP6_TEXTURING', src:'projects/laboratory/Goofy_WIP6.webp', type:'img' },
  { file:'GOOFY_WIP7_TEXTURING', src:'projects/laboratory/Goofy_WIP7.webp', type:'img' },
  { file:'GOOFY_WIP8_TEXTURING', src:'projects/laboratory/Goofy_WIP8.webp', type:'img' },
  { file:'GOOFY_TEXTURING_DEF', src:'projects/vault/TEXTURING/Goofy_DEF.webp', type:'img' },
];

/* ── parse: estrae nome, wip/def, categoria, isDef dal nome file ── */
function _parseFile(file) {
  // DEF format: NOME_CATEGORIA_DEF
  const mDef = file.match(/^(.+?)_([A-Za-z]+)_DEF$/i);
  if (mDef) {
    return { projectName: mDef[1].toUpperCase(), wipNum: null, category: mDef[2].toUpperCase(), isDef: true };
  }
  // WIP format: NOME_WIPn[_CATEGORIA]
  const mWip = file.match(/^(.+?)_(WIP\d+)(?:_([A-Za-z]+))?$/i);
  if (mWip) {
    return { projectName: mWip[1].toUpperCase(), wipNum: mWip[2].toUpperCase(), category: mWip[3] ? mWip[3].toUpperCase() : null, isDef: false };
  }
  return null;
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
