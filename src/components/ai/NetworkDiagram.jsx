import { useMemo, useRef, useState } from 'react'

// Vector projection of layer coordinates: works without WebGL or a CDN.
export default function NetworkDiagram({ activations, weights, interactive = false, labels, title }) {
  const [angle, setAngle] = useState(28)
  const [pitch, setPitch] = useState(-0.12)
  const [zoom, setZoom] = useState(1)
  const drag = useRef(null)
  const sizes = weights?.length ? [weights[0][0].length, ...weights.map(layer => layer.length)] : [784, 128, 64, 10]
  const nodes = sizes.map((size, layer) => {
    const columns = layer === 0 ? 28 : layer === sizes.length - 1 ? 2 : Math.ceil(Math.sqrt(size))
    const rows = Math.ceil(size / columns)
    const spacing = layer === 0 ? 7 : layer === sizes.length - 1 ? 22 : 16
    const values = activations?.[layer]
    const max = values ? Math.max(0.001, ...values) : 1
    return Array.from({ length: size }, (_, index) => {
      const depth = (index % columns - (columns - 1) / 2) * spacing
      const vertical = (Math.floor(index / columns) - (rows - 1) / 2) * spacing
      const radians = angle * Math.PI / 180
      return { x: 375 + (((layer - 1.5) * 175) * Math.cos(radians) + depth * Math.sin(radians)) * zoom,
        y: 200 + (vertical + depth * pitch + (layer - 1.5) * 18) * zoom,
        value: values ? Math.max(0, values[index]) / max : 0, index }
    })
  })
  const connections = useMemo(() => {
    const architecture = weights?.length ? [weights[0][0].length, ...weights.map(layer => layer.length)] : [784, 128, 64, 10]
    return architecture.slice(1).flatMap((size, layer) => Array.from({ length: size }, (_, target) => {
      if (weights) return Array.from(weights[layer][target], (weight, source) => ({ source, weight }))
        .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight)).slice(0, 2).map(edge => ({ ...edge, target, layer }))
      return [0, 1].map(i => ({ source: (target * 17 + i * 31) % architecture[layer], target, layer, weight: 1 }))
    }).flat())
  }, [weights])
  return <div className="ai-network-diagram">
    <svg viewBox="0 0 750 410" role="img" aria-label={title} className={interactive ? 'is-interactive' : ''}
      onPointerDown={interactive ? event => { event.currentTarget.setPointerCapture(event.pointerId); drag.current = { x: event.clientX, y: event.clientY, angle, pitch } } : undefined}
      onPointerMove={interactive ? event => { if (!drag.current) return; setAngle(Math.max(-60, Math.min(60, drag.current.angle + (event.clientX - drag.current.x) / 3))); setPitch(Math.max(-0.8, Math.min(0.8, drag.current.pitch + (event.clientY - drag.current.y) / 180))) } : undefined}
      onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}>
      <g>{connections.map(({ source, target, layer, weight }) => {
        const from = nodes[layer][source], to = nodes[layer + 1][target]
        const strength = activations ? Math.min(1, Math.abs(weight) * from.value * 2) : 0.1
        return <line key={`${layer}-${target}-${source}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={weight < 0 ? 'var(--ai-orange)' : 'var(--ai-accent)'} opacity={0.05 + strength * 0.6} />
      })}</g>
      {nodes.map((layer, index) => <g key={index}>{layer.map(node => <g key={node.index}>
        <circle cx={node.x} cy={node.y} r={(index === 0 ? 1.6 : index === sizes.length - 1 ? 5 : 3) * zoom} fill={index === 0 && activations ? 'var(--ai-paper)' : 'var(--ai-accent)'} opacity={activations ? 0.12 + node.value * 0.88 : index === 0 ? 0.25 : 0.7}>
          <title>{`${sizes[index]} / ${node.index}${activations ? `: ${activations[index][node.index].toFixed(3)}` : ''}`}</title>
        </circle>
        {interactive && index === sizes.length - 1 && <text x={node.x + 9} y={node.y + 4} className="ai-network-label">{node.index}</text>}
      </g>)}</g>)}
      {sizes.map((size, index) => <text key={index} x={375 + (index - 1.5) * 175 * Math.cos(angle * Math.PI / 180) * zoom} y="385" textAnchor="middle" className="ai-network-label">{size}</text>)}
    </svg>
    {interactive && <div className="ai-view-controls">
      <label>{labels.view}<input type="range" min="-60" max="60" value={angle} onChange={e => setAngle(Number(e.target.value))} /></label>
      <label>{labels.zoom}<input type="range" min="0.7" max="1.2" step="0.05" value={zoom} onChange={e => setZoom(Number(e.target.value))} /></label>
      <button className="ai-button ai-button-secondary" onClick={() => { setAngle(28); setPitch(-0.12); setZoom(1) }}>{labels.resetView}</button>
    </div>}
  </div>
}
