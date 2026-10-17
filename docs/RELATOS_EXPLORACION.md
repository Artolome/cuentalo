# Relatos breves de exploración

Contenido: `src/exploration-stories.js`. Fuentes consultadas el **16 de octubre de 2026**. Son paráfrasis originales en español accesible; no reproducen citas ni se presentan como una lectura completa de las obras. El vocabulario literario puede necesitar explicación: no se promete un nivel A1 estricto.

## Contrato de contenido

El módulo exporta `{ worlds: { don_quijote, macondo, borges, frida } }` mediante `window.SVExplorationStories` o CommonJS. Cada entrada tiene `title`, `kind`, `intro`, `chapters`, `summary` y `sources`. `kind` distingue `novela`, `cuento` y `vida`.

El prólogo presenta el referente y avisa de que las misiones jugables son inventadas. Los seis fragmentos siguen el orden de la obra o de la biografía; `chapters[0]` acompaña a la misión 1 y `chapters[5]` a la misión 6. Su relación con las misiones es de ritmo de lectura, no de causalidad: recoger flores, encontrar llaves o preparar una fiesta no se atribuye al libro ni a la vida de Frida.

La presentación prevista es un prólogo antes del comienzo, un fragmento tras cada misión y el resumen al terminar. El botón facultativo **Historia** permite consultar el relato. El módulo solo aporta texto; no cambia objetivos, respuestas, movimiento ni guardado.

| Texto | Límite | Contenido actual |
| --- | --- | --- |
| Prólogo | Dos frases, máximo 35 palabras | 26–30 palabras |
| Fragmento | Dos frases, 25–45 palabras; preferencia 25–40 | 29–36 palabras |
| Título de prólogo o fragmento | 3–6 palabras | 4–6 palabras |
| Resumen final | 60–90 palabras | 73–76 palabras |

Se cuentan palabras separadas por espacios. El resumen incluye el desenlace: no se sustituye el final de una novela por la celebración del juego. Los acontecimientos difíciles se nombran brevemente, sin descripción gráfica.

## Don Quijote de la Mancha

Selección cronológica: identidad del caballero, Sancho, molinos, gobierno de Barataria, derrota en Barcelona y regreso final. Las elipsis se explicitan; el episodio de los molinos no conduce directamente a Barcelona. Barataria se llama «lugar», porque no es una isla real, y el engaño de los duques queda identificado.

Fuentes primarias: edición del Centro Virtual Cervantes, [I, 1: Alonso Quijano](https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte1/cap01/default.htm), [I, 7: Sancho](https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte1/cap07/default.htm), [I, 8: molinos](https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte1/cap08/default.htm), [II, 45: Barataria](https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte2/cap45/default.htm), [II, 51: juicio de Sancho](https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte2/cap51/cap51_02.htm), [II, 62: Sancho cuenta que dejó el gobierno](https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte2/cap62/default.htm), [II, 64: derrota y promesa](https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte2/cap64/default.htm), [II, 74: desenlace](https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte2/cap74/cap74_02.htm).

## Cien años de soledad

Recorrido muy abreviado de la novela de Gabriel García Márquez: fundadores, pérdida de memoria, coronel Aureliano, Meme y Mauricio, masacre y lluvia, lectura final de Aureliano Babilonia. Los dos Aurelianos se distinguen por nombre y generación. Las mariposas se asocian a Mauricio, no a un supuesto episodio de recolección de Úrsula.

