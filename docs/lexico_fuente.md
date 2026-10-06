# Léxico fuente de *¡Sobrevive!* (cinco mazos A1)

Inventario del vocabulario español realmente presente en los mazos `cole`, `quijote`, `goya`, `botero` y `frida` de `C:/Users/ameli/dev/sobrevive/decks/`, para que el nuevo juego reutilice **solo** palabras que el alumnado ya ha visto.

**Corpus contado:** para cada carta los campos `t`, `l.es`, `r.es`; para cada mazo las ocho muertes (`deaths.*.lo/hi.es`) y la victoria (`win.es`). 225 cartas + 40 muertes + 5 victorias = **5669 palabras-token**. No se han contado eslóganes (`tagline`), nombres de personajes (`chars`) ni etiquetas de palier (`tiers`); las palabras que solo aparecen ahí se listan en el apéndice C.

**Método:** tokens en minúsculas, lematizados a mano (verbo conjugado → infinitivo; plural → singular; adjetivo → masculino singular; diminutivos agrupados con su base: *perrito* → perro, *camita* → cama, *gatito* → gato, *trocito* → trozo, *pequeñito* → pequeño). Los homógrafos se han separado leyendo cada ocurrencia (p. ej. *como* = conjunción ×11 / *comer* ×1; *ven* = *venir* ×3 / *ver* ×2; *río* = *reír*, nunca «río»; *paga* = sust. ×1 / *pagar* ×5; *solo* = adverbio ×12 / adjetivo ×4; *gigante* = adj. ×11 / sust. ×5; *pregunta* = sust. ×5 / *preguntar* ×3). Los nombres propios (275 tokens) y las onomatopeyas / palabras francesas (43 tokens) están fuera de las tablas y se listan en los apéndices A y B.

**Totales:** 211 verbos (1036 ocurrencias) · 582 sustantivos (1424) · 127 adjetivos/estados (307) · 140 conectores y palabras-herramienta (2584) → **1060 lemas distintos** (sin nombres propios), de los cuales 920 son palabras de contenido.

**Las 30 palabras de contenido más frecuentes:** 1. ser (133) · 2. pintar (100) · 3. señor (35) · 4. estar (32) · 5. cuadro (30) · 6. ir / irse (29) · 7. comer (26) · 8. tener (24) · 9. mirar (23) · 10. casa (22) · 11. decir (22) · 12. día (22) · 13. querer (22) · 14. haber (auxiliar, pret. perfecto) (20) · 15. vender (17) · 16. grande (16) · 17. noche (16) · 18. comprar (15) · 19. dibujar (14) · 20. dormir (14) · 21. fiesta (14) · 22. hay (haber impersonal) (14) · 23. mañana (sust./adv.) (14) · 24. caballero (13) · 25. enorme (13) · 26. hacer (13) · 27. libro (13) · 28. perro (13) · 29. pincel (13) · 30. año (12).

Columnas de mazo: cole · quij (quijote) · goya · bot (botero) · frida. Los ids de carta se citan como `mazo/id` (`mazo/death.<jauge>.lo|hi`, `mazo/win`).

---

## 1. Tabla de frecuencias por categoría

### 1.1 Verbos (211 lemas · 1036 ocurrencias)

| lema | n | cole | quij | goya | bot | frida | formas en los mazos |
|---|---:|---:|---:|---:|---:|---:|---|
| ser | 133 | 29 | 39 | 21 | 25 | 19 | es, soy, son, eres, somos, sois, será, era… |
| pintar | 100 | 3 |  | 41 | 21 | 35 | pintas, pinta, pinto, pintan, pinten, píntame, píntalo, pintado… |
| estar | 32 | 3 | 8 | 6 | 7 | 8 | está, están, estoy, estás, estamos, estado |
| ir / irse | 29 | 10 | 6 | 3 | 6 | 4 | vas, voy, va, van, ir, vámonos, vamos |
| comer | 26 | 3 | 6 | 4 | 5 | 8 | comes, come, comido, coma, como, comen |
| tener | 24 | 4 | 9 | 3 | 5 | 3 | tengo, tienes, tiene, tienen, tenemos |
| mirar | 23 | 7 | 5 | 5 | 2 | 4 | miras, mira, miran, mire |
| decir | 22 | 6 | 6 | 4 | 1 | 5 | dice, dices, dicen, digo, dime, diga, dicho, diré… |
| querer | 22 | 1 |  | 8 | 8 | 5 | quiere, quieres, quiero, queremos, quieren |
| haber (auxiliar, pret. perfecto) | 20 | 3 | 15 | 2 |  |  | has, he, ha, han |
| vender | 17 | 1 |  | 3 | 12 | 1 | vendes, vende, vendo, venden, vendiendo |
| comprar | 15 | 1 |  | 2 | 8 | 4 | compras, compra, compro, compran, comprarme |
| dibujar | 14 |  |  | 6 | 7 | 1 | dibujas |
| dormir | 14 | 5 | 1 | 2 |  | 6 | duermes, duermen, dormido |
| hay (haber impersonal) | 14 | 8 | 2 | 1 | 1 | 2 | hay |
| hacer | 13 | 4 | 4 | 2 | 2 | 1 | haces, hace, hacemos, hecho |
| volver | 12 |  | 9 | 1 | 1 | 1 | vuelve, vuelves, volvemos, vuelto |
| subir | 11 |  | 4 | 1 | 2 | 4 | subes, sube, suben, suba, suban, subo |
| cantar | 10 | 7 |  |  |  | 3 | cantas, canta, cantamos, cantan, cantando, canto |
| ver | 10 |  | 3 | 3 | 2 | 2 | ves, ve, visto, ven |
| esperar | 9 |  |  | 3 | 3 | 3 | espera, esperan, esperas, esperen |
| leer | 9 | 5 | 3 | 1 |  |  | lees, lee, leído |
| llevar | 9 |  | 4 | 2 |  | 3 | llevo, lleva, llevas, llevan |
| quedar(se) | 9 |  | 3 | 2 | 3 | 1 | queda, quedas, quedan, quédate |
| saber | 9 | 4 | 3 | 2 |  |  | sé, sabe, sabes, sabía |
| venir | 9 | 1 | 2 | 2 | 2 | 2 | vienes, venga, vengan, ven |
| escribir | 8 | 2 | 1 |  | 2 | 3 | escribes, escribe, escríbalo |
| hablar | 8 | 2 | 1 | 2 | 1 | 2 | habla, hablas, hablamos, hablan, hablo |
| pagar | 8 | 1 | 2 | 2 | 3 |  | pagas, paga |
| pasar | 8 | 1 | 3 | 2 | 1 | 1 | pasas, pasa, pasan, paso |
| pedir | 8 |  | 2 |  | 4 | 2 | pide, pides |
| salir | 8 | 3 |  | 1 | 1 | 3 | sales, sale |
| dejar | 7 |  | 3 |  | 1 | 3 | dejas, deja |
| guardar | 7 | 3 | 1 | 2 |  | 1 | guardas, guardad |
| llamar(se) | 7 | 2 |  | 3 |  | 2 | llama, llaman, llamas, llamo |
| gritar | 6 | 1 | 2 | 1 |  | 2 | grita, gritas, gritan |
| jugar | 6 | 3 |  | 3 |  |  | juegas, jugamos |
| reír(se) | 6 |  | 2 |  | 2 | 2 | ríe, ríes, rían, río |
| tomar | 6 | 4 |  | 1 |  | 1 | toma, tomas |
| volar | 6 |  | 4 | 2 |  |  | vuela, vuelas, volamos, volando |
| doler | 5 | 2 | 1 |  |  | 2 | duele |
| esconder | 5 | 1 |  | 1 | 1 | 2 | escondes, esconde |
| olvidar | 5 |  |  | 1 | 2 | 2 | olvida, olvidas |
| poder | 5 | 5 |  |  |  |  | puedo, puedes |
| trabajar | 5 |  | 1 | 2 | 2 |  | trabaja, trabajas, trabajo |
| conocer | 4 |  | 2 |  | 1 | 1 | conoce, conoces, conocemos, conozco |
| copiar | 4 | 1 |  | 1 | 2 |  | copia, copias |
| dar | 4 | 1 | 1 | 1 | 1 |  | da, dámelo |
| descansar | 4 |  | 1 | 1 |  | 2 | descansa, descansas |
| firmar | 4 |  |  | 1 | 3 |  | firmas, firma |
| ganar | 4 | 1 | 2 |  | 1 |  | gana, ganan |
| llegar | 4 |  |  |  | 1 | 3 | llegas, llega, llegan |
| oír | 4 |  | 1 | 3 |  |  | oye, oyes |
| poner(se) | 4 | 2 |  | 1 |  | 1 | pones, ponen, ponte |
| sonreír | 4 |  | 1 | 1 | 1 | 1 | sonríe, sonríen, sonríes, sonrío |
| terminar | 4 | 1 |  | 1 | 1 | 1 | termina, terminas, terminado |
| tocar | 4 | 4 |  |  |  |  | toca, tocas, toquéis |
| bailar | 3 |  |  | 1 |  | 2 | bailas, baila |
| bostezar | 3 |  | 1 | 1 |  | 1 | bosteza, bostezas |
| cambiar | 3 | 1 | 1 | 1 |  |  | cambio, cambiado |
| cenar | 3 | 1 | 1 | 1 |  |  | cenamos, cenas |
| cobrar | 3 |  |  | 3 |  |  | cobras |
| contar | 3 | 1 | 1 |  |  | 1 | cuenta, cuentas, cuéntamelo |
| correr | 3 | 2 |  | 1 |  |  | corres, corre |
| enseñar | 3 | 1 |  |  |  | 2 | enseñas |
| gobernar | 3 |  | 3 |  |  |  | gobierno, gobernando |
| llenar(se) | 3 |  |  |  | 1 | 2 | llenan, llenar, llena |
| llorar | 3 |  | 1 |  | 1 | 1 | lloras, llora |
| llover | 3 | 1 | 1 |  |  | 1 | llueve |
| mandar | 3 |  |  | 1 | 1 | 1 | mando, manda, mandas |
| necesitar | 3 |  | 1 |  | 2 |  | necesita, necesito |
| oler | 3 |  | 2 |  |  | 1 | huele |
| organizar | 3 | 1 |  |  |  | 2 | organizas |
| perder | 3 |  | 2 |  | 1 |  | pierdes |
| preguntar | 3 |  |  | 2 | 1 |  | pregunta |
| prometer | 3 |  | 1 |  | 2 |  | prometo, prometido |
| regalar | 3 | 2 |  |  | 1 |  | regala, regalas |
| repetir | 3 | 1 | 2 |  |  |  | repetirlo, repites, repito |
| responder | 3 |  |  |  | 3 |  | responde, respondes |
| robar | 3 |  | 2 |  |  | 1 | roba, robo, robado |
| seguir | 3 |  |  |  | 1 | 2 | sigue, sigues |
| sentarse | 3 |  | 1 | 1 |  | 1 | sienta, sientas, sentado |
| velar | 3 |  | 3 |  |  |  | velas, vela |
| abrir | 2 |  | 1 |  | 1 |  | abre, abres |
| aburrirse | 2 |  |  |  |  | 2 | aburres |
| aceptar | 2 |  | 1 |  | 1 |  | acepto, aceptas |
| ahorrar | 2 | 2 |  |  |  |  | ahorro |
| amar | 2 |  |  |  | 1 | 1 | aman |
| andar | 2 | 1 | 1 |  |  |  | andando, andas |
| apagar | 2 | 2 |  |  |  |  | apagas |
| aplaudir | 2 |  | 1 |  |  | 1 | aplaude, aplaudes |
| aprender | 2 |  |  | 2 |  |  | aprende, aprenden |
| armar | 2 |  | 2 |  |  |  | ármame, armo |
| atacar | 2 |  | 2 |  |  |  | atacas |
| atar | 2 |  | 2 |  |  |  | atado |
| ayudar | 2 | 2 |  |  |  |  | ayudas |
| beber | 2 |  | 2 |  |  |  | bebe, bebes |
| borrar | 2 |  |  |  | 2 |  | borras |
| caber | 2 |  |  |  | 2 |  | cabe, caben |
| caminar | 2 | 1 | 1 |  |  |  | caminas |
| cerrar | 2 |  | 1 | 1 |  |  | cierra, cierras |
| confiscar | 2 | 1 |  |  |  | 1 | confisca, confiscan |
| creer | 2 |  | 1 |  |  | 1 | crees |
| despertar(se) | 2 | 1 |  | 1 |  |  | despiertas |
| empezar | 2 |  |  | 2 |  |  | empieza, empiezas |
| estudiar | 2 | 2 |  |  |  |  | estudias |
| gustar | 2 | 1 |  | 1 |  |  | gustan, gustas |
| invitar | 2 | 1 |  |  | 1 |  | invita |
| mover(se) | 2 | 1 | 1 |  |  |  | mueves, mueve |
| ordenar | 2 | 1 |  | 1 |  |  | ordena, ordenan |
| parecer | 2 |  |  | 1 | 1 |  | parece |
| pasear | 2 | 1 |  |  |  | 1 | paseas |
| perseguir | 2 |  | 1 |  |  | 1 | persiguen, persigues |
| preferir | 2 | 1 |  |  |  | 1 | prefiero |
| preparar | 2 |  | 1 |  | 1 |  | prepara, preparo |
| probar | 2 |  | 1 |  | 1 |  | prueba, pruebas |
| prohibir | 2 |  | 1 |  |  | 1 | prohíbe, prohibido |
| quitar | 2 |  |  | 2 |  |  | quita, quitas |
| repasar | 2 | 2 |  |  |  |  | repasas |
| retar | 2 |  | 2 |  |  |  | retas, reto |
| saltar | 2 | 1 |  |  |  | 1 | saltas, salta |
| sentirse | 2 |  |  | 1 |  | 1 | sientes |
| sonar | 2 | 1 | 1 |  |  |  | suena |
| suspirar | 2 |  | 1 |  | 1 |  | suspiras |
| temblar | 2 |  | 1 |  | 1 |  | tiemblas, tiemblo |
| vivir | 2 |  | 2 |  |  |  | vive |
| aguantar | 1 | 1 |  |  |  |  | aguanto |
| amanecer | 1 |  | 1 |  |  |  | amanece |
| apartar(se) | 1 |  | 1 |  |  |  | aparta |
| apuntarse | 1 | 1 |  |  |  |  | apuntas |
| asustar | 1 |  | 1 |  |  |  | asusta |
| avisar | 1 | 1 |  |  |  |  | avisas |
| buscar | 1 | 1 |  |  |  |  | buscamos |
| caer(se) | 1 |  | 1 |  |  |  | caes |
| cansarse | 1 |  |  |  |  | 1 | cansas |
| cargar | 1 |  | 1 |  |  |  | cargas |
| cazar | 1 |  |  | 1 |  |  | cazando |
| celebrar | 1 |  |  |  | 1 |  | celebras |
| chocar | 1 |  |  | 1 |  |  | chocas |
| cocinar | 1 |  |  |  | 1 |  | cocinas |
| conjugar | 1 | 1 |  |  |  |  | conjuga |
| cruzar | 1 | 1 |  |  |  |  | cruzas |
| curar | 1 |  | 1 |  |  |  | cura |
| decidir | 1 |  | 1 |  |  |  | decides |
| defender | 1 |  | 1 |  |  |  | defiendes |
| desaparecer | 1 | 1 |  |  |  |  | desapareces |
| desmayarse | 1 |  |  |  |  | 1 | desmaya |
| dirigir | 1 |  |  |  |  | 1 | diriges |
| dudar | 1 |  |  | 1 |  |  | dudas |
| encerrar | 1 |  | 1 |  |  |  | encierran |
| engañar | 1 |  | 1 |  |  |  | engañando |
| entender | 1 | 1 |  |  |  |  | entiendes |
| entrar | 1 |  |  |  | 1 |  |  |
| evitar | 1 | 1 |  |  |  |  | evita |
| explicar | 1 |  |  |  | 1 |  | explicas |
| expulsar | 1 |  |  |  | 1 |  | expulsa |
| flotar | 1 | 1 |  |  |  |  | flotas |
| girar | 1 |  | 1 |  |  |  | giramos |
| grabar | 1 |  |  | 1 |  |  | grabas |
| huir | 1 |  | 1 |  |  |  | huyes |
| imprimir | 1 |  | 1 |  |  |  | imprimo |
| insultar | 1 |  | 1 |  |  |  | insultas |
| inventar | 1 |  | 1 |  |  |  | inventado |
| juzgar | 1 |  | 1 |  |  |  | juzgado |
| lanzar | 1 |  |  | 1 |  |  | lanzan |
| levantarse | 1 | 1 |  |  |  |  | levantas |
| liberar | 1 |  | 1 |  |  |  | liberas |
| limpiar | 1 | 1 |  |  |  |  |  |
| luchar | 1 |  |  | 1 |  |  | luchamos |
| merecer | 1 |  | 1 |  |  |  | mereces |
| merendar | 1 | 1 |  |  |  |  |  |
| meter | 1 | 1 |  |  |  |  | metes |
| mezclar | 1 |  |  |  | 1 |  | mezclas |
| mojarse | 1 |  | 1 |  |  |  | mojarme |
| molestar | 1 |  |  |  | 1 |  | molesta |
| morir | 1 |  |  | 1 |  |  | muere |
| mudarse | 1 | 1 |  |  |  |  | mudas |
| multiplicar | 1 | 1 |  |  |  |  |  |
| nacer | 1 |  | 1 |  |  |  | naces |
| nombrar | 1 |  |  | 1 |  |  | nombro |
| obedecer | 1 |  |  | 1 |  |  | obedeces |
| odiar | 1 | 1 |  |  |  |  | odia |
| ofrecer | 1 | 1 |  |  |  |  | ofrece |
| parar(se) | 1 |  | 1 |  |  |  | para |
| pegar | 1 |  | 1 |  |  |  | pegues |
| pensar | 1 |  | 1 |  |  |  | piensas |
| posar | 1 |  |  |  |  | 1 | posas |
| presentar | 1 |  | 1 |  |  |  | presento |
| producir | 1 |  |  | 1 |  |  | produce |
| publicar | 1 |  |  |  | 1 |  | publica |
| quejarse | 1 |  |  |  |  | 1 | queja |
| quemar | 1 |  | 1 |  |  |  | quemamos |
| recetar | 1 |  |  | 1 |  |  | receto |
| reclutar | 1 | 1 |  |  |  |  | recluta |
| recordar | 1 |  |  |  | 1 |  | recuerda |
| recorrer | 1 |  |  |  | 1 |  | recorres |
| recuperar | 1 |  | 1 |  |  |  | recuperas |
| retirar | 1 |  |  | 1 |  |  | retiras |
| sacar | 1 |  | 1 |  |  |  | sacas |
| secarse | 1 |  |  |  | 1 |  | seca |
| sentir (lo siento) | 1 | 1 |  |  |  |  | siento |
| señalar | 1 |  |  | 1 |  |  | señalas |
| sobrevivir | 1 | 1 |  |  |  |  | sobrevivido |
| soñar | 1 |  | 1 |  |  |  | soñado |
| suspender | 1 | 1 |  |  |  |  | suspendes |
| tirar | 1 |  | 1 |  |  |  | tiran |
| usar | 1 | 1 |  |  |  |  | usas |
| valer | 1 |  | 1 |  |  |  | vale |
| vencer | 1 |  | 1 |  |  |  | vencido |
| viajar | 1 |  | 1 |  |  |  | viajo |
| vomitar | 1 |  | 1 |  |  |  | vomitas |

