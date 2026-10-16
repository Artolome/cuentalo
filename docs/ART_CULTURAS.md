# Arte — viajes culturales

Nueve escenarios originales amplían el mundo de Cuéntalo. Conservan el estilo cartoon pintado del juego: formas legibles y redondeadas, colores vivos, sombreado sencillo y textura ligera de gouache. El entorno deja libre la zona inferior central para los personajes del motor.

Estos dibujos son interpretaciones ilustradas para el juego, no reconstrucciones documentales. La plaza, el taller y el centro cultural son lugares genéricos de apoyo. Los cuatro escenarios de literatura y arte se documentan por separado en [ART_LIBROS.md](ART_LIBROS.md).

## Archivos y exportación

Carpeta común: `src/art/assets/escenas-cartoon/`.

| Id; archivos PNG y WebP del mismo nombre | Lectura visual | Original PNG | WebP, bytes |
| --- | --- | --- | ---: |
| `sant_jordi` | Barcelona en primavera: puesto de libros y rosas rojas. | 1585 × 992 | 128956 |
| `alhambra` | Patio y jardín de inspiración nazarí, arcadas, cipreses y agua en segundo plano. | 1586 × 992 | 111534 |
| `ofrenda` | Ofrenda familiar: cempasúchil, velas, papel picado, pan y retrato sin rostro legible. | 1586 × 992 | 101204 |
| `mercado_cusco` | Mercado andino cubierto: variedades de papas y maíz, techos y alturas al fondo. | 1586 × 992 | 130408 |
| `tango` | Salón de baile vacío, parquet y bandoneón de botones sobre un banco. | 1586 × 992 | 71280 |
| `barriletes` | Barriletes geométricos grandes expuestos verticalmente con soportes de bambú. | 1586 × 992 | 127258 |
| `plaza_cultural` | Plaza peatonal genérica, banco y calles que se bifurcan. | 1586 × 992 | 91230 |
| `taller_cultural` | Taller abierto con papel, tijeras, pegamento, varillas y cordeles. | 1586 × 992 | 74466 |
| `centro_cultural` | Centro cultural con biblioteca, mapa sin texto y agua potable en una jarra. | 1586 × 992 | 77394 |

Los nueve originales PNG se conservaron. Cada WebP se normalizó a **1024 × 640 px, 16:10**, mediante Pillow `Image.Resampling.LANCZOS`, convertido a RGB y comprimido con `quality=80, method=6`. No se recortaron los encuadres. Tamaño total de distribución de estos nueve fondos: **913730 bytes**.

## Generación y revisión

Generación mediante la herramienta integrada `image_gen` de Codex el **15 de octubre de 2026**, un fondo por llamada. No se utilizó CLI ni API externa. Referencia de estilo inspeccionada: `src/art/assets/escenas-cartoon/selva.png`. Se utilizó exclusivamente como referencia visual para conservar coherencia, no para copiar su selva ni su composición.

Se inspeccionaron las nueve imágenes por separado: ausencia de personas y texto; primer plano libre; signos narrativos reconocibles; coherencia de color y estilo. Los barriletes permanecen apoyados en tierra. El agua de la Alhambra aparece detrás de la terraza seca. La ofrenda conserva un ambiente de recuerdo familiar, sin elementos de terror. El tango muestra un bandoneón de botones; se corrigió mediante una segunda llamada integrada una silueta de bailarines que había aparecido en un cuadro del primer resultado.

## Prompts exactos

### sant_jordi

