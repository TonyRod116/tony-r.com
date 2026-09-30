import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import { observeDemoRequest } from '../../utils/telemetry'
import { readDemoResponse, imageUrl } from '../../utils/demoResponse'
import { siteContent } from '../../data/siteContent'
import DemoPage from '../../components/site/DemoPage'
import BeforeAfterSlider from '../../components/BeforeAfterSlider'

const BASE='https://buildapp-v1-backend.onrender.com'
const LOCALES={es:'es-ES',en:'en-US',ca:'ca-ES'}
const MAX_SIZE=10*1024*1024, MAX_DIMENSION=8192
function readImage(file) {
  return new Promise((resolve,reject)=>{
    const reader=new FileReader()
    reader.onerror=()=>reject(new Error('image'))
    reader.onload=()=>{const image=new Image();image.onerror=()=>reject(new Error('image'));image.onload=()=>resolve({url:reader.result,width:image.naturalWidth,height:image.naturalHeight});image.src=reader.result}
    reader.readAsDataURL(file)
  })
}
export default function RenderPresupuesto() {
  const {t,language}=useLanguage(),copy=siteContent[language]
  const [image,setImage]=useState(null),[prompt,setPrompt]=useState(''),[loading,setLoading]=useState(false),[error,setError]=useState(null),[result,setResult]=useState(null)
  const fileInput=useRef(null),request=useRef(null),version=useRef(0),fileVersion=useRef(0)
  useEffect(()=>()=>{version.current++;fileVersion.current++;request.current?.abort()},[])
  const selectImage=async event=>{
    const file=event.target.files?.[0],id=++fileVersion.current
    event.target.value='';setImage(null);setError(null);setResult(null)
    if(!file)return
    if(file.size>MAX_SIZE){setError(t('solutions.renderPresupuesto.upload.imageTooLarge').replace('{size}','10'));return}
    if(!['image/jpeg','image/png','image/webp'].includes(file.type.toLowerCase())){setError(t('solutions.renderPresupuesto.upload.invalidFormat'));return}
    try{const loaded=await readImage(file);if(id!==fileVersion.current)return;if(loaded.width>MAX_DIMENSION||loaded.height>MAX_DIMENSION){setError(t('solutions.renderPresupuesto.upload.imageTooBig').replace('{size}',String(MAX_DIMENSION)));return}setImage(loaded.url)}catch{if(id===fileVersion.current)setError(t('solutions.renderPresupuesto.upload.imageReadError'))}
  }
  const cancel=()=>{version.current++;request.current?.abort();setLoading(false);setError(null)}
  const generate=async event=>{
    event.preventDefault();if(loading||!image||!prompt.trim())return
    const id=++version.current,controller=new AbortController();request.current=controller
    setLoading(true);setError(null);setResult(null)
    const timer=setTimeout(()=>controller.abort('timeout'),300000)
    try{
      const base=(import.meta.env.VITE_BUILDAPP_DEMO_API_URL||BASE).replace(/\/$/,'')
      const response=await observeDemoRequest('render',()=>fetch(`${base}/api/v1/get-inspired/process`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image,prompt:prompt.trim(),locale:LOCALES[language]}),signal:controller.signal}))
      const data=await readDemoResponse(response,copy.serviceError)
      const original=imageUrl(data.originalImageUrl)||image, edited=imageUrl(data.editedImageUrl)
      if(!edited&&data.budget==null)throw new Error(copy.serviceError)
      if(id===version.current)setResult({...data,originalImageUrl:original,editedImageUrl:edited})
    }catch(problem){if(id===version.current)setError(controller.signal.reason==='timeout'?copy.timeout:controller.signal.aborted?null:problem.message||copy.serviceError)}finally{clearTimeout(timer);if(id===version.current)setLoading(false)}
  }
  const amount=value=>Number.isFinite(Number(value))?Number(value).toLocaleString(LOCALES[language]):'—'
  const budget=result?.budget
  return <DemoPage id="render-presupuesto">
    <form className="site-form" onSubmit={generate}>
      <div><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={selectImage} disabled={loading} hidden aria-label={t('solutions.renderPresupuesto.upload.selectImage')} /><button className="site-button site-button-secondary" type="button" disabled={loading} onClick={()=>fileInput.current.click()}>{t(image?'solutions.renderPresupuesto.upload.changeImage':'solutions.renderPresupuesto.upload.selectImage')}</button>{image&&<img className="site-upload-preview" src={image} alt={t('solutions.renderPresupuesto.upload.previewAlt')} />}<p className="site-note">{t('solutions.renderPresupuesto.upload.maxSize')}</p></div>
      <div className="site-field"><label htmlFor="render-prompt">{t('solutions.renderPresupuesto.upload.promptLabel')}</label><textarea id="render-prompt" value={prompt} onChange={event=>{setPrompt(event.target.value);setError(null)}} rows={4} required disabled={loading} placeholder={t('solutions.renderPresupuesto.upload.promptPlaceholder')} /></div>
      {error&&<p role="alert" className="site-message is-error">{error}</p>}
      <div className="site-actions"><button className="site-button" type="submit" disabled={loading||!image||!prompt.trim()}>{loading?copy.generating:t('solutions.renderPresupuesto.upload.generate')}</button>{loading&&<button type="button" className="site-button site-button-secondary" onClick={cancel}>{copy.cancel}</button>}</div>
      {loading&&<p role="status">{copy.generating}</p>}<p className="site-note">{copy.serviceNote}</p>
    </form>
    {result&&<section className="site-render-result">
      {budget!=null&&<div><h2>{t('solutions.renderPresupuesto.result.budget')}</h2><p>{typeof budget==='object'?`${amount(budget.min??budget.rangeMin)} – ${amount(budget.max??budget.rangeMax)} €`:`${amount(budget)} €`}</p><p className="site-note">{copy.resultNote}</p></div>}
      {result.editedImageUrl&&<BeforeAfterSlider originalImageUrl={result.originalImageUrl} renderedImageUrl={result.editedImageUrl} />}
    </section>}
  </DemoPage>
}
