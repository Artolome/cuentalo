# Sobrevives — modelo de contenido (fases 0 a 3)

> Documento de validación. Todo lo que está aquí se implementa tal cual en `src/contenido.js` (datos) y `src/engine.js` (reglas).
> Lo que hay que **verificar o decidir** está marcado con ⚠️ y recogido también en `DECISIONS.md`.

## 0. Fuentes utilizadas

| Fuente | Qué se ha tomado |
|---|---|
| GitHub **Artolome/Sobrevive** (juego de cartas, 5 mundos, A1) | el universo «¡Sobrevive!», el nivel (A1, 5e→3e), el personaje **Lucía**, el estilo gráfico (ligne claire, paleta cálida), el léxico A1 de los decks (→ `docs/lexico_fuente.md`) |
| GitHub **Artolome/Charlemos** (personajes IA) | las fichas de **Mateo, Valeria, Diego, Lucía** y la mascota **Kiwi, el loro** |
| `fuentes/captura-sobrevive-frida.pdf` | el PDF `sobrevives.pdf` resultó ser una captura de pantalla (1 página) de una carta del mundo Frida: no contiene la secuencia |
| El brief | el universo de supervivencia (selva, río, tormenta, noche, refugio, rescate) y el modelo de mecánica |

⚠️ No existe carpeta `./fuentes/` con la secuencia: el campo léxico «de la secuencia» se ha reconstruido a partir de los decks del juego ¡Sobrevive! + el universo de supervivencia del brief. Las palabras de supervivencia que **no** aparecen en los decks están listadas en §7 para que las valides.

## 1. Personajes

| id | nombre | género | edad | rasgo (1) | accesorio (1) | color | procedencia |
|---|---|---|---|---|---|---|---|
| `lucia` | **Lucía** | f | 13 | alegre: canta siempre | gorra rosa | rosa `#e2558c` | Sobrevive · Charlemos (Madrid/Bogotá, loro Kiwi) |
| `mateo` | **Mateo** | m | 13 | siempre tiene hambre | camiseta de fútbol azul | azul `#2c5a9a` | Charlemos (Madrid, Lavapiés, bocadillo de tortilla, Atlético) |
| `valeria` | **Valeria** | f | 14 | valiente: la exploradora | cámara de fotos | amarillo `#dfa92c` | Charlemos (Oaxaca, «la exploradora», foto) |
| `diego` | **Diego** | m | 15 | miedoso, pero cuenta historias | cuaderno de dibujo | morado `#7a3b9e` | Charlemos (Sevilla, Triana, arte y leyendas) |
| `kiwi` | Kiwi, el loro | m (animal) | — | el loro de Lucía: vuela y ve todo | plumas verdes | verde | Charlemos (mascota) — **reservado para una fase posterior** ⚠️ |

- El **género** rige los acuerdos: *cansado/cansada, herido/herida, perdido/perdida, solo/sola, enfadado/enfadada, tranquilo/tranquila, juntos/juntas*. Grupo mixto → masculino plural.
- Dos chicas y dos chicos → práctica equilibrada de los acuerdos.
- Los rasgos son descriptivos (identidad, arte). ⚠️ Opción posible: que el rasgo tenga efecto (Mateo empieza siempre con hambre; Diego tiene miedo más fácilmente). No implementado.
- Kiwi: pensado como personaje especial (no tiene hambre/frío/miedo, nunca se pierde, «Kiwi vuela y encuentra a Lucía»). Existe en los datos, no en los niveles. ⚠️ ¿Lo quieres en el capítulo 3? Alternativa: *Garfio, el gato del cole* (ya dibujado en Sobrevive).

## 2. Estados (por personaje)

