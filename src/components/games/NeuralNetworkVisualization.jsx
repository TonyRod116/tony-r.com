import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import { labCopy } from '../../data/aiExperiments'
import { neuralControls, neuralDynamics, forwardSteps, trainingSteps, inspectionPhase, TRACE_STEP_MS } from '../../data/neuralDynamics'
import AiExperimentLayout from '../ai/AiExperimentLayout'
import NetworkDiagram from '../ai/NetworkDiagram'
import DrawingCanvas from './NeuralNetwork/DrawingCanvas'
import NeuralTracePanel from './NeuralNetwork/NeuralTracePanel'
import { MLP } from './NeuralNetwork/mlp'
import './NeuralNetwork/NeuralStudio.css'

export default function NeuralNetworkVisualization() {
  const { language } = useLanguage(),copy=labCopy[language],dynamics=neuralDynamics[language],controls=neuralControls[language]
  const [model,setModel]=useState(null),[state,setState]=useState('loading'),[attempt,setAttempt]=useState(0)
  const [pixels,setPixels]=useState(()=>Array(784).fill(0)),[strokeWidth,setStrokeWidth]=useState(1.8),[erasing,setErasing]=useState(false),[example,setExample]=useState(7)
  const [target,setTarget]=useState(7),[playback,setPlayback]=useState(null),[traceError,setTraceError]=useState('')
  const [direction,setDirection]=useState('forward'),[selectedLayer,setSelectedLayer]=useState(null)
  const [animationEnabled,setAnimationEnabled]=useState(true),[paused,setPaused]=useState(false)
  const canvas=useRef(null),sequence=useRef(0)
  const changePixels=value=>{setPixels(value);setPlayback(null);setTraceError('')}
  useEffect(()=>{canvas.current.example(7)},[])
  useEffect(()=>{
    const controller=new AbortController(),instance=new MLP(),timeout=setTimeout(()=>controller.abort(),15000)
    let active=true
    setState('loading');setModel(null);setPlayback(null)
    instance.loadPretrainedWeights(controller.signal).then(()=>{if(active){setModel(instance);setState('ready')}}).catch(()=>{if(active)setState('error')}).finally(()=>clearTimeout(timeout))
    return ()=>{active=false;controller.abort();clearTimeout(timeout)}
  },[attempt])
  const result=useMemo(()=>model&&pixels.some(v=>v>0.02)?model.trace(pixels):null,[model,pixels])
  const gradientPreview=useMemo(()=>{
    if(!result||direction!=='backward')return null
    try{return {snapshot:model.trainingStep(pixels,target)}}catch{return {error:true}}
  },[model,pixels,result,direction,target])
  const startTrace=type=>{
    if(!result)return
    try{
      const snapshot=type==='training'?model.trainingStep(pixels,target):result
      setTraceError('');setDirection('forward');setSelectedLayer(null)
      setPlayback({id:++sequence.current,type,snapshot,steps:type==='training'?trainingSteps:forwardSteps,index:0})
    }catch{setPlayback(null);setTraceError(dynamics.error)}
  }
  useEffect(()=>{
    if(!playback||!animationEnabled||paused||playback.index===playback.steps.length-1)return
    const id=playback.id
    const timer=setTimeout(()=>setPlayback(previous=>{
      if(!previous||previous.id!==id)return previous
      const index=Math.min(previous.index+1,previous.steps.length-1)
      return {...previous,index}
    }),TRACE_STEP_MS)
    return ()=>clearTimeout(timer)
  },[playback,animationEnabled,paused])
  const phase=playback?.steps[playback.index]??inspectionPhase(direction,selectedLayer)
  const training=playback?.type==='training'?playback.snapshot:!playback?gradientPreview?.snapshot:null
  const visibleResult=playback?(training?(phase.kind==='after'?training.after:training.before):playback.snapshot):result
  const weights=phase?.kind==='after'?training.updatedWeights:model?.getWeights()
  const atEnd=Boolean(playback&&playback.index===playback.steps.length-1)
  const running=Boolean(result&&animationEnabled&&!paused&&!atEnd)
  const activeLayer=playback?phase.layer:selectedLayer
  const visibleDirection=playback?(['backward','update'].includes(phase.kind)?'backward':'forward'):direction
  const pauseTrace=()=>{
    if(atEnd){setPlayback(previous=>({...previous,index:0}));setPaused(false)}
    else setPaused(value=>!value)
  }
  const holdTrace=()=>setPaused(true)
  const stepTrace=()=>{setPaused(true);setPlayback(previous=>previous?{...previous,index:Math.min(previous.index+1,previous.steps.length-1)}:null)}
  const stopTrace=()=>setPlayback(null)
  const selectLayer=layer=>{if(atEnd)setPaused(true);setDirection(visibleDirection);setSelectedLayer(layer);stopTrace()}
  const selectDirection=value=>{if(atEnd)setPaused(true);setDirection(value);setSelectedLayer(activeLayer);stopTrace()}
  return <AiExperimentLayout id="neural-network">
    <div className="neural-studio">
      <div className="neural-studio-heading"><p className="ai-kicker">{copy.signal}</p><p className="ai-model-state" data-testid="model-state">{state==='ready'?copy.ready:state==='error'?copy.failed:copy.loading}</p>{state==='error'&&<button className="ai-button" onClick={()=>setAttempt(value=>value+1)}>{copy.retry}</button>}</div>
      <div className="neural-studio-grid">
        <section className="ai-drawing neural-drawing"><div className="neural-section-label"><span>01 / {copy.input}</span><span>28 × 28</span></div><h2>{copy.draw}</h2>
          <DrawingCanvas ref={canvas} label={copy.draw} strokeWidth={strokeWidth} erasing={erasing} onDrawingChange={changePixels}/>
          <div className="ai-toolbar"><button className="ai-button" onClick={()=>{canvas.current.clear();setExample(null)}}>{copy.clear}</button><button className="ai-button ai-button-secondary" aria-pressed={erasing} onClick={()=>setErasing(value=>!value)}>{copy.erase}</button></div>
          <label>{copy.brush}<input type="range" min="0.8" max="3" step="0.1" value={strokeWidth} onChange={e=>setStrokeWidth(Number(e.target.value))}/></label>
          <p className="ai-help">{copy.drawHint}</p>
          <div className="ai-samples"><span>{copy.sample}</span>{Array.from({length:10},(_,digit)=><button key={digit} className="ai-button ai-button-secondary" aria-pressed={example===digit} onClick={()=>{canvas.current.example(digit);setExample(digit);setTarget(digit)}}>{digit}</button>)}</div>
          <div className="neural-training-control"><div className="neural-target-row"><label htmlFor="training-digit">{dynamics.target}</label><select id="training-digit" value={target} onChange={e=>{setTarget(Number(e.target.value));stopTrace()}}>{Array.from({length:10},(_,digit)=><option key={digit} value={digit}>{digit}</option>)}</select></div><button className="ai-button ai-button-secondary" disabled={!result} onClick={()=>startTrace('training')}>{dynamics.training}</button><p>{dynamics.trainingNote}</p></div>
        </section>
        <section className="ai-network-panel neural-network"><div className="neural-section-label"><span>02 / MLP</span><span>784 → 128 → 64 → 10</span></div><h2>{copy.network}</h2>
          <NetworkDiagram interactive title={copy.network} labels={copy} dynamics={dynamics} controls={controls} weights={weights} activations={visibleResult?.activations} probabilities={visibleResult?.probabilities} forward={visibleResult} training={training} phase={training||visibleDirection==='forward'?phase:null} running={running} animationEnabled={animationEnabled} paused={paused||atEnd} selectedLayer={activeLayer} direction={visibleDirection} guided={Boolean(playback)} onDirection={selectDirection} onLayer={selectLayer} session={playback?.id} onTrace={()=>startTrace('inference')} onHold={holdTrace} onToggleAnimation={()=>setAnimationEnabled(value=>!value)} onPause={pauseTrace}/>
          {result&&!(gradientPreview?.error&&!playback)&&<NeuralTracePanel playback={playback} training={training} phase={phase} language={language} onStep={stepTrace} onStop={stopTrace}/>}
          {(traceError||gradientPreview?.error)&&<p role="alert" className="ai-help">{traceError||dynamics.error}</p>}
          <p className="ai-help">{copy.viewHint}</p>
        </section>
        <section className="ai-prediction neural-response"><div className="neural-section-label"><span>03 / {copy.output}</span><span>SOFTMAX</span></div><h2>{copy.prediction}</h2>
          {phase?.kind==='after'&&<p className="neural-copy-label">{dynamics.afterCopy}</p>}
          <div className="neural-result" aria-live="polite">{visibleResult?<><strong data-testid="predicted-digit">{visibleResult.digit}</strong><div><span>{copy.strongest}</span><b>{(visibleResult.probabilities[visibleResult.digit]*100).toFixed(1)}%</b></div></>:<><strong aria-hidden="true">—</strong><p>{state==='ready'?copy.empty:state==='error'?copy.failed:copy.loading}</p></>}</div>
          <div className="ai-probabilities">{Array.from({length:10},(_,digit)=>{const value=visibleResult?.probabilities[digit]??0;return <div key={digit} className={`ai-probability${visibleResult?.digit===digit?' is-leading':''}`} data-probability={visibleResult?value:undefined}><span>{digit}</span><div className="ai-probability-track"><span style={{width:`${value*100}%`}}/></div><span>{visibleResult?(value*100).toFixed(1)+'%':'—'}</span></div>})}</div>
          <p className="ai-help">{copy.probabilityNote}</p>
        </section>
      </div>
      <footer className="neural-studio-notes"><p>{copy.networkNote} {dynamics.animationNote}</p><p>{copy.modelNote}</p></footer>
    </div>
  </AiExperimentLayout>
}
