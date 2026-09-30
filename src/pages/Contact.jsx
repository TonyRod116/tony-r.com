import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { profile } from '../data/profile'
import { siteContent } from '../data/siteContent'
import { useLanguage } from '../hooks/useLanguage.jsx'
import { trackContactForm } from '../components/GoogleAnalytics'
import SitePage, { PageLink } from '../components/site/SitePage'

export default function Contact() {
  const { t, language } = useLanguage()
  const copy = siteContent[language]
  const [params,setParams] = useSearchParams()
  const intent = params.get('intent')==='recruiter'?'recruiter':'company'
  const solution = params.get('solution') || ''
  const [formData,setFormData] = useState({name:'',email:'',message:''})
  const [submitting,setSubmitting] = useState(false)
  const [status,setStatus] = useState('idle')
  const [error,setError] = useState('')
  const change = event => setFormData(value => ({...value,[event.target.name]:event.target.value}))
  const submit = async event => {
    event.preventDefault()
    if(submitting)return
    const form=event.currentTarget
    setSubmitting(true);setStatus('idle');setError('')
    try {
      const response=await fetch(form.action,{method:form.method,headers:{Accept:'application/json'},body:new FormData(form)})
      const data=(response.headers.get('content-type')||'').includes('application/json')?await response.json():null
      const errors=Array.isArray(data?.errors)&&data.errors.length>0
      if(response.ok&&!errors){setStatus('success');setFormData({name:'',email:'',message:''});trackContactForm()}
      else{setStatus('error');setError(errors?data.errors.map(item=>item.message).join(', '):copy.contact.error)}
    }catch{setStatus('error');setError(copy.contact.error)}
    finally{setSubmitting(false)}
  }
  const setIntent = value => {const next=new URLSearchParams(params);next.set('intent',value);setParams(next,{replace:true})}
  return <SitePage title={copy.contact.title} intro={copy.contact.intro} kicker={copy.contact.kicker}>
    <div className="site-contact">
      <form onSubmit={submit} action="https://formspree.io/f/mvgbjbvw" method="POST" className="site-form">
        <div className="site-field"><label htmlFor="name">{t('contact.form.name')} *</label><input id="name" name="name" autoComplete="name" required value={formData.name} onChange={change} placeholder={t('contact.form.namePlaceholder')} /></div>
        <div className="site-field"><label htmlFor="email">{t('contact.form.email')} *</label><input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={change} placeholder={t('contact.form.emailPlaceholder')} /></div>
        <div className="site-field"><label htmlFor="message">{t('contact.form.message')} *</label><textarea id="message" name="message" required rows={6} value={formData.message} onChange={change} placeholder={copy.contact.placeholder} /></div>
        <details className="site-form-context" open={params.has('intent') || Boolean(solution)}><summary>{copy.contact.context}</summary><fieldset aria-label={copy.contact.context}><label><input type="radio" name="intent" value="company" checked={intent==='company'} onChange={() => setIntent('company')} />{copy.contact.project}</label><label><input type="radio" name="intent" value="recruiter" checked={intent==='recruiter'} onChange={() => setIntent('recruiter')} />{copy.contact.recruiter}</label></fieldset></details>
        <input type="hidden" name="solution" value={solution} />
        {status==='success'&&<p role="status" className="site-message">{copy.contact.sent}</p>}
        {status==='error'&&<p role="alert" className="site-message is-error">{error || copy.contact.error}</p>}
        <button type="submit" className="site-button" disabled={submitting}>{submitting?t('contact.form.sending'):t('contact.form.sendMessage')}</button>
        <p className="site-note">{copy.contact.note}</p>
      </form>
      <aside className="site-contact-aside"><h2>{copy.contact.alternative}</h2><a className="site-contact-email" href={`mailto:${profile.email}`}>{profile.email}</a><p className="site-note">Barcelona</p><div className="site-actions"><PageLink to={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</PageLink><PageLink to={profile.github} target="_blank" rel="noopener noreferrer">GitHub</PageLink></div><div className="site-actions"><PageLink to="/projects">{copy.allProjects}</PageLink><PageLink to="/resume">{copy.cv}</PageLink></div></aside>
    </div>
  </SitePage>
}