### 1.2 Sustantivos (582 lemas · 1424 ocurrencias)

| lema | n | cole | quij | goya | bot | frida | formas en los mazos |
|---|---:|---:|---:|---:|---:|---:|---|
| señor | 35 | 4 | 17 | 9 | 5 |  |  |
| cuadro | 30 |  |  | 5 | 15 | 10 | cuadros |
| casa | 22 |  | 10 | 4 | 1 | 7 |  |
| día | 22 | 5 | 4 | 3 | 4 | 6 | días |
| noche | 16 | 2 | 4 | 2 | 4 | 4 |  |
| fiesta | 14 | 3 | 1 | 2 |  | 8 | fiestas |
| mañana (sust./adv.) | 14 | 5 | 1 | 3 | 1 | 4 | mañana |
| caballero | 13 |  | 13 |  |  |  | caballeros |
| libro | 13 | 4 | 7 | 1 | 1 |  | libros |
| perro | 13 | 4 |  | 8 |  | 1 | perros, perrito, perritos |
| pincel | 13 |  |  | 4 | 2 | 7 | pinceles |
| año | 12 | 2 | 1 | 4 | 5 |  | años |
| cama | 12 | 1 | 2 | 3 |  | 6 | camita |
| clase | 11 | 10 |  |  |  | 1 |  |
| retrato | 11 |  |  | 5 | 6 |  | retratos |
| caballo | 10 |  | 6 | 4 |  |  |  |
| rey | 10 |  | 3 | 7 |  |  | reyes |
| arte | 9 |  |  | 2 | 5 | 2 |  |
| flor | 9 |  |  | 2 | 2 | 5 | flores |
| hora | 9 | 3 | 1 |  |  | 5 | horas |
| pintor | 9 | 1 |  | 5 | 1 | 2 | pintores |
| dibujo | 8 | 2 |  | 4 | 2 |  | dibujos |
| favor (por favor) | 8 | 4 | 2 | 1 |  | 1 | favor |
| ínsula | 8 |  | 8 |  |  |  | ínsulas |
| mesa | 8 | 3 |  | 1 | 3 | 1 | mesas |
| mundo | 8 | 1 | 2 | 1 | 3 | 1 |  |
| aventura | 7 |  | 3 |  |  | 4 | aventuras |
| euro | 7 | 7 |  |  |  |  | euros |
| maestro | 7 |  |  | 6 | 1 |  | maestros |
| museo | 7 | 1 |  |  | 6 |  | museos |
| patio | 7 | 2 |  |  |  | 5 |  |
| toro | 7 |  |  | 1 | 6 |  | toros |
| verdad | 7 | 1 | 1 | 2 | 2 | 1 |  |
| vez | 7 | 1 |  | 1 | 2 | 3 |  |
| amigo | 6 | 4 | 1 |  | 1 |  | amigos |
| bocadillo | 6 | 6 |  |  |  |  |  |
| cielo | 6 | 1 | 1 | 2 |  | 2 |  |
| cromo | 6 | 6 |  |  |  |  | cromos |
| dinero | 6 | 2 |  |  | 4 |  |  |
| fin | 6 | 1 | 2 |  |  | 3 |  |
| monstruo | 6 |  | 1 | 5 |  |  | monstruos |
| nombre | 6 | 1 | 3 |  | 1 | 1 |  |
| pared | 6 |  |  | 4 |  | 2 | paredes |
| silencio | 6 |  | 2 | 4 |  |  |  |
| sueño | 6 |  |  | 5 |  | 1 | sueños |
| cabeza | 5 |  | 2 | 1 | 1 | 1 |  |
| castillo | 5 |  | 4 |  | 1 |  | castillos |
| cena | 5 |  | 4 |  | 1 |  | cenas |
| color | 5 |  |  | 1 | 1 | 3 | colores |
| dama | 5 |  | 5 |  |  |  |  |
| deberes | 5 | 5 |  |  |  |  |  |
| doctor | 5 |  |  |  |  | 5 |  |
| don (tratamiento) | 5 |  | 5 |  |  |  | don |
| espejo | 5 |  |  |  |  | 5 | espejos |
| gigante (sust.) | 5 |  | 5 |  |  |  | gigante, gigantes |
| majestad | 5 |  |  | 5 |  |  |  |
| mamá | 5 | 3 |  |  | 2 |  |  |
| mano | 5 |  | 1 | 1 | 3 |  | manos |
| mercado | 5 |  |  |  | 1 | 4 |  |
| molino | 5 |  | 5 |  |  |  | molinos |
| montaña | 5 |  |  |  | 5 |  | montañas |
| palacio | 5 |  | 2 | 3 |  |  | palacios |
| pan | 5 |  | 2 | 1 |  | 2 |  |
| pregunta | 5 | 1 |  | 2 | 2 |  | preguntas |
| secreto | 5 | 4 |  |  |  | 1 |  |
| semana | 5 |  | 1 | 2 | 1 | 1 | semanas |
| vecino | 5 | 1 |  | 2 | 1 | 1 | vecinos |
| ajiaco | 4 |  |  |  | 4 |  |  |
| burro | 4 |  | 2 | 2 |  |  | burros |
| café | 4 |  |  | 2 |  | 2 | cafés |
| calle | 4 |  |  | 1 | 1 | 2 |  |
| carta | 4 | 1 | 1 |  | 2 |  | cartas |
| ceja | 4 |  |  |  |  | 4 | cejas |
| director | 4 | 3 |  |  | 1 |  |  |
| duquesa | 4 |  |  | 4 |  |  |  |
| encantador (mago) | 4 |  | 4 |  |  |  | encantador |
| escultura | 4 |  |  |  | 4 |  | esculturas |
| figura | 4 |  |  |  | 4 |  | figuras |
| fruta | 4 | 1 |  |  | 1 | 2 | frutas |
| gato | 4 | 2 | 1 |  | 1 |  | gatito |
| guerra | 4 | 1 |  | 3 |  |  | guerras |
| mango | 4 |  |  |  | 1 | 3 | mangos |
| mates (matemáticas) | 4 | 4 |  |  |  |  | mates |
| médico | 4 |  | 1 | 2 |  | 1 | médicos |
| mes | 4 |  |  |  | 2 | 2 | meses |
| minuto | 4 | 2 |  |  | 1 | 1 | minutos |
| niño | 4 |  |  |  | 2 | 2 | niños |
| pasillo | 4 | 4 |  |  |  |  | pasillos |
| periódico | 4 |  |  |  | 4 |  |  |
| piedra | 4 |  | 1 | 2 |  | 1 | piedras |
| pintora | 4 |  |  |  |  | 4 |  |
| plaza | 4 |  |  |  | 4 |  |  |
| profe | 4 | 4 |  |  |  |  |  |
| razón | 4 |  | 2 | 2 |  |  |  |
| sandía | 4 |  |  |  |  | 4 | sandías |
| señora | 4 | 1 | 1 |  |  | 2 |  |
| sonrisa | 4 |  |  | 3 |  | 1 | sonrisas |
| venta (posada) | 4 |  | 4 |  |  |  | venta, ventas |
| viaje | 4 | 2 | 1 |  |  | 1 | viajes |
| volumen | 4 |  |  |  | 4 |  |  |
| abuela | 3 | 3 |  |  |  |  |  |
| agujero | 3 |  |  |  | 3 |  |  |
| árbol | 3 |  |  | 1 |  | 2 |  |
| artista | 3 |  |  |  | 2 | 1 | artistas |
| biblioteca | 3 | 2 | 1 |  |  |  |  |
| bus | 3 | 3 |  |  |  |  |  |
| carbón | 3 | 3 |  |  |  |  |  |
| cliente | 3 |  | 1 | 2 |  |  | clientes |
| cocido | 3 |  | 3 |  |  |  |  |
| cometa | 3 |  |  | 3 |  |  | cometas |
| copia | 3 |  | 1 |  | 2 |  | copias |
| duelo | 3 |  | 3 |  |  |  |  |
| examen | 3 | 3 |  |  |  |  |  |
| exposición | 3 |  |  |  |  | 3 |  |
| hambre | 3 |  | 1 | 1 | 1 |  |  |
| historia | 3 | 1 | 2 |  |  |  | historias |
| hombre | 3 |  | 1 | 1 |  | 1 | hombres |
| idea | 3 |  |  | 3 |  |  | ideas |
| maestra | 3 |  |  |  |  | 3 |  |
| mar | 3 |  | 3 |  |  |  |  |
| merienda | 3 |  |  | 3 |  |  | meriendas |
| miedo | 3 |  |  | 1 |  | 2 |  |
| ojo | 3 | 1 | 1 |  |  | 1 | ojos |
| oro | 3 |  |  | 3 |  |  |  |
| pata | 3 |  | 1 |  |  | 2 | patas |
| perico | 3 |  |  |  |  | 3 |  |
| peso (moneda) | 3 |  |  |  | 2 | 1 | pesos, peso |
| pie | 3 | 1 | 1 | 1 |  |  |  |
| pintura | 3 |  |  |  | 2 | 1 | pinturas |
| plátano | 3 |  |  |  | 1 | 2 | plátanos |
| plato | 3 |  |  |  | 2 | 1 | platos |
| puerta | 3 |  |  | 2 | 1 |  |  |
| relincho | 3 |  | 3 |  |  |  |  |
| reposo | 3 |  |  |  |  | 3 |  |
| revista | 3 |  |  |  |  | 3 | revistas |
| sábado | 3 | 3 |  |  |  |  |  |
| servilleta | 3 |  |  | 2 |  | 1 | servilletas |
| sombrero | 3 |  |  | 3 |  |  |  |
| sopa | 3 |  |  | 3 |  |  |  |
| sorpresa | 3 | 2 |  |  |  | 1 |  |
| surrealista | 3 |  |  |  |  | 3 | surrealistas |
| tío | 3 |  |  |  | 3 |  |  |
| torero | 3 |  |  |  | 3 |  | toreros |
| trato | 3 | 2 |  |  |  | 1 |  |
| ventana | 3 |  |  | 2 | 1 |  | ventanas |
| vida | 3 |  |  |  |  | 3 |  |
| vídeo | 3 | 3 |  |  |  |  | vídeos |
| viento | 3 |  | 2 | 1 |  |  |  |
| voz | 3 |  | 3 |  |  |  | voces |
| almohada | 2 | 1 |  |  |  | 1 | almohadas |
| alquiler | 2 |  |  |  | 2 |  |  |
| arena | 2 |  |  | 2 |  |  |  |
| autobús | 2 | 1 |  |  |  | 1 |  |
| autorretrato | 2 |  |  |  |  | 2 | autorretratos |
| azúcar | 2 |  |  |  | 1 | 1 |  |
| bacía | 2 |  | 2 |  |  |  |  |
| baño | 2 | 1 |  |  |  | 1 |  |
| barco | 2 |  | 2 |  |  |  |  |
| bigote | 2 |  |  |  |  | 2 |  |
| bronce | 2 |  |  |  | 2 |  |  |
| bruja | 2 |  |  | 2 |  |  | brujas |
| búho | 2 |  |  | 2 |  |  | búhos |
| caballería (libros de caballerías) | 2 |  | 2 |  |  |  | caballerías |
| cajón | 2 |  |  | 2 |  |  |  |
| calavera | 2 |  |  |  |  | 2 | calaveras |
| cariño | 2 |  |  | 2 |  |  |  |
| cartón | 2 |  | 1 | 1 |  |  |  |
| cerdo | 2 |  | 2 |  |  |  | cerdos |
| chaqueta | 2 | 2 |  |  |  |  |  |
| chocolate | 2 | 1 |  |  |  | 1 |  |
| ciencia | 2 | 1 | 1 |  |  |  | ciencias |
| cole | 2 | 2 |  |  |  |  |  |
| colegio | 2 | 1 |  |  | 1 |  |  |
| comedor | 2 | 1 |  | 1 |  |  |  |
| control (examen) | 2 | 2 |  |  |  |  | control |
| corsé | 2 |  |  |  |  | 2 |  |
| curso | 2 | 2 |  |  |  |  |  |
| desastre | 2 | 1 |  | 1 |  |  | desastres |
| descanso | 2 |  |  | 2 |  |  |  |
| entrada | 2 |  | 1 |  | 1 |  | entradas |
| escudero | 2 |  | 2 |  |  |  |  |
| escuela | 2 | 1 |  |  | 1 |  |  |
| espada | 2 |  | 2 |  |  |  |  |
| espalda | 2 |  |  |  | 1 | 1 |  |
| español (lengua) | 2 | 2 |  |  |  |  | español |
| esposa | 2 |  |  |  |  | 2 |  |
| familia | 2 |  |  | 1 | 1 |  |  |
| fiebre | 2 |  |  | 2 |  |  |  |
| foto | 2 |  |  |  | 1 | 1 | fotos |
| francés (lengua / persona) | 2 | 1 |  | 1 |  |  | francés |
| fútbol | 2 | 2 |  |  |  |  |  |
| galería | 2 |  |  |  | 2 |  |  |
| galleta | 2 | 2 |  |  |  |  | galletas |
| general | 2 |  |  | 2 |  |  |  |
| gente | 2 |  |  |  | 2 |  |  |
| gobernador | 2 |  | 2 |  |  |  |  |
| guitarra | 2 |  |  |  | 1 | 1 | guitarras |
| gusanitos | 2 | 2 |  |  |  |  |  |
| héroe | 2 |  | 1 | 1 |  |  | héroes |
| hombro | 2 |  |  |  |  | 2 |  |
| ídolo | 2 |  |  |  |  | 2 | ídolos |
| instrumento | 2 | 1 |  |  | 1 |  |  |
| isla | 2 | 1 |  |  | 1 |  |  |
| jaula | 2 |  | 2 |  |  |  |  |
| kilo | 2 |  |  |  |  | 2 | kilos |
| labio | 2 | 1 |  | 1 |  |  | labios |
| leche | 2 |  |  | 2 |  |  |  |
| lenteja | 2 | 2 |  |  |  |  | lentejas |
| león | 2 |  | 2 |  |  |  | leones |
| leonero | 2 |  | 2 |  |  |  |  |
| lienzo | 2 |  |  | 1 |  | 1 | lienzos |
| lunes | 2 | 2 |  |  |  |  |  |
| luz | 2 |  |  | 1 |  | 1 |  |
| madera | 2 |  | 2 |  |  |  |  |
| maja / majo | 2 |  |  | 2 |  |  | maja, majas |
| mandolina | 2 |  |  |  | 2 |  |  |
| manta | 2 |  |  | 2 |  |  |  |
| mantequilla | 2 |  |  |  |  | 2 |  |
| mariachi | 2 |  |  |  |  | 2 | mariachis |
| mariposa | 2 |  |  | 1 |  | 1 | mariposas |
| mayo | 2 |  |  | 2 |  |  |  |
| medalla | 2 |  |  | 2 |  |  | medallas |
| memoria | 2 |  | 1 |  | 1 |  |  |
| mochila | 2 | 2 |  |  |  |  |  |
| modelo | 2 |  |  |  | 2 |  | modelos |
| mono | 2 |  |  |  |  | 2 |  |
| moro | 2 |  | 2 |  |  |  | moros |
| móvil | 2 | 2 |  |  |  |  |  |
| muerto | 2 |  |  |  |  | 2 | muertos |
| mural | 2 |  |  |  |  | 2 | murales |
| música | 2 | 1 |  | 1 |  |  |  |
| natillas | 2 | 2 |  |  |  |  |  |
| nota | 2 | 2 |  |  |  |  | notas |
| nube | 2 |  | 1 |  |  | 1 | nubes |
| obra | 2 |  |  |  | 2 |  | obras |
| orden | 2 |  |  | 1 |  | 1 | órdenes |
| oveja | 2 |  | 2 |  |  |  | ovejas |
| página | 2 | 2 |  |  |  |  | páginas |
| pájaro | 2 |  | 1 |  |  | 1 | pájaros |
| paloma | 2 |  |  |  | 2 |  | palomas |
| papaya | 2 |  |  |  | 1 | 1 | papayas |
| pastor | 2 |  | 2 |  |  |  | pastores |
| payaso | 2 |  |  |  | 2 |  | payasos |
| pelele | 2 |  |  | 2 |  |  |  |
| pelo | 2 |  |  |  |  | 2 |  |
| pena | 2 |  |  |  | 1 | 1 |  |
| periodista | 2 |  |  |  | 1 | 1 |  |
| playa | 2 | 1 | 1 |  |  |  |  |
| policía | 2 |  |  | 1 |  | 1 |  |
| polvo | 2 |  | 1 |  |  | 1 |  |
| pradera | 2 |  |  | 2 |  |  |  |
| princesa | 2 |  | 2 |  |  |  |  |
| profesor | 2 |  |  |  | 2 |  |  |
| prueba | 2 |  | 2 |  |  |  | pruebas |
| pueblo | 2 |  | 1 | 1 |  |  |  |
| queso | 2 |  | 2 |  |  |  |  |
| quitasol | 2 |  |  | 2 |  |  |  |
| rana | 2 |  |  |  |  | 2 |  |
| rascacielos | 2 |  |  |  |  | 2 |  |
| reina | 2 |  |  | 1 |  | 1 |  |
| reino | 2 |  | 2 |  |  |  |  |
| respuesta | 2 | 2 |  |  |  |  |  |
| rico (los ricos) | 2 |  | 1 |  |  | 1 | ricos |
| salón | 2 |  |  |  | 2 |  |  |
| sapo | 2 |  |  |  |  | 2 |  |
| silla | 2 | 1 |  |  |  | 1 |  |
| sobrino | 2 |  |  |  | 2 |  |  |
| sofá | 2 | 2 |  |  |  |  |  |
| sol | 2 |  |  | 2 |  |  |  |
| sueldo | 2 |  |  | 1 | 1 |  |  |
| taller | 2 |  |  |  | 2 |  |  |
| tapiz | 2 |  |  | 2 |  |  | tapices |
| tarde | 2 | 2 |  |  |  |  |  |
| tarta | 2 | 2 |  |  |  |  |  |
| tiempo | 2 |  |  |  | 2 |  |  |
| torneo | 2 | 2 |  |  |  |  |  |
| turista | 2 |  |  |  | 2 |  | turistas |
| valor | 2 |  | 1 | 1 |  |  |  |
| vela | 2 |  |  | 1 |  | 1 | velas |
| vestido | 2 |  |  |  |  | 2 |  |
| visita | 2 |  |  |  |  | 2 | visitas |
| yogur | 2 | 2 |  |  |  |  |  |
| abrazo | 1 |  |  |  |  | 1 |  |
| aburrimiento | 1 |  |  | 1 |  |  |  |
| accidente | 1 |  |  |  |  | 1 |  |
| aceite | 1 |  | 1 |  |  |  |  |
| acento | 1 | 1 |  |  |  |  |  |
| aduana | 1 |  |  |  |  | 1 |  |
| agua (tomar las aguas) | 1 |  |  | 1 |  |  | aguas |
| aire | 1 |  |  | 1 |  |  |  |
| ajo | 1 |  | 1 |  |  |  |  |
| ala | 1 |  |  | 1 |  |  | alas |
| albergue | 1 | 1 |  |  |  |  |  |
| alegría | 1 |  |  |  | 1 |  |  |
| algodón (de azúcar) | 1 |  |  |  | 1 |  | algodón |
| altar | 1 |  |  |  |  | 1 |  |
| alumno | 1 |  |  |  |  | 1 | alumnos |
| ama (de llaves) | 1 |  | 1 |  |  |  | ama |
| ambulancia | 1 |  |  |  |  | 1 |  |
| ángel | 1 |  |  | 1 |  |  |  |
| apartamento | 1 |  |  |  | 1 |  |  |
| aquelarre | 1 |  |  | 1 |  |  |  |
| arepa | 1 |  |  |  | 1 |  | arepas |
| arma | 1 |  | 1 |  |  |  | armas |
| armadura | 1 |  | 1 |  |  |  |  |
| artículo | 1 |  |  |  | 1 |  |  |
| aspa | 1 |  | 1 |  |  |  | aspas |
| audición | 1 | 1 |  |  |  |  |  |
| aula | 1 |  |  |  |  | 1 |  |
| auriculares | 1 | 1 |  |  |  |  |  |
| avión | 1 |  |  |  | 1 |  |  |
| bachiller | 1 |  | 1 |  |  |  |  |
| baile | 1 |  |  | 1 |  |  |  |
| balón | 1 | 1 |  |  |  |  |  |
| baloncesto | 1 | 1 |  |  |  |  |  |
| bálsamo | 1 |  | 1 |  |  |  |  |
| bandido | 1 |  | 1 |  |  |  | bandidos |
| bandolero | 1 |  | 1 |  |  |  |  |
| barbero | 1 |  | 1 |  |  |  |  |
| barrera | 1 |  |  |  | 1 |  |  |
| batán | 1 |  | 1 |  |  |  | batanes |
| berenjena | 1 |  |  | 1 |  |  |  |
| bocado | 1 |  |  |  |  | 1 |  |
| brazo | 1 |  | 1 |  |  |  | brazos |
| bufanda | 1 | 1 |  |  |  |  | bufandas |
| cabra | 1 |  |  | 1 |  |  |  |
| caja | 1 |  |  |  | 1 |  |  |
| calcetín | 1 | 1 |  |  |  |  | calcetines |
| calculadora | 1 | 1 |  |  |  |  |  |
| cámara (pintor de cámara) | 1 |  |  | 1 |  |  | cámara |
| camisa | 1 |  |  | 1 |  |  |  |
| campesina | 1 |  | 1 |  |  |  |  |
| campo | 1 |  |  | 1 |  |  |  |
| canal | 1 | 1 |  |  |  |  |  |
| canasta | 1 |  |  |  |  | 1 |  |
| cara | 1 |  |  | 1 |  |  |  |
| carga (¡a la carga!) | 1 |  | 1 |  |  |  | carga |
| carro | 1 |  | 1 |  |  |  |  |
| castigo | 1 |  | 1 |  |  |  |  |
| cebolla | 1 |  | 1 |  |  |  |  |
| céntimo | 1 | 1 |  |  |  |  |  |
| centro | 1 |  |  | 1 |  |  |  |
| chicle | 1 | 1 |  |  |  |  | chicles |
| chile | 1 |  |  |  |  | 1 |  |
| chuches | 1 | 1 |  |  |  |  |  |
| churros | 1 | 1 |  |  |  |  |  |
| cine | 1 | 1 |  |  |  |  |  |
| circo | 1 |  |  |  | 1 |  |  |
| ciudad | 1 |  |  |  | 1 |  |  |
| cocina | 1 |  |  | 1 |  |  |  |
| colección | 1 | 1 |  |  |  |  |  |
| collar | 1 |  |  |  |  | 1 |  |
| cómic | 1 | 1 |  |  |  |  |  |
| comida | 1 |  |  |  |  | 1 |  |
| conductor | 1 | 1 |  |  |  |  |  |
| consola | 1 | 1 |  |  |  |  |  |
| contrato | 1 |  |  |  | 1 |  |  |
| conversación | 1 |  |  | 1 |  |  |  |
| corbata | 1 |  |  |  |  | 1 |  |
| costilla | 1 |  | 1 |  |  |  | costillas |
| costurera | 1 |  |  |  | 1 |  |  |
| crítico | 1 |  |  |  | 1 |  | críticos |
| croissant | 1 |  |  |  | 1 |  |  |
| cuarto (habitación) | 1 |  |  |  |  | 1 | cuarto |
| cuello | 1 |  |  |  |  | 1 |  |
| cuerno | 1 |  |  | 1 |  |  | cuernos |
| cuerpo | 1 |  |  |  |  | 1 |  |
| cueva | 1 |  | 1 |  |  |  |  |
| culpa | 1 |  |  |  |  | 1 |  |
| cumpleaños | 1 | 1 |  |  |  |  |  |
| dedo | 1 | 1 |  |  |  |  | dedos |
| desfile | 1 |  |  |  |  | 1 |  |
| diario | 1 |  |  |  |  | 1 |  |
| disfraz | 1 | 1 |  |  |  |  |  |
| dolor | 1 |  | 1 |  |  |  |  |
| domingo | 1 | 1 |  |  |  |  |  |
| ducha | 1 | 1 |  |  |  |  |  |
| duda | 1 |  |  | 1 |  |  |  |
| dueño | 1 |  | 1 |  |  |  | dueños |
| duque | 1 |  | 1 |  |  |  | duques |
| educación (física) | 1 | 1 |  |  |  |  | educación |
| ejército | 1 |  | 1 |  |  |  | ejércitos |
| elefante | 1 |  |  |  | 1 |  |  |
| emperador | 1 |  |  | 1 |  |  |  |
| enero | 1 | 1 |  |  |  |  |  |
| enfermería | 1 | 1 |  |  |  |  |  |
| escalera | 1 |  |  |  |  | 1 |  |
| escopeta | 1 |  |  | 1 |  |  |  |
| estilo | 1 |  |  |  | 1 |  |  |
| estómago | 1 | 1 |  |  |  |  |  |
| estudio (taller) | 1 |  |  |  |  | 1 | estudio |
| exilio | 1 |  |  | 1 |  |  |  |
| extranjero | 1 |  |  |  | 1 |  |  |
| fábrica | 1 |  |  | 1 |  |  |  |
| fantasma | 1 | 1 |  |  |  |  |  |
| festival | 1 | 1 |  |  |  |  |  |
| frente | 1 |  |  |  |  | 1 |  |
| fresco (pintura) | 1 |  |  |  | 1 |  | frescos |
| frontera | 1 |  |  |  |  | 1 |  |
| futuro | 1 |  |  | 1 |  |  |  |
| galera | 1 |  | 1 |  |  |  | galeras |
| gallina | 1 |  |  | 1 |  |  |  |
| genio | 1 | 1 |  |  |  |  | genios |
| gimnasio | 1 | 1 |  |  |  |  |  |
| gloria | 1 |  | 1 |  |  |  |  |
| golpe | 1 |  | 1 |  |  |  | golpes |
| grabado | 1 |  |  | 1 |  |  | grabados |
| habitación | 1 | 1 |  |  |  |  |  |
| harina | 1 |  | 1 |  |  |  |  |
| hazaña | 1 |  | 1 |  |  |  | hazañas |
| herida | 1 |  | 1 |  |  |  | heridas |
| hermana | 1 | 1 |  |  |  |  |  |
| hierba | 1 |  | 1 |  |  |  |  |
| hija | 1 |  | 1 |  |  |  |  |
| honor | 1 |  | 1 |  |  |  |  |
| hueso | 1 |  |  | 1 |  |  |  |
| humillación | 1 |  | 1 |  |  |  |  |
| humo | 1 | 1 |  |  |  |  |  |
| imprenta | 1 |  | 1 |  |  |  |  |
| intercambio | 1 | 1 |  |  |  |  |  |
| internet | 1 | 1 |  |  |  |  |  |
| jamón | 1 | 1 |  |  |  |  |  |
| joven (sust.) | 1 |  |  | 1 |  |  | joven |
| juego | 1 |  |  | 1 |  |  | juegos |
| jueves | 1 | 1 |  |  |  |  |  |
| jugo | 1 |  |  |  | 1 |  |  |
| junio | 1 | 1 |  |  |  |  |  |
| justicia | 1 |  | 1 |  |  |  |  |
| karaoke | 1 | 1 |  |  |  |  |  |
| kilómetro | 1 | 1 |  |  |  |  | kilómetros |
| laboratorio | 1 | 1 |  |  |  |  |  |
| lado | 1 |  |  |  | 1 |  |  |
| laguna | 1 |  | 1 |  |  |  | lagunas |
| lámina | 1 |  |  | 1 |  |  | láminas |
| lanza | 1 |  | 1 |  |  |  |  |
| latón | 1 |  | 1 |  |  |  |  |
| lengua | 1 | 1 |  |  |  |  |  |
| letra | 1 |  |  |  |  | 1 | letras |
| leyenda | 1 | 1 |  |  |  |  |  |
| librería | 1 | 1 |  |  |  |  |  |
| libreta | 1 |  | 1 |  |  |  |  |
| limonada | 1 |  |  |  |  | 1 |  |
| lluvia | 1 |  |  |  | 1 |  |  |
| luna | 1 |  |  | 1 |  |  |  |
| mago | 1 |  | 1 |  |  |  |  |
| maleta | 1 |  |  | 1 |  |  |  |
| mameluco | 1 |  |  | 1 |  |  | mamelucos |
| mancha | 1 |  |  |  | 1 |  | manchas |
| manera | 1 |  |  |  | 1 |  |  |
| manzana | 1 | 1 |  |  |  |  |  |
| mapa | 1 | 1 |  |  |  |  |  |
| máquina | 1 | 1 |  |  |  |  |  |
| maravilla | 1 |  | 1 |  |  |  | maravillas |
| marco | 1 |  |  |  |  | 1 |  |
| marqués | 1 |  |  | 1 |  |  |  |
| medias (a medias) | 1 | 1 |  |  |  |  | medias |
| medicina | 1 |  |  |  |  | 1 | medicinas |
| metro | 1 |  |  |  | 1 |  | metros |
| millonario | 1 |  |  |  |  | 1 | millonarios |
| modales | 1 |  | 1 |  |  |  |  |
| mole | 1 |  |  |  |  | 1 |  |
| momento | 1 |  |  |  | 1 |  |  |
| moto | 1 |  |  |  | 1 |  |  |
| muchacha | 1 |  |  |  |  | 1 |  |
| muerte | 1 |  |  |  |  | 1 |  |
| murciélago | 1 |  |  | 1 |  |  | murciélagos |
| naranja | 1 |  |  |  | 1 |  |  |
| nariz | 1 |  |  | 1 |  |  |  |
| nivel | 1 | 1 |  |  |  |  |  |
| nostalgia | 1 |  |  |  |  | 1 |  |
| noticia | 1 |  |  |  |  | 1 |  |
| objeto | 1 | 1 |  |  |  |  | objetos |
| oficina | 1 |  |  |  | 1 |  |  |
| orilla | 1 |  | 1 |  |  |  |  |
| oso | 1 | 1 |  |  |  |  |  |
| paciencia | 1 |  |  |  | 1 |  |  |
| paciente | 1 |  |  |  |  | 1 | pacientes |
| padre | 1 | 1 |  |  |  |  | padres |
| paga | 1 | 1 |  |  |  |  |  |
| país | 1 |  |  |  | 1 |  |  |
| paisaje | 1 |  |  | 1 |  |  |  |
| palabra | 1 |  | 1 |  |  |  |  |
| palo | 1 |  | 1 |  |  |  | palos |
| palomitas | 1 | 1 |  |  |  |  |  |
| papel (picado) | 1 |  |  |  |  | 1 | papel |
| paquete | 1 | 1 |  |  |  |  |  |
| paraguas | 1 | 1 |  |  |  |  |  |
| parce (amigo, Colombia) | 1 |  |  |  | 1 |  | parce |
| parque | 1 | 1 |  |  |  |  |  |
| parte | 1 |  |  |  |  | 1 | partes |
| partida | 1 | 1 |  |  |  |  |  |
| partido | 1 | 1 |  |  |  |  |  |
| pasaje | 1 |  |  |  | 1 |  |  |
| paseo | 1 |  |  | 1 |  |  | paseos |
| pastel | 1 |  |  |  |  | 1 |  |
| paz | 1 |  |  |  | 1 |  |  |
| pelota | 1 | 1 |  |  |  |  |  |
| perfume | 1 |  |  | 1 |  |  | perfumes |
| permiso | 1 |  |  | 1 |  |  |  |
| persona | 1 |  |  | 1 |  |  | personas |
| pescado | 1 | 1 |  |  |  |  |  |
| pierna | 1 | 1 |  |  |  |  |  |
| pino (hacer el pino) | 1 | 1 |  |  |  |  | pino |
| piña | 1 |  |  |  | 1 |  | piñas |
| pirámide | 1 |  |  |  |  | 1 |  |
| pizarra | 1 | 1 |  |  |  |  |  |
| pizza | 1 | 1 |  |  |  |  |  |
| planta | 1 |  |  |  |  | 1 | plantas |
| poema | 1 | 1 |  |  |  |  |  |
| popularidad | 1 | 1 |  |  |  |  |  |
| posavasos | 1 | 1 |  |  |  |  |  |
| postre | 1 | 1 |  |  |  |  |  |
| pozo | 1 |  | 1 |  |  |  |  |
| prado (pradera) | 1 |  | 1 |  |  |  | prado |
| premio | 1 |  |  |  | 1 |  |  |
| prisa | 1 |  | 1 |  |  |  |  |
| proporción | 1 |  |  |  | 1 |  | proporciones |
| provecho (buen provecho) | 1 |  |  | 1 |  |  | provecho |
| prudencia | 1 |  |  | 1 |  |  |  |
| pulga | 1 |  |  |  |  | 1 | pulgas |
| pulso | 1 | 1 |  |  |  |  | pulsos |
| radio | 1 |  |  |  | 1 |  |  |
| real (moneda) | 1 |  | 1 |  |  |  | reales |
| realidad | 1 |  |  |  |  | 1 |  |
| recreo | 1 | 1 |  |  |  |  |  |
| refrán | 1 |  | 1 |  |  |  | refranes |
| regalo | 1 | 1 |  |  |  |  |  |
| reloj | 1 |  |  | 1 |  |  |  |
| remo | 1 |  | 1 |  |  |  | remos |
| reno | 1 | 1 |  |  |  |  | renos |
| retablo | 1 |  | 1 |  |  |  |  |
| reunión | 1 | 1 |  |  |  |  |  |
| reverencia | 1 |  |  | 1 |  |  |  |
| romero | 1 |  | 1 |  |  |  |  |
| ropa | 1 |  |  | 1 |  |  |  |
| rosa (flor) | 1 |  |  |  |  | 1 | rosas |
| sábana | 1 | 1 |  |  |  |  |  |
| sabor | 1 |  |  |  | 1 |  |  |
| sala | 1 | 1 |  |  |  |  |  |
| salario | 1 |  | 1 |  |  |  |  |
| seguidor | 1 | 1 |  |  |  |  | seguidores |
| seguridad | 1 |  |  |  | 1 |  |  |
| septiembre | 1 | 1 |  |  |  |  |  |
| sobrina | 1 |  | 1 |  |  |  |  |
| sombra | 1 |  | 1 |  |  |  |  |
| sombrilla | 1 |  |  | 1 |  |  |  |
| sonido | 1 | 1 |  |  |  |  |  |
| suelo | 1 |  | 1 |  |  |  |  |
| superhéroe | 1 | 1 |  |  |  |  | superhéroes |
| tabla (de multiplicar) | 1 | 1 |  |  |  |  | tablas |
| taco | 1 |  |  |  |  | 1 | tacos |
| teatro | 1 | 1 |  |  |  |  |  |
| techo | 1 | 1 |  |  |  |  |  |
| tejado | 1 | 1 |  |  |  |  |  |
| tele | 1 | 1 |  |  |  |  |  |
| tesoro | 1 |  | 1 |  |  |  |  |
| tienda | 1 |  |  | 1 |  |  |  |
| títere | 1 |  | 1 |  |  |  | títeres |
| tobogán | 1 | 1 |  |  |  |  |  |
| tortilla | 1 | 1 |  |  |  |  |  |
| traje | 1 |  |  |  |  | 1 |  |
| trapecista | 1 |  |  |  | 1 |  | trapecistas |
| triángulo | 1 | 1 |  |  |  |  |  |
| trigo | 1 |  | 1 |  |  |  |  |
| tripa | 1 | 1 |  |  |  |  |  |
| trote | 1 |  | 1 |  |  |  |  |
| trozo | 1 | 1 |  |  |  |  | trocito |
| truco | 1 |  |  |  |  | 1 | trucos |
| vacaciones | 1 | 1 |  |  |  |  |  |
| valla | 1 | 1 |  |  |  |  |  |
| vampiro | 1 | 1 |  |  |  |  |  |
| venda | 1 |  |  | 1 |  |  |  |
| vergüenza | 1 | 1 |  |  |  |  |  |
| versión | 1 | 1 |  |  |  |  |  |
| viernes | 1 | 1 |  |  |  |  |  |
| vista | 1 |  | 1 |  |  |  |  |
| voluntario | 1 | 1 |  |  |  |  | voluntarios |
| xolo (perro xolo) | 1 |  |  |  |  | 1 | xolos |
| yegua | 1 |  | 1 |  |  |  | yeguas |
| yelmo | 1 |  | 1 |  |  |  |  |
| yeso | 1 |  |  |  |  | 1 |  |
| zapato | 1 | 1 |  |  |  |  |  |

