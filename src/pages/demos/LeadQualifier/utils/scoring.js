export function parseStructuredResponse(response) {
  // Try to extract JSON from the response
  const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/)
  
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1])
      return validateStructuredResponse(parsed)
    } catch (e) {
      console.warn('Failed to parse JSON block:', e)
    }
  }

  // Try parsing the entire response as JSON
  try {
    const parsed = JSON.parse(response)
    return validateStructuredResponse(parsed)
  } catch (e) {
    // Not valid JSON
  }

  // Try to find JSON-like object in the response
  const objectMatch = response.match(/\{[\s\S]*"displayText"[\s\S]*\}/)
  if (objectMatch) {
    try {
      const parsed = JSON.parse(objectMatch[0])
      return validateStructuredResponse(parsed)
    } catch (e) {
      console.warn('Failed to parse object match:', e)
    }
  }

  return null
}

function validateStructuredResponse(parsed) {
  if (!parsed.displayText) return null
  
  return {
    displayText: parsed.displayText,
    leadFields: parsed.leadFields || {},
    score: Math.max(0, Math.min(100, parsed.score || 0)),
    tier: Math.max(1, Math.min(5, parsed.tier || 5)),
    reasons: Array.isArray(parsed.reasons) ? parsed.reasons : [],
    nextQuestion: parsed.nextQuestion || null,
  }
}

export function calculateFallbackScore(messages, config) {
  const conversation = messages.map(m => m.content.toLowerCase()).join(' ')
  
  let score = 0
  const reasons = []
  const leadFields = {}

  // Check project type
  const projectTypes = {
    'baño': 'baño',
    'cocina': 'cocina',
    'integral': 'integral',
    'pintura': 'pintura',
    'reforma completa': 'integral',
  }
  
  for (const [keyword, type] of Object.entries(projectTypes)) {
    if (conversation.includes(keyword)) {
      leadFields.projectType = type
      score += 10
      reasons.push('Tipo de proyecto identificado')
      break
    }
  }

  // Check city
  const coveredCities = config.coveredCities.map(c => c.toLowerCase())
  for (const city of coveredCities) {
    if (conversation.includes(city.toLowerCase())) {
      leadFields.city = city
      score += 20
      reasons.push('Ciudad cubierta')
      break
    }
  }

  // Check for uncovered cities
  const uncoveredCities = ['madrid', 'valencia', 'sevilla', 'bilbao', 'malaga']
  for (const city of uncoveredCities) {
    if (conversation.includes(city) && !coveredCities.includes(city)) {
      leadFields.city = city
      reasons.push('Ciudad fuera de cobertura')
      score = Math.max(5, score - 30)
      break
    }
  }

  // Check budget mentions
  const budgetMatch = conversation.match(/(\d{4,6})\s*(?:€|euros?|eur)/i)
  if (budgetMatch) {
    const budget = parseInt(budgetMatch[1], 10)
    leadFields.budget = budget
    
    const projectType = leadFields.projectType || 'baño'
    const minBudget = config.minBudgets[projectType] || config.minBudgets.baño
    
    if (budget >= minBudget) {
      score += 25
      reasons.push('Presupuesto adecuado')
    } else {
      reasons.push('Presupuesto bajo')
    }
  }

  // Check ownership
  if (conversation.includes('propietario') || 
      conversation.includes('es mío') || 
      conversation.includes('es mio') ||
      conversation.includes('soy el dueño')) {
    leadFields.isOwner = true
    score += 15
    reasons.push('Es propietario')
  }

  // Check timeline
  const timelinePatterns = [
    /(\d+)\s*(?:mes|meses)/i,
    /(\d+)\s*(?:semana|semanas)/i,
    /(primavera|verano|otoño|invierno)/i,
    /cuanto antes/i,
    /lo antes posible/i,
  ]
  
  for (const pattern of timelinePatterns) {
    if (pattern.test(conversation)) {
      leadFields.timeline = 'Definido'
      score += 10
      reasons.push('Plazo definido')
      break
    }
  }

  // Check documentation
  if (conversation.includes('plano') || conversation.includes('documentación') || conversation.includes('foto')) {
    leadFields.hasDocs = true
    score += 5
    reasons.push('Tiene documentación')
  }

  // Check contact info
  const phoneMatch = conversation.match(/(\d{9}|\+34\s*\d{9}|\d{3}[\s-]\d{3}[\s-]\d{3})/)
  if (phoneMatch) {
    leadFields.contactPhone = phoneMatch[1]
    score += 10
    reasons.push('Teléfono proporcionado')
  }

  const emailMatch = conversation.match(/[\w.-]+@[\w.-]+\.\w+/)
  if (emailMatch) {
    leadFields.contactEmail = emailMatch[0]
    score += 5
    reasons.push('Email proporcionado')
  }

  // Calculate tier
  const tier = scoreToTier(score)

  return {
    displayText: null,
    leadFields,
    score,
    tier,
    reasons,
    nextQuestion: getNextQuestion(leadFields),
  }
}

export function scoreToTier(score) {
  if (score >= 80) return 1
  if (score >= 60) return 2
  if (score >= 40) return 3
  if (score >= 20) return 4
  return 5
}

function getNextQuestion(leadFields) {
  if (!leadFields.projectType) return '¿Qué tipo de reforma necesitas?'
  if (!leadFields.city) return '¿En qué ciudad está el inmueble?'
  if (!leadFields.sqm) return '¿Cuántos metros cuadrados tiene el espacio?'
  if (!leadFields.budget) return '¿Cuál es tu presupuesto aproximado?'
  if (!leadFields.timeline) return '¿Cuándo te gustaría empezar?'
  if (leadFields.isOwner === undefined) return '¿Eres el propietario del inmueble?'
  if (!leadFields.contactPhone) return '¿Podrías darme un teléfono de contacto?'
  return null
}
