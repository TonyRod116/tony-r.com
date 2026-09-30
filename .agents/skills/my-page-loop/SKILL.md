---
name: my-page-loop
description: "Organiza encargos autónomos o repetidos con evidencia y límites de progreso."
---

# my-page-loop

Para un encargo autorizado conserva objetivo, alcance, criterio de éxito y presupuesto en JSON según docs/ai/review-and-loops.md. Cada ciclo recupera estado, cambia lo útil y verifica al consumidor.

ai:loop -- .artifacts/loop-state.json aconseja continuar/parar; no ejecuta ni programa tareas. Para por éxito, presupuesto, tres ciclos sin evidencia nueva o acción externa pendiente. Renombrar archivos no es progreso. No activa cron, proveedores ni publicación. Super Output/revisiones requieren invocación y skill global vigente; no copies permisos/modelos históricos.
