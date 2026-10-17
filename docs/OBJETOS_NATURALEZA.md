# Objetos naturales pintados

Generación: 17 de octubre de 2026, herramienta integrada ImageGen, con `transparent_background: true`. Cinco imágenes nuevas (frutas y mariposas) y tres ediciones de la flor roja. Las ilustraciones se inspeccionaron individualmente y se validaron visualmente en la revisión de integración.

El estilo toma como referencia visual el patio pintado de `src/art/assets/escenas-cartoon/casa_azul.webp`: acuarela y gouache delicadas, colores naturales luminosos, detalles legibles y bordes suaves. Cada imagen contiene un solo objeto sobre transparencia real.

Los PNG originales se conservan en `outputs/exploration-objects/` del directorio de la tarea, fuera del repositorio. Los WebP de distribución se guardan en `src/art/assets/exploration-objects/`, a **512 × 512 píxeles**, RGBA. La conversión usa Pillow, reducción Lanczos, WebP `quality=90`, `method=6`; conserva el canal alfa generado. El tratamiento local se limita a copiar, redimensionar y comprimir.

| Archivo WebP | Sujeto | Procedencia PNG |
| --- | --- | --- |
| `fruit-red.webp` | Manzana roja con tallo y hoja | `fruit-red.png` |
| `fruit-green.webp` | Pera verde con tallo y hoja | `fruit-green.png` |
| `fruit-orange.webp` | Naranja entera con hoja | `fruit-orange.png` |
| `butterfly-yellow.webp` | Mariposa amarilla dorada, alas abiertas | `butterfly-yellow.png` |
| `butterfly-blue.webp` | Mariposa azul, alas abiertas | `butterfly-blue.png` |
| `flower-yellow.webp` | Flor con pétalos amarillos | `flower-yellow.png` |
| `flower-pink.webp` | Flor con pétalos rosas | `flower-pink.png` |
| `flower-purple.webp` | Flor con pétalos violetas | `flower-purple.png` |

## Prompts de las cinco imágenes nuevas

Cada llamada recibió el siguiente prompt común, sustituyendo literalmente `{{SUBJECT}}` por el texto correspondiente de la lista. Se realizó una llamada integrada por imagen, sin imágenes de entrada.

```text
Use case: illustration-story. Asset type: a single collectible object sprite for a 2D illustrated youth adventure game.
Subject: {{SUBJECT}}
Style/medium: beautiful delicate hand-painted watercolor and gouache from an animated storybook, tactile paint texture and nuanced shading, detailed yet immediately readable at 90 pixels, soft warm edges, no heavy black outline, neither flat vector nor photorealistic 3D. Rich natural colors, gentle soft light from the upper left, coherent with a sunlit hand-painted courtyard of the Casa Azul, lush leaves and warm stone.
Composition: square 1:1 canvas, object centered, fully visible, about 84% of the canvas maximum dimension with at least 8% empty margin on every edge. View chosen for an unmistakable clean silhouette. One isolated object only.
Background: genuinely transparent alpha, including all space around fine appendages. Preserve soft antialiased painted object edges.
Avoid: any background color, paper rectangle, ground plane, pedestal, cast shadow outside the object, board, card, border, frame, text, watermark, symbols, faces, extra objects, duplicate fruit or butterfly.
```

### fruit-red

```text
One ripe red apple, round and slightly asymmetrical, richly crimson with warm vermilion highlights and subtle golden mottling, a short curved brown stem and one small fresh green leaf. A single whole fruit, no slice.
```

### fruit-green

```text
One ripe green pear, distinctive elegant pear silhouette with narrow neck and rounded bottom, fresh leaf-green skin with delicate yellow-green light and tiny natural speckles, a short curved brown stem and one small green leaf. A single whole fruit, no slice.
```

### fruit-orange

```text
One ripe whole orange, saturated natural orange peel with delicate stippled pores and golden light, a short small stem and one fresh green leaf. A single whole fruit, no slice.
```

### butterfly-yellow

```text
One golden-yellow butterfly seen from above with its four wings gracefully spread, luminous honey-yellow wings, subtly darker ochre outer margins and fine brown wing veins, slim natural brown body, two delicate antennae and tiny legs. Distinct upper and lower wings, symmetrical overall but naturally hand painted. No flowers.
```

