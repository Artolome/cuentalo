/* Cuéntalo — aventuras imaginadas de exploración, sin preguntas ni inventario combinado.
 * Datos independientes del DOM. Escenario lógico: 1000 × 560.
 * Cada misión se completa interactuando con count objetos distintos de targets.
 * Easy y normal cambian la redacción; conservan exactamente la misma acción.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVExplorationData = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return { worlds: [
    {
      reference: 'Miguel de Cervantes · España',
      id: 'don_quijote', title: 'Don Quijote y Sancho',
      subtitle: 'Una aventura imaginada por los caminos de La Mancha',
      cover: 'don_quijote', player: 'quijote', color: '#bf7b30',
      missions: [
        {
          id: 'dq1', scene: 'don_quijote', title: 'El encuentro',
          goal: { easy: 'Habla con Sancho.', normal: 'Acércate a Sancho y habla con él.' },
          targets: ['dq1_sancho'], count: 1,
          objects: [
            { id: 'dq1_tree', label: 'Árbol', kind: 'tree', x: 140, y: 340 },
            { id: 'dq1_well', label: 'Pozo', kind: 'well', x: 360, y: 330 },
            { id: 'dq1_sancho', label: 'Sancho', kind: 'sancho', x: 760, y: 380 },
            { id: 'dq1_flower', label: 'Flor amarilla', kind: 'flower', x: 900, y: 490, color: '#f4c63e' }
          ],
          success: '¡Sancho está preparado!', transition: 'Ahora falta encontrar a Rocinante.'
        },
        {
          id: 'dq2', scene: 'don_quijote', title: 'Rocinante',
          goal: { easy: 'Busca a Rocinante.', normal: 'Encuentra a Rocinante junto al camino.' },
          targets: ['dq2_horse'], count: 1,
          objects: [
            { id: 'dq2_horse', label: 'Rocinante', kind: 'horse', x: 180, y: 380 },
            { id: 'dq2_bench', label: 'Banco', kind: 'bench', x: 430, y: 320 },
            { id: 'dq2_flower', label: 'Flor roja', kind: 'flower', x: 700, y: 350, color: '#df4d45' },
            { id: 'dq2_tree', label: 'Árbol', kind: 'tree', x: 900, y: 470 }
          ],
          success: '¡Rocinante está listo!', transition: 'Un molino aparece junto al camino.'
        },
        {
          id: 'dq3', scene: 'don_quijote', title: 'El molino',
          goal: { easy: 'Visita el molino.', normal: 'Acércate al molino para verlo de cerca.' },
          targets: ['dq3_mill'], count: 1,
          objects: [
            { id: 'dq3_bench', label: 'Banco', kind: 'bench', x: 120, y: 440 },
            { id: 'dq3_tree', label: 'Árbol', kind: 'tree', x: 350, y: 330 },
            { id: 'dq3_mill', label: 'Molino', kind: 'mill', x: 730, y: 360 }
          ],
          success: '¡Es un molino de viento!', transition: 'Después del paseo, hacen falta provisiones.'
        },
        {
          id: 'dq4', scene: 'frutas', title: 'Las provisiones',
          goal: { easy: 'Recoge 3 frutas.', normal: 'Recoge las tres frutas para el viaje.' },
          targets: ['dq4_apple', 'dq4_pear', 'dq4_orange'], count: 3,
          objects: [
            { id: 'dq4_apple', label: 'Fruta roja', kind: 'fruit', x: 130, y: 390, color: '#df4d45' },
            { id: 'dq4_bench', label: 'Banco', kind: 'bench', x: 340, y: 320 },
            { id: 'dq4_pear', label: 'Fruta verde', kind: 'fruit', x: 550, y: 330, color: '#79ac44' },
            { id: 'dq4_flower', label: 'Flor', kind: 'flower', x: 750, y: 320, color: '#ad74cc' },
            { id: 'dq4_orange', label: 'Fruta naranja', kind: 'fruit', x: 900, y: 470, color: '#ed9a32' }
          ],
          success: '¡Ya tenemos comida!', transition: 'Una carta espera cerca del refugio.'
        },
        {
          id: 'dq5', scene: 'refugio', title: 'La carta de casa',
          goal: { easy: 'Busca la carta.', normal: 'Encuentra la carta que llega de casa.' },
          targets: ['dq5_letter'], count: 1,
          objects: [
            { id: 'dq5_tree', label: 'Árbol', kind: 'tree', x: 150, y: 350 },
            { id: 'dq5_flower', label: 'Flor amarilla', kind: 'flower', x: 350, y: 330, color: '#f4c63e' },
            { id: 'dq5_letter', label: 'Carta de casa', kind: 'letter', x: 760, y: 380 }
          ],
          success: '¡Es hora de volver!', transition: 'La puerta de casa está al final del camino.'
        },
        {
          id: 'dq6', scene: 'refugio', title: 'De vuelta en casa',
          goal: { easy: 'Abre la puerta.', normal: 'Abre la puerta de casa para terminar el viaje.' },
          targets: ['dq6_door'], count: 1,
          objects: [
            { id: 'dq6_bench', label: 'Banco', kind: 'bench', x: 140, y: 430 },
            { id: 'dq6_tree', label: 'Árbol', kind: 'tree', x: 370, y: 320 },
            { id: 'dq6_door', label: 'Puerta de casa', kind: 'door', x: 760, y: 360, color: '#ba7541' }
          ],
          success: '¡Ya estamos en casa!'
        }
      ],
      ending: { title: 'El viaje compartido', phrase: '¡Llegamos a casa con comida y recuerdos!' }
    },
    {
      reference: 'Cien años de soledad · Colombia',
      id: 'macondo', title: 'Una fiesta en Macondo',
      subtitle: 'Una aventura imaginada con Úrsula y sus vecinos',
      cover: 'macondo', player: 'ursula', color: '#608c47',
      missions: [
        {
          id: 'mac1', scene: 'macondo', title: 'Las mariposas',
          goal: { easy: 'Busca 3 mariposas amarillas.', normal: 'Encuentra las tres mariposas amarillas del jardín.' },
          targets: ['mac1_butterfly_a', 'mac1_butterfly_b', 'mac1_butterfly_c'], count: 3,
          objects: [
            { id: 'mac1_butterfly_a', label: 'Mariposa amarilla', kind: 'butterfly', x: 120, y: 380, color: '#f1c73f' },
            { id: 'mac1_tree', label: 'Árbol', kind: 'tree', x: 340, y: 320 },
            { id: 'mac1_butterfly_b', label: 'Mariposa amarilla', kind: 'butterfly', x: 550, y: 330, color: '#f1c73f' },
            { id: 'mac1_butterfly_blue', label: 'Mariposa azul', kind: 'butterfly', x: 740, y: 320, color: '#5d9ed5' },
            { id: 'mac1_butterfly_c', label: 'Mariposa amarilla', kind: 'butterfly', x: 900, y: 470, color: '#f1c73f' }
          ],
          success: '¡Las mariposas señalan la casa!', transition: 'La puerta azul queda cerca.'
        },
        {
          id: 'mac2', scene: 'macondo', title: 'La casa',
          goal: { easy: 'Abre la puerta azul.', normal: 'Acércate a la puerta azul y ábrela.' },
          targets: ['mac2_door'], count: 1,
          objects: [
            { id: 'mac2_flower', label: 'Flor roja', kind: 'flower', x: 150, y: 360, color: '#df4d45' },
            { id: 'mac2_bench', label: 'Banco', kind: 'bench', x: 380, y: 330 },
            { id: 'mac2_door', label: 'Puerta azul', kind: 'door', x: 760, y: 370, color: '#398dca' }
          ],
          success: '¡La casa está abierta!', transition: 'Dentro espera una carta para preparar la fiesta.'
        },
        {
          id: 'mac3', scene: 'macondo', title: 'La invitación',
          goal: { easy: 'Busca la carta.', normal: 'Busca la carta para la fiesta de la plaza.' },
          targets: ['mac3_letter'], count: 1,
          objects: [
            { id: 'mac3_letter', label: 'Carta de la fiesta', kind: 'letter', x: 170, y: 380 },
            { id: 'mac3_book', label: 'Libro', kind: 'book', x: 420, y: 320, color: '#8c68a6' },
            { id: 'mac3_flower', label: 'Flor', kind: 'flower', x: 750, y: 360, color: '#e37a9b' }
          ],
          success: '¡Vamos a preparar la fiesta!', transition: 'Primero hacen falta frutas para compartir.'
        },
        {
          id: 'mac4', scene: 'frutas', title: 'Frutas para todos',
          goal: { easy: 'Recoge 3 frutas.', normal: 'Recoge las tres frutas para compartir en la plaza.' },
          targets: ['mac4_fruit_a', 'mac4_fruit_b', 'mac4_fruit_c'], count: 3,
          objects: [
            { id: 'mac4_fruit_a', label: 'Fruta naranja', kind: 'fruit', x: 130, y: 400, color: '#ed9a32' },
            { id: 'mac4_tree', label: 'Árbol', kind: 'tree', x: 340, y: 320 },
            { id: 'mac4_fruit_b', label: 'Fruta roja', kind: 'fruit', x: 550, y: 330, color: '#df4d45' },
            { id: 'mac4_butterfly', label: 'Mariposa', kind: 'butterfly', x: 740, y: 320, color: '#f1c73f' },
            { id: 'mac4_fruit_c', label: 'Fruta verde', kind: 'fruit', x: 900, y: 470, color: '#79ac44' }
          ],
          success: '¡Hay frutas para compartir!', transition: 'La plaza tiene un pozo con agua.'
        },
        {
          id: 'mac5', scene: 'plaza_cultural', title: 'El agua de la plaza',
          goal: { easy: 'Busca agua en el pozo.', normal: 'Acércate al pozo y recoge agua para la fiesta.' },
          targets: ['mac5_well'], count: 1,
          objects: [
            { id: 'mac5_bench', label: 'Banco', kind: 'bench', x: 140, y: 440 },
            { id: 'mac5_flower', label: 'Flor', kind: 'flower', x: 360, y: 320, color: '#e37a9b' },
            { id: 'mac5_well', label: 'Pozo', kind: 'well', x: 760, y: 370 }
          ],
          success: '¡Ya tenemos agua!', transition: 'Solo falta avisar a los vecinos.'
        },
        {
          id: 'mac6', scene: 'plaza_cultural', title: 'La fiesta comienza',
          goal: { easy: 'Toca la campana.', normal: 'Toca la campana de la plaza para avisar.' },
          targets: ['mac6_bell'], count: 1,
          objects: [
            { id: 'mac6_bell', label: 'Campana de la plaza', kind: 'bell', x: 180, y: 370, color: '#e9b748' },
            { id: 'mac6_bench', label: 'Banco', kind: 'bench', x: 430, y: 320 },
            { id: 'mac6_tree', label: 'Árbol', kind: 'tree', x: 760, y: 370 }
          ],
          success: '¡La fiesta puede comenzar!'
        }
      ],
      ending: { title: 'Una plaza para todos', phrase: '¡Úrsula ha preparado la fiesta de Macondo!' }
    },
    {
      reference: 'Jorge Luis Borges · Argentina',
      id: 'borges', title: 'Luces en la biblioteca',
      subtitle: 'Una aventura imaginada entre libros, puertas y estrellas',
      cover: 'biblioteca_borges', player: 'bibliotecario', color: '#7c69a8',
      missions: [
        {
          id: 'bor1', scene: 'biblioteca_borges', title: 'El libro azul',
          goal: { easy: 'Busca el libro azul.', normal: 'Encuentra el libro azul entre los libros de colores.' },
          targets: ['bor1_book_blue'], count: 1,
          objects: [
            { id: 'bor1_book_red', label: 'Libro rojo', kind: 'book', x: 130, y: 390, color: '#df4d45' },
            { id: 'bor1_bench', label: 'Banco', kind: 'bench', x: 350, y: 320 },
            { id: 'bor1_book_blue', label: 'Libro azul', kind: 'book', x: 730, y: 350, color: '#398dca' },
            { id: 'bor1_book_green', label: 'Libro verde', kind: 'book', x: 900, y: 470, color: '#79ac44' }
          ],
          success: '¡El libro azul está aquí!', transition: 'El patio está oscuro. Hay que encender las lámparas.'
        },
        {
          id: 'bor2', scene: 'noche', title: 'El patio de noche',
          goal: { easy: 'Enciende las 2 lámparas.', normal: 'Enciende las dos lámparas para iluminar el patio.' },
          targets: ['bor2_lamp_a', 'bor2_lamp_b'], count: 2,
          objects: [
            { id: 'bor2_lamp_a', label: 'Lámpara', kind: 'lamp', x: 160, y: 370, color: '#efc34c' },
            { id: 'bor2_tree', label: 'Árbol', kind: 'tree', x: 400, y: 320 },
            { id: 'bor2_lamp_b', label: 'Lámpara', kind: 'lamp', x: 750, y: 370, color: '#efc34c' }
          ],
          success: '¡El patio tiene luz!', transition: 'Una llave espera en la siguiente sala.'
        },
        {
          id: 'bor3', scene: 'centro_cultural', title: 'La llave de la sala',
          goal: { easy: 'Busca la llave dorada.', normal: 'Encuentra la llave dorada de la biblioteca.' },
          targets: ['bor3_key'], count: 1,
          objects: [
            { id: 'bor3_book', label: 'Libro rojo', kind: 'book', x: 140, y: 390, color: '#df4d45' },
            { id: 'bor3_bench', label: 'Banco', kind: 'bench', x: 370, y: 320 },
            { id: 'bor3_key', label: 'Llave dorada', kind: 'key', x: 760, y: 370, color: '#e9b748' }
          ],
          success: '¡Tenemos la llave!', transition: 'Ya podemos volver a la puerta de la biblioteca.'
        },
        {
          id: 'bor4', scene: 'biblioteca_borges', title: 'La puerta de la biblioteca',
          goal: { easy: 'Abre la puerta.', normal: 'Abre la puerta de la biblioteca.' },
          targets: ['bor4_door'], count: 1,
          objects: [
            { id: 'bor4_door', label: 'Puerta de la biblioteca', kind: 'door', x: 180, y: 360, color: '#8b6aa9' },
            { id: 'bor4_book', label: 'Libro verde', kind: 'book', x: 420, y: 320, color: '#79ac44' },
            { id: 'bor4_bench', label: 'Banco', kind: 'bench', x: 760, y: 380 }
          ],
          success: '¡La biblioteca está abierta!', transition: 'Tres estrellas brillan en el patio.'
        },
        {
          id: 'bor5', scene: 'noche', title: 'Estrellas para la biblioteca',
          goal: { easy: 'Recoge 3 estrellas.', normal: 'Recoge las tres estrellas que brillan en el patio.' },
          targets: ['bor5_star_a', 'bor5_star_b', 'bor5_star_c'], count: 3,
          objects: [
            { id: 'bor5_star_a', label: 'Estrella', kind: 'star', x: 130, y: 390, color: '#f4d35c' },
            { id: 'bor5_tree', label: 'Árbol', kind: 'tree', x: 340, y: 320 },
            { id: 'bor5_star_b', label: 'Estrella', kind: 'star', x: 550, y: 330, color: '#f4d35c' },
            { id: 'bor5_bench', label: 'Banco', kind: 'bench', x: 750, y: 320 },
            { id: 'bor5_star_c', label: 'Estrella', kind: 'star', x: 900, y: 470, color: '#f4d35c' }
          ],
          success: '¡Tres estrellas para iluminar!', transition: 'La biblioteca está lista para recibir visitantes.'
        },
        {
          id: 'bor6', scene: 'biblioteca_borges', title: 'Bienvenidos a la biblioteca',
          goal: { easy: 'Toca la campana.', normal: 'Toca la campana para abrir la biblioteca al público.' },
          targets: ['bor6_bell'], count: 1,
          objects: [
            { id: 'bor6_book', label: 'Libro azul', kind: 'book', x: 140, y: 390, color: '#398dca' },
            { id: 'bor6_bench', label: 'Banco', kind: 'bench', x: 370, y: 320 },
            { id: 'bor6_bell', label: 'Campana', kind: 'bell', x: 760, y: 370, color: '#e9b748' }
          ],
          success: '¡Bienvenidos a la biblioteca!'
        }
      ],
      ending: { title: 'Un camino entre libros', phrase: '¡La biblioteca vuelve a brillar!' }
    },
    {
      reference: 'Frida Kahlo · México',
      id: 'frida', title: 'El taller de Frida',
      subtitle: 'Una aventura imaginada de colores, flores y pintura',
      cover: 'casa_azul', player: 'frida', color: '#288eb1',
      missions: [
        {
          id: 'fri1', scene: 'casa_azul', title: 'Las flores del jardín',
          goal: { easy: 'Recoge 3 flores rojas.', normal: 'Recoge las tres flores rojas del jardín.' },
          targets: ['fri1_flower_a', 'fri1_flower_b', 'fri1_flower_c'], count: 3,
          objects: [
            { id: 'fri1_flower_a', label: 'Flor roja', kind: 'flower', x: 130, y: 390, color: '#df4d45' },
            { id: 'fri1_tree', label: 'Árbol', kind: 'tree', x: 340, y: 320 },
            { id: 'fri1_flower_b', label: 'Flor roja', kind: 'flower', x: 550, y: 330, color: '#df4d45' },
            { id: 'fri1_flower_yellow', label: 'Flor amarilla', kind: 'flower', x: 740, y: 320, color: '#f4c63e' },
            { id: 'fri1_flower_c', label: 'Flor roja', kind: 'flower', x: 900, y: 470, color: '#df4d45' }
          ],
          success: '¡Tres flores para el taller!', transition: 'Ahora buscamos colores para pintar.'
        },
        {
          id: 'fri2', scene: 'taller_cultural', title: 'Los colores',
          goal: { easy: 'Recoge azul y amarillo.', normal: 'Recoge los botes de pintura azul y amarilla.' },
          targets: ['fri2_paint_blue', 'fri2_paint_yellow'], count: 2,
          objects: [
            { id: 'fri2_paint_blue', label: 'Pintura azul', kind: 'paint', x: 150, y: 380, color: '#398dca' },
            { id: 'fri2_paint_red', label: 'Pintura roja', kind: 'paint', x: 380, y: 320, color: '#df4d45' },
            { id: 'fri2_paint_yellow', label: 'Pintura amarilla', kind: 'paint', x: 750, y: 370, color: '#f4c63e' }
          ],
          success: '¡Los colores están preparados!', transition: 'Un lienzo blanco espera en el taller.'
        },
        {
          id: 'fri3', scene: 'taller_cultural', title: 'A pintar',
          goal: { easy: 'Pinta en el lienzo.', normal: 'Acércate al lienzo blanco y pinta en él.' },
          targets: ['fri3_canvas'], count: 1,
          objects: [
            { id: 'fri3_flower', label: 'Flor roja', kind: 'flower', x: 140, y: 390, color: '#df4d45' },
            { id: 'fri3_bench', label: 'Banco', kind: 'bench', x: 370, y: 320 },
            { id: 'fri3_canvas', label: 'Lienzo blanco', kind: 'canvas', x: 760, y: 360, color: '#fff5db' }
          ],
          success: '¡El cuadro está listo!', transition: 'Vamos a buscar un lugar para mostrarlo.'
        },
        {
          id: 'fri4', scene: 'casa_azul', title: 'Camino a la exposición',
          goal: { easy: 'Abre la puerta.', normal: 'Abre la puerta para ir a la exposición.' },
          targets: ['fri4_door'], count: 1,
          objects: [
            { id: 'fri4_door', label: 'Puerta de salida', kind: 'door', x: 180, y: 360, color: '#398dca' },
            { id: 'fri4_flower', label: 'Flor roja', kind: 'flower', x: 410, y: 320, color: '#df4d45' },
            { id: 'fri4_tree', label: 'Árbol', kind: 'tree', x: 760, y: 370 }
          ],
          success: '¡Vamos a la exposición!', transition: 'El cuadro tendrá su lugar en la sala.'
        },
        {
          id: 'fri5', scene: 'centro_cultural', title: 'El cuadro en la sala',
          goal: { easy: 'Muestra tu cuadro.', normal: 'Acércate al cuadro y muéstralo en la sala.' },
          targets: ['fri5_canvas'], count: 1,
          objects: [
            { id: 'fri5_bench', label: 'Banco', kind: 'bench', x: 140, y: 420 },
            { id: 'fri5_flower', label: 'Flor', kind: 'flower', x: 370, y: 320, color: '#df4d45' },
            { id: 'fri5_canvas', label: 'Tu cuadro', kind: 'canvas', x: 760, y: 360, color: '#398dca' }
          ],
          success: '¡Tu cuadro está expuesto!', transition: 'Solo falta invitar al público.'
        },
        {
          id: 'fri6', scene: 'centro_cultural', title: 'La exposición abre',
          goal: { easy: 'Toca la campana.', normal: 'Toca la campana para invitar al público.' },
          targets: ['fri6_bell'], count: 1,
          objects: [
            { id: 'fri6_bell', label: 'Campana', kind: 'bell', x: 180, y: 370, color: '#e9b748' },
            { id: 'fri6_canvas', label: 'Cuadro', kind: 'canvas', x: 430, y: 320, color: '#398dca' },
            { id: 'fri6_bench', label: 'Banco', kind: 'bench', x: 760, y: 380 }
          ],
          success: '¡La exposición está abierta!'
        }
      ],
      ending: { title: 'Una exposición de colores', phrase: '¡El cuadro de Frida ya tiene público!' }
    }
  ] };
});
