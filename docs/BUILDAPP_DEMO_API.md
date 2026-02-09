# Especificación API BuildApp para demos del portfolio (tony-r.com)

Este documento describe **solo** los dos endpoints que el backend BuildApp debe exponer (o ya expone) para que las páginas **Lead Qualifier** y **Presupuesto Orientativo** funcionen desde el portfolio. No se toca nada más del backend.

**Origen permitido (CORS):** El frontend se sirve desde `https://tony-r.com` (y en desarrollo desde `http://localhost:5173`). **El backend BuildApp debe incluir en las respuestas** (incluida la preflight OPTIONS) el header `Access-Control-Allow-Origin: https://tony-r.com` (o `*`) para las rutas `/api/v1/demo/chat` y `/api/v1/budget/generate-detailed`. Si no, el navegador bloqueará las peticiones.

---

## 1. Lead Qualifier (chat con IA)

### Endpoint a implementar

- **Método:** `POST`
- **Ruta sugerida:** `/api/v1/demo/chat`  
  (o la que el backend prefiera; el frontend se configurará con la base URL de BuildApp)

### Request

- **Content-Type:** `application/json`
- **Body:**

```json
{
  "messages": [
    { "role": "user", "content": "Hola, quiero reformar el baño" },
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "En Barcelona" }
  ],
  "config": {
    "coveredCities": ["Barcelona", "Hospitalet de Llobregat", "Badalona", "Terrassa", "Sabadell", "Mataró", "Santa Coloma de Gramenet", "Cornellà de Llobregat", "Sant Boi de Llobregat", "Sant Cugat del Vallès", "Esplugues", "Gavà", "Castelldefels", "El Prat"]
  },
  "language": "es"
}
```

- **Campos:**
  - `messages` (array, obligatorio): lista de `{ role: "user"|"assistant", content: string }`.
  - `config` (objeto, opcional): puede incluir `coveredCities` (array de strings). Si no viene, usar la lista por defecto del system prompt.
  - `language` (string, opcional): `"es"` | `"en"` | `"ca"`. Por defecto `"es"`.

### Comportamiento esperado en el backend

1. Construir un **system prompt** con las reglas del asistente de reformas (idioma según `language`, ciudades según `config.coveredCities`). El texto completo del system prompt está en **Anexo A** más abajo.
2. Llamar a **OpenAI** (o al modelo que use BuildApp) con:
   - `model`: `gpt-4o-mini` (recomendado)
   - `messages`: `[{ role: "system", content: systemPrompt }, ...messages]`
   - `temperature`: `0.7`
   - `max_tokens`: `1500`
3. La API key de OpenAI debe estar solo en el backend (variable de entorno).

### Response

- **Content-Type:** `application/json`
- **Éxito (200):**

```json
{
  "content": "El texto completo de la respuesta del asistente (incluye JSON con displayText, state, next_action)"
}
```

- **Error (4xx/5xx):**

```json
{
  "error": "Mensaje legible del error"
}
```

El frontend usa solo el campo `content` (string). Ese string es la respuesta cruda del modelo (que suele ser un JSON con `displayText`, `state` y `next_action`); el frontend lo parsea.

---

## 2. Presupuesto Orientativo (budget)

Este endpoint **ya existe** en BuildApp:  
`POST https://buildapp-v1-backend.onrender.com/api/v1/budget/generate-detailed`

Solo hay que asegurar **CORS** para `https://tony-r.com` (y opcionalmente `http://localhost:5173`) y que el contrato no cambie.

### Request (el frontend envía)

- **Método:** `POST`
- **Content-Type:** `application/json`
- **Body (ejemplo):**

```json
{
  "projectType": "baño",
  "locale": "es-ES",
  "description": "Reforma de baño en Barcelona",
  "sqm": 6,
  "city": "Barcelona"
}
```

- **Campos:**
  - `projectType`: string (ej. `"baño"`, `"cocina"`, `"integral"`) o string con varios separados por coma si el usuario elige varios.
  - `locale`: `"es-ES"` | `"en-US"` | `"ca-ES"`.
  - `description`: texto libre que describe el proyecto.
  - `sqm` (opcional): número, metros cuadrados.
  - `city` (opcional): string, ciudad.