| id | frase | cómo aparece | cómo desaparece |
|---|---|---|---|
| `hambre` | tiene hambre | la selva (a dos) · la montaña | el árbol de frutas · la mochila · el fuego con comida |
| `sed` | tiene sed | el sol | el río |
| `frio` | tiene frío | el río sin cuerda · la tormenta sin manta | el fuego · la manta |
| `miedo` | tiene miedo | la noche (solo/a, sin linterna) · la tormenta (solo/a) · el jaguar (solo/a) | la noche (a dos) · el refugio · la linterna |
| `cansado` | está cansado/a | la selva (a dos) · la montaña | la noche (a dos) · el refugio |
| `herido` | está herido/a | la serpiente (solo/a) | el refugio (a dos: el otro lo cura) |
| `perdido` | está perdido/a | la selva (solo/a, sin mapa) · el jaguar (solo/a, sin mapa) | el mapa · la montaña · estar con alguien (el otro lo encuentra) |
| `salvo` | está a salvo | el rescate (si nadie está perdido) | — (estado final: ya no puede aparecer en otra viñeta) |
| `enfadado con X` | está enfadado/a con X | el fuego: X come solo/a delante de él/ella | el refugio (a dos): X pide perdón |
| `amigos` | (relación) | compartir una viñeta (salvo cuando uno come solo) | — |
| `contento` | está contento/a | **derivado**: ningún estado negativo y nadie enfadado | — |

Objetos (se guardan y protegen después): `mapa` 🗺️ (no se pierde) · `cuerda` 🪢 (cruza el río sin mojarse) · `manta` 🧣 (no tiene frío en la tormenta) · `linterna` 🔦 (no tiene miedo de noche) · `comida` 🍞 (come junto al fuego / comparte).

## 3. Escenas y reglas

Cada viñeta = 1 escena + 1 o 2 personajes. Las reglas dependen del estado anterior.

**Reglas generales (valen para todas las escenas con 2 personajes)**
1. Si uno está perdido y el otro no → *«Y encuentra a X. ¡Qué alegría!»* (perdido ✗). Si los dos están perdidos → *«Se encuentran. Ya no están perdidos.»*
2. Compartir una viñeta → son **amigos**, y la primera vez se dice: *«Ahora Lucía y Mateo son amigos.»* (excepto si uno come y no comparte). La amistad decide si se comparte la comida junto al fuego.
3. Un personaje **a salvo** no puede aparecer en una viñeta posterior (*«¡Pero Lucía ya está a salvo! No puede estar aquí.»* → historia incoherente).
4. **Todos los personajes del nivel tienen que salir** al menos una vez (si no: *«Mateo no sale en la historia.»*). ⚠️ Regla añadida para que el segundo personaje no sea decorativo; se puede quitar.
5. Un nivel puede empezar con un **estado inicial** (`inicial`), que se lee bajo el título: *«Al principio: Lucía tiene hambre y está cansada.»* (usado en c3n6).
6. Dos personajes en una escena de **1 plaza** (los objetos) → *«Aquí solo cabe una persona.»* e historia inválida; la interfaz lo evita sustituyendo al personaje.

