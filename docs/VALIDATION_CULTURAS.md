# Validation des chapitres culturels

Version construite le 16 octobre 2026 (date UTC du fichier autonome).

## Contenu et moteur

- 26 niveaux officiels et un niveau libre ; 10 nouvelles énigmes en deux chapitres.
- Solveur complet : 26 niveaux, zéro erreur, zéro avertissement. Les 16 anciens niveaux et leurs comptes de solutions sont conservés.
- `test/cultura.js` : comparaison exhaustive des 7 290 histoires possibles des nouveaux niveaux avec le solveur mémoïsé ; ordre, préparatifs et coopération ; présent/passé et accords ; import Auteur ; anciennes chaînes de partage inchangées ; restauration des parties.
- Métadonnées culturelles mal typées : entrées ignorées sans plantage dans le lexique et la fiche. Vérification spécifique de cinq cas invalides dans le rendu UI.
- `test/frases.js` : 2 039 phrases, contrôles automatiques OK.
- `test/escritor.js` : 7 408 contrôles ; `test/autor.js` : 510 ; `test/pizarra.js` : 25 ; sauvegarde : OK.
- 30 scènes et 61 événements restent dans les limites du format Auteur v1. Les tables sont prolongées sans déplacer les anciennes entrées.

## Interface

Vérification interactive avec le navigateur intégré sur serveur local :

- Accueil : nouveaux accès « Viajes y culturas » et « Libros y artistas » ; dix niveaux présents dans le sélecteur.
- Don Quichotte et Frida : histoires jouées jusqu'à la réussite par les boutons de cartes et de cases. Rechargement de Don Quichotte : récit et réussite restaurés.
- Fiches culturelles avec noms des auteurs/œuvres ; vocabulaire de Frida dans le panneau d'écoute.
- Ordinateur, 1 366 × 900 : illustrations, visages et textes lisibles.
- Téléphone, 390 × 844 : pas de débordement horizontal du document ; bande de cartes défilante ; trois phrases intégralement accessibles.
- Vidéoprojecteur, 1 280 × 720 : ofrenda résolue. Les trois phrases n'ont plus de débordement interne après adaptation de la largeur et de la typographie. La fiche culturelle s'affiche au-dessus du plateau puis se ferme à la sélection d'une carte sur les écrans bas.
- Aucun message d'erreur JavaScript relevé lors du parcours Don Quichotte.

## Illustrations et impression

Treize sources PNG et treize WebP intégrés, tous inspectés individuellement. Le cadre décoratif du tango a été corrigé pour enlever une silhouette. Aucun ancien asset remplacé. Prompts et contrôles : `ART_CULTURAS.md` et `ART_LIBROS.md`.

`test/imprimir.js` passe sur l'ancien niveau c2n1 et le nouveau c5n4. La structure HTML des dix nouveaux niveaux comporte trois pages, les phrases, le repère culturel et les illustrations intégrées ; les champs texte restent échappés. Le rendu visuel A4 de cette extension n'a pas été contrôlé dans le navigateur : l'ouverture du fichier local d'aperçu a été refusée par sa politique d'URL.

Le build reste un fichier autonome sans référence réseau externe. `git diff --check` et la vérification syntaxique de l'interface passent.
