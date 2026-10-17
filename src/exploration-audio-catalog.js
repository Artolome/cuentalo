/* Cuéntalo — catalogue pur des prises espagnoles, commun au générateur et au build. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVExplorationAudioCatalog = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const profiles = {
    don_quijote: {
      hero: 'es-ES-AlvaroNeural',
      speakers: { quijote: ['es-ES-AlvaroNeural', '-4%', '+0Hz'], sancho: ['es-ES-AlvaroNeural', '-2%', '-8Hz'] }
    },
    macondo: {
      hero: 'es-CO-SalomeNeural',
      speakers: { ursula: ['es-CO-SalomeNeural', '-4%', '+0Hz'], vecina: ['es-CO-SalomeNeural', '-4%', '+3Hz'] }
    },
    borges: {
      hero: 'es-AR-TomasNeural',
      speakers: { bibliotecario: ['es-AR-TomasNeural', '-4%', '+0Hz'], visitante: ['es-AR-ElenaNeural', '-4%', '+0Hz'] }
    },
    frida: {
      hero: 'es-MX-DaliaNeural',
      speakers: { frida: ['es-MX-DaliaNeural', '-4%', '+0Hz'], visitante: ['es-MX-JorgeNeural', '-4%', '+0Hz'] }
    }
  };

  function create(D, N, L) {
    if (!D || !Array.isArray(D.worlds) || !N || !N.worlds || !L || !L.worlds) {
      throw new TypeError('Se necesitan los datos, relatos y diálogos de exploración.');
    }
    const entries = [], keys = new Set();
    function add(key, text, voice, rate, pitch) {
      if (typeof text !== 'string' || !text.trim() || keys.has(key)) throw new Error('Entrada de audio inválida: ' + key);
      keys.add(key);
      entries.push({ key, text, voice, rate, pitch, file: key + '.mp3' });
    }
    D.worlds.forEach(world => {
      const id = world.id, profile = profiles[id], story = N.worlds[id], dialogue = L.worlds[id];
      if (!profile || !story || !dialogue || !Array.isArray(world.missions) ||
          !Array.isArray(story.chapters) || !Array.isArray(dialogue.chapters) ||
          story.chapters.length !== world.missions.length || dialogue.chapters.length !== world.missions.length) {
        throw new Error('Contenido de audio incompleto: ' + id);
      }
      const narrate = (key, text) => add(key, text, profile.hero, '-6%', '+0Hz');
      narrate(id + '.intro', story.intro.title + '. ' + story.intro.text);
      world.missions.forEach((mission, i) => {
        ['easy', 'normal'].forEach(level => narrate(id + '.goal.' + i + '.' + level, mission.goal[level]));
        const chapter = story.chapters[i];
        narrate(id + '.story.' + i, chapter.title + '. ' + chapter.text);
        if (!Array.isArray(dialogue.chapters[i]) || dialogue.chapters[i].length !== 2) throw new Error('Se esperan dos réplicas: ' + id + '.' + i);
        dialogue.chapters[i].forEach((line, j) => {
          const speaker = profile.speakers[line.speaker];
          if (!speaker) throw new Error('Voz desconocida: ' + id + '.' + line.speaker);
          add(id + '.dialogue.' + i + '.' + j, line.text, speaker[0], speaker[1], speaker[2]);
        });
      });
      narrate(id + '.summary', story.title + '. ' + story.summary);
    });
    return entries;
  }
  return Object.freeze({ create });
});
