import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage.jsx'

export default function BeforeAfterSlider({ originalImageUrl, renderedImageUrl, t }) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const sliderContainerRef = useRef(null)
  const { t: translate } = useLanguage()

  useEffect(() => {
    console.log('🔍 BeforeAfterSlider - originalImageUrl:', originalImageUrl)
    console.log('🔍 BeforeAfterSlider - renderedImageUrl:', renderedImageUrl)
  }, [originalImageUrl, renderedImageUrl])

  const handleMouseMove = (e) => {
    e.stopPropagation()
    if (sliderContainerRef.current && !isDragging) {
      const rect = sliderContainerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = (x / rect.width) * 100
      const clampedPercentage = Math.max(0, Math.min(100, percentage))
      setSliderPosition(clampedPercentage)
    }
  }

  const handleTouchMove = (e) => {
    e.stopPropagation()
    if (sliderContainerRef.current) {
      const rect = sliderContainerRef.current.getBoundingClientRect()
      const x = e.touches[0].clientX - rect.left
      const percentage = (x / rect.width) * 100
      const clampedPercentage = Math.max(0, Math.min(100, percentage))
      setSliderPosition(clampedPercentage)
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold text-primary-600/60 dark:text-primary-400/60 uppercase tracking-wide mb-3">
        {t?.('demos.renderPresupuesto.result.comparison') || translate?.('demos.renderPresupuesto.result.comparison') || 'Comparación'}
      </p>
      <div
        ref={sliderContainerRef}
        className="rounded-2xl overflow-hidden bg-black relative touch-none select-none"
        style={{ minHeight: '300px' }}
        onMouseMove={handleMouseMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => {
          e.stopPropagation()
          setIsDragging(true)
          handleTouchMove(e)
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* Rendered Image (Background) */}
        <div className="w-full">
          <img 
            src={renderedImageUrl} 
            alt="AI render" 
            className="w-full h-auto block rounded-none"
            onError={(e) => {
              console.error('Error loading rendered image:', renderedImageUrl)
              e.target.style.display = 'none'
            }}
          />
        </div>
        {/* Original Image (Overlay with clip) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        >
          <img 
            src={originalImageUrl} 
            alt="Original photo" 
            className="w-full h-auto block rounded-none"
            onError={(e) => {
              console.error('Error loading original image:', originalImageUrl)
              e.target.style.display = 'none'
            }}
          />
        </div>
        {/* Slider Handle */}
        <div
          className={`absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none ${
            isDragging ? '' : 'transition-all duration-100'
          }`}
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-primary-600">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-4 bg-primary-600 rounded-full" />
              <div className="w-0.5 h-4 bg-primary-600 rounded-full" />
              <div className="w-0.5 h-4 bg-primary-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-primary-600/50 dark:text-primary-400/50 text-center italic mt-2">
        {t?.('demos.renderPresupuesto.sliderHint') || translate?.('demos.renderPresupuesto.sliderHint') || 'Desliza el control sobre la imagen para comparar con la foto original'}
      </p>
    </div>
  )
}
