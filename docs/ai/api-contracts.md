# Contratos y propietarios actuales

Last updated: 2026-09-30

Estado reconstruido desde clientes locales. Comprobación de publicación: ver docs/ai/publication-20260930.md; OPTIONS/health no acredita generaciones de IA.

| Consumidor | Ruta utilizada | Propietario y límites |
|---|---|---|
| Lead Qualifier | `{VITE_BUILDAPP_DEMO_API_URL o base BuildApp}/api/v1/demo/chat` | BuildApp. POST `messages/config/language`; espera JSON `{content}`. El cliente usa esa base también en desarrollo. |
| Presupuesto orientativo | `{base BuildApp}/api/v1/budget/generate-detailed` | BuildApp. Inspeccionar `PresupuestoOrientativo.jsx` antes de alterar request/response. |
| Render presupuesto / inspiración de Reformas | Base BuildApp + `/api/v1/get-inspired/process` | BuildApp. Datos de imagen y prompt; no registrar cuerpos. |
| Borrador Reformas | `VITE_API_URL` o ruta relativa + `/api/generate-quote` | `api/generate-quote.js` en Vercel; `server/index.js` en desarrollo. Esquema local en `server/schema.js`. |
| Histórico de leads | `/api/leads` y `/api/leads/:id` | Express persiste en `server/data/leads.json`. Las funciones Vercel no ofrecen la misma persistencia durable. |
| Chat propio/compatibilidad | `/api/chat` | Existe en `api/chat.js`; no es el endpoint seleccionado actualmente por Lead Qualifier. |
| Proxy de presupuesto propio | `/api/buildappBudget` | Existe en Vercel y Express; no sustituye automáticamente la llamada directa del cliente orientativo. |
| Contacto | Formspree del formulario actual | Mensaje real solo con autoridad explícita; QA intercepta y simula la respuesta. |

No mover lógica entre `api/` y `server/` por copiar prácticas de otro repo. Una modificación de contrato debe comprobar sus consumidores y declarar si requiere paridad. Tests mock distinguen transporte, parsing, UI y persistencia; no prueban servidor externo, coste ni CORS real.

Frontend showroom follow-up (2026-09-30): budget sends the selected locale (`es-ES`, `en-US`, `ca-ES`) with the existing `projectType/description/sqm/city` fields; both response variants (`items/total` and `lineItems/totalMin/totalMax`) remain supported. Render sends the existing `image/prompt/locale` fields and uses the same optional BuildApp base override as the other clients; its default host/path is unchanged. Budget waiting is bounded to two minutes and render to the prior five-minute recommendation, with local cancellation. Cancellation does not certify that a remote generation job stopped. `src/utils/demoResponse.js` handles readable JSON errors and rejects invalid/executable image URLs; UI validation does not replace backend limits. Contact keeps the same Formspree action and name/email/message/intent/solution fields. No API/server, credentials, CORS or persistence changes.

`docs/BUILDAPP_DEMO_API.md` conserva el contrato detallado. Las antiguas afirmaciones sobre fallback automático a rutas locales no corresponden al cliente actual.

Publicación 2026-09-30: el antiguo host buildapp-v1-backend.onrender.com responde HTTP503 en las tres rutas. Lead Qualifier cambia su base por defecto a buildapp-backend-monorepo.onrender.com; health y preflight desde https://tony-r.com responden200, el código vigente mantiene el contrato público messages/config/language → content. No se ha ejecutado una respuesta de IA real. Presupuesto y render no se migran ciegamente: en el backend vigente requieren get_current_active_user y, para presupuestos, usuario profesional/quota. No hay autenticación de BuildApp en My Page; sus demos indican indisponibilidad y enlazan al producto. Una futura migración necesita un contrato autorizado propio, sin exponer credenciales, saltar auth o alterar cuotas. No hay cambios en api/ ni server/.
