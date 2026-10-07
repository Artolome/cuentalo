/* Cuéntalo — modo «Pizarra»: herramientas de clase para el videoproyector (sin dependencias).
   Tres widgets en una barra: cronómetro, sorteo de números (sin nombres) y marcador de equipos.
   Funciona en el navegador (window.SVPizarra); en Node solo exporta la API (no toca el DOM).
   montar(contenedor, opts) → { destruir(), reiniciar() }
   opts = { hablar(texto)?, toast(msg)?, store? (tipo localStorage; si falta, window.localStorage) }
   Excepción al resto del proyecto: aquí sí se usan Math.random (sorteo) y Date (cronómetro). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVPizarra = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const KEY = 'cuentalo.pizarra.v0';
  const W = typeof window !== 'undefined' ? window : null;
  const MODOS = ['arriba', 1, 3, 5, 10]; // cuenta arriba, o cuenta atrás en minutos
  const TOPE = 99 * 60000 + 59000; // 99:59, tope de la cuenta arriba
  const MIN_ALUMNOS = 2, MAX_ALUMNOS = 40, MAX_PUNTOS = 999;
  /* Cuatro colores vivos de la paleta; el texto se elige según el fondo. */
  const COLORES = [
    { fondo: 'var(--rojo,#c4432e)', texto: '#fff6e6' },
    { fondo: 'var(--azul,#2c5a9a)', texto: '#fff6e6' },
    { fondo: 'var(--verde,#4c8748)', texto: '#fff6e6' },
    { fondo: 'var(--amarillo,#dfa92c)', texto: '#1f1a17' }
  ];

  /* ---------- números en letras (0..99) ---------- */
  const UNIDADES = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
    'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte',
    'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
  const DECENAS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  /** numeroEnLetras(12) → 'doce' · numeroEnLetras(40) → 'cuarenta' · fuera de 0..99 → el número en cifras */
  function numeroEnLetras(n) {
    n = Math.round(Number(n));
    if (!isFinite(n) || n < 0 || n > 99) return String(n);
    if (n < 30) return UNIDADES[n];
    const u = n % 10;
    return DECENAS[Math.floor(n / 10)] + (u ? ' y ' + UNIDADES[u] : '');
  }

  /* ---------- CSS ----------
     Variables del proyecto con valor de reserva, para que la barra funcione también sola (test/pizarra.html). */
  const CSS = `
.sv-pizarra{display:flex;flex-wrap:wrap;align-items:stretch;gap:14px;padding:10px 16px;background:var(--papel2,#f6e9d2);border-bottom:3px solid var(--borde,#1f1a17);font-family:var(--f-texto,"Segoe UI",Verdana,Tahoma,sans-serif);color:var(--tinta,#1f1a17);box-sizing:border-box}
.sv-pizarra *,.sv-pizarra *::before,.sv-pizarra *::after{box-sizing:border-box}
.sv-pizarra [hidden]{display:none!important}
.svp-widget{flex:1 1 280px;display:flex;flex-direction:column;align-items:center;gap:8px;padding:10px 14px 14px;background:var(--papel,#fff8ec);border:3px solid var(--borde,#1f1a17);border-radius:14px;box-shadow:0 4px 0 rgba(0,0,0,.3)}
.svp-widget.svp-equipos{flex:3 1 480px}
.svp-titulo{margin:0;font-family:var(--f-titulo,"Trebuchet MS","Segoe UI",Verdana,sans-serif);font-size:.85rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--tinta2,#5b4a3a)}
.svp-fila{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px}
.svp-num{font-family:var(--f-titulo,"Trebuchet MS","Segoe UI",Verdana,sans-serif);font-weight:900;line-height:1;font-variant-numeric:tabular-nums}
.svp-btn{min-width:44px;min-height:44px;padding:0 .7em;border:3px solid var(--borde,#1f1a17);border-radius:12px;background:var(--papel,#fff8ec);color:var(--tinta,#1f1a17);font:inherit;font-size:1.3rem;font-weight:900;line-height:1;cursor:pointer;box-shadow:0 4px 0 rgba(0,0,0,.35);user-select:none}
.svp-btn:hover{transform:translateY(-1px);box-shadow:0 5px 0 rgba(0,0,0,.35)}
.svp-btn:active{transform:translateY(3px);box-shadow:0 1px 0 rgba(0,0,0,.35)}
.svp-btn:disabled{opacity:.55;cursor:default;transform:none}
.svp-btn:focus-visible,.svp-chip:focus-visible,.svp-nombre:focus-visible{outline:4px solid var(--azul,#2c5a9a);outline-offset:2px}
.svp-btn.svp-ok{background:var(--ok,#2e8b57);color:#fff6e6}
.svp-btn.svp-rojo{background:var(--rojo,#c4432e);color:#fff6e6}
.svp-btn.svp-grande{font-size:1.6rem;min-height:56px;padding:0 1em}
.svp-chip{min-height:44px;padding:0 .9em;border:3px solid var(--borde,#1f1a17);border-radius:999px;background:var(--papel,#fff8ec);color:var(--tinta,#1f1a17);font:inherit;font-size:1rem;font-weight:700;cursor:pointer}
.svp-chip[aria-pressed="true"]{background:var(--tinta,#1f1a17);color:var(--papel,#fff8ec)}
.svp-etiqueta{display:flex;align-items:center;gap:.4em;font-size:1.1rem;font-weight:700}
.svp-campo{width:4.4em;min-height:44px;padding:0 .3em;border:3px solid var(--borde,#1f1a17);border-radius:10px;background:#fff;color:var(--tinta,#1f1a17);font:inherit;font-size:1.4rem;font-weight:700;text-align:center}
.svp-casilla{width:28px;height:28px;margin:0;accent-color:var(--tinta,#1f1a17);cursor:pointer}
.svp-nota{font-size:1rem;font-weight:700;color:var(--tinta2,#5b4a3a);min-width:6em;text-align:center}
/* cronómetro */
.svp-tiempo{font-size:3.6rem;padding:.1em .35em;border:3px solid var(--borde,#1f1a17);border-radius:14px;background:#fff;min-width:4.6em;text-align:center}
.svp-tiempo.svp-fin{animation:svp-parpadeo .5s steps(1) 8}
@keyframes svp-parpadeo{0%,100%{background:#fff;color:var(--tinta,#1f1a17)}50%{background:var(--rojo,#c4432e);color:#fff6e6}}
/* sorteo */
.svp-bola{font-size:4.2rem;width:2.1em;height:2.1em;display:flex;align-items:center;justify-content:center;border:3px solid var(--borde,#1f1a17);border-radius:50%;background:var(--amarillo,#dfa92c);box-shadow:0 4px 0 rgba(0,0,0,.3)}
.svp-bola.svp-girando{color:var(--tinta2,#5b4a3a)}
.svp-pop{animation:svp-pop .35s ease-out}
@keyframes svp-pop{0%{transform:scale(.7)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
/* equipos */
.svp-tarjetas{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;width:100%}
.svp-tarjeta{flex:1 1 118px;max-width:220px;display:flex;flex-direction:column;align-items:center;gap:6px;padding:6px 6px 10px;background:var(--c);color:var(--t);border:3px solid var(--borde,#1f1a17);border-radius:12px;box-shadow:0 4px 0 rgba(0,0,0,.3)}
.svp-nombre{max-width:100%;min-height:44px;padding:0 .5em;border:3px dashed transparent;border-radius:10px;background:transparent;color:inherit;font:inherit;font-size:1.15rem;font-weight:900;line-height:1.1;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.svp-nombre:hover{border-color:currentColor}
.svp-puntos{font-size:3rem}
.svp-tarjeta .svp-fila{width:100%;flex-wrap:nowrap}
.svp-tarjeta .svp-btn{flex:1 1 0;min-width:44px;padding:0 .2em;font-size:1.4rem}
@media print{.sv-pizarra{display:none!important}}
`;

  /* ---------- utilidades ---------- */
  function inyectarCSS() {
    if (typeof document === 'undefined' || document.getElementById('sv-pizarra-css')) return;
    const s = document.createElement('style');
    s.id = 'sv-pizarra-css';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }
  function el(tag, attrs, texto) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    if (texto !== undefined) n.textContent = texto;
    return n;
  }
  const limitar = (v, min, max) => Math.min(max, Math.max(min, v));
  const dosCifras = n => String(n).padStart(2, '0');
  function formato(ms) { const s = Math.max(0, Math.round(ms / 1000)); return dosCifras(Math.floor(s / 60)) + ':' + dosCifras(s % 60); }
  /** Vuelve a lanzar la animación «pop» aunque ya estuviera puesta. */
  function pop(n) { n.classList.remove('svp-pop'); void n.offsetWidth; n.classList.add('svp-pop'); }

  /* ---------- datos persistidos ----------
     { equipos, nombres[4], puntos[4], alumnos, crono, sinRepetir } — sin ningún dato personal. */
  function porDefecto() {
    return { equipos: 2, nombres: ['Equipo 1', 'Equipo 2', 'Equipo 3', 'Equipo 4'], puntos: [0, 0, 0, 0], alumnos: 24, crono: 'arriba', sinRepetir: false };
  }
  function sanear(d) {
    const b = porDefecto();
    if (!d || typeof d !== 'object') return b;
    if ([2, 3, 4].includes(d.equipos)) b.equipos = d.equipos;
    if (Array.isArray(d.nombres)) d.nombres.slice(0, 4).forEach((s, i) => { if (typeof s === 'string' && s.trim()) b.nombres[i] = s.trim().slice(0, 24); });
    if (Array.isArray(d.puntos)) d.puntos.slice(0, 4).forEach((p, i) => { if (Number.isInteger(p)) b.puntos[i] = limitar(p, 0, MAX_PUNTOS); });
    if (Number.isInteger(d.alumnos)) b.alumnos = limitar(d.alumnos, MIN_ALUMNOS, MAX_ALUMNOS);
    if (MODOS.includes(d.crono)) b.crono = d.crono;
    b.sinRepetir = !!d.sinRepetir;
    return b;
  }

  /* ---------- montar ---------- */
  function montar(contenedor, opts) {
    opts = opts || {};
    if (typeof document === 'undefined' || !contenedor) return { destruir() {}, reiniciar() {} }; // Node o sin contenedor: nada que montar
    inyectarCSS();
    const toast = typeof opts.toast === 'function' ? opts.toast : () => {};
    const hablar = typeof opts.hablar === 'function' ? opts.hablar : null;
    let store = opts.store || null;
    if (!store) { try { store = W && W.localStorage; } catch (_) { store = null; } }
    function leer() { try { return sanear(JSON.parse(store.getItem(KEY) || 'null')); } catch (_) { return porDefecto(); } }
    function guardar() { try { if (store) store.setItem(KEY, JSON.stringify(datos)); } catch (_) { /* sin almacenamiento */ } }
    const datos = leer();
    const temporizadores = { crono: 0, anim: 0 };

    const barra = el('div', { class: 'sv-pizarra', role: 'region', 'aria-label': 'Barra de clase: cronómetro, sorteo y equipos' });

    /* ===== 1. Cronómetro ===== */
    const wCrono = el('section', { class: 'svp-widget svp-crono' });
    wCrono.appendChild(el('h3', { class: 'svp-titulo' }, 'Cronómetro'));
    const tiempo = el('div', { class: 'svp-num svp-tiempo', role: 'timer', 'aria-live': 'off' }, '00:00');
    const btnPlay = el('button', { class: 'svp-btn svp-ok', type: 'button', 'aria-label': 'Empezar', title: 'Empezar' }, '▶');
    const btnCero = el('button', { class: 'svp-btn', type: 'button', 'aria-label': 'Poner a cero', title: 'Poner a cero' }, '↺');
    const modos = el('div', { class: 'svp-fila', role: 'group', 'aria-label': 'Modo del cronómetro' });
    const chipsModo = MODOS.map(m => {
      const c = el('button', { class: 'svp-chip', type: 'button', 'data-modo': String(m), 'aria-pressed': 'false' }, m === 'arriba' ? '▲ Libre' : m + ' min');
      c.addEventListener('click', () => { datos.crono = m; guardar(); ponerACero(); pintarModos(); });
      modos.appendChild(c);
      return c;
    });
    let corriendo = false, inicioMs = 0, acumulado = 0, audio = null;

    const transcurrido = () => acumulado + (corriendo ? Date.now() - inicioMs : 0);
    const duracion = () => datos.crono === 'arriba' ? TOPE : datos.crono * 60000;
    function pintarTiempo() {
      const t = Math.min(transcurrido(), duracion());
      const txt = formato(datos.crono === 'arriba' ? t : duracion() - t);
      if (tiempo.textContent !== txt) tiempo.textContent = txt;
    }
    function pintarModos() { chipsModo.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.modo === String(datos.crono)))); }
    function pintarPlay() {
      btnPlay.textContent = corriendo ? '⏸' : '▶';
      const t = corriendo ? 'Pausa' : 'Empezar';
      btnPlay.setAttribute('aria-label', t); btnPlay.title = t;
      btnPlay.classList.toggle('svp-ok', !corriendo);
    }
    /** El AudioContext se crea al pulsar ▶ (gesto del usuario): así el navegador deja sonar el pitido al final. */
    function prepararAudio() {
      try {
        const AC = W && (W.AudioContext || W.webkitAudioContext);
        if (!AC) return;
        if (!audio) audio = new AC();
        if (audio.state === 'suspended') audio.resume();
      } catch (_) { audio = null; }
    }
    function pitido() {
      try {
        if (!audio) prepararAudio();
        if (!audio) return;
        const t0 = audio.currentTime;
        const o = audio.createOscillator(), g = audio.createGain();
        o.type = 'square'; o.frequency.value = 880;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
        o.connect(g); g.connect(audio.destination);
        o.start(t0); o.stop(t0 + 0.65);
      } catch (_) { /* sin audio */ }
    }
    function parar() { if (corriendo) { acumulado = transcurrido(); corriendo = false; } clearInterval(temporizadores.crono); temporizadores.crono = 0; pintarPlay(); }
    function ponerACero() { parar(); acumulado = 0; tiempo.classList.remove('svp-fin'); pintarTiempo(); }
    function tick() {
      pintarTiempo();
      if (transcurrido() < duracion()) return;
      parar(); acumulado = duracion(); pintarTiempo();
      if (datos.crono !== 'arriba') { tiempo.classList.add('svp-fin'); pitido(); toast('¡Tiempo!'); }
    }
    function empezar() {
      if (transcurrido() >= duracion()) acumulado = 0; // ya había terminado: vuelve a empezar
      tiempo.classList.remove('svp-fin');
      prepararAudio();
      inicioMs = Date.now(); corriendo = true;
      temporizadores.crono = setInterval(tick, 200);
      pintarPlay(); pintarTiempo();
    }
    btnPlay.addEventListener('click', () => (corriendo ? parar() : empezar()));
    btnCero.addEventListener('click', ponerACero);
    const filaCrono = el('div', { class: 'svp-fila' });
    filaCrono.appendChild(btnPlay); filaCrono.appendChild(btnCero);
    wCrono.appendChild(tiempo); wCrono.appendChild(filaCrono); wCrono.appendChild(modos);
    pintarModos(); pintarPlay(); pintarTiempo();

    /* ===== 2. Sorteo (solo números, nunca nombres) ===== */
    const wSorteo = el('section', { class: 'svp-widget svp-sorteo' });
    wSorteo.appendChild(el('h3', { class: 'svp-titulo' }, 'Sorteo'));
    const bola = el('div', { class: 'svp-num svp-bola', 'aria-live': 'polite', 'aria-label': 'Número que ha salido' }, '?');
    const campo = el('input', { class: 'svp-campo', type: 'number', min: String(MIN_ALUMNOS), max: String(MAX_ALUMNOS), step: '1', inputmode: 'numeric', 'aria-label': 'Número de alumnos' });
    campo.value = String(datos.alumnos);
    const etiqueta = el('label', { class: 'svp-etiqueta' }); etiqueta.appendChild(document.createTextNode('Alumnos:')); etiqueta.appendChild(campo);
    const btnNumero = el('button', { class: 'svp-btn svp-grande svp-rojo', type: 'button' }, '¡Número!');
    const casilla = el('input', { class: 'svp-casilla', type: 'checkbox' });
    casilla.checked = datos.sinRepetir;
    const etqCasilla = el('label', { class: 'svp-etiqueta' }); etqCasilla.appendChild(casilla); etqCasilla.appendChild(document.createTextNode('sin repetir'));
    const nota = el('span', { class: 'svp-nota', 'aria-live': 'polite' });
    const btnBolsa = el('button', { class: 'svp-btn', type: 'button', 'aria-label': 'Todos los números otra vez', title: 'Todos los números otra vez' }, '↺');
    let bolsa = [], ultimo = 0, animando = false;

    function llenarBolsa() { bolsa = Array.from({ length: datos.alumnos }, (_, i) => i + 1); }
    function pintarBolsa() {
      nota.hidden = !datos.sinRepetir; btnBolsa.hidden = !datos.sinRepetir;
      nota.textContent = bolsa.length === 1 ? 'Queda 1' : 'Quedan ' + bolsa.length;
    }
    function fijarAlumnos() {
      const v = limitar(parseInt(campo.value, 10) || datos.alumnos, MIN_ALUMNOS, MAX_ALUMNOS);
      campo.value = String(v);
      if (v !== datos.alumnos) { datos.alumnos = v; guardar(); llenarBolsa(); pintarBolsa(); }
    }
    function sortear() {
      if (animando) return;
      fijarAlumnos();
      const n = datos.alumnos;
      let final;
      if (datos.sinRepetir) {
        if (!bolsa.length) { llenarBolsa(); toast('Ya han salido todos los números. ¡Empezamos otra vez!'); }
        final = bolsa.splice(Math.floor(Math.random() * bolsa.length), 1)[0];
      } else {
        do { final = 1 + Math.floor(Math.random() * n); } while (final === ultimo); // sin repetir el anterior dos veces seguidas
      }
      ultimo = final; animando = true; btnNumero.disabled = true;
      bola.classList.add('svp-girando'); bola.classList.remove('svp-pop');
      const t0 = Date.now();
      const paso = () => {
        if (Date.now() - t0 < 800) {
          bola.textContent = String(1 + Math.floor(Math.random() * n));
          temporizadores.anim = setTimeout(paso, 60);
          return;
        }
        temporizadores.anim = 0;
        bola.textContent = String(final);
        bola.classList.remove('svp-girando'); pop(bola);
        animando = false; btnNumero.disabled = false;
        pintarBolsa();
        if (hablar) hablar('Número ' + numeroEnLetras(final));
      };
      paso();
    }
    campo.addEventListener('change', fijarAlumnos);
    campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); fijarAlumnos(); sortear(); } });
    casilla.addEventListener('change', () => { datos.sinRepetir = casilla.checked; guardar(); llenarBolsa(); pintarBolsa(); });
    btnNumero.addEventListener('click', sortear);
    btnBolsa.addEventListener('click', () => { llenarBolsa(); pintarBolsa(); toast('Todos los números otra vez.'); });
    const fila1 = el('div', { class: 'svp-fila' }); fila1.appendChild(etiqueta); fila1.appendChild(btnNumero);
    const fila2 = el('div', { class: 'svp-fila' }); fila2.appendChild(etqCasilla); fila2.appendChild(nota); fila2.appendChild(btnBolsa);
    wSorteo.appendChild(bola); wSorteo.appendChild(fila1); wSorteo.appendChild(fila2);
    llenarBolsa(); pintarBolsa();

    /* ===== 3. Equipos ===== */
    const wEquipos = el('section', { class: 'svp-widget svp-equipos' });
    wEquipos.appendChild(el('h3', { class: 'svp-titulo' }, 'Equipos'));
    const selector = el('div', { class: 'svp-fila', role: 'group', 'aria-label': 'Número de equipos' });
    const chipsEq = [2, 3, 4].map(n => {
      const c = el('button', { class: 'svp-chip', type: 'button', 'data-n': String(n), 'aria-pressed': 'false', 'aria-label': n + ' equipos' }, n + ' equipos');
      c.addEventListener('click', () => { datos.equipos = n; guardar(); pintarEquipos(); });
      selector.appendChild(c);
      return c;
    });
    const btnCeroEq = el('button', { class: 'svp-btn', type: 'button', 'aria-label': 'Poner los puntos a cero', title: 'Poner los puntos a cero' }, '↺');
    btnCeroEq.addEventListener('click', () => {
      if (W && W.confirm('¿Poner todos los puntos a cero?')) { datos.puntos = [0, 0, 0, 0]; guardar(); pintarEquipos(); toast('Marcador a cero.'); }
    });
    selector.appendChild(btnCeroEq);
    const tarjetas = el('div', { class: 'svp-tarjetas' });
    const fichas = COLORES.map((col, i) => {
      const t = el('div', { class: 'svp-tarjeta' });
      t.style.setProperty('--c', col.fondo); t.style.setProperty('--t', col.texto);
      const nombre = el('button', { class: 'svp-nombre', type: 'button', title: 'Cambiar el nombre del equipo' });
      /* Nombre libre con prompt(); se propone el nombre actual, nunca nombres de alumnos. */
      nombre.addEventListener('click', () => {
        if (!W) return;
        const nuevo = W.prompt('Nombre del equipo ' + (i + 1) + ':', datos.nombres[i]);
        if (nuevo === null) return;
        datos.nombres[i] = (nuevo.trim() || 'Equipo ' + (i + 1)).slice(0, 24);
        guardar(); pintarEquipos();
      });
      const puntos = el('div', { class: 'svp-num svp-puntos', 'aria-live': 'polite' }, '0');
      const sumar = d => { const v = limitar(datos.puntos[i] + d, 0, MAX_PUNTOS); if (v === datos.puntos[i]) return; datos.puntos[i] = v; guardar(); puntos.textContent = String(v); pop(puntos); };
      const menos = el('button', { class: 'svp-btn', type: 'button', 'aria-label': 'Quitar un punto a ' + datos.nombres[i] }, '−1');
      const mas = el('button', { class: 'svp-btn', type: 'button', 'aria-label': 'Dar un punto a ' + datos.nombres[i] }, '+1');
      menos.addEventListener('click', () => sumar(-1));
      mas.addEventListener('click', () => sumar(1));
      const fila = el('div', { class: 'svp-fila' }); fila.appendChild(menos); fila.appendChild(mas);
      t.appendChild(nombre); t.appendChild(puntos); t.appendChild(fila);
      tarjetas.appendChild(t);
      return { t, nombre, puntos, menos, mas };
    });
    function pintarEquipos() {
      chipsEq.forEach(c => c.setAttribute('aria-pressed', String(+c.dataset.n === datos.equipos)));
      fichas.forEach((f, i) => {
        f.t.hidden = i >= datos.equipos;
        f.nombre.textContent = datos.nombres[i];
        f.puntos.textContent = String(datos.puntos[i]);
        f.menos.setAttribute('aria-label', 'Quitar un punto a ' + datos.nombres[i]);
        f.mas.setAttribute('aria-label', 'Dar un punto a ' + datos.nombres[i]);
      });
    }
    wEquipos.appendChild(selector); wEquipos.appendChild(tarjetas);
    pintarEquipos();

    barra.appendChild(wCrono); barra.appendChild(wSorteo); barra.appendChild(wEquipos);
    contenedor.appendChild(barra);

    /* ===== API ===== */
    function reiniciar() {
      ponerACero();
      clearTimeout(temporizadores.anim); temporizadores.anim = 0; animando = false; btnNumero.disabled = false;
      bola.textContent = '?'; bola.classList.remove('svp-girando', 'svp-pop'); ultimo = 0; llenarBolsa(); pintarBolsa();
      datos.puntos = [0, 0, 0, 0]; guardar(); pintarEquipos();
    }
    function destruir() {
      parar();
      clearTimeout(temporizadores.anim); temporizadores.anim = 0;
      try { if (audio && audio.close) audio.close(); } catch (_) { /* nada */ }
      audio = null;
      if (barra.parentNode) barra.parentNode.removeChild(barra);
    }
    return { destruir, reiniciar };
  }

  return { montar, CSS, numeroEnLetras, KEY };
});
