/* Shared build/print asset loader. Every scene has its own environment. */
const fs = require('fs');
const path = require('path');
const C = require('../src/contenido.js');

module.exports = function loadArt() {
  const base = path.join(__dirname, '..', 'src', 'art', 'assets');
  const data = (folder, id) => 'data:image/webp;base64,' + fs.readFileSync(path.join(base, folder, id + '.webp')).toString('base64');
  return {
    fondos: Object.fromEntries(C.ESCENAS.map(e => [e.id, data('escenas-cartoon', e.id)])),
    personajes: Object.fromEntries(C.PERSONAJES.map(p => [p.id, data('personajes-cartoon', p.id)]))
  };
};
