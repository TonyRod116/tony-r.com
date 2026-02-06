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
function calculateClientRating(leadData) {
  if (!leadData) return { rating: 'regular', score: 0, factors: [] }
  
  let score = 50 // Empezamos en neutral
  const factors = []
  
  // Factor: Presupuesto
  const budget = leadData.budget || 0
  if (budget >= 50000) {
    score += 25
    factors.push({ text: 'Presupuesto alto', positive: true })
  } else if (budget >= 20000) {
    score += 15
    factors.push({ text: 'Presupuesto medio-alto', positive: true })
  } else if (budget >= 10000) {
    score += 5
    factors.push({ text: 'Presupuesto aceptable', positive: true })
  } else if (budget > 0 && budget < 5000) {
    score -= 20
    factors.push({ text: 'Presupuesto muy bajo', positive: false })
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
  
  // Factor: Tipo de proyecto
  const projectType = (leadData.projectType || '').toLowerCase()
  if (projectType.includes('integral') || projectType.includes('completa')) {
    score += 15
    factors.push({ text: 'Reforma integral', positive: true })
  } else if (projectType.includes('cocina')) {
    score += 10
    factors.push({ text: 'Reforma de cocina', positive: true })
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

// Estimar precio aproximado del proyecto
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
  
  // Estimar basado en tipo y m²
  let minPrice = 0
  let maxPrice = 0
  let pricePerSqm = 0
  
  if (projectType.includes('integral') || projectType.includes('completa')) {
    pricePerSqm = 600 // €/m² para reforma integral
    minPrice = 30000
    maxPrice = 100000
  } else if (projectType.includes('cocina')) {
    minPrice = 12000
    maxPrice = 25000
  } else if (projectType.includes('baño')) {
    minPrice = 8000
    maxPrice = 18000
  } else if (projectType.includes('pintura')) {
    pricePerSqm = 15
    minPrice = 1500
    maxPrice = 8000
  }
  
  // Ajustar por m² si se conocen
  if (sqm > 0 && pricePerSqm > 0) {
    const estimated = sqm * pricePerSqm
    return {
      clientBudget: null,
      estimated: Math.round(estimated / 1000) * 1000,
      range: `${minPrice.toLocaleString('es-ES')}€ - ${maxPrice.toLocaleString('es-ES')}€`,
      note: `Estimación basada en ${sqm}m²`
    }
  }
  
  if (minPrice > 0) {
    return {
      clientBudget: null,
      estimated: null,
      range: `${minPrice.toLocaleString('es-ES')}€ - ${maxPrice.toLocaleString('es-ES')}€`,
      note: 'Rango típico para este tipo de proyecto'
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

export default function LeadSummaryCard({ leadData }) {
  const { rating, score, factors } = calculateClientRating(leadData)
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
