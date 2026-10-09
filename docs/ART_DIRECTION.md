# Dirección artística: el cuaderno cartoon

La versión actual conserva la calidez del cuaderno de aventuras y adopta un cartoon más expresivo: siluetas claras, contornos color chocolate, ojos grandes, sombras suaves y colores más diferenciados.

## Recursos actuales

- **Cinco personajes**: Lucía, Mateo, Valeria, Diego y Kiwi, el loro verde. Cada plancha contiene doce poses en una cuadrícula de cuatro columnas y tres filas. Once estados son distintos; la última celda repite la pose contenta. El motor elige la pose que corresponde al relato y el retrato utiliza la primera celda.
- **Diecisiete escenas**: cada escena posee su propia ilustración. Ya no se reutiliza el mismo bosque para representar el sol, una tormenta, una cabaña o un objeto. Los elementos narrativos son grandes y el primer plano central queda disponible para los personajes.
- Las fuentes PNG se conservan en `src/art/assets/personajes-cartoon/` y `src/art/assets/escenas-cartoon/`. Los WebP son los archivos de distribución. `scripts/load-art.js` verifica su presencia al compilar y los integra en el HTML, sin descargas durante el juego.
- El fondo de portada utiliza la nueva selva. Las cartas y viñetas tienen marcos más nítidos; el papel cálido sigue dejando protagonismo a las ilustraciones.

Prompts exactos, referencias, método y parámetros de exportación:

- [Personajes y estados](CHARACTERS_CARTOON.md)
- [Paisajes, luz y refugios](SCENES_CARTOON_A.md)
- [Animales, objetos y rescate](SCENES_CARTOON_B.md)

La galería de control se genera con `node scripts/galeria-art.js ruta/de/salida.html`. Incluye todos los escenarios, retratos y estados. Se abre directamente en el navegador, sin servidor.

## Primera exploración visual: bosque pintado

Los tres recursos y prompts siguientes documentan la primera exploración de esta dirección artística. La versión cartoon usa los recursos actuales descritos arriba.

Cuéntalo adopta paisajes originales de bosque tropical pintado: fondos de acuarela y gouache, luz cálida, verdes de salvia y musgo, perspectiva atmosférica y claros abiertos. La referencia solicitada es la sensibilidad de los fondos de animación de Studio Ghibli. No se utilizan fotogramas, personajes ni marcas de sus películas.

El paisaje invita a explorar sin competir con la historia. Los personajes y objetos interactivos siguen siendo capas SVG, y la zona central inferior queda libre para que siempre se puedan leer sus acciones.

## Recursos

| Archivo | Uso | Dimensiones | Peso |
| --- | --- | --- | --- |
| `src/art/assets/bosque-dia.webp` | Portada y escenas diurnas del bosque | 1672 × 941 | 285 394 bytes |
| `src/art/assets/rio.webp` | Escenas del río; orilla seca en primer plano | 1672 × 941 | 362 696 bytes |
| `src/art/assets/bosque-noche.webp` | Escenas nocturnas; luciérnagas y sombras legibles | 1672 × 941 | 265 162 bytes |

Los PNG del mismo nombre son los originales de generación. Los WebP conservan sus dimensiones y son la versión para distribución web. La compresión se realizó con Pillow, calidad 84, método 6, sin retoques visuales ni recortes. No se añadieron llamas al fondo nocturno: los objetos de la historia permanecen independientes.

## Método y control visual

Generados el 9 de octubre de 2026 mediante la herramienta integrada `image_gen` de Codex; no se utilizó CLI ni API externa. El primer fondo se generó desde texto. El río utiliza el primer fondo como referencia estilística; la noche es una variación de iluminación del primer fondo.

Los tres resultados se inspeccionaron visualmente antes de copiarlos al proyecto: sin texto ni personas, encuadre coherente, vegetación periférica y suelo despejado para superponer personajes. El original del río conserva una orilla accesible en la zona inferior y la variante nocturna conserva la geografía diurna.

## Prompts exactos

### Bosque de día

