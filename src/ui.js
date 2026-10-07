/* Cuéntalo — interfaz principal. Vanilla JS, sin dependencias.
   Arrastrar-soltar + repliegue clic-clic (clic en la carta, clic en la viñeta). Todo en localStorage.
   Expone window.SVApp (ganchos para los módulos Autor / Profe / Escritor / Imprimir, en src/ui-modos.js). */
(function () {
  'use strict';
  const C = window.SVContenido, E = window.SVEngine, AP = window.SVArtePersonajes, AE = window.SVArteEscenas;
  const $ = s => document.querySelector(s);
  const el = (tag, attrs, html) => { const n = document.createElement(tag); if (attrs) for (const k in attrs) { if (k === 'class') n.className = attrs[k]; else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]); else n.setAttribute(k, attrs[k]); } if (html !== undefined) n.innerHTML = html; return n; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); // los títulos de autor son texto libre
  const PJ = {}; for (const p of C.PERSONAJES) PJ[p.id] = p;
  const ES = {}; for (const e of C.ESCENAS) ES[e.id] = e;
  const KEY = 'cuentalo.progreso.v0';
  const DIF = { 1: 'Paso a paso', 2: 'Estándar', 3: 'Reto' };

  /* ---------- estado de la aplicación ---------- */
  let nivel = null, viñetas = [], res = null, seleccion = null, intentos = 0, pistaIdx = 0;
  let progreso = cargar();
  let extra = []; // niveles de autor (los añade ui-modos.js)
  let pizarraApi = null; // barra de clase montada (cronómetro, sorteo, equipos)
  function cargar() { try { const p = JSON.parse(localStorage.getItem(KEY) || '{}'); return p && typeof p === 'object' && !Array.isArray(p) ? p : {}; } catch (_) { return {}; } }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(progreso)); } catch (_) { /* sin almacenamiento */ } }
  function ajustes() { if (!progreso.ajustes || typeof progreso.ajustes !== 'object') progreso.ajustes = { modo: null, dif: 2, escritor: false, preterito: false }; return progreso.ajustes; }
  const dif = () => [1, 2, 3].includes(ajustes().dif) ? ajustes().dif : 2;
  const progresoDe = id => (progreso[id] && typeof progreso[id] === 'object') ? progreso[id] : {};
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
    document.documentElement.classList.toggle('pizarra', m === 'pizarra'); // el tamaño de letra (rem) se define en <html>
    $('#inicioApp').hidden = true;
    const clase = $('#clase');
    if (m === 'pizarra' && window.SVPizarra && !clase.dataset.montado) { try { pizarraApi = window.SVPizarra.montar(clase, { hablar, toast }); clase.dataset.montado = '1'; } catch (e) { console.error(e); } }
    clase.hidden = !(m === 'pizarra' && clase.dataset.montado && ajustes().clase === true); // oculta por defecto: se abre con «⏱ Clase»
    $('#btnClase').hidden = !(m === 'pizarra' && clase.dataset.montado);
    ajustarTira();
    const vis = nivelesVisibles();
    const actual = vis.find(n => n.id === progreso.actual);
    abrirNivel(actual ? actual.id : vis[0].id);
  }

  /* ---------- dificultad (★ / ★★ / ★★★) ---------- */
  function nivelesVisibles() {
    const d = dif(), todos = todosNiveles().filter(n => !n.enConstruccion);
    if (d === 1) return todos.filter(n => n.libre || n.autor || (n.viñetas <= 3 && n.escenas.length <= 3));
    if (d === 3) return todos.filter(n => n.libre || n.autor || n.viñetas >= 4);
    return todos;
  }
  const esActual = n => !!nivel && n.id === nivel.id;
  function pintarDif() {
    const d = dif();
    $('#btnDif').textContent = '★'.repeat(d);
    $('#btnDif').title = 'Modo de juego: ' + DIF[d];
    document.querySelectorAll('#menuDif button').forEach(b => b.classList.toggle('actual', +b.dataset.d === d));
    document.body.classList.toggle('paso', d === 1);
    document.body.classList.toggle('reto', d === 3);
  }
  function ponerDif(d) {
    ajustes().dif = d; guardar(); pintarDif();
    $('#menuDif').hidden = true;
    const vis = nivelesVisibles();
    if (nivel && !nivel.enConstruccion && !vis.some(esActual)) abrirNivel(vis[0].id); else pintarTodo();
  }

  /* ---------- niveles ---------- */
  function abrirNivel(id) {
    nivel = todosNiveles().find(n => n.id === id) || C.NIVELES[0];
    viñetas = Array.from({ length: nivel.viñetas }, () => ({ escena: null, personajes: [] }));
    seleccion = null; intentos = 0; pistaIdx = 0; ultimoFallo = ''; exitoMostrado = ''; avisoEscritor = '';
    if (window.SVApp.escritor) window.SVApp.escritor.reiniciar();
    progreso.actual = nivel.id; guardar();
    pintarTodo();
    hablar(nivel.libre ? 'Mi historia' : nivel.titulo);
  }
  function siguienteNivel() {
    const vis = nivelesVisibles(), i = vis.findIndex(esActual);
    const sig = vis.slice(i + 1).find(n => !n.libre) || vis.find(n => n.libre) || vis[0];
    abrirNivel(sig.id);
  }
  function tituloSecreto(n) { return n.tituloSecreto || E.tituloDe(n.secreto, n); }

  /* ---------- pintar ---------- */
  function pintarTodo() {
    pintarDif();
    $('#subcap').textContent = nivel.libre ? 'nivel libre' : nivel.autor ? 'nivel de autor' : `capítulo ${nivel.capitulo}`;
    const tt = $('#tituloTxt');
    tt.innerHTML = nivel.libre ? 'Mi historia <span class="alt">(sin título: ¡inventa uno!)</span>' : esc(nivel.titulo);
    tt.classList.remove('ok');
    // línea «Al principio» + título secreto
    const ini = $('#inicio');
    const lineas = E.simular(nivel, [], { tiempo: tiempo() }).inicio;
    let sec = '';
    if (nivel.secreto) {
      const pr = progresoDe(nivel.id);
      sec = (pr.secreto || (dif() !== 3 && pr.estrellas)) ? `🔑 Título secreto: <b>${esc(tituloSecreto(nivel))}</b>` : '🔑 Hay un título secreto.';
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
      esc.addEventListener('keydown', ev => { if ((ev.key === 'Enter' || ev.key === ' ') && seleccion) { ev.preventDefault(); if (colocar(i, seleccion.tipo, seleccion.id)) seleccionar(null); } });
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
      esc.addEventListener('drop', ev => { ev.preventDefault(); esc.classList.remove('sobre'); const [tipo, id] = (ev.dataTransfer.getData('text/plain') || '').split(':'); if (cartaValida(tipo, id)) colocar(i, tipo, id); });
      esc.addEventListener('click', () => { if (seleccion && colocar(i, seleccion.tipo, seleccion.id)) seleccionar(null); });
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
    const escritor = !!(window.SVApp && window.SVApp.escritor && window.SVApp.escritor.activo());
    // en modo escritor hacen falta 3 frases (elegir) o un campo con su pista (escribir) bajo cada imagen
    const lineas = !escritor ? 3.4 : ajustes().escritorNivel === 'escribir' ? 4.6 : 3.8;
    const wmax = Math.max(220, Math.floor((h - linea * lineas - 6) * 1.6));
    tira.style.setProperty('--wmax', wmax + 'px');
  }
  window.addEventListener('resize', ajustarTira);
  /* Solo se aceptan las cartas del nivel (un texto arrastrado desde una frase llega también como text/plain). */
  function cartaValida(tipo, id) {
    if (tipo === 'escena') return nivel.escenas.includes(id);
    if (tipo === 'personaje') return nivel.personajes.includes(id);
    return false;
  }
  /** Coloca una carta en la viñeta i. Devuelve true si la colocación se ha hecho. */
  function colocar(i, tipo, id) {
    const v = viñetas[i];
    if (!v || !cartaValida(tipo, id)) return false;
    if (tipo === 'escena') {
      v.escena = id;
      const slots = ES[id].slots;
      if (v.personajes.length > slots) v.personajes = v.personajes.slice(0, slots);
    } else {
      if (!v.escena) { toast('Primero pon una escena en la viñeta.'); return false; }
      if (v.personajes.includes(id)) { toast(`${PJ[id].nombre} ya está en esta viñeta.`); return false; }
      const slots = ES[v.escena].slots;
      if (v.personajes.length >= slots) { if (slots === 1) v.personajes = [id]; else v.personajes[slots - 1] = id; }
      else v.personajes.push(id);
    }
    pintarTira(); simular();
    return true;
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
          // Con una carta seleccionada, el clic va a la viñeta (poner la carta); sin selección, quita al personaje.
          w.addEventListener('click', ev => { if (seleccion) return; ev.stopPropagation(); quitarPersonaje(i, id); });
          pjs.appendChild(w);
        }
      }
      const f = caja.querySelector('.frase');
      f.dataset.texto = '';
      if (!v.escena) { f.textContent = '…'; f.className = 'frase vacia'; }
      else if (!v.personajes.length) { f.textContent = `${ES[v.escena].nombre}. ¿Quién está aquí?`; f.className = 'frase vacia'; }
      else if (r.frases.length) {
        const texto = r.frases.join(' ');
        const alerta = r.eventos.some(e => e.tipo === 'yaSalvo' || e.tipo === 'demasiados');
        f.dataset.texto = texto;
        f.className = 'frase' + (alerta ? ' alerta' : '');
        // Una frase de aviso (historia incoherente) se muestra siempre: no es una frase que adivinar.
        if (escritor && !alerta) window.SVApp.escritor.pintar(f, i, texto, res); else f.textContent = texto;
      }
      else { f.textContent = '…'; f.className = 'frase vacia'; }
    });
    // estado del nivel
    const est = $('#estadoNivel'), tt = $('#tituloTxt');
    if (window.SVApp.alSimular) window.SVApp.alSimular(res);
    if (nivel.libre || nivel.enConstruccion) { est.textContent = res.incompleto ? `${viñetas.filter(v => v.escena && v.personajes.length).length}/${nivel.viñetas} viñetas` : (nivel.enConstruccion && !res.valido ? 'Hay un problema: mira la frase en rojo' : '¡Historia completa!'); est.className = res.incompleto || !res.valido ? '' : 'ok'; $('#btnImprimir').disabled = res.incompleto; return; }
    tt.classList.toggle('ok', res.resuelto);
    $('#btnImprimir').disabled = !res.resuelto || escritorPendiente(); // en modo escritor, imprimir revelaría las frases
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
  let exitoMostrado = '', avisoEscritor = '';
  /* La historia cumple el título. Si el modo escritor sigue pendiente, solo se avisa: las estrellas y la fiesta llegan al terminar las frases. */
  function exito() {
    const firma = nivel.id + '|' + JSON.stringify(viñetas);
    if (escritorPendiente()) {
      if (avisoEscritor !== firma) { avisoEscritor = firma; toast(ajustes().escritorNivel === 'escribir' ? '✔ La historia es correcta. Ahora escribe la frase de cada viñeta.' : '✔ La historia es correcta. Ahora elige la frase de cada viñeta.', 4500); }
      return;
    }
    if (firma === exitoMostrado) return;
    exitoMostrado = firma;
    const p = progresoDe(nivel.id);
    p.estrellas = Math.max(p.estrellas || 0, intentos <= 1 ? 3 : intentos <= 3 ? 2 : 1);
    if (res.secreto) p.secreto = true;
    progreso[nivel.id] = p; guardar();
    pintarNiveles();
    mostrarExito(p);
  }
  function escritorPendiente() { return !!(window.SVApp.escritor && window.SVApp.escritor.activo() && !window.SVApp.escritor.completo()); }
  function mostrarExito(p) {
    p = p || progresoDe(nivel.id);
    const d = $('#dlgExito');
    const sec = res.secreto ? `<p>🔑 Título secreto: <b>${esc(tituloSecreto(nivel))}</b></p>` : (nivel.secreto ? '<p class="alt">Hay un título secreto en este nivel… ¿lo encuentras?</p>' : '');
    d.innerHTML = `<h2>¡Muy bien!</h2><div class="grande">${'★'.repeat(p.estrellas || 0)}${'☆'.repeat(3 - (p.estrellas || 0))}</div>
      <p><b>${esc(nivel.titulo)}</b></p>${sec}
      <div class="fila"><button class="btn sec" id="btnSeguir">Cerrar</button><button class="btn sec" id="btnImprimirDlg">🖨 Imprimir</button><button class="btn" id="btnLeer">Leer la historia</button><button class="btn verde" id="btnSig">Siguiente nivel →</button></div>`;
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
    // En modo escritor, las frases que el alumno todavía no ha elegido o escrito no se muestran aquí (se conserva el diagnóstico).
    const oculto = escritorPendiente();
    const visible = i => !oculto || window.SVApp.escritor.hecha(i);
    const partes = res.viñetas.map((v, i) => `<p data-f="${i}"${visible(i) ? '' : ' class="oculta"'}><b>${i + 1}.</b> ${!v.frases.length ? '<i>…</i>' : visible(i) ? v.frases.join(' ') : '<i>¿Qué frase es? Mírala en la viñeta.</i>'}</p>`).join('');
    const resumen = res.resumen.length ? `<h3>Al final</h3>${res.resumen.map(s => `<p class="res">${s}</p>`).join('')}` : '';
    let juicio = '';
    if (!nivel.libre) {
      if (res.resuelto) juicio = `<div class="porque ok">✔ ¡Muy bien! Esta historia es: «${esc(nivel.titulo)}».</div>`;
      else if (res.porque.length) juicio = `<div class="porque">${res.porque.map(p => `<div>✗ ${esc(p)}</div>`).join('')}</div>`;
    }
    d.innerHTML = `<h2>¿Qué pasa?</h2><div class="historia">${partes}${resumen}</div>${juicio}
      <div class="fila"><button class="btn sec" id="btnOir">🔊 Escuchar todo</button><button class="btn" id="btnCerrar">Cerrar</button></div>`;
    d.querySelectorAll('.historia p').forEach(p => p.addEventListener('click', () => { if (!p.classList.contains('oculta')) hablar(p.textContent.replace(/^\d+\.\s*/, '')); }));
    d.querySelector('#btnOir').onclick = () => hablar(res.viñetas.filter((v, i) => visible(i)).map(v => v.frases.join(' ')).concat(res.resumen).join(' '));
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
        const pr = progresoDe(n.id);
        const est = n.libre ? '' : `<span class="estrellas">${'★'.repeat(pr.estrellas || 0)}${'☆'.repeat(3 - (pr.estrellas || 0))}${pr.secreto ? ' 🔑' : ''}</span>`;
        html += `<button class="niv${esActual(n) ? ' actual' : ''}${pr.estrellas ? ' hecho' : ''}" data-id="${esc(n.id)}"><span class="cnt">${n.libre ? '✎' : n.viñetas + ' ▭'}</span><span>${esc(n.titulo)}</span>${est}</button>`;
      }
    }
    if (window.SVApp.abrirAutor) html += `<h3>Crear</h3><button class="btn sec" id="btnIrAutor">✎ Crear un nivel</button> <button class="btn sec" id="btnImportar">⌨ Tengo un código</button>`;
    html += `<h3>Datos</h3><button class="btn sec" id="btnBorrarDatos">Borrar mis datos</button><p class="nota">Borra las estrellas y los ajustes del juego de este navegador. Los niveles de la clase se quedan. Ningún dato sale de este ordenador.</p>`;
    p.innerHTML = html;
    p.querySelector('.cerrar').onclick = () => { p.hidden = true; };
    p.querySelectorAll('.niv').forEach(b => b.onclick = () => { p.hidden = true; abrirNivel(b.dataset.id); });
    p.querySelector('#btnBorrarDatos').onclick = () => { if (confirm('¿Borrar tus estrellas y los ajustes del juego en este navegador?')) { borrarMisDatos(); toast('Datos borrados.'); } };
    const ia = p.querySelector('#btnIrAutor'); if (ia) ia.onclick = () => { p.hidden = true; window.SVApp.abrirAutor(); };
    const im = p.querySelector('#btnImportar'); if (im) im.onclick = () => { p.hidden = true; window.SVApp.importarCodigo(); };
  }
  /* Alumno: estrellas, nivel actual y ajustes de juego. Se conservan el modo, la contraseña del profe y los niveles de la clase. */
  function borrarMisDatos() {
    const a = ajustes(), conservar = { modo: a.modo, clave: a.clave, escritor: a.escritor, escritorNivel: a.escritorNivel, preterito: a.preterito };
    progreso = { ajustes: Object.assign({ dif: 2 }, conservar) }; guardar();
    if (window.SVApp.escritor) window.SVApp.escritor.reiniciar();
    abrirNivel(nivel && !nivel.enConstruccion ? nivel.id : C.NIVELES[0].id);
  }
  /* Profe: todo lo que el juego guarda en este navegador (progreso, ajustes, contraseña, niveles de la clase, barra de clase). */
  function borrarTodo() {
    // la barra de clase se desmonta antes de borrar su almacenamiento (si no, volvería a guardar nombres y puntos)
    if (pizarraApi) { try { pizarraApi.destruir(); } catch (_) { /* nada */ } pizarraApi = null; delete $('#clase').dataset.montado; }
    progreso = {}; guardar();
    if (window.SVApp.borrarDatos) window.SVApp.borrarDatos();
    extra = [];
    document.body.classList.remove('pizarra'); document.documentElement.classList.remove('pizarra');
    $('#clase').hidden = true; $('#btnClase').hidden = true;
    abrirNivel(C.NIVELES[0].id); pintarInicio();
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
    if (nivel.libre) { toast('Aquí no hay pistas: ¡inventa tu historia!'); return; }
    if (!nivel.pistas || !nivel.pistas.length) { toast('Este nivel no tiene pistas. Lee bien el título.'); return; }
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
    const t = ev.target;
    if (t && t.matches && (t.matches('input,textarea,select') || t.isContentEditable)) return;
    if (ev.key === 'Escape') { seleccionar(null); cerrarPaneles(); }
    if ((ev.key === 'p' || ev.key === 'P') && !ev.ctrlKey && !ev.metaKey && !ev.altKey && window.SVApp.abrirProfe && !document.querySelector('dialog[open]')) { ev.preventDefault(); window.SVApp.abrirProfe(); }
  });

  /* ---------- ganchos para los módulos (ui-modos.js) ---------- */
  window.SVApp = {
    nivel: () => nivel, viñetas: () => viñetas, resultado: () => res, progreso: () => progreso, ajustes, guardar, hablar, toast,
    abrirNivel, pintarTodo, simular, elegirModo, pintarInicio, nivelesVisibles, tiempo, dif, tituloSecreto, mostrarExito,
    añadirNiveles(ns) { extra = ns.slice(); },
    extra: () => extra,
    ponerViñetas(vs, opts) { viñetas = Array.from({ length: nivel.viñetas }, (_, i) => ({ escena: vs[i] ? vs[i].escena : null, personajes: vs[i] ? vs[i].personajes.slice() : [] })); if (opts && opts.silencio) exitoMostrado = avisoEscritor = nivel.id + '|' + JSON.stringify(viñetas); seleccionar(null); pintarTira(); simular(); },
    reiniciarIntentos() { intentos = 0; ultimoFallo = ''; exitoMostrado = ''; avisoEscritor = ''; },
    ajustarTira, esc, cerrarPaneles, borrarTodo,
    escritor: null, abrirAutor: null, abrirProfe: null, imprimir: null, importarCodigo: null, borrarDatos: null, alPintar: null
  };

  /* ---------- inicio ---------- */
  function arrancar() {
    if (window.SVApp.iniciarModulos) { try { window.SVApp.iniciarModulos(); } catch (e) { console.error(e); } }
    // Parámetros opcionales en la URL (para el profe o las pruebas): ?modo=pizarra|solo&nivel=c2n1&dif=1|2|3
    const q = new URLSearchParams(location.search);
    if (q.get('dif') && ['1', '2', '3'].includes(q.get('dif'))) ajustes().dif = +q.get('dif');
    if (q.get('nivel') && todosNiveles().some(n => n.id === q.get('nivel'))) progreso.actual = q.get('nivel');
    if (q.get('modo') === 'pizarra' || q.get('modo') === 'solo') ajustes().modo = q.get('modo');
    pintarDif();
    if (ajustes().modo) elegirModo(ajustes().modo); else { abrirNivel(progreso.actual || C.NIVELES[0].id); pintarInicio(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
})();