Referencia de estilo: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone original environment background for Cuéntalo, a Spanish storytelling game for children. Landscape 16:10.
Reference image: STYLE reference ONLY. Match its premium colorful painted cartoon adventure style: large rounded organic shapes, clear cel shading of a few tones, subtle chocolate/deep-green contours, light gouache texture, crisp readable color silhouettes, warm welcoming light. Do not copy its jungle or layout. This is a new cultural location, not a jungle scene.
Composition: wide view at child eye height, landscape 16:10. The lower central 50 percent must remain completely open, dry, uncluttered standing/walking ground for one or two game characters added later. Put large recognizable thematic objects on the right, supporting context in background. Large simple shapes readable at small card size.
Constraints: environment only. No people, no animals, no humanoid mascots, no legible faces, absolutely no text or writing, no letters, no numbers, no logos, no UI, no panel grid, no border. Do not use national stereotypes, costumes or flags as shortcuts. No photorealism, no glossy 3D, no detailed realistic anime painting.
Scene: Sant Jordi book-and-rose celebration on a small pedestrian square in BARCELONA, CATALONIA, on a warm spring day. At right, a prominent large street BOOK STALL with colorful closed books and a few OPEN BOOKS with entirely blank cream pages, several simple vases and generous bunches of unmistakable RED ROSES with green leaves. The roses and books should be the large clear focus. Background: warm ochre and salmon Catalan urban façades with wrought-iron balconies, tall shuttered windows, a few leafy urban trees; subtle Mediterranean setting, no invented famous monument. The lower foreground is broad empty pale stone paving. Cheerful reading festival without people, no text on book covers, no flags needed. Palette coral, turquoise sky, cream stone, fresh green and red roses.
```

### alhambra

Referencia de estilo: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone original environment background for Cuéntalo, a Spanish storytelling game for children. Landscape 16:10.
Reference image: STYLE reference ONLY. Match its premium colorful painted cartoon adventure style: large rounded organic shapes, clear cel shading of a few tones, subtle chocolate/deep-green contours, light gouache texture, crisp readable color silhouettes, warm welcoming light. Do not copy its jungle or layout. This is a new cultural location, not a jungle scene.
Composition: wide view at child eye height, landscape 16:10. The lower central 50 percent must remain completely open, dry, uncluttered standing/walking ground for one or two game characters added later. Put large recognizable thematic objects on the right, supporting context in background. Large simple shapes readable at small card size.
Constraints: environment only. No people, no animals, no humanoid mascots, no legible faces, absolutely no text or writing, no letters, no numbers, no logos, no UI, no panel grid, no border. Do not use national stereotypes, costumes or flags as shortcuts. No photorealism, no glossy 3D, no detailed realistic anime painting.
Scene: a garden COURTYARD inspired specifically by the NASRID PALACES of the ALHAMBRA in GRANADA, SPAIN. Elegant delicate stylized cream stucco arcades with slender columns and characteristic scalloped horseshoe arches along both sides; warm terracotta walls and low tiled roofs, no fantasy towers. A narrow elongated turquoise reflecting POOL lies in the middle distance with clipped green hedges and tall CYPRESSES; small geometric glazed tile accents in blue/green along low walls. The entire lower central foreground is a wide EMPTY DRY pale stone terrace, with water beginning well behind it so game characters will stand on stone. A clear azure sky and warm sun. Cultural architecture should feel specifically Nasrid and Andalusian: absolutely no generic mosque, no domes, no minarets, no onion roofs, no writing or calligraphic inscriptions. Clean readable rounded cartoon simplification of detailed decoration.
```

### ofrenda

