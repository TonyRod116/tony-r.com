// Valor estándar cuando el cliente no quiere / no puede responder (existe en JSON como n/a)
const NO_ANSWER = 'n/a'

const LOCALE_MAP = { en: 'en-US', es: 'es-ES', ca: 'ca-ES' }

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
  contactCallbackRefusedOnce: false,
  doNotContact: false,
}

// Per-language keyword maps for NLP detection
const PROJECT_TYPES_BY_LANG = {
  es: {
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
  },
  en: {
    'full renovation': 'integral',
    'complete renovation': 'integral',
    'whole apartment': 'integral',
    'entire flat': 'integral',
    'bathroom': 'baño',
    'bath': 'baño',
    'kitchen': 'cocina',
    'painting': 'pintura',
    'paint': 'pintura',
    'flooring': 'suelo',
    'floor': 'suelo',
    'parquet': 'suelo',
    'windows': 'ventanas',
    'window': 'ventanas',
    'doors': 'puertas',
    'door': 'puertas',
    'carpentry': 'otro',
    'other': 'otro',
  },
  ca: {
    'reforma integral': 'integral',
    'reforma completa': 'integral',
    'integral': 'integral',
    'completa': 'integral',
    'pis sencer': 'integral',
    'tot el pis': 'integral',
    'bany': 'baño',
    'cuina': 'cocina',
    'pintura': 'pintura',
    'pintar': 'pintura',
    'terra': 'suelo',
    'terres': 'suelo',
    'parquet': 'suelo',
    'finestres': 'ventanas',
    'finestra': 'ventanas',
    'portes': 'puertas',
    'porta': 'puertas',
    'fusteria': 'otro',
    'altre': 'otro',
    'altres': 'otro',
  },
}

// Merge all language keywords for detection
function getAllProjectTypes(language) {
  // Primary language first, then others as fallback
  const primary = PROJECT_TYPES_BY_LANG[language] || PROJECT_TYPES_BY_LANG.es
  const all = { ...PROJECT_TYPES_BY_LANG.es, ...PROJECT_TYPES_BY_LANG.en, ...PROJECT_TYPES_BY_LANG.ca, ...primary }
  return all
}

