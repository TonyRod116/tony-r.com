import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage.jsx'

// Componente mínimo que solo renderiza el header y luego inicializa código vanilla
export default function NeuralNetworkVanilla() {
  const { t } = useLanguage()
  const containerRef = useRef(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return
    initializedRef.current = true
    let cancelled = false

    // Importar Three.js dinámicamente solo cuando se necesite
    Promise.all([
      import('three'),
      import('three/examples/jsm/controls/OrbitControls.js')
    ]).then(([THREE, OrbitControlsModule]) => {
      if (cancelled || !containerRef.current) return
      // Hacer Three.js disponible globalmente para el código vanilla
      window.THREE = THREE
      // Inicializar la visualización vanilla aquí
      initializeVanillaVisualization(containerRef.current, THREE, OrbitControlsModule)
    }).catch(err => {
      console.error('Error loading Three.js:', err)
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="padding: 48px; text-align: center; color: #ef4444;">
            <h2>Error loading visualization</h2>
            <p>Failed to load Three.js: ${err.message}</p>
          </div>
        `
      }
    })

    return () => {
      // Cleanup: limpiar el contenedor cuando el componente se desmonte
      cancelled = true
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      initializedRef.current = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header simplificado */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/ai"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{t('aiLab.backToAI') || 'Back to AI Lab'}</span>
          </Link>
        </div>
      </div>

      {/* Contenedor donde se montará la visualización vanilla */}
      <div ref={containerRef} id="neural-network-container" className="pt-16"></div>
    </div>
  )
}

// Función que inicializa la visualización vanilla (basada en el repositorio original)
async function initializeVanillaVisualization(container, THREE, OrbitControlsModule) {
  const OrbitControls = OrbitControlsModule.OrbitControls || OrbitControlsModule.default
  
  // Configuración según el repositorio original
  const VISUALIZER_CONFIG = {
    weightUrl: 'https://raw.githubusercontent.com/DFin/Neural-Network-Visualisation/main/exports/mlp_weights/014_dataset-1x.json',
    maxConnectionsPerNeuron: 24,
    layerSpacing: 5.5,
    inputSpacing: 0.24,
    hiddenSpacing: 0.95,
    inputNodeSize: 0.18,
    hiddenNodeRadius: 0.22,
    connectionRadius: 0.005,
    connectionWeightThreshold: 0,
    brush: {
      drawRadius: 1.4,
      eraseRadius: 2.5,
      drawStrength: 0.95,
      eraseStrength: 0.95,
      softness: 0.3,
    },
  }

  const NORMALIZATION = { mean: 0.1307, std: 0.3081 }

  // Crear estructura HTML básica
  container.innerHTML = `
    <div style="min-height: 100vh; background: #111827; color: white; padding-top: 64px;">
      <div style="max-width: 1400px; margin: 0 auto; padding: 24px;">
        <!-- Title -->
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 8px;">
            MNIST Neural Network Visualization
          </h1>
          <p style="color: #9ca3af;">
            Draw a digit and watch how activations propagate through the network
          </p>
        </div>

        <!-- Main Layout -->
        <div style="display: grid; grid-template-columns: 320px 1fr; gap: 24px; margin-bottom: 24px;">
          <!-- Left: Drawing Canvas -->
          <div>
            <div style="background: #1f2937; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
              <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 16px;">Drawing</h2>
              <div id="gridContainer"></div>
              <div style="margin-top: 16px;">
                <button id="resetBtn" style="width: 100%; padding: 8px 16px; background: #374151; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: 500;">
                  Clear
                </button>
              </div>
              <p style="font-size: 0.75rem; color: #9ca3af; margin-top: 8px;">
                Click and drag to draw (right-click to erase)
              </p>
            </div>

            <!-- Prediction Chart -->
            <div id="predictionChart" style="background: #1f2937; border-radius: 12px; padding: 16px;">
              <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 16px;">Prediction</h2>
            </div>
          </div>

          <!-- Right: 3D Network Visualization -->
          <div>
            <div style="background: #1f2937; border-radius: 12px; padding: 16px; height: 600px;">
              <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 16px;">Network Architecture</h2>
              <div id="threeContainer" style="width: 100%; height: 420px; background: #111827; border-radius: 8px; overflow: hidden;"></div>
              <p style="font-size: 0.75rem; color: #9ca3af; margin-top: 8px;">
                Left click + drag: rotate | Right click + drag: pan | Scroll: zoom
              </p>
            </div>
          </div>
        </div>

        <!-- Settings Button -->
        <div style="text-align: center;">
          <button id="advancedSettingsButton" style="padding: 8px 16px; background: #374151; border: none; border-radius: 8px; color: white; cursor: pointer;">
            ⚙ Settings
          </button>
        </div>
      </div>
    </div>
  `

  // Ahora inicializar el código vanilla del repositorio original
  // (Adaptado del código que vimos en main.js del repositorio)
  
  // Helper functions del repositorio original
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value))
  }

  function softmax(values) {
    if (!values.length) return []
    const maxVal = Math.max(...values)
    const exps = values.map((value) => Math.exp(value - maxVal))
    const sum = exps.reduce((acc, value) => acc + value, 0)
    return exps.map((value) => (sum === 0 ? 0 : value / sum))
  }

  function maxAbsValue(values) {
    let max = 0
    for (let i = 0; i < values.length; i += 1) {
      const magnitude = Math.abs(values[i])
      if (magnitude > max) {
        max = magnitude
      }
    }
    return max
  }

  // Decode functions del repositorio original
  function decodeBase64ToUint8Array(base64) {
    const binary = atob(base64)
    const length = binary.length
    const bytes = new Uint8Array(length)
    for (let i = 0; i < length; i += 1) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes
  }

  function float16ToFloat32(value) {
    const sign = (value & 0x8000) >> 15
    const exponent = (value & 0x7c00) >> 10
    const fraction = value & 0x03ff

    let result
    if (exponent === 0) {
      if (fraction === 0) {
        result = 0
      } else {
        result = (fraction / 0x400) * Math.pow(2, -14)
      }
    } else if (exponent === 0x1f) {
      result = fraction === 0 ? Number.POSITIVE_INFINITY : Number.NaN
    } else {
      result = (1 + fraction / 0x400) * Math.pow(2, exponent - 15)
    }

    return sign === 1 ? -result : result
  }

  function decodeFloat16Base64(base64, expectedLength) {
    const bytes = decodeBase64ToUint8Array(base64)
    if (bytes.byteLength % 2 !== 0) {
      throw new Error('Float16 data has invalid length.')
    }
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    const length = bytes.byteLength / 2
    if (Number.isFinite(expectedLength) && expectedLength > 0 && length !== expectedLength) {
      throw new Error(`Expected ${expectedLength} Float16 values, but got ${length}.`)
    }
    const result = new Float32Array(length)
    for (let index = 0; index < length; index += 1) {
      const half = view.getUint16(index * 2, true)
      result[index] = float16ToFloat32(half)
    }
    return result
  }

  function decodeWeightMatrix(encoded, shape) {
    const rows = Math.max(0, Number(shape?.[0]) || 0)
    const cols = Math.max(0, Number(shape?.[1]) || 0)
    if (rows === 0 || cols === 0) {
      return []
    }
    const flat = decodeFloat16Base64(encoded, rows * cols)
    const result = []
    for (let row = 0; row < rows; row += 1) {
      const start = row * cols
      const end = start + cols
      result.push(flat.slice(start, end))
    }
    return result
  }

  function normaliseShape(shape, fallback = []) {
    const source = Array.isArray(shape) ? shape : fallback
    if (!Array.isArray(source)) return []
    return source.map((value) => Number(value) || 0)
  }

  function normaliseLayerMetadata(layer, index) {
    const layerIndex = Number.isFinite(layer?.layer_index) ? Number(layer.layer_index) : index
    const weightShape = normaliseShape(layer?.weight_shape)
    const biasShape = normaliseShape(layer?.bias_shape)
    const resolvedWeightShape =
      weightShape.length === 2 ? weightShape : [biasShape[0] ?? 0, weightShape[1] ?? 0]
    const resolvedBiasShape = biasShape.length >= 1 ? biasShape : [resolvedWeightShape[0] ?? 0]
    return {
      layerIndex,
      name: typeof layer?.name === 'string' ? layer.name : `dense_${layerIndex}`,
      activation: typeof layer?.activation === 'string' ? layer.activation : 'relu',
      weightShape: resolvedWeightShape,
      biasShape: resolvedBiasShape,
    }
  }

  function normaliseWeightsDescriptor(descriptor, baseUrl) {
    if (!descriptor || typeof descriptor !== 'object') return null
    const path = typeof descriptor.path === 'string' ? descriptor.path : null
    if (!path) return null
    try {
      const baseUrlObj = baseUrl instanceof URL ? baseUrl : new URL(baseUrl, window.location.href)
      return {
        path,
        url: new URL(path, baseUrlObj).toString(),
        dtype: typeof descriptor.dtype === 'string' ? descriptor.dtype : 'float16',
        format: typeof descriptor.format === 'string' ? descriptor.format : 'layer_array_v1',
      }
    } catch (error) {
      console.warn('Could not resolve relative URL:', path, error)
      return null
    }
  }

  async function fetchSnapshotPayload(url) {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error(`Snapshot could not be loaded (${response.status})`)
    }
    return response.json()
  }

  function decodeSnapshotLayers(payload, layerMetadata) {
    if (!payload || typeof payload !== 'object' || !Array.isArray(payload.layers)) {
      throw new Error('Snapshot file does not contain valid layer data.')
    }

    return layerMetadata.map((meta, index) => {
      const layerPayload =
        payload.layers[index] ??
        payload.layers.find((layer) => Number(layer?.layer_index) === meta.layerIndex)
      if (!layerPayload) {
        throw new Error(`Snapshot missing layer ${meta.layerIndex}.`)
      }
      const weightsInfo = layerPayload.weights ?? {}
      const biasesInfo = layerPayload.biases ?? {}
      if (typeof weightsInfo.data !== 'string' || typeof biasesInfo.data !== 'string') {
        throw new Error('Snapshot layer does not contain encoded weights.')
      }

      const weightShape = normaliseShape(weightsInfo.shape, meta.weightShape)
      const biasShape = normaliseShape(biasesInfo.shape, meta.biasShape)
      if (weightShape.length !== 2) {
        throw new Error('Snapshot layer has invalid weight dimension.')
      }
      if (biasShape.length === 0) {
        throw new Error('Snapshot layer has invalid bias dimension.')
      }

      const weights = decodeWeightMatrix(weightsInfo.data, weightShape)
      const biases = decodeFloat16Base64(biasesInfo.data, biasShape[0])
      return {
        name: typeof layerPayload.name === 'string' ? layerPayload.name : meta.name,
        activation:
          typeof layerPayload.activation === 'string' ? layerPayload.activation : meta.activation,
        weights,
        biases,
      }
    })
  }

  async function fetchNetworkDefinition(url) {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error(`Network weights could not be loaded (${response.status})`)
    }
    return response.json()
  }

  // Clases del repositorio original adaptadas
  class DigitSketchPad {
    constructor(container, rows, cols, options = {}) {
      if (!container) {
        throw new Error('Grid container not found.')
      }
      this.container = container
      this.rows = rows
      this.cols = cols
      this.values = new Float32Array(rows * cols)
      this.cells = []
      this.isDrawing = false
      this.activeMode = 'draw'
      this.onChange = null
      this.pendingChange = false
      this.interactionRow = null
      const defaultBrush = {
        drawRadius: 1.2,
        eraseRadius: 1.2,
        drawStrength: 0.85,
        eraseStrength: 0.8,
        softness: 0.5,
      }
      this.brush = Object.assign(defaultBrush, options.brush || {})
      this.buildGrid()
    }

    buildGrid() {
      this.gridElement = document.createElement('div')
      this.gridElement.className = 'grid'
      this.gridElement.style.display = 'grid'
      this.gridElement.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`
      this.gridElement.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`
      this.gridElement.style.width = '280px'
      this.gridElement.style.height = '280px'
      this.gridElement.style.gap = '0'
      this.gridElement.style.border = '2px solid #374151'
      this.gridElement.style.borderRadius = '8px'
      this.gridElement.style.overflow = 'hidden'

      for (let i = 0; i < this.values.length; i += 1) {
        const cell = document.createElement('div')
        cell.className = 'grid-cell'
        cell.dataset.index = String(i)
        cell.style.background = 'rgba(255, 255, 255, 0.05)'
        cell.style.border = 'none'
        cell.style.cursor = 'crosshair'
        this.gridElement.appendChild(cell)
        this.cells.push(cell)
      }

      this.container.innerHTML = ''
      const title = document.createElement('div')
      title.className = 'grid-title'
      title.textContent = 'Draw digit'
      title.style.fontSize = '0.875rem'
      title.style.color = '#9ca3af'
      title.style.marginBottom = '8px'
      this.interactionRow = document.createElement('div')
      this.interactionRow.className = 'grid-interaction-row'
      this.interactionRow.appendChild(this.gridElement)
      this.container.appendChild(title)
      this.container.appendChild(this.interactionRow)

      this.gridElement.addEventListener('pointerdown', (event) => this.handlePointerDown(event))
      this.gridElement.addEventListener('pointermove', (event) => this.handlePointerMove(event))
      window.addEventListener('pointerup', () => this.handlePointerUp())
      this.gridElement.addEventListener('contextmenu', (event) => event.preventDefault())
    }

    setChangeHandler(handler) {
      this.onChange = handler
    }

    getBrushSettings() {
      return {
        drawRadius: this.brush.drawRadius,
        drawStrength: this.brush.drawStrength,
        eraseRadius: this.brush.eraseRadius,
        eraseStrength: this.brush.eraseStrength,
        softness: this.brush.softness,
      }
    }

    updateBrushSettings(updates = {}) {
      if (!updates || typeof updates !== 'object') {
        return this.getBrushSettings()
      }
      if (Object.prototype.hasOwnProperty.call(updates, 'drawRadius')) {
        const radius = Number(updates.drawRadius)
        if (Number.isFinite(radius)) {
          this.brush.drawRadius = clamp(radius, 0.2, 10)
        }
      }
      if (Object.prototype.hasOwnProperty.call(updates, 'drawStrength')) {
        const strength = Number(updates.drawStrength)
        if (Number.isFinite(strength)) {
          this.brush.drawStrength = clamp(strength, 0, 1)
        }
      }
      return this.getBrushSettings()
    }

    handlePointerDown(event) {
      event.preventDefault()
      const isErase = event.button === 2 || event.buttons === 2
      this.activeMode = isErase ? 'erase' : 'draw'
      this.isDrawing = true
      this.applyPointer(event)
    }

    handlePointerMove(event) {
      if (!this.isDrawing) return
      this.applyPointer(event)
    }

    handlePointerUp() {
      this.isDrawing = false
    }

    applyPointer(event) {
      const element = document.elementFromPoint(event.clientX, event.clientY)
      if (!element) return
      const cell = element.closest('[data-index]')
      if (!cell) return
      const index = Number(cell.dataset.index)
      if (Number.isNaN(index)) return
      this.paintCell(index, this.activeMode === 'erase')
    }

    paintCell(index, erase = false) {
      const row = Math.floor(index / this.cols)
      const col = index % this.cols
      if (row < 0 || col < 0) return
      const changed = this.applyBrush(row, col, erase)
      if (changed) {
        this.scheduleChange()
      }
    }

    applyBrush(centerRow, centerCol, erase = false) {
      const radius = erase ? this.brush.eraseRadius : this.brush.drawRadius
      const strength = erase ? -this.brush.eraseStrength : this.brush.drawStrength
      const softness = clamp(this.brush.softness ?? 0.5, 0, 0.95)
      const span = Math.ceil(radius)
      let modified = false
      for (let row = centerRow - span; row <= centerRow + span; row += 1) {
        if (row < 0 || row >= this.rows) continue
        for (let col = centerCol - span; col <= centerCol + span; col += 1) {
          if (col < 0 || col >= this.cols) continue
          const distance = Math.hypot(row - centerRow, col - centerCol)
          if (distance > radius) continue
          const falloff = 1 - distance / radius
          if (falloff <= 0) continue
          const influence = Math.pow(falloff, 1 + softness * 2)
          const delta = strength * influence
          if (Math.abs(delta) < 1e-3) continue
          const cellIndex = row * this.cols + col
          const current = this.values[cellIndex]
          const nextValue = clamp(current + delta, 0, 1)
          if (nextValue === current) continue
          this.values[cellIndex] = nextValue
          this.updateCellVisual(cellIndex)
          modified = true
        }
      }
      return modified
    }

    updateCellVisual(index) {
      const cell = this.cells[index]
      if (!cell) return
      const value = this.values[index]
      if (value <= 0) {
        cell.style.background = 'rgba(255, 255, 255, 0.05)'
        cell.classList.remove('active')
        return
      }
      const hue = 180 - value * 70
      const saturation = 70 + value * 25
      const lightness = 25 + value * 40
      cell.style.background = `hsl(${hue.toFixed(0)}, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%)`
      cell.classList.add('active')
    }

    scheduleChange() {
      if (this.pendingChange) return
      this.pendingChange = true
      requestAnimationFrame(() => {
        this.pendingChange = false
        if (typeof this.onChange === 'function') {
          this.onChange()
        }
      })
    }

    getPixels() {
      return Float32Array.from(this.values)
    }

    setPixels(pixels) {
      if (!pixels || typeof pixels.length !== 'number') {
        throw new Error('Invalid pixel values for sketch pad.')
      }
      if (pixels.length !== this.values.length) {
        throw new Error(`Expected ${this.values.length} pixels, but got ${pixels.length}.`)
      }
      for (let i = 0; i < this.values.length; i += 1) {
        const value = clamp(Number(pixels[i]) || 0, 0, 1)
        if (this.values[i] !== value) {
          this.values[i] = value
          this.updateCellVisual(i)
        }
      }
      if (typeof this.onChange === 'function') {
        this.onChange()
      }
    }

    clear() {
      this.values.fill(0)
      for (let i = 0; i < this.cells.length; i += 1) {
        this.updateCellVisual(i)
      }
      if (typeof this.onChange === 'function') {
        this.onChange()
      }
    }

    getInteractionRow() {
      return this.interactionRow
    }

    getGridElement() {
      return this.gridElement
    }
  }

  class FeedForwardModel {
    constructor(definition) {
      if (!definition.layers?.length) {
        throw new Error('Network definition must contain layers.')
      }
      this.normalization = definition.normalization ?? { mean: 0, std: 1 }
      this.architecture = Array.isArray(definition.architecture)
        ? definition.architecture.slice()
        : this.computeArchitecture(definition.layers)
      this.layers = definition.layers.map((layer, index) => this.normaliseLayer(layer, index))
    }

    computeArchitecture(layers) {
      if (!layers.length) return []
      const architecture = []
      const firstLayer = layers[0]
      architecture.push(firstLayer.weights[0]?.length ?? 0)
      for (const layer of layers) {
        architecture.push(layer.biases.length)
      }
      return architecture
    }

    normaliseLayer(layer, index) {
      if (!layer || !Array.isArray(layer.weights) || layer.weights.length === 0) {
        throw new Error(`Layer ${index} is missing valid weight matrices.`)
      }
      const weights = layer.weights.map((row) => {
        if (row instanceof Float32Array) {
          return new Float32Array(row)
        }
        if (Array.isArray(row)) {
          return Float32Array.from(row)
        }
        throw new Error(`Layer ${index} contains an invalid weight row.`)
      })
      let biases
      if (layer.biases instanceof Float32Array) {
        biases = new Float32Array(layer.biases)
      } else if (Array.isArray(layer.biases)) {
        biases = Float32Array.from(layer.biases)
      } else {
        biases = new Float32Array(weights.length > 0 ? weights[0].length : 0)
      }
      return {
        name: typeof layer.name === 'string' ? layer.name : `dense_${index}`,
        activation: typeof layer.activation === 'string' ? layer.activation : 'relu',
        weights,
        biases,
      }
    }

    updateLayers(layerDefinitions) {
      if (!Array.isArray(layerDefinitions) || layerDefinitions.length === 0) {
        throw new Error('New layer definitions must contain at least one layer.')
      }
      this.layers = layerDefinitions.map((layer, index) => this.normaliseLayer(layer, index))
      this.architecture = this.computeArchitecture(this.layers)
    }

    propagate(pixels) {
      const { mean, std } = this.normalization
      const input = new Float32Array(pixels.length)
      for (let i = 0; i < pixels.length; i += 1) {
        input[i] = (pixels[i] - mean) / std
      }

      const activations = [input]
      const preActivations = []
      let current = input

      for (const layer of this.layers) {
        const outSize = layer.biases.length
        const linear = new Float32Array(outSize)

        for (let neuron = 0; neuron < outSize; neuron += 1) {
          let sum = layer.biases[neuron]
          const weights = layer.weights[neuron]
          for (let source = 0; source < weights.length; source += 1) {
            sum += weights[source] * current[source]
          }
          linear[neuron] = sum
        }

        preActivations.push(linear)
        let activated
        if (layer.activation === 'relu') {
          activated = new Float32Array(outSize)
          for (let i = 0; i < outSize; i += 1) {
            activated[i] = linear[i] > 0 ? linear[i] : 0
          }
        } else {
          activated = linear.slice()
        }
        activations.push(activated)
        current = activated
      }

      return {
        normalizedInput: activations[0],
        activations,
        preActivations,
      }
    }
  }

  class ProbabilityPanel {
    constructor(container) {
      this.container = container
      this.rows = []
      if (!this.container) {
        throw new Error('Prediction chart container not found.')
      }
      this.build()
    }

    build() {
      this.container.innerHTML = ''
      const title = document.createElement('h3')
      title.textContent = 'Digit Probabilities'
      title.style.fontSize = '1rem'
      title.style.fontWeight = '600'
      title.style.marginBottom = '16px'
      this.container.appendChild(title)

      this.chartElement = document.createElement('div')
      this.chartElement.className = 'prediction-chart'
      this.chartElement.style.display = 'flex'
      this.chartElement.style.flexDirection = 'column'
      this.chartElement.style.gap = '8px'
      this.container.appendChild(this.chartElement)

      for (let digit = 0; digit < 10; digit += 1) {
        const row = document.createElement('div')
        row.style.display = 'flex'
        row.style.alignItems = 'center'
        row.style.gap = '12px'

        const label = document.createElement('span')
        label.style.width = '24px'
        label.style.fontSize = '0.875rem'
        label.style.fontWeight = '600'
        label.style.color = '#d1d5db'
        label.textContent = String(digit)

        const track = document.createElement('div')
        track.style.flex = '1'
        track.style.height = '24px'
        track.style.background = '#374151'
        track.style.borderRadius = '4px'
        track.style.overflow = 'hidden'
        track.style.position = 'relative'

        const bar = document.createElement('div')
        bar.style.height = '100%'
        bar.style.width = '0%'
        bar.style.transition = 'width 0.3s'
        bar.style.background = 'linear-gradient(to right, #3b82f6, #8b5cf6)'
        track.appendChild(bar)

        const value = document.createElement('span')
        value.style.width = '48px'
        value.style.textAlign = 'right'
        value.style.fontSize = '0.875rem'
        value.style.color = '#d1d5db'
        value.textContent = '0.0%'

        row.appendChild(label)
        row.appendChild(track)
        row.appendChild(value)
        this.chartElement.appendChild(row)
        this.rows.push({ bar, value })
      }
    }

    update(probabilities) {
      if (!probabilities.length) return
      const maxProb = Math.max(...probabilities)
      probabilities.forEach((prob, index) => {
        const clamped = Math.max(0, Math.min(1, prob))
        const entry = this.rows[index]
        if (!entry) return
        entry.bar.style.width = `${(clamped * 100).toFixed(1)}%`
        entry.value.textContent = `${(clamped * 100).toFixed(1)}%`
        if (clamped === maxProb) {
          entry.bar.style.background = 'linear-gradient(to right, #3b82f6, #8b5cf6)'
        } else {
          entry.bar.style.background = 'linear-gradient(to right, #4b5563, #6b7280)'
        }
      })
    }
  }

  // NeuralVisualizer class (simplificada del repositorio original)
  class NeuralVisualizer {
    constructor(mlp, options) {
      this.mlp = mlp
      this.options = Object.assign(
        {
          layerSpacing: 5.5,
          inputSpacing: 0.24,
          hiddenSpacing: 0.95,
          outputSpacing: 0.95,
          inputNodeSize: 0.18,
          hiddenNodeRadius: 0.22,
          maxConnectionsPerNeuron: 24,
          connectionRadius: 0.005,
          connectionWeightThreshold: 0,
        },
        options || {}
      )
      this.container = this.options.container || null
      this.layerMeshes = []
      this.connectionGroups = []
      this.tempObject = new THREE.Object3D()
      this.tempColor = new THREE.Color()
      this.tempQuaternion = new THREE.Quaternion()
      this.upVector = new THREE.Vector3(0, 1, 0)
      this.initThreeScene()
      this.buildLayers()
      this.buildConnections()
      this.animate()
    }

    initThreeScene() {
      const threeContainer =
        this.container || document.getElementById('threeContainer')
      if (!threeContainer) return

      this.scene = new THREE.Scene()
      this.scene.background = null

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight)
      threeContainer.appendChild(this.renderer.domElement)

      this.camera = new THREE.PerspectiveCamera(
        45,
        threeContainer.clientWidth / threeContainer.clientHeight,
        0.1,
        200
      )
      this.camera.position.set(-15, 0, 15)

      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.08
      this.controls.minDistance = 8
      this.controls.maxDistance = 52
      this.controls.target.set(0, 0, 0)

      const ambient = new THREE.AmbientLight(0xffffff, 1.2)
      this.scene.add(ambient)
      const hemisphere = new THREE.HemisphereLight(0xffffff, 0x1a1d2e, 0.9)
      hemisphere.position.set(0, 20, 0)
      this.scene.add(hemisphere)
      const directional = new THREE.DirectionalLight(0xffffff, 1.4)
      directional.position.set(18, 26, 24)
      this.scene.add(directional)
      const fillLight = new THREE.DirectionalLight(0xa8c5ff, 0.8)
      fillLight.position.set(-20, 18, -18)
      this.scene.add(fillLight)
      const rimLight = new THREE.PointLight(0x88a4ff, 0.6, 60, 1.6)
      rimLight.position.set(0, 12, -24)
      this.scene.add(rimLight)

      window.addEventListener('resize', () => this.handleResize())
    }

    handleResize() {
      const threeContainer =
        this.container || document.getElementById('threeContainer')
      if (!threeContainer || !this.camera || !this.renderer) return
      const width = threeContainer.clientWidth
      const height = threeContainer.clientHeight
      this.renderer.setSize(width, height)
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
    }

    computeLayerPositions(layerIndex, neuronCount, layerX) {
      const positions = []
      const isOutputLayer = layerIndex === this.mlp.architecture.length - 1
      if (layerIndex === 0) {
        const spacing = this.options.inputSpacing
        let rows, cols
        if (neuronCount === 28 * 28) {
          rows = 28
          cols = 28
        } else {
          cols = Math.ceil(Math.sqrt(neuronCount))
          rows = Math.ceil(neuronCount / cols)
        }
        const height = (rows - 1) * spacing
        const width = (cols - 1) * spacing
        let filled = 0
        for (let row = 0; row < rows && filled < neuronCount; row += 1) {
          for (let col = 0; col < cols && filled < neuronCount; col += 1) {
            const y = height / 2 - row * spacing
            const z = -width / 2 + col * spacing
            positions.push(new THREE.Vector3(layerX, y, z))
            filled += 1
          }
        }
      } else if (isOutputLayer) {
        const spacing = this.options.outputSpacing ?? this.options.hiddenSpacing
        const height = (neuronCount - 1) * spacing
        for (let index = 0; index < neuronCount; index += 1) {
          const y = height / 2 - index * spacing
          positions.push(new THREE.Vector3(layerX, y, 0))
        }
      } else {
        const spacing = this.options.hiddenSpacing
        const cols = Math.max(1, Math.ceil(Math.sqrt(neuronCount)))
        const rows = Math.ceil(neuronCount / cols)
        const height = (rows - 1) * spacing
        const width = (cols - 1) * spacing
        for (let index = 0; index < neuronCount; index += 1) {
          const row = Math.floor(index / cols)
          const col = index % cols
          const y = height / 2 - row * spacing
          const z = -width / 2 + col * spacing
          positions.push(new THREE.Vector3(layerX, y, z))
        }
      }
      return positions
    }

    buildLayers() {
      const inputGeometry = new THREE.BoxGeometry(
        this.options.inputNodeSize,
        this.options.inputNodeSize,
        this.options.inputNodeSize
      )
      const hiddenGeometry = new THREE.SphereGeometry(this.options.hiddenNodeRadius, 16, 16)
      const hiddenBaseMaterial = new THREE.MeshBasicMaterial()
      hiddenBaseMaterial.toneMapped = false

      const layerCount = this.mlp.architecture.length
      const totalWidth = (layerCount - 1) * this.options.layerSpacing
      const startX = -totalWidth / 2

      this.mlp.architecture.forEach((neuronCount, layerIndex) => {
        const layerX = startX + layerIndex * this.options.layerSpacing
        const positions = this.computeLayerPositions(layerIndex, neuronCount, layerX)
        const isOutputLayer = layerIndex === layerCount - 1

        if (layerIndex === 0) {
          const material = new THREE.MeshLambertMaterial()
          material.emissive.setRGB(0.08, 0.08, 0.08)
          const mesh = new THREE.InstancedMesh(inputGeometry, material, neuronCount)
          mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
          const colorAttribute = new THREE.InstancedBufferAttribute(
            new Float32Array(neuronCount * 3),
            3
          )
          colorAttribute.setUsage(THREE.DynamicDrawUsage)
          mesh.instanceColor = colorAttribute

          positions.forEach((position, instanceIndex) => {
            this.tempObject.position.copy(position)
            this.tempObject.updateMatrix()
            mesh.setMatrixAt(instanceIndex, this.tempObject.matrix)
            mesh.setColorAt(instanceIndex, this.tempColor.setRGB(0.15, 0.15, 0.15))
          })

          mesh.instanceMatrix.needsUpdate = true
          mesh.instanceColor.needsUpdate = true
          this.scene.add(mesh)
          this.layerMeshes.push({ mesh, positions, type: 'input', layerIndex })
        } else {
          const material = hiddenBaseMaterial.clone()
          const geometry = hiddenGeometry.clone()
          const mesh = new THREE.InstancedMesh(geometry, material, neuronCount)
          mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
          const colorAttribute = new THREE.InstancedBufferAttribute(
            new Float32Array(neuronCount * 3),
            3
          )
          colorAttribute.setUsage(THREE.DynamicDrawUsage)
          mesh.instanceColor = colorAttribute

          positions.forEach((position, instanceIndex) => {
            this.tempObject.position.copy(position)
            this.tempObject.updateMatrix()
            mesh.setMatrixAt(instanceIndex, this.tempObject.matrix)
            mesh.setColorAt(instanceIndex, this.tempColor.setRGB(0.15, 0.15, 0.15))
          })

          mesh.instanceMatrix.needsUpdate = true
          mesh.instanceColor.needsUpdate = true
          this.scene.add(mesh)
          const layerType = isOutputLayer ? 'output' : 'hidden'
          this.layerMeshes.push({ mesh, positions, type: layerType, layerIndex })
        }
      })
    }

    findImportantConnections(layer) {
      const limit = this.options.maxConnectionsPerNeuron
      const minMagnitude = Math.max(0, this.options.connectionWeightThreshold ?? 0)
      const selected = []
      let maxAbsWeight = 0
      for (let target = 0; target < layer.weights.length; target += 1) {
        const row = layer.weights[target]
        const candidates = []
        for (let source = 0; source < row.length; source += 1) {
          const weight = row[source]
          if (!Number.isFinite(weight)) continue
          const magnitude = Math.abs(weight)
          candidates.push({ sourceIndex: source, targetIndex: target, weight, magnitude })
          if (magnitude > maxAbsWeight) maxAbsWeight = magnitude
        }
        candidates.sort((a, b) => b.magnitude - a.magnitude)
        const take = Math.min(limit, candidates.length)
        for (let i = 0; i < take; i += 1) {
          const candidate = candidates[i]
          if (candidate.magnitude < minMagnitude) break
          selected.push({
            sourceIndex: candidate.sourceIndex,
            targetIndex: candidate.targetIndex,
            weight: candidate.weight,
          })
        }
      }
      return { selected, maxAbsWeight }
    }

    buildConnections() {
      const connectionRadius = this.options.connectionRadius ?? 0.005
      const baseGeometry = new THREE.CylinderGeometry(connectionRadius, connectionRadius, 1, 10, 1, true)
      const material = new THREE.MeshLambertMaterial()

      this.mlp.layers.forEach((layer, layerIndex) => {
        const { selected } = this.findImportantConnections(layer)
        if (!selected.length) return

        const mesh = new THREE.InstancedMesh(baseGeometry.clone(), material.clone(), selected.length)
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
        const colorAttribute = new THREE.InstancedBufferAttribute(
          new Float32Array(selected.length * 3),
          3
        )
        colorAttribute.setUsage(THREE.DynamicDrawUsage)
        mesh.instanceColor = colorAttribute

        selected.forEach((connection, instanceIndex) => {
          const sourcePosition = this.layerMeshes[layerIndex].positions[connection.sourceIndex]
          const targetPosition = this.layerMeshes[layerIndex + 1].positions[connection.targetIndex]
          const direction = targetPosition.clone().sub(sourcePosition)
          const length = direction.length()
          const midpoint = sourcePosition.clone().addScaledVector(direction, 0.5)

          this.tempObject.position.copy(midpoint)
          const quaternion = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.clone().normalize()
          )
          this.tempObject.scale.set(1, length, 1)
          this.tempObject.quaternion.copy(quaternion)
          this.tempObject.updateMatrix()
          mesh.setMatrixAt(instanceIndex, this.tempObject.matrix)
          mesh.setColorAt(instanceIndex, this.tempColor.setRGB(1, 1, 1))
        })

        mesh.instanceMatrix.needsUpdate = true
        mesh.instanceColor.needsUpdate = true
        this.scene.add(mesh)
        this.connectionGroups.push({
          mesh,
          connections: selected,
          sourceLayer: layerIndex,
        })
      })
    }

    applyNodeColors(layer, values, scale, layerIndex) {
      const { mesh, type } = layer
      if (type === 'input') {
        for (let i = 0; i < values.length; i += 1) {
          const value = clamp(values[i], 0, 1)
          this.tempColor.setRGB(value, value, value)
          mesh.setColorAt(i, this.tempColor)
        }
        mesh.instanceColor.needsUpdate = true
        return
      }

      const safeScale = scale > 1e-6 ? scale : 1
      for (let i = 0; i < values.length; i += 1) {
        const value = values[i]
        const normalized = clamp(value / safeScale, 0, 1)
        this.tempColor.setRGB(normalized, normalized, normalized)
        mesh.setColorAt(i, this.tempColor)
      }
      mesh.instanceColor.needsUpdate = true
    }

    applyConnectionColors(group, sourceValues) {
      const contributions = new Float32Array(group.connections.length)
      let maxContribution = 0
      group.connections.forEach((connection, index) => {
        const activation = sourceValues[connection.sourceIndex] ?? 0
        const contribution = activation * connection.weight
        contributions[index] = contribution
        const magnitude = Math.abs(contribution)
        if (magnitude > maxContribution) maxContribution = magnitude
      })
      const scale = maxContribution > 1e-6 ? maxContribution : 1
      group.connections.forEach((connection, index) => {
        const normalized = clamp(contributions[index] / scale, -1, 1)
        const magnitude = Math.abs(normalized)
        if (magnitude < 1e-3) {
          this.tempColor.setRGB(0, 0, 0)
        } else if (normalized >= 0) {
          this.tempColor.setRGB(0, magnitude, 0)
        } else {
          this.tempColor.setRGB(magnitude, 0, 0)
        }
        group.mesh.setColorAt(index, this.tempColor)
      })
      group.mesh.instanceColor.needsUpdate = true
    }

    update(displayActivations, networkActivations = displayActivations) {
      this.layerMeshes.forEach((layer, layerIndex) => {
        const values = displayActivations[layerIndex]
        if (!values) return
        const scale = layerIndex === 0 ? 1 : maxAbsValue(displayActivations[layerIndex])
        this.applyNodeColors(layer, values, scale || 1, layerIndex)
      })

      this.connectionGroups.forEach((group) => {
        const sourceValues = networkActivations[group.sourceLayer]
        if (!sourceValues) return
        this.applyConnectionColors(group, sourceValues)
      })
    }

    animate() {
      const renderFrame = () => {
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(renderFrame)
      }
      renderFrame()
    }
  }

  // Función principal de inicialización
  async function initializeVisualizer() {
    try {
      const weightDefinitionUrl = new URL(VISUALIZER_CONFIG.weightUrl, window.location.href)
      const rawDefinition = await fetchNetworkDefinition(weightDefinitionUrl.toString())
      
      // Adaptar el formato del repositorio original al formato esperado
      let definition = rawDefinition
      let architecture = null
      let normalization = NORMALIZATION
      
      // Si el JSON viene en formato del repositorio original (con layers directamente)
      if (rawDefinition.layers && Array.isArray(rawDefinition.layers) && !rawDefinition.network) {
        // Construir la arquitectura basándose en los shapes de los pesos
        // El primer layer tiene shape [outputSize, inputSize], donde inputSize es 784 para MNIST
        architecture = [784] // Input layer siempre es 784 para MNIST
        rawDefinition.layers.forEach((layer) => {
          if (layer.weights?.shape && Array.isArray(layer.weights.shape) && layer.weights.shape.length >= 1) {
            const [outputSize] = layer.weights.shape
            architecture.push(outputSize)
          }
        })
        
        // Crear estructura compatible
        definition = {
          network: {
            architecture,
            normalization,
            layers: rawDefinition.layers.map((layer, idx) => ({
              name: layer.name || `dense_${idx}`,
              activation: layer.activation || 'relu',
              weights: layer.weights,
              bias: layer.bias || layer.biases,
            })),
          },
        }
      }
      
      if (!definition?.network) {
        throw new Error('Invalid network definition.')
      }

      // Cargar el snapshot por defecto (último)
      const timeline = definition.timeline || []
      let initialSnapshot = null
      if (timeline.length > 0) {
        const lastSnapshot = timeline[timeline.length - 1]
        if (lastSnapshot?.weights?.url) {
          const snapshotUrl = new URL(lastSnapshot.weights.url, weightDefinitionUrl)
          const payload = await fetchSnapshotPayload(snapshotUrl.toString())
          const layerMetadata = definition.network.layers.map((layer, index) =>
            normaliseLayerMetadata(layer, index)
          )
          const layers = decodeSnapshotLayers(payload, layerMetadata)
          initialSnapshot = { layers }
        }
      }

      // Si no hay timeline, usar los pesos directamente del definition
      if (!initialSnapshot && definition.network?.layers) {
        // Intentar cargar desde la estructura directa del definition
        const layers = definition.network.layers.map((layer, idx) => {
          const weightInfo = layer.weights
          const biasInfo = layer.bias || layer.biases
          if (!weightInfo || !weightInfo.data || !weightInfo.shape) {
            throw new Error(`Layer ${idx} missing weight data`)
          }
          const weightArray = decodeFloat16Base64(weightInfo.data, weightInfo.shape[0] * weightInfo.shape[1])
          const weights = []
          const [rows, cols] = weightInfo.shape
          for (let r = 0; r < rows; r++) {
            weights.push(weightArray.slice(r * cols, (r + 1) * cols))
          }
          // Manejar bias: puede tener shape o inferirse del tamaño de rows
          let biases
          if (biasInfo?.data) {
            const biasSize = biasInfo.shape?.[0] || rows
            const biasArray = decodeFloat16Base64(biasInfo.data, biasSize)
            biases = Array.from(biasArray)
          } else {
            biases = new Array(rows).fill(0)
          }
          return {
            name: layer.name || `dense_${idx}`,
            activation: layer.activation || 'relu',
            weights,
            biases,
          }
        })
        initialSnapshot = { layers }
      }

      if (!initialSnapshot) {
        throw new Error('No valid snapshot found.')
      }

      const neuralModel = new FeedForwardModel({
        normalization: definition.network.normalization || NORMALIZATION,
        architecture: definition.network.architecture || architecture,
        layers: initialSnapshot.layers,
      })

      const gridContainerElement = container.querySelector('#gridContainer')
      const digitCanvas = new DigitSketchPad(gridContainerElement, 28, 28, {
        brush: VISUALIZER_CONFIG.brush,
      })

      const probabilityPanel = new ProbabilityPanel(container.querySelector('#predictionChart'))

      const neuralScene = new NeuralVisualizer(neuralModel, {
        container: container.querySelector('#threeContainer'),
        layerSpacing: VISUALIZER_CONFIG.layerSpacing,
        maxConnectionsPerNeuron: VISUALIZER_CONFIG.maxConnectionsPerNeuron,
        inputSpacing: VISUALIZER_CONFIG.inputSpacing,
        hiddenSpacing: VISUALIZER_CONFIG.hiddenSpacing,
        inputNodeSize: VISUALIZER_CONFIG.inputNodeSize,
        hiddenNodeRadius: VISUALIZER_CONFIG.hiddenNodeRadius,
        connectionRadius: VISUALIZER_CONFIG.connectionRadius,
        connectionWeightThreshold: VISUALIZER_CONFIG.connectionWeightThreshold,
      })

      const resetBtn = document.getElementById('resetBtn')
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          digitCanvas.clear()
          refreshNetworkState()
        })
      }

      function refreshNetworkState() {
        const rawInput = digitCanvas.getPixels()
        const propagation = neuralModel.propagate(rawInput)
        const displayActivations = propagation.activations.slice()
        if (displayActivations.length > 0) {
          displayActivations[0] = rawInput
        }

        const logitsTyped =
          propagation.preActivations.length > 0
            ? propagation.preActivations[propagation.preActivations.length - 1]
            : new Float32Array(0)
        const probabilities =
          logitsTyped.length > 0
            ? Float32Array.from(softmax(Array.from(logitsTyped)))
            : new Float32Array(0)

        if (probabilities.length && displayActivations.length > 1) {
          displayActivations[displayActivations.length - 1] = probabilities
        }

        let networkActivations = propagation.activations
        if (probabilities.length) {
          networkActivations = propagation.activations.slice()
          if (networkActivations.length > 1) {
            networkActivations[networkActivations.length - 1] = probabilities
          }
        }

        neuralScene.update(displayActivations, networkActivations)
        const probabilitiesForPanel = probabilities.length ? probabilities : logitsTyped
        probabilityPanel.update(
          probabilitiesForPanel.length ? Array.from(probabilitiesForPanel) : []
        )
      }

      digitCanvas.setChangeHandler(() => refreshNetworkState())

      // Inicializar con canvas vacío
      refreshNetworkState()
    } catch (error) {
      console.error('Error initializing visualizer:', error)
      const container = document.getElementById('neural-network-container')
      if (container) {
        container.innerHTML = `
          <div style="padding: 48px; text-align: center; color: #ef4444;">
            <h2>Error loading visualization</h2>
            <p>${error.message}</p>
            <p style="margin-top: 16px; font-size: 0.875rem; color: #9ca3af;">
              Check the console for details.
            </p>
          </div>
        `
      }
    }
  }

  // Inicializar inmediatamente (el contenedor ya está disponible)
  initializeVisualizer()
}
