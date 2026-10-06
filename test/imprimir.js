#!/usr/bin/env node
/* node test/imprimir.js [salida.html]
   Genera, sin navegador, la vista de impresión («Imprimir mi historia») de una solución real del nivel c2n1
   y la escribe como HTML autónomo con la hoja de estilos de impresión aplicada en pantalla.
   Sirve para revisar la maquetación A4 (p. ej. con chrome --headless --print-to-pdf). */
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, '..', 'src');

// Entorno mínimo para cargar los módulos de interfaz en Node
const L = require(path.join(SRC, 'lengua.js')), C = require(path.join(SRC, 'contenido.js')), E = require(path.join(SRC, 'engine.js'));
const AP = require(path.join(SRC, 'art', 'personajes.js')), AE = require(path.join(SRC, 'art', 'escenas.js'));
const ESC = require(path.join(SRC, 'escritor.js')), AU = require(path.join(SRC, 'autor.js'));
global.window = { SVLengua: L, SVContenido: C, SVEngine: E, SVArtePersonajes: AP, SVArteEscenas: AE, SVEscritor: ESC, SVAutor: AU, SVApp: {} };
global.document = { querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ setAttribute() {}, appendChild() {}, style: {} }), body: { appendChild() {} }, head: { appendChild() {} }, scripts: [] };
new Function('window', 'document', fs.readFileSync(path.join(SRC, 'ui-modos.js'), 'utf8'))(global.window, global.document);
const App = global.window.SVApp;
if (typeof App.htmlImpresion !== 'function') { console.error('✗ ui-modos.js no expone htmlImpresion'); process.exit(1); }

// Nivel y solución (la primera que cumple también el secreto, si la hay)
const nivel = C.NIVELES.find(n => n.id === (process.argv[3] || 'c2n1'));
const r = E.resolver(nivel, { max: 60 });
const sol = r.soluciones.find(s => E.simular(nivel, s).secreto) || r.soluciones[0];
const res = E.simular(nivel, sol);
if (!res.resuelto) { console.error('✗ la solución elegida no resuelve el nivel'); process.exit(1); }
const html = App.htmlImpresion(nivel, res, nivel.secreto ? (nivel.tituloSecreto || E.tituloDe(nivel.secreto, nivel)) : '');

// CSS de impresión de la plantilla, aplicado en pantalla (se quita el envoltorio @media print)
const plantilla = fs.readFileSync(path.join(SRC, 'plantilla.html'), 'utf8');
const m = plantilla.match(/@media print\{\s*@page[\s\S]*?\n\}/);
if (!m) { console.error('✗ no encuentro el bloque @media print en plantilla.html'); process.exit(1); }
const css = m[0].replace(/^@media print\{/, '').replace(/\}\s*$/, '').replace(/body > \*:not\(#impresion\)\{[^}]*\}/, '');
const vars = (plantilla.match(/:root\{[\s\S]*?\}/) || [''])[0];
const salida = process.argv[2] || path.join(__dirname, '..', 'docs', 'ejemplo_impresion.html');
fs.writeFileSync(salida, `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Sobrevives · impresión · ${nivel.titulo}</title>
<style>${vars}\nbody{margin:0;background:#fff}\n${css}\n#impresion{display:block}\n.imp-pagina{break-after:page}</style></head>
<body><section id="impresion">${html}</section></body></html>`, 'utf8');
const controles = [
  [/imp-pagina/g, 3, 'páginas'], [/imp-hoja/g, 2, 'hojas vacías'], [/<p class="imp-frase">/g, nivel.viñetas, 'frases'],
  [/imp-lineas/g, 10, 'bloques de líneas'], [/Nombre o código: _/g, 3, 'campos de nombre o código']
];
let errores = 0;
for (const [re, n, nombre] of controles) { const k = (html.match(re) || []).length; if (k !== n) { console.log(`  ✗ ${nombre}: ${k} (esperados ${n})`); errores++; } }
if (/undefined|\[object/.test(html)) { console.log('  ✗ hay «undefined» u objetos sin serializar'); errores++; }
console.log(`${nivel.id} «${nivel.titulo}» · ${E.textoSolucion(sol)}${res.secreto ? ' · 🔑' : ''}\n→ ${salida} (${Math.round(fs.statSync(salida).size / 1024)} Ko) · ${errores ? errores + ' errores' : 'controles OK'}`);
process.exit(errores ? 1 : 0);
