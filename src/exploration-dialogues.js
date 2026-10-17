/* Cuéntalo — diálogos inventados para las misiones del juego.
 * No son citas de las obras ni palabras históricas de Frida Kahlo.
 * chapters[0..5] acompaña las seis misiones de cada mundo, en orden.
 * Cada intercambio contiene dos voces y dos réplicas breves, sin traducción.
 * Criterios de interpretación y variantes de español: docs/DIALOGOS.md.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVExplorationDialogues = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return { worlds: {
    don_quijote: {
      speakers: {
        quijote: { name: 'Don Quijote', role: 'hero' },
        sancho: { name: 'Sancho', role: 'companion' }
      },
      chapters: [
        [
          { speaker: 'quijote', text: 'Sancho, ¿vienes conmigo a buscar aventuras?' },
          { speaker: 'sancho', text: '¡Claro! Pero primero busquemos a Rocinante.' }
        ],
        [
          { speaker: 'quijote', text: 'Aquí está Rocinante, junto al camino.' },
          { speaker: 'sancho', text: 'Ya podemos seguir. ¡Vamos, amigo!' }
        ],
        [
          { speaker: 'quijote', text: '¡Qué grandes son las aspas!' },
          { speaker: 'sancho', text: 'Sí, son molinos. El viento las mueve.' }
        ],
        [
          { speaker: 'quijote', text: 'Tenemos tres frutas para el viaje.' },
          { speaker: 'sancho', text: 'Perfecto, guardemos una para el camino.' }
        ],
        [
          { speaker: 'quijote', text: 'Esta carta viene de casa.' },
          { speaker: 'sancho', text: 'Entonces, volvamos antes de que anochezca.' }
        ],
        [
          { speaker: 'quijote', text: 'Sancho, ya estamos en casa.' },
          { speaker: 'sancho', text: '¡Por fin! Ahora podemos descansar.' }
        ]
      ]
    },
    macondo: {
      speakers: {
        ursula: { name: 'Úrsula', role: 'hero' },
        vecina: { name: 'Vecina de Macondo', role: 'companion' }
      },
      chapters: [
        [
          { speaker: 'ursula', text: 'Mira, tres mariposas amarillas junto a la casa.' },
          { speaker: 'vecina', text: '¡Qué bonitas! Vamos hacia la puerta.' }
        ],
        [
          { speaker: 'ursula', text: 'Ya abrí la puerta. Puedes pasar.' },
          { speaker: 'vecina', text: 'Gracias, Úrsula. Aquí hay una carta.' }
        ],
        [
          { speaker: 'ursula', text: 'Nos invitan a una fiesta en la plaza.' },
          { speaker: 'vecina', text: 'Llevemos fruta para compartir con los vecinos.' }
        ],
        [
          { speaker: 'ursula', text: 'Ya tenemos fruta para todos.' },
          { speaker: 'vecina', text: 'Ahora falta el agua. Vamos al pozo.' }
        ],
        [
          { speaker: 'ursula', text: 'El agua ya está lista para la fiesta.' },
          { speaker: 'vecina', text: 'Solo falta llamar a los vecinos.' }
        ],
        [
          { speaker: 'ursula', text: '¡La campana suena! La fiesta empieza.' },
          { speaker: 'vecina', text: '¡Vamos a la plaza con los demás!' }
        ]
      ]
    },
    borges: {
      speakers: {
        bibliotecario: { name: 'Bibliotecario', role: 'hero' },
        visitante: { name: 'Visitante', role: 'companion' }
      },
      chapters: [
        [
          { speaker: 'bibliotecario', text: 'Acá está el libro azul que buscábamos.' },
          { speaker: 'visitante', text: '¡Lo encontraste! Ahora necesitamos un poco de luz.' }
        ],
        [
          { speaker: 'bibliotecario', text: 'Las dos lámparas ya están encendidas.' },
          { speaker: 'visitante', text: 'Ahora podemos ver el camino a la sala.' }
        ],
        [
          { speaker: 'bibliotecario', text: 'Encontré la llave dorada junto a los libros.' },
          { speaker: 'visitante', text: 'Entonces ya podemos abrir la puerta.' }
        ],
        [
          { speaker: 'bibliotecario', text: 'La puerta está abierta. Pasá, por favor.' },
          { speaker: 'visitante', text: 'Gracias. ¡Mirá cómo brillan esas estrellas!' }
        ],
        [
          { speaker: 'bibliotecario', text: 'Tenemos tres estrellas para iluminar la biblioteca.' },
          { speaker: 'visitante', text: 'Ya está todo listo. Avisemos a los demás.' }
        ],
        [
          { speaker: 'bibliotecario', text: '¡Bienvenidos! Hay muchos libros por descubrir.' },
          { speaker: 'visitante', text: '¿Empezamos por el libro azul?' }
        ]
      ]
    },
    frida: {
      speakers: {
        frida: { name: 'Frida', role: 'hero' },
        visitante: { name: 'Visitante del taller', role: 'companion' }
      },
      chapters: [
        [
          { speaker: 'frida', text: 'Tres flores rojas para alegrar el taller.' },
          { speaker: 'visitante', text: '¡Qué bonitas! Las llevamos junto a la ventana.' }
        ],
        [
          { speaker: 'frida', text: 'Ya tengo pintura azul y amarilla.' },
          { speaker: 'visitante', text: '¡Qué bien! El lienzo te está esperando.' }
        ],
        [
          { speaker: 'frida', text: 'Mi cuadro ya está terminado.' },
          { speaker: 'visitante', text: 'Me gustan mucho esos colores.' }
        ],
        [
          { speaker: 'frida', text: 'La puerta está abierta. Vamos a la exposición.' },
          { speaker: 'visitante', text: 'Sí, busquemos un lugar para tu cuadro.' }
        ],
        [
          { speaker: 'frida', text: 'Aquí se ve bien mi cuadro.' },
          { speaker: 'visitante', text: 'Sí, desde aquí se aprecian los detalles.' }
        ],
        [
          { speaker: 'frida', text: '¡Ya pueden entrar! La exposición está abierta.' },
          { speaker: 'visitante', text: 'Gracias, Frida. Vamos a mirar los cuadros.' }
        ]
      ]
    }
  } };
});