### 1.3 Adjetivos y estados (127 lemas · 307 ocurrencias)

Se incluyen aquí los participios usados como adjetivo (*cansado, perdido, encadenado, acostado…*) y algunos adverbios de manera derivados (*rápido, bajito, tranquilamente*).

| lema | n | cole | quij | goya | bot | frida | formas en los mazos |
|---|---:|---:|---:|---:|---:|---:|---|
| grande | 16 |  | 2 | 3 | 6 | 5 | grandes, gran |
| enorme | 13 |  | 2 | 2 | 6 | 3 | enormes |
| gigante (adj.) | 11 | 1 |  | 2 | 7 | 1 | gigante, gigantes |
| pequeño | 10 | 1 |  | 1 | 7 | 1 | pequeña, pequeñas, pequeñito |
| redondo | 10 |  |  |  | 10 |  | redonda, redondas, redondos |
| gordo | 9 |  |  |  | 9 |  | gordas, gorda, gordos |
| nuevo | 9 | 1 | 1 | 5 |  | 2 | nuevos, nueva |
| rápido (adj./adv.) | 8 | 3 | 1 |  | 4 |  | rápido, rápida |
| bueno | 7 | 2 | 2 | 1 |  | 2 | buenos, buen |
| bonito | 6 | 1 | 1 | 2 | 2 |  | bonita |
| flaco | 6 |  | 1 |  | 5 |  | flaca, flacos |
| mejor (adj./adv.) | 6 | 1 |  | 2 | 1 | 2 | mejor |
| solo (adj., estar solo) | 6 | 1 | 1 | 1 | 2 | 1 | sola, solos, solo |
| azul | 5 |  |  | 1 |  | 4 |  |
| blanco | 5 |  |  | 3 |  | 2 | blancas, blanca |
| gris | 5 |  |  | 1 | 3 | 1 |  |
| triste | 5 | 2 | 1 |  | 2 |  | tristes |
| verde | 5 | 1 |  |  | 2 | 2 | verdes |
| alto | 4 |  | 1 | 2 | 1 |  | alta, altos |
| feo | 4 | 1 |  | 1 | 1 | 1 | fea |
| serio | 4 |  |  | 1 | 2 | 1 | seria, serios |
| tranquilo | 4 | 1 |  |  | 3 |  | tranquilas, tranquilamente |
| alegre | 3 |  | 1 | 1 | 1 |  | alegres |
| bello | 3 |  | 3 |  |  |  | bella |
| fácil | 3 | 2 |  |  | 1 |  |  |
| famoso | 3 | 1 | 1 |  |  | 1 | famosos |
| incómodo | 3 | 1 |  | 2 |  |  | incómoda |
| lleno | 3 |  |  | 1 | 2 |  | llena |
| loco | 3 |  | 3 |  |  |  |  |
| propio | 3 |  | 1 |  |  | 2 | propia |
| raro | 3 |  |  | 1 | 2 |  | raros |
| rico | 3 | 1 |  |  | 1 | 1 | rica |
| abstracto | 2 |  |  |  | 2 |  | abstractas |
| aprobado | 2 | 2 |  |  |  |  |  |
| bajo (bajito, adv.) | 2 | 2 |  |  |  |  | bajito |
| cansado | 2 |  | 1 |  |  | 1 | cansada |
| dulce | 2 | 1 |  |  |  | 1 |  |
| encantado | 2 |  | 2 |  |  |  | encantada |
| entero | 2 |  |  | 1 | 1 |  |  |
| fuerte | 2 | 1 |  |  |  | 1 |  |
| guapo | 2 |  |  | 2 |  |  | guapos |
| hecho (trato hecho) | 2 | 2 |  |  |  |  | hecho |
| libre | 2 | 2 |  |  |  |  |  |
| listo | 2 |  |  |  |  | 2 | lista |
| mexicano | 2 |  |  |  |  | 2 | mexicana |
| moderno | 2 |  |  | 1 |  | 1 |  |
| negro | 2 |  | 1 | 1 |  |  | negra |
| normal | 2 |  |  |  | 2 |  |  |
| perfecto | 2 |  |  | 1 |  | 1 | perfecta |
| prehispánico | 2 |  |  |  |  | 2 | prehispánicos |
| real | 2 |  |  | 1 | 1 |  | reales |
| rojo | 2 |  |  |  |  | 2 | roja |
| rosa (color) | 2 |  |  |  | 1 | 1 | rosa |
| sordo | 2 |  |  | 2 |  |  |  |
| total | 2 |  |  |  |  | 2 |  |
| vacío | 2 |  |  | 1 |  | 1 |  |
| absoluto | 1 |  |  |  |  | 1 |  |
| acostado | 1 |  |  |  |  | 1 | acostada |
| acuático | 1 | 1 |  |  |  |  |  |
| amable | 1 |  | 1 |  |  |  |  |
| amarillo | 1 |  |  |  | 1 |  |  |
| andante (caballero andante) | 1 |  | 1 |  |  |  | andante |
| anónimo | 1 | 1 |  |  |  |  | anónima |
| barato | 1 |  |  |  | 1 |  |  |
| brillante | 1 |  |  |  | 1 |  |  |
| caro | 1 |  |  |  | 1 |  |  |
| catalán | 1 |  | 1 |  |  |  |  |
| cerrado | 1 |  |  | 1 |  |  | cerrada |
| ciego (gallina ciega) | 1 |  |  | 1 |  |  | ciega |
| cobalto (azul cobalto) | 1 |  |  |  |  | 1 | cobalto |
| contento | 1 |  |  | 1 |  |  |  |
| correcto | 1 |  |  |  | 1 |  |  |
| disfrazado | 1 |  | 1 |  |  |  | disfrazada |
| divertido | 1 | 1 |  |  |  |  |  |
| duro | 1 |  |  |  |  | 1 |  |
| elegante | 1 |  |  |  | 1 |  | elegantes |
| encadenado | 1 |  | 1 |  |  |  | encadenados |
| enfermo | 1 |  |  | 1 |  |  |  |
| envidioso | 1 |  | 1 |  |  |  |  |
| escolar | 1 | 1 |  |  |  |  |  |
| eterno | 1 |  |  |  | 1 |  | eterna |
| exclusivo | 1 |  |  |  | 1 |  |  |
| experto | 1 | 1 |  |  |  |  |  |
| falso | 1 |  | 1 |  |  |  |  |
| favorito | 1 |  |  |  | 1 |  |  |
| fijo | 1 |  |  |  | 1 |  |  |
| fino | 1 |  |  |  |  | 1 | finas |
| físico (educación física) | 1 | 1 |  |  |  |  | física |
| francés (adj.) | 1 | 1 |  |  |  |  | francesa |
| fresco (cuadro fresco) | 1 |  |  |  |  | 1 | fresco |
| hondo | 1 |  |  | 1 |  |  |  |
| iluminado | 1 |  |  | 1 |  |  |  |
| importante | 1 |  |  |  | 1 |  |  |
| inmediato | 1 |  |  | 1 |  |  |  |
| inmenso | 1 |  | 1 |  |  |  |  |
| invisible (amigo invisible) | 1 | 1 |  |  |  |  | invisible |
| joven | 1 |  |  | 1 |  |  |  |
| jubilado | 1 |  | 1 |  |  |  |  |
| junto (cejas juntas) | 1 |  |  |  |  | 1 | juntas |
| largo | 1 |  | 1 |  |  |  | largos |
| mínimo | 1 |  |  |  | 1 |  |  |
| nacional | 1 |  |  |  | 1 |  |  |
| noble | 1 |  | 1 |  |  |  |  |
| ocupado | 1 | 1 |  |  |  |  | ocupada |
| pagado | 1 |  |  |  | 1 |  |  |
| peligroso | 1 |  |  | 1 |  |  |  |
| perdido | 1 | 1 |  |  |  |  | perdidos |
| pesado | 1 |  |  |  | 1 |  | pesada |
| picado (papel picado) | 1 |  |  |  |  | 1 | picado |
| pobre | 1 |  |  | 1 |  |  |  |
| profesional | 1 | 1 |  |  |  |  |  |
| próximo | 1 | 1 |  |  |  |  |  |
| sagrado | 1 | 1 |  |  |  |  |  |
| secreto (adj.) | 1 | 1 |  |  |  |  | secreta |
| seguro | 1 |  |  |  | 1 |  |  |
| simpático | 1 |  | 1 |  |  |  | simpáticas |
| sobajada (error cómico de Sancho) | 1 |  | 1 |  |  |  | sobajada |
| soberano | 1 |  | 1 |  |  |  | soberana |
| sobresaliente | 1 | 1 |  |  |  |  | sobresalientes |
| suave | 1 |  |  | 1 |  |  | suaves |
| terrible | 1 |  | 1 |  |  |  | terribles |
| último | 1 |  |  |  | 1 |  | última |
| útil | 1 |  |  | 1 |  |  |  |
| valiente | 1 |  |  |  | 1 |  |  |
| vendado | 1 |  | 1 |  |  |  | vendados |
| viejo | 1 |  | 1 |  |  |  |  |
| vivo | 1 |  |  |  | 1 |  |  |

