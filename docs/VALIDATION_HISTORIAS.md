# Validation de la bibliothèque — 15 octobre 2026

La bibliothèque remplace l'accueil général. Elle propose quatre parcours continus de cinq chapitres, avec protagonistes, choix de point de vue, fin et carnet personnel. Les anciens liens vers un mode ou un niveau conservent leur destination dans l'atelier.

## Vérifications automatisées

- Build autonome : 7 678 Kio environ ; aucun chargement réseau statique. Couvertures et décors intégrés.
- node test/historias.js : progression immuable et versionnée, stockage invalide, reprise, refus des sauts de chapitre, relecture, isolation des histoires, vingt chapitres, quarante choix, illustrations et sources HTTPS.
- node test/solver.js : vingt-six énigmes existantes, zéro erreur, zéro avertissement.
- node test/autor.js : 510 vérifications réussies ; compatibilité des anciens codes conservée.
- node test/partidas.js et node test/cultura.js : sauvegardes et dix énigmes culturelles réussies.
- Syntaxe Node des interfaces et git diff --check : réussis.

## Vérifications dans le navigateur

- Quatre livres ouverts et parcourus jusqu'à leur conclusion par les vrais boutons.
- Don Quichotte : choix de Sancho, passage au chapitre suivant puis rechargement ; reprise au chapitre deux.
- Carnet saisi, retrouvé après rechargement puis téléchargé en texte UTF-8.
- Frida : cinq chapitres parcourus à 390 × 844 ; aucune largeur de contenu supérieure à celle du lecteur.
- Relecture de Frida : choix précédent conservé et récit toujours marqué terminé.
- Retour à l'atelier puis navigation précédent/suivant du navigateur : écrans attendus retrouvés.
- Bibliothèque inspectée à 1366 × 900 et 1366 × 1050 ; lecture mobile inspectée.
- Aucun message d'erreur ou d'avertissement dans la console de l'onglet de test.

## Corrections issues de la relecture

- Un carnet malformé n'efface plus une progression narrative valide.
- Le succès différé d'une ancienne énigme ne peut plus ouvrir une fenêtre au-dessus du lecteur.
- Le retour à un ancien lien réapplique ses paramètres de niveau, mode et difficulté.
- L'atelier caché ne produit plus un second défilement sur mobile.

Les choix changent le point de vue et la réponse affichée, puis rejoignent le fil commun. Ce sont des lectures interactives à conclusion définie, sans branches inventées qui modifieraient les événements des œuvres ou la biographie.
