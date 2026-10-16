#!/usr/bin/env node
/* node test/historias.js — reprise, verrouillage séquentiel et indépendance des histoires. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const H = require('../src/historias-state.js');
const fixture = { stories: ['uno', 'dos'].map(id => ({ id, chapters: Array.from({ length: 3 }, (_, i) => ({
  id: id + (i + 1), choices: [{ id: 'a', response: 'Una respuesta.' }, { id: 'b', response: 'Otra respuesta.' }]
})) })) };
const copia = v => JSON.parse(JSON.stringify(v));
const freeze = v => { if (v && typeof v === 'object') { Object.values(v).forEach(freeze); Object.freeze(v); } return v; };
freeze(fixture);
const inicial = freeze(H.normalizar(fixture, null));
assert.equal(H.KEY, 'cuentalo.historias.v1');
assert.deepEqual(H.progreso(fixture, inicial, 'uno'), {
  index: 0, unlocked: 0, choices: {}, answered: 0, total: 3, completed: false, started: false, canAdvance: false
});

// Données de stockage inconnues, invalides ou d'une autre version : départ propre, sans exception.
for (const raw of [undefined, null, '', '{bad', 'null', '[]', 'true', '4', [], false, 4,
  { version: 99, stories: { uno: { index: 2, completed: true } } }, { version: H.VERSION, stories: [] }]) {
  assert.deepEqual(H.normalizar(fixture, raw), inicial);
}
const injecte = JSON.parse('{"version":1,"stories":{"__proto__":{"polluted":true},"inconnue":{"index":2},"uno":{"index":99,"completed":true,"choices":{"uno2":"a","uno3":"b"}}}}');
assert.deepEqual(H.normalizar(fixture, injecte), inicial, 'impossible de déverrouiller sans le premier choix');
assert.equal({}.polluted, undefined);
for (const index of [-2, 0.5, '2', null, Infinity]) {
  const state = H.normalizar(fixture, { version: 1, stories: { uno: { index, choices: { uno1: 'a', uno2: 'b' }, completed: 'true' } } });
  assert.equal(state.stories.uno.index, 0);
  assert.deepEqual(state.stories.uno.choices, { uno1: 'a' });
  assert.equal(state.stories.uno.completed, false);
}
const trou = H.normalizar(fixture, { version: 1, stories: { uno: { index: 2, choices: { uno1: 'a', uno2: 'inconnu', uno3: 'b' }, completed: true } } });
assert.deepEqual(trou.stories.uno, { index: 1, choices: { uno1: 'a' }, completed: false });

// Toute action produit un nouvel état. Ni clic répété ni choix d'un chapitre futur ne sautent une étape.
assert.deepEqual(H.avanzar(fixture, inicial, 'uno'), inicial);
for (const index of [-1, 1, 2, 3, 0.5, '0']) assert.deepEqual(H.elegir(fixture, inicial, 'uno', index, 'a'), inicial);
for (const choice of ['inconnu', null, {}, 0]) assert.deepEqual(H.elegir(fixture, inicial, 'uno', 0, choice), inicial);
let state = H.elegir(fixture, inicial, 'uno', 0, 'b');
assert.deepEqual(inicial.stories.uno.choices, {});
assert.equal(H.progreso(fixture, state, 'uno').canAdvance, true);
assert.equal(H.progreso(fixture, state, 'uno').started, true);
state = H.avanzar(fixture, freeze(state), 'uno');
assert.equal(state.stories.uno.index, 1);
assert.equal(H.progreso(fixture, state, 'uno').canAdvance, false);
assert.deepEqual(H.avanzar(fixture, state, 'uno'), state);
const roundTrip = H.normalizar(fixture, JSON.stringify(state));
assert.deepEqual(roundTrip, state, 'le choix et le chapitre courant survivent à la sauvegarde');
roundTrip.stories.uno.choices.uno1 = 'a';
assert.equal(state.stories.uno.choices.uno1, 'b', 'aucune référence partagée avec l’état restauré');
state = H.elegir(fixture, state, 'uno', 1, 'a');
state = H.avanzar(fixture, state, 'uno');
assert.equal(state.stories.uno.index, 2);
assert.equal(state.stories.uno.completed, false);
state = H.elegir(fixture, state, 'uno', 2, 'b');
assert.equal(state.stories.uno.completed, false, 'la dernière réponse attend encore le clic de fin');
state = H.avanzar(fixture, state, 'uno');
assert.equal(state.stories.uno.completed, true);
assert.equal(H.progreso(fixture, state, 'uno').answered, 3);
assert.equal(H.progreso(fixture, state, 'uno').canAdvance, false);
assert.deepEqual(H.avanzar(fixture, state, 'uno'), state);
assert.deepEqual(H.normalizar(fixture, JSON.stringify(state)), state);

// Relire / changer un choix connu ne réinitialise pas le parcours ; recommencer est explicite et isolé.
state = H.elegir(fixture, state, 'uno', 0, 'a');
assert.deepEqual(state.stories.uno, { index: 2, choices: { uno1: 'a', uno2: 'a', uno3: 'b' }, completed: true });
state = H.elegir(fixture, state, 'dos', 0, 'b');
state = H.avanzar(fixture, state, 'dos');
const avant = copia(state), reset = H.reiniciar(fixture, freeze(state), 'uno');
assert.deepEqual(reset.stories.uno, inicial.stories.uno);
assert.deepEqual(reset.stories.dos, avant.stories.dos);
assert.deepEqual(state, avant);
for (const id of ['inconnue', '__proto__', null]) {
  assert.deepEqual(H.elegir(fixture, state, id, 0, 'a'), state);
  assert.deepEqual(H.avanzar(fixture, state, id), state);
  assert.deepEqual(H.reiniciar(fixture, state, id), state);
  assert.equal(H.progreso(fixture, state, id).unlocked, -1);
}
assert.deepEqual(H.normalizar(null, state), { version: 1, stories: {} });
assert.equal(H.progreso({ stories: [{ id: 'vide', chapters: [] }] }, null, 'vide').canAdvance, false);
assert.equal(H.progreso({ stories: [{ id: 'vide', chapters: [] }] }, null, 'vide').completed, false);

// Export navigateur, sans require, DOM ni localStorage.
const sandbox = { self: {} };
vm.runInNewContext(fs.readFileSync(require.resolve('../src/historias-state.js'), 'utf8'), sandbox);
assert.equal(typeof sandbox.self.SVHistoriasState.normalizar, 'function');
assert.equal(sandbox.self.SVHistoriasState.KEY, H.KEY);

// Contrat des quatre histoires réelles : IDs stables, 20 chapitres, réponses et fins disponibles.
const data = require('../src/historias-data.js');
const contenido = require('../src/contenido.js');
const escenas = new Set(contenido.ESCENAS.map(s => s.id));
const cubiertas = ['don_quijote', 'macondo', 'biblioteca_borges', 'casa_azul'];
const tipos = { don_quijote: 'adaptacion', macondo: 'adaptacion', borges: 'inspiracion', frida: 'biografia' };
const texto = value => typeof value === 'string' && value.trim().length > 0;
const parrafos = value => Array.isArray(value) && value.length > 0 && value.every(texto);
assert.deepEqual(data.stories.map(s => s.id), ['don_quijote', 'macondo', 'borges', 'frida']);
assert.equal(data.stories.reduce((sum, s) => sum + s.chapters.length, 0), 20);
freeze(data);
const ids = new Set();
for (const story of data.stories) {
  for (const key of ['title', 'author', 'subtitle', 'country', 'description', 'color']) assert.ok(texto(story[key]), story.id + ': ' + key);
  assert.equal(story.kind, tipos[story.id]);
  assert.ok(cubiertas.includes(story.cover), story.id + ': couverture connue');
  assert.ok(fs.existsSync(path.join(__dirname, '../src/art/assets/historias', story.cover + '.webp')), story.id + ': couverture disponible');
  assert.ok(Array.isArray(story.characters) && story.characters.length > 0);
  for (const character of story.characters) assert.ok(texto(character.name) && texto(character.role));
  assert.ok(Array.isArray(story.sources) && story.sources.length > 0);
  for (const source of story.sources) {
    assert.ok(texto(source.label));
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(url.hostname && !url.username && !url.password);
  }
  assert.ok(story.ending && texto(story.ending.title) && texto(story.ending.question) && parrafos(story.ending.paragraphs));
  assert.equal(story.chapters.length, 5);
  let progress = H.normalizar(data, null);
  for (const [i, chapter] of story.chapters.entries()) {
    assert.ok(typeof chapter.id === 'string' && !ids.has(chapter.id)); ids.add(chapter.id);
    for (const key of ['title', 'place', 'prompt']) assert.ok(texto(chapter[key]), chapter.id + ': ' + key);
    assert.ok(parrafos(chapter.paragraphs), chapter.id + ': narration');
    assert.ok(escenas.has(chapter.scene), chapter.id + ': décor existant');
    assert.ok(fs.existsSync(path.join(__dirname, '../src/art/assets/escenas-cartoon', chapter.scene + '.webp')), chapter.id + ': illustration disponible');
    if (chapter.closing !== undefined) assert.ok(texto(chapter.closing));
    if (chapter.year !== undefined) assert.ok(texto(chapter.year) || Number.isInteger(chapter.year), chapter.id + ': année lisible');
    assert.equal(new Set(chapter.choices.map(c => c.id)).size, chapter.choices.length);
    assert.ok(chapter.choices.length >= 2);
    for (const choice of chapter.choices) {
      assert.ok(typeof choice.label === 'string' && choice.label.trim());
      assert.ok(typeof choice.response === 'string' && choice.response.trim());
      const selected = H.elegir(data, progress, story.id, i, choice.id);
      assert.equal(H.progreso(data, selected, story.id).canAdvance, true, story.id + ': chaque choix permet de continuer');
    }
    progress = H.elegir(data, progress, story.id, i, chapter.choices[i % chapter.choices.length].id);
    progress = H.avanzar(data, progress, story.id);
    progress = H.normalizar(data, JSON.stringify(progress));
  }
  assert.equal(H.progreso(data, progress, story.id).completed, true);
  assert.equal(H.progreso(data, progress, story.id).answered, 5);
  assert.ok(story.ending, story.id + ': conclusion disponible');
  assert.ok(data.stories.filter(s => s.id !== story.id).every(s => !H.progreso(data, progress, s.id).started));
}
console.log('✔ Historias: stockage corrompu, immutabilité, progression sans saut, choix persistés, reprise/relecture, reset isolé et 20 chapitres.');
