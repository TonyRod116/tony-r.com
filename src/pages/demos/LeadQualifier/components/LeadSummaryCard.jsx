import { motion } from 'framer-motion'
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
  TrendingUp,
  Clock
} from 'lucide-react'

const LOCALE_MAP = { en: 'en-US', es: 'es-ES', ca: 'ca-ES' }

function getClientRatings(t) {
  return {
    excellent: {
      label: t('demos.leadQualifier.ratings.excellent'),
      color: 'bg-green-500',
      textColor: 'text-green-400',
      emoji: '\u{1F31F}',
      description: t('demos.leadQualifier.ratings.excellentDesc'),
    },
    good: {
      label: t('demos.leadQualifier.ratings.good'),
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      emoji: '\u2705',
      description: t('demos.leadQualifier.ratings.goodDesc'),
    },
    regular: {
      label: t('demos.leadQualifier.ratings.regular'),
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      emoji: '\u26A0\uFE0F',
      description: t('demos.leadQualifier.ratings.regularDesc'),
    },
    poor: {
      label: t('demos.leadQualifier.ratings.poor'),
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
      emoji: '\uD83D\uDCC9',
      description: t('demos.leadQualifier.ratings.poorDesc'),
    },
    bad: {
      label: t('demos.leadQualifier.ratings.bad'),
      color: 'bg-red-500',
      textColor: 'text-red-400',
      emoji: '\u274C',
      description: t('demos.leadQualifier.ratings.badDesc'),
    },
  }
}

