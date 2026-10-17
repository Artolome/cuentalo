#!/usr/bin/env node
/* node test/exploration-translations.js — couverture des dialogues et exports. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const translations = require('../src/exploration-translations.js');
const dialogues = require('../src/exploration-dialogues.js');
const game = require('../src/exploration-data.js');

const expected = ['don_quijote', 'macondo', 'borges', 'frida'].sort();
assert.deepEqual(Object.keys(translations), ['worlds']);
assert.deepEqual(Object.keys(translations.worlds).sort(), expected, 'quatre mondes attendus');
assert.deepEqual(Object.keys(translations.worlds).sort(), Object.keys(dialogues.worlds).sort(), 'tous les dialogues ont une traduction');
assert.deepEqual(Object.keys(translations.worlds).sort(), game.worlds.map(world => world.id).sort(), 'tous les mondes jouables sont couverts');

let chapters = 0, lines = 0;
for (const [id, world] of Object.entries(translations.worlds)) {
  assert.deepEqual(Object.keys(world), ['chapters'], id + ': contrat du monde');
  assert.ok(Array.isArray(world.chapters), id + ': liste des échanges');
  assert.equal(world.chapters.length, 6, id + ': six échanges');
  assert.equal(world.chapters.length, dialogues.worlds[id].chapters.length, id + ': couverture des échanges espagnols');
  assert.equal(world.chapters.length, game.worlds.find(candidate => candidate.id === id).missions.length, id + ': couverture des missions');
  world.chapters.forEach((chapter, i) => {
    const source = dialogues.worlds[id].chapters[i];
    assert.ok(Array.isArray(chapter), id + '.' + i + ': liste de répliques');
    assert.equal(chapter.length, 2, id + '.' + i + ': deux traductions');
    assert.equal(chapter.length, source.length, id + '.' + i + ': aucun tour de parole omis');
    chapter.forEach((text, j) => {
      const label = id + '.' + i + '.' + j;
      assert.equal(typeof text, 'string', label + ': texte');
      assert.ok(text.trim().length > 0, label + ': traduction non vide');
      assert.equal(text, text.trim(), label + ': pas d’espaces extérieurs');
      assert.doesNotMatch(text, /[<>\uFFFD\r\n¿¡]/u, label + ': texte français brut, sans balisage ni caractère corrompu');
      assert.notEqual(text, source[j].text, label + ': la réplique espagnole ne remplace pas la traduction');
      assert.match(text, /[.!?]$/u, label + ': ponctuation finale');
      assert.equal((text.match(/\?/gu) || []).length, (source[j].text.match(/\?/gu) || []).length,
        label + ': les questions restent des questions');
      lines++;
    });
    chapters++;
  });
}
assert.equal(chapters, 24);
assert.equal(lines, 48);

// Export indépendant du DOM, identique dans Node et dans le bundle du navigateur.
const source = fs.readFileSync(path.join(__dirname, '../src/exploration-translations.js'), 'utf8');
const browser = {};
browser.window = browser;
browser.self = browser;
vm.runInNewContext(source, browser, { filename: 'exploration-translations.js' });
assert.deepEqual(JSON.parse(JSON.stringify(browser.window.SVExplorationTranslations)), translations, 'export navigateur identique à CommonJS');
const withoutSelf = {};
vm.runInNewContext(source, withoutSelf, { filename: 'exploration-translations.js' });
assert.deepEqual(JSON.parse(JSON.stringify(withoutSelf.SVExplorationTranslations)), translations, 'repli global sans self');

console.log('✓ Traductions : 4 mondes, 24 échanges, 48 répliques françaises, couverture et exports valides.');
