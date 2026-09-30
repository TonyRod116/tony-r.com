---
name: my-page-implement
description: "Implementa y diagnostica cambios de My Page con pruebas proporcionales."
---

# my-page-implement

Aplica my-page-agent. Reproduce el fallo antes de cambiar comportamiento. Reutiliza código y dependencias; no muevas lógica entre api/ y server/ sin necesidad. Conserva cambios previos, limita refactors y prueba al consumidor y el principal fallo.

Checks: npm run check; build aislado: npm run build -- --outDir .artifacts/build; interfaz: npm run test:e2e; diseño: npm run test:visual. Una deuda previa no equivale a regresión nueva. Nunca edites dist manualmente. Patrones transversales en my-page-engineering.
