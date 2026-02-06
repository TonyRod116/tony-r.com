import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, MapPin, Banknote } from 'lucide-react'

export default function ConfigPanel({ config, onSave, onClose }) {
  const [localConfig, setLocalConfig] = useState({
    coveredCities: config.coveredCities?.join(', ') || '',
    budgetRanges: {
      baño: config.budgetRanges?.baño || { min: 8000, typical: '8.000€ - 18.000€' },
      cocina: config.budgetRanges?.cocina || { min: 12000, typical: '12.000€ - 25.000€' },
      integral: config.budgetRanges?.integral || { min: 30000, typical: '30.000€ - 80.000€' },
      pintura: config.budgetRanges?.pintura || { min: 1500, typical: '1.500€ - 5.000€' },
    },
  })

  const handleSave = () => {
    const newConfig = {
      ...config,
      coveredCities: localConfig.coveredCities.split(',').map(c => c.trim()).filter(Boolean),
      budgetRanges: localConfig.budgetRanges,
    }
    onSave(newConfig)
    onClose()
  }

  const updateBudgetRange = (type, field, value) => {
    setLocalConfig(prev => ({
      ...prev,
      budgetRanges: {
        ...prev.budgetRanges,
        [type]: {
          ...prev.budgetRanges[type],
          [field]: field === 'min' ? parseInt(value, 10) || 0 : value,
        },
      },
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg max-h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Configuración</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {/* Covered Cities */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
              <MapPin className="h-4 w-4 text-primary-400" />
              Ciudades cubiertas
            </label>
            <textarea
              value={localConfig.coveredCities}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, coveredCities: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Barcelona, Hospitalet, Badalona..."
            />
            <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
          </div>

          {/* Budget Ranges */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
              <Banknote className="h-4 w-4 text-primary-400" />
              Rangos de presupuesto
            </label>
            
            <div className="space-y-4">
              {Object.entries(localConfig.budgetRanges).map(([type, range]) => (
                <div key={type} className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-white capitalize mb-3">{type}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Mínimo (€)</label>
                      <input
                        type="number"
                        value={range.min}
                        onChange={(e) => updateBudgetRange(type, 'min', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Rango típico</label>
                      <input
                        type="text"
                        value={range.typical}
                        onChange={(e) => updateBudgetRange(type, 'typical', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:ring-2 focus:ring-primary-500"
                        placeholder="8.000€ - 18.000€"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Guardar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
