#!/usr/bin/env node
/* node test/exploration-motion.js — cycles, accessibilité et entrées invalides. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const M = require('../src/exploration-motion.js');

assert.deepEqual([0, 162.5, 325, 487.5, 650, 812.5].map(t => M.frameIndex('walk', t, 4)), [0, 1, 2, 3, 0, 1]);
assert.equal(M.frameIndex('walk', 162.49, 4), 0, 'pas de changement avant la limite');
assert.deepEqual([0, 279, 280, 559, 560, 840].map(t => M.frameIndex('talk', t, 2)), [0, 0, 1, 1, 0, 1]);
assert.deepEqual([0, 234, 467, 700, 934, 1167, 1400].map(t => M.frameIndex('paint', t, 4)), [0, 1, 2, 3, 2, 1, 0]);

// Les cycles retrouvent leur phase et restent bornés avec un autre nombre d'images.
for (const action of ['walk', 'talk', 'paint']) {
  for (const count of [1, 2, 3, 4, 7]) {
    const period = action === 'walk' ? 650 : action === 'paint' ? 1400 : count * 280;
    for (const time of [0, 15, 161, 250, 299, 549, 701, 1399, 3179, 1000000]) {
      const index = M.frameIndex(action, time, count);
      assert.ok(Number.isInteger(index) && index >= 0 && index < count, `${action} : image bornée`);
      assert.equal(M.frameIndex(action, time + period * 7, count), index, `${action} : phase conservée`);
      assert.equal(M.frameIndex(action, time, count, true), 0, 'mouvement réduit : image fixe');
    }
    for (const time of [Number.MAX_SAFE_INTEGER, Number.MAX_VALUE]) {
      const index = M.frameIndex(action, time, count);
      assert.ok(Number.isInteger(index) && index >= 0 && index < count, `${action} : temps extrême borné`);
    }
  }
  for (const time of [-1, -1000, NaN, Infinity, -Infinity, undefined, null, '280', {}]) {
    assert.equal(M.frameIndex(action, time, 4), 0, 'temps invalide : première image');
  }
  for (const count of [-1, 0, 1, 1.5, NaN, Infinity, undefined, null, '4', {}, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(M.frameIndex(action, 500, count), 0, 'compteur absent ou invalide : première image');
  }
}

assert.equal(M.actionFor('sancho'), 'talk');
assert.equal(M.actionFor('canvas'), 'paint');
for (const kind of ['book', 'lamp', 'flower', 'horse', 'frida', '', null, undefined, '__proto__']) {
  assert.equal(M.actionFor(kind), 'reach');
}
assert.deepEqual(M.durations, { talk: 1800, paint: 2200, reach: 650 });
assert.ok(Object.isFrozen(M.durations), 'durées communes immuables');
for (const action of ['talk', 'paint', 'reach']) assert.equal(M.duration(action), M.durations[action]);
for (const action of ['idle', 'unknown', 'constructor', '__proto__', null, undefined]) {
  assert.equal(M.frameIndex(action, 500, 4), 0, 'une action sans images garde la première');
  assert.equal(M.duration(action), 650, 'une action inconnue utilise la durée du geste');
}

// L'export navigateur fonctionne sans document, fenêtre, horloge ni stockage.
const sandbox = { self: {} };
vm.runInNewContext(fs.readFileSync(require.resolve('../src/exploration-motion.js'), 'utf8'), sandbox);
assert.equal(sandbox.self.SVExplorationMotionEngine.frameIndex('talk', 280, 2), 1);
assert.equal(sandbox.self.SVExplorationMotionEngine.actionFor('canvas'), 'paint');
console.log('✔ Animation : cycles bornés, ping-pong, mouvement réduit, durées et export navigateur.');
