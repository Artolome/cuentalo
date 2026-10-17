# Animaciones de exploración

Ilustraciones generadas mediante ImageGen integrado el 16 de octubre de 2026, con los sprites originales como referencias visuales precisas. Los originales de `src/art/assets/exploration/` se conservan intactos. Cada pose cambia piernas, brazos o expresión; los fotogramas no se obtienen oscilando el sprite idle.

## Entrega

- 30 fotogramas WebP RGBA de 320 × 480 píxeles.
- 16 planchas PNG conservadas, incluidas las revisiones funcionales.
- Exportación Pillow: WebP, calidad 86, método 6, `exact=True`, alfa conservado.
- Utilidad reproducible: `src/art/assets/exploration-motion/extract_frames.py` (requiere Pillow y NumPy).
- Mediciones de cada imagen: `src/art/assets/exploration-motion/alignment.json`.

| Personaje | Marcha | Habla | Pintura |
|---|---|---|---|
| quijote | `quijote-walk-0.webp` … `quijote-walk-3.webp` | `quijote-talk-0.webp`, `quijote-talk-1.webp` | — |
| ursula | `ursula-walk-0.webp` … `ursula-walk-3.webp` | `ursula-talk-0.webp`, `ursula-talk-1.webp` | — |
| bibliotecario | `bibliotecario-walk-0.webp` … `bibliotecario-walk-3.webp` | `bibliotecario-talk-0.webp`, `bibliotecario-talk-1.webp` | — |
| frida | `frida-walk-0.webp` … `frida-walk-3.webp` | `frida-talk-0.webp`, `frida-talk-1.webp` | `frida-paint-0.webp` … `frida-paint-3.webp` |
| sancho | — | `sancho-talk-0.webp`, `sancho-talk-1.webp` | — |

Todos los nombres son relativos a `src/art/assets/exploration-motion/`. El juego incorpora los WebP; los PNG son fuentes de trabajo. Cadencias previstas por la integración: cuatro pasos en 650 ms; dos gestos de habla alternados cada 280 ms; cuatro gestos de pintura en ida y vuelta durante 1400 ms.

## Selección final y correcciones

Las planchas iniciales de seis poses tienen tres columnas y dos filas. Se conservan sus celdas 0 y 1 para las dos primeras fases de marcha y las celdas 4 y 5 para hablar, contando por filas desde cero. Las otras dos fases de marcha proceden de `{personaje}-compact-walk-sheet.png`, celdas izquierda y derecha. Estas revisiones cambian la pierna de apoyo y reducen una zancada demasiado amplia para el lienzo final.

Sancho utiliza las dos celdas de `sancho-compact-talk-sheet.png`: gestos próximos al pecho que conservan manos y sombrero completos. Frida utiliza las celdas 0, 1 y 3 de `frida-paint-sheet.png`; el fotograma 2 procede de `frida-paint-correction-sheet.png`, que mantiene el pincel en su mano derecha y la paleta en la izquierda.

ImageGen produjo dimensiones distintas de las solicitadas en algunas planchas; se registran las dimensiones reales abajo. Por eso la extracción identifica la silueta alfa dentro de cada fila en lugar de recortar ciegamente rectángulos iguales. Se selecciona la componente conectada del personaje (alfa > 64) y se amplía cuatro píxeles para retener el contorno suavizado; el color y el alfa originales de esos píxeles se conservan. No se dibujan ni reconstruyen miembros mediante código.

Cada silueta se escala proporcionalmente con Lanczos a la altura visible de su idle. Se alinean el borde inferior de los pies y el centro horizontal de la zona de cabeza con ese idle. No se deforma horizontalmente el personaje. El exportador comprueba que no haya recorte horizontal de la silueta y que el apoyo de los pies coincida exactamente con el idle. Las diferencias de redondeo de la altura son de un píxel como máximo.

## Registro de generación

Todos los llamados usaron `transparent_background=true` y `referenced_image_paths` con la referencia indicada. Las duraciones son tiempos transcurridos de cada llamada, incluyendo su espera en el lote paralelo, no duraciones de reproducción. Dos intentos de Úrsula fallaron sin producir imagen; se repitieron los mismos pedidos y se conserva solamente la salida correcta.

