export default function LoadingProgressBar({ stage, t }) {
  const getMessage = (key, fallback) => {
    if (!t || typeof t !== 'function') return fallback
    try {
      const translated = t(key)
      // Si devuelve la clave exacta (no encontró traducción), usar fallback
      if (!translated || translated === key) {
        return fallback
      }
      return translated
    } catch (error) {
      console.warn('Translation error for', key, error)
      return fallback
    }
  }

  const stages = [
    { 
      message: getMessage('solutions.loading.analyzing', 'Analizando proyecto...'), 
      percentage: 10 
    },
    { 
      message: getMessage('solutions.loading.processing', 'Calculando materiales...'), 
      percentage: 25 
    },
    { 
      message: getMessage('solutions.loading.generating', 'Generando partidas...'), 
      percentage: 40 
    },
    { 
      message: getMessage('solutions.loading.preparing', 'Preparando presupuesto...'), 
      percentage: 55 
    },
    { 
      message: getMessage('solutions.loading.finalizing', 'Finalizando detalles...'), 
      percentage: 75 
    },
  ]

  const currentStage = stages[stage] || stages[0]
  const { percentage } = currentStage
  const isFinalStage = stage === 4

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Loader above progress bar */}
        <div className="relative w-full h-24 mb-2 flex items-center justify-center">
          <div
            className="solutions-loader text-primary-600 dark:text-primary-400"
            style={{
              '--solutions-loader-secondary': 'rgb(107 114 128)',
              '--solutions-loader-tertiary': 'rgb(59 130 246)',
            }}
          >
            <span className="solutions-loader__ring" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden relative">
          <div
            className="bg-primary-600 h-full rounded-full transition-all duration-500 ease-out relative progress-bar-animated"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="absolute inset-0 progress-shimmer"
            style={{
              pointerEvents: 'none',
              clipPath: `inset(0 ${100 - percentage}% 0 0)`,
              WebkitClipPath: `inset(0 ${100 - percentage}% 0 0)`,
            }}
          />
        </div>

        {/* Percentage and message */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {currentStage.message}
            </p>
          </div>
          <div className="ml-4">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {percentage}%
            </span>
          </div>
        </div>

        {isFinalStage && (
          <p className="text-xs text-primary-600/60 dark:text-primary-400/60">
            {getMessage('solutions.loading.finalizingMessage', 'Esto puede tardar unos momentos...')}
          </p>
        )}
      </div>
    </div>
  )
}
