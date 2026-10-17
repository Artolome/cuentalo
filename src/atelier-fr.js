/* Cuéntalo original — traduction française hors ligne des événements du moteur.
   Charger après contenido.js et engine.js. Aucun texte libre n'est traduit.
   story(nivel, resultat, {tiempo:'pres'|'pret'}) → {title, initial, panels, summary, reason}.
   event(e, tiempo) retourne les phrases d'un événement (null si inconnu).
   objective(obj, nivel) traduit un prédicat connu (null si texte libre/inconnu).
   hint(nivel, index) traduit un indice officiel (null si texte libre/inconnu).
   Les actions au passé sont au passé composé, les états et cadres à l'imparfait,
   comme dans la narration espagnole. Les titres et aides restent au présent. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./contenido.js'), require('./engine.js'));
  else root.SVAtelierFrench = factory(root.SVContenido, root.SVEngine);
})(typeof self !== 'undefined' ? self : this, function (C, E) {
  'use strict';

  const people = Object.fromEntries(C.PERSONAJES.map(p => [p.id, p]));
  const negative = ['hambre', 'sed', 'frio', 'miedo', 'cansado', 'herido', 'perdido'];
  const objects = { mapa: 'une carte', cuerda: 'une corde', manta: 'une couverture', linterna: 'une lampe de poche', comida: 'de la nourriture' };
  const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
  const list = xs => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' et ' + xs[xs.length - 1];
  const names = ids => list(ids.map(id => (people[id] || {}).nombre || 'Quelqu’un'));
  const who = (id, fallback = 'Quelqu’un') => id && people[id] ? people[id].nombre : fallback;
  const plural = ids => ids.length > 1;
  const female = ids => ids.length > 0 && ids.every(id => people[id] && people[id].genero === 'f');
  const pronoun = ids => female(ids) ? (plural(ids) ? 'elles' : 'elle') : (plural(ids) ? 'ils' : 'il');
  const agree = (word, ids) => word + (female(ids) ? 'e' : '') + (plural(ids) ? 's' : '');
  const vowel = s => /^[aàâeéèêëiîïoôuùûüyœh]/i.test(s);

  // Third-person forms only: the story never addresses the reader as a character.
  const verbs = {
    marcher: ['marche', 'marchent', 'marché'], retrouver: ['retrouve', 'retrouvent', 'retrouvé'],
    trouver: ['trouve', 'trouvent', 'trouvé'], boire: ['boit', 'boivent', 'bu'],
    traverser: ['traverse', 'traversent', 'traversé'], allumer: ['allume', 'allument', 'allumé'],
    dormir: ['dort', 'dorment', 'dormi'], courir: ['court', 'courent', 'couru'],
    crier: ['crie', 'crient', 'crié'], mordre: ['mord', 'mordent', 'mordu'],
    voir: ['voit', 'voient', 'vu'], avertir: ['avertit', 'avertissent', 'averti'],
    manger: ['mange', 'mangent', 'mangé'], faire: ['fait', 'font', 'fait'],
    partager: ['partage', 'partagent', 'partagé'], soigner: ['soigne', 'soignent', 'soigné'],
    demander: ['demande', 'demandent', 'demandé'], gravir: ['gravit', 'gravissent', 'gravi'],
    garder: ['garde', 'gardent', 'gardé'], choisir: ['choisit', 'choisissent', 'choisi'],
    lire: ['lit', 'lisent', 'lu'], consulter: ['consulte', 'consultent', 'consulté'],
    préparer: ['prépare', 'préparent', 'préparé'], dessiner: ['dessine', 'dessinent', 'dessiné'],
    guider: ['guide', 'guident', 'guidé'], évoquer: ['évoque', 'évoquent', 'évoqué'],
    acheter: ['achète', 'achètent', 'acheté'], répéter: ['répète', 'répètent', 'répété'],
    danser: ['danse', 'dansent', 'dansé'], construire: ['construit', 'construisent', 'construit'],
    décorer: ['décore', 'décorent', 'décoré'], exposer: ['expose', 'exposent', 'exposé'],
    montrer: ['montre', 'montrent', 'montré'], imaginer: ['imagine', 'imaginent', 'imaginé'],
    reconnaître: ['reconnaît', 'reconnaissent', 'reconnu'], oublier: ['oublie', 'oublient', 'oublié'],
    aider: ['aide', 'aident', 'aidé'], observer: ['observe', 'observent', 'observé'],
    regarder: ['regarde', 'regardent', 'regardé'], peindre: ['peint', 'peignent', 'peint'],
    partir: ['part', 'partent', 'parti', 'être'], devenir: ['devient', 'deviennent', 'devenu', 'être'],
    perdre: ['perd', 'perdent', 'perdu', 'se'], mouiller: ['mouille', 'mouillent', 'mouillé', 'se'],
    rejoindre: ['retrouve', 'retrouvent', 'retrouvé', 'se'], couvrir: ['couvre', 'couvrent', 'couvert', 'se'],
    reposer: ['repose', 'reposent', 'reposé', 'se'], guérir: ['soigne', 'soignent', 'soigné', 'se'],
    souvenir: ['souvient', 'souviennent', 'souvenu', 'se']
  };
  const states = {
    avoir: { pres: ['a', 'ont'], pret: ['avait', 'avaient'] },
    être: { pres: ['est', 'sont'], pret: ['était', 'étaient'] },
    pouvoir: { pres: ['peut', 'peuvent'], pret: ['pouvait', 'pouvaient'] }
  };
  function verb(key, ids, time = 'pres', neg = '', clitic = '') {
    const t = time === 'pret' ? 'pret' : 'pres', i = plural(ids) ? 1 : 0;
    let finite, tail = '', reflexive = false;
    if (states[key]) finite = states[key][t][i];
    else {
      const forms = verbs[key];
      if (!forms) return null;
      reflexive = forms[3] === 'se';
      finite = t === 'pres' ? forms[i] : (forms[3] ? states.être.pres[i] : states.avoir.pres[i]);
      if (t === 'pret') tail = ' ' + (forms[3] ? agree(forms[2], ids) : forms[2] + (clitic === 'la' ? 'e' : ''));
    }
    const lead = reflexive ? (vowel(finite) ? 's’' : 'se ') : clitic ? (vowel(finite) && /^(le|la)$/.test(clitic) ? 'l’' : clitic + ' ') : '';
    const start = lead + finite;
    return (neg ? (vowel(start) ? 'n’' : 'ne ') : '') + start + (neg && neg !== 'personne' ? ' ' + neg : '') + tail + (neg === 'personne' ? ' personne' : '');
  }
  const stateComplement = (key, ids) => ({ hambre: 'faim', sed: 'soif', frio: 'froid', miedo: 'peur',
    cansado: agree('fatigué', ids), herido: agree('blessé', ids), perdido: agree('perdu', ids),
    salvo: 'en sécurité', contento: agree('content', ids), enfadado: 'en colère' })[key] || null;
  function statePhrase(key, ids, time = 'pres', neg = '') {
    const complement = stateComplement(key, ids);
    return complement ? verb(['hambre', 'sed', 'frio', 'miedo'].includes(key) ? 'avoir' : 'être', ids, time, neg) + ' ' + complement : null;
  }

  function event(e, time = 'pres') {
    if (!e || !e.tipo) return null;
    const t = time === 'pret' ? 'pret' : 'pres';
    const q = e.quien ? [e.quien] : [], qs = e.quienes || [], a = e.a ? [e.a] : [];
    const v = (key, ids, neg, clitic) => verb(key, ids, t, neg, clitic);
    const s = (key, ids, neg) => statePhrase(key, ids, t, neg);
    const line = (ids, key, suffix, neg) => `${names(ids)} ${v(key, ids, neg)}${suffix}.`;
    const p = ids => cap(pronoun(ids));
    const noLonger = (ids, key) => `${names(ids)} ${s(key, ids, 'plus')}.`;
    const night = t === 'pret' ? 'Il faisait nuit.' : 'Il fait nuit.';
    const place = e.lugar === 'selva' ? ' dans la jungle' : '';
    const relief = (ids, affected, key) => affected && affected.length ? (affected.length === ids.length ? `${p(ids)} ${s(key, ids, 'plus')}.` : noLonger(affected, key)) : null;
    switch (e.tipo) {
      case 'yaSalvo': return [`Mais ${names(q)} ${v('être', q)} déjà en sécurité ! ${p(q)} ${v('pouvoir', q, 'pas')} être ici.`];
      case 'encuentra': return [`${names(q)} ${v('retrouver', q)} ${names(a)}${place}. Quelle joie !`];
      case 'seEncuentran': return [`${names(qs)} ${v('rejoindre', qs)}${place}. ${p(qs)} ${s('perdido', qs, 'plus')}.`];
      case 'pierde': return [`${names(q)} ${v('marcher', q)} ${agree('seul', q)} dans la jungle et ${v('perdre', q)}.`];
      case 'noPierde': return [`${names(q)} ${v('marcher', q)} dans la jungle. ${p(q)} ${v('avoir', q)} la carte et ${v('perdre', q, 'pas')}.`];
      case 'caminanJuntos': return [`${names(qs)} ${v('marcher', qs)} ensemble dans la jungle. ${p(qs)} ${s('hambre', qs)} et ${s('cansado', qs)}.`];
      case 'bebe': return [line(qs, 'boire', ' de l’eau de la rivière'), relief(qs, e.sed, 'sed')].filter(Boolean);
      case 'cruzaMojado': return [`${p(qs)} ${v('traverser', qs)} la rivière et ${v('mouiller', qs)}. ${p(qs)} ${s('frio', qs)}.`];
      case 'cruzaCuerda': return [`${p(qs)} ${v('traverser', qs)} la rivière avec la corde. ${p(qs)} ${v('mouiller', qs, 'pas')}.`];
      case 'calor': return [t === 'pret' ? 'Il faisait très chaud.' : 'Il fait très chaud.', `${names(qs)} ${s('sed', qs)}.`];
      case 'tormenta': {
        const rain = t === 'pret' ? 'Il pleuvait beaucoup.' : 'Il pleut beaucoup.';
        if (e.manta) return [rain, `${names(qs)} ${v('couvrir', qs)} avec la couverture${e.solo ? ` et ${s('frio', qs, 'pas')}.` : `. ${p(qs)} ${s('frio', qs, 'pas')}.`}`,
          e.solo ? `Mais ${pronoun(qs)} ${v('être', qs)} ${agree('seul', qs)} et ${s('miedo', qs)}.` : null].filter(Boolean);
        return [rain, `${names(qs)} ${v('avoir', qs)} froid${e.solo ? ' et peur' : ''}.`];
      }
      case 'nocheSolo': return [`${night} ${names(q)} ${v('être', q)} ${agree('seul', q)} et ${s('miedo', q)}.`];
      case 'nocheLinterna': return [`${night} ${names(q)} ${v('allumer', q)} la lampe de poche et ${v('dormir', q)} tranquillement.`];
      case 'nocheJuntos': {
        const rest = relief(qs, e.cansados, 'cansado') || relief(qs, e.miedos, 'miedo') || `${p(qs)} ${s('miedo', qs, 'pas')}.`;
        const sleep = t === 'pret' ? v('dormir', qs).replace(' dormi', ' bien dormi') : v('dormir', qs) + ' bien';
        return [`${night} ${names(qs)} ${v('être', qs)} ensemble et ${sleep}.`, rest];
      }
      case 'jaguarSolo': return [`Un jaguar ! ${names(q)} ${s('miedo', q)} et ${v('courir', q)}.`, e.mapa ? `Avec la carte, ${pronoun(q)} ${v('perdre', q, 'pas')}.` : `${p(q)} ${v('perdre', q)}.`];
      case 'jaguarJuntos': return [`Un jaguar ! ${names(qs)} ${v('crier', qs)} ensemble et le jaguar ${v('partir', ['kiwi'])}.`];
      case 'serpienteMuerde': return [`Aïe ! Un serpent ${v('mordre', ['kiwi'])} ${names(q)}. ${p(q)} ${s('herido', q)}.`];
      case 'serpienteAvisa': return [`${names(q)} ${v('voir', q)} un serpent et ${v('avertir', q)} ${names(a)}. Attention ! Le serpent ${v('mordre', ['kiwi'], 'personne')}.`];
      case 'comeFrutas': return [line(qs, 'manger', ' des fruits'), relief(qs, e.hambre, 'hambre') || (t === 'pret' ? 'Ils étaient délicieux !' : 'Ils sont délicieux !')];
      case 'fuego': return [line(qs, 'faire', ' du feu'), relief(qs, e.frio, 'frio') || (e.breve ? null : 'Quel bonheur !')].filter(Boolean);
      case 'comeComida': return [`${p(q)} ${v('manger', q)} et ${s('hambre', q, 'plus')}.`];
      case 'comen': return [`${p(qs)} ${v('manger', qs)} et ${s('hambre', qs, 'plus')}.`];
      case 'comparte': return [`${names(q)} ${v('partager', q)} la nourriture avec ${names(a)}. ${cap(pronoun(q.concat(a)))} ${s('hambre', q.concat(a), 'plus')}.`];
      case 'comeSolo': return [`${names(q)} ${v('manger', q)} et ${v('partager', q, 'pas')}. ${names(a)} ${s('hambre', a)} et ${s('enfadado', a)} contre ${names(q)}.`];
      case 'descansa': return [line(qs, 'reposer', ' dans le refuge'), e.breve ? null : relief(qs, e.cansados, 'cansado') || relief(qs, e.miedos, 'miedo') || `${p(qs)} ${v('être', qs)} ${plural(qs) ? 'tranquilles' : 'tranquille'}.`].filter(Boolean);
      case 'cura': return [line(q, 'soigner', ` ${names(a)}`), noLonger(a, 'herido')];
      case 'seCuran': return [`${p(qs)} ${v('guérir', qs)}. ${p(qs)} ${s('herido', qs, 'plus')}.`];
      case 'perdon': return [line(q, 'demander', ` pardon à ${names(a)}`), noLonger(a, 'enfadado')];
      case 'montana': return [`${names(qs)} ${v('gravir', qs)} la montagne. ${p(qs)} ${s('cansado', qs)} et ${s('hambre', qs)}.`, e.perdidos && e.perdidos.length ? `Depuis le sommet, ${names(e.perdidos)} ${v('voir', e.perdidos)} la rivière. ${cap(pronoun(e.perdidos))} ${s('perdido', e.perdidos, 'plus')} !` : null].filter(Boolean);
      case 'mapa': return [line(q, 'trouver', e.perdido ? ' la carte' : ' une carte'), e.perdido ? noLonger(q, 'perdido') : `${p(q)} ${v('garder', q, '', 'la')}.`];
      case 'mochila': return [line(q, 'trouver', ' un sac à dos avec de la nourriture'), e.hambre ? `${p(q)} ${v('manger', q)} et ${s('hambre', q, 'plus')}.` : 'Quelle chance !'];
      case 'cuerda': return [line(q, 'trouver', ' une corde'), `${p(q)} ${v('garder', q, '', 'la')}.`];
      case 'manta': return [line(q, 'trouver', ' une couverture'), e.frio ? noLonger(q, 'frio') : `${p(q)} ${v('garder', q, '', 'la')}.`];
      case 'linterna': return [line(q, 'trouver', ' une lampe de poche'), e.miedo ? noLonger(q, 'miedo') : `${p(q)} ${v('garder', q, '', 'la')}.`];
      case 'rescate': return [`L’hélicoptère ! ${names(qs)} ${t === 'pret' ? `${verb('avoir', qs)} été ${agree('sauvé', qs)}` : s('salvo', qs)}.`];
      case 'rescateNoVe': return [`L’hélicoptère ${v('voir', ['kiwi'], 'pas')} ${names(q)}. ${names(q)} ${v('être', q)} encore ${agree('perdu', q)}.`];
      case 'amigos': return [t === 'pret' ? `${names(qs)} ${v('devenir', qs)} ${agree('ami', qs)}.` : `Maintenant, ${names(qs)} ${v('être', qs)} ${agree('ami', qs)}.`];
      case 'demasiados': return ['Il n’y a de place que pour une personne ici.'];
      case 'eligeLibro': return [line(q, 'choisir', ' un livre sur un stand de Sant Jordi')];
      case 'comparteLibro': return [line(q, 'partager', ` un livre avec ${names(a)}`), line(q.concat(a), 'lire', ' ensemble')];
      case 'visitaCentro': return [line(qs, 'consulter', ' un plan au centre culturel'), `${p(qs)} ${v('reposer', qs)} un peu.`, relief(qs, e.cansados, 'cansado')].filter(Boolean);
      case 'paseaPlaza': return [line(qs, 'marcher', ' sur la place'), `${p(qs)} ${s('hambre', qs)} et ${s('cansado', qs)}.`];
      case 'preparaPapel': return [`${names(qs)} ${v('préparer', qs)} du papier et ${v('dessiner', qs)} dans l’atelier.`, `${p(qs)} ${v('garder', qs)} le papier pour ${plural(qs) ? 'leur' : 'son'} projet.`];
      case 'visitaPatios': return [`Avec le plan, ${names(q)} ${v('guider', q)} ${names(a)} dans les cours de l’Alhambra.`, noLonger(a, 'perdido')];
      case 'recuerdaFamilia': return [line(q, 'évoquer', ' avec affection un être cher devant l’offrande')];
      case 'preparaOfrenda': return [line(qs, 'préparer', ' une offrande avec des fleurs et du papier décoré'), `${p(qs)} ${v('évoquer', qs)} ${plural(qs) ? 'leurs' : 'ses'} proches avec respect.`];
      case 'compraMercado': return [line(q, 'acheter', ' de la nourriture au marché de San Pedro'), `${p(q)} ${v('garder', q, '', 'la')} pour la partager.`];
      case 'comparteMercado': return [line(q, 'partager', ` un déjeuner avec ${names(a)} au marché`), noLonger(e.hambrientos && e.hambrientos.length ? e.hambrientos : a, 'hambre')];
      case 'ensayaTango': return [line(qs, 'répéter', ' les pas du tango'), `Ensuite, ${pronoun(qs)} ${s('cansado', qs)} : ${pronoun(qs)} ${v('avoir', qs)} besoin de se reposer.`];
      case 'bailaTango': return [`Après la répétition et le repos, ${names(qs)} ${v('danser', qs)} le tango ensemble.`];
      case 'construyeBarrilete': return [line(qs, 'construire', ' un cerf-volant avec le papier de l’atelier'), `${p(qs)} ${v('décorer', qs)} le cerf-volant avec des dessins et des couleurs.`];
      case 'exponeBarrilete': return [line(qs, 'exposer', ` ${plural(qs) ? 'leur' : 'son'} cerf-volant décoré`), `${p(qs)} ${v('montrer', qs)} ${plural(qs) ? 'leur' : 'son'} travail à la communauté.`];
      case 'imaginaGigantes': return [`Dans cette aventure de fiction, ${names(q)} ${v('imaginer', q)} que les moulins ${t === 'pret' ? 'étaient' : 'sont'} des géants.`, `${p(q)} ${s('miedo', q)}.`];
      case 'reconoceMolinos': return [line(q, 'montrer', ` le plan à ${names(a)}`), `${names(a)} ${v('reconnaître', a)} les moulins et ${s('miedo', a, 'plus')}.`];
      case 'olvidaNombres': return [`Dans le village imaginaire de Macondo, ${names(q)} ${v('oublier', q)} le nom des choses.`];
      case 'etiquetaRecuerdos': return [line(q, 'aider', ` ${names(a)} à écrire des étiquettes`), `Grâce aux noms écrits, ${names(a)} ${v('souvenir', a)} des choses.`];
      case 'entraLaberinto': return [`Dans cette bibliothèque de fiction, ${names(q)} ${v('marcher', q)} entre les livres et ${v('perdre', q)}.`];
      case 'saleLaberinto': return [`Avec le plan, ${names(q)} ${v('guider', q)} ${names(a)} jusqu’à la sortie de la bibliothèque.`, noLonger(a, 'perdido')];
      case 'observaAutorretrato': return [line(q, 'observer', ' un autoportrait au musée de la Casa Azul'), `${p(q)} ${v('regarder', q)} les couleurs et l’expression.`];
      case 'pintaAutorretrato': return [`${names(q)} ${v('regarder', q)} son propre visage dans un miroir et ${v('peindre', q)} un autoportrait.`, `${names(a)} ${v('aider', a)} à choisir les couleurs dans l’atelier du musée.`];
      case 'observaCultura': {
        const places = { libros: 'les stands de livres', sinPlano: 'les chemins de l’Alhambra', patios: 'les cours de l’Alhambra', ofrenda: 'les fleurs de l’offrande', mercado: 'les étals du marché', barriletes: 'les cerfs-volants colorés', molinos: 'les moulins à vent', macondo: 'les maisons de Macondo', biblioteca: 'les rayonnages de la bibliothèque', casaAzul: 'les tableaux du musée' };
        return [line(qs, 'regarder', ' ' + (places[e.motivo] || 'les lieux')), e.motivo === 'sinPlano' ? `Sans plan, ${pronoun(qs)} ${s('perdido', qs)}.` : null].filter(Boolean);
      }
      default: return null;
    }
  }

  const eventTitles = {
    encuentra: (q, a) => `${who(q)} retrouve ${who(a, 'un ami')}`,
    seEncuentran: (q, a) => q && a ? `${names([q, a])} se retrouvent` : 'Deux amis se retrouvent',
    cura: (q, a) => `${who(q)} soigne ${who(a, 'un ami')}`,
    comparte: (q, a) => `${who(q)} partage la nourriture${a ? ' avec ' + who(a) : ''}`,
    comeSolo: q => `${who(q)} ne partage pas`,
    nocheLinterna: q => `${who(q)} dort tranquillement`,
    jaguarJuntos: () => 'Le jaguar s’en va', jaguarSolo: q => `Un jaguar ! ${who(q)} court`,
    caminanJuntos: (q, a) => q && a ? `${names([q, a])} marchent ensemble` : 'Les personnages marchent ensemble',
    nocheJuntos: (q, a) => q && a ? `${names([q, a])} dorment bien` : 'Personne ne dort seul',
    perdon: (q, a) => `${who(q)} demande pardon à ${who(a, 'un ami')}`,
    cruzaCuerda: (q, a) => q && a ? `${names([q, a])} traversent la rivière avec la corde` : `${who(q)} traverse la rivière avec la corde`,
    serpienteAvisa: (q, a) => a ? `Attention, ${who(a)} !` : 'Attention au serpent !',
    rescateNoVe: q => `L’hélicoptère ne voit pas ${who(q, 'quelqu’un')}`,
    nocheSolo: q => `${who(q)} dort ${agree('seul', q ? [q] : [])}`,
    pierde: q => `${who(q)} se perd`, mapa: q => `${who(q)} trouve la carte`, mochila: q => `${who(q)} trouve le sac à dos`,
    linterna: q => `${who(q)} trouve la lampe de poche`, manta: q => `${who(q)} trouve la couverture`, cuerda: q => `${who(q)} trouve la corde`,
    bebe: q => `${who(q)} boit de l’eau`, comeFrutas: q => `${who(q)} mange des fruits`, fuego: q => `${who(q)} fait du feu`,
    descansa: q => `${who(q)} se repose dans le refuge`, montana: q => `${who(q)} gravit la montagne`, rescate: q => `${who(q)} rentre à la maison`,
    amigos: (q, a) => q && a ? `${names([q, a])} sont ${agree('ami', [q, a])}` : 'Deux personnes deviennent amies',
    serpienteMuerde: q => `Un serpent mord ${who(q, 'quelqu’un')}`,
    noPierde: q => `${who(q)} a la carte et ne se perd pas`, comeComida: q => `${who(q)} mange la nourriture du sac à dos`,
    eligeLibro: q => `${who(q)} choisit un livre`, comparteLibro: (q, a) => `${who(q)} partage un livre avec ${who(a, 'un ami')}`,
    visitaPatios: (q, a) => `${who(q)} guide ${who(a, 'un ami')} dans les cours de l’Alhambra`,
    recuerdaFamilia: q => `${who(q)} évoque un être cher`, compraMercado: q => `${who(q)} achète de la nourriture au marché`,
    comparteMercado: (q, a) => `${who(q)} partage un déjeuner avec ${who(a, 'un ami')}`,
    imaginaGigantes: q => `${who(q)} imagine des géants`, reconoceMolinos: (q, a) => `${who(q)} aide ${who(a, 'un ami')} à reconnaître les moulins`,
    olvidaNombres: q => `${who(q)} oublie les noms`, etiquetaRecuerdos: (q, a) => `${who(q)} aide ${who(a, 'un ami')} à se souvenir des noms`,
    entraLaberinto: q => `${who(q)} se perd dans la bibliothèque`, saleLaberinto: (q, a) => `${who(q)} guide ${who(a, 'un ami')} jusqu’à la sortie de la bibliothèque`,
    observaAutorretrato: q => `${who(q)} observe un autoportrait`, pintaAutorretrato: (q, a) => `${who(q)} peint un autoportrait avec ${who(a, 'un ami')}`
  };
  for (const [key, action, suffix] of [
    ['calor', 'avoir', ' très chaud'], ['tormenta', 'être', ' dans la tempête'],
    ['cruzaMojado', 'traverser', ' la rivière et se mouille'], ['comen', 'manger', ' ensemble'], ['seCuran', 'guérir', ''],
    ['visitaCentro', 'consulter', ' un plan au centre culturel'], ['preparaPapel', 'préparer', ' du papier dans l’atelier'],
    ['preparaOfrenda', 'préparer', ' une offrande'], ['paseaPlaza', 'marcher', ' sur la place'],
    ['ensayaTango', 'répéter', ' le tango'], ['bailaTango', 'danser', ' le tango'],
    ['construyeBarrilete', 'construire', ' un cerf-volant'], ['exponeBarrilete', 'exposer', ' un cerf-volant'], ['observaCultura', 'observer', ' les lieux']
  ]) eventTitles[key] = (q, a) => {
    const ids = q ? (a ? [q, a] : [q]) : [];
    return `${ids.length ? names(ids) : 'Quelqu’un'} ${verb(action, ids)}${key === 'cruzaMojado' ? ` la rivière et ${verb('mouiller', ids)}` : suffix}`;
  };
  const without = { nocheSolo: 'Personne ne dort seul', pierde: 'Personne ne se perd dans la jungle', jaguarSolo: 'Personne ne court seul',
    serpienteMuerde: 'Le serpent ne mord personne', comeSolo: 'Tout le monde partage', cruzaMojado: 'Personne ne se mouille',
    rescateNoVe: 'L’hélicoptère voit tout le monde', tormenta: 'Personne ne traverse la tempête' };
  const humans = nivel => (nivel.personajes || []).filter(id => people[id] && !people[id].animal);
  function objective(o, nivel) {
    if (!o) return null;
    const ids = o.quien ? [o.quien] : [];
    switch (o.tipo) {
      case 'estado': case 'yaNo': case 'nunca': {
        const neg = o.tipo === 'yaNo' ? 'plus' : o.tipo === 'nunca' ? 'jamais' : o.valor === false ? 'pas' : '';
        const phrase = statePhrase(o.estado, ids, 'pres', neg);
        if (!phrase) return null;
        if (o.tipo === 'nunca' && !o.quien) return `Personne ${statePhrase(o.estado, [], 'pres', 'jamais')}`;
        return `${who(o.quien)} ${phrase}`;
      }
      case 'todos': {
        const idsAll = humans(nivel);
        if (idsAll.length === 1) return objective({ tipo: 'estado', quien: idsAll[0], estado: o.estado, valor: o.valor }, nivel);
        if (o.valor === false) return objective({ tipo: 'nadie', estado: o.estado }, nivel);
        return statePhrase(o.estado, idsAll) ? `${female(idsAll) ? 'Toutes' : 'Tous'} ${statePhrase(o.estado, idsAll)}` : null;
      }
      case 'nadie': {
        const phrase = statePhrase(o.estado, [], 'pres', 'pas');
        return phrase ? `Personne ${phrase.replace(/ pas /, ' ')}` : null;
      }
      case 'evento': return eventTitles[o.evento] ? eventTitles[o.evento](o.quien, o.a) : null;
      case 'sinEvento': return without[o.evento] || null;
      case 'amigos': return `${names([o.a, o.b])} sont ${agree('ami', [o.a, o.b])}`;
      case 'enfadado': return `${who(o.quien)} est en colère contre ${who(o.con)}`;
      case 'y': {
        if (!Array.isArray(o.partes)) return null;
        if (o.partes.length === 2) {
          const [a, b] = o.partes;
          if (a.tipo === b.tipo && a.estado === b.estado && (a.valor === false) === (b.valor === false) && ['estado', 'yaNo', 'nunca'].includes(a.tipo) && a.quien && b.quien && a.quien !== b.quien) {
            const idsBoth = E.ordenar([a.quien, b.quien]);
            const phrase = statePhrase(a.estado, idsBoth, 'pres', a.tipo === 'yaNo' ? 'plus' : a.tipo === 'nunca' ? 'jamais' : a.valor === false ? 'pas' : '');
            return phrase ? `${names(idsBoth)} ${phrase}` : null;
          }
          if (a.tipo === 'todos' && b.tipo === 'todos' && a.valor !== false && b.valor !== false) {
            const idsAll = humans(nivel), pa = statePhrase(a.estado, idsAll), pb = statePhrase(b.estado, idsAll);
            if (idsAll.length > 1 && pa && pb && pa.split(' ')[0] === pb.split(' ')[0]) return `${female(idsAll) ? 'Toutes' : 'Tous'} ${pa} et ${stateComplement(b.estado, idsAll)}`;
          }
        }
        const parts = o.partes.map(x => objective(x, nivel));
        if (parts.some(x => x === null)) return null;
        return parts.map((x, i) => i && /^(Tous|Toutes|Personne|Tout le monde|Deux personnes|Le jaguar|L’hélicoptère|Le serpent)/.test(x) ? x[0].toLowerCase() + x.slice(1) : x).join(' et ');
      }
      // A recorded story can have any user-written title: never pretend to translate it.
      case 'historia': default: return null;
    }
  }

  function title(nivel) {
    const official = C.NIVELES.find(n => n.id === nivel.id && n.titulo === nivel.titulo);
    if (official) return nivel.id === 'libre' ? 'Mon histoire' : objective(official.objetivo, official);
    if (!nivel.titulo || (nivel.objetivo && nivel.titulo === E.tituloDe(nivel.objetivo, nivel))) return objective(nivel.objetivo, nivel);
    return null;
  }
  function value(s, key) {
    return key === 'contento' ? !negative.some(k => s[k]) && !Object.keys(s.enfadado || {}).length : !!s[key];
  }
  function describe(id, s, time = 'pres') {
    const ids = [id], having = ['hambre', 'sed', 'frio', 'miedo'].filter(k => s[k]).map(k => stateComplement(k, ids));
    const being = ['cansado', 'herido', 'perdido'].filter(k => s[k]).map(k => stateComplement(k, ids));
    for (const other of Object.keys(s.enfadado || {})) being.push('en colère contre ' + who(other));
    const has = verb('avoir', ids, time), is = verb('être', ids, time);
    if (s.salvo) return `${who(id)} ${is} en sécurité.`;
    if (!having.length && !being.length) return `${who(id)} ${is} ${agree('content', ids)}.`;
    return `${who(id)} ${having.length ? has + ' ' + list(having) : is + ' ' + list(being)}.${having.length && being.length ? ` ${cap(pronoun(ids))} ${is} ${list(being)}.` : ''}`;
  }
  function initial(nivel) {
    const state = E.estadoInicial(nivel);
    return Object.keys(nivel.inicial || {}).filter(id => state[id] && (negative.some(k => state[id][k]) || Object.keys(state[id].objetos || {}).length))
      .map(id => {
        const owned = Object.keys(state[id].objetos || {}).map(k => objects[k] || 'un objet');
        return describe(id, state[id]) + (owned.length ? ` ${cap(pronoun([id]))} a ${list(owned)}.` : '');
      });
  }

  // These hints explain the same causal requirements as engine.porque, without
  // running a second simulation or translating unstructured Spanish strings.
  const prerequisites = {
    encuentra: o => `D’abord, ${who(o.a, 'un personnage')} doit se perdre, ${agree('seul', o.a ? [o.a] : [])} dans la jungle ou face au jaguar. Ensuite, réunis les deux personnages.`,
    seEncuentran: () => 'D’abord, les deux personnages se perdent, chacun de son côté. Ensuite, réunis-les.',
    cura: o => `D’abord, ${who(o.a, 'un personnage')} doit être ${agree('blessé', o.a ? [o.a] : [])} par le serpent. Ensuite, réunis les deux personnages au refuge.`,
    comparte: o => `${who(o.quien)} a besoin de la nourriture du sac à dos. ${who(o.a, 'L’autre personnage')} doit avoir faim. Les deux doivent déjà être ${agree('ami', [o.quien, o.a])} avant de se retrouver près du feu.`,
    comeSolo: o => `${who(o.quien)} doit avoir de la nourriture et ${who(o.a, 'l’autre personnage')} doit avoir faim. Les deux ne doivent pas encore être ${agree('ami', [o.quien, o.a])}. Ensuite, réunis-les près du feu.`,
    perdon: o => `D’abord, ${who(o.a, 'un personnage')} doit être en colère parce que l’autre a mangé sans partager. Ensuite, réunis-les au refuge.`,
    nocheLinterna: o => `${who(o.quien)} doit trouver la lampe avant de passer la nuit ${agree('seul', o.quien ? [o.quien] : [])}.`,
    nocheJuntos: () => 'Place les deux personnages ensemble dans la scène de nuit.',
    jaguarJuntos: () => 'Place les deux personnages ensemble face au jaguar.',
    caminanJuntos: () => 'Réunis les deux personnages dans la jungle sans qu’ils soient perdus.',
    cruzaCuerda: () => 'Un personnage doit trouver la corde avant de traverser la rivière.',
    amigos: () => 'Réunis les deux personnages dans une case, sans que l’un mange sans partager.',
    comparteLibro: o => `${who(o.quien)} choisit d’abord un livre ${agree('seul', o.quien ? [o.quien] : [])}, puis retrouve ${who(o.a, 'un autre personnage')} à Sant Jordi pour le partager.`,
    visitaPatios: o => `${who(o.a)} se perd sans plan. ${who(o.quien)} consulte le plan au centre culturel, puis les deux se retrouvent à l’Alhambra.`,
    preparaOfrenda: () => 'Un personnage évoque d’abord un proche devant l’offrande. Les deux préparent du papier à l’atelier, puis reviennent ensemble.',
    comparteMercado: o => `${who(o.quien)} achète d’abord de la nourriture ${agree('seul', o.quien ? [o.quien] : [])}. ${who(o.a)} a faim après avoir marché. Réunis-les au marché.`,
    bailaTango: () => 'Les deux répètent d’abord ensemble, puis se reposent avant de revenir danser le tango.',
    construyeBarrilete: () => 'Les deux préparent du papier à l’atelier, puis construisent ensemble le cerf-volant.',
    exponeBarrilete: () => 'Les deux préparent du papier, construisent leur cerf-volant ensemble, puis reviennent ensemble pour l’exposer.',
    reconoceMolinos: o => `${who(o.a)} imagine des géants ${agree('seul', o.a ? [o.a] : [])}. ${who(o.quien)} consulte un plan, puis les deux se retrouvent devant les moulins.`,
    etiquetaRecuerdos: o => `${who(o.a)} oublie les noms. ${who(o.quien)} prépare du papier, puis les deux se retrouvent pour écrire des étiquettes à Macondo.`,
    saleLaberinto: o => `${who(o.a)} se perd dans la bibliothèque. ${who(o.quien)} consulte un plan, puis les deux se retrouvent pour chercher la sortie.`,
    pintaAutorretrato: o => `${who(o.quien)} observe un autoportrait, prépare du papier à l’atelier, puis revient avec ${who(o.a, 'un autre personnage')} pour peindre.`
  };
  function reasonFor(o, r, nivel) {
    if (!o || E.evaluar(o, r, nivel)) return [];
    const S = r.estado, H = r.hist;
    const stateLine = (id, state, neg = '', suffix = '') => `${who(id)} ${statePhrase(state, [id], 'pres', neg)}${suffix}.`;
    switch (o.tipo) {
      case 'estado': return [stateLine(o.quien, o.estado, o.valor === false ? '' : 'pas')];
      case 'yaNo': return value(S[o.quien], o.estado) ? [`${who(o.quien)} ${statePhrase(o.estado, [o.quien]).replace(/^(a|est) /, '$1 encore ')}.`] : [stateLine(o.quien, o.estado, 'jamais', ' dans cette histoire')];
      case 'todos': return humans(nivel).filter(id => value(S[id], o.estado) !== (o.valor !== false)).map(id => stateLine(id, o.estado, o.valor === false ? '' : 'pas'));
      case 'nadie': return humans(nivel).filter(id => value(S[id], o.estado)).map(id => stateLine(id, o.estado));
      case 'nunca': return (o.quien ? [o.quien] : humans(nivel)).filter(id => H.alguna[id] && H.alguna[id][o.estado]).map(id => {
        const v = r.viñetas.findIndex(panel => panel.estado && panel.estado[id] && panel.estado[id][o.estado]);
        return stateLine(id, o.estado, '', v < 0 ? ' dès le début' : ' dans la case ' + (v + 1));
      });
      case 'evento': {
        const translated = objective(o, nivel);
        return [translated ? `Il manque cette action : « ${translated} ».` : 'Une action demandée n’a pas encore eu lieu.', prerequisites[o.evento] ? prerequisites[o.evento](o) : null].filter(Boolean);
      }
      case 'sinEvento': {
        const e = H.eventos.find(x => x.tipo === o.evento && (!o.quien || x.quien === o.quien || (x.quienes || []).includes(o.quien)));
        if (!e) return [];
        const label = eventTitles[e.tipo] ? eventTitles[e.tipo](e.quien || (e.quienes || [])[0], e.a || (e.quienes || [])[1]) : null;
        return [label ? `${label} dans la case ${e.viñeta + 1}.` : `L’action interdite se produit dans la case ${e.viñeta + 1}.`];
      }
      case 'amigos': {
        const together = r.viñetas.some(v => v.personajes.includes(o.a) && v.personajes.includes(o.b));
        if (!together) return [`${names([o.a, o.b])} ne sont ensemble dans aucune case.`];
        const alone = H.eventos.find(e => e.tipo === 'comeSolo');
        return [alone ? `${who(alone.quien)} mange sans partager : ${names([o.a, o.b])} ne sont pas ${agree('ami', [o.a, o.b])}.` : `${names([o.a, o.b])} ne sont pas encore ${agree('ami', [o.a, o.b])}.`];
      }
      case 'enfadado': return [`${who(o.quien)} n’est pas en colère contre ${who(o.con)}.`];
      case 'y': return o.partes.flatMap(p => reasonFor(p, r, nivel));
      case 'historia': {
        const lines = [];
        for (const id of Object.keys(o.finales || {})) if (S[id]) for (const key of Object.keys(o.finales[id])) {
          if (value(S[id], key) !== !!o.finales[id][key]) lines.push(stateLine(id, key, o.finales[id][key] ? 'pas' : ''));
        }
        for (const e of o.eventos || []) {
          const goal = { tipo: 'evento', evento: e.tipo, quien: e.quien, a: e.a };
          if (!E.evaluar(goal, r, nivel)) {
            const label = objective(goal, nivel);
            lines.push(label ? `Il manque cette action : « ${label} ».` : 'Une action de l’histoire modèle n’a pas encore eu lieu.');
          }
        }
        return lines.length ? lines : ['Cette histoire ne correspond pas encore au modèle.'];
      }
      default: return ['La traduction de cet objectif n’est pas disponible.'];
    }
  }
  function reason(nivel, r) {
    if (!nivel.objetivo) return null;
    if (r.hist && r.hist.invalido) {
      const messages = r.hist.eventos.filter(e => e.tipo === 'yaSalvo' || e.tipo === 'demasiados').map(e => e.tipo === 'yaSalvo' ? `${who(e.quien)} est déjà en sécurité et ne peut plus apparaître dans les cases suivantes.` : 'Cette carte n’accepte qu’un seul personnage.');
      return messages.join(' ') || 'Une case ne respecte pas les règles du jeu.';
    }
    if (r.incompleto) return 'Il manque des cases : ajoute un décor et au moins un personnage dans chaque case.';
    if (r.faltan && r.faltan.length) return r.faltan.map(id => `${who(id)} n’apparaît pas dans l’histoire.`).join(' ');
    return reasonFor(nivel.objetivo, r, nivel).join(' ') || null;
  }
  function story(nivel, result, opts = {}) {
    const t = (opts.tiempo || result.tiempo) === 'pret' ? 'pret' : 'pres';
    const panels = result.viñetas.map(panel => {
      const groups = (panel.eventos || []).map(e => event(e, t) || ['La traduction de cet événement n’est pas disponible.']);
      // Put impersonal weather/night before a reunion, like the Spanish engine.
      const evs = panel.eventos || [];
      if (evs.length > 1 && ['encuentra', 'seEncuentran'].includes(evs[0].tipo) && ['calor', 'tormenta', 'nocheJuntos'].includes(evs[1].tipo)) {
        if (evs[1].tipo === 'nocheJuntos') {
          const first = groups[1][0].indexOf('. ') + 2;
          const frame = groups[1][0].slice(0, first).trim();
          groups[1][0] = groups[1][0].slice(first);
          groups.unshift([frame]);
        } else groups.unshift([groups[1].shift()]);
      }
      return groups.flat().join(' ');
    });
    const summary = nivel.personajes.filter(id => result.viñetas.some(v => v.personajes.includes(id))).map(id => describe(id, result.estado[id], t));
    return { title: title(nivel), initial: initial(nivel), panels, summary, reason: reason(nivel, result) };
  }
  const hints = {
    c1n1: ['D’abord, il fait chaud… et ensuite ?', 'Dans la rivière, Lucía boit de l’eau.'],
    c1n2: ['Mateo se mouille dans la rivière.', 'Le feu réchauffe. Attention à l’ordre !'],
    c1n3: ['La nuit, quand elle est seule, Valeria a peur.', 'Avec la lampe de poche, elle n’a pas peur.'],
    c1n4: ['Si Diego marche seul dans la jungle, il se perd.', 'Depuis la montagne, on voit la rivière.'],
    c1n5: ['L’hélicoptère ne voit pas une personne perdue.', 'Avec la carte, Lucía ne se perd pas.'],
    c2n1: ['D’abord, Lucía se perd toute seule.', 'Ensuite, Mateo et Lucía se retrouvent ensemble.'],
    c2n2: ['Si Diego est seul, le serpent le mord.', 'Dans le refuge, l’autre personnage soigne la personne blessée.'],
    c2n3: ['Marcher ensemble donne faim.', 'Les fruits rassasient : attention à l’ordre !'],
    c2n4: ['Ensemble, les personnages n’ont pas peur.', 'La tempête donne froid… et fait peur à la personne qui est seule.'],
    c2n5: ['L’hélicoptère ne voit pas une personne perdue.', 'Qui a besoin de la carte ?'],
    c3n1: ['Lucía a besoin du sac à dos.', 'Mateo doit avoir faim.', 'On ne partage qu’avec ses amis.'],
    c3n2: ['Si les deux ne sont pas amis, Lucía ne partage pas.', 'Mateo a faim, mais Lucía ne partage pas.'],
    c3n3: ['D’abord, Diego ne partage pas et Lucía est en colère.', 'Dans le refuge, on demande pardon.'],
    c3n4: ['Valeria a besoin de la lampe de poche avant la nuit.', 'L’hélicoptère ne voit pas une personne perdue.'],
    c3n5: ['D’abord, Lucía se perd toute seule.', 'L’hélicoptère ne transporte que deux personnes et ne voit pas les personnes perdues.'],
    c3n6: ['Au début, tous ont faim et sont fatigués.', 'Être content, c’est n’avoir ni faim, ni soif, ni froid, ni peur. Et ne pas être fatigué.', 'L’hélicoptère ne transporte que deux personnes.'],
    c4n1: ['D’abord, Lucía choisit seule un livre sur le stand.', 'Ensuite, Lucía et Mateo se retrouvent ensemble à Sant Jordi.'],
    c4n2: ['Diego cherche les cours sans plan.', 'Valeria consulte le plan au centre culturel.', 'Ensuite, les deux visitent l’Alhambra ensemble.'],
    c4n3: ['D’abord, un personnage évoque un être cher devant l’offrande.', 'Les deux préparent du papier décoré à l’atelier.', 'Ensuite, les deux préparent l’offrande avec respect.'],
    c4n4: ['Marcher sur la place donne faim à Valeria.', 'Mateo achète seul de la nourriture au marché.', 'Ensuite, les deux se retrouvent au marché pour partager.'],
    c4n5: ['D’abord, les deux répètent le tango.', 'Répéter fatigue : les deux se reposent au centre culturel.', 'Ensuite, les deux reviennent danser ensemble.'],
    c4n6: ['Les deux préparent du papier décoré à l’atelier.', 'Ensuite, les deux construisent ensemble un cerf-volant.', 'Une fois le cerf-volant construit, les deux reviennent ensemble pour l’exposer.'],
    c5n1: ['Lucía regarde les moulins toute seule et imagine des géants.', 'Mateo consulte un plan au centre culturel.', 'Ensuite, les deux regardent les moulins ensemble.'],
    c5n2: ['Dans ce village de fiction, Diego oublie les noms.', 'Valeria prépare du papier pour les étiquettes à l’atelier.', 'Ensuite, les deux écrivent les noms à Macondo.'],
    c5n3: ['Mateo entre seul et se perd au milieu des livres.', 'Diego consulte le plan au centre culturel.', 'Ensuite, Diego aide Mateo dans la bibliothèque.'],
    c5n4: ['Lucía observe un autoportrait à la Casa Azul.', 'Ensuite, elle prépare du papier pour dessiner à l’atelier.', 'Lucía peint son propre visage et Valeria l’aide avec les couleurs.']
  };
  function hint(nivel, index) {
    const official = C.NIVELES.find(n => n.id === nivel.id);
    return official && official.pistas && nivel.pistas && official.pistas[index] === nivel.pistas[index] && hints[nivel.id] ? hints[nivel.id][index] || null : null;
  }
  return { story, event, objective, title, hint };
});