| Fuente PNG | Dimensiones reales | Segundos |
|---|---:|---:|
| `quijote-walk-talk-sheet.png` | 1024 × 1536 | 41.2 |
| `ursula-walk-talk-sheet.png` | 1254 × 1254 | 32.9 |
| `bibliotecario-walk-talk-sheet.png` | 1024 × 1536 | 115.8 |
| `frida-walk-talk-sheet.png` | 1024 × 1536 | 153.0 |
| `sancho-talk-sheet.png` | 1448 × 1086 | 225.3 |
| `frida-paint-sheet.png` | 1024 × 1536 | 190.0 |
| `quijote-opposite-walk-sheet.png` | 1536 × 1024 | 68.9 |
| `bibliotecario-opposite-walk-sheet.png` | 1536 × 1024 | 101.0 |
| `frida-opposite-walk-sheet.png` | 1536 × 1024 | 135.5 |
| `frida-paint-correction-sheet.png` | 1024 × 1536 | 170.0 |
| `ursula-opposite-walk-sheet.png` | 1536 × 1024 | 35.3 |
| `quijote-compact-walk-sheet.png` | 1536 × 1024 | 36.0 |
| `ursula-compact-walk-sheet.png` | 1449 × 1086 | 36.0 |
| `bibliotecario-compact-walk-sheet.png` | 1536 × 1024 | 106.9 |
| `frida-compact-walk-sheet.png` | 1536 × 1024 | 145.7 |
| `sancho-compact-talk-sheet.png` | 1448 × 1086 | 179.8 |

## Prompts exactos

### quijote-walk-talk

Referencia: `src/art/assets/exploration/quijote.png`.

```text
Create an ANIMATION SPRITE SHEET by editing the supplied character reference. Preserve this exact character identity, face, hair, age, clothing, proportions, painted cartoon rendering, colors and outline treatment. Produce genuine different limb positions, not duplicates shifted or rotated. True transparent alpha background everywhere outside character silhouettes, no scenery, text, labels, grid lines, shadows on ground, objects unless specified, or other characters. Entire bodies and feet visible in every cell with generous clear margins, no overlap across cells. Consistent character scale, head size and foot baseline within every equal cell. All characters look and orient three-quarters toward IMAGE RIGHT. Keep hands anatomically believable and facial expressions charming. Make one square 1536 by 1536 pixel sheet, EXACTLY THREE equal COLUMNS and TWO equal ROWS. Each cell is a 512 by 768 portrait. Six fullbody poses of the SAME supplied quijote character, ordered left-to-right then top-to-bottom: TOP LEFT walk frame 0: contact pose with one foot well forward and opposite arm forward; TOP MIDDLE walk frame 1: passing pose with rear foot lifting past grounded foot, arms nearer body; TOP RIGHT walk frame 2: opposite contact with other foot well forward, opposite arms to frame 0; BOTTOM LEFT walk frame 3: opposite passing pose with other foot lifting, alternate arms to frame 1; BOTTOM MIDDLE talk frame 0: feet planted, one hand raised in a friendly explanatory gesture, mouth partly open; BOTTOM RIGHT talk frame 1: same planted feet and torso, different open hand gesture, mouth clearly open speaking. FOUR TRUE DISTINCT WALK-CYCLE PHASES AND TWO TRUE DISTINCT TALK PHASES. Legs and feet must change clearly even for a skirted character; dress folds follow the stepping legs without changing dress design. No tools or carried props added. Keep body size and height equal between all six images. The initial reference is only one pose; invent the required new poses while preserving its character. Do not copy any matte background from the reference.
```

### ursula-walk-talk

Referencia: `src/art/assets/exploration/ursula.png`.

