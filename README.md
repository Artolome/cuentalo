# Cuéntalo

**Un jeu d'exploration 2D en espagnol pour le collège.** Choisir un monde, déplacer son personnage dans les décors illustrés et accomplir une mission courte à la fois : parler à Sancho, ramasser trois fruits, trouver un livre ou préparer une peinture. **Quatre mondes, six missions chacun** : Don Quichotte, Macondo avec Úrsula, une bibliothèque inspirée de Borges et un atelier avec Frida. Les aventures sont imaginées pour le jeu ; elles ne constituent pas une reconstitution de la vie de Frida ni une adaptation complète des romans. [Guide des aventures](docs/EXPLORACION.md).

**Jouer :** se déplacer avec les flèches du clavier, ou cliquer/toucher un endroit du décor. Un clic sur un objet fait marcher le personnage jusqu'à lui puis agir. Au clavier, s'approcher et appuyer sur **Espace**, **E**, ou le bouton d'action. Une mission peut demander plusieurs objets : le compteur suit la collecte. Une fois l'objectif atteint, **Seguir** ouvre la mission suivante. Le réglage d'espagnol **facile / normal** change la longueur de la consigne, avec la même action à réaliser. L'audio est facultatif.

Entrée principale : `cuentalo.html?biblioteca=1`. Accès direct à un monde : `cuentalo.html?aventura=don_quijote` ; autres IDs : `macondo`, `borges`, `frida`. Les missions et les objets déjà trouvés se sauvegardent automatiquement sur le même navigateur, indépendamment des anciens puzzles.

Les illustrations peintes restent au cœur du jeu : chemins de La Mancha, village de Macondo, bibliothèque et cour bleue. Le personnage se déplace devant le décor ; objets, réactions et courtes phrases espagnoles rendent l'objectif visible.

**L'atelier de viñetas reste accessible** avec `cuentalo.html?taller=1`. Il conserve ses 26 énigmes de narration, le niveau libre, les modes Pizarra / Solo / Autor et les codes partagés. On y assemble des scènes et personnages dans des cases ; le moteur génère les phrases en espagnol. [Énigmes culturelles](docs/CULTURAS.md) · [Sources culturelles](docs/FUENTES_CULTURALES.md).

**Jouer en ligne :** https://artolome.github.io/cuentalo/

**Jouer hors-ligne :** télécharger [`cuentalo.html`](cuentalo.html) (bouton « Download raw file ») et l'ouvrir par double-clic : un seul fichier, aucune donnée envoyée ; Chrome, Edge ou Firefox. Guide de la professeure : [`docs/GUIA_PROFE.md`](docs/GUIA_PROFE.md).
Accueil de **Taller de viñetas** : **Pizarra** (classe, vidéoprojecteur) · **Solo** (élève) · **Autor** (créer un niveau). Sélecteur ★ / ★★ / ★★★ en haut à droite. Touche **P** : panneau Profe (mot de passe par défaut `profe`).
Paramètres d'URL facultatifs : `cuentalo.html?modo=pizarra&nivel=c2n1&dif=2`.

**Dans l'atelier :** « ? Ayuda » accompagne les premiers gestes (escena → personaje → suite de l'histoire → titre). Les cases en cours se sauvegardent automatiquement. Une fois un niveau réussi, « ✎ Contar » propose un récit personnel : « Primero… », « Después… », « Al final… », à l'oral ou à l'écrit, sans correction automatique. Les anciennes lectures restent disponibles par leur lien explicite, par exemple `cuentalo.html?lectura=1&historia=don_quijote` ; leur progression est conservée séparément.

## Sources

