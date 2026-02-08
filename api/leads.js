// Vercel Serverless: endpoints de leads para ReformasDemo
// Sin persistencia (cada deploy/invocación no comparte estado). POST acepta y devuelve id; GET lista devuelve [].

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'POST') {
    try {
      const { lead, result } = req.body || {}
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      // Sin persistencia en Vercel; el front puede seguir mostrando el último resultado en memoria
      return res.status(201).json({ id })
    } catch (err) {
      console.error('save lead error:', err.message)
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'GET') {
    // Sin base de datos: listado vacío. El historial solo tendría sentido con Vercel KV o backend externo.
    return res.status(200).json([])
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
