/* version is stored in config.json */
async function loadVersion() {
  try {
    const r = await fetch('config.json');
    const cfg = await r.json();
    const el = document.getElementById('version-tag');
    if (el) el.textContent = `[Version\\${cfg.version}]`;
  } catch (_) {}
}

document.addEventListener('DOMContentLoaded', () => {
  loadVersion();
  /* sfumatura fissa in basso — nasconde lo stacco del gradiente animato */
  const fade = document.createElement('div');
  fade.className = 'page-fade-bottom';
  document.body.appendChild(fade);
});
