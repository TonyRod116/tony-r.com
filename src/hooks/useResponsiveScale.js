import { useState, useEffect } from 'react'

export const useResponsiveScale = () => {
  const [scaleFactor, setScaleFactor] = useState(1)

  useEffect(() => {
    const calculateScale = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Factor base basado en el ancho de pantalla
      let scale = 1
      
      if (width >= 3440) {
        scale = 1.08
      } else if (width >= 2560) {
        scale = 1.05
      } else if (width >= 1920) {
        scale = 1.03
      } else if (width >= 1536) {
        scale = 1.01
      } else if (width >= 1280) {
        scale = 1.005
      } else {
        scale = 1
      }
      
      // Additional adjustment based on aspect ratio
      const aspectRatio = width / height
      if (aspectRatio > 2.5) {
        scale *= 1.1 // Ultra-wide screens
      } else if (aspectRatio < 1.3) {
        scale *= 0.95 // More square screens
      }
      
      setScaleFactor(scale)
      
      // Actualizar CSS custom property
      document.documentElement.style.setProperty('--scale-factor', scale)
    }

    // Calcular escala inicial
    calculateScale()

    // Recalcular en resize
    window.addEventListener('resize', calculateScale)
    
    return () => {
      window.removeEventListener('resize', calculateScale)
    }
  }, [])

  return scaleFactor
}