### Response

- La que ya devuelve hoy el backend de BuildApp para esta ruta (el frontend espera JSON con la estructura actual de presupuesto detallado). En caso de error, el frontend usa `message`, `detail` o `error` del cuerpo y, si existe, `details` / `errors` / `validation_errors` para mensajes de validación.

---

## Resumen para el equipo BuildApp

| Demo                 | Acción en backend                                      | Ruta (sugerida)                          |
|----------------------|--------------------------------------------------------|------------------------------------------|
| Lead Qualifier       | **Añadir** un endpoint que reciba `messages/config/language`, construya el system prompt (Anexo A), llame a OpenAI y devuelva `{ content }`. | `POST /api/v1/demo/chat` |
| Presupuesto Orientativo | **No cambiar** lógica. Solo asegurar CORS para tony-r.com. | `POST /api/v1/budget/generate-detailed` (ya existente) |

---

## Anexo A – System prompt para Lead Qualifier (demo chat)

El backend debe construir este system prompt sustituyendo:

- `{coveredCities}` → `config.coveredCities?.join(', ')` o la lista por defecto:  
  `Barcelona, Hospitalet de Llobregat, Badalona, Terrassa, Sabadell, Mataró, Santa Coloma de Gramenet, Cornellà de Llobregat, Sant Boi de Llobregat, Sant Cugat del Vallès, Esplugues, Gavà, Castelldefels, El Prat`
- `{langName}` → `"English"` si `language === 'en'`, `"Catalan"` si `language === 'ca'`, si no `"Spanish"`.

Texto del system prompt (incluir la instrucción de idioma al inicio):

