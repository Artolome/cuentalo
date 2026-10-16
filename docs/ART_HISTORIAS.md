# Arte — biblioteca de historias

Cuatro cubiertas verticales presentan historias y personajes propios, para elegir una lectura en la biblioteca de Cuéntalo. Son ilustraciones originales y no sustituyen los escenarios horizontales del juego.

## Archivos

Carpeta: `src/art/assets/historias/`.

| Id; PNG y WebP del mismo nombre | Personajes y escena | PNG original | WebP | Bytes WebP |
| --- | --- | --- | --- | ---: |
| `don_quijote` | Don Quijote y Sancho Panza sobre Rocinante y el asno, con molinos de La Mancha. | 1024 × 1536 | 720 × 1080 | 190248 |
| `macondo` | José Arcadio Buendía y Úrsula, adultos activos ante una casa tropical, con mariposas amarillas. | 1024 × 1536 | 720 × 1080 | 156196 |
| `biblioteca_borges` | Narrador bibliotecario adulto anónimo con bolsa y linterna, en una biblioteca hexagonal imaginaria. | 1024 × 1536 | 720 × 1080 | 146020 |
| `casa_azul` | Frida Kahlo adulta con pincel y paleta en un patio azul, junto a un lienzo en blanco. | 1024 × 1536 | 720 × 1080 | 138250 |

Total WebP: **630714 bytes**. Las cubiertas tienen proporción **2:3**, útil tanto para tarjetas de selección como para una imagen de presentación vertical.

## Método y revisión

Generadas el 15 de octubre de 2026 con la herramienta integrada `image_gen` de Codex: cuatro llamadas independientes en paralelo, desde descripciones de texto. No se utilizaron fotografías de actores, adaptaciones audiovisuales ni reproducciones de cuadros. El narrador de la biblioteca es un personaje ficticio anónimo, no un retrato de Borges. La composición de Frida es una ilustración original y su lienzo permanece vacío.

Cada resultado se inspeccionó individualmente: rostros expresivos y legibles, personajes principales dentro del encuadre, ausencia de texto y marcas, motivos narrativos reconocibles. Se conservaron los PNG originales de 1024 × 1536. Exportación con Pillow: conversión RGB, redimensionado Lanczos a 720 × 1080, WebP con `quality=82, method=6`. No se recortaron las imágenes.

El estilo comparte la calidez, el color y la textura pintada del juego; estas cubiertas dan más espacio al rostro, el vestuario y la relación entre los personajes que los fondos de acción.

## Prompts exactos

### don_quijote

```text
Use case: illustration-story
Asset type: ORIGINAL portrait-format illustrated book/story cover for Cuéntalo, a warm colorful storytelling adventure game. Vertical 2:3 composition.
Style: premium painted cartoon storybook illustration, appealing carefully designed expressive faces, beautiful clear silhouettes, rounded organic shapes, subtle clean chocolate-colored contours, a few strong cel-shaded color planes with light gouache brush texture. Vibrant natural color, inviting golden light and depth, charming and emotionally sincere. Coherent with a colorful painted cartoon adventure game. Not photorealistic, not glossy 3D, not anime portrait.
Composition: a complete beautiful painted scene that works both as a book-cover thumbnail and story hero. Main faces and characters large enough to recognize at thumbnail size. Intentional visual hierarchy and balanced frame. No title space needed; fill the composition with illustration. Keep faces and major character features safely within the image, not cropped.
Constraints: absolutely NO text, letters, words, captions, numbers, logos, signatures, watermarks, UI, frame or border. Original visual designs; do not copy actors or an existing movie or TV adaptation. Avoid stereotypes and grotesque caricature.
Subject and scene: DON QUIXOTE and SANCHO PANZA traveling together through the sunny ochre rolling hills of LA MANCHA, with two unmistakable white Spanish WINDMILLS with four wooden lattice sails in the background. Don Quixote is a tall very lean mature Spanish man with an elongated kindly face, narrow mustache and short pointed gray goatee, alert idealistic eyes, humble weathered improvised steel armor, a simple rustic helmet and a long wooden lance. He rides ROCINANTE, a thin but gentle light-gray horse. Sancho Panza is a shorter round-bodied warm-hearted adult Spanish man, soft friendly expressive face, simple earth-colored rustic clothes and a wide straw hat, riding a small sturdy gray DONKEY. Show both companions clearly and affectionately; Quixote slightly taller at left, Sancho beside him, their faces prominent in the upper-middle, their animals readable lower down. Warm camaraderie, exploration and imagination rather than battle. No giants, no attack, no aggressive weapon gesture. Clear azure sky, bright cream stone, golden fields. Original illustrated versions from the literary descriptions, not actors.
```

### macondo

