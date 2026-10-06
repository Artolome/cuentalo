/* Sobrevives — interfaz principal. Vanilla JS, sin dependencias.
   Arrastrar-soltar + repliegue clic-clic (clic en la carta, clic en la viñeta). Todo en localStorage.
   Expone window.SVApp (ganchos para los módulos Autor / Profe / Escritor / Imprimir, en src/ui-modos.js). */
(function () {
  'use strict';
  const C = window.SVContenido, E = window.SVEngine, AP = window.SVArtePersonajes, AE = window.SVArteEscenas;
  const $ = s => document.querySelector(s);
  const el = (tag, attrs, html) => { const n = document.createElement(tag); if (attrs) for (const k in attrs) { if (k === 'class') n.className = attrs[k]; else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]); else n.setAttribute(k, attrs[k]); } if (html !== undefined) n.innerHTML = html; return n; };
  const PJ = {}; for (const p of C.PERSONAJES) PJ[p.id] = p;
  const ES = {}; for (const e of C.ESCENAS) ES[e.id] = e;
  const KEY = 'sobrevives.progreso.v0';
  const DIF = { 1: 'Paso a paso', 2: 'Estándar', 3: 'Reto' };

  /* ---------- estado de la aplicación ---------- */
  let nivel = null, viñetas = [], res = null, seleccion = null, intentos = 0, pistaIdx = 0;
  let progreso = cargar();
  let extra = []; // niveles de autor (los añade ui-modos.js)
  function cargar() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) { return {}; } }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(progreso)); } catch (_) { /* sin almacenamiento */ } }
  function ajustes() { if (!progreso.ajustes) progreso.ajustes = { modo: null, dif: 2, escritor: false, preterito: false }; return progreso.ajustes; }
  const dif = () => ajustes().dif || 2;
  const tiempo = () => ajustes().preterito ? 'pret' : 'pres';
  const todosNiveles = () => C.NIVELES.concat(extra);

  /* ---------- voz ---------- */
  let voz = null;
  function elegirVoz() {
    if (!('speechSynthesis' in window)) return;
    const voces = speechSynthesis.getVoices();
    voz = voces.find(v => /^es[-_](ES|MX)/i.test(v.lang)) || voces.find(v => /^es/i.test(v.lang)) || null;
  }
  if ('speechSynthesis' in window) { elegirVoz(); speechSynthesis.onvoiceschanged = elegirVoz; }
  function hablar(texto) {
    if (!('speechSynthesis' in window) || !voz || !texto) return;
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

  /* ---------- pantalla de inicio y modos ---------- */
  function pintarInicio() {
    const p = $('#inicioApp');
    p.hidden = false;
    p.querySelector('#cardAutor').hidden = !(window.SVApp && window.SVApp.abrirAutor);
    cerrarPaneles();
  }
  function elegirModo(m) {
    ajustes().modo = m; guardar();
    document.body.classList.toggle('pizarra', m === 'pizarra');
    $('#inicioApp').hidden = true;
    const clase = $('#clase');
    if (m === 'pizarra' && window.SVPizarra && !clase.dataset.montado) { try { window.SVPizarra.montar(clase, { hablar, toast }); clase.dataset.montado = '1'; } catch (e) { console.error(e); } }
    clase.hidden = !(m === 'pizarra' && clase.dataset.montado && ajustes().clase !== false);
    $('#btnClase').hidden = !(m === 'pizarra' && clase.dataset.montado);
    const vis = nivelesVisibles();
    const actual = vis.find(n => n.id === progreso.actual);
    abrirNivel(actual ? actual.id : vis[0].id);
  }

  /* ---------- dificultad (★ / ★★ / ★★★) ---------- */
  function nivelesVisibles() {
    const d = dif(), todos = todosNiveles();
    if (d === 1) return todos.filter(n => n.libre || n.autor || (n.viñetas <= 3 && n.escenas.length <= 3));
    if (d === 3) return todos.filter(n => n.libre || n.autor || n.viñetas >= 4);
    return todos;
  }
  function pintarDif() {
    const d = dif();
    $('#btnDif').textContent = '★'.repeat(d);
    $('#btnDif').title = DIF[d];
    document.querySelectorAll('#menuDif button').forEach(b => b.classList.toggle('actual', +b.dataset.d === d));
    document.body.classList.toggle('paso', d === 1);
    document.body.classList.toggle('reto', d === 3);
  }
  function ponerDif(d) {
    ajustes().dif = d; guardar(); pintarDif();
    $('#menuDif').hidden = true;
    const vis = nivelesVisibles();
    if (nivel && !vis.includes(nivel)) abrirNivel(vis[0].id); else pintarTodo();
  }

  /* ---------- niveles ---------- */
  function abrirNivel(id) {
    nivel = todosNiveles().find(n => n.id === id) || C.NIVELES[0];
    viñetas = Array.from({ length: nivel.viñetas }, () => ({ escena: null, personajes: [] }));
    seleccion = null; intentos = 0; pistaIdx = 0; ultimoFallo = ''; exitoMostrado = '';
    progreso.actual = nivel.id; guardar();
    pintarTodo();
    hablar(nivel.libre ? 'Mi historia' : nivel.titulo);
  }
  function siguienteNivel() {
    const vis = nivelesVisibles(), i = vis.indexOf(nivel);
    const sig = vis.slice(i + 1).find(n => !n.libre) || vis.find(n => n.libre) || vis[0];
    abrirNivel(sig.id);
  }
  function tituloSecreto(n) { return n.tituloSecreto || E.tituloDe(n.secreto, n); }

  /* ---------- pintar ---------- */
  function pintarTodo() {
    pintarDif();
    $('#subcap').textContent = nivel.libre ? 'nivel libre' : nivel.autor ? 'nivel de autor' : `capítulo ${nivel.capitulo}`;
    const tt = $('#tituloTxt');
    tt.innerHTML = nivel.libre ? 'Mi historia <span class="alt">(sin título: inventa)</span>' : nivel.titulo;
    tt.classList.remove('ok');
    // línea «Al principio» + título secreto
    const ini = $('#inicio');
    const lineas = E.simular(nivel, [], { tiempo: tiempo() }).inicio;
    let sec = '';
    if (nivel.secreto) {
      const pr = progreso[nivel.id] || {};
      sec = (pr.secreto || (dif() !== 3 && pr.estrellas)) ? `🔑 Título secreto: <b>${tituloSecreto(nivel)}</b>` : '🔑 Hay un título secreto.';
    }
    ini.hidden = !lineas.length && !sec;
    ini.innerHTML = (lineas.length ? `<span><b>Al principio:</b> ${lineas.join(' ')}</span>` : '') + (sec ? `<span class="sec">${sec}</span>` : '');
    pintarStock();
    pintarTira();
    simular();
    pintarNiveles();
    pintarLexico();
    if (window.SVApp.alPintar) window.SVApp.alPintar();
  }
  function pintarStock() {
    const se = $('#stockEscenas'); se.innerHTML = '';
    for (const id of nivel.escenas) {
      const e = ES[id];
      const c = el('div', { class: 'carta escena', draggable: 'true', 'data-tipo': 'escena', 'data-id': id, title: e.nombre, role: 'button', tabindex: '0' });
      c.innerHTML = AE.escenaSVG(id) + `<span class="nom"><span class="pic">${e.emoji}</span> ${e.nombre}</span>`;
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
    $('#stock').style.setProperty('--n-cartas', nivel.escenas.length + nivel.personajes.length);
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
    document.body.classList.toggle('seleccion', !!s);
    if (s) toast(s.tipo === 'escena' ? `Ahora haz clic en una viñeta para poner «${ES[s.id].nombre}»` : `Ahora haz clic en una viñeta para poner a ${PJ[s.id].nombre}`, 3500);
  }
  function pintarTira() {
    const tira = $('#tira'); tira.innerHTML = '';
    const n = nivel.viñetas;
    // Una sola fila (como una tira de cómic): se lee de izquierda a derecha y cabe en 16:9 sin desplazamiento.
    tira.style.setProperty('--cols', n);
    tira.style.setProperty('--fz', n <= 3 ? 1 : n === 4 ? 0.92 : 0.84);
    viñetas.forEach((v, i) => {
      const caja = el('div', { class: 'vineta', 'data-i': i });
      const esc = el('div', { class: 'escena-caja' + (v.escena ? '' : ' vacia'), 'data-i': i, role: 'button', tabindex: '0', 'aria-label': `Viñeta ${i + 1}${v.escena ? ': ' + ES[v.escena].nombre : ' (vacía)'}` });
      esc.addEventListener('keydown', ev => { if ((ev.key === 'Enter' || ev.key === ' ') && seleccion) { ev.preventDefault(); colocar(i, seleccion.tipo, seleccion.id); seleccionar(null); } });
      esc.appendChild(el('span', { class: 'num' }, String(i + 1)));
      if (v.escena) {
        esc.insertAdjacentHTML('beforeend', AE.escenaSVG(v.escena, { clase: 'fondo' }));
        esc.appendChild(el('span', { class: 'pic-esc', title: ES[v.escena].nombre }, ES[v.escena].emoji));
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
      const frase = el('div', { class: 'frase vacia', title: 'Escuchar' }, '…');
      frase.addEventListener('click', ev => { if (ev.target.closest('button,input,label')) return; if (frase.dataset.texto) hablar(frase.dataset.texto); });
      caja.appendChild(frase);
      tira.appendChild(caja);
    });
    ajustarTira();
  }
  /* Ancho máximo de cada viñeta para que la imagen (16:10) y unas 3 líneas de frase quepan en la altura disponible, sin recortes. */
  function ajustarTira() {
    const tira = $('#tira');
    const h = tira.clientHeight;
    if (!h) return;
    const f = tira.querySelector('.frase');
    const linea = f ? parseFloat(getComputedStyle(f).fontSize) * 1.3 : 20;
    const wmax = Math.max(160, Math.floor((h - linea * 3.4 - 6) * 1.6));
    tira.style.setProperty('--wmax', wmax + 'px');
  }
  window.addEventListener('resize', ajustarTira);
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
    res = E.simular(nivel, viñetas, { tiempo: tiempo() });
    const escritor = !!(window.SVApp.escritor && window.SVApp.escritor.activo());
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
          w.addEventListener('click', ev => { ev.stopPropagation(); quitarPersonaje(i, id); });
          pjs.appendChild(w);
        }
      }
      const f = caja.querySelector('.frase');
      f.dataset.texto = '';
      if (!v.escena) { f.textContent = '…'; f.className = 'frase vacia'; }
      else if (!v.personajes.length) { f.textContent = `${ES[v.escena].nombre}. ¿Quién está aquí?`; f.className = 'frase vacia'; }
      else if (r.frases.length) {
        const texto = r.frases.join(' ');
        f.dataset.texto = texto;
        f.className = 'frase' + (r.eventos.some(e => e.tipo === 'yaSalvo' || e.tipo === 'demasiados') ? ' alerta' : '');
        if (escritor) window.SVApp.escritor.pintar(f, i, texto, res); else f.textContent = texto;
      }
      else { f.textContent = '…'; f.className = 'frase vacia'; }
    });
    // estado del nivel
    const est = $('#estadoNivel'), tt = $('#tituloTxt');
    if (window.SVApp.alSimular) window.SVApp.alSimular(res);
    if (nivel.libre || nivel.enConstruccion) { est.textContent = res.incompleto ? `${viñetas.filter(v => v.escena && v.personajes.length).length}/${nivel.viñetas} viñetas` : (nivel.enConstruccion && !res.valido ? 'Esta historia no vale' : '¡Historia completa!'); est.className = res.incompleto || !res.valido ? '' : 'ok'; $('#btnImprimir').disabled = res.incompleto; return; }
    tt.classList.toggle('ok', res.resuelto);
    $('#btnImprimir').disabled = !res.resuelto;
    if (res.resuelto) { est.textContent = '✔ ¡Muy bien!' + (res.secreto ? ' 🔑 ¡Título secreto!' : ''); est.className = 'ok'; exito(); }
    else if (res.incompleto || res.faltan.length) { est.textContent = ''; est.className = ''; }
    else { est.textContent = 'Todavía no…'; est.className = ''; fallo(); }
  }
  let ultimoFallo = '';
  function fallo() {
    const firma = JSON.stringify(viñetas);
    if (firma === ultimoFallo) return;
    ultimoFallo = firma; intentos++;
    const pistas = nivel.pistas || [];
    if (!pistas.length) return;
    // ★ pista automática cada 2 fallos · ★★ una pista al 4.º fallo · ★★★ nunca
    if (dif() === 1 && intentos % 2 === 0) toast('💡 ' + pistas[(intentos / 2 - 1) % pistas.length], 6000);
    else if (dif() === 2 && intentos === 4) toast('💡 ' + pistas[0], 6000);
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
    if (escritorPendiente()) { toast('✔ La historia es correcta. Ahora escribe las frases.', 4000); return; }
    mostrarExito(p);
  }
  function escritorPendiente() { return !!(window.SVApp.escritor && window.SVApp.escritor.activo() && !window.SVApp.escritor.completo()); }
  function mostrarExito(p) {
    p = p || progreso[nivel.id] || {};
    const d = $('#dlgExito');
    const sec = res.secreto ? `<p>🔑 Título secreto: <b>${tituloSecreto(nivel)}</b></p>` : (nivel.secreto ? '<p class="alt">Hay un título secreto en este nivel… ¿lo encuentras?</p>' : '');
    d.innerHTML = `<h2>¡Muy bien!</h2><div class="grande">${'★'.repeat(p.estrellas || 0)}${'☆'.repeat(3 - (p.estrellas || 0))}</div>
      <p><b>${nivel.titulo}</b></p>${sec}
      <div class="fila"><button class="btn sec" id="btnSeguir">Seguir aquí</button><button class="btn sec" id="btnImprimirDlg">🖨 Imprimir</button><button class="btn" id="btnLeer">Leer la historia</button><button class="btn verde" id="btnSig">Siguiente nivel →</button></div>`;
    d.querySelector('#btnSeguir').onclick = () => d.close();
    d.querySelector('#btnLeer').onclick = () => { d.close(); quePasa(); };
    d.querySelector('#btnSig').onclick = () => { d.close(); siguienteNivel(); };
    const bi = d.querySelector('#btnImprimirDlg');
    if (window.SVApp.imprimir) bi.onclick = () => { d.close(); window.SVApp.imprimir(); }; else bi.hidden = true;
    setTimeout(() => { if (!d.open) d.showModal(); }, 350);
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
  function cerrarPaneles() { $('#panelNiveles').hidden = true; $('#panelLexico').hidden = true; $('#menuDif').hidden = true; }
  function pintarNiveles() {
    const p = $('#panelNiveles');
    const caps = { 1: 'Capítulo 1 · Solo en la selva', 2: 'Capítulo 2 · Juntos', 3: 'Capítulo 3 · El grupo', 0: 'Nivel libre', 9: 'Niveles de la clase' };
    const vis = nivelesVisibles();
    let html = `<h2>Niveles <button class="btn sec cerrar" aria-label="Cerrar">×</button></h2>`;
    for (const c of [1, 2, 3, 0, 9]) {
      const lista = vis.filter(n => (c === 9 ? n.autor : n.capitulo === c && !n.autor));
      if (!lista.length) continue;
      html += `<h3>${caps[c]}</h3>`;
      for (const n of lista) {
        const pr = progreso[n.id] || {};
        const est = n.libre ? '' : `<span class="estrellas">${'★'.repeat(pr.estrellas || 0)}${'☆'.repeat(3 - (pr.estrellas || 0))}${pr.secreto ? ' 🔑' : ''}</span>`;
        html += `<button class="niv${n === nivel ? ' actual' : ''}${pr.estrellas ? ' hecho' : ''}" data-id="${n.id}"><span class="cnt">${n.libre ? '✎' : n.viñetas + ' ▭'}</span><span>${n.titulo}</span>${est}</button>`;
      }
    }
    if (window.SVApp.abrirAutor) html += `<h3>Crear</h3><button class="btn sec" id="btnIrAutor">✎ Crear un nivel</button> <button class="btn sec" id="btnImportar">⌨ Tengo un código</button>`;
    html += `<h3>Datos</h3><button class="btn sec" id="btnBorrarDatos">Borrar mis datos</button><p class="nota">Las estrellas se guardan solo en este navegador. Ningún dato sale de este ordenador.</p>`;
    p.innerHTML = html;
    p.querySelector('.cerrar').onclick = () => { p.hidden = true; };
    p.querySelectorAll('.niv').forEach(b => b.onclick = () => { p.hidden = true; abrirNivel(b.dataset.id); });
    p.querySelector('#btnBorrarDatos').onclick = () => { if (confirm('¿Borrar las estrellas, los ajustes y los niveles creados en este navegador?')) { const modo = ajustes().modo; progreso = {}; ajustes().modo = modo; guardar(); if (window.SVApp.borrarDatos) window.SVApp.borrarDatos(); extra = []; pintarTodo(); toast('Datos borrados.'); } };
    const ia = p.querySelector('#btnIrAutor'); if (ia) ia.onclick = () => { p.hidden = true; window.SVApp.abrirAutor(); };
    const im = p.querySelector('#btnImportar'); if (im) im.onclick = () => { p.hidden = true; window.SVApp.importarCodigo(); };
  }
  function pintarLexico() {
    const p = $('#panelLexico');
    const lex = E.lexicoDe(nivel);
    p.innerHTML = `<h2>Léxico <button class="btn sec cerrar" aria-label="Cerrar">×</button></h2><p class="nota">Palabras de este nivel. Haz clic para escuchar.</p><div class="lex">${lex.map(w => `<button data-w="${w.palabra}"><span>${w.picto}</span><span>${w.palabra}</span></button>`).join('')}</div>`;
    p.querySelector('.cerrar').onclick = () => { p.hidden = true; };
    p.querySelectorAll('.lex button').forEach(b => b.onclick = () => hablar(b.dataset.w));
  }

  /* ---------- botones ---------- */
  $('#btnInicio').onclick = pintarInicio;
  $('#btnNiveles').onclick = () => { const p = $('#panelNiveles'); const h = p.hidden; cerrarPaneles(); p.hidden = !h; };
  $('#btnLexico').onclick = () => { const p = $('#panelLexico'); const h = p.hidden; cerrarPaneles(); p.hidden = !h; };
  $('#btnQuePasa').onclick = quePasa;
  $('#btnReiniciar').onclick = () => { viñetas = viñetas.map(() => ({ escena: null, personajes: [] })); seleccionar(null); pintarTira(); simular(); };
  $('#btnPista').onclick = () => {
    if (nivel.libre || !nivel.pistas || !nivel.pistas.length) { toast('Aquí no hay pistas: ¡inventa tu historia!'); return; }
    toast('💡 ' + nivel.pistas[pistaIdx % nivel.pistas.length], 6000); pistaIdx++;
  };
  $('#btnClase').onclick = () => { const c = $('#clase'); c.hidden = !c.hidden; ajustes().clase = !c.hidden; guardar(); ajustarTira(); };
  $('#btnDif').onclick = ev => { ev.stopPropagation(); const m = $('#menuDif'); const h = m.hidden; cerrarPaneles(); m.hidden = !h; };
  document.querySelectorAll('#menuDif button').forEach(b => b.onclick = () => ponerDif(+b.dataset.d));
  document.addEventListener('click', ev => { if (!ev.target.closest('.dif')) $('#menuDif').hidden = true; });
  $('#tituloTxt').onclick = () => hablar(nivel.libre ? 'Mi historia' : nivel.titulo);
  document.querySelectorAll('#inicioApp [data-modo]').forEach(b => b.onclick = () => elegirModo(b.dataset.modo));
  $('#cardAutor').onclick = () => { if (window.SVApp.abrirAutor) { if (!ajustes().modo) elegirModo('solo'); $('#inicioApp').hidden = true; window.SVApp.abrirAutor(); } };
  document.addEventListener('keydown', ev => {
    if (ev.target.matches('input,textarea,select') || (ev.target.isContentEditable)) return;
    if (ev.key === 'Escape') { seleccionar(null); cerrarPaneles(); }
    if ((ev.key === 'p' || ev.key === 'P') && !ev.ctrlKey && !ev.metaKey && !ev.altKey && window.SVApp.abrirProfe) { ev.preventDefault(); window.SVApp.abrirProfe(); }
  });

  /* ---------- ganchos para los módulos (ui-modos.js) ---------- */
  window.SVApp = {
    nivel: () => nivel, viñetas: () => viñetas, resultado: () => res, progreso: () => progreso, ajustes, guardar, hablar, toast,
    abrirNivel, pintarTodo, simular, elegirModo, pintarInicio, nivelesVisibles, tiempo, dif, tituloSecreto, mostrarExito,
    añadirNiveles(ns) { extra = ns.slice(); },
    extra: () => extra,
    ponerViñetas(vs) { viñetas = Array.from({ length: nivel.viñetas }, (_, i) => ({ escena: vs[i] ? vs[i].escena : null, personajes: vs[i] ? vs[i].personajes.slice() : [] })); seleccionar(null); pintarTira(); simular(); },
    reiniciarIntentos() { intentos = 0; ultimoFallo = ''; exitoMostrado = ''; },
    escritor: null, abrirAutor: null, abrirProfe: null, imprimir: null, importarCodigo: null, borrarDatos: null, alPintar: null
  };

  /* ---------- inicio ---------- */
  function arrancar() {
    if (window.SVApp.iniciarModulos) { try { window.SVApp.iniciarModulos(); } catch (e) { console.error(e); } }
    pintarDif();
    if (ajustes().modo) elegirModo(ajustes().modo); else { abrirNivel(progreso.actual || C.NIVELES[0].id); pintarInicio(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
})();
