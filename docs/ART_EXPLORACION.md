# Arte — protagonistas de exploración

Cinco sprites individuales permiten colocar a los protagonistas dentro de los escenarios pintados. Cada archivo contiene una persona completa en postura relajada de pie o de paso, vista frontal a tres cuartos, con ambos zapatos visibles. Son recursos estáticos; el movimiento del personaje se resuelve en el juego.

## Archivos

Carpeta: `src/art/assets/exploration/`.

| Id; PNG y WebP del mismo nombre | Diseño | PNG original | WebP | Bytes WebP |
| --- | --- | --- | --- | ---: |
| `quijote` | Don Quijote mayor, alto y delgado, armadura rústica y rostro amable, sin montura ni armas. | 1024 × 1536 RGBA | 320 × 480 RGBA | 29618 |
| `sancho` | Sancho adulto, bajo y robusto, sombrero de paja y ropa de tonos tierra. | 1024 × 1536 RGBA | 320 × 480 RGBA | 31372 |
| `ursula` | Úrsula adulta activa, blusa rosa, falda y delantal crema, pelo oscuro recogido. | 1024 × 1536 RGBA | 320 × 480 RGBA | 27978 |
| `bibliotecario` | Narrador bibliotecario anónimo adulto, abrigo ocre, bufanda azul petróleo y bolsa cruzada. | 1024 × 1536 RGBA | 320 × 480 RGBA | 25556 |
| `frida` | Frida adulta, cejas unidas, trenzas con flores, blusa bordada, chal coral y falda azul. | 1024 × 1536 RGBA | 320 × 480 RGBA | 32170 |

Total WebP: **146694 bytes**.

Los lienzos completos se conservaron para facilitar un ajuste `contain` uniforme. Los PNG originales no se retocaron ni recortaron. Exportación con Pillow: conversión RGBA, redimensionado Lanczos a **320 × 480**, WebP con `quality=86, method=6, exact=True`. El canal alfa generado se conserva; no se ha añadido un fondo, suelo o sombra.

## Método y comprobación

Generados el **16 de octubre de 2026** mediante la herramienta integrada `image_gen`, con una llamada por sprite y `transparent_background=true`. No se usó CLI ni una API externa.

Antes de redactar los prompts se inspeccionaron las cubiertas `src/art/assets/historias/don_quijote.webp`, `macondo.webp`, `biblioteca_borges.webp` y `casa_azul.webp`. Las nuevas imágenes se generaron desde descripciones verbales, sin usar las cubiertas como objetivos de edición.

Se revisaron individualmente los cinco originales y los cinco WebP: figura completa, rostro reconocible, manos y calzado presentes, sin texto ni escenario. Los WebP tienen alfa entre **0 y 255**, con entre **58 % y 77 % de píxeles completamente transparentes**. Se confirmó que el fondo desaparece alrededor de la silueta. El bibliotecario es un personaje ficticio anónimo, no un retrato del autor Borges.

## Prompts exactos

### quijote

Parámetro integrado: `transparent_background=true`.

```text
Use case: illustration-story
Asset type: one individual original FULL-BODY transparent 2D game character sprite for Cuéntalo, to walk over painted cartoon backgrounds. NOT a sprite sheet.
Composition: single person only, entire body from top of head through BOTH SHOES clearly visible and uncropped, centered on a tall portrait canvas with a small comfortable transparent margin. Three-quarter FRONT view, body and feet angled slightly toward the viewer's RIGHT; friendly relaxed standing/light mid-step walking pose, feet slightly apart, hands relaxed. Upright ground-level view, not bird's-eye. Silhouette should read clearly at small game size, no extreme foreshortening.
Style: premium warm hand-painted 2D cartoon storybook illustration. Beautiful expressive face, clean attractive anatomy and hands, rounded organic shapes, subtle chocolate-colored outlines, a few cel-shaded planes, delicate gouache brush texture. Rich natural colors and gentle warm diffuse light. Consistent with high-quality painted adventure book covers. Neither photorealism nor glossy 3D.
Background: TRUE FULLY TRANSPARENT ALPHA. No white or colored background, no checkerboard pattern drawn into the image, no floor, no scenery, no ground shadow, no vignette or glow. Only the person and their worn clothing/accessories have opaque pixels.
Constraints: no other people, no animals, no mount, no floating objects, no equipment held in hands, no text, logos, symbols, captions, frames or UI. No cropping of head, hands or shoes. No multiple poses or duplicated person.
Character: DON QUIXOTE, a tall very lean older Spanish man with a long noble kindly face, prominent slender nose, alert warm brown eyes, gray eyebrows, narrow gray mustache curling very slightly and short pointed gray goatee. Short tousled gray hair peeks out from a weathered rustic broad metal helmet. Wears simple improvised worn steel breastplate and shoulder plates over an off-white long-sleeve shirt, brown leather belt, narrow earth-brown breeches and sturdy rustic brown leather boots. Calm idealistic good humor, a gentle smile. Slender limbs and dignified posture. No horse, no lance, no sword, no shield: hands empty and relaxed. Friendly expressive illustrated face, without grotesque caricature.
```

