/* Cuéntalo — progression des histoires. Fonctions pures, sans DOM ni accès au stockage. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVHistoriasState = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const VERSION = 1;
  // Clé indépendante des étoiles, réglages, parties des puzzles et niveaux Auteur.
  const KEY = 'cuentalo.historias.v1';
  const objet = v => !!v && typeof v === 'object' && !Array.isArray(v);
  const propre = (v, key) => objet(v) && Object.prototype.hasOwnProperty.call(v, key) ? v[key] : undefined;
  const idValide = id => typeof id === 'string' && id.length > 0 && !['__proto__', 'prototype', 'constructor'].includes(id);
  const chapitres = story => Array.isArray(story.chapters) ? story.chapters : [];
  const choixValide = (chapter, id) => objet(chapter) && idValide(chapter.id) && typeof id === 'string'
    && Array.isArray(chapter.choices) && chapter.choices.some(c => objet(c) && c.id === id);

  function histoires(data) {
    const ids = new Set();
    return objet(data) && Array.isArray(data.stories) ? data.stories.filter(s => {
      if (!objet(s) || !idValide(s.id) || ids.has(s.id)) return false;
      ids.add(s.id); return true;
    }) : [];
  }

  /** Accepte un objet ou le JSON stocké. Ne conserve ni objets partagés ni champs inconnus. */
  function normalizar(data, raw) {
    if (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch (_) { raw = null; } }
    const saved = objet(raw) && raw.version === VERSION && objet(raw.stories) ? raw.stories : {};
    const state = { version: VERSION, stories: {} };
    for (const story of histoires(data)) {
      const chapters = chapitres(story), value = propre(saved, story.id);
      const previous = objet(value) ? value : {};
      const last = chapters.length - 1;
      let index = Number.isInteger(previous.index) ? Math.max(0, Math.min(previous.index, Math.max(0, last))) : 0;
      const choices = {};
      // Seul un préfixe répondu peut déverrouiller la suite. Des réponses futures injectées sont écartées.
      for (let i = 0; i <= index && i < chapters.length; i++) {
        const chapter = chapters[i], selected = objet(chapter) ? propre(previous.choices, chapter.id) : undefined;
        if (!choixValide(chapter, selected)) { index = i; break; }
        choices[chapter.id] = selected;
      }
      const completed = previous.completed === true && last >= 0 && index === last
        && Object.keys(choices).length === chapters.length;
      state.stories[story.id] = { index, choices, completed };
    }
    return state;
  }

  /** Répond à un chapitre déverrouillé ; les autres histoires restent intactes. */
  function elegir(data, raw, storyId, chapterIndex, choiceId) {
    const state = normalizar(data, raw), story = histoires(data).find(s => s.id === storyId);
    if (!story) return state;
    const progress = state.stories[storyId], chapters = chapitres(story);
    if (!Number.isInteger(chapterIndex) || chapterIndex < 0 || chapterIndex > progress.index || chapterIndex >= chapters.length) return state;
    const chapter = chapters[chapterIndex];
    if (choixValide(chapter, choiceId)) progress.choices[chapter.id] = choiceId;
    return state;
  }

  /** Un clic après la réponse ouvre le chapitre suivant ; au dernier, il termine l'histoire. */
  function avanzar(data, raw, storyId) {
    const state = normalizar(data, raw), story = histoires(data).find(s => s.id === storyId);
    if (!story) return state;
    const progress = state.stories[storyId], chapters = chapitres(story), chapter = chapters[progress.index];
    if (progress.completed || !choixValide(chapter, propre(progress.choices, chapter && chapter.id))) return state;
    if (progress.index + 1 < chapters.length) progress.index++;
    else progress.completed = true;
    return state;
  }

  function reiniciar(data, raw, storyId) {
    const state = normalizar(data, raw);
    if (histoires(data).some(s => s.id === storyId)) state.stories[storyId] = { index: 0, choices: {}, completed: false };
    return state;
  }

  /** Vue de lecture indépendante : l'UI peut relire tout index entre 0 et unlocked. */
  function progreso(data, raw, storyId) {
    const state = normalizar(data, raw), story = histoires(data).find(s => s.id === storyId);
    if (!story) return { index: 0, unlocked: -1, choices: {}, answered: 0, total: 0, completed: false, started: false, canAdvance: false };
    const progress = state.stories[storyId], chapters = chapitres(story), chapter = chapters[progress.index];
    const answered = Object.keys(progress.choices).length;
    return { index: progress.index, unlocked: chapters.length ? progress.index : -1, choices: progress.choices,
      answered, total: chapters.length, completed: progress.completed, started: answered > 0,
      canAdvance: !progress.completed && choixValide(chapter, propre(progress.choices, chapter && chapter.id)) };
  }

  return { VERSION, KEY, normalizar, elegir, avanzar, reiniciar, progreso };
});
