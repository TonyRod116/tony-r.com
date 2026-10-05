import { test, expect } from './fixtures.mjs'

const KEY = 'portfolio-analytics-consent'

// Parte de un visitante nuevo: el fixture marca "rechazado" por defecto, así que se borra una sola vez por sesión.
async function firstVisit(page) {
  await page.addInitScript(key => {
    if (!sessionStorage.getItem('consent-test-reset')) {
      localStorage.removeItem(key)
      sessionStorage.setItem('consent-test-reset', '1')
    }
  }, KEY)
  const googleRequests = []
  page.on('request', request => { if (request.url().includes('googletagmanager.com')) googleRequests.push(request.url()) })
  return googleRequests
}
const stored = page => page.evaluate(key => localStorage.getItem(key), KEY)
const hasGtag = page => page.evaluate(() => typeof window.gtag === 'function')

test('a new visitor is asked first and nothing from Google Analytics is requested until they accept', async ({ page }) => {
  const googleRequests = await firstVisit(page)
  await page.goto('/')
  const banner = page.getByRole('region', { name: 'Analítica de visitas' })
  await expect(banner).toBeVisible()
  await expect(banner).toContainText('Google Analytics')
  await expect(banner.getByRole('button', { name: 'Aceptar', exact: true })).toBeVisible()
  await expect(banner.getByRole('button', { name: 'Rechazar', exact: true })).toBeVisible()
  await page.waitForTimeout(500)
  expect(googleRequests).toEqual([])
  expect(await hasGtag(page)).toBe(false)
  expect(await stored(page)).toBeNull()
})

test('declining keeps analytics off, is remembered, and the footer link lets the visitor change their mind', async ({ page }) => {
  const googleRequests = await firstVisit(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Rechazar', exact: true }).click()
  await expect(page.getByTestId('consent-banner')).toHaveCount(0)
  expect(await stored(page)).toBe('denied')
  await page.reload()
  await expect(page.locator('main h1')).toBeVisible()
  await expect(page.getByTestId('consent-banner')).toHaveCount(0)
  expect(await hasGtag(page)).toBe(false)
  expect(googleRequests).toEqual([])
  const footerLink = page.getByRole('button', { name: 'Cookies', exact: true })
  await footerLink.click()
  const banner = page.getByRole('region', { name: 'Analítica de visitas' })
  await expect(banner).toBeVisible()
  await expect(banner).toBeFocused()
  await banner.getByRole('button', { name: 'Rechazar', exact: true }).click()
  await expect(page.getByTestId('consent-banner')).toHaveCount(0)
  await expect(footerLink).toBeFocused()
})

test('accepting loads analytics, reports the current page, and is restored on the next visit', async ({ page }) => {
  const googleRequests = await firstVisit(page)
  await page.goto('/projects')
  await page.getByRole('button', { name: 'Aceptar', exact: true }).click()
  await expect(page.getByTestId('consent-banner')).toHaveCount(0)
  expect(await stored(page)).toBe('granted')
  await expect.poll(() => googleRequests.length).toBe(1)
  expect(googleRequests[0]).toContain('id=G-5EC5QCFG7L')
  expect(await hasGtag(page)).toBe(true)
  const view = await page.evaluate(() => window.dataLayer.find(entry => entry[0] === 'event' && entry[1] === 'page_view'))
  expect(view[2]).toMatchObject({ page_path: '/projects' })
  await page.reload()
  await expect(page.locator('main h1')).toBeVisible()
  await expect(page.getByTestId('consent-banner')).toHaveCount(0)
  expect(await hasGtag(page)).toBe(true)
  await expect.poll(() => googleRequests.length).toBe(2)
})

test('withdrawing consent stops reporting and removes the analytics cookies', async ({ page }) => {
  await firstVisit(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Aceptar', exact: true }).click()
  await page.evaluate(() => { document.cookie = '_ga=GA1.1.123; path=/'; document.cookie = '_ga_G5EC5QCFG7L=GS1.1.1; path=/'; document.cookie = 'keep=1; path=/' })
  await page.getByRole('button', { name: 'Cookies', exact: true }).click()
  await page.getByRole('region', { name: 'Analítica de visitas' }).getByRole('button', { name: 'Rechazar', exact: true }).click()
  expect(await stored(page)).toBe('denied')
  expect(await hasGtag(page)).toBe(false)
  const cookies = await page.evaluate(() => document.cookie)
  expect(cookies).not.toContain('_ga')
  expect(cookies).toContain('keep=1')
})

test('the notice is usable on every screen: reachable buttons, at least 44px tall, nothing outside the viewport', async ({ page }) => {
  await firstVisit(page)
  await page.goto('/')
  const banner = page.getByTestId('consent-banner')
  await expect(banner).toBeVisible()
  const viewport = page.viewportSize()
  const box = await banner.boundingBox()
  expect(box.x).toBeGreaterThanOrEqual(0)
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 0.5)
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 0.5)
  for (const name of ['Aceptar', 'Rechazar']) expect((await banner.getByRole('button', { name, exact: true }).boundingBox()).height).toBeGreaterThanOrEqual(44)
  await page.keyboard.press('Tab')
  await expect(page.locator(':focus')).toBeVisible()
})

for (const [language, title, decline] of [['en', 'Visit analytics', 'Decline'], ['ca', 'Analítica de visites', 'Rebutjar']]) test(`the notice follows the selected language (${language})`, async ({ page }) => {
  await page.addInitScript(([key, value]) => { localStorage.setItem('portfolio-language', value); if (!sessionStorage.getItem('c')) { localStorage.removeItem(key); sessionStorage.setItem('c', '1') } }, [KEY, language])
  await page.goto('/')
  const banner = page.getByRole('region', { name: title })
  await expect(banner).toBeVisible()
  await banner.getByRole('button', { name: decline, exact: true }).click()
  await expect(banner).toHaveCount(0)
})
