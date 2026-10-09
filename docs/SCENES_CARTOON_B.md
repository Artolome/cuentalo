# Décors cartoon — lot B

## Révision ciblée de linterna

L'illustration initiale de `linterna` montrait une lanterne de camping. Elle a été remplacée par une lampe torche électrique jaune/orange avec interrupteur et lentille, pour correspondre au vocabulaire du jeu. La grotte, la palette bleu-violet et la zone centrale libre sont conservées. Édition réalisée avec l'outil intégré `image_gen.imagegen`, `transparent_background: false`, et l'ancien `src/art/assets/escenas-cartoon/linterna.png` comme cible, après inspection. Résultat inspecté : lampe électrique clairement identifiable, sans anse ni flamme, faisceau dirigé dans la grotte. Les chemins `linterna.png` et `linterna.webp` contiennent désormais cette version finale ; même conversion WebP 1024 × 640 qualité 80.

Prompt exact d'édition :

```text
Use case: precise-object-edit.
Asset type: landscape 16:10 cartoon adventure game background.
Edit target: the supplied cave background image.
Primary request: replace ONLY the large orange oil lantern on the right-hand boulder with a large clearly recognizable handheld ELECTRIC FLASHLIGHT (Spanish: linterna). Use a yellow-orange cylindrical flashlight body, a wide circular lens and reflector at the LEFT end, a visible simple thumb switch on the top of the body, and a ridged rear battery cap at the right. Place the flashlight sideways on the same right-hand boulder, pointing diagonally toward the left and slightly downward into the cave. It must be a torch held in the hand, NOT a camping lantern: no handle arch, no hanging hook, no glass chimney, no flame, no fuel tank, no crossed lantern cage.
Keep unchanged: the blue/violet cave, tunnel, crystal and plant placements, all rocks, entire landscape framing, cheerful hand-drawn cartoon look, dark chocolate outlines, light gouache texture, color palette, empty lower central character stage. Preserve the existing warm golden light beam across the cave, now visibly originating at the flashlight lens. The flashlight remains a large readable hero object on the right, roughly the same occupied width as the old lantern. No words, text, labels, logos, people, or UI. Do not redesign any other part of the image.
```


Créés le 9 octobre 2026 avec l'outil intégré `image_gen.imagegen`, un appel distinct par décor. Aucun moteur d'images externe ni CLI/API de génération.

## Direction et méthode

- Référence visuelle uniquement : `src/art/assets/escenas-cartoon/selva.png`, inspectée avant utilisation.
- Neuf illustrations originales en paysage, ratio demandé 16:10, sans personnes, interface, logo ou texte.
- Sujet principal volontairement grand à droite ; zone basse centrale dégagée pour les personnages superposés.
- Les neuf résultats ont été inspectés individuellement : sujet identifiable, composition utilisable, variation des lieux et palette, absence de texte.
- PNG natif conservé sans modification. WebP de diffusion : redimensionnement Lanczos à 1024 × 640, qualité 80, méthode 6, RGB, avec Pillow 12.3.0. Aucun changement créatif après génération.
- Les fichiers sont `src/art/assets/escenas-cartoon/<id>.png` et `<id>.webp`.
- Les originaux ImageGen restent à leur emplacement de génération ; les copies du projet sont autonomes.

## Prompts exacts

Chaque appel a utilisé `transparent_background: false` et `referenced_image_paths: ["src/art/assets/escenas-cartoon/selva.png"]`.

### jaguar

```text
Use case: illustration-story.
Asset type: original landscape background for the children's Spanish storytelling game Cuéntalo. One complete illustration, landscape 16:10.
Style/medium: hand-drawn youth adventure cartoon; friendly rounded organic shapes, clean confident dark chocolate outlines, simple cel shading in two or three tones, very light gouache grain. Bright saturated but harmonious colors, broad readable silhouettes, a warm playful storybook mood. Neither photorealism nor detailed anime.
Composition: fill the whole frame, no border. Keep the lower central half of the image visually calm and open as an empty stage for separately overlaid game characters. The scene's defining animal or object must be large, clearly identifiable, and placed on the right side, at least one quarter of the image width, with no tiny icon treatment. Foreground terrain may cross the bottom but no important object blocks that central stage. Mild side-on perspective, readable at thumbnail size.
Constraints: no people or human characters, no words, no letters, no numbers, no signage, no UI, no logo, no watermark. Original artwork.
Scene/backdrop: lush emerald and turquoise tropical jungle with chunky ochre rocks and huge rounded leaves. A large friendly but alert spotted golden jaguar sits on the right-hand rock ledge, expressive cautious face, paws and curved tail clearly visible, no aggression. Warm shafts of sunlight. Leave open sandy olive ground across the lower middle.
Input image: the attached jungle background is a STYLE REFERENCE ONLY. Match its rounded cartoon silhouettes, crisp dark outline weight, simple cel shading, cheerful color harmony and subtle paper grain. Create the completely different setting requested above; do not copy the reference's tree placements, framing, trail or jungle arrangement.
```

