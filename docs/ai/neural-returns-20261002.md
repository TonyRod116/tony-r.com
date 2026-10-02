# Conexiones de vuelta desde las neuronas — 2026-10-02

Tony pide recuperar el primer recorrido visual de backpropagation: conexiones desde los nodos de la primera capa oculta hacia los píxeles de entrada, sin concentrarlas en un operador de suma. También pide retirar «Código y referencias» de esta página.

Se recupera la selección original de dos pesos fuertes por neurona: 256 enlaces con 128 orígenes reales. Cada enlace transporta su propia aportación `W[j,i] · δ[j] / std`. Las neuronas bloqueadas por ReLU aportan cero y no generan pulsos. Los 784 píxeles conservan su gradiente completo, calculado con las 128 aportaciones; la selección visible de enlaces no sustituye esa suma. El texto ES/EN/CA explica esta diferencia. El color de un enlace individual puede diferir del de su celda, porque representa una aportación y la celda representa el total.

Las conexiones usan las posiciones de los nodos de la misma cámara. Se conservan la orientación aprobada, la columna de salida al 75%, los controles de etapa/sentido/pausa/encendido, el movimiento reducido, el inspector y el resaltado de llegada de valores ya calculados. El dibujo original, los pesos y las ecuaciones no cambian.

Solo se elimina la propiedad opcional `source` del experimento neuronal. Los enlaces de otros experimentos y la procedencia/licencia original de los pesos MNIST permanecen intactos.

La prueba nueva falla sobre la versión anterior, que tiene 784 rutas desde el operador único. Tras el cambio verifica 128 orígenes distintos, extremos en los nodos reales, las 256 aportaciones contra el tensor Float16 decodificado de forma independiente y el gradiente completo de cada celda. También comprueba pausa, apagado, ReLU y movimiento reducido. Las 63 pruebas de cálculos/herramientas, 24 pruebas de interfaz y cuatro comparaciones visuales del laboratorio/red neuronal pasan. Solo se actualizan las dos referencias neuronales, después de inspeccionar la retirada del enlace y el desplazamiento del pie.

Publicado y verificado en IONOS: seis casos de idioma y tamaño pasan, con las conexiones, los controles y el enlace retirado. HTML y modelo coinciden con los hashes esperados. La primera ejecución online tuvo un timeout al esperar el modelo en inglés, después de pasar español; no capturó el estado concreto de esa carga. El modelo público respondió 200 con el hash original y el inglés pasó después por separado en ambos tamaños. La ejecución final completa pasó los seis casos; la causa inicial no se ha reproducido ni se atribuye a un fallo corregido. Se conserva el reintento explícito existente.

La copia de recuperación y las rutas operativas se guardan fuera del contenido público. No se alteran APIs, ajustes de alojamiento, activos originales ni cambios previos de Tony. No se realiza ningún push a GitHub. Los hashes y resultados están en el JSON compañero.
