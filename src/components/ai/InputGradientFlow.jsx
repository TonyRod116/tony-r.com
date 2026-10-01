const colorFor = value => value < 0 ? 'var(--ai-orange)' : 'var(--ai-accent)'

// One path represents the complete weighted sum from the first hidden layer.
// It is an explicit collapsed operator, not an extra neuron or one sampled edge.
export function InputGradientLinks({ nodes, project, sourceCount, active, enabled, focused, inspected, copy }) {
  const source=project(1,0,-115)
  const matches=node=>!inspected||inspected.layer!==0||inspected.index===node.index
  const pathFor=node=>`M${node.x},${node.y} L${source.x},${source.y}`
  return <g data-testid="input-gradient-transport" data-source-count={sourceCount}>
    <g>{nodes.map(node=><path key={node.index} d={pathFor(node)} fill="none" stroke={colorFor(node.raw)} strokeWidth="0.5"
      opacity={(0.012+node.value*0.14)*(focused&&matches(node)?1:0.1)}
      data-input-route={node.index} data-signal={node.raw} data-source-count={sourceCount} data-aggregation="complete-input-gradient">
      <title>{`${copy.inputSum}: ${sourceCount} · ∂L/∂x[${node.index}]: ${node.raw.toExponential(4)}`}</title>
    </path>)}</g>
    {enabled&&active&&<g className="neural-input-return-pulses" data-testid="input-gradient-pulses">{nodes.filter(node=>Math.abs(node.raw)>1e-12&&matches(node)).map(node=><path key={node.index} d={pathFor(node)} pathLength="100" fill="none" stroke={colorFor(node.raw)} strokeWidth={0.6+node.value*0.8} opacity={0.15+node.value*0.7} className="neural-flow-edge neural-input-return-edge" data-flow-layer="0"/>)}</g>}
    <g className="neural-input-sum-label" aria-label={`${copy.inputSum} ${sourceCount}`}>
      <rect x={source.x-29} y={source.y-10} width="58" height="20"/>
      <text x={source.x} y={source.y+5} textAnchor="middle">∑ {sourceCount}</text>
      <title>{copy.inputSumNote.replace('{count}',String(sourceCount))}</title>
    </g>
  </g>
}

export function InputGradientCells({ nodes, project, active, enabled, focused, inspected, onInspect }) {
  return <g className={`neural-input-gradient-cells${enabled&&active?' is-return-active':''}`} data-testid="input-gradient-cells">
    {nodes.map(node=>{
      const depth=(node.index%28-13.5)*7,vertical=(Math.floor(node.index/28)-13.5)*7
      const points=[[-3.1,-3.1],[3.1,-3.1],[3.1,3.1],[-3.1,3.1]].map(([d,v])=>{const p=project(0,depth+d,vertical+v);return `${p.x},${p.y}`}).join(' ')
      const matches=!inspected||inspected.layer!==0||inspected.index===node.index
      return <polygon key={node.index} points={points} fill={colorFor(node.raw)} fillOpacity={(0.025+node.value*0.9)*(focused&&matches?1:0.3)} stroke={colorFor(node.raw)} strokeWidth="0.7"
        data-input-cell={node.index} data-gradient={node.raw} data-value={node.value}
        onPointerDown={event=>event.stopPropagation()} onClick={()=>onInspect(0,node.index)}>
        <title>{`∂L/∂x[${node.index}]: ${node.raw.toExponential(4)}`}</title>
      </polygon>
    })}
  </g>
}