function detectProjectType(text, language) {
  const lower = text.toLowerCase().trim()
  if (!lower || lower.length < 2) return null
  const types = getAllProjectTypes(language)
  for (const [keyword, type] of Object.entries(types)) {
    if (lower.includes(keyword)) {
      return type
    }
  }
  // Generic action verbs across languages
  if (/^(cambiar|reformar|arreglar|hacer|quiero|necesito|poner|change|fix|want|need|install|canviar|arreglar|fer|vull|necessito)\s+.+/.test(lower)) {
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

function detectBoolean(text, language) {
  const lower = text.toLowerCase()
  const yesPatterns = {
    es: ['sí', 'si', 'claro', 'por supuesto', 'correcto', 'exacto'],
    en: ['yes', 'sure', 'of course', 'correct', 'exactly', 'yeah', 'yep'],
    ca: ['sí', 'si', 'clar', 'per descomptat', 'correcte', 'exacte'],
  }
  const noPatterns = {
    es: ['no', 'ninguno', 'nada'],
    en: ['no', 'none', 'nothing', 'nope'],
    ca: ['no', 'cap', 'res'],
  }
  const yes = [...(yesPatterns[language] || []), ...(yesPatterns.es)]
  const no = [...(noPatterns[language] || []), ...(noPatterns.es)]
  if (yes.some(p => lower.includes(p))) return true
  if (no.some(p => lower.includes(p))) return false
  return null
}

function detectTimeline(text, language, t) {
  const lower = text.toLowerCase().trim()

  // ASAP detection
  const asapPatterns = {
    es: ['cuanto antes', 'urgente', 'ya', 'cuando antes'],
    en: ['asap', 'urgent', 'right away', 'immediately', 'now', 'as soon as possible'],
    ca: ['com més aviat', 'urgent', 'ara', 'quan abans'],
  }
  const asap = [...(asapPatterns[language] || []), ...(asapPatterns.es)]
  if (asap.some(p => lower.includes(p))) return t('demos.leadQualifier.timeline.asap')

  // Tomorrow
  const tomorrowPatterns = { es: ['mañana', 'manana'], en: ['tomorrow'], ca: ['demà', 'dema'] }
  const tomorrow = [...(tomorrowPatterns[language] || []), ...(tomorrowPatterns.es)]
  if (tomorrow.some(p => lower.includes(p))) return t('demos.leadQualifier.timeline.tomorrow')

  // Next week
  const nextWeekPatterns = {
    es: ['semana que viene', 'próxima semana', 'proxima semana'],
    en: ['next week'],
    ca: ['setmana que ve', 'propera setmana'],
  }
  const nextWeek = [...(nextWeekPatterns[language] || []), ...(nextWeekPatterns.es)]
  if (nextWeek.some(p => lower.includes(p))) return t('demos.leadQualifier.timeline.nextWeek')

  // Weeks
  const weekPatterns = { es: ['semana'], en: ['week'], ca: ['setmana'] }
  const week = [...(weekPatterns[language] || []), ...(weekPatterns.es)]
  if (week.some(p => lower.includes(p))) return t('demos.leadQualifier.timeline.oneToTwoWeeks')

  // Months
  const monthPatterns = { es: ['mes'], en: ['month'], ca: ['mes'] }
  const month = [...(monthPatterns[language] || []), ...(monthPatterns.es)]
  if (month.some(p => lower.includes(p))) return t('demos.leadQualifier.timeline.oneToThreeMonths')

  // Seasons
  const summerPatterns = { es: ['verano'], en: ['summer'], ca: ['estiu'] }
  if ([...(summerPatterns[language] || []), ...(summerPatterns.es)].some(p => lower.includes(p))) return t('demos.leadQualifier.timeline.summer')

  const autumnPatterns = { es: ['otoño', 'otono'], en: ['autumn', 'fall'], ca: ['tardor'] }
  if ([...(autumnPatterns[language] || []), ...(autumnPatterns.es)].some(p => lower.includes(p))) return t('demos.leadQualifier.timeline.autumn')

  const springPatterns = { es: ['primavera'], en: ['spring'], ca: ['primavera'] }
  if ([...(springPatterns[language] || []), ...(springPatterns.es)].some(p => lower.includes(p))) return t('demos.leadQualifier.timeline.spring')

  // Year
  const yearPatterns = { es: ['año', 'ano'], en: ['year'], ca: ['any'] }
  if ([...(yearPatterns[language] || []), ...(yearPatterns.es)].some(p => lower.includes(p))) return t('demos.leadQualifier.timeline.thisYear')

  return null
}

function detectContact(text, language) {
  const phone = text.match(/(\d{9}|\+34\s*\d{9}|\d{3}[\s.-]?\d{3}[\s.-]?\d{3})/)
  const email = text.match(/[\w.-]+@[\w.-]+\.\w+/)
  const namePatterns = {
    es: /(?:me llamo|soy|mi nombre es)\s+([A-Za-záéíóúñÁÉÍÓÚÑ]+)/i,
    en: /(?:my name is|i'm|i am)\s+([A-Za-záéíóúñÁÉÍÓÚÑ]+)/i,
    ca: /(?:em dic|soc|el meu nom és)\s+([A-Za-záéíóúñÁÉÍÓÚÑàèòçïü]+)/i,
  }
  const nameRegex = namePatterns[language] || namePatterns.es
  const nameMatch = text.match(nameRegex) || text.match(namePatterns.es)
  return {
    phone: phone ? phone[1].replace(/[\s.-]/g, '') : null,
    email: email ? email[0] : null,
    name: nameMatch ? nameMatch[1] : null,
  }
}

function calculateScore(state, config, t) {
  if (state.doNotContact) {
    return { score: 0, tier: 5, reasons: [t('demos.leadQualifier.mock.clientDoesNotWantContact')] }
  }
  let score = 0
  const reasons = []

  if (state.projectType) {
    score += 10
    reasons.push(t('demos.leadQualifier.scoring.projectTypeIdentified'))
  }

  if (state.city) {
    const covered = config.coveredCities.some(c => c.toLowerCase() === state.city.toLowerCase())
    if (covered) {
      score += 20
      reasons.push(t('demos.leadQualifier.scoring.coveredCity'))
    } else {
      reasons.push(t('demos.leadQualifier.scoring.uncoveredCity'))
    }
  }

  if (state.sqm) {
    score += 5
    reasons.push(t('demos.leadQualifier.scoring.surfaceKnown'))
  }

  if (state.budget && state.budget !== NO_ANSWER) {
    const budgetNum = typeof state.budget === 'number' ? state.budget : parseInt(state.budget, 10)
    if (!isNaN(budgetNum)) {
      const minBudget = config.budgetRanges?.[state.projectType]?.min || config.budgetRanges?.baño?.min || 5000
      if (budgetNum >= minBudget) {
        score += 25
        reasons.push(t('demos.leadQualifier.scoring.adequateBudget'))
      } else {
        reasons.push(t('demos.leadQualifier.scoring.tightBudget'))
      }
      const bonusThreshold = config.budgetBonusThreshold
      if (bonusThreshold && budgetNum >= bonusThreshold) {
        score += 15
        reasons.push(t('demos.leadQualifier.scoring.highBudgetBonus'))
      }
    }
  }

  if (state.timeline && state.timeline !== NO_ANSWER) {
    score += 15
    reasons.push(t('demos.leadQualifier.scoring.timelineMentioned'))
  } else {
    score -= 10
    reasons.push(t('demos.leadQualifier.mock.timelineNotIndicated'))
  }

  if (state.contactPhone || state.contactEmail) {
    score += 10
    reasons.push(t('demos.leadQualifier.mock.contactDataProvided'))
  }

  if (state.wantsCallBack === true) {
    score += 5
    reasons.push(t('demos.leadQualifier.mock.wantsUsToContact'))
  }

  const tier = score >= 80 ? 1 : score >= 60 ? 2 : score >= 40 ? 3 : score >= 20 ? 4 : 5

  return { score, tier, reasons }
}

function getNextQuestion(state, t) {
  if (!state.projectType) return null
  if (!state.city) return t('demos.leadQualifier.questions.city')
  if (!state.sqm) {
    if (state.projectType === 'ventanas') return t('demos.leadQualifier.questions.windowsCount')
    if (state.projectType === 'puertas') return t('demos.leadQualifier.questions.doorsCount')
    return t('demos.leadQualifier.questions.sqm')
  }
  if (!state.timeline) return t('demos.leadQualifier.questions.timeline')
  if (!state.budget) return t('demos.leadQualifier.questions.budget')
  if (!state.contactPhone && !state.contactEmail) return t('demos.leadQualifier.questions.contact')
  if (state.wantsCallBack === null) return t('demos.leadQualifier.questions.confirmAll')
  return null
}

function getRefusePatterns(language) {
  const patterns = {
    es: ['no lo sé', 'no lo se', 'no sé', 'no se', 'no tengo', 'ni idea', 'prefiero no decirlo', 'no quiero decir', 'no quiero responder', 'paso', 'no sabría', 'no sabria'],
    en: ["i don't know", "don't know", "no idea", "not sure", "prefer not", "i'd rather not", "pass", "no clue", "can't say"],
    ca: ['no ho sé', 'no ho se', 'no sé', 'no se', 'no tinc', 'ni idea', 'prefereixo no dir-ho', 'no vull dir', 'passo', 'no sabria'],
  }
  return [...(patterns[language] || []), ...(patterns.es)]
}

function getBudgetRefusePatterns(language) {
  const patterns = {
    es: ['no', 'no,', 'no sé', 'no se', 'no tengo', 'estoy mirando', 'aún no', 'todavía no'],
    en: ['no', "don't have", 'not sure', "haven't decided", 'still looking', 'not yet'],
    ca: ['no', 'no,', 'no sé', 'no se', 'no tinc', 'estic mirant', 'encara no'],
  }
  return [...(patterns[language] || []), ...(patterns.es)]
}

export function getMockResponse(messages, config, t, language = 'es') {
  const locale = LOCALE_MAP[language] || 'es-ES'
  const userMessages = messages.filter(m => m.role === 'user')
  const lastUserMessage = userMessages[userMessages.length - 1]?.content || ''

  // Detect information from current message
  const detectedType = detectProjectType(lastUserMessage, language)
  const detectedCity = detectCity(lastUserMessage, config.coveredCities)
  const detectedNumber = detectNumber(lastUserMessage)
  const detectedBoolean = detectBoolean(lastUserMessage, language)
  const detectedTimeline = detectTimeline(lastUserMessage, language, t)
  const detectedContact = detectContact(lastUserMessage, language)

  // Update state based on conversation context
  if (detectedType && !mockLeadState.projectType) {
    mockLeadState.projectType = detectedType
  }

  if (detectedCity) {
    if (typeof detectedCity === 'string') {
      mockLeadState.city = detectedCity
    } else if (!detectedCity.covered) {
      return {
        displayText: t('demos.leadQualifier.mock.uncoveredCity'),
        leadFields: { ...mockLeadState, city: detectedCity.city },
        score: 5,
        tier: 5,
        reasons: [t('demos.leadQualifier.mock.cityOutOfCoverage')],
        nextQuestion: null,
      }
    }
  }

  // Assign numbers based on context
  if (detectedNumber) {
    const isVentanasOPuertas = mockLeadState.projectType === 'ventanas' || mockLeadState.projectType === 'puertas'
    const looksLikeCount = isVentanasOPuertas ? (detectedNumber >= 1 && detectedNumber <= 99) : (detectedNumber < 500)
    if (!mockLeadState.sqm && mockLeadState.city && (detectedNumber < 500 || looksLikeCount)) {
      mockLeadState.sqm = detectedNumber
    } else if (!mockLeadState.budget && mockLeadState.budget !== NO_ANSWER && mockLeadState.sqm && mockLeadState.sqm !== NO_ANSWER && detectedNumber >= 1000) {
      mockLeadState.budget = detectedNumber
      const minBudget = config.budgetRanges?.[mockLeadState.projectType]?.min || config.budgetRanges?.integral?.min || 50000
      if (detectedNumber < minBudget) {
        const projectLabel = t(`demos.leadQualifier.projectLabels.${mockLeadState.projectType}`) || t('demos.leadQualifier.projectLabels.otro')
        return {
          displayText: t('demos.leadQualifier.mock.budgetTooLow')
            .replace('{label}', projectLabel)
            .replace('{min}', minBudget.toLocaleString(locale) + '€'),
          leadFields: { ...mockLeadState },
          score: 10,
          tier: 5,
          reasons: [t('demos.leadQualifier.mock.insufficientBudget')],
          nextQuestion: null,
        }
      }
    }
  }

  const lower = lastUserMessage.toLowerCase().trim()
  const refusePatterns = getRefusePatterns(language)
  const refusesToAnswer = refusePatterns.some(p => lower.includes(p)) ||
    (lower.includes('no') && lower.length < 15)

  // Budget refuse detection
  const budgetRefusePatterns = getBudgetRefusePatterns(language)
  const refusesBudget = mockLeadState.timeline && !mockLeadState.budget && !detectedNumber &&
    (budgetRefusePatterns.some(p => lower.startsWith(p) || lower.includes(p)) || lower === 'no')
  if (refusesBudget) {
    mockLeadState.budget = NO_ANSWER
  }

  // Handle refusal to answer
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

  // Calculate score and tier
  const { score, tier, reasons } = calculateScore(mockLeadState, config, t)
  const nextQuestion = getNextQuestion(mockLeadState, t)

  // Generate response based on current state
  let displayText = ''
  const projectLabel = t(`demos.leadQualifier.projectLabels.${mockLeadState.projectType}`) || t('demos.leadQualifier.projectLabels.otro')

  if (!mockLeadState.projectType) {
    const typeFromFirst = detectProjectType(lastUserMessage, language)
    if (typeFromFirst) {
      mockLeadState.projectType = typeFromFirst
      const label = t(`demos.leadQualifier.projectLabels.${typeFromFirst}`) || t('demos.leadQualifier.projectLabels.otro')
      if (typeFromFirst === 'otro') {
        displayText = t('demos.leadQualifier.mock.perfectOther')
      } else {
        const articleMap = { en: 'A', es: 'Una', ca: 'Una' }
        const articleAlt = { en: 'A', es: 'Un', ca: 'Un' }
        const useMasc = typeFromFirst === 'ventanas' || typeFromFirst === 'puertas'
        const article = useMasc ? (articleAlt[language] || 'Un') : (articleMap[language] || 'Una')
        displayText = t('demos.leadQualifier.mock.perfectProject')
          .replace('{article}', article)
          .replace('{label}', label)
      }
    } else {
      displayText = t('demos.leadQualifier.mock.askProjectType')
    }
  } else if (!mockLeadState.city) {
    if (refusesToAnswer) {
      displayText = t('demos.leadQualifier.mock.needLocation')
    } else if (detectedType) {
      if (mockLeadState.projectType === 'otro') {
        displayText = t('demos.leadQualifier.mock.perfectOther')
      } else {
        const useMasc = mockLeadState.projectType === 'ventanas' || mockLeadState.projectType === 'puertas'
        const articleMap = { en: 'A', es: 'Una', ca: 'Una' }
        const articleAlt = { en: 'A', es: 'Un', ca: 'Un' }
        const article = useMasc ? (articleAlt[language] || 'Un') : (articleMap[language] || 'Una')
        displayText = t('demos.leadQualifier.mock.perfectProject')
          .replace('{article}', article)
          .replace('{label}', projectLabel)
      }
    } else {
      displayText = t('demos.leadQualifier.mock.understood')
    }
  } else if (!mockLeadState.sqm) {
    if (mockLeadState.projectType === 'ventanas') {
      displayText = t('demos.leadQualifier.mock.greatCoveredWindows').replace('{city}', mockLeadState.city)
    } else if (mockLeadState.projectType === 'puertas') {
      displayText = t('demos.leadQualifier.mock.greatCoveredDoors').replace('{city}', mockLeadState.city)
    } else {
      displayText = t('demos.leadQualifier.mock.greatCovered').replace('{city}', mockLeadState.city)
    }
  } else if (mockLeadState.sqm === NO_ANSWER && !mockLeadState.timeline) {
    displayText = t('demos.leadQualifier.mock.noWorries') + ' ' + t('demos.leadQualifier.mock.whenStart')
  } else if (!mockLeadState.timeline) {
    let scopeText
    if (mockLeadState.projectType === 'ventanas') {
      scopeText = t('demos.leadQualifier.mock.scopeWindows').replace('{count}', mockLeadState.sqm)
    } else if (mockLeadState.projectType === 'puertas') {
      scopeText = t('demos.leadQualifier.mock.scopeDoors').replace('{count}', mockLeadState.sqm)
    } else {
      scopeText = t('demos.leadQualifier.mock.scopeSqm').replace('{count}', mockLeadState.sqm)
    }
    displayText = t('demos.leadQualifier.mock.perfectScope').replace('{scope}', scopeText)
  } else if (mockLeadState.timeline === NO_ANSWER && !mockLeadState.budget) {
    const isWorkType = mockLeadState.projectType === 'ventanas' || mockLeadState.projectType === 'puertas'
    const projectRef = isWorkType
      ? t('demos.leadQualifier.mock.budgetQuestionWork')
      : t('demos.leadQualifier.mock.budgetQuestionProject').replace('{label}', projectLabel)
    displayText = t('demos.leadQualifier.mock.noWorriesBudget').replace('{project}', projectRef)
  } else if (!mockLeadState.budget) {
    const isWorkType = mockLeadState.projectType === 'ventanas' || mockLeadState.projectType === 'puertas'
    const projectRef = isWorkType
      ? t('demos.leadQualifier.mock.budgetQuestionWork')
      : t('demos.leadQualifier.mock.budgetQuestionProject').replace('{label}', projectLabel)
    displayText = t('demos.leadQualifier.mock.budgetQuestion').replace('{project}', projectRef)
  } else if (!mockLeadState.contactPhone && !mockLeadState.contactEmail) {
    displayText = t('demos.leadQualifier.mock.askContact')
  } else if (mockLeadState.doNotContact) {
    displayText = t('demos.leadQualifier.mock.doNotContactMsg')
  } else if (mockLeadState.wantsCallBack === null) {
    if (mockLeadState.contactCallbackRefusedOnce && detectedBoolean === false) {
      displayText = t('demos.leadQualifier.mock.refusedOnce')
    } else {
      displayText = t('demos.leadQualifier.mock.confirmContact')
    }
  } else {
    const nameStr = mockLeadState.contactName
      ? t('demos.leadQualifier.mock.thankYouName').replace('{contactName}', mockLeadState.contactName)
      : ''
    displayText = t('demos.leadQualifier.mock.thankYou')
      .replace('{name}', nameStr)
      .replace('{label}', projectLabel)
      .replace('{city}', mockLeadState.city)
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
