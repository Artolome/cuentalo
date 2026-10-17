# Objets illustrés de l’exploration

Les objets interactifs utilisent des illustrations originales peintes, créées avec l’outil ImageGen intégré à Codex le 17 octobre 2026. Les couleurs des éléments pédagogiques sont conservées. Aucun objet n’a été dessiné, détouré ou recoloré par code.

## Organisation

- Les 32 WebP de diffusion se trouvent dans `src/art/assets/exploration-objects/`.
- Cette fiche documente 15 images : `tree`, `flower-red`, `book-blue`, `well`, `bench`, `horse`, `mill`, `mill-sails`, `letter`, `key`, `lamp`, `star`, `bell`, `canvas-empty`, `canvas-painted`.
- Les huit variantes nature sont documentées dans [OBJETOS_NATURALEZA.md](OBJETOS_NATURALEZA.md).
- Les neuf variantes livres, portes et peinture sont documentées dans [OBJETOS_TALLER.md](OBJETOS_TALLER.md).
- Les sources originales PNG sont conservées dans le dossier de travail `outputs/exploration-objects/`, puis archivées dans le dossier de tâche de même nom, hors dépôt. Elles ne sont pas nécessaires pour jouer.

## Style et méthode

Les décors `src/art/assets/escenas-cartoon/casa_azul.png` et `don_quijote.png`, ainsi que le personnage `src/art/assets/exploration/frida.png`, ont été inspectés pour accorder les matières, la lumière et les formes. Ces fichiers n’ont pas été envoyés comme références lors des nouvelles générations.

Chaque objet de base correspond à un appel distinct à ImageGen avec `transparent_background: true`, sans référence image. La toile peinte correspond à une édition distincte de `canvas-empty.png`, inspectée avant l’appel, avec `referenced_image_paths` et transparence conservée. Aucun montage de plusieurs objets n’a été utilisé pour produire les assets.

Les sources reçues pour ces 15 objets sont des PNG RGBA de 1254 × 1254 pixels. L’export technique Pillow réduit l’image entière avec Lanczos vers 512 × 512, conserve l’alpha et enregistre du WebP avec `quality=85`, `method=6`, `exact=True`. Le cadrage n’est pas recoupé ; aucune couleur n’est modifiée. Chaque fichier a été ouvert, inspecté visuellement et vérifié en RGBA 512 × 512 avec alpha minimum 0 et maximum 255.

## Moulin : deux couches animables

`mill.webp` contient la tour sans pales ; `mill-sails.webp` contient uniquement le rotor. Les deux canevas sont identiques, 512 × 512. La consigne initiale demandait un moyeu à 50 % × 38 %, mais les images produites placent visuellement le moyeu de la tour vers 50 % × 43 % et celui du rotor vers 50 % × 45 %. L’intégration aligne donc le rotor avec `top: -2%` et son pivot avec `transform-origin: 50% 45%`. Les illustrations sont conservées telles que générées.

## Prompts exacts

Pour les 14 nouvelles générations ci-dessous, le prompt exact est le préfixe commun, une espace, puis le texte de la section correspondante.

### Préfixe commun

```text
Use case: illustration-story. Asset type: one isolated 2D game object for a warm painted storybook adventure. Create an original charming hand-painted illustration with gouache and watercolor texture, soft cel-shaded light, organic rounded forms, subtle cocoa-brown contours and rich luminous colors. It should belong beside hand-painted Mediterranean and tropical storybook backgrounds, with warm sunlight from upper left. No photorealism, no plastic 3D rendering, no flat vector icon. Square 1024x1024 composition, complete single object centered, occupying about 80 percent of canvas, ample empty transparent margin on EVERY side. True transparent alpha background, no scenery, floor, background color or gradient, no frame or ground cast shadow. No people, faces, text, logo or label. Clear simple silhouette recognizable at small size, carefully painted materials.
```

### tree

```text
Subject: one lovely medium-size leafy green tree, a sturdy gently curving warm-brown trunk, a few visible branches, a full rounded asymmetric canopy with layered olive, jade and sunlit lime green foliage. Full tree from crown to roots. Small roots only at base, no landscape patch, no fruit, flowers, pot, animals, or objects. View from slightly above ground level, three-quarter front.
```

### flower-red

```text
Subject: one RED flower growing on a single graceful green stem with two green leaves. A large cheerful bloom with seven rounded velvety petals, dominant saturated warm red color close to #df4d45, golden-yellow pollen center. Entire stem ends at the bottom; no pot, no soil or grass. Main bloom faces the viewer, stem slightly curves. Keep the blossom unmistakably RED for a color-learning game.
```

### book-blue

```text
Subject: one closed old-fashioned hardback book, standing upright with a gentle three-quarter turn so the front cover and cream page edge are visible. The entire cloth/leather front cover is a vivid medium BLUE close to #398dca, with simple embossed blue border and tiny subtle gold corner details. Rounded worn corners, warm ivory pages, beautiful tactile brushwork. Absolutely NO title, letters, writing, symbol, illustration or other color on the cover. Blue cover dominates the silhouette.
```

### well

```text
Subject: one rustic round stone water well made of warm beige and gray blocks, low circular rim with visible dark turquoise water inside, two wooden posts supporting a small terracotta-brown pitched wooden roof, winding spindle and one rope with a little wooden bucket attached over the opening. Charming rounded craftsmanship, visible stone joints and warm wood grain. Three-quarter front, complete well from roof to base, no person or surrounding landscape.
```

### bench

