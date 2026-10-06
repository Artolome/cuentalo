#!/usr/bin/env node
/* node test/autor.js
   Modo Autor: ida y vuelta codificar → decodificar (niveles del juego + niveles «historia» grabados de soluciones reales),
   robustez del código (un carácter cambiado → Error; minúsculas, espacios y confundibles → vale), asistente de títulos,
   validar() y almacén. Sale con código 1 si falla algo. */
const C = require('../src/contenido.js');
const E = require('../src/engine.js');
const A = require('../src/autor.js');

let fallos = 0, pruebas = 0;
function ok(cond, msg) { pruebas++; if (!cond) { fallos++; console.log('  ✗ ' + msg); } }
function lanza(fn, msg) { pruebas++; try { fn(); fallos++; console.log('  ✗ no lanza: ' + msg); return null; } catch (e) { return e; } }
/* Comparación profunda sin importar el orden de las claves ni las claves undefined. */
function canon(x) {
  if (Array.isArray(x)) return '[' + x.map(canon).join(',') + ']';
  if (x && typeof x === 'object') return '{' + Object.keys(x).filter(k => x[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + canon(x[k])).join(',') + '}';
  return JSON.stringify(x);
}
const igual = (a, b) => canon(a) === canon(b);
const sinGuiones = s => s.replace(/-/g, '');

/* ===== 1. Ida y vuelta: niveles del juego ===== */
console.log('\n1. Ida y vuelta (niveles del juego)');
const CAMPOS = ['objetivo', 'escenas', 'personajes', 'viñetas', 'titulo', 'inicial'];
for (const nivel of C.NIVELES) {
  if (nivel.libre) continue;
  const codigo = A.codificar(nivel);
  const d = A.decodificar(codigo);
  for (const k of CAMPOS) ok(igual(d[k], nivel[k]), `${nivel.id}: «${k}» cambia tras la ida y vuelta\n      ${canon(nivel[k])}\n      ${canon(d[k])}`);
  ok(/^S1/.test(sinGuiones(codigo)), `${nivel.id}: el código no empieza por S1`);
  ok(/^[0-9A-HJKMNP-TV-Z]+$/.test(sinGuiones(codigo)), `${nivel.id}: el código usa letras fuera del alfabeto`);
  ok(/^[^-]{1,4}(-[^-]{1,4})*$/.test(codigo), `${nivel.id}: los grupos no son de 4`);
  ok(d.id === 'autor-' + A.hashCorto(sinGuiones(codigo)) && d.capitulo === 0 && d.autor === true, `${nivel.id}: id/capitulo/autor incorrectos`);
  ok(A.decodificar(codigo).id === d.id, `${nivel.id}: el id no es estable`);
  const libre = nivel.titulo !== E.tituloDe(nivel.objetivo, nivel);
  const util = sinGuiones(codigo).length;
  const tipico = nivel.viñetas <= 3 && nivel.escenas.length <= 3 && nivel.personajes.length <= 2;
  if (tipico) ok(util <= 24, `${nivel.id}: nivel típico con ${util} caracteres (> 24)`);
  console.log(`  ${nivel.id.padEnd(5)} ${String(util).padStart(2)} car. ${tipico ? '(típico)' : '        '} ${codigo}${libre ? '   [título libre]' : ''}`);
}

/* ===== 2. Ida y vuelta: niveles «historia» grabados de soluciones reales ===== */
console.log('\n2. Ida y vuelta (objetivo «historia» con título libre)');
const HISTORIAS = [['c1n1', 'La aventura de Lucía'], ['c2n1', '¡Qué noche en la selva, Mateo!'], ['c3n1', 'Mi historia 🌴 con ñ y tildes: él, ü']];
for (const [id, titulo] of HISTORIAS) {
  const base = C.NIVELES.find(n => n.id === id);
  const sol = E.resolver(base, { max: 1 }).soluciones[0];
  const res = E.simular(base, sol);
  const nivel = { id: 'autor-x', capitulo: 0, autor: true, titulo, viñetas: base.viñetas, escenas: base.escenas, personajes: base.personajes, objetivo: E.objetivoDeHistoria(base, res) };
  ok(E.simular(nivel, sol).resuelto, `${id}: la historia grabada no se cumple con su propia solución`);
  const codigo = A.codificar(nivel);
  const d = A.decodificar(codigo);
  for (const k of CAMPOS) ok(igual(d[k], nivel[k]), `${id} historia: «${k}» cambia tras la ida y vuelta\n      ${canon(nivel[k])}\n      ${canon(d[k])}`);
  ok(d.objetivo.tipo === 'historia' && E.simular(d, sol).resuelto, `${id} historia: el nivel decodificado no acepta la solución original`);
  console.log(`  ${id} historia ${String(sinGuiones(codigo).length).padStart(2)} car. (${nivel.objetivo.eventos.length} eventos) ${codigo}`);
  // grabar(): el mismo objetivo que E.objetivoDeHistoria
  const g = A.grabar(Object.assign({}, nivel, { objetivo: null }), sol);
  ok(igual(g.objetivo, nivel.objetivo), `${id}: grabar() no da el mismo objetivo`);
}
lanza(() => A.grabar(C.NIVELES[0], []), 'grabar() con viñetas vacías');
// Estado inicial con objetos
{
  const base = C.NIVELES.find(n => n.id === 'c3n6');
  const nivel = Object.assign({}, base, { inicial: { lucia: { hambre: true, objetos: ['mapa', 'comida'] }, valeria: { frio: true } } });
  const d = A.decodificar(A.codificar(nivel));
  ok(igual(d.inicial, nivel.inicial), 'inicial con objetos cambia tras la ida y vuelta: ' + canon(d.inicial));
}

/* ===== 3. Robustez del código ===== */
console.log('\n3. Robustez del código');
{
  const nivel = C.NIVELES.find(n => n.id === 'c2n5');
  const codigo = A.codificar(nivel), s = sinGuiones(codigo);
  // un carácter cambiado, en TODAS las posiciones y por TODAS las letras → siempre Error
  let detectados = 0, intentos = 0, mensajesMal = 0;
  for (let i = 0; i < s.length; i++) for (const ch of A.ALFABETO) {
    if (ch === s[i]) continue;
    intentos++;
    try { A.decodificar(s.slice(0, i) + ch + s.slice(i + 1)); } catch (e) { detectados++; if (!(e instanceof Error) || !/código/.test(e.message)) mensajesMal++; }
  }
  ok(detectados === intentos, `cambios de un carácter no detectados: ${intentos - detectados} de ${intentos}`);
  ok(mensajesMal === 0, `${mensajesMal} errores sin mensaje en español sobre el código`);
  console.log(`  ${detectados}/${intentos} cambios de un carácter detectados`);
  const e = lanza(() => A.decodificar(s.slice(0, 5) + (s[5] === 'A' ? 'B' : 'A') + s.slice(6)), 'un carácter cambiado');
  ok(e && e.message === A.MENSAJE_INVALIDO, 'mensaje esperado: «' + A.MENSAJE_INVALIDO + '»');
  // letra de más o de menos
  lanza(() => A.decodificar(s.slice(0, -2) + s.slice(-1)), 'una letra de menos');
  lanza(() => A.decodificar(s + 'A'), 'una letra de más');
  lanza(() => A.decodificar(''), 'código vacío');
  lanza(() => A.decodificar('ABCD-EFGH'), 'código sin S');
  lanza(() => A.decodificar('S2' + s.slice(2)), 'otra versión');
  // minúsculas, espacios, guiones y confundibles
  const ref = A.decodificar(codigo);
  const raro = codigo.toLowerCase().split('').join(' ');
  ok(igual(A.decodificar(raro), ref), 'minúsculas y espacios no se aceptan');
  ok(igual(A.decodificar(' - ' + s.slice(0, 3) + '--' + s.slice(3).toLowerCase() + ' -'), ref), 'guiones en cualquier sitio no se aceptan');
  const confundible = s.replace(/1/g, 'I').replace(/0/g, 'O').replace(/V/g, 'U');
  ok(igual(A.decodificar(confundible), ref), 'I/O/U → 1/0/V no se aceptan');
  ok(igual(A.decodificar(s.replace(/1/g, 'l')), ref), 'l minúscula → 1 no se acepta');
  ok(ref.codigo === codigo, 'nivel.codigo no es la forma canónica');
}

/* ===== 4. Asistente de títulos ===== */
console.log('\n4. Asistente de títulos');
const ORDEN_GRUPOS = { estado: 0, yaNo: 1, nunca: 2, evento: 3, todos: 4, nadie: 4, amigos: 5, enfadado: 5 };
function pruebaAsistente(nombre, personajes, escenas, esperados, prohibidos) {
  const lista = A.asistenteTitulos(personajes, escenas);
  const titulos = lista.map(x => x.titulo);
  console.log(`  ${nombre}: ${lista.length} títulos → ${titulos.join(' · ')}`);
  ok(lista.length > 0, `${nombre}: sin propuestas`);
  ok(lista.every(x => E.objetivoValido(x.objetivo)), `${nombre}: hay objetivos no válidos`);
  ok(new Set(titulos).size === titulos.length, `${nombre}: títulos repetidos`);
  ok(lista.every(x => x.titulo === E.tituloDe(x.objetivo, { personajes, escenas })), `${nombre}: título distinto de E.tituloDe`);
  const grupos = lista.map(x => ORDEN_GRUPOS[x.objetivo.tipo]);
  ok(grupos.every((g, i) => g !== undefined && (i === 0 || g >= grupos[i - 1])), `${nombre}: orden de grupos incorrecto (${grupos.join(',')})`);
  for (const t of esperados) ok(titulos.includes(t), `${nombre}: falta «${t}»`);
  for (const p of prohibidos) ok(!lista.some(x => canon(x.objetivo).includes(`"${p}"`) || x.titulo.includes(p)), `${nombre}: propone «${p}» y no debería`);
  // todas las propuestas tienen solución con 3 viñetas (comprobación real con el resolvedor)
  for (const x of lista) {
    const v = A.validar({ titulo: x.titulo, viñetas: 3, escenas, personajes, objetivo: x.objetivo });
    ok(v.ok && v.total > 0, `${nombre}: «${x.titulo}» no tiene solución (${v.errores.join(' ')})`);
  }
  return lista;
}
pruebaAsistente('sol·río·fuego / Lucía', ['lucia'], ['sol', 'rio', 'fuego'],
  ['Lucía ya no tiene sed', 'Lucía ya no tiene frío', 'Lucía tiene sed', 'Lucía nunca tiene sed', 'Lucía está contenta'],
  ['cura', 'a salvo', 'encuentra', 'Todos', 'Nadie', 'amigos', 'hambre']);
const lista2 = pruebaAsistente('serpiente·refugio·rescate / Valeria, Diego', ['valeria', 'diego'], ['serpiente', 'refugio', 'rescate'],
  ['Valeria cura a Diego', 'Diego cura a Valeria', 'Valeria está a salvo', 'Todos están a salvo', 'Diego ya no está herido', 'Nadie está herido', 'Valeria y Diego son amigos'],
  ['comparte', 'duermen', 'hambre', 'sed', 'enfadad']);
pruebaAsistente('selva·noche·sol / Lucía, Mateo', ['lucia', 'mateo'], ['selva', 'noche', 'sol'],
  ['Mateo encuentra a Lucía', 'Lucía encuentra a Mateo', 'Lucía y Mateo se encuentran', 'Lucía y Mateo duermen bien', 'Lucía y Mateo caminan juntos', 'Lucía ya no tiene miedo', 'Todos tienen hambre', 'Nadie tiene miedo'],
  ['cura', 'a salvo', 'ya no tiene hambre', 'ya no tiene sed', 'comparte', 'enfadad']);
{
  // con mochila + montaña + fuego + refugio aparecen comparte / no comparte / perdón / enfadado
  const lista = A.asistenteTitulos(['lucia', 'diego'], ['mochila', 'montana', 'fuego', 'refugio']);
  const t = lista.map(x => x.titulo);
  for (const esp of ['Lucía comparte la comida con Diego', 'Diego pide perdón a Lucía', 'Diego no comparte', 'Lucía está enfadada con Diego']) ok(t.includes(esp), `mochila·montaña·fuego·refugio: falta «${esp}»`);
  console.log(`  mochila·montaña·fuego·refugio / Lucía, Diego: ${lista.length} títulos`);
  // sin mochila no hay comida: nada de compartir
  ok(!A.asistenteTitulos(['lucia', 'diego'], ['montana', 'fuego', 'refugio']).some(x => /comparte|perdón|enfadad/.test(x.titulo)), 'sin mochila propone compartir');
  // jaguar a dos: título genérico, una sola vez
  const j = A.asistenteTitulos(['lucia', 'mateo', 'diego'], ['jaguar']).filter(x => x.objetivo.evento === 'jaguarJuntos');
  ok(j.length === 1 && !j[0].objetivo.quien && j[0].titulo === 'El jaguar se va', 'jaguarJuntos debería ser un único título genérico');
  ok(A.asistenteTitulos([], ['selva']).length === 0 && A.asistenteTitulos(['lucia'], []).length === 0, 'sin personajes o sin escenas debería dar lista vacía');
  ok(A.asistenteTitulos(['lucia', 'lucia', 'nadie'], ['selva', 'selva', 'x']).length > 0, 'ids repetidos o desconocidos deberían ignorarse');
}

/* ===== 5. validar ===== */
console.log('\n5. validar');
{
  const cura = lista2.find(x => x.titulo === 'Valeria cura a Diego');
  const v = A.validar({ titulo: cura.titulo, viñetas: 3, escenas: ['serpiente', 'refugio', 'rescate'], personajes: ['valeria', 'diego'], objetivo: cura.objetivo });
  ok(v.ok && v.errores.length === 0 && v.total > 0, 'nivel pequeño del asistente: debería tener solución');
  ok(v.soluciones.length <= 5 && v.soluciones.length === Math.min(5, v.total), 'soluciones ≤ 5');
  ok(v.textos.length === v.soluciones.length && v.textos.every(t => typeof t === 'string' && t.length), 'textos de las soluciones');
  ok(v.densidad > 0 && v.densidad <= 1 && typeof v.segundos === 'number' && v.segundos >= 0, 'densidad / segundos');
  console.log(`  «${cura.titulo}»: ${v.total} soluciones · densidad ${(100 * v.densidad).toFixed(2)} % · ${v.segundos} s · ej.: ${v.textos[0]}`);
  const vacio = A.validar({});
  ok(!vacio.ok && vacio.errores.includes('Escribe un título.') && vacio.errores.includes('Elige al menos una escena.') && vacio.errores.includes('Elige al menos un personaje.') && vacio.errores.includes('El número de viñetas tiene que estar entre 1 y 6.'), 'errores del nivel vacío: ' + vacio.errores.join(' | '));
  const grande = A.validar({ titulo: 'x', viñetas: 7, escenas: C.ESCENAS.map(e => e.id).slice(0, 9), personajes: C.PERSONAJES.map(p => p.id), objetivo: { tipo: 'nadie', estado: 'sed' } });
  ok(grande.errores.includes('Demasiadas escenas: 8 como máximo.') && grande.errores.includes('Demasiados personajes: 4 como máximo.') && grande.errores.includes('El número de viñetas tiene que estar entre 1 y 6.'), 'límites: ' + grande.errores.join(' | '));
  const imposible = A.validar({ titulo: 'Lucía está a salvo', viñetas: 3, escenas: ['sol'], personajes: ['lucia'], objetivo: { tipo: 'estado', quien: 'lucia', estado: 'salvo', valor: true } });
  ok(!imposible.ok && imposible.errores.includes('Este título no tiene solución con estas escenas y estos personajes.') && imposible.total === 0, 'imposible: ' + imposible.errores.join(' | '));
  const fuera = A.validar({ titulo: 'Mateo tiene sed', viñetas: 3, escenas: ['sol'], personajes: ['lucia'], objetivo: { tipo: 'estado', quien: 'mateo', estado: 'sed', valor: true } });
  ok(!fuera.ok && fuera.errores.some(e => /Mateo/.test(e)), 'personaje del título fuera del nivel: ' + fuera.errores.join(' | '));
  const sinObj = A.validar({ titulo: 'Mi historia', viñetas: 3, escenas: ['sol'], personajes: ['lucia'] });
  ok(!sinObj.ok && sinObj.errores.some(e => /objetivo/.test(e)), 'sin objetivo: ' + sinObj.errores.join(' | '));
  const desb = A.validar(C.NIVELES.find(n => n.id === 'c3n6'), { limite: 10 });
  ok(!desb.ok && desb.desbordado && desb.errores.includes('Demasiado grande para comprobarlo.'), 'desbordado: ' + desb.errores.join(' | '));
  const ok1 = A.validar(C.NIVELES.find(n => n.id === 'c1n1'));
  ok(ok1.ok && ok1.total === 6, 'c1n1 debería validar con 6 soluciones (' + ok1.total + ')');
}

/* ===== 6. almacén ===== */
console.log('\n6. almacén');
{
  const mapa = new Map();
  const store = { getItem: k => (mapa.has(k) ? mapa.get(k) : null), setItem: (k, v) => { mapa.set(k, String(v)); }, removeItem: k => { mapa.delete(k); } };
  const al = A.almacen(store);
  ok(al.listar().length === 0, 'almacén vacío al principio');
  const n1 = A.decodificar(A.codificar(C.NIVELES[0]));
  const n2 = A.decodificar(A.codificar(C.NIVELES[1]));
  al.guardar(n1); al.guardar(n2);
  ok(al.listar().length === 2 && mapa.has(A.CLAVE) && A.CLAVE === 'sobrevives.autor.v0', 'guardar dos niveles con la clave correcta');
  al.guardar(Object.assign({}, n1, { titulo: 'Otro título' }));
  ok(al.listar().length === 2 && al.listar().find(x => x.id === n1.id).titulo === 'Otro título', 'guardar con el mismo id reemplaza');
  ok(al.listar().every(x => x.autor === true), 'los niveles guardados llevan autor:true');
  const lista = al.listar(); lista[0].titulo = 'cambiado fuera';
  ok(al.listar()[0].titulo !== 'cambiado fuera', 'listar() devuelve copias');
  ok(al.borrar(n2.id) === true && al.borrar('no-existe') === false && al.listar().length === 1, 'borrar');
  const json = al.exportarTodo();
  ok(typeof json === 'string' && JSON.parse(json).niveles.length === 1, 'exportarTodo es JSON con los niveles');
  const otro = A.almacen({ getItem: () => null, setItem: () => {}, removeItem: () => {} });
  ok(otro.importarTodo(json) === 1 && otro.importarTodo(json) === 0 && otro.listar().length === 1, 'importarTodo añade sin duplicar y devuelve el número');
  ok(otro.importarTodo(JSON.stringify([n2, n1, { sin: 'id' }])) === 1 && otro.listar().length === 2, 'importarTodo acepta una lista y salta lo que no es un nivel');
  lanza(() => otro.importarTodo('{esto no es json'), 'importarTodo con JSON roto');
  lanza(() => al.guardar({ titulo: 'sin id' }), 'guardar sin id');
  // almacenamiento roto o inexistente: nunca lanza
  const roto = A.almacen({ getItem() { throw new Error('bloqueado'); }, setItem() { throw new Error('lleno'); }, removeItem() { throw new Error('x'); } });
  pruebas++;
  try { roto.guardar(n1); ok(roto.listar().length === 1 && roto.borrar(n1.id) && roto.listar().length === 0, 'almacén roto: funciona en memoria'); } catch (e) { fallos++; console.log('  ✗ almacén roto lanza: ' + e.message); }
  const nulo = A.almacen(null);
  nulo.guardar(n1);
  ok(nulo.listar().length === 1, 'almacén sin store funciona en memoria');
}

console.log(`\n${pruebas} comprobaciones · ${fallos} fallos`);
process.exit(fallos ? 1 : 0);
