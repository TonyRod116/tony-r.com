import Lottie from 'lottie-react'
import loadingAnimation from '../assets/loading-animation.json'

export default function LoadingProgressBar({ stage, t }) {
  const stages = [
    { 
      message: t?.('demos.loading.analyzing') || 'Analizando tu solicitud...', 
      percentage: 10 
    },
    { 
      message: t?.('demos.loading.processing') || 'Procesando información...', 
      percentage: 25 
    },
    { 
      message: t?.('demos.loading.generating') || 'Generando contenido...', 
      percentage: 40 
    },
    { 
      message: t?.('demos.loading.preparing') || 'Preparando resultados...', 
      percentage: 55 
    },
    { 
      message: t?.('demos.loading.finalizing') || 'Finalizando...', 
      percentage: 75 
    },
  ]

  const currentStage = stages[stage] || stages[0]
  const { percentage } = currentStage
  const isFinalStage = stage === 4

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Lottie Animation above progress bar */}
        <div className="relative w-full h-24 mb-2 flex items-center justify-center">
          <div className="w-20 h-20">
            <Lottie animationData={loadingAnimation} loop autoplay />
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
            {t?.('demos.loading.finalizingMessage') || 'Esto puede tardar unos momentos...'}
          </p>
        )}
      </div>
    </div>
  )
}
