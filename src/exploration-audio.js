/* Cuéntalo — lecteur MP3 partagé. Aucun repli vers la synthèse vocale.
   Chaque lecture possède un jeton : un arrêt invalide aussi ses événements et promesses. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVExplorationAudioEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function create(options) {
    options = options || {};
    const clips = options.clips && typeof options.clips === 'object' ? options.clips : {};
    const makeAudio = typeof options.createAudio === 'function' ? options.createAudio : () => new Audio();
    let audio = null, generation = 0, active = null, muted = false, status = 'idle', rate = 1;

    function has(key) {
      return typeof key === 'string' && Object.prototype.hasOwnProperty.call(clips, key) &&
        typeof clips[key] === 'string' && clips[key].trim().length > 0;
    }
    function detach() {
      if (!audio || !active) return;
      for (const type of ['playing', 'ended', 'error']) audio.removeEventListener(type, active.handlers[type]);
    }
    function applyRate() {
      if (!audio) return;
      for (const property of ['preservesPitch', 'webkitPreservesPitch', 'mozPreservesPitch']) {
        try { if (property in audio) audio[property] = true; } catch (_) { /* API optionnelle selon le navigateur. */ }
      }
      try { audio.defaultPlaybackRate = rate; } catch (_) { /* Un ancien lecteur peut refuser ce réglage. */ }
      try { audio.playbackRate = rate; } catch (_) { /* La lecture reste utilisable à sa vitesse disponible. */ }
    }
    function stop() {
      generation++;
      detach(); active = null;
      if (audio) {
        try { audio.pause(); } catch (_) { /* Un média indisponible reste sans effet sur le jeu. */ }
        try { audio.currentTime = 0; } catch (_) { /* La source peut ne pas être chargée. */ }
        try { audio.removeAttribute('src'); audio.load(); } catch (_) { /* Interrompt aussi un play encore en attente. */ }
      }
      status = muted ? 'muted' : 'idle';
    }
    function play(key, callbacks) {
      stop();
      callbacks = callbacks || {};
      if (muted) return status;
      if (!has(key)) {
        status = 'error';
        if (typeof callbacks.onError === 'function') callbacks.onError('missing');
        return status;
      }
      try {
        if (!audio) audio = makeAudio();
        if (!audio) throw new Error('Audio unavailable');
      } catch (_) {
        status = 'error';
        if (typeof callbacks.onError === 'function') callbacks.onError('error');
        return status;
      }
      const token = generation, source = clips[key].trim();
      const current = () => token === generation && active && active.token === token && !muted;
      const sourceMatches = () => !audio.currentSrc || audio.currentSrc === source;
      function start() {
        if (!current() || active.started || !sourceMatches() || audio.paused) return;
        active.started = true; status = 'playing';
        if (typeof callbacks.onStart === 'function') callbacks.onStart();
      }
      function fail(reason) {
        if (!current()) return;
        stop(); status = reason === 'blocked' ? 'blocked' : 'error';
        if (typeof callbacks.onError === 'function') callbacks.onError(reason);
      }
      function end() {
        // Un événement ancien en attente peut atteindre les nouveaux écouteurs du même élément.
        if (!current() || !active.started || !sourceMatches() || !audio.ended) return;
        detach(); active = null; status = 'idle';
        if (typeof callbacks.onEnd === 'function') callbacks.onEnd();
      }
      active = { token, started: false, handlers: { playing: start, ended: end, error: () => {
        if (sourceMatches() && audio.error) fail('error');
      } } };
      status = 'loading';
      try {
        for (const type of ['playing', 'ended', 'error']) audio.addEventListener(type, active.handlers[type]);
        audio.loop = false; audio.preload = 'auto'; audio.src = source; audio.load(); applyRate();
        const pending = audio.play();
        if (pending && typeof pending.then === 'function') pending.then(start, error => {
          fail(error && error.name === 'NotAllowedError' ? 'blocked' : 'error');
        });
      } catch (error) {
        fail(error && error.name === 'NotAllowedError' ? 'blocked' : 'error');
      }
      return status;
    }
    function setMuted(value) {
      const next = !!value;
      if (next === muted) return;
      muted = next;
      if (muted) stop(); else status = 'idle';
    }
    // Ce réglage reste commun aux répliques sans relancer le son ni modifier leur jeton.
    function setRate(value) { rate = value === 0.8 ? 0.8 : 1; applyRate(); return rate; }
    return Object.freeze({ has, play, stop, setMuted, setRate, getMuted: () => muted, getRate: () => rate, getStatus: () => status });
  }
  return Object.freeze({ create });
});
