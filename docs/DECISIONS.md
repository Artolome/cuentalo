# DECISIONS — choix faits en phase 0 et points à vérifier

Format : **Décision** → pourquoi → ⚠️ ce que tu dois vérifier / trancher.

## 1. Sources

- **Pas de `./fuentes/`** dans le brief déposé ; `Downloads/sobrevives.pdf` est une capture d'écran d'une carte du monde Frida (1 page, aucun contenu de séquence). J'ai donc pris comme « séquence » le jeu GitHub **Artolome/Sobrevive** (univers, niveau A1, lexique des 5 decks, style graphique) et le dépôt **Artolome/Charlemos** pour les fiches personnages (Mateo, Valeria, Diego, Lucía, mascotte Kiwi). Le lexique réel des decks est extrait dans `docs/lexico_fuente.md`.
  ⚠️ Si la vraie séquence « Sobrevives » existe (fiche de séquence, liste de lexique, documents), dépose-la dans `fuentes/` : j'alignerai le lexique et les gabarits dessus en phase 1.
- Le projet vit dans un **nouveau dépôt** `C:\Users\ameli\dev\sobrevives` (pluriel), séparé de `dev/sobrevive` (le jeu de cartes), pour ne rien casser dans le jeu publié.

## 2. Distribution (personajes)

- **Lucía (f), Mateo (m), Valeria (f), Diego (m)** : noms des deux dépôts, 2 filles / 2 garçons pour travailler les accords. Le brief citait aussi « Paula » : remplacée par Valeria (existe dans Charlemos).
- **Kiwi, el loro** (mascotte de Charlemos, le perroquet de Lucía) est défini comme 5e personnage « animal » mais **n'est dans aucun niveau** : règles spéciales (ne se perd jamais, pas de besoins, « Kiwi vuela y encuentra a… ») à écrire en phase 1 si tu valides.
  ⚠️ Alternative : *Garfio, el gato del cole* (déjà dessiné dans Sobrevive). Ton choix.
