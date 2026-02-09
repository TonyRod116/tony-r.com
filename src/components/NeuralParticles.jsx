import { useEffect, useRef } from 'react'

export default function NeuralParticles({
  className = '',
  particleCount,
  connectionDistance = 180,
  lineWidth = 1.8,
  dotSize = [1, 2.5],
  lineOpacity = 0.7,
  dotOpacity = 0.9,
  speed = 0.5,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []
    let isVisible = true

    const getCount = () => {
      if (particleCount) return particleCount
      return window.innerWidth < 768 ? 60 : 130
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
    }

    const initParticles = () => {
      const count = getCount()
      const rect = canvas.getBoundingClientRect()
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: Math.random() * dotSize[1] + dotSize[0],
      }))
    }

    const draw = () => {
      if (!isVisible) {
        animationId = requestAnimationFrame(draw)
        return
      }

      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      ctx.clearRect(0, 0, w, h)

      // Update + draw particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(96,165,250,${dotOpacity})`
        ctx.fill()
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * lineOpacity
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(96,165,250,${alpha})`
            ctx.lineWidth = lineWidth
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    const handleVisibility = () => {
      isVisible = !document.hidden
    }

    resize()
    initParticles()
    draw()

    const resizeObserver = new ResizeObserver(() => {
      resize()
    })
    resizeObserver.observe(canvas)

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(animationId)
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [particleCount, connectionDistance, lineWidth, dotSize, lineOpacity, dotOpacity, speed])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none w-full h-full ${className}`}
    />
  )
}
