import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target,
  MapPin,
  Ruler,
  Banknote,
  Calendar,
  FileText,
  User,
  Phone,
  Mail,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

const LOCALE_MAP = { en: 'en-US', es: 'es-ES', ca: 'ca-ES' }

function getClientRatings(t) {
  return {
    excellent: {
      label: t('solutions.leadQualifier.ratings.excellent'),
      color: 'bg-green-500',
      textColor: 'text-green-400',
      description: t('solutions.leadQualifier.ratings.excellentDesc'),
    },
    good: {
      label: t('solutions.leadQualifier.ratings.good'),
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      description: t('solutions.leadQualifier.ratings.goodDesc'),
    },
    regular: {
      label: t('solutions.leadQualifier.ratings.regular'),
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      description: t('solutions.leadQualifier.ratings.regularDesc'),
    },
    poor: {
      label: t('solutions.leadQualifier.ratings.poor'),
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
      description: t('solutions.leadQualifier.ratings.poorDesc'),
    },
    bad: {
      label: t('solutions.leadQualifier.ratings.bad'),
      color: 'bg-red-500',
      textColor: 'text-red-400',
      description: t('solutions.leadQualifier.ratings.badDesc'),
    },
  }
}

function calculateClientRating(leadData, config, t, locale) {
  if (!leadData) return { rating: 'regular', score: 0, factors: [] }
  if (leadData.doNotContact) {
    return { rating: 'bad', score: 0, factors: [] }
  }

  let score = 50
  const factors = []

  const budgetMins = {
    baño: config.budgetRanges?.baño?.min || 5000,
    cocina: config.budgetRanges?.cocina?.min || 8000,
    integral: config.budgetRanges?.integral?.min || 50000,
    pintura: config.budgetRanges?.pintura?.min || 2500,
  }

  const projectType = (leadData.projectType || '').toLowerCase()
  let projectCategory = null
  if (projectType.includes('integral') || projectType.includes('completa') || projectType.includes('piso') || projectType.includes('full') || projectType.includes('sencer')) {
    projectCategory = 'integral'
  } else if (projectType.includes('cocina') || projectType.includes('kitchen') || projectType.includes('cuina')) {
    projectCategory = 'cocina'
  } else if (projectType.includes('baño') || projectType.includes('bathroom') || projectType.includes('bany')) {
    projectCategory = 'baño'
  } else if (projectType.includes('pintura') || projectType.includes('painting')) {
    projectCategory = 'pintura'
  }

  const budget = typeof leadData.budget === 'number' ? leadData.budget : 0
  if (budget > 0 && projectCategory) {
    const minRequired = budgetMins[projectCategory]
    if (budget >= minRequired * 1.5) {
      score += 25
      factors.push({ text: t('solutions.leadQualifier.factors.budgetHigh'), positive: true })
    } else if (budget >= minRequired) {
      score += 15
      factors.push({ text: t('solutions.leadQualifier.factors.budgetAdequate'), positive: true })
    } else if (budget >= minRequired * 0.7) {
      score += 5
      factors.push({ text: t('solutions.leadQualifier.factors.budgetTight'), positive: true })
    }
  } else if (budget > 0) {
    if (budget >= 50000) {
      score += 20
      factors.push({ text: t('solutions.leadQualifier.factors.budgetHigh'), positive: true })
    } else if (budget >= 20000) {
      score += 10
      factors.push({ text: t('solutions.leadQualifier.factors.budgetMedium'), positive: true })
    }
  }

  const timeline = (leadData.timeline || '').toLowerCase()
  const hasTimeline = timeline && timeline !== 'n/a' && timeline !== 'unknown'
  if (hasTimeline) {
    score += 5
    factors.push({ text: t('solutions.leadQualifier.factors.timelineDefined'), positive: true })
    if (timeline.includes('ya') || timeline.includes('inmediato') || timeline.includes('urgente') || timeline.includes('cuanto antes') || timeline.includes('asap') || timeline.includes('now') || timeline.includes('ara')) {
      score += 20
      factors.push({ text: t('solutions.leadQualifier.factors.wantsToStartNow'), positive: true })
    } else if (timeline.includes('mes') || timeline.includes('semana') || timeline.includes('week') || timeline.includes('month') || timeline.includes('setmana')) {
      score += 15
      factors.push({ text: t('solutions.leadQualifier.factors.shortTimeline'), positive: true })
    }
  }

  if (projectCategory === 'integral') {
    score += 15
    factors.push({ text: t('solutions.leadQualifier.factors.fullRenovation'), positive: true })
  } else if (projectCategory === 'cocina') {
    score += 10
    factors.push({ text: t('solutions.leadQualifier.factors.kitchenRenovation'), positive: true })
  } else if (projectCategory === 'baño') {
    score += 5
    factors.push({ text: t('solutions.leadQualifier.factors.bathroomRenovation'), positive: true })
  }

  if (leadData.city && leadData.city !== 'n/a' && leadData.city !== 'unknown') {
    score += 10
    factors.push({ text: t('solutions.leadQualifier.factors.locationConfirmed'), positive: true })
  }

  const hasRealValue = (v) => v != null && String(v).trim() !== '' && !['n/a', 'unknown'].includes(String(v).toLowerCase())
  const hasContact = hasRealValue(leadData.contactPhone) || hasRealValue(leadData.contactEmail)
  if (hasContact) {
    score += 15
    factors.push({ text: t('solutions.leadQualifier.factors.contactProvided'), positive: true })
  }

  const bonusThreshold = config?.budgetBonusThreshold
  if (bonusThreshold && budget >= bonusThreshold) {
    score += 15
    factors.push({ text: t('solutions.leadQualifier.factors.budgetBonus').replace('{threshold}', bonusThreshold.toLocaleString(locale) + '€'), positive: true })
  }

  if (leadData.hasDocs && leadData.hasDocs !== 'No' && leadData.hasDocs !== 'ninguno') {
    score += 5
    factors.push({ text: t('solutions.leadQualifier.factors.hasDocumentation'), positive: true })
  }

  score = Math.max(0, Math.min(100, score))

  const hasCity = leadData.city && leadData.city !== 'n/a' && leadData.city !== 'unknown'
  const priceInfo = estimateProjectPrice(leadData, t, locale)

  let rating
  if (hasContact && hasCity) {
    if (bonusThreshold && (priceInfo.estimatedMin || 0) >= bonusThreshold) {
      rating = 'excellent'
      factors.push({ text: t('solutions.leadQualifier.factors.estimatedBudgetExcellent').replace('{threshold}', bonusThreshold.toLocaleString(locale) + '€'), positive: true })
    } else {
      rating = 'regular'
    }
  } else {
    if (score >= 85) rating = 'excellent'
    else if (score >= 70) rating = 'good'
    else if (score >= 50) rating = 'regular'
    else if (score >= 30) rating = 'poor'
    else rating = 'bad'
  }

  // Solo devolver factores positivos
  const positiveFactors = factors.filter(f => f.positive)

  return { rating, score, factors: positiveFactors }
}

