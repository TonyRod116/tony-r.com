import { useRef, useEffect, useState } from 'react'

export default function DrawingCanvas({ width, height, strokeWidth, strokeIntensity, onDrawingChange }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isErasing, setIsErasing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)

    const getImageData = () => {
      const imageData = ctx.getImageData(0, 0, width, height)
      const pixels = []
      for (let i = 0; i < imageData.data.length; i += 4) {
        // Get grayscale value (average of RGB)
        const gray = imageData.data[i] // R channel (grayscale)
        pixels.push(gray)
      }
      return pixels
    }

    const draw = (e) => {
      if (!isDrawing && !isErasing) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over'
      ctx.fillStyle = isErasing ? 'rgba(0,0,0,1)' : `rgba(255,255,255,${strokeIntensity / 100})`
      
      ctx.beginPath()
      ctx.arc(x, y, strokeWidth, 0, Math.PI * 2)
      ctx.fill()

      onDrawingChange(getImageData())
    }

    const startDrawing = (e) => {
      setIsDrawing(true)
      setIsErasing(e.button === 2 || e.which === 3)
      draw(e)
    }

    const stopDrawing = () => {
      setIsDrawing(false)
      setIsErasing(false)
    }

    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDrawing)
    canvas.addEventListener('mouseleave', stopDrawing)

    // Touch events
    const getTouchPos = (e) => {
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0] || e.changedTouches[0]
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      }
    }

    const startTouch = (e) => {
      e.preventDefault()
      setIsDrawing(true)
      const pos = getTouchPos(e)
      const fakeEvent = { clientX: pos.x + canvas.getBoundingClientRect().left, clientY: pos.y + canvas.getBoundingClientRect().top }
      draw(fakeEvent)
    }

    const touchMove = (e) => {
      e.preventDefault()
      if (isDrawing) {
        const pos = getTouchPos(e)
        const fakeEvent = { clientX: pos.x + canvas.getBoundingClientRect().left, clientY: pos.y + canvas.getBoundingClientRect().top }
        draw(fakeEvent)
      }
    }

    const touchEnd = (e) => {
      e.preventDefault()
      stopDrawing()
    }

    canvas.addEventListener('touchstart', startTouch)
    canvas.addEventListener('touchmove', touchMove)
    canvas.addEventListener('touchend', touchEnd)

    // Prevent context menu on right click
    canvas.addEventListener('contextmenu', (e) => e.preventDefault())

    return () => {
      canvas.removeEventListener('mousedown', startDrawing)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stopDrawing)
      canvas.removeEventListener('mouseleave', stopDrawing)
      canvas.removeEventListener('touchstart', startTouch)
      canvas.removeEventListener('touchmove', touchMove)
      canvas.removeEventListener('touchend', touchEnd)
    }
  }, [width, height, strokeWidth, strokeIntensity, isDrawing, isErasing, onDrawingChange])

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border-2 border-gray-600 rounded cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
