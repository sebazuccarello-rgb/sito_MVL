/**
 * MVL SYNC
 * Scansiona projects/laboratory/ e projects/vault/CATEGORIA/ e pubblica su GitHub Pages.
 *
 * STRUTTURA:
 *   projects/laboratory/   → file WIP    (formato: NOMEPROGETTO_WIPn.ext)
 *   projects/vault/        → sottocartelle create dall'utente = categorie
 *     MODELLING/           → file DEF    (formato: NOMEPROGETTO_DEF.ext)
 *     VFX/
 *     ...
 *
 * USO: node sync.mjs  (oppure doppio click su SYNC.bat)
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { extname, basename, join } from 'path';
import sharp from 'sharp';

const LAB_DIR    = 'projects/laboratory';
const VAULT_DIR  = 'projects/vault';
const PROJECTS_JS = 'js/projects.js';

const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm']);
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MODEL_EXTS = new Set(['.fbx', '.glb', '.gltf']);

const isMedia = ext => VIDEO_EXTS.has(ext) || IMAGE_EXTS.has(ext) || MODEL_EXTS.has(ext);

console.log('\n── MVL SYNC ──────────────────────────────────\n');

/* ── comprimi immagine → webp se non già webp ── */
async function toWebp(dir, file) {
  const ext  = extname(file).toLowerCase();
  const name = basename(file, ext);
  const src  = join(dir, file);
  const dest = join(dir, name + '.webp');
  if (existsSync(dest)) return name + '.webp';
  try {
    const before = statSync(src).size;
    await sharp(src).webp({ quality: 82 }).toFile(dest);
    const after = statSync(dest).size;
    console.log(`    🖼  ${file} → webp  (-${Math.round((1-after/before)*100)}%)`);
    return name + '.webp';
  } catch {
    return file;
  }
}

/* ── scansiona laboratory/ ── */
console.log('  [ LABORATORY ]');
const rawLabFiles = readdirSync(LAB_DIR).filter(f => {
  const ext = extname(f).toLowerCase();
  return isMedia(ext) && !f.startsWith('.');
});

/* deduplicazione: se esiste jpg e webp con stesso nome, tieni solo webp */
const _labByBase = new Map();
for (const f of rawLabFiles) {
  const ext  = extname(f).toLowerCase();
  const name = basename(f, ext);
  const prev = _labByBase.get(name);
  if (!prev || ext === '.webp') _labByBase.set(name, f);
}
const labFiles = [..._labByBase.values()].sort();

const labEntries = [];
for (const file of labFiles.sort()) {
  const ext  = extname(file).toLowerCase();
  const name = basename(file, ext);
  const m    = name.match(/^(.+?)_(WIP\d+)$/i);
  if (!m) { console.log(`    ⚠ IGNORATO (formato errato): ${file}`); continue; }
  const project = m[1].toUpperCase();
  const wip     = m[2].toUpperCase();
  let finalFile = file;
  let type;
  if (MODEL_EXTS.has(ext)) {
    type = '3d';
  } else if (VIDEO_EXTS.has(ext)) {
    type = 'video';
  } else {
    type = 'img';
    if (ext !== '.webp') finalFile = await toWebp(LAB_DIR, file);
  }
  labEntries.push({ project, wip, src: `projects/laboratory/${finalFile}`, type });
  console.log(`    ✓ ${file}  [${project} / ${wip}]${type === '3d' ? '  [3D MODEL]' : ''}`);
}

/* ── scansiona vault/CATEGORIA/ ── */
console.log('\n  [ VAULT ]');
const vaultEntries = [];
const categories = readdirSync(VAULT_DIR).filter(f =>
  statSync(join(VAULT_DIR, f)).isDirectory()
);

for (const cat of categories.sort()) {
  const catDir  = join(VAULT_DIR, cat);
  const rawCatFiles = readdirSync(catDir).filter(f => {
    const ext = extname(f).toLowerCase();
    return isMedia(ext) && !f.startsWith('.');
  });
  const _catByBase = new Map();
  for (const f of rawCatFiles) {
    const ext = extname(f).toLowerCase();
    const name = basename(f, ext);
    if (!_catByBase.get(name) || ext === '.webp') _catByBase.set(name, f);
  }
  const catFiles = [..._catByBase.values()].sort();
  for (const file of catFiles) {
    const ext  = extname(file).toLowerCase();
    const name = basename(file, ext);
    const m    = name.match(/^(.+?)_DEF$/i);
    if (!m) { console.log(`    ⚠ IGNORATO (formato errato): ${file}`); continue; }
    const project = m[1].toUpperCase();
    let finalFile = file;
    let type;
    if (MODEL_EXTS.has(ext)) {
      type = '3d';
    } else if (VIDEO_EXTS.has(ext)) {
      type = 'video';
    } else {
      type = 'img';
      if (ext !== '.webp') finalFile = await toWebp(catDir, file);
    }
    vaultEntries.push({ project, category: cat.toUpperCase(), src: `projects/vault/${cat}/${finalFile}`, type });
    console.log(`    ✓ ${cat}/${file}  [DEF → VAULT]`);
  }
}