function estimateProjectPrice(leadData, t, locale) {
  if (!leadData) return { displayText: '\u2014', note: '', clientBudget: null, estimated: null, range: null }

  const rawType = (leadData.projectType || '').toLowerCase()
  const projectType = (rawType === 'n/a' || rawType === 'unknown' ? '' : rawType)
  const sqm = typeof leadData.sqm === 'number' ? leadData.sqm : 0
  const budget = typeof leadData.budget === 'number' ? leadData.budget : 0

  if (budget > 0) {
    return {
      clientBudget: budget,
      estimated: null,
      range: null,
      estimatedMin: budget,
      displayText: `${budget.toLocaleString(locale)} \u20AC`,
      note: t('solutions.leadQualifier.priceNotes.clientBudget'),
    }
  }

  let minPrice = 0
  let maxPrice = 0
  let pricePerSqmMin = 0
  let pricePerSqmMax = 0

  if (projectType.includes('integral') || projectType.includes('completa') || projectType.includes('piso') || projectType.includes('full') || projectType.includes('sencer')) {
    pricePerSqmMin = 800
    pricePerSqmMax = 1500
    minPrice = 50000
    maxPrice = 180000
  } else if (projectType.includes('cocina') || projectType.includes('kitchen') || projectType.includes('cuina')) {
    minPrice = 18000
    maxPrice = 60000
  } else if (projectType.includes('baño') || projectType.includes('bano') || projectType.includes('bathroom') || projectType.includes('bany')) {
    minPrice = 12000
    maxPrice = 40000
  } else if (projectType.includes('pintura') || projectType.includes('painting')) {
    minPrice = 2500
    maxPrice = 6000
  } else if (projectType.includes('suelo') || projectType.includes('suelos') || projectType.includes('parquet') || projectType.includes('floor') || projectType.includes('terra') || projectType.includes('terres')) {
    pricePerSqmMin = 40
    pricePerSqmMax = 80
    minPrice = 2000
    maxPrice = 15000
  } else if (projectType.includes('ventanas') || projectType.includes('window') || projectType.includes('finestra') || projectType.includes('finestres')) {
    if (sqm > 0) {
      const minW = 350
      const maxW = 900
      const minEstimate = sqm * minW
      const maxEstimate = sqm * maxW
      return {
        clientBudget: null,
        estimated: null,
        range: `${minEstimate.toLocaleString(locale)}\u20AC - ${maxEstimate.toLocaleString(locale)}\u20AC`,
        estimatedMin: minEstimate,
        displayText: `${minEstimate.toLocaleString(locale)}\u20AC - ${maxEstimate.toLocaleString(locale)}\u20AC`,
        note: t('solutions.leadQualifier.priceNotes.orientativeFor').replace('{count}', sqm).replace('{unit}', t('solutions.leadQualifier.priceNotes.unitWindows')) + ' (Barcelona)',
      }
    }
    return { displayText: t('solutions.leadQualifier.priceNotes.perWindow'), note: t('solutions.leadQualifier.priceNotes.indicateWindowCount'), clientBudget: null, estimated: null, range: null, estimatedMin: 0 }
  } else if (projectType.includes('puertas') || projectType.includes('door') || projectType.includes('porta') || projectType.includes('portes')) {
    if (sqm > 0) {
      const minP = 400
      const maxP = 1200
      const minEstimate = sqm * minP
      const maxEstimate = sqm * maxP
      return {
        clientBudget: null,
        estimated: null,
        range: `${minEstimate.toLocaleString(locale)}\u20AC - ${maxEstimate.toLocaleString(locale)}\u20AC`,
        estimatedMin: minEstimate,
        displayText: `${minEstimate.toLocaleString(locale)}\u20AC - ${maxEstimate.toLocaleString(locale)}\u20AC`,
        note: t('solutions.leadQualifier.priceNotes.orientativeFor').replace('{count}', sqm).replace('{unit}', t('solutions.leadQualifier.priceNotes.unitDoors')) + ' (Barcelona)',
      }
    }
    return { displayText: t('solutions.leadQualifier.priceNotes.perDoor'), note: t('solutions.leadQualifier.priceNotes.indicateDoorCount'), clientBudget: null, estimated: null, range: null, estimatedMin: 0 }
  } else if (projectType.includes('otro') || projectType.includes('other') || projectType.includes('altre')) {
    return { displayText: t('solutions.leadQualifier.priceNotes.otherConsult'), note: t('solutions.leadQualifier.priceNotes.otherWork'), clientBudget: null, estimated: null, range: null, estimatedMin: 0 }
  }

  if (sqm > 0 && pricePerSqmMin > 0) {
    const minEstimate = Math.round(sqm * pricePerSqmMin)
    const maxEstimate = Math.round(sqm * pricePerSqmMax)
    return {
      clientBudget: null,
      estimated: null,
      range: `${minEstimate.toLocaleString(locale)}\u20AC - ${maxEstimate.toLocaleString(locale)}\u20AC`,
      estimatedMin: minEstimate,
      displayText: `${minEstimate.toLocaleString(locale)}\u20AC - ${maxEstimate.toLocaleString(locale)}\u20AC`,
      note: t('solutions.leadQualifier.priceNotes.orientativeSqm').replace('{count}', sqm),
    }
  }

  if (minPrice > 0) {
    return {
      clientBudget: null,
      estimated: null,
      range: `${minPrice.toLocaleString(locale)}\u20AC - ${maxPrice.toLocaleString(locale)}\u20AC`,
      estimatedMin: minPrice,
      displayText: `${minPrice.toLocaleString(locale)}\u20AC - ${maxPrice.toLocaleString(locale)}\u20AC`,
      note: t('solutions.leadQualifier.priceNotes.typicalRange'),
    }
  }

  return { displayText: '\u2014', note: t('solutions.leadQualifier.priceNotes.indicateType'), clientBudget: null, estimated: null, range: null, estimatedMin: 0 }
}

