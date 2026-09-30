# Publicación del showroom — 2026-09-30

Tony autoriza publicar todos los cambios completados. El dominio principal es https://tony-r.com y se sirve desde IONOS, no desde el antiguo Hostinger. Se confirma la carpeta `/home/www/www/tony-r` comparando el SHA-256 del HTML remoto y el descargado del dominio antes de publicar. La integración histórica de GitHub con Vercel sigue activa para `tony-rcomvercel.vercel.app`; no se cambian DNS, secretos ni configuraciones del proveedor.

## Artefacto y recuperación

`npm run build -- --outDir .artifacts/build` genera la versión actual desde el código fuente. El HTML publicado tiene SHA-256 `ed94d3d5a6a6f03a01b425ca4ca9fa6c23725e9495032e736ad8693c63602084`, confirmado por HTTPS tras activarlo.

Copia anterior privada en el mismo servidor: `/home/www/.tony-r-releases/before-20260930-2100.tar.gz` (permisos 600). Artefacto preparado: `/home/www/.tony-r-releases/showroom-20260930-2100/`. Primero se incorporan assets/datos/documentos; después se sustituyen mediante rename el HTML principal, los índices de rutas y la compatibilidad neuronal. Los assets antiguos permanecen para pestañas abiertas. `.htaccess` se conserva: archivos reales se sirven directamente y las demás rutas resuelven a la aplicación.

Para recuperación, extraer el respaldo en una carpeta privada, comparar el alcance y volver a copiar archivos/HTML a la carpeta tony-r. No actuar sobre BuildApp o TotalHomes, que comparten cuenta pero no forman parte de esta publicación. Commit anterior del repositorio: `ab0bfd2d8a88e3752b243002f86a0d65214ec378`.

## Verificación y límites

Pruebas locales previas: 140 recorridos de navegador, 24 comparaciones visuales, 38 tests de código/herramientas y 24 casos de routing. Build y `npm run check` repetidos al publicar. Evidencias de implementación originales permanecen intactas en `home-showroom-20260930.json`, `lab-redesign-20260930.json` y `site-showroom-20260930.json`.

La comprobación online se registra por separado en `publication-20260930.json`: navegación directa, escritorio/móvil, idioma, modelo neuronal, Tetris y hashes de archivos públicos. Capturas locales en `.artifacts/online-20260930/`. Se bloquean POST externos, mensajes de contacto y generaciones de IA; esta comprobación no acredita respuestas de los servicios externos ni su calidad.

No se incluyen settings personales de Claude, entorno, credenciales, copias dist antiguas ni artefactos temporales en el commit. Se sustituye una URL antigua de propuesta con token por el PDF público ya existente, también en los datos del proyecto, para que no quede en el bundle.

## Deuda preexistente de dependencias

La auditoría npm observa 23 avisos: 17 high, 4 moderate, 2 low, ninguno critical. No equivale a 23 fallos explotables de la web publicada: IONOS sirve archivos estáticos, sin Vite dev server, SSR ni procesamiento parquet; los destinos del router son definidos por la aplicación. Requiere revisión acotada y actualización comprobada, sin cambiar dependencias a ciegas al publicar. Seguimiento: `My Page-5lo`. Resumen completo local: `/tmp/my-page-deploy-audit.json`.
