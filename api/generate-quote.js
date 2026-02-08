// Vercel Serverless: generación de presupuesto con OpenAI (ReformasDemo)
// Requiere OPENAI_API_KEY en Environment Variables de Vercel

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

function buildSystemPrompt() {
  return `Eres un experto en presupuestos de reformas en Barcelona (España). Genera siempre un JSON válido, sin markdown ni texto extra, con esta estructura exacta:

{
  "lead": { "name": "...", "phone": "...", "city": "...", "projectType": "baño|cocina|integral|pintura|suelo|otros", "sqm": número o null, "targetBudget": número o null, "notes": "..." },
  "missingQuestions": ["preguntas que faltan para afinar el presupuesto"],
  "siteVisitChecklist": ["ítems a revisar en visita"],
  "budgetDraft": {
    "currency": "EUR",
    "assumptions": ["supuestos del presupuesto", "estimación sujeta a visita y mediciones"],
    "exclusions": ["qué no incluye"],
    "lineItems": [
      { "category": "Demolición", "item": "descripción", "qty": número, "unit": "m²|ud|ml", "rangeMin": número, "rangeMax": número, "notes": "opcional" }
    ],
    "totalMin": número,
    "totalMax": número
  },
  "whatsappMessage": "Texto listo para enviar por WhatsApp al cliente, cordial y con resumen + siguiente paso"
}

Reglas de negocio:
- Importes en rangos min/max coherentes con reformas en España (Barcelona).
- Partidas típicas: demolición, fontanería, electricidad, alicatado/solado, carpintería, pintura, gestión residuos, protección, medios auxiliares, imprevistos (5-10%).
- Si faltan m², calidades o estado de instalaciones, inclúyelos en missingQuestions.
- Si targetBudget está muy por debajo del rango, incluye en assumptions y whatsappMessage sugerencias (reducir alcance/calidades).
- Siempre incluir en assumptions algo como "Estimación sujeta a visita y mediciones in situ".
- Responde ÚNICAMENTE con el JSON, sin \`\`\`json ni explicaciones.`
}

function buildUserPrompt(lead, photoNames = []) {
  const parts = [
    `Lead: nombre ${lead.name || '—'}, teléfono ${lead.phone || '—'}, ciudad ${lead.city || 'Barcelona'}, tipo ${lead.projectType || 'otros'}, m² ${lead.sqm ?? '—'}, presupuesto objetivo € ${lead.targetBudget ?? '—'}.`,
    lead.notes ? `Notas: ${lead.notes}` : '',
  ]
  if (photoNames && photoNames.length > 0) {
    parts.push(`El cliente ha subido ${photoNames.length} foto(s): ${photoNames.join(', ')}. Tenlo en cuenta como contexto (no analices imagen, solo que hay fotos).`)
  }
  return parts.filter(Boolean).join('\n')
}

function parseAndValidate(raw) {
  let text = (raw || '').trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
  const parsed = JSON.parse(text)
  if (!parsed.lead || !parsed.budgetDraft || typeof parsed.budgetDraft.totalMin !== 'number' || typeof parsed.budgetDraft.totalMax !== 'number') {
    throw new Error('Formato de respuesta inválido')
  }
  return parsed
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured. Set it in Vercel → Settings → Environment Variables.' })
  }

  try {
    const { lead, photoNames } = req.body || {}
    if (!lead || !lead.name) {
      return res.status(400).json({ error: 'Falta el objeto lead con name' })
    }

    const systemPrompt = buildSystemPrompt()
    const userPrompt = buildUserPrompt(lead, photoNames || [])

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
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return res.status(response.status).json({ error: err.error?.message || `OpenAI ${response.status}` })
    }

    const data = await response.json()
    let raw = data.choices?.[0]?.message?.content?.trim() || ''

    let parsed
    try {
      parsed = parseAndValidate(raw)
    } catch (e) {
      // Retry with fix instruction
      const fixRes = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Devuelve ÚNICAMENTE un JSON válido, sin texto extra. Corrige el JSON si hay errores de sintaxis.' },
            { role: 'user', content: `Corrige este JSON y responde solo con el JSON:\n${raw}` },
          ],
          temperature: 0,
        }),
      })
      if (!fixRes.ok) throw new Error('No se pudo parsear la respuesta de la IA. Intenta de nuevo.')
      const fixData = await fixRes.json()
      const fixRaw = fixData.choices?.[0]?.message?.content?.trim() || ''
      parsed = parseAndValidate(fixRaw)
    }

    return res.status(200).json(parsed)
  } catch (err) {
    console.error('generate-quote error:', err.message)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
