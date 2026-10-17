/* Cuéntalo — exploration pure : progression, validation du stockage et proximité.
   Coordonnées monde 1000×560 ; move reçoit dt en secondes. Aucun DOM ni accès au stockage. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVExplorationEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const VERSION = 1, KEY = 'cuentalo.exploration.v1';
  const SPEED = 220, RADIUS = 90, MAX_DT = 0.1;
  const BOUNDS = Object.freeze({ minX: 55, maxX: 945, minY: 290, maxY: 510 });
  const object = v => !!v && typeof v === 'object' && !Array.isArray(v);
  const own = (v, key) => object(v) && Object.prototype.hasOwnProperty.call(v, key) ? v[key] : undefined;
  const safeId = id => typeof id === 'string' && id.length > 0 && !['__proto__', 'constructor', 'prototype'].includes(id);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const missionsOf = world => Array.isArray(world.missions) ? world.missions : [];

  function worldsOf(data) {
    const seen = new Set();
    return object(data) && Array.isArray(data.worlds) ? data.worlds.filter(w => {
      if (!object(w) || !safeId(w.id) || seen.has(w.id)) return false;
      seen.add(w.id); return true;
    }) : [];
  }
  function targetIds(mission) {
    if (!object(mission) || !safeId(mission.id) || !Array.isArray(mission.targets) || !Array.isArray(mission.objects)) return [];
    const available = new Set(mission.objects.filter(object).map(o => o.id));
    return [...new Set(mission.targets.filter(id => safeId(id) && available.has(id)))];
  }
  function requiredFor(mission) {
    const targets = targetIds(mission);
    return Number.isInteger(mission && mission.count) && mission.count > 0 && mission.count <= targets.length ? mission.count : 0;
  }
  function cleanCollected(mission, value) {
    if (!Array.isArray(value)) return [];
    const targets = new Set(targetIds(mission));
    return [...new Set(value.filter(id => typeof id === 'string' && targets.has(id)))].slice(0, requiredFor(mission));
  }

  /** Les missions précédentes gardent leurs cibles pour prouver la progression, pas seulement un index. */
  function normalize(data, raw) {
    if (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch (_) { raw = null; } }
    const saved = object(raw) && raw.version === VERSION && object(raw.worlds) ? raw : {};
    const worlds = worldsOf(data), state = { version: VERSION, lastWorld: null, worlds: {} };
    if (worlds.some(w => w.id === saved.lastWorld)) state.lastWorld = saved.lastWorld;
    for (const world of worlds) {
      const missions = missionsOf(world), last = missions.length - 1;
      const value = own(saved.worlds, world.id), previous = object(value) ? value : {};
      let index = Number.isInteger(previous.index) ? clamp(previous.index, 0, Math.max(0, last)) : 0;
      const collected = {};
      for (let i = 0; i <= index && i < missions.length; i++) {
        const mission = missions[i], required = requiredFor(mission);
        const ids = cleanCollected(mission, own(previous.missions, mission && mission.id));
        if (ids.length) collected[mission.id] = ids;
        if (!required || ids.length < required) { index = i; break; }
      }
      const current = missions[index], currentIds = own(collected, current && current.id) || [];
      const completed = previous.completed === true && last >= 0 && index === last
        && requiredFor(current) > 0 && currentIds.length >= requiredFor(current);
      state.worlds[world.id] = { index, missions: collected, completed };
    }
    return state;
  }

  function progress(data, raw, worldId) {
    const state = normalize(data, raw), world = worldsOf(data).find(w => w.id === worldId);
    if (!world) return { index: 0, mission: null, total: 0, collected: [], count: 0, required: 0, ready: false, completed: false, started: false };
    const value = state.worlds[worldId], missions = missionsOf(world), mission = missions[value.index] || null;
    const collected = own(value.missions, mission && mission.id) || [], required = requiredFor(mission);
    return { index: value.index, mission, total: missions.length, collected, count: collected.length, required,
      ready: required > 0 && collected.length >= required, completed: value.completed,
      started: Object.values(value.missions).some(ids => ids.length > 0) };
  }

  function clampPlayer(player) {
    const p = object(player) ? player : {};
    return { x: clamp(Number.isFinite(p.x) ? p.x : 500, BOUNDS.minX, BOUNDS.maxX),
      y: clamp(Number.isFinite(p.y) ? p.y : 470, BOUNDS.minY, BOUNDS.maxY) };
  }
  function distance(a, b) {
    return object(a) && object(b) && [a.x, a.y, b.x, b.y].every(Number.isFinite) ? Math.hypot(a.x - b.x, a.y - b.y) : Infinity;
  }
  function near(player, target) { return distance(player, target) <= RADIUS; }
  function move(player, dx, dy, dt) {
    const p = clampPlayer(player);
    dx = Number.isFinite(dx) ? dx : 0; dy = Number.isFinite(dy) ? dy : 0;
    const magnitude = Math.hypot(dx, dy);
    if (magnitude > 1) { dx /= magnitude; dy /= magnitude; }
    const duration = Number.isFinite(dt) ? clamp(dt, 0, MAX_DT) : 0;
    return clampPlayer({ x: p.x + dx * SPEED * duration, y: p.y + dy * SPEED * duration });
  }

  function interact(data, raw, worldId, objectId, player) {
    const state = normalize(data, raw), p = progress(data, state, worldId);
    const result = (event, message) => ({ state, event, message });
    if (!p.mission || !p.required) return result('wrong', 'Elige un lugar para explorar.');
    if (p.completed) return result('done', '¡La aventura está completa!');
    const target = Array.isArray(p.mission.objects) && p.mission.objects.find(o => object(o) && o.id === objectId);
    if (!target) return result('wrong', 'Busca un objeto de esta misión.');
    // Ne pas transformer une position invalide en une téléportation près d'une cible.
    if (!near(player, target)) return result('far', 'Acércate un poco.');
    if (!targetIds(p.mission).includes(objectId)) return result('wrong', 'Busca otro objeto.');
    state.lastWorld = worldId;
    if (p.collected.includes(objectId)) return result(p.ready ? 'complete' : 'collected', 'Ya está recogido.');
    if (p.ready) return result('complete', p.mission.success || '¡Misión cumplida!');
    const ids = p.collected.concat(objectId);
    state.worlds[worldId].missions[p.mission.id] = ids;
    return result(ids.length >= p.required ? 'complete' : 'collected', ids.length >= p.required ? p.mission.success || '¡Misión cumplida!' : '¡Bien!');
  }

  function next(data, raw, worldId) {
    const state = normalize(data, raw), p = progress(data, state, worldId);
    if (!p.ready || p.completed) return state;
    state.lastWorld = worldId;
    if (p.index + 1 < p.total) state.worlds[worldId].index++;
    else state.worlds[worldId].completed = true;
    return state;
  }
  function restart(data, raw, worldId) {
    const state = normalize(data, raw);
    if (worldsOf(data).some(w => w.id === worldId)) {
      state.worlds[worldId] = { index: 0, missions: {}, completed: false };
      state.lastWorld = worldId;
    }
    return state;
  }
  return { VERSION, KEY, SPEED, RADIUS, MAX_DT, BOUNDS, normalize, progress, interact, next, restart, clampPlayer, distance, near, move };
});
