import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, MapPin, Banknote, AlertTriangle } from 'lucide-react'

export default function ConfigPanel({ config, onSave, onClose }) {
  const [localConfig, setLocalConfig] = useState({
    coveredCities: config.coveredCities?.join(', ') || '',
    budgetRanges: {
      baño: config.budgetRanges?.baño?.min || 12000,
      cocina: config.budgetRanges?.cocina?.min || 18000,
      integral: config.budgetRanges?.integral?.min || 50000,
      pintura: config.budgetRanges?.pintura?.min || 2500,
    },
  })

  const handleSave = () => {
    const newConfig = {
      ...config,
      coveredCities: localConfig.coveredCities.split(',').map(c => c.trim()).filter(Boolean),
      budgetRanges: {
        baño: { min: localConfig.budgetRanges.baño },
        cocina: { min: localConfig.budgetRanges.cocina },
        integral: { min: localConfig.budgetRanges.integral },
        pintura: { min: localConfig.budgetRanges.pintura },
      },
    }
    onSave(newConfig)
    onClose()
  }

  const updateBudgetMin = (type, value) => {
    setLocalConfig(prev => ({
      ...prev,
      budgetRanges: {
        ...prev.budgetRanges,
        [type]: parseInt(value, 10) || 0,
      },
    }))
  }

  const typeLabels = {
    baño: 'Baño',
    cocina: 'Cocina', 
    integral: 'Reforma Integral',
    pintura: 'Pintura',
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

          {/* Budget Minimums */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
              <Banknote className="h-4 w-4 text-primary-400" />
              Presupuestos mínimos
            </label>
            <p className="text-xs text-amber-400 flex items-center gap-1 mb-3">
              <AlertTriangle className="h-3 w-3" />
              Si el cliente dice menos de esto, baja su clasificación
            </p>
            
            <div className="space-y-3">
              {Object.entries(localConfig.budgetRanges).map(([type, minValue]) => (
                <div key={type} className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3">
                  <span className="text-sm text-white w-32">{typeLabels[type]}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="number"
                      value={minValue}
                      onChange={(e) => updateBudgetMin(type, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-gray-400 text-sm">€</span>
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
