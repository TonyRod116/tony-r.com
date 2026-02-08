// Valor estándar cuando el cliente no quiere / no puede responder (existe en JSON como n/a)
const NO_ANSWER = 'n/a'

// Estado persistente del lead durante la conversación mock
let mockLeadState = {
  projectType: null,
  city: null,
  sqm: null,
  budget: null,
  timeline: null,
  contactName: null,
  contactPhone: null,
  contactEmail: null,
  wantsCallBack: null,
  contactCallbackRefusedOnce: false, // primer "no" a contactar → mostrar explicación
  doNotContact: false,              // segundo "no" → no contactar, peor clasificación
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
  'ventanas': 'ventanas',
  'ventana': 'ventanas',
  'puertas': 'puertas',
  'puerta': 'puertas',
  'carpintería': 'otro',
  'carpinteria': 'otro',
  'otros': 'otro',
  'otro': 'otro',
}

const PROJECT_LABELS = {
  'integral': 'reforma integral',
  'baño': 'baño',
  'cocina': 'cocina',
  'pintura': 'pintura',
  'suelo': 'suelos',
  'ventanas': 'cambio de ventanas',
  'puertas': 'cambio de puertas',
  'otro': 'otro',
}

function detectProjectType(text) {
  const lower = text.toLowerCase().trim()
  if (!lower || lower.length < 2) return null
  // Priorizar "reforma integral/completa" sobre palabras individuales
  for (const [keyword, type] of Object.entries(PROJECT_TYPES)) {
    if (lower.includes(keyword)) {
      return type
    }
  }
  // Si parece una descripción de proyecto (cambiar X, reformar X, quiero X) → otros
  if (/^(cambiar|reformar|arreglar|hacer|quiero|necesito|poner)\s+.+/.test(lower) || /^.+\s+(nuev[oa]s?|nueva|nuevo)$/.test(lower)) {
    return 'otro'
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
  const lower = text.toLowerCase().trim()
  if (lower.includes('cuanto antes') || lower.includes('urgente') || lower.includes('ya') || lower === 'cuando antes') {
    return 'Lo antes posible'
  }
  // Días de la semana: "el lunes", "lunes", "para el martes"...
  const weekdays = ['lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes', 'sábado', 'sabado', 'domingo']
  for (const day of weekdays) {
    if (lower.includes(day)) {
      const label = day === 'miercoles' ? 'Miércoles' : day === 'sabado' ? 'Sábado' : day.charAt(0).toUpperCase() + day.slice(1)
      return lower.includes('próxim') || lower.includes('proxim') || lower.includes('que viene') ? `Próximo ${label}` : label
    }
  }
  if (lower.includes('mañana') || lower.includes('manana')) return 'Mañana'
  if (lower.includes('semana que viene') || lower.includes('próxima semana') || lower.includes('proxima semana')) return 'La semana que viene'
  if (lower.includes('semana')) return '1-2 semanas'
  if (lower.includes('mes')) return '1-3 meses'
  if (lower.includes('verano')) return 'Verano'
  if (lower.includes('otoño') || lower.includes('otono')) return 'Otoño'
  if (lower.includes('primavera')) return 'Primavera'
  if (lower.includes('año') || lower.includes('ano')) return 'Este año'
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
  if (state.doNotContact) {
    return { score: 0, tier: 5, reasons: ['Cliente no quiere ser contactado'] }
  }
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

  if (state.budget && state.budget !== NO_ANSWER) {
    const budgetNum = typeof state.budget === 'number' ? state.budget : parseInt(state.budget, 10)
    if (!isNaN(budgetNum)) {
      const minBudget = config.budgetRanges?.[state.projectType]?.min || config.budgetRanges?.baño?.min || 12000
      if (budgetNum >= minBudget) {
        score += 25
        reasons.push('Presupuesto adecuado')
      } else {
        reasons.push('Presupuesto ajustado')
      }
      const bonusThreshold = config.budgetBonusThreshold
      if (bonusThreshold && budgetNum >= bonusThreshold) {
        score += 15
        reasons.push('Presupuesto alto (bonus)')
      }
    }
  }

  if (state.timeline && state.timeline !== NO_ANSWER) {
    score += 15
    reasons.push('Plazo definido')
  } else {
    score -= 10
    reasons.push('Plazo no indicado')
  }

  if (state.contactPhone || state.contactEmail) {
    score += 10
    reasons.push('Datos de contacto facilitados')
  }

  if (state.wantsCallBack === true) {
    score += 5
    reasons.push('Quiere que le contactemos')
  }

  const tier = score >= 80 ? 1 : score >= 60 ? 2 : score >= 40 ? 3 : score >= 20 ? 4 : 5

  return { score, tier, reasons }
}

function getNextQuestion(state) {
  if (!state.projectType) return null
  if (!state.city) return '¿En qué ciudad está el inmueble?'
  if (!state.sqm) {
    if (state.projectType === 'ventanas') return '¿Cuántas ventanas son?'
    if (state.projectType === 'puertas') return '¿Cuántas puertas son?'
    return '¿Cuántos metros cuadrados tiene aproximadamente?'
  }
  // Plazo siempre se pregunta después del alcance (m²/ventanas) y antes del presupuesto
  if (!state.timeline) return '¿Cuándo te gustaría empezar la obra?'
  if (!state.budget) return '¿Cuál es tu presupuesto aproximado?'
  if (!state.contactPhone && !state.contactEmail) return '¿Me das un teléfono o email de contacto?'
  if (state.wantsCallBack === null) return 'Ya tenemos todo. En breve nos pondremos en contacto con usted, ¿le parece bien?'
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
        displayText: 'Lo siento, actualmente no tenemos cobertura en esa zona. Te agradecemos tu interés y esperamos poder ayudarte en el futuro.',
        leadFields: { ...mockLeadState, city: detectedCity.city },
        score: 5,
        tier: 5,
        reasons: ['Ciudad fuera de cobertura'],
        nextQuestion: null,
      }
    }
  }

  // Asignar números según el contexto (m², nº ventanas/puertas, o presupuesto)
  if (detectedNumber) {
    const isVentanasOPuertas = mockLeadState.projectType === 'ventanas' || mockLeadState.projectType === 'puertas'
    const looksLikeCount = isVentanasOPuertas ? (detectedNumber >= 1 && detectedNumber <= 99) : (detectedNumber < 500)
    if (!mockLeadState.sqm && mockLeadState.city && (detectedNumber < 500 || looksLikeCount)) {
      mockLeadState.sqm = detectedNumber
    } else if (!mockLeadState.budget && mockLeadState.budget !== NO_ANSWER && mockLeadState.sqm && mockLeadState.sqm !== NO_ANSWER && detectedNumber >= 1000) {
      mockLeadState.budget = detectedNumber
      // Verificar presupuesto mínimo
      const minBudget = config.budgetRanges?.[mockLeadState.projectType]?.min || config.budgetRanges?.integral?.min || 50000
      if (detectedNumber < minBudget) {
        return {
          displayText: `Entiendo. Para una ${PROJECT_LABELS[mockLeadState.projectType] || 'reforma'} de calidad, el presupuesto mínimo suele ser de ${minBudget.toLocaleString('es-ES')}€. Te agradecemos tu interés y si en el futuro dispones de más presupuesto, estaremos encantados de ayudarte.`,
          leadFields: { ...mockLeadState },
          score: 10,
          tier: 5,
          reasons: ['Presupuesto insuficiente'],
          nextQuestion: null,
        }
      }
    }
  }

  const lower = lastUserMessage.toLowerCase().trim()
  const refusesToAnswer = lower.includes('no lo sé') || lower.includes('no lo se') || lower.includes('no sé') ||
    lower.includes('no se') || lower.includes('no tengo') || lower.includes('ni idea') ||
    lower.includes('prefiero no decirlo') || lower.includes('no quiero decir') || lower.includes('no quiero responder') ||
    lower.includes('paso') || lower.includes('no sabría') || lower.includes('no sabria') ||
    (lower.includes('no') && lower.length < 15)

  // Presupuesto: si dice "no", "no estoy mirando", etc., marcar n/a (solo cuando ya hemos preguntado timeline)
  const refusesBudget = mockLeadState.timeline && !mockLeadState.budget && !detectedNumber &&
    (lower.startsWith('no') || lower.includes('no,') || lower.includes('no sé') || lower.includes('no se') ||
     lower.includes('no tengo') || lower.includes('estoy mirando') || lower.includes('aún no') ||
     lower.includes('todavía no') || lower === 'no')
  if (refusesBudget) {
    mockLeadState.budget = NO_ANSWER
  }

  // Si no quiere responder / no sabe: marcar el campo pendiente como n/a y seguir. La ciudad NO se marca n/a: es requisito indispensable.
  // Orden: sqm → timeline → budget → contact (plazo se pregunta antes que presupuesto)
  if (refusesToAnswer && !detectedNumber && !detectedCity && !detectedTimeline && !detectedContact.phone && !detectedContact.email) {
    if (mockLeadState.city && !mockLeadState.sqm) {
      mockLeadState.sqm = NO_ANSWER
    } else if (mockLeadState.sqm && !mockLeadState.timeline) {
      mockLeadState.timeline = NO_ANSWER
    } else if (mockLeadState.timeline && !mockLeadState.budget) {
      mockLeadState.budget = NO_ANSWER
    } else if (mockLeadState.budget && !mockLeadState.contactPhone && !mockLeadState.contactEmail) {
      mockLeadState.contactPhone = NO_ANSWER
      mockLeadState.contactEmail = NO_ANSWER
      mockLeadState.wantsCallBack = false
    } else if ((mockLeadState.contactPhone || mockLeadState.contactEmail) && mockLeadState.wantsCallBack === null) {
      if (mockLeadState.contactCallbackRefusedOnce) {
        mockLeadState.wantsCallBack = false
        mockLeadState.doNotContact = true
      } else {
        mockLeadState.contactCallbackRefusedOnce = true
      }
    }
    // Si falta ciudad, NO ponemos n/a: se pide con el mensaje de requisito indispensable
  }

  if (detectedTimeline && !mockLeadState.timeline) {
    mockLeadState.timeline = detectedTimeline
  }

  if (detectedBoolean !== null) {
    if ((mockLeadState.contactPhone || mockLeadState.contactEmail) && mockLeadState.wantsCallBack === null) {
      if (detectedBoolean === true) {
        mockLeadState.wantsCallBack = true
      } else {
        if (!mockLeadState.contactCallbackRefusedOnce) {
          mockLeadState.contactCallbackRefusedOnce = true
        } else {
          mockLeadState.wantsCallBack = false
          mockLeadState.doNotContact = true
        }
      }
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
      const label = PROJECT_LABELS[typeFromFirst] || 'reforma'
      const articulo = (typeFromFirst === 'ventanas' || typeFromFirst === 'puertas') ? 'Un' : 'Una'
      displayText = typeFromFirst === 'otro'
        ? '¡Perfecto! ¿En qué ciudad o zona está ubicado el inmueble?'
        : `¡Perfecto! ${articulo} ${label} es un proyecto muy interesante. ¿Me podrías decir en qué ciudad está ubicado el inmueble?`
    } else {
      displayText = '¿Podrías decirme qué tipo de reforma o trabajo necesitas? Por ejemplo: baño, cocina, reforma integral, ventanas, u otro tipo.'
    }
  } else if (!mockLeadState.city) {
    if (refusesToAnswer) {
      displayText = 'Te entiendo. Para poder ayudarte necesitamos saber si damos servicio en tu zona; es un requisito indispensable. Si te sientes más cómodo, basta con la localidad o el código postal, no hace falta calle ni número. ¿En qué zona está el proyecto?'
    } else if (detectedType) {
      const articulo = (mockLeadState.projectType === 'ventanas' || mockLeadState.projectType === 'puertas') ? 'Un' : 'Una'
      displayText = mockLeadState.projectType === 'otro'
        ? '¡Perfecto! ¿En qué ciudad o zona está ubicado el inmueble?'
        : `¡Perfecto! ${articulo} ${projectLabel} es un proyecto muy interesante. ¿Me podrías decir en qué ciudad o zona está ubicado el inmueble?`
    } else {
      displayText = `Entendido. ¿En qué ciudad o zona está el inmueble? Puedes indicar solo localidad o código postal.`
    }
  } else if (!mockLeadState.sqm) {
    if (mockLeadState.projectType === 'ventanas') {
      displayText = `¡Genial! ${mockLeadState.city} está dentro de nuestra zona. ¿Cuántas ventanas son?`
    } else if (mockLeadState.projectType === 'puertas') {
      displayText = `¡Genial! ${mockLeadState.city} está dentro de nuestra zona. ¿Cuántas puertas son?`
    } else {
      displayText = `¡Genial! ${mockLeadState.city} está dentro de nuestra zona de cobertura. ¿Cuántos metros cuadrados tiene aproximadamente el espacio a reformar?`
    }
  } else if (mockLeadState.sqm === NO_ANSWER && !mockLeadState.timeline) {
    displayText = `No pasa nada. ¿Cuándo te gustaría empezar la obra?`
  } else if (!mockLeadState.timeline) {
    const alcanceText = mockLeadState.projectType === 'ventanas'
      ? `${mockLeadState.sqm} ventanas`
      : mockLeadState.projectType === 'puertas'
        ? `${mockLeadState.sqm} puertas`
        : `${mockLeadState.sqm} m²`
    displayText = `Perfecto, ${alcanceText}. ¿Cuándo te gustaría empezar la obra?`
  } else if (mockLeadState.timeline === NO_ANSWER && !mockLeadState.budget) {
    const paraProyecto = (mockLeadState.projectType === 'ventanas' || mockLeadState.projectType === 'puertas') ? 'este trabajo' : `esta ${projectLabel}`
    displayText = `No pasa nada. ¿Tienes un presupuesto aproximado en mente para ${paraProyecto}?`
  } else if (!mockLeadState.budget) {
    const paraProyecto = (mockLeadState.projectType === 'ventanas' || mockLeadState.projectType === 'puertas') ? 'este trabajo' : `esta ${projectLabel}`
    displayText = `Muy bien. ¿Tienes un presupuesto aproximado en mente para ${paraProyecto}?`
  } else if (!mockLeadState.contactPhone && !mockLeadState.contactEmail) {
    displayText = 'Genial. Para finalizar, ¿podrías darme tu nombre y un teléfono o email de contacto?'
  } else if (mockLeadState.doNotContact) {
    displayText = 'Perfecto, lo anotamos. Si cambias de opinión, ya sabes dónde estamos.'
  } else if (mockLeadState.wantsCallBack === null) {
    if (mockLeadState.contactCallbackRefusedOnce && detectedBoolean === false) {
      displayText = 'Si no nos das permiso para contactarte, no podremos atender tu solicitud. ¿Le parece bien que nos pongamos en contacto en breve?'
    } else {
      displayText = 'Ya tenemos todo. En breve nos pondremos en contacto con usted, ¿le parece bien?'
    }
  } else {
    displayText = `¡Muchas gracias${mockLeadState.contactName ? ', ' + mockLeadState.contactName : ''}! Hemos registrado toda la información de tu proyecto de ${projectLabel} en ${mockLeadState.city}. Te contactaremos en las próximas 24-48 horas para concertar una visita sin compromiso.`
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
    contactName: null,
    contactPhone: null,
    contactEmail: null,
    wantsCallBack: null,
    contactCallbackRefusedOnce: false,
    doNotContact: false,
  }
}
