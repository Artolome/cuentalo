# Sobrevives

Jeu de narration visuelle en espagnol (A1 → A2) inspiré de *Storyteller* : un titre en espagnol, 3 à 6 cases de BD, des **escenas** et des **personajes** à glisser ; chaque case produit une phrase en espagnol générée par le moteur. Quand l'histoire réalise le titre, le niveau est réussi.

**Jouer :** ouvrir `sobrevives.html` (un seul fichier, hors-ligne, aucune donnée envoyée ; Chrome, Edge ou Firefox).
Écran d'accueil : **Pizarra** (classe, vidéoprojecteur) · **Solo** (élève) · **Autor** (créer un niveau). Sélecteur ★ / ★★ / ★★★ en haut à droite. Touche **P** : panneau Profe (mot de passe par défaut `profe`).
Paramètres d'URL facultatifs : `sobrevives.html?modo=pizarra&nivel=c2n1&dif=2`.

## Sources

- `src/lengua.js` — accords, conjugaison (présent / pretérito), pictos
- `src/contenido.js` — personajes, estados, escenas, niveaux
- `src/engine.js` — moteur pur et déterministe : `simular`, `resolver`, `tituloDe`, `porque`, `objetivoDeHistoria`
- `src/escritor.js` — modo escritor sans DOM : options générées par le moteur, comparaison tolérante, pista
- `src/autor.js` — modo Autor sans DOM : codes (base32 Crockford), assistant de titres, validation, stockage local
- `src/pizarra.js` — barre de classe : cronómetro, sorteo de numéros, equipos
- `src/art/personajes.js`, `src/art/escenas.js` — SVG paramétriques
- `src/ui.js` (jeu, modes, ★), `src/ui-modos.js` (escritor, Autor, Profe, impression), `src/plantilla.html` — interface
- `build.js` → `sobrevives.html`

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
