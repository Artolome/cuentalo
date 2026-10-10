# Escenas cartoon — fondos principales

Estos ocho fondos sustituyen el uso de un mismo paisaje con objetos pequeños superpuestos. Cada escena tiene una composición, una silueta temática y una gama de color que permiten reconocerla en una carta pequeña.

## Método

Generados el 9 de octubre de 2026 con la herramienta integrada `image_gen` de Codex, una imagen por escena. No se usó CLI ni una API externa.

`selva.png` se generó desde texto. Las otras siete imágenes usaron `selva.png` como referencia de estilo solamente, con instrucciones explícitas para crear composiciones distintas. El estilo comparte grandes formas orgánicas redondeadas, sombreado cartoon de pocos tonos, colores vivos y textura ligera de gouache.

Todos los originales PNG y sus versiones de distribución WebP están en `src/art/assets/escenas-cartoon/`. Las versiones WebP se normalizaron a **1024 × 640 (16:10)** mediante redimensionado Lanczos y se comprimieron con Pillow, calidad **80**, método **6**. No se hicieron retoques, composiciones manuales ni recortes.

## Archivos y lectura de cada escena

| Id y archivos | Contenido | WebP, bytes |
| --- | --- | ---: |
| `selva.png` / `selva.webp` | Selva densa, camino sinuoso y claro verde. | 102110 |
| `rio.png` / `rio.webp` | Río azul ancho, rocas grandes y cascada lateral. | 106462 |
| `sol.png` / `sol.webp` | Claro seco de sabana ocre, cielo abierto y sol grande. | 61594 |
| `tormenta.png` / `tormenta.webp` | Pendiente expuesta, lluvia diagonal y relámpago violeta. | 99926 |
| `noche.png` / `noche.webp` | Claro índigo con gran luna creciente y estrellas. | 74070 |
| `fuego.png` / `fuego.webp` | Campamento naranja con fogata y troncos a la derecha. | 71756 |
| `refugio.png` / `refugio.webp` | Cabaña grande de bambú y techo de hojas, con porche protegido. | 112976 |
| `frutas.png` / `frutas.webp` | Huerto tropical con grandes naranjas y racimo de bananas. | 121388 |

## Comprobación visual

Se inspeccionaron individualmente los ocho resultados completos antes de copiarlos al proyecto. Se confirmó ausencia de texto, personajes e interfaz; lugar despejado en la zona inferior central para superponer uno o dos personajes; y diferencias visuales claras entre escenarios. El río deja una orilla seca, el refugio presenta una entrada protegida y el fondo de noche no contiene fuego.

## Prompts exactos

### selva

Sin imagen de referencia.

```text
Use case: illustration-story
Asset type: standalone background image for a children's storytelling puzzle game; landscape 16:10.
Primary request: an ORIGINAL charming premium CARTOON adventure JUNGLE scene. Highly designed large simplified rounded organic shapes, clean dark chocolate and deep-green ink contours, clear 2–3-tone cel shading, only a light dry-gouache paper texture, vivid emerald, teal and lime colors. Friendly illustrated storybook animation, a playful modern cartoon game, emphatically NOT a detailed realistic anime painting.
Scene: DENSE tropical jungle; enormous rounded broad leaves and curling ferns, chunky curving tree trunks, overlapping simple canopies that fill the upper corners. A clearly winding pale ochre footpath emerges through the trees from the distant middle and opens into a wide empty grassy clearing across the whole bottom center. Foreground vegetation clusters at both extreme sides. Simplified layers give depth, readable graphic silhouettes and dappled golden daytime sunlight.
Composition: landscape 16:10, eye-level wide shot. The lower central 50 percent is open, uncluttered, dry ground to place one or two game characters later. Semantics must be obvious in a small scene card. Jungle foliage is the focus, with very little visible sky. Large scene shapes, avoid tiny dense details.
Constraints: environment only, absolutely no people, no animals, no humanoids, no text, no letters, no logo, no UI, no framing border, no panel grid. No river, no buildings, no fire, no props placed in the lower center. No photorealism, no 3D rendering, no cinematic realistic painting, no tiny thin-line detail.
```

### rio

