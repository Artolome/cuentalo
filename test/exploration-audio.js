#!/usr/bin/env node
/* node test/exploration-audio.js — un média réutilisé, lectures différées et annulations. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const Engine = require('../src/exploration-audio.js');

class MockAudio {
  constructor() {
    this.listeners = new Map(); this.requests = []; this.paused = true; this.ended = false;
    this.error = null; this.src = ''; this.currentSrc = ''; this.currentTime = 0;
    this.defaultPlaybackRate = 1; this.playbackRate = 1; this.preservesPitch = false;
  }
  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(fn);
  }
  removeEventListener(type, fn) { if (this.listeners.has(type)) this.listeners.get(type).delete(fn); }
  handlers(type) { return [...(this.listeners.get(type) || [])]; }
  emit(type) { this.handlers(type).forEach(fn => fn()); }
  pause() { this.paused = true; }
  removeAttribute(name) { if (name === 'src') this.src = ''; }
  load() { this.currentSrc = this.src; this.ended = false; this.error = null; this.paused = true; this.playbackRate = this.defaultPlaybackRate; }
  play() {
    const request = {};
    request.promise = new Promise((resolve, reject) => { request.resolve = resolve; request.reject = reject; });
    this.requests.push(request); return request.promise;
  }
  begin() { this.paused = false; this.emit('playing'); this.requests.at(-1).resolve(); }
  finish() { this.ended = true; this.paused = true; this.emit('ended'); }
}
const flush = () => Promise.resolve();

(async function () {
  const clips = Object.freeze({ one: 'data:audio/mpeg;base64,b25l', two: 'data:audio/mpeg;base64,dHdv', blank: '', invalid: null });
  const audio = new MockAudio(); let creations = 0;
  const player = Engine.create({ clips, createAudio: () => { creations++; return audio; } });
  const events = [];
  const callbacks = label => ({ onStart: () => events.push(label + ':start'), onEnd: () => events.push(label + ':end'), onError: reason => events.push(label + ':' + reason) });
  assert.equal(player.getStatus(), 'idle'); assert.equal(player.getMuted(), false);
  assert.equal(player.has('one'), true);
  for (const key of ['missing', 'blank', 'invalid', '__proto__', 'constructor', null]) assert.equal(player.has(key), false);
  assert.equal(creations, 0, 'aucun élément requis pour inspecter le manifeste');

  assert.equal(player.play('one', callbacks('first')), 'loading');
  assert.deepEqual(events, [], 'aucun départ annoncé avant lecture');
  const oldEnd = audio.handlers('ended')[0];
  audio.begin(); await flush(); audio.emit('playing');
  assert.deepEqual(events, ['first:start'], 'playing + promesse ne doublent pas onStart');
  assert.equal(player.getStatus(), 'playing');
  audio.finish(); audio.finish();
  assert.deepEqual(events, ['first:start', 'first:end'], 'une seule fin naturelle');
  assert.equal(player.getStatus(), 'idle');

  player.play('two', callbacks('second')); audio.begin(); await flush();
  oldEnd(); audio.emit('ended');
  assert.equal(player.getStatus(), 'playing', 'ancienne fin et événement sans ended ne finissent pas la nouvelle lecture');
  player.stop(); audio.finish();
  assert.equal(player.getStatus(), 'idle'); assert.equal(audio.paused, true); assert.equal(audio.src, '');
  assert.ok(!events.includes('second:end'), 'stop ne rappelle jamais onEnd');

  player.play('one', callbacks('pending-stop')); const stopped = audio.requests.at(-1);
  const stoppedPlaying = audio.handlers('playing')[0]; const stoppedError = audio.handlers('error')[0];
  player.stop(); stopped.resolve(); stoppedPlaying(); stoppedError(); await flush();
  assert.equal(player.getStatus(), 'idle'); assert.ok(!events.some(x => x.startsWith('pending-stop:')));

  player.play('one', callbacks('replaced')); const replaced = audio.requests.at(-1);
  const replacedEnd = audio.handlers('ended')[0];
  player.play('two', callbacks('replacement')); audio.begin(); await flush();
  replaced.reject({ name: 'NotAllowedError' }); replacedEnd(); await flush();
  assert.equal(player.getStatus(), 'playing');
  assert.ok(!events.some(x => x.startsWith('replaced:')), 'une erreur tardive ne touche pas la lecture suivante');
  assert.equal(audio.currentSrc, clips.two); assert.equal(creations, 1, 'un seul élément pour toutes les sources');
  audio.finish(); assert.ok(events.includes('replacement:end'));

  player.play('one', callbacks('late-resolve')); const late = audio.requests.at(-1);
  player.play('two', callbacks('promise-only'));
  audio.paused = false; audio.requests.at(-1).resolve(); await flush();
  assert.equal(player.getStatus(), 'playing', 'la promesse résolue confirme aussi le départ');
  late.resolve(); await flush();
  assert.ok(!events.includes('late-resolve:start'));
  assert.equal(events.filter(x => x === 'promise-only:start').length, 1);
  audio.finish();

  const dialogue = [];
  player.play('one', { onStart: () => dialogue.push('one:start'), onEnd: () => {
    dialogue.push('one:end');
    player.play('two', { onStart: () => dialogue.push('two:start'), onEnd: () => dialogue.push('two:end') });
  } });
  audio.begin(); await flush(); audio.finish();
  assert.equal(player.getStatus(), 'loading', 'la seconde réplique attend son vrai départ');
  audio.begin(); await flush(); audio.finish();
  assert.deepEqual(dialogue, ['one:start', 'one:end', 'two:start', 'two:end']);
  assert.equal(creations, 1, 'les deux répliques partagent le même élément');

  player.play('one', callbacks('blocked')); audio.requests.at(-1).reject({ name: 'NotAllowedError' }); await flush();
  assert.equal(player.getStatus(), 'blocked'); assert.ok(events.includes('blocked:blocked'));
  assert.ok(!events.includes('blocked:start') && !events.includes('blocked:end'));
  player.play('one', callbacks('retry')); audio.begin(); await flush(); audio.finish();
  assert.ok(events.includes('retry:end'), 'relecture explicite après refus');

  player.play('one', callbacks('error')); audio.begin(); await flush();
  audio.error = { code: 3 }; audio.emit('error'); audio.emit('error'); audio.finish();
  assert.equal(player.getStatus(), 'error'); assert.equal(events.filter(x => x === 'error:error').length, 1);
  assert.ok(!events.includes('error:end'), 'erreur de décodage sans fausse fin naturelle');
  player.play('missing', callbacks('missing')); assert.equal(player.getStatus(), 'error');
  assert.ok(events.includes('missing:missing')); assert.equal(creations, 1);

  player.play('one', callbacks('mute-pending')); const mutedPending = audio.requests.at(-1);
  player.setMuted(true); mutedPending.resolve(); await flush();
  assert.equal(player.getStatus(), 'muted'); assert.equal(player.getMuted(), true);
  const count = audio.requests.length;
  assert.equal(player.play('two', callbacks('muted')), 'muted');
  assert.equal(audio.requests.length, count, 'aucun play en mode muet');
  player.setMuted(false); assert.equal(player.getStatus(), 'idle');
  assert.equal(audio.requests.length, count, 'retirer le mode muet ne reprend rien');
  assert.ok(!events.some(x => x.startsWith('mute-pending:') || x.startsWith('muted:')));
  player.play('two', callbacks('mute-playing')); audio.begin(); await flush(); player.setMuted(true); audio.finish();
  assert.ok(!events.includes('mute-playing:end')); player.setMuted(false);

  const noAudio = Engine.create({ clips, createAudio: () => { throw new Error('no device'); } });
  assert.equal(noAudio.play('one'), 'error'); noAudio.stop(); assert.equal(noAudio.getStatus(), 'idle');
  const broken = new MockAudio(); broken.play = () => { throw { name: 'NotAllowedError' }; };
  const synchronous = Engine.create({ clips, createAudio: () => broken });
  assert.equal(synchronous.play('one'), 'blocked');
  const unavailable = Engine.create(); assert.equal(unavailable.play('unknown'), 'error');

  // Le choix de vitesse précède la création du média et persiste entre les répliques.
  const slowAudio = new MockAudio(); let slowCreations = 0;
  slowAudio.webkitPreservesPitch = false; slowAudio.mozPreservesPitch = false;
  const slow = Engine.create({ clips, createAudio: () => { slowCreations++; return slowAudio; } });
  assert.equal(slow.getRate(), 1);
  slow.setRate(0.8);
  assert.equal(slow.getRate(), 0.8); assert.equal(slowCreations, 0, 'choisir une vitesse ne crée ni ne lance de son');
  const slowEvents = [];
  slow.play('one', { onStart: () => slowEvents.push('one:start'), onEnd: () => {
    slowEvents.push('one:end'); slow.setRate(0.8);
    slow.play('two', { onStart: () => slowEvents.push('two:start'), onEnd: () => slowEvents.push('two:end') });
  } });
  assert.equal(slowAudio.playbackRate, 0.8); assert.equal(slowAudio.defaultPlaybackRate, 0.8);
  for (const property of ['preservesPitch', 'webkitPreservesPitch', 'mozPreservesPitch']) assert.equal(slowAudio[property], true);
  slow.setRate(1); assert.equal(slow.getStatus(), 'loading', 'la vitesse ne coupe pas le chargement');
  slowAudio.begin(); await flush();
  slowAudio.currentTime = 2.5;
  const slowRequestCount = slowAudio.requests.length;
  slow.setRate(0.8);
  assert.equal(slowAudio.playbackRate, 0.8); assert.equal(slowAudio.defaultPlaybackRate, 0.8);
  assert.equal(slowAudio.currentTime, 2.5, 'changement pendant la réplique sans retour au début');
  assert.equal(slowAudio.paused, false); assert.equal(slowAudio.requests.length, slowRequestCount, 'aucune nouvelle lecture');
  assert.equal(slow.getStatus(), 'playing'); assert.deepEqual(slowEvents, ['one:start']);
  slow.setRate(1); slowAudio.finish();
  assert.equal(slow.getRate(), 0.8); assert.equal(slowAudio.playbackRate, 0.8, 'nouvelle vitesse entre les deux répliques');
  assert.equal(slowAudio.defaultPlaybackRate, 0.8); slowAudio.begin(); await flush(); slowAudio.finish();
  assert.deepEqual(slowEvents, ['one:start', 'one:end', 'two:start', 'two:end']);
  assert.equal(slowCreations, 1);

  slow.play('one', { onStart: () => slowEvents.push('stale:start'), onEnd: () => slowEvents.push('stale:end') });
  const ratePending = slowAudio.requests.at(-1);
  slow.setMuted(true); slow.setRate(1); slow.setRate(0.8); ratePending.resolve(); await flush();
  assert.equal(slow.getMuted(), true); assert.equal(slow.getStatus(), 'muted');
  assert.equal(slowAudio.playbackRate, 0.8); assert.equal(slowAudio.paused, true);
  const mutedRequests = slowAudio.requests.length;
  slow.setMuted(false); slow.stop(); slow.setRate(1);
  assert.equal(slow.getStatus(), 'idle'); assert.equal(slowAudio.requests.length, mutedRequests);
  assert.ok(!slowEvents.some(event => event.startsWith('stale:')), 'la vitesse ne réactive aucun callback annulé');
  for (const value of [0, -1, 2, 0.5, NaN, Infinity, '0.8', undefined, null, true, {}]) {
    slow.setRate(0.8); slow.setRate(value);
    assert.equal(slow.getRate(), 1, 'valeur invalide : vitesse normale');
    assert.equal(slowAudio.playbackRate, 1); assert.equal(slowAudio.defaultPlaybackRate, 1);
    assert.equal(slow.getMuted(), false); assert.equal(slow.getStatus(), 'idle');
  }
  assert.equal(slowAudio.requests.length, mutedRequests, 'aucun son à chaque réglage');

  // Une API absente ou un ancien setter non pris en charge ne bloque pas le lecteur.
  const legacyAudio = new MockAudio(); delete legacyAudio.preservesPitch;
  Object.defineProperty(legacyAudio, 'webkitPreservesPitch', { get: () => false, set: () => { throw new Error('unsupported'); } });
  legacyAudio.mozPreservesPitch = false;
  const legacy = Engine.create({ clips, createAudio: () => legacyAudio });
  legacy.setRate(0.8);
  assert.equal(legacy.play('one'), 'loading'); legacyAudio.begin(); await flush();
  assert.equal(legacy.getStatus(), 'playing'); assert.equal(legacyAudio.playbackRate, 0.8);
  assert.equal(legacyAudio.mozPreservesPitch, true); assert.equal('preservesPitch' in legacyAudio, false);
  legacy.setRate(1); assert.equal(legacyAudio.playbackRate, 1); legacy.stop();

  const sandbox = { self: {} };
  vm.runInNewContext(fs.readFileSync(require.resolve('../src/exploration-audio.js'), 'utf8'), sandbox);
  assert.equal(typeof sandbox.self.SVExplorationAudioEngine.create, 'function');
  assert.equal(sandbox.self.SVExplorationAudioEngine.create({ clips }).has('one'), true);
  console.log('✔ Audio : média unique, séquence, annulations, refus, mode muet et vitesse 1/0,8 avec hauteur préservée.');
})().catch(error => { console.error(error); process.exitCode = 1; });
