#!/usr/bin/env node
/* node test/frases.js → docs/frases.txt
   Exporta TODAS las frases que el motor puede generar, para relectura lingüística:
   cada tipo de evento × cada combinación de género/número × presente y pretérito,
   más los títulos de todos los niveles, los títulos generables (tituloDe) y los resúmenes (describir). */
const fs = require('fs');
const path = require('path');
const E = require('../src/engine.js');
const C = require('../src/contenido.js');

const out = [];
const seen = new Set();
const add = (seccion, frase) => { const k = seccion + '|' + frase; if (!seen.has(k)) { seen.add(k); out.push([seccion, frase]); } };

// Personajes de prueba: f sola, m solo, f+f, m+m, f+m
const F = 'lucia', M = 'mateo', F2 = 'valeria', M2 = 'diego';
const grupos = [[F], [M], [F, F2], [M, M2], [F, M]];
const todos = [F, M, F2, M2];

// 1. Viñetas: cada escena × grupo × estados previos relevantes → frases del motor
const previos = [
  {},
  { hambre: true, sed: true, frio: true, miedo: true, cansado: true },
  { perdido: true },
  { herido: true },
  { objetos: ['mapa', 'cuerda', 'manta', 'linterna', 'comida'] },
  { objetos: ['comida'], hambre: true }
];
for (const tiempo of ['pres', 'pret']) {
  for (const esc of C.ESCENAS) {
    for (const g of grupos) {
      if (g.length > esc.slots) continue;
      for (const pre of previos) {
        for (const variante of ['ambos', 'primero', 'amigos', 'enfadado', 'unoPerdido']) {
          const nivel = { id: 't', viñetas: 1, escenas: [esc.id], personajes: todos, inicial: {} };
          for (const id of todos) nivel.inicial[id] = {};
          const ids = variante === 'primero' ? [g[0]] : g;
          for (const id of ids) nivel.inicial[id] = Object.assign({}, pre);
          if (variante === 'unoPerdido' && g.length === 2) { nivel.inicial[g[0]] = { perdido: true }; nivel.inicial[g[1]] = {}; }
          if (variante === 'amigos' && g.length === 2) { nivel.inicial[g[0]] = Object.assign({}, pre, { amigos: { [g[1]]: true } }); nivel.inicial[g[1]] = { hambre: true, amigos: { [g[0]]: true } }; }
          if (variante === 'enfadado' && g.length === 2) { nivel.inicial[g[0]] = Object.assign({}, pre); nivel.inicial[g[1]] = { hambre: true, enfadado: { [g[0]]: true } }; }
          const res = E.simular(nivel, [{ escena: esc.id, personajes: g }], { tiempo });
          for (const v of res.viñetas) for (const e of v.eventos) add(`${tiempo === 'pres' ? 'PRESENTE' : 'PRETÉRITO'} · ${esc.nombre} · evento ${e.tipo}`, v.frases.join(' '));
        }
      }
    }
  }
  // «ya a salvo» (incoherencia)
  const nivel = { id: 't', viñetas: 2, escenas: ['rescate', 'selva'], personajes: [F] };
  const res = E.simular(nivel, [{ escena: 'rescate', personajes: [F] }, { escena: 'selva', personajes: [F] }], { tiempo });
  add(`${tiempo === 'pres' ? 'PRESENTE' : 'PRETÉRITO'} · incoherencia`, res.viñetas[1].frases.join(' '));
}