```text
Use case: illustration-story
Asset type: ORIGINAL portrait-format illustrated book/story cover for Cuéntalo, a warm colorful storytelling adventure game. Vertical 2:3 composition.
Style: premium painted cartoon storybook illustration, appealing carefully designed expressive faces, beautiful clear silhouettes, rounded organic shapes, subtle clean chocolate-colored contours, a few strong cel-shaded color planes with light gouache brush texture. Vibrant natural color, inviting golden light and depth, charming and emotionally sincere. Coherent with a colorful painted cartoon adventure game. Not photorealistic, not glossy 3D, not anime portrait.
Composition: a complete beautiful painted scene that works both as a book-cover thumbnail and story hero. Main faces and characters large enough to recognize at thumbnail size. Intentional visual hierarchy and balanced frame. No title space needed; fill the composition with illustration. Keep faces and major character features safely within the image, not cropped.
Constraints: absolutely NO text, letters, words, captions, numbers, logos, signatures, watermarks, UI, frame or border. Original visual designs; do not copy actors or an existing movie or TV adaptation. Avoid stereotypes and grotesque caricature.
Subject and scene: JOSÉ ARCADIO BUENDÍA and ÚRSULA IGUARÁN from the FICTIONAL tropical village of MACONDO. Portray them as energetic young-to-middle-aged adults around their thirties or forties, NOT elderly. José Arcadio Buendía is a strong broad-shouldered inventive man with dark curly hair and a short full beard, lively curious eyes, simple off-white rolled-sleeve shirt and muted blue work trousers; he holds a small brass magnifying glass and a curious handmade wooden mechanical object. Úrsula is a capable grounded active woman with intelligent expressive dark eyes, dark hair loosely pinned back, a practical warm coral dress with a cream apron, carrying a wicker basket and meeting the viewer with quiet determination. They stand together prominently in the foreground of a freshly built welcoming pastel tropical house with open wooden shutters, lush green plants and a broad leafy almond tree. Several bright YELLOW BUTTERFLIES drift across the scene, adding gentle magical realism. Hopeful new beginnings, warm family energy, purposeful rather than posed royalty. Their faces are dominant and beautifully expressive. No copied TV costumes, no actor likeness, no modern technology, no writing.
```

### biblioteca_borges

```text
Use case: illustration-story
Asset type: ORIGINAL portrait-format illustrated book/story cover for Cuéntalo, a warm colorful storytelling adventure game. Vertical 2:3 composition.
Style: premium painted cartoon storybook illustration, appealing carefully designed expressive faces, beautiful clear silhouettes, rounded organic shapes, subtle clean chocolate-colored contours, a few strong cel-shaded color planes with light gouache brush texture. Vibrant natural color, inviting golden light and depth, charming and emotionally sincere. Coherent with a colorful painted cartoon adventure game. Not photorealistic, not glossy 3D, not anime portrait.
Composition: a complete beautiful painted scene that works both as a book-cover thumbnail and story hero. Main faces and characters large enough to recognize at thumbnail size. Intentional visual hierarchy and balanced frame. No title space needed; fill the composition with illustration. Keep faces and major character features safely within the image, not cropped.
Constraints: absolutely NO text, letters, words, captions, numbers, logos, signatures, watermarks, UI, frame or border. Original visual designs; do not copy actors or an existing movie or TV adaptation. Avoid stereotypes and grotesque caricature.
Subject and scene: an ANONYMOUS ADULT LIBRARIAN NARRATOR exploring an impossible vast HEXAGONAL LIBRARY inspired by literary labyrinths. This is an original fictional character, NOT Jorge Luis Borges and not a portrait of any real author. A thoughtful adult with expressive curious eyes, short dark wavy hair, simple warm ochre jacket over teal clothing, a worn leather satchel, holding a small softly glowing lantern. Place the narrator prominently in the lower-middle foreground, face large and readable, looking up in wonder. Behind rises a magnificent impossible geometry of hexagonal book-filled galleries, warm wooden shelves, railings and branching stairways repeating into a luminous deep teal distance. No specific real library architecture. Rich amber lantern glow against turquoise mysterious depth, inviting intellectual adventure rather than horror. Books have blank spines, no letters. A quiet sense of infinite possibilities, original fantasy illustration, careful attractive face and hands, no existing film or book-cover copy.
```

### casa_azul

```text
Use case: illustration-story
Asset type: ORIGINAL portrait-format illustrated book/story cover for Cuéntalo, a warm colorful storytelling adventure game. Vertical 2:3 composition.
Style: premium painted cartoon storybook illustration, appealing carefully designed expressive faces, beautiful clear silhouettes, rounded organic shapes, subtle clean chocolate-colored contours, a few strong cel-shaded color planes with light gouache brush texture. Vibrant natural color, inviting golden light and depth, charming and emotionally sincere. Coherent with a colorful painted cartoon adventure game. Not photorealistic, not glossy 3D, not anime portrait.
Composition: a complete beautiful painted scene that works both as a book-cover thumbnail and story hero. Main faces and characters large enough to recognize at thumbnail size. Intentional visual hierarchy and balanced frame. No title space needed; fill the composition with illustration. Keep faces and major character features safely within the image, not cropped.
Constraints: absolutely NO text, letters, words, captions, numbers, logos, signatures, watermarks, UI, frame or border. Original visual designs; do not copy actors or an existing movie or TV adaptation. Avoid stereotypes and grotesque caricature.
Subject and scene: a respectful recognizable painted cartoon PORTRAIT OF FRIDA KAHLO AS AN ADULT ARTIST in her cobalt-blue Casa Azul courtyard, surrounded by rich green plants and pink flowers. Frida has her characteristic joined dark eyebrows, dark thoughtful expressive eyes, a subtle natural upper-lip shadow, dark braided hair arranged up with colorful flowers, and warm medium skin. She wears a beautiful Mexican embroidered blouse and a long colorful skirt, rendered with care and dignity, not exaggerated caricature. She holds a paintbrush and a painter's palette with colored paint; a nearby easel has a COMPLETELY BLANK canvas, no reproduction of any painting. Place Frida prominently waist-up or three-quarter length, face beautifully expressive and dominant, gaze calm, intelligent and self-possessed. Cobalt-blue courtyard walls and lush tropical leaves frame her, warm yellow sunlit accents, original fictionalized composition of her creative environment. No suffering imagery, no medical objects, no imitation or reproduction of a Frida artwork, no text or signatures.
```


