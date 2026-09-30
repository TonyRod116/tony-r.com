import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

const SIZE = 280
const DrawingCanvas = forwardRef(function DrawingCanvas({ strokeWidth = 2, erasing = false, onDrawingChange, label }, ref) {
  const canvasRef = useRef(null)
  const last = useRef(null)
  const emit = () => {
    const small = document.createElement('canvas')
    small.width = small.height = 28
    const context = small.getContext('2d')
    context.drawImage(canvasRef.current, 0, 0, 28, 28)
    const data = context.getImageData(0, 0, 28, 28).data
    onDrawingChange(Array.from({ length: 784 }, (_, i) => data[i * 4] / 255))
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
      ctx.beginPath()
      if (digit === 0) ctx.ellipse(140, 140, 55, 85, 0, 0, Math.PI * 2)
      if (digit === 1) { ctx.moveTo(115, 80); ctx.lineTo(145, 55); ctx.lineTo(145, 225) }
      if (digit === 7) { ctx.moveTo(75, 65); ctx.lineTo(200, 65); ctx.lineTo(115, 225) }
      ctx.stroke(); emit()
    },
  }))
  const draw = event => {
    const canvas = canvasRef.current, rect = canvas.getBoundingClientRect()
    const point = { x: (event.clientX - rect.left) * SIZE / rect.width, y: (event.clientY - rect.top) * SIZE / rect.height }
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = erasing || event.buttons === 2 ? '#000' : '#fff'
    ctx.lineWidth = strokeWidth * 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.beginPath(); ctx.moveTo(last.current?.x ?? point.x, last.current?.y ?? point.y); ctx.lineTo(point.x + 0.01, point.y + 0.01); ctx.stroke()
    last.current = point; emit()
  }
  return <canvas ref={canvasRef} width={SIZE} height={SIZE} className="ai-drawing-canvas" role="img" aria-label={label}
    onPointerDown={e => { if (e.button !== 0 && e.button !== 2) return; e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); last.current = null; draw(e) }}
    onPointerMove={e => { if (e.currentTarget.hasPointerCapture(e.pointerId) && last.current) draw(e) }}
    onPointerUp={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); last.current = null }}
    onPointerCancel={() => { last.current = null }} onLostPointerCapture={() => { last.current = null }} onContextMenu={e => e.preventDefault()} />
})
export default DrawingCanvas
