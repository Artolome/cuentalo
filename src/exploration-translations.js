/* Cuéntalo — aide française facultative pour les dialogues inventés du jeu.
 * Même ordre que SVExplorationDialogues : monde → mission → réplique.
 * Les noms des personnages restent ceux affichés dans le jeu espagnol.
 * Ces traductions n'altèrent ni les répliques espagnoles ni leurs fichiers audio.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVExplorationTranslations = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return { worlds: {
    don_quijote: {
      chapters: [
        [
          'Sancho, tu viens chercher des aventures avec moi ?',
          'Bien sûr ! Mais cherchons d’abord Rocinante.'
        ],
        [
          'Voici Rocinante, au bord du chemin.',
          'Nous pouvons continuer. Allons-y, mon ami !'
        ],
        [
          'Ces ailes sont vraiment grandes !',
          'Oui, ce sont des moulins. Le vent fait tourner leurs ailes.'
        ],
        [
          'Nous avons trois fruits pour le voyage.',
          'Parfait, gardons-en un pour la route.'
        ],
        [
          'Cette lettre vient de chez nous.',
          'Alors, rentrons avant la nuit.'
        ],
        [
          'Sancho, nous voilà à la maison.',
          'Enfin ! Maintenant, nous pouvons nous reposer.'
        ]
      ]
    },
    macondo: {
      chapters: [
        [
          'Regarde, trois papillons jaunes près de la maison.',
          'Comme ils sont beaux ! Allons vers la porte.'
        ],
        [
          'J’ai déjà ouvert la porte. Tu peux entrer.',
          'Merci, Úrsula. Il y a une lettre ici.'
        ],
        [
          'On nous invite à une fête sur la place.',
          'Apportons des fruits à partager avec les voisins.'
        ],
        [
          'Nous avons maintenant des fruits pour tout le monde.',
          'Il manque encore l’eau. Allons au puits.'
        ],
        [
          'L’eau est prête pour la fête.',
          'Il ne reste qu’à appeler les voisins.'
        ],
        [
          'La cloche sonne ! La fête commence.',
          'Allons sur la place avec les autres !'
        ]
      ]
    },
    borges: {
      chapters: [
        [
          'Voici le livre bleu que nous cherchions.',
          'Tu l’as trouvé ! Maintenant, il nous faut un peu de lumière.'
        ],
        [
          'Les deux lampes sont allumées.',
          'Maintenant, on voit le chemin vers la salle.'
        ],
        [
          'J’ai trouvé la clé dorée près des livres.',
          'Alors, nous pouvons ouvrir la porte.'
        ],
        [
          'La porte est ouverte. Entre, s’il te plaît.',
          'Merci. Regarde comme ces étoiles brillent !'
        ],
        [
          'Nous avons trois étoiles pour éclairer la bibliothèque.',
          'Tout est prêt. Prévenons les autres.'
        ],
        [
          'Bienvenue ! Il y a beaucoup de livres à découvrir.',
          'On commence par le livre bleu ?'
        ]
      ]
    },
    frida: {
      chapters: [
        [
          'Trois fleurs rouges pour égayer l’atelier.',
          'Comme elles sont belles ! On les apporte près de la fenêtre.'
        ],
        [
          'J’ai maintenant de la peinture bleue et jaune.',
          'Super ! La toile t’attend.'
        ],
        [
          'Mon tableau est terminé.',
          'J’aime beaucoup ces couleurs.'
        ],
        [
          'La porte est ouverte. Allons à l’exposition.',
          'Oui, cherchons une place pour ton tableau.'
        ],
        [
          'On voit bien mon tableau ici.',
          'Oui, d’ici, on distingue bien les détails.'
        ],
        [
          'Vous pouvez entrer ! L’exposition est ouverte.',
          'Merci, Frida. Allons regarder les tableaux.'
        ]
      ]
    }
  } };
});