| escena | slots | solo/a | a dos | objetos |
|---|---|---|---|---|
| 🌴 **La selva** | 1-2 | camina solo/a y **se pierde** | si uno está perdido: **lo encuentra**; si no: caminan juntos → **hambre + cansados** | con mapa: no se pierde |
| 🌊 **El río** | 1-2 | bebe agua (**sed ✗**); cruza y se moja → **frío** | igual, los dos | con cuerda (uno basta): cruzan sin mojarse |
| 🌞 **El sol** | 1-2 | hace mucho calor → **sed** | igual | — |
| ⛈️ **La tormenta** | 1-2 | llueve → **frío + miedo** | llueve → **frío** (sin miedo: están juntos) | con manta (uno basta): se tapa(n) → **frío ✗** |
| 🌙 **La noche** | 1-2 | está solo/a → **miedo** | duermen juntos → **cansado ✗, miedo ✗** | con linterna: enciende la linterna y duerme tranquilo/a |
| 🐆 **El jaguar** | 1-2 | miedo, corre → **miedo + perdido** | gritan juntos y el jaguar se va (sin efecto) | con mapa: no se pierde |
| 🐍 **La serpiente** | 1-2 | la serpiente le muerde → **herido/a** | el otro la ve y avisa: nadie está herido | — |
| 🍌 **El árbol de frutas** | 1-2 | come frutas → **hambre ✗** | igual | — |
| 🔥 **El fuego** | 1-2 | hace fuego → **frío ✗**; con comida y hambre: come | si solo uno tiene comida y el otro hambre: **amigos → comparte**; **no amigos → come y no comparte, el otro está enfadado/a** | comida |
| 🏕️ **El refugio** | 1-2 | descansa → **cansado ✗, miedo ✗** | además: **cura** al herido; **pide perdón** si uno está enfadado | — |
| ⛰️ **La montaña** | 1-2 | sube → **cansado + hambre**; desde arriba ve el río → **perdido ✗** | igual | — |
| 🗺️ El mapa | 1 | encuentra el mapa → **perdido ✗** + guarda el mapa | — | +mapa |
| 🎒 La mochila | 1 | encuentra una mochila con comida → **hambre ✗** + guarda la comida | — | +comida |
| 🪢 La cuerda | 1 | encuentra una cuerda y la guarda | — | +cuerda |
| 🧣 La manta | 1 | encuentra una manta → **frío ✗** + la guarda | — | +manta |
| 🔦 La linterna | 1 | encuentra una linterna → **miedo ✗** + la guarda | — | +linterna |
| 🚁 **El rescate** | 1-2 | ¡el helicóptero! → **a salvo**; si está perdido/a: el helicóptero no lo ve | los dos a salvo (a dos nunca están perdidos: se han encontrado) | — |

⚠️ Decisiones discutibles: la comida no se gasta; la cuerda/manta de uno protege a los dos; el rescate lleva a 2 personas como máximo; la montaña «quita el perdido» (desde arriba se ve el río).

## 4. Objetivos (títulos) — tipos de predicado

| tipo | ejemplo de título | se cumple si… |
|---|---|---|
| `estado` | *Mateo tiene frío* · *Lucía está a salvo* | el estado final de X |
| `yaNo` | *Lucía ya no tiene sed* | X lo tuvo en algún momento y ya no |
| `todos` / `nadie` | *Todos están a salvo* · *Nadie tiene miedo* | todos / ninguno de los personajes del nivel (estado final) |
| `nunca` | *Valeria nunca tiene miedo* | X no lo tiene en ninguna viñeta |
| `evento` | *Mateo encuentra a Lucía* · *Valeria cura a Diego* · *Lucía comparte la comida con Mateo* · *Diego pide perdón a Lucía* · *Valeria duerme tranquila* | el evento ocurre en alguna viñeta |
| `sinEvento` | *Nadie duerme solo* · *Nadie se pierde en la selva* · *Todos comparten* | el evento no ocurre en ninguna viñeta (se combina con `y`) |
| `enfadado` / `amigos` | *Mateo está enfadado con Lucía* · *Lucía y Mateo son amigos* | relación final |
| `y` | *Todos están contentos y a salvo* | las dos partes |
| `historia` | título libre del modo Autor (*Lucía tiene mucha sed*) | la historia jugada por el autor «se graba»: mismos estados finales de cada personaje (7 negativos + a salvo) y mismos eventos con título (encuentra, cura, comparte…) |

El motor genera también el título desde el predicado (`tituloDe`) — sirve al asistente del modo Autor — y explica **por qué no** se cumple todavía (botón «¿Qué pasa?»): *«Lucía todavía tiene sed.»*, *«Mateo no sale en la historia.»*, *«Valeria tiene miedo en la viñeta 2.»* Para los títulos de evento añade la condición que falta: *«Falta: «Diego pide perdón a Lucía». Primero Lucía tiene que estar enfadada (el fuego: comer y no compartir). Después, los dos en el refugio.»*

## 5. Los 16 niveles (+ nivel libre)

Dificultad medida por el resolvedor exacto (`node test/solver.js`): **soluciones** = historias completas distintas que cumplen el título; **densidad** = soluciones ÷ historias posibles. Capítulo 1: se exige ≤ 8 soluciones. Capítulos 2-3: el recuento bruto crece con las viñetas «de relleno» (ver DECISIONS §5), así que se controla la densidad (≤ 10 %).

