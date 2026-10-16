#!/usr/bin/env node
/* node test/cultura.js — historias culturales, memoria del resolvedor y compatibilidad Autor. */
const assert = require('node:assert/strict');
const C = require('../src/contenido.js');
const E = require('../src/engine.js');
const A = require('../src/autor.js');
const X = require('../src/escritor.js');
const P = require('../src/partidas.js');

const niveles = C.NIVELES.filter(n => n.capitulo === 4 || n.capitulo === 5);
const panel = (escena, ...personajes) => ({ escena, personajes });
const historias = {
  c4n1: [panel('sant_jordi', 'lucia'), panel('centro_cultural', 'mateo'), panel('sant_jordi', 'lucia', 'mateo')],
  c4n2: [panel('alhambra', 'diego'), panel('centro_cultural', 'valeria'), panel('alhambra', 'valeria', 'diego')],
  c4n3: [panel('ofrenda', 'lucia'), panel('taller_cultural', 'lucia', 'diego'), panel('ofrenda', 'lucia', 'diego')],
  c4n4: [panel('plaza_cultural', 'valeria'), panel('mercado_cusco', 'mateo'), panel('mercado_cusco', 'mateo', 'valeria')],
  c4n5: [panel('tango', 'valeria', 'diego'), panel('centro_cultural', 'valeria', 'diego'), panel('tango', 'valeria', 'diego')],
  c4n6: [panel('taller_cultural', 'lucia', 'mateo'), panel('barriletes', 'lucia', 'mateo'), panel('barriletes', 'lucia', 'mateo')],
  c5n1: [panel('don_quijote', 'lucia'), panel('centro_cultural', 'mateo'), panel('don_quijote', 'lucia', 'mateo')],
  c5n2: [panel('macondo', 'diego'), panel('taller_cultural', 'valeria'), panel('macondo', 'valeria', 'diego')],
  c5n3: [panel('biblioteca_borges', 'mateo'), panel('centro_cultural', 'diego'), panel('biblioteca_borges', 'mateo', 'diego')],
  c5n4: [panel('casa_azul', 'lucia'), panel('taller_cultural', 'lucia'), panel('casa_azul', 'lucia', 'valeria')]
};
const totales = [23, 3, 4, 4, 1, 1, 4, 4, 2, 4];
const nuevosIds = ['sant_jordi', 'alhambra', 'ofrenda', 'mercado_cusco', 'tango', 'barriletes', 'plaza_cultural',
  'taller_cultural', 'centro_cultural', 'don_quijote', 'macondo', 'biblioteca_borges', 'casa_azul'];
assert.equal(niveles.length, 10);
assert.deepEqual(C.ESCENAS.slice(17).map(e => e.id), nuevosIds, 'los índices nuevos se añaden al final');
assert.ok(C.ESCENAS.length <= 32 && A.EVENTOS.length <= 64, 'límites del código Autor v1');
assert.equal(new Set(A.EVENTOS).size, A.EVENTOS.length);