### sancho

Parámetro integrado: `transparent_background=true`.

```text
Use case: illustration-story
Asset type: one individual original FULL-BODY transparent 2D game character sprite for Cuéntalo, to walk over painted cartoon backgrounds. NOT a sprite sheet.
Composition: single person only, entire body from top of head through BOTH SHOES clearly visible and uncropped, centered on a tall portrait canvas with a small comfortable transparent margin. Three-quarter FRONT view, body and feet angled slightly toward the viewer's RIGHT; friendly relaxed standing/light mid-step walking pose, feet slightly apart, hands relaxed. Upright ground-level view, not bird's-eye. Silhouette should read clearly at small game size, no extreme foreshortening.
Style: premium warm hand-painted 2D cartoon storybook illustration. Beautiful expressive face, clean attractive anatomy and hands, rounded organic shapes, subtle chocolate-colored outlines, a few cel-shaded planes, delicate gouache brush texture. Rich natural colors and gentle warm diffuse light. Consistent with high-quality painted adventure book covers. Neither photorealism nor glossy 3D.
Background: TRUE FULLY TRANSPARENT ALPHA. No white or colored background, no checkerboard pattern drawn into the image, no floor, no scenery, no ground shadow, no vignette or glow. Only the person and their worn clothing/accessories have opaque pixels.
Constraints: no other people, no animals, no mount, no floating objects, no equipment held in hands, no text, logos, symbols, captions, frames or UI. No cropping of head, hands or shoes. No multiple poses or duplicated person.
Character: SANCHO PANZA, a short stout adult Spanish man with a round warm friendly face, dark kind eyes, dark wavy hair and a short full dark-brown beard with mustache. Wears a broad round straw hat, an off-white loose collarless shirt with sleeves rolled to the elbows, a dark olive-brown sleeveless waistcoat, broad leather belt, simple ochre-brown loose trousers, and worn brown leather ankle boots. Soft welcoming smile, sturdy grounded posture, warm-hearted and practical. Make both complete legs and shoes visible. No donkey, no bag held in hand, no food, no other objects. Original affectionate painted-cartoon design, never grotesque.
```

### ursula

Parámetro integrado: `transparent_background=true`.

```text
Use case: illustration-story
Asset type: one individual original FULL-BODY transparent 2D game character sprite for Cuéntalo, to walk over painted cartoon backgrounds. NOT a sprite sheet.
Composition: single person only, entire body from top of head through BOTH SHOES clearly visible and uncropped, centered on a tall portrait canvas with a small comfortable transparent margin. Three-quarter FRONT view, body and feet angled slightly toward the viewer's RIGHT; friendly relaxed standing/light mid-step walking pose, feet slightly apart, hands relaxed. Upright ground-level view, not bird's-eye. Silhouette should read clearly at small game size, no extreme foreshortening.
Style: premium warm hand-painted 2D cartoon storybook illustration. Beautiful expressive face, clean attractive anatomy and hands, rounded organic shapes, subtle chocolate-colored outlines, a few cel-shaded planes, delicate gouache brush texture. Rich natural colors and gentle warm diffuse light. Consistent with high-quality painted adventure book covers. Neither photorealism nor glossy 3D.
Background: TRUE FULLY TRANSPARENT ALPHA. No white or colored background, no checkerboard pattern drawn into the image, no floor, no scenery, no ground shadow, no vignette or glow. Only the person and their worn clothing/accessories have opaque pixels.
Constraints: no other people, no animals, no mount, no floating objects, no equipment held in hands, no text, logos, symbols, captions, frames or UI. No cropping of head, hands or shoes. No multiple poses or duplicated person.
Character: ÚRSULA IGUARÁN as an active capable adult woman in her thirties, NOT elderly. Warm medium skin, intelligent lively dark-brown eyes, rounded expressive oval face, dark thick wavy hair pinned in a loose low braided updo. Wears a practical dusty ROSE/CORAL blouse with softly gathered elbow sleeves, a full long CREAM skirt or cream apron over a rose underskirt, with small discreet floral embroidery near the lower hem, and simple brown shoes clearly visible below the hem. Upright purposeful stance and warm determined smile. No basket, no props, no modern equipment. Charming character design matching a warm tropical family-story cover, no exaggerated costume.
```

