---
name: Progetto sito_MVL
description: Contesto e stato del progetto sito_MVL su GitHub
type: project
---

Repository GitHub: https://github.com/sebazuccarello-rgb/sito_MVL.git

Progetto inizializzato il 2026-05-04 con un primo commit (README.md) per verificare il funzionamento di push/pull.

**Why:** La repo era vuota, serve un file di partenza per testare il flusso git.
**How to apply:** Aggiornare questa memoria dopo ogni sessione con git commit significativo.

## Stato

- 2026-06-20 (commit 4b3e059): aggiunto sistema lingua IT/EN. Motore `js/i18n.js` (vanilla, `data-i18n`/`data-i18n-ph`, default IT, scelta in localStorage). Toggle IT/EN nell'header di tutte le pagine pubbliche. Tradotti i testi umani di services/vision/raw-idea/privacy; le label cyber (LABORATORY, THE_VAULT, ecc.) restano in inglese come estetica. Home: rinominate label `[PORTFOLIO\\THE_VAULT]` e `[WIP\\LABORATORY]` per chiarezza.
- 2026-08-20 (commit 0458eea): pulizia codice richiesta dall'utente. Rimossi `login.html`/`admin.html` (area admin non serviva). `tools/sync.mjs` ora si ferma con un errore ben visibile se `git push` fallisce (prima falliva in silenzio — causa di un bug reale: sync locale ok ma nulla pubblicato online, scoperto perche i link Instagram non mostravano gli aggiornamenti). `css/style.css` ora contiene lo sfondo animato e l'header condivisi tra le pagine interne (prima duplicati identici in ogni file). JS inline di laboratory.html e vault.html spostato in `js/laboratory.js` e `js/vault.js`.
