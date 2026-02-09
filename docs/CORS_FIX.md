# Fix CORS en Backend BuildApp

## Problema

El frontend desde `https://tony-r.com` recibe error de CORS al llamar a BuildApp:
```
Access to fetch at 'https://buildapp-v1-backend.onrender.com/api/v1/budget/generate-detailed' 
from origin 'https://tony-r.com' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solución

En las variables de entorno de Render, el `CORS_ORIGINS` tiene:
```
CORS_ORIGINS="http://localhost:5173,http://localhost:3000,https://buildapp-v1.onrender.com,https://buildapp-v1-1.onrender.com, https://tony-r.com/"
```

**Problema:** `https://tony-r.com/` tiene una **barra final** (`/`), pero el navegador envía `https://tony-r.com` **sin barra**.

**Solución:** Cambiar a:
```
CORS_ORIGINS="http://localhost:5173,http://localhost:3000,https://buildapp-v1.onrender.com,https://buildapp-v1-1.onrender.com,https://tony-r.com"
```

**Importante:** 
- Quitar la barra final de `https://tony-r.com/`
- Asegurarse de que no haya espacios extra (hay un espacio antes de `https://tony-r.com/` en el valor actual)
- Después de cambiar, **reiniciar el servicio en Render** para que tome los nuevos valores

## Verificación

Después del cambio, el backend debe responder a las peticiones OPTIONS (preflight) con:
```
Access-Control-Allow-Origin: https://tony-r.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```
