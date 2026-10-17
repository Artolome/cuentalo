/* Cuéntalo — accessoires peints WebP, avec calques de toile et d'ailes.
 * Le registre navigateur est injecté par build.js ; assets permet un usage pur.
 * Sancho est rendu séparément comme personnage par exploration-ui.js.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(root);
  else root.SVExplorationArt = factory(root);
})(typeof self !== 'undefined' ? self : this, function (root) {
  'use strict';

  const assetNames = Object.freeze([
    'tree', 'well', 'bench', 'horse', 'mill', 'mill-sails', 'letter', 'key',
    'lamp', 'star', 'bell', 'canvas-empty', 'canvas-painted',
    'flower-red', 'flower-yellow', 'flower-pink', 'flower-purple',
    'fruit-red', 'fruit-green', 'fruit-orange',
    'book-red', 'book-blue', 'book-green', 'book-purple',
    'butterfly-yellow', 'butterfly-blue',
    'door-brown', 'door-blue', 'door-purple',
    'paint-red', 'paint-blue', 'paint-yellow'
  ]);
  const plainKinds = new Set(['tree', 'well', 'bench', 'horse', 'mill', 'letter', 'key', 'lamp', 'star', 'bell']);
  const variants = Object.freeze({
    flower: ['red', 'yellow', 'pink', 'purple'],
    fruit: ['red', 'green', 'orange'],
    book: ['red', 'blue', 'green', 'purple'],
    butterfly: ['yellow', 'blue'],
    door: ['brown', 'blue', 'purple'],
    paint: ['red', 'blue', 'yellow']
  });
  const defaults = Object.freeze({
    flower: 'red', fruit: 'red', book: 'blue',
    butterfly: 'yellow', door: 'brown', paint: 'blue'
  });
  // Les couleurs exactes des missions et les anciens alias nommés convergent ici.
  const colors = Object.freeze({
    '#df4d45': 'red', '#d45355': 'red', red: 'red', rojo: 'red', roja: 'red',
    '#f4c63e': 'yellow', '#f1c73f': 'yellow', '#edc75c': 'yellow',
    yellow: 'yellow', amarillo: 'yellow', amarilla: 'yellow',
    '#e37a9b': 'pink', '#df8a9c': 'pink', pink: 'pink', rosa: 'pink',
    '#ad74cc': 'purple', '#8c68a6': 'purple', '#8b6aa9': 'purple', '#9a83c2': 'purple',
    purple: 'purple', violeta: 'purple',
    '#79ac44': 'green', '#719c64': 'green', green: 'green', verde: 'green',
    '#ed9a32': 'orange', '#e69b54': 'orange', orange: 'orange', naranja: 'orange',
    '#398dca': 'blue', '#5d9ed5': 'blue', '#5299c0': 'blue', blue: 'blue', azul: 'blue',
    '#ba7541': 'brown', '#996d49': 'brown', brown: 'brown', marron: 'brown', marrón: 'brown'
  });
  function assetKey(object) {
    if (!object || typeof object !== 'object') return null;
    if (plainKinds.has(object.kind)) return object.kind;
    if (object.kind === 'canvas') return 'canvas-empty';
    if (!Object.prototype.hasOwnProperty.call(variants, object.kind)) return null;
    const value = typeof object.color === 'string' ? object.color.trim().toLowerCase() : '';
    const color = Object.prototype.hasOwnProperty.call(colors, value) ? colors[value] : null;
    return object.kind + '-' + (variants[object.kind].includes(color) ? color : defaults[object.kind]);
  }
  function escapeAttribute(value) {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;');
  }
  function render(object, assets) {
    const key = assetKey(object);
    if (!key) return '';
    const registry = assets === undefined ? root.SVExplorationObjects : assets;
    function image(name, extra) {
      if (!registry || !Object.prototype.hasOwnProperty.call(registry, name) ||
          typeof registry[name] !== 'string' || !registry[name].trim()) return '';
      return '<img class="x-object-illustration' + (extra ? ' ' + extra : '') +
        '" src="' + escapeAttribute(registry[name]) + '" alt="" draggable="false">';
    }
    const base = image(key);
    if (!base) return '';
    let overlay = '';
    if (key === 'canvas-empty') overlay = image('canvas-painted', 'x-painted');
    if (key === 'mill') overlay = image('mill-sails', 'x-mill-sails');
    return '<span class="x-object-art" aria-hidden="true">' + base + overlay + '</span>';
  }
  Object.defineProperties(render, {
    assetNames: { value: assetNames, enumerable: true },
    assetKey: { value: assetKey, enumerable: true }
  });
  return render;
});
