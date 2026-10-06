/* Sobrevives — motor puro y determinista (sin DOM). Funciona en Node y en el navegador (window.SVEngine).
   simular(nivel, viñetas, opts) → { viñetas:[{frases, eventos}], estado, eventos, resuelto, secreto, porque, valido, incompleto }
   resolver(nivel, opts)        → { total, soluciones:[...], secretas, ambas, estados }
   tituloDe(objetivo, nivel)    → título en español generado desde el predicado
*/
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./lengua.js'), require('./contenido.js'));
  else root.SVEngine = factory(root.SVLengua, root.SVContenido);
})(typeof self !== 'undefined' ? self : this, function (L, C) {
  'use strict';

  const NEGATIVOS = ['hambre', 'sed', 'frio', 'miedo', 'cansado', 'herido', 'perdido'];
  const POR_ID = {};
  for (const p of C.PERSONAJES) POR_ID[p.id] = p;
  const ESCENA = {};
  for (const e of C.ESCENAS) ESCENA[e.id] = e;
  const ORDEN = {};
  C.PERSONAJES.forEach((p, i) => { ORDEN[p.id] = i; });

  const P = id => POR_ID[id];
  const Ps = ids => ids.map(P);
  const ordenar = ids => ids.slice().sort((a, b) => ORDEN[a] - ORDEN[b]);

  /* ---------- estado ---------- */
  function estadoInicial(nivel) {
    const S = {};
    for (const id of nivel.personajes) {
      S[id] = { hambre: false, sed: false, frio: false, miedo: false, cansado: false, herido: false, perdido: false, salvo: false,
        objetos: {}, amigos: {}, enfadado: {} };
      const ini = nivel.inicial && nivel.inicial[id];
      if (ini) {
        for (const k in ini) {
          if (k === 'objetos') for (const o of ini.objetos) S[id].objetos[o] = true;
          else if (k === 'amigos' || k === 'enfadado') S[id][k] = Object.assign({}, ini[k]); // copia: nunca compartir con nivel.inicial
          else S[id][k] = ini[k];
        }
      }
    }
    return S;
  }
  /** Historial vacío, sembrado con los estados negativos iniciales (para yaNo / nunca). */
  function historialInicial(nivel, S) {
    const alguna = {};
    for (const id of nivel.personajes) { alguna[id] = {}; for (const k of NEGATIVOS) if (S[id][k]) alguna[id][k] = true; }
    return { alguna, eventos: [], invalido: false, salen: {} };
  }
  function clonar(S) {
    const T = {};
    for (const id in S) {
      const s = S[id];
      T[id] = Object.assign({}, s, { objetos: Object.assign({}, s.objetos), amigos: Object.assign({}, s.amigos), enfadado: Object.assign({}, s.enfadado) });
    }
    return T;
  }
  function contento(s) {
    return !NEGATIVOS.some(k => s[k]) && Object.keys(s.enfadado).length === 0;
  }
  function valor(s, estado) {
    if (estado === 'contento') return contento(s);
    return !!s[estado];
  }
  /** Expresión de la cara según el estado (prioridad). */
  function expresion(s) {
    if (s.salvo) return 'feliz';
    if (s.herido) return 'herido';
    if (s.miedo) return 'miedo';
    if (Object.keys(s.enfadado).length) return 'enfadado';
    if (s.perdido) return 'perdido';
    if (s.frio) return 'frio';
    if (s.hambre) return 'hambre';
    if (s.sed) return 'sed';
    if (s.cansado) return 'cansado';
    return 'contento';
  }

  /* ---------- paso: aplica una viñeta ----------
     ctx = { S, hist:{alguna:{id:{estado:true}}, eventos:[], invalido:false}, tiempo } */
  function paso(ctx, panel, indice) {
    const S = ctx.S, esc = panel.escena;
    const ids = ordenar([...new Set(panel.personajes || [])]); // sin repetidos
    const evs = [];
    const ev = (tipo, datos) => { const e = Object.assign({ tipo, viñeta: indice, escena: esc }, datos || {}); evs.push(e); ctx.hist.eventos.push(e); };
    const marca = () => { for (const id of ids) for (const k of NEGATIVOS) if (S[id][k]) ctx.hist.alguna[id][k] = true; };
    const set = (id, k, v) => { S[id][k] = v; if (v && NEGATIVOS.includes(k)) ctx.hist.alguna[id][k] = true; };
    const haceAmigos = () => { // amistad nueva → evento visible («Ahora X y Y son amigos.»)
      if (ids.length !== 2 || S[ids[0]].amigos[ids[1]]) return;
      S[ids[0]].amigos[ids[1]] = true; S[ids[1]].amigos[ids[0]] = true;
      ev('amigos', { quienes: ids });
    };
    const tiene = (id, o) => !!S[id].objetos[o];
    const alguienTiene = o => ids.some(id => tiene(id, o));
    const quienes = k => ids.filter(id => S[id][k]);

    if (!esc || !ids.length) return evs; // viñeta incompleta
    if (ESCENA[esc] && ids.length > ESCENA[esc].slots) { ctx.hist.invalido = true; ev('demasiados', { quienes: ids }); return evs; }
    for (const id of ids) ctx.hist.salen[id] = true;

    // 0. Un personaje ya a salvo no puede seguir en la historia.
    const yaSalvo = ids.filter(id => S[id].salvo);
    if (yaSalvo.length) { ctx.hist.invalido = true; for (const id of yaSalvo) ev('yaSalvo', { quien: id }); return evs; }

    // 1. Juntos: el que no está perdido encuentra al perdido.
    if (ids.length === 2) {
      const perdidos = quienes('perdido');
      if (perdidos.length === 1) {
        const a = perdidos[0], q = ids.find(id => id !== a);
        set(a, 'perdido', false); ev('encuentra', { quien: q, a, lugar: esc });
      } else if (perdidos.length === 2) {
        for (const id of ids) set(id, 'perdido', false);
        ev('seEncuentran', { quienes: ids, lugar: esc });
      }
    }
    const encontrado = evs.length > 0;
    let amigos = ids.length === 2; // por defecto, compartir viñeta = amigos (salvo «come solo»)

    switch (esc) {
      case 'selva': {
        if (ids.length === 1) {
          const id = ids[0];
          if (tiene(id, 'mapa')) ev('noPierde', { quien: id });
          else { set(id, 'perdido', true); ev('pierde', { quien: id }); }
        } else if (!encontrado) {
          for (const id of ids) { set(id, 'hambre', true); set(id, 'cansado', true); }
          ev('caminanJuntos', { quienes: ids });
        }
        break;
      }
      case 'rio': {
        const sed = quienes('sed');
        for (const id of ids) set(id, 'sed', false);
        ev('bebe', { quienes: ids, sed });
        if (alguienTiene('cuerda')) ev('cruzaCuerda', { quienes: ids });
        else { for (const id of ids) set(id, 'frio', true); ev('cruzaMojado', { quienes: ids }); }
        break;
      }
      case 'sol': {
        for (const id of ids) set(id, 'sed', true);
        ev('calor', { quienes: ids });
        break;
      }
      case 'tormenta': {
        const manta = alguienTiene('manta'), solo = ids.length === 1;
        for (const id of ids) set(id, 'frio', !manta); // con manta: se tapa y no tiene frío (aunque viniera mojado)
        if (solo) set(ids[0], 'miedo', true);
        ev('tormenta', { quienes: ids, manta, solo });
        break;
      }
      case 'noche': {
        if (ids.length === 1) {
          const id = ids[0];
          if (tiene(id, 'linterna')) { set(id, 'miedo', false); ev('nocheLinterna', { quien: id }); }
          else { set(id, 'miedo', true); ev('nocheSolo', { quien: id }); }
        } else {
          const cansados = quienes('cansado'), miedos = quienes('miedo');
          for (const id of ids) { set(id, 'cansado', false); set(id, 'miedo', false); }
          ev('nocheJuntos', { quienes: ids, cansados, miedos });
        }
        break;
      }
      case 'jaguar': {
        if (ids.length === 1) {
          const id = ids[0], mapa = tiene(id, 'mapa');
          set(id, 'miedo', true);
          if (!mapa) set(id, 'perdido', true);
          ev('jaguarSolo', { quien: id, mapa });
        } else ev('jaguarJuntos', { quienes: ids });
        break;
      }
      case 'serpiente': {
        if (ids.length === 1) { set(ids[0], 'herido', true); ev('serpienteMuerde', { quien: ids[0] }); }
        else { // avisa el que está mejor (sin miedo ni herida); en empate, el primero del reparto
          const q = ids.find(id => !S[id].miedo && !S[id].herido) || ids[0];
          ev('serpienteAvisa', { quien: q, a: ids.find(id => id !== q) });
        }
        break;
      }
      case 'frutas': {
        const hambre = quienes('hambre');
        for (const id of ids) set(id, 'hambre', false);
        ev('comeFrutas', { quienes: ids, hambre });
        break;
      }
      case 'fuego': {
        const frio = quienes('frio');
        for (const id of ids) set(id, 'frio', false);
        // comida: se decide antes de emitir «hace fuego» para acortar esa frase si sigue otra
        const con = ids.filter(id => tiene(id, 'comida')), hambre = quienes('hambre');
        const comida = [];
        if (ids.length === 1) {
          if (con.length && hambre.length) { set(ids[0], 'hambre', false); comida.push(['comeComida', { quien: ids[0] }]); }
        } else if (con.length === 2 || con.length === 0) {
          if (con.length && hambre.length) { for (const id of ids) set(id, 'hambre', false); comida.push(['comen', { quienes: ids }]); }
        } else {
          const x = con[0], y = ids.find(id => id !== x);
          if (S[y].hambre) {
            if (S[x].amigos[y] && !S[y].enfadado[x] && !S[x].enfadado[y]) {
              for (const id of ids) set(id, 'hambre', false); comida.push(['comparte', { quien: x, a: y }]);
            } else {
              set(x, 'hambre', false); S[y].enfadado[x] = true; amigos = false; comida.push(['comeSolo', { quien: x, a: y }]);
            }
          } else if (S[x].hambre) { set(x, 'hambre', false); comida.push(['comeComida', { quien: x }]); }
        }
        ev('fuego', { quienes: ids, frio, breve: comida.length > 0 });
        for (const [t, d] of comida) ev(t, d);
        break;
      }
      case 'refugio': {
        const cansados = quienes('cansado'), miedos = quienes('miedo');
        for (const id of ids) { set(id, 'cansado', false); set(id, 'miedo', false); }
        const extra = [];
        if (ids.length === 2) {
          const heridos = quienes('herido');
          if (heridos.length === 1) { const a = heridos[0], q = ids.find(id => id !== a); set(a, 'herido', false); extra.push(['cura', { quien: q, a }]); }
          else if (heridos.length === 2) { for (const id of ids) set(id, 'herido', false); extra.push(['seCuran', { quienes: ids }]); }
          for (const y of ids) { const x = ids.find(id => id !== y); if (S[y].enfadado[x]) { delete S[y].enfadado[x]; extra.push(['perdon', { quien: x, a: y }]); } }
        }
        ev('descansa', { quienes: ids, cansados, miedos, breve: extra.length > 0 });
        for (const [t, d] of extra) ev(t, d);
        break;
      }
      case 'montana': {
        const perdidos = quienes('perdido');
        for (const id of ids) { set(id, 'cansado', true); set(id, 'hambre', true); set(id, 'perdido', false); }
        ev('montana', { quienes: ids, perdidos });
        break;
      }
      case 'mapa': { const id = ids[0], perdido = S[id].perdido; set(id, 'perdido', false); S[id].objetos.mapa = true; ev('mapa', { quien: id, perdido }); break; }
      case 'mochila': { const id = ids[0], hambre = S[id].hambre; set(id, 'hambre', false); S[id].objetos.comida = true; ev('mochila', { quien: id, hambre }); break; }
      case 'cuerda': { const id = ids[0]; S[id].objetos.cuerda = true; ev('cuerda', { quien: id }); break; }
      case 'manta': { const id = ids[0], frio = S[id].frio; set(id, 'frio', false); S[id].objetos.manta = true; ev('manta', { quien: id, frio }); break; }
      case 'linterna': { const id = ids[0], miedo = S[id].miedo; set(id, 'miedo', false); S[id].objetos.linterna = true; ev('linterna', { quien: id, miedo }); break; }
      case 'rescate': {
        const perdidos = quienes('perdido'); // solo posible con 1 personaje (a dos ya se han encontrado)
        if (perdidos.length) ev('rescateNoVe', { quien: perdidos[0] });
        else { for (const id of ids) set(id, 'salvo', true); ev('rescate', { quienes: ids }); }
        break;
      }
      default: throw new Error('escena desconocida: ' + esc);
    }
    if (amigos) haceAmigos();
    marca();
    return evs;
  }

  /* ---------- frases ---------- */
  function frasesDe(e, tiempo) {
    const t = tiempo === 'pret' ? 'pret' : 'pres';
    const V = (lema, ids) => L.conj(lema, L.gn(Ps(ids)), t);
    const Vi = lema => L.conj(lema, { n: 'sg' }, t);
    const A = (adj, ids) => L.acuerdo(adj, L.gn(Ps(ids)));
    const N = ids => L.sujeto(Ps(ids));
    const q = e.quien ? [e.quien] : null, qs = e.quienes || null, a = e.a ? [e.a] : null;
    const yaNo = (ids, k) => k === 'tener' ? `Ya no ${V('tener', ids)}` : `Ya no ${V('estar', ids)}`;
    const lugar = e.lugar === 'selva' ? ' en la selva' : ''; // las demás escenas ya nombran el sitio en su propia frase
    switch (e.tipo) {
      case 'yaSalvo': return [`¡Pero ${N(q)} ya ${V('estar', q)} a salvo! No ${V('poder', q)} estar aquí.`];
      case 'encuentra': return [`${N(q)} ${V('encontrar', q)} a ${N(a)}${lugar}. ¡Qué alegría!`];
      case 'seEncuentran': return [`${N(qs)} ${V('encontrarse', qs)}${lugar}. ${yaNo(qs, 'estar')} ${A('perdido', qs)}.`];
      case 'pierde': return [`${N(q)} ${V('caminar', q)} ${A('solo', q)} por la selva y ${V('perderse', q)}.`];
      case 'noPierde': return [`${N(q)} ${V('caminar', q)} por la selva. ${L.cap(V('tener', q))} el mapa y no ${V('perderse', q)}.`];
      case 'caminanJuntos': return [`${N(qs)} ${V('caminar', qs)} ${A('juntos', qs)} por la selva. ${L.cap(V('tener', qs))} hambre y ${V('estar', qs)} ${A('cansado', qs)}.`];
      case 'bebe': {
        const f = `${N(qs)} ${V('beber', qs)} agua del río.`;
        if (!e.sed.length) return [f];
        if (e.sed.length === qs.length) return [f, `${yaNo(qs, 'tener')} sed.`];
        return [f, `${N(e.sed)} ya no ${V('tener', e.sed)} sed.`];
      }
      case 'cruzaMojado': return [`${L.cap(V('cruzar', qs))} el río y ${V('mojarse', qs)}. ${L.cap(V('tener', qs))} frío.`];
      case 'cruzaCuerda': return [`${L.cap(V('cruzar', qs))} el río con la cuerda. No ${V('mojarse', qs)}.`];
      case 'calor': return [`${L.cap(Vi('hacerImp'))} mucho calor.`, `${N(qs)} ${V('tener', qs)} sed.`];
      case 'tormenta': {
        const ll = `${L.cap(Vi('llover'))} mucho.`;
        if (e.solo) {
          if (e.manta) return [ll, `${N(qs)} ${V('taparse', qs)} con la manta y no ${V('tener', qs)} frío.`, `Pero ${V('estar', qs)} ${A('solo', qs)} y ${V('tener', qs)} miedo.`];
          return [ll, `${N(qs)} ${V('tener', qs)} frío y miedo.`];
        }
        if (e.manta) return [ll, `${N(qs)} ${V('taparse', qs)} con la manta. No ${V('tener', qs)} frío.`];
        return [ll, `${N(qs)} ${V('tener', qs)} frío.`];
      }
      case 'nocheSolo': return [`${L.cap(Vi('serImp'))} de noche. ${N(q)} ${V('estar', q)} ${A('solo', q)} y ${V('tener', q)} miedo.`];
      case 'nocheLinterna': return [`${L.cap(Vi('serImp'))} de noche. ${N(q)} ${V('encender', q)} la linterna y ${V('dormir', q)} ${A('tranquilo', q)}.`];
      case 'nocheJuntos': {
        const f = `${L.cap(Vi('serImp'))} de noche. ${N(qs)} ${V('estar', qs)} ${A('juntos', qs)} y ${V('dormir', qs)} bien.`;
        if (e.cansados.length === qs.length) return [f, `${yaNo(qs, 'estar')} ${A('cansado', qs)}.`];
        if (e.cansados.length) return [f, `${N(e.cansados)} ya no ${V('estar', e.cansados)} ${A('cansado', e.cansados)}.`];
        if (e.miedos.length === qs.length) return [f, `${yaNo(qs, 'tener')} miedo.`];
        if (e.miedos.length) return [f, `${N(e.miedos)} ya no ${V('tener', e.miedos)} miedo.`];
        return [f, `No ${V('tener', qs)} miedo.`];
      }
      case 'jaguarSolo': {
        const f = `¡Un jaguar! ${N(q)} ${V('tener', q)} miedo y ${V('correr', q)}.`;
        return [f, e.mapa ? `Con el mapa, no ${V('perderse', q)}.` : `${L.cap(V('perderse', q))}.`];
      }
      case 'jaguarJuntos': return [`¡Un jaguar! ${N(qs)} ${V('gritar', qs)} ${A('juntos', qs)} y el jaguar ${Vi('irse')}.`];
      case 'serpienteMuerde': return [`¡Ay! Una serpiente ${Vi('morder')} a ${N(q)}. ${L.cap(V('estar', q))} ${A('herido', q)}.`];
      case 'serpienteAvisa': return [`${N(q)} ${V('ver', q)} una serpiente y ${V('avisar', q)} a ${N(a)}. ¡Cuidado! La serpiente no ${Vi('morder')} a nadie.`];
      case 'comeFrutas': {
        const f = `${N(qs)} ${V('comer', qs)} frutas.`;
        if (!e.hambre.length) return [f, '¡Qué ricas!'];
        if (e.hambre.length === qs.length) return [f, `${yaNo(qs, 'tener')} hambre.`];
        return [f, `${N(e.hambre)} ya no ${V('tener', e.hambre)} hambre.`];
      }
      case 'fuego': {
        const f = `${N(qs)} ${V('hacer', qs)} fuego.`;
        if (!e.frio.length) return e.breve ? [f] : [f, '¡Qué bien!'];
        if (e.frio.length === qs.length) return [f, `${yaNo(qs, 'tener')} frío.`];
        return [f, `${N(e.frio)} ya no ${V('tener', e.frio)} frío.`];
      }
      // comeComida / comen / seCuran siguen siempre a una frase con el mismo sujeto (fuego, refugio): se omite el sujeto
      case 'comeComida': return [`${L.cap(V('comer', q))} y ya no ${V('tener', q)} hambre.`];
      case 'comen': return [`${L.cap(V('comer', qs))} y ya no ${V('tener', qs)} hambre.`];
      case 'comparte': return [`${N(q)} ${V('compartir', q)} la comida con ${N(a)}. ${yaNo([e.quien, e.a], 'tener')} hambre.`];
      case 'comeSolo': return [`${N(q)} ${V('comer', q)} y no ${V('compartir', q)}. ${N(a)} ${V('tener', a)} hambre y ${V('estar', a)} ${A('enfadado', a)} con ${N(q)}.`];
      case 'descansa': {
        const f = `${N(qs)} ${V('descansar', qs)} en el refugio.`;
        if (e.breve) return [f];
        if (e.cansados.length === qs.length) return [f, `${yaNo(qs, 'estar')} ${A('cansado', qs)}.`];
        if (e.cansados.length) return [f, `${N(e.cansados)} ya no ${V('estar', e.cansados)} ${A('cansado', e.cansados)}.`];
        if (e.miedos.length === qs.length) return [f, `${yaNo(qs, 'tener')} miedo.`];
        if (e.miedos.length) return [f, `${N(e.miedos)} ya no ${V('tener', e.miedos)} miedo.`];
        return [f, `${L.cap(V('estar', qs))} ${A('tranquilo', qs)}.`];
      }
      case 'cura': return [`${N(q)} ${V('curar', q)} a ${N(a)}. ${N(a)} ya no ${V('estar', a)} ${A('herido', a)}.`];
      case 'seCuran': return [`${t === 'pret' ? 'Se curaron' : 'Se curan'}. ${yaNo(qs, 'estar')} ${A('herido', qs)}.`];
      case 'perdon': return [`${N(q)} ${V('pedir', q)} perdón a ${N(a)}. ${N(a)} ya no ${V('estar', a)} ${A('enfadado', a)}.`];
      case 'montana': {
        const f = `${N(qs)} ${V('subir', qs)} la montaña. ${L.cap(V('estar', qs))} ${A('cansado', qs)} y ${V('tener', qs)} hambre.`;
        if (e.perdidos.length) return [f, `Desde arriba ${V('ver', e.perdidos)} el río. ¡Ya no ${V('estar', e.perdidos)} ${A('perdido', e.perdidos)}!`];
        return [f];
      }
      case 'mapa': return e.perdido ? [`${N(q)} ${V('encontrar', q)} el mapa. ¡Ya no ${V('estar', q)} ${A('perdido', q)}!`] : [`${N(q)} ${V('encontrar', q)} un mapa. Lo ${V('guardar', q)}.`];
      case 'mochila': return e.hambre ? [`${N(q)} ${V('encontrar', q)} una mochila con comida. ${L.cap(V('comer', q))} y ya no ${V('tener', q)} hambre.`] : [`${N(q)} ${V('encontrar', q)} una mochila con comida. ¡Qué suerte!`];
      case 'cuerda': return [`${N(q)} ${V('encontrar', q)} una cuerda. La ${V('guardar', q)}.`];
      case 'manta': return e.frio ? [`${N(q)} ${V('encontrar', q)} una manta. ${yaNo(q, 'tener')} frío.`] : [`${N(q)} ${V('encontrar', q)} una manta. La ${V('guardar', q)}.`];
      case 'linterna': return e.miedo ? [`${N(q)} ${V('encontrar', q)} una linterna. ${yaNo(q, 'tener')} miedo.`] : [`${N(q)} ${V('encontrar', q)} una linterna. La ${V('guardar', q)}.`];
      case 'rescate': return [t === 'pret' ? `¡El helicóptero! ${N(qs)} ${V('salvarse', qs)}.` : `¡El helicóptero! ${N(qs)} ${V('estar', qs)} a salvo.`];
      case 'rescateNoVe': return [`El helicóptero no ${Vi('ver')} a ${N(q)}. ${N(q)} todavía ${V('estar', q)} ${A('perdido', q)}.`];
      case 'amigos': return [t === 'pret' ? `${N(qs)} se hicieron ${A('amigo', qs)}.` : `Ahora ${N(qs)} ${V('ser', qs)} ${A('amigo', qs)}.`];
      case 'demasiados': return ['Aquí solo cabe una persona.'];
      default: return ['…'];
    }
  }

  /* Léxico que puede aparecer en cada escena (lemas), para el panel «Léxico». */
  const LEXICO_ESCENA = {
    selva: ['selva', 'caminar', 'solo', 'perdido', 'encontrar', 'juntos', 'hambre', 'cansado', 'amigos'],
    rio: ['río', 'agua', 'beber', 'sed', 'cruzar', 'frío', 'cuerda'],
    sol: ['sol', 'hacer calor', 'sed'],
    tormenta: ['tormenta', 'llover', 'frío', 'miedo', 'manta', 'solo'],
    noche: ['noche', 'solo', 'miedo', 'linterna', 'dormir', 'juntos', 'cansado'],
    jaguar: ['jaguar', 'miedo', 'correr', 'perdido', 'gritar', 'juntos'],
    serpiente: ['serpiente', 'morder', 'herido', 'ver', 'avisar'],
    frutas: ['frutas', 'comer', 'hambre'],
    fuego: ['fuego', 'frío', 'comer', 'hambre', 'comida', 'compartir', 'solo', 'enfadado', 'amigos'],
    refugio: ['refugio', 'descansar', 'cansado', 'miedo', 'curar', 'herido', 'pedir perdón', 'enfadado'],
    montana: ['montaña', 'subir', 'cansado', 'hambre', 'ver', 'río', 'perdido'],
    mapa: ['mapa', 'encontrar', 'perdido', 'guardar', 'mochila'],
    mochila: ['mochila', 'comida', 'encontrar', 'comer', 'hambre'],
    cuerda: ['cuerda', 'encontrar', 'guardar'],
    manta: ['manta', 'encontrar', 'frío', 'guardar'],
    linterna: ['linterna', 'encontrar', 'miedo', 'guardar'],
    rescate: ['helicóptero', 'a salvo', 'ver', 'perdido']
  };
  function lexicoDe(nivel) {
    const set = new Set();
    for (const e of nivel.escenas) for (const w of LEXICO_ESCENA[e] || []) set.add(w);
    return [...set].map(w => ({ palabra: w, picto: L.PICTOS[w] || '' }));
  }

  /* ---------- objetivos ---------- */
  const ESTADO_INFO = {};
  for (const e of C.ESTADOS) ESTADO_INFO[e.id] = e;
  const PALABRA = { hambre: 'hambre', sed: 'sed', frio: 'frío', miedo: 'miedo', cansado: 'cansado', herido: 'herido', perdido: 'perdido', salvo: 'a salvo', contento: 'contento' };

  function humanos(nivel) { return nivel.personajes.filter(id => !P(id).animal); }

  function evaluar(obj, res, nivel) {
    if (!obj) return false;
    const S = res.estado, H = res.hist;
    switch (obj.tipo) {
      case 'estado': return valor(S[obj.quien], obj.estado) === (obj.valor !== false);
      case 'yaNo': return !!(H.alguna[obj.quien] && H.alguna[obj.quien][obj.estado]) && !valor(S[obj.quien], obj.estado);
      case 'todos': return humanos(nivel).every(id => valor(S[id], obj.estado) === (obj.valor !== false));
      case 'nadie': return humanos(nivel).every(id => !valor(S[id], obj.estado));
      case 'nunca': {
        const ids = obj.quien ? [obj.quien] : humanos(nivel);
        return ids.every(id => !(H.alguna[id] && H.alguna[id][obj.estado]) && !valor(S[id], obj.estado));
      }
      case 'evento': return H.eventos.some(e => e.tipo === obj.evento && (!obj.quien || e.quien === obj.quien || (e.quienes && e.quienes.includes(obj.quien))) && (!obj.a || e.a === obj.a || (e.quienes && e.quienes.includes(obj.a))));
      case 'sinEvento': return !H.eventos.some(e => e.tipo === obj.evento && (!obj.quien || e.quien === obj.quien || (e.quienes && e.quienes.includes(obj.quien))));
      case 'amigos': return !!S[obj.a].amigos[obj.b];
      case 'enfadado': return !!S[obj.quien].enfadado[obj.con];
      case 'y': return obj.partes.every(p => evaluar(p, res, nivel));
      default: return false;
    }
  }

  /** Frase verbal de un estado para un grupo: «tiene hambre» · «está perdida» · «están a salvo».
      gnForzado permite imponer el plural («Todos están…»); adverbio se intercala tras el verbo («está nunca perdido»). */
  function fraseEstado(estado, ids, tiempo, negar, gnForzado, adverbio) {
    const gn = gnForzado || L.gn(Ps(ids)), t = tiempo || 'pres';
    const info = ESTADO_INFO[estado];
    const no = negar ? 'no ' : '', adv = adverbio ? adverbio + ' ' : '';
    if (info.tipo === 'tener') return `${no}${L.conj('tener', gn, t)} ${adv}${PALABRA[estado]}`;
    const adj = estado === 'salvo' ? 'a salvo' : estado;
    return `${no}${L.conj('estar', gn, t)} ${adv}${L.acuerdo(adj, gn)}`;
  }
  /** Solo el complemento del estado: «hambre» · «perdidos» · «a salvo» (para fusionar títulos) */
  function complementoEstado(estado, gn) {
    if (ESTADO_INFO[estado].tipo === 'tener') return PALABRA[estado];
    return L.acuerdo(estado === 'salvo' ? 'a salvo' : estado, gn);
  }

  /* Títulos generados para los eventos. q / a pueden faltar (título secreto genérico). */
  const N1 = id => P(id).nombre;
  const Nq = (q, defecto) => q ? N1(q) : defecto;
  const acq = (adj, q) => q ? L.acuerdo(adj, L.gn(P(q))) : adj;
  const TITULO_EVENTO = {
    encuentra: (q, a) => `${Nq(q, 'Alguien')} encuentra a ${Nq(a, 'un amigo')}`,
    seEncuentran: (q, a) => q && a ? `${N1(q)} y ${N1(a)} se encuentran` : 'Dos amigos se encuentran',
    cura: (q, a) => `${Nq(q, 'Alguien')} cura a ${Nq(a, 'un amigo')}`,
    comparte: (q, a) => a ? `${Nq(q, 'Alguien')} comparte la comida con ${N1(a)}` : `${Nq(q, 'Alguien')} comparte la comida`,
    comeSolo: q => `${Nq(q, 'Alguien')} no comparte`,
    nocheLinterna: q => `${Nq(q, 'Alguien')} duerme ${acq('tranquilo', q)}`,
    jaguarJuntos: () => 'El jaguar se va',
    jaguarSolo: q => `¡Un jaguar! ${Nq(q, 'Alguien')} corre`,
    caminanJuntos: (q, a) => q && a ? `${N1(q)} y ${N1(a)} caminan juntos` : 'Caminan juntos',
    nocheJuntos: (q, a) => q && a ? `${N1(q)} y ${N1(a)} duermen bien` : 'Nadie duerme solo',
    perdon: (q, a) => `${Nq(q, 'Alguien')} pide perdón a ${Nq(a, 'un amigo')}`,
    cruzaCuerda: (q, a) => q && a ? `${N1(q)} y ${N1(a)} cruzan el río con la cuerda` : q ? `${N1(q)} cruza el río con la cuerda` : 'Cruzan el río con la cuerda',
    serpienteAvisa: (q, a) => a ? `¡Cuidado, ${N1(a)}!` : '¡Cuidado con la serpiente!',
    rescateNoVe: q => `El helicóptero no ve a ${Nq(q, 'alguien')}`,
    nocheSolo: q => `${Nq(q, 'Alguien')} duerme ${acq('solo', q)}`,
    pierde: q => `${Nq(q, 'Alguien')} se pierde`,
    mapa: q => `${Nq(q, 'Alguien')} encuentra el mapa`,
    mochila: q => `${Nq(q, 'Alguien')} encuentra la mochila`,
    linterna: q => `${Nq(q, 'Alguien')} encuentra la linterna`,
    manta: q => `${Nq(q, 'Alguien')} encuentra la manta`,
    cuerda: q => `${Nq(q, 'Alguien')} encuentra la cuerda`,
    bebe: q => `${Nq(q, 'Alguien')} bebe agua`,
    comeFrutas: q => `${Nq(q, 'Alguien')} come frutas`,
    fuego: q => `${Nq(q, 'Alguien')} hace fuego`,
    descansa: q => `${Nq(q, 'Alguien')} descansa en el refugio`,
    montana: q => `${Nq(q, 'Alguien')} sube la montaña`,
    rescate: q => `${Nq(q, 'Alguien')} vuelve a casa`,
    amigos: (q, a) => q && a ? `${N1(q)} y ${N1(a)} son amigos` : 'Dos personas se hacen amigas'
  };
  /* Títulos para «nunca ocurre el evento» (tipo sinEvento) */
  const TITULO_SIN = {
    nocheSolo: 'Nadie duerme solo', pierde: 'Nadie se pierde en la selva', jaguarSolo: 'Nadie corre solo', serpienteMuerde: 'La serpiente no muerde a nadie',
    comeSolo: 'Todos comparten', cruzaMojado: 'Nadie se moja', rescateNoVe: 'El helicóptero ve a todos', tormenta: 'Nadie pasa la tormenta'
  };
  /* Qué hace falta para cada evento (explicación de «¿Qué pasa?» cuando falta un evento) */
  const ac = (adj, id) => id ? L.acuerdo(adj, L.gn(P(id))) : adj + '/a';
  const PRECONDICION = {
    encuentra: o => `Primero ${Nq(o.a, 'alguien')} tiene que perderse (${ac('solo', o.a)} en la selva o con el jaguar). Después, los dos juntos.`,
    seEncuentran: () => 'Primero los dos se pierden, cada uno solo. Después, los dos juntos.',
    cura: o => `Primero ${Nq(o.a, 'alguien')} tiene que estar ${ac('herido', o.a)} (la serpiente, ${ac('solo', o.a)}). Después, los dos en el refugio.`,
    comparte: o => `${Nq(o.quien, 'Alguien')} necesita la comida (la mochila), ${Nq(o.a, 'el otro')} necesita tener hambre y tienen que ser amigos antes del fuego.`,
    comeSolo: o => `${Nq(o.quien, 'Alguien')} necesita la comida, ${Nq(o.a, 'el otro')} tiene hambre y todavía no son amigos. Después, el fuego.`,
    perdon: o => `Primero ${Nq(o.a, 'alguien')} tiene que estar ${ac('enfadado', o.a)} (el fuego: comer y no compartir). Después, los dos en el refugio.`,
    nocheLinterna: o => `${Nq(o.quien, 'Alguien')} necesita la linterna antes de la noche, y pasar la noche ${ac('solo', o.quien)}.`,
    nocheJuntos: () => 'Los dos juntos en la noche.',
    jaguarJuntos: () => 'Los dos juntos con el jaguar.',
    caminanJuntos: () => 'Los dos juntos en la selva, sin estar perdidos.',
    cruzaCuerda: () => 'Alguien necesita la cuerda antes del río.',
    amigos: () => 'Los dos juntos en una viñeta (y nadie come sin compartir).'
  };

  function tituloDe(obj, nivel) {
    if (!obj) return '';
    switch (obj.tipo) {
      case 'estado': return L.cap(`${N1(obj.quien)} ${fraseEstado(obj.estado, [obj.quien], 'pres', obj.valor === false)}`);
      case 'yaNo': return L.cap(`${N1(obj.quien)} ya no ${fraseEstado(obj.estado, [obj.quien])}`);
      case 'todos': {
        const ids = humanos(nivel), fem = ids.every(id => P(id).genero === 'f');
        if (ids.length === 1) return tituloDe({ tipo: 'estado', quien: ids[0], estado: obj.estado, valor: obj.valor }, nivel);
        const gn = { g: fem ? 'f' : 'm', n: 'pl' };
        if (obj.valor === false) return L.cap(`No ${fem ? 'todas' : 'todos'} ${fraseEstado(obj.estado, ids, 'pres', false, gn)}`);
        return L.cap(`${fem ? 'Todas' : 'Todos'} ${fraseEstado(obj.estado, ids, 'pres', false, gn)}`);
      }
      case 'nadie': return L.cap(`Nadie ${fraseEstado(obj.estado, [], 'pres', false, { g: 'm', n: 'sg' })}`);
      case 'nunca': return obj.quien ? L.cap(`${N1(obj.quien)} nunca ${fraseEstado(obj.estado, [obj.quien])}`) : L.cap(`Nadie ${fraseEstado(obj.estado, [], 'pres', false, { g: 'm', n: 'sg' }, 'nunca')}`);
      case 'evento': return (TITULO_EVENTO[obj.evento] || (() => obj.evento))(obj.quien, obj.a);
      case 'sinEvento': return TITULO_SIN[obj.evento] || `Nunca: ${obj.evento}`;
      case 'amigos': return `${N1(obj.a)} y ${N1(obj.b)} son amigos`;
      case 'enfadado': return `${N1(obj.quien)} está ${L.acuerdo('enfadado', L.gn(P(obj.quien)))} con ${N1(obj.con)}`;
      case 'y': return tituloY(obj.partes, nivel);
      default: return '';
    }
  }
  /* Título compuesto: fusiona lo que se puede para no repetir sujeto ni predicado.
     «Lucía ya no tiene hambre» + «Mateo ya no tiene hambre» → «Lucía y Mateo ya no tienen hambre»
     «Valeria está a salvo» + «Valeria nunca tiene miedo» → «Valeria está a salvo y nunca tiene miedo»
     «Todos están contentos» + «Todos están a salvo» → «Todos están contentos y a salvo» */
  function tituloY(partes, nivel) {
    const [a, b] = partes;
    if (partes.length === 2 && a && b) {
      const mismoPred = a.tipo === b.tipo && a.estado === b.estado && (a.valor !== false) === (b.valor !== false);
      if (mismoPred && (a.tipo === 'estado' || a.tipo === 'yaNo' || a.tipo === 'nunca') && a.quien && b.quien && a.quien !== b.quien) {
        const ids = ordenar([a.quien, b.quien]);
        const pre = a.tipo === 'yaNo' ? 'ya no ' : a.tipo === 'nunca' ? 'nunca ' : '';
        return L.cap(`${L.sujeto(Ps(ids))} ${pre}${fraseEstado(a.estado, ids, 'pres', a.tipo === 'estado' && a.valor === false)}`);
      }
      if (a.tipo === 'todos' && b.tipo === 'todos' && a.valor !== false && b.valor !== false && ESTADO_INFO[a.estado].tipo === ESTADO_INFO[b.estado].tipo) {
        const ids = humanos(nivel), fem = ids.every(id => P(id).genero === 'f'), gn = { g: fem ? 'f' : 'm', n: 'pl' };
        const verbo = L.conj(ESTADO_INFO[a.estado].tipo === 'tener' ? 'tener' : 'estar', gn, 'pres');
        return L.cap(`${fem ? 'Todas' : 'Todos'} ${verbo} ${complementoEstado(a.estado, gn)} y ${complementoEstado(b.estado, gn)}`);
      }
      const ta = tituloDe(a, nivel), tb = tituloDe(b, nivel);
      const suj = a.quien && b.quien && a.quien === b.quien ? N1(a.quien) + ' ' : null;
      if (suj && ta.startsWith(suj) && tb.startsWith(suj)) return `${ta} y ${tb.slice(suj.length)}`;
    }
    return partes.map((p, i) => { const t = tituloDe(p, nivel); return i && !/^[¡¿]/.test(t) && !NOMBRES.has(t.split(' ')[0]) ? t[0].toLowerCase() + t.slice(1) : t; }).join(' y ');
  }
  const NOMBRES = new Set(C.PERSONAJES.map(p => p.nombre));
  /** ¿Tiene sentido este objetivo? (modo Autor, tests): yaNo / nunca solo sobre estados negativos. */
  function objetivoValido(obj) {
    if (!obj || !obj.tipo) return false;
    if (obj.tipo === 'y') return Array.isArray(obj.partes) && obj.partes.length >= 2 && obj.partes.every(objetivoValido);
    if ((obj.tipo === 'yaNo' || obj.tipo === 'nunca') && !NEGATIVOS.includes(obj.estado)) return false;
    if ((obj.tipo === 'estado' || obj.tipo === 'todos' || obj.tipo === 'nadie') && !ESTADO_INFO[obj.estado]) return false;
    if ((obj.tipo === 'evento' || obj.tipo === 'sinEvento') && !obj.evento) return false;
    return true;
  }

  /** Explica en español sencillo por qué el objetivo aún no se cumple. */
  function porque(obj, res, nivel) {
    if (!obj) return [];
    if (res.hist.invalido) return res.hist.eventos.filter(e => e.tipo === 'yaSalvo').map(e => `${N1(e.quien)} ya está a salvo: no puede seguir en la historia.`);
    if (res.incompleto) return ['Faltan viñetas: pon una escena y un personaje en cada viñeta.'];
    if (res.faltan && res.faltan.length) return res.faltan.map(id => `${N1(id)} no sale en la historia.`);
    if (evaluar(obj, res, nivel)) return [];
    const S = res.estado, H = res.hist;
    switch (obj.tipo) {
      case 'estado': return [L.cap(`${N1(obj.quien)} ${fraseEstado(obj.estado, [obj.quien], 'pres', obj.valor !== false)}.`)];
      case 'yaNo': {
        if (valor(S[obj.quien], obj.estado)) return [L.cap(`${N1(obj.quien)} todavía ${fraseEstado(obj.estado, [obj.quien])}.`)];
        return [L.cap(`${N1(obj.quien)} nunca ${fraseEstado(obj.estado, [obj.quien])} en la historia.`)];
      }
      case 'todos': return humanos(nivel).filter(id => valor(S[id], obj.estado) !== (obj.valor !== false)).map(id => L.cap(`${N1(id)} ${fraseEstado(obj.estado, [id], 'pres', obj.valor !== false)}.`));
      case 'nadie': return humanos(nivel).filter(id => valor(S[id], obj.estado)).map(id => L.cap(`${N1(id)} ${fraseEstado(obj.estado, [id])}.`));
      case 'nunca': {
        const ids = obj.quien ? [obj.quien] : humanos(nivel);
        const out = [];
        for (const id of ids) {
          if (H.alguna[id] && H.alguna[id][obj.estado]) {
            const v = res.viñetas.findIndex(vi => vi.estado[id] && vi.estado[id][obj.estado]);
            out.push(L.cap(`${N1(id)} ${fraseEstado(obj.estado, [id])} ${v < 0 ? 'desde el principio' : 'en la viñeta ' + (v + 1)}.`));
          }
        }
        return out;
      }
      case 'evento': return [`Falta: «${tituloDe(obj, nivel)}».`, PRECONDICION[obj.evento] ? PRECONDICION[obj.evento](obj) : null].filter(Boolean);
      case 'sinEvento': {
        const e = H.eventos.find(x => x.tipo === obj.evento && (!obj.quien || x.quien === obj.quien || (x.quienes && x.quienes.includes(obj.quien))));
        const f = TITULO_EVENTO[obj.evento];
        return [L.cap(`${f ? f(e.quien, e.a) : obj.evento} en la viñeta ${e.viñeta + 1}.`)];
      }
      case 'amigos': {
        const juntos = res.viñetas.some(v => v.personajes.includes(obj.a) && v.personajes.includes(obj.b));
        if (!juntos) return [`${N1(obj.a)} y ${N1(obj.b)} no están juntos en ninguna viñeta.`];
        const cs = H.eventos.find(e => e.tipo === 'comeSolo');
        return [cs ? `${N1(cs.quien)} come y no comparte: ${N1(obj.a)} y ${N1(obj.b)} no son amigos.` : `${N1(obj.a)} y ${N1(obj.b)} todavía no son amigos.`];
      }
      case 'enfadado': return [`${N1(obj.quien)} no está ${L.acuerdo('enfadado', L.gn(P(obj.quien)))} con ${N1(obj.con)}.`];
      case 'y': return obj.partes.flatMap(p => porque(p, res, nivel));
      default: return ['…'];
    }
  }

  /** «Lucía tiene hambre y frío. Está perdida.» — resumen de un personaje al final. */
  function describir(id, S, tiempo) {
    const s = S[id], t = tiempo || 'pres', gn = L.gn(P(id)), n = N1(id);
    if (s.salvo) return `${n} ${L.conj('estar', gn, t)} a salvo.`;
    const tener = ['hambre', 'sed', 'frio', 'miedo'].filter(k => s[k]).map(k => PALABRA[k]);
    const estar = ['cansado', 'herido', 'perdido'].filter(k => s[k]).map(k => L.acuerdo(k, gn));
    for (const x in s.enfadado) estar.push(`${L.acuerdo('enfadado', gn)} con ${N1(x)}`);
    const vt = L.conj('tener', gn, t), ve = L.conj('estar', gn, t);
    if (!tener.length && !estar.length) return `${n} ${ve} ${L.acuerdo('contento', gn)}.`;
    if (tener.length && estar.length) return `${n} ${vt} ${lista(tener)}. ${L.cap(ve)} ${lista(estar)}.`;
    if (tener.length) return `${n} ${vt} ${lista(tener)}.`;
    return `${n} ${ve} ${lista(estar)}.`;
  }
  function lista(xs) { return xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' y ' + xs[xs.length - 1]; }

  /* ---------- simular ---------- */
  function simular(nivel, viñetas, opts) {
    opts = opts || {};
    const tiempo = opts.tiempo === 'pret' ? 'pret' : 'pres';
    const S0 = estadoInicial(nivel), S0copia = clonar(S0);
    const ctx = { S: S0, hist: historialInicial(nivel, S0), tiempo };
    const out = [];
    let incompleto = false;
    const n = nivel.viñetas;
    for (let i = 0; i < n; i++) {
      const panel = (viñetas && viñetas[i]) || {};
      const completa = !!(panel.escena && panel.personajes && panel.personajes.length);
      if (!completa) incompleto = true;
      const evs = ctx.hist.invalido || !completa ? [] : paso(ctx, panel, i);
      const partes = evs.map(e => frasesDe(e, tiempo));
      // El marco impersonal (Llueve mucho. / Hace mucho calor. / Es de noche.) va delante del encuentro.
      if (evs.length >= 2 && ['encuentra', 'seEncuentran'].includes(evs[0].tipo) && ['calor', 'tormenta', 'nocheJuntos'].includes(evs[1].tipo)) {
        const marco = partes[1][0];
        if (evs[1].tipo === 'nocheJuntos') { const m = marco.match(/^(\S+ de noche\.) (.*)$/); if (m) { partes[1][0] = m[2]; partes.unshift([m[1]]); } }
        else { partes[1] = partes[1].slice(1); partes.unshift([marco]); }
      }
      const frases = partes.flat();
      out.push({ escena: panel.escena || null, personajes: ordenar(panel.personajes || []), eventos: evs, frases, estado: clonar(ctx.S), completa });
    }
    const faltan = nivel.libre ? [] : humanos(nivel).filter(id => !ctx.hist.salen[id]);
    const res = { viñetas: out, estado: ctx.S, hist: ctx.hist, eventos: ctx.hist.eventos, incompleto, faltan, valido: !ctx.hist.invalido, tiempo };
    const completa = !incompleto && res.valido && !faltan.length;
    res.resuelto = completa && evaluar(nivel.objetivo, res, nivel);
    res.secreto = completa && !!nivel.secreto && evaluar(nivel.secreto, res, nivel);
    res.porque = nivel.objetivo ? porque(nivel.objetivo, res, nivel) : [];
    res.resumen = nivel.personajes.filter(id => out.some(v => v.personajes.includes(id))).map(id => describir(id, ctx.S, tiempo));
    // «Al principio»: personajes con algún estado u objeto inicial (nivel.inicial)
    res.inicio = nivel.inicial ? Object.keys(nivel.inicial).filter(id => S0copia[id] && (NEGATIVOS.some(k => S0copia[id][k]) || Object.keys(S0copia[id].objetos).length)).map(id => {
      const d = describir(id, S0copia, 'pres');
      const objs = Object.keys(S0copia[id].objetos).map(o => (C.OBJETOS.find(x => x.id === o) || { nombre: o }).nombre);
      return objs.length ? `${d} Tiene ${lista(objs)}.` : d;
    }) : [];
    res.frasesTodas = out.flatMap(v => v.frases);
    res.expresiones = {};
    for (const id of nivel.personajes) res.expresiones[id] = expresion(ctx.S[id]);
    return res;
  }

  /* ---------- resolver (todas las soluciones) ---------- */
  function opcionesDe(nivel) {
    const ids = ordenar(nivel.personajes), ops = [];
    for (const esc of nivel.escenas) {
      const slots = ESCENA[esc].slots;
      for (const a of ids) ops.push({ escena: esc, personajes: [a] });
      if (slots >= 2) for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) ops.push({ escena: esc, personajes: [ids[i], ids[j]] });
    }
    return ops;
  }
  /* Qué parte de la historia importa para los predicados del nivel (para compactar la memoización). */
  function relevantes(nivel) {
    const rel = { eventos: new Set(), alguna: new Set() };
    const visita = o => {
      if (!o) return;
      if (o.tipo === 'evento' || o.tipo === 'sinEvento') rel.eventos.add(o.evento);
      if (o.tipo === 'yaNo' || o.tipo === 'nunca') rel.alguna.add(o.estado);
      if (o.tipo === 'y') o.partes.forEach(visita);
    };
    visita(nivel.objetivo); visita(nivel.secreto);
    return rel;
  }
  const OBJ_IDS = ['mapa', 'cuerda', 'manta', 'linterna', 'comida'];
  function clave(ctx, rel, ids) {
    let out = '';
    for (const id of ids) {
      const s = ctx.S[id];
      let b = 0;
      NEGATIVOS.forEach((k, i) => { if (s[k]) b |= 1 << i; });
      if (s.salvo) b |= 1 << 7;
      OBJ_IDS.forEach((o, i) => { if (s.objetos[o]) b |= 1 << (8 + i); });
      ids.forEach((o, i) => { if (s.amigos[o]) b |= 1 << (13 + i); if (s.enfadado[o]) b |= 1 << (18 + i); });
      NEGATIVOS.forEach((k, i) => { if (rel.alguna.has(k) && ctx.hist.alguna[id][k]) b |= 1 << (23 + i); });
      if (ctx.hist.salen[id]) b |= 1 << 30;
      out += b.toString(36) + '.';
    }
    if (rel.eventos.size) {
      const evs = new Set();
      for (const e of ctx.hist.eventos) if (rel.eventos.has(e.tipo)) evs.add(e.tipo + ':' + (e.quien || '') + ':' + (e.a || '') + ':' + (e.quienes || []).join('+'));
      out += [...evs].sort().join(',');
    }
    return out;
  }
  function resolver(nivel, opts) {
    opts = opts || {};
    const max = opts.max === undefined ? 60 : opts.max;
    const limite = opts.limite || 4e6;
    const ops = opcionesDe(nivel), n = nivel.viñetas, rel = relevantes(nivel), ids = ordenar(nivel.personajes);
    const memo = new Map(); // clave → {t,s,a}
    let estados = 0, desbordado = false;
    function cuenta(ctx, i) {
      if (ctx.hist.invalido) return { t: 0, s: 0, a: 0 };
      if (i === n) {
        if (humanos(nivel).some(id => !ctx.hist.salen[id])) return { t: 0, s: 0, a: 0 };
        const res = { estado: ctx.S, hist: ctx.hist, incompleto: false, viñetas: [] };
        const ok = evaluar(nivel.objetivo, res, nivel), sec = !!nivel.secreto && evaluar(nivel.secreto, res, nivel);
        return { t: ok ? 1 : 0, s: sec ? 1 : 0, a: ok && sec ? 1 : 0 };
      }
      const k = i + '|' + clave(ctx, rel, ids);
      if (memo.has(k)) return memo.get(k);
      if (memo.size > limite) { desbordado = true; return { t: 0, s: 0, a: 0 }; }
      estados++;
      const r = { t: 0, s: 0, a: 0 };
      for (const op of ops) {
        const c = { S: clonar(ctx.S), hist: { alguna: clonarAlguna(ctx.hist.alguna), eventos: ctx.hist.eventos.slice(), invalido: false, salen: Object.assign({}, ctx.hist.salen) }, tiempo: 'pres' };
        paso(c, op, i);
        const x = cuenta(c, i + 1);
        r.t += x.t; r.s += x.s; r.a += x.a;
      }
      memo.set(k, r);
      return r;
    }
    function clonarAlguna(a) { const b = {}; for (const id in a) b[id] = Object.assign({}, a[id]); return b; }
    const S0 = estadoInicial(nivel);
    const inicio = { S: S0, hist: historialInicial(nivel, S0), tiempo: 'pres' };
    const total = nivel.objetivo ? cuenta(inicio, 0) : { t: 0, s: 0, a: 0 };
    // enumerar soluciones (hasta max) siguiendo solo ramas con t>0
    const soluciones = [];
    function enumerar(ctx, i, camino) {
      if (soluciones.length >= max) return;
      if (i === n) { soluciones.push(camino.slice()); return; }
      for (const op of ops) {
        const c = { S: clonar(ctx.S), hist: { alguna: clonarAlguna(ctx.hist.alguna), eventos: ctx.hist.eventos.slice(), invalido: false, salen: Object.assign({}, ctx.hist.salen) }, tiempo: 'pres' };
        paso(c, op, i);
        if (c.hist.invalido) continue;
        const k = (i + 1) + '|' + clave(c, rel, ids);
        const r = i + 1 === n ? cuenta(c, i + 1) : memo.get(k);
        if (!r || !r.t) continue;
        camino.push(op); enumerar(c, i + 1, camino); camino.pop();
        if (soluciones.length >= max) return;
      }
    }
    if (nivel.objetivo && total.t) enumerar(inicio, 0, []);
    const posibles = Math.pow(ops.length, n);
    return { total: total.t, secretas: total.s, ambas: total.a, soluciones, estados, opciones: ops.length, posibles, densidad: total.t / posibles, desbordado };
  }

  /** Texto corto de una solución: «1 sol(Lucía) · 2 río(Lucía) · 3 río(Lucía)» */
  function textoSolucion(sol) {
    return sol.map((op, i) => `${i + 1} ${ESCENA[op.escena].nombre.replace(/^(El|La) /, '').toLowerCase()} (${op.personajes.map(N1).join(', ')})`).join(' · ');
  }

  return { simular, resolver, evaluar, tituloDe, porque, describir, lexicoDe, expresion, frasesDe, paso, estadoInicial, opcionesDe, textoSolucion, objetivoValido, NEGATIVOS, LEXICO_ESCENA, P, ordenar };
});
