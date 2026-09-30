# Contexto de diseño de My Page

Last updated: 2026-09-30

## Objetivo
El portfolio debe mostrar con claridad qué construye Tony, qué responsabilidad tuvo y qué puede comprobar el visitante. Acciones: ver proyectos, probar demos, consultar CV y contactar. La audiencia prioritaria y las pruebas viven en product-marketing-context.md.

## Baseline y dirección
El código actual usa React/Vite, Tailwind, Inter, modo oscuro y azul primary. Ese es el baseline, no una decisión final sobre la futura estética. Durante el rediseño definir composición, tipografía, fotografía, ritmo y jerarquía con identidad de Tony; no copiar la paleta BuildApp ni una landing SaaS genérica.

Un cambio visual importante debe mejorar jerarquía, composición o recorrido, además de color/sombra. Usa capturas reales para enseñar proyectos y distingue claramente render IA y resultado real. Nunca datos, métricas o testimonios ficticios.

## Reglas para trabajo nuevo
- Reutilizar escalas Tailwind y tokens de tailwind.config.js/src/index.css. Colores, tipo y radios nuevos requieren decisión de diseño y token compartido; no valores px/hex arbitrarios repetidos por componente.
- Controles con etiquetas y foco visible, acciones por teclado/touch, contraste comprobado. No depender de hover para acciones necesarias.
- Legibilidad con textos largos y ES/EN/CA; comprobar escritorio 1440×900, móvil 390×844 y tablet cuando el layout lo justifique.
- Movimiento al servicio de orientación; respetar prefers-reduced-motion. Evitar partículas/rotaciones/gradientes como sustituto de jerarquía.
- Imágenes proporcionadas al contenido, dimensiones estables y carga apropiada. Medir antes/después para decisiones de rendimiento.

## Comprobación
npm run check:design detecta nueva deuda en colores/tamaños/radios arbitrarios. .agents/design-policy.json conserva deuda inicial por archivo/regla/valor; no ampliar permisos ni renovar baseline para ocultar regresiones. El gate no prueba accesibilidad completa ni calidad visual.

npm run test:visual compara capturas en igual navegador/sistema. Baselines solo se aceptan después de abrir las imágenes y comprobar diferencias. npm run test:e2e verifica recorridos y errores con mocks. Una captura nueva no prueba que el rediseño haya logrado su objetivo.

## Home showroom — decisión implantada 2026-09-30

Dirección de Sonnet 5.5 High solicitada por Tony: ficha de proyecto sobre papel cálido, texto carbón, Inter y reglas finas; sin serif, bento uniforme, neón, glass, contadores o movimientos decorativos. El principal aplicó copy y código y verifica las imágenes reales; Sonnet recibió descripciones/mediciones, no los PNG.

Tokens y layout locales: src/pages/Home.css. Papel #F4F1EA, tinta #1A1A18, texto secundario #5E5B54, borde #D9D4C7 y enlaces #A44726 (más oscuro que el terracota sugerido para mantener contraste). Cabecera/pie específicos de home oscuros; el resto del sitio conserva su tema.

Home: nombre/presentación y retrato estático, BuildApp con propuesta real como pieza dominante, Python trading sin gráficos ni métricas inventadas, archivo de proyectos en filas, historia breve, experimentos de texto y contacto humano. No publicar capital propio o motivos estratégicos privados; no están confirmados para copy. Se reutiliza la foto existente src/assets/pic3 (2).jpg sin generar/retocar imágenes.

La referencia visual anterior de home debe sustituirse solo tras inspeccionar la nueva home en escritorio y móvil. Las referencias de otras rutas se conservan. El selector de idioma es nativo, operable por teclado, y actualiza lang del documento.

## Laboratorio de IA — 2026-09-30

Portada oscura con tipografía grande, esquema vectorial de la red y un índice sobre papel cálido. Acento lima para señalar interacción y conexiones; sin partículas, glass ni tarjetas repetidas de tecnologías. Los tokens comunes están en src/components/ai/AiLab.css.

Las seis demos comparten AiExperimentLayout: título, pestañas con el experimento activo visible, escenario, explicación del método y siguiente experimento. Las reglas de los juegos siguen separadas de su presentación. Red neuronal: datos y probabilidades reales, modelo local atribuido a DFin, sin métricas simuladas ni pesos aleatorios de respaldo. T-Tris conserva la T mágica, música opcional, fantasma, ayuda de IA y récords. Cabecera y pie compactos específicos de /ai.

## Resto del portfolio — 2026-09-30

Las ocho páginas restantes usan SitePage y DemoPage en src/components/site/: papel cálido, tinta oscura, reglas finas, Inter y acento terracota. Navegación primaria de cuatro enlaces y pie compacto compartidos; home y laboratorio mantienen su identidad aprobada. Copy ES/EN/CA en src/data/siteContent.js.

Composiciones distintas: About como relato con fotografía real, Projects como casos con capturas y atribución, Resume como cronología/documentos/galería, Contact como conversación directa, Solutions como recorridos con entradas y salidas. Tres demos con navegación común y estados reales de espera/error/resultado. Sin imágenes con cifras ficticias, progreso simulado, tipografía animada, promesas de conversión o ubicaciones de galería no confirmadas.

Visores de PDF/fotos y configuración usan diálogo nativo con foco/escape. Las 24 imágenes originales se sirven desde public/gallery/; leyendas descriptivas verificadas visualmente, incluyendo la visualización arquitectónica. Ningún píxel o PDF se retoca.