### serpiente

```text
Use case: illustration-story.
Asset type: original landscape background for the children's Spanish storytelling game Cuéntalo. One complete illustration, landscape 16:10.
Style/medium: hand-drawn youth adventure cartoon; friendly rounded organic shapes, clean confident dark chocolate outlines, simple cel shading in two or three tones, very light gouache grain. Bright saturated but harmonious colors, broad readable silhouettes, a warm playful storybook mood. Neither photorealism nor detailed anime.
Composition: fill the whole frame, no border. Keep the lower central half of the image visually calm and open as an empty stage for separately overlaid game characters. The scene's defining animal or object must be large, clearly identifiable, and placed on the right side, at least one quarter of the image width, with no tiny icon treatment. Foreground terrain may cross the bottom but no important object blocks that central stage. Mild side-on perspective, readable at thumbnail size.
Constraints: no people or human characters, no words, no letters, no numbers, no signage, no UI, no logo, no watermark. Original artwork.
Scene/backdrop: a distinctive bamboo grove with curved exposed roots, mossy rounded stones and deep teal foliage. A large green snake coiled on a root on the right, long visible body and raised friendly alert head, easy to recognize as a snake rather than a vine. Lime and jade palette with turquoise shadows. The lower middle is clear soft earth.
Input image: the attached jungle background is a STYLE REFERENCE ONLY. Match its rounded cartoon silhouettes, crisp dark outline weight, simple cel shading, cheerful color harmony and subtle paper grain. Create the completely different setting requested above; do not copy the reference's tree placements, framing, trail or jungle arrangement.
```

### montana

```text
Use case: illustration-story.
Asset type: original landscape background for the children's Spanish storytelling game Cuéntalo. One complete illustration, landscape 16:10.
Style/medium: hand-drawn youth adventure cartoon; friendly rounded organic shapes, clean confident dark chocolate outlines, simple cel shading in two or three tones, very light gouache grain. Bright saturated but harmonious colors, broad readable silhouettes, a warm playful storybook mood. Neither photorealism nor detailed anime.
Composition: fill the whole frame, no border. Keep the lower central half of the image visually calm and open as an empty stage for separately overlaid game characters. The scene's defining animal or object must be large, clearly identifiable, and placed on the right side, at least one quarter of the image width, with no tiny icon treatment. Foreground terrain may cross the bottom but no important object blocks that central stage. Mild side-on perspective, readable at thumbnail size.
Constraints: no people or human characters, no words, no letters, no numbers, no signage, no UI, no logo, no watermark. Original artwork.
Scene/backdrop: a high mountain summit with huge angular-but-rounded blue and lilac mountains at multiple depths, an ochre winding rocky trail entering from the lower left and leading toward a peak, bright pale sky and puffy clouds. The dominant right-side subject is a large dramatic lavender mountain summit with a broad sloping rock ridge; no animals or equipment. The lower middle is an open level rocky lookout for game characters.
Input image: the attached jungle background is a STYLE REFERENCE ONLY. Match its rounded cartoon silhouettes, crisp dark outline weight, simple cel shading, cheerful color harmony and subtle paper grain. Create the completely different setting requested above; do not copy the reference's tree placements, framing, trail or jungle arrangement.
```

### mapa

```text
Use case: illustration-story.
Asset type: original landscape background for the children's Spanish storytelling game Cuéntalo. One complete illustration, landscape 16:10.
Style/medium: hand-drawn youth adventure cartoon; friendly rounded organic shapes, clean confident dark chocolate outlines, simple cel shading in two or three tones, very light gouache grain. Bright saturated but harmonious colors, broad readable silhouettes, a warm playful storybook mood. Neither photorealism nor detailed anime.
Composition: fill the whole frame, no border. Keep the lower central half of the image visually calm and open as an empty stage for separately overlaid game characters. The scene's defining animal or object must be large, clearly identifiable, and placed on the right side, at least one quarter of the image width, with no tiny icon treatment. Foreground terrain may cross the bottom but no important object blocks that central stage. Mild side-on perspective, readable at thumbnail size.
Constraints: no people or human characters, no words, no letters, no numbers, no signage, no UI, no logo, no watermark. Original artwork.
Scene/backdrop: a sunny woodland expedition camp, a broad wooden stump on the right serves as a table. An enormous unfolded cream paper map spreads over that stump, bold simple winding route, river and mountain pictograms, NO text or letters or compass letters. The map is the unmistakable foreground hero taking over a quarter of the frame. Turquoise and green forest, golden midday light. Lower middle open sandy grass clearing.
Input image: the attached jungle background is a STYLE REFERENCE ONLY. Match its rounded cartoon silhouettes, crisp dark outline weight, simple cel shading, cheerful color harmony and subtle paper grain. Create the completely different setting requested above; do not copy the reference's tree placements, framing, trail or jungle arrangement.
```