### 1.4 Expresiones y colocaciones (recuento manual sobre el corpus)

| expresión | n | mazos | ejemplo [id] |
|---|---:|---|---|
| por favor | 8 | cole 4 · quij 2 · goya 1 · frida 1 | «Cena, por favor. Y cama.» [quijote/venta] |
| buenos días | 2 | cole 2 | «¡Buenos días! Son las siete. ¿Te levantas?» [cole/mama1] |
| buen viaje / buen provecho | 2 | quij 1 · goya 1 | «Perdón. Bonita bacía. Buen viaje.» [quijote/yelmo] |
| trato hecho | 2 | cole 2 | «¡Trato hecho!» [cole/lucia1] |
| lo siento | 1 | cole | «Lo siento, Lucía.» [cole/fiestaNo] |
| gracias / perdón / vale / claro (que sí) | 12 / 7 / 9 / 7 | todos | «¡Claro que sí!» [cole/fiesta0] · «Perdón, señor Ruiz.» [cole/ruiz1] |
| hoy no / ahora no (rechazar) | 11 | cole 3 · goya 3 · bot 2 · frida 3 | «Hoy no, gracias.» [cole/kiosco] · «Ahora no, Vera.» [cole/hermana] |
| de verdad | 3 | cole 1 · bot 2 | «¡De verdad! ¿Me ayudas?» [cole/pablo2] |
| otra vez / una y otra vez | 6 | cole 1 · goya 1 · bot 1 · frida 3 | «Otra vez con fiebre, Francisco.» [goya/hambre] |
| tener hambre | 2 | quij 1 · bot 1 | «El leonero dice que tienen hambre.» [quijote/leon] |
| tener miedo | 2 | frida 2 | «Y tú, ¿me tienes miedo?» [frida/calavera_miedo] |
| tener prisa | 1 | quij | «¡Aparta, que tengo prisa!» [quijote/encantada] |
| tener razón | 1 | quij | «Tienes razón. A la venta.» [quijote/pajaro] |
| tener … años | 2 | goya 1 · bot 1 | «Tienes dieciséis años.» [botero/salida] |
| tener que + inf. | 1 | quij | «tienes que volver a casa» [quijote/revelacion] |
| estar cansado/a | 2 | quij 1 · frida 1 | «Gracias, Sansón. Estoy cansado.» [quijote/revelacion] |
| estar loco | 2 | quij 2 | «¿Y dicen que yo estoy loco?» [quijote/sanson] · «¡Mi señor está loco y no paga!» [quijote/death.sancho.lo] |
| estar solo/a/os | 3 | goya 1 · bot 1 · frida 1 | «Porque estoy sola.» [frida/espejo_yo] · «Soy enorme. Y tú estás solo.» [goya/prisa] |
| estar enfermo | 1 | goya | «Que estoy enfermo. En la cama.» [goya/policia] |
| estar contento | 1 | goya | «El vecino no está contento.» [goya/death.genio.hi] |
| estar listo/a | 2 | frida 2 | «Tu exposición no está lista y tus cuadros están en la aduana.» [frida/breton_aduana] |
| en casa / en la cama (estar, quedarse) | 9 | quij 2 · goya 4 · frida 3 | «Quédate en casa, pintor.» [goya/dosmayo] |
| volver a casa / a casa | 6 | quij 6 | «Volvemos a casa.» [quijote/camino] |
| me / te / le duele + sust. | 5 | cole 2 · quij 1 · frida 2 | «Me duele la pierna…» [cole/edfisica] |
| me gusta(n) / me gustas | 2 | cole 1 · goya 1 | «Goya, me gustan tus tapices.» [goya/camara] |
| hace tres días que … | 2 | quij 1 · goya 1 | «Hace tres días que no te hablo.» [quijote/sininsula] |
| llevar tres días sin … | 1 | quij | «Llevo tres días sin hierba.» [quijote/cansado] |
| ya no + verbo | 3 | quij 1 · goya 1 · bot 1 | «La fiebre pasa, Francisco, pero ya no oyes.» [goya/enfermedad] |
| ¡qué + sust./adj.! | 8 | todos | «¡Qué pena, Frida!» [frida/death.mexico.hi] · «¡Qué perro tan guapo!» [goya/caza] |
| ¡qué padre! (México) / ¡viva …! | 1 / 4 | frida | «¡Qué padre! (Fiesta en el patio.)» [frida/fridos_fiesta] · «¡VIVA MÉXICO!» [frida/breton_louvre] |
| por tu bien | 3 | quij 2 · frida 1 | «Te encierran «por tu bien».» [quijote/death.valor.hi] |
| en secreto | 2 | cole 1 · frida 1 | «(Pintas en la cama, en secreto.)» [frida/doctor_reposo] |
| de memoria | 2 | quij 1 · bot 1 | «(Pintas de memoria. Gratis.)» [botero/mercado_frutas] |
| de pie | 3 | cole 1 · quij 1 · goya 1 | «¡Todos de pie!» [cole/lefevre2] |
| ¡a + infinitivo! (a dormir, a trabajar, a ganar, a pintar) | 5 | cole 3 · quij 1 · frida 1 | «La señora Pons grita: —¡A DORMIR!» [cole/albergue1] · «Diez minutos. Luego, todos a pintar.» [frida/fridos_fiesta] |
| ¡a la carga! / ¡adelante! / ¡vamos! / ¡vámonos! / ¡basta! | 1 / 1 / 4 / 1 / 3 | quij, cole, frida | «¡Gigantes! ¡A la carga!» [quijote/molinos] · «¡Basta de refranes, Sancho!» [quijote/pajaro] |
| día y noche | 2 | goya 1 · frida 1 | «Pintas día y noche.» [goya/reposo] |
| toda la noche / esta noche | 3 / 3 | quij, bot, frida, cole | «(Pintas toda la noche.)» [frida/diego_cejas] · «¿Estudias esta noche?» [cole/pons2] |
| de noche / de día | 4 | bot 3 · frida 1 | «De noche no duermes.» [frida/cama_diario] |
| cada mañana / cada día / cada mes | 5 | goya 1 · bot 3 · frida 1 | «Cada mañana paso con mi leche.» [goya/lechera] |
| son las siete / a las … de la mañana / once de la noche | 5 | cole 3 · frida 2 | «(Juegas hasta las dos de la mañana.)» [cole/consola] |
| cinco minutos más / una partida más | 2 | cole 2 | «Cinco minutos más…» [cole/mama1] |
| tal y como (es / son) | 2 | goya 2 | «(Los pintas tal y como son.)» [goya/familia] |
| fin de la aventura | 4 | quij 1 · frida 3 | «Fin de la aventura.» [quijote/death.locura.lo] |
| ir a + inf. (futuro próximo) | 4 | cole 3 · bot 1 | «Voy a estudiar más.» [cole/mama4] |
| ni … ni … | 2 | cole 1 · frida 1 | «Ni un céntimo: ni bus, ni bocadillo, ni cromos.» [cole/death.dinero.lo] |
| sin + inf. (sin dormir, sin comer…) | 6 | cole 1 · quij 1 · goya 3 · frida 1 | «(Pintas sin dormir.)» [goya/prisa] |
| nada de + sust./inf. | 3 | frida 3 | «Nada de pintar, nada de visitas.» [frida/doctor_reposo] |
| ¿y si …? | 2 | quij 1 · goya 1 | «¿Y si somos pastores?» [quijote/camino] |
| más … que | 5 | quij 3 · goya 1 · bot 1 | «Esa mano es más grande que la cabeza.» [botero/academia] |
| el/la más … del mundo | 1 | quij | «la más bella del mundo» [quijote/dulcinea] |
| tan + adj. (que …) | 5 | goya 2 · bot 2 · frida 1 | «Te sientes tan fuerte que organizas tres fiestas» [frida/death.salud.hi] |
| demasiado/a(s) + sust./adj. | 4 | cole 1 · quij 1 · bot 2 | «Demasiado tiempo lejos» [botero/death.raices.lo] |
| ¿cómo te llamas? / me llamo … | 2 | cole | «¡Hola! Tú eres… ¿cómo te llamas?» [cole/intro] |
| ¿de dónde eres? | 1 | cole | «¡Claro! ¿De dónde eres?» [cole/alex1] |
| ¿cómo se dice … en español? | 2 | cole 2 | «¿Cómo se dice «bibliothèque» en español?» [cole/quiz2] |
| (no / ya) lo sé | 2 | quij 1 · goya 1 | «No lo sé. Por eso lo pinto.» [goya/perro] |
| ¿en serio? | 1 | quij | «¿En serio, señor?» [quijote/barco] |
| te lo prometo / palabra de caballero | 2 / 1 | bot, quij | «Te lo prometo: un museo lleno de obras.» [botero/medellin_pide] |
| a medias / de un bocado / pasar de largo | 1 / 1 / 1 | cole, frida, quij | «¡Palomitas a medias!» [cole/pablo3] |
| refranes (más vale pájaro en mano…; no hay mal que por bien no venga; dime con quién andas…) | 3 | quij 3 | «Más vale pájaro en mano que ciento volando.» [quijote/pajaro] |

