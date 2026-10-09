# Vérification de la version forêt et récits

Ce rapport concerne la première proposition. Les illustrations ont ensuite été remplacées par la [révision cartoon](VALIDATION_CARTOON_2026-10-09.md), dont les contrôles et le poids du fichier sont documentés séparément.

Le jeu reste un fichier HTML autonome, incluant trois décors WebP et tous les scripts. Aucun service d'IA ni compte n'est requis pendant le jeu.

## Vérifications exécutées

- `node build.js` : génération du HTML autonome, environ 1,43 Mio, contrôle des références externes réussi.
- `node test/solver.js` : 16 niveaux, aucune erreur ni avertissement.
- `node test/frases.js` : 1 634 phrases, contrôles réussis.
- `node test/escritor.js` : 5 414 vérifications, aucune erreur.
- `node test/autor.js` : 390 vérifications, aucune erreur.
- `node test/pizarra.js` : 25 vérifications réussies.
- `node test/partidas.js` : reprise par niveau, réponses écrivain, récits, nettoyage des données, données corrompues et stockage refusé.
- `node test/imprimir.js` : génération de la BD et des deux feuilles A4 avec les nouveaux décors intégrés.
- Syntaxe JavaScript, génération des 60 variantes de personnages SVG, scripts autonomes et correspondance des trois ressources WebP vérifiés.

## Essais dans le navigateur

Essais manuels dans le navigateur intégré, via le serveur local :

- Couverture et plateau à 1 366 × 900 ; interface mobile à 390 × 844.
- Niveau 1 joué jusqu'à la victoire avec clic sur une carte, puis clic sur une vignette.
- Aide passant du choix de scène à l'ajout du personnage, puis à la construction du récit.
- Scène et personnage conservés après rechargement.
- Deux niveaux ouverts successivement ; retour au premier avec BD intacte.
- Retour sur une histoire gagnée sans répétition de la fenêtre de victoire.
- Trois phrases personnelles saisies puis retrouvées après rechargement.
- Mode écrivain A1 : réponse correcte conservée après rechargement, autres réponses toujours masquées.
- Mode Pizarra à 1 280 × 720, six vignettes accessibles sans débordement de la page.
- Aucun message d'erreur JavaScript observé dans la console pendant ces parcours.

La suite automatisée `test/navegador.js` n'a pas été exécutée dans les navigateurs externes pendant cette intervention. Les essais visuels ci-dessus ne constituent pas une validation sur tous les appareils ni un essai pédagogique en classe.
