---
name: my-page-api
description: "Protege contratos entre My Page, Vercel, Express y las demos de BuildApp."
---

# my-page-api

Lee docs/ai/api-contracts.md y clientes afectados. api/ posee Vercel; server/ posee Express y persistencia local. Varias demos usan directamente BuildApp.

Explicita inputs/outputs, errores, validación, timeouts y persistencia. Una forma de contrato inspeccionada no demuestra servicio disponible. Usa fixtures en QA sin consumir IA ni enviar datos reales. No registres formularios, mensajes, claves o imágenes. Cambios de backend, auth y persistencia necesitan alcance propio.
