#!/usr/bin/env node
/* Reanudación y datos dañados, sin navegador ni dependencias. node test/partidas.js */
const assert = require('node:assert/strict');
const P = require('../src/partidas.js');
const C = require('../src/contenido.js');
const n = C.NIVELES.find(n => n.id === 'c1n1'), otro = C.NIVELES.find(n => n.id === 'c1n2');
function memoria(inicial) {
  const datos = new Map(Object.entries(inicial || {}));
  return { getItem: k => datos.get(k) || null, setItem: (k, v) => datos.set(k, v), removeItem: k => datos.delete(k) };
}
const storage = memoria({ 'cuentalo.progreso.v0': JSON.stringify({ ajustes: { modo: 'solo', clave: 'mi-clave' }, c1n1: { estrellas: 2 } }) });
let cache = P.crear(storage);
const paneles = [{ escena: 'sol', personajes: ['lucia'] }, { escena: 'rio', personajes: ['lucia'] }, { escena: 'fuego', personajes: ['lucia'] }];
const firma = JSON.stringify(paneles);
const partida = { viñetas: paneles, intentos: 4, pistaIdx: 2, ultimoFallo: firma, celebrada: n.id + '|' + firma,
  escritor: { tiempo: 'pres', modo: 'escribir', estados: { 0: { firma: 'Hace mucho calor. Lucía tiene sed.', escrito: 'Hace mucho calor', malas: [1], hecho: false, intentos: 1 } } },
  relato: ['Primero hace calor.', 'Después bebe agua.', 'Al final hace fuego.'] };
assert.equal(cache.guardar(n, partida), true);
cache.guardar(otro, { viñetas: [{ escena: 'rio', personajes: ['mateo'] }] });
cache = P.crear(storage); // recrear equivale a recargar la página
let leida = cache.leer(n);
assert.deepEqual(leida.viñetas, paneles);
assert.equal(leida.intentos, 4);
assert.equal(leida.pistaIdx, 2);
assert.equal(leida.celebrada, partida.celebrada);
assert.deepEqual(leida.relato, partida.relato);
assert.equal(leida.escritor.estados[0].escrito, 'Hace mucho calor');
assert.equal(cache.leer(otro).viñetas[0].personajes[0], 'mateo');
leida.viñetas[0].personajes.length = 0;
assert.equal(cache.leer(n).viñetas[0].personajes[0], 'lucia', 'leer devuelve una copia aislada');
const antes = storage.getItem('cuentalo.progreso.v0');
cache.borrarTodo();
assert.equal(storage.getItem(P.KEY), null);
assert.equal(storage.getItem('cuentalo.progreso.v0'), antes, 'el caché nunca cambia estrellas ni ajustes');
assert.deepEqual(cache.leer(n).relato, ['', '', '']);
assert.equal(P.crear(storage).leer(n).viñetas[0].escena, null);

for (const raw of ['{mal JSON', 'null', '[]', '{"version":99,"partidas":{}}']) {
  assert.doesNotThrow(() => P.crear(memoria({ [P.KEY]: raw })).leer(n));
}
const sucio = P.limpiar(n, { viñetas: [
  { escena: 'inexistente', personajes: ['lucia'] },
  { escena: 'rio', personajes: ['diego', 'lucia', 'lucia', null] },
  { escena: 'fuego', personajes: 'lucia' },
  { escena: 'sol', personajes: ['lucia'] }
], intentos: -1, pistaIdx: 3.5, celebrada: 'inventada', ultimoFallo: 'inventado', relato: [null, '<b>texto</b>', 'a'.repeat(600)],
  escritor: { estados: { 0: { firma: 'frase', malas: [-1, 1, 1, 9], hecho: 'sí', escrito: 99 }, 7: { firma: 'fuera' } } } });
assert.deepEqual(sucio.viñetas, [{ escena: null, personajes: [] }, { escena: 'rio', personajes: ['lucia'] }, { escena: 'fuego', personajes: [] }]);
assert.equal(sucio.intentos, 0); assert.equal(sucio.pistaIdx, 0);
assert.equal(sucio.celebrada, ''); assert.equal(sucio.ultimoFallo, '');
assert.equal(sucio.relato[2].length, 500); assert.equal(sucio.relato[1], '<b>texto</b>');
assert.deepEqual(sucio.escritor.estados[0].malas, [1]);
assert.equal(sucio.escritor.estados[0].hecho, false);
assert.equal(sucio.escritor.estados[7], undefined);
const uno = { id: 'prueba', viñetas: 1, escenas: ['mapa'], personajes: ['lucia', 'mateo'] };
assert.deepEqual(P.limpiarViñetas(uno, [{ escena: 'mapa', personajes: ['mateo', 'lucia'] }])[0].personajes, ['mateo']);
const bloqueado = P.crear({ getItem() { throw Error('denegado'); }, setItem() { throw Error('cuota'); }, removeItem() { throw Error('denegado'); } });
assert.equal(bloqueado.guardar(n, partida), false);
assert.deepEqual(bloqueado.leer(n).viñetas, paneles, 'sin almacenamiento se conserva el trabajo al cambiar de nivel durante la sesión');
bloqueado.borrarTodo();
assert.equal(bloqueado.leer(n).viñetas[0].escena, null);
assert.equal(cache.guardar({ ...n, enConstruccion: true }, partida), false, 'un ensayo Autor no sustituye una partida');
console.log('✔ Partidas: reanudación por nivel, escritor, relatos, borrado, datos dañados y almacenamiento denegado.');
