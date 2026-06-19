# MVL — sito

Sito statico (HTML/CSS/JS, nessun framework). Si apre direttamente nel browser e si pubblica su GitHub Pages.

Sito online: https://github.com/sebazuccarello-rgb/sito_MVL

---

## Mappa delle cartelle

```
sito_MVL/
├── index.html          Home (la "bussola" con i link alle sezioni)
├── vision.html         [WORLD\THE_VISION]
├── laboratory.html     [BASE\LABORATORY]   → lavori in corso (WIP)
├── vault.html          [SCAN\THE_VAULT]    → lavori finiti (DEF)
├── services.html       [HIRE\SERVICES]     → pagina servizi/prezzi
├── raw-idea.html       Form contatti (nascosto: ci si arriva da services)
├── privacy.html        Privacy & cookie
├── login.html          Accesso area admin
├── admin.html          Pannello admin
│
├── assets/             Immagini del sito (logo, sfondo, polaroid)
├── css/                style.css  → tutti gli stili condivisi
├── fonts/              Font (.woff2 = versione leggera usata, .ttf = fallback)
├── js/                 Script del sito
│   ├── main.js         Logica comune
│   ├── dust.js         Effetto particelle
│   ├── projects.js     ELENCO PROGETTI (auto-generato, non modificare a mano)
│   └── viewer3d.js     Visualizzatore modelli 3D
│
├── projects/           I CONTENUTI (foto, video, modelli 3D)
│   ├── laboratory/     WIP   → file: NOMEPROGETTO_WIPn.ext
│   └── vault/          DEF   → sottocartelle = categorie (es. TEXTURING/)
│                              file: NOMEPROGETTO_DEF.ext
│
├── tools/              Script di gestione (non fanno parte del sito)
│   ├── sync.mjs        Pubblica i progetti + comprime le immagini
│   └── compress.mjs    Comprime singole immagini in webp
│
├── SYNC.bat            Doppio click → lancia tools/sync.mjs
├── config.json         Versione del sito
└── README.md           Questo file
```

> `node_modules/` e `_mov_backup/` (originali video) sono esclusi da Git: ignorali.

---

## Come aggiungere un nuovo lavoro

1. Metti il file nella cartella giusta, rispettando il nome:
   - **Work in progress** → `projects/laboratory/` con nome `NOME_WIP1.jpg` (WIP2, WIP3…)
   - **Lavoro finito** → `projects/vault/CATEGORIA/` con nome `NOME_DEF.jpg`
     (la sottocartella è la categoria, creala tu se non esiste)
   - Formati: immagini `.jpg .png .webp`, video `.mp4`, modelli 3D `.fbx .glb`
2. Doppio click su **`SYNC.bat`** (oppure `node tools/sync.mjs`).
   Lo script comprime le immagini, aggiorna `js/projects.js` e pubblica su GitHub.

> Per i video usa `.mp4` (NON `.mov`: non si vede su molti telefoni).

---

## Salvare le modifiche su GitHub (a mano)

```bash
git add -A
git commit -m "descrizione modifica"
git push
```

---

## Requisiti per chi sviluppa

- **Node.js** (per gli script in `tools/`): https://nodejs.org → poi `npm install`
- Per convertire video in `.mp4`: **ffmpeg** (https://ffmpeg.org)
- Per vedere il sito in locale basta aprire `index.html`, oppure un server statico
  (es. `npx serve .`).
