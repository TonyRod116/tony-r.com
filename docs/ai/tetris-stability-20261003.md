# Cristal, miniaturas y reinicio de T-Tris — 2026-10-03

Publicado y comprobado en [T-Tris](https://tony-r.com/ai/tetris). La preferencia final de Tony es que IA apagada oculte todas las miniaturas y que IA encendida muestre «Al soltar» y «Propuesta de la IA». La continuación sigue en su desplegable opcional.

Cristal sirve durante las tres piezas siguientes. El contador visible utiliza la misma constante que la física: 3 → 2 → 1; las líneas de la tercera colocación se resuelven antes de romper los bloques restantes. La pausa conserva su vida. La IA simula esta duración con la misma transacción pura y mantiene su horizonte real: una pieza conocida normalmente, dos cuando hay especiales o caducidad.

Durante una reacción, «Al soltar» utiliza el resultado final de la jugada ejecutada. La propuesta y su continuación utilizan los datos anteriores a la jugada, guardados en la resolución: tablero, pieza, turno, efecto de la T y las dos piezas conocidas. Estos datos permanecen inmutables durante perforación, disolución, parpadeo y rotura; el reinicio los descarta. Se conserva una propuesta real durante la animación y se calcula la siguiente al confirmar la colocación. La continuación presenta las piezas efectivamente buscadas, manteniendo su desplegable durante cambios entre una y dos.

Se reserva una línea para el mensaje de reacción. Esto evita que la rotura del Cristal o la disolución de la T empujen el panel inferior en móvil. La capa de fin de partida queda por encima de todas las piezas, incluyendo los bloques luminosos de la T; el botón recibe los clics en toda su superficie.

Regresiones reproducidas antes de corregirlas: la miniatura de la IA pasaba de cuatro bloques coloreados a ninguno durante una limpieza; varias zonas del botón de reinicio quedaban cubiertas por las T; el mensaje de rotura desplazaba el panel móvil 36,796875 px. Las pruebas nuevas verifican los resultados reales, el orden de las capas y las posiciones del documento. El helper de capturas se corrige para distinguir scroll automático de movimiento del layout.

Validación final observada:

- Build aislado y `npm run check`: 79 pruebas, 24 casos de routing y 27 skills sincronizadas; deuda previa de lint/diseño sin aumentos.
- 37 recorridos de interfaz pasan; una prueba exclusiva de teclado de ordenador se omite deliberadamente en móvil. Incluyen duración, contador inicial, pausa, reinicio, simulación/IA, ocultación de todas las miniaturas y conservación de los colores durante líneas.
- 10 comparaciones visuales pasan. Se inspeccionan las cuatro referencias cambiadas de T-Tris; las referencias del laboratorio, la red neuronal y especiales en escritorio permanecen intactas.
- 20 casos del preview y 20 online: Cristal y limpieza de líneas con IA off/on en ES/EN/CA y ambos tamaños; fin de partida con T mágicas en español en ambos tamaños. Los 12 casos de líneas miden 0 px de desplazamiento de la cola; la rotura comprueba una tolerancia inferior a 0,1 px. El reinicio supera 15 comprobaciones de superficie por tamaño y funciona al pulsarlo. No hay desbordamiento ni errores de página en los casos verificados.
- 74 archivos originales protegidos conservan sus hashes. Matemáticas y pesos neuronales, otras demos, API, servidor y cambios personales/generados previos permanecen intactos.

El HTML online coincide con el build final. Las versiones anteriores tienen recuperación verificada; ubicaciones de servidor, scripts y capturas permanecen en artefactos privados. No se cambian ajustes de alojamiento, dependencias ni servicios externos. Evidencia: `tetris-stability-20261003.json`; operación: `.artifacts/tetris-stability-final-20261003/`.
