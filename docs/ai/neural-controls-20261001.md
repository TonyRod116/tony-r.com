# Etapas de la red y fila de salida — 2026-10-01

Tony aclara que la fila única corresponde a los diez nodos de salida, no al selector de ejemplos. También pide acceso directo a cada etapa o todas, ida/backpropagation, pausa y encendido independientes, y un único bloque de ejemplos. Este cambio sucede al recorrido anterior documentado en neural-dynamics-20261001.md/json; conserva su matemática y el blink de T-Tris.

## Comportamiento

La salida0–9 se ordena horizontalmente bajo las tres primeras capas, sin cambiar sus índices, pesos o probabilidades. La fila permanece dentro del gráfico al máximo zoom. El lienzo conserva un único selector0–9 en dos filas y la orientación aprobada.

Las cajas Entrada, Capa oculta1, Capa oculta2, Salida y Todas seleccionan directamente qué cálculo inspeccionar. Hacia delante muestra aportaciones reales; backpropagation muestra los gradientes correspondientes al dibujo y al número correcto elegido. La salida hacia atrás muestra exactamente `p − oneHot(y)`. Todas presenta simultáneamente los enlaces seleccionados de una traza ya calculada; el texto aclara que las capas se computan en orden.

Encendido y pausa son estados independientes. Apagar retira los trazos móviles conservando la vista estática y los valores; pausar congela el movimiento sin ocultar los enlaces. Cambiar etapa/sentido/dibujo/etiqueta conserva ambos estados. Seleccionar una etapa durante el recorrido guiado lo cancela y mantiene la pausa. Inspeccionar un nodo pausa; restablecer cámara conserva selección y movimiento. El recorrido opcional de entrenamiento conserva los pasos manuales, actualización SGD y evaluación de la copia local. El predictor original no se modifica.

## Verificación

Checks definitivos y estado online en el JSON compañero. Pruebas de navegador verifican los controles en escritorio/móvil, las derivadas de salida frente a probabilidades y etiquetas, aportaciones reales, aislamiento del modelo, cancelación de timers, una sola fila de salida y un solo selector. Se inspeccionan capturas de1440,390 y768px, textos ES/EN/CA y movimiento reducido. Se observan frames CSS reales en ambos sentidos y congelados al pausar. Las referencias visuales solo cambian para la página neuronal tras inspección.

La animación usa los cálculos previamente verificados con47 diferencias centrales independientes; no se cambia networkMath.js, el artefacto MNIST ni T-Tris. Se mantienen los límites: selección de conexiones, tiempo didáctico y entrenamiento en copia con un ejemplo, sin afirmar una mejora de precisión general.

## Publicación y alcance

La actualización se publica únicamente en el alojamiento IONOS ya autorizado, con respaldo privado y comprobación de HTML/modelo e interacciones del dominio. Se bloquean envíos de formularios y generaciones remotas durante QA. Los originales de API/server/modelo/documentos y los cambios personales previos quedan preservados. Las ubicaciones de operación y recuperación permanecen en artefactos privados.

El envío de fuentes a GitHub público queda pendiente de la confirmación específica ya solicitada tras el rechazo automático del push anterior. Una publicación web no se presenta como un push de fuentes; no se intenta otro mecanismo para eludir ese bloqueo.

Publicado y verificado en IONOS: cuatro comprobaciones directas (red neuronal y T-Tris, escritorio/móvil) pasan. El HTML público coincide por SHA-256 con el build y el modelo público conserva su hash original. Los53 tests de código,22 recorridos de navegador afectados y24 comparaciones visuales pasan; se inspeccionan ES/EN/CA y tres tamaños de pantalla. Las74 fuentes/archivos personales protegidos coinciden con el estado anterior. Solo se sustituyen las dos referencias visuales neuronales.
