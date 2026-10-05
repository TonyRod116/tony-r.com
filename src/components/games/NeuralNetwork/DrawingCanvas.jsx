import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { DIGIT_EXAMPLES } from './digitExamples'

const SIZE = 280
const DrawingCanvas = forwardRef(function DrawingCanvas({ strokeWidth = 2, erasing = false, onDrawingChange, label }, ref) {
  const canvasRef = useRef(null)
  const last = useRef(null)
  const small = useRef(null)
  // `final` distingue las actualizaciones intermedias de un trazo de la definitiva (al soltar, borrar o elegir un ejemplo).
  const emit = (final = true) => {
    if (!small.current) { small.current = document.createElement('canvas'); small.current.width = small.current.height = 28 }
    const context = small.current.getContext('2d', { willReadFrequently: true })
    context.clearRect(0, 0, 28, 28)
    context.drawImage(canvasRef.current, 0, 0, 28, 28)
    const data = context.getImageData(0, 0, 28, 28).data
    onDrawingChange(Array.from({ length: 784 }, (_, i) => data[i * 4] / 255), { final })
  }
  const clear = () => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, SIZE, SIZE)
    last.current = null
  }
  useEffect(() => { clear() }, [])
  useImperativeHandle(ref, () => ({
    clear() { clear(); emit() },
    example(digit) {
      clear()
      const ctx = canvasRef.current.getContext('2d')
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      if (!Number.isInteger(digit) || !DIGIT_EXAMPLES[digit]) return
      ctx.stroke(new Path2D(DIGIT_EXAMPLES[digit])); emit()
    },
  }))
  const draw = event => {
    const canvas = canvasRef.current, rect = canvas.getBoundingClientRect()
    const point = { x: (event.clientX - rect.left) * SIZE / rect.width, y: (event.clientY - rect.top) * SIZE / rect.height }
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = erasing || event.buttons === 2 ? '#000' : '#fff'
    ctx.lineWidth = strokeWidth * 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.beginPath(); ctx.moveTo(last.current?.x ?? point.x, last.current?.y ?? point.y); ctx.lineTo(point.x + 0.01, point.y + 0.01); ctx.stroke()
    last.current = point; emit(false)
  }
  return <canvas ref={canvasRef} width={SIZE} height={SIZE} className="ai-drawing-canvas" role="img" aria-label={label}
    onPointerDown={e => { if (e.button !== 0 && e.button !== 2) return; e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); last.current = null; draw(e) }}
    onPointerMove={e => { if (e.currentTarget.hasPointerCapture(e.pointerId) && last.current) draw(e) }}
    onPointerUp={e => { const drawing = last.current; if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); last.current = null; if (drawing) emit(true) }}
    onPointerCancel={() => { last.current = null }} onLostPointerCapture={() => { last.current = null }} onContextMenu={e => e.preventDefault()} />
})
export default DrawingCanvas
