#!/usr/bin/env node
/* node test/escritor.js
   Pruebas del modo escritor (src/escritor.js), sin DOM:
     · opciones(): para todos los niveles (hasta 5 soluciones de resolver), cada viñeta, presente y pretérito →
       3 frases distintas y no vacías, la correcta en opciones[indice], resultado determinista; estadísticas de origen.
     · comparar(): idéntica, sin tildes, sin signos, mayúsculas, una letra cambiada, una palabra que falta, frase distinta
       (casos fijos + las mismas transformaciones sobre todas las frases reales de las soluciones).
     · normalizar(), distancia(), pista().
   Sale con código 1 si algo falla. Debe tardar < 60 s. */
const E = require('../src/engine.js');
const C = require('../src/contenido.js');
const X = require('../src/escritor.js');

let fallos = 0, pruebas = 0;
const ok = (cond, msg) => { pruebas++; if (!cond) { fallos++; console.log('  ✗ ' + msg); } return cond; };
const igual = (a, b, msg) => ok(a === b, `${msg}: «${a}» ≠ «${b}»`);
const t0 = Date.now();

/* ---------- normalizar · distancia · pista ---------- */
console.log('normalizar / distancia / pista');
igual(X.normalizar('  ¡Lucía  tiene SED!  '), 'lucia tiene sed', 'normalizar');
igual(X.normalizar('¿Qué alegría? Año, niño; «ñu»… "sí".'), 'que alegria año niño ñu si', 'normalizar conserva la ñ y quita comillas');
igual(X.normalizar(null), '', 'normalizar(null)');
igual(X.distancia('', 'abc'), 3, 'distancia con vacía');
igual(X.distancia('casa', 'cosa'), 1, 'distancia 1');
igual(X.distancia('tiene', 'tiene'), 0, 'distancia 0');
igual(X.distancia('Lucía tiene sed', 'Lucía tiene'), 4, 'distancia una palabra');
igual(X.pista('Lucía tiene sed.'), 'L____ t____ s__.', 'pista');
igual(X.pista('¡Un jaguar! Diego tiene miedo y corre. Se pierde.'), '¡U_ j_____! D____ t____ m____ y c____. S_ p_____.', 'pista con signos');
igual(X.pista(''), '', 'pista vacía');

/* ---------- comparar: casos fijos ---------- */
console.log('comparar (casos fijos)');
const F = 'Lucía tiene sed.';
let r = X.comparar(F, F);
ok(r.ok && !r.casi && r.nota === 1 && r.diferencias.length === 0, 'idéntica: ' + JSON.stringify(r));
r = X.comparar('Lucia tiene sed.', F);
ok(r.ok && r.casi && r.mensaje === 'Casi: mira los acentos.', 'sin tildes: ' + r.mensaje);
r = X.comparar('Lucía tiene sed', F);
ok(r.ok && r.casi && /puntuación/.test(r.mensaje), 'sin punto final: ' + r.mensaje);
r = X.comparar('Un jaguar. Diego tiene miedo y corre. Se pierde.', '¡Un jaguar! Diego tiene miedo y corre. Se pierde.');
ok(r.ok && r.casi && r.mensaje === 'Casi: faltan los signos ¿ ¡ ! ?.', 'faltan ¡ !: ' + r.mensaje);
r = X.comparar('lucía tiene sed.', F);
ok(r.ok && r.casi && r.mensaje === 'Casi: mira las mayúsculas.', 'mayúsculas: ' + r.mensaje);
r = X.comparar('lucia tiene sed', F);
ok(r.ok && r.casi && r.mensaje === 'Casi: mira los acentos, la puntuación y las mayúsculas.', 'todo a la vez: ' + r.mensaje);
r = X.comparar('Lucía tiene sal.', F);
ok(!r.ok && r.casi && r.mensaje === 'Casi: revisa “sal”.' && r.diferencias.length === 1 && r.diferencias[0].esperada === 'sed' && r.diferencias[0].escrita === 'sal', 'una letra cambiada: ' + r.mensaje + ' ' + JSON.stringify(r.diferencias));
r = X.comparar('Lucía sed.', F);
ok(!r.ok && !r.casi && r.mensaje === 'Faltan palabras.' && r.diferencias.length === 1 && r.diferencias[0].esperada === 'tiene' && r.diferencias[0].escrita === '', 'palabra que falta: ' + r.mensaje + ' ' + JSON.stringify(r.diferencias));
r = X.comparar('Lucía tiene mucha sed.', F);
ok(!r.ok && !r.casi && r.mensaje === 'Sobran palabras.' && r.diferencias.length === 1 && r.diferencias[0].escrita === 'mucha', 'palabra que sobra: ' + r.mensaje);
r = X.comparar('Mateo come frutas.', F);
ok(!r.ok && !r.casi && r.mensaje === 'No es la frase. Inténtalo otra vez.' && r.nota < 0.5, 'frase distinta: ' + r.mensaje + ' nota ' + r.nota);
r = X.comparar('', F);
ok(!r.ok && !r.casi && r.nota === 0 && r.mensaje === 'Escribe la frase.', 'vacía: ' + r.mensaje);
const G = 'Lucía y Mateo caminan juntos por la selva. Tienen hambre y están cansados.';
r = X.comparar('Lucía y Mateo caminan juntos por la selva. Tienen hambre y están cansada.', G);
ok(!r.ok && r.casi && r.mensaje === 'Casi: revisa “cansada”.', 'acuerdo: ' + r.mensaje);
r = X.comparar('Lucía y Mateo caminan juntos por la selva. Tienen hambre están cansados.', G);
ok(!r.ok && r.casi && r.mensaje === 'Casi: falta una palabra.', 'falta «y» en frase larga → casi: ' + r.mensaje);
r = X.comparar('Lucía y Mateo caminan juntos por la selva y tienen hambre y están cansados.', G);
ok(!r.ok && r.casi && r.mensaje === 'Casi: sobra “y”.', 'sobra «y»: ' + r.mensaje);
r = X.comparar('Lucía y Mateo caminan juntas por la selva. Tienen hambre y estan cansadas.', G);
ok(!r.ok && r.casi && r.mensaje === 'Casi: revisa “juntas” y “cansadas”.' && r.diferencias.length === 2, 'dos palabras: ' + r.mensaje);