Referencia de estilo: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone original environment background for Cuéntalo, a Spanish storytelling game for children. Landscape 16:10.
Reference image: STYLE reference ONLY. Match its premium colorful painted cartoon adventure style: large rounded organic shapes, clear cel shading of a few tones, subtle chocolate/deep-green contours, light gouache texture, crisp readable color silhouettes, warm welcoming light. Do not copy its jungle or layout. This is a new cultural location, not a jungle scene.
Composition: wide view at child eye height, landscape 16:10. The lower central 50 percent must remain completely open, dry, uncluttered standing/walking ground for one or two game characters added later. Put large recognizable thematic objects on the right, supporting context in background. Large simple shapes readable at small card size.
Constraints: environment only. No people, no animals, no humanoid mascots, no legible faces, absolutely no text or writing, no letters, no numbers, no logos, no UI, no panel grid, no border. Do not use national stereotypes, costumes or flags as shortcuts. No photorealism, no glossy 3D, no detailed realistic anime painting.
Scene: a tender family DÍA DE MUERTOS OFRENDA in MEXICO, seen inside a cozy domestic courtyard room at dusk. The focal subject is a welcoming decorated table to the RIGHT, covered in warm cloth, with MANY bright ORANGE MARIGOLDS (cempasúchil), several small glowing candles, round fruit and a simple traditional rounded sweet bread with crossed dough-bone decoration. One modest framed memorial portrait sits on the table, its interior an indistinct soft painted silhouette with NO discernible face. Cut-paper decorations (papel picado) with abstract geometric/floral cutouts hang high across the background. Warm terracotta walls and deep turquoise accents, intimate amber candlelight, tender remembrance and family care. Lower center is broad empty terracotta floor. No frightening or spooky imagery, no giant skeletons, no skull characters, no cemetery, no Halloween pumpkins, no people. No text anywhere.
```

### mercado_cusco

Referencia de estilo: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone original environment background for Cuéntalo, a Spanish storytelling game for children. Landscape 16:10.
Reference image: STYLE reference ONLY. Match its premium colorful painted cartoon adventure style: large rounded organic shapes, clear cel shading of a few tones, subtle chocolate/deep-green contours, light gouache texture, crisp readable color silhouettes, warm welcoming light. Do not copy its jungle or layout. This is a new cultural location, not a jungle scene.
Composition: wide view at child eye height, landscape 16:10. The lower central 50 percent must remain completely open, dry, uncluttered standing/walking ground for one or two game characters added later. Put large recognizable thematic objects on the right, supporting context in background. Large simple shapes readable at small card size.
Constraints: environment only. No people, no animals, no humanoid mascots, no legible faces, absolutely no text or writing, no letters, no numbers, no logos, no UI, no panel grid, no border. Do not use national stereotypes, costumes or flags as shortcuts. No photorealism, no glossy 3D, no detailed realistic anime painting.
Scene: a welcoming covered ANDEAN PRODUCE MARKET in CUSCO, PERU. At right a generous open market stall displays MANY BIG recognizably irregular POTATOES in baskets: purple, russet-red, cream and yellow varieties, beside piles of large maize cobs with pale, yellow and purple kernels. Produce must be large and graphically readable, not tiny specks. Simple timber market roof overhead and discreet striped woven textile accents on the stall; through the back opening, terracotta-red roofs, pale masonry and rounded high Andean green-brown hills. Soft clear high-altitude daytime light, colors violet, maize yellow, warm clay and leafy green. The lower centre is broad empty dry market paving for future characters. No people, no llamas, no sombreros, no exaggerated folkloric costumes, no labels or text.
```

### tango

