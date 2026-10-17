#!/usr/bin/env node
/* node test/atelier-cards.js — couverture et lisibilité des aides de l’atelier. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const C = require('../src/contenido.js');
const L = require('../src/lengua.js');
const E = require('../src/engine.js');
const cards = require('../src/atelier-cards.js');

assert.deepEqual(Object.keys(cards), ['scenes', 'characters', 'lexicon']);
assert.deepEqual(Object.keys(cards.scenes).sort(), C.ESCENAS.map(s => s.id).sort(), 'chaque scène jouable a sa fiche, sans entrée périmée');
assert.deepEqual(Object.keys(cards.characters).sort(), C.PERSONAJES.map(p => p.id).sort(), 'chaque personnage a sa présentation');

function plain(text, label, max) {
  assert.equal(typeof text, 'string', label + ' est un texte');
  assert.ok(text.trim().length > 0, label + ' n’est pas vide');
  assert.equal(text, text.trim(), label + ' ne contient pas d’espaces extérieurs');
  assert.doesNotMatch(text, /[<>\uFFFD\r\n]| {2}/u, label + ' reste du texte brut propre');
  assert.ok(text.length <= max, label + ' est assez court pour une carte');
}

function short(text, label) {
  plain(text, label, 58);
  const words = text.split(/\s+/u).length;
  assert.ok(words >= 3 && words <= 7, label + ' tient en trois à sept mots');
}

for (const [id, scene] of Object.entries(cards.scenes)) {
  assert.deepEqual(Object.keys(scene).sort(), ['nameFr', 'shortEs', 'shortFr', 'detailEs', 'detailFr'].sort(), id + ' respecte le contrat de fiche');
  plain(scene.nameFr, id + '.nameFr', 45);
  for (const lang of ['Es', 'Fr']) {
    short(scene['short' + lang], id + '.short' + lang);
    const detail = scene['detail' + lang];
    plain(detail, id + '.detail' + lang, 300);
    assert.match(detail, /[.!?]$/u, id + ' possède une ponctuation finale');
    const sentences = detail.match(/[.!?]+(?:\s|$)/gu) || [];
    assert.ok(sentences.length >= 1 && sentences.length <= 3, id + '.detail' + lang + ' ne dépasse pas trois phrases');
  }
  assert.notEqual(scene.shortFr, scene.shortEs, id + ' possède un vrai libellé français');
  assert.notEqual(scene.detailFr, scene.detailEs, id + ' possède une vraie explication française');
}

for (const [id, character] of Object.entries(cards.characters)) {
  assert.deepEqual(Object.keys(character).sort(), ['shortEs', 'shortFr']);
  for (const lang of ['Es', 'Fr']) short(character['short' + lang], id + '.short' + lang);
}

// Vérifier aussi le lexique calculé : une nouvelle règle ou un nouveau chapitre
// peut ajouter des mots qui ne figurent pas encore dans la liste des pictogrammes.
const requiredWords = new Set(Object.keys(L.PICTOS));
for (const level of C.NIVELES) {
  for (const entry of E.lexicoDe(level)) requiredWords.add(entry.palabra);
  for (const entry of level.cultura && level.cultura.palabras || []) {
    requiredWords.add(typeof entry === 'string' ? entry : entry.palabra);
  }
}
for (const word of requiredWords) assert.ok(Object.hasOwn(cards.lexicon, word), word + ' est traduit');
for (const [word, translation] of Object.entries(cards.lexicon)) {
  plain(word, 'mot espagnol', 40);
  plain(translation, word + ' en français', 60);
}

// Les deux exports doivent fonctionner sans document, dépendance ni effet de bord.
const source = fs.readFileSync(path.join(__dirname, '../src/atelier-cards.js'), 'utf8');
const browser = {};
browser.self = browser;
vm.runInNewContext(source, browser, { filename: 'atelier-cards.js' });
assert.deepEqual(JSON.parse(JSON.stringify(browser.SVAtelierCards)), cards, 'export navigateur identique à CommonJS');
const globalFallback = {};
vm.runInNewContext(source, globalFallback, { filename: 'atelier-cards.js' });
assert.deepEqual(JSON.parse(JSON.stringify(globalFallback.SVAtelierCards)), cards, 'export global fonctionne sans self');

console.log(`✓ Cartes de l’atelier : ${Object.keys(cards.scenes).length} scènes, ${Object.keys(cards.characters).length} personnages et ${requiredWords.size} mots couverts, aides bilingues courtes et exports valides.`);
