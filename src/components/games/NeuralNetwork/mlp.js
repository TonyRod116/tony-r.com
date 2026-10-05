import { denseForward, stableSoftmax, singleTrainingStep } from './networkMath.js'
import { publicAssetUrl } from '../../../utils/siteRouting.js'

// Pretrained artifact: DFin/Neural-Network-Visualisation (Apache-2.0).
// Provenance and original license live alongside the local model artifact.
export const WEIGHTS_URL = '/models/mnist/014_dataset-1x.json'
const NORMALIZATION = { mean: 0.1307, std: 0.3081 }

// Tabla float16 -> número (65 536 entradas, misma fórmula que antes): descodificar ~110 000 pesos
// deja de ejecutar una función con cálculos de potencias por cada valor.
const HALF_TO_NUMBER = (() => {
  const table = new Float64Array(65536)
  for (let h = 0; h < 65536; h++) {
    const sign = h & 0x8000 ? -1 : 1, exponent = (h >> 10) & 31, fraction = h & 1023
    table[h] = exponent === 0 ? sign * 2 ** -14 * fraction / 1024 : exponent === 31 ? NaN : sign * 2 ** (exponent - 15) * (1 + fraction / 1024)
  }
  return table
})()

function decodeTensor(tensor, dimensions) {
  if (!tensor || !Array.isArray(tensor.shape) || tensor.shape.length !== dimensions || tensor.shape.some(n => !Number.isInteger(n) || n < 1 || n > 784) || typeof tensor.data !== 'string') throw new Error('Invalid tensor')
  const binary = atob(tensor.data)
  const count = tensor.shape.reduce((a, b) => a * b, 1)
  if (binary.length !== count * 2) throw new Error('Invalid tensor length')
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const view = new DataView(bytes.buffer)
  const values = []
  for (let i = 0; i < count; i++) {
    const value = HALF_TO_NUMBER[view.getUint16(i * 2, true)]
    if (!Number.isFinite(value)) throw new Error('Non-finite model weight')
    values.push(value)
  }
  return values
}

export class MLP {
  constructor(definition) {
    this.weights = []
    this.biases = []
    this.layers = []
    this.activations = []
    this.ready = false
    this.normalization = { ...NORMALIZATION }
    if (definition) this.loadDefinition(definition)
  }

  loadDefinition(data) {
    if (data?.dtype !== 'float16' || !Array.isArray(data.layers) || data.layers.length !== 3) throw new Error('Invalid model definition')
    const weights = [], biases = [], architecture = [784]
    for (const [index, layer] of data.layers.entries()) {
      const decoded = decodeTensor(layer.weights, 2)
      const [rows, columns] = layer.weights.shape
      const bias = decodeTensor(layer.biases || layer.bias, 1)
      if (columns !== architecture[index] || bias.length !== rows || layer.activation !== (index < 2 ? 'relu' : 'linear')) throw new Error('Incompatible model layer')
      architecture.push(rows)
      weights.push(Array.from({ length: rows }, (_, i) => decoded.slice(i * columns, (i + 1) * columns)))
      biases.push(bias)
    }
    if (architecture.at(-1) !== 10) throw new Error('Expected ten digit outputs')
    const normalization = data.normalization || NORMALIZATION
    if (!Number.isFinite(normalization.mean) || !Number.isFinite(normalization.std) || normalization.std <= 0) throw new Error('Invalid normalization')
    // Commit validated tensors atomically. No random fallback or partial model.
    this.weights = weights
    this.biases = biases
    this.layers = architecture.map((size, index) => ({ size, name: index === 0 ? 'input' : index === architecture.length - 1 ? 'output' : `hidden${index}` }))
    this.normalization = { ...normalization }
    this.ready = true
  }

  async loadPretrainedWeights(signal) {
    const response = await fetch(publicAssetUrl(WEIGHTS_URL), { signal })
    if (!response.ok) throw new Error('Failed to load weights')
    this.loadDefinition(await response.json())
  }

  trace(input) {
    if (!this.ready) throw new Error('Model is not loaded')
    return denseForward(this.weights,this.biases,this.normalization,input)
  }
  forward(input) {
    const trace=this.trace(input)
    this.activations=trace.activations
    return trace.logits
  }
  softmax(logits) { return stableSoftmax(logits) }
  trainingStep(input,target,learningRate=0.001) {
    if (!this.ready) throw new Error('Model is not loaded')
    return singleTrainingStep(this.weights,this.biases,this.normalization,input,target,learningRate)
  }
  getActivations() { return this.activations }
  getWeights() { return this.weights }
}
