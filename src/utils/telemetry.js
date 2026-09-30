const ROUTES = new Set(['/', '/about', '/projects', '/contact', '/resume', '/ai', '/demos', '/demos/presupuesto-orientativo', '/demos/render-presupuesto', '/demos/lead-qualifier', '/ai/tictactoe', '/ai/minesweeper', '/ai/sixdegrees', '/ai/nim', '/ai/tetris', '/ai/neural-network'])
const FIELDS = {
  page_view: { path: null },
  project_open: { target: ['project', 'hub', 'demo', 'buildapp', 'github_repository'] },
  cv_open: { language: ['en', 'es', 'unknown'] },
  cv_download: { language: ['en', 'es', 'unknown'] },
  social_click: { platform: ['github', 'linkedin'] },
  contact_click: { method: ['email', 'phone', 'page'] },
  contact_success: { method: ['form'] },
  demo_request: { feature: ['lead_qualifier', 'budget', 'render', 'quote'], result: ['success', 'http_error', 'network_error'], duration: ['under_1s', '1_to_5s', 'over_5s'] },
  runtime_error: { path: null },
  unhandled_rejection: { path: null },
}

export function safeRoute(value) {
  const path = String(value || '/').split(/[?#]/)[0].replace(/\/$/, '') || '/'
  return ROUTES.has(path) ? path : '/other'
}

export function recordEvent(name, parameters = {}, { analytics = true } = {}) {
  if (!Object.hasOwn(FIELDS, name) || typeof window === 'undefined') return null
  const filtered = { path: safeRoute(parameters.path || window.location?.pathname) }
  for (const [field, allowed] of Object.entries(FIELDS[name])) {
    if (field === 'path') filtered.path = safeRoute(parameters.path || window.location?.pathname)
    else if (allowed.includes(parameters[field])) filtered[field] = parameters[field]
  }
  const event = { name, parameters: filtered, at: new Date().toISOString() }
  const buffer = Array.isArray(window.__MY_PAGE_DIAGNOSTICS__) ? window.__MY_PAGE_DIAGNOSTICS__ : []
  window.__MY_PAGE_DIAGNOSTICS__ = [...buffer.slice(-49), event]
  try { window.dispatchEvent(new CustomEvent('my-page:telemetry', { detail: event })) } catch { /* Diagnostics must not affect the product. */ }
  try {
    if (analytics) {
      let referrer = ''
      try {
        if (typeof document !== 'undefined' && document.referrer) {
          const url = new URL(document.referrer)
          referrer = `${url.origin}${url.origin === window.location.origin ? safeRoute(url.pathname) : '/'}`
        }
      } catch { /* Invalid referrers are omitted. */ }
      const location = { page_path: filtered.path, page_location: `${window.location.origin || ''}${filtered.path}`, page_referrer: referrer }
      window.gtag?.('event', name, { ...filtered, ...location })
    }
  } catch { /* Analytics blockers must not affect the product. */ }
  return event
}

export function classifyLink(href, origin) {
  try {
    const url = new URL(href, origin)
    if (url.protocol === 'mailto:') return { name: 'contact_click', parameters: { method: 'email' } }
    if (url.protocol === 'tel:') return { name: 'contact_click', parameters: { method: 'phone' } }
    if (!['http:', 'https:'].includes(url.protocol)) return null
    const path = decodeURIComponent(url.pathname)
    if (/\/(?:[^/]*CV[^/]*|Tony_Rodriguez_Solutions_Engineer[^/]*)\.pdf$/i.test(path)) return { name: 'cv_open', parameters: { language: /(?:_|\b)EN(?:_|\b)/i.test(path) ? 'en' : /(?:_|\b)ES(?:_|\b)/i.test(path) ? 'es' : 'unknown' } }
    if (url.hostname === 'github.com') return url.pathname.split('/').filter(Boolean).length > 1 ? { name: 'project_open', parameters: { target: 'github_repository' } } : { name: 'social_click', parameters: { platform: 'github' } }
    if (['linkedin.com', 'www.linkedin.com'].includes(url.hostname)) return { name: 'social_click', parameters: { platform: 'linkedin' } }
    if (['buildapp.es', 'www.buildapp.es', 'pro.buildapp.es'].includes(url.hostname)) return { name: 'project_open', parameters: { target: 'buildapp' } }
    if (url.origin === origin && path.startsWith('/demos')) return { name: 'project_open', parameters: { target: 'demo' } }
    if (url.origin === origin && path === '/projects') return { name: 'project_open', parameters: { target: 'hub' } }
    if (url.origin === origin && path === '/contact') return { name: 'contact_click', parameters: { method: 'page' } }
  } catch { return null }
  return null
}

export function captureRuntimeError(kind = 'runtime_error') {
  return recordEvent(kind, { path: typeof window !== 'undefined' ? window.location?.pathname : '/' }, { analytics: false })
}

export async function observeDemoRequest(feature, operation) {
  const started = Date.now()
  const report = result => recordEvent('demo_request', { feature, result, duration: Date.now() - started < 1000 ? 'under_1s' : Date.now() - started < 5000 ? '1_to_5s' : 'over_5s' }, { analytics: false })
  try { const response = await operation(); report(response.ok ? 'success' : 'http_error'); return response }
  catch (error) { report('network_error'); throw error }
}
