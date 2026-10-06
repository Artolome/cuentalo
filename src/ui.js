/* Sobrevives — interfaz (maqueta fase 0). Vanilla JS, sin dependencias.
   Arrastrar-soltar + repliegue clic-clic (clic en la carta, clic en la viñeta). Todo en localStorage. */
(function () {
  'use strict';
  const C = window.SVContenido, E = window.SVEngine, AP = window.SVArtePersonajes, AE = window.SVArteEscenas;
  const $ = s => document.querySelector(s);
  const el = (tag, attrs, html) => { const n = document.createElement(tag); if (attrs) for (const k in attrs) { if (k === 'class') n.className = attrs[k]; else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]); else n.setAttribute(k, attrs[k]); } if (html !== undefined) n.innerHTML = html; return n; };
  const PJ = {}; for (const p of C.PERSONAJES) PJ[p.id] = p;
  const ES = {}; for (const e of C.ESCENAS) ES[e.id] = e;
  const KEY = 'sobrevives.progreso.v0';

  /* ---------- estado de la aplicación ---------- */
  let nivel = null, viñetas = [], res = null, seleccion = null, intentos = 0, pistaIdx = 0;
  let progreso = cargar();
  function cargar() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) { return {}; } }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(progreso)); } catch (_) { /* sin almacenamiento */ } }

  /* ---------- voz ---------- */
  let voz = null;
  function elegirVoz() {
    if (!('speechSynthesis' in window)) return;
    const voces = speechSynthesis.getVoices();
    voz = voces.find(v => /^es[-_](ES|MX)/i.test(v.lang)) || voces.find(v => /^es/i.test(v.lang)) || null;
  }
  if ('speechSynthesis' in window) { elegirVoz(); speechSynthesis.onvoiceschanged = elegirVoz; }
  function hablar(texto) {
    if (!('speechSynthesis' in window) || !voz) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.voice = voz; u.lang = voz.lang; u.rate = 0.9;
    speechSynthesis.speak(u);
  }

  /* ---------- toast ---------- */
  let toastT = 0;
  function toast(msg, ms) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), ms || 2600);
  }

  /* ---------- niveles ---------- */
  function abrirNivel(id) {
    nivel = C.NIVELES.find(n => n.id === id) || C.NIVELES[0];
    viñetas = Array.from({ length: nivel.viñetas }, () => ({ escena: null, personajes: [] }));
    seleccion = null; intentos = 0; pistaIdx = 0;
    progreso.actual = nivel.id; guardar();
    pintarTodo();
    hablar(nivel.titulo);
  }
  function siguienteNivel() {
    const i = C.NIVELES.indexOf(nivel);
    const sig = C.NIVELES.slice(i + 1).find(n => !n.libre) || C.NIVELES.find(n => n.libre);
    abrirNivel(sig.id);
  }

  /* ---------- pintar ---------- */
  function pintarTodo() {
    $('#subcap').textContent = nivel.libre ? 'nivel libre' : `capítulo ${nivel.capitulo}`;
    const tt = $('#tituloTxt');
    tt.innerHTML = nivel.libre ? 'Mi historia <span class="alt">(sin título: inventa)</span>' : nivel.titulo;
    tt.classList.remove('ok');
    const ini = $('#inicio');
    const lineas = E.simular(nivel, []).inicio;
    ini.hidden = !lineas.length;
    ini.innerHTML = lineas.length ? `<b>Al principio:</b> ${lineas.join(' ')}` : '';
    pintarStock();
    pintarTira();
    simular();
    pintarNiveles();
    pintarLexico();
  }
  function pintarStock() {
    const se = $('#stockEscenas'); se.innerHTML = '';
    for (const id of nivel.escenas) {
      const e = ES[id];
      const c = el('div', { class: 'carta escena', draggable: 'true', 'data-tipo': 'escena', 'data-id': id, title: e.nombre, role: 'button', tabindex: '0' });
      c.innerHTML = AE.escenaSVG(id) + `<span class="nom">${e.emoji} ${e.nombre}</span>`;
      arrastrable(c, 'escena', id);
      se.appendChild(c);
    }
    const sp = $('#stockPersonajes'); sp.innerHTML = '';
    for (const id of nivel.personajes) {
      const p = PJ[id];
      const c = el('div', { class: 'carta ficha ' + id, draggable: 'true', 'data-tipo': 'personaje', 'data-id': id, title: p.rasgo, role: 'button', tabindex: '0' });
      c.innerHTML = AP.retratoSVG(p) + `<span class="nom">${p.nombre}</span>`;
      arrastrable(c, 'personaje', id);
      sp.appendChild(c);
    }
  }
  function arrastrable(c, tipo, id) {
    c.addEventListener('dragstart', ev => { ev.dataTransfer.setData('text/plain', tipo + ':' + id); ev.dataTransfer.effectAllowed = 'copy'; seleccionar(null); });
    const clic = () => seleccionar(seleccion && seleccion.id === id && seleccion.tipo === tipo ? null : { tipo, id });
    c.addEventListener('click', clic);
    c.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); clic(); } });
  }
  function seleccionar(s) {
    seleccion = s;
    document.querySelectorAll('.carta').forEach(c => c.classList.toggle('sel', !!s && c.dataset.tipo === s.tipo && c.dataset.id === s.id));
    if (s) toast(s.tipo === 'escena' ? `Ahora haz clic en una viñeta para poner «${ES[s.id].nombre}»` : `Ahora haz clic en una viñeta para poner a ${PJ[s.id].nombre}`, 3500);
  }
  function pintarTira() {
    const tira = $('#tira'); tira.innerHTML = '';
    const n = nivel.viñetas;
    tira.style.setProperty('--ancho-vineta', n <= 3 ? '400px' : n === 4 ? '360px' : '330px');
    viñetas.forEach((v, i) => {
      const caja = el('div', { class: 'vineta', 'data-i': i });
      const esc = el('div', { class: 'escena-caja' + (v.escena ? '' : ' vacia'), 'data-i': i, role: 'button', tabindex: '0', 'aria-label': `Viñeta ${i + 1}${v.escena ? ': ' + ES[v.escena].nombre : ' (vacía)'}` });
      esc.addEventListener('keydown', ev => { if ((ev.key === 'Enter' || ev.key === ' ') && seleccion) { ev.preventDefault(); colocar(i, seleccion.tipo, seleccion.id); seleccionar(null); } });
      esc.appendChild(el('span', { class: 'num' }, String(i + 1)));
      if (v.escena) {
        esc.insertAdjacentHTML('beforeend', AE.escenaSVG(v.escena, { clase: 'fondo' }));
        const pjs = el('div', { class: 'personajes' + (v.personajes.length ? '' : ' vacia') });
        esc.appendChild(pjs);
        esc.appendChild(el('button', { class: 'quitar', title: 'Quitar la escena', onclick: ev => { ev.stopPropagation(); viñetas[i] = { escena: null, personajes: [] }; pintarTira(); simular(); } }, '×'));
      }
      // soltar
      esc.addEventListener('dragover', ev => { ev.preventDefault(); ev.dataTransfer.dropEffect = 'copy'; esc.classList.add('sobre'); });
      esc.addEventListener('dragleave', () => esc.classList.remove('sobre'));
      esc.addEventListener('drop', ev => { ev.preventDefault(); esc.classList.remove('sobre'); const [tipo, id] = (ev.dataTransfer.getData('text/plain') || '').split(':'); if (tipo) colocar(i, tipo, id); });
      esc.addEventListener('click', () => { if (seleccion) { colocar(i, seleccion.tipo, seleccion.id); seleccionar(null); } });
      caja.appendChild(esc);
      const frase = el('p', { class: 'frase vacia', title: 'Escuchar' }, '…');
      frase.addEventListener('click', () => { if (frase.textContent && !frase.classList.contains('vacia')) hablar(frase.textContent); });
      caja.appendChild(frase);
      tira.appendChild(caja);
    });
  }
  function colocar(i, tipo, id) {
    const v = viñetas[i];
    if (tipo === 'escena') {
      v.escena = id;
      const slots = ES[id].slots;
      if (v.personajes.length > slots) v.personajes = v.personajes.slice(0, slots);
    } else {
      if (!v.escena) { toast('Primero pon una escena en la viñeta.'); return; }
      if (v.personajes.includes(id)) { toast(`${PJ[id].nombre} ya está en esta viñeta.`); return; }
      const slots = ES[v.escena].slots;
      if (v.personajes.length >= slots) { if (slots === 1) v.personajes = [id]; else v.personajes[slots - 1] = id; }
      else v.personajes.push(id);
    }
    pintarTira(); simular();
  }
  function quitarPersonaje(i, id) { viñetas[i].personajes = viñetas[i].personajes.filter(x => x !== id); pintarTira(); simular(); }

  function simular() {
    res = E.simular(nivel, viñetas, { tiempo: progreso.preterito ? 'pret' : 'pres' });
    // personajes y frases
    document.querySelectorAll('.vineta').forEach((caja, i) => {
      const v = viñetas[i], r = res.viñetas[i];
      const pjs = caja.querySelector('.personajes');
      if (pjs) {
        pjs.innerHTML = '';
        for (const id of r.personajes) {
          const ex = r.estado[id] ? E.expresion(r.estado[id]) : 'contento';
          const w = el('div', { class: 'pj-wrap', title: `${PJ[id].nombre} — clic para quitar` });
          w.innerHTML = AP.personajeSVG(PJ[id], ex, { clase: 'pj' });
          w.style.height = '100%'; w.style.display = 'flex'; w.style.alignItems = 'flex-end';
          w.addEventListener('click', ev => { ev.stopPropagation(); quitarPersonaje(i, id); });
          pjs.appendChild(w);
        }
      }
      const f = caja.querySelector('.frase');
      if (!v.escena) { f.textContent = '…'; f.className = 'frase vacia'; }
      else if (!v.personajes.length) { f.textContent = `${ES[v.escena].nombre}. ¿Quién está aquí?`; f.className = 'frase vacia'; }
      else if (r.frases.length) { f.textContent = r.frases.join(' '); f.className = 'frase' + (r.eventos.some(e => e.tipo === 'yaSalvo') ? ' alerta' : ''); }
      else { f.textContent = '…'; f.className = 'frase vacia'; }
    });
    // estado del nivel
    const est = $('#estadoNivel'), tt = $('#tituloTxt');
    if (nivel.libre) { est.textContent = res.incompleto ? `${viñetas.filter(v => v.escena && v.personajes.length).length}/${nivel.viñetas} viñetas` : '¡Historia completa!'; est.className = res.incompleto ? '' : 'ok'; return; }
    tt.classList.toggle('ok', res.resuelto);
    if (res.resuelto) { est.textContent = '✔ ¡Muy bien!' + (res.secreto ? ' 🔑 ¡Título secreto!' : ''); est.className = 'ok'; exito(); }
    else if (res.incompleto || res.faltan.length) { est.textContent = ''; est.className = ''; }
    else { est.textContent = 'Todavía no…'; est.className = ''; fallo(); }
  }
  let ultimoFallo = '';
  function fallo() {
    const firma = JSON.stringify(viñetas);
    if (firma === ultimoFallo) return;
    ultimoFallo = firma; intentos++;
    if (intentos === 2 && nivel.pistas && nivel.pistas.length) toast('💡 ' + nivel.pistas[0], 5000);
  }
  let exitoMostrado = '';
  function exito() {
    const firma = nivel.id + '|' + JSON.stringify(viñetas);
    if (firma === exitoMostrado) return;
    exitoMostrado = firma;
    const p = progreso[nivel.id] || {};
    p.estrellas = Math.max(p.estrellas || 0, intentos <= 1 ? 3 : intentos <= 3 ? 2 : 1);
    if (res.secreto) p.secreto = true;
    progreso[nivel.id] = p; guardar();
    pintarNiveles();
    const d = $('#dlgExito');
    d.innerHTML = `<h2>¡Muy bien!</h2><div class="grande">${'★'.repeat(p.estrellas)}${'☆'.repeat(3 - p.estrellas)}</div>
      <p><b>${nivel.titulo}</b></p>${res.secreto ? `<p>🔑 Título secreto: <b>${nivel.tituloSecreto || E.tituloDe(nivel.secreto, nivel)}</b></p>` : (nivel.secreto ? '<p class="alt">Hay un título secreto en este nivel… ¿lo encuentras?</p>' : '')}
      <div class="fila"><button class="btn sec" id="btnSeguir">Seguir aquí</button><button class="btn" id="btnLeer">Leer la historia</button><button class="btn verde" id="btnSig">Siguiente nivel →</button></div>`;
    d.querySelector('#btnSeguir').onclick = () => d.close();
    d.querySelector('#btnLeer').onclick = () => { d.close(); quePasa(); };
    d.querySelector('#btnSig').onclick = () => { d.close(); siguienteNivel(); };
    setTimeout(() => d.showModal(), 350);
    hablar(res.frasesTodas.join(' '));
  }

  /* ---------- ¿Qué pasa? ---------- */
  function quePasa() {
    const d = $('#dlgQuePasa');
    const partes = res.viñetas.map((v, i) => `<p data-f="${i}"><b>${i + 1}.</b> ${v.frases.length ? v.frases.join(' ') : '<i>…</i>'}</p>`).join('');
    const resumen = res.resumen.length ? `<h3>Al final</h3>${res.resumen.map(s => `<p class="res">${s}</p>`).join('')}` : '';
    let juicio = '';
    if (!nivel.libre) {
      if (res.resuelto) juicio = `<div class="porque ok">✔ La historia cumple el título: «${nivel.titulo}».</div>`;
      else if (res.porque.length) juicio = `<div class="porque">${res.porque.map(p => `<div>✗ ${p}</div>`).join('')}</div>`;
    }
    d.innerHTML = `<h2>¿Qué pasa?</h2><div class="historia">${partes}${resumen}</div>${juicio}
      <div class="fila"><button class="btn sec" id="btnOir">🔊 Escuchar todo</button><button class="btn" id="btnCerrar">Cerrar</button></div>`;
    d.querySelectorAll('.historia p').forEach(p => p.addEventListener('click', () => hablar(p.textContent.replace(/^\d+\.\s*/, ''))));
    d.querySelector('#btnOir').onclick = () => hablar(res.frasesTodas.concat(res.resumen).join(' '));
    d.querySelector('#btnCerrar').onclick = () => d.close();
    d.showModal();
  }

  /* ---------- paneles ---------- */
  function pintarNiveles() {
    const p = $('#panelNiveles');
    const caps = { 1: 'Capítulo 1 · Solo en la selva', 2: 'Capítulo 2 · Juntos', 3: 'Capítulo 3 · El grupo', 0: 'Nivel libre' };
    let html = `<h2>Niveles <button class="btn sec" id="cerrarNiv">×</button></h2>`;
    for (const c of [1, 2, 3, 0]) {
      html += `<h3>${caps[c]}</h3>`;
      for (const n of C.NIVELES.filter(n => n.capitulo === c)) {
        const pr = progreso[n.id] || {};
        const est = n.libre ? '' : `<span class="estrellas">${'★'.repeat(pr.estrellas || 0)}${'☆'.repeat(3 - (pr.estrellas || 0))}${pr.secreto ? ' 🔑' : ''}</span>`;
        html += `<button class="niv${n === nivel ? ' actual' : ''}${pr.estrellas ? ' hecho' : ''}" data-id="${n.id}"><span>${n.libre ? '✎' : n.viñetas + ' ▭'}</span><span>${n.titulo}</span>${est}</button>`;
      }
    }
    html += `<h3>Datos</h3><button class="btn sec" id="btnBorrarDatos">Borrar mis datos</button><p style="font-size:.9rem;color:var(--tinta2)">Las estrellas se guardan solo en este navegador.</p>`;
    p.innerHTML = html;
    p.querySelector('#cerrarNiv').onclick = () => { p.hidden = true; };
    p.querySelectorAll('.niv').forEach(b => b.onclick = () => { p.hidden = true; abrirNivel(b.dataset.id); });
    p.querySelector('#btnBorrarDatos').onclick = () => { if (confirm('¿Borrar las estrellas y el progreso de este navegador?')) { progreso = {}; guardar(); pintarNiveles(); toast('Datos borrados.'); } };
  }
  function pintarLexico() {
    const p = $('#panelLexico');
    const lex = E.lexicoDe(nivel);
    p.innerHTML = `<h2>Léxico <button class="btn sec" id="cerrarLex">×</button></h2><p style="color:var(--tinta2);font-size:.95rem">Palabras de este nivel. Haz clic para escuchar.</p><div class="lex">${lex.map(w => `<button data-w="${w.palabra}"><span>${w.picto}</span><span>${w.palabra}</span></button>`).join('')}</div>`;
    p.querySelector('#cerrarLex').onclick = () => { p.hidden = true; };
    p.querySelectorAll('.lex button').forEach(b => b.onclick = () => hablar(b.dataset.w));
  }

  /* ---------- botones ---------- */
  $('#btnNiveles').onclick = () => { const p = $('#panelNiveles'); p.hidden = !p.hidden; $('#panelLexico').hidden = true; };
  $('#btnLexico').onclick = () => { const p = $('#panelLexico'); p.hidden = !p.hidden; $('#panelNiveles').hidden = true; };
  $('#btnQuePasa').onclick = quePasa;
  $('#btnReiniciar').onclick = () => { viñetas = viñetas.map(() => ({ escena: null, personajes: [] })); pintarTira(); simular(); };
  $('#btnPista').onclick = () => {
    if (nivel.libre || !nivel.pistas || !nivel.pistas.length) { toast('Aquí no hay pistas: ¡inventa tu historia!'); return; }
    toast('💡 ' + nivel.pistas[pistaIdx % nivel.pistas.length], 5000); pistaIdx++;
  };
  $('#tituloTxt').onclick = () => hablar(nivel.libre ? 'Mi historia' : nivel.titulo);
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') { seleccionar(null); $('#panelNiveles').hidden = true; $('#panelLexico').hidden = true; }
  });

  /* ---------- inicio ---------- */
  abrirNivel(progreso.actual || C.NIVELES[0].id);
})();
