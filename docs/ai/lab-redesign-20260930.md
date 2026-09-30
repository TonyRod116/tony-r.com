# Laboratorio de IA — rediseño y reparación

Fecha: 2026-09-30. Trabajo autorizado: portada /ai y las seis demos; red neuronal y T-Tris funcionales. Cambios locales, sin publicación.

## Decisión y resultado

Portada de laboratorio con fondo carbón verdoso, tipografía grande, red vectorial y una selección de experimentos sobre papel cálido. Todas las demos comparten título, pestañas, escenario, explicación y siguiente experimento. Tokens: src/components/ai/AiLab.css. Metadatos/copy ES/EN/CA: src/data/aiExperiments.js. Evitar partículas, glass y métricas decorativas.

La vista de red utiliza coordenadas en tres dimensiones proyectadas a SVG: se gira con ratón/dedo o con controles de teclado y admite zoom. Muestra los nodos reales y una selección de conexiones fuertes. No necesita WebGL, Three.js ni un CDN. La portada usa un esquema etiquetado; las activaciones de la demo salen del modelo cargado.

## Fallos encontrados y correcciones

- T-Tris: conversión de offsets inconsistente entre juego, IA y preview. Reproducción guardada en /tmp/my-page-ai-source-before/tetris-repro.json: la T mágica mostraba cero celdas de las cinco. Ahora todas las rutas usan pares fila/columna explícitos y las mismas reglas puras en tetrisEngine.js. Rotación con ajustes de pared, caída, techo, limpieza y T mágica tienen pruebas. La IA busca posiciones alcanzables y anticipa la siguiente pieza con búsqueda acotada; no se presenta como óptima.
- Timers de T-Tris: varias animaciones pendientes podían continuar tras reset y el tratamiento de pausa difería entre IA y manual. El estado se reduce de forma atómica; solo hay un reloj de gravedad cancelable. Pausa detiene ambas rutas y salir a otra pestaña pausa. Música opcional, fantasma, siguiente pieza, T mágica y registros existentes se conservan. Atajos en el tablero enfocado evitan interceptar controles ajenos.
- Red neuronal: la ruta salía a un HTML independiente con imports de CDN y pesos remotos. La implementación React anterior también ofrecía resultados con pesos aleatorios si fallaba la descarga. La ruta activa ahora permanece en React y valida los pesos locales antes de predecir; falla con reintento. La URL HTML antigua conserva los enlaces mediante redirección.
- Dibujo: el componente anterior mezclaba eventos touch y mouse con referencias inconsistentes y no convertía coordenadas al escalar el canvas. Pointer Events/captura de puntero y escala explícita permiten dibujar y borrar con ratón/dedo. Ejemplos accesibles por teclado y resultado vacío sin predicción.
- Tres en raya: bloqueo del turno de la IA y cancelación de respuestas pendientes al reiniciar.
- Buscaminas: banderas por botones para móvil, casillas etiquetadas, tablero adaptable y disponibilidad de deducción calculada del estado actual. Al perder se muestran las minas. La IA de esta interfaz solo aplica deducciones seguras; no promete resolver toda partida.
- Nim: entrenamiento local real de 100 partidas en el rival inicial y 10.000 en el experto; cancelación de respuestas al reiniciar y de trabajo al salir. Se corrige en ES/EN/CA la regla: tomar la última pieza pierde. No se afirma estrategia perfecta ni mejora de tasa de victoria.
- Seis grados: usa el idioma del sitio, nombres sugeridos, ejemplos, búsqueda con espacios recortados, cancelación y errores comprensibles. El anterior grafo incluía relaciones de reparto incorrectas; se sustituye por diez actores y cuatro películas comprobadas. El conjunto sigue siendo parcial, con fuentes enlazadas en cada resultado; los activos antiguos se conservan.

## Modelo y fuentes

Pesos sin modificar de [DFin / Neural-Network-Visualisation](https://github.com/DFin/Neural-Network-Visualisation), checkpoint 014_dataset-1x, float16, arquitectura 784→128→64→10. Licencia Apache-2.0 y NOTICE originales en public/models/mnist/. Normalización 0.1307/0.3081 comprobada en training/mlp_train.py. Inferencia local, sin entrenamiento nuevo, precisión inventada o probabilidades sobre dibujo vacío. El dibujo de ejemplo no constituye evaluación de precisión.

El origen se consultó con el flujo de agent-reach. GitHub CLI falló por conexión; lectura web y descargas públicas acotadas completaron la comprobación. No se ejecutó código descargado. Pointer capture: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture).

Fuentes del conjunto de actores: [Apollo 13 / Cannes](https://www.festival-cannes.com/f/apollo-13/), [Forrest Gump / Paramount](https://www.paramountpictures.com/movies/forrest-gump), [A Few Good Men / Sony](https://www.sonypictures.com/movies/afewgoodmen), [Cast Away / Amblin](https://amblin.com/movie/cast-away/). Hechos de reparto y títulos, sin copiar sinopsis.

## Comprobación local

Build aislado: npm run build -- --outDir .artifacts/build. npm run check: 34 pruebas de cálculos/herramientas y 24 casos de routing; sin deuda nueva de lint o diseño. Suite completa de navegador: 106 recorridos pasan. ES/EN/CA, ratón/touch, teclado, carga fallida y reintento, reglas T, pause/reset, entrenamiento y caminos de grafos incluidos. Tras el último pulido de textos, las 34 pruebas específicas de IA pasan en una ejecución secuencial. Una ejecución previa falló al cargar un chunk por ERR_NETWORK_CHANGED; la traza distingue ese fallo de transporte del comportamiento de las banderas.

Capturas finales de las siete rutas en 1440×900, 390×844 y 768×1024: .artifacts/ai-lab-preview/. Medidas registradas sin overflow ni errores de ejecución en esos recorridos. Nuevas referencias visuales de portada, red y T-Tris; las de home/proyectos/contacto se conservan. Resultado final de comparaciones: ver lab-redesign-20260930.json.

Se excluyen de evidencia un fallo transitorio ERR_NETWORK_CHANGED de Chromium, un error de captura al ejecutar dos navegadores a la vez y dos builds solapados. La suite completa pasó en una ejecución posterior aislada y el build final terminó antes de iniciar sus consumidores. No se renovaron baselines de calidad para ocultar fallos.

## Límites

Prueba local de UI y reglas, sin auditoría independiente completada de otro modelo en este encargo. Se intenta una consulta visual compacta con Sonnet 5.5 High, siguiendo la preferencia de Tony: el runner canónico comprueba claude.ai/firstParty/Max, solicita el modelo exacto con High, pero el CLI falla sin respuesta utilizable ni attestation de modelo. Un intento, sin retry/fallback/facturación API. Recibo temporal: /tmp/my-page-ai-sonnet-design-20260930/receipt.json. No se atribuyen recomendaciones o aprobación al helper. No certifica rendimiento predictivo MNIST, latencia de producción, hosting/middleware externo ni impacto comercial. No se modifican API, server, credenciales, despliegue ni activos dist preexistentes. El trabajo previo de T-Tris se guarda antes de adaptar sus mecanismos; los cambios de Tetris están dentro del encargo explícito. No se publica el contexto estratégico privado de Tony.
