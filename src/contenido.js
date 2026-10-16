/* Cuéntalo — contenido (datos puros, sin DOM).
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
      regla_fr: 'El helicóptero llega → está a salvo. Si está perdido/a (seul·e) → el helicóptero no lo ve. Un personnage a salvo ne peut plus apparaître ensuite.' },
    // Append-only : les codes Auteur v1 utilisent les indices sur 5 bits.
    { id: 'sant_jordi', nombre: 'Sant Jordi', emoji: '📚', slots: 2, color: '#bb6576', cultural: true,
      regla_fr: 'Seul : choisit un livre. À deux : celui qui a le livre le partage avec celui qui n’en a pas encore.' },
    { id: 'alhambra', nombre: 'La Alhambra', emoji: '🏛️', slots: 2, color: '#c59670', cultural: true,
      regla_fr: 'Sans plan : cherche les patios et se perd. Un visiteur qui a consulté le plan au centre peut guider son ami perdu.' },
    { id: 'ofrenda', nombre: 'La ofrenda', emoji: '🌼', slots: 2, color: '#d69342', cultural: true,
      regla_fr: 'Seul : évoque un proche avec affection. À deux, après ce souvenir et la préparation de papier au taller : préparent une ofrenda.' },
    { id: 'mercado_cusco', nombre: 'El mercado de Cusco', emoji: '🥔', slots: 2, color: '#bc784e', cultural: true,
      regla_fr: 'Seul : achète un repas à partager. À deux : celui qui a acheté partage avec son ami qui a faim.' },
    { id: 'tango', nombre: 'El tango', emoji: '🎶', slots: 2, color: '#a46a76', cultural: true,
      regla_fr: 'Répéter fatigue. Après avoir répété puis récupéré au centre, les deux dansent ensemble.' },
    { id: 'barriletes', nombre: 'Los barriletes', emoji: '🪁', slots: 2, color: '#bc8d59', cultural: true,
      regla_fr: 'À deux, avec leurs décorations de papier : construisent un cerf-volant. À la visite suivante, l’exposent ensemble ; aucun envol de géant.' },
    { id: 'plaza_cultural', nombre: 'La plaza', emoji: '🏘️', slots: 2, color: '#c4a279', cultural: true,
      regla_fr: 'Se promener donne faim et fatigue. La place reste dans le pays du niveau.' },
    { id: 'taller_cultural', nombre: 'El taller', emoji: '✂️', slots: 2, color: '#a99b6b', cultural: true,
      regla_fr: 'Prépare du papier décoré, seul ou ensemble. Cette préparation sert ensuite à une création ou à des étiquettes.' },
    { id: 'centro_cultural', nombre: 'El centro cultural', emoji: '🗺️', slots: 2, color: '#829b96', cultural: true,
      regla_fr: 'Consulte un plan et se repose : garde le souvenir du plan, n’est plus perdu ni fatigué.' },
    { id: 'don_quijote', nombre: 'Los molinos', emoji: '🌬️', slots: 2, color: '#c7ae7d', cultural: true,
      regla_fr: 'Fiction inspirée de Don Quichotte. Seul : imagine des géants et prend peur. Un ami muni du plan l’aide à reconnaître les moulins.' },
    { id: 'macondo', nombre: 'Macondo', emoji: '🏡', slots: 2, color: '#91a775', cultural: true,
      regla_fr: 'Fiction inspirée du roman. Seul : oublie les noms. Un ami qui a préparé du papier l’aide à écrire des étiquettes.' },
    { id: 'biblioteca_borges', nombre: 'La biblioteca laberinto', emoji: '📖', slots: 2, color: '#9b876e', cultural: true,
      regla_fr: 'Fiction inspirée de Borges. Seul sans plan : se perd. Un ami qui a consulté le plan guide vers la sortie.' },
    { id: 'casa_azul', nombre: 'La Casa Azul', emoji: '🎨', slots: 2, color: '#438bb0', cultural: true,
      regla_fr: 'Les personnages visitent le musée : seul, observe un autoportrait. Après avoir préparé du papier, peint son propre portrait aidé par un ami.' }
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

    /* ===== Capítulo 4 · Viajes y culturas ===== */
    { id: 'c4n1', capitulo: 4, titulo: 'Lucía comparte un libro con Mateo', viñetas: 3,
      escenas: ['sant_jordi', 'plaza_cultural', 'centro_cultural'], personajes: ['lucia', 'mateo'],
      objetivo: { tipo: 'evento', evento: 'comparteLibro', quien: 'lucia', a: 'mateo' },
      pistas: ['Primero, Lucía elige un libro sola en el puesto.', 'Después, Lucía y Mateo están juntos en Sant Jordi.'],
      cultura: { pais: 'España', lugar: 'Barcelona · Sant Jordi', dato: 'El 23 de abril, Barcelona celebra Sant Jordi. La gente regala libros y rosas.', palabras: ['libro', 'rosa', 'elegir', 'compartir'],
        fuente: 'https://www.spain.info/en/discover-spain/fiesta-sant-jordi-barcelona/' } },
    { id: 'c4n2', capitulo: 4, titulo: 'Valeria guía a Diego por los patios de la Alhambra', viñetas: 3,
      escenas: ['alhambra', 'centro_cultural', 'plaza_cultural'], personajes: ['valeria', 'diego'],
      objetivo: { tipo: 'evento', evento: 'visitaPatios', quien: 'valeria', a: 'diego' },
      pistas: ['Diego busca los patios sin un plano.', 'Valeria consulta el plano en el centro cultural.', 'Después, los dos visitan la Alhambra juntos.'],
      cultura: { pais: 'España', lugar: 'Granada · La Alhambra', dato: 'La Alhambra y el Generalife están en Granada. En el Generalife hay jardines y canales de agua.', palabras: ['palacio', 'patio', 'fuente', 'plano', 'guiar'],
        fuente: 'https://www.alhambra-patronato.es/patio-de-la-acequia-del-generalife-ocho-siglos-en-un-jardin' } },
    { id: 'c4n3', capitulo: 4, titulo: 'Lucía y Diego preparan una ofrenda', viñetas: 3,
      escenas: ['ofrenda', 'taller_cultural', 'centro_cultural'], personajes: ['lucia', 'diego'],
      objetivo: { tipo: 'evento', evento: 'preparaOfrenda', quien: 'lucia', a: 'diego' },
      pistas: ['Primero, alguien recuerda a un ser querido ante la ofrenda.', 'Los dos preparan papel decorado en el taller.', 'Después, los dos preparan la ofrenda con respeto.'],
      cultura: { pais: 'México', lugar: 'Día de Muertos', dato: 'En México, muchas familias recuerdan a sus seres queridos en el Día de Muertos. Preparan ofrendas con flores, fotos y papel picado.', palabras: ['ofrenda', 'flor', 'recuerdo', 'papel', 'recordar'],
        fuente: 'https://www.inah.gob.mx/foto-del-dia/ofrendas-para-los-muertos' } },
    { id: 'c4n4', capitulo: 4, titulo: 'Mateo comparte un almuerzo con Valeria', viñetas: 3,
      escenas: ['mercado_cusco', 'plaza_cultural', 'centro_cultural'], personajes: ['mateo', 'valeria'],
      objetivo: { tipo: 'evento', evento: 'comparteMercado', quien: 'mateo', a: 'valeria' },
      pistas: ['Caminar por la plaza da hambre a Valeria.', 'Mateo compra comida solo en el mercado.', 'Después, se reúnen en el mercado para compartir.'],
      cultura: { pais: 'Perú', lugar: 'Cusco · Mercado de San Pedro', dato: 'En el mercado de San Pedro, en Cusco, hay alimentos de la región.', palabras: ['mercado', 'almuerzo', 'comprar', 'compartir', 'hambre'],
        fuente: 'https://www.peru.travel/es/atractivos/mercado-san-pedro' } },
    { id: 'c4n5', capitulo: 4, titulo: 'Valeria y Diego bailan el tango', viñetas: 3,
      escenas: ['tango', 'centro_cultural', 'plaza_cultural'], personajes: ['valeria', 'diego'],
      objetivo: { tipo: 'evento', evento: 'bailaTango', quien: 'valeria', a: 'diego' },
      pistas: ['Primero, los dos ensayan el tango.', 'Ensayar cansa: los dos descansan en el centro cultural.', 'Después, vuelven juntos a bailar.'],
      cultura: { pais: 'Argentina y Uruguay', lugar: 'Río de la Plata', dato: 'El tango es música y baile de Argentina y Uruguay. En una milonga, las personas se reúnen para bailar.', palabras: ['tango', 'música', 'ensayar', 'bailar', 'descansar'],
        fuente: 'https://ich.unesco.org/es/RL/el-tango-00258?RL=00258' } },
    { id: 'c4n6', capitulo: 4, titulo: 'Lucía y Mateo exponen un barrilete', viñetas: 3,
      escenas: ['barriletes', 'taller_cultural', 'plaza_cultural'], personajes: ['lucia', 'mateo'],
      objetivo: { tipo: 'evento', evento: 'exponeBarrilete', quien: 'lucia', a: 'mateo' },
      pistas: ['Los dos preparan papel decorado en el taller.', 'Después, construyen juntos un barrilete.', 'Una vez construido, vuelven juntos para exponerlo.'],
      cultura: { pais: 'Guatemala', lugar: 'Sumpango y Santiago Sacatepéquez', dato: 'En Sumpango y Santiago Sacatepéquez, los grupos hacen barriletes gigantes. Usan papel de colores y los muestran en una fiesta.', palabras: ['barrilete', 'papel', 'color', 'construir', 'exponer'],
        fuente: 'https://noticias.mcd.gob.gt/2024/05/28/barriletes-sumpango/' } },

    /* ===== Capítulo 5 · Libros y artistas ===== */
    { id: 'c5n1', capitulo: 5, titulo: 'Mateo ayuda a Lucía a reconocer los molinos', viñetas: 3,
      escenas: ['don_quijote', 'centro_cultural', 'plaza_cultural'], personajes: ['lucia', 'mateo'],
      objetivo: { tipo: 'evento', evento: 'reconoceMolinos', quien: 'mateo', a: 'lucia' },
      pistas: ['Lucía mira los molinos sola e imagina gigantes.', 'Mateo consulta un plano en el centro cultural.', 'Después, los dos miran los molinos juntos.'],
      cultura: { pais: 'España', lugar: 'La Mancha · aventura de ficción', obra: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', ficcion: true,
        dato: 'Aventura inspirada en Don Quijote: el personaje de Cervantes confunde molinos de viento con gigantes.', palabras: ['molino', 'gigante', 'imaginar', 'reconocer', 'plano'],
        fuente: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte1/cap08/default.htm' } },
    { id: 'c5n2', capitulo: 5, titulo: 'Valeria ayuda a Diego a recordar los nombres', viñetas: 3,
      escenas: ['macondo', 'taller_cultural', 'plaza_cultural'], personajes: ['valeria', 'diego'],
      objetivo: { tipo: 'evento', evento: 'etiquetaRecuerdos', quien: 'valeria', a: 'diego' },
      pistas: ['En este pueblo de ficción, Diego olvida los nombres.', 'Valeria prepara papel para las etiquetas en el taller.', 'Después, los dos escriben los nombres en Macondo.'],
      cultura: { pais: 'Colombia · mundo literario', lugar: 'Macondo · pueblo ficticio', obra: 'Cien años de soledad', autor: 'Gabriel García Márquez', ficcion: true,
        dato: 'Macondo es un pueblo ficticio de Cien años de soledad. Esta aventura se inspira en el recuerdo y el olvido.', palabras: ['nombre', 'etiqueta', 'olvidar', 'recordar', 'escribir'],
        fuente: 'https://centrogabo.org/especiales/gabriel-garcia-marquez/donde/macondo-de-gabriel-garcia-marquez' } },
    { id: 'c5n3', capitulo: 5, titulo: 'Diego guía a Mateo hasta la salida de la biblioteca', viñetas: 3,
      escenas: ['biblioteca_borges', 'centro_cultural', 'plaza_cultural'], personajes: ['mateo', 'diego'],
      objetivo: { tipo: 'evento', evento: 'saleLaberinto', quien: 'diego', a: 'mateo' },
      pistas: ['Mateo entra solo y se pierde entre los libros.', 'Diego consulta el plano en el centro cultural.', 'Después, Diego ayuda a Mateo en la biblioteca.'],
      cultura: { pais: 'Argentina · mundo literario', lugar: 'Biblioteca laberinto · ficción', autor: 'Jorge Luis Borges', ficcion: true,
        dato: 'Los libros y los laberintos aparecen en la obra de Borges. Esta biblioteca es una aventura inventada inspirada en esos temas.', palabras: ['biblioteca', 'laberinto', 'salida', 'libro', 'guiar'],
        fuente: 'https://www.cervantes.es/bibliotecas_documentacion_espanol/biografias/nueva_york_jorge_luis_borges.htm' } },
    { id: 'c5n4', capitulo: 5, titulo: 'Lucía pinta un autorretrato con Valeria', viñetas: 3,
      escenas: ['casa_azul', 'taller_cultural', 'centro_cultural'], personajes: ['lucia', 'valeria'],
      objetivo: { tipo: 'evento', evento: 'pintaAutorretrato', quien: 'lucia', a: 'valeria' },
      pistas: ['Lucía observa un autorretrato en la Casa Azul.', 'Después, prepara papel para dibujar en el taller.', 'Lucía pinta su propia cara y Valeria la ayuda con los colores.'],
      cultura: { pais: 'México', lugar: 'Coyoacán · Museo Frida Kahlo', artista: 'Frida Kahlo',
        dato: 'Frida Kahlo vivió muchos años en la Casa Azul. Hoy es un museo. Los visitantes de esta aventura pintan sus propios autorretratos.', palabras: ['autorretrato', 'espejo', 'pintar', 'observar', 'color'],
        fuente: 'https://www.museofridakahlo.org.mx/museo/' } },

    /* ===== Nivel libre ===== */
    { id: 'libre', capitulo: 0, titulo: 'Mi historia', viñetas: 6, libre: true,
      escenas: ESCENAS.map(e => e.id), personajes: ['lucia', 'mateo', 'valeria', 'diego'],
      objetivo: null, pistas: [] }
  ];

  return { PERSONAJES, ESTADOS, OBJETOS, ESCENAS, NIVELES };
});
