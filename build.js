#!/usr/bin/env node
/* Assemble le jeu en UN seul fichier autonome : src/plantilla.html + src/*.js + src/art/*.js → cuentalo.html
   Zéro dépendance, zéro requête réseau. `node build.js` */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const SRC = path.join(__dirname, 'src');
// Orden de carga: lengua → contenido → motor → arte → módulos sin DOM (escritor, autor) → pizarra → ui → ui-modos.
// Los módulos marcados como opcionales se incluyen solo si existen (se añaden en la fase 2).
const OPCIONALES = ['escritor.js', 'autor.js', 'pizarra.js', 'ui-modos.js'];
const SCRIPTS = ['lengua.js', 'contenido.js', 'engine.js', path.join('art', 'personajes.js'), path.join('art', 'escenas.js'), 'escritor.js', 'autor.js', 'pizarra.js', 'partidas.js', 'ui.js', 'ui-modos.js', 'historias-data.js', 'historias-state.js', 'historias-ui.js', 'exploration-data.js', 'exploration-engine.js', 'exploration-stories.js', 'exploration-motion.js', 'exploration-art.js', 'exploration-dialogues.js', 'exploration-translations.js', 'exploration-audio.js', 'exploration-ui.js']
  .filter(f => !OPCIONALES.includes(f) || fs.existsSync(path.join(SRC, f)));
let html = fs.readFileSync(path.join(SRC, 'plantilla.html'), 'utf8');
html = html.replace('/*THEME*/', () => ['theme.css', 'historias.css', 'exploration.css'].map(f => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n'));
// Each asset is embedded once; scene and character SVGs reuse the data URI.
const { fondos, personajes } = require('./scripts/load-art')();
const cubiertas = Object.fromEntries(['don_quijote', 'macondo', 'biblioteca_borges', 'casa_azul'].map(id => [id, 'data:image/webp;base64,' + fs.readFileSync(path.join(SRC, 'art', 'assets', 'historias', id + '.webp')).toString('base64')]));
const sprites = Object.fromEntries(['quijote', 'sancho', 'ursula', 'bibliotecario', 'frida'].map(id => [id, 'data:image/webp;base64,' + fs.readFileSync(path.join(SRC, 'art', 'assets', 'exploration', id + '.webp')).toString('base64')]));
const objectNames = require('./src/exploration-art').assetNames;
const objects = Object.fromEntries(objectNames.map(id => [id, 'data:image/webp;base64,' + fs.readFileSync(path.join(SRC, 'art', 'assets', 'exploration-objects', id + '.webp')).toString('base64')]));
const motion = {};
for (const id of ['quijote', 'ursula', 'bibliotecario', 'frida', 'sancho']) {
  const actions = id === 'sancho' ? {talk:2} : id === 'frida' ? {walk:4,talk:2,paint:4} : {walk:4,talk:2};
  motion[id] = Object.fromEntries(Object.entries(actions).map(([action,count]) => [action,Array.from({length:count},(_,i) => 'data:image/webp;base64,' + fs.readFileSync(path.join(SRC,'art','assets','exploration-motion',`${id}-${action}-${i}.webp`)).toString('base64'))]));
}
const arte = `<script>window.SVFondos=${JSON.stringify(fondos)};window.SVCubiertas=${JSON.stringify(cubiertas)};window.SVExplorationSprites=${JSON.stringify(sprites)};window.SVExplorationMotion=${JSON.stringify(motion)};window.SVExplorationObjects=${JSON.stringify(objects)};window.SVPersonajesCartoon=${JSON.stringify(personajes)};document.documentElement.style.setProperty('--bosque-portada','url("'+window.SVFondos.selva+'")');</script>`;
// La compilation refuse un audio périmé : le texte affiché doit être celui entendu.
const audioDir = path.join(SRC, 'audio', 'exploration');
const manifest = JSON.parse(fs.readFileSync(path.join(audioDir, 'manifest.json'), 'utf8'));
const catalog = require('./src/exploration-audio-catalog').create(require('./src/exploration-data'), require('./src/exploration-stories'), require('./src/exploration-dialogues'));
const clips = {};
for (const entry of catalog) {
  const asset = manifest.clips[entry.key];
  if (!asset || ['text','voice','rate','pitch','file'].some(field => asset[field] !== entry[field])) throw new Error('Audio absent ou périmé : ' + entry.key);
  if (path.basename(asset.file) !== asset.file) throw new Error('Chemin audio invalide : ' + entry.key);
  const bytes = fs.readFileSync(path.join(audioDir, asset.file));
  if (crypto.createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw new Error('Audio altéré : ' + entry.key);
  clips[entry.key] = 'data:audio/mpeg;base64,' + bytes.toString('base64');
}
const audio = '<script>window.SVAudioClips=' + JSON.stringify(clips) + ';</script>';
const LS = new RegExp('[' + String.fromCharCode(0x2028) + String.fromCharCode(0x2029) + ']', 'g');
const inline = SCRIPTS.map(f => {
  const code = fs.readFileSync(path.join(SRC, f), 'utf8').replace(LS, '');
  if (/<\/script/i.test(code)) throw new Error(f + ' contient "</script"');
  return `<script>/* ${f.replace(/\\/g, '/')} */\n${code}\n</script>`;
}).join('\n');
html = html.replace('<!--SCRIPTS-->', () => arte + '\n' + audio + '\n' + inline);
const version = new Date().toISOString().slice(0, 10);
html = html.replace('<!--VERSION-->', version);
const out = path.join(__dirname, 'cuentalo.html');
fs.writeFileSync(out, html, 'utf8');
// Contrôles : aucune URL externe
const externas = (html.match(/(src|href)=["']https?:\/\//g) || []).length + (html.match(/@import\s+url\(\s*["']?https?:/g) || []).length;
if (externas) { console.error(`✗ ${externas} référence(s) réseau trouvée(s) dans ${out}`); process.exit(1); }
console.log(`→ ${out} (${Math.round(fs.statSync(out).size / 1024)} Ko, version ${version}, 0 requête réseau)`);