| id | cap | título | viñ. | escenas | personajes | título secreto | soluciones · densidad |
|---|---|---|---|---|---|---|---|
| c1n1 | 1 | **Lucía ya no tiene sed** | 3 | sol · río · fuego | Lucía | — | 6 · 22 % |
| c1n2 | 1 | **Mateo ya no tiene frío** | 3 | río · fuego | Mateo | — | 3 · 37 % |
| c1n3 | 1 | **Valeria duerme tranquila** | 3 | noche · linterna · refugio | Valeria | — | 7 · 26 % |
| c1n4 | 1 | **Diego ya no está perdido** | 3 | selva · montaña · frutas | Diego | — | 6 · 22 % |
| c1n5 | 1 | **Lucía está a salvo** | 3 | selva · mapa · rescate | Lucía | — | 3 · 11 % |
| c2n1 | 2 | **Mateo encuentra a Lucía** | 3 | selva · noche · sol | Lucía, Mateo | Nadie duerme solo | 63 · 8,6 % |
| c2n2 | 2 | **Valeria cura a Diego** | 3 | serpiente · refugio | Valeria, Diego | Valeria está herida | 14 · 6,5 % |
| c2n3 | 2 | **Lucía y Mateo ya no tienen hambre** | 3 | selva · frutas · noche | Lucía, Mateo | Nadie está cansado | 24 · 3,3 % |
| c2n4 | 2 | **Nadie tiene miedo y todos tienen frío** | 3 | noche · tormenta · jaguar | Valeria, Diego | El jaguar se va | 39 · 5,4 % |
| c2n5 | 2 | **Valeria encuentra a Mateo y todos están a salvo** | 3 | selva · mapa · rescate | Valeria, Mateo | Valeria encuentra el mapa | 6 · 1,2 % |
| c3n1 | 3 | **Lucía comparte la comida con Mateo** | 4 | mochila · selva · fuego · noche | Lucía, Mateo | Nadie está cansado | 68 · 0,46 % |
| c3n2 | 3 | **Mateo está enfadado con Lucía** | 4 | mochila · montaña · fuego · río | Lucía, Mateo | Mateo tiene frío | 58 · 0,40 % |
| c3n3 | 3 | **Diego pide perdón a Lucía** | 4 | mochila · montaña · fuego · refugio | Lucía, Diego | — (nivel «enigma», a propósito) | **2** · 0,01 % |
| c3n4 | 3 | **Valeria duerme tranquila y todos están a salvo** | 4 | noche · jaguar · linterna · rescate | Valeria, Diego | Diego tiene miedo | 26 · 0,18 % |
| c3n5 | 3 | **Diego encuentra a Lucía y todos están a salvo** | 5 | selva · jaguar · noche · mapa · rescate | Lucía, Mateo, Diego | Mateo nunca tiene miedo | 6 256 · 0,04 % |
| c3n6 | 3 | **Todos están contentos y a salvo** (al principio todos tienen hambre y están cansados) | 6 | selva · río · noche · frutas · refugio · rescate | Lucía, Mateo, Valeria | Lucía y Valeria duermen bien | 20 088 · 0,001 % |
| libre | — | *Mi historia* (sin título) | 6 | todas | los 4 | — | — |
| autor-… | 0 | título del asistente o libre (`historia`) | 2–6 | 1–8 elegidas | 1–4 | — | guardado tras jugar una solución · se muestran en «Niveles de la clase» en los tres ★ |

Progresión: cap. 1 = 1 personaje, 3 viñetas, 2-3 escenas, estructuras *tiene / está / ya no* (la tercera escena cierra el arco: *sol → río → fuego*); cap. 2 = 2 personajes, 3 viñetas, *encuentra a, cura a, todos / nadie, plural, son amigos*; cap. 3 = 4-6 viñetas, 2-3 personajes, *comparte con, enfadado con, pide perdón a, nunca, y*, estado inicial. Los tres niveles finales exigen una historia real (ya no se ganan con «frutas ×4 + dos helicópteros»).

⚠️ Las **pistas** (2-3 por nivel, en español sencillo) están en `src/contenido.js` y en `docs/frases.txt` (sección PISTAS).

