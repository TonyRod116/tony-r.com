const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const TIMEOUT_MS = 30000

const BUILDAPP_BASE = 'https://buildapp-v1-backend.onrender.com'

// Producción: usar backend BuildApp (env o URL por defecto). Desarrollo: proxy local /api/chat
function getApiEndpoint() {
  const base = import.meta.env.VITE_BUILDAPP_DEMO_API_URL || (import.meta.env.PROD ? BUILDAPP_BASE : '')
  if (base) {
    const url = base.replace(/\/$/, '')
    return `${url}/api/v1/demo/chat`
  }
  return '/api/chat'
}

export async function callOpenAI(apiToken, systemPrompt, messages, config = {}, language = 'es') {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const proxyEndpoint = getApiEndpoint()
    
    // Siempre usar el proxy (mensajes y config se envían; la API key está en el servidor)
    if (proxyEndpoint) {
      return await callViaProxy(proxyEndpoint, messages, config, controller.signal, language)
    }
    
    // Si hay token manual en el cliente, llamar directamente a OpenAI
    if (apiToken) {
      return await callDirectOpenAI(apiToken, systemPrompt, messages, controller.signal)
    }
    
    throw new Error('Could not connect to assistant')

  } finally {
    clearTimeout(timeoutId)
  }
}

async function callViaProxy(endpoint, messages, config, signal, language) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, config, language }),
    signal,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Error ${response.status}`)
  }

  const data = await response.json()
  return data.content
}

async function callDirectOpenAI(apiToken, systemPrompt, messages, signal) {
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  ]

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
    signal,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    
    if (response.status === 401) {
      throw new Error('Invalid or expired token')
    }
    if (response.status === 429) {
      throw new Error('Rate limit exceeded')
    }
    if (response.status === 500) {
      throw new Error('OpenAI server error')
    }
    
    throw new Error(errorData.error?.message || `Error ${response.status}`)
  }

  const data = await response.json()
  
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Empty response from model')
  }

  return data.choices[0].message.content
}
