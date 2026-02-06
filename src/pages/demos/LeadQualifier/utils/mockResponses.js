// Estado persistente del lead durante la conversación mock
let mockLeadState = {
  projectType: null,
  city: null,
  sqm: null,
  budget: null,
  timeline: null,
  isOwner: null,
  hasDocs: null,
  contactName: null,
  contactPhone: null,
}

// Detectores de información
const PROJECT_TYPES = {
  'reforma integral': 'integral',
  'reforma completa': 'integral',
  'integral': 'integral',
  'completa': 'integral',
  'piso entero': 'integral',
  'todo el piso': 'integral',
  'baño': 'baño',
  'bano': 'baño',
  'aseo': 'baño',
  'cocina': 'cocina',
  'pintura': 'pintura',
  'pintar': 'pintura',
  'suelo': 'suelo',
  'suelos': 'suelo',
  'parquet': 'suelo',
}

const PROJECT_LABELS = {
  'integral': 'reforma integral',
  'baño': 'baño',
  'cocina': 'cocina',
  'pintura': 'pintura',
  'suelo': 'suelos',
}

function detectProjectType(text) {
  const lower = text.toLowerCase()
  // Priorizar "reforma integral/completa" sobre palabras individuales
  for (const [keyword, type] of Object.entries(PROJECT_TYPES)) {
    if (lower.includes(keyword)) {
      return type
    }
  }
  return null
}

function detectCity(text, coveredCities) {
  const lower = text.toLowerCase()
  for (const city of coveredCities) {
    if (lower.includes(city.toLowerCase())) {
      return city
    }
  }
  // Ciudades no cubiertas
  const uncovered = ['madrid', 'valencia', 'sevilla', 'bilbao', 'malaga', 'zaragoza']
  for (const city of uncovered) {
    if (lower.includes(city)) {
      return { city, covered: false }
    }
  }
  return null
}

function detectNumber(text) {
  const match = text.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : null
}

function detectBoolean(text) {
  const lower = text.toLowerCase()
  if (lower.includes('sí') || lower.includes('si') || lower === 'yes' || 
      lower.includes('claro') || lower.includes('por supuesto') ||
      lower.includes('correcto') || lower.includes('exacto')) {
    return true
  }
  if (lower.includes('no') || lower.includes('ninguno') || lower.includes('nada')) {
    return false
  }
  return null
}

