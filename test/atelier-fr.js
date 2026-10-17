/* Structured translation must keep the actual events, negatives and characters. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const C = require('../src/contenido.js');
const E = require('../src/engine.js');
const F = require('../src/atelier-fr.js');
let checks = 0;
function test(label, fn) { fn(); checks++; }
const level = (personajes, inicial = {}, extra = {}) => ({ personajes, inicial, escenas: C.ESCENAS.map(e => e.id), viñetas: 1, libre: true, objetivo: null, ...extra });
const panel = (escena, personajes) => ({ escena, personajes });
const narrate = (event, time = 'pres') => F.event(event, time).join(' ');

test('French runtime is available in a browser without Node or network', () => {
  const root = { SVContenido: C, SVEngine: E };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/atelier-fr.js'), 'utf8'), { self: root });
  assert.equal(typeof root.SVAtelierFrench.story, 'function');
  assert.equal(root.SVAtelierFrench.hint(C.NIVELES[0], 0), 'D’abord, il fait chaud… et ensuite ?');
});

test('every event produced by the engine has a French rendering in both tenses', () => {
  const engine = fs.readFileSync(path.join(__dirname, '../src/engine.js'), 'utf8');
  const phraseSection = engine.slice(engine.indexOf('function frasesDe('), engine.indexOf('const LEXICO_ESCENA'));
  const types = [...phraseSection.matchAll(/case '([^']+)'/g)].map(m => m[1]);
  assert.ok(types.length > 55);
  for (const tipo of types) for (const time of ['pres', 'pret']) {
    const text = F.event({ tipo, quien: 'lucia', a: 'mateo', quienes: ['lucia', 'valeria'], lugar: 'selva', sed: ['lucia'], cansados: ['lucia'], miedos: ['valeria'], hambre: ['lucia'], frio: ['valeria'], perdidos: ['lucia'], hambrientos: ['mateo'], motivo: 'sinPlano', solo: false }, time);
    assert.ok(Array.isArray(text) && text.length && text.every(line => typeof line === 'string' && line.length), tipo);
    assert.doesNotMatch(text.join(' '), /undefined|null|\[object|…/, tipo);
  }
  assert.equal(F.event({ tipo: 'futureUnknownEvent' }), null);
});

test('present and past retain feminine, masculine and mixed agreements', () => {
  assert.equal(narrate({ tipo: 'pierde', quien: 'lucia' }), 'Lucía marche seule dans la jungle et se perd.');
  assert.equal(narrate({ tipo: 'pierde', quien: 'lucia' }, 'pret'), 'Lucía a marché seule dans la jungle et s’est perdue.');
  assert.equal(narrate({ tipo: 'pierde', quien: 'mateo' }, 'pret'), 'Mateo a marché seul dans la jungle et s’est perdu.');
  assert.match(narrate({ tipo: 'seEncuentran', quienes: ['lucia', 'valeria'] }, 'pret'), /se sont retrouvées\. Elles n’étaient plus perdues/);
  assert.match(narrate({ tipo: 'seEncuentran', quienes: ['lucia', 'mateo'] }, 'pret'), /se sont retrouvés\. Ils n’étaient plus perdus/);
  assert.equal(narrate({ tipo: 'amigos', quienes: ['lucia', 'valeria'] }, 'pret'), 'Lucía et Valeria sont devenues amies.');
  assert.equal(narrate({ tipo: 'rescate', quienes: ['lucia', 'valeria'] }, 'pret'), 'L’hélicoptère ! Lucía et Valeria ont été sauvées.');
  assert.equal(narrate({ tipo: 'cuerda', quien: 'mateo' }, 'pret'), 'Mateo a trouvé une corde. Il l’a gardée.');
});

test('negations are attached to the right finite verb and object', () => {
  assert.match(narrate({ tipo: 'noPierde', quien: 'lucia' }, 'pret'), /ne s’est pas perdue/);
  assert.match(narrate({ tipo: 'serpienteAvisa', quien: 'valeria', a: 'diego' }, 'pret'), /Le serpent n’a mordu personne\./);
  assert.match(narrate({ tipo: 'comeSolo', quien: 'lucia', a: 'mateo' }, 'pret'), /n’a pas partagé\. Mateo avait faim et était en colère contre Lucía/);
  assert.equal(F.objective({ tipo: 'nadie', estado: 'hambre' }, level(['lucia', 'mateo'])), 'Personne n’a faim');
  assert.equal(F.objective({ tipo: 'nunca', estado: 'miedo' }, level(['lucia', 'mateo'])), 'Personne n’a jamais peur');
  assert.equal(F.objective({ tipo: 'estado', quien: 'valeria', estado: 'herido', valor: false }, level(['valeria'])), 'Valeria n’est pas blessée');
});

test('subset relief does not claim that both characters had the same problem', () => {
  const both = ['lucia', 'mateo'];
  assert.equal(narrate({ tipo: 'bebe', quienes: both, sed: ['lucia'] }), 'Lucía et Mateo boivent de l’eau de la rivière. Lucía n’a plus soif.');
  assert.equal(narrate({ tipo: 'bebe', quienes: both, sed: [] }), 'Lucía et Mateo boivent de l’eau de la rivière.');
  assert.equal(narrate({ tipo: 'bebe', quienes: both, sed: both }), 'Lucía et Mateo boivent de l’eau de la rivière. Ils n’ont plus soif.');
});

test('the storm keeps the blanket and loneliness branches', () => {
  const e = { tipo: 'tormenta', quienes: ['lucia'], solo: true };
  assert.equal(narrate(e), 'Il pleut beaucoup. Lucía a froid et peur.');
  assert.equal(narrate({ ...e, manta: true }, 'pret'), 'Il pleuvait beaucoup. Lucía s’est couverte avec la couverture et n’avait pas froid. Mais elle était seule et avait peur.');
  assert.equal(narrate({ ...e, quienes: ['lucia', 'valeria'], solo: false, manta: true }), 'Il pleut beaucoup. Lucía et Valeria se couvrent avec la couverture. Elles n’ont pas froid.');
});

test('weather and night appear before a reunion, preserving panel alignment', () => {
  const n = level(['lucia', 'mateo'], { lucia: { perdido: true } });
  for (const scene of ['sol', 'tormenta', 'noche']) {
    const r = E.simular(n, [panel(scene, n.personajes)], { tiempo: 'pret' });
    const translated = F.story(n, r);
    assert.equal(translated.panels.length, r.viñetas.length);
    assert.match(translated.panels[0], scene === 'tormenta' ? /^Il pleuvait beaucoup\. Mateo a retrouvé Lucía/ : scene === 'sol' ? /^Il faisait très chaud\. Mateo a retrouvé Lucía/ : /^Il faisait nuit\. Mateo a retrouvé Lucía/);
  }
  const emptyLevel = level(['lucia'], {}, { viñetas: 3 });
  const r = E.simular(emptyLevel, [{}, panel('sol', ['lucia']), {}]);
  assert.deepEqual(F.story(emptyLevel, r).panels, ['', 'Il fait très chaud. Lucía a soif.', '']);
});

test('every official title and hint has a translation; free text stays unknown', () => {
  for (const n of C.NIVELES) {
    assert.ok(F.title(n), n.id);
    for (let i = 0; i < n.pistas.length; i++) assert.ok(F.hint(n, i), `${n.id} hint ${i}`);
  }
  assert.equal(F.title(C.NIVELES.find(n => n.id === 'c2n3')), 'Lucía et Mateo n’ont plus faim');
  assert.equal(F.title(C.NIVELES.find(n => n.id === 'c3n6')), 'Tous sont contents et en sécurité');
  const custom = { ...C.NIVELES[0], titulo: 'Mi bosque secreto', pistas: ['Algo inventado'] };
  assert.equal(F.title(custom), null);
  assert.equal(F.hint(custom, 0), null);
  const author = level(['lucia'], {}, { objetivo: { tipo: 'yaNo', quien: 'lucia', estado: 'hambre' } });
  author.titulo = E.tituloDe(author.objetivo, author);
  assert.equal(F.title(author), 'Lucía n’a plus faim');
  author.objetivo = { tipo: 'historia', titulo: 'Un sueño', finales: { lucia: { salvo: true } } };
  author.titulo = 'Un sueño';
  assert.equal(F.title(author), null);
});

test('initial conditions stay present and final summary follows narrative tense', () => {
  const n = level(['lucia'], { lucia: { hambre: true, cansado: true, objetos: ['mapa', 'manta'] } });
  const r = E.simular(n, [panel('frutas', ['lucia'])], { tiempo: 'pret' });
  const before = JSON.stringify({ n, r });
  const translated = F.story(n, r);
  assert.deepEqual(translated.initial, ['Lucía a faim. Elle est fatiguée. Elle a une carte et une couverture.']);
  assert.deepEqual(translated.summary, ['Lucía était fatiguée.']);
  assert.equal(JSON.stringify({ n, r }), before, 'translation must not mutate progress or engine state');
});

test('failure reasons distinguish never experienced, still present and missing action', () => {
  const n = level(['lucia'], {}, { objetivo: { tipo: 'yaNo', quien: 'lucia', estado: 'sed' } });
  assert.equal(F.story(n, E.simular(n, [panel('frutas', ['lucia'])])).reason, 'Lucía n’a jamais soif dans cette histoire.');
  assert.equal(F.story(n, E.simular(n, [panel('sol', ['lucia'])])).reason, 'Lucía a encore soif.');
  const mission = C.NIVELES.find(n => n.id === 'c2n2');
  const failed = E.simular(mission, [panel('refugio', mission.personajes), panel('refugio', mission.personajes), panel('refugio', mission.personajes)]);
  assert.match(F.story(mission, failed).reason, /Il manque cette action : « Valeria soigne Diego »\. D’abord, Diego doit être blessé/);
  const missing = E.simular(mission, []);
  assert.match(F.story(mission, missing).reason, /^Il manque des cases/);
});

test('invalid boards and absent characters are explained precisely', () => {
  const n = level(['lucia', 'mateo'], {}, { libre: false, viñetas: 2, objetivo: { tipo: 'todos', estado: 'salvo' } });
  assert.match(F.story(n, E.simular(n, [panel('rescate', ['lucia', 'mateo']), panel('sol', ['lucia'])])).reason, /Lucía est déjà en sécurité/);
  assert.match(F.story(n, E.simular(n, [panel('mapa', ['lucia', 'mateo']), panel('sol', ['lucia'])])).reason, /n’accepte qu’un seul personnage/);
  assert.equal(F.story(n, E.simular(n, [panel('sol', ['lucia']), panel('rio', ['lucia'])])).reason, 'Mateo n’apparaît pas dans l’histoire.');
});

test('cultural events preserve the actor, partner, prerequisite and fiction frame', () => {
  assert.equal(narrate({ tipo: 'comparteMercado', quien: 'mateo', a: 'valeria', hambrientos: ['valeria'] }), 'Mateo partage un déjeuner avec Valeria au marché. Valeria n’a plus faim.');
  assert.match(narrate({ tipo: 'imaginaGigantes', quien: 'lucia' }, 'pret'), /Dans cette aventure de fiction, Lucía a imaginé que les moulins étaient des géants/);
  assert.match(narrate({ tipo: 'observaCultura', quienes: ['lucia', 'valeria'], motivo: 'sinPlano' }), /Sans plan, elles sont perdues/);
  assert.equal(narrate({ tipo: 'etiquetaRecuerdos', quien: 'valeria', a: 'diego' }, 'pret'), 'Valeria a aidé Diego à écrire des étiquettes. Grâce aux noms écrits, Diego s’est souvenu des choses.');
  assert.equal(narrate({ tipo: 'saleLaberinto', quien: 'diego', a: 'valeria' }), 'Avec le plan, Diego guide Valeria jusqu’à la sortie de la bibliothèque. Valeria n’est plus perdue.');
});

test('scene/state combinations produce valid French without omissions or mutation', () => {
  const casts = [['lucia'], ['mateo'], ['kiwi'], ['lucia', 'valeria'], ['lucia', 'mateo']];
  const profiles = [{}, { hambre: true, sed: true, frio: true, miedo: true, cansado: true, herido: true, perdido: true },
    { objetos: ['mapa', 'cuerda', 'manta', 'linterna', 'comida'] }, { cultura: 1023 }, { cultura: 2 }, { cultura: 4 }];
  const observed = new Set();
  for (const scene of C.ESCENAS) for (const cast of casts) for (const profile of profiles) for (const partner of cast.length > 1 ? profiles : [{}]) {
    const n = level(cast, { [cast[0]]: profile, ...(cast.length > 1 ? { [cast[1]]: partner } : {}) });
    const r = E.simular(n, [panel(scene.id, cast)], { tiempo: 'pret' });
    const tr = F.story(n, r);
    r.eventos.forEach(e => observed.add(e.tipo));
    assert.equal(tr.panels.length, 1);
    assert.doesNotMatch(JSON.stringify(tr), /undefined|traduction de cet événement|\[object/);
    if (r.eventos.length) assert.ok(tr.panels[0]);
  }
  assert.ok(observed.size >= 50, `exercise at least 50 actual engine event kinds (observed ${observed.size})`);
});

console.log(`atelier-fr: ${checks} checks passed`);
