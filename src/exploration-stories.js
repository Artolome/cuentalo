/* Cuéntalo — relatos breves de las obras y de una vida real.
 * Las misiones del juego son inventadas; estos textos no narran esas misiones.
 * chapters[0..5] acompaña, en orden, las seis misiones de cada mundo.
 * Paráfrasis originales. Fuentes y criterios: docs/RELATOS_EXPLORACION.md.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVExplorationStories = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return { worlds: {
    don_quijote: {
      title: 'Don Quijote de la Mancha', kind: 'novela',
      intro: {
        title: 'Un libro y un juego',
        text: 'Don Quijote de la Mancha es una novela de Miguel de Cervantes. El viaje que juegas es inventado; estos fragmentos cuentan algunos momentos del libro, incluido su final.'
      },
      chapters: [
        {
          title: 'Un nombre de caballero',
          text: 'Alonso Quijano lee tantos libros de caballerías que decide convertirse en caballero y llamarse Don Quijote. Sale de su pueblo para buscar aventuras y ayudar a quienes tienen problemas.'
        },
        {
          title: 'Dos compañeros de camino',
          text: 'Sancho Panza, un campesino vecino, acepta acompañar a Don Quijote como escudero, es decir, como ayudante. Don Quijote monta a Rocinante y Sancho viaja en un burro por los caminos.'
        },
        {
          title: 'Gigantes junto al camino',
          text: 'Don Quijote ve unos molinos de viento, cree que son gigantes y se lanza contra ellos. Sancho intenta avisarle, pero una aspa derriba al caballero y su compañero lo ayuda.'
        },
        {
          title: 'Sancho prueba a gobernar',
          text: 'Mucho después, unos duques organizan una burla y nombran a Sancho gobernador de un lugar llamado Barataria. Sancho resuelve problemas con buen juicio, pero acaba dejando el cargo y vuelve con Don Quijote.'
        },
        {
          title: 'La promesa del regreso',
          text: 'Tras muchas otras aventuras, Don Quijote llega a Barcelona y pierde un combate contra el Caballero de la Blanca Luna. Como había prometido, debe regresar a su pueblo y dejar las aventuras durante un año.'
        },
        {
          title: 'Alonso Quijano en casa',
          text: 'De vuelta en casa, Don Quijote enferma y comprende que las aventuras de sus libros no eran reales. Recupera el nombre de Alonso Quijano y muere acompañado por personas que lo quieren, entre ellas Sancho.'
        }
      ],
      summary: 'Alonso Quijano lee libros de caballerías y decide ser Don Quijote, un caballero que quiere ayudar a otros. Viaja con Sancho Panza y confunde molinos con gigantes. Más adelante, Sancho gobierna Barataria durante una burla de unos duques, pero abandona el cargo. Tras muchas aventuras, Don Quijote pierde un combate en Barcelona y cumple su promesa de volver a casa. Allí enferma, reconoce sus errores y muere como Alonso Quijano, junto a sus seres queridos.',
      sources: [
        { label: 'Cervantes · Don Quijote, I, 1', url: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte1/cap01/default.htm' },
        { label: 'Cervantes · Don Quijote, I, 7', url: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte1/cap07/default.htm' },
        { label: 'Cervantes · Don Quijote, I, 8', url: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte1/cap08/default.htm' },
        { label: 'Cervantes · Don Quijote, II, 45', url: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte2/cap45/default.htm' },
        { label: 'Cervantes · Don Quijote, II, 62', url: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte2/cap62/default.htm' },
        { label: 'Cervantes · Don Quijote, II, 64', url: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte2/cap64/default.htm' },
        { label: 'Cervantes · Don Quijote, II, 74', url: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte2/cap74/cap74_02.htm' }
      ]
    },
    macondo: {
      title: 'Cien años de soledad', kind: 'novela',
      intro: {
        title: 'Una familia en una novela',
        text: 'Cien años de soledad, de Gabriel García Márquez, cuenta varias generaciones de los Buendía en Macondo. La fiesta que juegas es inventada; estos fragmentos resumen la novela, incluido su final.'
      },
      chapters: [
        {
          title: 'El comienzo de Macondo',
          text: 'José Arcadio Buendía y Úrsula Iguarán fundan Macondo, donde empieza la historia de su familia. El viajero Melquíades visita el pueblo y muestra objetos nuevos que despiertan la curiosidad de José Arcadio.'
        },
        {
          title: 'Los nombres se olvidan',
          text: 'Una enfermedad impide dormir a los habitantes y después les hace perder la memoria, incluso los nombres de las cosas. Ponen etiquetas a los objetos, hasta que Melquíades trae un remedio que devuelve los recuerdos.'
        },
        {
          title: 'El coronel y sus peces',
          text: 'Aureliano, hijo de los fundadores, se convierte en coronel y participa en muchas guerras que cambian su vida. Más tarde vuelve a su taller de Macondo, donde fabrica pequeños peces de oro.'
        },
        {
          title: 'Las mariposas de Mauricio',
          text: 'En otra generación, Meme Buendía y Mauricio Babilonia se enamoran; unas mariposas amarillas acompañan a Mauricio. Su hijo, Aureliano Babilonia, crecerá en la casa de los Buendía y será importante en el final.'
        },
        {
          title: 'La memoria del pueblo',
          text: 'Una compañía bananera cambia Macondo, y una protesta de sus trabajadores termina en una masacre. José Arcadio Segundo sobrevive, pero otros niegan lo ocurrido; después, años de lluvia dejan el pueblo en ruinas.'
        },
        {
          title: 'La última lectura de Aureliano',
          text: 'Al final, Aureliano Babilonia logra leer los antiguos escritos de Melquíades y descubre que cuentan la historia de su familia. Cuando la lectura alcanza su propio presente, un gran viento destruye Macondo y termina la novela.'
        }
      ],
      summary: 'José Arcadio Buendía y Úrsula fundan Macondo, el pueblo imaginario de su familia. Sus descendientes viven amores, guerras y olvidos, mientras se repiten nombres y errores. El coronel Aureliano acaba haciendo peces de oro; generaciones después, Meme y Mauricio tienen a Aureliano Babilonia. Una compañía bananera, una masacre y años de lluvia transforman el pueblo. Aureliano Babilonia descifra los escritos de Melquíades y descubre la historia familiar, justo cuando un viento destruye Macondo.',
      sources: [
        { label: 'Penguin Libros · Fragmento autorizado de la novela', url: 'https://www.penguinlibros.com/es/literatura-contemporanea/36986-libro-cien-anos-de-soledad-edicion-ilustrada-9788439732471/fragmento' },
        { label: 'Penguin Libros · Árbol de los Buendía', url: 'https://www.penguinlibros.com/ar/recomendaciones/lecturas/cien-anos-de-soledad-el-arbol-genealogico-de-los-buendia' },
        { label: 'Fundación Gabo · La peste del insomnio', url: 'https://www.fundaciongabo.org/es/noticias/articulo/la-fundacion-gabo-estrena-el-cortometraje-la-peste-del-insomnio' },
        { label: 'Centro Gabo · Los pescaditos de oro', url: 'https://centrogabo.org/index.php/gabo/contemos-gabo/de-fuentes-tipograficas-y-otros-pescaditos-de-oro' },
        { label: 'Centro Gabo · Las mariposas amarillas', url: 'https://centrogabo.org/gabo/contemos-gabo/la-verdadera-historia-de-las-mariposas-amarillas-de-garcia-marquez' },
        { label: 'Centro Gabo · Sobre Cien años de soledad', url: 'https://centrogabo.org/gabo/hablemos-de-gabo/todo-lo-que-necesitas-saber-sobre-garcia-marquez-y-cien-anos-de-soledad' },
        { label: 'Centro Gabo · El último de la estirpe', url: 'https://centrogabo.org/gabo/contemos-gabo/cien-anos-de-soledad-temporada-2-episodio-final-el-ultimo-de-la-estirpe' }
      ]
    },
    borges: {
      title: 'La biblioteca de Babel', kind: 'cuento',
      intro: {
        title: 'Un cuento y su biblioteca',
        text: 'La biblioteca de Babel es un cuento de Jorge Luis Borges. Las misiones de luces y llaves son inventadas; estos fragmentos presentan la biblioteca y las búsquedas del relato original.'
      },
      chapters: [
        {
          title: 'Un mundo entre libros',
          text: 'Un bibliotecario cuenta su vida en una biblioteca enorme, formada por salas de seis lados, pasillos y escaleras. Ha viajado por muchas salas buscando libros, pero no conoce los límites de ese mundo.'
        },
        {
          title: 'Páginas difíciles de entender',
          text: 'Los libros tienen el mismo formato y usan un pequeño conjunto de letras y otros signos. Casi todas las páginas que encuentran los lectores parecen mezclas sin sentido, difíciles de comprender.'
        },
        {
          title: 'Todas las combinaciones posibles',
          text: 'Alguien descubre que la Biblioteca contiene todas las combinaciones posibles de esos signos en sus libros. Por eso hay textos verdaderos y falsos, respuestas y errores, entre una enorme cantidad de páginas incomprensibles.'
        },
        {
          title: 'En busca de respuestas',
          text: 'Al saberlo, muchas personas esperan encontrar un libro que explique su propia vida y anuncie su futuro. Algunas abandonan las salas donde viven y recorren la Biblioteca en busca de esas respuestas.'
        },
        {
          title: 'Una búsqueda entre conflictos',
          text: 'La búsqueda se vuelve difícil, porque hay muchísimos libros y nadie sabe dónde encontrar las respuestas que necesita. Surgen peleas, y algunas personas llegan a destruir libros que consideran inútiles.'
        },
        {
          title: 'Una esperanza de orden',
          text: 'Al final, el narrador imagina que, al viajar sin límite, los mismos libros podrían volver a aparecer. Esa posible repetición le permite esperar un orden, aunque no haya encontrado una explicación completa.'
        }
      ],
      summary: 'Un bibliotecario describe un mundo de salas llenas de libros. Todos usan los mismos signos, combinados de todas las maneras posibles: allí están las respuestas, pero también los errores y las páginas incomprensibles. Los habitantes buscan libros que expliquen sus vidas; esa búsqueda provoca esperanzas y conflictos, sin una solución segura. Al final, el narrador imagina una biblioteca sin límite donde los libros se repiten, y encuentra en esa posibilidad una esperanza de orden.',
      sources: [
        { label: 'Borges · Texto del cuento, material de la UNAM', url: 'https://www.ingenieria.unam.mx/dcsyhfi/material_didactico/Literatura_Hispanoamericana_Contemporanea/Autores_B/BORGES/Babel.pdf' },
        { label: 'Centro Virtual Cervantes · Fragmento de La biblioteca de Babel', url: 'https://cvc.cervantes.es/actcult/borges/elementos/11a.htm' },
        { label: 'Biblioteca Nacional de Argentina · El libro absoluto', url: 'https://www.bn.gov.ar/agenda-cultural/el-libro-absoluto' }
      ]
    },
    frida: {
      title: 'Frida Kahlo: vida y pintura', kind: 'vida',
      intro: {
        title: 'Una artista de verdad',
        text: 'Frida Kahlo fue una pintora mexicana y una persona real. Las flores y la exposición del juego son inventadas; aquí descubrirás algunos hechos de su vida.'
      },
      chapters: [
        {
          title: 'Crecer en la Casa Azul',
          text: 'Frida Kahlo nace en 1907 en Coyoacán, en la casa que hoy conocemos como Casa Azul. Su padre es fotógrafo y, en 1922, ella entra en la Escuela Nacional Preparatoria.'
        },
        {
          title: 'Un espejo para pintar',
          text: 'En 1925, Frida sufre un grave accidente de autobús y pasa mucho tiempo recuperándose en casa. Durante ese periodo pinta con ayuda de un espejo y realiza su primer autorretrato en 1926.'
        },
        {
          title: 'Pintar con raíces mexicanas',
          text: 'En 1929, Frida se casa con el pintor Diego Rivera y continúa desarrollando su propia obra. La ropa que pinta en sus autorretratos refleja su interés por el arte popular y la cultura de México.'
        },
        {
          title: 'Sus cuadros cruzan fronteras',
          text: 'En 1938, Frida presenta su primera exposición individual en Nueva York, donde el público puede conocer sus cuadros. Al año siguiente, participa en una exposición en París y pinta Las dos Fridas.'
        },
        {
          title: 'Enseñar y compartir su obra',
          text: 'Frida enseña en La Esmeralda y continúa algunas clases en la Casa Azul con el grupo llamado Los Fridos. En 1953, Lola Álvarez Bravo organiza su exposición individual en México.'
        },
        {
          title: 'Una casa para recordar',
          text: 'Frida muere el 13 de julio de 1954, a los cuarenta y siete años, en la Casa Azul. En 1958, la casa abre como museo para conservar y compartir su obra y su historia.'
        }
      ],
      summary: 'Frida Kahlo nace en Coyoacán en 1907 y estudia en la Escuela Nacional Preparatoria. Después de un accidente de autobús, dedica más tiempo a pintar y crea autorretratos. Se casa con Diego Rivera y desarrolla una obra propia, relacionada con la cultura mexicana. Expone en Nueva York, París y México, y enseña a jóvenes artistas. Muere en 1954; cuatro años después, la Casa Azul abre como museo para dar a conocer su vida y su pintura.',
      sources: [
        { label: 'Museo Frida Kahlo · Cronología de Frida', url: 'https://www.museofridakahlo.org.mx/frida/' },
        { label: 'Museo Frida Kahlo · Biografías', url: 'https://www.museofridakahlo.org.mx/wp/wp-content/uploads/2022/08/Biografias-Frida-Kahlo.pdf' },
        { label: 'Museo Frida Kahlo · Historia del museo', url: 'https://www.museofridakahlo.org.mx/museo/' }
      ]
    }
  } };
});
