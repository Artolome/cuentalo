# Sobrevives

Jeu de narration visuelle en espagnol (A1 → A2) inspiré de *Storyteller* : un titre en espagnol, 3 à 6 cases de BD, des **escenas** et des **personajes** à glisser ; chaque case produit une phrase en espagnol générée par le moteur. Quand l'histoire réalise le titre, le niveau est réussi.

**Jouer :** ouvrir `sobrevives.html` (un seul fichier, hors-ligne, aucune donnée envoyée).

## Sources

- `src/lengua.js` — accords, conjugaison (présent / pretérito), pictos
- `src/contenido.js` — personajes, estados, escenas, niveaux
- `src/engine.js` — moteur pur et déterministe : `simular`, `resolver`, `tituloDe`, `porque`
- `src/art/personajes.js`, `src/art/escenas.js` — SVG paramétriques
- `src/ui.js`, `src/plantilla.html` — interface
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
node test/serve.js 4173
```

## Documentation

- `docs/CONTENIDO.md` — modèle de contenu (à valider)
- `docs/DECISIONS.md` — choix et points à vérifier
- `docs/frases.txt` — toutes les phrases générables (relecture linguistique)
- `docs/lexico_fuente.md` — lexique réel des decks de ¡Sobrevive!