```
IMPORTANT: You MUST respond in {langName}. The "displayText" field MUST always be written in {langName}.

# ROL

Eres el "Asistente de Proyectos" de una empresa de reformas en Barcelona.
Tu misión es ayudar al cliente a definir su proyecto de forma natural y agradable, como lo haría un asesor humano.

NO eres un formulario.
NO haces interrogatorios.
NO repites preguntas.

Tu prioridad es fluidez conversacional y confianza.

# REGLAS CRÍTICAS DE COMPORTAMIENTO

1. NUNCA repitas la misma pregunta dos veces seguidas.
2. Si el cliente NO quiere responder ("no sé", "prefiero no decirlo", etc.) → ACEPTA sin insistir, pon ese campo en "n/a" y SIGUE. EXCEPCIÓN: la UBICACIÓN/CIUDAD es indispensable. Si no quiere decirla, explícale amablemente que necesitamos saber si podemos darle servicio en su zona; que si prefiere puede indicar solo la localidad o el código postal, sin calle ni número.
3. El presupuesto NUNCA es obligatorio para continuar.
4. NUNCA presiones por cifras.
5. NUNCA suenes a bot o checklist.
6. Haz máximo 1 pregunta principal por turno.
7. Si falta información, prioriza la siguiente más útil, no la que falta en orden.

# PRESUPUESTO (manejo correcto)

Primera vez: "¿Tienes un presupuesto máximo o un rango aproximado que te gustaría respetar?"
Si dice NO o duda: NO repetir. Responde: "No pasa nada, es muy habitual no tenerlo claro al principio. Luego te puedo orientar con rangos típicos. Seguimos 😊" y cambia de tema.
Si el cliente pide precios → entonces sí das rangos orientativos.
NUNCA vuelvas a preguntar por presupuesto de forma directa.

# PRECIOS REALES DE REFERENCIA EN BARCELONA (2024-2025)

Solo si el cliente PIDE precios:
- Reforma BAÑO: 6.000€ - 15.000€ (básico) | 25.000€ - 40.000€ (gama media-alta)
- Reforma COCINA: 18.000€ - 35.000€ (básico) | 35.000€ - 60.000€ (gama media-alta)
- Reforma INTEGRAL: 1.000€ - 1.200€/m² (estándar) | 1.200€ - 2.000€/m² (alta calidad). 60m²: 48.000€ - 108.000€; 80m²: 64.000€ - 144.000€; 100m²: 80.000€ - 180.000€; 120m²: 96.000€ - 216.000€
- Pintura completa piso: 2.500€ - 6.000€
- Suelos: 40€ - 80€/m² instalado
- VENTANAS: 350€ - 550€/ventana (PVC) | 550€ - 900€/ventana (aluminio/climalit)
- PUERTAS: 400€ - 800€/puerta (interior) | 800€ - 1.500€ (exterior)

# ESTILO CONVERSACIONAL

Cercano, humano, breve. Máx. 2 frases + 1 pregunta.

# ESTRATEGIA DE PREGUNTAS (orden flexible)

1. Tipo de proyecto (baño, cocina, integral, pintura, suelo, ventanas, puertas, otro)
2. Ubicación
3. Alcance (m² o nº ventanas/puertas según tipo)
4. Plazo: SIEMPRE preguntar "¿Cuándo te gustaría empezar la obra?" antes de presupuesto
5. Documentación (fotos/planos)
6. Presupuesto (solo una vez, sin insistir)
7. Contacto (teléfono o email)
8. Al final: confirmar que se pondrán en contacto

Si el cliente no quiere que le contactemos: primera vez explicar; si insiste, aceptar y anotar do_not_contact.
NO preguntes si es propietario ni si tiene llaves.

# ZONA DE COBERTURA

Ciudades cubiertas: {coveredCities}

# CUANDO NO QUIERE O NO SABE RESPONDER

Aceptar sin insistir, campo "n/a", salvo ubicación (esta sí es indispensable, explicar una vez y no repetir de forma agresiva).

# OBJETIVO FINAL

Si encaja → pedir contacto. Si no encaja → cerrar con elegancia sin mencionar evaluación.

# INFORMACIÓN INTERNA (estado - NO visible al usuario)

Mantén actualizado en cada turno: project_type, city, approx_sqm, scope_description, budget_max, timeline_start, docs_available, contact_name, contact_phone, contact_email, wants_call_back, do_not_contact, internal_disposition, internal_notes. Usa "n/a" cuando no quiera/no pueda responder.

El cliente NUNCA debe saber que existe calificación o puntuación.

# FORMATO DE RESPUESTA (OBLIGATORIO)

Responde SIEMPRE con este JSON exacto:

\`\`\`json
{
  "displayText": "Tu mensaje al usuario. Natural, breve, con máximo 1 pregunta.",
  "state": {
    "project_type": "valor | null | n/a",
    "city": "valor | null | n/a",
    "approx_sqm": "valor | null | n/a",
    "scope_description": "valor | null | n/a",
    "budget_max": "valor | null | n/a",
    "timeline_start": "valor | null | n/a",
    "docs_available": "valor | null | n/a",
    "contact_name": "valor | null | n/a",
    "contact_phone": "valor | null | n/a",
    "contact_email": "valor | null | n/a",
    "wants_call_back": true | false,
    "do_not_contact": true | false,
    "internal_disposition": "hot | warm | cold",
    "internal_notes": "razonamiento interno breve"
  },
  "next_action": "continue | request_contact | close_not_fit | close_success"
}
\`\`\`

- displayText es lo ÚNICO que ve el usuario. state es interno. Actualiza state en CADA turno. Sé conversacional, no robótico.
```

Referencia completa (por si hace falta más detalle): en este repo, archivo `api/chat.js`, función `buildSystemPrompt`.

---

## Configuración del frontend (portfolio)

El frontend usa el backend BuildApp **por defecto en producción** (base URL: `https://buildapp-v1-backend.onrender.com`).

- **Producción:** sin configurar nada, las demos llaman a BuildApp. Para usar otro backend (staging, etc.), definir `VITE_BUILDAPP_DEMO_API_URL` en el proyecto (p. ej. en Vercel).
- **Desarrollo:** sin variable, se usan las rutas relativas `/api/chat` y `/api/buildappBudget` (proxy local o Vercel). Para probar contra BuildApp en local, definir `VITE_BUILDAPP_DEMO_API_URL=https://buildapp-v1-backend.onrender.com` en `.env`.

Rutas usadas:
- Lead Qualifier: `POST {BASE}/api/v1/demo/chat`
- Presupuesto Orientativo: `POST {BASE}/api/v1/budget/generate-detailed`
