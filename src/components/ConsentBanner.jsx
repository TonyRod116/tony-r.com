import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage.jsx'
import { readConsent, setConsent, subscribeConsent } from '../utils/analyticsConsent'

// Aviso no modal: no bloquea la web ni roba el foco. Aceptar y rechazar tienen el mismo peso visual.
export default function ConsentBanner() {
  const { t } = useLanguage()
  const [choice, setChoice] = useState(() => readConsent())
  const [reopened, setReopened] = useState(false)
  const region = useRef(null)
  const opener = useRef(null)
  useEffect(() => subscribeConsent(event => {
    if (event.type !== 'open') return
    opener.current = document.activeElement
    setReopened(true)
  }), [])
  useEffect(() => { if (reopened) region.current?.focus() }, [reopened])
  if (choice !== null && !reopened) return null
  const answer = value => {
    setConsent(value)
    setChoice(value)
    setReopened(false)
    const previous = opener.current
    opener.current = null
    if (previous?.isConnected) setTimeout(() => previous.focus(), 0)
  }
  return <section ref={region} tabIndex={-1} className="consent-banner" aria-labelledby="consent-title" data-testid="consent-banner">
    <h2 id="consent-title">{t('consent.title')}</h2>
    <p>{t('consent.text')}</p>
    <div className="consent-actions">
      <button type="button" onClick={() => answer('denied')}>{t('consent.decline')}</button>
      <button type="button" onClick={() => answer('granted')}>{t('consent.accept')}</button>
    </div>
  </section>
}