/* ---------- opciones: casos límite ---------- */
console.log('opciones (casos límite)');
const libre = C.NIVELES.find(n => n.libre);
r = X.opciones(libre, [{ escena: 'selva', personajes: ['lucia'] }, { escena: null, personajes: [] }], 1);
ok(r.correcta === '' && r.opciones.length === 0 && r.indice === -1, 'viñeta vacía → sin opciones');
r = X.opciones(libre, [{ escena: 'selva', personajes: ['lucia'] }, { escena: 'rio', personajes: ['lucia', 'mateo'] }], 1, undefined, { tiempo: 'pret' });
ok(r.opciones.length === 3 && r.opciones[r.indice] === r.correcta && /encontró/.test(r.correcta), 'nivel libre, pretérito: ' + JSON.stringify(r.opciones));

/* ---------- comparar: propiedades sobre frases reales ---------- */
const sinTildes = s => s.normalize('NFD').replace(/ñ/g, 'ñ').replace(/[̀-ͯ]/g, '');
const DISTINTA = 'El perro come pan y bebe leche.';
function propiedades(c, donde) {
  let r = X.comparar(c, c);
  ok(r.ok && !r.casi && r.nota === 1, `${donde}: idéntica no es ok`);
  const st = sinTildes(c); r = X.comparar(st, c);
  ok(r.ok && r.casi === (st !== c), `${donde}: sin tildes → ${r.mensaje}`);
  r = X.comparar(c.replace(/[¿¡!?.,;:]/g, ''), c);
  ok(r.ok && r.casi, `${donde}: sin signos → ${r.mensaje}`);
  r = X.comparar(c.toLowerCase(), c);
  ok(r.ok && r.casi && /mayúsculas/.test(r.mensaje), `${donde}: minúsculas → ${r.mensaje}`);
  const m = c.match(/\p{L}{4,}/u); // una letra cambiada (la tercera de la primera palabra larga)
  if (m) {
    const k = m.index + 2, letra = c[k] === 'x' ? 'z' : 'x';
    const cambiada = c.slice(0, k) + letra + c.slice(k + 1);
    r = X.comparar(cambiada, c);
    ok(!r.ok && r.casi && r.mensaje.startsWith('Casi: revisa'), `${donde}: letra cambiada «${cambiada}» → ${r.mensaje}`);
    ok(r.diferencias.length === 1 && r.diferencias[0].esperada === m[0], `${donde}: diferencias letra cambiada ${JSON.stringify(r.diferencias)}`);
  }
  const ws = c.split(' '); // una palabra que falta (la segunda)
  if (ws.length >= 3) {
    r = X.comparar(ws.filter((_, k) => k !== 1).join(' '), c);
    ok(!r.ok && r.diferencias.some(d => d.esperada && !d.escrita), `${donde}: palabra que falta → ${r.mensaje} ${JSON.stringify(r.diferencias)}`);
  }
  r = X.comparar(DISTINTA, c);
  ok(!r.ok && !r.casi, `${donde}: frase distinta → ${r.mensaje}`);
}

