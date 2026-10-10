# Cuéntalo

Jeu de narration visuelle en espagnol (A1 → A2) inspiré de *Storyteller* : un titre en espagnol, 3 à 6 cases de BD, des **escenas** et des **personajes** à glisser ; chaque case produit une phrase en espagnol générée par le moteur. Quand l'histoire réalise le titre, le niveau est réussi.

Un carnet d'aventure **cartoon** : cinq compagnons détaillés, de grands yeux expressifs, des contours bruns et dix-sept décors aux ambiances distinctes. Rivière turquoise, savane ocre, orage violet, nuit indigo et campement orangé se reconnaissent dès la petite carte. Lucía garde sa casquette, Mateo son maillot, Valeria son appareil photo et Diego son carnet ; Kiwi est un perroquet vert. Leurs visages et leurs poses montrent la soif, le froid, la peur ou la joie.

**Jouer en ligne :** https://artolome.github.io/cuentalo/

**Jouer hors-ligne :** télécharger [`cuentalo.html`](cuentalo.html) (bouton « Download raw file ») et l'ouvrir par double-clic : un seul fichier, aucune donnée envoyée ; Chrome, Edge ou Firefox. Guide de la professeure : [`docs/GUIA_PROFE.md`](docs/GUIA_PROFE.md).
Écran d'accueil : **Pizarra** (classe, vidéoprojecteur) · **Solo** (élève) · **Autor** (créer un niveau). Sélecteur ★ / ★★ / ★★★ en haut à droite. Touche **P** : panneau Profe (mot de passe par défaut `profe`).
Paramètres d'URL facultatifs : `cuentalo.html?modo=pizarra&nivel=c2n1&dif=2`.

**Pour commencer :** « ? Ayuda » accompagne les premiers gestes (escena → personaje → suite de l'histoire → titre). Les histoires en cours se sauvegardent automatiquement sur ce navigateur et se reprennent après fermeture ou changement de niveau. Une fois un niveau réussi, « ✎ Contar » propose de raconter avec ses propres mots en trois étapes : « Primero… », « Después… », « Al final… », à l'oral ou à l'écrit. Ce récit personnel ne reçoit pas de correction automatique ; son brouillon reste sur le poste.

## Sources

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

- `docs/GUIA_PROFE.md` — guide de la professeure : prise en main, niveaux et solutions, déroulés, différenciation, Autor, impression, RGPD, dépannage
- `docs/CONTENIDO.md` — modèle de contenu (personajes, estados, escenas, règles, niveaux, gabarits, lexique)
- `docs/DECISIONS.md` — choix et points à vérifier, phase par phase
- `docs/frases.txt` — toutes les phrases générables (relecture linguistique)
- `docs/ejemplo_impresion.html` — aperçu de « Imprimir mi historia » (BD résolue + hojas de viñetas), généré par `node test/imprimir.js`
- `docs/lexico_fuente.md` — lexique réel des decks de ¡Sobrevive!
- `docs/ART_DIRECTION.md` — direction visuelle, ressources et prompts de génération
- `scripts/galeria-art.js` — génère une planche HTML autonome des personnages, émotions et décors pour contrôle visuel
