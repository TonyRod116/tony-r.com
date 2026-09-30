# Medición y diagnóstico

Last updated: 2026-09-30

## Señales y preguntas

| Señal | Pregunta | Evidencia real |
|---|---|---|
| `page_view` | ¿Qué rutas se visitan? | Evento emitido con ruta normalizada; recepción GA es una comprobación externa separada. |
| `project_open` | ¿Se abren proyectos o sus demos? | Clic de enlace y destino clasificado. No equivale a interés comercial. |
| `cv_open` / `cv_download` | ¿Se consulta el CV o se descarga? | Apertura del documento y clic de enlace de descarga son eventos distintos. |
| `social_click` / `contact_click` | ¿Qué salida elige el visitante? | Clic clasificado, sin direcciones de correo ni queries. |
| `contact_success` | ¿El formulario responde correctamente? | Respuesta de éxito, no simple clic en enviar. QA usa fixture. |
| `demo_request` | ¿Falla el transporte de una demo? | Feature, resultado HTTP/error y duración por tramos, sin cuerpo. No certifica calidad del presupuesto. |
| Diagnóstico runtime local | ¿Hubo error no capturado? | Buffer local limitado con clase/ruta; no mensaje/stack con datos personales. |

`src/utils/telemetry.js` limita nombres y campos. `window.__MY_PAGE_DIAGNOSTICS__` es un buffer en memoria, nunca persistencia durable o monitorización remota. Un listener `my-page:telemetry` permite comprobar emisión. Fallo del destino de telemetría no debe romper navegación.

Se conserva el proveedor y configuración analítica que ya tenía el sitio. La capa nueva no toma IDs de BuildApp ni crea credenciales. No atribuir consentimiento conforme o recepción efectiva sin comprobar el flujo real. No enviar raw URL/query, formularios, prompts, tokens, imágenes, errores completos o cuentas.

## Destino externo de errores

Sentry es una opción del patrón BuildApp, no un servicio activado por esta instalación. Si se solicita: crear destino propio, definir consentimiento/datos permitidos, añadir SDK/config explícitos, forzar un error en preview y comprobar recepción/filtrado antes de declarar cobertura. No reutilizar DSN, credenciales ni release settings del monorepo.

## Rendimiento

`npm run perf:report` inspecciona `.artifacts/build`, tamaños de chunks y cargas por ruta; es medición de artefactos, no Core Web Vitals reales. Para LCP/CLS/INP utiliza navegador/perfiles comparables y, con tráfico, medición real. No declarar ahorro económico ni conversión mejorada por una reducción de bundle.
