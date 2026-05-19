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

const isMedia = ext => VIDEO_EXTS.has(ext) || IMAGE_EXTS.has(ext);

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
const labFiles = readdirSync(LAB_DIR).filter(f => {
  const ext = extname(f).toLowerCase();
  return isMedia(ext) && !f.startsWith('.');
});

const labEntries = [];
for (const file of labFiles.sort()) {
  const ext  = extname(file).toLowerCase();
  const name = basename(file, ext);
  const m    = name.match(/^(.+?)_(WIP\d+)$/i);
  if (!m) { console.log(`    ⚠ IGNORATO (formato errato): ${file}`); continue; }
  const project = m[1].toUpperCase();
  const wip     = m[2].toUpperCase();
  let finalFile = file;
  if (IMAGE_EXTS.has(ext) && ext !== '.webp') finalFile = await toWebp(LAB_DIR, file);
  const type = VIDEO_EXTS.has(ext) ? 'video' : 'img';
  labEntries.push({ project, wip, src: `projects/laboratory/${finalFile}`, type });
  console.log(`    ✓ ${file}  [${project} / ${wip}]`);
}

/* ── scansiona vault/CATEGORIA/ ── */
console.log('\n  [ VAULT ]');
const vaultEntries = [];
const categories = readdirSync(VAULT_DIR).filter(f =>
  statSync(join(VAULT_DIR, f)).isDirectory()
);

for (const cat of categories.sort()) {
  const catDir  = join(VAULT_DIR, cat);
  const catFiles = readdirSync(catDir).filter(f => {
    const ext = extname(f).toLowerCase();
    return isMedia(ext) && !f.startsWith('.');
  });
  for (const file of catFiles.sort()) {
    const ext  = extname(file).toLowerCase();
    const name = basename(file, ext);
    const m    = name.match(/^(.+?)_DEF$/i);
    if (!m) { console.log(`    ⚠ IGNORATO (formato errato): ${file}`); continue; }
    const project = m[1].toUpperCase();
    let finalFile = file;
    if (IMAGE_EXTS.has(ext) && ext !== '.webp') finalFile = await toWebp(catDir, file);
    const type = VIDEO_EXTS.has(ext) ? 'video' : 'img';
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

/* ── git commit + push ── */
try {
  execSync('git add projects/ js/projects.js', { stdio: 'pipe' });
  execSync(`git commit -m "sync: ${labCount} WIP in lab, ${vaultCount} DEF in vault"`, { stdio: 'pipe' });
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('  ✓ Pubblicato! Attendi 1-2 minuti per GitHub Pages.\n');
} catch {
  console.log('  (nessuna modifica da committare)\n');
}

console.log('── DONE ──────────────────────────────────────\n');
