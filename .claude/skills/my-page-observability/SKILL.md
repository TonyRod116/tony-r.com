---
name: my-page-observability
description: "Diagnostica conversiones y errores con telemetría mínima y sin datos personales."
---

# my-page-observability

Lee docs/ai/observability.md. src/utils/telemetry.js mantiene eventos permitidos y diagnósticos locales; GoogleAnalytics conecta navegación/clics. Contacto registra éxito tras respuesta correcta.

Campos acotados: ruta, acción y clase de error. Nunca cuerpos, queries, emails, claves, imágenes o mensajes. Verifica emisión y fallos con fixtures. Buffer local no es monitorización remota; Sentry/destino requiere configuración y prueba propias, sin copiar DSN/credenciales de BuildApp. No afirma beneficio económico por instrumentar.
