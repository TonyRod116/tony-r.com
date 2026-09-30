# Publicación del showroom — 2026-09-30

Tony autoriza publicar todos los cambios completados. El dominio principal es https://tony-r.com y se sirve desde IONOS, no desde el antiguo Hostinger. Se confirma el sitio de destino comparando el SHA-256 del HTML remoto y el descargado del dominio antes de publicar. La integración histórica de GitHub con Vercel sigue activa para `tony-rcomvercel.vercel.app`; no se cambian DNS, secretos ni configuraciones del proveedor.

## Artefacto y recuperación

`npm run build -- --outDir .artifacts/build` genera la versión actual desde el código fuente. El HTML publicado tiene SHA-256 `394eef9b949a1180752f79d95d2c33d003a2fe264104356ac942614704fc53ee`, confirmado por HTTPS tras activarlo.

La copia anterior y los artefactos preparados permanecen privados en el alojamiento. Las ubicaciones y datos de acceso operativo no se publican; el registro privado local permite recuperar la versión anterior. Primero se incorporan assets/datos/documentos; después se sustituyen mediante rename el HTML principal, los índices de rutas y la compatibilidad neuronal. Los assets antiguos permanecen para pestañas abiertas. `.htaccess` se conserva: archivos reales se sirven directamente y las demás rutas resuelven a la aplicación.

Para recuperación, extraer el respaldo en una carpeta privada, comparar el alcance y volver a copiar archivos/HTML al destino verificado de este sitio. La recuperación se limita a este sitio. Commit anterior del repositorio: `ab0bfd2d8a88e3752b243002f86a0d65214ec378`.

## Verificación y límites

Pruebas locales previas: 140 recorridos de navegador, 24 comparaciones visuales, 38 tests de código/herramientas y 24 casos de routing. Build y `npm run check` repetidos al publicar. Evidencias de implementación originales permanecen intactas en `home-showroom-20260930.json`, `lab-redesign-20260930.json` y `site-showroom-20260930.json`.

La comprobación online se registra por separado en `publication-20260930.json`: navegación directa, escritorio/móvil, idioma, modelo neuronal, Tetris y hashes de archivos públicos. Capturas locales en `.artifacts/online-20260930/`. Se bloquean POST externos, mensajes de contacto y generaciones de IA; esta comprobación no acredita respuestas de los servicios externos ni su calidad.

No se incluyen settings personales de Claude, entorno, credenciales, copias dist antiguas ni artefactos temporales en el commit. Se sustituye una URL antigua de propuesta con token por el PDF público ya existente, también en los datos del proyecto, para que no quede en el bundle.

## Deuda preexistente de dependencias

La auditoría npm observa 23 avisos: 17 high, 4 moderate, 2 low, ninguno critical. No equivale a 23 fallos explotables de la web publicada: IONOS sirve archivos estáticos, sin Vite dev server, SSR ni procesamiento parquet; los destinos del router son definidos por la aplicación. Requiere revisión acotada y actualización comprobada, sin cambiar dependencias a ciegas al publicar. Seguimiento: `My Page-5lo`. Resumen completo local: el registro local privado de auditoría.

## Conexión externa detectada al publicar

El host antiguo de BuildApp responde503 a las tres comprobaciones OPTIONS. El backend monorepo vigente responde200 en health y preflight, y permite origen https://tony-r.com. Se corrige el host por defecto de Lead Qualifier, cuyo contrato público permanece compatible según el router vigente. Esto no demuestra una respuesta de IA real, pues no se consumen llamadas de generación.

Presupuesto y render siguen pendientes: el backend vigente exige usuario autenticado (y presupuesto profesional/cuota), que las demos del portfolio no incorporan. Se indica la indisponibilidad temporal en ES/EN/CA y se ofrece acceso al producto BuildApp. No se cambian auth, secretos, CORS, cuotas ni código del monorepo. No se afirma que la publicación haya restaurado esas dos generaciones.

Seguimiento de las generaciones pendientes: `My Page-1x9`. Las solicitudes vacías sin sesión al backend vigente retornan401 para ambas rutas antes de generar; no se adjuntan mensajes, imágenes ni credenciales. Tras el ajuste final pasan28 recorridos de presupuesto/render/chat/idiomas, cuatro comparaciones visuales inspeccionadas y check/build. El primer commit de publicación `0fa2ec5ad15332efe6271c30034476659894b2bd` pasa la calidad completa en GitHub y despliega correctamente en Vercel; el commit de corrección se verifica aparte.
