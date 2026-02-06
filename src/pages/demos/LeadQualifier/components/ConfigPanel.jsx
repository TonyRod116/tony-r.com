import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Trash2, Save, RotateCcw, AlertCircle } from 'lucide-react'
import { DEFAULT_CONFIG, validateConfig } from '../utils/config'

export default function ConfigPanel({ config, onSave, onClose }) {
  const [localConfig, setLocalConfig] = useState({ ...config })
  const [newCity, setNewCity] = useState('')
  const [errors, setErrors] = useState([])

  const handleAddCity = () => {
    if (!newCity.trim()) return
    if (localConfig.coveredCities.includes(newCity.trim())) return
    
    setLocalConfig(prev => ({
      ...prev,
      coveredCities: [...prev.coveredCities, newCity.trim()],
    }))
    setNewCity('')
  }

  const handleRemoveCity = (city) => {
    setLocalConfig(prev => ({
      ...prev,
      coveredCities: prev.coveredCities.filter(c => c !== city),
    }))
  }

  const handleBudgetChange = (type, value) => {
    const numValue = parseInt(value, 10) || 0
    setLocalConfig(prev => ({
      ...prev,
      minBudgets: {
        ...prev.minBudgets,
        [type]: numValue,
      },
    }))
  }

  const handleTier5TextChange = (value) => {
    setLocalConfig(prev => ({
      ...prev,
      tier5CloseText: value,
    }))
  }

  const handleSave = () => {
    const validationErrors = validateConfig(localConfig)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setErrors([])
    onSave(localConfig)
    onClose()
  }

  const handleReset = () => {
    setLocalConfig({ ...DEFAULT_CONFIG })
    setErrors([])
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-800 rounded-2xl border border-gray-700 max-w-lg w-full max-h-[90vh] overflow-hidden shadow-xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Configuración de la Demo
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <ul className="text-sm text-red-300 space-y-1">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Covered Cities */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ciudades Cubiertas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCity())}
                placeholder="Añadir ciudad..."
                className="flex-1 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleAddCity}
                className="p-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {localConfig.coveredCities.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-700 text-sm text-gray-300"
                >
                  {city}
                  <button
                    onClick={() => handleRemoveCity(city)}
                    className="p-0.5 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Minimum Budgets */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Presupuestos Mínimos (€)
            </label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(localConfig.minBudgets).map(([type, value]) => (
                <div key={type}>
                  <label className="block text-xs text-gray-400 mb-1 capitalize">
                    {type}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleBudgetChange(type, e.target.value)}
                    min="0"
                    step="1000"
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tier 5 Close Text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Texto de Cierre Tier 5
            </label>
            <textarea
              value={localConfig.tier5CloseText}
              onChange={(e) => handleTier5TextChange(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Este mensaje se muestra cuando un lead no califica (Tier 5)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-800/80">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-sm"
          >
            <RotateCcw className="h-4 w-4" />
            Restablecer
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
            >
              <Save className="h-4 w-4" />
              Guardar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