Referencia de estilo: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone original environment background for Cuéntalo, a Spanish storytelling game for children. Landscape 16:10.
Reference image: STYLE reference ONLY. Match its premium colorful painted cartoon adventure style: large rounded organic shapes, clear cel shading of a few tones, subtle chocolate/deep-green contours, light gouache texture, crisp readable color silhouettes, warm welcoming light. Do not copy its jungle or layout. This is a new cultural location, not a jungle scene.
Composition: wide view at child eye height, landscape 16:10. The lower central 50 percent must remain completely open, dry, uncluttered standing/walking ground for one or two game characters added later. Put large recognizable thematic objects on the right, supporting context in background. Large simple shapes readable at small card size.
Constraints: environment only. No people, no animals, no humanoid mascots, no legible faces, absolutely no text or writing, no letters, no numbers, no logos, no UI, no panel grid, no border. Do not use national stereotypes, costumes or flags as shortcuts. No photorealism, no glossy 3D, no detailed realistic anime painting.
Scene: an inviting small neighborhood TANGO DANCE SALON in BUENOS AIRES, ARGENTINA, empty of dancers. Large open golden wooden PARQUET dance floor occupies the entire lower and central foreground. At the back RIGHT sits a wooden bench carrying a very recognizable BANDONEON, an angular square-ended small concertina with deep folded black bellows and rows of round white buttons at both ends, NOT a piano-key accordion; make the instrument prominent and visible. Beside it a simple empty music stand with blank cream sheet. Warm amber early evening light through tall open windows, dark wood trim, muted teal and cream walls, a hint of an urban neighborhood courtyard beyond. Cozy local cultural venue rather than a grand palace ballroom. No people, no dancing silhouettes, no notes or musical symbols, no lettering. No flags or tourist clichés.
```

Edición del primer resultado: reemplazar únicamente la imagen dentro del marco para eliminar las siluetas de bailarines. El PNG conservado es el resultado final revisado.

```text
Use case: precise-object-edit
Edit target: this empty tango salon illustration.
Make exactly ONE targeted change: remove the dancing-human silhouettes inside the small framed picture on the wall to the left of the middle window. Replace the picture INSIDE that same frame with a simple abstract geometric composition of warm ochre, cream and teal shapes, absolutely no human, dancer, face or body silhouette. Keep the frame itself, bandoneon on the bench, empty music stand, windows, furniture, floor, lighting, viewpoint, colors, painterly cartoon style and all other parts exactly unchanged. The result must contain no people or pictures of people, no writing, no logo, no UI. Landscape16:10.
```

### barriletes

Referencia de estilo: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone original environment background for Cuéntalo, a Spanish storytelling game for children. Landscape 16:10.
Reference image: STYLE reference ONLY. Match its premium colorful painted cartoon adventure style: large rounded organic shapes, clear cel shading of a few tones, subtle chocolate/deep-green contours, light gouache texture, crisp readable color silhouettes, warm welcoming light. Do not copy its jungle or layout. This is a new cultural location, not a jungle scene.
Composition: wide view at child eye height, landscape 16:10. The lower central 50 percent must remain completely open, dry, uncluttered standing/walking ground for one or two game characters added later. Put large recognizable thematic objects on the right, supporting context in background. Large simple shapes readable at small card size.
Constraints: environment only. No people, no animals, no humanoid mascots, no legible faces, absolutely no text or writing, no letters, no numbers, no logos, no UI, no panel grid, no border. Do not use national stereotypes, costumes or flags as shortcuts. No photorealism, no glossy 3D, no detailed realistic anime painting.
Scene: a sunny open green field among gentle GUATEMALAN highland hills, with GIANT COLORFUL KITES being EXHIBITED upright on the ground. On the RIGHT stand two enormous circular or octagonal barriletes of brightly colored tissue paper, one larger than the other; the clear subject is their radial geometric patchwork of red, turquoise, yellow, magenta and green with simple stepped ornamental geometric motifs. Their slim bamboo frames and angled bamboo support poles are visibly connected to the ground, like upright displays. They are firmly on the ground, NOT flying in the sky. A small simple diamond kite and a neat few rolls of colored paper and cord rest at their base on the far right. Happy daytime craft celebration, open blue sky, soft green hills, a few distant trees. The lower central half is a broad empty level grassy clearing for game characters. No people, no faces or religious pictures in kite art, no text, no logos, no huge kites airborne.
```

### plaza_cultural

