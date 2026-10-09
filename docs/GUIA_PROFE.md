# Cuéntalo — Guide de la professeure

> Document d'accompagnement du jeu « Cuéntalo » (espagnol LVB, collège, A1 → A2).
> Les chiffres de la partie 3 (solutions, titres secrets, phrases) sont calculés par le moteur du jeu lui-même
> (`node test/solver.js`), à partir des données de `src/contenido.js`. Rien n'est écrit de mémoire.

## 1. Présentation

« Cuéntalo » est un jeu de narration visuelle inspiré de *Storyteller*. Chaque niveau donne un titre en espagnol (« Lucía ya no tiene sed »), 3 à 6 cases de BD vides, quelques « escenas » (la selva, el río, la noche…) et un ou plusieurs « personajes » (Lucía, Mateo, Valeria, Diego). L'élève glisse une escena et un personaje dans chaque case. Le moteur écrit aussitôt la phrase de la case : « Lucía bebe agua del río. Ya no tiene sed. » Quand l'histoire réalise le titre, le niveau est réussi.

Le cœur pédagogique n'est pas le puzzle, c'est la phrase. Chaque case produit 1 à 3 phrases courtes, que l'élève lit, écoute et compare. Les phrases réemploient le lexique de la survie et font travailler les accords (« cansado / cansada / cansados »), les structures « tiene / está / ya no », puis « encuentra a », « comparte con », « pide perdón a ».

L'univers visuel prend la forme d'un carnet d'aventure dans une forêt peinte, inspiré de l'animation japonaise dessinée à la main : lumière douce, verts mousse, ocres et roses fanés. Les personnages ont des silhouettes plus naturelles et des contours bruns fins. Leurs accessoires restent des repères stables — la casquette de Lucía, le maillot de Mateo, l'appareil photo de Valeria, le carnet de Diego. Les expressions et les gestes changent avec les états du récit : bras croisés quand il fait froid, yeux écarquillés quand le personnage a peur, pansement quand il est blessé. Ces indices invitent à formuler une hypothèse avant de lire la phrase, sans remplacer les mots espagnols.

Pour découvrir ce nouvel univers, montrer une case et demander « ¿Cómo está? », puis faire lire ou écouter la phrase pour vérifier. Faire ensuite changer une seule scène : qu'est-ce qui a changé dans le visage, dans l'histoire et dans la phrase ? Cette comparaison relie directement l'image au sens de « tiene », « está » et « ya no ».

Le fichier `cuentalo.html` contient tout le jeu : un seul fichier, à ouvrir par double-clic, qui fonctionne hors-ligne et n'envoie aucune donnée nulle part. Il se copie sur une clé USB, un ENT ou le réseau du collège.

## 2. Prise en main

### 2.1 L'écran d'accueil

Trois entrées :

| Entrée | Pour qui | Usage |
|---|---|---|
| « Pizarra » | la classe entière, au vidéoprojecteur | gros affichage ; la professeure ou un élève manipule, la classe lit et répète |
| « Solo » | un élève en autonomie | sur poste ou tablette, seul ou en binôme |
| « Autor » | un élève ou la professeure | créer un niveau : choisir les escenas, les personajes, le titre, puis le partager par un code (partie 6) |

Le mode choisi est mémorisé sur ce poste : au lancement suivant, le jeu s'ouvre directement en « Pizarra » ou en « Solo » ; « 🏠 » (en haut à gauche) ramène à cet écran pour en changer. Choisir « Autor » sans avoir encore choisi de mode ouvre le jeu en « Solo ».

Astuce pour le poste du vidéoprojecteur : un raccourci vers `cuentalo.html?modo=pizarra&nivel=c1n1&dif=2` ouvre directement le mode, le niveau et le réglage ★ voulus.

### 2.2 Le sélecteur d'étoiles ★ / ★★ / ★★★

En haut à droite, un petit sélecteur règle le jeu. Il ne dit jamais « facile » ou « difficile » : les trois réglages s'appellent « Paso a paso », « Estándar » et « Reto ». L'élève le choisit lui-même, ce qui évite l'étiquette.

| Réglage | Nom | Ce qui change |
|---|---|---|
| ★ | « Paso a paso » | niveaux de 3 cases et 2-3 escenas (chapitres 1 et 2) ; chaque escena porte son picto emoji, sur la carte et dans la case ; une pista s'affiche automatiquement tous les 2 échecs (en tournant) ; les phrases restent visibles, sauf si la professeure a activé le « modo escritor » pour tous dans le panneau Profe |
| ★★ | « Estándar » | tous les niveaux ; une seule pista automatique, au 4ᵉ échec ; le titre secret s'affiche une fois le niveau réussi une première fois |
| ★★★ | « Reto » | niveaux de 4-6 cases (chapitre 3) ; le « modo escritor » est obligatoire (variante A1 ou A2 selon le réglage du panneau Profe, A1 par défaut) ; aucune pista automatique ; le « título secreto » reste caché tant qu'il n'est pas trouvé |

Dans tous les réglages, le titre est lu à voix haute à l'ouverture du niveau, et le bouton « 💡 Pista » reste disponible. La liste « ☰ Niveles » ne montre que les niveaux du réglage (chapitres 1-2 en ★, chapitre 3 en ★★★, tout en ★★) ; le nivel libre et les niveaux de la classe sont toujours visibles. Si le niveau en cours disparaît, le premier niveau visible s'ouvre.

### 2.3 Les boutons de l'interface