```text
Create an ANIMATION SPRITE SHEET by editing the supplied character reference. Preserve this exact character identity, face, hair, age, clothing, proportions, painted cartoon rendering, colors and outline treatment. Produce genuine different limb positions, not duplicates shifted or rotated. True transparent alpha background everywhere outside character silhouettes, no scenery, text, labels, grid lines, shadows on ground, objects unless specified, or other characters. Entire bodies and feet visible in every cell with generous clear margins, no overlap across cells. Consistent character scale, head size and foot baseline within every equal cell. All characters look and orient three-quarters toward IMAGE RIGHT. Keep hands anatomically believable and facial expressions charming. Make one square 1536 by 1536 pixel sheet, EXACTLY THREE equal COLUMNS and TWO equal ROWS. Each cell is a 512 by 768 portrait. Six fullbody poses of the SAME supplied ursula character, ordered left-to-right then top-to-bottom: TOP LEFT walk frame 0: contact pose with one foot well forward and opposite arm forward; TOP MIDDLE walk frame 1: passing pose with rear foot lifting past grounded foot, arms nearer body; TOP RIGHT walk frame 2: opposite contact with other foot well forward, opposite arms to frame 0; BOTTOM LEFT walk frame 3: opposite passing pose with other foot lifting, alternate arms to frame 1; BOTTOM MIDDLE talk frame 0: feet planted, one hand raised in a friendly explanatory gesture, mouth partly open; BOTTOM RIGHT talk frame 1: same planted feet and torso, different open hand gesture, mouth clearly open speaking. FOUR TRUE DISTINCT WALK-CYCLE PHASES AND TWO TRUE DISTINCT TALK PHASES. Legs and feet must change clearly even for a skirted character; dress folds follow the stepping legs without changing dress design. No tools or carried props added. Keep body size and height equal between all six images. The initial reference is only one pose; invent the required new poses while preserving its character. Do not copy any matte background from the reference.
```

### bibliotecario-walk-talk

Referencia: `src/art/assets/exploration/bibliotecario.png`.

```text
Create an ANIMATION SPRITE SHEET by editing the supplied character reference. Preserve this exact character identity, face, hair, age, clothing, proportions, painted cartoon rendering, colors and outline treatment. Produce genuine different limb positions, not duplicates shifted or rotated. True transparent alpha background everywhere outside character silhouettes, no scenery, text, labels, grid lines, shadows on ground, objects unless specified, or other characters. Entire bodies and feet visible in every cell with generous clear margins, no overlap across cells. Consistent character scale, head size and foot baseline within every equal cell. All characters look and orient three-quarters toward IMAGE RIGHT. Keep hands anatomically believable and facial expressions charming. Make one square 1536 by 1536 pixel sheet, EXACTLY THREE equal COLUMNS and TWO equal ROWS. Each cell is a 512 by 768 portrait. Six fullbody poses of the SAME supplied bibliotecario character, ordered left-to-right then top-to-bottom: TOP LEFT walk frame 0: contact pose with one foot well forward and opposite arm forward; TOP MIDDLE walk frame 1: passing pose with rear foot lifting past grounded foot, arms nearer body; TOP RIGHT walk frame 2: opposite contact with other foot well forward, opposite arms to frame 0; BOTTOM LEFT walk frame 3: opposite passing pose with other foot lifting, alternate arms to frame 1; BOTTOM MIDDLE talk frame 0: feet planted, one hand raised in a friendly explanatory gesture, mouth partly open; BOTTOM RIGHT talk frame 1: same planted feet and torso, different open hand gesture, mouth clearly open speaking. FOUR TRUE DISTINCT WALK-CYCLE PHASES AND TWO TRUE DISTINCT TALK PHASES. Legs and feet must change clearly even for a skirted character; dress folds follow the stepping legs without changing dress design. No tools or carried props added. Keep body size and height equal between all six images. The initial reference is only one pose; invent the required new poses while preserving its character. Do not copy any matte background from the reference.
```

### frida-walk-talk

Referencia: `src/art/assets/exploration/frida.png`.

