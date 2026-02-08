import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import OpenAI from 'openai'
import { quoteDraftSchema } from './schema.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: [path.join(__dirname, '.env'), '.env'] })
const DATA_DIR = path.join(__dirname, 'data')
const LEADS_FILE = path.join(DATA_DIR, 'leads.json')

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, '[]', 'utf8')
  }
}

function readLeads() {
  ensureDataDir()
  const raw = fs.readFileSync(LEADS_FILE, 'utf8')
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeLeads(leads) {
  ensureDataDir()
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8')
}

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

async function generateQuote(lead, photoNames = []) {
  if (!openai) {
    throw new Error('OPENAI_API_KEY no configurada. Crea server/.env con OPENAI_API_KEY=tu_clave')
  }
  const systemPrompt = buildSystemPrompt()
  const userPrompt = buildUserPrompt(lead, photoNames)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
  })

  let raw = completion.choices[0]?.message?.content?.trim() || ''
  raw = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (e) {
    const fixCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Devuelve ÚNICAMENTE un JSON válido, sin texto extra. Corrige el JSON si hay errores de sintaxis.' },
        { role: 'user', content: `Corrige este JSON y responde solo con el JSON:\n${raw}` },
      ],
      temperature: 0,
    })
    const fixRaw = fixCompletion.choices[0]?.message?.content?.trim() || ''
    const fixClean = fixRaw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
    try {
      parsed = JSON.parse(fixClean)
    } catch (e2) {
      throw new Error('No se pudo parsear la respuesta de la IA como JSON. Intenta de nuevo.')
    }
  }

  const result = quoteDraftSchema.safeParse(parsed)
  if (!result.success) {
    throw new Error('La IA devolvió un formato inválido: ' + result.error.message)
  }
  return result.data
}

app.post('/api/generate-quote', async (req, res) => {
  try {
    const { lead, photoNames } = req.body || {}
    if (!lead || !lead.name) {
      return res.status(400).json({ error: 'Falta el objeto lead con name' })
    }
    const draft = await generateQuote(lead, photoNames || [])
    res.json(draft)
  } catch (err) {
    console.error('generate-quote error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

const BUILDAPP_BUDGET_URL = 'https://buildapp-v1-backend.onrender.com/api/v1/budget/generate-detailed'
app.post('/api/buildappBudget', async (req, res) => {
  try {
    const body = req.body || {}
    const response = await fetch(BUILDAPP_BUDGET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await response.json().catch(() => ({}))
    res.status(response.status).json(data)
  } catch (err) {
    console.error('buildappBudget proxy error:', err.message)
    res.status(500).json({ error: err.message || 'Proxy error' })
  }
})

app.post('/api/leads', (req, res) => {
  try {
    const { lead, result } = req.body || {}
    const leads = readLeads()
    const id = String(Date.now()) + '-' + Math.random().toString(36).slice(2, 8)
    leads.unshift({
      id,
      lead: lead || {},
      result: result || {},
      createdAt: new Date().toISOString(),
    })
    const kept = leads.slice(0, 50)
    writeLeads(kept)
    res.status(201).json({ id })
  } catch (err) {
    console.error('save lead error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/leads', (req, res) => {
  try {
    const leads = readLeads().slice(0, 10)
    res.json(leads)
  } catch (err) {
    console.error('list leads error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/leads/:id', (req, res) => {
  try {
    const leads = readLeads()
    const item = leads.find((l) => l.id === req.params.id)
    if (!item) return res.status(404).json({ error: 'No encontrado' })
    res.json(item)
  } catch (err) {
    console.error('get lead error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Demos API escuchando en http://localhost:${PORT}`)
})
