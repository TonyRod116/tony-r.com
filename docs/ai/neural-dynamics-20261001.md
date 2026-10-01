# Cálculos animados y destello de líneas — 2026-10-01

Tony autoriza añadir y publicar el blink de líneas en T-Tris, una animación neuronal fiel con backpropagation y los diez ejemplos en una sola fila.

## Cálculo y representación neuronal

El MLP conserva el artefacto preentrenado y su normalización. La pasada inicial produce una traza de entradas normalizadas, sumas antes de ReLU, activaciones, logits y probabilidades. Los enlaces visibles muestran contribuciones `w × entrada`, incluido el valor normalizado del primer nivel. Los enlaces de neuronas ocultas inactivas aportan cero al siguiente nivel.

El paso de entrenamiento calcula entropía cruzada sobre logits con log-sum-exp estable, delta de salida `p − oneHot(y)`, transpuestas y máscaras de ReLU, gradientes de pesos/sesgos y sensibilidad de píxeles, incluida la división por la desviación de normalización. Una actualización SGD con tasa0.001 se aplica a una copia local; se vuelve a calcular su predicción y pérdida. La copia no cambia el modelo base, el archivo público ni su último resultado de inferencia.

La animación es una reproducción lenta de cálculos ya realizados, no una medición de tiempo de proceso ni señales eléctricas. En inferencia anima contribuciones; hacia atrás, contribuciones al gradiente; durante la actualización, cambios reales de parámetros. Las conexiones mostradas son una selección; la matemática utiliza la matriz completa. Intensidad relativa y signo se declaran en la interfaz. Hay pausa, pasos manuales, terminación y cancelación al cambiar dibujo u objetivo; cada reproducción tiene identidad propia. Movimiento reducido evita el desplazamiento de trazos. Ejemplos0–9 comparten una única fila.

Las ecuaciones se contrastan con las referencias oficiales de [autograd y regla de la cadena](https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html) y [entropía cruzada sobre logits/SGD](https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html). Es referencia matemática: el navegador ejecuta JavaScript local, no instala ni ejecuta PyTorch. Las derivadas se verifican además con diferencias centrales independientes, cubriendo pesos, sesgos, entrada normalizada y ReLU inactiva. Estos checks no son una evaluación de precisión MNIST ni de mejora general por entrenar con un dibujo.

## T-Tris

Las filas completas se conservan320ms para iluminarlas antes de retirarlas. Puntuación, líneas y siguiente pieza se confirman una vez al terminar la fase. Pausa detiene la terminación; reinicio y callbacks antiguos no pueden confirmar otro borrado. La T mágica termina su caída de arena antes del blink. IA y juego manual comparten el mismo resultado final. Con movimiento reducido se ofrece una señal fija breve.

## Evidencia y publicación

Resultados definitivos y estado online en el JSON compañero. Se verifica source/modelo, controles, filas, animación CSS real y tamaños de pantalla. QA bloquea envíos y generaciones remotas. Los originales del modelo, documentos, API/server, settings personales y dist previo quedan preservados. Publicación en el dominio existente con respaldo privado, sin divulgar ubicaciones operativas del alojamiento en el repo público.

La publicación se confirma en IONOS: el HTML del dominio coincide con el build por SHA-256. Los dos experimentos pasan en móvil/escritorio online: diez ejemplos en una fila,986nodos, forward/backprop, pérdida real y restauración del original; T-Tris ilumina dos filas, permite pausa y termina con la puntuación correcta. No se consumen generaciones remotas.