- Fundación y familia: [fragmento autorizado de Penguin Libros](https://www.penguinlibros.com/es/literatura-contemporanea/36986-libro-cien-anos-de-soledad-edicion-ilustrada-9788439732471/fragmento) y [árbol genealógico del editor](https://www.penguinlibros.com/ar/recomendaciones/lecturas/cien-anos-de-soledad-el-arbol-genealogico-de-los-buendia).
- Memoria y remedio: [Fundación Gabo, proyecto de lectura de La peste del insomnio](https://www.fundaciongabo.org/es/noticias/articulo/la-fundacion-gabo-estrena-el-cortometraje-la-peste-del-insomnio).
- Coronel y taller: [Centro Gabo, los pescaditos de oro](https://centrogabo.org/index.php/gabo/contemos-gabo/de-fuentes-tipograficas-y-otros-pescaditos-de-oro).
- Mauricio: [Centro Gabo, historia de las mariposas amarillas, con testimonio del autor](https://centrogabo.org/gabo/contemos-gabo/la-verdadera-historia-de-las-mariposas-amarillas-de-garcia-marquez).
- Masacre, lluvia y trayectoria: [Centro Gabo, guía sobre la novela](https://centrogabo.org/gabo/hablemos-de-gabo/todo-lo-que-necesitas-saber-sobre-garcia-marquez-y-cien-anos-de-soledad).
- Desenlace: [Centro Gabo, El último de la estirpe](https://centrogabo.org/gabo/contemos-gabo/cien-anos-de-soledad-temporada-2-episodio-final-el-ultimo-de-la-estirpe). Esta página acompaña una adaptación audiovisual: aquí solo se retienen los hechos que identifica con el final de la novela, no el montaje de la serie ni su división en episodios.

## La biblioteca de Babel

Se resume el cuento de Jorge Luis Borges: narrador bibliotecario, salas hexagonales, libros con combinaciones de signos, búsqueda de respuestas, conflictos y conjetura final de repetición. No es una biografía de Borges ni la anterior aventura original del cuaderno. La repetición es una hipótesis del narrador; no se afirma que encuentre una solución definitiva. «Todas las combinaciones» se refiere a los signos dentro del formato de los libros del relato.

Fuentes: [texto del cuento en material docente de la UNAM](https://www.ingenieria.unam.mx/dcsyhfi/material_didactico/Literatura_Hispanoamericana_Contemporanea/Autores_B/BORGES/Babel.pdf), [fragmento primario en el Centro Virtual Cervantes](https://cvc.cervantes.es/actcult/borges/elementos/11a.htm) para las búsquedas y conflictos, y [Biblioteca Nacional de Argentina, El libro absoluto](https://www.bn.gov.ar/agenda-cultural/el-libro-absoluto) para el narrador y las galerías.

## Frida Kahlo

Biografía real: infancia, práctica de pintura y autorretratos, relación con la cultura mexicana, exposiciones, enseñanza y Casa Azul como museo. No se inventan pensamientos, conversaciones ni un efecto curativo de la pintura. La exposición del juego no pretende reconstruir la de 1953. Se omite el año exacto del comienzo de la docencia porque la cronología web y algunos textos del museo presentan una diferencia entre 1942 y 1943.

Fuentes del Museo Frida Kahlo: [cronología](https://www.museofridakahlo.org.mx/frida/) para las fechas de infancia y exposiciones; [biografías institucionales](https://www.museofridakahlo.org.mx/wp/wp-content/uploads/2022/08/Biografias-Frida-Kahlo.pdf), especialmente pp. 1–3 y 10–12, para cultura mexicana, enseñanza y exposición en México; [historia de la Casa Azul](https://www.museofridakahlo.org.mx/museo/) para el espejo y la apertura del museo en julio de 1958. La cronología documenta el primer autorretrato en 1926 y Las dos Fridas en 1939.

## Verificación

Ejecutar `node test/exploration-stories.js`. Comprueba los cuatro IDs frente a los mundos jugables, seis fragmentos por mundo y su correspondencia con las misiones, clases de relato, frases y límites de palabras, fuentes HTTPS institucionales y los mismos datos en CommonJS y en el navegador. No abre un navegador ni modifica partidas.

La revisión de exactitud es editorial; el test no pretende demostrar hechos históricos. Durante la consulta algunas páginas del CVC redirigían temporalmente a mantenimiento y el PDF de la UNAM no se abrió mediante el lector web; se contrastó también el texto oficial indexado por el buscador, conservando los enlaces originales.