### mochila

```text
Use case: illustration-story.
Asset type: original landscape background for the children's Spanish storytelling game Cuéntalo. One complete illustration, landscape 16:10.
Style/medium: hand-drawn youth adventure cartoon; friendly rounded organic shapes, clean confident dark chocolate outlines, simple cel shading in two or three tones, very light gouache grain. Bright saturated but harmonious colors, broad readable silhouettes, a warm playful storybook mood. Neither photorealism nor detailed anime.
Composition: fill the whole frame, no border. Keep the lower central half of the image visually calm and open as an empty stage for separately overlaid game characters. The scene's defining animal or object must be large, clearly identifiable, and placed on the right side, at least one quarter of the image width, with no tiny icon treatment. Foreground terrain may cross the bottom but no important object blocks that central stage. Mild side-on perspective, readable at thumbnail size.
Constraints: no people or human characters, no words, no letters, no numbers, no signage, no UI, no logo, no watermark. Original artwork.
Scene/backdrop: a light leafy clearing with a broad low stump on the right. A very large soft red adventure backpack sits open on the stump, its straps and pockets visible, yellow bananas, round fruit and bread clearly showing at the opening. Backpack takes over a quarter of the image. Warm coral and yellow accents against mint green woods. Open grassy earth occupies lower center.
Input image: the attached jungle background is a STYLE REFERENCE ONLY. Match its rounded cartoon silhouettes, crisp dark outline weight, simple cel shading, cheerful color harmony and subtle paper grain. Create the completely different setting requested above; do not copy the reference's tree placements, framing, trail or jungle arrangement.
```

### cuerda

```text
Use case: illustration-story.
Asset type: original landscape background for the children's Spanish storytelling game Cuéntalo. One complete illustration, landscape 16:10.
Style/medium: hand-drawn youth adventure cartoon; friendly rounded organic shapes, clean confident dark chocolate outlines, simple cel shading in two or three tones, very light gouache grain. Bright saturated but harmonious colors, broad readable silhouettes, a warm playful storybook mood. Neither photorealism nor detailed anime.
Composition: fill the whole frame, no border. Keep the lower central half of the image visually calm and open as an empty stage for separately overlaid game characters. The scene's defining animal or object must be large, clearly identifiable, and placed on the right side, at least one quarter of the image width, with no tiny icon treatment. Foreground terrain may cross the bottom but no important object blocks that central stage. Mild side-on perspective, readable at thumbnail size.
Constraints: no people or human characters, no words, no letters, no numbers, no signage, no UI, no logo, no watermark. Original artwork.
Scene/backdrop: a sunlit sandstone canyon ledge above a deep turquoise gorge, distant rounded mesas and dry vegetation, a different setting from a riverbank forest. On the right foreground ledge, a very large thick golden rope is coiled in generous recognizable loops, with a loose end draping down a rounded rock. Rope occupies more than a quarter of the width. Open flat sandy ledge across lower center, warm rust and ochre stone.
Input image: the attached jungle background is a STYLE REFERENCE ONLY. Match its rounded cartoon silhouettes, crisp dark outline weight, simple cel shading, cheerful color harmony and subtle paper grain. Create the completely different setting requested above; do not copy the reference's tree placements, framing, trail or jungle arrangement.
```

### manta