### 1.5 Conectores y palabras-herramienta (140 lemas · 2584 ocurrencias)

Artículos, pronombres, posesivos, preposiciones, conjunciones, adverbios de tiempo/lugar/cantidad, numerales e interjecciones de cortesía.

| lema | n | cole | quij | goya | bot | frida | formas en los mazos |
|---|---:|---:|---:|---:|---:|---:|---|
| el / la / los / las | 417 | 91 | 70 | 99 | 77 | 80 | la, el, los, las |
| un / una / uno / unas | 183 | 35 | 37 | 42 | 37 | 32 | un, una, unas, uno |
| de | 180 | 47 | 34 | 27 | 33 | 39 |  |
| y | 153 | 19 | 31 | 27 | 34 | 42 |  |
| te / me / se / le / les / nos (pron. átonos) | 148 | 28 | 35 | 17 | 33 | 35 | te, me, se, le, les, nos |
| en | 118 | 28 | 18 | 23 | 18 | 31 |  |
| a | 104 | 22 | 34 | 12 | 18 | 18 |  |
| tu / tus | 93 | 18 | 16 | 9 | 21 | 29 | tu, tus |
| no | 82 | 22 | 20 | 12 | 13 | 15 |  |
| con | 68 | 11 | 13 | 19 | 7 | 18 |  |
| para | 47 | 8 | 8 | 5 | 18 | 8 |  |
| mi / mis / mía | 46 | 13 | 10 | 9 | 7 | 7 | mi, mis, mía |
| todo / toda / todos / todas | 46 | 11 | 5 | 4 | 9 | 17 | todo, toda, todos, todas |
| que | 45 | 3 | 16 | 9 | 8 | 9 |  |
| lo | 43 | 7 | 8 | 9 | 6 | 13 |  |
| por | 40 | 10 | 12 | 6 | 4 | 8 |  |
| qué | 38 | 6 | 7 | 8 | 5 | 12 |  |
| del | 37 | 5 | 12 | 8 | 5 | 7 |  |
| más | 27 | 4 | 8 | 6 | 8 | 1 |  |
| al | 26 | 4 | 7 | 5 | 5 | 5 |  |
| hoy | 25 | 6 | 1 | 7 | 1 | 10 |  |
| tú | 25 | 2 | 7 | 6 | 2 | 8 |  |
| sí | 24 | 6 | 1 | 2 | 6 | 9 |  |
| sin | 23 | 3 | 7 | 8 | 3 | 2 |  |
| tres | 20 | 7 | 3 | 4 | 3 | 3 |  |
| su / sus | 18 | 1 | 4 | 3 | 7 | 3 | su, sus |
| muy | 17 | 7 | 1 | 4 | 4 | 1 |  |
| yo | 17 | 6 | 6 | 1 | 3 | 1 |  |
| bien | 16 |  | 6 | 4 | 3 | 3 |  |
| pero | 14 | 1 | 4 | 5 | 2 | 2 |  |
| dos | 13 | 5 | 2 | 1 | 4 | 1 |  |
| ahora | 12 | 1 |  | 4 | 3 | 4 |  |
| este / esta / esa / eso | 12 | 5 | 1 | 1 | 3 | 2 | esta, este, esa, eso |
| gracias | 12 | 6 | 1 | 3 | 1 | 1 |  |
| ni | 12 | 5 |  | 3 | 1 | 3 |  |
| otro / otra / otros | 12 | 1 |  | 6 | 1 | 4 | otra, otro, otros |
| solo (adv. = solamente) | 12 | 4 | 1 | 3 | 4 |  | solo |
| como (conj./adv.) | 11 |  | 2 | 5 | 3 | 1 | como |
| usted | 11 |  |  | 2 | 3 | 6 |  |
| nada | 10 | 2 | 2 | 1 | 1 | 4 |  |
| él | 9 | 2 | 1 | 2 | 3 | 1 |  |
| mucho / muchas / muchísimo | 9 | 2 |  | 6 | 1 |  | mucho, muchas, muchísimo |
| o | 9 | 3 | 2 | 1 | 2 | 1 |  |
| primero / primer / primera | 9 | 1 | 1 | 1 | 2 | 4 | primer, primera, primero |
| vale | 9 | 5 | 3 | 1 |  |  |  |
| aquí | 8 |  | 1 | 1 | 3 | 3 |  |
| diez | 8 | 3 |  | 1 | 1 | 3 |  |
| nadie | 8 |  | 1 | 4 | 2 | 1 |  |
| quién | 8 | 2 | 3 | 1 | 1 | 1 |  |
| sobre | 8 | 3 |  | 3 | 1 | 1 |  |
| ya | 8 | 2 | 3 | 2 | 1 |  |  |
| claro | 7 | 4 |  | 1 | 2 |  |  |
| perdón | 7 | 2 | 3 |  | 2 |  |  |
| poco / poquito | 7 |  |  | 1 | 3 | 3 | poco, poquito |
| seis | 7 | 4 | 2 |  |  | 1 |  |
| cada | 6 |  |  | 1 | 3 | 2 |  |
| cinco | 6 | 6 |  |  |  |  |  |
| hasta | 6 | 5 | 1 |  |  |  |  |
| lejos | 6 |  | 2 | 1 | 3 |  |  |
| mí | 6 |  | 2 | 1 |  | 3 |  |
| ti | 6 | 1 | 2 | 1 |  | 2 |  |
| ja, ja (risa) | 5 | 2 | 3 |  |  |  | jaja, jajaja, ja |
| si | 5 |  | 2 | 2 | 1 |  |  |
| tan | 5 |  |  | 2 | 2 | 1 |  |
| ¡viva! (¡Viva México!, ¡Viva la vida!) | 4 |  |  |  |  | 4 | viva |
| así | 4 |  | 1 | 1 |  | 2 |  |
| casi | 4 | 3 |  | 1 |  |  |  |
| cómo | 4 | 3 |  | 1 |  |  |  |
| conmigo | 4 | 1 | 1 |  | 1 | 1 |  |
| demasiado | 4 | 1 | 1 |  | 2 |  | demasiada, demasiadas |
| desde | 4 |  | 1 | 1 | 1 | 1 |  |
| nunca | 4 |  |  |  | 3 | 1 |  |
| ochenta | 4 |  |  | 4 |  |  |  |
| siempre | 4 |  | 2 | 2 |  |  |  |
| tal (tal y como / un tal) | 4 |  | 1 | 2 |  | 1 | tal |
| también | 4 |  | 2 | 1 |  | 1 |  |
| basta | 3 | 1 | 1 |  |  | 1 |  |
| cien / ciento | 3 | 1 | 1 |  | 1 |  | cien, ciento |
| después | 3 |  |  |  | 2 | 1 |  |
| detrás | 3 | 1 |  | 2 |  |  |  |
| doce | 3 |  | 2 |  | 1 |  |  |
| dónde | 3 | 2 |  | 1 |  |  |  |
| fuera | 3 |  | 2 | 1 |  |  |  |
| gratis | 3 |  |  |  | 2 | 1 |  |
| mal (adv./sust.) | 3 | 2 | 1 |  |  |  | mal |
| mil | 3 |  | 3 |  |  |  |  |
| nosotros / nosotras | 3 | 1 | 1 |  | 1 |  | nosotros, nosotras |
| porque | 3 |  |  |  | 1 | 2 |  |
| treinta | 3 |  | 2 |  | 1 |  |  |
| adiós | 2 | 1 |  | 1 |  |  |  |
| algo | 2 |  |  | 1 |  | 1 |  |
| cero | 2 | 1 |  |  | 1 |  |  |
| contra | 2 |  | 1 | 1 |  |  |  |
| cuatro | 2 |  | 1 | 1 |  |  |  |
| delante | 2 | 1 |  | 1 |  |  |  |
| durante | 2 |  |  |  | 1 | 1 |  |
| hola | 2 | 2 |  |  |  |  |  |
| junto (a) | 2 |  | 1 |  | 1 |  | junto |
| luego | 2 |  |  | 1 |  | 1 |  |
| mismo / misma | 2 |  |  |  |  | 2 | mismo, misma |
| nuestro / nuestra | 2 |  | 1 | 1 |  |  | nuestro, nuestra |
| quien | 2 |  |  |  | 1 | 1 |  |
| siete | 2 | 2 |  |  |  |  |  |
| todavía | 2 |  |  | 1 | 1 |  |  |
| tuya | 2 |  |  | 1 |  | 1 |  |
| veinte | 2 |  |  |  | 2 |  |  |
| ¡adelante! | 1 |  | 1 |  |  |  | adelante |
| ¡qué padre! (México) | 1 |  |  |  |  | 1 | padre |
| ahí | 1 |  |  |  |  | 1 |  |
| algún | 1 | 1 |  |  |  |  |  |
| bajo (prep.) | 1 |  |  |  |  | 1 | bajo |
| bienvenido | 1 |  | 1 |  |  |  |  |
| cincuenta | 1 | 1 |  |  |  |  |  |
| contigo | 1 |  |  | 1 |  |  |  |
| cual (tal cual) | 1 |  |  |  |  | 1 | cual |
| cuándo | 1 |  | 1 |  |  |  |  |
| de largo (pasar de largo) | 1 |  | 1 |  |  |  | largo |
| dentro | 1 | 1 |  |  |  |  |  |
| dieciséis | 1 |  |  |  | 1 |  |  |
| ellos | 1 |  |  |  |  | 1 |  |
| en serio | 1 |  | 1 |  |  |  | serio |
| encima | 1 |  | 1 |  |  |  |  |
| enhorabuena | 1 |  | 1 |  |  |  |  |
| entre | 1 |  |  |  |  | 1 |  |
| hacia | 1 |  |  | 1 |  |  |  |
| millón | 1 | 1 |  |  |  |  |  |
| ninguna | 1 |  |  |  | 1 |  |  |
| obvio | 1 | 1 |  |  |  |  |  |
| ocho | 1 | 1 |  |  |  |  |  |
| once | 1 | 1 |  |  |  |  |  |
| porfa (por favor) | 1 | 1 |  |  |  |  | porfa |
| pronto | 1 |  | 1 |  |  |  |  |
| pues | 1 |  |  |  | 1 |  |  |
| quizá | 1 |  | 1 |  |  |  |  |
| seiscientos | 1 |  | 1 |  |  |  |  |
| sesenta | 1 | 1 |  |  |  |  |  |
| tanto | 1 | 1 |  |  |  |  |  |
| tras | 1 |  |  | 1 |  |  |  |
| trece | 1 |  |  | 1 |  |  |  |
| vuestra | 1 |  | 1 |  |  |  |  |

---

## 2. Campo léxico de supervivencia ya presente

Lemas de los mazos que encajan en un relato de selva / río / tormenta / noche / refugio / rescate, con una frase literal de carta. **n** = ocurrencias en los cinco mazos.

### 2.1 Necesidades, estados físicos y emociones

| lema | cat. | n | mazos | ejemplo de carta [id] |
|---|---|---:|---|---|
| hambre | N | 3 | quij goya bot | «El leonero dice que tienen hambre.» [quijote/leon] |
| miedo | N | 3 | goya frida | «Y tú, ¿me tienes miedo?» [frida/calavera_miedo] |
| cansado | A | 2 | quij frida | «Gracias, Sansón. Estoy cansado.» [quijote/revelacion] |
| cansarse | V | 1 | frida | «(Vuelves al mercado. Te cansas.)» [frida/diego_fruta] |
| herida | N | 1 | quij | «¿Tu bálsamo de Fierabrás cura todas las heridas?» [quijote/balsamo] |
| perdido | A | 1 | cole | «Objetos perdidos: tres bufandas, un balón, un zapato…» [cole/paco3] |
| perder | V | 3 | quij bot | «Te pierdes.» [botero/death.raices.lo] |
| solo (adj., estar solo) | A | 6 | cole quij goya bot frida | «Porque estoy sola. (Dejas el pincel.)» [frida/espejo_yo] |
| triste | A | 5 | cole quij bot | «(Garfio mira tu bocadillo con ojos tristes.)» [cole/gato] |
| contento | A | 1 | goya | «El vecino no está contento.» [goya/death.genio.hi] |
| alegre | A | 3 | quij goya bot | «(Relincho alegre.)» [quijote/yeguas] |
| alegría | N | 1 | bot | «(Lloras un poco. De alegría.)» [botero/promesa_plaza] |
| enfermo | A | 1 | goya | «Que estoy enfermo. En la cama.» [goya/policia] |
| fiebre | N | 2 | goya | «Otra vez con fiebre, Francisco.» [goya/hambre] |
| doler | V | 5 | cole quij frida | «Me duele la pierna…» [cole/edfisica] |
| dolor | N | 1 | quij | «¡Mi dama, encantada! ¡Qué dolor!» [quijote/encantada] |
| fuerte | A | 2 | cole frida | «Te sientes tan fuerte que organizas tres fiestas, dos viajes y un desfile.» [frida/death.salud.hi] |
| flaco | A | 6 | quij bot | «Tu caballo flaco pide un nombre.» [quijote/salida] |
| tranquilo | A | 4 | cole bot | «(Grande, redondo y muy tranquilo.)» [botero/toro_modelo] |
| valiente | A | 1 | bot | «él, alto y valiente; yo, el toro, pequeño y feo.» [botero/toro_retrato] |
| loco | A | 3 | quij | «¿Y dicen que yo estoy loco?» [quijote/sanson] |
| peligroso | A | 1 | goya | «Ahora no. Es peligroso.» [goya/puerta_sol] |
| seguro | A | 1 | bot | «Dinero seguro cada mes. ¿Firma?» [botero/contrato] |
| seguridad | N | 1 | bot | «(Firmas. Seguridad.)» [botero/contrato] |
| vergüenza | N | 1 | cole | «(Lo apagas rápido. Qué vergüenza.)» [cole/movil] |
| pena | N | 2 | bot frida | «¡Qué pena, Frida!» [frida/death.mexico.hi] |
| prisa | N | 1 | quij | «¡Aparta, que tengo prisa!» [quijote/encantada] |
| aburrirse | V | 2 | frida | «Te aburres. ¿Qué pides?» [frida/salida] |
| temblar | V | 2 | quij bot | «¡Pum! ¡Pum! Noche negra y golpes terribles. Tiemblo.» [quijote/batanes] |
| asustar | V | 1 | quij | «Un gato te asusta y huyes.» [quijote/death.valor.lo] |
| llorar | V | 3 | quij bot frida | «(Lloras en casa.)» [frida/expo_doctor] |
| gritar | V | 6 | cole quij goya frida | «Sancho grita: «¡Son molinos, señor!»» [quijote/molinos] |
| reír(se) | V | 6 | quij bot frida | «¿Miedo? ¡Me río de ti! (Le cantas.)» [frida/calavera_miedo] |
| sentirse | V | 2 | goya frida | «Te sientes tan bien que vas a todas las fiestas de Madrid.» [goya/death.salud.hi] |
| sueño | N | 6 | goya frida | «(Dibujas «El sueño de la razón».)» [goya/sueno] |
| vida | N | 3 | frida | «Soy tu casa de Coyoacán, tu casa de toda la vida.» [frida/casa_quiz] |
| muerte | N | 1 | frida | «Hoy la muerte es una fiesta: pan de muerto, velas, papel picado.» [frida/calavera_miedo] |
| morir | V | 1 | goya | «Tu arte muere de aburrimiento.» [goya/death.corte.hi] |
| vivir | V | 2 | quij | «Un caballero vive de sus hazañas.» [quijote/hambre] |
| vivo | A | 1 | bot | «¡Primera vez para un artista vivo!» [botero/campos_eliseos] |
| sobrevivir | V | 1 | cole | «¡Has sobrevivido al año escolar!» [cole/win] |

