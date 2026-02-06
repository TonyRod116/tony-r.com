import { motion } from 'framer-motion'
import { 
  Target, 
  MapPin, 
  Ruler, 
  Banknote, 
  Calendar, 
  Home, 
  FileText, 
  User, 
  Phone,
  Mail,
  Star
} from 'lucide-react'

const tierColors = {
  1: 'bg-green-500',
  2: 'bg-blue-500',
  3: 'bg-yellow-500',
  4: 'bg-orange-500',
  5: 'bg-red-500',
}

const tierLabels = {
  1: 'Premium',
  2: 'Calificado',
  3: 'Tibio',
  4: 'Frío',
  5: 'No calificado',
}

function FieldRow({ icon: Icon, label, value, highlight }) {
  if (!value && value !== false) return null
  
  const displayValue = typeof value === 'boolean' 
    ? (value ? 'Sí' : 'No') 
    : value

  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className={`h-4 w-4 flex-shrink-0 ${highlight ? 'text-primary-400' : 'text-gray-500'}`} />
      <span className="text-sm text-gray-400">{label}:</span>
      <span className={`text-sm ${highlight ? 'text-white font-medium' : 'text-gray-300'}`}>
        {displayValue}
      </span>
    </div>
  )
}

export default function LeadSummaryCard({ leadData }) {
  if (!leadData || Object.keys(leadData).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Resumen del Lead</h3>
        <p className="text-gray-400 text-sm">
          La información del lead aparecerá aquí a medida que avance la conversación.
        </p>
        <div className="mt-4 p-4 rounded-lg bg-gray-700/50 border border-gray-600">
          <p className="text-xs text-gray-500 text-center">
            Esperando datos...
          </p>
        </div>
      </motion.div>
    )
  }

  const tier = leadData.tier || 5
  const score = leadData.score || 0

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl border border-gray-700 bg-gray-800/50 overflow-hidden"
    >
      {/* Header with Tier */}
      <div className={`${tierColors[tier]} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
              Tier {tier}
            </p>
            <p className="text-white text-lg font-bold">
              {tierLabels[tier]}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-xs">Score</p>
            <p className="text-white text-2xl font-bold">{score}</p>
          </div>
        </div>
        
        {/* Score bar */}
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>

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
            label="Ciudad" 
            value={leadData.city} 
            highlight 
          />
          <FieldRow 
            icon={Ruler} 
            label="Superficie" 
            value={leadData.sqm ? `${leadData.sqm} m²` : null} 
          />
          <FieldRow 
            icon={Banknote} 
            label="Presupuesto" 
            value={leadData.budget ? `${leadData.budget.toLocaleString('es-ES')} €` : null} 
            highlight 
          />
          <FieldRow 
            icon={Calendar} 
            label="Plazo" 
            value={leadData.timeline} 
          />
          <FieldRow 
            icon={Home} 
            label="Propietario" 
            value={leadData.isOwner} 
          />
          <FieldRow 
            icon={FileText} 
            label="Documentación" 
            value={leadData.hasDocs} 
          />
        </div>

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

        {/* Reasons */}
        {leadData.reasons && leadData.reasons.length > 0 && (
          <>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3">
              Razones de Calificación
            </h3>
            <ul className="space-y-2">
              {leadData.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Star className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{reason}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </motion.div>
  )
}
