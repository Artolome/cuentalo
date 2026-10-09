#!/usr/bin/env node
/* node test/navegador.js [chrome|edge|firefox] [--ver]
   Prueba de extremo a extremo SIN servidor: abre cuentalo.html en file:// (como el doble clic de la profe)
   sin ventana, y lo pilota: Chrome y Edge con el protocolo DevTools, Firefox con WebDriver BiDi (WebSocket nativo de Node ≥ 22)
   y comprueba los recorridos principales: inicio, juego con clic-clic, ¿Qué pasa?, escritor, Autor + código,
   Profe (soluciones en el Worker), reanudación al cambiar/recargar, relato libre, impresión, borrar datos,
   cero peticiones de red.
   Solo desarrollo: no forma parte del juego. */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const RUTAS = {
  chrome: ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'],
  edge: ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', '/usr/bin/microsoft-edge'],
  firefox: ['C:/Program Files/Mozilla Firefox/firefox.exe', 'C:/Program Files (x86)/Mozilla Firefox/firefox.exe', '/usr/bin/firefox', '/Applications/Firefox.app/Contents/MacOS/firefox']
};
const nombre = (process.argv[2] || 'chrome').toLowerCase();
const exe = (RUTAS[nombre] || []).find(p => fs.existsSync(p));
if (!exe) { console.log(`(${nombre} no está instalado: prueba omitida)`); process.exit(0); }
const fichero = path.resolve(__dirname, '..', 'cuentalo.html');
const url = 'file:///' + fichero.replace(/\\/g, '/');
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'sv-' + nombre + '-'));
const PUERTO = 9300 + Math.floor(Math.random() * 500);
const W = 1280, H = 720;