## 6. Gabarits de frases (presente) — la capa pedagógica

Una viñeta produce 1-3 frases cortas (4 la primera vez que dos personajes se hacen amigos). Todas las variantes (género, número, presente/pretérito) están en `docs/frases.txt` (1 634 frases, generadas por `test/frases.js`). Muestra:

| escena | frase(s) |
|---|---|
| selva (solo) | *Lucía camina sola por la selva y se pierde.* |
| selva (a dos, uno perdido) | *Mateo encuentra a Lucía en la selva. ¡Qué alegría!* |
| selva (a dos) | *Lucía y Mateo caminan juntos por la selva. Tienen hambre y están cansados. Ahora Lucía y Mateo son amigos.* |
| estado inicial | *Al principio: Lucía tiene hambre. Está cansada.* |
| río | *Lucía bebe agua del río. Ya no tiene sed. Cruza el río y se moja. Tiene frío.* |
| sol | *Hace mucho calor. Mateo tiene sed.* |
| tormenta (solo) | *Llueve mucho. Diego tiene frío y miedo.* |
| noche (solo) | *Es de noche. Valeria está sola y tiene miedo.* |
| noche (linterna) | *Es de noche. Valeria enciende la linterna y duerme tranquila.* |
| noche (a dos) | *Es de noche. Lucía y Mateo están juntos y duermen bien. Ya no están cansados.* |
| jaguar (solo) | *¡Un jaguar! Diego tiene miedo y corre. Se pierde.* |
| jaguar (a dos) | *¡Un jaguar! Valeria y Diego gritan juntos y el jaguar se va.* |
| serpiente (solo) | *¡Ay! Una serpiente muerde a Diego. Está herido.* |
| serpiente (a dos) | *Valeria ve una serpiente y avisa a Diego. ¡Cuidado! La serpiente no muerde a nadie.* |
| frutas | *Mateo come frutas. Ya no tiene hambre.* |
| fuego | *Lucía hace fuego. Ya no tiene frío.* · *Lucía comparte la comida con Mateo. Ya no tienen hambre.* · *Lucía come y no comparte. Mateo tiene hambre y está enfadado con Lucía.* |
| refugio | *Valeria y Diego descansan en el refugio. Valeria cura a Diego. Diego ya no está herido.* · *Diego pide perdón a Lucía. Lucía ya no está enfadada.* |
| montaña | *Diego sube la montaña. Está cansado y tiene hambre. Desde arriba ve el río. ¡Ya no está perdido!* |
| objetos | *Lucía encuentra el mapa. ¡Ya no está perdida!* · *Mateo encuentra una mochila con comida. Come y ya no tiene hambre.* · *Valeria encuentra una linterna. La guarda.* |
| rescate | *¡El helicóptero! Lucía y Mateo están a salvo.* · *El helicóptero no ve a Lucía. Lucía todavía está perdida.* |
| incoherencia | *¡Pero Lucía ya está a salvo! No puede estar aquí.* |
| resumen final («¿Qué pasa?») | *Lucía tiene hambre y frío. Está perdida.* · *Mateo está contento.* · *Valeria está a salvo.* |

**Pretérito** (opción 3e): acciones en indefinido (*caminó, se perdió, encontró, bebió, durmió, se salvó…*); estados y marcos en imperfecto (*tenía sed, estaba perdida, ya no estaban cansados · Llovía mucho. Hacía mucho calor. Era de noche. Había comida.*). Ejemplo: *Lucía caminó sola por la selva y se perdió. · Era de noche. Lucía estaba sola y tenía miedo. · Mateo encontró a Lucía. ¡Qué alegría!* ⚠️ ver DECISIONS §6.

## 7. Léxico

**Estructuras** (A1/A2): *X tiene hambre / sed / frío / miedo* · *X está cansado/a, herido/a, perdido/a, a salvo, contento/a, solo/a* · *X y Y están…* (plural y acuerdo) · *ya no…* · *nadie / todos* · *nunca* · *X encuentra a Y* (a personal) · *X cura a Y* · *X comparte la comida con Y* · *X pide perdón a Y* · *X está enfadado/a con Y* · *¡Qué + sustantivo!* · *Hace calor · Llueve · Es de noche · Hay*.

