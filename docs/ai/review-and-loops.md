# Revisión y trabajo autónomo con límites

Last updated: 2026-09-30

## Revisión

Una autoauditoría contrasta código, baseline, evidencia adversa y prueba del principal fallo. Una revisión independiente requiere otro constructor/revisor y autoridad para esa llamada; no se activa por instalar skills o consultar `ai:route`.

Los runners y políticas de proveedor permanecen en la instalación global. Usa la skill explícitamente invocada por Tony, su doctor vigente, autenticación, permiso de disclosure y recibo. No copies runners de MTM, modelos históricos, credenciales ni permisos de dinero/live. Restringe payload al repo/fragmento autorizado; no cruces proveedores o pases de suscripción a API facturada silenciosamente. El revisor es de lectura y no hereda escritura, deploy o mensajería.

Registra hallazgos aceptados/rechazados y la prueba que decidió cada uno. Opinión de modelo no es evidencia de ejecución ni ahorro.

## Continuidad autónoma

Para un encargo largo autorizado conserva un estado JSON en `.artifacts/loop-state.json`:

```json
{
  "objective": "Completar el cambio solicitado y sus pruebas",
  "scope": "src/ y pruebas relacionadas",
  "success": "Recorrido del visitante verificado",
  "maxCycles": 6,
  "completed": false,
  "cycles": [{"evidence": ["hash-o-resultado-verificado"], "action": "descripción"}]
}
```

`npm run ai:loop -- .artifacts/loop-state.json` evalúa presupuesto, éxito, falta de progreso y acciones externas pendientes. Es consejo determinista; no ejecuta tareas, modelos o cron. Cada entrada debe representar nueva evidencia del resultado, no nombres/versiones nuevos del mismo archivo.

Mantén autorización de sesión y conserva el objetivo al recibir correcciones. Continúa trabajo útil mientras se aclara una dependencia. Para por finalización, presupuesto, tres ciclos sin nueva evidencia o una acción externa que requiera al propietario. La invocación de autonomía no concede publicación. No crear schedules o tareas repetidas salvo petición real de recurrencia.
