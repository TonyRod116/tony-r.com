# Verificación de la adaptación — 2026-09-30

## Resultado observado

Todas las recomendaciones de `adoption.md` tienen su implementación local o workflow acotado. Se han instalado 27 skills canónicas con espejos Claude; no se han copiado arquitectura móvil, trading, credenciales ni runners externos. La instalación y sus comprobaciones permanecen en el working tree, sin publicación.

| Comprobación | Resultado |
|---|---|
| Instrucciones raíz y espejos de skills | Sin diferencias; 27 skills también aceptadas por quick_validate de skill-creator |
| Salud de memoria | READY; sin ausencias/conflictos conocidos, con comprobación específica del endpoint de chat |
| Routing local | 24 casos deterministas pasan; autoridad original preservada |
| Tooling | 23 tests pasan: contexto, antigüedad, límites, symlinks/secretos, contratos, outcomes, loops, diseño, build y telemetría |
| Lint y diseño | Sin aumentos sobre deuda documentada; no se afirma ausencia completa de deuda |
| Build | Correcto en `.artifacts/build`, incluida la copia compatible de `/demos/index.html` |
| Navegador | 52 recorridos pasan en Chromium con escritorio y emulación móvil, ES/EN/CA, navegación/teclado/touch, contacto/chat simulado, CV y fallo de descarga de ruta |
| Referencias visuales | Seis imágenes iniciales abiertas e inspeccionadas; comparación posterior de las seis pasa sin actualizarlas |
| Router global y hook | Selector devuelve plan local; SessionStart emite JSON válido y fuera del checkout no inyecta contexto |
| Dependencias y CI | Contratos package.json/lockfile coinciden; workflow YAML validado. GitHub Actions no se ha ejecutado/publicado |
| Trabajo previo | Hashes de Tetris, traducciones, Resume, ajustes locales y los paths iniciales de dist coinciden; Beads añade solo bookkeeping de este encargo |

## Cambio de carga

Comparación con el build inspeccionado antes de esta instalación: entrada JavaScript **788.176 → 496.573 bytes**, una reducción del **37,0 %**. El total de JavaScript emitido es **788.176 → 799.296 bytes**: el beneficio es cargar rutas/demos cuando hacen falta, no reducir todos los bytes del producto. No es una medida de Core Web Vitals, tráfico, cuota o ahorro por tarea.

Una página cuya descarga falla mantiene el menú y ofrece recarga; otra navegación permite recuperar el recorrido. Los errores se registran de forma acotada, sin raw mensajes o cuerpos. Se han retirado logs de chat que incluían respuesta/estado/contacto.

## Evidencia adversa y correcciones

- Las primeras pruebas de memoria reproducen lectura por symlink hacia un secreto del propio repo y drift de endpoint documentado; ambos casos se rechazan después de corregir los guards.
- El caso de descarga de ruta falló antes de añadir el límite de recuperación de React y pasa después; también comprueba navegación sin recargar todo el documento.
- El entorno bloquea puertos y captura de pipes; QA usa autorización técnica solo para localhost/Chromium. El router reutiliza la política global con FD temporal; ESLint usa su API existente. No hay cambio de proveedor.
- La caché no tenía el Chromium requerido por Playwright 1.59.1; se descargó v1217 en `/tmp/my-page-playwright-browsers`, sin instalar otra dependencia del proyecto.
- Dos tests asumían que Tetris tenía un h1/h2/canvas; captura y DOM demostraron su logo y controles HTML. Se cambió la comprobación, conservando el juego.
- Una ejecución se solapó con un build aún activo y queda excluida. La ejecución final usa el build terminado y pasa completa. No se han aceptado snapshots para ocultar regresiones.

## Límites y continuidad

QA bloquea destinos externos y simula BuildApp/IA/Formspree. No demuestra disponibilidad, CORS o persistencia externos ni calidad de una respuesta de IA. La monitorización remota de errores necesita destino propio; Sentry no está activado. No se han ejecutado revisores externos, anuncios, cron, deploy, push o pagos. La evaluación independiente de respuestas de cada cliente queda separada de los tests deterministas.

Las referencias visuales comparan composición con canvas decorativo y movimiento excluidos; son viewport, no una auditoría exhaustiva de toda la página. CI captura imágenes como artefacto porque el sistema operativo/font de su runner puede diferir; las comparaciones locales requieren el mismo navegador/sistema.

Registro inmutable de esta observación: `verification-20260930.json`. Bead de instalación: `My Page-86`; siguiente trabajo de rediseño y deuda: `My Page-87`. Canon y operación: `operating-system.md`; inventario completo: `adoption.md`.