```text
Create an ANIMATION SPRITE SHEET by editing the supplied character reference. Preserve this exact character identity, face, hair, age, clothing, proportions, painted cartoon rendering, colors and outline treatment. Produce genuine different limb positions, not duplicates shifted or rotated. True transparent alpha background everywhere outside character silhouettes, no scenery, text, labels, grid lines, shadows on ground, objects unless specified, or other characters. Entire bodies and feet visible in every cell with generous clear margins, no overlap across cells. Consistent character scale, head size and foot baseline within every equal cell. All characters look and orient three-quarters toward IMAGE RIGHT. Keep hands anatomically believable and facial expressions charming. Make one square 1536 by 1536 pixel sheet, EXACTLY THREE equal COLUMNS and TWO equal ROWS. Each cell is a 512 by 768 portrait. Six fullbody poses of the SAME supplied frida character, ordered left-to-right then top-to-bottom: TOP LEFT walk frame 0: contact pose with one foot well forward and opposite arm forward; TOP MIDDLE walk frame 1: passing pose with rear foot lifting past grounded foot, arms nearer body; TOP RIGHT walk frame 2: opposite contact with other foot well forward, opposite arms to frame 0; BOTTOM LEFT walk frame 3: opposite passing pose with other foot lifting, alternate arms to frame 1; BOTTOM MIDDLE talk frame 0: feet planted, one hand raised in a friendly explanatory gesture, mouth partly open; BOTTOM RIGHT talk frame 1: same planted feet and torso, different open hand gesture, mouth clearly open speaking. FOUR TRUE DISTINCT WALK-CYCLE PHASES AND TWO TRUE DISTINCT TALK PHASES. Legs and feet must change clearly even for a skirted character; dress folds follow the stepping legs without changing dress design. No tools or carried props added. Keep body size and height equal between all six images. The initial reference is only one pose; invent the required new poses while preserving its character. Do not copy any matte background from the reference.
```

### sancho-talk

Referencia: `src/art/assets/exploration/sancho.png`.

```text
Create an ANIMATION SPRITE SHEET by editing the supplied character reference. Preserve this exact character identity, face, hair, age, clothing, proportions, painted cartoon rendering, colors and outline treatment. Produce genuine different limb positions, not duplicates shifted or rotated. True transparent alpha background everywhere outside character silhouettes, no scenery, text, labels, grid lines, shadows on ground, objects unless specified, or other characters. Entire bodies and feet visible in every cell with generous clear margins, no overlap across cells. Consistent character scale, head size and foot baseline within every equal cell. All characters look and orient three-quarters toward IMAGE RIGHT. Keep hands anatomically believable and facial expressions charming. Make one landscape 1536 by 1152 pixel sheet, EXACTLY TWO equal COLUMNS and ONE ROW, each cell 768 by 1152 portrait. TWO distinct fullbody talking poses of the same short stout Sancho with straw hat, cream shirt, olive brown vest, ochre trousers and boots. LEFT: planted feet, one palm raised gently in explanation, mouth partly open and smiling. RIGHT: same torso and planted feet, both palms open in another friendly storytelling gesture, mouth clearly open. Maintain same body scale, head size and baseline in both cells. No cane, weapon, animal, bag, or other object.
```

### frida-paint

Referencia: `src/art/assets/exploration/frida.png`.

```text
Create an ANIMATION SPRITE SHEET by editing the supplied character reference. Preserve this exact character identity, face, hair, age, clothing, proportions, painted cartoon rendering, colors and outline treatment. Produce genuine different limb positions, not duplicates shifted or rotated. True transparent alpha background everywhere outside character silhouettes, no scenery, text, labels, grid lines, shadows on ground, objects unless specified, or other characters. Entire bodies and feet visible in every cell with generous clear margins, no overlap across cells. Consistent character scale, head size and foot baseline within every equal cell. All characters look and orient three-quarters toward IMAGE RIGHT. Keep hands anatomically believable and facial expressions charming. Make one portrait 1024 by 1536 pixel sheet, EXACTLY TWO equal COLUMNS and TWO equal ROWS, each cell 512 by 768 portrait. FOUR distinct fullbody PAINTING animation phases for the same adult Frida in reference. Her anatomical RIGHT hand holds one thin paintbrush extended toward IMAGE RIGHT, her anatomical LEFT hand holds a small wooden oval paint palette around waist height. Feet planted identically, torso stable, expressive focused face. Read left to right top to bottom: frame0 brush arm reaches forward at chest height; frame1 brush tip lifted higher with wrist and elbow bent; frame2 brush arm extended further right at shoulder height; frame3 brush lowers toward waist level, elbow relaxing. Clearly different arm/brush angles suitable for a looping painting action. Keep palette in same left hand every frame. No easel, canvas, chair, scenery, floating paint, or any object besides that single brush and palette. Preserve her cobalt floral skirt, embroidered cream blouse, coral shawl, flowers and braid exactly.
```

### quijote-opposite-walk

Referencia: `src/art/assets/exploration/quijote.png`.

