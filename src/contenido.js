/* Sobrevives — contenido (datos puros, sin DOM).
   Personajes, escenas (metadatos), niveles. Las reglas de las escenas viven en engine.js. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVContenido = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- Personajes ----------
     Procedencia: Lucía (Sobrevive · Charlemos), Mateo · Valeria · Diego (Charlemos), Kiwi el loro (Charlemos, mascota).
     color = color dominante de la silueta; accesorio = lo que lo hace reconocible de lejos. */
  const PERSONAJES = [
    { id: 'lucia', nombre: 'Lucía', genero: 'f', edad: 13, rasgo: 'alegre: canta siempre', accesorio: 'gorra rosa', color: '#e2558c', piel: '#8b5a3c', pelo: '#1f1a17' },
    { id: 'mateo', nombre: 'Mateo', genero: 'm', edad: 13, rasgo: 'siempre tiene hambre', accesorio: 'camiseta de fútbol azul', color: '#2c5a9a', piel: '#c98f62', pelo: '#1f1a17' },
    { id: 'valeria', nombre: 'Valeria', genero: 'f', edad: 14, rasgo: 'valiente: la exploradora', accesorio: 'cámara de fotos', color: '#dfa92c', piel: '#c98f62', pelo: '#1f1a17' },
    { id: 'diego', nombre: 'Diego', genero: 'm', edad: 15, rasgo: 'miedoso, pero cuenta historias', accesorio: 'cuaderno de dibujo', color: '#7a3b9e', piel: '#e7b78a', pelo: '#8b5a3c' },
    { id: 'kiwi', nombre: 'Kiwi', genero: 'm', animal: true, rasgo: 'el loro de Lucía: vuela y ve todo', accesorio: 'plumas verdes', color: '#4c8748', piel: '#4c8748', pelo: '#c4432e' }
  ];

  /* ---------- Estados ----------
     Booleanos por personaje. 'contento' es derivado (ningún estado negativo). */
  const ESTADOS = [
    { id: 'hambre', frase: 'tener hambre', tipo: 'tener', negativo: true },
    { id: 'sed', frase: 'tener sed', tipo: 'tener', negativo: true },
    { id: 'frio', frase: 'tener frío', tipo: 'tener', palabra: 'frío', negativo: true },
    { id: 'miedo', frase: 'tener miedo', tipo: 'tener', negativo: true },
    { id: 'cansado', frase: 'estar cansado/a', tipo: 'estar', negativo: true },
    { id: 'herido', frase: 'estar herido/a', tipo: 'estar', negativo: true },
    { id: 'perdido', frase: 'estar perdido/a', tipo: 'estar', negativo: true },
    { id: 'salvo', frase: 'estar a salvo', tipo: 'estar', palabra: 'a salvo', negativo: false },
    { id: 'contento', frase: 'estar contento/a', tipo: 'estar', derivado: true, negativo: false }
  ];

  const OBJETOS = [
    { id: 'mapa', nombre: 'el mapa', picto: '🗺️' },
    { id: 'cuerda', nombre: 'la cuerda', picto: '🪢' },
    { id: 'manta', nombre: 'la manta', picto: '🧣' },
    { id: 'linterna', nombre: 'la linterna', picto: '🔦' },
    { id: 'comida', nombre: 'la comida', picto: '🍞' }
  ];

  /* ---------- Escenas ----------
     slots: 1 o 2 personajes. regla_fr: ayuda para el profe (la regla real está en engine.js). */
  const ESCENAS = [
    { id: 'selva', nombre: 'La selva', emoji: '🌴', slots: 2, color: '#3f7a3a',
      regla_fr: 'Seul·e → se pierde (sauf avec el mapa). À deux → si l’un est perdu, l’autre lo encuentra ; sinon ils marchent ensemble : tienen hambre y están cansados.' },
    { id: 'rio', nombre: 'El río', emoji: '🌊', slots: 2, color: '#2c5a9a',
      regla_fr: 'Bebe agua → ya no tiene sed. Cruza el río : sans cuerda → se moja y tiene frío ; avec la cuerda (l’un des deux) → no se moja.' },
    { id: 'sol', nombre: 'El sol', emoji: '🌞', slots: 2, color: '#dfa92c',
      regla_fr: 'Hace mucho calor → tiene sed.' },
    { id: 'tormenta', nombre: 'La tormenta', emoji: '⛈️', slots: 2, color: '#4a4f6a',
      regla_fr: 'Llueve → tiene frío. Avec la manta (l’un des deux) → se tapa y no tiene frío. Seul·e → tiene miedo aussi.' },
    { id: 'noche', nombre: 'La noche', emoji: '🌙', slots: 2, color: '#1b2550',
      regla_fr: 'Seul·e → está solo/a y tiene miedo (sauf avec la linterna : duerme tranquilo/a). À deux → duermen juntos, ya no están cansados, no tienen miedo.' },
    { id: 'jaguar', nombre: 'El jaguar', emoji: '🐆', slots: 2, color: '#b8742a',
      regla_fr: 'Seul·e → tiene miedo, corre y se pierde (sauf avec el mapa : no se pierde). À deux → gritan juntos y el jaguar se va.' },
    { id: 'serpiente', nombre: 'La serpiente', emoji: '🐍', slots: 2, color: '#6b8e23',
      regla_fr: 'Seul·e → la serpiente le muerde : está herido/a. À deux → el otro la ve y avisa : nadie está herido.' },
    { id: 'frutas', nombre: 'El árbol de frutas', emoji: '🍌', slots: 2, color: '#8bb843',
      regla_fr: 'Come frutas → ya no tiene hambre. (Pas d’objet : la comida ne vient que de la mochila.)' },
    { id: 'fuego', nombre: 'El fuego', emoji: '🔥', slots: 2, color: '#c4432e',
      regla_fr: 'Hace fuego → ya no tiene frío. Avec comida et hambre → come. À deux, si un seul a de la comida : amigos → comparte ; sinon → come solo/a y el otro está enfadado/a.' },
    { id: 'refugio', nombre: 'El refugio', emoji: '🏕️', slots: 2, color: '#8b5a3c',
      regla_fr: 'Descansa → ya no está cansado/a, no tiene miedo. À deux : cura al herido ; pide perdón si uno está enfadado.' },
    { id: 'montana', nombre: 'La montaña', emoji: '⛰️', slots: 2, color: '#7d8a99',
      regla_fr: 'Sube la montaña → está cansado/a y tiene hambre. Desde arriba ve el río → ya no está perdido/a.' },
    { id: 'mapa', nombre: 'El mapa', emoji: '🗺️', slots: 1, color: '#e8d9a8',
      regla_fr: 'Encuentra el mapa → ya no está perdido/a y guarda el mapa (ya no se pierde).' },
    { id: 'mochila', nombre: 'La mochila', emoji: '🎒', slots: 1, color: '#c4432e',
      regla_fr: 'Encuentra una mochila con comida → come (ya no tiene hambre) y guarda la comida.' },
    { id: 'cuerda', nombre: 'La cuerda', emoji: '🪢', slots: 1, color: '#c98f62',
      regla_fr: 'Encuentra una cuerda → la guarda (para cruzar el río).' },
    { id: 'manta', nombre: 'La manta', emoji: '🧣', slots: 1, color: '#c4432e',
      regla_fr: 'Encuentra una manta → ya no tiene frío y la guarda (protege de la tormenta).' },
    { id: 'linterna', nombre: 'La linterna', emoji: '🔦', slots: 1, color: '#dfa92c',
      regla_fr: 'Encuentra una linterna → ya no tiene miedo y la guarda (protege de la noche).' },
    { id: 'rescate', nombre: 'El rescate', emoji: '🚁', slots: 2, color: '#86b3d4',
      regla_fr: 'El helicóptero llega → está a salvo. Si está perdido/a (seul·e) → el helicóptero no lo ve. Un personnage a salvo ne peut plus apparaître ensuite.' }
  ];

  /* Reglas generales (engine.js): dos personajes juntos en una viñeta → si uno está perdido, el otro lo encuentra;
     y se hacen amigos («Ahora X y Y son amigos.»), salvo cuando uno come y no comparte. */

  /* ---------- Niveles ----------
     objetivo: ver engine.js → evaluar(). pistas: en español sencillo. secreto: segundo título (capítulos 2 y 3). */
  const NIVELES = [
    /* ===== Capítulo 1 · Solo en la selva (3 viñetas, 1 personaje, 2-3 escenas) ===== */
    { id: 'c1n1', capitulo: 1, titulo: 'Lucía ya no tiene sed', viñetas: 3,
      escenas: ['sol', 'rio', 'fuego'], personajes: ['lucia'],
      objetivo: { tipo: 'yaNo', quien: 'lucia', estado: 'sed' },
      pistas: ['Primero hace calor… ¿y después?', 'En el río, Lucía bebe agua.'] },
    { id: 'c1n2', capitulo: 1, titulo: 'Mateo ya no tiene frío', viñetas: 3,
      escenas: ['rio', 'fuego'], personajes: ['mateo'],
      objetivo: { tipo: 'yaNo', quien: 'mateo', estado: 'frio' },
      pistas: ['Mateo se moja en el río.', 'El fuego quita el frío. ¡Cuidado con el orden!'] },
    { id: 'c1n3', capitulo: 1, titulo: 'Valeria duerme tranquila', viñetas: 3,
      escenas: ['noche', 'linterna', 'refugio'], personajes: ['valeria'],
      objetivo: { tipo: 'evento', evento: 'nocheLinterna', quien: 'valeria' },
      pistas: ['De noche y sola, Valeria tiene miedo.', 'Con la linterna, no tiene miedo.'] },
    { id: 'c1n4', capitulo: 1, titulo: 'Diego ya no está perdido', viñetas: 3,
      escenas: ['selva', 'montana', 'frutas'], personajes: ['diego'],
      objetivo: { tipo: 'yaNo', quien: 'diego', estado: 'perdido' },
      pistas: ['Si va solo por la selva, Diego se pierde.', 'Desde la montaña se ve el río.'] },
    { id: 'c1n5', capitulo: 1, titulo: 'Lucía está a salvo', viñetas: 3,
      escenas: ['selva', 'mapa', 'rescate'], personajes: ['lucia'],
      objetivo: { tipo: 'estado', quien: 'lucia', estado: 'salvo', valor: true },
      pistas: ['El helicóptero no ve a una persona perdida.', 'Con el mapa, Lucía no se pierde.'] },

    /* ===== Capítulo 2 · Juntos (3-4 viñetas, 2 personajes, 2-3 escenas) ===== */
    { id: 'c2n1', capitulo: 2, titulo: 'Mateo encuentra a Lucía', viñetas: 3,
      escenas: ['selva', 'noche', 'sol'], personajes: ['lucia', 'mateo'],
      objetivo: { tipo: 'evento', evento: 'encuentra', quien: 'mateo', a: 'lucia' },
      secreto: { tipo: 'y', partes: [{ tipo: 'evento', evento: 'nocheJuntos' }, { tipo: 'sinEvento', evento: 'nocheSolo' }] }, tituloSecreto: 'Nadie duerme solo',
      pistas: ['Primero, Lucía se pierde sola.', 'Después, Mateo y Lucía están juntos.'] },
    { id: 'c2n2', capitulo: 2, titulo: 'Valeria cura a Diego', viñetas: 3,
      escenas: ['serpiente', 'refugio'], personajes: ['valeria', 'diego'],
      objetivo: { tipo: 'evento', evento: 'cura', quien: 'valeria', a: 'diego' },
      secreto: { tipo: 'estado', quien: 'valeria', estado: 'herido', valor: true },
      pistas: ['Si Diego está solo, la serpiente le muerde.', 'En el refugio, el otro cura al herido.'] },
    { id: 'c2n3', capitulo: 2, titulo: 'Lucía y Mateo ya no tienen hambre', viñetas: 3,
      escenas: ['selva', 'frutas', 'noche'], personajes: ['lucia', 'mateo'],
      objetivo: { tipo: 'y', partes: [{ tipo: 'yaNo', quien: 'lucia', estado: 'hambre' }, { tipo: 'yaNo', quien: 'mateo', estado: 'hambre' }] },
      secreto: { tipo: 'nadie', estado: 'cansado' },
      pistas: ['Caminar juntos da hambre.', 'Las frutas quitan el hambre: ¡cuidado con el orden!'] },
    { id: 'c2n4', capitulo: 2, titulo: 'Nadie tiene miedo y todos tienen frío', viñetas: 3,
      escenas: ['noche', 'tormenta', 'jaguar'], personajes: ['valeria', 'diego'],
      objetivo: { tipo: 'y', partes: [{ tipo: 'nadie', estado: 'miedo' }, { tipo: 'todos', estado: 'frio', valor: true }] },
      secreto: { tipo: 'evento', evento: 'jaguarJuntos' },
      pistas: ['Juntos, no tienen miedo.', 'La tormenta da frío… y miedo a quien está solo.'] },
    { id: 'c2n5', capitulo: 2, titulo: 'Valeria encuentra a Mateo y todos están a salvo', viñetas: 3,
      escenas: ['selva', 'mapa', 'rescate'], personajes: ['valeria', 'mateo'],
      objetivo: { tipo: 'y', partes: [{ tipo: 'evento', evento: 'encuentra', quien: 'valeria', a: 'mateo' }, { tipo: 'todos', estado: 'salvo', valor: true }] },
      secreto: { tipo: 'evento', evento: 'mapa', quien: 'valeria' },
      pistas: ['El helicóptero no ve a una persona perdida.', '¿Quién necesita el mapa?'] },

    /* ===== Capítulo 3 · El grupo (4-6 viñetas, 2-3 personajes, 4-6 escenas) ===== */
    { id: 'c3n1', capitulo: 3, titulo: 'Lucía comparte la comida con Mateo', viñetas: 4,
      escenas: ['mochila', 'selva', 'fuego', 'noche'], personajes: ['lucia', 'mateo'],
      objetivo: { tipo: 'evento', evento: 'comparte', quien: 'lucia', a: 'mateo' },
      secreto: { tipo: 'nadie', estado: 'cansado' },
      pistas: ['Lucía necesita la mochila.', 'Mateo necesita tener hambre.', 'Solo se comparte con los amigos.'] },
    { id: 'c3n2', capitulo: 3, titulo: 'Mateo está enfadado con Lucía', viñetas: 4,
      escenas: ['mochila', 'montana', 'fuego', 'rio'], personajes: ['lucia', 'mateo'],
      objetivo: { tipo: 'enfadado', quien: 'mateo', con: 'lucia' },
      secreto: { tipo: 'estado', quien: 'mateo', estado: 'frio', valor: true },
      pistas: ['Si no son amigos, Lucía no comparte.', 'Mateo tiene hambre, pero Lucía no comparte.'] },
    { id: 'c3n3', capitulo: 3, titulo: 'Diego pide perdón a Lucía', viñetas: 4,
      escenas: ['mochila', 'montana', 'fuego', 'refugio'], personajes: ['lucia', 'diego'],
      objetivo: { tipo: 'evento', evento: 'perdon', quien: 'diego', a: 'lucia' },
      /* sin título secreto a propósito: es un nivel «enigma» de cadena única (2 soluciones) */
      pistas: ['Primero, Diego no comparte y Lucía está enfadada.', 'En el refugio se pide perdón.'] },
    { id: 'c3n4', capitulo: 3, titulo: 'Valeria duerme tranquila y todos están a salvo', viñetas: 4,
      escenas: ['noche', 'jaguar', 'linterna', 'rescate'], personajes: ['valeria', 'diego'],
      objetivo: { tipo: 'y', partes: [{ tipo: 'evento', evento: 'nocheLinterna', quien: 'valeria' }, { tipo: 'todos', estado: 'salvo', valor: true }] },
      secreto: { tipo: 'estado', quien: 'diego', estado: 'miedo', valor: true },
      pistas: ['Valeria necesita la linterna antes de la noche.', 'El helicóptero no ve a quien está perdido.'] },
    { id: 'c3n5', capitulo: 3, titulo: 'Diego encuentra a Lucía y todos están a salvo', viñetas: 5,
      escenas: ['selva', 'jaguar', 'noche', 'mapa', 'rescate'], personajes: ['lucia', 'mateo', 'diego'],
      objetivo: { tipo: 'y', partes: [{ tipo: 'evento', evento: 'encuentra', quien: 'diego', a: 'lucia' }, { tipo: 'todos', estado: 'salvo', valor: true }] },
      secreto: { tipo: 'nunca', quien: 'mateo', estado: 'miedo' },
      pistas: ['Primero, Lucía se pierde sola.', 'El helicóptero solo lleva a dos personas y no ve a quien está perdido.'] },
    { id: 'c3n6', capitulo: 3, titulo: 'Todos están contentos y a salvo', viñetas: 6,
      escenas: ['selva', 'rio', 'noche', 'frutas', 'refugio', 'rescate'], personajes: ['lucia', 'mateo', 'valeria'],
      inicial: { lucia: { hambre: true, cansado: true }, mateo: { hambre: true, cansado: true }, valeria: { hambre: true, cansado: true } },
      objetivo: { tipo: 'y', partes: [{ tipo: 'todos', estado: 'contento', valor: true }, { tipo: 'todos', estado: 'salvo', valor: true }] },
      secreto: { tipo: 'evento', evento: 'nocheJuntos', quien: 'lucia', a: 'valeria' },
      pistas: ['Al principio todos tienen hambre y están cansados.', 'Contento = sin hambre, sin sed, sin frío, sin miedo. Y no está cansado.', 'El helicóptero solo lleva a dos personas.'] },

    /* ===== Nivel libre ===== */
    { id: 'libre', capitulo: 0, titulo: 'Mi historia', viñetas: 6, libre: true,
      escenas: ESCENAS.map(e => e.id), personajes: ['lucia', 'mateo', 'valeria', 'diego'],
      objetivo: null, pistas: [] }
  ];

  return { PERSONAJES, ESTADOS, OBJETOS, ESCENAS, NIVELES };
});
