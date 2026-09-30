# Adaptación de BuildApp y MTM a My Page

Last updated: 2026-09-30

## Alcance instalado

| Recomendación de la comparativa | Implementación local | Comprobación |
|---|---|---|
| Agente propio y skills por trabajo | `.agents/skills/my-page-*` | `check:skills` |
| Marketing descubrible | 12 skills tácticas adaptadas, contexto único | `check:skills`, manifiesto/licencia |
| Ingeniería de BuildApp/Addy | `my-page-engineering`, plan/implement/API/review | Skill + pruebas del consumidor |
| Router experto | `my-page-agent` + rutas por ámbito y skills | `ai:eval` |
| Selector global de modelos | `scripts/ai-route.mjs`, sin clasificador duplicado | `ai:route` en máquina con selector |
| Contexto selectivo y salud | `scripts/ai-memory.mjs`, mapa explícito | `test:tooling`, `ai:health` |
| Vigente frente a histórico | Status/autoridad/frescura en mapa único | Contexto excluye históricos |
| Resumen de inicio/retoma | `ai:brief`, SessionStart Claude | Hook local; fallback manual otros clientes |
| Evaluación de skills/agentes | Casos de routing y comportamiento separados | `ai:eval`; forward-test independiente pendiente de uso autorizado |
| Resultados observados | Ledger append-only con hashes, preview por defecto | `test:tooling`, `ai:health` |
| Auditoría de importaciones | Skill, manifiesto/procedencia y checker | No upstream ejecutable instalado |
| Autonomía y parada | `my-page-loop`, `scripts/ai-loop.mjs` | Tests de presupuesto/progreso |
| Revisión externa útil | Workflow local que reutiliza runners globales | No llamada externa activada |
| Diseño explícito | `.agents/design-context.md` | Contexto y criterio visual |
| Reglas comprobables de diseño | `check-design.mjs` + baseline de deuda | `check:design` |
| Antes/después visual | Playwright visual con snapshots revisables | `test:visual` |
| Navegación e interacción | Suite local con fixtures y destinos externos bloqueados | `test:e2e` |
| Integración continua | `.github/workflows/quality.yml` | Mismos comandos locales, sin deploy |
| Conversión y diagnóstico | Telemetría permitida y eventos en recorridos | Tests locales/navegador; recepción remota aparte |
| Explicación desde código | `my-page-explain` | Casos de comportamiento |
| Documentación al día | README, estado, arquitectura y contratos | Salud y sync/check IA |
| Carga y rendimiento | Rutas cargadas bajo demanda y reporte de build | Build, navegación y `perf:report` |

## Decisiones de adaptación

Se adaptan conceptos, no arquitectura monorepo, cuentas, dinero/live, release móvil, modelos históricos, credenciales o instaladores. Understand-Anything y sincronización con herramientas externas de diseño permanecen opcionales, tal como se recomendó. Bibliotecas ya descargadas siguen como referencia; no se ejecutan scripts upstream.

La paleta y las decisiones visuales finales de My Page se definirán durante el rediseño. Los gates actuales conservan deuda inspeccionada e impiden aumentarla; no fingen que el diseño anterior ya cumple. La instalación de Sentry, lanzamiento publicitario o schedules no se infiere de tener sus workflows preparados.

## Evidencia y límites

Procedencia: `.agents/adoption-manifest.json`. Comprobaciones finales: `verification.md`. No hay benchmark de ahorro por tarea ni prueba independiente de respuestas de todos los clientes. Mock de navegador no es disponibilidad externa. La automatización universal de cambio de modelo continúa fuera del selector global existente.
