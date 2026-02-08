// Vercel Serverless: GET /api/leads/:id (ReformasDemo)
// Sin persistencia: siempre 404. Para historial real haría falta Vercel KV o backend externo.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  // Sin almacenamiento persistente en esta configuración
  return res.status(404).json({ error: 'No encontrado' })
}
