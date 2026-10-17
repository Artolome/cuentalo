#!/usr/bin/env node
/* node test/exploration-dialogues.js — répliques courtes, missions et exports. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const dialogues = require('../src/exploration-dialogues.js');
const game = require('../src/exploration-data.js');
const stories = require('../src/exploration-stories.js');

const expected = {
  don_quijote: ['quijote', 'sancho'], macondo: ['ursula', 'vecina'],
  borges: ['bibliotecario', 'visitante'], frida: ['frida', 'visitante']
};
const words = text => text.trim().split(/\s+/u).length;
const plain = (value, label) => {
  assert.equal(typeof value, 'string', label);
  assert.ok(value.length > 0 && value === value.trim(), label + ': texte non vide et sans espaces extérieurs');
  assert.doesNotMatch(value, /[<>\uFFFD\r\n]/u, label + ': une ligne de texte brut UTF-8');
};
assert.deepEqual(Object.keys(dialogues), ['worlds']);
assert.deepEqual(Object.keys(dialogues.worlds).sort(), Object.keys(expected).sort(), 'les quatre IDs attendus');
assert.deepEqual(Object.keys(dialogues.worlds).sort(), game.worlds.map(world => world.id).sort(), 'tous les mondes jouables sont couverts');
assert.deepEqual(Object.keys(dialogues.worlds).sort(), Object.keys(stories.worlds).sort(), 'mêmes mondes que les récits');

let chapterCount = 0, lineCount = 0;
const lengths = [];
for (const [worldId, world] of Object.entries(dialogues.worlds)) {
  assert.deepEqual(Object.keys(world).sort(), ['chapters', 'speakers'], worldId + ': contrat du monde');
  assert.deepEqual(Object.keys(world.speakers).sort(), expected[worldId].slice().sort(), worldId + ': IDs des locuteurs');
  assert.deepEqual(Object.values(world.speakers).map(speaker => speaker.role).sort(), ['companion', 'hero'], worldId + ': deux rôles distincts');
  for (const [speakerId, speaker] of Object.entries(world.speakers)) {
    assert.deepEqual(Object.keys(speaker).sort(), ['name', 'role'], speakerId + ': contrat du locuteur');
    plain(speaker.name, worldId + '.' + speakerId + '.name');
  }
  assert.equal(world.chapters.length, 6, worldId + ': six échanges');
  assert.equal(world.chapters.length, game.worlds.find(candidate => candidate.id === worldId).missions.length,
    worldId + ': un échange par mission');
  assert.equal(world.chapters.length, stories.worlds[worldId].chapters.length, worldId + ': un échange par fragment');
  world.chapters.forEach((lines, index) => {
    const label = worldId + '.chapters[' + index + ']';
    assert.ok(Array.isArray(lines), label);
    assert.equal(lines.length, 2, label + ': exactement deux répliques');
    assert.equal(new Set(lines.map(line => line.speaker)).size, 2, label + ': les deux voix participent');
    assert.deepEqual(lines.map(line => world.speakers[line.speaker]?.role), ['hero', 'companion'], label + ': héros puis compagnon connu');
    for (const line of lines) {
      assert.deepEqual(Object.keys(line).sort(), ['speaker', 'text'], label + ': contrat de réplique');
      assert.ok(Object.hasOwn(world.speakers, line.speaker), label + ': locuteur défini');
      plain(line.text, label + '.text');
      const length = words(line.text);
      assert.ok(length >= 3 && length <= 10, label + ': 3 à 10 mots, reçu ' + length);
      assert.match(line.text, /[.!?]$/u, label + ': ponctuation finale');
      // La ponctuation ouvrante espagnole doit accompagner chaque question/exclamation.
      for (const [open, close] of [['¿', '?'], ['¡', '!']]) {
        let balance = 0;
        for (const char of line.text) {
          if (char === open) balance++;
          if (char === close) balance--;
          assert.ok(balance >= 0 && balance <= 1, label + ': ponctuation espagnole appariée');
        }
        assert.equal(balance, 0, label + ': ponctuation espagnole fermée');
      }
      lengths.push(length);
      lineCount++;
    }
    chapterCount++;
  });
}
assert.equal(chapterCount, 24);
assert.equal(lineCount, 48);

const source = fs.readFileSync(path.join(__dirname, '../src/exploration-dialogues.js'), 'utf8');
const browser = {};
browser.window = browser;
browser.self = browser;
vm.runInNewContext(source, browser, { filename: 'exploration-dialogues.js' });
assert.deepEqual(JSON.parse(JSON.stringify(browser.window.SVExplorationDialogues)), dialogues, 'même export navigateur et CommonJS');
const withoutSelf = {};
vm.runInNewContext(source, withoutSelf, { filename: 'exploration-dialogues.js' });
assert.deepEqual(JSON.parse(JSON.stringify(withoutSelf.SVExplorationDialogues)), dialogues, 'repli global sans self');

console.log('✓ Diálogos: 4 mundos, 24 intercambios, 48 réplicas de ' + Math.min(...lengths) + '–' +
  Math.max(...lengths) + ' palabras; locutores, puntuación y exportaciones válidos.');
