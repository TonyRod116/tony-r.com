# My Page: sistema de trabajo de las IAs

Last updated: 2026-09-30

## Objetivo y autoridad

Adaptar la calidad web de BuildApp y la continuidad de MTM al portfolio. El resultado se mide por tareas completas y verificadas, no por cantidad de skills. La instalación no es un rediseño, una revisión independiente, una publicación ni una autorización para enviar contenido a proveedores.

Fuente de instrucciones: `AI_SHARED_INSTRUCTIONS.md`, sincronizada con los archivos raíz. Skills canónicas: `.agents/skills`; `.claude/skills` son espejos. Contexto de producto: `.agents/product-marketing-context.md`. Diseño: `.agents/design-context.md`. Las skills no sustituyen límites de Tony.

## Recuperar estado

```bash
npm run ai:brief
npm run ai:context -- --query "Cambiar portada y copy; no tocar API"
npm run ai:health
npm run ai:route -- --query "Implementar el cambio descrito y verificarlo"
```

`ai:context` compone temas afirmativos y conserva la consulta original. `--lane` fija un ámbito; el heurístico nunca interpreta permisos. El registro único de documentos vigentes, históricos y snapshots es `.agents/memory/map.json`. Código actual > memoria; autoridad y antigüedad son dimensiones distintas. La cápsula identifica fuentes ausentes, inválidas, antiguas o no representadas por presupuesto. Abrir fuentes primarias sigue siendo necesario.

El presupuesto se reparte entre fuentes para conservar representación de contratos y memoria, sin gastar todo en el primer archivo. `contract_checks` detecta desajustes de endpoints explícitamente registrados entre cliente y fila de documentación; no es un comparador semántico universal ni una prueba de disponibilidad externa.

`ai:route` delega en `~/litellm/ai_route.py` y la política global existente. No clasifica modelos localmente, no hace dispatch, no cambia chats abiertos ni consulta proveedores. En máquinas sin selector informa `unavailable`; CI no depende de esa instalación personal. Los perfiles/runners de MTM no se copian.

## Trabajar y verificar

Usa la primera solución suficiente: omitir, reutilizar, plataforma/dependencia existente, cambio local mínimo. Elige la skill por el resultado. Para cambios amplios, define aceptación y bloques verificables. Diagnóstico: reproduce antes de modificar. Para riesgos de datos, contratos y producción, busca el fallo principal y verifica al consumidor.

```bash
npm run check
npm run build -- --outDir .artifacts/build
npm run test:e2e
npm run test:visual
npm run perf:report
```

El build aislado conserva el `dist/` que ya exista. Navegador utiliza fixtures y bloquea destinos externos. Las capturas iniciales documentan la versión actual; no significan que se haya rediseñado. Deuda previa de diseño/lint se registra por archivo y regla; los gates impiden aumentarla, sin declarar cumplimiento completo.

## Continuidad y resultados

Las decisiones reutilizables pertenecen a `.memory/`; estado reciente a `PROJECT_STATE.md`; el trabajo pendiente con seguimiento a Beads. No copies el resultado completo a todos los sitios. La memoria guarda conclusión y enlaces, no transcripciones ni razonamiento privado.

Para registrar un resultado observado, crea un JSON local (por ejemplo `.artifacts/outcome-input.json`):

```json
{
  "kind": "software_change",
  "claim": "La recuperación respeta el ámbito del portfolio",
  "decision": "Usar el mapa local con fuentes explícitas",
  "observed": "Los casos de rutas externas y memoria ausente se rechazan",
  "evidence": ["docs/ai/verification.md"],
  "task": "identificador de la tarea"
}
```

```bash
npm run ai:outcome -- --input .artifacts/outcome-input.json
npm run ai:outcome -- --input .artifacts/outcome-input.json --record
```

La previsualización no crea un ledger. El registro añade evidencia con hashes y rechaza duplicados. `proposal_only` significa orientación, no certificación, promoción ni publicación. La salud detecta evidencia alterada; no se modifica una fila histórica para hacer verde el checker. Los tipos admitidos son `software_change`, `agent_evaluation` y `design_review`.

## Descubrimiento, hooks y skills

Codex y otros clientes leen `.agents/skills` según su capacidad; todos pueden abrir el SKILL.md indicado en las instrucciones. Claude usa el espejo y `.claude/settings.json` añade un resumen en SessionStart. `.claude/settings.local.json` mantiene ajustes locales propios. El hook es local, corto, comprobado para su checkout y no cambia modelos. Otros clientes usan `npm run ai:brief`; no se afirma que todos soporten un hook universal.

```bash
npm run ai:sync
npm run check:skills
npm run ai:eval
```

Mantener catálogos y casos no demuestra comportamiento independiente de cada cliente. Consulta `agent-evaluation.md`. Para revisión y autonomía acotada, `review-and-loops.md`; para telemetría, `observability.md`.
