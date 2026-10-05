const colorFor = value => value < 0 ? 'var(--ai-orange)' : 'var(--ai-accent)'
// Opacidades a escalones de 0,005 (menos de 1/255): un trazo solo reescribe las celdas que cambian de verdad.
const alpha = value => Math.round(value*200)/200

// Restore the original two strongest-weight connections per hidden neuron.
// Each return carries its own chain-rule contribution; pixel cells retain
// the full derivative over every hidden neuron, not just the visible edges.
export function InputGradientLinks({ nodes, sources, connections, signals, active, enabled, focused, inspected, copy }) {
  const edges=connections.flatMap((edge,index)=>edge.layer===0?[{...edge,signal:signals[index]}]:[])
  const scale=Math.max(1e-12,...edges.map(edge=>Math.abs(edge.signal.value)))
  const strength=edge=>Math.abs(edge.signal.value)/scale
  const matches=edge=>!inspected||(inspected.layer===0&&inspected.index===edge.source)||(inspected.layer===1&&inspected.index===edge.target)
  const pathFor=edge=>`M${nodes[edge.source].x},${nodes[edge.source].y} L${sources[edge.target].x},${sources[edge.target].y}`
  return <g data-testid="input-gradient-transport" data-source-count={sources.length}>
    <g>{edges.map(edge=><path key={`${edge.target}-${edge.source}`} d={pathFor(edge)} fill="none" stroke={colorFor(edge.signal.value)} strokeWidth="0.5"
      opacity={alpha((0.025+strength(edge)*0.3)*(focused&&matches(edge)?1:0.13))}
      data-input-route={edge.source} data-return-source={edge.target} data-weight={edge.weight} data-signal={edge.signal.value}>
      <title>{`${copy.returnContribution}: ${edge.signal.value.toExponential(4)}`}</title>
    </path>)}</g>
    {enabled&&active&&<g className="neural-input-return-pulses" data-testid="input-gradient-pulses">{edges.filter(edge=>Math.abs(edge.signal.value)>1e-12&&matches(edge)).map(edge=><path key={`${edge.target}-${edge.source}`} d={pathFor(edge)} pathLength="100" fill="none" stroke={colorFor(edge.signal.value)} strokeWidth={0.6+strength(edge)*0.8} opacity={0.15+strength(edge)*0.7} className="neural-flow-edge neural-input-return-edge" data-flow-layer="0" data-return-pulse data-return-source={edge.target} data-signal={edge.signal.value}/>)}</g>}
  </g>
}

export function InputGradientCells({ nodes, project, active, enabled, focused, inspected, onInspect }) {
  return <g className={`neural-input-gradient-cells${enabled&&active?' is-return-active':''}`} data-testid="input-gradient-cells">
    {nodes.map(node=>{
      const depth=(node.index%28-13.5)*7,vertical=(Math.floor(node.index/28)-13.5)*7
      const points=[[-3.1,-3.1],[3.1,-3.1],[3.1,3.1],[-3.1,3.1]].map(([d,v])=>{const p=project(0,depth+d,vertical+v);return `${p.x},${p.y}`}).join(' ')
      const matches=!inspected||inspected.layer!==0||inspected.index===node.index
      return <polygon key={node.index} points={points} fill={colorFor(node.raw)} fillOpacity={alpha((0.025+node.value*0.9)*(focused&&matches?1:0.3))} stroke={colorFor(node.raw)} strokeWidth="0.7"
        data-input-cell={node.index} data-gradient={node.raw} data-value={node.value}
        onPointerDown={event=>event.stopPropagation()} onClick={()=>onInspect(0,node.index)}>
        <title>{`∂L/∂x[${node.index}]: ${node.raw.toExponential(4)}`}</title>
      </polygon>
    })}
  </g>
}
