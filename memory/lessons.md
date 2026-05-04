---
name: Lessons Learned — sito_MVL
description: Lezioni apprese durante lo sviluppo del progetto sito_MVL
type: project
---

## 2026-05-04 — Setup iniziale

- La repo era vuota al primo accesso: nessun file tranne la struttura `.git`.
- Il remote GitHub era già configurato correttamente su `https://github.com/sebazuccarello-rgb/sito_MVL.git`.
- Il primo push con `-u origin main` ha funzionato senza problemi.
- Git su Windows sostituisce LF con CRLF (warning atteso, non un errore).
- I file di memory e lessons vengono tenuti nella cartella `memory/` dentro la repo stessa.

## 2026-05-04 — Pulizia file provvisori

- Rimosso `test_provvisorio.md` dopo aver verificato che push/pull funzionano correttamente.
- Struttura finale: `README.md` + cartella `memory/`.

## 2026-05-04 — Build sito completo

- Costruite tutte e 5 le pagine: `index.html`, `laboratory.html`, `vault.html`, `raw-idea.html`, `vision.html`.
- Palette colori estratta da `Occhio.png`: nero profondo (#080808), rosso carminio (#c41e1e), ciano/teal (#00b4c8).
- Font: Space Mono (Google Fonts) — stile archivio/tecnico.
- `config.json` gestisce la versione del sito — basta aggiornare il campo `version` per cambiare `[Version\X.X.X]` su tutte le pagine.
- Effetto polvere (canvas JS) nella pagina Laboratory.
- Vault usa cartelle a scorrimento laterale (hover translateX) ispirate allo schedario dell'immagine Pinterest.
- Asset copiati da `Cartella_Per_Sito_Framer/Asset/` nella cartella `assets/` della repo.
- I progetti nella Vault vanno nominati: `Nome_Cognome_Final_render_nomeprogetto`.