function calculateClientRating(leadData, config, t, locale) {
  if (!leadData) return { rating: 'regular', score: 0, factors: [] }
  if (leadData.doNotContact) {
    return { rating: 'bad', score: 0, factors: [{ text: t('demos.leadQualifier.factors.doNotContact'), positive: false }] }
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
      factors.push({ text: t('demos.leadQualifier.factors.budgetHigh'), positive: true })
    } else if (budget >= minRequired) {
      score += 15
      factors.push({ text: t('demos.leadQualifier.factors.budgetAdequate'), positive: true })
    } else if (budget >= minRequired * 0.7) {
      score += 5
      factors.push({ text: t('demos.leadQualifier.factors.budgetTight'), positive: true })
    } else {
      score -= 25
      factors.push({ text: t('demos.leadQualifier.factors.budgetLow').replace('{min}', minRequired.toLocaleString(locale) + '€'), positive: false })
    }
  } else if (budget > 0) {
    if (budget >= 50000) {
      score += 20
      factors.push({ text: t('demos.leadQualifier.factors.budgetHigh'), positive: true })
    } else if (budget >= 20000) {
      score += 10
      factors.push({ text: t('demos.leadQualifier.factors.budgetMedium'), positive: true })
    }
  }

  const timeline = (leadData.timeline || '').toLowerCase()
  const hasTimeline = timeline && timeline !== 'n/a' && timeline !== 'unknown'
  if (hasTimeline) {
    score += 5
    factors.push({ text: t('demos.leadQualifier.factors.timelineDefined'), positive: true })
    if (timeline.includes('ya') || timeline.includes('inmediato') || timeline.includes('urgente') || timeline.includes('cuanto antes') || timeline.includes('asap') || timeline.includes('now') || timeline.includes('ara')) {
      score += 20
      factors.push({ text: t('demos.leadQualifier.factors.wantsToStartNow'), positive: true })
    } else if (timeline.includes('mes') || timeline.includes('semana') || timeline.includes('week') || timeline.includes('month') || timeline.includes('setmana')) {
      score += 15
      factors.push({ text: t('demos.leadQualifier.factors.shortTimeline'), positive: true })
    } else if (timeline.includes('año') || timeline.includes('no sé') || timeline.includes('más adelante') || timeline.includes('year') || timeline.includes('later') || timeline.includes('any')) {
      score -= 10
      factors.push({ text: t('demos.leadQualifier.factors.noUrgency'), positive: false })
    }
  } else {
    score -= 10
    factors.push({ text: t('demos.leadQualifier.factors.timelineNotIndicated'), positive: false })
  }

  if (projectCategory === 'integral') {
    score += 15
    factors.push({ text: t('demos.leadQualifier.factors.fullRenovation'), positive: true })
  } else if (projectCategory === 'cocina') {
    score += 10
    factors.push({ text: t('demos.leadQualifier.factors.kitchenRenovation'), positive: true })
  } else if (projectCategory === 'baño') {
    score += 5
    factors.push({ text: t('demos.leadQualifier.factors.bathroomRenovation'), positive: true })
  }

  if (leadData.city && leadData.city !== 'n/a' && leadData.city !== 'unknown') {
    score += 10
    factors.push({ text: t('demos.leadQualifier.factors.locationConfirmed'), positive: true })
  }

  const hasRealValue = (v) => v != null && String(v).trim() !== '' && !['n/a', 'unknown'].includes(String(v).toLowerCase())
  const hasContact = hasRealValue(leadData.contactPhone) || hasRealValue(leadData.contactEmail)
  if (hasContact) {
    score += 15
    factors.push({ text: t('demos.leadQualifier.factors.contactProvided'), positive: true })
  }

  const bonusThreshold = config?.budgetBonusThreshold
  if (bonusThreshold && budget >= bonusThreshold) {
    score += 15
    factors.push({ text: t('demos.leadQualifier.factors.budgetBonus').replace('{threshold}', bonusThreshold.toLocaleString(locale) + '€'), positive: true })
  }

  if (leadData.hasDocs && leadData.hasDocs !== 'No' && leadData.hasDocs !== 'ninguno') {
    score += 5
    factors.push({ text: t('demos.leadQualifier.factors.hasDocumentation'), positive: true })
  }

  score = Math.max(0, Math.min(100, score))

  const hasCity = leadData.city && leadData.city !== 'n/a' && leadData.city !== 'unknown'
  const priceInfo = estimateProjectPrice(leadData, t, locale)

  let rating
  if (hasContact && hasCity) {
    if (bonusThreshold && (priceInfo.estimatedMin || 0) >= bonusThreshold) {
      rating = 'excellent'
      factors.push({ text: t('demos.leadQualifier.factors.estimatedBudgetExcellent').replace('{threshold}', bonusThreshold.toLocaleString(locale) + '€'), positive: true })
    } else {
      rating = 'regular'
      if (bonusThreshold) factors.push({ text: t('demos.leadQualifier.factors.withContactExcellentIfBudget'), positive: false })
    }
  } else {
    if (score >= 85) rating = 'excellent'
    else if (score >= 70) rating = 'good'
    else if (score >= 50) rating = 'regular'
    else if (score >= 30) rating = 'poor'
    else rating = 'bad'
  }

  return { rating, score, factors }
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
      note: t('demos.leadQualifier.priceNotes.clientBudget'),
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
        note: t('demos.leadQualifier.priceNotes.orientativeFor').replace('{count}', sqm).replace('{unit}', t('demos.leadQualifier.priceNotes.unitWindows')) + ' (Barcelona)',
      }
    }
    return { displayText: t('demos.leadQualifier.priceNotes.perWindow'), note: t('demos.leadQualifier.priceNotes.indicateWindowCount'), clientBudget: null, estimated: null, range: null, estimatedMin: 0 }
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
        note: t('demos.leadQualifier.priceNotes.orientativeFor').replace('{count}', sqm).replace('{unit}', t('demos.leadQualifier.priceNotes.unitDoors')) + ' (Barcelona)',
      }
    }
    return { displayText: t('demos.leadQualifier.priceNotes.perDoor'), note: t('demos.leadQualifier.priceNotes.indicateDoorCount'), clientBudget: null, estimated: null, range: null, estimatedMin: 0 }
  } else if (projectType.includes('otro') || projectType.includes('other') || projectType.includes('altre')) {
    return { displayText: t('demos.leadQualifier.priceNotes.otherConsult'), note: t('demos.leadQualifier.priceNotes.otherWork'), clientBudget: null, estimated: null, range: null, estimatedMin: 0 }
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
      note: t('demos.leadQualifier.priceNotes.orientativeSqm').replace('{count}', sqm),
    }
  }

  if (minPrice > 0) {
    return {
      clientBudget: null,
      estimated: null,
      range: `${minPrice.toLocaleString(locale)}\u20AC - ${maxPrice.toLocaleString(locale)}\u20AC`,
      estimatedMin: minPrice,
      displayText: `${minPrice.toLocaleString(locale)}\u20AC - ${maxPrice.toLocaleString(locale)}\u20AC`,
      note: t('demos.leadQualifier.priceNotes.typicalRange'),
    }
  }

  return { displayText: '\u2014', note: t('demos.leadQualifier.priceNotes.indicateType'), clientBudget: null, estimated: null, range: null, estimatedMin: 0 }
}

