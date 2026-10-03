import { useEffect, useId, useRef, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage.jsx'
import { siteContent } from '../data/siteContent'

export default function BeforeAfterSlider({ originalImageUrl, renderedImageUrl, showRange = true }) {
  const { language } = useLanguage()
  const copy = siteContent[language]
  const [position,setPosition] = useState(50)
  const [failed,setFailed] = useState({original:false,rendered:false})
  const container = useRef(null)
  const id = useId()
  const rangeProps = { type:'range', min:0, max:100, step:1, value:position, onChange:event=>setPosition(Number(event.target.value)) }
  useEffect(() => {setFailed({original:false,rendered:false});setPosition(50)},[originalImageUrl,renderedImageUrl])
  const move = event => {
    const rect=container.current.getBoundingClientRect()
    setPosition(Math.round(Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100))))
  }
  return <div>
    <p className="site-kicker">{copy.comparison}</p>
    <div ref={container} className="site-comparison" onPointerDown={event=>{event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId);move(event)}} onPointerMove={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))move(event)}} onPointerUp={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)}}>
      {failed.rendered?<div className="site-comparison-fallback">{copy.unavailable}</div>:<img src={renderedImageUrl} alt={copy.after} onError={()=>setFailed(state=>({...state,rendered:true}))} />}
      {!failed.original&&<div className="site-comparison-original" style={{clipPath:`inset(0 ${100-position}% 0 0)`}}><img src={originalImageUrl} alt={copy.before} onError={()=>setFailed(state=>({...state,original:true}))} /></div>}
      <div className="site-comparison-line" style={{left:`${position}%`}}><span aria-hidden="true">↔</span></div>
      {!showRange&&<input id={id} className="site-comparison-direct-control" aria-label={copy.comparisonControl} {...rangeProps} />}
    </div>
    <div className="site-comparison-labels"><span>{copy.before}</span><span>{copy.after}</span></div>
    {showRange&&<><label htmlFor={id} className="site-note">{copy.comparisonControl}</label><input id={id} className="site-comparison-range" {...rangeProps} /></>}
    <p className="site-note">{showRange?copy.comparisonHint:copy.comparisonDragHint}</p>
    {(failed.original||failed.rendered)&&<p role="alert" className="site-message is-error">{copy.unavailable}</p>}
  </div>
}
