/* Sobrevives — capa de lengua (sin DOM).
   Acuerdos de género/número, sujetos compuestos, conjugación presente / pretérito.
   Funciona en Node (tests) y en el navegador (window.SVLengua). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVLengua = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- adjetivos ----------
     base = masculino singular. 'inv' = invariable en género. */
  const ADJ = {
    cansado: { f: 'cansada', pl: 'cansados', fpl: 'cansadas' },
    herido: { f: 'herida', pl: 'heridos', fpl: 'heridas' },
    perdido: { f: 'perdida', pl: 'perdidos', fpl: 'perdidas' },
    solo: { f: 'sola', pl: 'solos', fpl: 'solas' },
    enfadado: { f: 'enfadada', pl: 'enfadados', fpl: 'enfadadas' },
    tranquilo: { f: 'tranquila', pl: 'tranquilos', fpl: 'tranquilas' },
    mojado: { f: 'mojada', pl: 'mojados', fpl: 'mojadas' },
    contento: { f: 'contenta', pl: 'contentos', fpl: 'contentas' },
    juntos: { f: 'juntos', pl: 'juntos', fpl: 'juntas' },
    triste: { f: 'triste', pl: 'tristes', fpl: 'tristes' },
    'a salvo': { f: 'a salvo', pl: 'a salvo', fpl: 'a salvo' },
    nuevo: { f: 'nueva', pl: 'nuevos', fpl: 'nuevas' }
  };

  /** acuerdo('cansado', {g:'f', n:'pl'}) → 'cansadas' */
  function acuerdo(adj, gn) {
    const forms = ADJ[adj];
    if (!forms) return adj;
    const g = gn.g === 'f' ? 'f' : 'm', n = gn.n === 'pl' ? 'pl' : 'sg';
    if (n === 'sg') return g === 'f' ? forms.f : adj;
    return g === 'f' ? forms.fpl : forms.pl;
  }

  /** género-número de un grupo de personajes [{nombre, genero}] */
  function gn(personajes) {
    const list = Array.isArray(personajes) ? personajes : [personajes];
    const n = list.length > 1 ? 'pl' : 'sg';
    const g = list.every(p => p.genero === 'f') ? 'f' : 'm';
    return { g, n };
  }

  /** "Lucía" · "Lucía y Mateo" · "Lucía, Mateo y Diego" */
  function sujeto(personajes) {
    const list = Array.isArray(personajes) ? personajes : [personajes];
    const names = list.map(p => p.nombre);
    if (names.length === 1) return names[0];
    if (names.length === 2) return names[0] + ' y ' + names[1];
    return names.slice(0, -1).join(', ') + ' y ' + names[names.length - 1];
  }

  /* ---------- verbos ----------
     Formas de 3.ª persona: [sg, pl] en presente y en pretérito indefinido.
     'imp' = frases impersonales (llueve, hace calor, es de noche, hay) → pretérito en imperfecto,
     porque es la forma natural para el decorado del relato (decisión documentada en DECISIONS.md). */
  const V = {
    caminar: { pres: ['camina', 'caminan'], pret: ['caminó', 'caminaron'] },
    perderse: { pres: ['se pierde', 'se pierden'], pret: ['se perdió', 'se perdieron'] },
    encontrar: { pres: ['encuentra', 'encuentran'], pret: ['encontró', 'encontraron'] },
    encontrarse: { pres: ['se encuentra', 'se encuentran'], pret: ['se encontró', 'se encontraron'] },
    beber: { pres: ['bebe', 'beben'], pret: ['bebió', 'bebieron'] },
    cruzar: { pres: ['cruza', 'cruzan'], pret: ['cruzó', 'cruzaron'] },
    mojarse: { pres: ['se moja', 'se mojan'], pret: ['se mojó', 'se mojaron'] },
    tener: { pres: ['tiene', 'tienen'], pret: ['tuvo', 'tuvieron'] },
    estar: { pres: ['está', 'están'], pret: ['estuvo', 'estuvieron'] },
    ser: { pres: ['es', 'son'], pret: ['fue', 'fueron'] },
    seguir: { pres: ['sigue', 'siguen'], pret: ['siguió', 'siguieron'] },
    dormir: { pres: ['duerme', 'duermen'], pret: ['durmió', 'durmieron'] },
    comer: { pres: ['come', 'comen'], pret: ['comió', 'comieron'] },
    guardar: { pres: ['guarda', 'guardan'], pret: ['guardó', 'guardaron'] },
    compartir: { pres: ['comparte', 'comparten'], pret: ['compartió', 'compartieron'] },
    descansar: { pres: ['descansa', 'descansan'], pret: ['descansó', 'descansaron'] },
    curar: { pres: ['cura', 'curan'], pret: ['curó', 'curaron'] },
    pedir: { pres: ['pide', 'piden'], pret: ['pidió', 'pidieron'] },
    subir: { pres: ['sube', 'suben'], pret: ['subió', 'subieron'] },
    ver: { pres: ['ve', 'ven'], pret: ['vio', 'vieron'] },
    gritar: { pres: ['grita', 'gritan'], pret: ['gritó', 'gritaron'] },
    correr: { pres: ['corre', 'corren'], pret: ['corrió', 'corrieron'] },
    morder: { pres: ['muerde', 'muerden'], pret: ['mordió', 'mordieron'] },
    irse: { pres: ['se va', 'se van'], pret: ['se fue', 'se fueron'] },
    llegar: { pres: ['llega', 'llegan'], pret: ['llegó', 'llegaron'] },
    encender: { pres: ['enciende', 'encienden'], pret: ['encendió', 'encendieron'] },
    taparse: { pres: ['se tapa', 'se tapan'], pret: ['se tapó', 'se taparon'] },
    avisar: { pres: ['avisa', 'avisan'], pret: ['avisó', 'avisaron'] },
    hacer: { pres: ['hace', 'hacen'], pret: ['hizo', 'hicieron'] },
    llover: { pres: ['llueve', 'llueve'], pret: ['llovía', 'llovía'], imp: true },
    hacerImp: { pres: ['hace', 'hace'], pret: ['hacía', 'hacía'], imp: true },
    serImp: { pres: ['es', 'es'], pret: ['era', 'era'], imp: true },
    haber: { pres: ['hay', 'hay'], pret: ['había', 'había'], imp: true }
  };

  /** conj('tener', {n:'pl'}, 'pret') → 'tuvieron' */
  function conj(lema, gn, tiempo) {
    const v = V[lema];
    if (!v) throw new Error('verbo desconocido: ' + lema);
    const i = gn && gn.n === 'pl' ? 1 : 0;
    return (tiempo === 'pret' ? v.pret : v.pres)[i];
  }

  /** Mayúscula inicial respetando «¡» y «¿». */
  function cap(s) {
    const m = s.match(/^([¡¿]*)(.)(.*)$/s);
    return m ? m[1] + m[2].toUpperCase() + m[3] : s;
  }

  /** Une frases con espacio, limpiando dobles espacios. */
  function unir(frases) {
    return frases.filter(Boolean).map(s => s.trim()).join(' ').replace(/\s+/g, ' ');
  }

  /* Pictos (emoji) del léxico, por lema. Se usan en el panel «Léxico». */
  const PICTOS = {
    selva: '🌴', río: '🌊', sol: '🌞', tormenta: '⛈️', noche: '🌙', jaguar: '🐆', serpiente: '🐍',
    frutas: '🍌', fuego: '🔥', refugio: '🏕️', montaña: '⛰️', mapa: '🗺️', mochila: '🎒', cuerda: '🪢',
    manta: '🧣', linterna: '🔦', helicóptero: '🚁', comida: '🍞', agua: '💧',
    hambre: '🍽️', sed: '🥤', frío: '🥶', miedo: '😨', cansado: '😴', herido: '🤕', perdido: '❓',
    'a salvo': '🛟', amigos: '🤝', enfadado: '😠', contento: '😊', triste: '😢', solo: '🧍', juntos: '🧑‍🤝‍🧑', tranquilo: '😌',
    caminar: '🚶', beber: '🥤', comer: '🍴', dormir: '💤', encontrar: '🔍', cruzar: '🌉', correr: '🏃',
    gritar: '📣', compartir: '🤲', curar: '🩹', descansar: '🛌', subir: '🧗', ver: '👀', llover: '🌧️',
    'hacer calor': '🌡️', 'pedir perdón': '🙏', guardar: '📦', encender: '💡', morder: '🦷', avisar: '✋'
  };

  return { ADJ, V, PICTOS, acuerdo, gn, sujeto, conj, cap, unir };
});
