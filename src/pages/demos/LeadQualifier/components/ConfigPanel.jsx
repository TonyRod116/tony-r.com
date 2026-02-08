import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, MapPin, Banknote, AlertTriangle, TrendingUp } from 'lucide-react'

export default function ConfigPanel({ config, onSave, onClose, t, inline = false }) {
  const [localConfig, setLocalConfig] = useState({
    coveredCities: config.coveredCities?.join(', ') || '',
    budgetRanges: {
      baño: config.budgetRanges?.baño?.min || 5000,
      cocina: config.budgetRanges?.cocina?.min || 8000,
      integral: config.budgetRanges?.integral?.min || 50000,
      pintura: config.budgetRanges?.pintura?.min || 2500,
    },
    budgetBonusThreshold: config.budgetBonusThreshold ?? 50000,
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
      budgetBonusThreshold: localConfig.budgetBonusThreshold,
    }
    onSave(newConfig)
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
    baño: t('demos.leadQualifier.config.bathroom'),
    cocina: t('demos.leadQualifier.config.kitchen'),
    integral: t('demos.leadQualifier.config.fullRenovation'),
    pintura: t('demos.leadQualifier.config.painting'),
  }

  const content = (
    <>
      {/* Content */}
      <div className={`${inline ? 'p-4' : 'p-6 overflow-y-auto max-h-[60vh]'} space-y-4`}>
        {/* Covered Cities */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
            <MapPin className="h-4 w-4 text-primary-400" />
            {t('demos.leadQualifier.config.coveredCities')}
          </label>
          <textarea
            value={localConfig.coveredCities}
            onChange={(e) => setLocalConfig(prev => ({ ...prev, coveredCities: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={2}
            placeholder={t('demos.leadQualifier.config.citiesPlaceholder')}
          />
          <p className="text-xs text-gray-500 mt-1">{t('demos.leadQualifier.config.citiesSeparator')}</p>
        </div>

        {/* Budget Minimums */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
            <Banknote className="h-4 w-4 text-primary-400" />
            {t('demos.leadQualifier.config.budgetMinimums')}
          </label>
          <p className="text-xs text-amber-400 flex items-center gap-1 mb-2">
            <AlertTriangle className="h-3 w-3" />
            {t('demos.leadQualifier.config.budgetWarning')}
          </p>

          <div className="space-y-2">
            {Object.entries(localConfig.budgetRanges).map(([type, minValue]) => (
              <div key={type} className="flex items-center gap-2 bg-gray-700/50 rounded-lg p-2">
                <span className="text-sm text-white w-28">{typeLabels[type]}</span>
                <div className="flex-1 flex items-center gap-1">
                  <input
                    type="number"
                    value={minValue}
                    onChange={(e) => updateBudgetMin(type, e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-gray-400 text-sm">{'\u20AC'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget bonus threshold */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
            <TrendingUp className="h-4 w-4 text-primary-400" />
            {t('demos.leadQualifier.config.budgetBonusLabel')}
          </label>
          <p className="text-xs text-gray-500 mb-2">
            {t('demos.leadQualifier.config.budgetBonusDesc')}
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={localConfig.budgetBonusThreshold}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, budgetBonusThreshold: parseInt(e.target.value, 10) || 0 }))}
              className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-gray-400 text-sm">{'\u20AC'}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`flex justify-end gap-2 ${inline ? 'px-4 pb-4' : 'px-6 py-4 border-t border-gray-700'}`}>
        {!inline && (
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
          >
            {t('demos.leadQualifier.config.cancel')}
          </button>
        )}
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {t('demos.leadQualifier.config.save')}
        </button>
      </div>
    </>
  )

  if (inline) {
    return content
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
          <h2 className="text-lg font-semibold text-white">{t('demos.leadQualifier.config.title')}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {content}
      </motion.div>
    </motion.div>
  )
}
