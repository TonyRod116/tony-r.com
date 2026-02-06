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

// Clasificaciones de cliente: de muy malo a muy bueno
const clientRatings = {
  excellent: { 
    label: 'Excelente', 
    color: 'bg-green-500', 
    textColor: 'text-green-400',
    emoji: '🌟',
    description: 'Lead de alta calidad'
  },
  good: { 
    label: 'Bueno', 
    color: 'bg-emerald-500', 
    textColor: 'text-emerald-400',
    emoji: '✅',
    description: 'Buen potencial'
  },
  regular: { 
    label: 'Regular', 
    color: 'bg-amber-500', 
    textColor: 'text-amber-400',
    emoji: '⚠️',
    description: 'Requiere seguimiento'
  },
  poor: { 
    label: 'Bajo', 
    color: 'bg-orange-500', 
    textColor: 'text-orange-400',
    emoji: '📉',
    description: 'Poco probable'
  },
  bad: { 
    label: 'Muy bajo', 
    color: 'bg-red-500', 
    textColor: 'text-red-400',
    emoji: '❌',
    description: 'No encaja'
  },
}

// Calcular la clasificación basada en los datos del lead
function calculateClientRating(leadData, config = {}) {
  if (!leadData) return { rating: 'regular', score: 0, factors: [] }
  
  let score = 50 // Empezamos en neutral
  const factors = []
  
  // Obtener mínimos de config
  const budgetMins = {
    baño: config.budgetRanges?.baño?.min || 12000,
    cocina: config.budgetRanges?.cocina?.min || 18000,
    integral: config.budgetRanges?.integral?.min || 50000,
    pintura: config.budgetRanges?.pintura?.min || 2500,
  }
  
  // Detectar tipo de proyecto
  const projectType = (leadData.projectType || '').toLowerCase()
  let projectCategory = null
  if (projectType.includes('integral') || projectType.includes('completa') || projectType.includes('piso')) {
    projectCategory = 'integral'
  } else if (projectType.includes('cocina')) {
    projectCategory = 'cocina'
  } else if (projectType.includes('baño')) {
    projectCategory = 'baño'
  } else if (projectType.includes('pintura')) {
    projectCategory = 'pintura'
  }
  
  // Factor: Presupuesto vs mínimo del tipo de proyecto
  const budget = leadData.budget || 0
  if (budget > 0 && projectCategory) {
    const minRequired = budgetMins[projectCategory]
    if (budget >= minRequired * 1.5) {
      score += 25
      factors.push({ text: 'Presupuesto alto', positive: true })
    } else if (budget >= minRequired) {
      score += 15
      factors.push({ text: 'Presupuesto adecuado', positive: true })
    } else if (budget >= minRequired * 0.7) {
      score += 5
      factors.push({ text: 'Presupuesto ajustado', positive: true })
    } else {
      score -= 25
      factors.push({ text: `Presupuesto bajo (mín. ${minRequired.toLocaleString('es-ES')}€)`, positive: false })
    }
  } else if (budget > 0) {
    // Si no sabemos el tipo, evaluamos de forma general
    if (budget >= 50000) {
      score += 20
      factors.push({ text: 'Presupuesto alto', positive: true })
    } else if (budget >= 20000) {
      score += 10
      factors.push({ text: 'Presupuesto medio', positive: true })
    }
  }
  
  // Factor: Urgencia/Timeline
  const timeline = (leadData.timeline || '').toLowerCase()
  if (timeline.includes('ya') || timeline.includes('inmediato') || timeline.includes('urgente') || timeline.includes('cuanto antes')) {
    score += 20
    factors.push({ text: 'Quiere empezar YA', positive: true })
  } else if (timeline.includes('mes') || timeline.includes('semana')) {
    score += 15
    factors.push({ text: 'Plazo corto', positive: true })
  } else if (timeline.includes('año') || timeline.includes('no sé') || timeline.includes('más adelante')) {
    score -= 10
    factors.push({ text: 'Sin urgencia', positive: false })
  }
  
  // Factor: Tipo de proyecto (bonus)
  if (projectCategory === 'integral') {
    score += 15
    factors.push({ text: 'Reforma integral', positive: true })
  } else if (projectCategory === 'cocina') {
    score += 10
    factors.push({ text: 'Reforma de cocina', positive: true })
  } else if (projectCategory === 'baño') {
    score += 5
    factors.push({ text: 'Reforma de baño', positive: true })
  }
  
  // Factor: Ciudad cubierta
  if (leadData.city) {
    score += 10
    factors.push({ text: 'Ubicación confirmada', positive: true })
  }
  
  // Factor: Contacto proporcionado
  if (leadData.contactPhone) {
    score += 15
    factors.push({ text: 'Teléfono facilitado', positive: true })
  }
  
  // Factor: Documentación disponible
  if (leadData.hasDocs && leadData.hasDocs !== 'No' && leadData.hasDocs !== 'ninguno') {
    score += 5
    factors.push({ text: 'Tiene documentación', positive: true })
  }
  
  // Normalizar score entre 0 y 100
  score = Math.max(0, Math.min(100, score))
  
  // Determinar rating
  let rating
  if (score >= 85) rating = 'excellent'
  else if (score >= 70) rating = 'good'
  else if (score >= 50) rating = 'regular'
  else if (score >= 30) rating = 'poor'
  else rating = 'bad'
  
  return { rating, score, factors }
}