/* ── genera ALL_PROJECTS ── */
const defProjects = new Set(vaultEntries.map(e => e.project));

const allEntries = [];

// lab entries (escludi quelli con DEF)
labEntries.filter(e => !defProjects.has(e.project)).forEach(e => {
  allEntries.push({ file: `${e.project}_${e.wip}`, src: e.src, type: e.type });
});

// vault entries
vaultEntries.forEach(e => {
  // aggiungi prima i WIP corrispondenti (per il WIP log nel vault)
  labEntries.filter(l => l.project === e.project).forEach(l => {
    allEntries.push({ file: `${l.project}_${l.wip}_${e.category}`, src: l.src, type: l.type });
  });
  allEntries.push({ file: `${e.project}_${e.category}_DEF`, src: e.src, type: e.type });
});

const labCount   = labEntries.filter(e => !defProjects.has(e.project)).length;
const vaultCount = vaultEntries.length;
console.log(`\n  Lab: ${labCount} WIP  |  Vault: ${vaultCount} DEF\n`);

/* ── aggiorna js/projects.js ── */
const current = readFileSync(PROJECTS_JS, 'utf8');
const newArray = allEntries.length === 0
  ? '  /* — nessun file trovato — */'
  : allEntries.map(e => `  { file:'${e.file}', src:'${e.src}', type:'${e.type}' },`).join('\n');

const updated = current.replace(
  /const ALL_PROJECTS = \[[\s\S]*?\];/,
  `const ALL_PROJECTS = [\n${newArray}\n];`
);
writeFileSync(PROJECTS_JS, updated, 'utf8');
console.log('  ✓ js/projects.js aggiornato\n');

/* ── git commit + push (salta file > 95MB) ── */
const MAX_MB = 95;
const allProjectFiles = [
  ...readdirSync(LAB_DIR).map(f => `${LAB_DIR}/${f}`),
  ...readdirSync(VAULT_DIR).flatMap(cat => {
    const d = `${VAULT_DIR}/${cat}`;
    try { return readdirSync(d).map(f => `${d}/${f}`); } catch { return []; }
  })
];

const toAdd = [];
const skippedLarge = [];
for (const fp of allProjectFiles) {
  try {
    const mb = statSync(fp).size / 1024 / 1024;
    if (mb > MAX_MB) {
      skippedLarge.push({ fp, mb: mb.toFixed(0) });
    } else {
      toAdd.push(fp);
    }
  } catch {}
}

if (skippedLarge.length > 0) {
  console.log('  ⚠  FILE TROPPO GRANDI per GitHub (max 100MB) — saltati:');
  skippedLarge.forEach(f => console.log(`     ${f.fp}  (${f.mb}MB)`));
  console.log('');
}

/* ── git add ── */
try {
  if (toAdd.length > 0) execSync(`git add ${toAdd.map(f => `"${f}"`).join(' ')} js/projects.js .gitignore`, { stdio: 'pipe' });
  else execSync('git add js/projects.js .gitignore', { stdio: 'pipe' });
} catch(e) {
  console.log('  ✗ git add fallito:', e.stderr?.toString().trim() || e.message);
}

/* ── git commit (solo se ci sono modifiche staged) ── */
let committed = false;
try {
  execSync('git diff --cached --quiet', { stdio: 'pipe' });
  console.log('  (nessuna modifica da committare)\n');
} catch {
  /* exit code 1 = ci sono modifiche staged → committa */
  try {
    execSync(`git commit -m "sync: ${labCount} WIP in lab, ${vaultCount} DEF in vault"`, { stdio: 'pipe' });
    committed = true;
    console.log('  ✓ Commit creato\n');
  } catch(e) {
    console.log('  ✗ git commit fallito:', e.stderr?.toString().trim() || e.message);
  }
}

/* ── git push (sempre, anche se niente di nuovo da committare) ── */
try {
  execSync('git push origin main', { stdio: 'inherit' });
  if (committed) console.log('  ✓ Pubblicato! Attendi 1-2 minuti per GitHub Pages.\n');
  else console.log('  (già aggiornato su GitHub)\n');
} catch(e) {
  console.log('  ✗ git push fallito:', e.message);
}

console.log('── DONE ──────────────────────────────────────\n');
