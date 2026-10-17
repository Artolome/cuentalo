/* Cuéntalo — choix pur des images d'animation. elapsedMs et durées en millisecondes.
   Le rendu garde le sprite d'origine au repos ; ce module ne lit ni DOM ni assets. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVExplorationMotionEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const durations = Object.freeze({ talk: 1800, paint: 2200, reach: 650 });

  function actionFor(kind) {
    return kind === 'sancho' ? 'talk' : kind === 'canvas' ? 'paint' : 'reach';
  }

  function duration(action) {
    return Object.prototype.hasOwnProperty.call(durations, action) ? durations[action] : durations.reach;
  }

  /** Marche : cycle complet en 650 ms. Parole : une image chaque 280 ms.
      Peinture : aller-retour en 1 400 ms, sans doubler les images aux extrémités.
      Les entrées invalides et les mouvements réduits restent sur la première image. */
  function frameIndex(action, elapsedMs, count, reducedMotion) {
    if (reducedMotion || !Number.isSafeInteger(count) || count < 2 ||
        !Number.isFinite(elapsedMs) || elapsedMs <= 0) return 0;

    if (action === 'walk') {
      return Math.min(count - 1, Math.floor((elapsedMs % 650) / 650 * count));
    }
    if (action === 'talk') {
      return Math.floor(elapsedMs / 280) % count;
    }
    if (action === 'paint') {
      const steps = 2 * (count - 1);
      const step = Math.min(steps - 1, Math.floor((elapsedMs % 1400) / 1400 * steps));
      return Math.min(count - 1, step < count ? step : steps - step);
    }
    return 0;
  }

  return Object.freeze({ frameIndex, actionFor, duration, durations });
});
