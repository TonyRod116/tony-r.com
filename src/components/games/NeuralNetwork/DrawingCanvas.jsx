import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

const GRID_SIZE = 28

const DrawingCanvas = forwardRef(function DrawingCanvas(
  { width, height, strokeWidth, strokeIntensity, onDrawingChange },
  ref
) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isErasing, setIsErasing] = useState(false)
  const isDrawingRef = useRef(false)
  const isErasingRef = useRef(false)
  const strokeWidthRef = useRef(strokeWidth)
  const strokeIntensityRef = useRef(strokeIntensity)
  const lastCellRef = useRef(null)
  const onDrawingChangeRef = useRef(onDrawingChange)
  const ctxRef = useRef(null)
  const emptyPixelsRef = useRef(new Array(GRID_SIZE * GRID_SIZE).fill(0))

  useEffect(() => {
    strokeWidthRef.current = strokeWidth
    strokeIntensityRef.current = strokeIntensity
  }, [strokeWidth, strokeIntensity])

  useEffect(() => {
    onDrawingChangeRef.current = onDrawingChange
  }, [onDrawingChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctxRef.current = ctx
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)

    const downsampleToGrid = () => {
      const smallCanvas = document.createElement('canvas')
      smallCanvas.width = GRID_SIZE
      smallCanvas.height = GRID_SIZE
      const sctx = smallCanvas.getContext('2d', { willReadFrequently: true })
      sctx.imageSmoothingEnabled = false
      sctx.drawImage(canvas, 0, 0, GRID_SIZE, GRID_SIZE)

      const imageData = sctx.getImageData(0, 0, GRID_SIZE, GRID_SIZE)
      const pixels = []
      for (let i = 0; i < imageData.data.length; i += 4) {
        const gray = imageData.data[i]
        pixels.push(gray)
      }
      return pixels
    }

    const draw = (e) => {
      if (!isDrawingRef.current && !isErasingRef.current) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const cellSize = width / GRID_SIZE
      const col = Math.floor(x / cellSize)
      const row = Math.floor(y / cellSize)

      const brushRadius = Math.max(1, Math.round(strokeWidthRef.current))
      const intensity = strokeIntensityRef.current / 100
      ctx.fillStyle = isErasingRef.current ? 'rgb(0,0,0)' : `rgba(255,255,255,${intensity})`

      const paintCell = (r, c) => {
        for (let dy = -brushRadius + 1; dy <= brushRadius - 1; dy++) {
          for (let dx = -brushRadius + 1; dx <= brushRadius - 1; dx++) {
            const rr = r + dy
            const cc = c + dx
            if (rr < 0 || rr >= GRID_SIZE || cc < 0 || cc >= GRID_SIZE) continue
            ctx.fillRect(cc * cellSize, rr * cellSize, cellSize, cellSize)
          }
        }
      }

      const last = lastCellRef.current
      if (!last) {
        paintCell(row, col)
        lastCellRef.current = { row, col }
      } else {
        let x0 = last.col
        let y0 = last.row
        const x1 = col
        const y1 = row
        const dx = Math.abs(x1 - x0)
        const dy = Math.abs(y1 - y0)
        const sx = x0 < x1 ? 1 : -1
        const sy = y0 < y1 ? 1 : -1
        let err = dx - dy

        while (true) {
          paintCell(y0, x0)
          if (x0 === x1 && y0 === y1) break
          const e2 = 2 * err
          if (e2 > -dy) {
            err -= dy
            x0 += sx
          }
          if (e2 < dx) {
            err += dx
            y0 += sy
          }
        }
        lastCellRef.current = { row, col }
      }

      onDrawingChangeRef.current?.(downsampleToGrid())
    }

    const startDrawing = (e) => {
      setIsDrawing(true)
      setIsErasing(e.button === 2 || e.which === 3)
      isDrawingRef.current = true
      isErasingRef.current = e.button === 2 || e.which === 3
      lastCellRef.current = null
      draw(e)
    }

    const stopDrawing = () => {
      setIsDrawing(false)
      setIsErasing(false)
      isDrawingRef.current = false
      isErasingRef.current = false
      lastCellRef.current = null
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
  }, [width, height])

  useImperativeHandle(ref, () => ({
    clear() {
      const canvas = canvasRef.current
      const ctx = ctxRef.current
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, width, height)
      lastCellRef.current = null
      onDrawingChangeRef.current?.(emptyPixelsRef.current)
    }
  }), [width, height])

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border-2 border-gray-600 rounded cursor-crosshair"
        style={{
          imageRendering: 'pixelated',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: `${width / GRID_SIZE}px ${height / GRID_SIZE}px`
        }}
      />
    </div>
  )
})

export default DrawingCanvas
