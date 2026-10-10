#!/usr/bin/env node
/* Standalone visual contact sheet; node scripts/galeria-art.js [output.html]. */
const fs = require('fs');
const path = require('path');
const C = require('../src/contenido');
const art = require('./load-art')();
const destination = process.argv[2] || path.join(__dirname, '..', 'docs', 'galeria-cartoon.html');
const modules = ['personajes', 'escenas'].map(id => fs.readFileSync(path.join(__dirname, '..', 'src', 'art', id + '.js'), 'utf8')).join('\n');
const html = `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cuéntalo · Le carnet cartoon</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f8f3e4;color:#283b2e;font:15px/1.5 system-ui,sans-serif}main{max-width:1280px;margin:auto;padding:42px 30px 60px}header{display:flex;align-items:end;gap:40px;justify-content:space-between;border-bottom:1px solid #b6c3a0;margin-bottom:24px;padding-bottom:22px}h1{font:54px/1 Georgia,serif;margin:7px 0 12px;letter-spacing:-2px}.eyebrow{text-transform:uppercase;letter-spacing:3px;font-size:11px;color:#68784f}p{margin:0;max-width:640px;color:#66705a}h2{font:28px Georgia,serif;margin:35px 0 18px}figure{margin:0;min-width:0}figcaption{padding:8px 10px;background:#fffdf5;font-weight:650;font-size:13px}.cast{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}.character{border:1px solid #ccd6b8;background:radial-gradient(ellipse at 50% 75%,#e2eecb 0%,#fffdf4 70%);border-radius:18px;overflow:hidden;text-align:center}.character>svg{height:205px;max-width:100%;display:block;margin:10px auto 0}.character figcaption{border-top:1px solid #e5e9d9}.scenes{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.scene{border:1px solid #aabc91;border-radius:12px;overflow:hidden;box-shadow:0 3px 0 #aabc912b}.scene>svg{width:100%;display:block}.expressions{overflow:auto;background:#fffdf6;border:1px solid #ccd6b8;border-radius:16px;padding:16px}.expression-row{display:grid;grid-template-columns:repeat(11,86px);gap:10px;margin:0 0 16px;width:max-content}.expression-row svg{height:118px;display:block;margin:auto}.expression-row figcaption{font-size:10px;text-align:center;padding:3px 0;font-weight:500}.expression-label{font-weight:650;margin:0 0 5px}.portraits{display:flex;gap:12px;align-items:center;margin-bottom:24px}.portrait{width:68px;height:68px;overflow:hidden;border:2px solid #aabc91;border-radius:50%;background:#e6edd6}.portrait svg{width:100%;height:100%}footer{margin-top:30px;font-size:12px;color:#68784f}@media(max-width:760px){main{padding:24px 16px}header{display:block}h1{font-size:45px}.cast{grid-template-columns:repeat(5,minmax(90px,1fr));overflow:auto}.character>svg{height:150px}.scenes{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style><main><header><div><div class="eyebrow">Cuéntalo · Direction artistique</div><h1>Le carnet cartoon.</h1><p>Cinq compagnons expressifs, dix-sept décors aux couleurs et aux silhouettes distinctes. Un univers d’aventure chaleureux, dessiné pour raconter.</p></div><span class="eyebrow">Collection · 2026</span></header>
<h2>Les compagnons</h2><div id="cast" class="cast"></div>
<h2>Un lieu, une ambiance</h2><div id="scenes" class="scenes"></div>
<h2>Des émotions qui racontent</h2><div id="portraits" class="portraits"></div><div id="expressions" class="expressions"></div>
<footer>Illustrations originales générées avec ImageGen. Cette planche fonctionne hors ligne.</footer></main>
<script>window.SVFondos=${JSON.stringify(art.fondos)};window.SVPersonajesCartoon=${JSON.stringify(art.personajes)};</script>
<script>${modules}</script>
<script>
const characters=${JSON.stringify(C.PERSONAJES)},scenes=${JSON.stringify(C.ESCENAS)};
const states=['contento','feliz','miedo','hambre','sed','frio','cansado','herido','perdido','enfadado','triste'];
const labels=['Souriant','Heureux','Effrayé','Affamé','Assoiffé','Frigorifié','Fatigué','Blessé','Perdu','Fâché','Triste'];
document.getElementById('cast').innerHTML=characters.map(p=>'<figure class="character">'+SVArtePersonajes.personajeSVG(p,'contento')+'<figcaption>'+p.nombre+'</figcaption></figure>').join('');
document.getElementById('scenes').innerHTML=scenes.map(s=>'<figure class="scene">'+SVArteEscenas.escenaSVG(s.id)+'<figcaption>'+s.nombre+'</figcaption></figure>').join('');
document.getElementById('portraits').innerHTML=characters.map(p=>'<div class="portrait">'+SVArtePersonajes.retratoSVG(p)+'</div>').join('');
document.getElementById('expressions').innerHTML=characters.map(p=>'<div class="expression-label">'+p.nombre+'</div><div class="expression-row">'+states.map((s,i)=>'<figure>'+SVArtePersonajes.personajeSVG(p,s)+'<figcaption>'+labels[i]+'</figcaption></figure>').join('')+'</div>').join('');
</script></html>`;
fs.writeFileSync(destination, html, 'utf8');
console.log(destination);
