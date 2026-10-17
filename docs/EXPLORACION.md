# Aventuras de exploración

Cuatro pequeños mundos para jugar moviendo un personaje. Cada aventura contiene seis misiones breves y un final. Se avanza con las flechas del teclado o los controles táctiles y se utiliza un único botón de acción cerca del objeto o personaje indicado.

Las cuatro son **aventuras imaginadas**. Don Quijote, Úrsula, el bibliotecario y Frida sirven de protagonistas para acciones nuevas. Los recorridos no son reconstrucciones de las novelas ni de la biografía de Frida. Entre las misiones, un fragmento de dos frases cuenta la obra real o la vida de la artista, con la etiqueta «La obra» o «La vida de Frida». La introducción distingue las misiones inventadas de esos relatos. Véanse [Relatos y fuentes](RELATOS_EXPLORACION.md) y [Fuentes culturales](FUENTES_CULTURALES.md).

## Cómo se juega

1. Elige un mundo y lee su misión de una línea.
2. Mueve el personaje hasta el objeto indicado.
3. Utiliza el botón de acción. Si hay varias cosas que encontrar, visita cada una una sola vez.
4. Completa la misión, lee o escucha el breve fragmento de historia y pulsa «Seguir» cuando quieras.

No hay preguntas, respuestas de opción múltiple, asociaciones de tarjetas ni objetos que combinar. Una misión puede pedir hablar, acercarse, encontrar, recoger, abrir, encender, pintar o tocar una campana. Todas utilizan el mismo control de acción. La interacción con un elemento ajeno al objetivo no lo cuenta como una misión completada.

La redacción **fácil** usa indicaciones más breves. La redacción **normal** añade contexto. Las dos conservan los mismos objetos, cantidades y condiciones; cambiar el idioma de la consigna no cambia el recorrido.

## Movimiento y relatos

Las ilustraciones originales siguen siendo los personajes en reposo. Las nuevas poses pintadas alternan al caminar, hablar y, para Frida, pintar. Sancho responde con sus propios gestos. La acción se completa después del gesto; durante ese momento el personaje permanece junto al objeto. Abrir la ayuda o el resumen interrumpe el gesto sin contar una acción a medias. Se puede volver a intentarlo al cerrar el panel.

La preferencia del dispositivo para reducir movimiento detiene los ciclos y acorta la espera. Los controles y la progresión son idénticos. Las imágenes se incluyen dentro del HTML, como los fondos anteriores; no dependen de una conexión durante la partida.

El botón «Historia» —«Su vida» para Frida— permite abrir un resumen, escuchar el texto y consultar los seis fragmentos o sus fuentes. No hay examen ni tiempo de lectura obligatorio. Los 24 fragmentos tienen entre 29 y 36 palabras; el selector Fácil/Normal cambia las consignas, no esos relatos. La lectura en voz alta utiliza la voz española disponible en el navegador. Los textos revelan el final de las obras y la introducción lo indica.

## Los cuatro recorridos

| Mundo y personaje | Seis pasos del recorrido | Final |
| --- | --- | --- |
| Don Quijote y Sancho · Don Quijote | Hablar con Sancho → encontrar a Rocinante → visitar el molino → recoger tres frutas → encontrar la carta → abrir la puerta de casa | Llegar a casa con comida y recuerdos |
| Una fiesta en Macondo · Úrsula | Encontrar tres mariposas amarillas → abrir la casa → buscar la invitación → recoger tres frutas → recoger agua del pozo → tocar la campana | Preparar la fiesta de la plaza |
| Luces en la biblioteca · bibliotecario | Encontrar el libro azul → encender dos lámparas → encontrar la llave → abrir la biblioteca → recoger tres estrellas → tocar la campana | Abrir una biblioteca iluminada |
| El taller de Frida · Frida | Recoger tres flores rojas → recoger azul y amarillo → pintar → abrir la puerta → mostrar el cuadro → tocar la campana | Abrir una exposición |

Los frutos, las flores, las estrellas y el agua pertenecen a estos escenarios imaginados. El recorrido de Frida es un juego de creación y exposición; no se atribuye a la artista un episodio histórico concreto. El de Borges no reproduce el argumento de *La biblioteca de Babel*. La fiesta de Úrsula y la ruta de Don Quijote tampoco se presentan como episodios de las novelas.

## Datos y contrato con el motor

`src/exploration-data.js` exporta `{ worlds: [...] }` mediante CommonJS o `window.SVExplorationData`. No utiliza el DOM, el almacenamiento ni el motor de los puzzles anteriores. El módulo contiene únicamente contenido y posiciones.

