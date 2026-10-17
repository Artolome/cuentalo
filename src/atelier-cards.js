/* Cuéntalo original — aides bilingues des cartes, sans règles ni dépendance au DOM.
   Les descriptions suivent les branches de engine.js ; les libellés courts ne
   promettent pas un effet qui dépend d'un objet ou d'un personnage précédent. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVAtelierCards = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const scenes = {
    selva: {
      nameFr: 'La jungle', shortEs: 'Caminar o perderse', shortFr: 'Marcher ou se perdre',
      detailEs: 'A solas y sin mapa, el personaje se pierde. A dos, encuentran a quien estaba perdido. Si nadie estaba perdido, caminan y tienen hambre y cansancio.',
      detailFr: 'Seul et sans carte, le personnage se perd. À deux, on retrouve celui qui était perdu. Si personne n’était perdu, marcher donne faim et fatigue.'
    },
    rio: {
      nameFr: 'La rivière', shortEs: 'Beber y cruzar el río', shortFr: 'Boire et traverser la rivière',
      detailEs: 'Beber quita la sed. Sin cuerda, cruzar el río da frío. Si uno lleva una cuerda, cruzan sin mojarse, pero el frío anterior no desaparece.',
      detailFr: 'Boire enlève la soif. Sans corde, traverser la rivière donne froid. Si l’un a une corde, ils traversent sans se mouiller, mais le froid déjà présent reste.'
    },
    sol: {
      nameFr: 'Le soleil', shortEs: 'El calor da sed', shortFr: 'La chaleur donne soif',
      detailEs: 'Hace mucho calor. Todos los personajes de esta escena tienen sed.',
      detailFr: 'Il fait très chaud. Tous les personnages de cette scène ont soif.'
    },
    tormenta: {
      nameFr: 'L’orage', shortEs: 'Protegerse de la lluvia', shortFr: 'Se protéger de la pluie',
      detailEs: 'La lluvia da frío. Si uno lleva una manta, todos se tapan y ya no tienen frío. Un personaje solo también tiene miedo, incluso con manta.',
      detailFr: 'La pluie donne froid. Si l’un a une couverture, tous se couvrent et n’ont plus froid. Un personnage seul a aussi peur, même avec une couverture.'
    },
    noche: {
      nameFr: 'La nuit', shortEs: 'Dormir juntos o con linterna', shortFr: 'Dormir ensemble ou avec une lampe',
      detailEs: 'A solas y sin linterna, el personaje tiene miedo. Con linterna, ya no tiene miedo. A dos, duermen juntos: ya no tienen miedo ni cansancio.',
      detailFr: 'Seul et sans lampe, le personnage a peur. Avec une lampe, il n’a plus peur. À deux, ils dorment ensemble : plus de peur ni de fatigue.'
    },
    jaguar: {
      nameFr: 'Le jaguar', shortEs: 'Huir o gritar juntos', shortFr: 'Fuir ou crier ensemble',
      detailEs: 'A solas, el personaje tiene miedo y corre. Sin mapa, también se pierde. A dos, gritan y el jaguar se va.',
      detailFr: 'Seul, le personnage a peur et court. Sans carte, il se perd aussi. À deux, ils crient et le jaguar s’en va.'
    },
    serpiente: {
      nameFr: 'Le serpent', shortEs: 'Evitar la mordedura a dos', shortFr: 'Éviter la morsure à deux',
      detailEs: 'A solas, la serpiente muerde al personaje y lo hiere. A dos, uno avisa al otro y evitan la mordedura. Esto no cura una herida anterior.',
      detailFr: 'Seul, le personnage est mordu et blessé. À deux, l’un prévient l’autre et ils évitent la morsure. Cela ne soigne pas une blessure déjà présente.'
    },
    frutas: {
      nameFr: 'L’arbre fruitier', shortEs: 'Comer para quitar el hambre', shortFr: 'Manger pour ne plus avoir faim',
      detailEs: 'Los personajes comen frutas y ya no tienen hambre. No guardan comida para después.',
      detailFr: 'Les personnages mangent des fruits et n’ont plus faim. Ils ne gardent pas de nourriture pour plus tard.'
    },
    fuego: {
      nameFr: 'Le feu', shortEs: 'Calentarse y quizá compartir comida', shortFr: 'Se réchauffer et parfois partager',
      detailEs: 'El fuego quita el frío. Con comida, se puede comer; los amigos que no están enfadados pueden compartir. Si solo uno tiene comida y no hay esa amistad, el otro, con hambre, se enfada.',
      detailFr: 'Le feu enlève le froid. Avec de la nourriture, on peut manger ; des amis non fâchés peuvent partager. Si un seul a de la nourriture sans cette amitié, l’autre, affamé, se fâche.'
    },
    refugio: {
      nameFr: 'Le refuge', shortEs: 'Descansar y ayudarse a dos', shortFr: 'Se reposer et s’entraider à deux',
      detailEs: 'Descansar quita el miedo y el cansancio. A dos, curan las heridas. Si están enfadados entre sí, se piden perdón.',
      detailFr: 'Se reposer enlève la peur et la fatigue. À deux, ils soignent les blessures. S’ils sont fâchés entre eux, ils se demandent pardon.'
    },
    montana: {
      nameFr: 'La montagne', shortEs: 'Subir para encontrar el camino', shortFr: 'Monter pour retrouver son chemin',
      detailEs: 'Subir da hambre y cansancio. Desde arriba, ven el río y ya no están perdidos.',
      detailFr: 'Monter donne faim et fatigue. D’en haut, ils voient la rivière et ne sont plus perdus.'
    },
    mapa: {
      nameFr: 'La carte', shortEs: 'Guardar un mapa para orientarse', shortFr: 'Garder une carte pour s’orienter',
      detailEs: 'Un personaje encuentra y guarda el mapa: ya no está perdido. El mapa evita perderse en la selva o al huir del jaguar.',
      detailFr: 'Un personnage trouve et garde la carte : il n’est plus perdu. La carte évite de se perdre dans la jungle ou en fuyant le jaguar.'
    },
    mochila: {
      nameFr: 'Le sac à dos', shortEs: 'Comer y guardar la comida', shortFr: 'Manger et garder la nourriture',
      detailEs: 'Un personaje encuentra una mochila con comida. Come, ya no tiene hambre y guarda comida para después.',
      detailFr: 'Un personnage trouve un sac avec de la nourriture. Il mange, n’a plus faim et garde de la nourriture pour plus tard.'
    },
    cuerda: {
      nameFr: 'La corde', shortEs: 'Guardar una cuerda para cruzar', shortFr: 'Garder une corde pour traverser',
      detailEs: 'Un personaje encuentra y guarda una cuerda. Después, puede cruzar el río sin mojarse, solo o con otro personaje.',
      detailFr: 'Un personnage trouve et garde une corde. Ensuite, il peut traverser la rivière sans se mouiller, seul ou avec un autre personnage.'
    },
    manta: {
      nameFr: 'La couverture', shortEs: 'Calentarse y guardar la manta', shortFr: 'Se réchauffer et garder la couverture',
      detailEs: 'Un personaje encuentra una manta y ya no tiene frío. La guarda para protegerse de la tormenta, solo o con otro personaje.',
      detailFr: 'Un personnage trouve une couverture et n’a plus froid. Il la garde pour se protéger de l’orage, seul ou avec un autre personnage.'
    },
    linterna: {
      nameFr: 'La lampe torche', shortEs: 'Guardar una luz para la noche', shortFr: 'Garder une lumière pour la nuit',
      detailEs: 'Un personaje encuentra una linterna y ya no tiene miedo. La guarda: de noche, puede dormir solo sin miedo.',
      detailFr: 'Un personnage trouve une lampe torche et n’a plus peur. Il la garde : la nuit, il peut dormir seul sans peur.'
    },
    rescate: {
      nameFr: 'Le sauvetage', shortEs: 'Ser rescatado y volver a casa', shortFr: 'Être sauvé et rentrer chez soi',
      detailEs: 'El helicóptero no ve a un personaje perdido y solo. A dos, se encuentran antes del rescate. Una vez a salvo, un personaje ya no puede aparecer después.',
      detailFr: 'L’hélicoptère ne voit pas un personnage perdu et seul. À deux, ils se retrouvent avant le sauvetage. Une fois sauvé, un personnage ne peut plus apparaître ensuite.'
    },
    sant_jordi: {
      nameFr: 'La fête de Sant Jordi', shortEs: 'Elegir y compartir un libro', shortFr: 'Choisir et partager un livre',
      detailEs: 'A solas, el personaje elige un libro. A dos, quien ya tiene un libro lo comparte con quien todavía no tiene uno.',
      detailFr: 'Seul, le personnage choisit un livre. À deux, celui qui a déjà un livre le partage avec celui qui n’en a pas encore.'
    },
    alhambra: {
      nameFr: 'L’Alhambra', shortEs: 'Encontrar los patios con ayuda', shortFr: 'Trouver les patios avec de l’aide',
      detailEs: 'Si nadie ha consultado el plano en el centro cultural, se pierden. Un personaje que conoce ese plano puede guiar a otro que esté perdido.',
      detailFr: 'Si personne n’a consulté le plan au centre culturel, ils se perdent. Un personnage qui connaît ce plan peut guider un autre personnage perdu.'
    },
    ofrenda: {
      nameFr: 'L’offrande du souvenir', shortEs: 'Recordar y preparar una ofrenda', shortFr: 'Évoquer un proche et préparer l’offrande',
      detailEs: 'A solas, el personaje recuerda a un ser querido. Para preparar la ofrenda a dos, uno debe tener ese recuerdo y ambos haber preparado papel en el taller.',
      detailFr: 'Seul, le personnage évoque un être cher. Pour préparer l’offrande à deux, l’un doit avoir ce souvenir et chacun avoir préparé du papier à l’atelier.'
    },
    mercado_cusco: {
      nameFr: 'Le marché de Cusco', shortEs: 'Comprar y compartir un almuerzo', shortFr: 'Acheter et partager un repas',
      detailEs: 'A solas, el personaje compra comida y la guarda. A dos, si solo uno tiene comida y el otro tiene hambre, comparten y ya no tienen hambre.',
      detailFr: 'Seul, le personnage achète de la nourriture et la garde. À deux, si un seul a de la nourriture et que l’autre a faim, ils partagent et n’ont plus faim.'
    },
    tango: {
      nameFr: 'Le tango', shortEs: 'Ensayar, descansar y bailar juntos', shortFr: 'Répéter, se reposer et danser ensemble',
      detailEs: 'Primero ensayan y se cansan. Después de descansar, vuelven a dos. Si ambos han ensayado y ninguno está cansado, bailan juntos.',
      detailFr: 'D’abord, ils répètent et se fatiguent. Après s’être reposés, ils reviennent à deux. Si chacun a répété et qu’aucun n’est fatigué, ils dansent ensemble.'
    },
    barriletes: {
      nameFr: 'Les cerfs-volants', shortEs: 'Construir y exponer un barrilete', shortFr: 'Construire et exposer un cerf-volant',
      detailEs: 'Los dos deben preparar papel en el taller. Después, juntos, construyen un barrilete. Al volver juntos, lo exponen.',
      detailFr: 'Les deux doivent préparer du papier à l’atelier. Ensuite, ensemble, ils construisent un cerf-volant. En revenant ensemble, ils l’exposent.'
    },
    plaza_cultural: {
      nameFr: 'La place', shortEs: 'Pasear da hambre y cansancio', shortFr: 'Se promener donne faim et fatigue',
      detailEs: 'Los personajes pasean por la plaza. El paseo da hambre y cansancio.',
      detailFr: 'Les personnages se promènent sur la place. La promenade donne faim et fatigue.'
    },
    taller_cultural: {
      nameFr: 'L’atelier', shortEs: 'Preparar papel para crear después', shortFr: 'Préparer du papier pour créer ensuite',
      detailEs: 'A solas o a dos, preparan papel decorado. Cada personaje recuerda esta preparación para crear algo después.',
      detailFr: 'Seuls ou à deux, ils préparent du papier décoré. Chaque personnage garde cette préparation pour créer quelque chose ensuite.'
    },
    centro_cultural: {
      nameFr: 'Le centre culturel', shortEs: 'Consultar un plano y descansar', shortFr: 'Consulter un plan et se reposer',
      detailEs: 'Consultan el plano y lo recuerdan para después. Descansan: ya no están perdidos ni cansados.',
      detailFr: 'Ils consultent le plan et s’en souviennent pour la suite. Ils se reposent : ils ne sont plus perdus ni fatigués.'
    },
    don_quijote: {
      nameFr: 'Les moulins', shortEs: 'Distinguir los molinos de gigantes', shortFr: 'Distinguer les moulins des géants',
      detailEs: 'A solas, el personaje imagina gigantes y tiene miedo. Otro personaje que ha consultado el plano en el centro cultural le ayuda a reconocer los molinos: ya no tiene miedo.',
      detailFr: 'Seul, le personnage imagine des géants et a peur. Un autre personnage qui a consulté le plan au centre culturel l’aide à reconnaître les moulins : il n’a plus peur.'
    },
    macondo: {
      nameFr: 'Macondo', shortEs: 'Escribir etiquetas para recordar nombres', shortFr: 'Écrire des étiquettes pour se souvenir',
      detailEs: 'A solas, el personaje olvida los nombres. Otro personaje que ha preparado papel en el taller le ayuda a escribir etiquetas y recordar.',
      detailFr: 'Seul, le personnage oublie les noms. Un autre personnage qui a préparé du papier à l’atelier l’aide à écrire des étiquettes pour se souvenir.'
    },
    biblioteca_borges: {
      nameFr: 'La bibliothèque labyrinthe', shortEs: 'Salir del laberinto con ayuda', shortFr: 'Sortir du labyrinthe avec de l’aide',
      detailEs: 'A solas y sin conocer el plano, el personaje se pierde. Otro personaje que ha consultado el plano en el centro cultural puede ayudarlo a salir.',
      detailFr: 'Seul et sans connaître le plan, le personnage se perd. Un autre personnage qui a consulté le plan au centre culturel peut l’aider à sortir.'
    },
    casa_azul: {
      nameFr: 'La Maison bleue', shortEs: 'Observar y pintar su autorretrato', shortFr: 'Observer et peindre son autoportrait',
      detailEs: 'A solas, el personaje observa un autorretrato en el museo. Para pintar, ese mismo personaje también debe haber preparado papel en el taller. Al volver con otro personaje, pinta su propio retrato.',
      detailFr: 'Seul, le personnage observe un autoportrait au musée. Pour peindre, ce même personnage doit aussi avoir préparé du papier à l’atelier. En revenant avec un autre personnage, il peint son propre portrait.'
    }
  };

  const characters = {
    lucia: { shortEs: 'Alegre, siempre está cantando', shortFr: 'Joyeuse, elle chante tout le temps' },
    mateo: { shortEs: 'Siempre tiene mucho apetito', shortFr: 'Il a toujours beaucoup d’appétit' },
    valeria: { shortEs: 'Una exploradora muy valiente', shortFr: 'Une exploratrice pleine de courage' },
    diego: { shortEs: 'Miedoso, pero cuenta historias', shortFr: 'Peureux, mais il raconte des histoires' },
    kiwi: { shortEs: 'El loro que lo ve todo', shortFr: 'Le perroquet qui voit tout' }
  };

  const lexicon = {
    selva: 'jungle', río: 'rivière', sol: 'soleil', tormenta: 'orage', noche: 'nuit', jaguar: 'jaguar', serpiente: 'serpent',
    frutas: 'fruits', fuego: 'feu', refugio: 'refuge', montaña: 'montagne', mapa: 'carte', mochila: 'sac à dos', cuerda: 'corde',
    manta: 'couverture', linterna: 'lampe torche', helicóptero: 'hélicoptère', comida: 'nourriture', agua: 'eau',
    hambre: 'faim', sed: 'soif', frío: 'froid', miedo: 'peur', cansado: 'fatigué', herido: 'blessé', perdido: 'perdu',
    'a salvo': 'en sécurité', amigos: 'amis', enfadado: 'fâché', contento: 'content', triste: 'triste', solo: 'seul', juntos: 'ensemble', tranquilo: 'calme',
    caminar: 'marcher', beber: 'boire', comer: 'manger', dormir: 'dormir', encontrar: 'trouver', cruzar: 'traverser', correr: 'courir',
    gritar: 'crier', compartir: 'partager', curar: 'soigner', descansar: 'se reposer', subir: 'monter', ver: 'voir', llover: 'pleuvoir',
    'hacer calor': 'faire chaud', 'pedir perdón': 'demander pardon', guardar: 'garder', encender: 'allumer', morder: 'mordre', avisar: 'prévenir',
    perderse: 'se perdre', mojarse: 'se mouiller', taparse: 'se couvrir',
    libro: 'livre', rosa: 'rose', elegir: 'choisir', leer: 'lire', patio: 'cour intérieure', palacio: 'palais', fuente: 'fontaine', plano: 'plan', guiar: 'guider',
    ofrenda: 'offrande', flor: 'fleur', recuerdo: 'souvenir', recordar: 'se souvenir', papel: 'papier', mercado: 'marché', almuerzo: 'repas de midi', comprar: 'acheter',
    tango: 'tango', música: 'musique', ensayar: 'répéter', bailar: 'danser', barrilete: 'cerf-volant', color: 'couleur', construir: 'construire', exponer: 'exposer',
    plaza: 'place', taller: 'atelier', dibujar: 'dessiner', preparar: 'préparer', 'centro cultural': 'centre culturel', consultar: 'consulter',
    molino: 'moulin', gigante: 'géant', imaginar: 'imaginer', reconocer: 'reconnaître', nombre: 'nom', etiqueta: 'étiquette', olvidar: 'oublier', escribir: 'écrire',
    biblioteca: 'bibliothèque', laberinto: 'labyrinthe', salida: 'sortie', autorretrato: 'autoportrait', espejo: 'miroir', observar: 'observer', pintar: 'peindre'
  };

  return { scenes, characters, lexicon };
});