```text
Use case: illustration-story
Asset type: painted backdrop for Cuéntalo, a Spanish storytelling puzzle game. This image must also work as a wide landing-page hero.
Primary request: an original lush tropical forest landscape in the style of Studio Ghibli, a hand-painted cinematic anime background, tender, inviting, quietly magical.
Scene/backdrop: a broad sunlit grassy clearing and pale earthen path in the lower centre, framed by abundant tropical leaves, ferns and huge softly mossy tree trunks at the outer edges; layered wooded hills, a hazy distant valley and a few soft cloud shapes in the distance.
Style/medium: beautiful traditional gouache and watercolor animation background, visible brush texture, delicate irregular foliage shapes, atmospheric perspective, gentle natural detail.
Composition/framing: landscape 16:9; wide view at child eye height; bottom centre 50 percent kept open and simple for game characters overlaid later; centre and sky softly uncluttered; foliage naturally frames the sides without a border.
Lighting/mood: golden morning light, amber sunbeams, soft luminous haze, calm sense of discovery.
Color palette: sage, moss, fern and olive greens, cream light, muted honey and pale blue; warm natural painterly color.
Constraints: landscape only, no people, no creatures, no house, no props, no lettering, no logo, no watermark, no panel grid, no border. Do not draw game UI. Avoid heavy black outlines, photorealism, glossy 3D, neon, flat vector graphics.
```

### Río

Imagen de referencia: `src/art/assets/bosque-dia.png`.

```text
Use case: illustration-story
Asset type: painted river backdrop for Cuéntalo, a Spanish storytelling puzzle game.
Primary request: an original lush tropical riverbank landscape in the style of Studio Ghibli, hand-painted cinematic anime background, tender, inviting, quietly magical.
Input image: reference only, match its painterly style, tropical vegetation, warm golden morning and sage greens. Create a different scene by the river, not a copy of the reference composition.
Scene/backdrop: a shallow clear turquoise river meanders across the middle distance through verdant tropical forest; rounded river stones, soft fern-covered banks, enormous tree canopy at the edges and hazy wooded hills beyond.
Style/medium: traditional gouache and watercolor animation background with visible brush texture, delicate irregular leaves, luminous atmospheric perspective.
Composition/framing: landscape 16:9; wide view at child eye height. The lower centre and entire lower third must be an open dry pale sandy grassy riverbank where game characters can stand later. Water begins further back in the middle third. Keep the foreground centre clear and simple, with vegetation framing the outer edges naturally.
Lighting/mood: golden morning sunlight, warm honey reflections, calm sense of discovery.
Color palette: sage, moss, fern and olive greens, warm cream light, pale turquoise water and blue haze.
Constraints: environment only, no people, no creatures, no buildings, no bridges, no boats, no props, no lettering, no logo, no watermark, no panel grid, no border. Do not draw game UI. Avoid heavy black outlines, photorealism, glossy 3D, neon, flat vector graphics.
```

### Bosque de noche

Imagen a editar: `src/art/assets/bosque-dia.png`.

```text
Use case: lighting-weather
Asset type: painted evening forest backdrop for Cuéntalo, a Spanish storytelling puzzle game.
Primary request: transform the reference forest clearing into a tender enchanting early-night landscape in the style of Studio Ghibli, hand-painted cinematic anime watercolor and gouache background.
Input image: edit target, preserve its forest composition, major trees, open lower central clearing and mountain valley, with no changes to the geography.
Change only time of day and atmosphere: velvety indigo twilight sky with a few first stars, tiny subtle golden fireflies scattered along the side foliage, cool soft bluish moonlight on leaves, a trace of warm peach sunset near the distant horizon, quiet magical woodland. Make the centre clearing sufficiently visible for a game; soft gentle light with readable shadow detail, never pitch-black.
Style/medium: traditional gouache and watercolor animation background, visible brush texture, delicate irregular foliage, luminous atmospheric perspective.
Composition/framing: landscape 16:9; wide at child eye height; lower centre 50 percent stays simple, dry, open and empty for game characters added later; lush vegetation framing edges.
Color palette: muted indigo and deep sage greens, smoky blue distant hills, touches of peach horizon and very small honey-gold firefly lights.
Constraints: do not add any campfire or flames, no lamps, no buildings, no people, no creatures other than tiny firefly light specks, no props, no lettering, no logo, no watermark, no grid, no border, no UI. Avoid heavy black outlines, photorealism, glossy 3D, neon, flat vector graphics.
```