```js
{
  worlds: [{
    id, title, subtitle, cover, player, color,
    missions: [{
      id, scene, title,
      goal: { easy, normal },
      targets: [/* identificadores de objetos de esta misión */],
      count,
      objects: [{ id, label, kind, x, y, color }],
      success,
      transition // opcional
    }],
    ending: { title, phrase }
  }]
}
```

`color` en un objeto es opcional. `player` identifica un sprite, no una posición. Los identificadores permanecen estables para permitir la reanudación del progreso.

| Mundo | Sprite `player` | Misiones | Fondos utilizados |
| --- | --- | --- | --- |
| `don_quijote` | `quijote` | `dq1`…`dq6` | `don_quijote`, `frutas`, `refugio` |
| `macondo` | `ursula` | `mac1`…`mac6` | `macondo`, `frutas`, `plaza_cultural` |
| `borges` | `bibliotecario` | `bor1`…`bor6` | `biblioteca_borges`, `noche`, `centro_cultural` |
| `frida` | `frida` | `fri1`…`fri6` | `casa_azul`, `taller_cultural`, `centro_cultural` |

Todos los fondos y las cuatro portadas utilizan identificadores existentes de `contenido.js`. Cada mundo tiene tres fondos distintos. Las ilustraciones aportan ambiente; el nombre corto de la misión indica el lugar de juego actual.

Los tipos de objeto utilizados son: `sancho`, `horse`, `mill`, `door`, `flower`, `paint`, `canvas`, `book`, `star`, `butterfly`, `key`, `bell`, `tree`, `fruit`, `letter`, `bench`, `well` y `lamp`. `lamp` permite mostrar las dos lámparas de `bor2`. Los colores de libros, mariposas, flores y pinturas también aparecen en sus etiquetas; el contenido no los identifica únicamente por el color.

El motor puede tratar todas las interacciones mediante la misma regla:

- Un identificador de `targets` siempre corresponde a un objeto de la misión actual.
- `count` indica cuántos objetivos distintos deben activarse. En las misiones entregadas, se requieren todos los elementos de `targets`.
- Hay entre uno y tres objetivos por misión. El orden de interacción es libre.
- Un objetivo ya activado no se puede contar dos veces.
- Los otros objetos son elementos del escenario y no satisfacen el objetivo.
- No hay condiciones ocultas, comprobaciones de respuestas ni inventario que deba combinarse. La llave, los colores y las provisiones enlazan misiones consecutivas por el relato breve.

La progresión, la proximidad y la validación de partidas corresponden a `exploration-engine.js`. Su clave de almacenamiento es `cuentalo.exploration.v1`, separada de las lecturas narrativas y de los puzzles.

## Colocación y legibilidad

El mundo lógico mide **1000 × 560**. Los objetos se sitúan en el suelo entre `x = 90…910` y `y = 310…490`, con cinco objetos como máximo por misión. La separación mínima exigida entre centros es 130 unidades. En los datos entregados, la menor distancia es aproximadamente **178 unidades**.

El motor permite interactuar a una distancia de hasta 90 unidades. Desde el inicio previsto `{ x: 500, y: 470 }`, la meta más cercana está a unas **149 unidades**: todas las misiones requieren moverse antes de actuar sobre una meta. Las posiciones evitan superponer objetos.

Los límites de texto del contenido son:

| Texto | Límite | Máximo actual |
| --- | --- | --- |
| Subtítulo | 12 palabras | 9 |
| Consigna fácil o normal | 12 palabras | 9 |
| Mensaje de éxito | 7 palabras | 5 |
| Transición | 10 palabras | 9 |

## Comprobaciones

`node --check src/exploration-data.js` verifica la sintaxis. `node test/exploration.js` comprueba el contrato de las 24 misiones y el comportamiento del motor: progreso, proximidad, intentos con objetos ajenos al objetivo, duplicados y reanudación. La validación de datos comprueba además las referencias a fondos, las cantidades, los textos cortos, los identificadores y el espacio entre objetos.

`node test/exploration-motion.js` comprueba los ciclos y la reducción de movimiento; `node test/exploration-stories.js` comprueba la cobertura, las longitudes y las fuentes de los relatos. Las poses, referencias y prompts se documentan en [Animaciones](ART_ANIMACIONES.md).

Para la revisión visual, conviene recorrer un mundo completo con teclado y otro con controles táctiles, activar una misión de tres objetos en distinto orden y comprobar que los nombres y el botón de acción siguen legibles en una pantalla pequeña. La presentación debe reflejar la acción elegida: una lámpara encendida, un objeto encontrado o un cuadro mostrado.