Referencia de estilo: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone original environment background for Cuéntalo, a Spanish storytelling game for children. Landscape 16:10.
Reference image: STYLE reference ONLY. Match its premium colorful painted cartoon adventure style: large rounded organic shapes, clear cel shading of a few tones, subtle chocolate/deep-green contours, light gouache texture, crisp readable color silhouettes, warm welcoming light. Do not copy its jungle or layout. This is a new cultural location, not a jungle scene.
Composition: wide view at child eye height, landscape 16:10. The lower central 50 percent must remain completely open, dry, uncluttered standing/walking ground for one or two game characters added later. Put large recognizable thematic objects on the right, supporting context in background. Large simple shapes readable at small card size.
Constraints: environment only. No people, no animals, no humanoid mascots, no legible faces, absolutely no text or writing, no letters, no numbers, no logos, no UI, no panel grid, no border. Do not use national stereotypes, costumes or flags as shortcuts. No photorealism, no glossy 3D, no detailed realistic anime painting.
Scene: an inviting GENERIC PEDESTRIAN CULTURAL SQUARE on a sunny day. Warm white, pale ochre and coral façades with simple balconies and colorful window shutters surround the square; two small clearly branching pedestrian lanes lead away at the back left and back right. A wooden public bench, a few small rounded leafy trees in planters and discreet pots of flowers sit along the right edge. Friendly civic public space, open bright turquoise sky, coral and sky-blue accents. The entire lower and central foreground is broad EMPTY cream stone paving. No specific famous monument, no country-specific flags, no statues, no symbolic national costumes, no lettering, no signs, no people. Visually accessible calm place to stop and decide where to go.
```

### taller_cultural

Referencia de estilo: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone original environment background for Cuéntalo, a Spanish storytelling game for children. Landscape 16:10.
Reference image: STYLE reference ONLY. Match its premium colorful painted cartoon adventure style: large rounded organic shapes, clear cel shading of a few tones, subtle chocolate/deep-green contours, light gouache texture, crisp readable color silhouettes, warm welcoming light. Do not copy its jungle or layout. This is a new cultural location, not a jungle scene.
Composition: wide view at child eye height, landscape 16:10. The lower central 50 percent must remain completely open, dry, uncluttered standing/walking ground for one or two game characters added later. Put large recognizable thematic objects on the right, supporting context in background. Large simple shapes readable at small card size.
Constraints: environment only. No people, no animals, no humanoid mascots, no legible faces, absolutely no text or writing, no letters, no numbers, no logos, no UI, no panel grid, no border. Do not use national stereotypes, costumes or flags as shortcuts. No photorealism, no glossy 3D, no detailed realistic anime painting.
Scene: a bright OPEN CREATIVE WORKSHOP with warm cream walls, large sunlit windows and an open door onto green plants. On the RIGHT, a prominent wooden craft table is covered in large sheets of bright colored PAPER, a pair of blunt craft SCISSORS, a plain GLUE STICK without lettering, several thin BAMBOO or WOOD STICKS and spools of CORD. Color paper rolls and drawers behind the table; simple pinboard with only blank colored swatches and abstract shapes. Readable, child-friendly organized creative materials, not clutter. The lower central 50 percent is a wide completely clear dry warm wooden/tiled floor for game characters. Cheerful daylight palette of cream, green, coral, yellow, blue. No artwork specific to a country, no finished country-specific artifact, no people, no text, no numbers.
```

### centro_cultural

Referencia de estilo: `src/art/assets/escenas-cartoon/selva.png`.

```text
Use case: illustration-story
Asset type: one standalone original environment background for Cuéntalo, a Spanish storytelling game for children. Landscape 16:10.
Reference image: STYLE reference ONLY. Match its premium colorful painted cartoon adventure style: large rounded organic shapes, clear cel shading of a few tones, subtle chocolate/deep-green contours, light gouache texture, crisp readable color silhouettes, warm welcoming light. Do not copy its jungle or layout. This is a new cultural location, not a jungle scene.
Composition: wide view at child eye height, landscape 16:10. The lower central 50 percent must remain completely open, dry, uncluttered standing/walking ground for one or two game characters added later. Put large recognizable thematic objects on the right, supporting context in background. Large simple shapes readable at small card size.
Constraints: environment only. No people, no animals, no humanoid mascots, no legible faces, absolutely no text or writing, no letters, no numbers, no logos, no UI, no panel grid, no border. Do not use national stereotypes, costumes or flags as shortcuts. No photorealism, no glossy 3D, no detailed realistic anime painting.
Scene: the welcoming reception area of a PUBLIC CULTURAL CENTER AND LIBRARY. At RIGHT a low large wooden information table shows a clearly visible unfolded FOLDED MAP made of cream paper with purely abstract blue rivers, green blocks and simple path lines, ABSOLUTELY NO written words or labels. Beside it sit a transparent WATER CARAFE and one clear drinking glass, large enough to be recognized. Behind at right and across back wall, open bookshelves with colorful blank-spined books and a simple cushioned bench for rest, potted green plants, broad daylight windows. A warm open public room with pale cream, muted teal and honey-colored wood. The entire lower centre foreground remains empty clean light tile floor, safe open space for characters added later. No people, no portraits, no signs, no text, no logos, no specific country symbols.
```