**Palabras de las escenas** (panel «Léxico», generado automáticamente desde `LEXICO_ESCENA` según las escenas del nivel; 56 lemas en el nivel libre, todos con picto): selva, río, agua, sol, hacer calor, tormenta, llover, noche, jaguar, serpiente, frutas, fuego, refugio, montaña, mapa, mochila, comida, cuerda, manta, linterna, helicóptero · caminar, perderse, encontrar, beber, cruzar, mojarse, dormir, comer, guardar, compartir, descansar, curar, subir, ver, gritar, correr, morder, avisar, encender, taparse, pedir perdón · hambre, sed, frío, miedo, cansado, herido, perdido, a salvo, solo, juntos, amigos, enfadado, contento, tranquilo.

**Palabras ya presentes en los decks de ¡Sobrevive!** (verificado en `docs/lexico_fuente.md`, 1 060 lemas): *hambre, miedo, cansado, contento, triste, tranquilo, solo (adv.), noche, sol, lluvia, llover, montaña, mochila, mapa, manta, comida, comer, beber, dormir, descansar, curar, perdón, cruzar, subir, caminar, correr, gritar, avisar, guardar, ver, hacer, seguir, llegar, amigo, alegría*.

**Palabras de supervivencia que NO están en los decks** (⚠️ a validar — son las que el juego añade): *selva, río, agua, frío, sed, calor, tormenta, refugio, fuego, cuerda, linterna, rescate, helicóptero, jaguar, serpiente, herido, perdido, a salvo, mojarse, morder, encender, taparse, encontrar(se), compartir, enfadado, juntos, suerte, ¡cuidado!*. Son 28 lemas, casi todos concretos y «dibujables» (pictos en el panel Léxico); *frío, sed, perdido, herido, a salvo, encontrar a, juntos, enfadado con* son además las estructuras-objetivo de la secuencia de supervivencia. Si alguna no te conviene, se cambia en `src/engine.js` (plantillas) y `src/lengua.js` (formas).

**Palabras-herramienta**: y, pero, con, sin, por, de, en, a, ya no, no, nadie, todos, nunca, juntos, solo, desde arriba, ¡Qué…!, ¡Cuidado!, ¡Ay!

## 8. Lo que incluye `sobrevives.html` (fases 0 a 3)

- **Juego**: los 16 niveles + nivel libre, arrastrar-soltar y clic-clic, frases generadas, caras según el estado, «¿Qué pasa?», léxico, pistas, síntesis de voz (clic en una frase, en el título o en una palabra del léxico), estrellas en `localStorage`, «Borrar mis datos».
- **Modos**: pantalla de inicio Pizarra (letras grandes, barra «⏱ Clase»: cronómetro, sorteo de números, equipos) / Solo / Autor; selector discreto ★ Paso a paso · ★★ Estándar · ★★★ Reto.
- **Modo escritor**: elegir la frase entre 3 (A1) o escribirla (A2, tolerante a tildes y signos, pista con las iniciales); obligatorio en ★★★, activable por el profe.
- **Autor**: asistente de títulos (todos los predicados posibles con las cartas elegidas) o título libre grabado (`historia`); código corto para dictar; niveles de la clase en `localStorage`; importación por código.
- **Profe** (tecla P, contraseña local «profe»): ajustes (escritor, elegir/escribir, pretérito, barra de clase), soluciones de cada nivel con «Cargar», niveles de la clase (jugar, borrar, exportar/importar JSON).
- **Imprimir mi historia**: A4 apaisado con el cómic resuelto y hojas de viñetas vacías (4 y 6).
- **Pretérito**: bascule del profe; acciones en indefinido, estados y marcos en imperfecto (§6).
- Sin red, sin dependencias, sin datos personales; funciona con doble clic en Chrome, Edge y Firefox.
- Pendiente: Kiwi (definido, sin reglas), arte definitivo opcional.