- Les **rasgos** sont descriptifs (pour l'art et les fiches). Option non implémentée : rasgo à effet (Mateo commence toujours avec faim).

## 3. Univers et escenas

- Univers **selva** (Guyane : forêt, fleuve, orage, jaguar, serpent, hélicoptère) — celui proposé par le brief, cohérent avec l'environnement des élèves.
- 17 escenas (11 à 1-2 slots, 5 objets à 1 slot, le rescate). Détail dans `CONTENIDO.md` §3.
- Choix de règles qui s'écartent légèrement du brief :
  - **Règle générale « encuentro »** : dans *toute* scène à deux, celui qui n'est pas perdu retrouve l'autre (pas seulement dans la selva). Évite les incohérences (« ensemble mais perdu ») et supprime la scène *El encuentro* du brief, devenue inutile.
  - **Amigos = partager une viñeta** (sauf si l'un mange seul). Simple à expliquer aux élèves. « Lucía y Mateo son amigos » est donc trivial : utilisé seulement comme titre secret potentiel.
  - **La comida ne se consomme pas** (la mochila « tiene mucha comida ») ; la cuerda / la manta d'un seul protègent les deux.
  - **El rescate** : 2 places max ; un personnage **a salvo ne peut plus apparaître** (viñeta « incoherente » → l'histoire n'est pas valide). Cela ferme les histoires et évite les solutions absurdes.
  - **La montaña** est la 3e façon de ne plus être perdu (« desde arriba ve el río ») mais coûte hambre + cansado : un vrai choix.
  - **El árbol de frutas** (quita el hambre, sans objet) ≠ **La mochila** (quita el hambre + objet comida pour partager).
  ⚠️ À valider : « enfadado/a » (Espagne) plutôt que « enojado/a » (Amérique latine) — cohérent avec les decks de Sobrevive (« vale », « el móvil »). « coger » évité (→ « guardar »).

## 4. Règle « todos los personajes salen »

- Une histoire n'est **complète** que si chaque personnage disponible du niveau apparaît au moins une fois (message « Mateo no sale en la historia. »). Sans elle, la moitié des niveaux à 2 personnages se résolvaient en ignorant le second.
  ⚠️ Facile à retirer si tu préfères la liberté totale de *Storyteller*.

## 5. Mesure de difficulté (le « > 8 solutions » du brief)

- Le résolveur exact (`node test/solver.js`) compte les **histoires complètes distinctes** qui réalisent le titre. Avec 1 personnage (chap. 1) le critère « ≤ 8 solutions » du brief est respecté (3-4 solutions par niveau).
- Dès 2 personnages, le nombre brut explose mécaniquement (une viñeta « de remplissage » — *Lucía bebe agua* — multiplie les histoires sans changer le puzzle). Le brut est donc **trompeur** ; j'ai ajouté la **densité** (solutions ÷ histoires possibles) et je signale « trop facile » au-dessus de 10 % (chap. 2-3). Les deux chiffres sont dans `CONTENIDO.md` §5.
- Les niveaux ont été resserrés : **nombre de cases = longueur de la chaîne causale** (3 cases en chap. 1-2, 4-6 en chap. 3), et les objectifs du chap. 3 sont composés (« y »). `c3n3 Diego pide perdón a Lucía` n'a que 2 solutions : exigeant mais fléché par les pistes.
- Côté pédagogie, plusieurs solutions valides ≠ défaut : chaque élève imprime une BD différente (tâche finale).
  ⚠️ Dis-moi si tu veux des niveaux plus « énigme » (une seule solution) ou plus « création ».

## 6. Langue

- Présent partout ; frases courtes (1-3 par viñeta) ; signes ¡ ¿ ; accents vérifiés par `test/frases.js` (982 frases dans `docs/frases.txt`, à relire).
- **Pretérito** (option 3e) : règle unique **action = indefinido** (*caminó, se perdió, encontró, bebió, durmió, se salvó…*) / **état et cadre = imperfecto** (*tenía sed, estaba perdida, ya no estaban cansados, podía · Llovía mucho. Hacía calor. Era de noche. Había comida.*). C'est le contraste passé composé / imparfait enseigné en A2, et c'est ce qu'ont exigé les trois relecteurs automatiques (« *Ya no estuvo perdido* » est agrammatical comme résultat). Un seul cas change de verbe : *¡El helicóptero! Lucía se salvó.* (au lieu de *estaba a salvo*, trop statique pour un dénouement).
- Relecture automatique (3 lentilles + vérification contradictoire) appliquée : *duermen juntos* → *están juntos y duermen bien* (double sens en espagnol adulte) et titre secret *Nadie duerme solo* ; *come sola* → *come y no comparte* (nomme la cause) ; sujet répété après *cura a* (*Valeria cura a Diego. Diego ya no está herido.*) ; *Lucía todavía está perdida* au lieu de *Sigue perdida* ; *¡Pero Lucía ya está a salvo! No puede estar aquí.* ; complément de lieu seulement pour la selva (plus de « *de noche… Es de noche* ») ; cadre impersonnel placé avant la retrouvaille ; pistes toutes avec un verbe conjugué, en 3e personne ; titres composés fusionnés (*Lucía y Mateo ya no tienen hambre*, *Valeria está a salvo y nunca tiene miedo*).
- Titres générés (`tituloDe`) : *Nadie tiene miedo*, *Todas están a salvo* (si que des filles), *No todos están a salvo* (négation du quantificateur), *Nadie está nunca perdido* (secret). ⚠️ alternative pour ce dernier : « *Nadie se pierde* » (événement).
- Pas d'emoji dans les frases ; emoji seulement comme pictos du léxico (le brief demande « mot + picto »).

## 7. Interface (maquette)

- Glisser-déposer HTML5 **et** repli clic-clic (clic carte → clic case). Clic sur un personnage placé = le retirer ; × = vider la case.
- Clic sur une frase / le titre / un mot du léxico → `speechSynthesis` (voix es-ES / es-MX si présente, sinon silencieux).
- Étoiles : 3 si réussi du premier coup complet, 2 si ≤ 3 essais, 1 sinon ; stockées dans `localStorage` (`sobrevives.progreso.v0`) ; bouton « Borrar mis datos ». Aucune donnée ne sort du navigateur.
- Pista automatique après 2 histoires complètes non réussies (préfigure le mode ★ Paso a paso).
- Les 16 niveaux sont ouverts dans la maquette (pas de verrouillage) pour que tu puisses tout essayer.
- Testé en 1280×720 : 3 cases tiennent sans défilement (stock escenas + personajes sur une seule ligne) ; 4 à 6 cases défilent encore (mise en page « Pizarra » dédiée prévue en phase 1 : 4 cases sur une ligne, 5-6 sur deux lignes plus petites).

## 8. Art

- Phase 0 : personnages **SVG paramétriques** (ligne claire, fonds unis) avec 10 expressions (contento, feliz, miedo, hambre, sed, frío, cansado, herido, perdido, enfadado) et un accessoire par personnage ; décors SVG à formes simples. Palette de Sobrevive (`#1f1a17 #c4432e #2c5a9a #dfa92c #4c8748 …`).
- Phase 2 : reprise possible des portraits tarot de Sobrevive (Lucía existe) pour la fiche-personnage, affinage des silhouettes, pictos SVG à la place des emoji.

## 9. Technique

- `src/lengua.js`, `src/contenido.js`, `src/engine.js`, `src/art/*.js`, `src/ui.js`, `src/plantilla.html` → `node build.js` → **`sobrevives.html`** (un seul fichier, 0 requête réseau, polices système). Le build refuse toute URL `http(s)://`.
- Le moteur tourne en Node : `node test/solver.js` (exact, mémoïsé, < 6 s pour les 16 niveaux), `node test/frases.js`.
- `test/serve.js` = mini serveur de dev pour les tests navigateur (non livré).

## 10. Revue automatique moteur + design (appliquée)

Deux agents relecteurs (bugs du moteur, design pédagogique) puis un vérificateur contradictoire par constat ; tout ce qui suit a été reproduit avec le moteur avant d'être appliqué.

- **Bugs moteur corrigés** : `nivel.inicial` partagé par référence (la simulation modifiait le niveau) ; états initiaux absents de l'historique (*ya no / nunca* faux) ; manta dans la tormenta qui annonçait « no tiene frío » sans l'enlever (→ la manta enlève le froid) ; personnage en double dans une case ; 2 personnages dans une escena à 1 place (→ *« Aquí solo cabe una persona. »*, histoire invalide) ; majuscules internes dans les titres composés ; *yaNo / nunca* sur *contento* (irrésoluble) → `objetivoValido` ; qui prévient de la serpiente (celui qui va le mieux) ; explication « amigos » qui mentait.
- **Relation « amigos » rendue visible** : la première viñeta partagée produit *« Ahora Lucía y Mateo son amigos. »* — c'est elle qui décide du partage au fuego, elle devait se lire.
- **Titres secrets qui mentaient** : *Nadie duerme solo* exige maintenant qu'aucune viñeta ne contienne *duerme solo* (nouveau prédicat `sinEvento`) ; secrets « automatiques » (vérifiés dans 100 % des solutions) remplacés ou retirés (c3n3 reste sans secret : niveau « énigme »).
- **Histoires vides** : les trois finales se gagnaient avec des cases sans rapport (Valeria seule dans l'hélicoptère ; *frutas ×4 + deux hélicoptères*). c3n4 → *Valeria duerme tranquila y todos están a salvo* (26 solutions) ; c3n5 → *Diego encuentra a Lucía y todos están a salvo* (6 256) ; c3n6 → **état initial** *todos tienen hambre y están cansados* (de 1,27 M à 20 088). `nivel.inicial` est affiché sous le titre (*« Al principio: … »*).
- **Chapitre 1** : 3e escena qui ferme l'arc (sol → río → fuego ; noche → linterna → refugio ; selva → montaña → frutas) pour que la 3e case ne soit plus une répétition ; c1n2 devient *Mateo ya no tiene frío* (même structure que c1n1).
- **c2n5** : *Valeria encuentra a Mateo y todos están a salvo* (le mapa n'était plus qu'un décor ; 35 → 6 solutions). ⚠️ Autre option, non retenue : interdire la retrouvaille dans *El rescate* (l'hélicoptère ne prend que ceux qui ne sont pas perdus) — plus dur, mais contredit la règle « ensemble = retrouvés ».
- **« ¿Qué pasa? »** explique désormais la condition manquante des titres d'événement (*« Primero Lucía tiene que estar enfadada (el fuego: comer y no compartir). Después, los dos en el refugio. »*).
- Non retenu : scène supplémentaire, rasgos à effet (Mateo commence affamé — testé : rend c3n1 plus lâche, 68 → 171), interdiction de la retrouvaille dans le rescate.

## 11. Phase 1 — modes et mise en page (validée implicitement : « termine le jeu »)

- **Écran d'accueil** à trois entrées : Pizarra / Solo / Autor. Le mode choisi est mémorisé (`localStorage`) ; « 🏠 » y ramène. Paramètres d'URL facultatifs pour la profe : `?modo=pizarra|solo&nivel=c2n1&dif=1|2|3`.
- **Sélecteur ★ ★★ ★★★** (en haut à droite, étoiles seules ; noms « Paso a paso / Estándar / Reto » dans le menu, jamais « facile / difficile »). ★ : niveaux de ≤ 3 cases et ≤ 3 escenas (chapitres 1–2), picto emoji sur chaque escena, pista automatique tous les 2 échecs, phrases visibles. ★★ : tout, une pista au 4ᵉ échec. ★★★ : niveaux de ≥ 4 cases (chapitre 3), modo escritor forcé, titre secret caché tant qu'il n'est pas trouvé. En ★★ le titre secret ne s'affiche qu'après une première réussite du niveau (il devient un second objectif de relecture).
- **Mise en page 16:9 sans défilement** : les cases sont sur **une seule ligne** (lecture gauche → droite comme une tira de cómic), même à 5–6 cases ; la largeur maximale d'une case est calculée pour que l'image 16:10 et ~3 lignes de phrase tiennent dans la hauteur disponible (`ajustarTira`). Deux rangées ont été essayées et rejetées : à 720p chaque rangée ne laissait que ~120 px d'image. Le stock tient sur une ligne horizontale, défilable quand il déborde (nivel libre).
- **Pizarra** : polices et contrastes augmentés (`body.pizarra`), barre « Clase » compacte (cronómetro, sorteo de números sans noms, equipos 2–4) **cachée par défaut** et ouverte par « ⏱ Clase », car elle coûte ~130 px de hauteur. Les scores et réglages de la barre sont dans `sobrevives.pizarra.v0`.
- **Solo** : étoiles par niveau (3 si réussi du premier coup, 2 jusqu'à 3 essais, 1 au-delà), « Borrar mis datos » efface tout (progression, réglages, niveaux de la classe, scores).
- Pas de verrouillage de progression : la profe choisit les niveaux ; Kiwi reste réservé (aucune règle écrite).

## 12. Phase 2 — escritor, Autor, Profe, impression

- **Modo escritor** : par case, la phrase est masquée ; A1 « elegir » = 3 phrases **générées par le moteur** (variantes de la même case : autre personnage, autre escena, autre état) ; A2 « escribir » = saisie avec comparaison tolérante (tildes, signes ¿¡, majuscules → « Casi: … » mais accepté ; ≤ 2 lettres de travers → « Casi: revisa “…” » refusé ; pista « L____ t____ s__. » dès 2 échecs ; « Ver la frase » au 4ᵉ). Un bouton 🔊 permet d'écouter la phrase (dictée). Le succès du niveau n'est fêté qu'une fois toutes les phrases complétées.
- **Objectif « historia »** (moteur) : pour un titre libre, le jeu « grabe » la solution jouée = états finaux exacts de chaque personnage (7 négatifs + a salvo) + les événements à titre (encuentra, cura, comparte…). Toute histoire aboutissant au même état final avec les mêmes événements est acceptée.
- **Codes Autor** : base32 Crockford (pas de I, L, O, U ; `S` + version + charge + contrôle), groupes de 4, insensibles à la casse ; un titre structuré fait ~16 caractères (`S199-H34R-1B2A-1`), un titre libre peut dépasser 60 caractères (il faut encoder le texte du titre) : pour dicter, préférer l'assistant de titres. Même contenu → même code → même id (pas de doublon à l'import).
- **Profe** (touche P) : mot de passe local par défaut « profe », modifiable (stocké dans les réglages, donc remis à zéro par « Borrar mis datos ») ; réglages (escritor, elegir/escribir, pretérito, barre Clase), solutions du niveau calculées dans un **Web Worker** construit à partir des scripts inlinés (aucun fichier externe ; repli synchrone si le navigateur refuse), bouton « Cargar » qui pose une solution sur le plateau, niveaux de la classe (jouer, supprimer, exporter/importer JSON).
- **Imprimir mi historia** : A4 paysage, page 1 = la BD résolue (dessins, visages selon l'état, phrases), page 2 = hoja de viñetas vide à 4 cases, page 3 = à 6 cases, avec lignes d'écriture et « Nombre : ____ » à remplir à la main (aucun nom saisi dans le jeu).

## 13. Phase 3 — contrôle qualité

- Tests verts : `solver` (16 niveaux, 0 erreur, 0 avis, chaque secret atteignable), `frases` (1 634 phrases), `escritor` (5 410 contrôles), `autor` (384), `pizarra` (25).
- Hors-ligne : le fichier ne fait **aucune** requête réseau (vérifié dans l'onglet réseau : la page seule, plus l'URL `blob:` locale du Worker).
- Trois navigateurs : rendu de `sobrevives.html` ouvert en `file://` vérifié en mode headless dans Chrome, Edge et Firefox installés sur ce PC (écran d'accueil et niveau ouvert) ; jeu complet vérifié à la souris et au clic-clic dans le navigateur intégré à 1280×720 et en bureau.
- Revue adversariale automatique (4 lentilles : bugs d'interface, moteur et modules, espagnol de l'interface, exactitude de la guía) : voir §14.

## 14. Reporté

Badge 🤝 « amigos » près des visages ; règles pour Kiwi ; verrouillage de progression ; dictée du code lettre par lettre par la synthèse vocale ; test réel sur tableau tactile.
