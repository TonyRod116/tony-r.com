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
  
  // Handle new format with "state" object
  const state = parsed.state || parsed.leadFields || {}
  
  // Map internal_disposition to tier/score for UI compatibility
  const disposition = state.internal_disposition || 'warm'
  const { score, tier } = dispositionToScoreTier(disposition, state)
  
  // Map state fields to leadFields for UI
  const leadFields = {
    projectType: state.project_type || null,
    city: state.city || null,
    sqm: state.approx_sqm ? parseInt(state.approx_sqm, 10) : null,
    budget: state.budget_max ? parseBudget(state.budget_max) : null,
    budgetRange: state.budget_range || null,
    timeline: state.timeline_start || null,
    hasDocs: state.docs_available && state.docs_available !== 'ninguno' ? true :
             state.docs_available === 'ninguno' ? false : null,
    contactName: state.contact_name || null,
    contactPhone: state.contact_phone || null,
    contactEmail: state.contact_email || null,
    // Additional fields from new format
    postalCode: state.postal_code || null,
    scopeDescription: state.scope_description || null,
    constraints: state.constraints || null,
  }

  // Generate reasons from state
  const reasons = generateReasons(state, disposition)

  // Determine next question based on next_action
  const nextQuestion = parsed.next_action === 'close_success' || 
                       parsed.next_action === 'close_not_fit' ? null : 
                       'Continuar conversación'

  return {
    displayText: parsed.displayText,
    leadFields,
    score,
    tier,
    reasons,
    nextQuestion,
    // Keep raw state for admin panel
    rawState: state,
    nextAction: parsed.next_action || 'continue',
  }
}

function parseBudget(value) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    // Extract number from string like "15000" or "15.000€" or "15000-20000"
    const match = value.replace(/\./g, '').match(/(\d+)/)
    return match ? parseInt(match[1], 10) : null
  }
  return null
}

function dispositionToScoreTier(disposition, state) {
  // Base score from disposition
  let score = disposition === 'hot' ? 80 : disposition === 'warm' ? 50 : 20

  // Adjust based on data completeness
  if (state.project_type) score += 5
  if (state.city) score += 5
  if (state.budget_max && state.budget_max !== 'unknown') score += 10
  if (state.timeline_start) score += 5
  if (state.contact_phone) score += 15

  // Cap at 100
  score = Math.min(100, score)

  // Calculate tier
  const tier = score >= 80 ? 1 : score >= 60 ? 2 : score >= 40 ? 3 : score >= 20 ? 4 : 5

  return { score, tier }
}

function generateReasons(state, disposition) {
  const reasons = []

  if (state.project_type) {
    reasons.push(`Proyecto: ${state.project_type}`)
  }
  
  if (state.city) {
    reasons.push(`Ubicación: ${state.city}`)
  }

  if (state.budget_max && state.budget_max !== 'unknown') {
    reasons.push(`Presupuesto definido`)
  } else if (state.budget_max === 'unknown') {
    reasons.push(`Presupuesto pendiente de definir`)
  }

  if (state.timeline_start) {
    reasons.push(`Plazo: ${state.timeline_start}`)
  }

  if (state.contact_phone) {
    reasons.push(`Contacto facilitado`)
  }

  // Add disposition-based reason
  if (disposition === 'hot') {
    reasons.push('Proyecto con buen encaje')
  } else if (disposition === 'cold') {
    reasons.push('Proyecto requiere seguimiento')
  }

  return reasons
}

export function calculateFallbackScore(messages, config) {
  const conversation = messages.map(m => m.content.toLowerCase()).join(' ')
  
  let score = 20
  const reasons = []
  const leadFields = {}

  // Check project type
  const projectTypes = {
    'baño': 'baño',
    'cocina': 'cocina',
    'integral': 'integral',
    'reforma completa': 'integral',
    'pintura': 'pintura',
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
      score += 15
      reasons.push('Ciudad cubierta')
      break
    }
  }

  // Check budget mentions
  const budgetMatch = conversation.match(/(\d{4,6})\s*(?:€|euros?|eur)?/i)
  if (budgetMatch) {
    const budget = parseInt(budgetMatch[1], 10)
    leadFields.budget = budget
    score += 15
    reasons.push('Presupuesto mencionado')
  }

  // Check timeline
  if (conversation.match(/(mes|semana|pronto|cuanto antes|verano|primavera|otoño)/i)) {
    leadFields.timeline = 'Definido'
    score += 10
    reasons.push('Plazo mencionado')
  }

  // Check contact
  const phoneMatch = conversation.match(/(\d{9}|\+34\s*\d{9})/)
  if (phoneMatch) {
    leadFields.contactPhone = phoneMatch[1]
    score += 15
    reasons.push('Teléfono proporcionado')
  }

  const tier = score >= 80 ? 1 : score >= 60 ? 2 : score >= 40 ? 3 : score >= 20 ? 4 : 5

  return {
    displayText: null,
    leadFields,
    score,
    tier,
    reasons,
    nextQuestion: null,
  }
}

export function scoreToTier(score) {
  if (score >= 80) return 1
  if (score >= 60) return 2
  if (score >= 40) return 3
  if (score >= 20) return 4
  return 5
}
