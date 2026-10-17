#!/usr/bin/env node
/* node test/exploration-stories.js — contrat éditorial et export des récits courts. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const data = require('../src/exploration-stories.js');
const game = require('../src/exploration-data.js');

const expectedKinds = { don_quijote: 'novela', macondo: 'novela', borges: 'cuento', frida: 'vida' };
const words = value => value.trim().split(/\s+/u).length;
const sentences = value => (value.match(/[.!?]+(?:\s|$)/gu) || []).length;
const text = (value, label) => {
  assert.equal(typeof value, 'string', label);
  assert.ok(value.length > 0 && value === value.trim(), label + ': texte non vide et sans espaces extérieurs');
  assert.doesNotMatch(value, /[<>\uFFFD]/u, label + ': texte brut UTF-8, sans balisage');
};
const title = (value, label) => {
  text(value, label);
  assert.ok(words(value) >= 3 && words(value) <= 6, label + ': titre de 3 à 6 mots');
};
const officialHosts = new Set([
  'cvc.cervantes.es', 'www.penguinlibros.com', 'www.fundaciongabo.org',
  'centrogabo.org', 'www.ingenieria.unam.mx', 'www.bn.gov.ar', 'www.museofridakahlo.org.mx'
]);

assert.deepEqual(Object.keys(data), ['worlds']);
assert.deepEqual(Object.keys(data.worlds).sort(), Object.keys(expectedKinds).sort(), 'les quatre IDs stables');
assert.deepEqual(Object.keys(data.worlds).sort(), game.worlds.map(world => world.id).sort(), 'chaque monde jouable possède son récit');
let fragments = 0;
const counts = [];
for (const [id, story] of Object.entries(data.worlds)) {
  assert.equal(story.kind, expectedKinds[id], id + ': roman, conte ou vie réelle');
  text(story.title, id + '.title');
  title(story.intro.title, id + '.intro.title');
  text(story.intro.text, id + '.intro.text');
  assert.equal(sentences(story.intro.text), 2, id + ': prologue en deux phrases');
  assert.ok(words(story.intro.text) <= 35, id + ': prologue de 35 mots au maximum');
  assert.match(story.intro.text, /inventad[oa]s?/u, id + ': les missions inventées sont identifiées');
  assert.equal(story.chapters.length, 6, id + ': six fragments');
  assert.equal(story.chapters.length, game.worlds.find(world => world.id === id).missions.length,
    id + ': un fragment par mission, dans le même ordre');
  assert.equal(new Set(story.chapters.map(chapter => chapter.title)).size, 6, id + ': titres distincts');
  story.chapters.forEach((chapter, index) => {
    const label = id + '.chapters[' + index + ']';
    assert.deepEqual(Object.keys(chapter).sort(), ['text', 'title'], label + ': contrat minimal');
    title(chapter.title, label + '.title');
    text(chapter.text, label + '.text');
    assert.equal(sentences(chapter.text), 2, label + ': deux phrases');
    const count = words(chapter.text);
    assert.ok(count >= 25 && count <= 45, label + ': de 25 à 45 mots, reçu ' + count);
    assert.match(chapter.text, /\.$/u, label + ': phrase terminée');
    counts.push(count);
    fragments++;
  });
  text(story.summary, id + '.summary');
  assert.ok(words(story.summary) >= 60 && words(story.summary) <= 90,
    id + ': résumé de 60 à 90 mots');
  assert.ok(Array.isArray(story.sources) && story.sources.length >= 1, id + ': sources présentes');
  const urls = new Set();
  for (const source of story.sources) {
    text(source.label, id + '.source.label');
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:', id + ': source HTTPS');
    assert.ok(officialHosts.has(url.hostname), id + ': source institutionnelle ou éditeur');
    assert.equal(url.username + url.password, '', id + ': aucun identifiant dans une URL');
    assert.ok(!urls.has(source.url), id + ': pas de source répétée');
    urls.add(source.url);
  }
}
assert.equal(fragments, 24);

// Le même fichier fonctionne sans DOM ni CommonJS dans le bundle navigateur.
const source = fs.readFileSync(path.join(__dirname, '../src/exploration-stories.js'), 'utf8');
const browser = {};
browser.window = browser;
browser.self = browser;
vm.runInNewContext(source, browser, { filename: 'exploration-stories.js' });
assert.deepEqual(JSON.parse(JSON.stringify(browser.window.SVExplorationStories)), data, 'export window.SVExplorationStories');
const withoutSelf = {};
vm.runInNewContext(source, withoutSelf, { filename: 'exploration-stories.js' });
assert.deepEqual(JSON.parse(JSON.stringify(withoutSelf.SVExplorationStories)), data, 'repli global sans self');

console.log('✓ Relatos: 4 mundos, 24 fragmentos de ' + Math.min(...counts) + '–' + Math.max(...counts) +
  ' palabras, 4 prólogos, 4 resúmenes y exportaciones CommonJS/navegador válidas.');
