#!/usr/bin/env node
/* node test/exploration-audio-assets.js [--html]
   Vérifie les prises locales ; --html contrôle aussi les mêmes octets dans cuentalo.html après build. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const D = require('../src/exploration-data.js');
const N = require('../src/exploration-stories.js');
const L = require('../src/exploration-dialogues.js');
const catalog = require('../src/exploration-audio-catalog.js').create(D, N, L);
const base = path.resolve(__dirname, '../src/audio/exploration');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sorted = values => [...values].sort();
const locales = { don_quijote: 'es-ES', macondo: 'es-CO', borges: 'es-AR', frida: 'es-MX' };
const fields = ['file', 'text', 'voice', 'rate', 'pitch'];
const expectedTexts = {};
const counts = { intro: 0, goal: 0, story: 0, dialogue: 0, summary: 0 };
const seenLocales = new Set();
assert.ok(process.argv.slice(2).every(arg => arg === '--html'), 'seule option : --html');

// Couverture indépendante des prises : une introduction et un résumé par monde,
// deux consignes, un récit et deux répliques pour chacune de ses six missions.
assert.deepEqual(sorted(D.worlds.map(world => world.id)), sorted(Object.keys(locales)));
for (const world of D.worlds) {
  const story = N.worlds[world.id], dialogue = L.worlds[world.id];
  assert.equal(world.missions.length, 6, world.id + ': six missions');
  assert.equal(story.chapters.length, 6); assert.equal(dialogue.chapters.length, 6);
  expectedTexts[world.id + '.intro'] = story.intro.title + '. ' + story.intro.text;
  expectedTexts[world.id + '.summary'] = story.title + '. ' + story.summary;
  world.missions.forEach((mission, index) => {
    for (const level of ['easy', 'normal']) expectedTexts[world.id + '.goal.' + index + '.' + level] = mission.goal[level];
    expectedTexts[world.id + '.story.' + index] = story.chapters[index].title + '. ' + story.chapters[index].text;
    assert.equal(dialogue.chapters[index].length, 2, world.id + ': deux répliques');
    dialogue.chapters[index].forEach((line, turn) => {
      expectedTexts[world.id + '.dialogue.' + index + '.' + turn] = line.text;
    });
  });
}
assert.equal(catalog.length, 128, '128 prises dans le catalogue');
assert.equal(new Set(catalog.map(entry => entry.key)).size, 128, 'aucune clé répétée');
assert.equal(new Set(catalog.map(entry => entry.file)).size, 128, 'un fichier par prise');
assert.deepEqual(sorted(catalog.map(entry => entry.key)), sorted(Object.keys(expectedTexts)), 'tous les textes jouables possèdent leur prise');
for (const entry of catalog) {
  const [worldId, kind] = entry.key.split('.');
  counts[kind]++;
  assert.equal(entry.text, expectedTexts[entry.key], entry.key + ': texte réellement affiché, ponctuation comprise');
  assert.ok(entry.text.length > 0 && !entry.text.includes('\uFFFD'), entry.key + ': texte UTF-8 non vide');
  assert.equal(entry.file, entry.key + '.mp3', entry.key + ': fichier local stable');
  assert.match(entry.voice, /^es-(?:ES|CO|AR|MX)-[A-Za-z]+Neural$/, entry.key + ': voix espagnole, jamais française');
  assert.equal(entry.voice.slice(0, 5), locales[worldId], entry.key + ': variante espagnole du monde');
  assert.match(entry.rate, /^[+-]\d+%$/, entry.key + ': vitesse explicite');
  assert.match(entry.pitch, /^[+-]\d+Hz$/, entry.key + ': hauteur explicite');
  seenLocales.add(entry.voice.slice(0, 5));
}
assert.deepEqual(counts, { intro: 4, goal: 48, story: 24, dialogue: 48, summary: 4 });
assert.deepEqual(sorted(seenLocales), sorted(Object.values(locales)), 'les quatre variantes sont présentes');

const manifestPath = path.join(base, 'manifest.json');
assert.ok(fs.existsSync(manifestPath), 'manifest.json absent : terminer la génération des 128 prises avant ce test');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
assert.equal(manifest.version, 1, 'version du manifeste');
assert.equal(typeof manifest.provider, 'string', 'fournisseur documenté');
assert.ok(manifest.provider.trim().length > 0, 'fournisseur non vide');
assert.ok(manifest.clips && typeof manifest.clips === 'object' && !Array.isArray(manifest.clips), 'dictionnaire de prises');
assert.deepEqual(sorted(Object.keys(manifest.clips)), sorted(Object.keys(expectedTexts)), 'exactement les 128 clés attendues dans le manifeste');
const bytesByKey = new Map();
for (const entry of catalog) {
  const asset = manifest.clips[entry.key];
  assert.ok(asset && typeof asset === 'object', entry.key + ': métadonnées présentes');
  for (const field of fields) assert.equal(asset[field], entry[field], entry.key + ': ' + field + ' conforme au catalogue');
  assert.equal(path.basename(asset.file), asset.file, entry.key + ': aucun chemin extérieur');
  assert.match(asset.sha256, /^[a-f0-9]{64}$/, entry.key + ': empreinte SHA-256 valide');
  const filename = path.join(base, asset.file);
  assert.ok(fs.existsSync(filename) && fs.statSync(filename).isFile(), entry.key + ': MP3 présent');
  const bytes = fs.readFileSync(filename);
  assert.ok(bytes.length > 128, entry.key + ': enregistrement non vide');
  assert.ok(bytes.subarray(0, 3).toString('ascii') === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0),
    entry.key + ': en-tête MP3, pas une réponse HTML ou JSON');
  assert.equal(hash(bytes), asset.sha256, entry.key + ': octets conformes au manifeste');
  if (Object.hasOwn(asset, 'duration')) assert.ok(Number.isFinite(asset.duration) && asset.duration > 0, entry.key + ': durée positive si fournie');
  bytesByKey.set(entry.key, bytes);
}

if (process.argv.includes('--html')) {
  const filename = path.resolve(__dirname, '../cuentalo.html');
  assert.ok(fs.existsSync(filename), 'cuentalo.html absent : exécuter node build.js avant --html');
  const html = fs.readFileSync(filename, 'utf8');
  const assignments = [...html.matchAll(/\bwindow\.SVAudioClips\s*=\s*(\{[\s\S]*?\})\s*;/g)];
  assert.equal(assignments.length, 1, 'un seul registre audio embarqué');
  const embedded = JSON.parse(assignments[0][1]);
  assert.deepEqual(sorted(Object.keys(embedded)), sorted(Object.keys(expectedTexts)), 'les 128 prises dans le HTML');
  for (const [key, bytes] of bytesByKey) {
    assert.match(embedded[key], /^data:audio\/mpeg;base64,[A-Za-z0-9+/]+={0,2}$/, key + ': MP3 embarqué utilisable hors ligne');
    const decoded = Buffer.from(embedded[key].slice('data:audio/mpeg;base64,'.length), 'base64');
    assert.ok(decoded.equals(bytes), key + ': les octets embarqués correspondent au MP3 validé');
  }
}

console.log('✔ Audio assets : 128 prises, textes/voix/rate/pitch exacts, 4 variantes espagnoles et SHA-256' +
  (process.argv.includes('--html') ? ', également vérifiés dans le HTML autonome.' : '.'));
