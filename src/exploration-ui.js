/* Une mission, un déplacement, une action. Aucun inventaire ni association. */
(function () {
  'use strict';
  const D = window.SVExplorationData, E = window.SVExplorationEngine;
  const A = window.SVExplorationMotionEngine, N = window.SVExplorationStories;
  const L = window.SVExplorationDialogues;
  const voicePlayer = window.SVExplorationAudioEngine.create({clips:window.SVAudioClips,createAudio(){
    const audio=document.createElement('audio');audio.id='x-voice-player';audio.hidden=true;document.body.appendChild(audio);return audio;
  }});
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)'), introSeen = new Set();
  const root = document.getElementById('exploracionApp'), esc = window.SVApp.esc;
  const PREF = 'cuentalo.exploration.language.v1';
  const VOICE_PREF = 'cuentalo.exploration.voices.v1';
  let state, language = 'easy', storageOK = true, world = null, player = E.clampPlayer(null);
  let frame = 0, last = 0, destination = null, autoTarget = null, face = 1, bubbleUntil = 0;
  let nearest = null, isPlaying = false, held = new Set(), touchDirection = null, touchPointer = null;
  let hero, actorImage, stage, actionButton, marker, bubble, cachedObjects = [], currentProgress;
  let action = null, storyDialog = null, actorKind = 'idle', actorSince = 0, actorSrc = '', npcSrc = '';
  let storyAudioKey = '', voicesEnabled = true, voiceRun = 0, activeClip = '', audioSpeaker = null, speakerSince = 0;
  const accents = {don_quijote:'España',macondo:'Colombia',borges:'Argentina',frida:'México'};
  const narrative = () => world && N.worlds[world.id];
  const storyLabel = () => narrative().kind === 'vida' ? 'LA VIDA DE FRIDA' : 'LA OBRA';
  try { state = E.normalize(D, localStorage.getItem(E.KEY)); language = localStorage.getItem(PREF) === 'normal' ? 'normal' : 'easy'; }
  catch (_) { state = E.normalize(D, null); storageOK = false; }
  try { voicesEnabled = localStorage.getItem(VOICE_PREF) !== 'off'; } catch (_) {}
  voicePlayer.setMuted(!voicesEnabled);
  const get = id => D.worlds.find(w => w.id === id);
  const progress = () => E.progress(D, state, world.id);
  const sprite = id => window.SVExplorationSprites[id];
  const warmedSprites = new Map();
  function warmSprites(id) {
    if(warmedSprites.has(id))return;
    const images=Object.values(window.SVExplorationMotion[id]).flat().map(src=>{const img=new Image();img.src=src;if(img.decode)img.decode().catch(()=>{});return img;});
    warmedSprites.set(id,images);
  }
  const button = (action, label, cls) => '<button class="'+(cls || 'x-link')+'" data-x="'+action+'">'+label+'</button>';
  function setSpeaker(id,text) {
    audioSpeaker=id;speakerSince=performance.now();
    if(bubble){bubble.hidden=true;bubbleUntil=0;if(id===world?.player&&text){say(text);bubbleUntil=Infinity;}}
    const sancho=cachedObjects.find(x=>x.o.kind==='sancho');if(sancho)sancho.node.dataset.speech=id==='sancho'?(text||''):'';
    root.querySelectorAll('.x-dialogue-line').forEach(el=>el.classList.toggle('is-speaking',el.dataset.speaker===id));
  }
  function playbackButtons(key) {
    root.querySelectorAll('[data-audio-key]').forEach(el=>{const on=el.dataset.audioKey===key;el.classList.toggle('is-speaking',on);el.setAttribute('aria-pressed',String(on));});
  }
  function silence() {
    voiceRun++;voicePlayer.stop();activeClip='';setSpeaker(null);playbackButtons('');
    root.querySelectorAll('.x-audio-notice').forEach(el=>el.remove());
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
  function voiceButton(){return '<button class="x-voice-toggle" data-x="voices" aria-pressed="'+voicesEnabled+'" aria-label="'+(voicesEnabled?'Voces activadas. Silenciar':'Voces desactivadas. Activar')+'" title="'+(voicesEnabled?'Silenciar las voces':'Activar las voces')+'">'+(voicesEnabled?'♫':'♩')+'<span> Voces</span></button>';}
  function setVoices(on){
    if(!on)silence();voicesEnabled=on;voicePlayer.setMuted(!on);
    try{localStorage.setItem(VOICE_PREF,on?'on':'off');}catch(_){}
    root.querySelectorAll('[data-x="voices"]').forEach(el=>{el.setAttribute('aria-pressed',String(on));el.setAttribute('aria-label',on?'Voces activadas. Silenciar':'Voces desactivadas. Activar');el.title=on?'Silenciar las voces':'Activar las voces';el.innerHTML=(on?'♫':'♩')+'<span> Voces</span>';});
  }
  function audioNotice(reason){
    const host=storyDialog?.querySelector('.x-story-card')||root.querySelector('.x-success')||root.querySelector('.x-controls');if(!host)return;
    root.querySelectorAll('.x-audio-notice').forEach(el=>el.remove());
    const p=document.createElement('p');p.className='x-audio-notice';p.setAttribute('role','status');p.textContent=reason==='blocked'?'Pulsa de nuevo para escuchar las voces.':'Audio no disponible. Puedes seguir jugando.';host.appendChild(p);
  }
  function save() { try { localStorage.setItem(E.KEY, JSON.stringify(state)); storageOK = true; } catch (_) { storageOK = false; } }
  function stopInput() { held.clear(); touchDirection = null; touchPointer = null; destination = null; autoTarget = null; }
  function cancelAction() { if(action){ const obj=cachedObjects.find(x=>x.o.id===action.object.id);if(obj)obj.node.classList.remove('painting'); } action=null; }
  function stop() { cancelAnimationFrame(frame); frame = 0; isPlaying = false; cancelAction(); storyDialog=null; stopInput(); silence(); }
  function isolate(on) {
    root.hidden = !on; document.body.classList.toggle('explorando', on);
    if (on && window.SVHistorias) window.SVHistorias.ocultar();
    ['cab','clase','juego','inicioApp','historiasApp','panelNiveles','panelLexico'].forEach(id => { const n = document.getElementById(id); if (n) n.inert = on; });
    if (on) { window.SVApp.cerrarPaneles(); document.querySelectorAll('dialog[open]').forEach(d => d.close()); }
  }
  function navigate(id) {
    const url = new URL(location.href); url.search = '';
    url.searchParams.set(id ? 'aventura' : 'biblioteca', id || '1');
    try { history.pushState({}, '', url); } catch (_) { /* Ouverture directe hors ligne. */ }
    show(id);
  }
  function top(game) {
    return '<header class="x-top">'+button('library','Cuéntalo<span>.</span>','x-wordmark')+
      (game ? '<span class="x-world-name">'+esc(world.title)+'</span><div class="x-top-tools">'+button('story',narrative().kind==='vida'?'Su vida':'Historia','x-history-button')+voiceButton()+'<label class="x-level"><span>Español</span><select id="x-language" aria-label="Nivel de español"><option value="easy"'+(language === 'easy'?' selected':'')+'>Fácil</option><option value="normal"'+(language === 'normal'?' selected':'')+'>Normal</option></select></label>'+button('help','?','x-link')+'</div>' : '<span class="x-kicker">PEQUEÑOS VIAJES, GRANDES MUNDOS</span>'+button('help','Comment jouer ?'))+'</header>';
  }
  function library() {
    root.innerHTML = top(false)+'<main class="x-library"><div class="x-intro"><div><p class="x-kicker">CUATRO MUNDOS POR DESCUBRIR</p><h1>Elige tu aventura.<br><em>Ahora, te toca jugar.</em></h1></div><p>Muévete. Explora. Descubre.<br>Une petite mission à la fois.<br>Clique sur une aventure pour commencer.</p></div><div class="x-shelf">'+D.worlds.map((w,i) => {
      const p = E.progress(D,state,w.id);
      return '<button class="x-card" data-x="play" data-id="'+w.id+'"><span class="x-cover"><img src="'+window.SVCubiertas[w.cover]+'" alt="" width="720" height="1080"><small>0'+(i+1)+'</small></span><span class="x-card-reference">'+esc(w.reference)+'</span><strong class="x-card-title">'+esc(w.title)+'</strong><span class="x-card-sub">'+esc(w.subtitle)+'</span><span class="x-cta">'+(p.completed?'Aventura completada ✓':p.started?'Continuar · '+(p.index+1)+'/6':'Jugar')+'<b aria-hidden="true">→</b></span></button>';
    }).join('')+'</div><p class="x-library-note">Flèches pour se déplacer · Espace pour agir · Sur écran tactile, touche directement le décor.</p></main><footer class="x-footer"><span>'+ (storageOK?'La partie se sauvegarde sur cet appareil.':'La sauvegarde est indisponible ici : garde cette page ouverte.') +'</span>'+button('workshop','Espace prof · ancien atelier ↗')+'</footer>';
    document.title = 'Cuéntalo · Elige tu aventura';
  }
  function objectsHTML(m, p) {
    return m.objects.map(o => '<button class="x-object'+(p.collected.includes(o.id)?' collected':'')+(world.id==='frida'&&p.index>=4&&o.kind==='canvas'?' x-finished-painting':'')+'" data-object="'+esc(o.id)+'" data-kind="'+o.kind+'" data-edge="'+(o.x>820?'right':o.x<180?'left':'middle')+'" style="left:'+o.x/10+'%;top:'+o.y/5.6+'%;z-index:'+Math.round(o.y)+'" aria-label="'+esc(o.label+(p.collected.includes(o.id)?', hecho':''))+'"><span class="x-object-label">'+esc(o.label)+'</span>'+(o.kind==='sancho'?'<img src="'+sprite('sancho')+'" alt="" draggable="false">':window.SVExplorationArt(o))+'</button>').join('');
  }
  function play() {
    const p = currentProgress = progress(), m = p.mission;
    if (p.completed) { ending(); return; }
    warmSprites(world.player);if(world.id==='don_quijote')warmSprites('sancho');
    root.innerHTML = '<div class="x-game">'+top(true)+'<section class="x-mission" aria-label="Tu misión"><div class="x-mission-title"><span class="x-number">'+(p.index+1)+'</span><div><p class="x-place">'+esc(m.title)+'</p><h1 class="x-goal" tabindex="-1">'+esc(m.goal[language])+'</h1></div></div><div class="x-mission-side"><span class="x-count" aria-label="Objetos encontrados">'+p.count+' / '+p.required+'</span>'+button('listen','♪ <span>Escuchar</span>','x-listen')+'</div></section><div class="x-stage-wrap"><div class="x-stage" tabindex="0" role="group" aria-label="'+esc(m.title)+', zona de exploración" style="background-image:url('+window.SVFondos[m.scene]+')"><div class="x-path"></div>'+objectsHTML(m,p)+'<div class="x-destination" hidden></div><div class="x-hero" data-player="'+world.player+'"><span class="x-bubble" hidden></span><img src="'+sprite(world.player)+'" alt="" draggable="false"></div><div id="x-feedback" role="status" aria-live="polite" class="sr-only"></div></div></div><footer class="x-controls"><div class="x-control-left"><div class="x-dpad" aria-label="Déplacer le personnage"><button data-dir="up" aria-label="Avancer">↑</button><button data-dir="left" aria-label="Aller à gauche">←</button><button data-dir="down" aria-label="Reculer">↓</button><button data-dir="right" aria-label="Aller à droite">→</button></div><span class="x-control-help">Déplace-toi avec les flèches<br>ou touche le décor.</span></div><div class="x-dots" aria-label="Étape '+(p.index+1)+' sur '+p.total+'">'+world.missions.map((_,i)=>'<i class="'+(i<p.index?'done':i===p.index?'current':'')+'"></i>').join('')+'</div><div class="x-action-group"><span class="x-action-hint">ESPACE / E</span>'+button('act','Interactuar','x-primary x-action-button')+'</div></footer></div>';
    stage = root.querySelector('.x-stage'); hero = root.querySelector('.x-hero'); actorImage=hero.querySelector('img'); actorSrc=sprite(world.player);actorKind='idle';actorSince=performance.now();npcSrc=''; bubble = root.querySelector('.x-bubble'); marker = root.querySelector('.x-destination'); actionButton = root.querySelector('[data-x="act"]');
    cachedObjects = m.objects.map(o => ({o, node:root.querySelector('[data-object="'+o.id+'"]')}));
    player = E.clampPlayer(null); face = 1; nearest = null; last = 0; bubbleUntil = 0; stopInput();
    const listen=root.querySelector('[data-x="listen"]');listen.setAttribute('aria-label','Escuchar la misión');listen.dataset.audioKey=world.id+'.goal.'+p.index+'.'+language;listen.disabled=!voicePlayer.has(listen.dataset.audioKey);
    root.querySelector('.x-goal').focus({preventScroll:true});
    isPlaying = true; updatePosition(false); if(p.ready) showSuccess(); frame=requestAnimationFrame(tick);
    document.title = world.title+' · Cuéntalo';
  }
  function ending() {
    stop();
    root.innerHTML=top(false)+'<main class="x-ending"><img class="x-ending-art" src="'+sprite(world.player)+'" alt=""><div><p class="x-kicker">6 MISIONES · AVENTURA COMPLETADA</p><h1>'+esc(world.ending.title)+'</h1><p>'+esc(world.ending.phrase)+'</p><section class="x-ending-summary"><p class="x-story-eyebrow">'+storyLabel()+' · EN POCAS PALABRAS</p><h2>'+esc(narrative().title)+'</h2><p>'+esc(narrative().summary)+'</p>'+button('story','♪ Escuchar / Saber más','x-link')+'</section><div class="x-ending-actions">'+button('library','Otra aventura →','x-primary')+button('restart','Volver a jugar')+'</div><p class="x-library-note">'+esc(world.subtitle)+'.</p></div></main>';
  }
  function show(id) { stop(); isolate(true); world=get(id); if(world){play();const p=progress();if(!p.started&&!p.completed&&!introSeen.has(world.id)){introSeen.add(world.id);openStory('intro');}}else library();root.scrollTop=0; }
  function showSuccess(autoDialogue) {
    stopInput(); currentProgress=progress(); const m=currentProgress.mission;
    if(root.querySelector('.x-success'))return;
    const piece=narrative().chapters[currentProgress.index];
    const box=document.createElement('section');box.className='x-success x-story-fragment';box.setAttribute('aria-label','Diálogo y relato');box.tabIndex=-1;
    const dialogue=L.worlds[world.id], lines=dialogue.chapters[currentProgress.index];
    box.innerHTML='<div class="x-dialogue" hidden><p class="x-story-eyebrow">HABLEMOS · ESPAÑOL DE '+esc(accents[world.id]).toUpperCase()+'</p>'+lines.map(line=>{
      const portrait=sprite(line.speaker);
      return '<div class="x-dialogue-line" data-speaker="'+line.speaker+'"><span class="x-dialogue-portrait">'+(portrait?'<img src="'+portrait+'" data-portrait="'+line.speaker+'" alt="">':'<span aria-hidden="true">'+esc(dialogue.speakers[line.speaker].name[0])+'</span>')+'</span><p><b>'+esc(dialogue.speakers[line.speaker].name)+'</b><span>'+esc(line.text)+'</span></p></div>';
    }).join('')+'</div><div class="x-result-story"><p class="x-story-eyebrow">'+storyLabel()+' · '+(currentProgress.index+1)+' / '+currentProgress.total+'</p><h2>'+esc(piece.title)+'</h2><p class="x-story-text">'+esc(piece.text)+'</p></div><div class="x-story-actions"><span class="x-achieved" role="status">✓ '+esc(m.success)+'</span>'+button('dialogue','▷ Diálogo','x-listen')+button('show-piece','Historia','x-listen')+button('listen-piece','♪ Relato','x-listen')+button('next',currentProgress.index===currentProgress.total-1?'Terminar →':'Seguir →','x-primary')+'</div>';
    root.querySelector('.x-stage-wrap').appendChild(box);
    box.focus({preventScroll:true});
    const listen=box.querySelector('[data-x="listen-piece"]');listen.dataset.audioKey=world.id+'.story.'+currentProgress.index;listen.disabled=!voicePlayer.has(listen.dataset.audioKey);
    dialogueView(false);
    actionButton.disabled=true;actionButton.textContent='¡Hecho!';
    if(autoDialogue&&voicesEnabled)playDialogue(false);
  }
  function dialogueView(on){
    const box=root.querySelector('.x-success'), focused=document.activeElement;if(!box)return;
    box.querySelector('.x-dialogue').hidden=!on;box.querySelector('.x-result-story').hidden=on;
    box.querySelector('[data-x="show-piece"]').hidden=!on;box.querySelector('[data-x="listen-piece"]').hidden=on;
    box.querySelector('[data-x="dialogue"]').textContent=on?'↺ Repetir':'▷ Diálogo';
    if(box.contains(focused)&&focused.closest('[hidden]'))box.focus({preventScroll:true});
  }
  function playDialogue(manual){
    silence();if(manual)setVoices(true);if(!voicesEnabled)return;
    const run=voiceRun,id=world.id,index=currentProgress.index,lines=L.worlds[id].chapters[index];
    dialogueView(true);
    function lineAt(i){
      if(run!==voiceRun)return;
      if(i===lines.length){activeClip='';setSpeaker(null);dialogueView(false);return;}
      const line=lines[i],key=id+'.dialogue.'+index+'.'+i;activeClip=key;
      voicePlayer.play(key,{
        onStart(){if(run===voiceRun)setSpeaker(line.speaker,line.text);},
        onEnd(){if(run===voiceRun){setSpeaker(null);lineAt(i+1);}},
        onError(reason){if(run===voiceRun){activeClip='';setSpeaker(null);audioNotice(reason);}}
      });
    }
    lineAt(0);
  }
  function speak(key,speaker){
    if(activeClip===key&&['loading','playing'].includes(voicePlayer.getStatus())){silence();return;}
    silence();setVoices(true);const run=voiceRun;activeClip=key;
    voicePlayer.play(key,{
      onStart(){if(run===voiceRun){setSpeaker(speaker||null);playbackButtons(key);}},
      onEnd(){if(run===voiceRun){activeClip='';setSpeaker(null);playbackButtons('');}},
      onError(reason){if(run===voiceRun){activeClip='';setSpeaker(null);playbackButtons('');audioNotice(reason);}}
    });
  }
  function openStory(mode){
    if(!world||storyDialog)return;stopInput();cancelAction();silence();
    const n=narrative(), intro=mode==='intro', piece=intro?n.intro:{title:n.title,text:n.summary};
    storyAudioKey=world.id+'.'+(intro?'intro':'summary');
    const overlay=document.createElement('div');overlay.className='x-story-dialog';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','x-story-title');
    overlay.innerHTML='<article class="x-story-card"><div class="x-story-banner"><img src="'+window.SVCubiertas[world.cover]+'" alt=""><div><p class="x-story-eyebrow">'+storyLabel()+(intro?' · ANTES DE JUGAR':' · RESUMEN')+'</p><h2 id="x-story-title">'+esc(piece.title)+'</h2></div></div><p class="x-story-text">'+esc(piece.text)+'</p>'+(!intro?'<details class="x-story-details"><summary>La historia en seis partes</summary><ol>'+n.chapters.map(c=>'<li><h3>'+esc(c.title)+'</h3><p>'+esc(c.text)+'</p></li>').join('')+'</ol></details><details class="x-story-details"><summary>Fuentes</summary><ul>'+n.sources.map(src=>'<li><a href="'+esc(src.url)+'" target="_blank" rel="noopener noreferrer">'+esc(src.label)+'</a></li>').join('')+'</ul></details>':'')+'<div class="x-story-actions">'+button('listen-story','♪ Escuchar','x-listen')+button('close-story',intro?'¡Jugar! →':'Volver →','x-primary')+'</div></article>';
    storyDialog=overlay;root.appendChild(overlay);Array.from(root.children).filter(el=>el!==overlay).forEach(el=>el.inert=true);
    const listen=overlay.querySelector('[data-x="listen-story"]');listen.dataset.audioKey=storyAudioKey;listen.disabled=!voicePlayer.has(storyAudioKey);
    const note=document.createElement('p');note.className='x-voice-note';note.textContent='Voces en español de '+accents[world.id]+'. Diálogos inventados para jugar.';
    overlay.querySelector('.x-story-actions').before(note);overlay.querySelector('.x-story-actions').insertAdjacentHTML('afterbegin',voiceButton());
    overlay.querySelector('[data-x="close-story"]').focus();
  }
  function closeStory(){
    if(!storyDialog)return;silence();storyDialog.remove();storyDialog=null;Array.from(root.children).forEach(el=>el.inert=false);last=0;
    const focus=isPlaying?stage:root.querySelector('[data-x="story"]')||root.querySelector('[data-x="library"]');if(focus)focus.focus({preventScroll:true});
  }
  function animate(moving,now){
    const desired=storyDialog||root.querySelector('.x-help')?'idle':action?(action.kind==='talk'?'reach':action.kind):moving?'walk':audioSpeaker===world.player?'talk':'idle';
    if(desired!==actorKind){actorKind=desired;actorSince=now;}
    const frames=window.SVExplorationMotion[world.player][desired]||[sprite(world.player)];
    const src=frames[A.frameIndex(desired,now-actorSince,frames.length,reducedMotion.matches)];
    if(src!==actorSrc){actorImage.src=src;actorSrc=src;}
    hero.dataset.motion=desired;hero.classList.toggle('walking',desired==='walk');
    const sancho=cachedObjects.find(x=>x.o.kind==='sancho');
    if(sancho){
      const talking=audioSpeaker==='sancho';
      const sf=window.SVExplorationMotion.sancho.talk;
      const next=talking?sf[A.frameIndex('talk',now-speakerSince,sf.length,reducedMotion.matches)]:sprite('sancho');
      if(next!==npcSrc){sancho.node.querySelector('img').src=next;npcSrc=next;}
      sancho.node.classList.toggle('speaking',!!talking);
    }
    root.querySelectorAll('[data-portrait]').forEach(img=>{
      const id=img.dataset.portrait, poses=window.SVExplorationMotion[id]?.talk;
      const next=audioSpeaker===id&&poses?poses[A.frameIndex('talk',now-speakerSince,poses.length,reducedMotion.matches)]:sprite(id);
      if(img.getAttribute('src')!==next)img.src=next;
    });
  }
  function say(text) {
    if(!bubble)return; bubble.textContent=text;bubble.hidden=false;bubbleUntil=performance.now()+2600;
    root.querySelector('#x-feedback').textContent=text;
  }
  function interact(o) {
    if(!isPlaying||!o||currentProgress.ready||action||storyDialog)return;
    const result=E.interact(D,state,world.id,o.id,player);
    const reactions={tree:'¡Qué buena sombra!',bench:'Un lugar para descansar.',flower:'¡Qué bonita flor!',well:'El agua brilla.',book:'Otro libro por descubrir.',butterfly:'¡Mira cómo vuela!',paint:'Un color para otra ocasión.'};
    if(!E.near(player,o)||result.event==='wrong'||currentProgress.collected.includes(o.id)){
      say(result.event==='wrong'?(reactions[o.kind]||'Vamos a seguir explorando.'):result.message);return;
    }
    stopInput();face=o.x<player.x?-1:1;
    const kind=o.kind==='canvas'&&currentProgress.index>=4?'reach':A.actionFor(o.kind), now=performance.now();
    action={kind,object:o,started:now,ends:now+(reducedMotion.matches?180:A.duration(kind==='talk'?'reach':kind))};
    actorKind='';bubbleUntil=0;bubble.hidden=true;
    if(kind==='paint')cachedObjects.find(x=>x.o.id===o.id).node.classList.add('painting');
    actionButton.disabled=true;actionButton.textContent=kind==='paint'?'Pintando…':kind==='talk'?'Saludando…':'Un momento…';
    animate(false,now);
  }
  function finishAction(){
    const pending=action;if(!pending)return;action=null;
    const o=pending.object,result=E.interact(D,state,world.id,o.id,player);state=result.state;save();currentProgress=progress();
    const obj=cachedObjects.find(x=>x.o.id===o.id);obj.node.classList.remove('painting');
    say(result.message);
    if(result.event==='collected'||result.event==='complete'){
      obj.node.classList.add('collected');obj.node.setAttribute('aria-label',o.label+', hecho');
      root.querySelector('.x-count').textContent=currentProgress.count+' / '+currentProgress.required;
      const spark=document.createElement('span');spark.className='x-spark';spark.textContent='✦';spark.style.left=o.x/10+'%';spark.style.top=(o.y-90)/5.6+'%';stage.appendChild(spark);setTimeout(()=>spark.remove(),900);
      if(currentProgress.ready)showSuccess(true);
    }
  }
  function updatePosition(moving) {
    hero.style.left=player.x/10+'%';hero.style.top=player.y/5.6+'%';hero.style.zIndex=Math.round(player.y)+1;hero.style.setProperty('--face',face);hero.classList.toggle('walking',moving);hero.dataset.edge=player.x>700?'right':player.x<300?'left':'middle';
    const options=cachedObjects.filter(x=>!currentProgress.collected.includes(x.o.id)&&E.near(player,x.o));
    options.sort((a,b)=>E.distance(player,a.o)-E.distance(player,b.o));nearest=options.length?options[0].o:null;
    cachedObjects.forEach(x=>x.node.classList.toggle('near',nearest&&nearest.id===x.o.id));
    actionButton.disabled=currentProgress.ready||!!action||!!storyDialog;
    actionButton.textContent=action?(action.kind==='paint'?'Pintando…':action.kind==='talk'?'Saludando…':'Un momento…'):currentProgress.ready?'¡Hecho!':nearest?'Actuar':'Interactuar';
    marker.hidden=!destination;if(destination){marker.style.left=destination.x/10+'%';marker.style.top=destination.y/5.6+'%';}
  }
  function tick(now) {
    if(!isPlaying)return;
    const dt=last?(now-last)/1000:0;last=now;
    let dx=0,dy=0;
    if(action&&now>=action.ends)finishAction();
    if(!currentProgress.ready&&!action&&!storyDialog&&!root.querySelector('.x-help')){
      dx=(held.has('arrowright')||held.has('d')?1:0)-(held.has('arrowleft')||held.has('a')||held.has('q')?1:0);
      dy=(held.has('arrowdown')||held.has('s')?1:0)-(held.has('arrowup')||held.has('w')||held.has('z')?1:0);
      if(touchDirection){dx=({left:-1,right:1})[touchDirection]||0;dy=({up:-1,down:1})[touchDirection]||0;}
      if(dx||dy){destination=null;autoTarget=null;}
      else if(destination){
        const dist=E.distance(player,destination);
        if(autoTarget&&E.near(player,autoTarget)){const target=autoTarget;destination=null;autoTarget=null;interact(target);}
        else if(dist<4){destination=null;autoTarget=null;}
        else {dx=(destination.x-player.x)/dist;dy=(destination.y-player.y)/dist; if(dist<E.SPEED*Math.min(dt,E.MAX_DT)){player=E.clampPlayer(destination);dx=0;dy=0;}}
      }
      if(dx)face=dx<0?-1:1;
      player=E.move(player,dx,dy,dt);
    }
    updatePosition(!!(dx||dy));animate(!!(dx||dy),now);if(bubbleUntil&&now>bubbleUntil){bubble.hidden=true;bubbleUntil=0;}
    frame=requestAnimationFrame(tick);
  }
  function help() {
    stopInput();cancelAction();silence();
    if(root.querySelector('.x-help'))return;
    const overlay=document.createElement('div');overlay.className='x-help';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Comment jouer');
    overlay.innerHTML='<div class="x-help-card"><h2>À toi d’explorer.</h2><p><b>1.</b> Lis la petite mission en espagnol. ♪ permet de l’écouter.</p><p><b>2.</b> Déplace-toi avec les flèches, ZQSD ou en touchant le décor.</p><p><b>3.</b> Près d’un objet, appuie sur Espace. Tu peux aussi toucher directement cet objet.</p><p>Après la mission, écoute deux petites répliques. <b>Diálogo</b> les rejoue ; <b>Voces</b> coupe ou active le son. Tu peux continuer à tout moment.</p>'+button('close-help','¡Vamos!','x-primary')+'</div>';
    root.appendChild(overlay);Array.from(root.children).filter(n=>n!==overlay).forEach(n=>n.inert=true);overlay.querySelector('button').focus();
  }
  function closeHelp(){const overlay=root.querySelector('.x-help');if(!overlay)return;overlay.remove();Array.from(root.children).forEach(n=>n.inert=false);(isPlaying?stage:root.querySelector('[data-x="help"]')).focus();last=0;}
  root.addEventListener('click',ev=>{
    const b=ev.target.closest('button');if(b&&b.disabled)return;
    const a=b&&b.dataset.x;
    if(a==='library')navigate();
    else if(a==='play')navigate(b.dataset.id);
    else if(a==='help')help();
    else if(a==='story')openStory('summary');
    else if(a==='close-story')closeStory();
    else if(a==='voices')setVoices(!voicesEnabled);
    else if(a==='listen-story')speak(storyAudioKey);
    else if(a==='listen-piece')speak(world.id+'.story.'+currentProgress.index);
    else if(a==='dialogue')playDialogue(true);
    else if(a==='show-piece'){silence();dialogueView(false);}
    else if(a==='close-help')closeHelp();
    else if(a==='workshop'){stop();isolate(false);const url=new URL(location.href);url.search='?taller=1';history.pushState({},'',url);window.dispatchEvent(new PopStateEvent('popstate'));}
    else if(a==='next'){if(!progress().ready)return;state=E.next(D,state,world.id);save();stop();play();}
    else if(a==='restart'){state=E.restart(D,state,world.id);save();introSeen.delete(world.id);show(world.id);}
    else if(a==='act'){if(nearest)interact(nearest);else say('Acércate a un objeto.');}
    else if(a==='listen')speak(world.id+'.goal.'+currentProgress.index+'.'+language,world.player);
    else if(b&&b.dataset.object&&isPlaying&&!currentProgress.ready&&!action&&!storyDialog){const o=currentProgress.mission.objects.find(o=>o.id===b.dataset.object);stopInput();destination=E.clampPlayer(o);autoTarget=o;}
  });
  root.addEventListener('pointerdown',ev=>{
    const d=ev.target.closest('[data-dir]');
    if(d&&isPlaying&&!currentProgress.ready&&!action&&!storyDialog){ev.preventDefault();stopInput();touchDirection=d.dataset.dir;step(touchDirection);touchPointer=ev.pointerId;d.setPointerCapture(ev.pointerId);return;}
    if(isPlaying&&stage&&stage.contains(ev.target)&&!ev.target.closest('button')&&!currentProgress.ready&&!action&&!storyDialog){
      const r=stage.getBoundingClientRect();stage.focus({preventScroll:true});stopInput();destination=E.clampPlayer({x:(ev.clientX-r.left)/r.width*1000,y:(ev.clientY-r.top)/r.height*560});
    }
  });
  function releasePad(ev){if(ev.pointerId===touchPointer){touchDirection=null;touchPointer=null;}}
  root.addEventListener('pointerup',releasePad);root.addEventListener('pointercancel',releasePad);root.addEventListener('lostpointercapture',releasePad);
  root.addEventListener('change',ev=>{if(ev.target.id==='x-language'){language=ev.target.value==='normal'?'normal':'easy';try{localStorage.setItem(PREF,language);}catch(_){}root.querySelector('.x-goal').textContent=currentProgress.mission.goal[language];const listen=root.querySelector('[data-x="listen"]');listen.dataset.audioKey=world.id+'.goal.'+currentProgress.index+'.'+language;listen.disabled=!voicePlayer.has(listen.dataset.audioKey);silence();}});
  const motionKeys=['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d','z','q'];
  function step(key){
    if(currentProgress.ready||action||storyDialog)return;
    const dx=['arrowright','d','right'].includes(key)?1:['arrowleft','a','q','left'].includes(key)?-1:0;
    const dy=['arrowdown','s','down'].includes(key)?1:['arrowup','w','z','up'].includes(key)?-1:0;
    destination=null;autoTarget=null;if(dx)face=dx;player=E.move(player,dx,dy,.06);updatePosition(true);
  }
  window.addEventListener('keydown',ev=>{
    if(root.hidden)return;
    if(storyDialog){
      if(ev.key==='Escape'){ev.preventDefault();closeStory();}
      else if(ev.key==='Tab'){const controls=Array.from(storyDialog.querySelectorAll('button:not([disabled]),summary,a[href]')).filter(el=>el.getClientRects().length);const i=controls.indexOf(document.activeElement);const next=ev.shiftKey?(i<=0?controls.length-1:i-1):(i+1)%controls.length;ev.preventDefault();controls[next].focus();}return;
    }
    if(root.querySelector('.x-help')){if(ev.key==='Escape'){ev.preventDefault();closeHelp();}if(ev.key==='Tab'){ev.preventDefault();root.querySelector('[data-x="close-help"]').focus();}return;}
    if(!isPlaying||action||ev.ctrlKey||ev.metaKey||ev.altKey||/^(SELECT|INPUT|TEXTAREA)$/.test(ev.target.tagName))return;
    const key=ev.key.toLowerCase();
    if(motionKeys.includes(key)){ev.preventDefault();if(ev.target.closest('button'))stage.focus({preventScroll:true});if(!ev.repeat)step(key);held.add(key);}
    else if((key===' '||key==='e')&&!ev.repeat){
      // Space on a focused object/button keeps native keyboard activation.
      if(key===' '&&ev.target.closest('button'))return;
      ev.preventDefault();if(currentProgress.ready)root.querySelector('[data-x="next"]').click();else if(nearest)interact(nearest);else say('Acércate a un objeto.');
    }
  });
  window.addEventListener('keyup',ev=>held.delete(ev.key.toLowerCase()));
  window.addEventListener('blur',stopInput);document.addEventListener('visibilitychange',()=>{stopInput();last=0;if(document.hidden)silence();});window.addEventListener('pagehide',silence);
  function route(){const q=new URLSearchParams(location.search);if(q.has('taller')||q.has('nivel')||q.has('modo')||q.has('lectura')){stop();isolate(false);window.SVHistorias.route();return;}show(q.get('aventura')||q.get('historia'));}
  window.SVExploracion={biblioteca(){navigate();},activo(){return !root.hidden;},borrar(){state=E.normalize(D,null);language='easy';introSeen.clear();save();try{localStorage.removeItem(PREF);}catch(_){}}};
  window.addEventListener('popstate',route);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',route);else route();
})();
