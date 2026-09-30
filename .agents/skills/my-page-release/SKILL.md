---
name: my-page-release
description: "Prepara CI, comprobaciones y continuidad de My Page sin publicar por defecto."
---

# my-page-release

Verifica check, build aislado y QA aplicable. .github/workflows/quality.yml comprueba calidad; no despliega. Cambia instrucciones en AI_SHARED_INSTRUCTIONS.md y sincroniza. Cambia skills en .agents/skills y ejecuta ai:sync/check:skills.

Actualiza PROJECT_STATE.md y memoria para decisiones duraderas. Registra outcomes solo observados. Readiness no concede deploy/push/PR ni publicación. No copies releases Android/iOS o trading. Explica verificación, riesgo residual y rollback.