function FieldRow({ icon: Icon, label, value, highlight, valueClass }) {
  if (value === undefined || value === null || value === '') return null
  const isNoAnswer = value === 'n/a' || value === 'unknown'
  const displayValue = isNoAnswer ? 'N/A' : value

  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className={`h-4 w-4 flex-shrink-0 ${highlight ? 'text-primary-400' : 'text-gray-500'}`} />
      <span className="text-sm text-gray-400">{label}:</span>
      <span className={`text-sm ${valueClass || (highlight ? 'text-white font-medium' : 'text-gray-300')}`}>
        {displayValue}
      </span>
    </div>
  )
}

export default function LeadSummaryCard({ leadData, config = {}, t, language = 'es' }) {
  const [showDetails, setShowDetails] = useState(false)
  const locale = LOCALE_MAP[language] || 'es-ES'
  const clientRatings = getClientRatings(t)
  const { rating, score, factors } = calculateClientRating(leadData, config, t, locale)
  const ratingInfo = clientRatings[rating]
  const priceEstimate = estimateProjectPrice(leadData, t, locale)

  if (!leadData || Object.keys(leadData).length === 0) {
    const bullets = t('solutions.leadQualifier.summary.bullets') || []
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">{t('solutions.leadQualifier.summary.title')}</h3>
        {Array.isArray(bullets) && bullets.length > 0 && (
          <div className="mb-4">
            <ul className="space-y-2">
              {bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-green-400 mt-0.5 font-bold">✓</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4 p-4 rounded-lg bg-primary-500/10 border border-primary-500/20">
          <p className="text-sm text-primary-300 text-center leading-relaxed">
            {t('solutions.leadQualifier.summary.emptyMessage')}
          </p>
        </div>
      </motion.div>
    )
  }

  const booleanDisplay = (value) => {
    if (typeof value === 'boolean') return value ? t('solutions.leadQualifier.summary.yes') : t('solutions.leadQualifier.summary.no')
    return value
  }

  const hasRealValue = (v) => v != null && String(v).trim() !== '' && !['n/a', 'unknown'].includes(String(v).toLowerCase())
  const hasContact = hasRealValue(leadData.contactPhone) || hasRealValue(leadData.contactEmail)
  const contactPhone = leadData.contactPhone || ''
  const contactName = leadData.contactName || ''

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl border border-gray-700 bg-gray-800/50 overflow-hidden"
    >
      {/* Header grande - Lead listo para llamar */}
      <div className={`${ratingInfo.color} px-6 py-5`}>
        <p className="text-white/90 text-xs font-medium uppercase tracking-wider mb-1">
          {t('solutions.leadQualifier.summary.readyToCall')}
        </p>
        <p className="text-white text-2xl font-bold mb-1">
          {ratingInfo.label}
        </p>
        <p className="text-white/90 text-sm">{ratingInfo.description}</p>
      </div>

      {/* BLOQUE 1: Presupuesto estimado (MUY GRANDE) */}
      <div className="px-6 py-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-b border-gray-700">
        <p className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-2">
          {t('solutions.leadQualifier.summary.estimatedBudget')}
        </p>
        <p className="text-4xl font-bold text-white mb-2">{priceEstimate.displayText}</p>
        {priceEstimate.estimatedMin && priceEstimate.estimatedMin >= 50000 && (
          <p className="text-sm text-gray-300">{t('solutions.leadQualifier.summary.thisCouldBe')}</p>
        )}
      </div>

      {/* BLOQUE 2: ¿Por qué es buen lead? (solo positivos) */}
      {factors.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-3">
            {t('solutions.leadQualifier.summary.whyGoodLead')}
          </h3>
          <div className="space-y-2">
            {factors.map((factor, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-green-400 mt-0.5 font-bold">✓</span>
                <span>{factor.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOQUE 3: Contacto con botón principal */}
      {hasContact && (
        <div className="px-6 py-5 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-3">
            {t('solutions.leadQualifier.summary.contact')}
          </h3>
          {contactName && (
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-white font-medium">{contactName}</span>
            </div>
          )}
          {contactPhone && (
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-white">{contactPhone}</span>
            </div>
          )}
          {contactPhone && (
            <a
              href={`tel:${contactPhone.replace(/\s/g, '')}`}
              className="w-full block px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors text-center"
            >
              {t('solutions.leadQualifier.summary.callNow')}
            </a>
          )}
        </div>
      )}

      {/* BLOQUE 4: Detalles del proyecto (colapsable) */}
      <div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
        >
          <span className="text-sm font-semibold text-gray-400">
            {t('solutions.leadQualifier.summary.projectDetails')}
          </span>
          {showDetails ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-4">
                <div className="divide-y divide-gray-700/50">
                  <FieldRow
                    icon={Target}
                    label={t('solutions.leadQualifier.summary.type')}
                    value={leadData.projectType}
                  />
                  <FieldRow
                    icon={MapPin}
                    label={t('solutions.leadQualifier.summary.location')}
                    value={leadData.city}
                  />
                  {leadData.postalCode && (
                    <FieldRow
                      icon={MapPin}
                      label={t('solutions.leadQualifier.summary.postalCode')}
                      value={leadData.postalCode}
                    />
                  )}
                  {(() => {
                    const pt = (leadData.projectType || '').toLowerCase()
                    const sqmVal = leadData.sqm != null && leadData.sqm !== ''
                    if (!sqmVal || typeof leadData.sqm !== 'number') {
                      return (
                        <FieldRow icon={Ruler} label={t('solutions.leadQualifier.summary.scope')} value={leadData.sqm ?? null} />
                      )
                    }
                    const isWindows = pt.includes('ventanas') || pt.includes('window') || pt.includes('finestra')
                    const isDoors = pt.includes('puertas') || pt.includes('door') || pt.includes('porta')
                    const label = isWindows || isDoors ? t('solutions.leadQualifier.summary.scope') : t('solutions.leadQualifier.summary.surface')
                    const value = isWindows
                      ? `${leadData.sqm} ${t('solutions.leadQualifier.summary.windows')}`
                      : isDoors
                        ? `${leadData.sqm} ${t('solutions.leadQualifier.summary.doors')}`
                        : `${leadData.sqm} ${t('solutions.leadQualifier.summary.sqm')}`
                    return <FieldRow icon={Ruler} label={label} value={value} />
                  })()}
                  <FieldRow
                    icon={Calendar}
                    label={t('solutions.leadQualifier.summary.start')}
                    value={leadData.timeline}
                  />
                  <FieldRow
                    icon={FileText}
                    label={t('solutions.leadQualifier.summary.documentation')}
                    value={booleanDisplay(leadData.hasDocs)}
                  />
                  {leadData.constraints && (
                    <FieldRow
                      icon={AlertCircle}
                      label={t('solutions.leadQualifier.summary.restrictions')}
                      value={leadData.constraints}
                    />
                  )}
                </div>

                {leadData.scopeDescription && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      {t('solutions.leadQualifier.summary.description')}
                    </h4>
                    <p className="text-sm text-gray-300 bg-gray-700/30 rounded-lg p-3">
                      {leadData.scopeDescription}
                    </p>
                  </div>
                )}

                {leadData.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{leadData.contactEmail}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA final */}
      <div className="px-6 py-4 border-t border-gray-700 bg-gray-800/30">
        <p className="text-xs text-gray-400 mb-3 text-center">
          {t('solutions.leadQualifier.summary.ctaQuestion')}
        </p>
        <Link
          to="/contact"
          className="w-full block px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors text-sm text-center"
        >
          {t('solutions.leadQualifier.ui.ctaSecondary')}
        </Link>
      </div>
    </motion.div>
  )
}
