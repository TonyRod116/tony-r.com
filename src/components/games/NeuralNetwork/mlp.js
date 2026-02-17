// Simple Multi-Layer Perceptron for MNIST digit classification
const WEIGHTS_URL = 'https://raw.githubusercontent.com/DFin/Neural-Network-Visualisation/main/exports/mlp_weights/014_dataset-1x.json'
const NORMALIZATION = { mean: 0.1307, std: 0.3081 }

export class MLP {
  constructor() {
    // Architecture: 784 (28x28) -> 64 -> 32 -> 10 (según especificaciones originales)
    this.layers = [
      { size: 784, name: 'input' },
      { size: 64, name: 'hidden1' },
      { size: 32, name: 'hidden2' },
      { size: 10, name: 'output' }
    ]

    this.weights = []
    this.biases = []
    this.activations = []
    this.normalization = { ...NORMALIZATION }

    this._initRandomWeights()
  }

  _initRandomWeights() {
    this.weights = []
    this.biases = []
    for (let i = 0; i < this.layers.length - 1; i++) {
      const inputSize = this.layers[i].size
      const outputSize = this.layers[i + 1].size
      const weightMatrix = []
      for (let j = 0; j < outputSize; j++) {
        const row = []
        for (let k = 0; k < inputSize; k++) {
          row.push((Math.random() * 2 - 1) * Math.sqrt(2 / (inputSize + outputSize)))
        }
        weightMatrix.push(row)
      }
      this.weights.push(weightMatrix)
      this.biases.push(new Array(outputSize).fill(0))
    }
  }

  async loadPretrainedWeights() {
    const response = await fetch(WEIGHTS_URL)
    if (!response.ok) throw new Error('Failed to load weights')
    const data = await response.json()
    if (!data?.layers?.length) return

    this.weights = []
    this.biases = []
    
    // Reconstruir la arquitectura basada en los pesos cargados
    this.layers = [{ size: 784, name: 'input' }]

    data.layers.forEach((layer, idx) => {
      const weightInfo = layer.weights
      const biasInfo = layer.bias || layer.biases
      if (!weightInfo || !weightInfo.data || !weightInfo.shape) return

      const weightArray = decodeFloat16ToFloat32(weightInfo.data)
      const [rows, cols] = weightInfo.shape
      const weightMatrix = toMatrix(weightArray, rows, cols)
      this.weights.push(weightMatrix)

      // Actualizar arquitectura: cols es el tamaño de la capa anterior, rows es el tamaño de esta capa
      const layerSize = rows
      const layerName = idx === data.layers.length - 1 ? 'output' : `hidden${idx + 1}`
      this.layers.push({ size: layerSize, name: layerName })

      if (biasInfo?.data && biasInfo?.shape) {
        const biasArray = decodeFloat16ToFloat32(biasInfo.data)
        this.biases.push(Array.from(biasArray))
      } else {
        this.biases.push(new Array(rows).fill(0))
      }
    })
  }

  relu(x) {
    return Math.max(0, x)
  }

  forward(input) {
    const norm = this.normalization
    const normalized = input.map((v) => (v - norm.mean) / norm.std)

    // Keep visualization activations in a human-readable range:
    // input in [0,1] and hidden layers post-activation.
    this.activations = [input]
    let current = normalized

    for (let i = 0; i < this.weights.length; i++) {
      const layerOutput = []
      
      for (let j = 0; j < this.weights[i].length; j++) {
        let sum = this.biases[i][j]
        
        for (let k = 0; k < current.length; k++) {
          sum += this.weights[i][j][k] * current[k]
        }
        
        // Apply activation function (ReLU for hidden layers, linear for output)
        const activated = i < this.weights.length - 1 ? this.relu(sum) : sum
        layerOutput.push(activated)
      }
      
      this.activations.push(layerOutput)
      current = layerOutput
    }
    
    return current
  }

  softmax(logits) {
    const maxLogit = Math.max(...logits)
    const expLogits = logits.map(x => Math.exp(x - maxLogit))
    const sumExp = expLogits.reduce((a, b) => a + b, 0)
    return expLogits.map(x => x / sumExp)
  }

  getActivations() {
    return this.activations
  }

  getWeights() {
    return this.weights
  }
}

function decodeFloat16ToFloat32(base64) {
  const bytes = base64ToUint8Array(base64)
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const out = new Float32Array(bytes.byteLength / 2)
  for (let i = 0; i < out.length; i++) {
    const half = view.getUint16(i * 2, true)
    out[i] = float16ToFloat32(half)
  }
  return out
}

function base64ToUint8Array(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function float16ToFloat32(h) {
  const s = (h & 0x8000) >> 15
  const e = (h & 0x7C00) >> 10
  const f = h & 0x03FF

  if (e === 0) {
    return (s ? -1 : 1) * Math.pow(2, -14) * (f / Math.pow(2, 10))
  }
  if (e === 0x1F) {
    return f ? NaN : ((s ? -1 : 1) * Infinity)
  }
  return (s ? -1 : 1) * Math.pow(2, e - 15) * (1 + f / Math.pow(2, 10))
}

function toMatrix(array, rows, cols) {
  const matrix = new Array(rows)
  let idx = 0
  for (let r = 0; r < rows; r++) {
    const row = new Array(cols)
    for (let c = 0; c < cols; c++) {
      row[c] = array[idx++]
    }
    matrix[r] = row
  }
  return matrix
}
