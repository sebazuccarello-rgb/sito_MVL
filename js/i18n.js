/* ════════════════════════════════════════════════
   MVL // i18n — switch lingua IT / EN
   - testo:        data-i18n="key"        → innerHTML
   - placeholder:  data-i18n-ph="key"     → attributo placeholder
   - scelta salvata in localStorage, default IT
   Le label cyber/brand (LABORATORY, THE_VAULT, ecc.)
   NON si traducono: restano l'estetica del sito.
═══════════════════════════════════════════════════ */
(function () {
  const STORE_KEY = 'mvl_lang';
  const DEFAULT   = 'it';

  const dict = {
    /* ─────────────── SERVICES ─────────────── */
    'svc.heading': {
      it: '"NON DIRMI<br>COSA VUOI,<br>DIMMI LA TUA <span>VISION</span>"',
      en: '"DON\'T TELL ME<br>WHAT YOU WANT,<br>TELL ME YOUR <span>VISION</span>"'
    },
    'svc.sub': {
      it: 'Reel, motion e grafica per chi vuole distinguersi.<br>Trasformo un\'idea grezza in qualcosa che le persone ricordano.',
      en: 'Reel, motion and graphics for those who want to stand out.<br>I turn a raw idea into something people remember.'
    },
    'svc.c1p': {
      it: 'Montaggio dinamico per Instagram, TikTok e YouTube. Ritmo, sound design e taglio pensati per trattenere lo sguardo.',
      en: 'Dynamic editing for Instagram, TikTok and YouTube. Pacing, sound design and cuts built to hold the gaze.'
    },
    'svc.c2h': { it: 'Motion &amp; Titoli', en: 'Motion &amp; Titles' },
    'svc.c2p': {
      it: 'Loghi animati, intro, lower-third, transizioni e animazioni grafiche che danno carattere al video.',
      en: 'Animated logos, intros, lower-thirds, transitions and motion graphics that give the video character.'
    },
    'svc.c3h': { it: 'Grafica', en: 'Graphics' },
    'svc.c3p': {
      it: 'Locandine, copertine, post social e identità visiva coerente, costruita attorno al tuo mood.',
      en: 'Posters, covers, social posts and a coherent visual identity built around your mood.'
    },
    'svc.p1': {
      it: '1 reel montato (max 60s) + 1 revisione inclusa.',
      en: '1 edited reel (max 60s) + 1 revision included.'
    },
    'svc.pr1': { it: 'da 50€', en: 'from 50€' },
    'svc.p2': {
      it: '4 reel al mese + cover grafiche. Presenza social costante.',
      en: '4 reels per month + graphic covers. Constant social presence.'
    },
    'svc.pr2': { it: 'da 180€', en: 'from 180€' },
    'svc.pr2s': { it: '// al mese', en: '// per month' },
    'svc.p3': {
      it: 'Motion, grafica o progetti su misura. Parliamone.',
      en: 'Motion, graphics or tailor-made projects. Let\'s talk.'
    },
    'svc.pr3': { it: 'su preventivo', en: 'on quote' },

    /* ─────────────── VISION ─────────────── */
    'vis.bio': {
      it: '<p>Mi chiamo <em>Sebastiano Zuccarello</em>, ho 20 anni, ho studiato graphic design e comunicazione alle superiori e poi ho frequentato <em>Bigrock</em> nel 2026 subito dopo il diploma. Amo sperimentare con i software e immergermi in ogni campo dell\'arte visiva — 2D, 3D e anche supporti fisici.</p><p>Cosa mi ha portato qui? La voglia di trasmettere emozioni attraverso una visione <em>determinata, sperimentale e quasi aliena.</em></p>',
      en: '<p>My name is <em>Sebastiano Zuccarello</em>, a 20-year-old who studied graphic design and communication in high school, then attended <em>Bigrock</em> in 2026 right after graduating. I love experimenting with software and diving into every field of visual art — 2D, 3D, and even physical media.</p><p>What brought me here? My drive to transmit emotions through a vision that is <em>determined, experimental, and almost alien.</em></p>'
    },
    'vis.based': { it: 'Treviso, Italia', en: 'Treviso, Italy' },
    'vis.q1': {
      it: 'La mia Vision? <span>È la tua Vision.</span>',
      en: 'My Vision? <span>It\'s your Vision.</span>'
    },
    'vis.body': {
      it: 'Quando parliamo, condividiamo ciò che vogliamo trasmettere — così quando mi mandi la tua, il mio obiettivo sarà leggerla, ascoltarla, capirla. Il mio lavoro? Prenderla, modellarla, fonderla e darle vita attraverso la mia Vision.',
      en: 'When we talk, we share what we want to transmit — so when you send me yours, my goal will be to read it, listen to it, understand it. My job? To take it, shape it, merge it and bring it to life through my Vision.'
    },
    'vis.q2': {
      it: 'Tutti hanno una Vision, ma pochi riescono a renderla reale. Ricorda: <span>"OUR VISION, OUR WORLD".</span>',
      en: 'Everyone has a Vision, but few manage to make it real. Remember: <span>"OUR VISION, OUR WORLD".</span>'
    },
    'vis.d1': {
      it: 'Fusione di elementi 2D e 3D, color grading e finishing visivo per costruire immagini coerenti e ad alto impatto.',
      en: 'Merging 2D and 3D elements, color grading and visual finishing to build coherent, high-impact images.'
    },
    'vis.d2': {
      it: 'Creazione di materiali e superfici realistici o stilizzati con Substance Designer e Substance Painter.',
      en: 'Crafting realistic or stylized materials and surfaces using Substance Designer and Substance Painter.'
    },
    'vis.d3': {
      it: 'Animazione di personaggi, motion e simulazioni — dalla posa al movimento fluido, 2D e 3D.',
      en: 'Character animation, motion and simulations — from pose to fluid movement, 2D and 3D.'
    },

    /* ─────────────── RAW_IDEA ─────────────── */
    'raw.sub': {
      it: 'Descrivi la tua visione. Allega dei riferimenti se li hai.<br>Ogni segnale ricevuto verrà elaborato.',
      en: 'Describe your vision. Attach references if you have them.<br>Every signal received will be processed.'
    },
    'raw.phName':  { it: 'Il tuo nome o alias', en: 'Your name or alias' },
    'raw.phEmail': { it: 'Indirizzo email', en: 'Email address' },
    'raw.phText':  {
      it: 'Descrivi la tua idea, il mood, i riferimenti, ogni dettaglio che conta...',
      en: 'Describe your idea, mood, references, any detail that matters...'
    },
    'raw.note': {
      it: '// Tutte le trasmissioni sono riservate. Nessun dato condiviso esternamente.<br>// Per allegare riferimenti visivi, inviali direttamente a <a href="mailto:Seba.zuccarello@gmail.com" style="color:var(--teal);text-decoration:none;">Seba.zuccarello@gmail.com</a>',
      en: '// All transmissions are confidential. No data shared externally.<br>// To attach visual references, send them directly to <a href="mailto:Seba.zuccarello@gmail.com" style="color:var(--teal);text-decoration:none;">Seba.zuccarello@gmail.com</a>'
    },

    /* ─────────────── PRIVACY ─────────────── */
    'priv.updated': { it: 'Maggio 2026', en: 'May 2026' },
    'priv.jur':     { it: 'Italia — UE (GDPR)', en: 'Italy — EU (GDPR)' },
    'priv.t1': { it: 'Quali dati raccogliamo', en: 'What data we collect' },
    'priv.b1': {
      it: '<p>Questo sito è un <em>portfolio personale</em>. Non registra utenti, non richiede account e non raccoglie dati personali in automatico durante la navigazione.</p><p>Se invii un brief tramite la pagina <em>RAW_IDEA</em>, i dati che fornisci (nome, indirizzo email, messaggio ed eventuali file allegati) vengono usati esclusivamente per rispondere alla tua richiesta. Questi dati non vengono condivisi con terze parti e non vengono conservati su database esterni.</p>',
      en: '<p>This site is a <em>personal portfolio</em>. It does not register users, does not require accounts, and does not collect personal data automatically during browsing.</p><p>If you submit a brief via the <em>RAW_IDEA</em> page, the data you provide (name, email address, message, and any attached files) is used exclusively to respond to your request. This data is not shared with third parties and is not stored on external databases.</p>'
    },
    'priv.t2': { it: 'Cookie', en: 'Cookies' },
    'priv.b2': {
      it: '<p>Questo sito non utilizza <em>cookie di profilazione o tracciamento</em>. Non è installata alcuna piattaforma di analytics (Google Analytics, Meta Pixel, ecc.).</p><p>Gli unici cookie eventualmente presenti sono <em>cookie tecnici di sessione</em> gestiti direttamente dal browser, necessari al corretto funzionamento del sito. Questi cookie non raccolgono dati personali e vengono eliminati automaticamente alla chiusura del browser.</p><p>Google Fonts viene caricato dai server di Google per visualizzare il carattere <em>Space Mono</em>. Questo può comportare l\'invio di una richiesta ai server di Google da parte del tuo browser. Per informazioni su come Google tratta questi dati, consulta la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy Policy di Google</a>.</p>',
      en: '<p>This site uses <em>no profiling or tracking cookies</em>. No analytics platforms (Google Analytics, Meta Pixel, etc.) are installed.</p><p>The only cookies that may be present are <em>technical session cookies</em> managed directly by the browser, necessary for the correct functioning of the site. These cookies do not collect personal data and are automatically deleted when the browser is closed.</p><p>Google Fonts is loaded from Google\'s servers to render the <em>Space Mono</em> typeface. This may cause your browser to send a request to Google\'s servers. For information on how Google handles this data, consult <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google\'s Privacy Policy</a>.</p>'
    },
    'priv.t3': { it: 'I tuoi diritti (GDPR)', en: 'Your rights (GDPR)' },
    'priv.b3': {
      it: '<p>Ai sensi del Regolamento UE 2016/679 (GDPR), hai il diritto di accedere, correggere, cancellare o limitare il trattamento dei dati personali che hai fornito. Per esercitare questi diritti, contattaci all\'indirizzo email indicato sopra.</p>',
      en: '<p>Under EU Regulation 2016/679 (GDPR), you have the right to access, correct, delete, or limit the processing of any personal data you have provided. To exercise these rights, contact us at the email address listed above.</p>'
    },
    'priv.t4': { it: 'Hosting', en: 'Hosting' },
    'priv.b4': {
      it: '<p>Questo sito è ospitato su <em>GitHub Pages</em> (GitHub, Inc. — Microsoft). Per informazioni sul trattamento dei dati da parte di GitHub, consulta la <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">Privacy Statement di GitHub</a>.</p>',
      en: '<p>This site is hosted on <em>GitHub Pages</em> (GitHub, Inc. — Microsoft). For information on GitHub\'s data processing, consult <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub\'s Privacy Statement</a>.</p>'
    }
  };

  function getLang() {
    const l = localStorage.getItem(STORE_KEY);
    return (l === 'it' || l === 'en') ? l : DEFAULT;
  }

  function apply(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = dict[el.getAttribute('data-i18n')];
      if (v && v[lang] != null) el.innerHTML = v[lang];
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const v = dict[el.getAttribute('data-i18n-ph')];
      if (v && v[lang] != null) el.setAttribute('placeholder', v[lang]);
    });

    document.querySelectorAll('.lang-toggle button[data-lang]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
  }

  function setLang(lang) {
    if (lang !== 'it' && lang !== 'en') return;
    localStorage.setItem(STORE_KEY, lang);
    apply(lang);
  }

  window.MVL_I18N = { setLang, getLang, apply };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => apply(getLang()));
  } else {
    apply(getLang());
  }
})();