- `src/exploration-data.js` — quatre mondes, vingt-quatre missions et consignes faciles/normales
- `src/exploration-engine.js` — progression pure, proximité, mouvement et validation des sauvegardes
- `src/exploration-motion.js` — cycles des poses de marche, de parole et de peinture, réduction du mouvement
- `src/exploration-stories.js` — 24 passages courts sur les œuvres et la vie de Frida, résumés et sources
- `src/exploration-ui.js`, `src/exploration.css` — déplacement et interactions dans les décors
- `src/art/assets/exploration-motion/` — poses peintes dérivées des personnages existants, intégrées au HTML
- `src/historias-data.js` — quatre récits, vingt chapitres, choix et sources
- `src/historias-state.js` — progression pure, validation des sauvegardes et relecture
- `src/historias-ui.js`, `src/historias.css` — bibliothèque, lecture continue et carnet
- `src/art/assets/historias/` — quatre couvertures originales avec les protagonistes

- `src/lengua.js` — accords, conjugaison (présent / pretérito), pictos
- `src/contenido.js` — personajes, estados, escenas, niveaux
- `src/engine.js` — moteur pur et déterministe : `simular`, `resolver`, `tituloDe`, `porque`, `objetivoDeHistoria`
- `src/escritor.js` — modo escritor sans DOM : options générées par le moteur, comparaison tolérante, pista
- `src/autor.js` — modo Autor sans DOM : codes (base32 Crockford), assistant de titres, validation, stockage local
- `src/pizarra.js` — barre de classe : cronómetro, sorteo de numéros, equipos
- `src/art/personajes.js`, `src/art/escenas.js` — rendu SVG : portraits, découpe des planches d'expressions et décors illustrés ; dessin vectoriel de secours
- `src/art/assets/personajes-cartoon/`, `src/art/assets/escenas-cartoon/` — sources PNG et WebP intégrés au fichier autonome par `scripts/load-art.js`
- `src/ui.js` (jeu, modes, ★), `src/ui-modos.js` (escritor, Autor, Profe, impression), `src/plantilla.html` — interface
- `build.js` → `cuentalo.html`

## Commandes

Tests de l'exploration : `node test/exploration.js`. Tests des anciennes lectures : `node test/historias.js`.

Animations et récits courts : `node test/exploration-motion.js` et `node test/exploration-stories.js`.

```bash
node build.js
```

```bash
node test/solver.js
```

```bash
node test/frases.js
```

```bash
node test/escritor.js
```

```bash
node test/autor.js
```

```bash
node test/cultura.js
```

```bash
node test/pizarra.js
```

```bash
node test/imprimir.js
```

Test de bout en bout sans serveur (le jeu ouvert en `file://`, comme au double-clic), dans chaque navigateur installé :

```bash
node test/navegador.js chrome
```

```bash
node test/navegador.js edge
```

```bash
node test/navegador.js firefox
```

```bash
node test/serve.js 4173
```

## Documentation

- `docs/GUIA_PROFE.md` — guide de la professeure : exploration, atelier, niveaux et solutions, différenciation, Autor, impression, données et dépannage
- `docs/EXPLORACION.md` — mondes, missions, commandes et portée culturelle des aventures
- `docs/ART_ANIMACIONES.md` — poses animées, références et prompts de génération
- `docs/RELATOS_EXPLORACION.md` — critères éditoriaux et sources des passages entre les missions
- `docs/CONTENIDO.md` — modèle de contenu (personajes, estados, escenas, règles, niveaux, gabarits, lexique)
- `docs/DECISIONS.md` — choix et points à vérifier, phase par phase
- `docs/frases.txt` — toutes les phrases générables (relecture linguistique)
- `docs/ejemplo_impresion.html` — aperçu de « Imprimir mi historia » (BD résolue + hojas de viñetas), généré par `node test/imprimir.js`
- `docs/lexico_fuente.md` — lexique réel des decks de ¡Sobrevive!
- `docs/ART_DIRECTION.md` — direction visuelle, ressources et prompts de génération
- `docs/ART_CULTURAS.md` — treize nouveaux décors : intentions visuelles, ressources et prompts
- `scripts/galeria-art.js` — génère une planche HTML autonome des personnages, émotions et décors pour contrôle visuel
