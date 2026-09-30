import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import { labCopy } from '../../data/aiExperiments'
import AiExperimentLayout from '../ai/AiExperimentLayout'
import NetworkDiagram from '../ai/NetworkDiagram'
import DrawingCanvas from './NeuralNetwork/DrawingCanvas'
import { MLP } from './NeuralNetwork/mlp'
import './NeuralNetwork/NeuralStudio.css'

export default function NeuralNetworkVisualization() {
  const { language } = useLanguage()
  const copy = labCopy[language]
  const [model,setModel]=useState(null),[state,setState]=useState('loading'),[attempt,setAttempt]=useState(0)
  const [pixels,setPixels]=useState(()=>Array(784).fill(0)),[strokeWidth,setStrokeWidth]=useState(1.8),[erasing,setErasing]=useState(false),[example,setExample]=useState(7)
  const canvas=useRef(null)
  useEffect(()=>{canvas.current.example(7)},[])
  useEffect(()=>{
    const controller=new AbortController(),instance=new MLP()
    const timeout=setTimeout(()=>controller.abort(),15000)
    let active=true
    setState('loading');setModel(null)
    instance.loadPretrainedWeights(controller.signal).then(()=>{if(active){setModel(instance);setState('ready')}}).catch(()=>{if(active)setState('error')}).finally(()=>clearTimeout(timeout))
    return ()=>{active=false;controller.abort();clearTimeout(timeout)}
  },[attempt])
  const result=useMemo(()=>{
    if(!model||!pixels.some(v=>v>0.02))return null
    const probabilities=model.softmax(model.forward(pixels))
    return {probabilities,activations:model.getActivations(),digit:probabilities.indexOf(Math.max(...probabilities))}
  },[model,pixels])
  return <AiExperimentLayout id="neural-network">
    <div className="neural-studio">
      <div className="neural-studio-heading"><p className="ai-kicker">{copy.signal}</p><p className="ai-model-state" data-testid="model-state">{state==='ready'?copy.ready:state==='error'?copy.failed:copy.loading}</p>{state==='error'&&<button className="ai-button" onClick={()=>setAttempt(value=>value+1)}>{copy.retry}</button>}</div>
      <div className="neural-studio-grid">
        <section className="ai-drawing neural-drawing"><div className="neural-section-label"><span>01 / {copy.input}</span><span>28 × 28</span></div><h2>{copy.draw}</h2>
          <DrawingCanvas ref={canvas} label={copy.draw} strokeWidth={strokeWidth} erasing={erasing} onDrawingChange={setPixels}/>
          <div className="ai-toolbar"><button className="ai-button" onClick={()=>{canvas.current.clear();setExample(null)}}>{copy.clear}</button><button className="ai-button ai-button-secondary" aria-pressed={erasing} onClick={()=>setErasing(value=>!value)}>{copy.erase}</button></div>
          <label>{copy.brush}<input type="range" min="0.8" max="3" step="0.1" value={strokeWidth} onChange={e=>setStrokeWidth(Number(e.target.value))}/></label>
          <div className="ai-samples"><span>{copy.sample}</span>{Array.from({length:10},(_,digit)=><button key={digit} className="ai-button ai-button-secondary" aria-pressed={example===digit} onClick={()=>{canvas.current.example(digit);setExample(digit)}}>{digit}</button>)}</div>
          <p className="ai-help">{copy.drawHint}</p>
        </section>
        <section className="ai-network-panel neural-network"><div className="neural-section-label"><span>02 / MLP</span><span>784 → 128 → 64 → 10</span></div><h2>{copy.network}</h2>
          <NetworkDiagram interactive title={copy.network} labels={copy} weights={model?.getWeights()} activations={result?.activations} probabilities={result?.probabilities}/>
          <p className="ai-help">{copy.viewHint}</p>
        </section>
        <section className="ai-prediction neural-response"><div className="neural-section-label"><span>03 / {copy.output}</span><span>SOFTMAX</span></div><h2>{copy.prediction}</h2>
          <div className="neural-result" aria-live="polite">{result?<><strong data-testid="predicted-digit">{result.digit}</strong><div><span>{copy.strongest}</span><b>{(result.probabilities[result.digit]*100).toFixed(1)}%</b></div></>:<><strong aria-hidden="true">—</strong><p>{state==='ready'?copy.empty:state==='error'?copy.failed:copy.loading}</p></>}</div>
          <div className="ai-probabilities">{Array.from({length:10},(_,digit)=>{const value=result?.probabilities[digit]??0;return <div key={digit} className={`ai-probability${result?.digit===digit?' is-leading':''}`} data-probability={result?value:undefined}><span>{digit}</span><div className="ai-probability-track"><span style={{width:`${value*100}%`}}/></div><span>{result?(value*100).toFixed(1)+'%':'—'}</span></div>})}</div>
          <p className="ai-help">{copy.probabilityNote}</p>
        </section>
      </div>
      <footer className="neural-studio-notes"><p>{copy.networkNote}</p><p>{copy.modelNote}</p></footer>
    </div>
  </AiExperimentLayout>
}
