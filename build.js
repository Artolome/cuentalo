#!/usr/bin/env node
/* Assemble le jeu en UN seul fichier autonome : src/plantilla.html + src/*.js + src/art/*.js → sobrevives.html
   Zéro dépendance, zéro requête réseau. `node build.js` */
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, 'src');
const SCRIPTS = ['lengua.js', 'contenido.js', 'engine.js', path.join('art', 'personajes.js'), path.join('art', 'escenas.js'), 'ui.js'];
let html = fs.readFileSync(path.join(SRC, 'plantilla.html'), 'utf8');
const LS = new RegExp('[' + String.fromCharCode(0x2028) + String.fromCharCode(0x2029) + ']', 'g');
const inline = SCRIPTS.map(f => {
  const code = fs.readFileSync(path.join(SRC, f), 'utf8').replace(LS, '');
  if (/<\/script/i.test(code)) throw new Error(f + ' contient "</script"');
  return `<script>/* ${f.replace(/\\/g, '/')} */\n${code}\n</script>`;
}).join('\n');
html = html.replace('<!--SCRIPTS-->', () => inline);
const version = new Date().toISOString().slice(0, 10);
html = html.replace('<!--VERSION-->', version);
const out = path.join(__dirname, 'sobrevives.html');
fs.writeFileSync(out, html, 'utf8');
// Contrôles : aucune URL externe
const externas = (html.match(/(src|href)=["']https?:\/\//g) || []).length + (html.match(/@import\s+url\(\s*["']?https?:/g) || []).length;
if (externas) { console.error(`✗ ${externas} référence(s) réseau trouvée(s) dans ${out}`); process.exit(1); }
console.log(`→ ${out} (${Math.round(fs.statSync(out).size / 1024)} Ko, version ${version}, 0 requête réseau)`);