### 2.2 Acciones de supervivencia

| lema | cat. | n | mazos | ejemplo de carta [id] |
|---|---|---:|---|---|
| dormir | V | 14 | cole quij goya frida | «(Duermes sobre la mesa.)» [cole/lluvia] |
| comer | V | 26 | cole quij goya bot frida | «¿Y tú no comes nada? Los caballeros no comen, ¿o qué?» [quijote/hambre] |
| beber | V | 2 | quij | «(Lo bebes. Vomitas. ¡Como nuevo!)» [quijote/balsamo] |
| cenar | V | 3 | cole quij goya | «¿Cenamos? Tengo pan, queso y cebolla.» [quijote/hambre] |
| buscar | V | 1 | cole | «Buscamos voluntarios para limpiar el patio el sábado.» [cole/ruiz2] |
| ayudar | V | 2 | cole | «Mi perro se ha comido mis deberes. ¡De verdad! ¿Me ayudas?» [cole/pablo2] |
| necesitar | V | 3 | quij bot | «Te necesito: tu arte aquí, en una plaza, gratis, para todos.» [botero/medellin_pide] |
| esperar | V | 9 | goya bot frida | «(Cierras las ventanas. Esperas.)» [goya/dosmayo] |
| descansar | V | 4 | quij goya frida | «Descansa, amigo. Te lo mereces.» [quijote/cansado] |
| descanso | N | 2 | goya | «Te receto descanso, sopa y paseos. Sin pinceles.» [goya/reposo] |
| reposo | N | 3 | frida | «Reposo total. Nada de pintar, nada de visitas.» [frida/doctor_reposo] |
| despertar(se) | V | 2 | cole goya | «(Despiertas. Café. Sin monstruos.)» [goya/sueno] |
| amanecer | V | 1 | quij | «(Amanece. Son seis batanes.)» [quijote/batanes] |
| levantarse | V | 1 | cole | «Son las siete. ¿Te levantas?» [cole/mama1] |
| esconder | V | 5 | cole goya bot frida | «(Te escondes detrás del libro.)» [cole/garcia1] |
| subir | V | 11 | quij goya bot frida | «(Subes al árbol tú también.)» [frida/mono_roba] |
| caer(se) | V | 1 | quij | «te caes de Rocinante al primer trote.» [quijote/death.fuerzas.lo] |
| correr | V | 3 | cole goya | «(Corres detrás. Mucho.)» [goya/cometa] |
| caminar | V | 2 | cole quij | «(Caminas en silencio. A casa.)» [quijote/camino] |
| andar | V | 2 | cole quij | «(Vas andando con Pablo.)» [cole/bus] |
| saltar | V | 2 | cole frida | «Corres por los pasillos, saltas las mesas, haces el pino en el comedor.» [cole/death.energia.hi] |
| cruzar | V | 1 | cole | «(Cruzas los dedos.)» [cole/garcia3] |
| flotar | V | 1 | cole | «(Flotas tranquilamente.)» [cole/acuatico] |
| volar | V | 6 | quij goya | «(Subes con Sancho. ¡Volamos!)» [quijote/clavileno] |
| huir | V | 1 | quij | «Un gato te asusta y huyes.» [quijote/death.valor.lo] |
| llegar | V | 4 | bot frida | «Llegas a París.» [frida/breton_aduana] |
| salir | V | 8 | cole goya bot frida | «Hoy sales a la calle. Te miras en mí.» [frida/tehuana] |
| volver | V | 12 | quij goya bot frida | «Volvemos a casa.» [quijote/camino] |
| quedar(se) | V | 9 | quij goya bot frida | «(Te quedas con Rocinante.)» [quijote/barco] |
| seguir | V | 3 | bot frida | «Ahora Fulang-Chang te sigue a todas partes.» [frida/mono_hombro] |
| pasar | V | 8 | cole quij goya bot frida | «Seiscientos cerdos pasan por encima de nosotros.» [quijote/cerdos] |
| llevar | V | 9 | quij goya frida | «¿Le llevas la comida?» [frida/diego_canasta] |
| dejar | V | 7 | quij bot frida | «Me dejas atado en la orilla del Ebro y subes a un barco sin remos.» [quijote/barco] |
| atar | V | 2 | quij | «He atado las patas de Rocinante: ¡no vas!» [quijote/batanes] |
| guardar | V | 7 | cole quij goya frida | «(Las guardas en un cajón.)» [goya/desastres] |
| abrir | V | 2 | quij bot | «¡Abre la jaula, leonero!» [quijote/leon] |
| cerrar | V | 2 | quij goya | «(Cierras las ventanas. Esperas.)» [goya/dosmayo] |
| defender | V | 1 | quij | «(Defiendes a tu caballo. Palos.)» [quijote/yeguas] |
| atacar | V | 2 | quij | «(Atacas a los cerdos. Con honor.)» [quijote/cerdos] |
| liberar | V | 1 | quij | «(Los liberas. Te tiran piedras.)» [quijote/galeotes] |
| tirar | V | 1 | quij | «(Los liberas. Te tiran piedras.)» [quijote/galeotes] |
| ganar | V | 4 | cole quij bot | «¡Sí! ¡A ganar!» [cole/basket] |
| oír | V | 4 | quij goya | «(No oyes voces. Te duele todo.)» [quijote/freston] |
| ver | V | 10 | quij goya bot frida | «Nadie las ve… todavía.» [goya/desastres] |
| mirar | V | 23 | cole quij goya bot frida | «(Miras bien… Son molinos.)» [quijote/molinos] |
| oler | V | 3 | quij frida | «Huele a aceite viejo y romero.» [quijote/balsamo] |
| cocinar | V | 1 | bot | «(Cocinas ajiaco para tus amigos.)» [botero/nostalgia_ajiaco] |
| preparar | V | 2 | quij bot | «Te preparo ajiaco y arepas. ¡Come!» [botero/mama_ajiaco] |
| curar | V | 1 | quij | «¿Tu bálsamo de Fierabrás cura todas las heridas?» [quijote/balsamo] |
| llamar(se) | V | 7 | cole goya frida | «Los vecinos llaman a la policía.» [frida/death.alegria.hi] |
| mojarse | V | 1 | quij | «Llevo mi bacía de latón en la cabeza para no mojarme.» [quijote/yelmo] |
| secarse | V | 1 | bot | «El pincel se seca solo en el taller.» [botero/death.dinero.hi] |
| viajar | V | 1 | quij | «¡Yo no viajo con bandidos!» [quijote/roque] |
| recorrer | V | 1 | bot | «(Compras una moto y recorres Italia.)» [botero/florencia] |
| entrar | V | 1 | bot | «¡Todas queremos entrar en tu cuadro!» [botero/mercado_frutas] |
| meter | V | 1 | cole | «¿Qué metes en la mochila?» [cole/viaje1] |
| aguantar | V | 1 | cole | «No. Aguanto. Es solo mates.» [cole/enfermeria] |
| hablar | V | 8 | cole quij goya bot frida | «Hace tres días que no te hablo.» [quijote/sininsula] |
| decir | V | 22 | cole quij goya bot frida | «Dime con quién andas y te diré quién eres.» [quijote/galeotes] |
| escribir | V | 8 | cole quij bot frida | «Escribe a tu «correspondant».» [cole/lefevre3] |
| responder | V | 3 | bot | «El Museo de Antioquia te escribe otra vez. ¿Respondes?» [botero/promesa_carta] |
| preguntar | V | 3 | goya bot | «Un periodista pregunta: ¿sus figuras están gordas o tienen volumen?» [botero/quiz_gordas] |
| cantar | V | 10 | cole frida | «(Cantas con él. ¡Todos cantan!)» [cole/viajebus] |
| jugar | V | 6 | cole goya | «¡Jugamos a la gallina ciega en el campo!» [goya/gallina] |
| ir / irse | V | 29 | cole quij goya bot frida | «Perdón. ¡Rocinante, vámonos!» [quijote/yeguas] |

### 2.3 Tiempo y meteorología

| lema | cat. | n | mazos | ejemplo de carta [id] |
|---|---|---:|---|---|
| noche | N | 16 | cole quij goya bot frida | «¡Pum! ¡Pum! Noche negra y golpes terribles.» [quijote/batanes] |
| día | N | 22 | cole quij goya bot frida | «Pintas día y noche.» [goya/reposo] |
| mañana (sust./adv.) | N | 14 | cole quij goya bot frida | «Cada mañana paso con mi leche.» [goya/lechera] |
| tarde | N | 2 | cole | «Tarde libre en la Puerta del Sol.» [cole/sol] |
| hora | N | 9 | cole quij frida | «Seis horas de autobús hasta Madrid.» [cole/viajebus] |
| minuto | N | 4 | cole bot frida | «Vale, cinco minutos.» [cole/hermana] |
| semana | N | 5 | quij goya bot frida | «Tres semanas, o nada.» [goya/prisa] |
| mes | N | 4 | bot frida | «Después del accidente del autobús, pasas meses en la cama.» [frida/salida] |
| año | N | 12 | cole quij goya bot | «Si pierdes, un año en casa.» [quijote/blancaluna] |
| llover | V | 3 | cole quij frida | «Llueve muchísimo. Recreo dentro de la clase…» [cole/lluvia] |
| lluvia | N | 1 | bot | «El gris es para los días de lluvia.» [botero/colores] |
| viento | N | 3 | quij goya | «Giramos con el viento y tenemos brazos largos.» [quijote/molinos] |
| sol | N | 2 | goya | «(Pintas una merienda al sol.)» [goya/salida] |
| luna | N | 1 | goya | «Brujas, luna llena y una cabra gigante con cuernos.» [goya/aquelarre] |
| cielo | N | 6 | cole quij goya frida | «Un perro pequeño, solo, mira al cielo.» [cole/prado2] |
| nube | N | 2 | quij frida | «(Lo dejas así. Nubes con patas.)» [frida/casa_xolos] |
| luz | N | 2 | goya frida | «(Pintas con la primera luz del día.)» [frida/perico_alba] |
| aire | N | 1 | goya | «Cuatro majas lanzan un pelele al aire con una manta.» [goya/pelele] |
| polvo | N | 2 | quij frida | «El estudio se llena de polvo.» [frida/death.arte.lo] |
| humo | N | 1 | cole | «(Tocas. Humo verde.)» [cole/lab] |
| fin | N | 6 | cole quij frida | «Fin de la aventura.» [quijote/death.locura.lo] |

### 2.4 Lugares y naturaleza

| lema | cat. | n | mazos | ejemplo de carta [id] |
|---|---|---:|---|---|
| mar | N | 3 | quij | «¡Señor! ¡Mira! ¡El mar! Es enorme y… ¡se mueve!» [quijote/mar] |
| playa | N | 2 | cole quij | «(Duelo en la playa. Pierdes.)» [quijote/blancaluna] |
| isla | N | 2 | cole bot | «Te escondes en una isla.» [botero/death.fama.hi] |
| orilla | N | 1 | quij | «Me dejas atado en la orilla del Ebro…» [quijote/barco] |
| laguna | N | 1 | quij | «Más grande que todas las lagunas de Ruidera.» [quijote/mar] |
| pozo | N | 1 | quij | «Vela tus armas esta noche junto al pozo.» [quijote/velar] |
| cueva | N | 1 | quij | «Señor, has estado una hora en la cueva de Montesinos.» [quijote/montesinos] |
| montaña | N | 5 | bot | «Somos las montañas de Medellín.» [botero/montanas_ventana] |
| campo | N | 1 | goya | «¡Jugamos a la gallina ciega en el campo!» [goya/gallina] |
| pradera | N | 2 | goya | «Merienda en la pradera, música y baile.» [goya/isidro] |
| prado (pradera) | N | 1 | quij | «Hay unas yeguas simpáticas en el prado.» [quijote/yeguas] |
| árbol | N | 3 | goya frida | «(Juegas. Chocas con un árbol.)» [goya/gallina] |
| planta | N | 1 | frida | «¡Sí! Ídolos, plantas y una pirámide.» [frida/casa_idolos] |
| hierba | N | 1 | quij | «Llevo tres días sin hierba.» [quijote/cansado] |
| flor | N | 9 | goya bot frida | «Hoy no, búho. Hoy pinto flores.» [goya/aquelarre] |
| piedra | N | 4 | quij goya frida | «(Los liberas. Te tiran piedras.)» [quijote/galeotes] |
| arena | N | 2 | goya | «un perro pequeño con la cabeza fuera de la arena» [goya/perro] |
| suelo | N | 1 | quij | «(En el suelo. Una voz.)» [quijote/freston] |
| frontera | N | 1 | frida | «(No. Pintas la frontera. Nostalgia.)» [frida/gringolandia] |
| mundo | N | 8 | cole quij goya bot frida | «El mundo es grande, montañas.» [botero/montanas_olvidar] |
| país | N | 1 | bot | «Todo el país habla de usted.» [botero/salon_nacional] |
| ciudad | N | 1 | bot | «Soy Medellín, tu ciudad.» [botero/medellin_pide] |
| pueblo | N | 2 | quij goya | «Vuelve al pueblo, Alonso.» [quijote/vuelve] |
| casa | N | 22 | quij goya bot frida | «Quédate en casa, pintor.» [goya/dosmayo] |
| puerta | N | 3 | goya bot | «La Inquisición llama a tu puerta con MUCHAS preguntas…» [goya/death.corte.lo] |
| ventana | N | 3 | goya bot | «Nos ves desde tu ventana cada mañana.» [botero/montanas_ventana] |
| lejos | C | 6 | quij goya bot | «Te vas lejos, muy lejos. ¿Nos vas a olvidar?» [botero/montanas_olvidar] |
| aquí | C | 8 | quij goya bot frida | «Señor, la venta está aquí y la aventura, lejos.» [quijote/pajaro] |
| fuera | C | 3 | quij goya | «¡Fuera de mi biblioteca!» [quijote/libros] |
| dentro | C | 1 | cole | «Recreo dentro de la clase…» [cole/lluvia] |
| detrás | C | 3 | cole goya | «(Te escondes detrás del libro.)» [cole/garcia1] |
| delante | C | 2 | cole goya | «(Delante de él. Buen provecho.)» [goya/saturno] |
| encima | C | 1 | quij | «Seiscientos cerdos pasan por encima de nosotros.» [quijote/cerdos] |
| junto (a) | C | 2 | quij bot | «Vela tus armas esta noche junto al pozo.» [quijote/velar] |
| hacia | C | 1 | goya | «El viento la lleva hacia el palacio…» [goya/cometa] |
| hasta | C | 6 | cole quij | «Clavileño, el caballo de madera, vuela hasta el reino de Candaya.» [quijote/clavileno] |
| desde | C | 4 | quij goya bot frida | «Mis costillas se ven desde lejos, señor.» [quijote/cansado] |

### 2.5 Equipo y objetos

