/* Sobrevives — modo escritor (lógica pura, sin DOM). Funciona en Node y en el navegador (window.SVEscritor).
   En cada viñeta la frase generada se oculta: el alumno elige la frase correcta entre 3 (A1) o la escribe (A2).
   normalizar(s)                          → minúsculas, sin tildes (la ñ se conserva), sin signos ni comillas
   comparar(escrito, correcta)            → { ok, casi, nota, diferencias:[{esperada, escrita}], mensaje }
   opciones(nivel, viñetas, i, res, opts) → { correcta, opciones:[3 frases], indice, origen, recurso }
   pista(correcta)                        → «L____ t____ s__.»
   distancia(a, b)                        → distancia de edición (Levenshtein)
   Determinista: las alternativas son frases GENERADAS POR EL MOTOR (variantes de la viñeta) y el orden sale de un hash. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./contenido.js'), require('./engine.js'));
  else root.SVEscritor = factory(root.SVContenido, root.SVEngine);
})(typeof self !== 'undefined' ? self : this, function (C, E) {
  'use strict';

  /* ---------- texto ---------- */
  const SIGNOS = /[¿¡!?.,;:«»"'“”‘’…]/g;
  const ABRE = /[¿¡!?]/g;

  /** Quita tildes y diéresis; la ñ se conserva. */
  function sinTildes(s) {
    return s.normalize('NFD').replace(/ñ/g, 'ñ').replace(/Ñ/g, 'Ñ').replace(/[̀-ͯ]/g, '');
  }
  const sinSignos = s => s.replace(SIGNOS, '');
  const compactar = s => s.replace(/\s+/g, ' ').trim();
  const texto = s => String(s == null ? '' : s);
  const cuenta = (s, re) => (s.match(re) || []).length;
  const lista = xs => xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' y ' + xs[xs.length - 1];
  const comillas = w => '«' + w + '»';
  const plana = s => s.replace(/ñ/g, 'n').replace(/Ñ/g, 'N'); // la ñ no está en el teclado francés: se tolera como las tildes

  /** «  ¡Lucía tiene SED!  » → «lucia tiene sed» */
  function normalizar(s) { return compactar(sinSignos(sinTildes(texto(s).toLowerCase()))); }

  /** Distancia de edición (Levenshtein) entre dos cadenas. */
  function distancia(a, b) {
    a = texto(a); b = texto(b);
    if (a === b) return 0;
    if (!a.length || !b.length) return a.length + b.length;
    let prev = Array.from({ length: b.length + 1 }, (_, j) => j), cur = new Array(b.length + 1);
    for (let i = 1; i <= a.length; i++) {
      cur[0] = i;
      for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      [prev, cur] = [cur, prev];
    }
    return prev[b.length];
  }

  /** Palabras de una frase: [{ norm, texto }] (texto = la palabra original sin signos, para mostrarla). */
  function palabras(s) {
    const out = [];
    for (const t of texto(s).split(/\s+/)) {
      const limpia = sinSignos(t), norm = normalizar(limpia);
      if (norm) out.push({ norm, texto: limpia });
    }
    return out;
  }

  /** Alineación palabra a palabra (LCS). Devuelve solo las diferencias: [{ esperada, escrita }] ('' = falta / sobra). */
  function alinear(esperadas, escritas) {
    const m = esperadas.length, n = escritas.length;
    const T = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) {
      T[i][j] = esperadas[i].norm === escritas[j].norm ? T[i + 1][j + 1] + 1 : Math.max(T[i + 1][j], T[i][j + 1]);
    }
    const dif = [];
    let i = 0, j = 0, pE = [], pW = [];
    const vuelca = () => { // empareja por posición las palabras que no se han alineado
      for (let k = 0; k < Math.max(pE.length, pW.length); k++) dif.push({ esperada: pE[k] ? pE[k].texto : '', escrita: pW[k] ? pW[k].texto : '' });
      pE = []; pW = [];
    };
    while (i < m && j < n) {
      if (esperadas[i].norm === escritas[j].norm) { vuelca(); i++; j++; }
      else if (T[i + 1][j] >= T[i][j + 1]) pE.push(esperadas[i++]);
      else pW.push(escritas[j++]);
    }
    while (i < m) pE.push(esperadas[i++]);
    while (j < n) pW.push(escritas[j++]);
    vuelca();
    return dif;
  }

  /* ---------- comparar ----------
     ok   = la frase es correcta una vez normalizada (se toleran tildes, signos y mayúsculas).
     casi = con ok: solo fallan tildes / signos / mayúsculas; sin ok: pocos errores (≤ 1 por cada 8 letras, mínimo 1).
     nota = 1 exacta · 0,9 correcta con fallos de superficie · ≤ 0,8 según la distancia de edición.
     El mensaje señala las palabras del alumno que debe revisar, sin dar la solución (la UI tiene «diferencias» y pista()). */
  /* Sujeto coordinado: el motor escribe «Lucía y Mateo» en el orden de C.PERSONAJES, pero «Mateo y Lucía» es la misma frase. */
  const NOMBRES = C.PERSONAJES.map(p => p.nombre).join('|');
  const PAREJAS = new RegExp('(?<!\\p{L})(' + NOMBRES + ') y (' + NOMBRES + ')(?!\\p{L})', 'gu');
  /** La frase con cada pareja «X y Y» en los dos órdenes (2^k variantes; la primera es la original). */
  function variantes(c) {
    const p = c.split(PAREJAS); // [texto, X, Y, texto, X, Y, …, texto]
    let vs = [p[0]];
    for (let k = 1; k < p.length; k += 3) vs = vs.flatMap(v => [v + p[k] + ' y ' + p[k + 1] + p[k + 2], v + p[k + 1] + ' y ' + p[k] + p[k + 2]]);
    return vs;
  }
  function comparar(escrito, correcta) {
    const nE = plana(normalizar(escrito));
    const alt = nE && variantes(compactar(texto(correcta))).find(v => plana(normalizar(v)) === nE);
    return compararUna(escrito, alt || correcta); // tildes, ñ, signos y mayúsculas se comprueban contra esa variante
  }
  function compararUna(escrito, correcta) {
    const e = compactar(texto(escrito).normalize('NFC')), c = compactar(texto(correcta).normalize('NFC'));
    const nE = normalizar(e), nC = normalizar(c);
    const diferencias = alinear(palabras(c), palabras(e));
    if (!nE) return { ok: false, casi: false, nota: 0, diferencias, mensaje: 'Escribe la frase.' };
    if (plana(nE) === plana(nC)) {
      if (e === c) return { ok: true, casi: false, nota: 1, diferencias, mensaje: '¡Muy bien!' };
      const bajo = s => s.toLowerCase(), enie = nE !== nC, pe = plana(e), pc = plana(c);
      const acentos = compactar(sinSignos(bajo(pe))) !== compactar(sinSignos(bajo(pc)));
      const signos = compactar(sinTildes(bajo(pe))) !== compactar(sinTildes(bajo(pc)));
      const mayus = compactar(sinTildes(sinSignos(pe))) !== compactar(sinTildes(sinSignos(pc)));
      const faltan = signos && cuenta(e, ABRE) < cuenta(c, ABRE);
      let mensaje;
      if (signos && !acentos && !mayus && !enie) mensaje = faltan ? 'Casi: faltan los signos (¿ ? ¡ !).' : 'Casi: mira la puntuación.';
      else {
        const partes = [];
        if (enie) partes.push('la ñ');
        if (acentos) partes.push('los acentos');
        if (signos) partes.push(faltan ? 'los signos (¿ ? ¡ !)' : 'la puntuación');
        if (mayus) partes.push('las mayúsculas');
        mensaje = 'Casi: mira ' + lista(partes.length ? partes : ['la puntuación']) + '.';
      }
      return { ok: true, casi: true, nota: 0.9, diferencias, mensaje };
    }
    const dist = distancia(nE, nC);
    const umbral = Math.max(2, Math.floor(nC.length / 8)); // un despiste de 1–2 letras es «casi», incluso en frases cortas
    const nota = Math.round(80 * Math.max(0, 1 - dist / Math.max(nE.length, nC.length))) / 100;
    const cambiadas = diferencias.filter(d => d.esperada && d.escrita);
    const faltan = diferencias.filter(d => d.esperada && !d.escrita);
    const sobran = diferencias.filter(d => !d.esperada && d.escrita);
    if (dist <= umbral) {
      const partes = [];
      if (cambiadas.length) partes.push('revisa ' + lista(cambiadas.map(d => comillas(d.escrita))));
      if (faltan.length) partes.push(faltan.length > 1 ? 'faltan palabras' : 'falta una palabra');
      if (sobran.length) partes.push('quita ' + lista(sobran.map(d => comillas(d.escrita))));
      return { ok: false, casi: true, nota, diferencias, mensaje: 'Casi: ' + (partes.length ? partes.join(' y ') : 'revisa la frase') + '.' };
    }
    let mensaje = 'No es la frase. Inténtalo otra vez.';
    if (faltan.length && !cambiadas.length && !sobran.length) mensaje = 'Faltan palabras.';
    else if (sobran.length && !cambiadas.length && !faltan.length) mensaje = 'Hay demasiadas palabras.';
    return { ok: false, casi: false, nota, diferencias, mensaje };
  }

  /** «Lucía tiene sed.» → «L____ t____ s__.» (primera letra de cada palabra; signos y mayúsculas se conservan). */
  function pista(correcta) {
    let out = '', dentro = false;
    for (const ch of texto(correcta)) {
      if (/\p{L}/u.test(ch)) { out += dentro ? '_' : ch; dentro = true; }
      else { out += ch; dentro = false; }
    }
    return out;
  }

  /** Hash FNV-1a de 32 bits (orden determinista de las opciones). */
  function hash(s) {
    let h = 0x811c9dc5;
    for (let k = 0; k < s.length; k++) { h ^= s.charCodeAt(k); h = Math.imul(h, 0x01000193); }
    return h >>> 0;
  }

  /* ---------- opciones (A1: elegir entre 3) ----------
     Las dos alternativas falsas son frases del motor para esa misma viñeta, por orden de preferencia:
       1 'personajes' misma escena con otro personaje u otra pareja del nivel (mismo estado previo)
       2 'escena'     otra escena del nivel con los mismos personajes (mismo estado previo)
       3 'estado'     mismo panel con otro estado previo (desde el inicio del nivel, sin una viñeta anterior, estados ficticios)
       4 'historia'   frases de otras viñetas de la misma historia (solo si faltan alternativas)
       5 'recurso'    la escena simulada con cada personaje en un nivel ficticio de 1 viñeta (último recurso)
     Se prefieren las de la misma escena y de longitud parecida; el orden final sale de hash(nivel.id, i, correcta). */
  const ESCENA = {};
  for (const e of C.ESCENAS) ESCENA[e.id] = e;
  const HUMANOS = C.PERSONAJES.filter(p => !p.animal).map(p => p.id);
  const ORIGEN = { 1: 'personajes', 2: 'escena', 3: 'estado', 4: 'historia', 5: 'recurso' };
  const TODO = ['mapa', 'cuerda', 'manta', 'linterna', 'comida'];
  /* Estados previos ficticios para variar la frase del mismo panel (como en test/frases.js). */
  const PREVIOS = [
    { hambre: true, sed: true, frio: true, miedo: true, cansado: true },
    { hambre: true }, { sed: true }, { frio: true }, { miedo: true }, { cansado: true }, { perdido: true }, { herido: true },
    { objetos: TODO }, { objetos: ['comida'], hambre: true }, { objetos: ['linterna'], miedo: true }, { objetos: ['mapa'] }, { objetos: ['cuerda'] }, { objetos: ['manta'], frio: true }
  ];
  const slotsDe = esc => (ESCENA[esc] ? ESCENA[esc].slots : 2);
  const fraseDe = (res, k) => (res.viñetas[k] && res.viñetas[k].frases.join(' ')) || '';

  /** Grupos posibles de personajes: solos y, si caben, parejas. */
  function grupos(ids, max) {
    const out = ids.map(a => [a]);
    if (max >= 2) for (let a = 0; a < ids.length; a++) for (let b = a + 1; b < ids.length; b++) out.push([ids[a], ids[b]]);
    return out;
  }

  function opciones(nivel, viñetas, i, res, opts) {
    opts = opts || {};
    const tiempo = opts.tiempo === 'pret' ? 'pret' : 'pres';
    viñetas = viñetas || [];
    res = res || E.simular(nivel, viñetas, { tiempo });
    const correcta = fraseDe(res, i);
    if (!correcta) return { correcta: '', opciones: [], indice: -1, origen: [], recurso: false }; // viñeta vacía o historia ya inválida
    const panel = viñetas[i] || {}, esc = panel.escena;
    const ids = E.ordenar([...new Set(panel.personajes || [])]);
    const nC = normalizar(correcta);
    const cands = new Map(); // frase normalizada → { texto, escena, tier }
    const sim = (niv, vs, k) => fraseDe(E.simular(niv, vs, { tiempo }), k);
    const añade = (t, escena, tier) => {
      const n = normalizar(t);
      if (!n || n === nC) return;
      const prev = cands.get(n);
      if (!prev || tier < prev.tier) cands.set(n, { texto: t, escena, tier });
    };
    const previas = viñetas.slice(0, i);
    const con = p => previas.concat([p]);

    // 1. misma escena, otros personajes del nivel
    const todos = E.ordenar(nivel.personajes);
    for (const g of grupos(todos, slotsDe(esc))) if (g.join() !== ids.join()) añade(sim(nivel, con({ escena: esc, personajes: g }), i), esc, 1);
    // 2. otra escena del nivel, mismos personajes
    for (const e of nivel.escenas) if (e !== esc && slotsDe(e) >= ids.length) añade(sim(nivel, con({ escena: e, personajes: ids }), i), e, 2);
    // 3. mismo panel, otro estado previo
    if (i > 0) {
      añade(sim(nivel, [panel], 0), esc, 3); // desde el estado inicial del nivel
      for (let j = 0; j < i; j++) añade(sim(nivel, previas.filter((_, k) => k !== j).concat([panel]), i - 1), esc, 3); // sin una viñeta anterior
    }
    const ficticio = inicial => ({ id: (nivel.id || '') + '~', viñetas: 1, escenas: [esc], personajes: ids, inicial });
    const simF = inicial => añade(sim(ficticio(inicial), [{ escena: esc, personajes: ids }], 0), esc, 3);
    for (const pre of PREVIOS) {
      const ini = {};
      for (const id of ids) ini[id] = pre;
      simF(ini);
      if (ids.length === 2) { simF({ [ids[0]]: pre, [ids[1]]: {} }); simF({ [ids[0]]: {}, [ids[1]]: pre }); }
    }
    if (ids.length === 2) {
      const [x, y] = ids;
      simF({ [x]: { objetos: ['comida'], amigos: { [y]: true } }, [y]: { hambre: true, amigos: { [x]: true } } });
      simF({ [y]: { objetos: ['comida'], amigos: { [x]: true } }, [x]: { hambre: true, amigos: { [y]: true } } });
      simF({ [x]: { objetos: ['comida'] }, [y]: { hambre: true, enfadado: { [x]: true } } });
      simF({ [x]: { hambre: true, enfadado: { [y]: true } }, [y]: {} });
      simF({ [x]: { perdido: true }, [y]: { perdido: true } });
    }
    // 4. frases de otras viñetas de la misma historia
    if (cands.size < 2) for (let k = 0; k < res.viñetas.length; k++) if (k !== i) añade(fraseDe(res, k), viñetas[k] && viñetas[k].escena, 4);
    // 5. último recurso: la escena con cada personaje (del nivel; después, todos) en un nivel ficticio de 1 viñeta
    if (cands.size < 2) {
      for (const lote of [todos, HUMANOS]) {
        const niv = { id: (nivel.id || '') + '~r', viñetas: 1, escenas: [esc], personajes: lote };
        for (const g of grupos(lote, slotsDe(esc))) añade(sim(niv, [{ escena: esc, personajes: g }], 0), esc, 5);
        if (cands.size >= 2) break;
      }
    }
    if (cands.size < 2) { // (no debería ocurrir) cualquier escena con cualquier personaje
      const niv = { id: (nivel.id || '') + '~r', viñetas: 1, escenas: C.ESCENAS.map(e => e.id), personajes: HUMANOS };
      for (const e of niv.escenas) for (const id of HUMANOS) añade(sim(niv, [{ escena: e, personajes: [id] }], 0), e, 5);
    }

    // las 2 mejores: misma escena, longitud parecida, origen más fiel; desempate por hash del texto
    const orden = [...cands.values()].map(c => Object.assign(c, { puntos: Math.abs(c.texto.length - correcta.length) + (c.escena === esc ? 0 : 60) + c.tier * 3, h: hash(c.texto) }));
    orden.sort((a, b) => a.puntos - b.puntos || a.h - b.h || (a.texto < b.texto ? -1 : 1));
    const dos = orden.slice(0, 2);
    const h = hash((nivel.id || '') + '|' + i + '|' + correcta);
    const indice = h % 3;
    const falsas = (h >>> 2) & 1 ? dos.slice().reverse() : dos;
    const out = falsas.map(c => c.texto), origen = falsas.map(c => ORIGEN[c.tier]);
    out.splice(indice, 0, correcta); origen.splice(indice, 0, 'correcta');
    return { correcta, opciones: out, indice, origen, recurso: falsas.some(c => c.tier === 5) };
  }

  return { normalizar, comparar, opciones, pista, distancia, palabras, alinear, hash };
});
