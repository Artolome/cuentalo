/* Biblioteca y relatos continuos. El taller conserva sus partidas y sus códigos. */
(function () {
  'use strict';
  const D = window.SVHistoriasData, S = window.SVHistoriasState;
  const root = document.getElementById('historiasApp');
  const esc = window.SVApp.esc;
  const NOTE_KEY = 'cuentalo.historias.cuaderno.v1';
  let state, notes = {}, view = {type: 'library'}, storageOK = true;
  try {
    state = S.normalizar(D, localStorage.getItem(S.KEY));
  } catch (_) { state = S.normalizar(D, null); storageOK = false; }
  try {
    const raw = JSON.parse(localStorage.getItem(NOTE_KEY) || '{}');
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      D.stories.forEach(s => { if (typeof raw[s.id] === 'string') notes[s.id] = raw[s.id].slice(0, 5000); });
    }
  } catch (_) { /* Un cuaderno inválido no borra el avance de las historias. */ }
  const get = id => D.stories.find(s => s.id === id);
  const prog = s => S.progreso(D, state, s.id);
  const cover = s => window.SVCubiertas[s.cover];
  const paragraphs = list => list.map(t => '<p>' + esc(t) + '</p>').join('');
  const kind = s => ({adaptacion: 'Adaptación breve', inspiracion: 'Relato inspirado', biografia: 'Viaje biográfico'}[s.kind] || 'Historia ilustrada');
  function save() {
    try { localStorage.setItem(S.KEY, JSON.stringify(state)); storageOK = true; }
    catch (_) { storageOK = false; }
  }
  function saveNotes() {
    try { localStorage.setItem(NOTE_KEY, JSON.stringify(notes)); storageOK = true; }
    catch (_) { storageOK = false; }
  }
  function silence() { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }
  function isolate(on) {
    root.hidden = !on;
    document.body.classList.toggle('leyendo', on);
    ['cab', 'clase', 'juego', 'inicioApp', 'panelNiveles', 'panelLexico'].forEach(id => {
      const n = document.getElementById(id); if (n) n.inert = on;
    });
    if (on) {
      window.SVApp.cerrarPaneles();
      document.querySelectorAll('dialog[open]').forEach(d => d.close());
    }
  }
  function urlFor(v) {
    const url = new URL(location.href);
    ['historia', 'capitulo', 'fin', 'biblioteca', 'taller', 'modo', 'nivel', 'dif', 'aventura', 'lectura'].forEach(k => url.searchParams.delete(k));
    if (v.type !== 'workshop') url.searchParams.set('lectura', '1');
    if (v.type === 'library') url.searchParams.set('biblioteca', '1');
    else if (v.type === 'workshop') url.searchParams.set('taller', '1');
    else {
      url.searchParams.set('historia', v.id);
      if (v.type === 'chapter') url.searchParams.set('capitulo', String(v.index + 1));
      if (v.type === 'ending') url.searchParams.set('fin', '1');
    }
    return url;
  }
  function navigate(v, replace) {
    silence(); view = v;
    try { history[replace ? 'replaceState' : 'pushState']({}, '', urlFor(v)); } catch (_) { /* fichier local */ }
    render();
  }
  function top(back) {
    return '<header class="h-top"><button class="h-wordmark" data-action="library" aria-label="Cuéntalo, biblioteca">Cuéntalo<span>.</span></button>' +
      '<span class="h-top-label">EL PLACER DE UNA HISTORIA</span>' +
      '<button class="h-link" data-action="' + (back ? 'library' : 'workshop') + '">' + (back ? '← Biblioteca' : 'Taller de viñetas ↗') + '</button></header>';
  }
  function footer() {
    return '<footer class="h-footer"><span>Hecho para leer, imaginar y contar.</span><span>' +
      (storageOK ? 'Tu avance se guarda en este navegador · Sin conexión' : 'No se puede guardar aquí. Tu avance dura mientras esta página siga abierta.') +
      '</span></footer>';
  }
  function status(s) {
    const p = prog(s);
    return p.completed ? 'Historia terminada ✓' : p.started ? 'Continuar · capítulo ' + (p.index + 1) + ' de ' + p.total : p.total + ' capítulos · Una historia de principio a fin';
  }
  function library() {
    const cards = D.stories.map((s, i) => '<button class="h-book" data-action="book" data-id="' + esc(s.id) + '" style="--book-color:' + esc(s.color) + '">' +
      '<span class="h-cover"><img src="' + cover(s) + '" alt="" width="720" height="1080"><span class="h-cover-number">0' + (i + 1) + '</span><span class="h-cover-kind">' + kind(s) + '</span></span>' +
      '<span class="h-book-country">' + esc(s.country) + '</span><strong class="h-book-title">' + esc(s.title) + '</strong>' +
      '<span class="h-book-author">' + esc(s.author) + '</span><span class="h-book-desc">' + esc(s.subtitle) + '</span>' +
      '<span class="h-book-cta">' + status(s) + '<span aria-hidden="true">↗</span></span></button>').join('');
    root.innerHTML = top(false) + '<main class="h-library"><div class="h-library-intro"><div><p class="h-eyebrow">LA BIBLIOTECA DE CUÉNTALO</p>' +
      '<h1 tabindex="-1">Elige una historia.<br><em>Entra en su mundo.</em></h1></div><p class="h-intro-copy">Personajes que te acompañan. <br>Capítulos que se enlazan. <br>Un final al que llegar.<small>Abre un libro y sigue el hilo.</small></p></div>' +
      '<div class="h-shelf">' + cards + '</div><p class="h-library-note"><span aria-hidden="true">✧</span> Lee, elige qué explorar y guarda tu propia mirada en el cuaderno final.</p></main>' + footer();
  }
  function chapters(s, current) {
    const p = prog(s);
    return '<ol class="h-chapters">' + s.chapters.map((c, i) =>
      '<li><button data-action="chapter" data-id="' + esc(s.id) + '" data-index="' + i + '"' + (i > p.unlocked ? ' disabled' : '') +
      (current === i ? ' aria-current="step"' : '') + '><span class="h-chapter-num">' + (i + 1).toString().padStart(2, '0') + '</span><span>' + esc(c.title) +
      '</span><span aria-hidden="true">' + (i > p.unlocked ? '·' : p.choices[c.id] ? '✓' : '→') + '</span></button></li>').join('') + '</ol>';
  }
  function sources(s) {
    return '<details class="h-sources"><summary>Sobre esta historia y sus fuentes</summary><p>' + esc(s.description) + '</p><ul>' +
      s.sources.map(src => '<li><a href="' + esc(/^https:\/\//.test(src.url) ? src.url : '#') + '" target="_blank" rel="noopener noreferrer">' + esc(src.label) + ' ↗</a></li>').join('') +
      '</ul><p class="h-small">Los enlaces a las fuentes necesitan conexión. El relato y las ilustraciones funcionan sin ella.</p></details>';
  }
  function overview(s) {
    const p = prog(s);
    root.innerHTML = top(true) + '<main class="h-overview" style="--book-color:' + esc(s.color) + '">' +
      '<div class="h-overview-art"><img src="' + cover(s) + '" alt="Ilustración de los protagonistas de ' + esc(s.title) + '" width="720" height="1080"></div>' +
      '<div class="h-overview-copy"><p class="h-eyebrow">' + esc(s.country) + ' / ' + kind(s) + '</p><h1 tabindex="-1">' + esc(s.title) + '</h1>' +
      '<p class="h-byline">' + esc(s.author) + '</p><p class="h-lead">' + esc(s.subtitle) + '</p><p class="h-description">' + esc(s.description) + '</p>' +
      '<button class="h-primary" data-action="resume" data-id="' + esc(s.id) + '">' + (p.completed ? 'Leer el desenlace' : p.started ? 'Continuar el capítulo ' + (p.index + 1) : 'Empezar esta historia') + ' <span aria-hidden="true">→</span></button>' +
      '<p class="h-save-note">' + status(s) + '</p><h2 class="h-section-label">TE ACOMPAÑAN</h2><ul class="h-cast">' +
      s.characters.map(c => '<li><strong>' + esc(c.name) + '</strong><span>' + esc(c.role) + '</span></li>').join('') +
      '</ul><h2 class="h-section-label">EL CAMINO DE ESTA HISTORIA</h2>' + chapters(s) + sources(s) + '</div></main>' + footer();
  }
  function chapter(s, index) {
    const p = prog(s), i = Math.max(0, Math.min(index, p.unlocked)), c = s.chapters[i];
    view.index = i;
    const picked = c.choices.find(o => o.id === p.choices[c.id]);
    const prev = i > 0 ? s.chapters[i - 1] : null;
    const prevChoice = prev && prev.choices.find(o => o.id === p.choices[prev.id]);
    const recap = prev ? '<details class="h-recap"><summary>En el capítulo anterior</summary><p>' + esc(prev.closing || prevChoice && prevChoice.response || prev.title) + '</p></details>' : '';
    root.innerHTML = top(true) + '<main class="h-reader" style="--book-color:' + esc(s.color) + '">' +
      '<aside class="h-reader-side"><div class="h-reader-portrait"><img src="' + cover(s) + '" alt="Ilustración de ' + esc(s.title) + '" width="720" height="1080"><div><span>' + kind(s) + '</span><strong>' + esc(s.title) + '</strong></div></div>' +
      '<details class="h-index"><summary>Los ' + s.chapters.length + ' capítulos <span>☷</span></summary>' + chapters(s, i) + '<button class="h-link" data-action="book" data-id="' + esc(s.id) + '">Sobre este libro →</button></details></aside>' +
      '<article class="h-page"><div class="h-reading-meta"><span>CAPÍTULO ' + (i + 1).toString().padStart(2, '0') + ' / ' + s.chapters.length.toString().padStart(2, '0') + '</span>' +
      '<button class="h-link" data-action="listen" aria-label="Escuchar este capítulo">Escuchar ♫</button></div>' +
      '<div class="h-progress" role="progressbar" aria-label="Avance de la historia" aria-valuemin="0" aria-valuemax="' + s.chapters.length + '" aria-valuenow="' + (p.completed ? p.total : p.index) + '">' +
      s.chapters.map((_, j) => '<span class="' + (j < p.index || p.completed ? 'done' : j === i ? 'now' : '') + '"></span>').join('') + '</div>' +
      '<h1 tabindex="-1">' + esc(c.title) + '</h1><p class="h-place">' + esc(c.place) + (c.year ? ' · ' + esc(c.year) : '') + '</p>' + recap +
      '<div class="h-prose">' + paragraphs(c.paragraphs) + '</div>' +
      '<figure class="h-scene"><img src="' + (window.SVFondos[c.scene] || window.SVFondos[s.cover]) + '" alt="Ambientación ilustrada: ' + esc(c.place) + '" width="1024" height="640"><figcaption>' + esc(c.place) + ' · Ambientación imaginada</figcaption></figure>' +
      '<section class="h-decision" aria-labelledby="h-question"><p class="h-eyebrow">TU MIRADA EN LA HISTORIA</p><h2 id="h-question">' + esc(c.prompt) + '</h2><div class="h-choices">' +
      c.choices.map((o, j) => '<button class="h-choice' + (picked && picked.id === o.id ? ' selected' : '') + '" data-action="choose" data-choice="' + esc(o.id) + '" aria-pressed="' + !!(picked && picked.id === o.id) + '"><span>' + String.fromCharCode(65 + j) + '</span>' + esc(o.label) + '</button>').join('') + '</div>' +
      '<div class="h-response" id="h-response" role="status" aria-live="polite" tabindex="-1"' + (!picked ? ' hidden' : '') + '>' + (picked ? paragraphs([picked.response]) : '') + '</div></section>' +
      '<div class="h-page-bottom"><button class="h-link" data-action="' + (i ? 'previous' : 'book') + '" data-id="' + esc(s.id) + '">' + (i ? '← Capítulo anterior' : '← Presentación') + '</button>' +
      '<button class="h-primary" data-action="next"' + (!picked ? ' disabled' : '') + '>' + (i === s.chapters.length - 1 ? 'Descubrir el final' : 'Siguiente capítulo') + ' <span aria-hidden="true">→</span></button></div>' +
      (!picked ? '<p class="h-next-hint">Elige qué explorar para continuar. No hay una respuesta incorrecta.</p>' : '') + '</article></main>' + footer();
  }
  function ending(s) {
    const p = prog(s);
    if (!p.completed) { view = {type:'chapter', id:s.id, index:p.index}; chapter(s, p.index); return; }
    root.innerHTML = top(true) + '<main class="h-ending" style="--book-color:' + esc(s.color) + '"><div class="h-ending-banner"><img src="' + cover(s) + '" alt="" width="720" height="1080"><div>' +
      '<p class="h-eyebrow">HAS LLEGADO AL FINAL</p><h1 tabindex="-1">' + esc(s.ending.title) + '</h1><p>' + esc(s.title) + ' · ' + p.total + ' capítulos compartidos</p></div></div>' +
      '<div class="h-ending-content"><div class="h-prose">' + paragraphs(s.ending.paragraphs) + '</div><details class="h-memories"><summary>Mi recorrido · las ' + p.total + ' miradas que elegí</summary><ol>' +
      s.chapters.map(c => { const o = c.choices.find(o => o.id === p.choices[c.id]); return '<li><strong>' + esc(c.title) + '</strong><p>' + esc(o.label) + '</p><p>' + esc(o.response) + '</p></li>'; }).join('') +
      '</ol></details><section class="h-notebook"><p class="h-eyebrow">AHORA, CUÉNTALO TÚ</p><h2><label for="h-note">' + esc(s.ending.question) + '</label></h2>' +
      '<textarea id="h-note" maxlength="5000" rows="5" placeholder="De esta historia me llevo…">' + esc(notes[s.id] || '') + '</textarea><div class="h-notebook-bottom"><span id="h-note-status" role="status">' +
      (storageOK ? 'Tu cuaderno se guarda solo en este navegador.' : 'Tu cuaderno no se puede guardar aquí. Puedes descargarlo.') +
      '</span><button class="h-link" data-action="download">Descargar mi cuaderno ↓</button></div></section>' +
      '<div class="h-ending-actions"><button class="h-primary" data-action="library">Elegir otra historia →</button><button class="h-link" data-action="chapter" data-id="' + esc(s.id) + '" data-index="0">Releer desde el principio</button></div>' +
      sources(s) + '</div></main>' + footer();
    root.querySelector('#h-note').addEventListener('input', ev => {
      notes[s.id] = ev.target.value; saveNotes();
      root.querySelector('#h-note-status').textContent = storageOK ? 'Cuaderno guardado en este navegador.' : 'No se puede guardar aquí. Descarga tu cuaderno antes de salir.';
    });
  }
  function render() {
    if (view.type === 'workshop') {
      isolate(false); window.SVApp.pintarInicio(); document.title = 'Cuéntalo · Taller de viñetas'; return;
    }
    isolate(true);
    const s = get(view.id);
    if (view.type !== 'library' && !s) view = {type:'library'};
    if (view.type === 'library') library();
    else if (view.type === 'book') overview(s);
    else if (view.type === 'chapter') chapter(s, view.index);
    else if (view.type === 'ending') ending(s);
    document.title = s && view.type !== 'library' ? s.title + ' · Cuéntalo' : 'Cuéntalo · Elige una historia';
    root.scrollTop = 0;
    const title = root.querySelector('h1'); if (title) title.focus({preventScroll:true});
  }
  function download(s) {
    const p = prog(s);
    const text = [s.title, s.author, '', 'MI RECORRIDO', ...s.chapters.flatMap((c, i) => {
      const o = c.choices.find(o => o.id === p.choices[c.id]);
      return ['', (i + 1) + '. ' + c.title, o.label, o.response];
    }), '', 'MI CUADERNO', s.ending.question, notes[s.id] || '', '', 'Cuéntalo · ' + kind(s)].join('\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF' + text], {type:'text/plain;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url; a.download = 'cuentalo-' + s.id + '-mi-cuaderno.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  root.addEventListener('click', ev => {
    const b = ev.target.closest('button[data-action]'); if (!b || b.disabled) return;
    const a = b.dataset.action, s = get(b.dataset.id || view.id);
    if (a === 'library') navigate({type:'library'});
    else if (a === 'workshop') navigate({type:'workshop'});
    else if (a === 'book') navigate({type:'book', id:s.id});
    else if (a === 'resume') {
      const p = prog(s); navigate(p.completed ? {type:'ending', id:s.id} : {type:'chapter', id:s.id, index:p.index});
    } else if (a === 'chapter') navigate({type:'chapter', id:s.id, index:Math.min(+b.dataset.index, prog(s).unlocked)});
    else if (a === 'previous') navigate({type:'chapter', id:s.id, index:view.index - 1});
    else if (a === 'choose') {
      const scroll = root.scrollTop;
      state = S.elegir(D, state, s.id, view.index, b.dataset.choice); save();
      chapter(s, view.index); root.scrollTop = scroll;
      root.querySelector('#h-response').focus({preventScroll:true});
    } else if (a === 'next') {
      const p = prog(s), i = view.index;
      if (!p.choices[s.chapters[i].id]) return;
      if (i === p.index && !p.completed) { state = S.avanzar(D, state, s.id); save(); }
      navigate(i === s.chapters.length - 1 ? {type:'ending', id:s.id} : {type:'chapter', id:s.id, index:i + 1});
    } else if (a === 'listen') {
      const c = s.chapters[view.index];
      window.SVApp.hablar(c.title + '. ' + c.paragraphs.join(' '));
    } else if (a === 'download') download(s);
  });
  function route() {
    silence();
    const q = new URLSearchParams(location.search), s = get(q.get('historia'));
    if (!q.has('lectura') && !q.has('taller') && !q.has('nivel') && !q.has('modo')) { isolate(false); return; }
    if (s) {
      const p = prog(s), n = Number(q.get('capitulo'));
      view = q.has('fin') && p.completed ? {type:'ending', id:s.id} :
        Number.isInteger(n) && n > 0 ? {type:'chapter', id:s.id, index:Math.min(n - 1, p.unlocked)} : {type:'book', id:s.id};
    } else if (q.has('taller') || q.has('nivel') || q.has('modo')) {
      // Los enlaces existentes siguen abriendo exactamente el taller solicitado.
      isolate(false);
      if (q.has('taller')) { view = {type:'workshop'}; render(); }
      else {
        const app = window.SVApp, settings = app.ajustes();
        if (['1', '2', '3'].includes(q.get('dif'))) settings.dif = +q.get('dif');
        const mode = ['solo', 'pizarra'].includes(q.get('modo')) ? q.get('modo') : settings.modo || 'solo';
        if (mode !== settings.modo) app.elegirModo(mode);
        const id = q.get('nivel');
        if (window.SVContenido.NIVELES.concat(app.extra()).some(n => n.id === id) && app.nivel().id !== id) app.abrirNivel(id);
        else app.pintarTodo();
        document.getElementById('inicioApp').hidden = true;
        app.guardar(); document.title = 'Cuéntalo · Taller de viñetas';
      }
      return;
    } else view = {type:'library'};
    render();
  }
  window.addEventListener('popstate', route);
  window.SVHistorias = {
    ocultar() { silence(); isolate(false); },
    route,
    biblioteca() { navigate({type:'library'}); },
    activo() { return !root.hidden; },
    borrar() { state = S.normalizar(D, null); notes = {}; save(); saveNotes(); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', route); else route();
})();