Referencia estilística: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone environment background for a children's storytelling puzzle game, landscape 16:10.
Reference image: STYLE reference ONLY. Match rounded organic cartoon shapes, clear 2–3-tone cel shading, light gouache texture, vivid appealing colors, subtle clean chocolate/deep-green contours. Premium playful cartoon adventure storybook, not detailed realistic anime painting. Do NOT repeat the reference's composition. Design the new scene explicitly below.
Composition: landscape 16:10, wide shot at child eye height. Lower central 50 percent must remain open, dry, uncluttered ground for one or two characters added later. Large simple shapes and very readable visual narrative at small card size. Rich world without tiny busy detail.
Constraints: no people, no animals, no humanoids, no text, no lettering, no logos, no UI, no panel grid, no border, no photorealism, no glossy 3D. Environment only.
Scene: an unmistakable BLUE RIVER, a wide band of bright cyan and cobalt water filling the ENTIRE middle of the image from left to right, with BIG round pale rocks and a small broad waterfall flowing down rock steps at the far right. The near bank is a wide light-beige sand bar filling the lower third and lower centre, with no water under the future characters. Across the river are soft rounded lush green palms and hills. Lots of blue water reflected daylight, white foam stylized into simple curves. Distinct wide riverside composition with open sky, NOT a tunnel jungle path.
```

### sol

Referencia estilística: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone environment background for a children's storytelling puzzle game, landscape 16:10.
Reference image: STYLE reference ONLY. Match rounded organic cartoon shapes, clear 2–3-tone cel shading, light gouache texture, vivid appealing colors, subtle clean chocolate/deep-green contours. Premium playful cartoon adventure storybook, not detailed realistic anime painting. Do NOT repeat the reference's composition. Design the new scene explicitly below.
Composition: landscape 16:10, wide shot at child eye height. Lower central 50 percent must remain open, dry, uncluttered ground for one or two characters added later. Large simple shapes and very readable visual narrative at small card size. Rich world without tiny busy detail.
Constraints: no people, no animals, no humanoids, no text, no lettering, no logos, no UI, no panel grid, no border, no photorealism, no glossy 3D. Environment only.
Scene: a very SUNNY DRY tropical savanna clearing, dominant golden ochre, apricot and warm pale yellow. A big visible golden SUN in the upper right, broad bright turquoise sky occupying the upper half, a few simple soft white clouds, rolling ochre hills and dry golden grass. Only two sparse small round-canopied trees far in the background, NO dense rainforest frame. The foreground is a broad open pale ochre dry clearing with a few tufts of golden grass at the edges. Hot midday light, warm air, cheerful but clearly hot, bold simple sunny silhouette. The sun must be large and recognizable at small card size.
```

### tormenta

Referencia estilística: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone environment background for a children's storytelling puzzle game, landscape 16:10.
Reference image: STYLE reference ONLY. Match rounded organic cartoon shapes, clear 2–3-tone cel shading, light gouache texture, vivid appealing colors, subtle clean chocolate/deep-green contours. Premium playful cartoon adventure storybook, not detailed realistic anime painting. Do NOT repeat the reference's composition. Design the new scene explicitly below.
Composition: landscape 16:10, wide shot at child eye height. Lower central 50 percent must remain open, dry, uncluttered ground for one or two characters added later. Large simple shapes and very readable visual narrative at small card size. Rich world without tiny busy detail.
Constraints: no people, no animals, no humanoids, no text, no lettering, no logos, no UI, no panel grid, no border, no photorealism, no glossy 3D. Environment only.
Scene: a windy RAINSTORM over an exposed rolling grassy hillside, dramatically different from the reference. The upper HALF dominated by enormous rounded purple and blue-gray storm clouds. One unmistakable broad angular lemon-yellow LIGHTNING BOLT cuts through the upper-right sky. Diagonal thick blue-gray rain strokes sweep across the scene; a few broad-leaf trees and palms at the edges bend in the wind. Dominant violet, teal and slate blue palette with green grass and reflected lavender light. The lower centre is a wide gently sloping muddy green clearing with only a couple of shallow small puddles at the extreme edges, available for standing characters. Friendly adventurous storm, not frightening horror. Rain and bolt must read clearly when small.
```

### noche

Referencia estilística: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone environment background for a children's storytelling puzzle game, landscape 16:10.
Reference image: STYLE reference ONLY. Match rounded organic cartoon shapes, clear 2–3-tone cel shading, light gouache texture, vivid appealing colors, subtle clean chocolate/deep-green contours. Premium playful cartoon adventure storybook, not detailed realistic anime painting. Do NOT repeat the reference's composition. Design the new scene explicitly below.
Composition: landscape 16:10, wide shot at child eye height. Lower central 50 percent must remain open, dry, uncluttered ground for one or two characters added later. Large simple shapes and very readable visual narrative at small card size. Rich world without tiny busy detail.
Constraints: no people, no animals, no humanoids, no text, no lettering, no logos, no UI, no panel grid, no border, no photorealism, no glossy 3D. Environment only.
Scene: an unmistakable peaceful NIGHT meadow clearing under an expansive deep INDIGO star-filled sky. A very LARGE luminous crescent MOON at upper right and a handful of large simple diamond-shaped golden stars. Rounded dark-teal trees grouped at left and right outer edges leave the upper central sky open; rounded distant hills silhouette. Bottom half is an open soft blue-green grassy clearing, gently illuminated and clearly visible, with tiny golden firefly glows only at the edges. Simple graphic night palette of indigo, violet, cyan-moonlight and teal. No fireplace, no flames, no lamps, no tent. Distinct open moonlit meadow layout, not identical to the reference jungle path.
```