```text
Edit the supplied single fullbody quijote sprite into a TWO FRAME ANIMATION SHEET. Exact same identity, head, costume, proportions and painted cartoon rendering, transparent background. Two equal portrait cells side by side, generous empty gutter, full silhouettes and feet. Both characters face three quarters IMAGE RIGHT. This is specifically the OPPOSITE HALF OF A WALK CYCLE from the supplied reference: DO NOT repeat the reference leg arrangement. In BOTH images the NEAR LEG (the leg emerging from the hip at IMAGE LEFT, closest to viewer) must carry the movement toward the right and visually cross IN FRONT of the far leg. LEFT CELL: near leg extends diagonally FORWARD toward image right with heel touching ground; far leg stretches BACK toward image left with toe still on ground. Near arm swings BACK toward image left while far arm swings forward. RIGHT CELL: near leg now nearly vertical supporting the body under the torso; FAR leg bends its knee and lifts its foot FORWARD to image right in front of the grounded near ankle; arms start passing. This second pose MUST have the lifted foot to the RIGHT of the grounded foot, unlike the original reference with the lifted foot behind on the left. For a long skirt, make the forward raised shoe visible beneath the right edge of the hem and use new folds following those legs. Strong clear distinct weight/limb positions, moderate stride, consistent head size, feet baseline, entire costume unchanged. No extra props, labels, text, panels, grid lines, shadows, background. Two poses only. True alpha transparency.
```

### bibliotecario-opposite-walk

Referencia: `src/art/assets/exploration/bibliotecario.png`.

```text
Edit the supplied single fullbody bibliotecario sprite into a TWO FRAME ANIMATION SHEET. Exact same identity, head, costume, proportions and painted cartoon rendering, transparent background. Two equal portrait cells side by side, generous empty gutter, full silhouettes and feet. Both characters face three quarters IMAGE RIGHT. This is specifically the OPPOSITE HALF OF A WALK CYCLE from the supplied reference: DO NOT repeat the reference leg arrangement. In BOTH images the NEAR LEG (the leg emerging from the hip at IMAGE LEFT, closest to viewer) must carry the movement toward the right and visually cross IN FRONT of the far leg. LEFT CELL: near leg extends diagonally FORWARD toward image right with heel touching ground; far leg stretches BACK toward image left with toe still on ground. Near arm swings BACK toward image left while far arm swings forward. RIGHT CELL: near leg now nearly vertical supporting the body under the torso; FAR leg bends its knee and lifts its foot FORWARD to image right in front of the grounded near ankle; arms start passing. This second pose MUST have the lifted foot to the RIGHT of the grounded foot, unlike the original reference with the lifted foot behind on the left. For a long skirt, make the forward raised shoe visible beneath the right edge of the hem and use new folds following those legs. Strong clear distinct weight/limb positions, moderate stride, consistent head size, feet baseline, entire costume unchanged. No extra props, labels, text, panels, grid lines, shadows, background. Two poses only. True alpha transparency.
```

### frida-opposite-walk

Referencia: `src/art/assets/exploration/frida.png`.

```text
Edit the supplied single fullbody frida sprite into a TWO FRAME ANIMATION SHEET. Exact same identity, head, costume, proportions and painted cartoon rendering, transparent background. Two equal portrait cells side by side, generous empty gutter, full silhouettes and feet. Both characters face three quarters IMAGE RIGHT. This is specifically the OPPOSITE HALF OF A WALK CYCLE from the supplied reference: DO NOT repeat the reference leg arrangement. In BOTH images the NEAR LEG (the leg emerging from the hip at IMAGE LEFT, closest to viewer) must carry the movement toward the right and visually cross IN FRONT of the far leg. LEFT CELL: near leg extends diagonally FORWARD toward image right with heel touching ground; far leg stretches BACK toward image left with toe still on ground. Near arm swings BACK toward image left while far arm swings forward. RIGHT CELL: near leg now nearly vertical supporting the body under the torso; FAR leg bends its knee and lifts its foot FORWARD to image right in front of the grounded near ankle; arms start passing. This second pose MUST have the lifted foot to the RIGHT of the grounded foot, unlike the original reference with the lifted foot behind on the left. For a long skirt, make the forward raised shoe visible beneath the right edge of the hem and use new folds following those legs. Strong clear distinct weight/limb positions, moderate stride, consistent head size, feet baseline, entire costume unchanged. No extra props, labels, text, panels, grid lines, shadows, background. Two poses only. True alpha transparency.
```