| Bouton | Ce qu'il fait |
|---|---|
| « 🏠 » | revient à l'écran d'accueil (Pizarra / Solo / Autor) |
| « ☰ Niveles » | ouvre la liste des niveaux par chapitre, avec les étoiles déjà obtenues ; en bas : « ✎ Crear un nivel », « ⌨ Tengo un código », « Borrar mis datos » |
| « ⏱ Clase » (Pizarra seulement) | affiche ou cache la barre de classe : cronómetro, sorteo d'un numéro d'élève, marcador des equipos. Elle est cachée par défaut pour laisser la place aux cases |
| « 💡 Pista » | affiche une pista du niveau (une autre à chaque clic) |
| « ? Ayuda » | ouvre ou ferme une aide aux premiers gestes : poser une escena, ajouter un personaje, compléter les cases, puis vérifier le titre |
| « 📖 Léxico » | les mots du niveau, avec un picto ; un clic sur un mot le fait entendre |
| « ¿Qué pasa? » | relit toute l'histoire case par case, résume l'état final de chaque personnage et explique pourquoi le titre n'est pas encore réalisé (« Lucía todavía tiene sed. ») |
| « ↺ » | vide toutes les cases |
| « 🖨 » | imprime la BD et les hojas de viñetas (partie 7) ; actif dès que le niveau est réussi (ou que l'histoire libre est complète) |
| « ✎ Contar » | après la réussite d'un niveau, ouvre le récit personnel en trois étapes (partie 4.4) |

L'aide apparaît à la première visite. Elle suit l'avancement du plateau et laisse les cartes accessibles ; « Entendido × » la referme. « ? Ayuda » permet de la retrouver à tout moment. Elle est masquée pendant la construction d'un niveau dans « Autor ».

**Reprendre une histoire.** Les cases se sauvegardent au fil des manipulations, niveau par niveau. Fermer la page ou passer à un autre niveau ne fait plus perdre la BD en cours ; les tentatives et les indices déjà parcourus sont également conservés. En mode écrivain, les réponses se retrouvent si le temps verbal et le mode n'ont pas changé. La reprise fonctionne sur le même poste et dans le même navigateur, y compris pour les niveaux de la classe déjà enregistrés. Un niveau encore en construction dans « Autor » doit toujours être enregistré avec « Guardar el nivel ».

### 2.4 Les gestes

- **Glisser-déposer** : on tire une carte escena ou une carte personaje vers une case.
- **Repli clic-clic** : clic sur la carte, puis clic sur la case (au clavier : Entrée ou Espace sur la carte, puis sur la case). Utile sur tablette, avec une souris capricieuse, ou pour un élève gêné par le glisser. Si la case refuse la carte (un personaje sans escena), la carte reste sélectionnée.
- **Corriger une case** : un clic sur un personnage placé le retire (sauf si une carte est sélectionnée : le clic pose alors la carte dans la case) ; le « × » en haut à droite de la case enlève l'escena et ses personnages ; « ↺ » vide tout.
- **Clic sur une phrase** (ou sur le titre) : la synthèse vocale la lit en espagnol. En « modo escritor », la phrase cachée s'écoute avec le bouton 🔊 de la case.
- **Touche P** : ouvre le panneau Profe. Mot de passe par défaut : « profe » (3 caractères minimum pour le nouveau). Il se change dans le panneau lui-même et reste stocké dans ce navigateur : c'est un verrou de confort, pas une protection. La touche ne répond pas quand le curseur est dans un champ de saisie ou qu'une fenêtre est ouverte : cliquer d'abord ailleurs.
- **Touche Échap** : ferme les panneaux ouverts et désélectionne la carte en cours.

### 2.5 Avant la première séance

1. Copier `cuentalo.html` sur le poste du vidéoprojecteur et sur les postes élèves (ou sur le réseau). Double-clic : le jeu s'ouvre dans le navigateur par défaut.
2. Cliquer sur un titre : si aucune voix espagnole ne se fait entendre, voir la partie 10.
3. Touche P, mot de passe « profe » : changer le mot de passe tout de suite. Les élèves découvrent vite les touches.
4. Faire soi-même un niveau du chapitre 1 avec glisser-déposer, puis en clic-clic, pour pouvoir montrer les deux gestes.
5. Ouvrir « 📖 Léxico » sur un niveau du chapitre 1 et regarder quels mots sont nouveaux pour la classe (partie 9).
6. Montrer « ? Ayuda », puis fermer et rouvrir un niveau commencé pour faire découvrir la reprise automatique.

## 3. Les niveaux

16 niveaux en 3 chapitres, plus un « nivel libre ». La progression suit la grammaire :

| Chapitre | Personajes | Cases | Ce qu'on travaille |
|---|---|---|---|
| 1 · Solo en la selva | 1 | 3 | « tiene hambre / sed / frío / miedo », « está cansado/a, perdido/a, a salvo », « ya no » ; la 3e case ferme l'histoire |
| 2 · Juntos | 2 | 3 | « encuentra a », « cura a », « todos / nadie », le pluriel et l'accord, « son amigos » |
| 3 · El grupo | 2-3 | 4-6 | « comparte con », « enfadado/a con », « pide perdón a », « nunca », titres composés avec « y », état initial (« Al principio… ») |

### 3.1 Ce que fait chaque escena

Pour lire les solutions, il faut connaître les règles des escenas. Elles dépendent de l'état du personnage et du fait d'être seul ou à deux.

| Escena | Seul·e | À deux | Objet |
|---|---|---|---|
| 🌴 La selva | marche seul·e et se perd | si l'un est perdu, l'autre le retrouve ; sinon ils marchent ensemble → faim + fatigue | avec « el mapa » : ne se perd pas |
| 🌊 El río | boit (plus soif) ; traverse et se mouille → froid | pareil pour les deux | avec « la cuerda » : traverse sans se mouiller |
| 🌞 El sol | il fait très chaud → soif | pareil | — |
| ⛈️ La tormenta | pluie → froid + peur | pluie → froid (pas de peur : ils sont ensemble) | avec « la manta » : pas de froid |
| 🌙 La noche | seul·e → peur | dorment ensemble → plus fatigués, plus peur | avec « la linterna » : dort tranquille |
| 🐆 El jaguar | peur, court → peur + perdu·e | crient ensemble, le jaguar s'en va | avec « el mapa » : ne se perd pas |
| 🐍 La serpiente | la serpiente le mord → blessé·e | l'autre la voit et prévient : personne n'est blessé | — |
| 🍌 El árbol de frutas | mange → plus faim | pareil | — |
| 🔥 El fuego | fait du feu → plus froid ; avec « la comida » et faim : mange | si un seul a la comida et l'autre a faim : amis → partage ; pas amis → mange seul et l'autre est fâché | — |
| 🏕️ El refugio | se repose → plus fatigué·e, plus peur | en plus : soigne le blessé ; demande pardon si l'un est fâché | — |
| ⛰️ La montaña | monte → fatigue + faim ; d'en haut voit le río → plus perdu·e | pareil | — |
| 🗺️ El mapa (1 place) | trouve le mapa → plus perdu·e, et le garde | — | + mapa |
| 🎒 La mochila (1 place) | trouve une mochila avec de la nourriture → plus faim, et garde la comida | — | + comida |
| 🪢 La cuerda (1 place) | trouve une corde et la garde | — | + cuerda |
| 🧣 La manta (1 place) | trouve une couverture → plus froid, et la garde | — | + manta |
| 🔦 La linterna (1 place) | trouve une lampe → plus peur, et la garde | — | + linterna |
| 🚁 El rescate | l'hélicoptère ! → « a salvo » ; si le personnage est perdu, l'hélicoptère ne le voit pas | les deux sont « a salvo » (à deux, ils se sont retrouvés) | — |

Trois règles générales :

- partager une case rend « amigos » (« Ahora Lucía y Mateo son amigos. »), sauf si l'un mange sans partager ;
- un personnage « a salvo » ne peut plus apparaître ensuite (« ¡Pero Lucía ya está a salvo! No puede estar aquí. ») ;
- tous les personajes du niveau doivent apparaître au moins une fois (« Mateo no sale en la historia. »).

### 3.2 Comment lire les tableaux

- **Solution** : « 1 sol (Lucía) · 2 río (Lucía) · 3 fuego (Lucía) » = case 1 : el sol avec Lucía ; case 2 : el río avec Lucía ; case 3 : el fuego avec Lucía. C'est la solution la plus variée parmi celles que liste le résolveur.
- **Nb** : nombre d'histoires complètes différentes qui réalisent le titre (résolveur exact du moteur). Plusieurs solutions, ce n'est pas un défaut : chaque élève imprime une BD différente.
- **Titre secret** : dans les chapitres 2 et 3, un second titre caché peut être réalisé en même temps. La solution donnée réalise les deux titres (vérifiée avec le moteur). Le niveau c3n3 n'a volontairement pas de secret : c'est le niveau « énigme », avec 2 solutions seulement.
- **Pistas** : ce qu'affiche « 💡 Pista », dans l'ordre.

### 3.3 Capítulo 1 · Solo en la selva

| id | Titre | Cases | Escenas | Personajes | Solution | Nb | Titre secret | Pistas |
|---|---|---|---|---|---|---|---|---|
| c1n1 | Lucía ya no tiene sed | 3 | sol · río · fuego | Lucía | 1 sol (Lucía) · 2 río (Lucía) · 3 fuego (Lucía) | 6 | — | « Primero hace calor… ¿y después? » · « En el río, Lucía bebe agua. » |
| c1n2 | Mateo ya no tiene frío | 3 | río · fuego | Mateo | 1 río (Mateo) · 2 río (Mateo) · 3 fuego (Mateo) | 3 | — | « Mateo se moja en el río. » · « El fuego quita el frío. ¡Cuidado con el orden! » |
| c1n3 | Valeria duerme tranquila | 3 | noche · linterna · refugio | Valeria | 1 linterna (Valeria) · 2 noche (Valeria) · 3 refugio (Valeria) | 7 | — | « De noche y sola, Valeria tiene miedo. » · « Con la linterna, no tiene miedo. » |
| c1n4 | Diego ya no está perdido | 3 | selva · montaña · frutas | Diego | 1 selva (Diego) · 2 montaña (Diego) · 3 árbol de frutas (Diego) | 6 | — | « Si va solo por la selva, Diego se pierde. » · « Desde la montaña se ve el río. » |
| c1n5 | Lucía está a salvo | 3 | selva · mapa · rescate | Lucía | 1 selva (Lucía) · 2 mapa (Lucía) · 3 rescate (Lucía) | 3 | — | « El helicóptero no ve a una persona perdida. » · « Con el mapa, Lucía no se pierde. » |

Remarque : c1n2 n'a que deux escenas pour trois cases ; une escena se répète forcément (« río » deux fois). C'est l'occasion de parler de la répétition dans un récit.

### 3.4 Capítulo 2 · Juntos

| id | Titre | Cases | Escenas | Personajes | Solution | Nb | Titre secret + solution qui réalise les deux | Pistas |
|---|---|---|---|---|---|---|---|---|
| c2n1 | Mateo encuentra a Lucía | 3 | selva · noche · sol | Lucía, Mateo | 1 selva (Lucía) · 2 noche (Lucía) · 3 sol (Lucía, Mateo) | 63 | « Nadie duerme solo » → 1 selva (Lucía) · 2 noche (Lucía, Mateo) · 3 sol (Lucía) | « Primero, Lucía se pierde sola. » · « Después, Mateo y Lucía están juntos. » |
| c2n2 | Valeria cura a Diego | 3 | serpiente · refugio | Valeria, Diego | 1 serpiente (Diego) · 2 serpiente (Diego) · 3 refugio (Valeria, Diego) | 14 | « Valeria está herida » → 1 serpiente (Diego) · 2 refugio (Valeria, Diego) · 3 serpiente (Valeria) | « Si Diego está solo, la serpiente le muerde. » · « En el refugio, el otro cura al herido. » |
| c2n3 | Lucía y Mateo ya no tienen hambre | 3 | selva · frutas · noche | Lucía, Mateo | 1 selva (Lucía, Mateo) · 2 árbol de frutas (Lucía, Mateo) · 3 noche (Lucía) | 24 | « Nadie está cansado » → 1 selva (Lucía, Mateo) · 2 árbol de frutas (Lucía, Mateo) · 3 noche (Lucía, Mateo) | « Caminar juntos da hambre. » · « Las frutas quitan el hambre: ¡cuidado con el orden! » |
| c2n4 | Nadie tiene miedo y todos tienen frío | 3 | noche · tormenta · jaguar | Valeria, Diego | 1 noche (Valeria, Diego) · 2 tormenta (Valeria, Diego) · 3 jaguar (Valeria, Diego) | 39 | « El jaguar se va » → la même solution réalise les deux titres | « Juntos, no tienen miedo. » · « La tormenta da frío… y miedo a quien está solo. » |
| c2n5 | Valeria encuentra a Mateo y todos están a salvo | 3 | selva · mapa · rescate | Valeria, Mateo | 1 selva (Mateo) · 2 mapa (Valeria) · 3 rescate (Mateo, Valeria) | 6 | « Valeria encuentra el mapa » → la même solution réalise les deux titres | « El helicóptero no ve a una persona perdida. » · « ¿Quién necesita el mapa? » |

Remarque : c2n2 n'a que deux escenas ; « serpiente » revient deux fois. Dans la solution secrète, c'est Valeria qui finit mordue : le titre secret « Valeria está herida » est une fin ouverte, à discuter avec la classe.

### 3.5 Capítulo 3 · El grupo

| id | Titre | Cases | Escenas | Personajes | Solution | Nb | Titre secret + solution qui réalise les deux | Pistas |
|---|---|---|---|---|---|---|---|---|
| c3n1 | Lucía comparte la comida con Mateo | 4 | mochila · selva · fuego · noche | Lucía, Mateo | 1 mochila (Lucía) · 2 selva (Lucía, Mateo) · 3 fuego (Lucía, Mateo) · 4 noche (Lucía) | 68 | « Nadie está cansado » → 1 mochila (Lucía) · 2 selva (Lucía, Mateo) · 3 fuego (Lucía, Mateo) · 4 noche (Lucía, Mateo) | « Lucía necesita la mochila. » · « Mateo necesita tener hambre. » · « Solo se comparte con los amigos. » |
| c3n2 | Mateo está enfadado con Lucía | 4 | mochila · montaña · fuego · río | Lucía, Mateo | 1 mochila (Lucía) · 2 montaña (Mateo) · 3 fuego (Lucía, Mateo) · 4 río (Lucía) | 58 | « Mateo tiene frío » → 1 mochila (Lucía) · 2 montaña (Mateo) · 3 fuego (Lucía, Mateo) · 4 río (Mateo) | « Si no son amigos, Lucía no comparte. » · « Mateo tiene hambre, pero Lucía no comparte. » |
| c3n3 | Diego pide perdón a Lucía | 4 | mochila · montaña · fuego · refugio | Lucía, Diego | 1 mochila (Diego) · 2 montaña (Lucía) · 3 fuego (Lucía, Diego) · 4 refugio (Lucía, Diego) | **2** | — (niveau « énigme », sans secret ; l'autre solution inverse les cases 1 et 2) | « Primero, Diego no comparte y Lucía está enfadada. » · « En el refugio se pide perdón. » |
| c3n4 | Valeria duerme tranquila y todos están a salvo | 4 | noche · jaguar · linterna · rescate | Valeria, Diego | 1 jaguar (Valeria) · 2 linterna (Valeria) · 3 noche (Valeria) · 4 rescate (Valeria, Diego) | 26 | « Diego tiene miedo » → 1 jaguar (Diego) · 2 linterna (Valeria) · 3 noche (Valeria) · 4 rescate (Valeria, Diego) | « Valeria necesita la linterna antes de la noche. » · « El helicóptero no ve a quien está perdido. » |
| c3n5 | Diego encuentra a Lucía y todos están a salvo | 5 | selva · jaguar · noche · mapa · rescate | Lucía, Mateo, Diego | 1 selva (Lucía) · 2 jaguar (Lucía) · 3 noche (Lucía) · 4 rescate (Mateo) · 5 rescate (Lucía, Diego) | 6 256 | « Mateo nunca tiene miedo » → la même solution réalise les deux titres | « Primero, Lucía se pierde sola. » · « El helicóptero solo lleva a dos personas y no ve a quien está perdido. » |
| c3n6 | Todos están contentos y a salvo — « Al principio: Lucía tiene hambre. Está cansada. Mateo tiene hambre. Está cansado. Valeria tiene hambre. Está cansada. » | 6 | selva · río · noche · frutas · refugio · rescate | Lucía, Mateo, Valeria | 1 noche (Lucía, Mateo) · 2 árbol de frutas (Lucía) · 3 árbol de frutas (Mateo, Valeria) · 4 refugio (Valeria) · 5 rescate (Lucía) · 6 rescate (Mateo, Valeria) | 20 088 | « Lucía y Valeria duermen bien » → 1 noche (Lucía, Valeria) · 2 árbol de frutas (Lucía) · 3 árbol de frutas (Mateo, Valeria) · 4 refugio (Mateo) · 5 rescate (Lucía) · 6 rescate (Mateo, Valeria) | « Al principio todos tienen hambre y están cansados. » · « Contento = sin hambre, sin sed, sin frío, sin miedo. Y no está cansado. » · « El helicóptero solo lleva a dos personas. » |

Les grands nombres de c3n5 et c3n6 ne veulent pas dire « facile » : avec 3 personnages et 5-6 cases, le nombre d'histoires possibles explose (plusieurs millions), et les solutions n'en représentent qu'une toute petite part. En pratique, les élèves doivent vraiment construire une chaîne : se perdre, être retrouvé, puis deux hélicoptères (il n'emporte que deux personnes).

### 3.6 Les histoires complètes (pour préparer la séance)

Voici, pour chaque niveau, les phrases que le moteur écrit pour la solution du tableau. À lire avant la séance, ou à imprimer comme corrigé.

- **c1n1** — « Hace mucho calor. Lucía tiene sed. Lucía bebe agua del río. Ya no tiene sed. Cruza el río y se moja. Tiene frío. Lucía hace fuego. Ya no tiene frío. »
- **c1n2** — « Mateo bebe agua del río. Cruza el río y se moja. Tiene frío. Mateo bebe agua del río. Cruza el río y se moja. Tiene frío. Mateo hace fuego. Ya no tiene frío. »
- **c1n3** — « Valeria encuentra una linterna. La guarda. Es de noche. Valeria enciende la linterna y duerme tranquila. Valeria descansa en el refugio. Está tranquila. »
- **c1n4** — « Diego camina solo por la selva y se pierde. Diego sube la montaña. Está cansado y tiene hambre. Desde arriba ve el río. ¡Ya no está perdido! Diego come frutas. Ya no tiene hambre. »
- **c1n5** — « Lucía camina sola por la selva y se pierde. Lucía encuentra el mapa. ¡Ya no está perdida! ¡El helicóptero! Lucía está a salvo. »
- **c2n1** — « Lucía camina sola por la selva y se pierde. Es de noche. Lucía está sola y tiene miedo. Hace mucho calor. Mateo encuentra a Lucía. ¡Qué alegría! Lucía y Mateo tienen sed. Ahora Lucía y Mateo son amigos. »
- **c2n2** — « ¡Ay! Una serpiente muerde a Diego. Está herido. ¡Ay! Una serpiente muerde a Diego. Está herido. Valeria y Diego descansan en el refugio. Valeria cura a Diego. Diego ya no está herido. Ahora Valeria y Diego son amigos. »
- **c2n3** — « Lucía y Mateo caminan juntos por la selva. Tienen hambre y están cansados. Ahora Lucía y Mateo son amigos. Lucía y Mateo comen frutas. Ya no tienen hambre. Es de noche. Lucía está sola y tiene miedo. »
- **c2n4** — « Es de noche. Valeria y Diego están juntos y duermen bien. No tienen miedo. Ahora Valeria y Diego son amigos. Llueve mucho. Valeria y Diego tienen frío. ¡Un jaguar! Valeria y Diego gritan juntos y el jaguar se va. »
- **c2n5** — « Mateo camina solo por la selva y se pierde. Valeria encuentra un mapa. Lo guarda. Valeria encuentra a Mateo. ¡Qué alegría! ¡El helicóptero! Mateo y Valeria están a salvo. Ahora Mateo y Valeria son amigos. »
- **c3n1** — « Lucía encuentra una mochila con comida. ¡Qué suerte! Lucía y Mateo caminan juntos por la selva. Tienen hambre y están cansados. Ahora Lucía y Mateo son amigos. Lucía y Mateo hacen fuego. Lucía comparte la comida con Mateo. Ya no tienen hambre. Es de noche. Lucía está sola y tiene miedo. »
- **c3n2** — « Lucía encuentra una mochila con comida. ¡Qué suerte! Mateo sube la montaña. Está cansado y tiene hambre. Lucía y Mateo hacen fuego. Lucía come y no comparte. Mateo tiene hambre y está enfadado con Lucía. Lucía bebe agua del río. Cruza el río y se moja. Tiene frío. »
- **c3n3** — « Diego encuentra una mochila con comida. ¡Qué suerte! Lucía sube la montaña. Está cansada y tiene hambre. Lucía y Diego hacen fuego. Diego come y no comparte. Lucía tiene hambre y está enfadada con Diego. Lucía y Diego descansan en el refugio. Diego pide perdón a Lucía. Lucía ya no está enfadada. Ahora Lucía y Diego son amigos. »
- **c3n4** — « ¡Un jaguar! Valeria tiene miedo y corre. Se pierde. Valeria encuentra una linterna. Ya no tiene miedo. Es de noche. Valeria enciende la linterna y duerme tranquila. Diego encuentra a Valeria. ¡Qué alegría! ¡El helicóptero! Valeria y Diego están a salvo. Ahora Valeria y Diego son amigos. »
- **c3n5** — « Lucía camina sola por la selva y se pierde. ¡Un jaguar! Lucía tiene miedo y corre. Se pierde. Es de noche. Lucía está sola y tiene miedo. ¡El helicóptero! Mateo está a salvo. Diego encuentra a Lucía. ¡Qué alegría! ¡El helicóptero! Lucía y Diego están a salvo. Ahora Lucía y Diego son amigos. »
- **c3n6** — « Es de noche. Lucía y Mateo están juntos y duermen bien. Ya no están cansados. Ahora Lucía y Mateo son amigos. Lucía come frutas. Ya no tiene hambre. Mateo y Valeria comen frutas. Ya no tienen hambre. Ahora Mateo y Valeria son amigos. Valeria descansa en el refugio. Ya no está cansada. ¡El helicóptero! Lucía está a salvo. ¡El helicóptero! Mateo y Valeria están a salvo. »

### 3.7 Le « nivel libre »

Le niveau « Mi historia » n'a pas de titre : 6 cases, les 17 escenas et les 4 personajes. Il n'y a pas de pistas. Le moteur écrit quand même les phrases de chaque case, et « ¿Qué pasa? » relit l'histoire complète et résume l'état final de chacun (« Lucía tiene hambre y frío. Está perdida. »). Le panneau « Léxico » y réunit les 56 mots du jeu. C'est le terrain d'entraînement de la tâche finale (partie 4.3) : l'élève invente, lit ce que le moteur écrit, puis trouve lui-même un titre à son histoire. L'indicateur à droite du titre compte les cases remplies (« 3/6 viñetas ») puis affiche « ¡Historia completa! » ; « 🖨 » s'active alors. Le « modo escritor » ne s'applique pas au nivel libre (ni pendant la création d'un niveau en Autor) : il n'y a pas de phrase « attendue ».

## 4. Trois déroulés

### 4.1 Rituel de 10 minutes en début d'heure (« Pizarra »)

Matériel : le vidéoprojecteur, le fichier ouvert en « Pizarra », un niveau choisi à l'avance.

1. **Le titre** (1 min). Lire le titre ensemble ; clic sur le titre pour l'entendre. Faire répéter par deux ou trois élèves, puis par la classe.
2. **Le sorteo** (1 min). Ouvrir la barre « ⏱ Clase », régler « Alumnos: » sur l'effectif, cliquer « ¡Número! » : un numéro d'élève sort (jamais un nom). L'élève vient placer la première case, ou la dicte à la professeure : « la selva, con Lucía ».
3. **La phrase** (2 min). Lire la phrase produite à voix haute ; la classe répète. Clic sur la phrase pour la réécouter si besoin. Question rapide : « ¿Cómo está Lucía? » → « Está perdida. »
4. **La suite** (4 min). Nouveau tirage pour chaque case, jusqu'à la fin. Si le titre n'est pas réalisé : « ¿Qué pasa? », on lit l'explication (« Lucía todavía tiene sed. »), on corrige une case.
5. **La relecture** (2 min). La classe relit toute l'histoire en chœur, ou un élève la lit seul avec la voix en appui.

Cinq rituels suffisent pour le chapitre 1. Les élèves retiennent « tiene / está / ya no » sans leçon de grammaire, parce qu'ils ont entendu et répété les phrases vingt fois. Variantes : faire deviner la phrase avant de la lire (« ¿Qué va a pasar en el río? ») ; cacher la phrase et la faire reconstituer de mémoire (c'est le « modo escritor », partie 5) ; faire réécouter le titre d'un clic (il est lu automatiquement à l'ouverture de chaque niveau).