### fuego

Referencia estilística: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone environment background for a children's storytelling puzzle game, landscape 16:10.
Reference image: STYLE reference ONLY. Match rounded organic cartoon shapes, clear 2–3-tone cel shading, light gouache texture, vivid appealing colors, subtle clean chocolate/deep-green contours. Premium playful cartoon adventure storybook, not detailed realistic anime painting. Do NOT repeat the reference's composition. Design the new scene explicitly below.
Composition: landscape 16:10, wide shot at child eye height. Lower central 50 percent must remain open, dry, uncluttered ground for one or two characters added later. Large simple shapes and very readable visual narrative at small card size. Rich world without tiny busy detail.
Constraints: no people, no animals, no humanoids, no text, no lettering, no logos, no UI, no panel grid, no border, no photorealism, no glossy 3D. Environment only.
Scene: a cozy tropical-forest CAMPFIRE clearing at late evening. The clear dominant subject is a BIG warm orange and golden CAMPFIRE occupying the right third, built on chunky brown logs in a ring of smooth gray stones. Flame is a simple attractive curling orange-yellow cartoon silhouette, large and unmistakable. A stack of spare logs sits just behind it at the far right. Background round tree shapes and bushes in muted plum and teal, a small distant peach twilight opening. Warm orange firelight spills across the open earth clearing in the lower center. The lower central 50 percent remains entirely empty dry earth for characters, never put the fire in the center. No moon, no river, no cabins, no tents, no people. Dominant warm glowing oranges and amber contrast with simple blue-purple evening woods.
```

### refugio

Referencia estilística: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone environment background for a children's storytelling puzzle game, landscape 16:10.
Reference image: STYLE reference ONLY. Match rounded organic cartoon shapes, clear 2–3-tone cel shading, light gouache texture, vivid appealing colors, subtle clean chocolate/deep-green contours. Premium playful cartoon adventure storybook, not detailed realistic anime painting. Do NOT repeat the reference's composition. Design the new scene explicitly below.
Composition: landscape 16:10, wide shot at child eye height. Lower central 50 percent must remain open, dry, uncluttered ground for one or two characters added later. Large simple shapes and very readable visual narrative at small card size. Rich world without tiny busy detail.
Constraints: no people, no animals, no humanoids, no text, no lettering, no logos, no UI, no panel grid, no border, no photorealism, no glossy 3D. Environment only.
Scene: a welcoming BAMBOO HUT SHELTER in a small tropical grove. A LARGE beautifully rounded bamboo cabin occupies the right third to right half, with a broad deep green PALM-LEAF ROOF and thick golden bamboo posts, a dark open entrance and a clearly roofed sheltered veranda facing the centre. Cozy plain timber floor and simple steps at the far right. The cabin is the dominant recognizable subject, large enough to read on a small scene card. Afternoon amber sunlight, foliage and a couple of rounded broad-leaf bushes, open peach/turquoise sky toward the left. The lower central 50 percent is a broad empty earthy clearing leading to the sheltered entrance, no furniture or objects in that lower center. No campfire, no river, no characters, no lamps or signs. Warm ochre bamboo and saturated green leaves.
```

### frutas

Referencia estilística: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone environment background for a children's storytelling puzzle game, landscape 16:10.
Reference image: STYLE reference ONLY. Match rounded organic cartoon shapes, clear 2–3-tone cel shading, light gouache texture, vivid appealing colors, subtle clean chocolate/deep-green contours. Premium playful cartoon adventure storybook, not detailed realistic anime painting. Do NOT repeat the reference's composition. Design the new scene explicitly below.
Composition: landscape 16:10, wide shot at child eye height. Lower central 50 percent must remain open, dry, uncluttered ground for one or two characters added later. Large simple shapes and very readable visual narrative at small card size. Rich world without tiny busy detail.
Constraints: no people, no animals, no humanoids, no text, no lettering, no logos, no UI, no panel grid, no border, no photorealism, no glossy 3D. Environment only.
Scene: a lush TROPICAL FRUIT ORCHARD, unmistakably about edible fruit. A very large fruit tree at the right edge bends leafy branches into the upper-right quarter, full of HUGE round vivid orange fruit each with a leaf, clearly larger than the decorative foliage. Next to it at far right stands a chunky banana plant with one BIG conspicuous hanging bunch of curved golden-yellow BANANAS. Further left/background are simple round orchard trees with several visible orange fruit among green canopies. Happy bright green and orange palette, soft clear daytime sky through canopies. The foreground lower central 50 percent is an open grassy-earth orchard clearing, with all fruit-bearing trees at the edges or behind the clearing; no fallen fruit or baskets in the center. No water, no hut, no campfire, no people. Fruit is oversized graphically readable on a tiny card, not scattered tiny dots.
```