function detectTimeline(text) {
  const lower = text.toLowerCase()
  if (lower.includes('cuanto antes') || lower.includes('urgente') || lower.includes('ya')) {
    return 'Lo antes posible'
  }
  if (lower.includes('semana')) return '1-2 semanas'
  if (lower.includes('mes')) return '1-3 meses'
  if (lower.includes('verano')) return 'Verano'
  if (lower.includes('otoño')) return 'Otoño'
  if (lower.includes('primavera')) return 'Primavera'
  if (lower.includes('año')) return 'Este año'
  const monthMatch = lower.match(/(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i)
  if (monthMatch) return monthMatch[1].charAt(0).toUpperCase() + monthMatch[1].slice(1)
  return null
}

function detectContact(text) {
  const phone = text.match(/(\d{9}|\+34\s*\d{9}|\d{3}[\s.-]?\d{3}[\s.-]?\d{3})/)
  const email = text.match(/[\w.-]+@[\w.-]+\.\w+/)
  const nameMatch = text.match(/(?:me llamo|soy|mi nombre es)\s+([A-Za-záéíóúñÁÉÍÓÚÑ]+)/i)
  return {
    phone: phone ? phone[1].replace(/[\s.-]/g, '') : null,
    email: email ? email[0] : null,
    name: nameMatch ? nameMatch[1] : null,
  }
}

function calculateScore(state, config) {
  let score = 0
  const reasons = []

  if (state.projectType) {
    score += 10
    reasons.push('Tipo de proyecto identificado')
  }
  
  if (state.city) {
    const covered = config.coveredCities.some(c => c.toLowerCase() === state.city.toLowerCase())
    if (covered) {
      score += 20
      reasons.push('Ciudad cubierta')
    } else {
      reasons.push('Ciudad fuera de cobertura')
    }
  }

  if (state.sqm) {
    score += 5
    reasons.push('Superficie conocida')
  }

  if (state.budget) {
    const minBudget = config.minBudgets[state.projectType] || config.minBudgets.baño
    if (state.budget >= minBudget) {
      score += 25
      reasons.push('Presupuesto adecuado')
    } else {
      reasons.push('Presupuesto ajustado')
    }
  }

  if (state.timeline) {
    score += 10
    reasons.push('Plazo definido')
  }

  if (state.isOwner === true) {
    score += 15
    reasons.push('Es propietario')
  } else if (state.isOwner === false) {
    reasons.push('No es propietario')
  }

  if (state.hasDocs) {
    score += 5
    reasons.push('Tiene documentación')
  }

  if (state.contactPhone || state.contactEmail) {
    score += 10
    reasons.push('Datos de contacto facilitados')
  }

  const tier = score >= 80 ? 1 : score >= 60 ? 2 : score >= 40 ? 3 : score >= 20 ? 4 : 5

  return { score, tier, reasons }
}

function getNextQuestion(state) {
  if (!state.projectType) return null // Ya se preguntó en el welcome
  if (!state.city) return '¿En qué ciudad está el inmueble?'
  if (!state.sqm) return '¿Cuántos metros cuadrados tiene aproximadamente?'
  if (!state.budget) return '¿Cuál es tu presupuesto aproximado?'
  if (!state.timeline) return '¿Cuándo te gustaría empezar la obra?'
  if (state.isOwner === null) return '¿Eres el propietario del inmueble?'
  if (state.hasDocs === null) return '¿Tienes planos o fotos del espacio?'
  if (!state.contactPhone) return '¿Me das un teléfono de contacto?'
  return null
}

export function getMockResponse(messages, config) {
  const userMessages = messages.filter(m => m.role === 'user')
  const lastUserMessage = userMessages[userMessages.length - 1]?.content || ''
  const allUserText = userMessages.map(m => m.content).join(' ')

  // Detectar información del mensaje actual
  const detectedType = detectProjectType(lastUserMessage)
  const detectedCity = detectCity(lastUserMessage, config.coveredCities)
  const detectedNumber = detectNumber(lastUserMessage)
  const detectedBoolean = detectBoolean(lastUserMessage)
  const detectedTimeline = detectTimeline(lastUserMessage)
  const detectedContact = detectContact(lastUserMessage)

  // Actualizar estado según el contexto de la conversación
  if (detectedType && !mockLeadState.projectType) {
    mockLeadState.projectType = detectedType
  }

  if (detectedCity) {
    if (typeof detectedCity === 'string') {
      mockLeadState.city = detectedCity
    } else if (!detectedCity.covered) {
      // Ciudad no cubierta - cerrar conversación
      return {
        displayText: config.tier5CloseText,
        leadFields: { ...mockLeadState, city: detectedCity.city },
        score: 5,
        tier: 5,
        reasons: ['Ciudad fuera de cobertura'],
        nextQuestion: null,
      }
    }
  }

  // Asignar números según el contexto
  if (detectedNumber) {
    if (!mockLeadState.sqm && mockLeadState.city && detectedNumber < 500) {
      mockLeadState.sqm = detectedNumber
    } else if (!mockLeadState.budget && mockLeadState.sqm && detectedNumber >= 1000) {
      mockLeadState.budget = detectedNumber
      // Verificar presupuesto mínimo
      const minBudget = config.minBudgets[mockLeadState.projectType] || config.minBudgets.integral
      if (detectedNumber < minBudget) {
        return {
          displayText: `Entiendo. Para una ${PROJECT_LABELS[mockLeadState.projectType] || 'reforma'} de calidad, el presupuesto mínimo suele ser de ${minBudget.toLocaleString('es-ES')}€. ${config.tier5CloseText}`,
          leadFields: { ...mockLeadState },
          score: 10,
          tier: 5,
          reasons: ['Presupuesto insuficiente'],
          nextQuestion: null,
        }
      }
    }
  }

  if (detectedTimeline && !mockLeadState.timeline) {
    mockLeadState.timeline = detectedTimeline
  }

  if (detectedBoolean !== null) {
    if (mockLeadState.timeline && mockLeadState.isOwner === null) {
      mockLeadState.isOwner = detectedBoolean
    } else if (mockLeadState.isOwner !== null && mockLeadState.hasDocs === null) {
      mockLeadState.hasDocs = detectedBoolean
    }
  }

  if (detectedContact.phone) mockLeadState.contactPhone = detectedContact.phone
  if (detectedContact.email) mockLeadState.contactEmail = detectedContact.email
  if (detectedContact.name) mockLeadState.contactName = detectedContact.name

  // Calcular score y tier
  const { score, tier, reasons } = calculateScore(mockLeadState, config)
  const nextQuestion = getNextQuestion(mockLeadState)

  // Generar respuesta según el estado actual
  let displayText = ''
  const projectLabel = PROJECT_LABELS[mockLeadState.projectType] || 'reforma'

  if (!mockLeadState.projectType) {
    // Intentar detectar del mensaje aunque sea el primero
    const typeFromFirst = detectProjectType(lastUserMessage)
    if (typeFromFirst) {
      mockLeadState.projectType = typeFromFirst
      displayText = `¡Perfecto! Una ${PROJECT_LABELS[typeFromFirst]} es un proyecto muy interesante. ¿Me podrías decir en qué ciudad está ubicado el inmueble?`
    } else {
      displayText = '¿Podrías decirme qué tipo de reforma necesitas? Por ejemplo: baño, cocina, reforma integral...'
    }
  } else if (!mockLeadState.city) {
    if (detectedType) {
      displayText = `¡Perfecto! Una ${projectLabel} es un proyecto muy interesante. ¿Me podrías decir en qué ciudad está ubicado el inmueble?`
    } else {
      displayText = `Entendido. ¿En qué ciudad está ubicado el inmueble donde quieres hacer la ${projectLabel}?`
    }
  } else if (!mockLeadState.sqm) {
    displayText = `¡Genial! ${mockLeadState.city} está dentro de nuestra zona de cobertura. ¿Cuántos metros cuadrados tiene aproximadamente el espacio a reformar?`
  } else if (!mockLeadState.budget) {
    displayText = `Perfecto, ${mockLeadState.sqm} m² es un buen tamaño para trabajar. ¿Tienes un presupuesto aproximado en mente para esta ${projectLabel}?`
  } else if (!mockLeadState.timeline) {
    displayText = `Muy bien, ese presupuesto está dentro de lo habitual para una ${projectLabel} de calidad. ¿Cuándo te gustaría comenzar con la obra?`
  } else if (mockLeadState.isOwner === null) {
    displayText = 'Perfecto, tenemos disponibilidad para esas fechas. Una pregunta importante: ¿eres el propietario del inmueble?'
  } else if (mockLeadState.hasDocs === null) {
    displayText = mockLeadState.isOwner 
      ? '¡Excelente! Eso facilita mucho el proceso. ¿Dispones de planos del espacio actual o fotos que puedas compartir?'
      : 'Entendido, necesitaremos la autorización del propietario. ¿Dispones de planos o fotos del espacio?'
  } else if (!mockLeadState.contactPhone) {
    displayText = 'Genial. Para finalizar, ¿podrías darme tu nombre y un teléfono de contacto para que un técnico pueda llamarte?'
  } else {
    displayText = `¡Muchas gracias${mockLeadState.contactName ? ', ' + mockLeadState.contactName : ''}! Hemos registrado toda la información de tu proyecto de ${projectLabel} en ${mockLeadState.city}. Un técnico de Total Homes te contactará en las próximas 24-48 horas para concertar una visita sin compromiso.`
  }

  return {
    displayText,
    leadFields: { ...mockLeadState },
    score,
    tier,
    reasons,
    nextQuestion,
  }
}

export function resetMockFlow() {
  mockLeadState = {
    projectType: null,
    city: null,
    sqm: null,
    budget: null,
    timeline: null,
    isOwner: null,
    hasDocs: null,
    contactName: null,
    contactPhone: null,
  }
}