// Estimar precio aproximado del proyecto - PRECIOS REALES BARCELONA 2024-2025
function estimateProjectPrice(leadData) {
  if (!leadData) return null
  
  const projectType = (leadData.projectType || '').toLowerCase()
  const sqm = leadData.sqm || 0
  const budget = leadData.budget || 0
  
  // Si el cliente ya dio un presupuesto, usarlo como referencia
  if (budget > 0) {
    return {
      clientBudget: budget,
      estimated: null,
      note: 'Presupuesto del cliente'
    }
  }
  
  // Precios REALES de Barcelona 2024-2025
  let minPrice = 0
  let maxPrice = 0
  let pricePerSqmMin = 0
  let pricePerSqmMax = 0
  
  if (projectType.includes('integral') || projectType.includes('completa') || projectType.includes('piso')) {
    // Reforma integral: 800-1.500€/m²
    pricePerSqmMin = 800
    pricePerSqmMax = 1500
    minPrice = 50000
    maxPrice = 180000
  } else if (projectType.includes('cocina')) {
    // Cocina completa: 18.000-60.000€
    minPrice = 18000
    maxPrice = 60000
  } else if (projectType.includes('baño')) {
    // Baño completo: 12.000-40.000€
    minPrice = 12000
    maxPrice = 40000
  } else if (projectType.includes('pintura')) {
    // Pintura: 2.500-6.000€
    minPrice = 2500
    maxPrice = 6000
  }
  
  // Ajustar por m² si se conocen (para reforma integral)
  if (sqm > 0 && pricePerSqmMin > 0) {
    const minEstimate = sqm * pricePerSqmMin
    const maxEstimate = sqm * pricePerSqmMax
    return {
      clientBudget: null,
      estimated: null,
      range: `${minEstimate.toLocaleString('es-ES')}€ - ${maxEstimate.toLocaleString('es-ES')}€`,
      note: `Estimación para ${sqm}m² (${pricePerSqmMin}-${pricePerSqmMax}€/m²)`
    }
  }
  
  if (minPrice > 0) {
    return {
      clientBudget: null,
      estimated: null,
      range: `${minPrice.toLocaleString('es-ES')}€ - ${maxPrice.toLocaleString('es-ES')}€`,
      note: 'Rango típico Barcelona 2024-2025'
    }
  }
  
  return null
}

