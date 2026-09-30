# Evaluación del sistema de agentes

Last updated: 2026-09-30

`npm run ai:eval` ejecuta los casos de `.agents/evals/cases.json` contra routing y alcance local. `npm run test:tooling` comprueba comportamiento de scripts con archivos temporales, fuentes ausentes/antiguas, límites, preview/record, duplicación, drift y parada. `npm run check:skills` comprueba integridad estructural y espejos.

Estas pruebas no evalúan por sí solas la calidad de una respuesta de Codex/Claude, la comprensión de cada skill por cada cliente ni mejora de negocio. Para un forward-test independiente, cuando esté autorizado, ofrece petición, skill y artefactos mínimos sin mostrar la respuesta esperada. `.agents/evals/behavior-cases.json` mantiene los escenarios y criterios para esa fase.

Rubrica: objetivo cumplido; fuente y contrato correctos; límites preservados; principal fallo verificado; idiomas/móvil; hechos separados de inferencias; conclusión comprensible; contexto/reintentos razonables. Registrar qué cambió una decisión, proveedor/modelo/acceso reales si hubo llamada y outcome observado.

Evitar revisores ceremoniales y LLM-as-judge como prueba única. El principal conserva aplicación de cambios y comprobación. Un fallo observado genera regresión; no convertir un cambio de palabras en PASS ni ajustar un prompt para rescatar métricas.
