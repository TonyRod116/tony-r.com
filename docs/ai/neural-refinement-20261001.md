# Selector único y significado de backpropagation — 2026-10-01

Tony pide quitar Número correcto/desplegable, quitar el botón de entrenamiento, reducir aproximadamente20–30% la salida y comprobar por qué la entrada no parece el dibujo en backpropagation.

Los diez botones eligen el ejemplo y su etiqueta; al limpiar se conserva esa selección para un dibujo manual. El recorrido opcional solo reproduce la inferencia y los controles de capas/sentido/pausa/encendido siguen independientes. Desaparecen el CTA de entrenamiento, su bloque, la vista de parámetros actualizados y la comparación vacía de pérdidas. Backpropagation y su pérdida real permanecen. No se modifica el predictor, sus pesos, la cámara aprobada, T-Tris o los recortes de BuildApp.

La salida3D conserva sus diez nodos en una columna; espaciamiento, plano, radios y etiquetas se reducen25%. La altura entre nodos extremos pasa de234 a175.5 unidades del gráfico.

La entrada anterior mostraba `∂L/∂x`: sensibilidad de la pérdida a cada píxel. Es un mapa de derivadas, no una reconstrucción del número, y no tiene por qué parecerse al dibujo. La representación predeterminada conserva ahora los píxeles originales en ambos sentidos. El inspector permite activar explícitamente su sensibilidad real; valores, signo, etiquetas y métricas corresponden a la cantidad mostrada. Las capas ocultas y salida muestran sus gradientes en el modo hacia atrás; los enlaces mantienen sus aportaciones calculadas. Se explica esta distinción en ES/EN/CA.

## Evidencia matemática

Se mantiene networkMath.js/mlp.js sin cambios. Además de las47 diferencias centrales del caso pequeño anterior, se contrastan62 derivadas del artefacto MNIST real: pesos y sesgos de sus tres matrices y píxeles crudos, incluyendo el factor de normalización. Se usa un trazo sintético y dos etiquetas (7 y2), casos activos e inactivos de ReLU y40 gradientes no nulos. La pérdida de referencia se calcula por `−log p(y)` tras perturbar cada valor; no usa el gradiente ni la actualización analítica para obtener la derivada numérica. Máximo error absoluto4.123795749322312e-11, frente a tolerancia3e-7. Las comparaciones restauran los parámetros y comprueban que siguen idénticos. Esto respalda los cálculos locales probados, no mide precisión general de MNIST ni demuestra todos los casos posibles de entrada.

Prueba: tests/tooling/neural-dynamics.test.mjs. La UX se verifica con selector único, dibujo manual con etiqueta conservada, comparación pixel a pixel entre sentidos y coincidencia de la sensibilidad con los gradientes de entrada. En QA se centra el lienzo antes de dibujar para que la cabecera fija no intercepte el puntero. Resultados finales, capturas inspeccionadas, hashes y publicación están en el JSON compañero.

## Publicación

IONOS es el destino autorizado; se conserva un respaldo privado, se activan assets antes del HTML y se verifica el dominio sin envíos o generaciones remotas. El modelo original y archivos personales/protegidos se preservan. La exportación a GitHub público sigue pendiente de confirmación específica, sin otro push. Datos de conexión/recuperación permanecen en artefactos privados.

Publicado y verificado en IONOS: los dos tamaños online pasan selector/controles eliminados, escala0.75, conservación exacta de píxeles al cambiar sentido, sensibilidad real y derivadas de salida. HTML/modelo públicos coinciden con build/original por SHA-256.54 tests de código,24 comparaciones visuales y18 recorridos únicos afectados están verificados; el caso de dibujo manual se reevalúa en ambos tamaños tras centrar el lienzo fuera de la cabecera. Solo se actualizan las dos referencias neuronales, después de inspeccionar imágenes en1440/390/768px y ES/EN/CA. Matemática/modelo/juegos, los cuatro PNG de BuildApp y74 archivos originales/protegidos quedan intactos.