### 4.2 Séance de 55 minutes

Matériel : vidéoprojecteur, un poste ou une tablette pour deux élèves, cahiers.

| Temps | Phase | Déroulé |
|---|---|---|
| 0-10 min | Découverte collective | « Pizarra », un niveau du chapitre travaillé. Titre lu et répété. On résout ensemble, en nommant les escenas et les personajes à voix haute. |
| 10-35 min | Binômes en « Solo » | Chaque binôme règle ses étoiles (★ pour ceux qui ont besoin des pictos et des pistas automatiques, ★★ pour la plupart, ★★★ pour ceux qui veulent le « modo escritor » et le titre secret). Consigne : résoudre 2 niveaux et noter dans le cahier la phrase préférée de chaque niveau. La professeure passe, fait lire une phrase à voix haute par binôme. |
| 35-50 min | Mise en commun | Deux binômes présentent leur histoire au vidéoprojecteur. On ouvre « ¿Qué pasa? » pour relire, puis « 📖 Léxico » pour pointer 5 mots et les faire entendre. Si deux binômes ont des solutions différentes pour le même titre : comparer, c'est le moment de langue (« ¿Por qué Lucía está cansada aquí y no allí? »). |
| 50-55 min | Trace écrite | Chaque élève recopie le titre et 3 phrases de son histoire. En 3e, en « pretérito » (partie 5). |