### frida-paint-correction

Referencia: `src/art/assets/exploration/frida.png`.

```text
Edit the supplied adult Frida character into ONE fullbody PAINTING pose. Exact identity, costume, flowers, colors, painted cartoon style, proportions. True transparent alpha background. Face three quarters IMAGE RIGHT, feet planted, entire silhouette and feet with generous margins. Her anatomical RIGHT ARM is the NEAR ARM that begins at the shoulder on the IMAGE LEFT: this near arm crosses ACROSS her chest and reaches horizontally toward IMAGE RIGHT, elbow slightly bent. This near RIGHT hand holds a single paintbrush pointing right at her shoulder height, clearly visible. Her anatomical LEFT ARM is the FAR ARM beginning at the shoulder on IMAGE RIGHT: that far hand holds a small oval wooden palette with paint dabs near her waist. ONE BRUSH IN NEAR RIGHT HAND, ONE PALETTE IN FAR LEFT HAND. Keep right shoulder and forearm visibly connected across the front of her blouse, not the other arm. The canvas/easel is offscreen and must not appear. Friendly focused expression. No scenery, text, extra items, ground shadow, sheet or other character. Single sprite only.
```

### ursula-opposite-walk

Referencia: `src/art/assets/exploration/ursula.png`.

```text
Edit the supplied single fullbody ursula sprite into a TWO FRAME ANIMATION SHEET. Exact same identity, head, costume, proportions and painted cartoon rendering, transparent background. Two equal portrait cells side by side, generous empty gutter, full silhouettes and feet. Both characters face three quarters IMAGE RIGHT. This is specifically the OPPOSITE HALF OF A WALK CYCLE from the supplied reference: DO NOT repeat the reference leg arrangement. In BOTH images the NEAR LEG (the leg emerging from the hip at IMAGE LEFT, closest to viewer) must carry the movement toward the right and visually cross IN FRONT of the far leg. LEFT CELL: near leg extends diagonally FORWARD toward image right with heel touching ground; far leg stretches BACK toward image left with toe still on ground. Near arm swings BACK toward image left while far arm swings forward. RIGHT CELL: near leg now nearly vertical supporting the body under the torso; FAR leg bends its knee and lifts its foot FORWARD to image right in front of the grounded near ankle; arms start passing. This second pose MUST have the lifted foot to the RIGHT of the grounded foot, unlike the original reference with the lifted foot behind on the left. For a long skirt, make the forward raised shoe visible beneath the right edge of the hem and use new folds following those legs. Strong clear distinct weight/limb positions, moderate stride, consistent head size, feet baseline, entire costume unchanged. No extra props, labels, text, panels, grid lines, shadows, background. Two poses only. True alpha transparency.
```

### quijote-compact-walk

Referencia: `src/art/assets/exploration-motion/quijote-opposite-walk-sheet.png`.

```text
Refine this TWO-POSE animation sheet for practical game sprite framing. Preserve EXACT character identity, body proportions, clothing design, colors, facial expression, facing direction, rendering and the two different leg/arm arrangements. Correct ONLY the excessively long step and overly extended foot: make both poses COMPACT NATURAL WALKING with a SHORT stride. The forward foot should be only half a boot length in front of the torso, never a kick. The back foot just half a boot length behind the torso. Keep bent knees closer together, moving arms close to sides, and skirt hem falling closer to legs if wearing a skirt. Crucially preserve the near-leg-forward contact in LEFT image and other-leg-raised-forward passing in RIGHT image. These are two distinct consecutive steps, not same pose. Each fullbody character must fit comfortably inside a tall narrow 2:3 individual cell with transparent clearance on every side, including ALL feet and any hands. Two equal portrait cells side by side, true transparent alpha, no decorations, no ground shadow, no grid or text. Keep head size and overall height the same in both images. Shorten the foot spread, DO NOT make the body thinner or shorter.
```

### ursula-compact-walk

Referencia: `src/art/assets/exploration-motion/ursula-opposite-walk-sheet.png`.