// 2. Títulos de los niveles (explícitos y generados) + secretos + pistas
for (const n of C.NIVELES) {
  if (n.libre) continue;
  add('TÍTULOS · niveles', `${n.titulo}   [${n.id}]`);
  const g = E.tituloDe(n.objetivo, n);
  if (g !== n.titulo) add('TÍTULOS · generados por tituloDe (difieren del explícito)', `${g}   [${n.id}]`);
  if (n.secreto) add('TÍTULOS · secretos', `${E.tituloDe(n.secreto, n)}   [${n.id}]`);
  for (const p of n.pistas || []) add('PISTAS', `${p}   [${n.id}]`);
}
// 3. Títulos generables (asistente del modo Autor): cada tipo × estado × género
const nivelAutor = { personajes: todos };
for (const est of C.ESTADOS) {
  for (const q of [F, M]) {
    add('TÍTULOS · asistente (estado)', E.tituloDe({ tipo: 'estado', quien: q, estado: est.id, valor: true }, nivelAutor));
    add('TÍTULOS · asistente (estado negado)', E.tituloDe({ tipo: 'estado', quien: q, estado: est.id, valor: false }, nivelAutor));
    if (!est.derivado && est.id !== 'salvo') add('TÍTULOS · asistente (ya no)', E.tituloDe({ tipo: 'yaNo', quien: q, estado: est.id }, nivelAutor));
    if (est.negativo) add('TÍTULOS · asistente (nunca)', E.tituloDe({ tipo: 'nunca', quien: q, estado: est.id }, nivelAutor));
  }
  add('TÍTULOS · asistente (todos)', E.tituloDe({ tipo: 'todos', estado: est.id, valor: true }, nivelAutor));
  add('TÍTULOS · asistente (todas)', E.tituloDe({ tipo: 'todos', estado: est.id, valor: true }, { personajes: [F, F2] }));
  if (est.negativo) add('TÍTULOS · asistente (nadie)', E.tituloDe({ tipo: 'nadie', estado: est.id }, nivelAutor));
  if (est.negativo) add('TÍTULOS · asistente (nadie nunca)', E.tituloDe({ tipo: 'nunca', estado: est.id }, nivelAutor));
}
for (const ev of ['encuentra', 'cura', 'comparte', 'perdon']) add('TÍTULOS · asistente (evento)', E.tituloDe({ tipo: 'evento', evento: ev, quien: F, a: M }, nivelAutor));
for (const ev of ['nocheLinterna', 'comeSolo', 'jaguarSolo']) add('TÍTULOS · asistente (evento)', E.tituloDe({ tipo: 'evento', evento: ev, quien: F }, nivelAutor));
for (const ev of ['seEncuentran', 'jaguarJuntos', 'caminanJuntos', 'nocheJuntos']) add('TÍTULOS · asistente (evento)', E.tituloDe({ tipo: 'evento', evento: ev, quien: F, a: M }, nivelAutor));
add('TÍTULOS · asistente (relación)', E.tituloDe({ tipo: 'amigos', a: F, b: M }, nivelAutor));
add('TÍTULOS · asistente (relación)', E.tituloDe({ tipo: 'enfadado', quien: F, con: M }, nivelAutor));
add('TÍTULOS · asistente (relación)', E.tituloDe({ tipo: 'enfadado', quien: M, con: F }, nivelAutor));

// 4. Resúmenes «¿Qué pasa?» (describir): combinaciones de estados
const S = E.estadoInicial({ personajes: todos });
const combos = [
  {}, { hambre: true }, { sed: true, frio: true }, { hambre: true, sed: true, frio: true, miedo: true }, { cansado: true }, { herido: true }, { perdido: true },
  { cansado: true, herido: true, perdido: true }, { hambre: true, perdido: true }, { salvo: true }, { enfadado: { [M]: true } }, { miedo: true, enfadado: { [M]: true } }
];
for (const tiempo of ['pres', 'pret']) for (const c of combos) for (const q of [F, M2]) {
  const T = JSON.parse(JSON.stringify(S));
  for (const k in c) T[q][k] = c[k];
  add(`RESÚMENES · ${tiempo === 'pres' ? 'presente' : 'pretérito'}`, E.describir(q, T, tiempo));
}
// 5. Explicaciones «porque»
for (const n of C.NIVELES) {
  if (n.libre) continue;
  const res = E.simular(n, Array.from({ length: n.viñetas }, () => ({ escena: n.escenas[0], personajes: [n.personajes[0]] })));
  for (const p of res.porque) add('PORQUÉ (explicaciones)', `${p}   [${n.id}]`);
}

// Escribir
const porSeccion = new Map();
for (const [s, f] of out) { if (!porSeccion.has(s)) porSeccion.set(s, []); porSeccion.get(s).push(f); }
const lineas = [`SOBREVIVES — todas las frases generables (${out.length}) — generado por test/frases.js`, ''];
for (const [s, fs_] of porSeccion) { lineas.push(`## ${s}`); for (const f of fs_.sort((a, b) => a.localeCompare(b, 'es'))) lineas.push(f); lineas.push(''); }
const dest = path.join(__dirname, '..', 'docs', 'frases.txt');
fs.writeFileSync(dest, lineas.join('\n'), 'utf8');
console.log(`${out.length} frases → ${dest}`);
// Controles automáticos mínimos
let problemas = 0;
for (const [, f] of out) {
  if (/\s[.,]/.test(f)) { console.log('  espacio antes de puntuación: ' + f); problemas++; }
  if (/\b(tienen|están|comen|beben)\b/.test(f) && /^(Lucía|Mateo|Valeria|Diego) (tienen|están|comen|beben)/.test(f)) { console.log('  posible desacuerdo de número: ' + f); problemas++; }
  if (/¡[^!]*$/.test(f.split('. ').pop() || '') && !/!/.test(f)) { console.log('  «¡» sin «!»: ' + f); problemas++; }
  if (/\.\./.test(f)) { console.log('  doble punto: ' + f); problemas++; }
}
console.log(problemas ? `${problemas} posibles problemas` : 'controles automáticos: OK');
