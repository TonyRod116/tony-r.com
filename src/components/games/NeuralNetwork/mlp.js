// Simple Multi-Layer Perceptron for MNIST digit classification
export class MLP {
  constructor() {
    // Architecture: 784 (28x28) -> 64 -> 32 -> 10
    this.layers = [
      { size: 784, name: 'input' },
      { size: 64, name: 'hidden1' },
      { size: 32, name: 'hidden2' },
      { size: 10, name: 'output' }
    ]
    
    // Initialize weights and biases
    this.weights = []
    this.biases = []
    this.activations = [] // Store activations for visualization
    
    for (let i = 0; i < this.layers.length - 1; i++) {
      const inputSize = this.layers[i].size
      const outputSize = this.layers[i + 1].size
      
      // Xavier initialization
      const weightMatrix = []
      for (let j = 0; j < outputSize; j++) {
        const row = []
        for (let k = 0; k < inputSize; k++) {
          row.push((Math.random() * 2 - 1) * Math.sqrt(2 / (inputSize + outputSize)))
        }
        weightMatrix.push(row)
      }
      this.weights.push(weightMatrix)
      
      // Initialize biases to zero
      this.biases.push(new Array(outputSize).fill(0))
    }
    
    // Load pre-trained weights if available (for now, use random)
    this.loadPretrainedWeights()
  }

  loadPretrainedWeights() {
    // In a real implementation, you would load weights from a JSON file
    // For now, we'll use random weights that produce reasonable outputs
    // You can train this network using TensorFlow.js or Python and export the weights
  }

  relu(x) {
    return Math.max(0, x)
  }

  forward(input) {
    this.activations = [input] // Store input as first activation
    
    let current = input
    
    for (let i = 0; i < this.weights.length; i++) {
      const layerOutput = []
      const layerActivations = []
      
      for (let j = 0; j < this.weights[i].length; j++) {
        let sum = this.biases[i][j]
        
        for (let k = 0; k < current.length; k++) {
          sum += this.weights[i][j][k] * current[k]
        }
        
        // Apply activation function (ReLU for hidden layers, linear for output)
        const activated = i < this.weights.length - 1 ? this.relu(sum) : sum
        layerOutput.push(activated)
        layerActivations.push(sum) // Store pre-activation for visualization
      }
      
      this.activations.push(layerActivations)
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