### bibliotecario

Parámetro integrado: `transparent_background=true`.

```text
Use case: illustration-story
Asset type: one individual original FULL-BODY transparent 2D game character sprite for Cuéntalo, to walk over painted cartoon backgrounds. NOT a sprite sheet.
Composition: single person only, entire body from top of head through BOTH SHOES clearly visible and uncropped, centered on a tall portrait canvas with a small comfortable transparent margin. Three-quarter FRONT view, body and feet angled slightly toward the viewer's RIGHT; friendly relaxed standing/light mid-step walking pose, feet slightly apart, hands relaxed. Upright ground-level view, not bird's-eye. Silhouette should read clearly at small game size, no extreme foreshortening.
Style: premium warm hand-painted 2D cartoon storybook illustration. Beautiful expressive face, clean attractive anatomy and hands, rounded organic shapes, subtle chocolate-colored outlines, a few cel-shaded planes, delicate gouache brush texture. Rich natural colors and gentle warm diffuse light. Consistent with high-quality painted adventure book covers. Neither photorealism nor glossy 3D.
Background: TRUE FULLY TRANSPARENT ALPHA. No white or colored background, no checkerboard pattern drawn into the image, no floor, no scenery, no ground shadow, no vignette or glow. Only the person and their worn clothing/accessories have opaque pixels.
Constraints: no other people, no animals, no mount, no floating objects, no equipment held in hands, no text, logos, symbols, captions, frames or UI. No cropping of head, hands or shoes. No multiple poses or duplicated person.
Character: an ORIGINAL ANONYMOUS YOUNG ADULT LIBRARIAN narrator, not the real author Borges. A thoughtful attractive young man around late twenties, warm medium skin, expressive dark brown eyes, thick gently arched eyebrows, wavy slightly tousled short dark hair, faint stubble. Wears a warm ochre-brown mid-thigh coat over dark teal clothing, a loose TEAL SCARF, dark charcoal trousers, and sturdy brown leather boots. A worn brown LEATHER SATCHEL is worn cross-body and rests at his hip as part of his costume. Curious gentle half-smile. Entire body visible from head to boots. Hands free, no lantern, no book or handheld object, no background. Friendly painted-cartoon explorer from a magical library story.
```

### frida

Parámetro integrado: `transparent_background=true`.

```text
Use case: illustration-story
Asset type: one individual original FULL-BODY transparent 2D game character sprite for Cuéntalo, to walk over painted cartoon backgrounds. NOT a sprite sheet.
Composition: single person only, entire body from top of head through BOTH SHOES clearly visible and uncropped, centered on a tall portrait canvas with a small comfortable transparent margin. Three-quarter FRONT view, body and feet angled slightly toward the viewer's RIGHT; friendly relaxed standing/light mid-step walking pose, feet slightly apart, hands relaxed. Upright ground-level view, not bird's-eye. Silhouette should read clearly at small game size, no extreme foreshortening.
Style: premium warm hand-painted 2D cartoon storybook illustration. Beautiful expressive face, clean attractive anatomy and hands, rounded organic shapes, subtle chocolate-colored outlines, a few cel-shaded planes, delicate gouache brush texture. Rich natural colors and gentle warm diffuse light. Consistent with high-quality painted adventure book covers. Neither photorealism nor glossy 3D.
Background: TRUE FULLY TRANSPARENT ALPHA. No white or colored background, no checkerboard pattern drawn into the image, no floor, no scenery, no ground shadow, no vignette or glow. Only the person and their worn clothing/accessories have opaque pixels.
Constraints: no other people, no animals, no mount, no floating objects, no equipment held in hands, no text, logos, symbols, captions, frames or UI. No cropping of head, hands or shoes. No multiple poses or duplicated person.
Character: recognizable adult FRIDA KAHLO portrayed respectfully as a warm painted-cartoon game character. Warm medium skin, dark thoughtful expressive eyes, her characteristic JOINED DARK EYEBROWS, subtle natural upper-lip shadow, dark braided hair pinned up with red, orange and magenta flowers. Wears a beautiful cream Mexican floral-embroidered blouse, a CORAL/RED SHAWL wrapped naturally over shoulders and around waist with its ends hanging at one side, a full long dark-blue skirt with tasteful colorful floral embroidery near the lower part, and simple brown shoes clearly visible below the hem. Small gold earrings. Calm intelligent self-possessed expression, relaxed hands free, gentle walking/standing posture. Adult woman, original respectful depiction with no caricature. No palette, no brush, no easel, no cat, no scenery, no medical objects, no reproduction of any artwork.
```


