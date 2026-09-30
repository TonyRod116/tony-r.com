import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import { labCopy } from '../../data/aiExperiments'
import AiExperimentLayout from '../ai/AiExperimentLayout'
import NetworkDiagram from '../ai/NetworkDiagram'
import DrawingCanvas from './NeuralNetwork/DrawingCanvas'
import { MLP } from './NeuralNetwork/mlp'

export default function NeuralNetworkVisualization() {
  const { language } = useLanguage()
  const copy = labCopy[language]
  const [model, setModel] = useState(null)
  const [state, setState] = useState('loading')
  const [attempt, setAttempt] = useState(0)
  const [pixels, setPixels] = useState(() => Array(784).fill(0))
  const [strokeWidth, setStrokeWidth] = useState(1.8)
  const [erasing, setErasing] = useState(false)
  const canvas = useRef(null)
  useEffect(() => {
    const controller = new AbortController()
    const instance = new MLP()
    const timeout = setTimeout(() => controller.abort(), 15000)
    let active = true
    setState('loading'); setModel(null)
    instance.loadPretrainedWeights(controller.signal).then(() => { if (active) { setModel(instance); setState('ready') } })
      .catch(() => { if (active) setState('error') }).finally(() => clearTimeout(timeout))
    return () => { active = false; controller.abort(); clearTimeout(timeout) }
  }, [attempt])
  const result = useMemo(() => {
    if (!model || !pixels.some(v => v > 0.02)) return null
    const probabilities = model.softmax(model.forward(pixels))
    return { probabilities, activations: model.getActivations(), digit: probabilities.indexOf(Math.max(...probabilities)) }
  }, [model, pixels])
  return <AiExperimentLayout id="neural-network">
    <div className="ai-neural-workspace">
      <div className="ai-drawing">
        <h2>{copy.draw}</h2>
        <DrawingCanvas ref={canvas} label={copy.draw} strokeWidth={strokeWidth} erasing={erasing} onDrawingChange={setPixels} />
        <div className="ai-toolbar"><button className="ai-button" onClick={() => canvas.current.clear()}>{copy.clear}</button><button className="ai-button ai-button-secondary" aria-pressed={erasing} onClick={() => setErasing(value => !value)}>{copy.erase}</button></div>
        <label>{copy.brush}<input type="range" min="0.8" max="3" step="0.1" value={strokeWidth} onChange={e => setStrokeWidth(Number(e.target.value))} /></label>
        <p className="ai-help">{copy.drawHint}</p>
        <div className="ai-samples"><span>{copy.sample}</span>{[0, 1, 7].map(digit => <button key={digit} className="ai-button ai-button-secondary" onClick={() => canvas.current.example(digit)}>{digit}</button>)}</div>
        <div className="ai-prediction"><h2>{copy.prediction}</h2>
          {result ? <><div className="ai-prediction-summary" aria-live="polite"><strong data-testid="predicted-digit">{result.digit}</strong><span>{(result.probabilities[result.digit] * 100).toFixed(1)}%</span></div><div className="ai-probabilities">{result.probabilities.map((value, digit) => <div key={digit} className="ai-probability" data-probability={value}><span>{digit}</span><div className="ai-probability-track"><span style={{ width: `${value * 100}%` }} /></div><span>{(value * 100).toFixed(1)}%</span></div>)}</div><p className="ai-help">{copy.probabilityNote}</p></> : <p className="ai-help">{state === 'ready' ? copy.empty : state === 'error' ? copy.failed : copy.loading}</p>}
        </div>
      </div>
      <div className="ai-network-panel"><h2>{copy.network}</h2>
        <p className="ai-model-state" data-testid="model-state">{state === 'ready' ? copy.ready : state === 'error' ? copy.failed : copy.loading}</p>
        {state === 'error' && <button className="ai-button" onClick={() => setAttempt(value => value + 1)}>{copy.retry}</button>}
        <NetworkDiagram interactive title={copy.network} labels={copy} weights={model?.getWeights()} activations={result?.activations} />
        <p className="ai-help">{copy.viewHint}</p><p className="ai-help">{copy.networkNote}</p><p className="ai-help">{copy.modelNote}</p>
      </div>
    </div>
  </AiExperimentLayout>
}
