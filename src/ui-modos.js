/* Sobrevives — módulos de interfaz de la fase 2: modo escritor, Imprimir mi historia, modo Autor, panel Profe.
   Se engancha a window.SVApp (definido en ui.js). Vanilla JS, sin dependencias, todo en localStorage. */
(function () {
  'use strict';
  const C = window.SVContenido, E = window.SVEngine, AP = window.SVArtePersonajes, AE = window.SVArteEscenas;
  const ESC = window.SVEscritor, AU = window.SVAutor;
  const App = window.SVApp;
  const $ = s => document.querySelector(s);
  const PJ = {}; for (const p of C.PERSONAJES) PJ[p.id] = p;
  const ES = {}; for (const e of C.ESCENAS) ES[e.id] = e;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const el = (tag, attrs, html) => { const n = document.createElement(tag); if (attrs) for (const k in attrs) { if (k === 'class') n.className = attrs[k]; else n.setAttribute(k, attrs[k]); } if (html !== undefined) n.innerHTML = html; return n; };
  const store = { getItem: k => { try { return localStorage.getItem(k); } catch (_) { return null; } }, setItem: (k, v) => { try { localStorage.setItem(k, v); } catch (_) { /* nada */ } }, removeItem: k => { try { localStorage.removeItem(k); } catch (_) { /* nada */ } } };
  const almacen = AU.almacen(store);
  const CLAVE_DEFECTO = 'profe';

  /* =====================================================================
     1. MODO ESCRITOR: la frase se oculta; el alumno la elige entre 3 o la escribe
     ===================================================================== */
  const estadosEsc = {}; // índice de viñeta → { firma, malas, intentos, hecho, revelada, escrito }
  function escActivo() {
    const n = App.nivel();
    if (!n || n.libre || n.enConstruccion) return false;
    return !!(App.ajustes().escritor || App.dif() === 3);
  }
  function escModo() { return App.ajustes().escritorNivel === 'escribir' ? 'escribir' : 'elegir'; }
  function estadoDe(i, texto) {
    let s = estadosEsc[i];
    if (!s || s.firma !== texto) s = estadosEsc[i] = { firma: texto, malas: [], intentos: 0, hecho: false, revelada: false, escrito: '' };
    return s;
  }
  const esAviso = v => v.eventos.some(e => e.tipo === 'yaSalvo' || e.tipo === 'demasiados');
  function escHecha(i) {
    const v = App.resultado().viñetas[i], s = estadosEsc[i];
    if (!v || !v.frases.length || esAviso(v)) return true;
    return !!(s && s.hecho && s.firma === v.frases.join(' '));
  }
  function escCompleto() { return App.resultado().viñetas.every((v, i) => escHecha(i)); }
  function escPintar(f, i, texto, res) {
    const s = estadoDe(i, texto);
    f.classList.add('esc');
    if (s.hecho) { f.innerHTML = `<span class="esc-ok" title="${s.revelada ? 'Frase mostrada' : '¡Correcta!'}">${s.revelada ? '👀' : '✔'}</span>${esc(texto)}`; f.dataset.texto = texto; f.classList.remove('esc'); return; }
    f.dataset.texto = ''; // no se lee al hacer clic: solo con el botón 🔊
    const oir = `<button class="btn sec mini oir" type="button" title="Escuchar la frase">🔊</button>`;
    if (escModo() === 'elegir') {
      // En la viñeta solo hay un botón: las 3 frases se leen en grande en una ventana (en una viñeta estrecha aplastaban la imagen).
      f.innerHTML = `<div class="esc-cab"><b>¿Qué frase es?</b>${oir}</div><button type="button" class="btn esc-abrir">Elegir la frase</button>`;
      f.querySelector('.esc-abrir').addEventListener('click', ev => { ev.stopPropagation(); elegirFrase(i, s, texto, res); });
    } else {
      f.innerHTML = `<div class="esc-cab"><b>Escribe la frase</b>${oir}</div>
        <form class="esc-form"><input type="text" class="esc-in" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="Escribe aquí…" value="${esc(s.escrito)}" aria-label="Escribe la frase de la viñeta ${i + 1}"><button class="btn mini" type="submit" title="Comprobar">✔</button></form>
        ${s.intentos >= 2 ? `<div class="esc-pista" title="Pista: la primera letra de cada palabra">${esc(ESC.pista(texto))}</div>` : ''}
        ${s.intentos >= 4 ? `<button type="button" class="btn sec mini esc-ver">Ver la frase</button>` : ''}`;
      const form = f.querySelector('form'), input = f.querySelector('input');
      input.addEventListener('input', () => { s.escrito = input.value; });
      form.addEventListener('submit', ev => {
        ev.preventDefault(); ev.stopPropagation();
        const r = ESC.comparar(input.value, texto);
        s.escrito = input.value;
        if (r.ok) acierta(i, s, texto, r.mensaje);
        else {
          s.intentos++;
          App.toast(r.mensaje, 4000);
          App.simular();
          const nuevo = document.querySelector(`.vineta[data-i="${i}"] .esc-in`);
          if (nuevo) { nuevo.focus(); nuevo.select(); }
        }
      });
      const ver = f.querySelector('.esc-ver');
      if (ver) ver.addEventListener('click', ev => { ev.stopPropagation(); s.revelada = true; acierta(i, s, texto, 'Aquí tienes la frase. Léela y escúchala.'); });
    }
    f.querySelector('.oir').addEventListener('click', ev => { ev.stopPropagation(); App.hablar(texto); });
  }
  function elegirFrase(i, s, texto, res) {
    const op = ESC.opciones(App.nivel(), App.viñetas(), i, res, { tiempo: App.tiempo() });
    const v = res.viñetas[i];
    const dibujo = `<div class="esc-dibujo">${AE.escenaSVG(v.escena, { clase: 'fondo' })}<div class="pjs">${v.personajes.map(id => AP.personajeSVG(PJ[id], v.estado[id] ? E.expresion(v.estado[id]) : 'contento', { clase: 'pj' })).join('')}</div></div>`;
    const d = dialogo(`<h2>Viñeta ${i + 1}: ¿qué frase es?</h2>${dibujo}<div class="esc-ops">${op.opciones.map((t, k) => `<button type="button" class="esc-op${s.malas.includes(k) ? ' mal' : ''}" data-k="${k}"${s.malas.includes(k) ? ' disabled' : ''}>${esc(t)}</button>`).join('')}</div>
      <div class="fila"><button class="btn sec" id="eOir" type="button">🔊 Escuchar</button><button class="btn" type="button" data-cerrar>Cerrar</button></div>`, 'escritor');
    d.querySelector('#eOir').addEventListener('click', () => App.hablar(texto));
    d.querySelectorAll('.esc-op').forEach(b => b.addEventListener('click', () => {
      const k = +b.dataset.k;
      if (k === op.indice) { d.close(); acierta(i, s, texto, '¡Muy bien!'); }
      else { s.malas.push(k); s.intentos++; b.classList.add('mal'); b.disabled = true; App.toast('No es esa frase. Mira bien la viñeta.', 3000); }
    }));
  }
  function acierta(i, s, texto, mensaje) {
    s.hecho = true;
    App.toast(mensaje || '¡Muy bien!', 2500);
    App.hablar(texto);
    App.simular(); // si era la última frase, simular() concede las estrellas y abre el diálogo de éxito
  }
  App.escritor = { activo: escActivo, pintar: escPintar, completo: escCompleto, hecha: escHecha, reiniciar() { for (const k in estadosEsc) delete estadosEsc[k]; } };

  /* =====================================================================
     2. IMPRIMIR MI HISTORIA (A4 apaisado): el cómic resuelto + hojas de viñetas vacías (4 y 6)
     ===================================================================== */
  /** HTML de las tres páginas (cómic resuelto + hojas de 4 y 6 viñetas). Función pura: también la usa test/imprimir.js. */
  function htmlImpresion(nivel, res, tituloSecreto) {
    const n = res.viñetas.length, cols = n <= 3 ? n : n === 4 ? 2 : 3;
    const vin = res.viñetas.map((v, i) => `<div class="imp-vineta"><div class="imp-esc">${v.escena ? AE.escenaSVG(v.escena, { clase: 'fondo' }) : ''}<div class="imp-pjs">${v.personajes.map(id => AP.personajeSVG(PJ[id], v.estado[id] ? E.expresion(v.estado[id]) : 'contento', { clase: 'pj' })).join('')}</div><span class="imp-num">${i + 1}</span></div><p class="imp-frase">${esc(v.frases.join(' '))}</p></div>`).join('');
    const hoja = k => `<div class="imp-pagina imp-hoja"><h1 class="imp-titulo">Mi historia: <span class="imp-linea"></span></h1><div class="imp-tira" style="--c:${k === 4 ? 2 : 3}">${Array.from({ length: k }, (_, i) => `<div class="imp-vineta"><div class="imp-esc vacia"><span class="imp-num">${i + 1}</span></div><div class="imp-lineas"><i></i><i></i><i></i></div></div>`).join('')}</div><p class="imp-pie">Sobrevives · hoja de viñetas · ${k} viñetas · Nombre o código: ____________________</p></div>`;
    const titulo = nivel.libre ? 'Mi historia' : nivel.titulo;
    const secreto = res.secreto && nivel.secreto && tituloSecreto ? ` · 🔑 ${tituloSecreto}` : '';
    const inicio = res.inicio && res.inicio.length ? `<p class="imp-frase imp-inicio"><b>Al principio:</b> ${esc(res.inicio.join(' '))}</p>` : '';
    return `<div class="imp-pagina"><h1 class="imp-titulo">${esc(titulo)}</h1>${inicio}<div class="imp-tira" style="--c:${cols}">${vin}</div><p class="imp-pie">Sobrevives · ${esc(nivel.personajes.map(id => PJ[id].nombre).join(', '))}${esc(secreto)} · Nombre o código: ____________________</p></div>${hoja(4)}${hoja(6)}`;
  }
  function imprimir() {
    const nivel = App.nivel(), res = App.resultado();
    let sec = $('#impresion');
    if (!sec) { sec = el('section', { id: 'impresion', 'aria-hidden': 'true' }); document.body.appendChild(sec); }
    sec.innerHTML = htmlImpresion(nivel, res, nivel.secreto ? App.tituloSecreto(nivel) : '');
    window.print();
  }
  App.htmlImpresion = htmlImpresion;

  /* =====================================================================
     3. MODO AUTOR: crear un nivel, jugar la solución, guardar y compartir con un código
     ===================================================================== */
  let barra = null;
  const HUMANOS = C.PERSONAJES.filter(p => !p.animal).map(p => p.id);
  const OFICIALES = new Set(C.NIVELES.map(n => n.id));
  /** ¿Es un nivel de autor jugable? (estructura mínima, cartas conocidas, objetivo válido) */
  function nivelValido(n) {
    try {
      if (!n || typeof n !== 'object' || typeof n.id !== 'string' || !n.id.startsWith('autor-') || OFICIALES.has(n.id)) return false;
      if (typeof n.titulo !== 'string' || !n.titulo.trim() || n.titulo.length > 120) return false;
      if (!Number.isInteger(n.viñetas) || n.viñetas < 1 || n.viñetas > 6) return false;
      if (!Array.isArray(n.escenas) || !n.escenas.length || n.escenas.length > 8 || !n.escenas.every(id => ES[id])) return false;
      if (!Array.isArray(n.personajes) || !n.personajes.length || n.personajes.length > 4 || !n.personajes.every(id => HUMANOS.includes(id)) || new Set(n.personajes).size !== n.personajes.length) return false;
      if (!E.objetivoValido(n.objetivo)) return false;
      E.simular(n, []); // debe poder simularse sin lanzar
      return true;
    } catch (_) { return false; }
  }
  function recargarExtra() { App.añadirNiveles(almacen.listar().filter(nivelValido)); }
  function dialogo(html, clase) {
    const d = $('#dlgModos');
    d.className = clase || '';
    d.innerHTML = html;
    d.querySelectorAll('[data-cerrar]').forEach(b => b.addEventListener('click', () => d.close()));
    if (!d.open) d.showModal();
    return d;
  }
  function tarjetasSel(tipo, ids, marcados) {
    return `<div class="sel-cartas">${ids.map(id => {
      const sel = marcados.includes(id);
      if (tipo === 'personaje') { const p = PJ[id]; return `<label class="sel-carta ficha ${id}"><input type="checkbox" name="pj" value="${id}"${sel ? ' checked' : ''}>${AP.retratoSVG(p)}<span>${p.nombre}</span></label>`; }
      const e = ES[id]; return `<label class="sel-carta"><input type="checkbox" name="esc" value="${id}"${sel ? ' checked' : ''}>${AE.escenaSVG(id)}<span>${e.emoji} ${e.nombre}</span></label>`;
    }).join('')}</div>`;
  }
  function abrirAutor(base) {
    base = base || { personajes: ['lucia', 'mateo'], escenas: ['selva', 'rio', 'noche'], viñetas: 3 };
    const humanos = C.PERSONAJES.filter(p => !p.animal).map(p => p.id);
    const d = dialogo(`<h2>✎ Crear un nivel <button class="btn sec" data-cerrar aria-label="Cerrar">×</button></h2>
      <form id="fAutor">
        <fieldset><legend>1. Personajes (de 1 a 4)</legend>${tarjetasSel('personaje', humanos, base.personajes)}</fieldset>
        <fieldset><legend>2. Escenas (de 1 a 8)</legend>${tarjetasSel('escena', C.ESCENAS.map(e => e.id), base.escenas)}</fieldset>
        <fieldset><legend>3. Viñetas</legend><div class="fila-radios">${[2, 3, 4, 5, 6].map(k => `<label class="radio"><input type="radio" name="vin" value="${k}"${k === base.viñetas ? ' checked' : ''}> ${k}</label>`).join('')}</div></fieldset>
        <fieldset><legend>4. Título</legend>
          <select id="aTitulo" aria-label="Título del nivel"></select>
          <input id="aLibre" type="text" maxlength="60" placeholder="Escribe tu título" hidden>
          <p class="nota" id="aNota"></p>
        </fieldset>
        <div class="fila"><button class="btn sec" type="button" data-cerrar>Cancelar</button><button class="btn verde" type="submit">Jugar la solución →</button></div>
      </form>`, 'grande');
    const form = d.querySelector('#fAutor'), sel = d.querySelector('#aTitulo'), libre = d.querySelector('#aLibre'), nota = d.querySelector('#aNota');
    const elegidos = name => [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(i => i.value);
    let titulos = [];
    function rellenarTitulos() {
      const pjs = elegidos('pj'), escs = elegidos('esc');
      titulos = pjs.length && escs.length ? AU.asistenteTitulos(pjs, escs) : [];
      const actual = sel.value;
      sel.innerHTML = titulos.map((t, i) => `<option value="${i}">${esc(t.titulo)}</option>`).join('') + `<option value="libre">✎ Otro título (lo escribo yo)</option>`;
      if ([...sel.options].some(o => o.value === actual)) sel.value = actual;
      nota.textContent = titulos.length ? `${titulos.length} ${titulos.length === 1 ? 'título posible' : 'títulos posibles'} con estos personajes y escenas. Con «Otro título», juegas tu historia y el juego la aprende.` : 'Elige personajes y escenas para ver títulos.';
      libre.hidden = sel.value !== 'libre';
    }
    form.addEventListener('change', ev => { if (ev.target.name === 'pj' || ev.target.name === 'esc') rellenarTitulos(); if (ev.target === sel) libre.hidden = sel.value !== 'libre'; });
    rellenarTitulos();
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const pjs = elegidos('pj'), escs = elegidos('esc'), vin = +(form.querySelector('input[name="vin"]:checked') || {}).value || 3;
      if (!pjs.length || pjs.length > 4) { App.toast('Elige de 1 a 4 personajes.'); return; }
      if (!escs.length || escs.length > 8) { App.toast('Elige de 1 a 8 escenas.'); return; }
      let titulo, objetivo = null;
      if (sel.value === 'libre') { titulo = libre.value.trim(); if (!titulo) { App.toast('Escribe tu título.'); libre.focus(); return; } }
      else { const t = titulos[+sel.value]; if (!t) { App.toast('Elige un título.'); return; } titulo = t.titulo; objetivo = t.objetivo; }
      const nivel = { id: 'autor-nuevo', capitulo: 0, autor: true, enConstruccion: true, titulo, viñetas: vin, escenas: E.ordenar ? escs : escs, personajes: pjs, objetivo, pistas: [] };
      d.close();
      jugarSolucion(nivel);
    });
  }
  function jugarSolucion(nivel) {
    App.añadirNiveles(almacen.listar().concat([nivel]));
    App.abrirNivel('autor-nuevo');
    if (!barra) { barra = el('div', { id: 'barraAutor', role: 'status' }); $('#titulo').appendChild(barra); }
    barra.hidden = false;
    barra.innerHTML = `<span>✎ <b>Modo Autor.</b> ${nivel.objetivo ? 'Haz una historia para este título.' : 'Juega tu historia: el juego la aprende.'}</span>
      <button class="btn verde" id="bGuardar" disabled>💾 Guardar el nivel</button><button class="btn sec" id="bCancelar">✕ Cancelar</button>`;
    barra.querySelector('#bCancelar').addEventListener('click', () => { barra.hidden = true; recargarExtra(); App.abrirNivel(C.NIVELES[0].id); });
    barra.querySelector('#bGuardar').addEventListener('click', () => guardarNivel(nivel));
  }
  function autorListo(res) {
    const n = App.nivel();
    if (!n || !n.enConstruccion) return false;
    if (res.incompleto || !res.valido || (res.faltan && res.faltan.length)) return false;
    return n.objetivo ? res.resuelto : true;
  }
  function guardarNivel(nivel) {
    let final = Object.assign({}, nivel);
    delete final.enConstruccion;
    try { if (!final.objetivo) final = AU.grabar(final, App.viñetas()); } catch (e) { App.toast(e.message, 4000); return; }
    // Comprobación inmediata con la historia jugada (sin buscar todas las soluciones)
    const jugada = E.simular(final, App.viñetas());
    if (!jugada.resuelto || !nivelValido(Object.assign({}, final, { id: 'autor-x' }))) { dialogo(`<h2>Todavía no</h2><div class="porque">${(jugada.porque.length ? jugada.porque : ['Este nivel no se puede guardar.']).map(e => `<div>✗ ${esc(e)}</div>`).join('')}</div><div class="fila"><button class="btn" data-cerrar>Cerrar</button></div>`); return; }
    {
      const codigo = AU.codificar(final);
      final.id = 'autor-' + codigo.replace(/[^0-9A-Z]/g, '').toLowerCase();
      final.codigo = codigo;
      almacen.guardar(final);
      recargarExtra();
      if (barra) barra.hidden = true;
      App.abrirNivel(final.id);
      const d = dialogo(`<h2>¡Nivel guardado!</h2><p><b>${esc(final.titulo)}</b> · ${final.viñetas} viñetas · <span id="aInfo">Calculando las soluciones…</span></p>
        <p>Código para la clase (dictar o escribir en la pizarra):</p><p><span class="codigo" id="codigoTxt">${codigo}</span></p>
        <p class="nota">Las letras I, L, O y U no se usan: si lees «O», es un cero; si lees «I» o «L», es un uno.</p>
        <div class="fila"><button class="btn sec" id="bCopiar">Copiar</button><button class="btn sec" id="bOtro">Crear otro</button><button class="btn verde" id="bJugar">Jugar este nivel</button></div>`);
      d.querySelector('#bCopiar').addEventListener('click', () => { try { navigator.clipboard.writeText(codigo); App.toast('Código copiado.'); } catch (_) { App.toast('No se puede copiar aquí: cópialo a mano.'); } });
      d.querySelector('#bOtro').addEventListener('click', () => { d.close(); abrirAutor({ personajes: final.personajes, escenas: final.escenas, viñetas: final.viñetas }); });
      d.querySelector('#bJugar').addEventListener('click', () => { d.close(); App.abrirNivel(final.id); });
      resolverAsync(final, { max: 1, limite: 3e5 }, 20000).then(r => {
        const info = d.querySelector('#aInfo'); if (!info) return;
        if (!r || r.desbordado) info.textContent = 'muchas soluciones posibles';
        else info.textContent = `${r.total} ${r.total === 1 ? 'solución' : 'soluciones'}`;
      });
    }
  }
  function importarCodigo(codigoInicial) {
    const d = dialogo(`<h2>⌨ Tengo un código</h2><form id="fCodigo"><input type="text" id="cIn" class="codigo-in" autocomplete="off" spellcheck="false" placeholder="S1AB-CDEF-GHJK-M" value="${esc(codigoInicial || '')}" aria-label="Código del nivel"><p class="nota" id="cNota">Copia el código de la pizarra. Puedes escribirlo en minúsculas y sin guiones.</p>
      <div class="fila"><button class="btn sec" type="button" data-cerrar>Cancelar</button><button class="btn verde" type="submit">Abrir el nivel</button></div></form>`);
    const form = d.querySelector('#fCodigo'), input = d.querySelector('#cIn'), nota = d.querySelector('#cNota');
    setTimeout(() => input.focus(), 50);
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      try {
        const n = AU.decodificar(input.value);
        n.codigo = AU.codificar(n);
        n.id = 'autor-' + n.codigo.replace(/[^0-9A-Z]/g, '').toLowerCase();
        almacen.guardar(n); recargarExtra();
        d.close(); App.abrirNivel(n.id); App.toast(`Nivel «${n.titulo}» abierto.`, 3000);
      } catch (e) { nota.textContent = e.message || 'Este código no es válido. Revísalo letra por letra.'; nota.classList.add('error'); input.focus(); }
    });
  }

  /* =====================================================================
     4. PANEL PROFE (tecla P): contraseña local, ajustes, soluciones, niveles de la clase
     ===================================================================== */
  let autorizado = false;
  function clave() { return App.ajustes().clave || CLAVE_DEFECTO; }
  function abrirProfe() {
    if (autorizado) { panelProfe(); return; }
    const d = dialogo(`<h2>Profe</h2><form id="fClave"><label>Contraseña <input type="password" id="pIn" autocomplete="off" aria-label="Contraseña"></label><p class="nota" id="pNota">Solo para el profe o la profe.</p>
      <div class="fila"><button class="btn sec" type="button" data-cerrar>Cancelar</button><button class="btn" type="submit">Entrar</button></div></form>`);
    const input = d.querySelector('#pIn');
    setTimeout(() => input.focus(), 50);
    d.querySelector('#fClave').addEventListener('submit', ev => {
      ev.preventDefault();
      if (input.value === clave()) { autorizado = true; d.close(); panelProfe(); }
      else { d.querySelector('#pNota').textContent = 'No es la contraseña.'; d.querySelector('#pNota').classList.add('error'); input.value = ''; input.focus(); }
    });
  }
  /* Resolver en segundo plano con un Worker construido a partir de los propios <script> inlinados (sin ficheros externos);
     si el navegador no lo permite (file:// en algún navegador), se calcula en el hilo principal. */
  let workerURL = null;
  /** Resuelve en un Worker. Devuelve null si no se pudo (tiempo agotado, Worker imposible y nivel demasiado grande). */
  function resolverAsync(nivel, opts, ms) {
    return new Promise(resolve => {
      const sincrono = () => {
        const posibles = Math.pow(E.opcionesDe(nivel).length, nivel.viñetas);
        try { resolve(posibles <= 2e6 ? E.resolver(nivel, opts) : null); } catch (_) { resolve(null); }
      };
      let w;
      try {
        if (!workerURL) {
          const fuentes = [...document.scripts].filter(s => /\/\* (lengua|contenido|engine)\.js \*\//.test(s.textContent.slice(0, 80))).map(s => s.textContent);
          if (fuentes.length !== 3) throw new Error('sin fuentes');
          const code = fuentes.join('\n') + '\nself.onmessage = function (ev) { const r = self.SVEngine.resolver(ev.data.nivel, ev.data.opts); self.postMessage({ total: r.total, secretas: r.secretas, ambas: r.ambas, soluciones: r.soluciones, densidad: r.densidad, desbordado: r.desbordado }); };';
          workerURL = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
        }
        w = new Worker(workerURL);
      } catch (_) { sincrono(); return; }
      const t = setTimeout(() => { w.terminate(); resolve(null); }, ms || 45000);
      w.onmessage = ev => { clearTimeout(t); w.terminate(); resolve(ev.data); };
      w.onerror = ev => { clearTimeout(t); w.terminate(); if (ev && ev.preventDefault) ev.preventDefault(); sincrono(); };
      w.postMessage({ nivel: JSON.parse(JSON.stringify(nivel)), opts });
    });
  }
  function panelProfe() {
    const a = App.ajustes(), nivel = App.nivel();
    const niveles = almacen.listar();
    const d = dialogo(`<h2>Profe <button class="btn sec" data-cerrar aria-label="Cerrar">×</button></h2>
      <div class="profe-cols">
      <section><h3>Ajustes</h3>
        <label class="ajuste"><input type="checkbox" id="pEscritor"${a.escritor ? ' checked' : ''}> Modo escritor (frases ocultas)</label>
        <div class="ajuste sub"><label><input type="radio" name="pEscNivel" value="elegir"${a.escritorNivel !== 'escribir' ? ' checked' : ''}> elegir entre 3 (A1)</label> <label><input type="radio" name="pEscNivel" value="escribir"${a.escritorNivel === 'escribir' ? ' checked' : ''}> escribir (A2)</label></div>
        <label class="ajuste"><input type="checkbox" id="pPret"${a.preterito ? ' checked' : ''}> Pretérito (3.º · A2): acciones en indefinido, estados en imperfecto</label>
        <label class="ajuste"><input type="checkbox" id="pClase"${a.clase === true ? ' checked' : ''}${a.modo === 'pizarra' ? '' : ' disabled'}> Barra de clase visible (solo en modo Pizarra)</label>
        <p class="nota">En ★★★ Reto el modo escritor está siempre activo.</p>
        <form id="fNuevaClave" class="ajuste"><label>Nueva contraseña <input type="password" id="pNueva" autocomplete="new-password" minlength="3"></label> <button class="btn sec mini" type="submit">Cambiar</button></form>
      </section>
      <section><h3>Nivel actual: ${esc(nivel.libre ? 'nivel libre' : nivel.titulo)}</h3>
        ${nivel.libre ? '<p class="nota">El nivel libre no tiene solución fija.</p>' : `<p class="nota">Pistas: ${(nivel.pistas || []).map(esc).join(' · ') || 'ninguna'}</p>${nivel.secreto ? `<p class="nota">🔑 Título secreto: <b>${esc(App.tituloSecreto(nivel))}</b></p>` : ''}<div id="pSol"><button class="btn sec" id="bSol">Ver las soluciones</button></div>`}
      </section>
      <section><h3>Niveles de la clase (${niveles.length})</h3>
        <ul class="lista-niv">${niveles.map(n => `<li><span class="cnt">${n.viñetas} ▭</span><span class="tit">${esc(n.titulo)}</span><code>${esc(n.codigo || AU.codificar(n))}</code><button class="btn sec mini" data-abrir="${n.id}">Jugar</button><button class="btn sec mini" data-borrar="${n.id}" aria-label="Borrar">🗑</button></li>`).join('') || '<li class="nota">Todavía no hay niveles creados en este navegador.</li>'}</ul>
        <div class="fila izq"><button class="btn sec" id="bCrear">✎ Crear un nivel</button><button class="btn sec" id="bCodigo">⌨ Importar un código</button><button class="btn sec" id="bExportar"${niveles.length ? '' : ' disabled'}>⬇ Exportar JSON</button><label class="btn sec" for="pImportar">⬆ Importar JSON</label><input type="file" id="pImportar" accept=".json,application/json" hidden></div>
      </section>
      <section><h3>Datos de este navegador</h3>
        <p class="nota">«Borrar mis datos» (en ☰ Niveles) solo borra las estrellas del alumno. Aquí se borra todo: estrellas, ajustes, contraseña, niveles de la clase y equipos.</p>
        <button class="btn rojo" id="bBorrarTodo">Borrar todo</button>
      </section>
      </div>
      <div class="fila"><button class="btn" data-cerrar>Cerrar</button></div>`, 'grande');
    d.querySelector('#pEscritor').addEventListener('change', ev => { a.escritor = ev.target.checked; App.guardar(); App.escritor.reiniciar(); App.pintarTodo(); });
    d.querySelectorAll('input[name="pEscNivel"]').forEach(r => r.addEventListener('change', ev => { a.escritorNivel = ev.target.value; App.guardar(); App.escritor.reiniciar(); App.pintarTodo(); }));
    d.querySelector('#pPret').addEventListener('change', ev => { a.preterito = ev.target.checked; App.guardar(); App.escritor.reiniciar(); App.pintarTodo(); });
    d.querySelector('#pClase').addEventListener('change', ev => { a.clase = ev.target.checked; App.guardar(); const c = $('#clase'); if (c.dataset.montado && a.modo === 'pizarra') c.hidden = !a.clase; App.ajustarTira(); });
    d.querySelector('#fNuevaClave').addEventListener('submit', ev => { ev.preventDefault(); const v = d.querySelector('#pNueva').value.trim(); if (v.length < 3) { App.toast('Mínimo 3 caracteres.'); return; } a.clave = v; App.guardar(); d.querySelector('#pNueva').value = ''; App.toast('Contraseña cambiada.'); });
    const bSol = d.querySelector('#bSol');
    if (bSol) bSol.addEventListener('click', async () => {
      const caja = d.querySelector('#pSol');
      caja.innerHTML = '<p class="nota">Calculando…</p>';
      const r = await resolverAsync(nivel, { max: 60 });
      if (!r) { caja.innerHTML = '<p class="nota">No se pudo calcular aquí (nivel muy grande o navegador sin Worker). Las soluciones de los niveles del juego están en la guía del profe.</p>'; return; }
      const cumpleSecreto = s => !!nivel.secreto && E.simular(nivel, s).secreto;
      const fila = s => `<div class="sol"><button class="btn sec mini" data-sol="${esc(JSON.stringify(s))}">Cargar</button><span>${cumpleSecreto(s) ? '<b title="Cumple también el título secreto">🔑</b> ' : ''}${esc(E.textoSolucion(s))}</span></div>`;
      const primeras = r.soluciones.slice(0, 6);
      const conSecreto = nivel.secreto && !primeras.some(cumpleSecreto) ? r.soluciones.find(cumpleSecreto) : null;
      caja.innerHTML = `<p class="nota">${r.total} ${r.total === 1 ? 'solución' : 'soluciones'}${r.desbordado ? ' (o más)' : ''}${nivel.secreto ? ` · ${r.ambas} con el título secreto 🔑` : ''} · densidad ${(r.densidad * 100).toFixed(2)} %</p>` +
        primeras.map(fila).join('') + (conSecreto ? fila(conSecreto) : '') +
        (nivel.secreto && !primeras.some(cumpleSecreto) && !conSecreto ? '<p class="nota">Ninguna de las primeras 60 soluciones cumple el secreto.</p>' : '');
      caja.querySelectorAll('[data-sol]').forEach(b => b.addEventListener('click', () => { d.close(); App.ponerViñetas(JSON.parse(b.dataset.sol), { silencio: true }); }));
    });
    d.querySelectorAll('[data-abrir]').forEach(b => b.addEventListener('click', () => { d.close(); App.abrirNivel(b.dataset.abrir); }));
    d.querySelectorAll('[data-borrar]').forEach(b => b.addEventListener('click', () => { if (confirm('¿Borrar este nivel de la clase?')) { almacen.borrar(b.dataset.borrar); recargarExtra(); if (App.nivel().id === b.dataset.borrar) App.abrirNivel(C.NIVELES[0].id); panelProfe(); } }));
    d.querySelector('#bCrear').addEventListener('click', () => { d.close(); abrirAutor(); });
    d.querySelector('#bCodigo').addEventListener('click', () => { d.close(); importarCodigo(); });
    d.querySelector('#bBorrarTodo').addEventListener('click', () => { if (confirm('¿Borrar TODO lo que el juego guarda en este navegador (estrellas, ajustes, contraseña, niveles de la clase, equipos)?')) { d.close(); App.borrarTodo(); App.toast('Todo borrado.'); } });
    d.querySelector('#bExportar').addEventListener('click', () => {
      const blob = new Blob([almacen.exportarTodo()], { type: 'application/json' });
      const aEl = el('a', { href: URL.createObjectURL(blob), download: 'sobrevives-niveles.json' });
      document.body.appendChild(aEl); aEl.click(); setTimeout(() => { URL.revokeObjectURL(aEl.href); aEl.remove(); }, 1000);
    });
    d.querySelector('#pImportar').addEventListener('change', ev => {
      const f = ev.target.files && ev.target.files[0]; if (!f) return;
      const lector = new FileReader();
      lector.onload = () => {
        try {
          const datos = JSON.parse(String(lector.result));
          const lista = Array.isArray(datos) ? datos : (datos && Array.isArray(datos.niveles) ? datos.niveles : []);
          const validos = lista.filter(nivelValido), descartados = lista.length - validos.length;
          const k = validos.length ? almacen.importarTodo(JSON.stringify(validos)) : 0;
          recargarExtra();
          App.toast(`${k} ${k === 1 ? 'nivel importado' : 'niveles importados'}${descartados ? ` · ${descartados} no válidos` : ''}.`, 4000);
          panelProfe();
        } catch (e) { App.toast('Este fichero no vale.'); }
      };
      lector.readAsText(f);
    });
  }

  /* =====================================================================
     5. Arranque: ganchos en SVApp
     ===================================================================== */
  App.iniciarModulos = function () {
    recargarExtra();
    App.abrirAutor = abrirAutor;
    App.abrirProfe = abrirProfe;
    App.imprimir = imprimir;
    App.importarCodigo = importarCodigo;
    App.borrarDatos = function () { store.removeItem('sobrevives.autor.v0'); store.removeItem('sobrevives.pizarra.v0'); App.escritor.reiniciar(); autorizado = false; };
    App.alSimular = function (res) {
      if (barra && !barra.hidden) { const b = barra.querySelector('#bGuardar'); if (b) b.disabled = !autorListo(res); if (!App.nivel().enConstruccion) barra.hidden = true; }
    };
    const bi = $('#btnImprimir');
    bi.hidden = false;
    bi.addEventListener('click', imprimir);
  };
})();
