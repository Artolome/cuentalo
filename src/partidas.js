/* Cuéntalo — borradores locales de cada nivel. Sin DOM; entradas de almacenamiento no fiables. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./contenido.js'));
  else root.SVPartidas = factory(root.SVContenido);
})(typeof self !== 'undefined' ? self : this, function (C) {
  'use strict';
  const KEY = 'cuentalo.partidas.v1';
  const escenas = new Map(C.ESCENAS.map(e => [e.id, e]));
  const objeto = v => !!v && typeof v === 'object' && !Array.isArray(v);
  const entero = v => Number.isInteger(v) && v >= 0 && v <= 100000 ? v : 0;
  const texto = (v, max) => typeof v === 'string' ? v.slice(0, max) : '';
  function limpiarViñetas(nivel, valor) {
    const vs = Array.isArray(valor) ? valor : [];
    return Array.from({ length: nivel.viñetas }, (_, i) => {
      const v = objeto(vs[i]) ? vs[i] : {};
      const escena = nivel.escenas.includes(v.escena) && escenas.has(v.escena) ? v.escena : null;
      const personajes = escena && Array.isArray(v.personajes)
        ? [...new Set(v.personajes.filter(p => nivel.personajes.includes(p)))].slice(0, escenas.get(escena).slots) : [];
      return { escena, personajes };
    });
  }
  function limpiarEscritor(valor) {
    const v = objeto(valor) ? valor : {}, estados = {};
    for (let i = 0; i < 6; i++) {
      const s = objeto(v.estados) && v.estados[i];
      if (!objeto(s) || typeof s.firma !== 'string') continue;
      estados[i] = { firma: texto(s.firma, 3000), malas: Array.isArray(s.malas) ? [...new Set(s.malas.filter(n => Number.isInteger(n) && n >= 0 && n < 3))] : [],
        intentos: entero(s.intentos), hecho: s.hecho === true, revelada: s.revelada === true, escrito: texto(s.escrito, 3000) };
    }
    return { tiempo: v.tiempo === 'pret' ? 'pret' : 'pres', modo: v.modo === 'escribir' ? 'escribir' : 'elegir', estados };
  }
  function limpiar(nivel, valor) {
    const v = objeto(valor) ? valor : {}, viñetas = limpiarViñetas(nivel, v.viñetas);
    const firma = JSON.stringify(viñetas);
    return { viñetas, intentos: entero(v.intentos), pistaIdx: entero(v.pistaIdx),
      ultimoFallo: v.ultimoFallo === firma ? firma : '',
      celebrada: v.celebrada === nivel.id + '|' + firma ? v.celebrada : '',
      escritor: limpiarEscritor(v.escritor),
      relato: Array.from({ length: 3 }, (_, i) => texto(Array.isArray(v.relato) ? v.relato[i] : '', 500)) };
  }
  function crear(storage) {
    let datos = Object.create(null);
    try {
      const raw = JSON.parse(storage.getItem(KEY) || 'null');
      if (objeto(raw) && raw.version === 1 && objeto(raw.partidas)) {
        for (const [id, valor] of Object.entries(raw.partidas)) {
          if (id !== '__proto__' && id !== 'constructor' && id !== 'prototype' && objeto(valor)) datos[id] = valor;
        }
      }
    } catch (_) { /* almacenamiento denegado o JSON dañado: una partida nueva sigue funcionando */ }
    function escribir() {
      try { storage.setItem(KEY, JSON.stringify({ version: 1, partidas: datos })); return true; }
      catch (_) { return false; } // los cambios siguen disponibles en memoria durante esta sesión
    }
    return {
      leer(nivel) { return limpiar(nivel, datos[nivel.id]); },
      guardar(nivel, valor) {
        if (nivel.enConstruccion || ['__proto__', 'constructor', 'prototype'].includes(nivel.id)) return false;
        datos[nivel.id] = limpiar(nivel, valor); return escribir();
      },
      borrarTodo() { datos = Object.create(null); try { storage.removeItem(KEY); return true; } catch (_) { return escribir(); } }
    };
  }
  return { KEY, crear, limpiar, limpiarViñetas, limpiarEscritor };
});
