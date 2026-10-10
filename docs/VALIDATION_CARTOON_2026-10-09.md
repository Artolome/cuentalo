# Vérification de la révision cartoon

Cette révision remplace les visuels de la première proposition par cinq personnages illustrés et dix-sept scènes distinctes. Les règles du jeu, les niveaux et la sauvegarde n'ont pas changé.

## Génération et intégration

- `node build.js` : HTML autonome de 4 994 085 octets (environ 5 Mo), contrôle des références réseau réussi.
- `node scripts/galeria-art.js` : galerie autonome des cinq personnages, cinq portraits, dix-sept décors et cinquante-cinq expressions.
- `node test/imprimir.js` : trois pages générées ; contrôle de présence des images WebP pour chaque scène et chaque personnage réussi. Le test détecte désormais un retour involontaire aux anciens personnages vectoriels dans l'environnement Node.
- Syntaxe JavaScript et scripts générés vérifiés ; `git diff --check` réussi.
- Sources PNG préservées, transparence des personnages conservée dans les WebP. Les cadrages sont réalisés par fenêtres SVG documentées dans le manifeste ; une même échelle par personnage et une ligne de pieds commune évitent les sauts entre poses.
- Revue indépendante du chargement des ressources, de la galerie, de l'impression et du repli vectoriel : aucun problème concret restant identifié.

## Contrôle visuel dans le navigateur intégré

- Galerie entière inspectée après les corrections : cinq identités distinctes, onze états par personnage, portraits lisibles ; aucune trace des cellules voisines dans les fenêtres SVG finales.
- Dix-sept environnements inspectés : couleurs, compositions et grands objets narratifs distincts. La scène `linterna` représente bien une lampe de poche électrique.
- Niveau 1 joué jusqu'à la réussite avec les scènes soleil, rivière et feu. Les poses de soif, de froid et de satisfaction correspondent aux phrases générées.
- Histoire et victoire conservées après rechargement du fichier recompilé.
- Plateau à 1 366 × 900 et mobile à 390 × 844 : cartes, personnages et phrases lisibles ; aucun débordement horizontal de la page mobile.
- Vue d'impression inspectée avec Lucía et Mateo dans une même case : illustrations intégrées, personnages entiers et phrases visibles.
- Aucun avertissement ni erreur JavaScript observé dans la console du parcours de jeu.

Les contrôles fonctionnels de la première proposition sont consignés dans [le rapport précédent](VALIDATION_2026-10-09.md). La suite automatisée des navigateurs externes n'a pas été exécutée pendant cette révision visuelle ; les vérifications ci-dessus utilisent le navigateur intégré.
