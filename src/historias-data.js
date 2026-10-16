/* Cuéntalo — cuatro lecturas originales para una biblioteca narrativa.
 * Adaptaciones resumidas, ficción inspirada y biografía se identifican por separado.
 * Los dos caminos de cada capítulo son válidos y vuelven al mismo relato.
 * Fuentes, alcance y criterios editoriales: ../HISTORIAS.md.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVHistoriasData = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return { stories: [
    {
      id: 'don_quijote',
      title: 'Don Quijote y Sancho: el viaje y el regreso',
      subtitle: 'Una selección de aventuras de Don Quijote de la Mancha',
      author: 'Miguel de Cervantes',
      country: 'España',
      kind: 'adaptacion',
      description: 'Adaptación muy abreviada, con palabras nuevas, de algunos episodios de la novela. Acompaña a Don Quijote y Sancho desde los caminos de La Mancha hasta el regreso a casa. Incluye el final de la obra.',
      cover: 'don_quijote',
      color: '#c78335',
      characters: [
        { name: 'Don Quijote / Alonso Quijano', role: 'Un lector que decide vivir como caballero' },
        { name: 'Sancho Panza', role: 'Su escudero y compañero de viaje' },
        { name: 'Rocinante', role: 'El caballo de Don Quijote' },
        { name: 'Caballero de la Blanca Luna', role: 'El caballero que cambia el rumbo del viaje' }
      ],
      sources: [
        { label: 'Instituto Cervantes · Primera parte, capítulo 1', url: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte1/cap01/default.htm' },
        { label: 'Instituto Cervantes · Primera parte, capítulo 7', url: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte1/cap07/default.htm' },
        { label: 'Instituto Cervantes · Primera parte, capítulo 8', url: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte1/cap08/default.htm' },
        { label: 'Instituto Cervantes · Segunda parte, capítulo 64', url: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte2/cap64/default.htm' },
        { label: 'Instituto Cervantes · Segunda parte, capítulo 64, continuación', url: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte2/cap64/cap64_02.htm' },
        { label: 'Instituto Cervantes · Segunda parte, capítulo 74', url: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte2/cap74/default.htm' },
        { label: 'Instituto Cervantes · Segunda parte, capítulo 74, final', url: 'https://cvc.cervantes.es/literatura/clasicos/quijote/edicion/parte2/cap74/cap74_02.htm' }
      ],
      chapters: [
        {
          id: 'dq1', title: 'Un lector sale al camino', place: 'La Mancha', scene: 'don_quijote',
          paragraphs: [
            'En un pueblo de La Mancha vive un hombre que lee muchas historias de caballeros. Quiere vivir aventuras como las de sus libros y ayudar a quienes lo necesitan. Prepara unas armas antiguas, llama Rocinante a su caballo y elige un nombre nuevo: Don Quijote de la Mancha.',
            'Después de una primera salida, busca un compañero. Sancho Panza, un vecino que trabaja en el campo, acepta acompañarlo como escudero. Don Quijote le promete grandes recompensas. Sancho lleva su burro y provisiones para el viaje. Los dos salen juntos: uno piensa en hazañas; el otro también se preocupa por comer y descansar.'
          ],
          prompt: '¿A quién quieres seguir de cerca al comenzar el viaje?',
          choices: [
            { id: 'a', label: 'A Don Quijote y sus planes', response: 'Sigues al caballero y observas cómo los libros cambian su manera de mirar el camino. Su deseo de ayudar parece importante, pero todavía no sabe qué encontrará fuera de casa.' },
            { id: 'b', label: 'A Sancho y sus preparativos', response: 'Sigues a Sancho y prestas atención al burro y las provisiones. Una aventura también necesita comida, descanso y compañía. Su mirada te ayudará a comparar los sueños con lo que ocurre.' }
          ],
          closing: 'Un día, los dos viajeros ven unas figuras altas en medio del campo.'
        },
        {
          id: 'dq2', title: '¿Gigantes o molinos?', place: 'Un campo de La Mancha', scene: 'don_quijote',
          paragraphs: [
            'Delante de Don Quijote y Sancho hay varios molinos de viento. Sus grandes aspas se mueven sobre el campo. Don Quijote cree que son gigantes con brazos enormes. Se prepara para enfrentarse a ellos. Sancho intenta explicarle que sirven para moler grano: el viento mueve las aspas y hace trabajar el molino.',
            'Don Quijote no acepta la explicación. Para él, la aventura está clara y debe actuar enseguida. Sancho insiste y lo llama, pero el caballero avanza sobre Rocinante. Los dos miran el mismo paisaje y ven cosas diferentes. El viento sigue soplando mientras la distancia entre el caballo y las aspas se hace menor.'
          ],
          prompt: 'Antes del encuentro, ¿en qué detalle te fijas?',
          choices: [
            { id: 'a', label: 'En las aspas que se mueven', response: 'Miras las aspas y relacionas su movimiento con el viento. Así comprendes la explicación de Sancho. El molino no decide atacar: es Don Quijote quien se acerca demasiado a él.' },
            { id: 'b', label: 'En el aviso de Sancho', response: 'Escuchas el aviso del escudero. Sancho intenta detener a su compañero porque reconoce los molinos. Puedes comprender su preocupación aunque Don Quijote, convencido de su aventura, no quiera escucharlo todavía.' }
          ],
          closing: 'Don Quijote llega al molino antes de cambiar de idea.'
        },
        {
          id: 'dq3', title: 'Después de la caída', place: 'Junto a los molinos', scene: 'don_quijote',
          paragraphs: [
            'La lanza de Don Quijote choca con un aspa. El viento la mueve con fuerza y el caballero cae con Rocinante. Sancho corre para ayudarlo. No hay ningún gigante en el campo, pero sí un compañero en el suelo. Ahora el viaje debe detenerse: primero hay que levantarse y comprobar cómo seguir.',
            'Don Quijote explica la derrota con un encantamiento: cree que un enemigo ha convertido los gigantes en molinos. Sancho sigue viendo molinos. La caída no termina su desacuerdo ni su viaje. Aunque no entienden el mundo de la misma manera, Sancho se acerca cuando su compañero necesita ayuda y lo acompaña después del golpe.'
          ],
          prompt: '¿Qué parte de esta escena quieres recordar?',
          choices: [
            { id: 'a', label: 'La ayuda después de la caída', response: 'Te quedas con la llegada de Sancho. No necesita estar de acuerdo con la explicación de Don Quijote para ayudarlo. Puedes contar esta escena como un momento de cuidado entre compañeros.' },
            { id: 'b', label: 'Las dos explicaciones', response: 'Comparas el encantamiento que imagina Don Quijote con el molino que reconoce Sancho. No tienen la misma explicación. La diferencia te invita a buscar detalles antes de aceptar una historia.' }
          ],
          closing: 'Pasan muchas otras aventuras, que esta adaptación omite. Más adelante, el viaje los lleva a Barcelona.'
        },
        {
          id: 'dq4', title: 'Una promesa en Barcelona', place: 'La playa de Barcelona', scene: 'don_quijote',
          paragraphs: [
            'En Barcelona, Don Quijote encuentra al Caballero de la Blanca Luna. Este le propone un desafío con una condición: si Don Quijote pierde, debe regresar a su pueblo y dejar las aventuras de caballero durante un año. Don Quijote acepta. El encuentro termina con su derrota, y la promesa cambia el rumbo del viaje.',
            'Sancho está allí y ve a su compañero vencido. Ya no pueden continuar buscando aventuras como antes. Ahora el camino conduce de vuelta a casa. Don Quijote había salido con grandes planes y regresa después de una derrota. Debe cumplir la promesa que ha aceptado. Sancho sigue a su lado en esta nueva parte del viaje.'
          ],
          prompt: '¿Cómo quieres mirar este cambio del viaje?',
          choices: [
            { id: 'a', label: 'Pensar en la promesa', response: 'Te fijas en la condición aceptada antes del encuentro. La derrota tiene una consecuencia concreta: regresar y descansar de las aventuras. La historia continúa con ese acuerdo, aunque resulte difícil cumplirlo.' },
            { id: 'b', label: 'Mirar el regreso con Sancho', response: 'Sigues a Sancho y piensas en acompañar a alguien cuando sus planes cambian. El regreso ya forma parte de la aventura. Puedes imaginar el camino sin añadir otra victoria a la novela.' }
          ],
          closing: 'Don Quijote y Sancho regresan a su pueblo. Allí llega la última parte de esta selección.'
        },
        {
          id: 'dq5', title: 'Alonso Quijano, en casa', place: 'La casa de Alonso Quijano', scene: 'don_quijote',
          paragraphs: [
            'Ya en casa, Don Quijote enferma. Sus amigos y su familia lo acompañan, y Sancho permanece cerca. Después de dormir, el protagonista reconoce que las aventuras de sus libros lo han confundido. Recupera el juicio y vuelve a presentarse como Alonso Quijano. Ya no quiere continuar la vida de caballero que había elegido.',
            'Sancho siente tristeza e intenta animar a su compañero. Le gustaría que todavía pudieran salir juntos, pero Alonso Quijano se prepara para el final de su vida. Reconoce la fidelidad de su escudero y después muere. El largo viaje termina en casa, junto a quienes lo conocen, con Sancho cerca del hombre al que ha acompañado.'
          ],
          prompt: '¿Desde qué recuerdo quieres cerrar la lectura?',
          choices: [
            { id: 'a', label: 'Desde el primer nombre elegido', response: 'Vuelves al comienzo, cuando el lector de novelas se llamó Don Quijote. Comparas ese nombre con Alonso Quijano al final. Tu lectura puede hablar de los sueños y de reconocer los propios errores.' },
            { id: 'b', label: 'Desde la compañía de Sancho', response: 'Recuerdas a Sancho junto al molino y junto a la cama. Sus desacuerdos no borran la compañía. Puedes terminar tu relato explicando qué gesto de ayuda te parece más significativo.' }
          ],
          closing: 'El viaje de esta adaptación termina aquí. La novela contiene muchas más aventuras y voces.'
        }
      ],
      ending: {
        title: 'Un camino para recordar',
        paragraphs: [
          'Has seguido una selección de episodios: la salida, los molinos, la ayuda de Sancho, la derrota y el regreso. Has elegido qué observar; los acontecimientos principales conservan su lugar en la novela.',
          'Puedes volver a leer con otra mirada y comparar tus elecciones. Esta adaptación es una puerta de entrada a la obra de Cervantes, no un resumen de todos sus personajes y aventuras.'
        ],
        question: '¿Qué aprende el lector al escuchar tanto a Don Quijote como a Sancho?'
      }
    },
    {
      id: 'macondo',
      title: 'Los Buendía: una memoria de Macondo',
      subtitle: 'Un recorrido muy abreviado por Cien años de soledad',
      author: 'Gabriel García Márquez',
      country: 'Colombia',
      kind: 'adaptacion',
      description: 'Resumen narrativo original y muy abreviado de la novela, sin citas. Cinco momentos de la familia Buendía, desde la fundación de Macondo hasta su final. Macondo y los personajes pertenecen a la ficción; se omiten muchas tramas.',
      cover: 'macondo',
      color: '#598b48',
      characters: [
        { name: 'José Arcadio Buendía', role: 'Fundador de Macondo y padre de la primera familia' },
        { name: 'Úrsula Iguarán', role: 'Fundadora y figura central de varias generaciones' },
        { name: 'Melquíades', role: 'Viajero relacionado con la memoria y unos manuscritos' },
        { name: 'Rebeca', role: 'Una niña que llega a vivir con los Buendía' },
        { name: 'Coronel Aureliano Buendía', role: 'Hijo de los fundadores, marcado por las guerras' },
        { name: 'José Arcadio Segundo', role: 'Descendiente de la familia y testigo de una masacre' },
        { name: 'Aureliano Babilonia', role: 'Descendiente que lee los manuscritos al final' },
        { name: 'Amaranta Úrsula', role: 'Una de las últimas integrantes de la familia' }
      ],
      sources: [
        { label: 'Penguin Libros · Fragmento autorizado de la novela', url: 'https://www.penguinlibros.com/es/literatura-contemporanea/36986-libro-cien-anos-de-soledad-edicion-ilustrada-9788439732471/fragmento' },
        { label: 'Penguin Libros · Árbol genealógico de los Buendía', url: 'https://www.penguinlibros.com/ar/recomendaciones/lecturas/cien-anos-de-soledad-el-arbol-genealogico-de-los-buendia' },
        { label: 'Centro Gabo · El Macondo de Gabriel García Márquez', url: 'https://centrogabo.org/especiales/gabriel-garcia-marquez/donde/macondo-de-gabriel-garcia-marquez' },
        { label: 'Fundación Gabo · La peste del insomnio', url: 'https://www.fundaciongabo.org/es/noticias/articulo/la-fundacion-gabo-estrena-el-cortometraje-la-peste-del-insomnio' },
        { label: 'Centro Gabo · El coronel y los pescaditos de oro', url: 'https://centrogabo.org/index.php/gabo/contemos-gabo/de-fuentes-tipograficas-y-otros-pescaditos-de-oro' },
        { label: 'Centro Gabo · Claves de Cien años de soledad', url: 'https://centrogabo.org/gabo/hablemos-de-gabo/todo-lo-que-necesitas-saber-sobre-garcia-marquez-y-cien-anos-de-soledad' },
        { label: 'Centro Gabo · El final de la familia y de Macondo', url: 'https://centrogabo.org/gabo/contemos-gabo/cien-anos-de-soledad-temporada-2-episodio-final-el-ultimo-de-la-estirpe' }
      ],
      chapters: [
        {
          id: 'mac1', title: 'Una familia funda un pueblo', place: 'Macondo, un pueblo ficticio', scene: 'macondo',
          paragraphs: [
            'José Arcadio Buendía y Úrsula Iguarán forman una familia y participan en la fundación de Macondo. Al principio, el pueblo es pequeño y está junto a un río. Sus hijos se llaman José Arcadio, Aureliano y Amaranta. La casa familiar será un lugar importante para ellos y para muchas generaciones que llegarán después.',
            'El viajero Melquíades trae objetos y conocimientos que despiertan la curiosidad de José Arcadio Buendía. Úrsula trabaja para sostener la vida de la casa. Las novedades que llegan de fuera conviven con las tareas de cada día. Entre los descubrimientos del fundador y el trabajo de Úrsula, la familia crece y el pequeño pueblo comienza a cambiar.'
          ],
          prompt: '¿Qué hilo quieres seguir para conocer a la familia?',
          choices: [
            { id: 'a', label: 'Los nombres de los Buendía', response: 'Distingues al padre José Arcadio Buendía de su hijo José Arcadio. Anotar los nombres puede ayudarte: algunos vuelven en generaciones posteriores, pero no siempre nombran a la misma persona de la familia.' },
            { id: 'b', label: 'La casa y sus habitantes', response: 'Eliges la casa como punto de referencia. Allí se cruzan distintas edades y experiencias. Al continuar, podrás observar quién llega, quién se marcha y cómo cambia ese espacio con el tiempo.' }
          ],
          closing: 'La llegada de Rebeca y una extraña enfermedad ponen a prueba la memoria del pueblo.'
        },
        {
          id: 'mac2', title: 'Cuando los nombres se olvidan', place: 'Las casas de Macondo', scene: 'macondo',
          paragraphs: [
            'Rebeca, una niña, llega a vivir con los Buendía. Una enfermedad se extiende por Macondo: las personas dejan de dormir y después empiezan a perder la memoria. Pueden mirar un objeto y olvidar su nombre. También pueden olvidar para qué sirve. Las tareas más sencillas se vuelven difíciles.',
            'Los habitantes intentan conservar sus recuerdos con palabras escritas. Ponen nombres y explicaciones en los objetos. Una etiqueta ayuda, pero necesita un lector que todavía comprenda su significado. Más tarde, Melquíades trae un remedio y la memoria regresa. Los objetos vuelven a tener un nombre conocido, y las personas reconocen de nuevo el mundo que las rodea.'
          ],
          prompt: '¿Cómo quieres explorar el problema de la memoria?',
          choices: [
            { id: 'a', label: 'Mirar los nombres escritos', response: 'Te fijas en la relación entre un objeto y su nombre. Una palabra escrita ayuda a reconocerlo. Sin embargo, conservar letras no basta si también se pierde el significado de esas letras.' },
            { id: 'b', label: 'Pensar para qué sirve un objeto', response: 'Imaginas una explicación sencilla junto a un nombre: qué hace el objeto y cómo se usa. Así distingues dos recuerdos diferentes, reconocer una cosa y comprender su lugar en la vida diaria.' }
          ],
          closing: 'La memoria vuelve, pero el tiempo continúa. Los hijos crecen y las guerras llegan a la historia familiar.'
        },
        {
          id: 'mac3', title: 'El coronel y la casa', place: 'Macondo y los caminos de la guerra', scene: 'macondo',
          paragraphs: [
            'Aureliano, el hijo de los fundadores, se convierte en el coronel Aureliano Buendía. Participa en muchas guerras. Los conflictos de todo un país entran en la historia de la familia. Las campañas lo llevan lejos de Macondo y, con los años, también crece la distancia entre él y la vida de los demás.',
            'Más tarde, el coronel vuelve a fabricar pequeños peces de oro en su taller. Úrsula sigue siendo una presencia central en la casa mientras aparecen nuevas generaciones. Ve crecer a los descendientes de la familia. Los nombres Aureliano y José Arcadio vuelven a repetirse: otros niños los reciben y comienzan vidas distintas entre las mismas paredes.'
          ],
          prompt: '¿Qué contraste quieres observar en este capítulo?',
          choices: [
            { id: 'a', label: 'La guerra y el trabajo del taller', response: 'Comparas los grandes conflictos con una tarea pequeña y repetida. Los peces de oro permiten mirar otra parte de la vida del coronel, más allá de sus campañas y de su nombre público.' },
            { id: 'b', label: 'El paso de las generaciones', response: 'Sigues el hilo de Úrsula y de la casa. Los niños crecen y llegan nuevos familiares. Esta mirada te ayuda a entender que la novela cuenta una familia durante mucho tiempo.' }
          ],
          closing: 'En otra generación, el pueblo cambia con la llegada de una compañía bananera.'
        },
        {
          id: 'mac4', title: 'Un recuerdo que otros niegan', place: 'El Macondo de la compañía bananera', scene: 'macondo',
          paragraphs: [
            'La compañía bananera transforma Macondo y atrae a muchos trabajadores. José Arcadio Segundo, un descendiente de los fundadores, vive en esta época. Durante una protesta de los trabajadores ocurre una masacre. Él sobrevive y recuerda lo sucedido, pero encuentra personas que lo niegan. Su recuerdo queda frente a las voces que aseguran que nada ocurrió.',
            'Después llega una lluvia que dura años. La compañía se marcha y el pueblo pierde actividad. La casa de los Buendía también cambia y se deteriora. Cuando el agua deja de caer, Macondo ya no tiene la vida de antes. La familia permanece entre las huellas de ese cambio, mientras José Arcadio Segundo conserva la memoria de los trabajadores.'
          ],
          prompt: '¿Qué aspecto quieres seguir para comprender este momento?',
          choices: [
            { id: 'a', label: 'El recuerdo de José Arcadio Segundo', response: 'Prestas atención al testigo y a lo que otros niegan. Su recuerdo importa aunque resulte incómodo. Puedes relacionar este capítulo con la necesidad de escuchar y contrastar relatos sobre el pasado.' },
            { id: 'b', label: 'Los cambios del pueblo y de la casa', response: 'Observas el paso del tiempo en los lugares. Un pueblo con mucha actividad se vacía y una casa pierde habitantes. Los espacios también ayudan a contar la historia de una comunidad.' }
          ],
          closing: 'La familia llega a sus últimas generaciones. Unos viejos manuscritos todavía esperan un lector.'
        },
        {
          id: 'mac5', title: 'La última lectura', place: 'La casa de los Buendía', scene: 'macondo',
          paragraphs: [
            'Aureliano Babilonia pertenece a una de las últimas generaciones de los Buendía. Su vida transcurre décadas después de las guerras del coronel Aureliano Buendía. Lee los manuscritos de Melquíades y descubre la historia de su familia. Mientras comprende lo escrito, el pasado de la casa y su propio presente empiezan a formar un mismo relato.',
            'Amaranta Úrsula y el último niño de la familia ya han muerto. La lectura llega al tiempo que Aureliano está viviendo. Un viento destruye Macondo y la historia de los Buendía termina. El pueblo fundado junto al río desaparece mientras su último lector descubre, en aquellas páginas, cómo todas las generaciones forman parte de la misma historia.'
          ],
          prompt: '¿Qué quieres hacer con los recuerdos de esta lectura?',
          choices: [
            { id: 'a', label: 'Volver a los primeros nombres', response: 'Comparas a los fundadores con las últimas generaciones. Los nombres se parecen, pero sus vidas no son iguales. Puedes construir una lista breve para distinguir a cada personaje sin inventar otro desenlace.' },
            { id: 'b', label: 'Elegir un recuerdo para contar', response: 'Eliges un episodio de los cinco y explicas por qué lo recuerdas. Tu respuesta pertenece a tu lectura personal. No cambia el final de Macondo ni pretende contar toda la novela.' }
          ],
          closing: 'Macondo desaparece en la ficción; la conversación de sus lectores puede continuar.'
        }
      ],
      ending: {
        title: 'Una familia, muchas memorias',
        paragraphs: [
          'Has recorrido cinco momentos de una novela extensa: la fundación, el olvido, las guerras, la memoria de una masacre y la última lectura. Esta selección deja fuera numerosos personajes, relaciones y episodios.',
          'Los nombres repetidos invitan a leer despacio. Puedes volver a la lista de personajes o reconstruir los cinco momentos con tus propias palabras. No hace falta explicar cada símbolo de una única manera.'
        ],
        question: '¿Qué recuerdo de una familia o de una comunidad te parece importante conservar, y por qué?'
      }
    },
    {
      id: 'borges',
      title: 'El bibliotecario y el cuaderno de regreso',
      subtitle: 'Una aventura original inspirada en La biblioteca de Babel',
      author: 'Jorge Luis Borges · obra de referencia',
      country: 'Argentina',
      kind: 'inspiracion',
      description: 'Una ficción nueva con el narrador bibliotecario sin nombre y las galerías de La biblioteca de Babel como punto de partida. La búsqueda del cuaderno, sus encuentros y este final se han creado para Cuéntalo: no son el argumento del cuento de Borges.',
      cover: 'biblioteca_borges',
      color: '#7867a7',
      characters: [
        { name: 'El bibliotecario', role: 'Narrador sin nombre del cuento, en una aventura nueva' },
        { name: 'Otros lectores', role: 'Figuras creadas para esta aventura de Cuéntalo' }
      ],
      sources: [
        { label: 'Biblioteca Nacional de Argentina · El libro absoluto', url: 'https://www.bn.gov.ar/agenda-cultural/el-libro-absoluto' },
        { label: 'Instituto Cervantes · La biblioteca en Borges', url: 'https://cvc.cervantes.es/actcult/borges/elementos/11a.htm' },
        { label: 'Instituto Cervantes · Jorge Luis Borges', url: 'https://www.cervantes.es/bibliotecas_documentacion_espanol/biografias/nueva_york_jorge_luis_borges.htm' }
      ],
      chapters: [
        {
          id: 'bor1', title: 'Una pregunta entre los estantes', place: 'Una galería de la Biblioteca', scene: 'biblioteca_borges',
          paragraphs: [
            'Soy bibliotecario y vivo entre libros. Las galerías tienen seis lados y parecen repetirse más allá de lo que puedo ver. He buscado durante mucho tiempo un libro que explique otros libros. Hoy empieza una aventura nueva, inventada para esta lectura: quiero preparar un cuaderno que ayude a alguien a volver a su punto de partida.',
            'Sobre una mesa encuentro una hoja con un dibujo incompleto. Tres puertas están marcadas; una cuarta no tiene ninguna señal. No sé quién dejó el papel ni si el camino es seguro. Llevo un lápiz y empiezo por una pregunta pequeña: ¿qué puedo comprobar aquí, sin conocer toda la Biblioteca?'
          ],
          prompt: '¿Por dónde empezamos a preparar el cuaderno?',
          choices: [
            { id: 'a', label: 'Dibujar la galería donde estamos', response: 'Dibujamos seis lados y señalamos nuestra mesa. Es una información limitada, pero podemos comprobarla mirando alrededor. La primera página del cuaderno ya distingue lo que vemos de lo que todavía imaginamos.' },
            { id: 'b', label: 'Examinar las marcas de la hoja', response: 'Comparamos las marcas con las puertas. Dos coinciden y otra resulta poco clara. Escribimos esa duda en el cuaderno: un dibujo encontrado puede ser útil sin convertirse en una verdad completa.' }
          ],
          closing: 'Con un primer punto de referencia, cruzamos una puerta y dejamos la mesa atrás.'
        },
        {
          id: 'bor2', title: 'Dos salas casi iguales', place: 'Las galerías contiguas', scene: 'biblioteca_borges',
          paragraphs: [
            'La siguiente galería se parece mucho a la primera. Hay libros, puertas y una luz parecida. Durante un momento creo que hemos regresado. Sin embargo, la mesa está en otro lugar. Abro el cuaderno y comparo el dibujo con lo que tengo delante. La semejanza no significa que las dos salas sean la misma.',
            'Un lector pasa junto a nosotros. Dice que hace un rato vio una hoja parecida en otra mesa. Su recuerdo puede ayudarnos, pero tampoco conoce todos los caminos. Le mostramos nuestro dibujo y añadimos una flecha. Antes de avanzar, quiero dejar una señal que permita reconocer el regreso sin cambiar los libros de sitio.'
          ],
          prompt: '¿Cómo señalamos esta parte del recorrido?',
          choices: [
            { id: 'a', label: 'Añadir la posición de las mesas', response: 'Anotamos dónde está cada mesa respecto a la puerta de entrada. Ese detalle permite comparar las dos salas. Nuestro cuaderno gana una referencia concreta, aunque todavía no describe todo el recorrido.' },
            { id: 'b', label: 'Dibujar la puerta por la que entramos', response: 'Marcamos en el papel la puerta que acabamos de cruzar. El dibujo guarda nuestra experiencia de este trayecto. Si otro lector lo usa, también necesitará saber desde dónde comenzó a caminar.' }
          ],
          closing: 'En la sala siguiente vemos un libro abierto que parece ofrecer la respuesta que buscamos.'
        },
        {
          id: 'bor3', title: 'Un libro no basta', place: 'Una mesa de lectura', scene: 'biblioteca_borges',
          paragraphs: [
            'En una página encuentro instrucciones para llegar a una sala con una ventana roja. El texto parece claro y promete un camino fácil. Pero la página siguiente describe el mismo lugar de otra manera. No hay una explicación de esa diferencia. Cierro el libro un instante: encontrar palabras comprensibles no garantiza que describan lo que tenemos delante.',
            'Podemos copiar la indicación como una posibilidad o compararla con nuestra pequeña ruta. El cuaderno no tiene que contener una respuesta para cada pregunta. También puede guardar lo que falta por comprobar. Por primera vez, me parece útil escribir que no sé algo. Así, el siguiente lector no confundirá nuestra duda con una certeza.'
          ],
          prompt: '¿Qué hacemos con las instrucciones que se contradicen?',
          choices: [
            { id: 'a', label: 'Compararlas con nuestra ruta', response: 'Buscamos una coincidencia con las salas visitadas. No aparece la ventana roja. Conservamos la diferencia como dato: este libro no nos permite afirmar que conozcamos el camino que describe su página.' },
            { id: 'b', label: 'Anotar lo que falta comprobar', response: 'Escribimos una pregunta junto a las instrucciones. El cuaderno admite dudas y no necesita fingir una respuesta. Quien lo lea después podrá distinguir una observación nuestra de una posibilidad todavía abierta.' }
          ],
          closing: 'Seguimos con menos respuestas seguras y con una pregunta mejor escrita. Otros lectores se acercan a la mesa.'
        },
        {
          id: 'bor4', title: 'Un mapa hecho entre varios', place: 'Una galería de encuentro', scene: 'biblioteca_borges',
          paragraphs: [
            'Dos lectores miran el cuaderno. Uno reconoce la posición de una mesa; el otro recuerda una escalera que nosotros no hemos visto. Ponemos sus dibujos junto al nuestro. Algunas líneas coinciden y otras no. En vez de unirlo todo enseguida, señalamos quién conoce cada tramo y qué parte ha recorrido de verdad.',
            'Nuestro trabajo crece despacio. Nadie conoce la Biblioteca entera y nadie puede prometer un mapa completo. Sin embargo, ya tenemos una ruta corta que varias personas pueden explicar. La hoja encontrada al principio sigue incompleta. Ahora importa menos terminar aquel dibujo que construir una ayuda clara, con un comienzo conocido y unas instrucciones que otro lector pueda seguir.'
          ],
          prompt: '¿Qué tarea hacemos con los otros lectores?',
          choices: [
            { id: 'a', label: 'Revisar juntos un tramo conocido', response: 'Comparamos las notas de quienes han cruzado las mismas puertas. Donde hay diferencias, dejamos una pregunta. Trabajar juntos no elimina todos los errores, pero permite ver detalles que una persona puede olvidar.' },
            { id: 'b', label: 'Explicar las señales del cuaderno', response: 'Escribimos qué significa cada flecha y cada signo de duda. Un mapa resulta más útil cuando otra persona entiende sus señales. Compartir también consiste en explicar cómo hemos organizado la información.' }
          ],
          closing: 'Llega el momento de probar el cuaderno: intentaremos volver a nuestra primera mesa.'
        },
        {
          id: 'bor5', title: 'La mesa del comienzo', place: 'La primera galería', scene: 'biblioteca_borges',
          paragraphs: [
            'Seguimos las notas y reconocemos las mesas y las puertas que hemos dibujado. Cuando aparece la primera galería, compruebo el punto de partida. Hemos regresado. No encontramos un libro que explique todos los libros ni un camino hacia cada sala. Encontramos una manera de describir un recorrido pequeño y de compartir las dudas que surgieron.',
            'Dejo una copia del cuaderno sobre la mesa. En su primera página dibujo el lugar desde el que empieza la ruta. Otro lector podrá probarla y añadir sus observaciones. Esta es la conclusión de nuestra aventura inventada, no el final del cuento de Borges. La Biblioteca continúa más allá del dibujo; nuestra ayuda tiene un alcance más pequeño.'
          ],
          prompt: '¿Qué dejamos junto al cuaderno para el siguiente lector?',
          choices: [
            { id: 'a', label: 'Una invitación a comprobar el camino', response: 'Añadimos una invitación a recorrer y revisar las indicaciones. El siguiente lector no tiene que creerlas sin mirar. Su experiencia puede ayudar a corregir el cuaderno y a explicar mejor la ruta.' },
            { id: 'b', label: 'Una pregunta todavía abierta', response: 'Dejamos una pregunta sobre la escalera que no visitamos. No sabemos adónde lleva. La próxima lectura podrá comenzar allí, sin convertir nuestra ruta pequeña en una explicación de toda la Biblioteca.' }
          ],
          closing: 'Cerramos el cuaderno por hoy. Queda una ruta compartida y espacio para otra pregunta.'
        }
      ],
      ending: {
        title: 'El valor de una pregunta pequeña',
        paragraphs: [
          'Esta aventura de Cuéntalo ha tomado como punto de partida al bibliotecario y las galerías del cuento de Borges. El cuaderno, los otros lectores, el recorrido y su desenlace son una creación nueva.',
          'No has resuelto todos los misterios de la Biblioteca. Has elegido cómo observar, comprobar y compartir una ruta. Ahora puedes leer el cuento original sin confundir su argumento con esta aventura.'
        ],
        question: '¿Qué diferencia hay entre encontrar una respuesta escrita y comprobar que esa respuesta sirve?'
      }
    },
    {
      id: 'frida',
      title: 'Frida Kahlo: una vida entre pinturas',
      subtitle: 'Cinco momentos de una biografía artística',
      author: 'Biografía basada en el Museo Frida Kahlo',
      country: 'México',
      kind: 'biografia',
      description: 'Un recorrido biográfico por la infancia, el trabajo y el legado de Frida Kahlo. Los hechos y las fechas no cambian: eliges qué observar en cada momento. Las preguntas son nuestras; no inventamos palabras ni pensamientos de la artista.',
      cover: 'casa_azul',
      color: '#287fba',
      characters: [
        { name: 'Frida Kahlo', role: 'Pintora mexicana, nacida en 1907 y fallecida en 1954' },
        { name: 'Guillermo Kahlo', role: 'Su padre, fotógrafo' },
        { name: 'Matilde Calderón', role: 'Su madre' },
        { name: 'Diego Rivera', role: 'Pintor con quien Frida se casó' },
        { name: 'Los Fridos', role: 'Cuatro estudiantes que siguieron sus clases en la Casa Azul' },
        { name: 'Lola Álvarez Bravo', role: 'Fotógrafa y organizadora de su exposición de 1953 en México' }
      ],
      sources: [
        { label: 'Museo Frida Kahlo · Cronología de Frida', url: 'https://www.museofridakahlo.org.mx/frida/' },
        { label: 'Museo Frida Kahlo · Biografías documentadas', url: 'https://www.museofridakahlo.org.mx/wp/wp-content/uploads/2022/08/Biografias-Frida-Kahlo.pdf' },
        { label: 'Museo Frida Kahlo · Textos infantiles de las salas', url: 'https://www.museofridakahlo.org.mx/wp/wp-content/uploads/2022/07/Cedulas-infantiles-MFK.pdf' },
        { label: 'INBAL · Lola Álvarez Bravo y su galería', url: 'https://inba.gob.mx/prensa/12716/lola-aacutelvarez-bravo-primera-fot-oacutegrafa-mexicana-transit-oacute-de-la-fotograf-iacutea-documental-a-la-experimental' },
        { label: 'Museo Frida Kahlo · La Casa Azul', url: 'https://www.museofridakahlo.org.mx/museo/' },
        { label: 'Museo Frida Kahlo · Historia de la Casa Azul', url: 'https://www.museofridakahlo.org.mx/wp/wp-content/uploads/2022/08/LA-CASA-AZUL.pdf' }
      ],
      chapters: [
        {
          id: 'fri1', title: 'Una niña en Coyoacán', place: 'Coyoacán, Ciudad de México', year: '1907–1922', scene: 'casa_azul',
          paragraphs: [
            'Frida Kahlo nace el 6 de julio de 1907 en Coyoacán, en la casa que hoy conocemos como la Casa Azul. Su madre se llama Matilde Calderón. Su padre, Guillermo Kahlo, trabaja como fotógrafo. Las fotografías familiares conservan imágenes de Frida desde pequeña, mucho antes de que su rostro aparezca en sus propios cuadros.',
            'En 1922, Frida entra en la Escuela Nacional Preparatoria de Ciudad de México. Quiere estudiar Medicina. También trabaja para ayudar a su familia y aprende a colorear fotografías con un pincel en el estudio de su padre. Entre las clases y el trabajo, conoce técnicas de imagen que preceden a su carrera como pintora.'
          ],
          prompt: '¿Con qué mirada quieres comenzar esta biografía?',
          choices: [
            { id: 'a', label: 'Mirar una fotografía familiar', response: 'Te fijas en las personas y en el lugar de una fotografía. Puedes describir lo visible y preguntar qué información falta. Una imagen no permite conocer automáticamente los pensamientos de quienes aparecen.' },
            { id: 'b', label: 'Seguir sus años de estudio', response: 'Eliges situar a Frida como estudiante antes de conocer sus pinturas. Ordenar las etapas ayuda a leer una biografía. Todavía no necesitamos atribuirle un destino ni imaginar lo que pensaba sobre su futuro.' }
          ],
          closing: 'En 1925 ocurre un accidente que cambia sus condiciones de vida. Durante la recuperación, la pintura adquiere un lugar importante.'
        },
        {
          id: 'fri2', title: 'Pintar durante la recuperación', place: 'La casa familiar', year: '1925–1926', scene: 'casa_azul',
          paragraphs: [
            'El 17 de septiembre de 1925, Frida sufre un grave accidente cuando viaja en autobús. Tiene dieciocho años. Después de pasar por el hospital, necesita una larga recuperación en casa. En ese periodo empieza a pintar con mayor dedicación. Su familia le facilita materiales y un soporte que puede utilizar desde la cama.',
            'Un espejo le permite observar su rostro. En 1926 realiza su primer autorretrato. Un autorretrato es una imagen que un artista hace de sí mismo: puede elegir la postura, los colores y el fondo. El espejo, los pinceles y el caballete acercan el trabajo a la cama. Desde allí puede observarse y llevar esa imagen a la pintura.'
          ],
          prompt: '¿Qué objeto quieres observar para entender su trabajo?',
          choices: [
            { id: 'a', label: 'El espejo para observar el rostro', response: 'Piensas en la diferencia entre mirar un rostro y pintarlo. El espejo ofrece una imagen; la pintura requiere decisiones. Puedes observar colores y formas sin afirmar que conoces los sentimientos de la artista.' },
            { id: 'b', label: 'El soporte y los materiales', response: 'Observas cómo un soporte y unos materiales pueden facilitar una actividad. Tu atención está en las condiciones del trabajo. No necesitas imaginar una curación ni cambiar los hechos para reconocer la práctica artística.' }
          ],
          closing: 'Frida continúa pintando. Sus relaciones, sus viajes y las exposiciones amplían el mundo de su trabajo.'
        },
        {
          id: 'fri3', title: 'Una pintora ante otros públicos', place: 'México, Estados Unidos y Francia', year: '1929–1939', scene: 'casa_azul',
          paragraphs: [
            'Frida se casa con el pintor Diego Rivera en 1929. En los años siguientes vive temporadas en Estados Unidos y continúa desarrollando su propia obra. San Francisco, Detroit y Nueva York forman parte de esta etapa. Sus pinturas la acercan a otros artistas, a coleccionistas y a nuevos espacios donde mostrar su trabajo.',
            'En 1938 presenta su primera exposición individual en la galería Julien Levy de Nueva York. En 1939 muestra obras en París. Ese mismo año pinta Las dos Fridas, un doble autorretrato. Su trabajo llega a públicos de distintos países. Mientras sus cuadros viajan y se exponen, Frida continúa creando nuevas imágenes de sí misma.'
          ],
          prompt: '¿Cómo quieres acercarte a esta etapa artística?',
          choices: [
            { id: 'a', label: 'Observar un autorretrato', response: 'Eliges describir la composición, los colores y los detalles visibles. Después puedes proponer una interpretación como lectura personal. Conviene distinguir esa interpretación de un hecho documentado sobre la vida de Frida.' },
            { id: 'b', label: 'Seguir el recorrido de las exposiciones', response: 'Ordenas México, Nueva York y París como lugares de esta etapa. Mostrar obras ante nuevos públicos forma parte de una carrera artística. Las exposiciones ayudan a conocer la circulación de sus pinturas.' }
          ],
          closing: 'En los años cuarenta, el trabajo de Frida incluye también la enseñanza y el encuentro con estudiantes.'
        },
        {
          id: 'fri4', title: 'Enseñar y exponer en México', place: 'Ciudad de México', year: 'Década de 1940–1953', scene: 'casa_azul',
          paragraphs: [
            'Frida trabaja como profesora en la escuela de arte La Esmeralda. Cuando su salud dificulta los desplazamientos, un pequeño grupo continúa las clases en la Casa Azul. Fanny Rabel, Guillermo Monroy, Arturo García Bustos y Arturo Estrada serán conocidos como Los Fridos. La casa es también un lugar de trabajo y de aprendizaje compartido.',
            'En 1953, la fotógrafa Lola Álvarez Bravo organiza una exposición individual de Frida en Ciudad de México. La pintora asiste en una cama, debido a su estado de salud. Es la única exposición individual de su obra celebrada en México durante su vida. Sus cuadros reúnen en la galería a la artista y al público que llega para verlos.'
          ],
          prompt: '¿Qué encuentro quieres mirar con más atención?',
          choices: [
            { id: 'a', label: 'Las clases con Los Fridos', response: 'Te fijas en una artista que también enseña y comparte un espacio de trabajo. Puedes pensar en lo que necesita una clase para funcionar, sin inventar una lección concreta ni palabras de Frida.' },
            { id: 'b', label: 'La exposición organizada por Lola', response: 'Observas el papel de quienes preparan una exposición y acercan las obras al público. Lola Álvarez Bravo forma parte de esta historia. La presencia de Frida está documentada; sus pensamientos no los inventamos.' }
          ],
          closing: 'La exposición de 1953 pertenece a la última etapa de su vida. Después, su casa tendrá un nuevo papel público.'
        },
        {
          id: 'fri5', title: 'La Casa Azul abre sus puertas', place: 'Coyoacán, Ciudad de México', year: '1954–1958 y su legado', scene: 'casa_azul',
          paragraphs: [
            'Frida Kahlo muere el 13 de julio de 1954, a los cuarenta y siete años. En julio de 1958, la Casa Azul abre como museo. El lugar conserva obras, objetos y espacios relacionados con su vida. Quienes lo visitan pueden conocer una parte de su trabajo y de su entorno, junto con documentos que ayudan a interpretarlos.',
            'En el estudio se conserva un caballete; en la habitación, el espejo de la cama. Los libros, las fotografías y las piezas de arte popular forman parte de la colección. La casa donde Frida vivió y trabajó recibe ahora a visitantes de muchos lugares. Sus pinturas y sus objetos de trabajo continúan acercando al público a la artista.'
          ],
          prompt: '¿Qué pregunta quieres llevarte después de la visita?',
          choices: [
            { id: 'a', label: '¿Qué revela un objeto de trabajo?', response: 'Eliges un objeto del estudio y preguntas para qué servía. Después buscas información del museo. Un material o una herramienta puede explicar una práctica, aunque no revele toda la vida de su dueña.' },
            { id: 'b', label: '¿Cómo se conserva una obra?', response: 'Piensas en las personas que cuidan, estudian y muestran las pinturas. El legado de una artista continúa con ese trabajo. Puedes investigar cómo un museo conserva una obra y comparte información sobre ella.' }
          ],
          closing: 'La biografía de esta lectura termina; las obras y las fuentes permiten seguir aprendiendo.'
        }
      ],
      ending: {
        title: 'Mirar a una artista con atención',
        paragraphs: [
          'Has recorrido cinco etapas de una vida real. Tus elecciones han cambiado el foco de la lectura: una fotografía, un objeto, una pintura, una exposición o una pregunta. No han cambiado la biografía.',
          'Las fuentes del Museo Frida Kahlo permiten ampliar lo que has leído. Al hablar de una obra, puedes separar tres cosas: lo que observas, lo que documentan las fuentes y lo que tú interpretas.'
        ],
        question: '¿Qué aspecto del trabajo de Frida te gustaría investigar con una obra o un documento delante?'
      }
    }
  ] };
});
