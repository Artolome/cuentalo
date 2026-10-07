#!/usr/bin/env node
/* node test/pizarra.js
   Comprueba que src/pizarra.js se carga en Node sin DOM, exporta la API y escribe bien los números en letras. */
const assert = require('assert');

let P;
assert.doesNotThrow(() => { P = require('../src/pizarra.js'); }, 'require(src/pizarra.js) no debe lanzar en Node');

// API exportada
assert.strictEqual(typeof P.montar, 'function', 'exporta montar()');
assert.strictEqual(typeof P.CSS, 'string', 'exporta CSS (string)');
assert.ok(P.CSS.includes('.sv-pizarra'), 'el CSS contiene la clase raíz .sv-pizarra');
assert.strictEqual(typeof P.numeroEnLetras, 'function', 'exporta numeroEnLetras()');
assert.strictEqual(P.KEY, 'cuentalo.pizarra.v0', 'clave de almacenamiento');

// montar() sin document devuelve un objeto inofensivo
const m = P.montar(null, {});
assert.strictEqual(typeof m.destruir, 'function');
assert.strictEqual(typeof m.reiniciar, 'function');
assert.doesNotThrow(() => { m.reiniciar(); m.destruir(); });

// números en letras
const casos = { 1: 'uno', 5: 'cinco', 10: 'diez', 12: 'doce', 16: 'dieciséis', 20: 'veinte', 21: 'veintiuno', 22: 'veintidós',
  26: 'veintiséis', 29: 'veintinueve', 30: 'treinta', 31: 'treinta y uno', 35: 'treinta y cinco', 39: 'treinta y nueve', 40: 'cuarenta' };
for (const n in casos) assert.strictEqual(P.numeroEnLetras(+n), casos[n], `numeroEnLetras(${n})`);
assert.strictEqual(P.numeroEnLetras('12'), 'doce', 'acepta cadenas numéricas');
assert.strictEqual(P.numeroEnLetras(100), '100', 'fuera de rango → cifras');

// todas las letras 1..40 son distintas y sin mayúsculas
const letras = Array.from({ length: 40 }, (_, i) => P.numeroEnLetras(i + 1));
assert.strictEqual(new Set(letras).size, 40, '40 formas distintas');
assert.ok(letras.every(s => /^[a-zñáéíóú ]+$/.test(s)), 'solo minúsculas y espacios');

// el CSS no referencia la red (misma regla que build.js)
assert.ok(!/https?:\/\//.test(P.CSS), 'el CSS no contiene URL externas');

console.log('✔ test/pizarra.js: todo bien (' + (Object.keys(casos).length + 10) + ' comprobaciones)');
