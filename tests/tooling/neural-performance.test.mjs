import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { MLP } from '../../src/components/games/NeuralNetwork/mlp.js'
import { strongestConnections } from '../../src/components/games/NeuralNetwork/networkMath.js'

const definition = JSON.parse(readFileSync(new URL('../../public/models/mnist/014_dataset-1x.json', import.meta.url), 'utf8'))

// Implementación anterior del diagrama (ordenar todos los pesos de cada neurona y quedarse con dos).
const legacyStrongest = weights => weights.flatMap((layerWeights, layer) => layerWeights.flatMap((row, target) =>
  Array.from(row, (weight, source) => ({ source, weight })).sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight)).slice(0, 2).map(edge => ({ ...edge, target, layer }))))

test('the single-pass selection returns exactly the connections of the previous sort-based method on the real model', () => {
  const model = new MLP(definition)
  const next = strongestConnections(model.weights), previous = legacyStrongest(model.weights)
  assert.equal(next.length, 2 * (128 + 64 + 10))
  assert.deepEqual(next, previous)
})

test('ties, zeros, negatives and short rows keep the same stable order', () => {
  const cases = [
    [[[1, -1, 1, 0.5, -1]]],
    [[[0, 0, 0, 0]]],
    [[[-3]]],
    [[[2, 2, 2, 2], [-2, 2, -2, 2]], [[0.1, -0.1, 0.1]]],
    [[[0.2, -0.9, 0.9, -0.9, 0.3, 0.9]]],
  ]
  for (const weights of cases) assert.deepEqual(strongestConnections(weights), legacyStrongest(weights))
  let seed = 12345
  const random = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648
  for (let round = 0; round < 40; round++) {
    const weights = [Array.from({ length: 6 }, () => Array.from({ length: 25 }, () => Math.round((random() - 0.5) * 8) / 4))]
    assert.deepEqual(strongestConnections(weights), legacyStrongest(weights), `round ${round}`)
  }
})

// Descodificador anterior, copiado tal cual, para demostrar que la tabla produce los mismos números.
function legacyDecode(tensor) {
  const binary = atob(tensor.data)
  const count = tensor.shape.reduce((a, b) => a * b, 1)
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
  const view = new DataView(bytes.buffer)
  return Array.from({ length: count }, (_, i) => {
    const h = view.getUint16(i * 2, true)
    const sign = h & 0x8000 ? -1 : 1, exponent = (h >> 10) & 31, fraction = h & 1023
    return exponent === 0 ? sign * 2 ** -14 * fraction / 1024 : exponent === 31 ? NaN : sign * 2 ** (exponent - 15) * (1 + fraction / 1024)
  })
}

test('the table-based float16 decoder gives bit-identical weights and biases for the whole model', () => {
  const model = new MLP(definition)
  definition.layers.forEach((layer, index) => {
    const [rows, columns] = layer.weights.shape
    const expected = legacyDecode(layer.weights)
    const flat = model.weights[index].flatMap(row => row)
    assert.equal(flat.length, rows * columns)
    for (let i = 0; i < flat.length; i++) assert.ok(Object.is(flat[i], expected[i]), `weight ${index}:${i}`)
    const expectedBias = legacyDecode(layer.biases || layer.bias)
    assert.equal(model.biases[index].length, expectedBias.length)
    expectedBias.forEach((value, i) => assert.ok(Object.is(model.biases[index][i], value), `bias ${index}:${i}`))
  })
})

test('every one of the 65 536 half-precision patterns decodes like before (non-finite ones are still rejected)', () => {
  for (let h = 0; h < 65536; h += 1) {
    const bytes = String.fromCharCode(h & 255, h >> 8)
    const tensor = { shape: [1], data: btoa(bytes) }
    const expected = legacyDecode(tensor)[0]
    const model = new MLP()
    const build = () => model.loadDefinition({ dtype: 'float16', normalization: { mean: 0.1307, std: 0.3081 }, layers: [
      { weights: { shape: [1, 784], data: btoa(bytes.repeat(784)) }, biases: { shape: [1], data: btoa(bytes) }, activation: 'relu' },
      { weights: { shape: [1, 1], data: btoa(bytes) }, biases: { shape: [1], data: btoa(bytes) }, activation: 'relu' },
      { weights: { shape: [10, 1], data: btoa(bytes.repeat(10)) }, biases: { shape: [10], data: btoa(bytes.repeat(10)) }, activation: 'linear' },
    ] })
    if (Number.isFinite(expected)) { build(); assert.ok(Object.is(model.biases[0][0], expected), `pattern ${h}`) }
    else assert.throws(build, /Non-finite model weight/, `pattern ${h}`)
  }
})
