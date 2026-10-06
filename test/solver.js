#!/usr/bin/env node
/* node test/solver.js [--all] [--max N] [nivelId]
   Comprueba que cada nivel tiene al menos una solución, lista las soluciones y señala los niveles
   demasiado fáciles o imposibles.
   Criterios (ver docs/DECISIONS.md):
     · imposible → error (código de salida 1)
     · capítulo 1 (1 personaje): aviso si > 8 soluciones
     · capítulos 2-3 (2-3 personajes): el recuento bruto crece con las viñetas «de relleno»;
       se mide la DENSIDAD = soluciones / historias posibles. Aviso si densidad > 10 %.
     · título secreto imposible → error. */
const E = require('../src/engine.js');
const C = require('../src/contenido.js');
const args = process.argv.slice(2);
const todas = args.includes('--all');
const maxIdx = args.indexOf('--max');
const MAX = maxIdx >= 0 ? +args[maxIdx + 1] : (todas ? 500 : 12);
const soloId = args.find(a => /^(c\d|libre)/.test(a));

let fallos = 0, avisos = 0, n = 0;
const t0 = Date.now();
for (const nivel of C.NIVELES) {
  if (nivel.libre) continue;
  if (soloId && nivel.id !== soloId) continue;
  n++;
  const t = Date.now();
  const r = E.resolver(nivel, { max: MAX });
  const ms = Date.now() - t;
  const titulo = E.tituloDe(nivel.objetivo, nivel);
  const pct = (100 * r.densidad).toFixed(2) + ' %';
  let marca = '✓';
  if (r.desbordado) { marca = '✗ DESBORDADO (nivel demasiado grande para el resolvedor exacto)'; fallos++; }
  else if (r.total === 0) { marca = '✗ IMPOSIBLE'; fallos++; }
  else if (nivel.capitulo === 1 && r.total > 8) { marca = '⚠ demasiado fácil (> 8 soluciones)'; avisos++; }
  else if (nivel.capitulo > 1 && r.densidad > 0.10) { marca = '⚠ demasiado fácil (densidad > 10 %)'; avisos++; }
  console.log(`\n[${nivel.id}] cap ${nivel.capitulo} · ${nivel.viñetas} viñetas · ${nivel.escenas.length} escenas · ${nivel.personajes.length} personajes · ${r.opciones} opciones/viñeta · ${r.posibles.toLocaleString('es')} historias posibles`);
  console.log(`  título: «${nivel.titulo}»${titulo !== nivel.titulo ? `   (generado: «${titulo}»)` : ''}`);
  console.log(`  ${marca} — ${r.total.toLocaleString('es')} solución(es) · densidad ${pct} · ${r.estados.toLocaleString('es')} estados · ${ms} ms`);
  if (nivel.secreto) {
    const ts = E.tituloDe(nivel.secreto, nivel);
    if (r.secretas === 0) { console.log(`  ✗ título secreto imposible: «${ts}»`); fallos++; }
    else console.log(`  secreto: «${ts}» — ${r.secretas.toLocaleString('es')} historias, ${r.ambas.toLocaleString('es')} cumplen los dos títulos`);
  }
  const lista = r.soluciones.slice(0, todas ? r.soluciones.length : 6);
  for (const s of lista) console.log('    · ' + E.textoSolucion(s));
  if (r.total > lista.length) console.log(`    … (${lista.length} listadas de ${r.total.toLocaleString('es')}; usa --all para ver hasta ${MAX})`);
}
console.log(`\n${n} niveles · ${fallos} con error · ${avisos} avisos · ${Date.now() - t0} ms`);
process.exit(fallos ? 1 : 0);
