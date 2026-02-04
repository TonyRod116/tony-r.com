import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Settings } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import DrawingCanvas from './NeuralNetwork/DrawingCanvas'
import Network3D from './NeuralNetwork/Network3D'
import PredictionChart from './NeuralNetwork/PredictionChart'
import { MLP } from './NeuralNetwork/mlp'

export default function NeuralNetworkVisualization() {
  const { t } = useLanguage()
  const [drawing, setDrawing] = useState(null)
  const [activations, setActivations] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const [maxConnections, setMaxConnections] = useState(24)
  const [hideWeakConnections, setHideWeakConnections] = useState(0)
  const [connectionThickness, setConnectionThickness] = useState(1)
  const [strokeWidth, setStrokeWidth] = useState(1.4)
  const [strokeIntensity, setStrokeIntensity] = useState(95)
  const [showSettings, setShowSettings] = useState(false)
  
  const mlpRef = useRef(null)
  const sceneContainerRef = useRef(null)
  const [mlpWeights, setMlpWeights] = useState(null)

  // Initialize MLP
  useEffect(() => {
    mlpRef.current = new MLP()
    setMlpWeights(mlpRef.current.getWeights())
  }, [])

  const handleDrawingChange = (imageData) => {
    setDrawing(imageData)
    
    if (mlpRef.current && imageData) {
      // Normalize image data to 0-1 range
      const normalized = imageData.map(pixel => pixel / 255)
      
      // Forward pass through network
      const result = mlpRef.current.forward(normalized)
      
      // Get activations for each layer
      const layerActivations = mlpRef.current.getActivations()
      setActivations(layerActivations)
      
      // Get predictions (softmax probabilities)
      const probs = mlpRef.current.softmax(result)
      setPredictions(probs)
    }
  }

  const handleClear = () => {
    setDrawing(null)
    setActivations(null)
    setPredictions(null)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/ai"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{t('aiLab.backToAI') || 'Back to AI Lab'}</span>
          </Link>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {t('neuralNetwork.title') || 'MNIST Neural Network Visualization'}
          </h1>
          <p className="text-gray-400">
            {t('neuralNetwork.subtitle') || 'Draw a digit and watch how activations propagate through the network'}
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Drawing Canvas */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">
                {t('neuralNetwork.drawing') || 'Drawing'}
              </h2>
              <DrawingCanvas
                width={280}
                height={280}
                strokeWidth={strokeWidth}
                strokeIntensity={strokeIntensity}
                onDrawingChange={handleDrawingChange}
              />
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleClear}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t('neuralNetwork.clear') || 'Clear'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {t('neuralNetwork.drawingHint') || 'Click and drag to draw (right-click to erase)'}
              </p>
            </div>

            {/* Prediction Chart */}
            {predictions && (
              <div className="mt-6 bg-gray-800 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">
                  {t('neuralNetwork.prediction') || 'Prediction'}
                </h2>
                <PredictionChart predictions={predictions} />
              </div>
            )}
          </div>

          {/* Right: 3D Network Visualization (vanilla Three.js) */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-4 h-[600px]">
              <h2 className="text-lg font-semibold mb-4">
                {t('neuralNetwork.network') || 'Network Architecture'}
              </h2>
              <div
                ref={sceneContainerRef}
                className="w-full rounded overflow-hidden bg-gray-900 flex-1"
                style={{ minHeight: 420, height: 420 }}
              />
              <Network3D
                containerRef={sceneContainerRef}
                activations={activations}
                weights={mlpWeights}
                maxConnections={maxConnections}
                hideWeakConnections={hideWeakConnections}
                connectionThickness={connectionThickness}
              />
              <p className="text-xs text-gray-400 mt-2">
                {t('neuralNetwork.controls') || 'Left click + drag: rotate | Right click + drag: pan | Scroll: zoom'}
              </p>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">
                {t('neuralNetwork.settings') || 'Settings'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">
                    {t('neuralNetwork.maxConnections') || 'Max Connections per Neuron'}
                  </label>
                  <input
                    type="number"
                    value={maxConnections}
                    onChange={(e) => setMaxConnections(Number(e.target.value))}
                    className="w-full bg-gray-700 rounded px-3 py-2"
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">
                    {t('neuralNetwork.hideWeak') || 'Hide Weak Connections'}
                  </label>
                  <input
                    type="number"
                    value={hideWeakConnections}
                    onChange={(e) => setHideWeakConnections(Number(e.target.value))}
                    className="w-full bg-gray-700 rounded px-3 py-2"
                    min="0"
                    max="1"
                    step="0.0001"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">
                    {t('neuralNetwork.connectionThickness') || 'Connection Thickness'}
                  </label>
                  <input
                    type="number"
                    value={connectionThickness}
                    onChange={(e) => setConnectionThickness(Number(e.target.value))}
                    className="w-full bg-gray-700 rounded px-3 py-2"
                    min="0.1"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">
                    {t('neuralNetwork.strokeWidth') || 'Stroke Width'}
                  </label>
                  <input
                    type="number"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    className="w-full bg-gray-700 rounded px-3 py-2"
                    min="0.5"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">
                    {t('neuralNetwork.strokeIntensity') || 'Stroke Intensity'}
                  </label>
                  <input
                    type="number"
                    value={strokeIntensity}
                    onChange={(e) => setStrokeIntensity(Number(e.target.value))}
                    className="w-full bg-gray-700 rounded px-3 py-2"
                    min="0"
                    max="100"
                  />
                  <span className="text-xs text-gray-400">%</span>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="mt-6 w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                {t('neuralNetwork.close') || 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