const NO_ANSWER_DISPLAY = 'N/A'

function FieldRow({ icon: Icon, label, value, highlight, valueClass }) {
  if (value === undefined || value === null || value === '') return null
  const isNoAnswer = value === 'n/a' || value === 'unknown'
  const displayValue = isNoAnswer ? NO_ANSWER_DISPLAY : value

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
  const locale = LOCALE_MAP[language] || 'es-ES'
  const clientRatings = getClientRatings(t)
  const { rating, score, factors } = calculateClientRating(leadData, config, t, locale)
  const ratingInfo = clientRatings[rating]
  const priceEstimate = estimateProjectPrice(leadData, t, locale)

  if (!leadData || Object.keys(leadData).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">{t('demos.leadQualifier.summary.title')}</h3>
        <p className="text-gray-400 text-sm">
          {t('demos.leadQualifier.summary.emptyMessage')}
        </p>
        <div className="mt-4 p-4 rounded-lg bg-gray-700/50 border border-gray-600">
          <p className="text-xs text-gray-500 text-center">
            {t('demos.leadQualifier.summary.waiting')}
          </p>
        </div>
      </motion.div>
    )
  }

  const booleanDisplay = (value) => {
    if (typeof value === 'boolean') return value ? t('demos.leadQualifier.summary.yes') : t('demos.leadQualifier.summary.no')
    return value
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl border border-gray-700 bg-gray-800/50 overflow-hidden"
    >
      {/* Rating Header */}
      <div className={`${ratingInfo.color} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
              {t('demos.leadQualifier.summary.leadRating')}
            </p>
            <p className="text-white text-xl font-bold flex items-center gap-2">
              <span>{ratingInfo.emoji}</span>
              {ratingInfo.label}
            </p>
            <p className="text-white/70 text-xs mt-1">{ratingInfo.description}</p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-xs">{t('demos.leadQualifier.summary.score')}</p>
            <p className="text-white text-3xl font-bold">{score}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>

      {/* Price estimate */}
      <div className="px-6 py-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Banknote className="h-5 w-5 text-amber-400" />
          <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
            {t('demos.leadQualifier.summary.approxBudget')}
          </span>
        </div>
        <p className="text-xl font-bold text-white">{priceEstimate.displayText}</p>
        {priceEstimate.note ? <p className="text-xs text-gray-400 mt-1">{priceEstimate.note}</p> : null}
      </div>

      {/* Factors */}
      {factors.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('demos.leadQualifier.summary.evaluationFactors')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {factors.map((factor, i) => (
              <span
                key={i}
                className={`text-xs px-2 py-1 rounded-full ${
                  factor.positive
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {factor.positive ? '\u2713' : '\u2717'} {factor.text}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fields */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          {t('demos.leadQualifier.summary.projectData')}
        </h3>

        <div className="divide-y divide-gray-700/50">
          <FieldRow
            icon={Target}
            label={t('demos.leadQualifier.summary.type')}
            value={leadData.projectType}
            highlight
          />
          <FieldRow
            icon={MapPin}
            label={t('demos.leadQualifier.summary.location')}
            value={leadData.city}
            highlight
          />
          {leadData.postalCode && (
            <FieldRow
              icon={MapPin}
              label={t('demos.leadQualifier.summary.postalCode')}
              value={leadData.postalCode}
            />
          )}
          {(() => {
            const pt = (leadData.projectType || '').toLowerCase()
            const sqmVal = leadData.sqm != null && leadData.sqm !== ''
            if (!sqmVal || typeof leadData.sqm !== 'number') {
              return (
                <FieldRow icon={Ruler} label={t('demos.leadQualifier.summary.scope')} value={leadData.sqm ?? null} />
              )
            }
            const isWindows = pt.includes('ventanas') || pt.includes('window') || pt.includes('finestra')
            const isDoors = pt.includes('puertas') || pt.includes('door') || pt.includes('porta')
            const label = isWindows || isDoors ? t('demos.leadQualifier.summary.scope') : t('demos.leadQualifier.summary.surface')
            const value = isWindows
              ? `${leadData.sqm} ${t('demos.leadQualifier.summary.windows')}`
              : isDoors
                ? `${leadData.sqm} ${t('demos.leadQualifier.summary.doors')}`
                : `${leadData.sqm} ${t('demos.leadQualifier.summary.sqm')}`
            return <FieldRow icon={Ruler} label={label} value={value} />
          })()}
          <FieldRow
            icon={Banknote}
            label={t('demos.leadQualifier.summary.clientBudget')}
            value={leadData.budget != null && leadData.budget !== '' ? (typeof leadData.budget === 'number' ? `${leadData.budget.toLocaleString(locale)} \u20AC` : leadData.budget) : (leadData.budgetRange || null)}
            highlight
            valueClass="text-green-400 font-semibold"
          />
          <FieldRow
            icon={Banknote}
            label={t('demos.leadQualifier.summary.estimatedBudget')}
            value={priceEstimate.displayText}
            valueClass="text-amber-400 font-medium"
          />
          <FieldRow
            icon={Calendar}
            label={t('demos.leadQualifier.summary.start')}
            value={leadData.timeline}
            valueClass={
              leadData.timeline && (
                leadData.timeline.toLowerCase().includes('ya') ||
                leadData.timeline.toLowerCase().includes('urgente') ||
                leadData.timeline.toLowerCase().includes('inmediato') ||
                leadData.timeline.toLowerCase().includes('asap') ||
                leadData.timeline.toLowerCase().includes('now') ||
                leadData.timeline.toLowerCase().includes('ara')
              ) ? 'text-green-400 font-semibold' : undefined
            }
          />
          <FieldRow
            icon={FileText}
            label={t('demos.leadQualifier.summary.documentation')}
            value={booleanDisplay(leadData.hasDocs)}
          />
          {leadData.constraints && (
            <FieldRow
              icon={AlertCircle}
              label={t('demos.leadQualifier.summary.restrictions')}
              value={leadData.constraints}
            />
          )}
        </div>

        {/* Scope description */}
        {leadData.scopeDescription && (
          <>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3">
              {t('demos.leadQualifier.summary.description')}
            </h3>
            <p className="text-sm text-gray-300 bg-gray-700/30 rounded-lg p-3">
              {leadData.scopeDescription}
            </p>
          </>
        )}

        {/* Contact section */}
        {(leadData.contactName || leadData.contactPhone || leadData.contactEmail) && (
          <>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3">
              {t('demos.leadQualifier.summary.contact')}
            </h3>
            <div className="divide-y divide-gray-700/50">
              <FieldRow
                icon={User}
                label={t('demos.leadQualifier.summary.name')}
                value={leadData.contactName}
              />
              <FieldRow
                icon={Phone}
                label={t('demos.leadQualifier.summary.phone')}
                value={leadData.contactPhone}
              />
              <FieldRow
                icon={Mail}
                label={t('demos.leadQualifier.summary.email')}
                value={leadData.contactEmail}
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
