import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Trash2, 
  Download,
  Calendar,
  Target,
  MapPin,
  Ruler,
  Banknote,
  User,
  Phone,
  Mail,
  FileText,
  Home,
  MessageSquare,
  Star,
  AlertCircle
} from 'lucide-react'
import { getLeadById, deleteLeadFromStorage } from '../utils/storage'

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

function InfoField({ icon: Icon, label, value }) {
  if (!value && value !== false && value !== 0) return null
  
  const displayValue = typeof value === 'boolean' 
    ? (value ? 'Sí' : 'No') 
    : value

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-700/50 last:border-0">
      <Icon className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-gray-200 mt-0.5">{displayValue}</p>
      </div>
    </div>
  )
}

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (id) {
      const foundLead = getLeadById(id)
      setLead(foundLead)
    }
  }, [id])

  const handleDelete = () => {
    if (id) {
      deleteLeadFromStorage(id)
      navigate('/demos/lead-qualifier/admin')
    }
  }

  const handleExportJSON = () => {
    if (!lead) return
    const json = JSON.stringify(lead, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lead_${lead.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!lead) {
    return (
      <div className="pt-16 min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Link
            to="/demos/lead-qualifier/admin"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al panel
          </Link>
          
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Lead no encontrado</p>
          </div>
        </div>
      </div>
    )
  }

  const tier = lead.tier || 5
  const score = lead.score || 0

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            to="/demos/lead-qualifier/admin"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al panel
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{lead.summary || 'Lead sin título'}</h1>
              <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                {new Date(lead.createdAt).toLocaleString('es-ES')}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportJSON}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
              >
                <Download className="h-4 w-4" />
                Exportar
              </button>
              
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transcript */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-gray-700 bg-gray-800/50 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary-400" />
                <h2 className="font-semibold text-white">Transcripción</h2>
              </div>
              
              <div className="p-4 max-h-96 overflow-y-auto space-y-4">
                {lead.transcript && lead.transcript.length > 0 ? (
                  lead.transcript.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-primary-600 text-white rounded-br-md'
                            : 'bg-gray-700 text-gray-200 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        {msg.timestamp && (
                          <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay transcripción disponible</p>
                )}
              </div>
            </motion.div>

            {/* Reasons */}
            {lead.reasons && lead.reasons.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-gray-700 bg-gray-800/50 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-400" />
                  <h2 className="font-semibold text-white">Razones de Calificación</h2>
                </div>
                
                <div className="p-6">
                  <ul className="space-y-3">
                    {lead.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-amber-400 font-medium">{i + 1}</span>
                        </div>
                        <span className="text-sm text-gray-300">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`rounded-xl overflow-hidden ${tierColors[tier]}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                      Tier {tier}
                    </p>
                    <p className="text-white text-xl font-bold">
                      {tierLabels[tier]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-xs">Score</p>
                    <p className="text-white text-3xl font-bold">{score}</p>
                  </div>
                </div>
                
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Lead Fields */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-gray-700 bg-gray-800/50 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="font-semibold text-white">Datos del Lead</h2>
              </div>
              
              <div className="p-4">
                <InfoField 
                  icon={Target} 
                  label="Tipo de proyecto" 
                  value={lead.fields?.projectType} 
                />
                <InfoField 
                  icon={MapPin} 
                  label="Ciudad" 
                  value={lead.fields?.city} 
                />
                <InfoField 
                  icon={Ruler} 
                  label="Superficie" 
                  value={lead.fields?.sqm ? `${lead.fields.sqm} m²` : null} 
                />
                <InfoField 
                  icon={Banknote} 
                  label="Presupuesto" 
                  value={lead.fields?.budget ? `${lead.fields.budget.toLocaleString('es-ES')} €` : null} 
                />
                <InfoField 
                  icon={Calendar} 
                  label="Plazo" 
                  value={lead.fields?.timeline} 
                />
                <InfoField 
                  icon={Home} 
                  label="Propietario" 
                  value={lead.fields?.isOwner} 
                />
                <InfoField 
                  icon={FileText} 
                  label="Documentación" 
                  value={lead.fields?.hasDocs} 
                />
              </div>
            </motion.div>

            {/* Contact */}
            {(lead.fields?.contactName || lead.fields?.contactPhone || lead.fields?.contactEmail) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-gray-700 bg-gray-800/50 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-700">
                  <h2 className="font-semibold text-white">Contacto</h2>
                </div>
                
                <div className="p-4">
                  <InfoField 
                    icon={User} 
                    label="Nombre" 
                    value={lead.fields?.contactName} 
                  />
                  <InfoField 
                    icon={Phone} 
                    label="Teléfono" 
                    value={lead.fields?.contactPhone} 
                  />
                  <InfoField 
                    icon={Mail} 
                    label="Email" 
                    value={lead.fields?.contactEmail} 
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
