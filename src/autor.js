/* Sobrevives — modo Autor (lógica pura, sin DOM). Funciona en Node y en el navegador (window.SVAutor).
   codificar(nivel)                      → código corto para dictar: «S1AB-CDEF-GHJK-M»
   decodificar(codigo)                   → nivel {id:'autor-…', capitulo:0, autor:true, titulo, viñetas, escenas, personajes, objetivo, inicial?}
   asistenteTitulos(personajes, escenas) → [{objetivo, titulo}] títulos posibles con esas cartas
   validar(nivel, opts)                  → {ok, errores, total, soluciones, textos, densidad, segundos}
   almacen(store)                        → {listar, guardar, borrar, exportarTodo, importarTodo} sobre localStorage (inyectado)
   grabar(nivel, viñetas)                → copia del nivel con el objetivo «historia» grabado de la solución jugada

   FORMATO DEL CÓDIGO (versión 1)
   · Alfabeto Crockford base32: 0-9 y A-Z sin I, L, O, U (al leer: I, L → 1 · O → 0 · U → V). 5 bits por carácter.
   · «S» + versión (1 carácter) + carga + control (1 carácter). Grupos de 4 separados por «-»; mayúsculas, espacios y guiones dan igual.
   · Control = Σ (2i+1)·valor(i) mod 32 sobre versión + carga. Los pesos impares son invertibles mod 32: cualquier
     cambio de UN carácter se detecta siempre; los cambios de orden de dos letras vecinas casi siempre.
   · Carga (flujo de bits, relleno final con ceros, < 5 bits):
       viñetas-1 (3) · nPersonajes-1 (2) · personajes (3 cada uno, índice en C.PERSONAJES)
       nEscenas-1 (5) · escenas (5 cada una, índice en C.ESCENAS) · títuloLibre (1) · inicial (1)
       objetivo: tipo (4) + campos según tipo; personajes del objetivo = índice en el nivel (2); estado (4); evento (6)
         estado    quien · estado · valor(1)        yaNo   quien · estado        todos  estado · valor(1)   nadie  estado
         nunca     ¿quien?(1+2) · estado            evento evento · ¿quien? · ¿a?   sinEvento evento · ¿quien?
         amigos    a · b                            enfadado quien · con          y      nPartes-2 (2) + partes
         historia  por personaje del nivel: presente(1) + máscara de 8 bits (7 negativos + a salvo); nEventos (5) + eventos (evento · ¿quien? · ¿a?)
       título libre (solo si no es igual a E.tituloDe(objetivo)): longitud en bytes (8) + UTF-8
       inicial (si hay): por personaje del nivel, máscara de estados (8) + máscara de objetos (5)
   Las tablas TIPOS / EVENTOS / C.ESTADOS / C.ESCENAS / C.PERSONAJES solo pueden crecer por el final: si cambian, sube VERSION. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./contenido.js'), require('./engine.js'));
  else root.SVAutor = factory(root.SVContenido, root.SVEngine);
})(typeof self !== 'undefined' ? self : this, function (C, E) {
  'use strict';

  const NEGATIVOS = E.NEGATIVOS; // hambre, sed, frio, miedo, cansado, herido, perdido
  const ESTADOS = C.ESTADOS.map(e => e.id); // … + salvo, contento
  const OBJETOS = C.OBJETOS.map(o => o.id);
  const ESCENA = {}; for (const e of C.ESCENAS) ESCENA[e.id] = e;
  const PJ = {}; for (const p of C.PERSONAJES) PJ[p.id] = p;
  const nombre = id => (PJ[id] ? PJ[id].nombre : id);

  /* ---------- alfabeto y código ---------- */
  const ALFABETO = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const VERSION = '1';
  const MENSAJE_INVALIDO = 'Este código no es válido. Revísalo letra por letra.';
  const invalido = () => new Error(MENSAJE_INVALIDO);
  const noGuardable = razon => new Error(`No se puede crear el código: ${razon}.`);

  /** Carácter de control de una cadena de símbolos del alfabeto. */
  function sumaControl(simbolos) {
    let s = 0;
    for (let i = 0; i < simbolos.length; i++) s += (2 * i + 1) * ALFABETO.indexOf(simbolos[i]);
    return ALFABETO[s % 32];
  }
  /** Solo letras y cifras, en mayúsculas, con los confundibles corregidos (I, L → 1 · O → 0 · U → V). */
  function limpiar(codigo) {
    return String(codigo == null ? '' : codigo).replace(/[^0-9A-Za-z]/g, '').toUpperCase().replace(/[IL]/g, '1').replace(/O/g, '0').replace(/U/g, 'V');
  }
  /** Grupos de 4 separados por «-»: más fácil de dictar y de copiar. */
  function formatear(s) { return (s.match(/.{1,4}/g) || []).join('-'); }
  /** Hash corto (FNV-1a → 6 símbolos) para el id del nivel: el mismo código da siempre el mismo id. */
  function hashCorto(s) {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    let out = '';
    for (let i = 0; i < 6; i++) { out = ALFABETO[h & 31] + out; h >>>= 5; }
    return out;
  }

  /* ---------- bits ---------- */
  function Escritor() { this.bits = []; }
  Escritor.prototype.u = function (n, v) { for (let i = n - 1; i >= 0; i--) this.bits.push((v >> i) & 1); return this; };
  Escritor.prototype.simbolos = function () {
    const b = this.bits.slice();
    while (b.length % 5) b.push(0);
    let s = '';
    for (let i = 0; i < b.length; i += 5) s += ALFABETO[(b[i] << 4) | (b[i + 1] << 3) | (b[i + 2] << 2) | (b[i + 3] << 1) | b[i + 4]];
    return s;
  };
  function Lector(simbolos) {
    this.bits = []; this.pos = 0;
    for (const ch of simbolos) {
      const v = ALFABETO.indexOf(ch);
      if (v < 0) throw invalido();
      for (let i = 4; i >= 0; i--) this.bits.push((v >> i) & 1);
    }
  }
  Lector.prototype.u = function (n) {
    if (this.pos + n > this.bits.length) throw invalido();
    let v = 0;
    for (let i = 0; i < n; i++) v = (v << 1) | this.bits[this.pos++];
    return v;
  };
  /** Al final solo puede quedar el relleno: menos de 5 bits, todos a cero. */
  Lector.prototype.fin = function () {
    if (this.bits.length - this.pos >= 5) throw invalido();
    while (this.pos < this.bits.length) if (this.bits[this.pos++]) throw invalido();
  };

  /* ---------- UTF-8 a mano (igual en Node y en cualquier navegador) ---------- */
  function aUtf8(s) {
    const out = [];
    for (let i = 0; i < s.length; i++) {
      let c = s.charCodeAt(i);
      if (c >= 0xD800 && c < 0xDC00 && i + 1 < s.length) {
        const d = s.charCodeAt(i + 1);
        if (d >= 0xDC00 && d < 0xE000) { c = 0x10000 + ((c - 0xD800) << 10) + (d - 0xDC00); i++; }
      }
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xC0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else out.push(0xF0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  }
  function deUtf8(bytes) {
    let s = '', i = 0;
    const sig = () => { if (i >= bytes.length) throw invalido(); const b = bytes[i++]; if ((b & 0xC0) !== 0x80) throw invalido(); return b & 63; };
    while (i < bytes.length) {
      const b = bytes[i++];
      let c;
      if (b < 0x80) c = b;
      else if (b < 0xC0) throw invalido();
      else if (b < 0xE0) c = ((b & 31) << 6) | sig();
      else if (b < 0xF0) { c = (b & 15) << 12; c |= sig() << 6; c |= sig(); }
      else { c = (b & 7) << 18; c |= sig() << 12; c |= sig() << 6; c |= sig(); }
      if (c > 0x10FFFF) throw invalido();
      s += String.fromCodePoint(c);
    }
    return s;
  }

  /* ---------- tablas fijas del formato (solo crecen por el final) ---------- */
  const TIPOS = ['estado', 'yaNo', 'todos', 'nadie', 'nunca', 'evento', 'sinEvento', 'amigos', 'enfadado', 'y', 'historia'];
  const EVENTOS = ['encuentra', 'seEncuentran', 'pierde', 'noPierde', 'caminanJuntos', 'bebe', 'cruzaCuerda', 'cruzaMojado', 'calor', 'tormenta',
    'nocheSolo', 'nocheLinterna', 'nocheJuntos', 'jaguarSolo', 'jaguarJuntos', 'serpienteMuerde', 'serpienteAvisa', 'comeFrutas', 'fuego', 'comeComida',
    'comen', 'comparte', 'comeSolo', 'descansa', 'cura', 'seCuran', 'perdon', 'montana', 'mapa', 'mochila', 'cuerda', 'manta', 'linterna', 'rescate',
    'rescateNoVe', 'amigos', 'yaSalvo', 'demasiados'];

  /** Quita las claves undefined (para que el objetivo decodificado sea igual al original). */
  function limpio(o) { for (const k in o) if (o[k] === undefined) delete o[k]; return o; }

  function escribirObjetivo(w, obj, nivel) {
    const ref = id => { const i = nivel.personajes.indexOf(id); if (i < 0 || i > 3) throw noGuardable(`el título habla de «${nombre(id)}», que no está en el nivel`); w.u(2, i); };
    const refOpc = id => { if (id) { w.u(1, 1); ref(id); } else w.u(1, 0); };
    const est = e => { const i = ESTADOS.indexOf(e); if (i < 0) throw noGuardable(`estado desconocido «${e}»`); w.u(4, i); };
    const evt = e => { const i = EVENTOS.indexOf(e); if (i < 0) throw noGuardable(`evento desconocido «${e}»`); w.u(6, i); };
    if (!obj || !obj.tipo) throw noGuardable('el nivel todavía no tiene título u objetivo');
    const t = TIPOS.indexOf(obj.tipo);
    if (t < 0) throw noGuardable(`tipo de objetivo desconocido «${obj.tipo}»`);
    w.u(4, t);
    switch (obj.tipo) {
      case 'estado': ref(obj.quien); est(obj.estado); w.u(1, obj.valor === false ? 0 : 1); break;
      case 'yaNo': ref(obj.quien); est(obj.estado); break;
      case 'todos': est(obj.estado); w.u(1, obj.valor === false ? 0 : 1); break;
      case 'nadie': est(obj.estado); break;
      case 'nunca': refOpc(obj.quien); est(obj.estado); break;
      case 'evento': evt(obj.evento); refOpc(obj.quien); refOpc(obj.a); break;
      case 'sinEvento': evt(obj.evento); refOpc(obj.quien); break;
      case 'amigos': ref(obj.a); ref(obj.b); break;
      case 'enfadado': ref(obj.quien); ref(obj.con); break;
      case 'y': {
        const partes = obj.partes || [];
        if (partes.length < 2 || partes.length > 5) throw noGuardable('un título con «y» tiene de 2 a 5 partes');
        w.u(2, partes.length - 2);
        for (const p of partes) escribirObjetivo(w, p, nivel);
        break;
      }
      case 'historia': {
        for (const id of nivel.personajes) {
          const f = (obj.finales || {})[id];
          if (!f) { w.u(1, 0); continue; }
          let m = 0;
          NEGATIVOS.forEach((k, i) => { if (f[k]) m |= 1 << i; });
          if (f.salvo) m |= 1 << 7;
          w.u(1, 1); w.u(8, m);
        }
        const evs = obj.eventos || [];
        if (evs.length > 31) throw noGuardable('la historia tiene demasiados eventos');
        w.u(5, evs.length);
        for (const e of evs) { evt(e.tipo); refOpc(e.quien); refOpc(e.a); }
        break;
      }
    }
  }
  function leerObjetivo(r, personajes) {
    const ref = () => { const i = r.u(2); if (i >= personajes.length) throw invalido(); return personajes[i]; };
    const refOpc = () => (r.u(1) ? ref() : undefined);
    const est = () => { const i = r.u(4); if (i >= ESTADOS.length) throw invalido(); return ESTADOS[i]; };
    const evt = () => { const i = r.u(6); if (i >= EVENTOS.length) throw invalido(); return EVENTOS[i]; };
    const t = r.u(4);
    if (t >= TIPOS.length) throw invalido();
    switch (TIPOS[t]) {
      case 'estado': return { tipo: 'estado', quien: ref(), estado: est(), valor: !!r.u(1) };
      case 'yaNo': return { tipo: 'yaNo', quien: ref(), estado: est() };
      case 'todos': return { tipo: 'todos', estado: est(), valor: !!r.u(1) };
      case 'nadie': return { tipo: 'nadie', estado: est() };
      case 'nunca': return limpio({ tipo: 'nunca', quien: refOpc(), estado: est() });
      case 'evento': return limpio({ tipo: 'evento', evento: evt(), quien: refOpc(), a: refOpc() });
      case 'sinEvento': return limpio({ tipo: 'sinEvento', evento: evt(), quien: refOpc() });
      case 'amigos': return { tipo: 'amigos', a: ref(), b: ref() };
      case 'enfadado': return { tipo: 'enfadado', quien: ref(), con: ref() };
      case 'y': {
        const n = r.u(2) + 2, partes = [];
        for (let i = 0; i < n; i++) partes.push(leerObjetivo(r, personajes));
        return { tipo: 'y', partes };
      }
      case 'historia': {
        const finales = {};
        for (const id of personajes) {
          if (!r.u(1)) continue;
          const m = r.u(8), f = {};
          NEGATIVOS.forEach((k, i) => { f[k] = !!((m >> i) & 1); });
          f.salvo = !!((m >> 7) & 1);
          finales[id] = f;
        }
        const n = r.u(5), eventos = [];
        for (let i = 0; i < n; i++) eventos.push(limpio({ tipo: evt(), quien: refOpc(), a: refOpc() }));
        return { tipo: 'historia', finales, eventos };
      }
    }
    throw invalido();
  }

  /** Estado inicial como máscaras por personaje; null si no hay nada que guardar. */
  function inicialCompacto(nivel) {
    if (!nivel.inicial || typeof nivel.inicial !== 'object') return null;
    const out = {};
    let alguno = false;
    for (const id of nivel.personajes) {
      const s = nivel.inicial[id];
      if (!s) continue;
      let m = 0, o = 0;
      NEGATIVOS.forEach((k, i) => { if (s[k]) m |= 1 << i; });
      if (s.salvo) m |= 1 << 7;
      for (const x of s.objetos || []) { const i = OBJETOS.indexOf(x); if (i >= 0) o |= 1 << i; }
      if (m || o) { out[id] = { m, o }; alguno = true; }
    }
    return alguno ? out : null;
  }

  /* ---------- codificar / decodificar ---------- */
  function codificar(nivel) {
    if (!nivel || typeof nivel !== 'object') throw noGuardable('falta el nivel');
    const w = new Escritor();
    const n = Number(nivel.viñetas);
    if (!Number.isInteger(n) || n < 1 || n > 8) throw noGuardable('las viñetas tienen que estar entre 1 y 8');
    w.u(3, n - 1);
    const pjs = Array.isArray(nivel.personajes) ? nivel.personajes : [];
    if (pjs.length < 1 || pjs.length > 4) throw noGuardable('el nivel necesita de 1 a 4 personajes');
    if (new Set(pjs).size !== pjs.length) throw noGuardable('hay un personaje repetido');
    w.u(2, pjs.length - 1);
    for (const id of pjs) { const i = C.PERSONAJES.findIndex(p => p.id === id); if (i < 0) throw noGuardable(`personaje desconocido «${id}»`); w.u(3, i); }
    const escs = Array.isArray(nivel.escenas) ? nivel.escenas : [];
    if (escs.length < 1 || escs.length > 32) throw noGuardable('el nivel necesita de 1 a 32 escenas');
    if (new Set(escs).size !== escs.length) throw noGuardable('hay una escena repetida');
    w.u(5, escs.length - 1);
    for (const id of escs) { const i = C.ESCENAS.findIndex(e => e.id === id); if (i < 0) throw noGuardable(`escena desconocida «${id}»`); w.u(5, i); }
    // Título: solo se guarda si el motor no puede regenerarlo desde el objetivo
    const titulo = String(nivel.titulo || '').trim();
    let generado = null;
    try { generado = E.tituloDe(nivel.objetivo, nivel); } catch (_) { generado = null; }
    const libre = !!titulo && titulo !== generado;
    const ini = inicialCompacto(nivel);
    w.u(1, libre ? 1 : 0); w.u(1, ini ? 1 : 0);
    escribirObjetivo(w, nivel.objetivo, nivel);
    if (libre) {
      const b = aUtf8(titulo);
      if (b.length > 255) throw noGuardable('el título es demasiado largo');
      w.u(8, b.length);
      for (const x of b) w.u(8, x);
    }
    if (ini) for (const id of pjs) { const s = ini[id] || { m: 0, o: 0 }; w.u(8, s.m); w.u(5, s.o); }
    const cuerpo = VERSION + w.simbolos();
    return formatear('S' + cuerpo + sumaControl(cuerpo));
  }

  function decodificar(codigo) {
    const s = limpiar(codigo);
    if (!s) throw new Error('Escribe un código.');
    if (s[0] !== 'S' || s.length < 4) throw invalido();
    if (s[1] !== VERSION) throw new Error('Este código es de otra versión del juego.');
    const cuerpo = s.slice(1, -1);
    if (sumaControl(cuerpo) !== s[s.length - 1]) throw invalido();
    const r = new Lector(cuerpo.slice(1));
    const n = r.u(3) + 1;
    const nP = r.u(2) + 1, personajes = [];
    for (let i = 0; i < nP; i++) { const k = r.u(3); if (k >= C.PERSONAJES.length) throw invalido(); personajes.push(C.PERSONAJES[k].id); }
    const nE = r.u(5) + 1, escenas = [];
    for (let i = 0; i < nE; i++) { const k = r.u(5); if (k >= C.ESCENAS.length) throw invalido(); escenas.push(C.ESCENAS[k].id); }
    if (new Set(personajes).size !== nP || new Set(escenas).size !== nE) throw invalido();
    const libre = r.u(1), conInicial = r.u(1);
    const objetivo = leerObjetivo(r, personajes);
    let titulo = null;
    if (libre) { const len = r.u(8), bytes = []; for (let i = 0; i < len; i++) bytes.push(r.u(8)); titulo = deUtf8(bytes); }
    let inicial = null;
    if (conInicial) {
      inicial = {};
      for (const id of personajes) {
        const m = r.u(8), o = r.u(5);
        if (!m && !o) continue;
        const st = {};
        NEGATIVOS.forEach((k, i) => { if ((m >> i) & 1) st[k] = true; });
        if ((m >> 7) & 1) st.salvo = true;
        const objetos = OBJETOS.filter((x, i) => (o >> i) & 1);
        if (objetos.length) st.objetos = objetos;
        inicial[id] = st;
      }
    }
    r.fin();
    const nivel = { id: 'autor-' + hashCorto(s), capitulo: 0, autor: true, titulo: '', viñetas: n, escenas, personajes, objetivo, pistas: [], codigo: formatear(s) };
    if (inicial && Object.keys(inicial).length) nivel.inicial = inicial;
    nivel.titulo = titulo !== null ? titulo : E.tituloDe(objetivo, nivel);
    return nivel;
  }

  /* ---------- asistente de títulos ----------
     Requisitos leídos en paso() de engine.js. Cada entrada es una lista de alternativas; una alternativa exige TODAS
     sus escenas, un mínimo de personajes y, si «dos», alguna escena de 2 plazas. */
  const CONSIGUE = { // cómo aparece un estado
    hambre: [{ escenas: ['selva'], personajes: 2 }, { escenas: ['montana'] }],      // selva a dos (caminan juntos) · montaña
    sed: [{ escenas: ['sol'] }],                                                     // el sol
    frio: [{ escenas: ['rio'] }, { escenas: ['tormenta'] }],                         // río sin cuerda · tormenta sin manta
    miedo: [{ escenas: ['tormenta'] }, { escenas: ['noche'] }, { escenas: ['jaguar'] }], // solo/a en la tormenta, la noche (sin linterna) o con el jaguar
    cansado: [{ escenas: ['selva'], personajes: 2 }, { escenas: ['montana'] }],     // selva a dos · montaña
    herido: [{ escenas: ['serpiente'] }],                                            // la serpiente, solo/a
    perdido: [{ escenas: ['selva'] }, { escenas: ['jaguar'] }],                      // solo/a sin mapa en la selva o con el jaguar
    salvo: [{ escenas: ['rescate'] }]                                                // el rescate (sin estar perdido)
  };
  const QUITA = { // cómo desaparece un estado
    hambre: [{ escenas: ['frutas'] }, { escenas: ['mochila'] }],                     // frutas · mochila (y el fuego con la comida de la mochila)
    sed: [{ escenas: ['rio'] }],                                                     // bebe agua
    frio: [{ escenas: ['fuego'] }, { escenas: ['manta'] }],                          // fuego · manta
    miedo: [{ escenas: ['noche'], personajes: 2 }, { escenas: ['noche', 'linterna'] }, { escenas: ['refugio'] }, { escenas: ['linterna'] }],
    cansado: [{ escenas: ['noche'], personajes: 2 }, { escenas: ['refugio'] }],     // noche a dos · refugio
    herido: [{ escenas: ['refugio'], personajes: 2 }],                               // el otro lo cura en el refugio
    perdido: [{ escenas: ['mapa'] }, { escenas: ['montana'] }, { dos: true, personajes: 2 }] // mapa · montaña · alguien lo encuentra (cualquier escena a dos)
  };
  const REQ_EVENTO = {
    encuentra: [{ escenas: ['selva'], personajes: 2 }, { escenas: ['jaguar'], personajes: 2 }],      // uno se pierde solo; después, los dos juntos (la misma escena vale)
    seEncuentran: [{ escenas: ['selva'], personajes: 2 }, { escenas: ['jaguar'], personajes: 2 }],   // los dos se pierden por separado; después, juntos
    cura: [{ escenas: ['serpiente', 'refugio'], personajes: 2 }],                                      // herido (serpiente solo) + los dos en el refugio
    comparte: [{ escenas: ['mochila', 'fuego', 'selva'], personajes: 2 }, { escenas: ['mochila', 'fuego', 'montana'], personajes: 2 }], // comida + hambre del otro + amigos antes del fuego
    comeSolo: [{ escenas: ['mochila', 'fuego', 'montana'], personajes: 2 }, { escenas: ['mochila', 'fuego', 'selva'], personajes: 3 }],  // comida + hambre del otro (montaña solo, o selva con un tercero) sin ser amigos
    perdon: [{ escenas: ['mochila', 'fuego', 'montana', 'refugio'], personajes: 2 }, { escenas: ['mochila', 'fuego', 'selva', 'refugio'], personajes: 3 }], // comeSolo + los dos en el refugio
    nocheJuntos: [{ escenas: ['noche'], personajes: 2 }],
    jaguarJuntos: [{ escenas: ['jaguar'], personajes: 2 }],
    caminanJuntos: [{ escenas: ['selva'], personajes: 2 }],
    nocheLinterna: [{ escenas: ['noche', 'linterna'] }]                                                 // linterna antes de la noche, solo/a
  };
  const REQ_RELACION = {
    amigos: [{ dos: true, personajes: 2 }], // compartir cualquier viñeta de 2 plazas
    enfadado: REQ_EVENTO.comeSolo
  };
  // Orden pedagógico de los eventos propuestos y cómo se nombran sus participantes
  const EVENTOS_ASISTENTE = ['encuentra', 'cura', 'comparte', 'perdon', 'seEncuentran', 'nocheJuntos', 'jaguarJuntos', 'caminanJuntos', 'nocheLinterna', 'comeSolo'];
  const FORMA_EVENTO = { encuentra: 'ordenado', cura: 'ordenado', comparte: 'ordenado', perdon: 'ordenado', seEncuentran: 'pareja', nocheJuntos: 'pareja',
    caminanJuntos: 'pareja', jaguarJuntos: 'generico', nocheLinterna: 'uno', comeSolo: 'uno' };

  function cumple(alternativas, escenas, nP) {
    return (alternativas || []).some(alt => (alt.escenas || []).every(e => escenas.includes(e)) && nP >= (alt.personajes || 1) && (!alt.dos || escenas.some(e => ESCENA[e].slots >= 2)));
  }

  function asistenteTitulos(personajes, escenas) {
    const pjs = E.ordenar((personajes || []).filter((id, i, a) => PJ[id] && a.indexOf(id) === i));
    const escs = (escenas || []).filter((id, i, a) => ESCENA[id] && a.indexOf(id) === i);
    const nivel = { personajes: pjs, escenas: escs };
    const nP = pjs.length;
    const puede = alts => cumple(alts, escs, nP);
    const consigue = k => puede(CONSIGUE[k]);
    const algunNegativo = NEGATIVOS.some(consigue);
    const out = [], vistos = new Set();
    const add = objetivo => {
      if (!E.objetivoValido(objetivo)) return;
      const titulo = E.tituloDe(objetivo, nivel);
      if (!titulo || vistos.has(titulo)) return;
      vistos.add(titulo); out.push({ objetivo, titulo });
    };
    const parejas = [], ordenadas = [];
    for (let i = 0; i < nP; i++) for (let j = 0; j < nP; j++) if (i !== j) { ordenadas.push([pjs[i], pjs[j]]); if (i < j) parejas.push([pjs[i], pjs[j]]); }

    // 1. estados simples: «Lucía tiene sed» · «Lucía está a salvo» · «Lucía está contenta» (si algo puede salir mal)
    for (const q of pjs) {
      for (const k of NEGATIVOS) if (consigue(k)) add({ tipo: 'estado', quien: q, estado: k, valor: true });
      if (consigue('salvo')) add({ tipo: 'estado', quien: q, estado: 'salvo', valor: true });
      if (algunNegativo) add({ tipo: 'estado', quien: q, estado: 'contento', valor: true });
    }
    // 2. ya no: el estado tiene que poder aparecer y desaparecer
    for (const q of pjs) for (const k of NEGATIVOS) if (consigue(k) && puede(QUITA[k])) add({ tipo: 'yaNo', quien: q, estado: k });
    // 3. nunca: solo tiene gracia si el estado puede aparecer
    for (const q of pjs) for (const k of NEGATIVOS) if (consigue(k)) add({ tipo: 'nunca', quien: q, estado: k });
    // 4. eventos
    for (const ev of EVENTOS_ASISTENTE) {
      if (!puede(REQ_EVENTO[ev])) continue;
      const forma = FORMA_EVENTO[ev];
      if (forma === 'ordenado') for (const [q, a] of ordenadas) add({ tipo: 'evento', evento: ev, quien: q, a });
      else if (forma === 'pareja') for (const [q, a] of parejas) add({ tipo: 'evento', evento: ev, quien: q, a });
      else if (forma === 'generico') add({ tipo: 'evento', evento: ev });
      else for (const q of pjs) add({ tipo: 'evento', evento: ev, quien: q });
    }
    // 5. todos / nadie (con 2 personajes o más)
    if (nP >= 2) {
      for (const k of NEGATIVOS) if (consigue(k)) add({ tipo: 'todos', estado: k, valor: true });
      if (consigue('salvo')) add({ tipo: 'todos', estado: 'salvo', valor: true });
      if (algunNegativo) add({ tipo: 'todos', estado: 'contento', valor: true });
      for (const k of NEGATIVOS) if (consigue(k)) add({ tipo: 'nadie', estado: k });
    }
    // 6. relaciones
    if (nP >= 2) {
      if (puede(REQ_RELACION.amigos)) for (const [a, b] of parejas) add({ tipo: 'amigos', a, b });
      if (puede(REQ_RELACION.enfadado)) for (const [q, con] of ordenadas) add({ tipo: 'enfadado', quien: q, con });
    }
    return out;
  }

  /* ---------- validar ---------- */
  /** Personajes nombrados en un objetivo (para avisar si alguno no está en el nivel). */
  function personajesDe(obj, out) {
    out = out || [];
    if (!obj || typeof obj !== 'object') return out;
    for (const k of ['quien', 'a', 'b', 'con']) if (typeof obj[k] === 'string' && !out.includes(obj[k])) out.push(obj[k]);
    if (obj.finales) for (const id in obj.finales) if (!out.includes(id)) out.push(id);
    for (const e of obj.eventos || []) personajesDe(e, out);
    for (const p of obj.partes || []) personajesDe(p, out);
    return out;
  }
  function validar(nivel, opts) {
    opts = opts || {};
    const reloj = opts.reloj || (() => Date.now()); // solo para el campo informativo «segundos»: no cambia el resultado
    const t0 = reloj();
    const errores = [];
    const salida = r => ({ ok: !errores.length, errores, total: r ? r.total : 0, soluciones: r ? r.soluciones.slice(0, 5) : [],
      textos: r ? r.soluciones.slice(0, 5).map(E.textoSolucion) : [], densidad: r ? r.densidad : 0, desbordado: !!(r && r.desbordado), segundos: (reloj() - t0) / 1000 });
    if (!nivel || typeof nivel !== 'object') { errores.push('Falta el nivel.'); return salida(null); }
    const titulo = String(nivel.titulo || '').trim();
    const escenas = Array.isArray(nivel.escenas) ? nivel.escenas : [];
    const personajes = Array.isArray(nivel.personajes) ? nivel.personajes : [];
    const n = Number(nivel.viñetas);
    if (!titulo) errores.push('Escribe un título.');
    if (!escenas.length) errores.push('Elige al menos una escena.');
    else if (escenas.length > 8) errores.push('Demasiadas escenas: 8 como máximo.');
    if (escenas.some(id => !ESCENA[id])) errores.push('Hay una escena que no existe.');
    if (!personajes.length) errores.push('Elige al menos un personaje.');
    else if (personajes.length > 4) errores.push('Demasiados personajes: 4 como máximo.');
    if (personajes.some(id => !PJ[id])) errores.push('Hay un personaje que no existe.');
    if (new Set(personajes).size !== personajes.length) errores.push('Hay un personaje repetido.');
    if (!Number.isInteger(n) || n < 1 || n > 6) errores.push('El número de viñetas tiene que estar entre 1 y 6.');
    if (!nivel.objetivo) errores.push('Este nivel todavía no tiene objetivo: elige un título o juega la solución.');
    else if (!E.objetivoValido(nivel.objetivo)) errores.push('Este título no tiene sentido.');
    else {
      const fuera = personajesDe(nivel.objetivo).filter(id => !personajes.includes(id));
      if (fuera.length) errores.push(`El título habla de ${nombre(fuera[0])}, pero no está en el nivel.`);
    }
    if (errores.length) return salida(null);
    const r = E.resolver(nivel, { max: 5, limite: opts.limite || 1.5e6 });
    if (r.desbordado) errores.push('Demasiado grande para comprobarlo.');
    else if (!r.total) errores.push('Este título no tiene solución con estas escenas y estos personajes.');
    return salida(r);
  }

  /* ---------- grabar la solución jugada (título libre → objetivo «historia») ---------- */
  function grabar(nivel, viñetas) {
    const res = E.simular(nivel, viñetas);
    if (res.incompleto) throw new Error('Faltan viñetas: pon una escena y un personaje en cada viñeta.');
    if (!res.valido) throw new Error('Esta historia no vale: mira la frase en rojo.');
    if (res.faltan && res.faltan.length) throw new Error(`${nombre(res.faltan[0])} no sale en la historia.`);
    return Object.assign({}, nivel, { objetivo: E.objetivoDeHistoria(nivel, res) });
  }

  /* ---------- almacén (localStorage inyectado; nunca lanza por falta de almacenamiento) ---------- */
  const CLAVE = 'sobrevives.autor.v0';
  const copia = x => JSON.parse(JSON.stringify(x));
  function almacen(store) {
    let memoria = []; // repuesto cuando el almacenamiento falla o no existe
    function leer() {
      try {
        const s = store ? store.getItem(CLAVE) : null;
        if (!s) return memoria.slice();
        const v = JSON.parse(s);
        if (Array.isArray(v)) { memoria = v; return v.slice(); }
      } catch (_) { /* sin almacenamiento o datos rotos: se usa la memoria */ }
      return memoria.slice();
    }
    function escribir(lista) {
      memoria = lista;
      try { if (store) store.setItem(CLAVE, JSON.stringify(lista)); } catch (_) { /* lleno o bloqueado: se queda en memoria */ }
    }
    return {
      listar() { return leer().map(copia); },
      guardar(nivel) {
        if (!nivel || typeof nivel.id !== 'string' || !nivel.id) throw new Error('El nivel necesita un id.');
        const lista = leer(), n = copia(nivel);
        n.autor = true;
        const i = lista.findIndex(x => x.id === n.id);
        if (i >= 0) lista[i] = n; else lista.push(n);
        escribir(lista);
        return copia(n);
      },
      borrar(id) {
        const lista = leer(), i = lista.findIndex(x => x.id === id);
        if (i < 0) return false;
        lista.splice(i, 1); escribir(lista);
        return true;
      },
      exportarTodo() { return JSON.stringify({ formato: CLAVE, niveles: leer() }); },
      importarTodo(json) {
        let datos;
        try { datos = typeof json === 'string' ? JSON.parse(json) : json; } catch (_) { throw new Error('Este archivo no es válido.'); }
        const nuevos = Array.isArray(datos) ? datos : datos && Array.isArray(datos.niveles) ? datos.niveles : null;
        if (!nuevos) throw new Error('Este archivo no es válido.');
        const lista = leer(), ids = new Set(lista.map(x => x.id));
        let k = 0;
        for (const n of nuevos) {
          if (!n || typeof n !== 'object' || typeof n.id !== 'string' || !n.id || ids.has(n.id)) continue;
          const c = copia(n); c.autor = true;
          lista.push(c); ids.add(c.id); k++;
        }
        if (k) escribir(lista);
        return k;
      }
    };
  }

  return { codificar, decodificar, asistenteTitulos, validar, almacen, grabar, limpiar, formatear, sumaControl, hashCorto,
    ALFABETO, VERSION, TIPOS, EVENTOS, CONSIGUE, QUITA, REQ_EVENTO, REQ_RELACION, CLAVE, MENSAJE_INVALIDO };
});