| lema | cat. | n | mazos | ejemplo de carta [id] |
|---|---|---:|---|---|
| mochila | N | 2 | cole | «¿Qué metes en la mochila?» [cole/viaje1] |
| mapa | N | 1 | cole | «Un libro, un paraguas y un mapa.» [cole/viaje1] |
| paraguas | N | 1 | cole | «Un libro, un paraguas y un mapa.» [cole/viaje1] |
| manta | N | 2 | goya | «(Subes a la manta. ¡Vuelas!)» [goya/pelele] |
| sábana | N | 1 | cole | «Fantasma: una sábana y ya.» [cole/halloween] |
| almohada | N | 2 | cole frida | «(Almohada en la cabeza. Duermes.)» [frida/perico_alba] |
| cama | N | 12 | cole quij goya frida | «Soy tu cama. Hoy te duele todo.» [frida/cama_pinceles] |
| caja | N | 1 | bot | «Vendes tu última caja de pinturas para comprar la cena.» [botero/death.dinero.lo] |
| paquete | N | 1 | cole | «Un paquete de cromos.» [cole/kiosco] |
| vela | N | 2 | goya frida | «pan de muerto, velas, papel picado» [frida/calavera_miedo] |
| libro | N | 13 | cole quij goya bot | «Un libro, un paraguas y un mapa.» [cole/viaje1] |
| libreta | N | 1 | quij | «Señor, tu carta para Dulcinea… está en tu libreta.» [quijote/cartamal] |
| carta | N | 4 | cole quij bot | «Una carta anónima en tu mochila: «Me gustas.»» [cole/valentin] |
| foto | N | 2 | bot frida | «—Una foto para la revista.» [frida/periodista_foto] |
| radio | N | 1 | bot | «(Vendes la radio. El cuadro se queda.)» [botero/contrato_alquiler] |
| móvil | N | 2 | cole | «Tu móvil suena EN CLASE. Todo el mundo te mira.» [cole/movil] |
| reloj | N | 1 | goya | «Con mi perro, mi escopeta y mi reloj nuevo. ¡Tic, tac!» [goya/caza] |
| medicina | N | 1 | frida | «Toma tus medicinas y descansa.» [frida/doctor_fiesta] |
| venda | N | 1 | goya | «Ven, Paco, ponte la venda.» [goya/gallina] |
| espada | N | 2 | quij | «Una ínsula se gana con la espada.» [quijote/sininsula] |
| lanza | N | 1 | quij | «¡Princesa! ¡Mi lanza es vuestra!» [quijote/micomicona] |
| arma | N | 1 | quij | «Vela tus armas esta noche junto al pozo.» [quijote/velar] |
| jaula | N | 2 | quij | «Te llevan a casa en una jaula de madera.» [quijote/death.locura.hi] |
| barco | N | 2 | quij | «subes a un barco sin remos. ¿En serio, señor?» [quijote/barco] |
| remo | N | 1 | quij | «subes a un barco sin remos. ¿En serio, señor?» [quijote/barco] |
| carro | N | 1 | quij | «Un carro con dos leones del rey.» [quijote/leon] |
| avión | N | 1 | bot | «Compras tres castillos y un avión.» [botero/death.dinero.hi] |
| autobús | N | 2 | cole frida | «Seis horas de autobús hasta Madrid.» [cole/viajebus] |
| bus | N | 3 | cole | «(Repasas en el bus.)» [cole/garcia3] |
| ambulancia | N | 1 | frida | «(Vas… en tu cama. Con ambulancia.)» [frida/expo_doctor] |
| dinero | N | 6 | cole bot | «¿Y la pintura? ¿Da dinero para comer?» [botero/mama_comer] |
| euro | N | 7 | cole | «Toma, diez euros. Es un secreto.» [cole/abuela] |
| chaqueta | N | 2 | cole | «¡Mi chaqueta! ¡Gracias, Paco!» [cole/paco3] |
| zapato | N | 1 | cole | «Objetos perdidos: tres bufandas, un balón, un zapato…» [cole/paco3] |
| bufanda | N | 1 | cole | «Objetos perdidos: tres bufandas, un balón, un zapato…» [cole/paco3] |
| calcetín | N | 1 | cole | «Calcetines de renos.» [cole/navidad] |
| camisa | N | 1 | goya | «El hombre de la camisa blanca…» [goya/tresmayo] |
| sombrero | N | 3 | goya | «(Pintas lo que ves: tu sombrero.)» [goya/blanco] |
| vestido | N | 2 | frida | «(Lo escondes bajo el vestido.)» [frida/doctor_corse] |
| ropa | N | 1 | goya | «hay un cuadro de una maja… sin ropa» [goya/maja] |
| balón | N | 1 | cole | «Objetos perdidos: tres bufandas, un balón, un zapato…» [cole/paco3] |
| pelota | N | 1 | cole | «—¿La pelota en el tejado otra vez?» [cole/paco1] |

### 2.6 Comida y bebida

| lema | cat. | n | mazos | ejemplo de carta [id] |
|---|---|---:|---|---|
| comida | N | 1 | frida | «¿Le llevas la comida?» [frida/diego_canasta] |
| agua (tomar las aguas) | N | 1 | goya | «¿Permiso para ir a Francia «a tomar las aguas»?» [goya/aguas] |
| pan | N | 5 | quij goya frida | «Tengo pan, queso y cebolla.» [quijote/hambre] |
| queso | N | 2 | quij | «Tengo pan, queso y cebolla.» [quijote/hambre] |
| cebolla | N | 1 | quij | «Tengo pan, queso y cebolla.» [quijote/hambre] |
| ajo | N | 1 | quij | «Huele a ajo y grita más que un pastor.» [quijote/ajo] |
| fruta | N | 4 | cole bot frida | «Tu sapo-rana se come toda la fruta que quieres pintar.» [frida/diego_fruta] |
| manzana | N | 1 | cole | «Una manzana.» [cole/carmen2] |
| plátano | N | 3 | bot frida | «(Un plátano por los pinceles. Trato.)» [frida/mono_roba] |
| mango | N | 4 | bot frida | «(Compras un mango y te lo comes aquí.)» [frida/mercado_fruta] |
| sandía | N | 4 | frida | «Soy una sandía: roja, verde y dulce.» [frida/sandia_viva] |
| naranja | N | 1 | bot | «¡Soy una naranja enorme!» [botero/naranja_mesa] |
| sopa | N | 3 | goya | «(Comes. Sopa, pan y silencio.)» [goya/hambre] |
| leche | N | 2 | goya | «(Compras leche. Hoy, descanso.)» [goya/lechera] |
| café | N | 4 | goya frida | «(Despiertas. Café. Sin monstruos.)» [goya/sueno] |
| chocolate | N | 2 | cole frida | «Churros con chocolate para todos.» [cole/sol] |
| galleta | N | 2 | cole | «¿Yogur o galletas para merendar?» [cole/mama5] |
| bocadillo | N | 6 | cole | «Mi bocadillo es sagrado.» [cole/lucia1] |
| jamón | N | 1 | cole | «¡No! ¡Es mi jamón!» [cole/gato] |
| pescado | N | 1 | cole | «Hoy hay lentejas o pescado.» [cole/carmen1] |
| azúcar | N | 2 | bot frida | «Paga con… dos entradas y un algodón de azúcar.» [botero/circo_payaso] |
| cena | N | 5 | quij bot | «¿Cena o cama?» [quijote/venta] |
| merienda | N | 3 | goya | «(Pintas una merienda al sol.)» [goya/salida] |
| plato | N | 3 | bot frida | «(Comes tres platos. Y un jugo.)» [botero/mama_ajiaco] |
| mesa | N | 8 | cole goya bot frida | «(Duermes sobre la mesa.)» [cole/lluvia] |
| limonada | N | 1 | frida | «(Diriges desde una silla. Limonada.)» [frida/fridos_mural] |

### 2.7 Animales y criaturas

| lema | cat. | n | mazos | ejemplo de carta [id] |
|---|---|---:|---|---|
| perro | N | 13 | cole goya frida | «Un perro pequeño, solo, mira al cielo.» [cole/prado2] |
| gato | N | 4 | cole quij bot | «Un gato te asusta y huyes.» [quijote/death.valor.lo] |
| caballo | N | 10 | quij goya | «¿Un caballo que vuela? Ja, ja.» [quijote/clavileno] |
| yegua | N | 1 | quij | «Hay unas yeguas simpáticas en el prado.» [quijote/yeguas] |
| burro | N | 4 | quij goya | «(Una campesina en un burro.)» [quijote/encantada] |
| oveja | N | 2 | quij | «Beee. Son ovejas, Frestón.» [quijote/ovejas] |
| cerdo | N | 2 | quij | «Seiscientos cerdos pasan por encima de nosotros. Oink, oink.» [quijote/cerdos] |
| cabra | N | 1 | goya | «Brujas, luna llena y una cabra gigante con cuernos.» [goya/aquelarre] |
| gallina | N | 1 | goya | «¡Jugamos a la gallina ciega en el campo!» [goya/gallina] |
| toro | N | 7 | goya bot | «Soy el toro. ¿Me dibujas flaco y rápido…?» [botero/toro_modelo] |
| león | N | 2 | quij | «Un carro con dos leones del rey. Señor, NO.» [quijote/leon] |
| elefante | N | 1 | bot | «Payasos, un elefante, trapecistas.» [botero/circo_llega] |
| mono | N | 2 | frida | «(Autorretrato con mono. Perfecto.)» [frida/mono_hombro] |
| perico | N | 3 | frida | «Bonito, el perico, grita «¡Frida! ¡Frida!» a las seis de la mañana.» [frida/perico_alba] |
| pájaro | N | 2 | quij frida | «(Lo pintas con flores y pájaros.)» [frida/doctor_corse] |
| paloma | N | 2 | bot | «Soy la paloma de la paz.» [botero/paloma_paz] |
| búho | N | 2 | goya | «Murciélagos, búhos, monstruos… y tú dormido sobre la mesa.» [goya/sueno] |
| murciélago | N | 1 | goya | «Murciélagos, búhos, monstruos…» [goya/sueno] |
| rana | N | 2 | frida | «¡Gracias, sapo-rana!» [frida/diego_cuadros] |
| sapo | N | 2 | frida | «¡Gracias, sapo-rana!» [frida/diego_cuadros] |
| mariposa | N | 2 | goya frida | «(Cuentas las mariposas de tu cama.)» [frida/cama_diario] |
| oso | N | 1 | cole | «El Oso y el Madroño te miran.» [cole/sol] |
| hueso | N | 1 | goya | «(Le pintas un hueso. Pobre perro.)» [goya/perro] |
| pata | N | 3 | quij frida | «He atado las patas de Rocinante: ¡no vas!» [quijote/batanes] |
| cuerno | N | 1 | goya | «una cabra gigante con cuernos» [goya/aquelarre] |
| ala | N | 1 | goya | «(Alas, luz, sonrisa. Cobras.)» [goya/marques] |
| monstruo | N | 6 | quij goya | «¡Adelante! ¡Al monstruo!» [quijote/batanes] |
| gigante (sust.) | N | 5 | quij | «¡Gigantes! ¡A la carga!» [quijote/molinos] |
| bruja | N | 2 | goya | «sus dibujos tienen brujas, burros con libros y un burro médico» [goya/brujas] |
| fantasma | N | 1 | cole | «Fantasma: una sábana y ya.» [cole/halloween] |

### 2.8 Cuerpo

| lema | cat. | n | mazos | ejemplo de carta [id] |
|---|---|---:|---|---|
| cabeza | N | 5 | quij goya bot frida | «Llevo mi bacía de latón en la cabeza para no mojarme.» [quijote/yelmo] |
| mano | N | 5 | quij goya bot | «(Hablas con las manos. Aprende.)» [goya/manos] |
| brazo | N | 1 | quij | «Giramos con el viento y tenemos brazos largos.» [quijote/molinos] |
| pierna | N | 1 | cole | «Me duele la pierna…» [cole/edfisica] |
| pie | N | 3 | cole quij goya | «¡Todos de pie!» [cole/lefevre2] |
| espalda | N | 2 | bot frida | «hoy llueve y a usted le duele la espalda» [frida/fridos_lluvia] |
| hombro | N | 2 | frida | «Se sienta en tu hombro: quiere salir en el cuadro.» [frida/mono_hombro] |
| cuello | N | 1 | frida | «Ahora lo lleva él, en su cuello.» [frida/mono_collar] |
| ojo | N | 3 | cole quij frida | «Ojos vendados, por favor.» [quijote/clavileno] |
| dedo | N | 1 | cole | «(Cruzas los dedos.)» [cole/garcia3] |
| cuerpo | N | 1 | frida | «Tu cuerpo dice: ¡BASTA!» [frida/death.salud.lo] |
| tripa | N | 1 | cole | «Te duele la tripa en clase de mates.» [cole/enfermeria] |
| estómago | N | 1 | cole | «Tu estómago hace GRRRR.» [cole/death.dinero.lo] |
| cara | N | 1 | goya | «(Mucho oro. Cara seria. Cobras.)» [goya/retrato_fernando] |
| nariz | N | 1 | goya | «(Lo pintas como es: nariz grande.)» [goya/marques] |
| pelo | N | 2 | frida | «Para mi pelo. ¡Todas!» [frida/mercado_flores] |
| costilla | N | 1 | quij | «Mis costillas se ven desde lejos, señor.» [quijote/cansado] |
| labio | N | 2 | cole goya | «(Descansas. Lees los labios.)» [goya/enfermedad] |
| frente | N | 1 | frida | «Soy de azúcar y llevo tu nombre en la frente.» [frida/calavera_nombre] |

### 2.9 Personas, compañía y comunicación

| lema | cat. | n | mazos | ejemplo de carta [id] |
|---|---|---:|---|---|
| amigo | N | 6 | cole quij bot | «Descansa, amigo. Te lo mereces.» [quijote/cansado] |
| vecino | N | 5 | cole goya bot frida | «El vecino ofrece tres euros por pasear a su perro.» [cole/vecino] |
| niño | N | 4 | bot frida | «Hoy no, niño. Estoy cansada.» [frida/mercado_nino] |
| hombre | N | 3 | quij goya frida | «Doce hombres encadenados van a las galeras del rey.» [quijote/galeotes] |
| gente | N | 2 | bot | «Estás muy flaco para pintar gente tan redonda.» [botero/mama_ajiaco] |
| familia | N | 2 | goya bot | «(Celebras con la familia en Medellín.)» [botero/salon_nacional] |
| mamá | N | 5 | cole bot | «¡Ya voy, mamá!» [cole/mama1] |
| padre | N | 1 | cole | «Tus padres confiscan tu móvil, tu consola… y el sofá.» [cole/death.notas.lo] |
| hermana | N | 1 | cole | «¡Mi hermana pinta mejor!» [cole/prado2] |
| abuela | N | 3 | cole | «¡Gracias, abuela!» [cole/abuela] |
| señor | N | 35 | cole quij goya bot | «Señor, la venta está aquí y la aventura, lejos.» [quijote/pajaro] |
| señora | N | 4 | cole quij frida | «Hoy no, señora. Compro lienzos.» [frida/mercado_flores] |
| doctor | N | 5 | frida | «Sí, doctor. (Duermes.)» [frida/doctor_reposo] |
| médico | N | 4 | quij goya frida | «Pero el médico me prohíbe comer. ¡Todo!» [quijote/barataria] |
| policía | N | 2 | goya frida | «Los vecinos llaman a la policía.» [frida/death.alegria.hi] |
| conductor | N | 1 | cole | «El conductor: —Son dos euros, por favor.» [cole/bus] |
| héroe | N | 2 | quij goya | «¡Un caballo de héroe no se para!» [quijote/cansado] |
| bandido | N | 1 | quij | «¡Yo no viajo con bandidos!» [quijote/roque] |
| voz | N | 3 | quij | «(En el suelo. Una voz.)» [quijote/freston] |
| silencio | N | 6 | quij goya | «(Silencio. Es inmenso.)» [quijote/mar] |
| noticia | N | 1 | frida | «¡Noticia! El Louvre compra tu cuadro «El marco».» [frida/breton_louvre] |
| secreto | N | 5 | cole frida | «¿Sabes guardar un secreto?» [cole/alex2] |
| aventura | N | 7 | quij frida | «Señor, la venta está aquí y la aventura, lejos.» [quijote/pajaro] |
| viaje | N | 4 | cole quij frida | «Perdón. Bonita bacía. Buen viaje.» [quijote/yelmo] |
| tesoro | N | 1 | quij | «(Te ríes. Sancho es un tesoro.)» [quijote/cartamal] |
| premio | N | 1 | bot | «¡Primer premio del Salón Nacional de Artistas, en Bogotá!» [botero/salon_nacional] |
| golpe | N | 1 | quij | «Noche negra y golpes terribles.» [quijote/batanes] |
| palo | N | 1 | quij | «(Defiendes a tu caballo. Palos.)» [quijote/yeguas] |
| guerra | N | 4 | cole goya | «(¡Guerra de almohadas!)» [cole/albergue1] |
| paz | N | 1 | bot | «Soy la paloma de la paz.» [botero/paloma_paz] |
| castigo | N | 1 | quij | «(Te ríes. Castigo del cielo.)» [quijote/cerdos] |
| basta | C | 3 | cole quij frida | «Tu cuerpo dice: ¡BASTA!» [frida/death.salud.lo] |
| ¡adelante! | C | 1 | quij | «¡Adelante! ¡Al monstruo!» [quijote/batanes] |
| gratis | C | 3 | bot frida | «(Pintas de memoria. Gratis.)» [botero/mercado_frutas] |
| rápido (adj./adv.) | A | 8 | cole quij bot | «(Repasas rápido en el pasillo.)» [cole/paco2] |

