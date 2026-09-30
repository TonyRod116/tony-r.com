# Resto del showroom — 2026-09-30

Tony autoriza terminar las páginas restantes después de aprobar home e IA. Alcance: About, Projects, Resume, Contact, Solutions y las demos de presupuesto, render y lead qualifier. Fuente en src/public; cambios locales sin publicación.

## Dirección y contenido

Papel cálido, tinta oscura, Inter, acento terracota y reglas finas. SitePage y Site.css comparten escala y estructura; cada página tiene una composición útil para su contenido. DemoPage unifica las tres demos sin cambiar sus propietarios backend. Header de cuatro enlaces y footer compacto en todas las rutas; la identidad de home e IA se mantiene.

About cuenta el recorrido con una foto real y texto estático, sin typewriter/parallax. Projects presenta los cinco casos, con BuildApp Pro dominante, responsabilidad personal/colaboración con CTO, capturas seleccionables, stores/repos y PDF de propuesta local. TradeLab se distingue de los bots actuales. No se muestran los antiguos scores de Lighthouse ni se publica el motivo estratégico privado de Tony.

Resume conserva CV EN/ES y seis certificados originales, experiencia/formación y la galería completa. Los detalles largos siguen disponibles en expansiones. UIC se presenta como estudios de arquitectura, sin inventar titulación. PDF y fotos usan dialog nativo con foco, cierre por Escape y navegación de galería. Descargas/telemetría conservan sus contratos.

Contact es una invitación directa, con nombre/email/mensaje. Intent y solution permanecen compatibles; el contexto recruiter/company se muestra en segundo plano. Errors conservan el borrador y no cuentan como conversión. Se corrige el fallback que podía mostrar una clave de traducción inexistente.

Solutions expone las tres demos, incluido el render anteriormente oculto. Los dibujos con cifras ficticias se sustituyen por esquemas cualitativos; la foto de entrada procede de la galería existente. Input/output y límites se describen con lenguaje concreto, sin ROI garantizado o falsa disponibilidad online.

## Datos y controles preservados

Las 24 imágenes de Total Homes se copian sin retocar desde las URLs originales ya presentes. Manifest de origen, bytes y SHA: public/gallery/manifest.json. Descarga total aproximada: 10.6 MB de activos disponibles, no transferencia inicial medida. La página muestra seis miniaturas con carga diferida; la galería completa está accesible. Se inspeccionan las 24 imágenes y se verifica su decodificación desde el origen de la web. Títulos antiguos no coincidían con el contenido; se sustituyen por descripciones visuales ES/EN/CA sin ubicaciones inferidas. La imagen23 se etiqueta como visualización arquitectónica. Fechas históricas no verificadas se conservan como datos heredados, no se publican.

Capturas de proyectos y documentos son los originales; no se modifica ningún píxel o PDF. 83 archivos protegidos (home, traducciones previas, T-Tris, API/server, dist y settings locales) conservan sus hashes. Los hashes de fuentes de la implementación IA anterior también coinciden. El efecto de los cambios compartidos se prueba en navegador.

## Reparaciones funcionales de demos

- Budget conserva projectType/description/sqm/city y utiliza el locale seleccionado ya previsto por el contrato. Se soportan items/total y lineItems/totalMin/totalMax. La espera muestra un estado real, sin etapas/progreso simulados. Cancelación y desmontaje abortan la espera e ignoran resultados antiguos. Timeout de espera: dos minutos.
- Render conserva image/prompt/locale; límites existentes de 10MB y8192px. Validación de lectura, invalidación de imágenes anteriores, cancelación y cinco minutos de espera máxima, según la recomendación previa. URI de resultado ejecutables o con credenciales se rechazan. No se usan innerHTML ni se imprimen prompts/imágenes/respuestas en logs.
- El comparador anterior carecía de control de teclado y su condición de drag era inversa. Repro corregida guardada en /tmp/my-page-rest-before/slider-keyboard-failure.md. El nuevo comparador usa pointer capture y rango nativo; ratón, touch y teclado funcionan. Error de imagen es legible.
- Chat conserva el transporte, prompts, cooldown y heurísticas. Welcome deja de depender de una función de traducción inestable que causaba actualizaciones repetidas. Reset ignora respuestas de la conversación previa. Configuración usa dialog y controles etiquetados. Se elimina un cero suelto y el título engañoso de 'listo para llamar' sin contacto. Logs de parsing ya no contienen datos personales; las reglas de puntuación se mantienen.
- Links a casos esperan el contenido cargado y respetan el margen del header. El tab activo de cada demo queda visible en móvil.

La validación de UI no sustituye controles del servidor. Cancelar una espera local no demuestra que una generación remota se haya detenido. API/server, CORS, cuotas, persistencia, autenticación y credenciales no cambian. El render admite el override público de base BuildApp usado por los otros clientes; default host/path permanecen iguales.

## Evidencia y límites

Build aislado terminado antes de consumidores. Suite completa: 140 pruebas de navegador (desktop/mobile, ES/EN/CA, rutas, teclado/foco, documentos, galerías, formularios, contratos, respuestas alternativas, errores y cancelación). Quality: 38 pruebas de herramientas/modelos/juegos/contratos y24 casos de routing; sin deuda nueva. Comparaciones finales de24 imágenes pasan; 24 observaciones de viewport no muestran overflow, errores de ejecución ni imágenes rotas. El último cambio de texto del CTA de presupuesto pasa10 pruebas específicas. Evidencia: site-showroom-20260930.json. Referencias: se añaden12 y se actualizan4 de Projects/Contact después de inspección; las8 aprobadas de Home/IA se conservan.

Capturas: .artifacts/site-rest-preview/. Estados '-fixture' usan respuestas sintéticas; el render emplea dos fotografías existentes como sustitutos visuales de QA, no una generación real. Ninguna captura de resultado demuestra disponibilidad, precisión o rendimiento de un servicio remoto. No se envían mensajes reales ni imágenes a BuildApp durante QA; solo fuentes públicas como recurso de preview.

Consulta breve de diseño Sonnet5.5High conforme a la preferencia de Tony: autenticación claude.ai/firstParty/Max comprobada, un intento del helper canónico. CLI falla sin resultado, usage ni attestation; no retry/fallback/API billing. No se atribuyen ideas o aprobación a Sonnet. Recibo: /tmp/my-page-rest-sonnet-design-20260930/receipt.json. Revisión visual por el principal.

Se excluyen runs con selector de prueba incorrecto, arrastre de QA fuera del viewport, etiquetas mal cerradas durante cleanup y diagnóstico desde about:blank que no podía cargar recursos locales. Se corrigen sus causas, sin renovar allowances de lint/design. No se presenta esa autoevaluación como auditoría independiente. Bead: My Page-88.