Différenciation par les étoiles : le réglage change le jeu, pas l'exercice. Tout le monde produit une BD et des phrases ; seule l'aide varie. Un binôme qui a fini ouvre le « nivel libre » et invente.

### 4.3 Tâche finale : « Mi cómic de supervivencia »

**Consigne élève (à donner en espagnol simple).** Tu crées une histoire de survie de 4 ou 6 cases pour Lucía, Mateo, Valeria ou Diego. Tu lui donnes un titre. Tu l'imprimes et tu écris les phrases.

**Étapes (deux séances).**

1. En « Autor » (écran d'accueil, ou « ☰ Niveles » → « ✎ Crear un nivel »), l'élève coche ses personajes, ses escenas, le nombre de cases (4 ou 6) et choisit un titre : un titre de l'assistant, ou le sien avec « Otro título ». Puis « Jugar la solución → ».
2. Il joue sa propre histoire sur le plateau, lit les phrases produites, les écoute, vérifie avec « ¿Qué pasa? ». Quand le titre est réalisé (avec un titre libre : quand l'histoire est complète), « 💾 Guardar el nivel » enregistre le niveau et affiche son code, à recopier sur la copie. Le niveau rejoint « ☰ Niveles » → « Niveles de la clase ».
3. Il rejoue son niveau, puis « 🖨 » (ou « 🖨 Imprimir » dans la fenêtre de réussite) : il obtient sa BD résolue avec ses phrases, puis les deux hojas de viñetas vides (partie 7).
4. Sur la hoja de viñetas papier, il réécrit l'histoire de sa main : il recopie, puis complète (un détail par case, une phrase de plus, un dialogue dans une bulle).
5. Il lit sa BD à la classe ou en petit groupe. Les autres devinent le titre.

**Grille d'évaluation (/10).**

| Critère | Points | Ce qu'on regarde |
|---|---|---|
| Respect du titre | 2 | l'histoire réalise bien le titre choisi ; le titre est en espagnol correct |
| Cohérence du récit | 2 | l'ordre des cases a un sens (cause → conséquence) ; pas de personnage « a salvo » qui réapparaît |
| Lexique de la séquence | 2 | les mots de survie sont réemployés à l'écrit (selva, río, fuego, perdido, a salvo…) |
| Accords genre / nombre | 2 | « cansada », « perdidos », « juntas », « están » : l'accord suit le personnage |
| Ponctuation ¿ ¡ | 1 | « ¡Qué alegría! », « ¿Quién está aquí? » : les deux signes, majuscules et points |
| Présentation / oral | 1 | BD propre et lisible ; lecture à voix haute compréhensible |
| **Total** | **10** | |

Variante A1 (5e) : 4 cases, phrases recopiées puis une phrase ajoutée par case. Variante A2 (4e-3e) : 6 cases, phrases réécrites au « pretérito », un titre inventé. Le code du niveau (partie 6) peut être noté sur la copie : la professeure rejoue l'histoire de l'élève pour corriger. Avec un titre inventé, le code est long (60 caractères et plus) : le faire recopier soigneusement, ou retrouver le niveau dans la liste du panneau Profe, qui affiche le code de chaque niveau de la classe.

### 4.4 Après la réussite : raconter avec ses propres mots

La fenêtre de réussite propose « ✎ Contar con mis palabras ». Le bouton « ✎ Contar » du plateau permet aussi de retrouver cette activité. Trois amorces structurent un petit récit : **« Primero… »**, **« Después… »**, **« Al final… »**. L'élève peut raconter oralement à un camarade ou écrire dans les trois champs (500 caractères maximum par champ).

Cette étape est facultative et ne modifie pas les étoiles. Elle ne compare pas le texte de l'élève à la phrase du moteur : une reformulation, un détail ou un dialogue peuvent y trouver leur place. Il n'y a pas de correction automatique ; l'enseignante ou un camarade aide à relire. En A1, demander une phrase par étape ; en A2, faire expliciter une cause ou ajouter un dialogue. On peut s'appuyer sur la BD pour vérifier que le récit conserve le sens de l'histoire.

Le brouillon se sauvegarde automatiquement avec le niveau sur ce navigateur. Il reste à recopier si une trace sur papier est souhaitée : « 🖨 » imprime la BD et les feuilles de cases, pas les trois champs du récit personnel.

## 5. Différenciation et inclusion

- **Les étoiles** (partie 2.2) sont le premier levier : même niveau, même titre, mais pictos sur les escenas et pistas automatiques en ★ ; modo escritor et titre secret en ★★★. Sans mention de niveau de difficulté, l'élève choisit sans se sentir jugé, et peut changer en cours de route.
- **Les pictos** : chaque escena a son dessin et son emoji, chaque mot du « Léxico » a un picto. Un élève qui ne lit pas encore le mot reconnaît l'image, et le visage du personnage change avec son état (peur, faim, froid…).
- **La synthèse vocale** : un clic sur une phrase, sur le titre ou sur un mot du Léxico le fait entendre en espagnol. Pour un élève dyslexique ou petit lecteur, c'est la voie d'entrée. Vérifier la voix avant la séance (partie 10).
- **Le « modo escritor »** : au lieu de lire la phrase produite, l'élève doit la produire. Il est toujours actif en ★★★ ; la professeure l'active pour tous dans le panneau Profe (touche P), où elle choisit aussi la variante A1 ou A2. Dans chaque case, un bouton 🔊 fait entendre la phrase attendue : en A2 cela devient une dictée.
  - **A1 : choisir parmi 3.** Dans la case, le bouton « Elegir la frase » ouvre une fenêtre en gros caractères avec le dessin de la case et trois phrases ; une seule correspond à l'image. Les deux autres sont des phrases vraies pour une autre case (autre personnage, autre escena, autre état du personnage), toutes produites par le moteur, donc toujours correctes : il faut lire l'image et le contexte, pas chercher la faute. Une mauvaise réponse se barre et l'élève réessaie.
  - **A2 : écrire.** L'élève tape la phrase. La correction tolère les accents, la ñ, les signes ¿ ¡ et les majuscules (« lucia tiene sed » est accepté avec le message « Casi: mira los acentos… » ; « montana » avec « Casi: mira la ñ. »), accepte les prénoms dans les deux ordres (« Mateo y Lucía » pour « Lucía y Mateo »), signale une ou deux lettres de travers (« Casi: revisa «tiene». ») et, sinon, dit simplement qu'il manque ou qu'il y a trop de mots. Un bouton « ñ » à côté du champ insère la lettre (sur un clavier français : AltGr + 2, puis n). Après 2 échecs, une pista donne les initiales (« L____ t____ s__. ») ; après 4, « Ver la frase » affiche la phrase.
  - Le niveau n'est fêté (étoiles) qu'une fois toutes les phrases trouvées ou écrites. Tant qu'il en reste, « ¿Qué pasa? » montre le diagnostic mais pas les phrases cachées, et « 🖨 » reste grisé.
  - Les deux phrases fausses et leur ordre ne dépendent que du niveau et de la case : tous les élèves voient les mêmes options, la professeure peut les préparer.
- **Le « pretérito » (3e)** : le jeu peut passer toutes les phrases au passé. La règle est unique et c'est celle du contraste passé composé / imparfait enseigné en A2 (voir `docs/DECISIONS.md` §6) : **les actions à l'indefinido** (« caminó, se perdió, encontró, bebió, durmió »), **les états et les cadres à l'imperfecto** (« tenía sed, estaba perdida, ya no estaban cansados · Llovía mucho. Hacía calor. Era de noche. »). Exemple produit par le moteur pour c2n1 :
  - présent : « Lucía camina sola por la selva y se pierde. Es de noche. Lucía está sola y tiene miedo. Hace mucho calor. Mateo encuentra a Lucía. ¡Qué alegría! Lucía y Mateo tienen sed. Ahora Lucía y Mateo son amigos. »
  - pretérito : « Lucía caminó sola por la selva y se perdió. Era de noche. Lucía estaba sola y tenía miedo. Hacía mucho calor. Mateo encontró a Lucía. ¡Qué alegría! Lucía y Mateo tenían sed. Lucía y Mateo se hicieron amigos. »
- **Élèves petits lecteurs** : commencer par « Pizarra » et le rituel (partie 4.1), où l'on entend avant de lire ; puis « Solo » en ★ avec un binôme lecteur ; faire répéter la phrase après la voix ; n'écrire qu'une phrase par séance, mais la sienne.

Quel réglage pour quel élève ?

| Profil | Réglage conseillé | Pourquoi |
|---|---|---|
| Élève en difficulté de lecture, allophone débutant | ★ « Paso a paso » | pictos sur chaque escena, pistas automatiques tous les 2 échecs ; niveaux de 3 cases ; le titre et chaque phrase s'écoutent d'un clic |
| Élève A1 ordinaire (5e, 4e) | ★★ « Estándar » | le jeu tel quel ; « modo escritor » A1 pour la trace écrite |
| Élève rapide, A2 (4e, 3e) | ★★★ « Reto » | 4-6 cases, « modo escritor » obligatoire, titre secret à découvrir ; « pretérito » en 3e |
| Groupe hétérogène en binômes | mélanger | le lecteur fort lit, l'autre manipule et répète ; on échange au niveau suivant |

## 6. Mode « Autor » et codes

- « Autor » s'ouvre depuis l'écran d'accueil ou depuis « ☰ Niveles » → « ✎ Crear un nivel ». L'élève ou la professeure compose un niveau en quatre étapes : les personajes (1 à 4), les escenas (1 à 8), le nombre de cases (2 à 6), le titre. Pour le titre, un **assistant** propose les titres que ces cartes permettent (« Valeria cura a Diego », « Nadie tiene miedo »…) ; « Otro título » permet d'écrire le sien. Au clic sur « Jugar la solución → », le jeu vérifie en une seconde environ que le titre choisi a bien une solution avec ce nombre de cases ; sinon il le dit (« no tiene solución con estas cartas y 2 viñetas ») et on choisit un autre titre, d'autres cartes ou plus de cases.
- Puis « Jugar la solución → » : l'auteur joue son histoire sur le plateau. Avec un titre de l'assistant, le bouton « 💾 Guardar el nivel » s'active quand l'histoire réalise le titre ; avec un titre libre, dès que l'histoire est complète : le jeu « apprend » alors cette histoire (mêmes états finaux, mêmes événements) et l'exigera des autres joueurs. Le niveau est enregistré aussitôt et son code s'affiche ; le nombre de solutions est calculé ensuite en arrière-plan (« Calculando las soluciones… »), sans bloquer la page.
- Un niveau se partage par un **code à dicter** : lettres et chiffres par groupes de 4, par exemple « S199-H34R-1B2A-1 ». Il n'utilise jamais I, L, O ni U (si un élève lit « O », c'est un zéro ; « I » ou « L », un un) et il est insensible à la casse et aux tirets : « s199 h34r 1b2a 1 » marche aussi. Un titre de l'assistant tient en 12 à 32 caractères (tirets compris) ; un titre libre encode le texte du titre (environ 3 caractères de code par lettre : « Una noche en la selva » en donne déjà 64) : pour dicter, préférer l'assistant.
- **Importer** : « ☰ Niveles » → « ⌨ Tengo un código » (ou depuis le panneau Profe) ; on tape le code reçu ; le niveau apparaît dans « ☰ Niveles » sous « Niveles de la clase » et se joue comme les autres. Un code erroné d'une lettre est refusé.
- **Où sont les niveaux de la classe ?** Dans le `localStorage` du navigateur de chaque poste, c'est-à-dire sur ce poste, dans ce navigateur, et nulle part ailleurs. Un niveau créé sur le poste 3 n'existe pas sur le poste 4 tant qu'on n'y a pas tapé son code.
- **Export / import JSON** : le panneau Profe (touche P) liste les niveaux de la classe avec leur code (« Jugar », 🗑 pour supprimer) ; « ⬇ Exportar JSON » les enregistre dans `cuentalo-niveles.json`, pour les garder d'une année sur l'autre ou les passer sur un autre poste ; « ⬆ Importar JSON » les recharge (les niveaux déjà présents ne sont pas dupliqués, un niveau abîmé est écarté et signalé).

Conseils :

- Avant une séance en « Autor », créer un niveau témoin et dicter son code à toute la classe. C'est l'exercice d'écoute et d'épellation du jour (« a, be, tres, ka… »).
- Demander aux élèves d'écrire leur code en haut de leur hoja de viñetas : il remplace le nom sur la copie et permet de rejouer leur histoire.
- Exporter le JSON en fin de séquence, avant « Borrar todo » dans le panneau Profe (partie 8).

## 7. Impression

« 🖨 » (dans la barre du haut, ou « 🖨 Imprimir » dans la fenêtre de réussite) ouvre la boîte d'impression du navigateur avec trois pages **A4 paysage** :

1. la BD résolue : le titre, la ligne « Al principio » si le niveau en a une, les cases dans l'ordre (sur une ligne jusqu'à 3 cases, en 2 × 2 à 4 cases, en 3 × 2 à 5-6 cases), avec leurs dessins, les visages selon l'état et les phrases produites ; en pied, les personajes, le titre secret s'il a été trouvé (🔑) et « Nombre o código : ____ » à remplir à la main (aucun nom n'est saisi dans le jeu) ;
2. une « hoja de viñetas » vide de 4 cases, avec trois lignes d'écriture sous chaque case ;
3. la même à 6 cases.

Pour n'imprimer que la hoja de viñetas, choisir les pages 2 ou 3 dans la boîte d'impression.

Conseils :

- Dans la boîte d'impression du navigateur, choisir **Paysage** et **A4** ; laisser les marges par défaut ou « minimales ».
- Les dessins et les lignes d'écriture s'impriment sans réglage particulier (pas besoin de cocher « Graphiques d'arrière-plan »). En noir et blanc, les dessins restent lisibles (trait net, fonds unis).
- En « modo escritor », « 🖨 » ne s'active qu'une fois toutes les phrases trouvées : la feuille ne sert pas d'antisèche.
- Utiliser « Aperçu avant impression » ou « Enregistrer en PDF » pour contrôler la mise en page avant de lancer 30 copies.
- Pour la tâche finale, imprimer d'abord la hoja de viñetas seule pour toute la classe, puis la BD de chaque élève.
- Une BD de 6 cases avec ses phrases est dense : au vidéoprojecteur, préférer l'écran ; sur papier, la hoja de viñetas vide laisse la place d'écrire gros.

## 8. RGPD et données

- Le jeu ne demande **aucun nom d'élève**, aucune adresse, aucun identifiant. Le tirage au sort en « Pizarra » utilise des numéros, pas des noms.
- **Aucune télémétrie** : le fichier ne fait aucune requête réseau. Il fonctionne sans Internet. Rien n'est envoyé à qui que ce soit.
- Tout ce que le jeu retient (étoiles, niveau en cours, cases des histoires commencées, réponses du mode écrivain, récits personnels, réglages — y compris le mot de passe Profe —, niveaux créés en « Autor », scores et noms des equipos de la barre Clase) est dans le **`localStorage`** du navigateur (clés `cuentalo.progreso.v0`, `cuentalo.partidas.v1`, `cuentalo.autor.v0`, `cuentalo.pizarra.v0`) : sur ce poste, dans ce navigateur, uniquement. Donner aux equipos des noms de fantaisie (« Los jaguares »), jamais des noms d'élèves.
- Le bouton **« Borrar mis datos »** (dans « ☰ Niveles », à la portée des élèves) efface les étoiles, le niveau en cours, le réglage ★, les histoires commencées et les brouillons de récit ; il conserve les niveaux de la classe, le mot de passe et les réglages de la professeure.
- Le bouton **« Borrar todo »** (panneau Profe, touche P) efface tout ce que ce navigateur a retenu : étoiles, réglages, mot de passe (il redevient « profe »), niveaux de la classe, equipos.
- **Sur un poste partagé** (salle informatique, CDI) : les étoiles, les BD en cours et les récits restent d'un élève à l'autre. Deux solutions : « Borrar mis datos » en fin de séance, ou considérer que la progression est celle du poste et non de l'élève (c'est le plus simple). Les niveaux « Autor » importants sont à exporter en JSON (partie 6) avant « Borrar todo ».
- Les champs de récit sont destinés aux aventures des personnages fictifs : faire utiliser leurs noms. Le texte saisi reste visible par la personne suivante qui ouvre le même niveau sur ce navigateur, jusqu'à son effacement.

## 9. Lexique ajouté par le jeu

Le lexique des escenas a été vérifié contre les decks du jeu de cartes « ¡Sobrevive! » (`docs/lexico_fuente.md`). La plupart des mots y sont déjà (hambre, miedo, cansado, noche, sol, lluvia, montaña, mochila, mapa, manta, comida, comer, beber, dormir, descansar, curar, perdón, cruzar, subir, caminar, correr, gritar, avisar, guardar, ver, amigo, alegría…).

Les 28 lemmes suivants sont ceux que le jeu **ajoute** : ils n'apparaissent pas dans les decks (`docs/CONTENIDO.md` §7). Ils sont **à valider et à introduire avant de jouer**, par exemple avec le panneau « Léxico » en « Pizarra ». Le picto est celui du panneau Léxico quand il existe.

| Mot | Picto | Français | Où on le rencontre |
|---|---|---|---|
| selva | 🌴 | la forêt, la jungle | la selva |
| río | 🌊 | la rivière, le fleuve | el río, la montaña |
| agua | 💧 | l'eau | el río |
| frío | 🥶 | le froid (« tener frío ») | el río, la tormenta, el fuego, la manta |
| sed | 🥤 | la soif (« tener sed ») | el sol, el río |
| calor | 🌡️ | la chaleur (« hace calor ») | el sol |
| tormenta | ⛈️ | l'orage | la tormenta |
| refugio | 🏕️ | l'abri | el refugio |
| fuego | 🔥 | le feu | el fuego |
| cuerda | 🪢 | la corde | la cuerda, el río |
| linterna | 🔦 | la lampe de poche | la linterna, la noche |
| rescate | — | le sauvetage | el rescate |
| helicóptero | 🚁 | l'hélicoptère | el rescate |
| jaguar | 🐆 | le jaguar | el jaguar |
| serpiente | 🐍 | le serpent | la serpiente |
| herido / herida | 🤕 | blessé / blessée | la serpiente, el refugio |
| perdido / perdida | ❓ | perdu / perdue | la selva, el jaguar, el mapa, la montaña |
| a salvo | 🛟 | sain et sauf | el rescate |
| mojarse | 💦 | se mouiller | el río |
| morder | 🦷 | mordre | la serpiente |
| encender | 💡 | allumer | la noche, la linterna |
| taparse | 🧥 | se couvrir | la tormenta, la manta |
| encontrar(se) | 🔍 | trouver, retrouver (se retrouver) | toutes les escenas à deux, les objets |
| compartir | 🤲 | partager | el fuego |
| enfadado / enfadada | 😠 | fâché / fâchée | el fuego, el refugio |
| juntos / juntas | 🧑‍🤝‍🧑 | ensemble | la selva, la noche, el jaguar |
| suerte | — | la chance (« ¡Qué suerte! ») | la mochila |
| ¡cuidado! | — | attention ! | la serpiente, les pistas |

Presque tous sont concrets et « dessinables ». « frío, sed, perdido, herido, a salvo, encontrar a, juntos, enfadado con » sont en plus les structures-objectifs de la séquence de survie. Si un mot ne convient pas (par exemple « enfadado », usage d'Espagne, plutôt que « enojado »), il se change dans les gabarits du moteur.

## 10. Dépannage

| Problème | Cause probable | Solution |
|---|---|---|
| Pas de voix espagnole : un clic sur une phrase ne lit rien, ou lit avec un accent français | aucune voix « es-ES » installée dans Windows | Windows : Paramètres → Heure et langue → Langue et région → Ajouter une langue → Español (España), cocher « Synthèse vocale ». Ou ouvrir le fichier dans Edge ou Chrome, qui ont leurs propres voix espagnoles. |
| Le fichier s'ouvre, mais rien ne bouge : pas de cartes, pas de phrases | JavaScript bloqué, ou navigateur trop ancien | ouvrir `cuentalo.html` dans Chrome, Edge ou Firefox ; vérifier que JavaScript n'est pas désactivé par une politique du poste. Le fichier n'a besoin d'aucune connexion. |
| Au vidéoprojecteur (1280 × 720), les cases sont petites ou quelque chose dépasse | fenêtre non maximisée, barre « Clase » ouverte | passer en plein écran avec **F11** ; fermer la barre « ⏱ Clase » quand on ne s'en sert pas (elle prend ~100 px). Tous les niveaux, de 3 à 6 cases, tiennent sur une seule ligne sans défilement ; seul le stock de cartes défile horizontalement quand il déborde (nivel libre). En dessous de 720 px de large, les cases passent en colonne. |
| Les étoiles ou les niveaux ont disparu | changement de navigateur ou de poste, ou données effacées | normal : tout est dans le `localStorage` de ce navigateur (partie 8). Réimporter les niveaux par leur code ou le fichier JSON. |
| Il faut repartir de zéro | — | élève : « ☰ Niveles » → « Borrar mis datos » (étoiles) ; professeure : panneau Profe → « Borrar todo » (tout, niveaux de la classe compris). |
| La touche P ne fait rien | le curseur est dans un champ de saisie, ou une fenêtre est ouverte | fermer la fenêtre ou cliquer sur le fond de la page, puis P |
| Mot de passe Profe oublié | — | il est dans les réglages de ce navigateur : « Borrar todo » n'est accessible qu'avec lui. Effacer les données du site dans le navigateur (Paramètres → Confidentialité) le remet à « profe », mais efface aussi les niveaux de la classe : les exporter en JSON quand on le peut encore. |
| Des niveaux ont disparu de « ☰ Niveles » | le sélecteur ★ filtre la liste | ★ montre les chapitres 1-2, ★★★ le chapitre 3, ★★ tout ; les niveaux de la classe et le nivel libre restent toujours visibles |
| Les phrases sont cachées, il faut choisir entre 3 ou écrire | « modo escritor » actif | c'est le réglage ★★★ (toujours), ou la case « Modo escritor » du panneau Profe : la décocher ou repasser en ★★ |
| « Ver las soluciones » (panneau Profe) met longtemps | niveau à 3 personnages et 6 cases | normal : c3n6 demande quelques secondes, calculées en arrière-plan sans bloquer la page ; les solutions de tous les niveaux sont aussi dans la partie 3 de ce guide |
| Le glisser-déposer ne marche pas (tablette, souris) | geste non reconnu | utiliser le clic-clic : clic sur la carte, puis clic sur la case. |

---

*Fichiers utiles : `cuentalo.html` (le jeu) · `docs/CONTENIDO.md` (modèle de contenu) · `docs/DECISIONS.md` (choix et points à valider) · `docs/frases.txt` (toutes les phrases que le moteur peut produire, pour relecture).*
