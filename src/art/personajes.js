/* Cuéntalo — arte: personajes SVG paramétricos (ligne claire, fondos lisos).
   personajeSVG(p, expresion, opts) → string SVG (viewBox 0 0 100 150).
   Expresiones: contento · feliz · miedo · hambre · sed · frio · cansado · herido · perdido · enfadado */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVArtePersonajes = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const INK = '#1f1a17', BLANCO = '#fbf6ea', ROJO = '#c4432e';
  const S = `stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;

  function pelo(p) {
    const c = p.pelo;
    switch (p.id) {
      case 'lucia': // dos moños + gorra rosa
        return `<circle cx="27" cy="34" r="9" fill="${c}" ${S}/><circle cx="73" cy="34" r="9" fill="${c}" ${S}/>
          <path d="M26 44 Q50 10 74 44 Z" fill="${c}" ${S}/>
          <path d="M24 36 Q50 14 76 36 L76 30 Q50 6 24 30 Z" fill="${p.color}" ${S}/>
          <path d="M60 30 L88 33 L86 38 L62 36 Z" fill="${p.color}" ${S}/>`;
      case 'mateo': // pelo corto de punta
        return `<path d="M26 40 Q24 14 50 14 Q76 14 74 40 Q68 28 62 30 L60 22 L54 30 L50 20 L46 30 L40 22 L38 30 Q32 28 26 40 Z" fill="${c}" ${S}/>`;
      case 'valeria': // melena larga con mechón, bandana amarilla
        return `<path d="M22 70 Q18 24 50 16 Q82 24 78 70 L70 70 Q74 40 60 34 Q40 38 30 70 Z" fill="${c}" ${S}/>
          <path d="M26 34 Q50 20 74 34 L74 28 Q50 12 26 28 Z" fill="${p.color}" ${S}/>`;
      case 'diego': // rizos
        return `<circle cx="32" cy="30" r="9" fill="${c}" ${S}/><circle cx="44" cy="22" r="9" fill="${c}" ${S}/><circle cx="57" cy="21" r="9" fill="${c}" ${S}/><circle cx="69" cy="29" r="9" fill="${c}" ${S}/>
          <path d="M26 40 Q50 24 74 40 Q62 34 50 36 Q38 34 26 40 Z" fill="${c}" stroke="none"/>`;
      default: return '';
    }
  }
  function accesorio(p) {
    switch (p.id) {
      case 'mateo': return `<path d="M44 74 L50 92 L56 74" fill="none" ${S}/><rect x="46" y="94" width="8" height="10" fill="${BLANCO}" ${S}/>`;
      case 'valeria': return `<rect x="38" y="82" width="24" height="16" rx="3" fill="${INK}" ${S}/><circle cx="50" cy="90" r="5.5" fill="#86b3d4" ${S}/><rect x="40" y="78" width="7" height="5" fill="${INK}"/>
          <path d="M34 72 Q50 84 66 72" fill="none" ${S} stroke-width="1.6"/>`;
      case 'diego': return `<g transform="rotate(-12 80 100)"><rect x="70" y="90" width="20" height="26" rx="2" fill="${BLANCO}" ${S}/><path d="M74 97 h12 M74 103 h12 M74 109 h8" ${S} stroke-width="1.5"/></g>`;
      case 'lucia': return `<path d="M40 76 q10 8 20 0" fill="none" ${S} stroke-width="1.8"/>`;
      default: return '';
    }
  }
  function cara(p, ex) {
    const ojos = {
      normal: `<circle cx="41" cy="46" r="2.6" fill="${INK}"/><circle cx="59" cy="46" r="2.6" fill="${INK}"/>`,
      grandes: `<circle cx="41" cy="46" r="4.2" fill="${BLANCO}" ${S} stroke-width="1.5"/><circle cx="59" cy="46" r="4.2" fill="${BLANCO}" ${S} stroke-width="1.5"/><circle cx="41" cy="46" r="2" fill="${INK}"/><circle cx="59" cy="46" r="2" fill="${INK}"/>`,
      cerrados: `<path d="M37 47 q4 3 8 0 M55 47 q4 3 8 0" fill="none" ${S} stroke-width="2"/>`,
      medio: `<path d="M37 44 h8 M55 44 h8" fill="none" ${S} stroke-width="2.2"/><path d="M38 47 q3 2 6 0 M56 47 q3 2 6 0" fill="none" ${S} stroke-width="1.6"/>`,
      lado: `<circle cx="43" cy="46" r="2.6" fill="${INK}"/><circle cx="61" cy="46" r="2.6" fill="${INK}"/>`,
      cruz: `<path d="M38 43 l6 6 M44 43 l-6 6" fill="none" ${S} stroke-width="2"/><circle cx="59" cy="46" r="2.6" fill="${INK}"/>`
    };
    const cejas = {
      normal: `<path d="M36 40 q5 -3 10 0 M54 40 q5 -3 10 0" fill="none" ${S} stroke-width="2"/>`,
      arriba: `<path d="M35 36 q6 -5 11 -1 M54 35 q5 -4 11 1" fill="none" ${S} stroke-width="2"/>`,
      enfadado: `<path d="M35 37 l11 4 M65 37 l-11 4" fill="none" ${S} stroke-width="2.2"/>`,
      triste: `<path d="M35 41 l11 -3 M65 41 l-11 -3" fill="none" ${S} stroke-width="2"/>`
    };
    const bocas = {
      sonrisa: `<path d="M42 57 q8 7 16 0" fill="none" ${S} stroke-width="2.2"/>`,
      grande: `<path d="M40 56 q10 12 20 0 Z" fill="${INK}"/><path d="M44 60 q6 4 12 0" fill="${ROJO}" stroke="none"/>`,
      onda: `<path d="M41 58 q3 -3 6 0 t6 0 t6 0" fill="none" ${S} stroke-width="2"/>`,
      abierta: `<ellipse cx="50" cy="58" rx="5" ry="6" fill="${INK}"/>`,
      triste: `<path d="M42 61 q8 -7 16 0" fill="none" ${S} stroke-width="2.2"/>`,
      recta: `<path d="M43 58 h14" fill="none" ${S} stroke-width="2.2"/>`,
      lengua: `<path d="M43 57 q7 6 14 0 Z" fill="${INK}"/><ellipse cx="50" cy="61" rx="3.5" ry="4" fill="${ROJO}" ${S} stroke-width="1.2"/>`,
      azul: `<path d="M41 58 q3 -3 6 0 t6 0 t6 0" fill="none" stroke="#2c5a9a" stroke-width="2.6" stroke-linecap="round"/>`
    };
    const mejillas = `<circle cx="34" cy="53" r="3.5" fill="${ROJO}" fill-opacity=".4"/><circle cx="66" cy="53" r="3.5" fill="${ROJO}" fill-opacity=".4"/>`;
    const nariz = `<path d="M50 49 q-2 4 1 5" fill="none" ${S} stroke-width="1.6"/>`;
    let extra = '';
    let o = 'normal', c = 'normal', b = 'sonrisa';
    switch (ex) {
      case 'feliz': o = 'cerrados'; c = 'arriba'; b = 'grande'; extra = `<path d="M14 26 l4 -4 M12 34 h5 M18 20 v5" fill="none" stroke="#dfa92c" stroke-width="2.2" stroke-linecap="round"/><path d="M86 26 l-4 -4 M88 34 h-5 M82 20 v5" fill="none" stroke="#dfa92c" stroke-width="2.2" stroke-linecap="round"/>`; break;
      case 'miedo': o = 'grandes'; c = 'arriba'; b = 'onda'; extra = `<path d="M22 44 l-6 -2 M22 50 l-6 2 M78 44 l6 -2 M78 50 l6 2" fill="none" ${S} stroke-width="1.6"/><ellipse cx="72" cy="36" rx="2" ry="3" fill="#86b3d4" ${S} stroke-width="1"/>`; break;
      case 'hambre': o = 'normal'; c = 'triste'; b = 'abierta'; extra = `<path d="M36 94 q14 -6 28 0" fill="none" ${S} stroke-width="1.6" stroke-dasharray="3 3"/>`; break;
      case 'sed': o = 'medio'; c = 'triste'; b = 'lengua'; extra = `<path d="M70 40 q-3 6 0 8 q3 -2 0 -8 Z" fill="#86b3d4" ${S} stroke-width="1"/>`; break;
      case 'frio': o = 'normal'; c = 'triste'; b = 'azul'; extra = `<path d="M18 60 q4 -3 8 0 t8 0 M66 60 q4 -3 8 0 t8 0" fill="none" stroke="#86b3d4" stroke-width="2" stroke-linecap="round"/><path d="M22 40 l3 -5 M78 40 l-3 -5 M20 30 l4 -3 M80 30 l-4 -3" fill="none" stroke="#86b3d4" stroke-width="1.8" stroke-linecap="round"/>`; break;
      case 'cansado': o = 'medio'; c = 'normal'; b = 'recta'; extra = `<path d="M74 22 h8 l-8 8 h8" fill="none" ${S} stroke-width="1.8"/><path d="M84 12 h6 l-6 6 h6" fill="none" ${S} stroke-width="1.5"/>`; break;
      case 'herido': o = 'cruz'; c = 'triste'; b = 'triste'; extra = `<g transform="rotate(-20 32 30)"><rect x="22" y="26" width="20" height="8" rx="2" fill="${BLANCO}" ${S} stroke-width="1.5"/><path d="M27 30 h10" stroke="${INK}" stroke-width="1" stroke-dasharray="1.5 1.5"/></g>`; break;
      case 'perdido': o = 'lado'; c = 'arriba'; b = 'onda'; extra = `<path d="M78 16 q0 -8 8 -8 q8 0 8 7 q0 5 -6 7 l-1 5" fill="none" ${S} stroke-width="2.4"/><circle cx="86" cy="32" r="1.8" fill="${INK}"/>`; break;
      case 'enfadado': o = 'normal'; c = 'enfadado'; b = 'triste'; extra = `<path d="M20 24 l-4 -6 M26 20 l-2 -7 M80 24 l4 -6 M74 20 l2 -7" fill="none" stroke="${ROJO}" stroke-width="2.2" stroke-linecap="round"/>`; break;
      default: break;
    }
    return ojos[o] + cejas[c] + nariz + bocas[b] + mejillas + extra;
  }

  function humano(p, ex) {
    const brazos = ex === 'feliz'
      ? `<path d="M30 80 L14 56" ${S} stroke-width="10"/><path d="M30 80 L14 56" stroke="${p.color}" stroke-width="6" stroke-linecap="round"/><circle cx="13" cy="54" r="5.5" fill="${p.piel}" ${S}/>
         <path d="M70 80 L86 56" ${S} stroke-width="10"/><path d="M70 80 L86 56" stroke="${p.color}" stroke-width="6" stroke-linecap="round"/><circle cx="87" cy="54" r="5.5" fill="${p.piel}" ${S}/>`
      : ex === 'frio' || ex === 'miedo'
        ? `<path d="M30 80 Q22 96 40 100" fill="none" ${S} stroke-width="10"/><path d="M30 80 Q22 96 40 100" fill="none" stroke="${p.color}" stroke-width="6" stroke-linecap="round"/><circle cx="42" cy="100" r="5.5" fill="${p.piel}" ${S}/>
           <path d="M70 80 Q78 96 60 100" fill="none" ${S} stroke-width="10"/><path d="M70 80 Q78 96 60 100" fill="none" stroke="${p.color}" stroke-width="6" stroke-linecap="round"/><circle cx="58" cy="100" r="5.5" fill="${p.piel}" ${S}/>`
        : `<path d="M30 80 L22 106" ${S} stroke-width="10"/><path d="M30 80 L22 106" stroke="${p.color}" stroke-width="6" stroke-linecap="round"/><circle cx="21" cy="108" r="5.5" fill="${p.piel}" ${S}/>
           <path d="M70 80 L78 106" ${S} stroke-width="10"/><path d="M70 80 L78 106" stroke="${p.color}" stroke-width="6" stroke-linecap="round"/><circle cx="79" cy="108" r="5.5" fill="${p.piel}" ${S}/>`;
    return `
      <rect x="36" y="108" width="10" height="30" rx="3" fill="#2c3550" ${S}/><rect x="54" y="108" width="10" height="30" rx="3" fill="#2c3550" ${S}/>
      <ellipse cx="40" cy="140" rx="9" ry="4.5" fill="${INK}"/><ellipse cx="60" cy="140" rx="9" ry="4.5" fill="${INK}"/>
      <path d="M30 74 Q30 68 38 68 H62 Q70 68 70 74 V112 H30 Z" fill="${p.color}" ${S}/>
      ${brazos}
      ${accesorio(p)}
      <path d="M44 62 V70 H56 V62 Z" fill="${p.piel}" stroke="none"/>
      <circle cx="50" cy="45" r="24" fill="${p.piel}" ${S}/>
      ${pelo(p)}
      ${cara(p, ex)}`;
  }
  function loro(p, ex) {
    const ojo = ex === 'miedo' ? `<circle cx="60" cy="56" r="5" fill="${BLANCO}" ${S} stroke-width="1.5"/><circle cx="60" cy="56" r="2.2" fill="${INK}"/>`
      : ex === 'feliz' || ex === 'cansado' ? `<path d="M56 57 q4 3 8 0" fill="none" ${S} stroke-width="2"/>` : `<circle cx="60" cy="56" r="2.8" fill="${INK}"/>`;
    return `
      <path d="M30 100 L18 128 L34 118 L30 136 L44 112 Z" fill="${ROJO}" ${S}/>
      <ellipse cx="50" cy="92" rx="22" ry="30" fill="${p.color}" ${S}/>
      <path d="M34 80 Q20 100 30 118 Q44 104 44 84 Z" fill="#2f6a2c" ${S}/>
      <circle cx="54" cy="56" r="20" fill="${p.color}" ${S}/>
      <path d="M72 54 Q86 56 80 68 Q72 70 70 62 Z" fill="#dfa92c" ${S}/>
      <path d="M70 60 h6" ${S} stroke-width="1.5"/>
      <ellipse cx="60" cy="56" rx="7" ry="8" fill="${BLANCO}" ${S} stroke-width="1.5"/>
      ${ojo}
      <path d="M44 120 l-6 14 M50 122 l0 15 M56 120 l6 14" fill="none" ${S} stroke-width="3"/>
      ${ex === 'perdido' ? `<path d="M78 16 q0 -8 8 -8 q8 0 8 7 q0 5 -6 7 l-1 5" fill="none" ${S} stroke-width="2.4"/><circle cx="86" cy="32" r="1.8" fill="${INK}"/>` : ''}`;
  }

  function personajeSVG(p, expresion, opts) {
    opts = opts || {};
    const ex = expresion || 'contento';
    const cuerpo = p.animal ? loro(p, ex) : humano(p, ex);
    const cls = opts.clase ? ` class="${opts.clase}"` : '';
    return `<svg${cls} viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" aria-label="${p.nombre}" role="img">${cuerpo}</svg>`;
  }

  /* Pequeño retrato (ficha de personaje) */
  function retratoSVG(p) {
    const inner = p.animal ? loro(p, 'contento') : humano(p, 'contento');
    return `<svg viewBox="10 8 80 70" xmlns="http://www.w3.org/2000/svg" aria-label="${p.nombre}" role="img">${inner}</svg>`;
  }
  return { personajeSVG, retratoSVG };
});
