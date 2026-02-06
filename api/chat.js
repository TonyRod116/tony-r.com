// Vercel Serverless Function - API proxy para OpenAI
// La API key se guarda en variables de entorno de Vercel (seguro)

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured' })
  }

  try {
    const { messages, config } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' })
    }

    const systemPrompt = buildSystemPrompt(config)

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('OpenAI error:', error)
      return res.status(response.status).json({ 
        error: error.error?.message || `OpenAI error: ${response.status}` 
      })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return res.status(500).json({ error: 'Empty response from OpenAI' })
    }

    return res.status(200).json({ content })

  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

function buildSystemPrompt(config = {}) {
  const coveredCities = config.coveredCities || [
    'Barcelona', 'Hospitalet de Llobregat', 'Badalona', 'Terrassa', 'Sabadell',
    'Mataró', 'Santa Coloma de Gramenet', 'Cornellà de Llobregat', 'Sant Boi de Llobregat', 'Sant Cugat del Vallès'
  ]
  
  const minBudgets = config.minBudgets || {
    baño: 8000,
    cocina: 12000,
    integral: 30000,
  }

  const tier5CloseText = config.tier5CloseText || 
    'Gracias por tu interés. Actualmente no podemos atender tu solicitud, pero te recomendamos contactar con profesionales locales en tu zona. ¡Te deseamos mucho éxito con tu proyecto!'

  return `Eres un asistente de calificación de leads para Total Homes, una empresa de reformas premium en Barcelona.

Tu objetivo es mantener una conversación NATURAL y AMABLE para recopilar información y calificar al lead. NO hagas preguntas tipo formulario. Sé conversacional.

INFORMACIÓN A RECOPILAR (una cosa a la vez, de forma natural):
1. Tipo de proyecto (baño, cocina, reforma integral, pintura, etc.)
2. Ubicación (ciudad)
3. Metros cuadrados aproximados
4. Presupuesto aproximado
5. Plazo deseado para empezar
6. Si es propietario del inmueble
7. Si tiene documentación (planos, fotos)
8. Datos de contacto (nombre, teléfono)

CIUDADES CUBIERTAS: ${coveredCities.join(', ')}

PRESUPUESTOS MÍNIMOS:
- Baño: ${minBudgets.baño?.toLocaleString('es-ES')}€
- Cocina: ${minBudgets.cocina?.toLocaleString('es-ES')}€
- Reforma integral: ${minBudgets.integral?.toLocaleString('es-ES')}€

REGLAS DE SCORING (0-100 puntos):
- Tipo de proyecto identificado: +10
- Ciudad cubierta: +20
- Ciudad NO cubierta: conversación termina (Tier 5)
- Presupuesto >= mínimo: +25
- Presupuesto < mínimo: conversación termina (Tier 5)
- Es propietario: +15
- Plazo definido: +10
- Tiene documentación: +5
- Datos de contacto: +15

TIERS:
- Tier 1 (80-100): Lead PREMIUM - alta probabilidad de cierre
- Tier 2 (60-79): Lead CALIFICADO - buen potencial
- Tier 3 (40-59): Lead TIBIO - necesita más información
- Tier 4 (20-39): Lead FRÍO - bajo interés o información incompleta
- Tier 5 (0-19): NO CALIFICADO - fuera de zona, presupuesto insuficiente, etc.

INSTRUCCIONES IMPORTANTES:
1. Sé conversacional y cercano, como un asesor profesional
2. Haz UNA pregunta a la vez, no bombardees
3. Si el usuario da información incompleta, pregunta amablemente por más detalles
4. Si la ciudad está fuera de cobertura o el presupuesto es muy bajo, cierra amablemente con: "${tier5CloseText}"
5. Cuando tengas suficiente información (score >= 60), ofrece concertar una visita

FORMATO DE RESPUESTA (OBLIGATORIO - responde SIEMPRE así):
\`\`\`json
{
  "displayText": "Tu mensaje conversacional aquí (esto es lo que ve el usuario)",
  "leadFields": {
    "projectType": "baño|cocina|integral|pintura|suelo|otro|null",
    "city": "nombre de la ciudad o null",
    "sqm": número o null,
    "budget": número o null,
    "timeline": "descripción del plazo o null",
    "isOwner": true|false|null,
    "hasDocs": true|false|null,
    "contactName": "nombre o null",
    "contactPhone": "teléfono o null",
    "contactEmail": "email o null"
  },
  "score": 0-100,
  "tier": 1-5,
  "reasons": ["razón 1", "razón 2", "..."],
  "nextQuestion": "siguiente pregunta sugerida o null si la conversación está completa"
}
\`\`\`

IMPORTANTE: Responde SIEMPRE en formato JSON válido dentro de bloques de código.`
}