const espera = ms => new Promise(r => setTimeout(r, ms));
/* ---------- pilote 1: protocolo DevTools (Chrome, Edge) ---------- */
async function abrirCDP() {
  const proc = spawn(exe, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', `--remote-debugging-port=${PUERTO}`, `--user-data-dir=${perfil}`, `--window-size=${W},${H}`, 'about:blank'], { stdio: 'ignore' });
  let destino = null;
  for (let k = 0; k < 50 && !destino; k++) {
    await espera(200);
    try { const l = await (await fetch(`http://127.0.0.1:${PUERTO}/json/list`)).json(); destino = l.find(t => t.type === 'page'); } catch (_) { /* aún no */ }
  }
  if (!destino) throw new Error('el navegador no responde');
  const ws = new WebSocket(destino.webSocketDebuggerUrl);
  await new Promise((ok, ko) => { ws.onopen = ok; ws.onerror = ko; });
  let id = 0; const pend = new Map(); const red = []; const errores = [];
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pend.has(m.id)) { const { ok, ko } = pend.get(m.id); pend.delete(m.id); m.error ? ko(new Error(m.error.message)) : ok(m.result); }
    else if (m.method === 'Network.requestWillBeSent') red.push(m.params.request.url);
    else if (m.method === 'Runtime.exceptionThrown') errores.push(m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text);
    else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errores.push(m.params.args.map(a => a.value || a.description).join(' '));
  };
  const cdp = (method, params) => new Promise((ok, ko) => { const i = ++id; pend.set(i, { ok, ko }); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
  await cdp('Network.enable'); await cdp('Runtime.enable'); await cdp('Page.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await cdp('Page.navigate', { url });
  return {
    red, errores,
    async evalua(expr) {
      const r = await cdp('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
      return r.result.value;
    },
    async recargar() { await cdp('Page.reload', { ignoreCache: true }); },
    async captura() { const r = await cdp('Page.captureScreenshot', { format: 'png' }); return r.data; },
    async raton(x, y) { // clic izquierdo de verdad (el navegador decide qué elemento recibe el clic)
      await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
      await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
      await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
    },
    cerrar() { try { ws.close(); } catch (_) { /* nada */ } proc.kill(); }
  };
}
/* ---------- pilote 2: WebDriver BiDi (Firefox) ---------- */
async function abrirBiDi() {
  const proc = spawn(exe, ['--headless', '--no-remote', '--remote-debugging-port', String(PUERTO), '--profile', perfil, `--width=${W}`, `--height=${H}`, 'about:blank'], { stdio: 'ignore' });
  let ws = null;
  for (let k = 0; k < 75 && !ws; k++) {
    await espera(200);
    try {
      const w = new WebSocket(`ws://127.0.0.1:${PUERTO}/session`);
      await new Promise((ok, ko) => { w.onopen = ok; w.onerror = ko; });
      ws = w;
    } catch (_) { /* aún no */ }
  }
  if (!ws) throw new Error('Firefox no responde');
  let id = 0; const pend = new Map(); const red = []; const errores = [];
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pend.has(m.id)) { const { ok, ko } = pend.get(m.id); pend.delete(m.id); m.type === 'error' ? ko(new Error(m.error + ': ' + m.message)) : ok(m.result); }
    else if (m.method === 'network.beforeRequestSent') red.push(m.params.request.url);
    else if (m.method === 'log.entryAdded' && m.params.level === 'error') errores.push(m.params.text);
  };
  const bidi = (method, params) => new Promise((ok, ko) => { const i = ++id; pend.set(i, { ok, ko }); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
  await bidi('session.new', { capabilities: {} });
  const arbol = await bidi('browsingContext.getTree', {});
  const ctx = arbol.contexts[0].context;
  await bidi('session.subscribe', { events: ['network.beforeRequestSent', 'log.entryAdded'] });
  await bidi('browsingContext.setViewport', { context: ctx, viewport: { width: W, height: H } });
  await bidi('browsingContext.navigate', { context: ctx, url, wait: 'complete' });
  return {
    red, errores,
    async evalua(expr) {
      // BiDi serializa con tipos propios: se devuelve JSON en una cadena
      const r = await bidi('script.evaluate', { expression: `(async () => JSON.stringify(await (async () => { ${expr} })()))()`, target: { context: ctx }, awaitPromise: true, resultOwnership: 'none' });
      if (r.type === 'exception') throw new Error(r.exceptionDetails && r.exceptionDetails.text || 'excepción');
      const v = r.result && r.result.value;
      return v === undefined ? undefined : JSON.parse(v);
    },
    async recargar() { await bidi('browsingContext.reload', { context: ctx, ignoreCache: true, wait: 'complete' }); },
    async captura() { const r = await bidi('browsingContext.captureScreenshot', { context: ctx }); return r.data; },
    async raton(x, y) {
      await bidi('input.performActions', { context: ctx, actions: [{ type: 'pointer', id: 'raton', parameters: { pointerType: 'mouse' }, actions: [{ type: 'pointerMove', x: Math.round(x), y: Math.round(y) }, { type: 'pointerDown', button: 0 }, { type: 'pointerUp', button: 0 }] }] });
    },
    cerrar() { try { bidi('browser.close', {}).catch(() => {}); ws.close(); } catch (_) { /* nada */ } setTimeout(() => proc.kill(), 300); }
  };
}

async function main() {
  const nav = nombre === 'firefox' ? await abrirBiDi() : await abrirCDP();
  const { red, errores } = nav;
  const evalua = nav.evalua;
  /* Clic de ratón real en el centro de un elemento (sin llamar a .click() desde JavaScript). */
  const clicEn = async sel => {
    const c = await evalua(`const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2];`);
    if (!c) throw new Error('no existe ' + sel);
    await nav.raton(Math.round(c[0]), Math.round(c[1]));
    await espera(150);
  };
  await espera(1500);

  const resultados = [];
  const prueba = async (titulo, expr, comprobar) => {
    try { const v = await evalua(expr); const ok = comprobar(v); resultados.push([ok, titulo, ok ? '' : JSON.stringify(v).slice(0, 300)]); return v; }
    catch (e) { resultados.push([false, titulo, e.message.slice(0, 300)]); return null; }
  };
  // Una recarga real, no una segunda llamada a arrancar(). La marca DOM impide aceptar
  // el documento anterior mientras Page.reload todavía está iniciando la navegación.
  const recargarJuego = async () => {
    await evalua(`document.documentElement.dataset.pruebaRecarga = 'anterior'; return true;`);
    await nav.recargar();
    for (let k = 0; k < 60; k++) {
      await espera(100);
      try {
        const listo = await evalua(`return !document.documentElement.dataset.pruebaRecarga && document.readyState === 'complete' && !!document.querySelector('#tira .vineta');`);
        if (listo) { await espera(600); return; }
      } catch (_) { /* contexto destruido durante la navegación */ }
    }
    throw new Error('el juego no terminó de recargarse');
  };
  const pruebaTrasRecarga = async (titulo, expr, comprobar) => {
    try { await recargarJuego(); }
    catch (e) { resultados.push([false, titulo, e.message]); return null; }
    return prueba(titulo, expr, comprobar);
  };
  const AYUDA = `const dormir = ms => new Promise(r => setTimeout(r, ms));
    const pon = (i, tipo, id) => { document.querySelector('.carta[data-tipo="' + tipo + '"][data-id="' + id + '"]').click(); document.querySelector('.escena-caja[data-i="' + i + '"]').click(); };
    const cerrar = () => document.querySelectorAll('dialog[open]').forEach(d => d.close());
    // Abrir ahora reanuda. Solo las fixtures que construyen una historia nueva pulsan ↺.
    const nuevo = id => { cerrar(); SVApp.abrirNivel(id); document.querySelector('#btnReiniciar').click(); };`;

  await prueba('pantalla de inicio visible', `return !document.querySelector('#inicioApp').hidden && !document.querySelector('#cardAutor').hidden;`, v => v === true);
  await prueba('modo Solo: c1n1 resuelto con clic-clic, frases y estrellas', `${AYUDA}
    document.querySelector('[data-modo="solo"]').click(); await dormir(200);
    nuevo('c1n1'); pon(0,'escena','sol'); pon(0,'personaje','lucia'); pon(1,'escena','rio'); pon(1,'personaje','lucia'); pon(2,'escena','fuego'); pon(2,'personaje','lucia');
    await dormir(600); const exito = document.querySelector('#dlgExito').open; cerrar();
    return { estado: document.querySelector('#estadoNivel').textContent, frase: document.querySelector('.frase').textContent, exito, estrellas: SVApp.progreso().c1n1 && SVApp.progreso().c1n1.estrellas };`,
    v => v && /Muy bien/.test(v.estado) && /calor/.test(v.frase) && v.exito && v.estrellas === 3);
  const frasesLibres = ['Primero Lucía tiene sed.', 'Después bebe agua del río.', 'Al final hace fuego.'];
  await prueba('relato libre: tres frases opcionales sin cambiar las estrellas', `${AYUDA}
    const b = document.querySelector('#btnContar'); if (b.hidden) return null;
    const antes = SVApp.progreso().c1n1.estrellas; b.click();
    const d = document.querySelector('#dlgRelato'), campos = [...d.querySelectorAll('textarea')];
    campos.forEach((input, i) => { input.value = ${JSON.stringify(frasesLibres)}[i]; input.dispatchEvent(new Event('input', { bubbles: true })); });
    const r = { abierto: d.open, campos: campos.length, opcional: /opcional/.test(d.textContent), sinCorreccion: /no corrige/.test(d.textContent), guardado: /Borrador guardado/.test(d.querySelector('.relato-estado').textContent), estrellas: SVApp.progreso().c1n1.estrellas === antes };
    document.querySelector('#cerrarRelato').click(); return r;`,
    v => v && v.abierto && v.campos === 3 && v.opcional && v.sinCorreccion && v.guardado && v.estrellas);
  await pruebaTrasRecarga('recargar: BD ganada y relato conservados, sin otra celebración', `${AYUDA}
    const otraFiesta = document.querySelector('#dlgExito').open;
    const frases = [...document.querySelectorAll('#tira .frase')].map(e => e.textContent);
    const b = document.querySelector('#btnContar'); if (b.hidden) return null; b.click();
    const valores = [...document.querySelectorAll('#dlgRelato textarea')].map(e => e.value);
    const r = { titulo: document.querySelector('#tituloTxt').textContent, personajes: document.querySelectorAll('#tira .pj-wrap').length, frases, otraFiesta, valores, estrellas: SVApp.progreso().c1n1.estrellas };
    document.querySelector('#cerrarRelato').click(); return r;`,
    v => v && /Lucía ya no tiene sed/.test(v.titulo) && v.personajes === 3 && /calor/.test(v.frases[0]) && /bebe agua/.test(v.frases[1]) && /fuego/.test(v.frases[2]) && !v.otraFiesta && v.estrellas === 3 && JSON.stringify(v.valores) === JSON.stringify(frasesLibres));
  await prueba('cambiar de nivel: se conserva una BD incompleta', `${AYUDA}
    nuevo('c1n2'); pon(0,'escena','rio'); pon(0,'personaje','mateo');
    document.querySelector('#btnNiveles').click(); document.querySelector('.niv[data-id="c1n4"]').click();
    document.querySelector('#btnNiveles').click(); document.querySelector('.niv[data-id="c1n2"]').click();
    return { titulo: document.querySelector('#tituloTxt').textContent, personajes: document.querySelectorAll('#tira .pj-wrap').length, vacias: document.querySelectorAll('#tira .escena-caja.vacia').length, frase: document.querySelector('#tira .frase').textContent };`,
    v => v && /Mateo ya no tiene frío/.test(v.titulo) && v.personajes === 1 && v.vacias === 2 && /Mateo bebe agua/.test(v.frase));
  await pruebaTrasRecarga('recargar: también se conserva una BD incompleta', `return { titulo: document.querySelector('#tituloTxt').textContent, personajes: document.querySelectorAll('#tira .pj-wrap').length, vacias: document.querySelectorAll('#tira .escena-caja.vacia').length, frase: document.querySelector('#tira .frase').textContent, exito: document.querySelector('#dlgExito').open };`,
    v => v && /Mateo ya no tiene frío/.test(v.titulo) && v.personajes === 1 && v.vacias === 2 && /Mateo bebe agua/.test(v.frase) && !v.exito);
  {
    // Solo ratón, como en clase: clic en la carta, clic en la viñeta (clics reales, el navegador hace el «hit-testing»)
    let ok = false, info = '';
    try {
      await evalua(`${AYUDA} SVApp.ajustes().escritor = false; SVApp.guardar(); nuevo('c2n1'); return 1;`);
      for (const [carta, v] of [['selva', 0], ['lucia', 0], ['noche', 1], ['mateo', 1], ['sol', 2], ['lucia', 2]]) { await clicEn(`.carta[data-id="${carta}"]`); await clicEn(`.escena-caja[data-i="${v}"]`); }
      // segundo personaje: clic ENCIMA de Lucía ya colocada (debe poner a Mateo, no quitar a Lucía)
      await clicEn('.carta[data-id="mateo"]'); await clicEn('.vineta[data-i="2"] .pj-wrap');
      await espera(600);
      const r1 = await evalua(`return { estado: document.querySelector('#estadoNivel').textContent, v2: SVApp.viñetas()[2].personajes.join('+'), exito: document.querySelector('#dlgExito').open };`);
      if (r1.exito) await clicEn('#btnSeguir');
      // sin carta seleccionada, un clic en un personaje lo quita
      await clicEn('.vineta[data-i="0"] .pj-wrap');
      const r2 = await evalua(`return { v0: SVApp.viñetas()[0].personajes.length, dialogo: !!document.querySelector('dialog[open]') };`);
      ok = /Muy bien/.test(r1.estado) && r1.v2 === 'lucia+mateo' && r1.exito && r2.v0 === 0 && !r2.dialogo;
      info = ok ? '' : JSON.stringify({ r1, r2 });
    } catch (e) { info = e.message; }
    resultados.push([ok, 'solo ratón (clics reales): c2n1 resuelto, 2.º personaje encima del 1.º, quitar con un clic', info]);
  }
  await prueba('un texto arrastrado que no es una carta se ignora', `${AYUDA}
    nuevo('c1n1'); pon(0,'escena','sol');
    const dt = new DataTransfer(); dt.setData('text/plain', 'Lucía bebe agua del río.');
    document.querySelector('.escena-caja[data-i="0"]').dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
    await dormir(100); return SVApp.viñetas()[0].personajes.length;`, v => v === 0);
  await prueba('¿Qué pasa? explica lo que falta', `${AYUDA}
    nuevo('c2n4'); pon(0,'escena','jaguar'); pon(0,'personaje','valeria'); pon(1,'escena','tormenta'); pon(1,'personaje','valeria'); pon(1,'personaje','diego'); pon(2,'escena','noche'); pon(2,'personaje','diego');
    await dormir(200); document.querySelector('#btnQuePasa').click(); await dormir(200);
    const t = document.querySelector('#dlgQuePasa').innerText; cerrar(); return t;`, v => /✗/.test(v) && /miedo/.test(v));
  await prueba('modo escritor: ¿Qué pasa? e imprimir no revelan las frases', `${AYUDA}
    SVApp.ajustes().escritor = true; SVApp.ajustes().escritorNivel = 'elegir'; SVApp.guardar();
    nuevo('c1n1'); pon(0,'escena','sol'); pon(0,'personaje','lucia'); pon(1,'escena','rio'); pon(1,'personaje','lucia'); pon(2,'escena','fuego'); pon(2,'personaje','lucia');
    await dormir(400); document.querySelector('#btnQuePasa').click(); await dormir(150);
    const t = document.querySelector('#dlgQuePasa').innerText; cerrar();
    document.querySelector('.vineta[data-i="0"] .esc-abrir').click(); await dormir(150);
    const opciones = document.querySelectorAll('#dlgModos .esc-op').length; cerrar();
    return { revela: /Lucía bebe agua/.test(t), imprimir: document.querySelector('#btnImprimir').disabled, estrellasAntes: !!(SVApp.progreso().c1n1 && SVApp.progreso().c1n1.estrellas), opciones };`,
    v => v && !v.revela && v.imprimir === true && v.opciones === 3);
  await prueba('modo escritor: elegir las 3 frases da el éxito', `${AYUDA}
    for (const i of [0, 1, 2]) {
      document.querySelector('.vineta[data-i="' + i + '"] .esc-abrir').click(); await dormir(120);
      const texto = SVApp.resultado().viñetas[i].frases.join(' ');
      const mala = [...document.querySelectorAll('#dlgModos .esc-op')].find(x => x.textContent !== texto); mala.click(); await dormir(80);
      if (!mala.disabled || !document.querySelector('#dlgModos').open) return 'la opción mala no se marcó';
      [...document.querySelectorAll('#dlgModos .esc-op')].find(x => x.textContent === texto).click(); await dormir(200);
    }
    await dormir(700); const ok = document.querySelector('#dlgExito').open; cerrar();
    SVApp.ajustes().escritor = false; SVApp.guardar(); return ok;`, v => v === true);
  const codigo = await prueba('Autor: crear «Valeria cura a Diego», jugar, guardar, obtener un código', `${AYUDA}
    SVApp.abrirAutor(); await dormir(100);
    const d = document.querySelector('#dlgModos'), form = d.querySelector('#fAutor');
    form.querySelectorAll('input[name="pj"]').forEach(i => { i.checked = ['valeria','diego'].includes(i.value); });
    form.querySelectorAll('input[name="esc"]').forEach(i => { i.checked = ['serpiente','refugio','rescate'].includes(i.value); });
    form.querySelector('input[name="pj"]').dispatchEvent(new Event('change', { bubbles: true }));
    const sel = d.querySelector('#aTitulo'); sel.value = [...sel.options].find(o => o.textContent === 'Valeria cura a Diego').value;
    form.requestSubmit(); await dormir(300);
    pon(0,'escena','serpiente'); pon(0,'personaje','diego'); pon(1,'escena','serpiente'); pon(1,'personaje','diego'); pon(2,'escena','refugio'); pon(2,'personaje','valeria'); pon(2,'personaje','diego');
    await dormir(300); document.querySelector('#bGuardar').click();
    for (let k = 0; k < 100 && !(d.querySelector('#codigoTxt')); k++) await dormir(100);
    const c = d.querySelector('#codigoTxt').textContent;
    for (let k = 0; k < 150 && /Calculando/.test(d.textContent); k++) await dormir(100);
    const info = d.querySelector('#aInfo') ? d.querySelector('#aInfo').textContent : '';
    cerrar(); return { codigo: c, info, nivel: SVApp.nivel().id };`, v => v && /^S1[0-9A-Z-]+$/.test(v.codigo) && /soluci/.test(v.info) && v.nivel.startsWith('autor-'));
  await prueba('Autor: un título sin solución con 2 viñetas se avisa y no se juega', `${AYUDA}
    cerrar(); SVApp.abrirAutor({ personajes: ['lucia','mateo'], escenas: ['selva','rio','noche'], viñetas: 2 }); await dormir(100);
    const d = document.querySelector('#dlgModos'), form = d.querySelector('#fAutor'), sel = d.querySelector('#aTitulo');
    sel.value = [...sel.options].find(o => o.textContent === 'Lucía y Mateo se encuentran').value;
    form.requestSubmit();
    for (let k = 0; k < 60 && /Comprobando/.test(d.querySelector('#aNota').textContent); k++) await dormir(100);
    const r = { abierto: d.open, error: d.querySelector('#aNota').classList.contains('error'), nota: d.querySelector('#aNota').textContent, nivel: SVApp.nivel().id };
    cerrar(); return r;`, v => v && v.abierto && v.error && /no tiene solución/.test(v.nota) && v.nivel !== 'autor-nuevo');
  await prueba('importar ese código en minúsculas y sin guiones', `${AYUDA}
    SVApp.importarCodigo(${JSON.stringify(codigo && codigo.codigo ? codigo.codigo.toLowerCase().replace(/-/g, ' ') : 'xx')}); await dormir(100);
    document.querySelector('#fCodigo').requestSubmit(); await dormir(300); return SVApp.nivel().titulo;`, v => v === 'Valeria cura a Diego');
  await prueba('Profe (tecla P): contraseña y soluciones calculadas en el Worker', `${AYUDA}
    cerrar(); SVApp.abrirNivel('c3n6');
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true })); await dormir(100);
    const d = document.querySelector('#dlgModos'); d.querySelector('#pIn').value = 'profe'; d.querySelector('#fClave').requestSubmit(); await dormir(200);
    const t0 = performance.now(); let maxBloqueo = 0, ult = performance.now();
    const latido = setInterval(() => { const a = performance.now(); maxBloqueo = Math.max(maxBloqueo, a - ult); ult = a; }, 50);
    d.querySelector('#bSol').click();
    for (let k = 0; k < 600 && !d.querySelector('[data-sol]') && !/No se pudo/.test(d.querySelector('#pSol').textContent); k++) await dormir(100);
    clearInterval(latido);
    const nota = d.querySelector('#pSol').textContent.slice(0, 120); const n = d.querySelectorAll('[data-sol]').length;
    if (n) { d.querySelector('[data-sol]').click(); await dormir(300); }
    const estado = document.querySelector('#estadoNivel').textContent, exito = document.querySelector('#dlgExito').open; cerrar();
    return { n, nota, ms: Math.round(performance.now() - t0), maxBloqueo: Math.round(maxBloqueo), estado, exito };`,
    v => v && v.n > 0 && /Muy bien/.test(v.estado) && !v.exito && v.maxBloqueo < 1500);
  await prueba('imprimir: 3 páginas A4 (cómic + hojas de 4 y 6)', `${AYUDA}
    const pr = window.print; window.print = () => {}; SVApp.imprimir(); window.print = pr;
    const s = document.querySelector('#impresion'); return [s.querySelectorAll('.imp-pagina').length, ...[...s.querySelectorAll('.imp-hoja')].map(h => h.querySelectorAll('.imp-vineta').length)].join(',');`, v => v === '3,4,6');
  await prueba('Borrar mis datos conserva los niveles de la clase', `${AYUDA}
    window.confirm = () => true; document.querySelector('#btnNiveles').click(); document.querySelector('#btnBorrarDatos').click(); await dormir(200);
    cerrar(); SVApp.cerrarPaneles(); return { extra: SVApp.extra().length, c1n1: !!SVApp.progreso().c1n1 };`, v => v && v.extra >= 1 && !v.c1n1);
  await prueba('modo Pizarra: letra grande, sin desplazamiento a 1280×720', `${AYUDA}
    SVApp.elegirModo('pizarra'); SVApp.abrirNivel('c3n6'); await dormir(200);
    return { rem: getComputedStyle(document.documentElement).fontSize, alto: document.documentElement.scrollHeight, ancho: document.documentElement.scrollWidth };`,
    v => v && parseFloat(v.rem) >= 18 && v.alto <= H && v.ancho <= W);
  await espera(300);
  const externas = red.filter(u => !u.startsWith('file:') && !u.startsWith('blob:') && !u.startsWith('data:') && !u.startsWith('about:'));
  resultados.push([externas.length === 0, 'cero peticiones de red', externas.slice(0, 3).join(' ')]);
  resultados.push([errores.length === 0, 'sin errores en la consola', errores.slice(0, 3).join(' | ')]);
  if (process.argv.includes('--ver')) { const data = await nav.captura(); const dest = path.join(__dirname, '..', 'docs', `captura_${nombre}.png`); fs.writeFileSync(dest, Buffer.from(data, 'base64')); console.log('captura: ' + dest); }
  nav.cerrar();
  let fallos = 0;
  for (const [ok, t, info] of resultados) { if (!ok) fallos++; console.log(`  ${ok ? '✔' : '✗'} ${t}${info ? ' → ' + info : ''}`); }
  console.log(`${nombre} (file://): ${resultados.length - fallos}/${resultados.length} pruebas superadas`);
  setTimeout(() => { try { fs.rmSync(perfil, { recursive: true, force: true }); } catch (_) { /* Windows puede tardar en soltar el perfil */ } process.exit(fallos ? 1 : 0); }, 500);
}
main().catch(e => { console.error('✗ ' + e.message); process.exit(1); });
