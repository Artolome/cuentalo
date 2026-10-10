# Personnages cartoon de Cuéntalo

Les cinq personnages adoptent un dessin cartoon d'aventure jeunesse : grands yeux expressifs, contours chocolat, cheveux et accessoires détaillés, couleurs franches et ombres en aplats. Lucía garde sa casquette corail et ses boucles, Mateo son maillot bleu et son sac, Valeria sa tresse et son appareil photo, Diego ses boucles auburn et son carnet. Kiwi est un **perroquet vert à bec corail**, conforme au contenu du jeu.

## Production et provenance

Les ressources sont dans [src/art/assets/personajes-cartoon](../src/art/assets/personajes-cartoon/). Les cinq atlas ont été créés avec l'outil intégré **image_gen.imagegen**, option `transparent_background: true`. Lucía a servi de référence de style pour les quatre autres personnages. Quatre retouches ImageGen, une pour Mateo, Valeria, Diego et Kiwi, ont ensuite élargi les marges entre les poses sans changer leur identité ni leurs émotions.

Les cinq `<id>.source.png` sont les originaux sélectionnés, conservés sans modification. Les `<id>.webp` sont leur compression en qualité 85, méthode 6 : même résolution, aucun redimensionnement, canal alpha identique octet pour octet. Les cinq images mesurent **1182 × 1330 pixels**. Le total WebP est **1 722 544 octets**, avant encodage dans le HTML autonome.

Les **prompts exacts** et les références de chaque génération figurent dans [prompts.json](../src/art/assets/personajes-cartoon/prompts.json) : `initial.<id>.prompt` pour les cinq générations et `gridCorrection.prompt` pour les quatre corrections de cadrage. Aucun appel CLI ni outil tiers de retouche n'a été utilisé. Les identifiants des générations écartées restent documentés sans ajouter leurs fichiers au jeu.

## États et cadrage

Chaque atlas contient 4 colonnes × 3 lignes, dans cet ordre :

1. `contento`, `feliz`, `miedo`, `hambre` ;
2. `sed`, `frio`, `cansado`, `herido` ;
3. `perdido`, `enfadado`, `triste`, `contento`.

Le jeu utilise les onze premiers états ; le dernier est un doublon neutre. Un état inconnu affiche `contento`.

Le [manifest](../src/art/assets/personajes-cartoon/manifest.json) documente les douze rectangles **[x, y, largeur, hauteur]** de chaque atlas, leur échelle, les dimensions, poids, empreintes SHA-256 et vérifications alpha. Les rectangles suivent le contenu alpha > 32 avec une marge de 2 pixels. Ils compensent les petits écarts de grille générés, notamment les pieds de Diego près de la séparation des deux premières lignes.

Les mêmes coordonnées sont intégrées dans `CARTOON_FRAMES` de [personajes.js](../src/art/personajes.js). Une fenêtre SVG imbriquée cadre chaque pose sans modifier le raster. Toutes les poses d'un personnage partagent l'échelle `min(134 / hauteurMax, 92 / largeurMax)`, sont centrées horizontalement et placent les pieds à **y = 144** dans le repère **100 × 150**. Les proportions restent intactes ; Kiwi est plus petit pour contenir ses ailes ouvertes. Les portraits cadrent le visage et le buste (`14 3 72 83` pour les humains, `9 30 82 91` pour Kiwi). Toute nouvelle génération impose de mettre à jour le manifeste et ces coordonnées ensemble.

## Intégration et validation

Le build fournit `window.SVPersonajesCartoon = { lucia: URI, mateo: URI, valeria: URI, diego: URI, kiwi: URI }`, avec les WebP intégrés au HTML. L'API `personajeSVG(p, expresion, opts)` / `retratoSVG(p)` est conservée ; elle accepte aussi le global Node pour les rendus sans navigateur. Le dessin vectoriel précédent reste le repli si une ressource illustrée manque.

Vérifications réalisées : vrai alpha des cinq PNG ; alpha conservé dans les cinq WebP ; syntaxe JavaScript et XML des 60 variantes (11 émotions + portrait par personnage) ; chargement via `window`, état inconnu, repli vectoriel, pieds alignés et largeur contenue. La galerie finale, le jeu sur mobile et l'impression ont été vérifiés lors de l'intégration : aucun résidu de cellule voisine ni membre coupé dans les poses affichées.
