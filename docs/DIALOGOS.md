# Diálogos orales del juego

Los 24 intercambios de `src/exploration-dialogues.js` están **inventados para el juego**. No son citas de Cervantes, García Márquez o Borges, ni palabras históricas de Frida Kahlo. La vecina de Macondo y los visitantes son personajes añadidos. Las voces interpretan personajes de esta aventura; no imitan la voz real de ningún autor o artista.

Los diálogos acompañan la misión que acaba de completarse y preparan, cuando corresponde, el siguiente paso. Se mantienen separados de los fragmentos de `exploration-stories.js`, que resumen las obras y la biografía. Por ejemplo, la fiesta de Úrsula pertenece al juego, no al desenlace de la novela; la exposición jugable de Frida no reconstruye una exposición histórica.

## Textos y contrato

Cada mundo conserva sus seis misiones y tiene dos locutores, un héroe y un compañero. Después de cada misión hay exactamente dos réplicas, primero el héroe y después el compañero. Cada una contiene entre 3 y 10 palabras, sin traducción, instrucciones técnicas ni respuesta que el alumno deba elegir. El registro es oral, contemporáneo y sencillo; no se intenta reproducir el español del siglo XVII.

```js
{
  worlds: {
    don_quijote: {
      speakers: {
        quijote: { name: 'Don Quijote', role: 'hero' },
        sancho: { name: 'Sancho', role: 'companion' }
      },
      chapters: [
        [
          { speaker: 'quijote', text: 'Sancho, ¿vienes conmigo a buscar aventuras?' },
          { speaker: 'sancho', text: '¡Claro! Pero primero busquemos a Rocinante.' }
        ]
        // Otros cinco intercambios, en el orden de las misiones.
      ]
    }
    // macondo, borges, frida
  }
}
```

Exportación: `window.SVExplorationDialogues` en el navegador y `module.exports` en Node. `chapters[0]` corresponde a la primera misión; `chapters[5]`, a la última. Los IDs `visitante` de Borges y Frida pertenecen a mundos distintos y no identifican a la misma persona.

| Mundo | Héroe | Compañero |
| --- | --- | --- |
| `don_quijote` | `quijote` · Don Quijote | `sancho` · Sancho |
| `macondo` | `ursula` · Úrsula | `vecina` · Vecina de Macondo, inventada |
| `borges` | `bibliotecario` · Bibliotecario del juego | `visitante` · Visitante inventado |
| `frida` | `frida` · Frida como personaje del juego | `visitante` · Visitante del taller, inventado |

## Dirección de las voces

Se propone elegir dos voces claramente distinguibles por mundo, con pronunciación natural, pausas breves y velocidad moderada. No hace falta exagerar el acento ni separar artificialmente las sílabas. Las siguientes variantes son una dirección de interpretación, no una afirmación de cómo hablaba cada personaje histórico o literario. Tampoco representan todas las maneras de hablar de un país.

| Mundo | Variante propuesta | Interpretación |
| --- | --- | --- |
| Don Quijote | Español de España, `es-ES` | Don Quijote con curiosidad y energía; Sancho cercano y tranquilo. Tuteo claro, sin solemnidad ni arcaísmos. |
| Macondo | Español colombiano, `es-CO` | Úrsula cálida y decidida; vecina conversadora. Tuteo, sin regionalismos que dificulten la comprensión. No se pretende reconstruir un acento único de Macondo. |
| Borges | Español argentino rioplatense, `es-AR` | Bibliotecario pausado; visitante curioso. Las formas **pasá** y **mirá** conservan su acento escrito y su acentuación oral; pertenecen al voseo. |
| Frida | Español mexicano, `es-MX` | Frida directa y expresiva; visitante amable. Son voces de una escena ficticia, sin imitación biográfica. |

Los códigos de idioma pueden orientar la selección, pero el resultado debe escucharse: una etiqueta regional no garantiza por sí sola un acento convincente. Elegir una voz que pronuncie naturalmente los nombres, preguntas y exclamaciones, y mantener la misma voz por personaje. Si no hay una variante regional disponible, usar una voz española inteligible sin anunciarla como reproducción de ese acento. Esta propuesta no depende de un proveedor de audio.

Pronunciaciones a revisar: **Úrsula**, **Rocinante**, **Quijote**, **lámparas**, **exposición**, **buscábamos**, **pasá** y **mirá**. Las pausas entre turnos deben permitir reconocer el cambio de locutor. No leer el nombre del personaje como parte de su réplica.

## Comprobaciones

`node test/exploration-dialogues.js` verifica los cuatro mundos frente a las misiones y los relatos existentes, seis intercambios por mundo, dos locutores y dos turnos conocidos por intercambio, longitud de 3–10 palabras, puntuación española y equivalencia de los exports CommonJS/navegador. El conteo usa palabras separadas por espacios.

La prueba de datos no evalúa el acento de una grabación. La revisión de audio debe comprobar las 48 réplicas, los dos timbres y la pronunciación de las palabras indicadas. Fecha de redacción: **17 de octubre de 2026**.
