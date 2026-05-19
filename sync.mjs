/**
 * MVL SYNC — scansiona projects/, aggiorna js/projects.js e pubblica su GitHub Pages.
 * Uso: node sync.mjs
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync }  from 'child_process';
import { extname, basename, join } from 'path';
import sharp from 'sharp';

const PROJECTS_DIR = 'projects';
const PROJECTS_JS  = 'js/projects.js';
const VIDEO_EXTS   = new Set(['.mp4', '.mov', '.webm']);
const IMAGE_EXTS   = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const line = '─'.repeat(46);
console.log(`\n── MVL SYNC ${line.slice(10)}\n`);

/* ── 1. SCANSIONE ── */
const rawFiles = readdirSync(PROJECTS_DIR)
  .filter(f => {
    const ext = extname(f).toLowerCase();
    return (VIDEO_EXTS.has(ext) || IMAGE_EXTS.has(ext))
      && !f.startsWith('.');
  })
  .sort();

const entries = [];
let skipped = 0;

for (const file of rawFiles) {
  const ext  = extname(file).toLowerCase();
  const name = basename(file, ext);

  /* verifica formato: NOME_WIPn_CATEGORIA[_DEF] */
  const m = name.match(/^(.+?)_(WIP\d+)_([A-Z]+)(_DEF)?$/i);
  if (!m) {
    console.log(`  ⚠  IGNORATO (formato errato): ${file}`);
    skipped++;
    continue;
  }

  const isDef     = !!m[4];
  const category  = m[3].toUpperCase();
  const fileName  = name.toUpperCase();

  /* ── compressione immagini → WebP ── */
  let finalSrc = `${PROJECTS_DIR}/${file}`;
  if (IMAGE_EXTS.has(ext) && ext !== '.webp') {
    const webpPath = join(PROJECTS_DIR, name + '.webp');
    if (!existsSync(webpPath)) {
      try {
        await sharp(join(PROJECTS_DIR, file)).webp({ quality: 82 }).toFile(webpPath);
        const before = (await import('fs')).statSync(join(PROJECTS_DIR, file)).size;
        const after  = (await import('fs')).statSync(webpPath).size;
        console.log(`  🖼  ${file} → webp  (-${Math.round((1 - after/before)*100)}%)`);
      } catch (e) {
        console.log(`  ⚠  Conversione webp fallita per ${file}: ${e.message}`);
      }
    }
    if (existsSync(webpPath)) finalSrc = `${PROJECTS_DIR}/${name}.webp`;
  }

  const type = VIDEO_EXTS.has(ext) ? 'video' : 'img';
  entries.push({ file: fileName, src: finalSrc, type });
  console.log(`  ✓  ${file}${isDef ? '  [DEF → VAULT ' + category + ']' : '  [WIP → LAB]'}`);
}

console.log(`\n  Trovati: ${entries.length} file  |  Ignorati: ${skipped}\n`);

/* ── 2. AGGIORNA js/projects.js ── */
const current = readFileSync(PROJECTS_JS, 'utf8');

const newArray = entries.length === 0
  ? '  /* — nessun file in projects/ — */'
  : entries.map(e => `  { file:'${e.file}', src:'${e.src}', type:'${e.type}' },`).join('\n');

const updated = current.replace(
  /const ALL_PROJECTS = \[[\s\S]*?\];/,
  `const ALL_PROJECTS = [\n${newArray}\n];`
);

writeFileSync(PROJECTS_JS, updated, 'utf8');
console.log(`  ✓  js/projects.js aggiornato\n`);

/* ── 3. GIT COMMIT + PUSH ── */
try {
  execSync(`git add ${PROJECTS_DIR}/ ${PROJECTS_JS}`, { stdio: 'pipe' });
  execSync(
    `git commit -m "sync: ${entries.length} progetti (${entries.filter(e=>e.file.endsWith('_DEF')).length} DEF, ${entries.filter(e=>!e.file.endsWith('_DEF')).length} WIP)"`,
    { stdio: 'pipe' }
  );
  execSync('git push origin main', { stdio: 'inherit' });
  console.log(`\n  ✓  Pubblicato! Attendi 1-2 minuti per GitHub Pages.\n`);
} catch {
  console.log(`  (nessuna modifica da committare)\n`);
}

console.log(`── DONE ${'─'.repeat(40)}\n`);