/* ---------- opciones: todos los niveles ---------- */
console.log('opciones (todos los niveles, presente y pretérito)');
const stats = { llamadas: 0, origen: {}, recurso: 0, historia: 0, nivelesRecurso: new Set() };
let frasesVistas = 0;
for (const nivel of C.NIVELES) {
  if (nivel.libre) continue;
  const t = Date.now();
  const sols = E.resolver(nivel, { max: 5 }).soluciones;
  ok(sols.length > 0, `${nivel.id}: sin soluciones`);
  const antes = { llamadas: stats.llamadas, recurso: stats.recurso, historia: stats.historia };
  let ejemplo = null;
  for (const sol of sols) {
    for (const tiempo of ['pres', 'pret']) {
      const res = E.simular(nivel, sol, { tiempo });
      ok(res.resuelto, `${nivel.id}: la solución no resuelve el nivel (${E.textoSolucion(sol)})`);
      for (let i = 0; i < nivel.viñetas; i++) {
        const o = X.opciones(nivel, sol, i, res, { tiempo });
        stats.llamadas++;
        const correcta = res.viñetas[i].frases.join(' ');
        const donde = `${nivel.id} ${tiempo} viñeta ${i + 1} (${E.textoSolucion([sol[i]])})`;
        ok(o.correcta === correcta, `${donde}: correcta ≠ frase de la viñeta`);
        ok(Array.isArray(o.opciones) && o.opciones.length === 3, `${donde}: no hay 3 opciones`);
        ok(o.opciones.every(s => typeof s === 'string' && s.trim().length > 0), `${donde}: opción vacía`);
        ok(new Set(o.opciones.map(X.normalizar)).size === 3, `${donde}: opciones repetidas → ${JSON.stringify(o.opciones)}`);
        ok(o.opciones[o.indice] === correcta, `${donde}: opciones[indice] no es la correcta`);
        const o2 = X.opciones(nivel, sol, i, undefined, { tiempo }); // sin «res»: debe dar exactamente lo mismo
        ok(JSON.stringify(o2) === JSON.stringify(o), `${donde}: no determinista`);
        for (const g of o.origen) if (g !== 'correcta') stats.origen[g] = (stats.origen[g] || 0) + 1;
        if (o.recurso) { stats.recurso++; stats.nivelesRecurso.add(nivel.id); }
        if (o.origen.includes('historia')) stats.historia++;
        if (!ejemplo && tiempo === 'pres' && i === 1) ejemplo = o;
        if (tiempo === 'pres') { frasesVistas++; propiedades(correcta, donde); }
      }
    }
  }
  console.log(`  [${nivel.id}] ${sols.length} soluciones · ${stats.llamadas - antes.llamadas} viñetas × 2 tiempos · otras viñetas ${stats.historia - antes.historia} · último recurso ${stats.recurso - antes.recurso} · ${Date.now() - t} ms`);
  if (ejemplo) console.log('    ' + ejemplo.opciones.map((s, k) => `${k === ejemplo.indice ? '✔' : '·'} ${s}  [${ejemplo.origen[k]}]`).join('\n    '));
}

const ms = Date.now() - t0;
console.log(`\nopciones: ${stats.llamadas} llamadas · origen de las alternativas: ${Object.entries(stats.origen).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
console.log(`  recurrieron a otras viñetas de la historia: ${stats.historia} · al último recurso: ${stats.recurso}${stats.nivelesRecurso.size ? ' (' + [...stats.nivelesRecurso].join(', ') + ')' : ''}`);
console.log(`comparar: ${frasesVistas} frases reales × 7 casos`);
ok(ms < 60000, `demasiado lento: ${ms} ms (límite 60 s)`);
console.log(`\n${pruebas} comprobaciones · ${fallos} fallos · ${ms} ms`);
process.exit(fallos ? 1 : 0);
