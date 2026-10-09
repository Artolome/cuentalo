/* Cuéntalo — silhouettes de carnet d'aventure, dessinées en SVG.
   Contours bruns, aplats gouachés et visages expressifs ; aucun fichier externe.
   personajeSVG(p, expresion, opts) → string SVG (viewBox 0 0 100 150).
   Les états du moteur restent lisibles sur les décors peints. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SVArtePersonajes = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const INK = '#51463c', PAPER = '#f5ecd7', ROSE = '#be786b', BLUE = '#7fa5a9';
  const S = `stroke="${INK}" stroke-width="1.15" stroke-linejoin="round" stroke-linecap="round"`;
  const F = `stroke="${INK}" stroke-width=".95" stroke-linejoin="round" stroke-linecap="round" fill="none"`;
  const PALETAS = {
    lucia: { ropa: '#b97a79', sombra: '#8e6065', pantalón: '#747b60', zapato: '#69564a', pelo: '#3b342f' },
    mateo: { ropa: '#668795', sombra: '#4d6879', pantalón: '#a18e68', zapato: '#655c50', pelo: '#38372f' },
    valeria: { ropa: '#c7a264', sombra: '#a27f4d', pantalón: '#727b60', zapato: '#76604b', pelo: '#41372f' },
    diego: { ropa: '#978894', sombra: '#746875', pantalón: '#75818a', zapato: '#66564d', pelo: '#765542' }
  };
  function paleta(p) {
    return PALETAS[p.id] || { ropa: p.color, sombra: INK, pantalón: '#78816b', zapato: '#69564a', pelo: p.pelo };
  }

  function peloDetras(p, c) {
    if (p.id === 'valeria') return `<path d="M32 34 C28 43 31 60 27 72 Q31 75 37 72 L42 49 61 49 65 73 Q72 76 76 70 C67 56 73 37 66 26 Z" fill="${c}" ${S}/>
      <path d="M34 46 Q35 62 31 69 M67 44 Q66 58 70 67" fill="none" stroke="#74604b" stroke-width=".9" opacity=".65"/>`;
    if (p.id === 'lucia') return `<path d="M34 35 C26 29 23 38 27 43 Q31 47 36 42 M65 36 C70 30 77 37 72 43 Q68 47 64 42" fill="${c}" ${S}/>`;
    return '';
  }

  function pelo(p, c) {
    switch (p.id) {
      case 'lucia': return `<path d="M32 35 C29 19 43 15 52 17 C63 15 72 24 68 36 L64 34 63 28 Q57 35 52 31 L52 27 Q42 34 35 30 L35 38 Z" fill="${c}" ${S}/>
        <path d="M30 28 C30 16 42 13 52 15 C61 15 67 20 67 28 Q49 23 30 31 Z" fill="#b9797e" ${S}/>
        <path d="M44 28 Q65 23 79 29 Q81 31 77 33 L56 32 42 31 Z" fill="#d59b93" ${S}/>
        <path d="M46 17 Q41 20 41 25 M53 17 Q60 20 61 24" ${F} opacity=".35"/>
        <path d="M29 40 l5 -1 M68 41 l4 -1" stroke="#c7986b" stroke-width="2.5"/>`;
      case 'mateo': return `<path d="M32 36 C27 29 30 20 38 17 L43 18 46 13 50 16 59 14 60 19 C68 19 71 25 68 36 L64 39 63 28 Q59 32 55 30 L56 24 Q46 31 37 29 L36 39 Z" fill="${c}" ${S}/>
        <path d="M37 23 Q44 24 48 20 M53 21 Q59 19 63 23" fill="none" stroke="#7a7158" stroke-width="1" opacity=".65"/>`;
      case 'valeria': return `<path d="M31 37 C29 26 32 19 42 16 C58 9 73 24 69 37 L64 41 64 27 Q57 34 43 30 L38 28 36 42 Z" fill="${c}" ${S}/>
        <path d="M34 25 Q49 13 65 26 L66 29 Q49 17 33 29 Z" fill="#d5b97f" ${S}/>
        <path d="M62 28 L70 32 69 40 65 32 61 31 Z" fill="#b89860" ${S}/>
        <path d="M39 24 Q47 18 53 20" fill="none" stroke="#877052" stroke-width="1" opacity=".65"/>`;
      case 'diego': return `<path d="M32 37 C27 35 26 29 30 26 C27 20 33 17 37 18 C39 12 45 14 48 16 C53 10 60 15 60 18 C68 16 72 22 68 27 C74 30 70 37 65 39 L63 30 Q58 32 55 26 Q50 32 45 27 Q40 33 35 29 L36 39 Z" fill="${c}" ${S}/>
        <path d="M33 24 q4 -4 7 0 M43 21 q4 -4 8 0 M56 22 q5 -4 8 1" fill="none" stroke="#a7815d" stroke-width="1.2" opacity=".7"/>`;
      default: return `<path d="M32 37 C26 13 74 11 68 37 L63 28 Q49 35 36 28 Z" fill="${c}" ${S}/>`;
    }
  }

  function cara(ex) {
    const eye = (x, side) => `<path d="M${x - 3.2} 40 Q${x} 37.5 ${x + 3.2} 40 Q${x} 43.4 ${x - 3.2} 40 Z" fill="${PAPER}"/>
      <ellipse cx="${x + (side ? 1 : 0)}" cy="40.2" rx="1.7" ry="2.3" fill="${INK}"/><circle cx="${x + .45}" cy="39.3" r=".55" fill="${PAPER}"/>
      <path d="M${x - 3.2} 40 Q${x} 37.2 ${x + 3.2} 40" ${F}/>`;
    const eyes = {
      normal: eye(43, false) + eye(58, false),
      lado: eye(43, true) + eye(58, true),
      grandes: `<ellipse cx="43" cy="40" rx="3.3" ry="4" fill="${PAPER}" ${S}/><ellipse cx="58" cy="40" rx="3.3" ry="4" fill="${PAPER}" ${S}/><ellipse cx="43" cy="40.5" rx="1.6" ry="2.3" fill="${INK}"/><ellipse cx="58" cy="40.5" rx="1.6" ry="2.3" fill="${INK}"/>`,
      cerrados: `<path d="M39.5 40 q3.5 3.5 7 0 M54.5 40 q3.5 3.5 7 0" ${F}/>`,
      medio: `<path d="M39.5 39.5 l7 .3 M54.5 39.7 l7 -.2 M41 41 q2 1.5 4 0 M56 41 q2 1.5 4 0" ${F}/>`
    };
    const brows = {
      normal: `<path d="M39 35.5 q4 -1.8 8 -.3 M54 35.1 q4 -1.4 8 .4" ${F}/>`,
      arriba: `<path d="M39 33.3 q4 -2.5 8 -1 M54 32.2 q4 -1.1 8 1.1" ${F}/>`,
      triste: `<path d="M39 36 q4 0 8 -2.5 M54 33.5 q4 2.5 8 2.5" ${F}/>`,
      enfadado: `<path d="M39 34 l8 3 M54 37 l8 -3" ${F}/>`
    };
    const mouths = {
      sonrisa: `<path d="M46 49 q4.8 4 9.5 -.4" ${F}/><path d="M49 53 h3" stroke="${ROSE}" stroke-width=".65"/>`,
      grande: `<path d="M44 48 Q51 53 58 48 Q56 58 50 57 Q45 56 44 48 Z" fill="${INK}"/><path d="M47 54 Q51 51.8 55 54 L54 56 49 56 Z" fill="${ROSE}"/>`,
      recta: `<path d="M46.5 51 q4 -1 8 0" ${F}/>`,
      triste: `<path d="M46 52 q5 -3.5 10 0" ${F}/>`,
      abierta: `<ellipse cx="51" cy="51" rx="3.1" ry="3.8" fill="${INK}"/>`,
      onda: `<path d="M45 51 q2 -2 4 0 t4 0 t4 0" ${F}/>`,
      lengua: `<path d="M46 49 q5 4 10 -.2" ${F}/><path d="M49.5 51 v3.5 q3 3 4 0 V51" fill="${ROSE}" stroke="${INK}" stroke-width=".6"/>`,
      azul: `<path d="M45 51 q2 -2 4 0 t4 0 t4 0" stroke="#648a98" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
    };
    let o = 'normal', c = 'normal', b = 'sonrisa', extra = '';
    switch (ex) {
      case 'feliz': o = 'cerrados'; c = 'arriba'; b = 'grande';
        extra = `<path d="M24 26 l-3 -4 M22 33 l-5 -1 M77 26 l3 -4 M79 33 l5 -1" fill="none" stroke="#c0a366" stroke-width="1.5" stroke-linecap="round"/>`; break;
      case 'miedo': o = 'grandes'; c = 'arriba'; b = 'onda';
        extra = `<path d="M25 41 l-4 -2 M24 47 l-4 1 M76 41 l4 -2 M77 47 l4 1" ${F}/><path d="M66 36 q-3 5 0 7 q3 -2 0 -7" fill="${BLUE}"/>`; break;
      case 'hambre': c = 'triste'; b = 'abierta';
        extra = `<path d="M40 91 q10 -5 21 0 M39 95 q11 -4 22 0" ${F} stroke-dasharray="2 3" opacity=".65"/>`; break;
      case 'sed': o = 'medio'; c = 'triste'; b = 'lengua';
        extra = `<path d="M67 34 q-4 7 0 9 q4 -2 0 -9 Z" fill="${BLUE}" stroke="#627c7a" stroke-width=".6"/>`; break;
      case 'frio': c = 'triste'; b = 'azul';
        extra = `<path d="M22 49 q-4 4 0 8 t0 8 M78 49 q4 4 0 8 t0 8 M24 77 q-4 4 0 8 M76 77 q4 4 0 8" fill="none" stroke="${BLUE}" stroke-width="1.4" stroke-linecap="round"/>`; break;
      case 'cansado': o = 'medio'; b = 'recta';
        extra = `<path d="M74 23 h6 l-6 7 h6 M82 14 h4 l-4 5 h4" ${F}/>`; break;
      case 'herido': o = 'medio'; c = 'triste'; b = 'triste';
        extra = `<g transform="rotate(-19 37 46)"><rect x="32" y="43.5" width="10" height="5" rx="1.6" fill="${PAPER}" stroke="#b8997c" stroke-width=".65"/><path d="M36 44.2 v3.5 M38 44.2 v3.5" stroke="#b8997c" stroke-width=".5"/></g>`; break;
      case 'perdido': o = 'lado'; c = 'arriba'; b = 'onda';
        extra = `<path d="M76 20 q0 -7 6 -7 q7 0 7 6 q0 4 -5 6 l-1 4" ${F}/><circle cx="82.5" cy="33" r="1.2" fill="${INK}"/>`; break;
      case 'enfadado': c = 'enfadado'; b = 'triste';
        extra = `<path d="M26 24 l-3 -5 M75 24 l3 -5" fill="none" stroke="${ROSE}" stroke-width="1.3"/>`; break;
      case 'triste': c = 'triste'; b = 'triste'; break;
      default: break;
    }
    return `<ellipse cx="38" cy="46.3" rx="3.7" ry="1.7" fill="${ROSE}" opacity=".27"/><ellipse cx="63.5" cy="46.1" rx="3.7" ry="1.7" fill="${ROSE}" opacity=".27"/>
      ${eyes[o]}${brows[c]}<path d="M51 42 l-1.2 3.5 1.9 .7" fill="none" stroke="#885f4e" stroke-width=".65" stroke-linecap="round"/>${mouths[b]}${extra}`;
  }

  function brazos(p, ex, c) {
    if (ex === 'feliz') return `<path d="M36 68 Q29 63 26 52 L20 48 18 51 Q24 73 31 80 L39 77 Z" fill="${c.ropa}" ${S}/>
      <path d="M65 67 Q72 61 75 50 L81 48 83 52 Q79 69 70 78 L62 75 Z" fill="${c.ropa}" ${S}/>
      <path d="M19 52 Q15 47 15 43 Q15 39 18 42 L20 45 Q21 39 23 41 L25 50 23 54 Z M76 51 L77 44 Q78 40 80 43 L81 45 Q83 39 85 42 Q87 47 82 52 Z" fill="${p.piel}" ${S}/>`;
    return `<path d="M36 66 Q30 67 28 78 L24 96 31 99 41 74 Z M65 66 Q71 67 74 81 L78 98 71 101 61 76 Z" fill="${c.ropa}" ${S}/>
      <path d="M25 94 Q22 99 23 107 Q25 110 27 107 L28 101 29 103 Q32 105 32 102 L31 96 Z M71 96 Q72 106 75 109 Q78 110 79 106 L78 98 Z" fill="${p.piel}" ${S}/>
      <path d="M28 90 l5 2 M69 91 l6 -2" ${F} opacity=".4"/>`;
  }
  function accesorio(p, c) {
    switch (p.id) {
      case 'lucia': return `<path d="M40 68 q10 8 20 -1 M43 81 q5 3 11 0" ${F} opacity=".5"/><path d="M36 86 Q33 94 36 102 M63 91 l1 12" stroke="${c.sombra}" stroke-width="1" fill="none"/>`;
      case 'mateo': return `<path d="M40 66 L50 75 60 66" fill="none" stroke="${PAPER}" stroke-width="2.5"/><path d="M34 71 l-3 11 M67 71 l4 11" stroke="${PAPER}" stroke-width="1.5"/><path d="M51 84 v9 M48 85 l3 -1" stroke="${PAPER}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      case 'valeria': return `<path d="M42 65 l-3 27 M58 65 l4 27 M50 76 v26 M35 91 h8 M57 91 h9" ${F} opacity=".5"/>
        <path d="M42 65 L46 83 H56 L60 66" ${F}/><rect x="41" y="82" width="21" height="14" rx="2.7" fill="#596461" ${S}/><path d="M44 80 h6 v3 h-6 Z" fill="#596461" ${S}/><circle cx="51.5" cy="89" r="5" fill="#9cac9e" stroke="#d4c6a3" stroke-width="1.1"/><circle cx="51.5" cy="89" r="3" fill="#526770"/><circle cx="53" cy="87.6" r="1" fill="${PAPER}" opacity=".7"/>`;
      case 'diego': return `<path d="M42 65 L48 79 57 65 55 103 45 103 Z" fill="${PAPER}" opacity=".8"/><path d="M43 66 l-3 12 5 1 M57 65 l5 13 -6 1" ${F}/>
        <g transform="rotate(-9 71 104)"><path d="M64 91 h16 q2 0 2 2 v25 H64 Z" fill="#cbb795" ${S}/><path d="M67 93 h12 v22 H67 Z" fill="${PAPER}"/><path d="M67 98 l5 -2 4 4 -7 4 7 4" fill="none" stroke="#aaa17e" stroke-width=".8"/><path d="M64 92 v24" stroke="#8b735c" stroke-width="2"/></g>`;
      default: return '';
    }
  }

  function humano(p, ex) {
    const c = paleta(p), cruzado = ex === 'frio' || ex === 'miedo';
    return `<ellipse cx="51" cy="144" rx="23" ry="3.1" fill="#625b45" opacity=".14"/>
      ${peloDetras(p, c.pelo)}
      <path d="M35 100 L49 101 46 127 44 139 35 139 36 122 Z M50 102 L64 100 65 120 64 140 55 140 54 126 Z" fill="${c.pantalón}" ${S}/>
      <path d="M40 113 l1 16 M57 112 l2 18" stroke="${INK}" stroke-width=".75" opacity=".28" fill="none"/>
      <path d="M35 136 L45 137 44 143 Q38 146 29 143 Q29 139 35 136 Z M55 137 L64 137 Q70 139 71 143 Q65 146 55 143 Z" fill="${c.zapato}" ${S}/>
      <path d="M31 142 h12 M57 142 h12" stroke="#baac91" stroke-width=".8"/>
      ${brazos(p, ex, c)}
      <path d="M37 65 Q42 62 49 63 Q58 61 64 65 L67 82 65 106 Q52 110 34 105 L35 82 Z" fill="${c.ropa}" ${S}/>
      <path d="M60 66 Q61 90 57 105 L65 105 67 82 64 65 Z" fill="${c.sombra}" opacity=".24"/>
      <path d="M37 103 Q50 106 63 104" ${F} opacity=".3"/>
      <path d="M44 54 L44 65 Q50 73 57 64 L56 54 Z" fill="${p.piel}" ${S}/>
      <path d="M45 55 v6 q6 4 11 0 v-6 Z" fill="#98694f" opacity=".25"/>
      ${accesorio(p, c)}
      ${cruzado ? `<path d="M29 82 Q25 95 40 98 L57 89 55 84 39 89 36 79 M71 80 Q77 94 63 99 L45 92 48 86 63 90 65 80" fill="${c.ropa}" ${S}/><path d="M53 85 q7 -5 10 -2 l-3 6 -5 1 M49 88 q-7 -5 -9 -2 l4 6 5 1" fill="${p.piel}" ${S}/>` : ''}
      <path d="M35 37 Q29 33 30 41 Q30 46 35 46 M65 37 Q71 34 70 41 Q70 46 65 45" fill="${p.piel}" ${S}/>
      <path d="M33 29 C35 19 62 17 67 30 L66 44 Q64 57 51 61 Q38 58 34 47 Z" fill="${p.piel}" ${S}/>
      <path d="M62 28 Q67 43 59 54 L51 60 Q64 57 66 44 L67 30 Z" fill="#996e51" opacity=".14"/>
      <path d="M37 32 Q41 23 51 24 Q59 22 63 30" fill="none" stroke="${PAPER}" stroke-width="2" opacity=".14"/>
      ${pelo(p, c.pelo)}${cara(ex)}`;
  }

  /* Kiwi : un toucan de la forêt, reconnaissable à son grand bec ocre. */
  function toucan(p, ex) {
    const sleepy = ex === 'cansado' || ex === 'feliz', afraid = ex === 'miedo';
    return `<ellipse cx="46" cy="141" rx="25" ry="3" fill="#625b45" opacity=".14"/>
      <path d="M32 102 L23 135 33 130 36 138 44 108 Z" fill="#485d52" ${S}/>
      <path d="M36 56 C20 62 22 111 37 125 Q56 135 65 108 L65 74 Z" fill="#3e514b" ${S}/>
      <path d="M48 61 Q63 67 61 90 Q47 104 39 84 Q37 69 48 61 Z" fill="#ead7a5"/>
      <path d="M30 81 Q19 99 31 118 Q48 110 47 83 Q41 73 30 81 Z" fill="#657a58" ${S}/>
      <path d="M29 92 q3 10 1 18 M35 89 q4 10 1 22 M41 88 q3 8 -1 16" fill="none" stroke="#96a27b" stroke-width=".9" opacity=".7"/>
      <path d="M35 61 C27 48 36 32 50 32 C65 32 72 42 67 59 Q59 71 44 68 Z" fill="#43554a" ${S}/>
      <path d="M48 42 Q58 36 67 43 L67 60 Q57 71 45 62 Z" fill="#ead7a5"/>
      <path d="M64 42 Q82 34 93 45 Q96 51 92 60 L66 57 Z" fill="#cfaa62" ${S}/>
      <path d="M66 51 L94 51 91 60 66 57 Z" fill="#b98252"/>
      <path d="M86 41 Q96 46 93 57 L88 58 Q91 48 86 41 Z" fill="#675543"/>
      <path d="M67 53 L90 54" ${F}/>
      <path d="M69 43 Q80 39 87 44" fill="none" stroke="#ead29b" stroke-width="2" opacity=".6"/>
      <ellipse cx="55" cy="48" rx="6.7" ry="7" fill="#8caa92"/>
      ${sleepy ? `<path d="M51 49 q4 3 8 -1" ${F}/>` : `<ellipse cx="55" cy="48" rx="${afraid ? 4 : 2.8}" ry="${afraid ? 4.6 : 3.5}" fill="${INK}"/><circle cx="56" cy="46.6" r="1" fill="${PAPER}"/>`}
      ${ex === 'enfadado' ? `<path d="M50 42 l9 3" ${F}/>` : ''}
      <path d="M40 123 l-2 13 -7 3 M38 136 l6 3 M53 124 l2 12 -5 3 M55 136 l7 3" fill="none" stroke="#897b5d" stroke-width="2" stroke-linecap="round"/>
      ${ex === 'perdido' ? `<path d="M23 30 q-1 -6 5 -7 q7 0 7 5 q0 4 -5 6 v3" ${F}/><circle cx="30" cy="42" r="1.2" fill="${INK}"/>` : ''}
      ${ex === 'sed' || ex === 'miedo' ? `<path d="M39 40 q-4 6 0 8 q4 -2 0 -8" fill="${BLUE}"/>` : ''}
      ${ex === 'frio' ? `<path d="M18 69 q-4 5 0 10 t0 10 M73 77 q4 4 0 8" fill="none" stroke="${BLUE}" stroke-width="1.4"/>` : ''}
      ${ex === 'herido' ? `<path d="M32 91 l13 6 -3 6 -13 -6 Z" fill="${PAPER}" stroke="#b8997c" stroke-width=".7"/>` : ''}`;
  }

  function personajeSVG(p, expresion, opts) {
    opts = opts || {};
    const ex = expresion || 'contento';
    const cuerpo = p.animal ? toucan(p, ex) : humano(p, ex);
    const cls = opts.clase ? ` class="${opts.clase}"` : '';
    return `<svg${cls} viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" aria-label="${p.nombre}" role="img">${cuerpo}</svg>`;
  }
  function retratoSVG(p) {
    const inner = p.animal ? toucan(p, 'contento') : humano(p, 'contento');
    const box = p.animal ? '23 25 74 69' : '22 11 57 64';
    return `<svg viewBox="${box}" xmlns="http://www.w3.org/2000/svg" aria-label="${p.nombre}" role="img">${inner}</svg>`;
  }
  return { personajeSVG, retratoSVG };
});
