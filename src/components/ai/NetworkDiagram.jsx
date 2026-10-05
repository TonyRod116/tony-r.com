import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { edgeSignal, strongestConnections } from '../games/NeuralNetwork/networkMath'
import { InputGradientLinks, InputGradientCells } from './InputGradientFlow'

const OUTPUT_SCALE = 0.75
// Opacidades a escalones de 0,005 (menos de 1/255 de diferencia): así un trazo solo reescribe los elementos que cambian de verdad.
const alpha = value => Math.round(value*200)/200

// The camera retains the approved orientation; columns grow left to right.
// All nodes and highlighted values come from the actual model/input.
export default function NetworkDiagram({ activations, probabilities, weights, interactive = false, labels, title, dynamics, controls, forward, training, phase, running, animationEnabled, paused, selectedLayer = null, direction, guided, session, onTrace, onHold, onLayer, onDirection, onToggleAnimation, onPause }) {
  const [angle, setAngle] = useState(28)
  const [pitch, setPitch] = useState(-0.12)
  const [zoom, setZoom] = useState(1)
  const [inspected, setInspected] = useState(null)
  const [showInputGradients, setShowInputGradients] = useState(true)
  const drag = useRef(null)
  const root = useRef(null)
  // Las animaciones de flujo solo corren mientras el diagrama está a la vista (la pausa visible la gobiernan data-flow-playing y el botón).
  useEffect(()=>{
    const element=root.current
    if(!interactive||!element||typeof IntersectionObserver==='undefined')return
    const observer=new IntersectionObserver(([entry])=>{element.dataset.flowVisible=String(entry.isIntersecting)})
    observer.observe(element)
    return ()=>observer.disconnect()
  },[interactive])
  const glow = useId().replaceAll(':','')
  const sizes = weights?.length ? [weights[0][0].length, ...weights.map(layer => layer.length)] : [784,128,64,10]
  const isGradient = phase?.kind==='backward'||phase?.kind==='update'
  const activeLayer = selectedLayer
  const metricLabel = isGradient&&(inspected?.layer!==0||showInputGradients)?dynamics.gradient:inspected?.layer===0?dynamics?.pixel:labels?.activation
  const names = labels ? [labels.input,`${labels.hidden} 1`,`${labels.hidden} 2`,labels.output] : []
  const project = (layer,depth,vertical) => {
    const radians=angle*Math.PI/180
    return {x:375+((layer-1.5)*175*Math.cos(radians)+depth*Math.sin(radians))*zoom,y:200+(vertical+depth*pitch+(layer-1.5)*18)*zoom}
  }
  const layerLayout = layer => ({
    columns:layer===0?28:layer===sizes.length-1?(interactive?1:2):Math.ceil(Math.sqrt(sizes[layer])),
    spacing:layer===0?7:layer===sizes.length-1?(interactive?26*OUTPUT_SCALE:22):16,
  })
  const nodes = sizes.map((size,layer) => {
    const {columns,spacing}=layerLayout(layer),rows=Math.ceil(size/columns)
    const gradient=isGradient&&(layer!==0||showInputGradients)
    const values=gradient?training.nodeGradients[layer]:layer===sizes.length-1 && probabilities && phase?.key!=='f3' ? probabilities : activations?.[layer]
    const max=values?Math.max(1e-12,...values.map(v=>Math.abs(v))):1
    return Array.from({length:size},(_,index)=>({...project(layer,(index%columns-(columns-1)/2)*spacing,(Math.floor(index/columns)-(rows-1)/2)*spacing),value:values?Math.abs(values[index])/max:0,raw:values?.[index],index,gradient}))
  })
  const connections=useMemo(()=>{
    if(interactive && !weights)return []
    if(weights?.length)return strongestConnections(weights)
    const architecture=[784,128,64,10]
    return architecture.slice(1).flatMap((size,layer)=>Array.from({length:size},(_,target)=>
      [0,1].map(i=>({source:(target*17+i*31)%architecture[layer],target,layer,weight:1}))).flat())
  },[weights,interactive])
  useEffect(()=>{if(session!==undefined)setInspected(null)},[session])
  useEffect(()=>{if(!activations)setInspected(null)},[activations])
  const inspect=(layer,index)=>{onHold?.();onLayer?.(layer);setInspected({layer,index})}
  const signals=connections.map(edge=>forward?edgeSignal(weights,forward,training,phase,edge.layer,edge.target,edge.source,forward.normalization.std):null)
  const scales=[0,1,2].map(layer=>Math.max(1e-12,...signals.filter((_,i)=>connections[i].layer===layer).map(signal=>Math.abs(signal?.value||0))))
  const selected=inspected?nodes[inspected.layer][inspected.index]:null
  const winner=probabilities?probabilities.indexOf(Math.max(...probabilities)):null
  const gradientInput=interactive&&isGradient&&showInputGradients&&Boolean(training&&forward)
  const inputReturnActive=phase?.edgeLayer===0||phase?.edgeLayers?.includes(0)
  const inputFocused=activeLayer===null||activeLayer===0||inputReturnActive
  const futureLayer=index=>guided&&phase&&phase.layer!==null&&(['input','forward'].includes(phase.kind)?index>phase.layer:phase.kind==='backward'?index<phase.layer:false)
  return <div ref={root} className={`ai-network-diagram${interactive?' ai-network-instrument':''}`} data-active-layer={activeLayer??'all'} data-flow-direction={phase?.kind==='update'?'update':direction??'forward'} data-flow-playing={Boolean(running)} data-animation-enabled={Boolean(animationEnabled)} data-animation-paused={Boolean(paused)}>
    {interactive && <div className="ai-network-topline"><span className="ai-kicker">{isGradient?dynamics.gradient:activations?labels.liveSignal:labels.idleSignal}</span><button className="ai-text-button" disabled={!activations} onClick={()=>{setInspected(null);onTrace?.()}}>{labels.traverse}<span aria-hidden="true">↗</span></button></div>}
    {interactive&&<>
      <div className="neural-direction-controls" role="group" aria-label={controls.direction}>{['forward','backward'].map(value=><button key={value} aria-pressed={direction===value} onClick={()=>{setInspected(null);onDirection(value)}}><span aria-hidden="true">{value==='forward'?'→':'←'}</span>{controls[value]}</button>)}</div>
      <div className="neural-motion-controls"><button className="neural-animation-switch" role="switch" aria-checked={Boolean(animationEnabled)} aria-label={animationEnabled?controls.disable:controls.enable} onClick={onToggleAnimation}><span className="neural-switch-indicator" aria-hidden="true"/><span>{controls.animation} · {animationEnabled?controls.on:controls.off}</span></button><button className="ai-text-button" disabled={!animationEnabled||!activations} onClick={onPause}>{paused?dynamics.play:dynamics.pause}</button><span className="neural-motion-state">{!animationEnabled?controls.off:paused?controls.paused:controls.running}</span></div>
      <div className="ai-layer-navigation" role="group" aria-label={controls.layers}><button aria-pressed={activeLayer===null} onClick={()=>{setInspected(null);onLayer(null)}}><span>{controls.all}</span><strong>{sizes.reduce((sum,size)=>sum+size,0)}</strong></button>{sizes.map((size,index)=><button key={index} aria-pressed={activeLayer===index} onClick={()=>{setInspected(null);onLayer(index)}}><span>0{index+1} / {names[index]}</span><strong>{size}</strong></button>)}</div>
    </>}
    <svg viewBox={interactive?"35 20 705 395":"0 0 750 410"} role="img" aria-label={title} className={interactive?'is-interactive':''}
      onPointerDown={interactive?event=>{event.currentTarget.setPointerCapture(event.pointerId);drag.current={x:event.clientX,y:event.clientY,angle,pitch}}:undefined}
      onPointerMove={interactive?event=>{if(!drag.current)return;setAngle(Math.max(-60,Math.min(60,drag.current.angle+(event.clientX-drag.current.x)/3)));setPitch(Math.max(-0.8,Math.min(0.8,drag.current.pitch+(event.clientY-drag.current.y)/180)))}:undefined}
      onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null}} onLostPointerCapture={()=>{drag.current=null}}>
      <defs><filter id={glow} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.8" result="light"/><feMerge><feMergeNode in="light"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      {interactive && nodes.map((layer,index)=>{
        const {columns,spacing}=layerLayout(index),rows=Math.ceil(sizes[index]/columns)
        const depth=(columns+1)*spacing/2,vertical=(rows+1)*spacing/2
        const points=[[-depth,-vertical],[depth,-vertical],[depth,vertical],[-depth,vertical]].map(([d,v])=>{const p=project(index,d,v);return `${p.x},${p.y}`}).join(' ')
        return <polygon key={index} points={points} className={`ai-network-plane${activeLayer===index?' is-selected':''}`} />
      })}
      <g>{connections.map(({source,target,layer,weight},i)=>{
        if(gradientInput&&layer===0)return null
        const from=nodes[layer][source],to=nodes[layer+1][target],signal=signals[i]
        const strength=signal?Math.min(1,Math.abs(signal.value)/scales[layer]):activations?Math.min(1,Math.abs(weight)*from.value*2):0.1
        const focused=activeLayer===null||activeLayer===layer+1||phase?.edgeLayer===layer
        const matches=!inspected || (inspected.layer===layer && inspected.index===source) || (inspected.layer===layer+1 && inspected.index===target)
        const signed=signal?signal.value:weight,color=signed<0?'var(--ai-orange)':'var(--ai-accent)'
        const flowing=animationEnabled&&phase&&(phase.edgeLayer===layer||phase.edgeLayers?.includes(layer)||phase.kind==='update')&&signal&&Math.abs(signal.value)>1e-12&&matches
        const coordinates={x1:from.x,y1:from.y,x2:to.x,y2:to.y}
        return <g key={`${layer}-${target}-${source}`}>
          <line {...coordinates} stroke={color} opacity={alpha((interactive?0.04+strength*0.55:0.05+strength*0.6)*(focused&&matches?1:0.13))} strokeWidth={focused&&matches?1:0.5}
            data-edge-layer={layer} data-source={source} data-target={target} data-weight={weight} data-contribution={signal?.contribution} data-gradient={signal?.gradient} data-signal={signal?.value}>
            {signal&&<title>{`${dynamics.weight}: ${weight.toFixed(5)} · ${dynamics.contribution}: ${signal.contribution.toExponential(3)}${training?` · ${dynamics.gradient}: ${signal.gradient.toExponential(3)}`:''}`}</title>}
          </line>
          {flowing&&<line {...coordinates} stroke={color} strokeWidth={1+strength*1.4} opacity={0.25+strength*0.75} className="neural-flow-edge" data-flow-layer={layer}/>}
        </g>
      })}</g>
      {gradientInput&&<InputGradientLinks nodes={nodes[0]} sources={nodes[1]} connections={connections} signals={signals} active={inputReturnActive} enabled={animationEnabled} focused={inputFocused} inspected={inspected} copy={controls}/>}
      {nodes.map((layer,index)=><g key={index}>{layer.map(node=><g key={node.index}>
        <circle cx={node.x} cy={node.y} r={(index===0?1.6:index===3?(interactive?(winner===node.index?7:4)*OUTPUT_SCALE:5):3)*zoom} fill={gradientInput&&index===0?'var(--ai-accent)':node.raw<0?'var(--ai-orange)':index===0&&activations&&!node.gradient?'var(--ai-paper)':'var(--ai-accent)'}
          opacity={gradientInput&&index===0?0:futureLayer(index)?0.035:alpha((activations?0.1+node.value*0.9:index===0?0.25:0.7)*(activeLayer===null||activeLayer===index?1:0.4))}
          stroke={inspected?.layer===index&&inspected.index===node.index?'var(--ai-paper)':undefined} strokeWidth="2"
          filter={interactive&&activations&&!(gradientInput&&index===0)&&node.value>0.65?`url(#${glow})`:undefined}
          data-layer={index} data-node-index={node.index} data-activation={activations?.[index]?.[node.index]} data-node-value={node.raw} data-value-kind={node.gradient?'gradient':index===0?'pixel':'activation'} data-input-gradient={isGradient&&index===0?training.nodeGradients[0][node.index]:undefined}
          className={animationEnabled&&activations&&node.value>0.05&&phase?.layer===index&&['input','outputGradient'].includes(phase.key)?'neural-flow-node':undefined}
          onClick={interactive?()=>inspect(index,node.index):undefined}>
          <title>{`${names[index]||sizes[index]} / ${node.index}${node.raw!==undefined?`: ${(node.gradient?node.raw.toExponential(3):node.raw.toFixed(3))}`:''}`}</title>
        </circle>
        {interactive&&index===3&&<text x={node.x+14*OUTPUT_SCALE*zoom} y={node.y+7*OUTPUT_SCALE*zoom} data-output-label={node.index} className={`ai-network-label neural-output-label${winner===node.index?' is-winner':''}`}>{node.index}</text>}
      </g>)}</g>)}
      {gradientInput&&<InputGradientCells nodes={nodes[0]} project={project} active={inputReturnActive} enabled={animationEnabled} focused={inputFocused} inspected={inspected} onInspect={inspect}/>}
      {!interactive&&sizes.map((size,index)=><text key={index} x={project(index,0,0).x} y={interactive?382:385} textAnchor="middle" className="ai-network-label">{size}</text>)}
    </svg>
    {interactive && <>
      <p className="ai-help ai-layer-hint">{controls.layerHint}</p>{dynamics&&<p className="neural-signal-legend">{dynamics.legend}</p>}
      {isGradient&&<p className="neural-signal-legend">{showInputGradients?controls.sensitivityNote:controls.inputNote}</p>}
      {gradientInput&&<p className="neural-signal-legend">{controls.inputConnectionsNote.replace('{count}',String(sizes[1]))}</p>}
      <details className="ai-node-inspector"><summary>{labels.inspect}</summary>{isGradient&&<label className="neural-input-toggle"><input type="checkbox" checked={showInputGradients} onChange={event=>{onHold?.();setShowInputGradients(event.target.checked)}}/>{controls.inputSensitivity}</label>}<label>{labels.neuron}<input type="range" min="0" max={sizes[activeLayer??0]-1} value={inspected?.layer===(activeLayer??0)?inspected.index:0} onChange={e=>inspect(activeLayer??0,Number(e.target.value))}/></label>{selected&&<output>{names[inspected.layer]} · {inspected.index} / {metricLabel}: {selected.raw!==undefined?(selected.gradient?selected.raw.toExponential(3):selected.raw.toFixed(4)):'—'}{isGradient&&inspected.layer===0&&!showInputGradients&&<span> · {dynamics.gradient}: {training.nodeGradients[0][inspected.index].toExponential(3)}</span>}</output>}</details>
      <div className="ai-view-controls"><label>{labels.view}<input type="range" min="-60" max="60" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label><label>{labels.zoom}<input type="range" min="0.7" max="1.2" step="0.05" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/></label><button className="ai-button ai-button-secondary" onClick={()=>{setAngle(28);setPitch(-0.12);setZoom(1);setInspected(null)}}>{labels.resetView}</button></div>
    </>}
  </div>
}
