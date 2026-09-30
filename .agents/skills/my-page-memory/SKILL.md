---
name: my-page-memory
description: "Recupera memoria selectiva y comprueba frescura e integridad de resultados."
---

# my-page-memory

Ejecuta ai:context -- --query "objetivo". Lanes: site, demos, api, marketing, design, ops, explain. .agents/memory/map.json es registro único de autoridad, vigencia y frescura. Solo current entra en contexto. La consulta original conserva límites; el heurístico no da permisos.

Un source inventariado no equivale a leído. Abre archivos materiales. Falta o invalidez requerida bloquea solo la afirmación afectada; presupuesto corto obliga a ampliar o leer selectivamente. ai:health comprueba ausencias y drift.

ai:outcome -- --input archivo.json primero previsualiza; --record añade observación proposal_only con hashes. No reescribe canon ni autoriza acciones. Sin modelos, embeddings ni red en recuperación. Formato en docs/ai/operating-system.md.
