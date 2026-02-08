const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const TIMEOUT_MS = 30000

// Siempre usar el proxy /api/chat (el servidor tiene la API key de OpenAI)
function getApiEndpoint() {
  return '/api/chat'
}

export async function callOpenAI(apiToken, systemPrompt, messages, config = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const proxyEndpoint = getApiEndpoint()
    
    // Siempre usar el proxy (mensajes y config se envían; la API key está en el servidor)
    if (proxyEndpoint) {
      return await callViaProxy(proxyEndpoint, messages, config, controller.signal)
    }
    
    // Si hay token manual en el cliente, llamar directamente a OpenAI
    if (apiToken) {
      return await callDirectOpenAI(apiToken, systemPrompt, messages, controller.signal)
    }
    
    throw new Error('No se pudo conectar con el asistente. Comprueba que el servidor /api/chat esté disponible.')

  } finally {
    clearTimeout(timeoutId)
  }
}

async function callViaProxy(endpoint, messages, config, signal) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, config }),
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
      throw new Error('Token inválido o expirado. Por favor, verifica tu API key.')
    }
    if (response.status === 429) {
      throw new Error('Límite de solicitudes excedido. Espera un momento e intenta de nuevo.')
    }
    if (response.status === 500) {
      throw new Error('Error del servidor de OpenAI. Intenta de nuevo más tarde.')
    }
    
    throw new Error(errorData.error?.message || `Error ${response.status}`)
  }

  const data = await response.json()
  
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Respuesta vacía del modelo')
  }

  return data.choices[0].message.content
}
