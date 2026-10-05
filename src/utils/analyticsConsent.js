import { recordEvent } from './telemetry.js'

export const CONSENT_KEY = 'portfolio-analytics-consent'
export const MEASUREMENT_ID = 'G-5EC5QCFG7L'
const listeners = new Set()

// 'granted' | 'denied' | null (todavía sin elegir). Sin elección no se carga nada de Google Analytics.
export function readConsent() {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch { return null }
}

export function loadAnalytics() {
  if (typeof window === 'undefined') return
  window[`ga-disable-${MEASUREMENT_ID}`] = false
  if (window.gtag) return
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, { anonymize_ip: true, send_page_view: false })
  if (!document.querySelector('script[data-analytics]')) {
    const script = document.createElement('script')
    script.async = true
    script.dataset.analytics = 'google'
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
    document.head.appendChild(script)
  }
}

// Al retirar el consentimiento se deja de enviar, se desactiva la medición y se borran las cookies de Google Analytics.
export function stopAnalytics() {
  if (typeof window === 'undefined') return
  window[`ga-disable-${MEASUREMENT_ID}`] = true
  delete window.gtag
  try {
    const names = document.cookie.split(';').map(part => part.split('=')[0].trim()).filter(name => name === '_ga' || name === '_gid' || name.startsWith('_ga_') || name.startsWith('_gat'))
    const labels = window.location.hostname.split('.')
    const domains = [undefined, window.location.hostname, ...(labels.length > 2 ? [`.${labels.slice(-2).join('.')}`] : []), `.${window.location.hostname}`]
    for (const name of names) for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`
  } catch { /* Sin acceso a las cookies no hay nada que borrar. */ }
}

export function initAnalytics() {
  if (readConsent() === 'granted') loadAnalytics()
}

export function setConsent(value) {
  if (value !== 'granted' && value !== 'denied') return
  try { window.localStorage.setItem(CONSENT_KEY, value) } catch { /* Sin almacenamiento la elección vale solo para esta sesión. */ }
  if (value === 'granted') {
    loadAnalytics()
    recordEvent('page_view', { path: window.location.pathname })
  } else stopAnalytics()
  listeners.forEach(listener => listener({ type: 'consent', value }))
}

export function openConsentPreferences() {
  listeners.forEach(listener => listener({ type: 'open' }))
}

export function subscribeConsent(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
