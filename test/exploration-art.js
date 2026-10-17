#!/usr/bin/env node
/* node test/exploration-art.js — objets peints, variantes de mission et calques. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const render = require('../src/exploration-art.js');
const data = require('../src/exploration-data.js');

const required = [
  'tree', 'well', 'bench', 'horse', 'mill', 'mill-sails', 'letter', 'key',
  'lamp', 'star', 'bell', 'canvas-empty', 'canvas-painted',
  'flower-red', 'flower-yellow', 'flower-pink', 'flower-purple',
  'fruit-red', 'fruit-green', 'fruit-orange',
  'book-red', 'book-blue', 'book-green', 'book-purple',
  'butterfly-yellow', 'butterfly-blue', 'door-brown', 'door-blue', 'door-purple',
  'paint-red', 'paint-blue', 'paint-yellow'
];
assert.equal(typeof render, 'function');
assert.equal(render.assetNames.length, 32);
assert.equal(new Set(render.assetNames).size, 32);
assert.deepEqual(render.assetNames.slice().sort(), required.slice().sort(), 'les 32 fichiers attendus par le build');
assert.equal(Object.isFrozen(render.assetNames), true, 'la liste publique ne peut pas être modifiée');
const assets = Object.freeze(Object.fromEntries(required.map(name => [name,
  'data:image/webp;base64,' + Buffer.from(name).toString('base64')])));

// Couleurs réellement utilisées, vérifiées indépendamment pour chaque famille.
const expectedColors = {
  flower: { '#df4d45': 'red', '#f4c63e': 'yellow', '#e37a9b': 'pink', '#ad74cc': 'purple' },
  fruit: { '#df4d45': 'red', '#79ac44': 'green', '#ed9a32': 'orange' },
  book: { '#df4d45': 'red', '#398dca': 'blue', '#79ac44': 'green', '#8c68a6': 'purple' },
  butterfly: { '#f1c73f': 'yellow', '#5d9ed5': 'blue' },
  door: { '#ba7541': 'brown', '#398dca': 'blue', '#8b6aa9': 'purple' },
  paint: { '#df4d45': 'red', '#398dca': 'blue', '#f4c63e': 'yellow' }
};
const used = new Set();
let objects = 0, characters = 0;
for (const world of data.worlds) {
  for (const mission of world.missions) {
    for (const object of mission.objects) {
      const snapshot = JSON.stringify(object);
      if (object.kind === 'sancho') {
        assert.equal(render.assetKey(object), null, object.id + ': personnage, pas accessoire');
        assert.equal(render(object, assets), '');
        characters++;
        continue;
      }
      let expected = object.kind === 'canvas' ? 'canvas-empty' : object.kind;
      if (expectedColors[object.kind]) {
        const color = expectedColors[object.kind][object.color];
        assert.ok(color, object.id + ': nouvelle couleur à vérifier explicitement');
        expected = object.kind + '-' + color;
      }
      assert.equal(render.assetKey(object), expected, object.id + ': illustration et couleur correctes');
      const html = render(object, assets);
      assert.match(html, /^<span class="x-object-art" aria-hidden="true">/u, object.id + ': conteneur décoratif');
      assert.ok(html.includes('src="' + assets[expected] + '"'), object.id + ': bonne image de base');
      assert.doesNotMatch(html, /<(?:svg|path|g|circle|ellipse|polygon)\b/iu, object.id + ': aucun dessin SVG');
      const images = html.match(/<img\b[^>]*>/gu) || [];
      assert.equal(images.length, ['canvas', 'mill'].includes(object.kind) ? 2 : 1, object.id + ': bon nombre de calques');
      for (const image of images) {
        assert.match(image, /class="x-object-illustration(?: [^"]+)?"/u);
        assert.match(image, /alt="" draggable="false"/u, object.id + ': image décorative sans glissement natif');
        const url = image.match(/src="([^"]+)"/u)[1];
        const key = required.find(name => assets[name] === url);
        assert.ok(key, object.id + ': image issue du registre');
        used.add(key);
      }
      if (object.kind === 'canvas') {
        assert.ok(images[0].includes(assets['canvas-empty']), 'toile vide en premier');
        assert.ok(images[1].includes(assets['canvas-painted']), 'toile peinte au-dessus');
        assert.match(images[1], /class="x-object-illustration x-painted"/u);
        assert.doesNotMatch(html, /(?:width|height|left|top)=/u, 'les deux calques partagent la géométrie CSS');
      }
      if (object.kind === 'mill') {
        assert.ok(images[0].includes(assets.mill), 'corps du moulin en premier');
        assert.ok(images[1].includes(assets['mill-sails']), 'ailes au-dessus');
        assert.match(images[1], /class="x-object-illustration x-mill-sails"/u);
      }
      assert.equal(JSON.stringify(object), snapshot, object.id + ': aucune mutation des données');
      objects++;
    }
  }
}
assert.equal(characters, 1, 'Sancho conserve son chemin de rendu existant');
assert.deepEqual([...used].sort(), required.slice().sort(), 'les missions et leurs calques utilisent les 32 illustrations');

assert.equal(render.assetKey({ kind: 'flower', color: ' #DF4D45 ' }), 'flower-red', 'hexadécimal insensible à la casse');
assert.equal(render.assetKey({ kind: 'book', color: 'azul' }), 'book-blue', 'ancien alias espagnol');
assert.equal(render.assetKey({ kind: 'door' }), 'door-brown', 'porte sans couleur');
assert.equal(render.assetKey({ kind: 'canvas', color: '#398dca' }), 'canvas-empty', 'la toile reste contrôlée par son calque peint');
for (const object of [null, undefined, {}, { kind: 'unknown' }, { kind: '__proto__' }]) {
  assert.equal(render.assetKey(object), null);
  assert.equal(render(object, assets), '');
}
assert.equal(render({ kind: 'tree' }, {}), '', 'pas d’image cassée quand le registre est incomplet');
assert.equal(render({ kind: 'tree' }, null), '');
assert.equal(render({ kind: 'tree' }, Object.create({ tree: assets.tree })), '', 'aucune entrée héritée du prototype');
const escaped = render({ kind: 'tree' }, { tree: 'data:image/webp;base64,test"<&\'' });
assert.ok(escaped.includes('test&quot;&lt;&amp;&#39;'), 'attribut src échappé');

// L’injection du registre peut suivre le chargement du module, sans DOM requis.
const source = fs.readFileSync(path.join(__dirname, '../src/exploration-art.js'), 'utf8');
const browser = {};
browser.self = browser;
browser.window = browser;
vm.runInNewContext(source, browser, { filename: 'exploration-art.js' });
assert.equal(typeof browser.window.SVExplorationArt, 'function');
assert.equal(browser.SVExplorationArt({ kind: 'tree' }), '', 'registre pas encore injecté');
browser.SVExplorationObjects = assets;
assert.equal(browser.SVExplorationArt({ kind: 'tree' }), render({ kind: 'tree' }, assets), 'registre navigateur lu par défaut');
assert.equal(browser.SVExplorationArt({ kind: 'tree' }, {}), '', 'registre explicite prioritaire');
assert.deepEqual(JSON.parse(JSON.stringify(browser.SVExplorationArt.assetNames)), render.assetNames, 'même liste dans les deux exports');
const withoutSelf = {};
vm.runInNewContext(source, withoutSelf, { filename: 'exploration-art.js' });
assert.equal(withoutSelf.SVExplorationArt({ kind: 'mill' }, assets), render({ kind: 'mill' }, assets), 'repli global sans self');

if (process.argv.includes('--html')) {
  const html = fs.readFileSync(path.join(__dirname, '../cuentalo.html'), 'utf8');
  const match = html.match(/window\.SVExplorationObjects=(\{[^}]+\});/u);
  assert.ok(match, 'registre des illustrations présent dans le fichier autonome');
  const embedded = JSON.parse(match[1]);
  assert.deepEqual(Object.keys(embedded).sort(), required.slice().sort());
  for (const name of required) {
    const bytes = fs.readFileSync(path.join(__dirname, '../src/art/assets/exploration-objects', name + '.webp'));
    assert.equal(bytes.subarray(0, 4).toString(), 'RIFF', name + ': fichier image réel');
    assert.equal(bytes.subarray(8, 12).toString(), 'WEBP', name + ': format WebP');
    assert.equal(embedded[name], 'data:image/webp;base64,' + bytes.toString('base64'), name + ': image incorporée sans modification');
  }
  console.log('✓ Les 32 illustrations réelles sont intégrées au HTML autonome.');
}
console.log('✓ Objets peints : ' + objects + ' accessoires de mission, 32 variantes, couleurs, calques et exports valides.');
