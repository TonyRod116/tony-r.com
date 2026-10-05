import test from 'node:test'
import assert from 'node:assert/strict'

function environment({ cookie = '_ga=GA1.2.3; _ga_ABC123=GS1.1.2; sessionid=keep' } = {}) {
  const store = new Map(), writes = [], scripts = []
  globalThis.window = {
    localStorage: { getItem: key => (store.has(key) ? store.get(key) : null), setItem: (key, value) => store.set(key, String(value)) },
    location: { hostname: 'www.tony-r.com', pathname: '/projects', origin: 'https://www.tony-r.com' },
    dispatchEvent: () => {},
  }
  globalThis.document = {
    referrer: '',
    head: { appendChild: node => scripts.push(node) },
    querySelector: selector => (selector === 'script[data-analytics]' ? scripts[0] || null : null),
    createElement: () => ({ dataset: {} }),
    get cookie() { return cookie },
    set cookie(value) { writes.push(value) },
  }
  return { store, writes, scripts }
}
const load = () => import(`../../src/utils/analyticsConsent.js?${Math.random()}`)

test('without a stored choice nothing from Google is loaded, and invalid stored values are ignored', async () => {
  const { scripts, store } = environment()
  const consent = await load()
  assert.equal(consent.readConsent(), null)
  consent.initAnalytics()
  assert.equal(scripts.length, 0)
  assert.equal(window.gtag, undefined)
  store.set(consent.CONSENT_KEY, 'maybe')
  assert.equal(consent.readConsent(), null)
  store.set(consent.CONSENT_KEY, 'denied')
  consent.initAnalytics()
  assert.equal(scripts.length, 0)
})

test('accepting loads Google Analytics once with anonymised IP and sends the current page view', async () => {
  const { scripts, store } = environment()
  const consent = await load()
  consent.setConsent('granted')
  assert.equal(store.get(consent.CONSENT_KEY), 'granted')
  assert.equal(scripts.length, 1)
  assert.equal(scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${consent.MEASUREMENT_ID}`)
  assert.equal(typeof window.gtag, 'function')
  const config = window.dataLayer.find(entry => entry[0] === 'config')
  assert.deepEqual(config[2], { anonymize_ip: true, send_page_view: false })
  const views = window.dataLayer.filter(entry => entry[0] === 'event' && entry[1] === 'page_view')
  assert.equal(views.length, 1)
  assert.equal(views[0][2].page_path, '/projects')
  consent.setConsent('granted')
  assert.equal(scripts.length, 1, 'the script is never added twice')
})

test('a stored acceptance is restored on the next visit', async () => {
  const { scripts, store } = environment()
  const consent = await load()
  store.set(consent.CONSENT_KEY, 'granted')
  consent.initAnalytics()
  assert.equal(scripts.length, 1)
  assert.equal(typeof window.gtag, 'function')
})

test('withdrawing consent stops sending, disables measurement and expires only the Google cookies', async () => {
  const { writes } = environment()
  const consent = await load()
  consent.setConsent('granted')
  consent.setConsent('denied')
  assert.equal(window.gtag, undefined)
  assert.equal(window[`ga-disable-${consent.MEASUREMENT_ID}`], true)
  const expired = writes.map(entry => entry.split('=')[0])
  assert.ok(expired.includes('_ga') && expired.includes('_ga_ABC123'))
  assert.ok(!expired.includes('sessionid'))
  assert.ok(writes.every(entry => entry.includes('Max-Age=0')))
  assert.ok(writes.some(entry => entry.includes('domain=.tony-r.com')), 'the parent domain is covered too')
  const before = window.dataLayer.length
  consent.setConsent('denied')
  assert.equal(window.dataLayer.length, before)
})

test('accepting again after declining re-enables the existing script', async () => {
  const { scripts } = environment()
  const consent = await load()
  consent.setConsent('granted')
  consent.setConsent('denied')
  consent.setConsent('granted')
  assert.equal(scripts.length, 1)
  assert.equal(window[`ga-disable-${consent.MEASUREMENT_ID}`], false)
  assert.equal(typeof window.gtag, 'function')
})

test('listeners hear choices and requests to reopen the preferences, and can unsubscribe', async () => {
  environment()
  const consent = await load()
  const seen = []
  const stop = consent.subscribeConsent(event => seen.push(event))
  consent.setConsent('denied')
  consent.openConsentPreferences()
  stop()
  consent.openConsentPreferences()
  assert.deepEqual(seen, [{ type: 'consent', value: 'denied' }, { type: 'open' }])
  consent.setConsent('nonsense')
  assert.equal(seen.length, 2)
})
