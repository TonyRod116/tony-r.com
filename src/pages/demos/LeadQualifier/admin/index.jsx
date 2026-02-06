import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Trash2, 
  Download, 
  Search, 
  Filter,
  ChevronDown,
  AlertCircle,
  Users,
  TrendingUp,
  Star
} from 'lucide-react'
import { 
  getLeadsFromStorage, 
  deleteLeadFromStorage, 
  clearAllLeads,
  exportLeadsAsJSON,
  exportLeadsAsCSV 
} from '../utils/storage'

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

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  )
}

function LeadRow({ lead, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = () => {
    onDelete(lead.id)
    setShowConfirm(false)
  }

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
    >
      <td className="px-4 py-3">
        <Link
          to={`/demos/lead-qualifier/admin/lead/${lead.id}`}
          className="text-sm text-primary-400 hover:text-primary-300 hover:underline"
        >
          {lead.id.slice(0, 12)}...
        </Link>
      </td>
      <td className="px-4 py-3 text-sm text-gray-300">
        {new Date(lead.createdAt).toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </td>
      <td className="px-4 py-3 text-sm text-gray-300">
        {lead.summary || '-'}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white ${tierColors[lead.tier || 5]}`}>
          T{lead.tier || 5}
          <span className="opacity-80">{tierLabels[lead.tier || 5]}</span>
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${tierColors[lead.tier || 5]}`}
              style={{ width: `${lead.score || 0}%` }}
            />
          </div>
          <span className="text-sm text-gray-300 w-8">{lead.score || 0}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        {showConfirm ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
            >
              Confirmar
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="p-2 rounded-lg hover:bg-gray-600 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </td>
    </motion.tr>
  )
}

export default function LeadQualifierAdmin() {
  const [leads, setLeads] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = () => {
    const storedLeads = getLeadsFromStorage()
    setLeads(storedLeads)
  }

  const handleDeleteLead = (id) => {
    deleteLeadFromStorage(id)
    loadLeads()
  }

  const handleClearAll = () => {
    clearAllLeads()
    setLeads([])
    setShowClearConfirm(false)
  }

  const handleExportJSON = () => {
    const json = exportLeadsAsJSON()
    downloadFile(json, 'leads.json', 'application/json')
    setShowExportMenu(false)
  }

  const handleExportCSV = () => {
    const csv = exportLeadsAsCSV()
    downloadFile(csv, 'leads.csv', 'text/csv')
    setShowExportMenu(false)
  }

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTier = tierFilter === 'all' || lead.tier === parseInt(tierFilter)
    
    return matchesSearch && matchesTier
  })

  // Calculate stats
  const stats = {
    total: leads.length,
    avgScore: leads.length > 0 
      ? Math.round(leads.reduce((acc, l) => acc + (l.score || 0), 0) / leads.length)
      : 0,
    premium: leads.filter(l => l.tier === 1 || l.tier === 2).length,
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            to="/demos/lead-qualifier"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al chat
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
              <p className="text-gray-400 text-sm">
                Gestiona los leads guardados en localStorage
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Export dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-40 rounded-lg bg-gray-700 border border-gray-600 shadow-xl z-10">
                    <button
                      onClick={handleExportJSON}
                      className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-600 transition-colors rounded-t-lg"
                    >
                      Exportar JSON
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-600 transition-colors rounded-b-lg"
                    >
                      Exportar CSV
                    </button>
                  </div>
                )}
              </div>

              {/* Clear all */}
              {showClearConfirm ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  disabled={leads.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Borrar todo
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          <StatCard
            icon={Users}
            label="Total Leads"
            value={stats.total}
            color="bg-primary-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Score Promedio"
            value={stats.avgScore}
            color="bg-blue-600"
          />
          <StatCard
            icon={Star}
            label="Leads Premium"
            value={stats.premium}
            color="bg-green-600"
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ID o resumen..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 rounded-lg border border-gray-600 bg-gray-800 text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">Todos los Tiers</option>
              <option value="1">Tier 1 - Premium</option>
              <option value="2">Tier 2 - Calificado</option>
              <option value="3">Tier 3 - Tibio</option>
              <option value="4">Tier 4 - Frío</option>
              <option value="5">Tier 5 - No calificado</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-gray-700 bg-gray-800/50 overflow-hidden"
        >
          {filteredLeads.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                {leads.length === 0 
                  ? 'No hay leads guardados. Completa una conversación en el chat para ver leads aquí.'
                  : 'No se encontraron leads con los filtros actuales.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Resumen
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredLeads.map((lead) => (
                      <LeadRow
                        key={lead.id}
                        lead={lead}
                        onDelete={handleDeleteLead}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