```text
Refine this TWO-POSE animation sheet for practical game sprite framing. Preserve EXACT character identity, body proportions, clothing design, colors, facial expression, facing direction, rendering and the two different leg/arm arrangements. Correct ONLY the excessively long step and overly extended foot: make both poses COMPACT NATURAL WALKING with a SHORT stride. The forward foot should be only half a boot length in front of the torso, never a kick. The back foot just half a boot length behind the torso. Keep bent knees closer together, moving arms close to sides, and skirt hem falling closer to legs if wearing a skirt. Crucially preserve the near-leg-forward contact in LEFT image and other-leg-raised-forward passing in RIGHT image. These are two distinct consecutive steps, not same pose. Each fullbody character must fit comfortably inside a tall narrow 2:3 individual cell with transparent clearance on every side, including ALL feet and any hands. Two equal portrait cells side by side, true transparent alpha, no decorations, no ground shadow, no grid or text. Keep head size and overall height the same in both images. Shorten the foot spread, DO NOT make the body thinner or shorter.
```

### bibliotecario-compact-walk

Referencia: `src/art/assets/exploration-motion/bibliotecario-opposite-walk-sheet.png`.

```text
Refine this TWO-POSE animation sheet for practical game sprite framing. Preserve EXACT character identity, body proportions, clothing design, colors, facial expression, facing direction, rendering and the two different leg/arm arrangements. Correct ONLY the excessively long step and overly extended foot: make both poses COMPACT NATURAL WALKING with a SHORT stride. The forward foot should be only half a boot length in front of the torso, never a kick. The back foot just half a boot length behind the torso. Keep bent knees closer together, moving arms close to sides, and skirt hem falling closer to legs if wearing a skirt. Crucially preserve the near-leg-forward contact in LEFT image and other-leg-raised-forward passing in RIGHT image. These are two distinct consecutive steps, not same pose. Each fullbody character must fit comfortably inside a tall narrow 2:3 individual cell with transparent clearance on every side, including ALL feet and any hands. Two equal portrait cells side by side, true transparent alpha, no decorations, no ground shadow, no grid or text. Keep head size and overall height the same in both images. Shorten the foot spread, DO NOT make the body thinner or shorter.
```

### frida-compact-walk

Referencia: `src/art/assets/exploration-motion/frida-opposite-walk-sheet.png`.

```text
Refine this TWO-POSE animation sheet for practical game sprite framing. Preserve EXACT character identity, body proportions, clothing design, colors, facial expression, facing direction, rendering and the two different leg/arm arrangements. Correct ONLY the excessively long step and overly extended foot: make both poses COMPACT NATURAL WALKING with a SHORT stride. The forward foot should be only half a boot length in front of the torso, never a kick. The back foot just half a boot length behind the torso. Keep bent knees closer together, moving arms close to sides, and skirt hem falling closer to legs if wearing a skirt. Crucially preserve the near-leg-forward contact in LEFT image and other-leg-raised-forward passing in RIGHT image. These are two distinct consecutive steps, not same pose. Each fullbody character must fit comfortably inside a tall narrow 2:3 individual cell with transparent clearance on every side, including ALL feet and any hands. Two equal portrait cells side by side, true transparent alpha, no decorations, no ground shadow, no grid or text. Keep head size and overall height the same in both images. Shorten the foot spread, DO NOT make the body thinner or shorter.
```

### sancho-compact-talk

Referencia: `src/art/assets/exploration-motion/sancho-talk-sheet.png`.

```text
Refine this TWO-POSE talking animation sheet. Preserve exactly the same friendly Sancho identity, straw hat, face, stocky body proportions, earth-tone clothes, painterly cartoon style and both open speaking mouths. Correct ONLY overly wide gestures and crop: keep elbows very close to his sides, hands gesturing near his chest, palms no further right than edge of his right shoulder. Left pose one friendly open hand near chest, other hand relaxed near belt. Right pose both palms open near chest in another distinct friendly explanation. Both full bodies, whole straw hats and every boot must be fully inside the canvas with generous transparent margin on all sides. Each figure fits a tall narrow 2:3 cell, two equal portrait cells side by side. Same character height and head size in both, feet planted identically. No object above hat, no feathers, no background, shadows, grid or text. True alpha transparency. Do not alter torso width or proportions.
```

