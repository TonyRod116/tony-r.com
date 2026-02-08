/**
 * Proxy para Presupuesto Orientativo: evita CORS llamando a BuildApp desde servidor.
 * POST body se reenvía a buildapp-v1-backend.onrender.com/api/v1/budget/generate-detailed
 */
const BUILDAPP_URL = 'https://buildapp-v1-backend.onrender.com/api/v1/budget/generate-detailed'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
    const response = await fetch(BUILDAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await response.json().catch(() => ({}))
    res.status(response.status).json(data)
  } catch (err) {
    console.error('buildapp-budget proxy error:', err.message)
    res.status(500).json({ error: err.message || 'Proxy error' })
  }
}
