#!/usr/bin/env node
/* node test/exploration.js — jeu pur : proximité, missions, sauvegarde et déplacement. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const E = require('../src/exploration-engine.js');
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
const fixture = freeze({ worlds: ['uno', 'dos'].map(id => ({ id, missions: [1, 2].map(i => ({
  id: id + i, count: 2, targets: ['a', 'b', 'c'], success: '¡Misión cumplida!', objects: [
    { id: 'a', label: 'Uno', x: 100, y: 320 }, { id: 'b', label: 'Dos', x: 500, y: 320 },
    { id: 'c', label: 'Tres', x: 900, y: 320 }, { id: 'piedra', label: 'Piedra', x: 700, y: 490 }
  ]
})) })) });
const inicial = freeze(E.normalize(fixture, null));
assert.equal(E.KEY, 'cuentalo.exploration.v1');
assert.equal(E.progress(fixture, inicial, 'uno').ready, false);
assert.equal(E.progress(fixture, inicial, 'uno').started, false);
assert.deepEqual(E.next(fixture, inicial, 'uno'), inicial, 'pas de mission sautée');

// Stockage inconnu ou incomplet : conserver uniquement le préfixe accompli et les cibles connues.
for (const raw of [null, undefined, [], false, 12, '', '{bad', 'null', '[]', 'true',
  { version: 99, worlds: { uno: { index: 1, completed: true } } }, { version: 1, worlds: [] }]) {
  assert.deepEqual(E.normalize(fixture, raw), inicial);
}
const poison = JSON.parse('{"version":1,"lastWorld":"inconnu","worlds":{"__proto__":{"polluted":true},"uno":{"index":99,"completed":true,"missions":{"uno2":["a","b"]}},"inconnu":{"completed":true}}}');
assert.deepEqual(E.normalize(fixture, poison), inicial);
assert.equal({}.polluted, undefined);
const partial = E.normalize(fixture, { version: 1, lastWorld: 'uno', worlds: { uno: {
  index: 99, completed: true, missions: { uno1: ['a', 'a', 'piedra', null, 'inconnu'], uno2: ['a', 'b'] }
} } });
assert.deepEqual(partial.worlds.uno, { index: 0, missions: { uno1: ['a'] }, completed: false });
assert.equal(partial.lastWorld, 'uno');
const restored = E.normalize(fixture, { version: 1, worlds: { uno: {
  index: 99, completed: true, missions: { uno1: ['a', 'b'], uno2: ['b', 'c'], fantome: ['a'] }
} } });
assert.equal(restored.worlds.uno.index, 1);
assert.equal(restored.worlds.uno.completed, true);
assert.equal(restored.worlds.uno.missions.fantome, undefined);
for (const index of [-1, 0.5, '1', null, Infinity]) {
  const normalized = E.normalize(fixture, { version: 1, worlds: { uno: { index, missions: { uno1: ['a'] }, completed: 'true' } } });
  assert.equal(normalized.worlds.uno.index, 0);
  assert.equal(normalized.worlds.uno.completed, false);
}

// Ni les distracteurs, ni la distance, ni un ID absent ne changent la progression.
for (const [id, player, event] of [['piedra', { x: 700, y: 490 }, 'wrong'], ['a', { x: 900, y: 500 }, 'far'],
  ['a', { x: NaN, y: 320 }, 'far'], ['fantome', { x: 100, y: 320 }, 'wrong']]) {
  const result = E.interact(fixture, inicial, 'uno', id, player);
  assert.equal(result.event, event); assert.deepEqual(result.state, inicial);
}
let result = E.interact(fixture, inicial, 'uno', 'a', { x: 190, y: 320 });
assert.equal(result.event, 'collected', 'distance 90 incluse');
let state = freeze(result.state);
assert.deepEqual(inicial.worlds.uno.missions, {}, 'les fonctions ne modifient pas leurs arguments');
assert.equal(E.progress(fixture, state, 'uno').count, 1);
assert.equal(E.progress(fixture, state, 'uno').started, true);
result = E.interact(fixture, state, 'uno', 'a', { x: 100, y: 320 });
assert.equal(result.event, 'collected'); assert.deepEqual(result.state, state, 'doublon idempotent');
assert.deepEqual(E.next(fixture, state, 'uno'), state);
result = E.interact(fixture, state, 'uno', 'b', { x: 500, y: 320 });
assert.equal(result.event, 'complete'); state = result.state;
assert.equal(E.progress(fixture, state, 'uno').ready, true);
assert.equal(E.progress(fixture, state, 'uno').completed, false);
const extra = E.interact(fixture, state, 'uno', 'c', { x: 900, y: 320 });
assert.equal(extra.event, 'complete'); assert.deepEqual(extra.state, state, 'compteur borné au nombre demandé');
assert.deepEqual(E.normalize(fixture, JSON.stringify(state)), state);
state = E.next(fixture, freeze(state), 'uno');
assert.equal(E.progress(fixture, state, 'uno').index, 1);
assert.deepEqual(E.progress(fixture, state, 'uno').collected, []);
assert.deepEqual(E.next(fixture, state, 'uno'), state);
for (const id of ['b', 'c']) {
  const target = E.progress(fixture, state, 'uno').mission.objects.find(o => o.id === id);
  state = E.interact(fixture, state, 'uno', id, target).state;
}
assert.equal(E.progress(fixture, state, 'uno').completed, false);
state = E.next(fixture, state, 'uno');
assert.equal(E.progress(fixture, state, 'uno').completed, true);
assert.equal(E.interact(fixture, state, 'uno', 'a', { x: 100, y: 320 }).event, 'done');
assert.deepEqual(E.next(fixture, state, 'uno'), state);
state = E.interact(fixture, state, 'dos', 'a', { x: 100, y: 320 }).state;
const other = JSON.stringify(state.worlds.dos);
const reset = E.restart(fixture, freeze(state), 'uno');
assert.deepEqual(reset.worlds.uno, inicial.worlds.uno);
assert.equal(JSON.stringify(reset.worlds.dos), other, 'recommencer ne touche pas les autres mondes');
assert.equal(state.worlds.uno.completed, true);
for (const id of ['inconnu', '__proto__', null]) {
  assert.equal(E.interact(fixture, state, id, 'a', { x: 100, y: 320 }).event, 'wrong');
  assert.deepEqual(E.next(fixture, state, id), state);
  assert.deepEqual(E.restart(fixture, state, id), state);
}
assert.equal(E.progress({ worlds: [{ id: 'vide', missions: [] }] }, null, 'vide').ready, false);

// Delta en secondes borné, diagonale à vitesse constante, aucune sortie du sol praticable.
const start = freeze({ x: 500, y: 400 });
const moved = E.move(start, 1, 0, 0.1);
assert.deepEqual(moved, { x: 522, y: 400 });
assert.deepEqual(E.move(start, 1, 0, 10), moved, 'longue frame plafonnée à 100 ms');
assert.ok(Math.abs(E.distance(start, E.move(start, 1, 1, 0.1)) - 22) < 1e-8);
for (const dt of [-1, NaN, Infinity, undefined]) assert.deepEqual(E.move(start, 1, 0, dt), start);
assert.deepEqual(E.move(start, NaN, Infinity, 0.1), start);
assert.deepEqual(E.move({ x: 945, y: 510 }, 1, 1, 0.1), { x: 945, y: 510 });
assert.deepEqual(E.move({ x: 55, y: 290 }, -1, -1, 0.1), { x: 55, y: 290 });
assert.deepEqual(E.clampPlayer({ x: -100, y: 1000 }), { x: 55, y: 510 });
assert.deepEqual(E.clampPlayer({ x: NaN, y: undefined }), { x: 500, y: 470 });
assert.equal(E.near({ x: 100, y: 320 }, { x: 190, y: 320 }), true);
assert.equal(E.near({ x: 100, y: 320 }, { x: 190.001, y: 320 }), false);
assert.equal(E.near(null, start), false);
assert.equal(E.distance({}, start), Infinity);
const sandbox = { self: {} };
vm.runInNewContext(fs.readFileSync(require.resolve('../src/exploration-engine.js'), 'utf8'), sandbox);
assert.equal(typeof sandbox.self.SVExplorationEngine.interact, 'function');
assert.equal(sandbox.self.SVExplorationEngine.KEY, E.KEY);

// Les quatre parcours réels restent jouables dans les deux ordres de collecte.
const data = require('../src/exploration-data.js');
const scenes = new Set(require('../src/contenido.js').ESCENAS.map(s => s.id));
assert.deepEqual(data.worlds.map(w => w.id), ['don_quijote', 'macondo', 'borges', 'frida']);
freeze(data);
let count = 0;
for (const world of data.worlds) {
  assert.equal(world.missions.length, 6);
  assert.equal(new Set(world.missions.map(m => m.id)).size, 6);
  assert.ok(typeof world.player === 'string' && world.player.length > 0);
  for (const mission of world.missions) {
    count++;
    assert.ok(scenes.has(mission.scene), mission.id + ': scène connue');
    assert.ok(typeof mission.goal.easy === 'string' && mission.goal.easy.trim());
    assert.ok(typeof mission.goal.normal === 'string' && mission.goal.normal.trim());
    assert.ok(typeof mission.success === 'string' && mission.success.trim());
    assert.ok(Number.isInteger(mission.count) && mission.count >= 1 && mission.count <= 3 && mission.count <= mission.targets.length);
    assert.equal(new Set(mission.targets).size, mission.targets.length);
    assert.equal(new Set(mission.objects.map(o => o.id)).size, mission.objects.length);
    for (const id of mission.targets) assert.ok(mission.objects.some(o => o.id === id));
    for (const obj of mission.objects) {
      assert.ok(Number.isFinite(obj.x) && obj.x >= E.BOUNDS.minX && obj.x <= E.BOUNDS.maxX);
      assert.ok(Number.isFinite(obj.y) && obj.y >= E.BOUNDS.minY && obj.y <= E.BOUNDS.maxY);
      assert.ok(typeof obj.label === 'string' && obj.label.trim());
    }
  }
  for (const reverse of [false, true]) {
    let run = E.normalize(data, null);
    for (const [index, mission] of world.missions.entries()) {
      assert.equal(E.progress(data, run, world.id).index, index);
      assert.deepEqual(E.next(data, run, world.id), run);
      for (const obj of mission.objects.filter(o => !mission.targets.includes(o.id))) {
        const wrong = E.interact(data, run, world.id, obj.id, obj);
        assert.equal(wrong.event, 'wrong'); assert.deepEqual(wrong.state, run);
      }
      const targets = reverse ? [...mission.targets].reverse() : mission.targets;
      for (const [i, id] of targets.slice(0, mission.count).entries()) {
        const obj = mission.objects.find(o => o.id === id);
        const far = E.interact(data, run, world.id, id, { x: obj.x < 500 ? 945 : 55, y: 510 });
        assert.equal(far.event, 'far'); assert.deepEqual(far.state, run);
        const action = E.interact(data, freeze(run), world.id, id, obj);
        assert.equal(action.event, i + 1 === mission.count ? 'complete' : 'collected');
        run = E.normalize(data, JSON.stringify(action.state));
        assert.equal(E.progress(data, run, world.id).count, i + 1);
        assert.deepEqual(E.interact(data, run, world.id, id, obj).state, run);
      }
      run = E.next(data, run, world.id);
      run = E.normalize(data, JSON.stringify(run));
    }
    assert.equal(E.progress(data, run, world.id).completed, true);
    assert.ok(data.worlds.filter(w => w.id !== world.id).every(w => !E.progress(data, run, w.id).started));
  }
}
assert.equal(count, 24);
console.log('✔ Exploration : 4 mondes / 24 missions, proximité, distracteurs, doublons, progression, reprise isolée et mouvement borné.');
