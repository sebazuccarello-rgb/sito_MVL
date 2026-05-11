/* version is stored in config.json */
async function loadVersion() {
  try {
    const r = await fetch('config.json');
    const cfg = await r.json();
    const el = document.getElementById('version-tag');
    if (el) el.textContent = `[Version\\${cfg.version}]`;
  } catch (_) {}
}

document.addEventListener('DOMContentLoaded', loadVersion);
