# Voces españolas de Cuéntalo

El juego incluye 128 grabaciones MP3 generadas con voces de síntesis de Microsoft Edge Neural TTS: 48 réplicas (24 diálogos), 48 consignas Fácil/Normal, 24 fragmentos narrativos, cuatro introducciones y cuatro resúmenes. Los textos de los diálogos son inventados para el juego; no son citas ni grabaciones de los personajes históricos. Véase también [DIALOGOS.md](DIALOGOS.md).

| Aventura | Voz principal y narración | Segunda voz |
| --- | --- | --- |
| Don Quijote | es-ES-AlvaroNeural | Alvaro, tono −8 Hz y velocidad −2 % |
| Macondo | es-CO-SalomeNeural | Salome, tono +3 Hz |
| Borges | es-AR-TomasNeural | es-AR-ElenaNeural |
| Frida | es-MX-DaliaNeural | es-MX-JorgeNeural |

Los diálogos se generan a −4 % de velocidad salvo Sancho; las consignas y narraciones a −6 %. La variante regional del proveedor no pretende reproducir la voz real de una persona ni todas las variedades de un país. No se ha realizado una evaluación auditiva humana de las 128 grabaciones.

Fuentes técnicas: [voces y variantes de Microsoft](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts) y [edge-tts](https://github.com/rany2/edge-tts).

## Funcionamiento

`src/exploration-audio-catalog.js` produce el catálogo a partir de las misiones, relatos y diálogos. `src/audio/exploration/manifest.json` conserva texto, voz, velocidad, tono, duración y SHA-256 de cada MP3. El build valida estos datos y los incorpora como URL `data:` a `cuentalo.html`. La lectura del juego no realiza solicitudes de red ni depende de las voces instaladas en el dispositivo. El antiguo taller conserva su implementación propia.

Después de una nueva misión se oyen las dos réplicas y se muestra el resumen. La repetición, el silencio y el botón para continuar siempre están disponibles. Cambiar de escena, abrir la ayuda o esconder la página detiene el audio. Reanudar una misión guardada no inicia una lectura automática. Si el navegador bloquea el inicio automático, se puede pulsar Repetir; los subtítulos permiten continuar igualmente.

El botón **Plus lent** vuelve a reproducir las dos réplicas al 80 % de la velocidad normal. Se mantienen las mismas grabaciones y se activa la conservación del tono en los navegadores compatibles (`preservesPitch` o su variante con prefijo). **Diálogo / Repetir** vuelve a la velocidad normal; las consignas y los relatos también conservan su velocidad original. Véase la [documentación de preservesPitch](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/preservesPitch).

**Traduction** muestra u oculta la traducción francesa debajo de cada réplica, sin interrumpir la escucha. Las 48 traducciones se encuentran en `src/exploration-translations.js`. Se ocultan al entrar en otra escena. Si el alumno las muestra, el diálogo permanece visible al terminar el audio para que pueda leerlo a su ritmo.

## Regeneración

Se necesitan Node y Python con `edge-tts==7.3.1`, `soundfile` y `numpy` instalados en un entorno de desarrollo. Estas dependencias no se distribuyen con el juego. La generación utiliza el servicio en línea de Edge y necesita acceso a la red; conserva las grabaciones válidas cuya configuración no haya cambiado.

```sh
python scripts/generate-exploration-audio.py --jobs 2 --retries 2
python scripts/generate-exploration-audio.py --verify-only
node build.js
node test/exploration-audio-assets.js --html
node test/exploration-audio.js
node test/exploration-dialogues.js
```

El verificador decodifica cada archivo y rechaza audio vacío, silencioso, no finito o incoherente con el manifiesto. Las 128 grabaciones también se validaron con FFmpeg en modo estricto (`-xerror -err_detect explode`), sin errores. Las pruebas del lector cubren secuencias, interrupciones, eventos y promesas obsoletos, modo silencioso y bloqueo del inicio automático.
