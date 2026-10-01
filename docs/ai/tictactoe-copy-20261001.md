# Tres en raya: cifra y garantía — 2026-10-01

La página recupera un mensaje destacado: **255.168 partidas legales posibles** y **«En difícil no puedes ganarle. Si juegas sin errores, conseguirás un empate.»**. El modo actual aparece explícito; al cambiar a fácil, el reto explica que sí se puede ganar. Se conserva la procedencia Python/CS50 AI/JavaScript del texto anterior y se describe búsqueda Minimax desde el tablero actual, evitando presentarla como entrenamiento o afirmar que vuelve a recorrer las255.168 partidas completas en cada turno.

Una enumeración independiente del tablero plano cuenta255.168 partidas completas:131.184 victorias de X,77.904 de O y46.080 empates. X empieza y la partida termina en la primera victoria o al llenarse el tablero; el orden de las jugadas y sus rotaciones/reflejos cuentan por separado. Son secuencias de partidas, no posiciones únicas ni muestras de entrenamiento.

La prueba carga sin alterar las definiciones puras del Minimax de producción en un entorno aislado y recorre todas las continuaciones legales del humano contra su política real de O desde un tablero vacío:936 decisiones de IA,498 victorias de O,183 empates y**0 victorias humanas**. El bloque del algoritmo mantiene su hash; solo cambian copy/markup/CSS. El cambio de dificultad ya reinicia la partida y cancela la respuesta pendiente.

Se verifican formato numérico y contexto de ambos modos en ES/EN/CA y tres tamaños, sin overflow. Los dos casos de turnos/reinicio existentes pasan. Build/check conservan58 pruebas de cálculos/tooling. Prueba y publicación: JSON compañero.
