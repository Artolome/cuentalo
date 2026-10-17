/* Cuéntalo — interfaz principal. Vanilla JS, sin dependencias.
   Arrastrar-soltar + repliegue clic-clic (clic en la carta, clic en la viñeta). Todo en localStorage.
   Expone window.SVApp (ganchos para los módulos Autor / Profe / Escritor / Imprimir, en src/ui-modos.js). */
(function () {
  'use strict';
  const C = window.SVContenido, E = window.SVEngine, AP = window.SVArtePersonajes, AE = window.SVArteEscenas;
  const FR = window.SVAtelierFrench, CARDS = window.SVAtelierCards;
  const $ = s => document.querySelector(s);
  const el = (tag, attrs, html) => { const n = document.createElement(tag); if (attrs) for (const k in attrs) { if (k === 'class') n.className = attrs[k]; else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]); else n.setAttribute(k, attrs[k]); } if (html !== undefined) n.innerHTML = html; return n; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); // los títulos de autor son texto libre
  const PJ = {}; for (const p of C.PERSONAJES) PJ[p.id] = p;
  const ES = {}; for (const e of C.ESCENAS) ES[e.id] = e;
  const KEY = 'cuentalo.progreso.v0';
  const DIF = { 1: 'Paso a paso', 2: 'Estándar', 3: 'Reto' };
  const partidas = window.SVPartidas.crear({
    getItem: k => localStorage.getItem(k), setItem: (k, v) => localStorage.setItem(k, v), removeItem: k => localStorage.removeItem(k)
  });

  /* ---------- estado de la aplicación ---------- */
  let nivel = null, viñetas = [], res = null, seleccion = null, intentos = 0, pistaIdx = 0;
  let progreso = cargar();
  let traduccion = ajustes().traduction === true;
  let extra = []; // niveles de autor (los añade ui-modos.js)
  let pizarraApi = null; // barra de clase montada (cronómetro, sorteo, equipos)
  let relato = ['', '', ''], ayudaActiva = true, exitoTimer = 0;
  function cargar() { try { const p = JSON.parse(localStorage.getItem(KEY) || '{}'); return p && typeof p === 'object' && !Array.isArray(p) ? p : {}; } catch (_) { return {}; } }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(progreso)); } catch (_) { /* sin almacenamiento */ } }
  function ajustes() { if (!progreso.ajustes || typeof progreso.ajustes !== 'object' || Array.isArray(progreso.ajustes)) progreso.ajustes = { modo: null, dif: 2, escritor: false, preterito: false }; return progreso.ajustes; }
  const dif = () => [1, 2, 3].includes(ajustes().dif) ? ajustes().dif : 2;
  const progresoDe = id => {
    const p = progreso[id] && typeof progreso[id] === 'object' && !Array.isArray(progreso[id]) ? progreso[id] : {};
    p.estrellas = Number.isInteger(p.estrellas) && p.estrellas >= 0 && p.estrellas <= 3 ? p.estrellas : 0;
    return p;
  };
  const tiempo = () => ajustes().preterito ? 'pret' : 'pres';
  const todosNiveles = () => C.NIVELES.concat(extra);

  function guardarPartida() {
    if (!nivel || nivel.enConstruccion) return false;
    return partidas.guardar(nivel, { viñetas, intentos, pistaIdx, ultimoFallo, celebrada: exitoMostrado, relato,
      escritor: window.SVApp.escritor && window.SVApp.escritor.exportar ? window.SVApp.escritor.exportar() : null });
  }

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
    clearTimeout(exitoTimer);
    if ($('#dlgExito').open) $('#dlgExito').close();
    if ($('#dlgRelato') && $('#dlgRelato').open) $('#dlgRelato').close();
    nivel = todosNiveles().find(n => n.id === id) || C.NIVELES[0];
    const partida = partidas.leer(nivel);
    viñetas = partida.viñetas; relato = partida.relato;
    seleccion = null; intentos = partida.intentos; pistaIdx = partida.pistaIdx;
    ultimoFallo = partida.ultimoFallo; exitoMostrado = partida.celebrada; avisoEscritor = '';
    if (window.SVApp.escritor) window.SVApp.escritor.reiniciar();
    if (window.SVApp.escritor && window.SVApp.escritor.restaurar) window.SVApp.escritor.restaurar(partida.escritor);
    progreso.actual = nivel.id; guardar();
    pintarTodo();
    seleccionar(null);
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
    document.body.classList.toggle('cultural', !!nivel.cultura);
    $('#subcap').textContent = nivel.libre ? 'nivel libre' : nivel.autor ? 'nivel de autor' : nivel.capitulo === 4 ? 'viajes y culturas' : nivel.capitulo === 5 ? 'libros y artistas' : `capítulo ${nivel.capitulo}`;
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
    pintarCultura();
    pintarStock();
    pintarTira();
    simular();
    pintarNiveles();
    pintarLexico();
    if (window.SVApp.alPintar) window.SVApp.alPintar();
  }
  function pintarCultura() {
    const ficha = $('#culturaNivel');
    const entrada = nivel.cultura;
    const c = entrada && typeof entrada === 'object' && ['lugar', 'pais', 'dato'].every(k => typeof entrada[k] === 'string') ? entrada : null;
    ficha.hidden = !c;
    if (!c) { ficha.innerHTML = ''; ficha.removeAttribute('data-nivel'); return; }
    if (ficha.dataset.nivel !== nivel.id) ficha.open = false;
    ficha.dataset.nivel = nivel.id;
    const nombre = c.obra || c.artista || c.autor || c.lugar;
    const referencia = nivel.capitulo === 5 ? `<p class="cultura-referencia">${esc([c.autor, c.lugar].filter(Boolean).join(' · '))}</p>` : '';
    const palabras = Array.isArray(c.palabras) ? c.palabras.map(w => typeof w === 'string' ? w : w && w.palabra).filter(w => typeof w === 'string' && w.trim()) : [];
    ficha.innerHTML = `<summary><span class="cultura-sello">${nivel.capitulo === 5 ? 'Libros y artistas' : 'Nuestro viaje'}</span><strong>${esc(nombre)}</strong><span class="cultura-pais">${esc(c.pais)}</span><span class="cultura-descubrir">Descubrir</span></summary><div class="cultura-contenido">${referencia}<p>${esc(c.dato)}</p>${palabras.length ? `<p class="cultura-palabras"><b>Palabras para contar:</b> ${palabras.map(esc).join(' · ')}</p>` : ''}</div>`;
  }
  function pintarStock() {
    const se = $('#stockEscenas'); se.innerHTML = '';
    for (const id of nivel.escenas) {
      const e = ES[id];
      const info = CARDS.scenes[id];
      const c = el('div', { class: 'carta escena', draggable: 'true', 'data-tipo': 'escena', 'data-id': id, role: 'button', tabindex: '0', 'aria-pressed': 'false', 'aria-label': e.nombre + '. ' + info.shortEs + '. ' + e.slots + ' personnage' + (e.slots > 1 ? 's' : '') + ' maximum.' });
      c.innerHTML = AE.escenaSVG(id) + `<span class="nom">${esc(e.nombre)}</span><span class="carte-effet" lang="es">${esc(info.shortEs)}</span><span class="atelier-fr carte-fr" lang="fr" hidden>${esc(info.nameFr)} · ${esc(info.shortFr)}</span><span class="carte-capacite" lang="fr">${e.slots === 1 ? '1 personnage' : '1–2 personnages'}</span><span class="carte-selected" lang="fr" hidden>✓ Choisie</span>`;
      arrastrable(c, 'escena', id);
      carteAvecApercu(se, c, 'escena', id, e.nombre);
    }
    const sp = $('#stockPersonajes'); sp.innerHTML = '';
    for (const id of nivel.personajes) {
      const p = PJ[id];
      const info = CARDS.characters[id];
      const c = el('div', { class: 'carta ficha ' + id, draggable: 'true', 'data-tipo': 'personaje', 'data-id': id, role: 'button', tabindex: '0', 'aria-pressed': 'false', 'aria-label': p.nombre + '. ' + info.shortEs });
      c.innerHTML = AP.retratoSVG(p) + `<span class="nom">${esc(p.nombre)}</span><span class="carte-effet" lang="es">${esc(info.shortEs)}</span><span class="atelier-fr carte-fr" lang="fr" hidden>${esc(info.shortFr)}</span><span class="carte-selected" lang="fr" hidden>✓ Choisie</span>`;
      arrastrable(c, 'personaje', id);
      carteAvecApercu(sp, c, 'personaje', id, p.nombre);
    }
    $('#stock').style.setProperty('--n-cartas', nivel.escenas.length + nivel.personajes.length);
  }
  function carteAvecApercu(host, card, tipo, id, name) {
    const wrap = el('div', {class:'atelier-card-wrap'});
    const more = el('button', {class:'carte-info', type:'button', lang:'fr', 'aria-label':'Agrandir la carte : '+name}, 'Agrandir');
    more.onclick = () => apercuCarte(tipo, id);
    wrap.append(card, more); host.appendChild(wrap);
  }
  function apercuCarte(tipo, id) {
    const scene = tipo === 'escena', item = scene ? ES[id] : PJ[id], info = scene ? CARDS.scenes[id] : CARDS.characters[id];
    const d = $('#dlgCarte');
    d.innerHTML = `<h2 id="titreCarte">${esc(item.nombre)}</h2><div class="atelier-card-large">${scene ? AE.escenaSVG(id) : AP.personajeSVG(item, 'contento')}</div>${scene ? `<p class="carte-capacite" lang="fr">Cette scène accueille ${item.slots === 1 ? 'un seul personnage' : 'un ou deux personnages'}.</p>` : ''}<p class="carte-detail" lang="es">${esc(scene ? info.detailEs : info.shortEs)}</p><p class="atelier-fr" lang="fr" hidden>${esc(scene ? info.detailFr : info.shortFr)}</p><div class="fila"><button class="btn sec" data-atelier-translate type="button" lang="fr">Traduction</button><button class="btn sec" data-close type="button" lang="fr">Fermer</button><button class="btn verde" data-use type="button" lang="fr">Utiliser cette carte</button></div>`;
    d.querySelector('[data-close]').onclick = () => d.close();
    d.querySelector('[data-use]').onclick = () => { d.close(); seleccionar({tipo,id}); $('#stock').querySelector(`[data-tipo="${tipo}"][data-id="${id}"]`).focus(); };
    d.querySelector('[data-atelier-translate]').onclick = toggleTraduction;
    pintarTraduccion(); d.showModal();
  }
  function arrastrable(c, tipo, id) {
    c.addEventListener('dragstart', ev => { ev.dataTransfer.setData('text/plain', tipo + ':' + id); ev.dataTransfer.effectAllowed = 'copy'; seleccionar(null); });
    const clic = () => seleccionar(seleccion && seleccion.id === id && seleccion.tipo === tipo ? null : { tipo, id });
    c.addEventListener('click', clic);
    c.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); clic(); } });
  }
  function seleccionar(s) {
    seleccion = s;
    if (s && window.matchMedia('(max-height:800px) and (min-width:721px)').matches) $('#culturaNivel').open = false;
    document.querySelectorAll('.carta').forEach(c => { const chosen = !!s && c.dataset.tipo === s.tipo && c.dataset.id === s.id; c.classList.toggle('sel', chosen); c.setAttribute('aria-pressed', String(chosen)); const badge=c.querySelector('.carte-selected'); if(badge)badge.hidden=!chosen; });
    document.body.classList.toggle('seleccion', !!s);
    document.querySelectorAll('#tira .escena-caja').forEach(c => c.classList.toggle('compatible', !!s && (s.tipo === 'escena' || !!viñetas[+c.dataset.i].escena)));
    $('#selectionCarte').hidden = !s;
    $('#selectionText').textContent = s ? `« ${s.tipo === 'escena' ? ES[s.id].nombre : PJ[s.id].nombre} » choisie. Clique sur ${s.tipo === 'escena' ? 'une case' : 'une case avec une scène'}.` : '';
    pintarAyuda();
  }
  function pintarTira() {
    const tira = $('#tira'); tira.innerHTML = '';
    const n = nivel.viñetas;
    // Lecture de gauche à droite ; la grille passe sur plusieurs lignes sur petit écran.
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
        esc.appendChild(el('span', { class: 'atelier-scene-name' }, window.SVApp.esc(ES[v.escena].nombre)));
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
      caja.appendChild(el('p', {class:'frase-traduction atelier-fr',lang:'fr',hidden:''}));
      tira.appendChild(caja);
    });
    seleccionar(seleccion); ajustarTira();
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
    let cambio = '';
    if (tipo === 'escena') {
      v.escena = id;
      const slots = ES[id].slots;
      if (v.personajes.length > slots) { cambio = `${v.personajes.slice(slots).map(p=>PJ[p].nombre).join(', ')} quitte cette case : « ${ES[id].nombre} » accueille ${slots} personnage.`; v.personajes = v.personajes.slice(0, slots); }
    } else {
      if (!v.escena) { toast('Ajoute d’abord une scène dans cette case, puis ton personnage.'); return false; }
      if (v.personajes.includes(id)) { toast(`${PJ[id].nombre} ya está en esta viñeta.`); return false; }
      const slots = ES[v.escena].slots;
      if (v.personajes.length >= slots) { cambio = `${PJ[id].nombre} remplace ${PJ[v.personajes[slots - 1]].nombre} : cette scène accueille ${slots} personnage${slots > 1 ? 's' : ''} maximum.`; if (slots === 1) v.personajes = [id]; else v.personajes[slots - 1] = id; }
      else v.personajes.push(id);
    }
    pintarTira(); simular();
    if(cambio)toast(cambio,6000);
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
      if (!v.escena) { f.textContent = '1. Elige una escena.'; f.className = 'frase vacia'; }
      else if (!v.personajes.length) { f.textContent = '2. Añade un personaje.'; f.className = 'frase vacia'; }
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
    pintarTraduccion();
    // estado del nivel
    const est = $('#estadoNivel'), tt = $('#tituloTxt');
    if (window.SVApp.alSimular) window.SVApp.alSimular(res);
    if (nivel.libre || nivel.enConstruccion) { est.textContent = res.incompleto ? `${viñetas.filter(v => v.escena && v.personajes.length).length}/${nivel.viñetas} viñetas` : (nivel.enConstruccion && !res.valido ? 'Hay un problema: mira la frase en rojo' : '¡Historia completa!'); est.className = res.incompleto || !res.valido ? '' : 'ok'; $('#btnImprimir').disabled = res.incompleto; guardarPartida(); pintarAyuda(); pintarContar(); return; }
    tt.classList.toggle('ok', res.resuelto);
    $('#btnImprimir').disabled = !res.resuelto || escritorPendiente(); // en modo escritor, imprimir revelaría las frases
    if (res.resuelto) { est.textContent = '✔ ¡Muy bien!' + (res.secreto ? ' 🔑 ¡Título secreto!' : ''); est.className = 'ok'; exito(); }
    else if (res.incompleto || res.faltan.length) { est.textContent = ''; est.className = ''; }
    else { est.textContent = 'Todavía no…'; est.className = ''; fallo(); }
    guardarPartida(); pintarAyuda(); pintarContar();
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
    if (ayudaActiva && !ajustes().ayudaVista) cerrarAyuda(false);
    pintarNiveles();
    mostrarExito(p);
  }
  function escritorPendiente() { return !!(window.SVApp.escritor && window.SVApp.escritor.activo() && !window.SVApp.escritor.completo()); }
  /* Le français suit les événements du moteur, sans changer les cartes ni relancer la partie. */
  function pintarTraduccion() {
    if (!nivel || !res) return;
    const fr = FR.story(nivel, res, {tiempo:tiempo()});
    const titulo = $('#titreTraduction'), inicio = $('#inicioTraduction');
    titulo.textContent = fr.title || '';
    inicio.textContent = fr.initial.length ? 'Au début : ' + fr.initial.join(' ') : '';
    titulo.hidden = !traduccion || !titulo.textContent;
    inicio.hidden = !traduccion || !inicio.textContent;
    const pendiente = escritorPendiente();
    document.querySelectorAll('#tira .vineta').forEach((caja,i) => {
      const p = caja.querySelector('.frase-traduction'), v = viñetas[i];
      // Aucune réponse française, même cachée dans le DOM, avant validation en mode écrivain.
      const visible = !pendiente || window.SVApp.escritor.hecha(i);
      p.textContent = !v.escena ? '1. Choisis une scène.' : !v.personajes.length ? '2. Ajoute un personnage.' : visible ? fr.panels[i] : '';
      p.hidden = !traduccion || !p.textContent;
    });
    document.querySelectorAll('#stock .carte-fr, #panelLexico .atelier-fr, #dlgCarte .atelier-fr, #dlgPista .atelier-fr, #dlgQuePasa .atelier-fr').forEach(p => { p.hidden = !traduccion || !p.textContent; });
    document.querySelectorAll('#btnTraduction, [data-atelier-translate]').forEach(b => {
      b.setAttribute('aria-pressed', String(traduccion));
      b.setAttribute('aria-label', traduccion ? 'Masquer la traduction française' : 'Afficher la traduction française');
      b.textContent = traduccion ? 'Traduction ✓' : 'Traduction';
    });
  }
  function toggleTraduction() {
    traduccion = !traduccion; ajustes().traduction = traduccion; guardar();
    pintarTraduccion(); ajustarTira();
  }
  function mostrarExito(p) {
    p = p || progresoDe(nivel.id);
    const d = $('#dlgExito');
    const sec = res.secreto ? `<p>🔑 Título secreto: <b>${esc(tituloSecreto(nivel))}</b></p>` : (nivel.secreto ? '<p class="alt">Hay un título secreto en este nivel… ¿lo encuentras?</p>' : '');
    d.innerHTML = `<h2>¡Muy bien!</h2><div class="grande">${'★'.repeat(p.estrellas || 0)}${'☆'.repeat(3 - (p.estrellas || 0))}</div>
      <p><b>${esc(nivel.titulo)}</b></p>${sec}
      <p class="relato-invitacion">¿La cuentas con tus palabras? Di o escribe tres frases. Es opcional.</p>
      <div class="fila"><button class="btn sec" id="btnSeguir">Cerrar</button><button class="btn sec" id="btnImprimirDlg">🖨 Imprimir</button><button class="btn" id="btnLeer">Leer la historia</button><button class="btn sec" id="btnRelatoExito">✎ Contar con mis palabras</button><button class="btn verde" id="btnSig">Siguiente nivel →</button></div>`;
    d.querySelector('#btnSeguir').onclick = () => d.close();
    d.querySelector('#btnLeer').onclick = () => { d.close(); quePasa(); };
    d.querySelector('#btnSig').onclick = () => { d.close(); siguienteNivel(); };
    d.querySelector('#btnRelatoExito').onclick = () => { d.close(); abrirRelato(); };
    const bi = d.querySelector('#btnImprimirDlg');
    if (window.SVApp.imprimir) bi.onclick = () => { d.close(); window.SVApp.imprimir(); }; else bi.hidden = true;
    clearTimeout(exitoTimer);
    const firma = nivel.id + '|' + JSON.stringify(viñetas);
    exitoTimer = setTimeout(() => { if (!(window.SVHistorias && window.SVHistorias.activo()) && !(window.SVExploracion && window.SVExploracion.activo()) && !d.open && res.resuelto && !escritorPendiente() && firma === nivel.id + '|' + JSON.stringify(viñetas)) d.showModal(); }, 350);
    hablar(res.frasesTodas.join(' '));
  }

  /* ---------- primeras acciones: ayuda breve, sin bloquear el juego ---------- */
  function montarAyuda() {
    const ayuda = el('section', { id: 'ayudaJuego', class: 'ayuda-juego', lang:'fr', 'aria-label': 'Comment jouer' });
    ayuda.innerHTML = '<ol class="ayuda-etapes"><li><b>1. Choisis une scène</b><br>Clique sur une carte, puis sur une case.</li><li><b>2. Ajoute un personnage</b><br>Clique sur son portrait, puis sur la scène.</li><li><b>3. Construis ton histoire</b><br>Lis ce qui arrive, puis complète la case suivante.</li></ol><p class="ayuda-action" role="status" aria-live="polite" aria-atomic="true"></p><details class="ayuda-astuces"><summary>Quelques astuces</summary><ul><li>Les cases se lisent de gauche à droite. Le titre indique le but à atteindre.</li><li>Tu peux utiliser plusieurs fois la même carte. Le personnage garde ce qui lui est arrivé dans les cases précédentes.</li><li>« Agrandir » montre la carte et explique son effet. « Indice » aide à réussir l’histoire.</li><li>Pour corriger : annule la sélection, puis clique sur un personnage pour le retirer. Le × vide toute la case.</li></ul></details><button type="button" id="btnCerrarAyuda" class="btn sec mini">Compris ×</button>';
    $('#titulo').appendChild(ayuda);
    const boton = el('button', { id: 'btnAyuda', class: 'btn sec', type: 'button', lang:'fr', 'aria-controls': 'ayudaJuego', 'aria-expanded': 'false' }, '? Comment jouer');
    $('#cab .acciones').insertBefore(boton, $('#btnPista'));
    boton.onclick = () => { ayudaActiva = !ayudaActiva; if (!ayudaActiva) { ajustes().ayudaVista = true; guardar(); } pintarAyuda(); ajustarTira(); };
    $('#btnCerrarAyuda').onclick = () => cerrarAyuda(true);
    ayudaActiva = !ajustes().ayudaVista;
  }
  function cerrarAyuda(foco) {
    ayudaActiva = false; ajustes().ayudaVista = true; guardar(); pintarAyuda(); ajustarTira();
    if (foco) $('#btnAyuda').focus();
  }
  function pintarAyuda() {
    const a = $('#ayudaJuego'); if (!a || !nivel) return;
    const visible = ayudaActiva && !nivel.enConstruccion;
    a.hidden = !visible; $('#btnAyuda').hidden = !!nivel.enConstruccion;
    $('#btnAyuda').setAttribute('aria-expanded', String(visible));
    if (!visible) return;
    let paso = 2, texto;
    if (seleccion) {
      paso = seleccion.tipo === 'escena' ? 0 : 1;
      texto = seleccion.tipo === 'escena' ? 'Scène choisie : clique maintenant sur une case de ton histoire.' : 'Personnage choisi : clique sur une case qui contient déjà une scène.';
    } else if (!viñetas.some(v => v.escena)) {
      paso = 0; texto = 'Pour commencer, choisis une carte dans la zone « 1. Scènes ».';
    } else if (viñetas.some(v => v.escena && !v.personajes.length)) {
      paso = 1; texto = 'Une scène attend un personnage : choisis son portrait, puis clique sur cette scène.';
    } else if (res && res.incompleto) {
      texto = 'Lis la phrase sous chaque image. Continue dans la case suivante pour atteindre le but du titre.';
    } else if (escritorPendiente()) {
      texto = 'À toi de trouver les phrases espagnoles ! La traduction apparaît après chaque réponse validée.';
    } else {
      texto = nivel.libre ? 'Ton histoire est complète ! Tu peux encore changer les cartes ou la raconter avec tes mots.' : 'Ton histoire correspond-elle au titre ? « ¿Qué pasa? » explique le résultat. « Indice » peut t’aider.';
    }
    a.querySelectorAll('.ayuda-etapes li').forEach((li,i) => li.classList.toggle('active',i === paso));
    const t = a.querySelector('.ayuda-action');
    if (t.textContent !== texto) t.textContent = texto;
  }

  /* ---------- producción libre después del juego: sin nota automática ---------- */
  function puedeContar() { return !!nivel && !nivel.enConstruccion && !!res && (nivel.libre ? !res.incompleto && res.valido : res.resuelto && !escritorPendiente()); }
  function pintarContar() { const b = $('#btnContar'); if (b) b.hidden = !puedeContar(); }
  function montarRelato() {
    const boton = el('button', { id: 'btnContar', class: 'btn sec', type: 'button', hidden: '', 'aria-haspopup': 'dialog' }, '✎ Contar');
    $('#cab .acciones').insertBefore(boton, $('#btnImprimir'));
    boton.onclick = abrirRelato;
    const d = el('dialog', { id: 'dlgRelato', class: 'relato-dialog', 'aria-labelledby': 'relatoTitulo' });
    document.body.appendChild(d);
  }
  function abrirRelato() {
    if (!puedeContar()) return;
    const d = $('#dlgRelato'), id = nivel.id;
    d.innerHTML = `<h2 id="relatoTitulo">Cuéntalo con tus palabras</h2><p class="relato-intro">Cuenta tu historia en tres frases, en voz alta o por escrito. Puedes usar «primero», «después» y «al final».</p><p class="nota">Es opcional. El juego no corrige estas frases ni cambia tus estrellas. Puedes revisarlas con tu profe.</p>
      <div class="relato-campos">${['Primero…', 'Después…', 'Al final…'].map((t, i) => `<label for="relato${i}">${i + 1}. ${t}<textarea id="relato${i}" rows="2" maxlength="500" lang="es" placeholder="Tu frase…">${esc(relato[i])}</textarea></label>`).join('')}</div>
      <p class="relato-estado nota" role="status" aria-live="polite">Tu borrador se guarda solo en este navegador.</p><div class="fila"><button type="button" class="btn" id="cerrarRelato">Volver a la historia</button></div>`;
    d.querySelectorAll('textarea').forEach((input, i) => input.addEventListener('input', () => {
      if (nivel.id !== id) return;
      relato[i] = input.value.slice(0, 500);
      const guardado = guardarPartida();
      d.querySelector('.relato-estado').textContent = guardado ? 'Borrador guardado en este navegador.' : 'El navegador no permite guardar: copia tus frases antes de cerrar la página.';
    }));
    d.querySelector('#cerrarRelato').onclick = () => { d.close(); $('#btnContar').focus(); };
    d.showModal();
  }

  /* ---------- ¿Qué pasa? ---------- */
  function quePasa() {
    const d = $('#dlgQuePasa');
    const fr = FR.story(nivel, res, {tiempo:tiempo()});
    // En modo escritor, las frases que el alumno todavía no ha elegido o escrito no se muestran aquí (se conserva el diagnóstico).
    const oculto = escritorPendiente();
    const visible = i => !oculto || window.SVApp.escritor.hecha(i);
    const partes = res.viñetas.map((v, i) => `<p data-f="${i}"${visible(i) ? ` data-es="${esc(v.frases.join(' '))}"` : ' class="oculta"'}><b>${i + 1}.</b> ${!v.frases.length ? '<i>…</i>' : visible(i) ? esc(v.frases.join(' ')) : '<i>¿Qué frase es? Mírala en la viñeta.</i>'}${visible(i) && fr.panels[i] ? `<span class="atelier-fr" lang="fr" hidden>${esc(fr.panels[i])}</span>` : ''}</p>`).join('');
    const resumen = res.resumen.length ? `<h3>Al final</h3>${res.resumen.map(s => `<p class="res" data-es="${esc(s)}">${esc(s)}</p>`).join('')}${fr.summary.length ? `<p class="atelier-fr" lang="fr" hidden>${esc(fr.summary.join(' '))}</p>` : ''}` : '';
    let juicio = '';
    if (!nivel.libre) {
      if (res.resuelto) juicio = `<div class="porque ok">✔ ¡Muy bien! Esta historia es: «${esc(nivel.titulo)}».</div>`;
      else if (res.porque.length) juicio = `<div class="porque">${res.porque.map(p => `<div>✗ ${esc(p)}</div>`).join('')}</div>`;
    }
    d.innerHTML = `<h2>¿Qué pasa?</h2>${fr.title ? `<p class="atelier-fr" lang="fr" hidden>${esc(fr.title)}</p>` : ''}<div class="historia">${partes}${resumen}</div>${juicio}${fr.reason ? `<p class="atelier-fr" lang="fr" hidden>${esc(fr.reason)}</p>` : ''}
      <div class="fila"><button class="btn sec" id="btnOir">🔊 Escuchar todo</button><button class="btn sec" data-atelier-translate lang="fr">Traduction</button><button class="btn" id="btnCerrar">Cerrar</button></div>`;
    d.querySelectorAll('.historia [data-es]').forEach(p => p.addEventListener('click', () => hablar(p.dataset.es)));
    d.querySelector('#btnOir').onclick = () => hablar(res.viñetas.filter((v, i) => visible(i)).map(v => v.frases.join(' ')).concat(res.resumen).join(' '));
    d.querySelector('#btnCerrar').onclick = () => d.close();
    d.querySelector('[data-atelier-translate]').onclick = toggleTraduction;
    pintarTraduccion();
    d.showModal();
  }

  function mostrarIndice() {
    const pistas = nivel.pistas || [], index = pistas.length ? pistaIdx % pistas.length : 0;
    const texto = pistas.length ? pistas[index] : nivel.libre ? '¡Inventa tu historia! Puedes reutilizar las cartas.' : 'Mira el título y lee las frases de tu historia.';
    const fr = pistas.length ? FR.hint(nivel,index) : nivel.libre ? 'Invente ton histoire ! Tu peux réutiliser les cartes.' : 'Regarde le titre et lis les phrases de ton histoire.';
    const d = $('#dlgPista');
    d.innerHTML = `<h2 id="titreIndice" lang="fr">💡 Un indice pour ton histoire</h2>${pistas.length ? `<p class="nota" lang="fr">Indice ${index + 1} sur ${pistas.length}</p>` : ''}<p lang="es">${esc(texto)}</p>${fr ? `<p class="atelier-fr" lang="fr" hidden>${esc(fr)}</p>` : ''}<div class="fila"><button class="btn sec" data-atelier-translate lang="fr">Traduction</button>${pistas.length > 1 ? '<button class="btn sec" data-next lang="fr">Indice suivant</button>' : ''}<button class="btn" data-close lang="fr">Fermer</button></div>`;
    if (pistas.length) { pistaIdx++; guardarPartida(); }
    const next = d.querySelector('[data-next]'); if(next)next.onclick = () => { mostrarIndice(); d.querySelector('[data-next]').focus(); };
    d.querySelector('[data-close]').onclick = () => d.close();
    d.querySelector('[data-atelier-translate]').onclick = toggleTraduction;
    pintarTraduccion(); if(!d.open)d.showModal();
  }

  /* ---------- paneles ---------- */
  function cerrarPaneles() { $('#panelNiveles').hidden = true; $('#panelLexico').hidden = true; $('#menuDif').hidden = true; }
  function pintarNiveles() {
    const p = $('#panelNiveles');
    const caps = { 1: 'Capítulo 1 · Solo en la selva', 2: 'Capítulo 2 · Juntos', 3: 'Capítulo 3 · El grupo', 4: 'Capítulo 4 · Viajes y culturas', 5: 'Capítulo 5 · Libros y artistas', 0: 'Nivel libre', 9: 'Niveles de la clase' };
    const vis = nivelesVisibles();
    let html = `<h2>Niveles <button class="btn sec cerrar" aria-label="Cerrar">×</button></h2>`;
    for (const c of [1, 2, 3, 4, 5, 0, 9]) {
      const lista = vis.filter(n => (c === 9 ? n.autor : n.capitulo === c && !n.autor));
      if (!lista.length) continue;
      html += `<h3>${caps[c]}</h3>`;
      for (const n of lista) {
        const pr = progresoDe(n.id);
        const est = n.libre ? '' : `<span class="estrellas">${'★'.repeat(pr.estrellas || 0)}${'☆'.repeat(3 - (pr.estrellas || 0))}${pr.secreto ? ' 🔑' : ''}</span>`;
        html += `<button class="niv${esActual(n) ? ' actual' : ''}${pr.estrellas ? ' hecho' : ''}" data-id="${esc(n.id)}"><span class="cnt">${n.libre ? '✎' : n.viñetas + ' ▭'}</span><span>${esc(n.titulo)}${n.cultura ? `<small class="niv-lugar">${esc(n.cultura.pais)} · ${esc(n.cultura.obra || n.cultura.artista || n.cultura.autor || n.cultura.lugar)}</small>` : ''}</span>${est}</button>`;
      }
    }
    if (window.SVApp.abrirAutor) html += `<h3>Crear</h3><button class="btn sec" id="btnIrAutor">✎ Crear un nivel</button> <button class="btn sec" id="btnImportar">⌨ Tengo un código</button>`;
    html += `<h3>Datos</h3><button class="btn sec" id="btnBorrarDatos">Borrar mis datos</button><p class="nota">Borra tus estrellas, partidas y borradores de frases de este navegador. Los niveles de la clase y los ajustes del profe se quedan. Ningún dato sale de este ordenador.</p>`;
    p.innerHTML = html;
    p.querySelector('.cerrar').onclick = () => { p.hidden = true; };
    p.querySelectorAll('.niv').forEach(b => b.onclick = () => { p.hidden = true; abrirNivel(b.dataset.id); });
    p.querySelector('#btnBorrarDatos').onclick = () => { if (confirm('¿Borrar tus estrellas, partidas y borradores de frases de este navegador?')) { borrarMisDatos(); toast('Datos borrados.'); } };
    const ia = p.querySelector('#btnIrAutor'); if (ia) ia.onclick = () => { p.hidden = true; window.SVApp.abrirAutor(); };
    const im = p.querySelector('#btnImportar'); if (im) im.onclick = () => { p.hidden = true; window.SVApp.importarCodigo(); };
  }
  /* Alumno: estrellas, nivel actual y ajustes de juego. Se conservan el modo, la contraseña del profe y los niveles de la clase. */
  function borrarMisDatos() {
    if (window.SVHistorias) window.SVHistorias.borrar();
    if (window.SVExploracion) window.SVExploracion.borrar();
    const a = ajustes(), conservar = { modo: a.modo, clave: a.clave, escritor: a.escritor, escritorNivel: a.escritorNivel, preterito: a.preterito, traduction: traduccion };
    partidas.borrarTodo(); ayudaActiva = true;
    progreso = { ajustes: Object.assign({ dif: 2 }, conservar) }; guardar();
    if (window.SVApp.escritor) window.SVApp.escritor.reiniciar();
    abrirNivel(nivel && !nivel.enConstruccion ? nivel.id : C.NIVELES[0].id);
  }
  /* Profe: todo lo que el juego guarda en este navegador (progreso, ajustes, contraseña, niveles de la clase, barra de clase). */
  function borrarTodo() {
    if (window.SVHistorias) window.SVHistorias.borrar();
    if (window.SVExploracion) window.SVExploracion.borrar();
    // la barra de clase se desmonta antes de borrar su almacenamiento (si no, volvería a guardar nombres y puntos)
    if (pizarraApi) { try { pizarraApi.destruir(); } catch (_) { /* nada */ } pizarraApi = null; delete $('#clase').dataset.montado; }
    progreso = {}; traduccion = false; guardar();
    partidas.borrarTodo(); ayudaActiva = true;
    if (window.SVApp.borrarDatos) window.SVApp.borrarDatos();
    extra = [];
    document.body.classList.remove('pizarra'); document.documentElement.classList.remove('pizarra');
    $('#clase').hidden = true; $('#btnClase').hidden = true;
    abrirNivel(C.NIVELES[0].id); pintarInicio();
  }
  function pintarLexico() {
    const p = $('#panelLexico');
    const lex = E.lexicoDe(nivel);
    p.innerHTML = `<h2>Léxico <button class="btn sec cerrar" aria-label="Cerrar">×</button></h2><p class="nota" lang="fr">Les mots de cette histoire. Clique pour écouter l’espagnol.</p><div class="lex">${lex.map(w => `<button data-w="${esc(w.palabra)}"><span>${esc(w.picto)}</span><span>${esc(w.palabra)}</span>${CARDS.lexicon[w.palabra] ? `<small class="atelier-fr" lang="fr"${traduccion ? '' : ' hidden'}>${esc(CARDS.lexicon[w.palabra])}</small>` : ''}</button>`).join('')}</div>`;
    p.querySelector('.cerrar').onclick = () => { p.hidden = true; };
    p.querySelectorAll('.lex button').forEach(b => b.onclick = () => hablar(b.dataset.w));
  }

  /* ---------- botones ---------- */
  $('#btnInicio').onclick = pintarInicio;
  function abrirCapitulo(capitulo) {
    const primero = nivelesVisibles().find(n => n.capitulo === capitulo) || C.NIVELES.find(n => n.capitulo === capitulo);
    if (!primero) return;
    if (!nivelesVisibles().some(n => n.id === primero.id)) ajustes().dif = 2;
    elegirModo(ajustes().modo === 'pizarra' ? 'pizarra' : 'solo');
    abrirNivel(primero.id);
  }
  $('#btnCulturas').onclick = () => abrirCapitulo(4);
  $('#btnLibros').onclick = () => window.SVExploracion ? window.SVExploracion.biblioteca() : window.SVHistorias ? window.SVHistorias.biblioteca() : abrirCapitulo(5);
  $('#culturaNivel').addEventListener('toggle', ajustarTira);
  $('#btnNiveles').onclick = () => { const p = $('#panelNiveles'); const h = p.hidden; cerrarPaneles(); p.hidden = !h; };
  $('#btnLexico').onclick = () => { const p = $('#panelLexico'); const h = p.hidden; cerrarPaneles(); p.hidden = !h; };
  $('#btnQuePasa').onclick = quePasa;
  $('#btnTraduction').onclick = toggleTraduction;
  $('#annulerCarte').onclick = () => seleccionar(null);
  $('#btnReiniciar').onclick = () => { clearTimeout(exitoTimer); viñetas = viñetas.map(() => ({ escena: null, personajes: [] })); if (window.SVApp.escritor) window.SVApp.escritor.reiniciar(); seleccionar(null); pintarTira(); simular(); };
  $('#btnPista').onclick = mostrarIndice;
  $('#btnClase').onclick = () => { const c = $('#clase'); c.hidden = !c.hidden; ajustes().clase = !c.hidden; guardar(); ajustarTira(); };
  $('#btnDif').onclick = ev => { ev.stopPropagation(); const m = $('#menuDif'); const h = m.hidden; cerrarPaneles(); m.hidden = !h; };
  document.querySelectorAll('#menuDif button').forEach(b => b.onclick = () => ponerDif(+b.dataset.d));
  document.addEventListener('click', ev => { if (!ev.target.closest('.dif')) $('#menuDif').hidden = true; });
  $('#tituloTxt').onclick = () => hablar(nivel.libre ? 'Mi historia' : nivel.titulo);
  document.querySelectorAll('#inicioApp [data-modo]').forEach(b => b.onclick = () => elegirModo(b.dataset.modo));
  $('#cardAutor').onclick = () => { if (window.SVApp.abrirAutor) { if (!ajustes().modo) elegirModo('solo'); $('#inicioApp').hidden = true; window.SVApp.abrirAutor(); } };
  document.addEventListener('keydown', ev => {
    if (window.SVHistorias && window.SVHistorias.activo()) return;
    if (window.SVExploracion && window.SVExploracion.activo()) return;
    const t = ev.target;
    if (t && t.matches && (t.matches('input,textarea,select') || t.isContentEditable)) return;
    if (ev.key === 'Escape' && !document.querySelector('dialog[open]')) { seleccionar(null); cerrarPaneles(); }
    if ((ev.key === 'p' || ev.key === 'P') && !ev.ctrlKey && !ev.metaKey && !ev.altKey && window.SVApp.abrirProfe && !document.querySelector('dialog[open]')) { ev.preventDefault(); window.SVApp.abrirProfe(); }
  });

  /* ---------- ganchos para los módulos (ui-modos.js) ---------- */
  window.SVApp = {
    nivel: () => nivel, viñetas: () => viñetas, resultado: () => res, progreso: () => progreso, ajustes, guardar, guardarPartida, hablar, toast,
    abrirNivel, pintarTodo, simular, elegirModo, pintarInicio, nivelesVisibles, tiempo, dif, tituloSecreto, mostrarExito,
    añadirNiveles(ns) { extra = ns.slice(); },
    extra: () => extra,
    ponerViñetas(vs, opts) { viñetas = window.SVPartidas.limpiarViñetas(nivel, vs); if (opts && opts.silencio) exitoMostrado = avisoEscritor = nivel.id + '|' + JSON.stringify(viñetas); seleccionar(null); pintarTira(); simular(); },
    reiniciarIntentos() { intentos = 0; ultimoFallo = ''; exitoMostrado = ''; avisoEscritor = ''; },
    ajustarTira, esc, cerrarPaneles, borrarTodo, abrirRelato,
    escritor: null, abrirAutor: null, abrirProfe: null, imprimir: null, importarCodigo: null, borrarDatos: null, alPintar: null
  };

  /* ---------- inicio ---------- */
  function arrancar() {
    montarAyuda(); montarRelato();
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
