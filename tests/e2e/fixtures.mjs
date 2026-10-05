import { test as base, expect } from '@playwright/test'

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      if (!localStorage.getItem('portfolio-language')) localStorage.setItem('portfolio-language', 'es')
      // Los recorridos parten de un visitante que ya respondió al aviso de analítica; consent.spec.mjs prueba el aviso en sí.
      if (!localStorage.getItem('portfolio-analytics-consent')) localStorage.setItem('portfolio-analytics-consent', 'denied')
      window.__QA_TELEMETRY__ = []
      window.addEventListener('my-page:telemetry', event => window.__QA_TELEMETRY__.push(event.detail))
    })
    await page.route('**/*', route => {
      const url = new URL(route.request().url())
      if (url.hostname === '127.0.0.1' && url.port === '4179') {
        if (url.pathname.startsWith('/api/')) return route.fulfill({ json: url.pathname.includes('leads') ? [] : {} })
        return route.continue()
      }
      // Tests can override individual mocked endpoints; everything else stays offline.
      return route.abort('blockedbyclient')
    })
    await use(page)
  },
})

export { expect }

export function mockJson(route, body, status = 200) {
  const headers = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'Content-Type, Accept' }
  return route.request().method() === 'OPTIONS' ? route.fulfill({ status: 204, headers }) : route.fulfill({ status, headers, json: body })
}