function contarBruto(nivel) {
  const opciones = E.opcionesDe(nivel);
  let total = 0;
  function visitar(historia) {
    if (historia.length === nivel.viñetas) { if (E.simular(nivel, historia).resuelto) total++; return; }
    for (const opcion of opciones) visitar([...historia, opcion]);
  }
  visitar([]);
  return total;
}
const datos = new Map();
const storage = { getItem: k => datos.get(k) || null, setItem: (k, v) => datos.set(k, v), removeItem: k => datos.delete(k) };
for (const [k, nivel] of niveles.entries()) {
  const historia = historias[nivel.id], res = E.simular(nivel, historia);
  assert.equal(res.resuelto, true, nivel.id + ': secuencia pedagógica');
  assert.equal(nivel.titulo, E.tituloDe(nivel.objetivo, nivel));
  assert.equal(res.eventos.filter(e => e.tipo === nivel.objetivo.evento).length, 1, 'la acción final ocurre una vez');
  const sol = E.resolver(nivel, { max: 100 });
  assert.equal(sol.desbordado, false);
  assert.equal(sol.total, totales[k]);
  assert.equal(sol.total, contarBruto(nivel), nivel.id + ': la memoización conserva la memoria cultural');
  assert.ok(sol.densidad > 0 && sol.densidad < 0.1, nivel.id + ': dificultad');
  if (nivel.secreto) assert.ok(sol.secretas > 0 && sol.ambas < sol.total, 'secreto no automático');
  const invertida = [...historia].reverse();
  // El tango es A-B-A: repetir sin descanso es la variante incorrecta relevante.
  const mala = nivel.id === 'c4n5' ? [historia[0], historia[0], historia[2]] : invertida;
  assert.equal(E.simular(nivel, mala).resuelto, false, nivel.id + ': el orden tiene consecuencias');
  const solo = historia.map((v, i) => i === 2 ? { ...v, personajes: v.personajes.slice(0, 1) } : v);
  assert.equal(E.simular(nivel, solo).resuelto, false, nivel.id + ': hace falta cooperar');
  assert.ok(E.simular(nivel, mala).porque.length > 0, 'explicación de la acción pendiente');

  // Cada historia se comparte tanto con su objetivo puntual como grabada por el Autor.
  const decodificado = A.decodificar(A.codificar(nivel));
  assert.deepEqual(decodificado.objetivo, nivel.objetivo);
  assert.deepEqual(decodificado.escenas, nivel.escenas);
  assert.equal(E.simular(decodificado, historia).resuelto, true);
  const grabado = A.grabar({ ...nivel, titulo: 'Mi aventura cultural', objetivo: null }, historia);
  const copia = A.decodificar(A.codificar(grabado));
  assert.deepEqual(copia.objetivo, JSON.parse(JSON.stringify(grabado.objetivo)), nivel.id + ': eventos culturales grabados');
  assert.ok(copia.objetivo.eventos.some(e => e.tipo === nivel.objetivo.evento));
  assert.equal(E.simular(copia, historia).resuelto, true);
  assert.equal(E.simular(copia, mala).resuelto, false);
  const opcionesAutor = A.asistenteTitulos(nivel.personajes, nivel.escenas);
  assert.ok(opcionesAutor.some(o => o.titulo === nivel.titulo), nivel.id + ': título disponible en Autor');

  for (const tiempo of ['pres', 'pret']) {
    const narracion = E.simular(nivel, historia, { tiempo });
    for (let i = 0; i < nivel.viñetas; i++) {
      const frase = narracion.viñetas[i].frases.join(' ');
      assert.ok(frase && !/undefined|\[object Object\]|…/.test(frase), nivel.id + ': frase completa');
      const opciones = X.opciones(nivel, historia, i, narracion, { tiempo });
      assert.equal(opciones.correcta, frase);
      assert.equal(opciones.opciones.length, 3);
      assert.equal(new Set(opciones.opciones.map(X.normalizar)).size, 3);
      assert.equal(opciones.opciones[opciones.indice], frase);
      assert.ok(X.comparar(frase, opciones.correcta).ok);
    }
  }
  assert.match(nivel.cultura.fuente, /^https:\/\//, 'fuente cultural primaria');
  const lexico = E.lexicoDe(nivel).map(x => x.palabra);
  for (const palabra of nivel.cultura.palabras) assert.ok(lexico.includes(palabra));
  assert.equal(new Set(lexico).size, lexico.length);
  const partida = { viñetas: historia, intentos: 2, pistaIdx: 1, relato: ['Primero...', 'Después...', 'Al final...'],
    escritor: { tiempo: 'pret', modo: 'escribir', estados: { 0: { firma: 'frase cultural', escrito: 'Mi frase', hecho: true } } } };
  assert.ok(P.crear(storage).guardar(nivel, partida));
  const reanudada = P.crear(storage).leer(nivel);
  assert.deepEqual(reanudada.viñetas, historia, nivel.id + ': reanudación de las nuevas escenas');
  assert.deepEqual(reanudada.relato, partida.relato);
  assert.equal(reanudada.escritor.estados[0].escrito, 'Mi frase');
  assert.equal(E.simular(nivel, reanudada.viñetas).resuelto, true, 'la memoria se reconstruye al recargar');
  console.log(`  ${nivel.id}: ${sol.total} soluciones, ${(100 * sol.densidad).toFixed(2)} %, presente/pasado, Autor y reanudación`);
}

// Acuerdos y pretéritos irregulares de acciones que no aparecen en la batería clásica.
const frases = (e, t = 'pret') => E.frasesDe(e, t).join(' ');
assert.match(frases({ tipo: 'eligeLibro', quien: 'lucia' }), /Lucía eligió/);
assert.match(frases({ tipo: 'comparteLibro', quien: 'lucia', a: 'valeria' }), /leyeron juntas/);
assert.match(frases({ tipo: 'construyeBarrilete', quienes: ['lucia', 'valeria'] }), /construyeron/);
assert.match(frases({ tipo: 'exponeBarrilete', quienes: ['lucia', 'valeria'] }), /expusieron/);
assert.match(frases({ tipo: 'visitaPatios', quien: 'diego', a: 'valeria' }), /Valeria ya no estaba perdida/);
assert.match(frases({ tipo: 'ensayaTango', quienes: ['lucia', 'valeria'] }), /estaban cansadas/);
assert.match(frases({ tipo: 'bailaTango', quienes: ['lucia', 'valeria'] }), /bailaron el tango juntas/);
assert.match(frases({ tipo: 'reconoceMolinos', quien: 'mateo', a: 'lucia' }), /Lucía reconoció/);
assert.match(frases({ tipo: 'etiquetaRecuerdos', quien: 'valeria', a: 'diego' }), /Valeria ayudó/);
assert.match(frases({ tipo: 'saleLaberinto', quien: 'diego', a: 'mateo' }), /Diego guio/);
assert.match(frases({ tipo: 'pintaAutorretrato', quien: 'lucia', a: 'valeria' }), /pintó un autorretrato/);
assert.doesNotMatch(frases({ tipo: 'visitaCentro', quienes: ['valeria'], cansados: [] }), /ya no|cansad/);
assert.match(frases({ tipo: 'visitaCentro', quienes: ['lucia', 'valeria'], cansados: ['valeria'] }), /Valeria ya no estaba cansada/);
const almuerzo = E.simular(niveles.find(n => n.id === 'c4n4'), historias.c4n4).viñetas[2].frases.join(' ');
assert.match(almuerzo, /Valeria ya no tiene hambre/);
assert.doesNotMatch(almuerzo, /Mateo y Valeria ya no/);
const combinado = E.lexicoDe({ escenas: ['sant_jordi'], cultura: { palabras: ['libro', { palabra: 'libro', picto: '📖' }, 'arte'] } });
assert.equal(combinado.filter(x => x.palabra === 'libro').length, 1);
assert.equal(combinado.find(x => x.palabra === 'libro').picto, '📖');
assert.ok(combinado.some(x => x.palabra === 'arte'));

// Un nivel importado puede contener metadatos culturales mal tipados.
const lexicoBase = E.lexicoDe({ escenas: ['sant_jordi'] });
for (const cultura of [undefined, null, false, 12, 'libro', []]) {
  assert.deepEqual(E.lexicoDe({ escenas: ['sant_jordi'], cultura }), lexicoBase, 'cultura ausente o no objeto');
}
for (const palabras of [undefined, null, 'libro', 12, true, { palabra: 'libro' }]) {
  assert.deepEqual(E.lexicoDe({ escenas: ['sant_jordi'], cultura: { palabras } }), lexicoBase, 'palabras debe ser un array');
}
assert.deepEqual(E.lexicoDe({ escenas: [], cultura: { palabras: [null, false, 12, [], {}, { palabra: null }, { palabra: [] }, '', '   '] } }), [], 'entradas inválidas se ignoran');
assert.deepEqual(E.lexicoDe({ escenas: [], cultura: { palabras: [' arte ', 'arte', { palabra: ' arte ', picto: ' 🎨 ' },
  { palabra: 'arte', picto: {} }, { palabra: 'papel', picto: false }] } }),
  [{ palabra: 'arte', picto: '🎨' }, { palabra: 'papel', picto: E.lexicoDe({ escenas: ['taller_cultural'] }).find(x => x.palabra === 'papel').picto }],
  'trim, dédoublonnage et pictogrammes toujours textuels');

// Codes publiés avant les chapitres culturels : indices, titres et objets v1 inchangés.
const anciens = {
  c1n1: 'S180-8850-21Z', c1n2: 'S184-4502-2E', c1n3: 'S188-8HX4-ABG6', c1n4: 'S18C-818W-26Y', c1n5: 'S180-81E0-07GV',
  c2n1: 'S190-H021-182R-B', c2n2: 'S199-GK4H-B2AJ', c2n3: 'S190-H03J-2840-503', c2n4: 'S199-H21J-J8CS-2GC', c2n5: 'S198-H05R-28M1-54Y2',
  c3n1: 'S1D0-HP04-21AP-AT', c3n2: 'S1D0-HP54-0J20-8', c3n3: 'S1D1-HP54-4HBA-RX', c3n4: 'S1D9-HJ2Q-R28M-Q0KR-Z',
  c3n5: 'S1J0-P80A-8Q09-2G6G-KRC', c3n6: 'S1P0-MA02-8EK0-S18J-F240-8G12-0R'
};
for (const [id, code] of Object.entries(anciens)) {
  const niveau = C.NIVELES.find(n => n.id === id);
  assert.equal(A.codificar(niveau), code, id + ': code existant stable');
  assert.equal(A.codificar(A.decodificar(code)), code);
}
console.log('✔ Culturas: 10 énigmes, recherche exhaustive, ordre/coopération, langue, Auteur v1, écrivain et sauvegarde.');