function FieldRow({ icon: Icon, label, value, highlight, valueClass }) {
  if (!value && value !== false && value !== 0) return null
  
  const displayValue = typeof value === 'boolean' 
    ? (value ? 'Sí' : 'No') 
    : value

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

export default function LeadSummaryCard({ leadData, config = {} }) {
  const { rating, score, factors } = calculateClientRating(leadData, config)
  const ratingInfo = clientRatings[rating]
  const priceEstimate = estimateProjectPrice(leadData)
  
  if (!leadData || Object.keys(leadData).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Resumen del Proyecto</h3>
        <p className="text-gray-400 text-sm">
          La información del proyecto aparecerá aquí a medida que avance la conversación.
        </p>
        <div className="mt-4 p-4 rounded-lg bg-gray-700/50 border border-gray-600">
          <p className="text-xs text-gray-500 text-center">
            Esperando información...
          </p>
        </div>
      </motion.div>
    )
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
              Clasificación del Lead
            </p>
            <p className="text-white text-xl font-bold flex items-center gap-2">
              <span>{ratingInfo.emoji}</span>
              {ratingInfo.label}
            </p>
            <p className="text-white/70 text-xs mt-1">{ratingInfo.description}</p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-xs">Puntuación</p>
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

      {/* Price Estimate - PROMINENT */}
      {priceEstimate && (
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Banknote className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
              Precio Estimado
            </span>
          </div>
          {priceEstimate.clientBudget ? (
            <p className="text-2xl font-bold text-white">
              Hasta {priceEstimate.clientBudget.toLocaleString('es-ES')} €
            </p>
          ) : priceEstimate.estimated ? (
            <p className="text-2xl font-bold text-white">
              ~{priceEstimate.estimated.toLocaleString('es-ES')} €
            </p>
          ) : priceEstimate.range ? (
            <p className="text-xl font-bold text-white">{priceEstimate.range}</p>
          ) : null}
          <p className="text-xs text-gray-400 mt-1">{priceEstimate.note}</p>
        </div>
      )}

      {/* Factors that affect rating */}
      {factors.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Factores de Evaluación
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
                {factor.positive ? '✓' : '✗'} {factor.text}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fields */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Datos del Proyecto
        </h3>
        
        <div className="divide-y divide-gray-700/50">
          <FieldRow 
            icon={Target} 
            label="Tipo" 
            value={leadData.projectType} 
            highlight 
          />
          <FieldRow 
            icon={MapPin} 
            label="Ubicación" 
            value={leadData.city} 
            highlight 
          />
          {leadData.postalCode && (
            <FieldRow 
              icon={MapPin} 
              label="C.P." 
              value={leadData.postalCode} 
            />
          )}
          <FieldRow 
            icon={Ruler} 
            label="Superficie" 
            value={leadData.sqm ? `${leadData.sqm} m²` : null} 
          />
          <FieldRow 
            icon={Banknote} 
            label="Presupuesto cliente" 
            value={leadData.budget ? `${leadData.budget.toLocaleString('es-ES')} €` : 
                   leadData.budgetRange ? leadData.budgetRange : null} 
            highlight 
            valueClass="text-green-400 font-semibold"
          />
          <FieldRow 
            icon={Calendar} 
            label="Inicio" 
            value={leadData.timeline} 
            valueClass={
              leadData.timeline && (
                leadData.timeline.toLowerCase().includes('ya') || 
                leadData.timeline.toLowerCase().includes('urgente') ||
                leadData.timeline.toLowerCase().includes('inmediato')
              ) ? 'text-green-400 font-semibold' : undefined
            }
          />
          <FieldRow 
            icon={FileText} 
            label="Documentación" 
            value={leadData.hasDocs} 
          />
          {leadData.constraints && (
            <FieldRow 
              icon={AlertCircle} 
              label="Restricciones" 
              value={leadData.constraints} 
            />
          )}
        </div>

        {/* Scope description if available */}
        {leadData.scopeDescription && (
          <>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3">
              Descripción
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
              Contacto
            </h3>
            <div className="divide-y divide-gray-700/50">
              <FieldRow 
                icon={User} 
                label="Nombre" 
                value={leadData.contactName} 
              />
              <FieldRow 
                icon={Phone} 
                label="Teléfono" 
                value={leadData.contactPhone} 
              />
              <FieldRow 
                icon={Mail} 
                label="Email" 
                value={leadData.contactEmail} 
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