```text
Use case: illustration-story.
Asset type: original landscape background for the children's Spanish storytelling game Cuéntalo. One complete illustration, landscape 16:10.
Style/medium: hand-drawn youth adventure cartoon; friendly rounded organic shapes, clean confident dark chocolate outlines, simple cel shading in two or three tones, very light gouache grain. Bright saturated but harmonious colors, broad readable silhouettes, a warm playful storybook mood. Neither photorealism nor detailed anime.
Composition: fill the whole frame, no border. Keep the lower central half of the image visually calm and open as an empty stage for separately overlaid game characters. The scene's defining animal or object must be large, clearly identifiable, and placed on the right side, at least one quarter of the image width, with no tiny icon treatment. Foreground terrain may cross the bottom but no important object blocks that central stage. Mild side-on perspective, readable at thumbnail size.
Constraints: no people or human characters, no words, no letters, no numbers, no signage, no UI, no logo, no watermark. Original artwork.
Scene/backdrop: a cozy little forest shelter with a slanted simple canvas roof and rounded wooden supports tucked on the right side; several very large vivid orange and red wool blankets folded and loosely draped over a low log inside the shelter, broad graphic fabric folds and visible cozy thickness. Warm peach light and moss greens, cheerful and inviting. The blanket grouping fills over a quarter of the frame. Leave lower middle open packed-earth clearing.
Input image: the attached jungle background is a STYLE REFERENCE ONLY. Match its rounded cartoon silhouettes, crisp dark outline weight, simple cel shading, cheerful color harmony and subtle paper grain. Create the completely different setting requested above; do not copy the reference's tree placements, framing, trail or jungle arrangement.
```

### linterna

```text
Use case: illustration-story.
Asset type: original landscape background for the children's Spanish storytelling game Cuéntalo. One complete illustration, landscape 16:10.
Style/medium: hand-drawn youth adventure cartoon; friendly rounded organic shapes, clean confident dark chocolate outlines, simple cel shading in two or three tones, very light gouache grain. Bright saturated but harmonious colors, broad readable silhouettes, a warm playful storybook mood. Neither photorealism nor detailed anime.
Composition: fill the whole frame, no border. Keep the lower central half of the image visually calm and open as an empty stage for separately overlaid game characters. The scene's defining animal or object must be large, clearly identifiable, and placed on the right side, at least one quarter of the image width, with no tiny icon treatment. Foreground terrain may cross the bottom but no important object blocks that central stage. Mild side-on perspective, readable at thumbnail size.
Constraints: no people or human characters, no words, no letters, no numbers, no signage, no UI, no logo, no watermark. Original artwork.
Scene/backdrop: a safe rounded blue-night cave with curved indigo and violet rock walls and a dark tunnel receding left. A very large orange portable camping lantern sits on a boulder at the right, with a handle, glowing yellow glass and a broad golden beam spilling diagonally across the cave toward the empty central stage. Strong clear silhouette, not tiny. Gentle magical evening mood, blue and amber palette. Lower central floor broad and empty.
Input image: the attached jungle background is a STYLE REFERENCE ONLY. Match its rounded cartoon silhouettes, crisp dark outline weight, simple cel shading, cheerful color harmony and subtle paper grain. Create the completely different setting requested above; do not copy the reference's tree placements, framing, trail or jungle arrangement.
```

### rescate

```text
Use case: illustration-story.
Asset type: original landscape background for the children's Spanish storytelling game Cuéntalo. One complete illustration, landscape 16:10.
Style/medium: hand-drawn youth adventure cartoon; friendly rounded organic shapes, clean confident dark chocolate outlines, simple cel shading in two or three tones, very light gouache grain. Bright saturated but harmonious colors, broad readable silhouettes, a warm playful storybook mood. Neither photorealism nor detailed anime.
Composition: fill the whole frame, no border. Keep the lower central half of the image visually calm and open as an empty stage for separately overlaid game characters. The scene's defining animal or object must be large, clearly identifiable, and placed on the right side, at least one quarter of the image width, with no tiny icon treatment. Foreground terrain may cross the bottom but no important object blocks that central stage. Mild side-on perspective, readable at thumbnail size.
Constraints: no people or human characters, no words, no letters, no numbers, no signage, no UI, no logo, no watermark. Original artwork.
Scene/backdrop: a sunny elevated jungle lookout clearing high above rolling treetops, open blue sky with puffy clouds and distant soft mountains. A large red-orange friendly rescue helicopter is hovering low or resting on the right-side flat landing area, side-on, clear cockpit, landing skids and wide rotor. No visible pilot, passengers, insignia, letters or helipad lettering. Helicopter takes over a third of the image width. Broad empty grassy lookout across the lower middle.
Input image: the attached jungle background is a STYLE REFERENCE ONLY. Match its rounded cartoon silhouettes, crisp dark outline weight, simple cel shading, cheerful color harmony and subtle paper grain. Create the completely different setting requested above; do not copy the reference's tree placements, framing, trail or jungle arrangement.
```
