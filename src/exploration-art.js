/* Petits accessoires originaux. Les décors et les personnages restent peints. */
(function () {
  'use strict';
  window.SVExplorationArt = function (o) {
    const colors = {rojo:'#d45355',roja:'#d45355',red:'#d45355',azul:'#5299c0',blue:'#5299c0',amarillo:'#edc75c',yellow:'#edc75c',verde:'#719c64',green:'#719c64',rosa:'#df8a9c',pink:'#df8a9c',blanco:'#fff4d6',white:'#fff4d6',violeta:'#9a83c2',purple:'#9a83c2',orange:'#e69b54',naranja:'#e69b54'};
    const c = colors[o.color] || (/^#[0-9a-f]{3,8}$/i.test(o.color || '') ? o.color : '#e8b955');
    const art = {
      flower:'<path d="M50 86Q58 60 48 39M51 69Q27 71 28 54Q43 53 51 69M53 62Q76 61 72 44Q57 47 53 62" fill="#789660"/><g fill="'+c+'"><ellipse cx="49" cy="28" rx="10" ry="16"/><ellipse cx="37" cy="38" rx="16" ry="10" transform="rotate(27 37 38)"/><ellipse cx="58" cy="40" rx="16" ry="11" transform="rotate(-24 58 40)"/><ellipse cx="49" cy="49" rx="11" ry="14"/></g><circle cx="49" cy="39" r="8" fill="#f8d66c"/>',
      paint:'<path d="M31 43h39l-4 42H36Z" fill="'+c+'"/><path d="M29 43q20-9 43 0v8H29Z" fill="#fff0cd"/><path d="M52 48L65 14l7 3-10 33" fill="#c48b4f"/><path d="m65 14 3-8 8 3-4 9" fill="'+c+'"/><path d="M42 63h17v10H42Z" fill="#fff0cd"/>',
      canvas:'<path d="M30 94 47 5h7l19 89M25 72h55" fill="none" stroke-width="6"/><path d="M22 15h58v57H22Z" fill="#f8efd8"/><g class="x-painted"><path d="M26 66 46 39 62 55 76 35v33Z" fill="#82a477"/><circle cx="41" cy="31" r="8" fill="#e5ae50"/><path d="M49 67Q45 44 57 43Q73 45 69 67" fill="#d57368"/></g>',
      book:'<path d="M22 21 68 14q7 0 7 7v60l-49 7q-10-3-10-11V30q0-7 6-9Z" fill="'+c+'"/><path d="m27 27 41-6v53l-41 6Q15 77 18 86M27 28v51" fill="none"/><path d="m36 38 23-3m-23 12 23-3m-23 12 16-2" stroke="#f9ecc5" stroke-width="4"/>',
      star:'<path d="m50 10 12 26 29 4-21 21 5 29-25-14-26 14 5-29L9 40l29-4Z" fill="'+c+'"/><path d="m49 27 6 15 18 3" fill="none" stroke="#fff1b7" stroke-width="5"/>',
      butterfly:'<g fill="'+c+'"><path d="M49 48Q17 1 13 27Q8 58 42 58Q17 58 22 79Q32 95 49 65Z"/><path d="M51 48Q83 1 87 27Q92 58 58 58Q83 58 78 79Q68 95 51 65Z"/></g><path d="M50 42v29m0-27-9-13m9 13 9-13" fill="none" stroke-width="5"/>',
      key:'<path d="m49 43 29 34-8 9-10-12-7 6-7-9 7-6-16-17" fill="#dbad53"/><circle cx="34" cy="31" r="21" fill="#eac56a"/><circle cx="34" cy="31" r="10" fill="#f9eac6"/>',
      bell:'<path d="M46 20v-7q4-7 9 0v7M29 70h44l-8-16V37q-15-27-30 0v17Z" fill="#e8bc5b"/><path d="M25 70h52v8H25Z" fill="#edc871"/><circle cx="51" cy="82" r="8" fill="#a87343"/><path d="M43 33q-7 9-4 23" fill="none" stroke="#fff0b0" stroke-width="5"/>',
      tree:'<path d="M43 89h17l-4-46H47Z" fill="#af784b"/><path d="M51 8Q21 3 24 27Q4 38 19 54Q31 67 51 58Q75 69 84 50Q94 33 76 25Q79 5 51 8Z" fill="#7a9a65"/><path d="M25 40q10 6 20-2m12-13q12-7 17 4" fill="none" stroke="#a9bc7c" stroke-width="5"/>',
      fruit:'<path d="M50 32q-9-17 4-26M53 21q21-20 24 0-15 7-24 0" fill="#7d9d5c"/><path d="M50 34Q20 22 19 55Q15 85 42 89l8-3 10 3q29-4 23-35Q81 25 50 34Z" fill="'+c+'"/><path d="M32 45q-8 8-5 20" fill="none" stroke="#fff1b9" stroke-width="5"/>',
      letter:'<path d="M12 26h76v53H12Z" fill="#fcf0cf"/><path d="m13 27 37 31 37-31M13 78l26-29m48 29L62 49" fill="none"/><circle cx="50" cy="56" r="8" fill="#c9715b"/>',
      bench:'<path d="M16 39h70v28H16Z" fill="#b88553"/><path d="M12 68h78v9H12Zm8 9v15h8V77m47 0v15h8V77" fill="#986b46"/><path d="M20 49h62m-62 9h62" fill="none"/>',
      well:'<path d="M20 55q30-14 60 0v29q-30 16-60 0Z" fill="#c0ae83"/><ellipse cx="50" cy="55" rx="30" ry="11" fill="#5c8b94"/><path d="M25 50V19m50 31V19M14 23 49 4l38 19Z" fill="#b57d50"/><path d="M50 24v36M21 70h58M40 60v12m20 0v16" fill="none"/>',
      lamp:'<path d="M44 13h12V6H44Zm-10 8h32l8 60H26Z" fill="#b18c53"/><path d="M35 28h30l4 45H31Z" fill="#f6d77d"/><path d="M50 35q-20 25 0 30 19-4 0-30" fill="#ffedb1"/><path d="M21 82h58v7H21Z" fill="#947047"/>',
      mill:'<path d="m32 43-7 49h49l-7-49Z" fill="#efe0b7"/><path d="m28 43 22-17 23 17Z" fill="#a76d44"/><path d="M44 93V72q7-10 13 0v21" fill="#6f6d5c"/><g class="x-sails" fill="#d6ad68"><path d="m47 43-29-25 8-8 24 31 27-30 9 9-32 25 29 29-8 8-26-33-28 32-9-9Z"/></g><circle cx="50" cy="45" r="5" fill="#8a633d"/>',
      horse:'<path d="M22 44Q47 26 67 47l7-24-5-15 13 7 5-8 8 19-8 19-10 11-4 31h-9V65H38l-4 23h-9l-1-30Q10 75 6 60" fill="#b6a17b"/><path d="M75 25q-16 10-12 24M37 42h24v18H37Z" fill="#8c6d46"/><circle cx="85" cy="27" r="2"/>',
      door:'<path d="M23 92V30Q23 5 50 5t27 25v62Z" fill="#d1b081"/><path d="M31 92V32q0-18 19-18t19 18v60Z" fill="'+(o.color?c:'#996d49')+'"/><path d="M42 27v59m16-60v60" fill="none"/><circle cx="61" cy="56" r="4" fill="#efc76c"/>'
    };
    return '<svg viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="#66513f" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">'+(art[o.kind] || art.star)+'</svg>';
  };
})();