**Lectura rápida.** El núcleo emocional ya existe (*hambre, miedo, cansado, triste, solo, llorar, gritar, temblar, huir, esconderse, doler, fiebre, enfermo, descansar, dormir, comer, beber*), igual que la noche y la meteorología básica (*noche, día, mañana, llueve, lluvia, viento, sol, luna, cielo, nubes, luz*) y bastante equipo (*mochila, mapa, paraguas, manta, sábana, almohada, caja, vela, libro, carta, radio, móvil, reloj, medicinas, venda*). En cambio el escenario «selva / río / tormenta / refugio / rescate» como tal **no** está: véase la sección 3. Los animales presentes son sobre todo domésticos o de la península (*perro, gato, caballo, burro, oveja, cerdo, cabra, gallina, toro*) más algunos exóticos de México y Colombia (*mono, perico, elefante, paloma, mariposa, rana/sapo, búho, murciélago, león*).

---

## 3. Palabras de supervivencia NO presentes en los mazos

Comprobado con búsqueda de subcadenas sobre todos los textos de cartas, muertes y victorias de los cinco mazos. **Ninguna** de estas palabras aparece (ni en singular ni en plural, ni en ninguna forma conjugada). Las marcadas con ⚠ aparecen solo en una forma marginal que no cubre el sentido de supervivencia.

| ámbito | palabras ausentes (a validar por el/la docente) |
|---|---|
| Entorno: selva, agua, relieve | **selva**, jungla, **bosque**, **río** (⚠ solo «me río» = reír), **lago**, cascada, **puente**, **camino** / sendero (⚠ «camino» es solo un id de carta, no texto), roca, barro / lodo, hoja, rama, raíz, semilla, coco, tierra |
| Clima y noche | **tormenta**, trueno / rayo / relámpago, **frío**, **calor**, oscuro / oscuridad, **estrella**, niebla, mojado (⚠ solo «para no mojarme»), seco (⚠ solo «el pincel se seca») |
| Necesidades y estados | **sed**, **herido/a** (⚠ solo el sust. «heridas» ×1), **perdido/a** (⚠ solo «Objetos perdidos» y «Te pierdes»), **a salvo** / salvar(se), **peligro** (sust.; sí existe «peligroso» ×1), **nervioso**, **preocupado**, **feliz**, **aburrido** (adj.; sí existe «te aburres»), enfadado, **débil**, tener suerte, tener sueño (⚠ «sueño» = *rêve* en los mazos, nunca sueño de dormir), tener frío / calor / sed |
| Refugio y equipo | **refugio**, cabaña, tienda de campaña, **fuego** / hoguera, **cuerda** (⚠ «recuerda» no cuenta), **brújula**, **linterna**, **cuchillo** / navaja, **botella**, lata, **botas**, saco de dormir, cerilla / mechero, pila |
| Rescate y comunicación | **rescate** / rescatar, **socorro**, **ayuda** (sust.; sí existe el verbo «¿me ayudas?»), **señal**, **mensaje**, **teléfono** (sí existe «móvil» ×2), **ruido**, ¡cuidado!, huella |
| Transporte | **helicóptero**, **barca** / canoa / balsa (sí existen «barco» ×2, «remos» ×1), **piloto**, **guía** (⚠ solo en el nombre de personaje «Marta, la guía del Prado») |
| Fauna de la selva | **animal** (la palabra genérica no aparece), **jaguar**, **serpiente**, **mosquito**, **araña**, **cocodrilo** / caimán, tigre, lobo, **pez** / pescar (⚠ solo «pescado» como comida), insecto / bicho, loro (sí existe «perico» ×3), tucán, hormiga |
| Acciones | **encontrar**, **nadar**, **escapar**, **construir**, **cortar**, **romper**, **trepar** (sí existe «subir al árbol»), pescar, cazar (⚠ solo «¿Me pintas cazando?»), gritar «¡socorro!», perderse (⚠ ×1 «Te pierdes»), **despertarse** (⚠ ×2 solo «despiertas»), **cuidar**, **compartir**, **proteger**, **sobrevivir** (⚠ ×1 solo en la victoria de *cole*) |
| Grupo y cooperación | **juntos**, **equipo** / grupo, compañero/a (sí existe «amigo» ×6), ayudarse |
| Orientación | **norte** / sur, **derecha** / **izquierda**, **cerca** (sí existe «lejos» ×6), **arriba** / **abajo** (⚠ «trabajo» no cuenta), despacio (sí existe «rápido» ×7), temprano |
| Cuerpo y salud | **sangre**, **veneno**, **picadura** / morder, hospital, herida (⚠ ×1), tirita / venda (sí existe «venda» ×1 en «ponte la venda», gallina ciega) |

Nota: el singular **agua** no aparece nunca; solo «a tomar las aguas» (goya/aguas) y «paraguas» (cole/viaje1). Si el nuevo juego necesita «agua», será vocabulario nuevo.

---

## 4. Estructuras A1 de narración en presente ya usadas en los mazos

Todas las cartas narran en **presente de indicativo, 2.ª persona del singular** («Pintas…», «Te escondes…»), con acotaciones entre paréntesis para las acciones del jugador. Las estructuras siguientes aparecen literalmente en los mazos y son reutilizables para un relato de supervivencia.

| estructura | ejemplos literales [id] |
|---|---|
| **X tiene Y** (tener + sust.) | «Tengo pan, queso y cebolla.» [quijote/hambre] · «Tienes dieciséis años.» [botero/salida] · «Tú tienes algo que yo no tengo.» [frida/diego_cejas] · «El rey pregunta por qué Goya tiene más oro que él.» [goya/death.dinero.hi] |
| **tener + hambre / miedo / prisa / razón** | «El leonero dice que tienen hambre.» [quijote/leon] · «Y tú, ¿me tienes miedo?» [frida/calavera_miedo] · «¡Aparta, que tengo prisa!» [quijote/encantada] |
| **X está + adj.** (estado) | «Está ocupada.» [cole/alex1] · «Mis paredes están blancas…» [goya/quinta_paredes] · «Sus figuras están gordas, señor Botero.» [botero/gordas] · «El vecino no está contento.» [goya/death.genio.hi] |
| **X está + lugar** | «tus cuadros están en la aduana» [frida/breton_aduana] · «Señor, la venta está aquí y la aventura, lejos.» [quijote/pajaro] · «Están en todos mis cuadros.» [botero/montanas_olvidar] |
| **X y Y + verbo en plural** (sujeto compuesto) | «El barbero y yo los quemamos.» [quijote/libros] · «El espejo y los pinceles esperan… pero no pintas.» [frida/death.arte.lo] · «Sin galería estamos solos en el taller, tú y yo.» [botero/contrato_alquiler] |
| **X es + adj./sust.** (ser) | «Tu habitación es un desastre.» [cole/mama3] · «Es enorme y… ¡se mueve!» [quijote/mar] · «El mundo es silencio.» [goya/enfermedad] · «Mi bocadillo es sagrado.» [cole/lucia1] |
| **Hay + sust. / No hay + sust.** | «Hay tortilla para cenar.» [cole/mama2] · «Hay patas en el cielo.» [frida/casa_xolos] · «Sin pesos no hay retrato.» [botero/circo_payaso] · «¿Hay clase?» [frida/fridos_lluvia] |
| **verbo + a + persona/animal** (OD de persona; «X encuentra a Y» no existe, pero el patrón sí) | «Atacas a Sancho: ¡crees que es un encantador!» [quijote/death.locura.hi] · «(Defiendes a tu caballo. Palos.)» [quijote/yeguas] · «Pinta a mi familia. Toda.» [goya/familia] · «(Pintas al caballo con cariño.)» [goya/caballo] · «Hasta el gato Garfio te evita.» [cole/death.amigos.lo] |
| **ya no + verbo** | «La fiebre pasa, Francisco, pero ya no oyes.» [goya/enfermedad] · «la armadura ya no cierra.» [quijote/death.fuerzas.hi] · «tus cuadros ya no pasan por la puerta del museo.» [botero/death.estilo.hi] |
| **¡Qué + sust./adj.!** | «¡Qué pena, Frida!» [frida/death.mexico.hi] · «¡Qué dolor!» [quijote/encantada] · «¡Qué humillación, señor!» [quijote/cerdos] · «Qué vergüenza.» [cole/movil] · «¡Qué perro tan guapo!» [goya/caza] · «¡Qué rica!» [frida/calavera_nombre] |
| **Presente con valor de futuro + marcador** (mañana, hoy, esta noche) | «Mañana te armo caballero… ¡y te vas!» [quijote/velar] · «Mañana pinto rascacielos.» [frida/sandia_mexico] · «¿Estudias esta noche?» [cole/pons2] · «Hoy duermes. Mañana pintas.» [frida/cama_pinceles] |
| **ir a + inf.** (futuro próximo) | «Voy a estudiar más.» [cole/mama4] · «¡Vamos a ser famosos!» [cole/alex3] · «¿Nos vas a olvidar?» [botero/montanas_olvidar] |
| **querer / poder / tener que + inf.** | «¿Qué quieres ser, sobrino?» [botero/torero] · «No puedo, tengo deberes.» [cole/mama2] · «¿Puedo repetirlo, por favor?» [cole/garcia2] · «tienes que volver a casa.» [quijote/revelacion] · «el médico me prohíbe comer.» [quijote/barataria] |
| **me duele / me gusta** (verbos tipo *gustar*) | «Me duele la pierna…» [cole/edfisica] · «a usted le duele la espalda.» [frida/fridos_lluvia] · «Goya, me gustan tus tapices.» [goya/camara] |
| **Imperativo (tú) afirmativo** (órdenes y consejos) | «Descansa, amigo.» [quijote/cansado] · «Toma tus medicinas y descansa.» [frida/doctor_fiesta] · «Quédate en casa, pintor.» [goya/dosmayo] · «Vuelve al pueblo, Alonso.» [quijote/vuelve] · «Come algo, por favor.» [goya/hambre] · «Ven, Paco, ponte la venda.» [goya/gallina] |
| **Imperativo negativo** | «No toquéis NADA.» [cole/lab] · «Y no pegues a nadie.» [quijote/velar] |
| **¡A + infinitivo!** (orden colectiva) | «¡A DORMIR!» [cole/albergue1] · «A trabajar.» [quijote/escudero] · «¡A ganar!» [cole/basket] · «Luego, todos a pintar.» [frida/fridos_fiesta] |
| **Preguntas con interrogativo** | «¿Qué pides?» [frida/salida] · «¿Quién sale a la pizarra?» [cole/garcia1] · «¿Dónde cenas hoy?» [goya/saturno] · «¿Cuándo la gobierno?» [quijote/escudero] · «¿Por qué hay carbón?» [cole/reyes] · «¿Cómo hablamos ahora?» [goya/manos] · «¿De qué color son mis paredes?» [frida/casa_quiz] |
| **Negación: no … nada / nadie / nunca / ni … ni** | «¿Y tú no comes nada?» [quijote/hambre] · «Nadie las ve… todavía.» [goya/desastres] · «Nunca sales de Medellín.» [botero/death.raices.hi] · «No sales nunca de la Casa Azul.» [frida/death.mexico.hi] · «ni visitas ni pinceles.» [frida/death.salud.lo] |
| **sin + inf. / sin + sust.** | «Sin pan, sin queso, sin dormir: te caes de Rocinante al primer trote.» [quijote/death.fuerzas.lo] · «(Pintas sin dormir.)» [goya/prisa] · «subes a un barco sin remos.» [quijote/barco] |
| **se impersonal / pasiva refleja** | «¡en casa se come bien!» [quijote/camino] · «Se vende mejor.» [botero/toro_modelo] · «¡No se corre en los pasillos!» [cole/ruiz1] · «Las ínsulas se ganan.» [quijote/escudero] |
| **Comparación: más … que / tan … que / el más … del mundo / mejor** | «Más grande que todas las lagunas de Ruidera.» [quijote/mar] · «Todo tan redondo que tus cuadros ya no pasan…» [botero/death.estilo.hi] · «la más bella del mundo» [quijote/dulcinea] · «¡Mi hermana pinta mejor!» [cole/prado2] |
| **porque / pero / si + presente / ¿y si …?** | «Porque estoy sola.» [frida/espejo_yo] · «París es bonito, sí. Pero… ¿y el ajiaco?» [botero/nostalgia_ajiaco] · «Si pierdes, un año en casa.» [quijote/blancaluna] · «¿Y si somos pastores?» [quijote/camino] |
| **Secuencia: primero… / luego / después / ahora / ya / todavía / otra vez** | «Primero, un baño. Huele a plátano.» [frida/mono_hombro] · «(Dibujas la sopa. Luego la comes.)» [goya/hambre] · «Años después, en Medellín…» [botero/promesa_plaza] · «(Pintas el cielo otra vez. Horas.)» [frida/casa_xolos] |
| **hace + tiempo + que / llevar + tiempo + sin** | «Hace tres días que no te hablo.» [quijote/sininsula] · «Hace tres días que me miras.» [goya/blanco] · «Llevo tres días sin hierba.» [quijote/cansado] |
| **Horas y momentos del día** | «Son las siete.» [cole/mama1] · «Albergue, once de la noche.» [cole/albergue1] · «a las seis de la mañana.» [frida/perico_alba] · «(Pintas con la primera luz del día.)» [frida/perico_alba] |
| **Enumeración con dos puntos** (inventario) | «Objetos perdidos: tres bufandas, un balón, un zapato… ¡y tu chaqueta!» [cole/paco3] · «Hoy la muerte es una fiesta: pan de muerto, velas, papel picado.» [frida/calavera_miedo] · «Un libro, un paraguas y un mapa.» [cole/viaje1] |
| **Acotación narrativa entre paréntesis** (2.ª persona, presente) | «(Duermes sobre la mesa.)» [cole/lluvia] · «(Te escondes detrás del libro.)» [cole/garcia1] · «(Caminas en silencio. A casa.)» [quijote/camino] |
| **Discurso directo con raya** | «El conductor: —Son dos euros, por favor.» [cole/bus] · «Un niño del mercado: —¿Usted es pintora?» [frida/mercado_nino] |
| *(más allá de A1, pero presente)* **pretérito perfecto** (18 ocurrencias, 13 en *Quijote*) | «Mi perro se ha comido mis deberes.» [cole/pablo2] · «¿Qué has hecho hoy por mí?» [quijote/dulcinea] · «¡Has sobrevivido al año escolar!» [cole/win] |
| *(más allá de A1, pero presente)* **seguir / estar + gerundio** | «¡Sigue pintando!» [frida/diego_cuadros] · «Sancho… ¿me estás engañando?» [quijote/encantada] |

---

## Apéndice A. Nombres propios (fuera de las tablas; 275 ocurrencias)

Alba, Aldonza, Alex, Alifanfarón, Alonso, Amadís, André, Antioquia, Babieca, Barataria, Barcelona, Blanca, Bogotá, Bonaparte, Bonito, Botero, Breton, Bugambilias, Burdeos, Campos, Candaya, Caprichos, Carrasco, Católicos, Cayena, Cempasúchil, Cervantes, Chang, Clavileño, Colombia, Colombiano, Corchuelo, Coyoacán, Della, Desengaño, Despacito, Diego, Dorotea, Duchamp, Dulcinea, Ebro, Elíseos, Esmeralda, España, Europa, Fernando, Fierabrás, Florencia, Francesca, Francia, Francisco, Frestón, Frida, Fridos, Fulang, Gaiferos, García, Garfio, Goya, Gringolandia, Guayana, Guinart, Halloween, Inquisición, Isidro, Italia, Jacques, José, Kahlo, Legos, Lisa, Lorenzo, Louvre, Lucía, Luna, Madrid, Madroño, Maese, Mambrino, Mancha, Marcel, Mbappé, Medellín, Meninas, México, Micomicona, Moma, Mona, Montesinos, Nueva, Osuna, Pablo, Paco, Pancino, Panza, París, Pedro, Pentapolín, Picasso, Piero, Pons, Prado, Puerta, Quijano, Quijote, Quijotiz, Quinta, Reyes, Rivera, Rocinante, Roque, Ruidera, Ruiz, Salamanca, Salomón, San, Sancho, Sansón, Saturno, Sol, Tehuana, Toboso, Velázquez, Vera, Yangüeses, York.

*Nota:* «Nueva» (Nueva York), «Bonito» (el perico), «Blanca Luna», «Puerta del Sol», «Prado», «Reyes Católicos», «Quinta del Sordo» y «San Isidro» se han contado como nombres propios en las ocurrencias correspondientes; las ocurrencias comunes de *nuevo, bonito, blanco, luna, sol, puerta, prado, rey* figuran en las tablas.

## Apéndice B. Onomatopeyas, palabras francesas y fragmentos (fuera de las tablas; 43 ocurrencias)

miau, guau, oink, beee, pum, clac, tic, tac, uhú, grrrr, psst, hmm, mmm, oh, bonjour, merci, salut, bye, monsieur, sandwich, dormez, vous, correspondant, au, lait, l, fr, re, lef, vre, biblioth, cross, bocadillou. (*l, fr, re, lef, vre, biblioth* son fragmentos de «Lefèvre», «Frère», «bibliothèque» producidos por la segmentación; *bocadillou* es el chiste de cole/lefevre1; *cross* aparece en «cross de cinco kilómetros».)

## Apéndice C. Palabras vistas solo en nombres de personaje, eslóganes o paliers (no contadas)

academia (bot), aprendiz (goya), bibliotecaria (cole), capítulos (quij), carlos (goya), carmen (cole), conserje (cole), crítico (bot), doña (cole), esquina (cole), galerista (bot), guía (cole), hugo (cole), inquisidor (goya), iv (goya), kiosco (cole), lechera (goya), luisa (goya), majos (goya), marta (cole), maría (goya), niña (bot), pesadillas (goya), sobrevive (cole, quij, goya, bot, frida), soldado (goya), ventero (quij), vii (goya).
