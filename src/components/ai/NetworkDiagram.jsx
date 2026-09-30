import { useEffect, useId, useMemo, useRef, useState } from 'react'

// The camera retains the approved orientation; columns grow left to right.
// All nodes and highlighted values come from the actual model/input.
export default function NetworkDiagram({ activations, probabilities, weights, interactive = false, labels, title }) {
  const [angle, setAngle] = useState(28)
  const [pitch, setPitch] = useState(-0.12)
  const [zoom, setZoom] = useState(1)
  const [selectedLayer, setSelectedLayer] = useState(null)
  const [inspected, setInspected] = useState(null)
  const [tracing, setTracing] = useState(false)
  const drag = useRef(null)
  const glow = useId().replaceAll(':','')
  const sizes = weights?.length ? [weights[0][0].length, ...weights.map(layer => layer.length)] : [784,128,64,10]
  const names = labels ? [labels.input,`${labels.hidden} 1`,`${labels.hidden} 2`,labels.output] : []
  const project = (layer,depth,vertical) => {
    const radians=angle*Math.PI/180
    return {x:375+((layer-1.5)*175*Math.cos(radians)+depth*Math.sin(radians))*zoom,y:200+(vertical+depth*pitch+(layer-1.5)*18)*zoom}
  }
  const nodes = sizes.map((size,layer) => {
    const columns=layer===0?28:layer===sizes.length-1?2:Math.ceil(Math.sqrt(size))
    const rows=Math.ceil(size/columns),spacing=layer===0?7:layer===sizes.length-1?22:16
    const values=layer===sizes.length-1 && probabilities ? probabilities : activations?.[layer]
    const max=values?Math.max(0.001,...values):1
    return Array.from({length:size},(_,index)=>({...project(layer,(index%columns-(columns-1)/2)*spacing,(Math.floor(index/columns)-(rows-1)/2)*spacing),value:values?Math.max(0,values[index])/max:0,raw:values?.[index],index}))
  })
  const connections=useMemo(()=>{
    const architecture=weights?.length?[weights[0][0].length,...weights.map(layer=>layer.length)]:[784,128,64,10]
    return architecture.slice(1).flatMap((size,layer)=>Array.from({length:size},(_,target)=>{
      if(weights)return Array.from(weights[layer][target],(weight,source)=>({source,weight})).sort((a,b)=>Math.abs(b.weight)-Math.abs(a.weight)).slice(0,2).map(edge=>({...edge,target,layer}))
      return [0,1].map(i=>({source:(target*17+i*31)%architecture[layer],target,layer,weight:1}))
    }).flat())
  },[weights])
  useEffect(()=>{
    if(!tracing || !activations)return
    let layer=0
    setSelectedLayer(layer)
    const timer=setInterval(()=>{
      layer++
      if(layer>3){setTracing(false);clearInterval(timer)}else setSelectedLayer(layer)
    },800)
    return ()=>clearInterval(timer)
  },[tracing,activations])
  useEffect(()=>{if(!activations){setTracing(false);setInspected(null)}},[activations])
  const inspect=(layer,index)=>{setTracing(false);setSelectedLayer(layer);setInspected({layer,index})}
  const selected=inspected?nodes[inspected.layer][inspected.index]:null
  const winner=probabilities?probabilities.indexOf(Math.max(...probabilities)):null
  return <div className={`ai-network-diagram${interactive?' ai-network-instrument':''}`} data-active-layer={selectedLayer??'all'}>
    {interactive && <div className="ai-network-topline"><span className="ai-kicker">{activations?labels.liveSignal:labels.idleSignal}</span><button className="ai-text-button" disabled={!activations} onClick={()=>{setInspected(null);setTracing(value=>!value)}}>{tracing?labels.stopTrace:labels.traverse}<span aria-hidden="true">↗</span></button></div>}
    <svg viewBox={interactive?"75 30 600 350":"0 0 750 410"} role="img" aria-label={title} className={interactive?'is-interactive':''}
      onPointerDown={interactive?event=>{event.currentTarget.setPointerCapture(event.pointerId);drag.current={x:event.clientX,y:event.clientY,angle,pitch}}:undefined}
      onPointerMove={interactive?event=>{if(!drag.current)return;setAngle(Math.max(-60,Math.min(60,drag.current.angle+(event.clientX-drag.current.x)/3)));setPitch(Math.max(-0.8,Math.min(0.8,drag.current.pitch+(event.clientY-drag.current.y)/180)))}:undefined}
      onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null}} onLostPointerCapture={()=>{drag.current=null}}>
      <defs><filter id={glow} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.8" result="light"/><feMerge><feMergeNode in="light"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      {interactive && nodes.map((layer,index)=>{
        const columns=index===0?28:index===3?2:Math.ceil(Math.sqrt(sizes[index])),rows=Math.ceil(sizes[index]/columns),spacing=index===0?7:index===3?22:16
        const depth=(columns+1)*spacing/2,vertical=(rows+1)*spacing/2
        const points=[[-depth,-vertical],[depth,-vertical],[depth,vertical],[-depth,vertical]].map(([d,v])=>{const p=project(index,d,v);return `${p.x},${p.y}`}).join(' ')
        return <polygon key={index} points={points} className={`ai-network-plane${selectedLayer===index?' is-selected':''}`} />
      })}
      <g>{connections.map(({source,target,layer,weight})=>{
        const from=nodes[layer][source],to=nodes[layer+1][target]
        const strength=activations?Math.min(1,Math.abs(weight)*from.value*2):0.1
        const focused=selectedLayer===null||selectedLayer===layer+1
        const matches=!inspected || (inspected.layer===layer && inspected.index===source) || (inspected.layer===layer+1 && inspected.index===target)
        return <line key={`${layer}-${target}-${source}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={weight<0?'var(--ai-orange)':'var(--ai-accent)'} opacity={(interactive?0.04+strength*0.58:0.05+strength*0.6)*(focused&&matches?1:0.13)} strokeWidth={focused&&matches?1:0.5}/>
      })}</g>
      {nodes.map((layer,index)=><g key={index}>{layer.map(node=><g key={node.index}>
        <circle cx={node.x} cy={node.y} r={(index===0?1.6:index===3?(interactive?(winner===node.index?7:4):5):3)*zoom} fill={index===0&&activations?'var(--ai-paper)':'var(--ai-accent)'}
          opacity={(activations?0.1+node.value*0.9:index===0?0.25:0.7)*(selectedLayer===null||selectedLayer===index?1:0.5)}
          stroke={inspected?.layer===index&&inspected.index===node.index?'var(--ai-paper)':undefined} strokeWidth="2"
          filter={interactive&&activations&&node.value>0.65?`url(#${glow})`:undefined}
          data-layer={index} data-node-index={node.index} data-activation={node.raw}
          onClick={interactive?()=>inspect(index,node.index):undefined}>
          <title>{`${names[index]||sizes[index]} / ${node.index}${node.raw!==undefined?`: ${node.raw.toFixed(3)}`:''}`}</title>
        </circle>
        {interactive&&index===3&&<text x={node.x+11} y={node.y+4} className={`ai-network-label${winner===node.index?' is-winner':''}`}>{node.index}</text>}
      </g>)}</g>)}
      {sizes.map((size,index)=><text key={index} x={project(index,0,0).x} y={interactive?382:385} textAnchor="middle" className="ai-network-label">{size}</text>)}
    </svg>
    {interactive && <>
      <div className="ai-layer-navigation" aria-label={labels.layerHint}>{sizes.map((size,index)=><button key={index} aria-pressed={selectedLayer===index} onClick={()=>{setTracing(false);setSelectedLayer(selectedLayer===index?null:index);setInspected(null)}}><span>0{index+1} / {names[index]}</span><strong>{size}</strong></button>)}</div>
      <p className="ai-help ai-layer-hint">{labels.layerHint}</p>
      <details className="ai-node-inspector"><summary>{labels.inspect}</summary><label>{labels.neuron}<input type="range" min="0" max={sizes[selectedLayer??0]-1} value={inspected?.layer===(selectedLayer??0)?inspected.index:0} onChange={e=>inspect(selectedLayer??0,Number(e.target.value))}/></label>{selected&&<output>{names[inspected.layer]} · {inspected.index} / {labels.activation}: {selected.raw!==undefined?selected.raw.toFixed(4):'—'}</output>}</details>
      <div className="ai-view-controls"><label>{labels.view}<input type="range" min="-60" max="60" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label><label>{labels.zoom}<input type="range" min="0.7" max="1.2" step="0.05" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/></label><button className="ai-button ai-button-secondary" onClick={()=>{setAngle(28);setPitch(-0.12);setZoom(1);setSelectedLayer(null);setInspected(null);setTracing(false)}}>{labels.resetView}</button></div>
    </>}
  </div>
}