### butterfly-blue

```text
One blue butterfly seen from above with its four wings gracefully spread, luminous azure and cerulean wings, subtle indigo outer margins and fine dark blue wing veins, slim natural brown body, two delicate antennae and tiny legs. Distinct upper and lower wings, symmetrical overall but naturally hand painted. No flowers.
```

## Ediciones de la flor

Imagen de entrada en las tres llamadas: `outputs/exploration-objects/flower-red.png`, generada y validada previamente. Se inspeccionó antes de editarla. Cada llamada usa ese mismo PNG como `referenced_image_paths` y solicita cambiar únicamente los pétalos. El tallo y las hojas conservan sus verdes naturales; el centro mantiene su amarillo dorado.

Prompt de sujeto original de la flor roja, facilitado por su autor:

```text
one RED flower growing on a single graceful green stem with two green leaves. A large cheerful bloom with seven rounded velvety petals, dominant saturated warm red color close to #df4d45, golden-yellow pollen center. Entire stem ends at the bottom; no pot, no soil or grass. Main bloom faces the viewer, stem slightly curves. Keep the blossom unmistakably RED for a color-learning game.
```

### flower-yellow

```text
Use case: precise-object-edit. Asset type: a transparent single-flower sprite for a hand-painted 2D adventure game.
Input image: the supplied red flower is the edit target, not a style reference.
Change ONLY the red PETAL color to a clear sunny golden YELLOW (#f2c84b) with warm ochre shadows and softly lit yellow highlights. Keep the golden-yellow pollen center, the green stem, both green leaves, their exact natural green colors and venation, the curved shape, the watercolor/gouache texture, lighting, all outlines, transparent background, position and scale unchanged. Preserve the same flower silhouette and every botanical detail. Do not tint the stem or leaves. Do not add anything. Deliver a square image with real alpha transparency, with no text, paper, ground, pot, frame or shadow. This is the exact same flower in a new petal color; petals only.
```

### flower-pink

```text
Use case: precise-object-edit. Asset type: a transparent single-flower sprite for a hand-painted 2D adventure game.
Input image: the supplied red flower is the edit target, not a style reference.
Change ONLY the red PETAL color to a clear rosy PINK (#ed88b1) with soft rose shadows and pale pink highlights, unmistakably pink rather than red. Keep the golden-yellow pollen center, the green stem, both green leaves, their exact natural green colors and venation, the curved shape, the watercolor/gouache texture, lighting, all outlines, transparent background, position and scale unchanged. Preserve the same flower silhouette and every botanical detail. Do not tint the stem or leaves. Do not add anything. Deliver a square image with real alpha transparency, with no text, paper, ground, pot, frame or shadow. This is the exact same flower in a new petal color; petals only.
```

### flower-purple

```text
Use case: precise-object-edit. Asset type: a transparent single-flower sprite for a hand-painted 2D adventure game.
Input image: the supplied red flower is the edit target, not a style reference.
Change ONLY the red PETAL color to a clear violet PURPLE (#9567c7) with muted plum shadows and lavender highlights, unmistakably purple. Keep the golden-yellow pollen center, the green stem, both green leaves, their exact natural green colors and venation, the curved shape, the watercolor/gouache texture, lighting, all outlines, transparent background, position and scale unchanged. Preserve the same flower silhouette and every botanical detail. Do not tint the stem or leaves. Do not add anything. Deliver a square image with real alpha transparency, with no text, paper, ground, pot, frame or shadow. This is the exact same flower in a new petal color; petals only.
```

## Validación

Las ocho fuentes tienen 1254 × 1254 píxeles. Los ocho WebP conservan transparencia (extremos del canal alfa 0 y 255), tienen 512 × 512 píxeles y mantienen el objeto completo. Se comprobaron las siluetas, las antenas de las mariposas, los colores distinguibles y el verde de tallos y hojas. Las variantes de color son ediciones generativas de la flor original.

Los archivos son recursos visuales; las reglas de interacción, selección de variante y animación viven en los módulos del juego.