```text
Subject: one inviting rustic garden bench, warm honey-brown wood, three gently weathered horizontal backrest planks, broad wooden seat and four solid short legs, subtle rounded edges, simple curved wooden side supports. Three-quarter front so seat and back are clearly readable. Entire bench with all legs, no cushion, flowers, text or other objects.
```

### horse

```text
Subject: one gentle lean tan-gray horse with a warm taupe coat close to #b6a17b, dark brown mane and tail, soft kind eyes, a simple brown leather saddle and bridle. Rocinante as a healthy friendly storybook horse, modest and slender, not a muscular racehorse. Whole animal in relaxed standing pose in three-quarter side view facing IMAGE RIGHT, all four legs and hooves, both ears and entire tail visible. No rider, person, grass, hay, fence or ground.
```

### mill

```text
Subject: one traditional La Mancha windmill TOWER ONLY, white-cream limewashed cylindrical stone tower, slightly tapering up, small dark slate-gray conical roof, tiny warm-brown arched door near base, small stone threshold. NO SAILS OR BLADES: they are a separate animated layer. A small ROUND wooden axle hub must be clearly visible on the front at precisely 50 percent of image width and 38 percent of image height. Use a straight-on front camera so that hub is horizontally centered. Square canvas layout: roof peak around 16 percent height, roof/tower join around 33 percent, tower base at 89 percent. Tower body spans roughly 30 to 70 percent width. Keep all margins transparent. No scenery or extra objects.
```

### mill-sails

```text
Subject: ONLY one detached traditional wooden windmill rotor with FOUR lattice sails arranged in a symmetrical diagonal X around a small round brown wooden central hub. Warm honey wood beams and beige woven-cloth accents, beautifully painted wood grain. Straight-on front view, flat plane with no perspective tilt. NO tower, building, background or other object. Precise square canvas layout is essential: center of round axle hub at 50 percent width and 38 percent height, NOT the canvas vertical center. Each sail extends about 31 percent of the canvas from that hub, arranged diagonally toward four corners; generous transparent clearance, full rotor visible. The lower quarter of the square remains empty transparent because this will overlay a tower whose base is lower. The X arms must be equal and meet at the exact hub.
```

### letter

```text
Subject: one sealed cream parchment envelope, slightly angled but mostly facing the viewer, visible folded triangular back flap and a round warm red wax seal at its center. Soft buttery ivory paper with delicate painted texture, elegant rounded edges. Entire envelope; no writing, addresses, postal stamps, symbols, letters, ribbon, hands or extra paper.
```

### key

```text
Subject: one antique golden-brass key with a large round ornamental bow containing a clearly OPEN transparent circular hole, a straight slender shaft and two simple square teeth at its far end. Key diagonally oriented from round bow upper-left to teeth lower-right, all parts complete. Warm gold close to #e9b748, amber shaded edges and pale gold highlights. No ribbon, ring, chain, floating sparkles, text or other objects.
```

### lamp

```text
Subject: one old-fashioned small brass lantern, warm brown-gold metal frame and foot, arched metal carrying handle, glass panes filled with a warm golden candle-like light, small stylized flame inside. Full lantern silhouette with handle, rounded cap, glass body and stable base visible, front three-quarter view. Gold glow confined INSIDE the glass with subtle highlights on metal, no opaque halo or background. No hand, stand or other object.
```

### star

```text
Subject: one lovely golden-yellow FIVE-POINTED star collectible, softly rounded point tips, gently sculpted painted surface with warm amber shadows and light-yellow highlights. Dominant sunny yellow close to #f4d35c, full star front-facing with one point upright, no face or eyes, no hanging string, no text, no surrounding sparkles or glow halo.
```

### bell

```text
Subject: one golden brass bell with a small hanging loop at the top, rounded flared bell body, rolled lower lip and a dark warm-brown clapper visible below. Warm golden yellow close to #e9b748, painterly amber shadows and soft pale-gold highlights. Full single bell front view, no wooden frame, no stand, no rope, no sound marks or extra decoration.
```

### canvas-empty

```text
Subject: one wooden painter's easel holding a completely BLANK warm-ivory canvas, color close to #fff5db. Full easel, top support, three wooden legs and bottom canvas shelf visible, stable simple honey-brown wood construction. Canvas is a clean upright near-square rectangle, completely unpainted. Mostly front-facing with a very slight three-quarter depth so a later painted version can keep the exact same silhouette. Centered entire object, no paint tubes, brushes, palette, stool, text or extra objects.
```

### canvas-painted — édition

Référence : PNG source `canvas-empty.png`. Paramètre `transparent_background: true`.

```text
Edit the supplied transparent painted easel game asset. Preserve the EXACT composition, camera, silhouette, scale, wooden easel, every support and leg, warm light, margins, and transparent alpha background. Change ONLY the interior surface of the blank ivory canvas into a finished charming ORIGINAL painting: a sunny garden with two soft green rolling hills, a warm golden sun in a pale sky, and three prominent red flowers with green leaves near the foreground. Use broad confident hand-painted gouache strokes, lively simple forms, warm colors, and delicate canvas texture, matching the existing storybook asset. Leave a narrow ivory border around the painted surface. Keep the same canvas perspective. No people, faces, text, signature, logo, extra props, new frame or background. Do not reproduce any existing artwork. Everything outside the canvas painting remains unchanged and fully transparent where originally transparent.
```

La peinture est une composition originale de jardin, sans reprise d’une œuvre de Frida Kahlo ni d’un autre artiste. Le chevalet, le cadrage et la transparence de la référence restent visuellement cohérents entre les deux états.
