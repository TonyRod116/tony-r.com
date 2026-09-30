import { test, expect, mockJson } from './fixtures.mjs'

const routes = ['/', '/about', '/projects', '/contact', '/resume', '/ai', '/demos', '/demos/presupuesto-orientativo', '/demos/render-presupuesto', '/demos/lead-qualifier', '/ai/tictactoe', '/ai/minesweeper', '/ai/sixdegrees', '/ai/nim', '/ai/tetris', '/ai/neural-network']

for (const route of routes) test(`built route ${route}`, async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const response = await page.goto(route)
  expect(response.status()).toBe(200)
  if (route === '/ai/tetris') {
    await expect(page.locator('main h1')).toHaveText('T-Tris')
    await expect(page.getByTestId('tetris-board')).toBeVisible()
    await expect(page.getByRole('button', { name: 'IA desactivada', exact: true })).toBeVisible()
  } else await expect(page.locator('main h1, main h2, main canvas').first()).toBeVisible()
  await expect(page.locator('main [role="status"]')).toHaveCount(0)
  await expect(page.locator('main [role="alert"]')).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
  expect(errors).toEqual([])
})

for (const [language, title] of [['es', 'Contacto'], ['en', 'Contact'], ['ca', 'Contacte']]) test(`contact language ${language}`, async ({ page }) => {
  await page.addInitScript(value => localStorage.setItem('portfolio-language', value), language)
  await page.goto('/contact')
  await expect(page.locator('main h1')).toHaveText(title)
  await expect(page.locator('#name')).toBeEditable()
  await page.locator('#name').focus()
  await page.keyboard.press('Tab')
  await expect(page.locator('#email')).toBeFocused()
})

test('contact success is mocked and recorded only after response', async ({ page }) => {
  let sends = 0
  await page.route('https://formspree.io/**', route => { if (route.request().method() === 'POST') sends++; return mockJson(route, { ok: true }) })
  await page.goto('/contact')
  await expect(page.locator('main h1')).toHaveText('Contacto')
  await page.locator('form button[type="submit"]').click()
  expect(sends).toBe(0)
  await page.locator('#name').fill('QA Example')
  await page.locator('#email').fill('qa@example.test')
  await page.locator('#message').fill('Mensaje sintético de QA; no se envía a terceros.')
  await page.locator('form button[type="submit"]').click()
  await expect.poll(() => page.evaluate(() => window.__QA_TELEMETRY__.filter(e => e.name === 'contact_success').length)).toBe(1)
  expect(sends).toBe(1)
  expect(await page.evaluate(() => JSON.stringify(window.__QA_TELEMETRY__))).not.toContain('qa@example.test')
})

test('contact errors do not count as conversion', async ({ page }) => {
  await page.route('https://formspree.io/**', route => mockJson(route, { errors: [{ message: 'Servicio de prueba no disponible' }] }, 503))
  await page.goto('/contact')
  await page.locator('#name').fill('QA Example')
  await page.locator('#email').fill('qa@example.test')
  await page.locator('#message').fill('Error sintético')
  await page.locator('form button[type="submit"]').click()
  await expect(page.getByText('Servicio de prueba no disponible')).toBeVisible()
  expect(await page.evaluate(() => window.__QA_TELEMETRY__.some(e => e.name === 'contact_success'))).toBe(false)
})

test('chat succeeds through the actual BuildApp client contract with a fixture', async ({ page }) => {
  let request
  await page.route('**/api/v1/demo/chat', route => {
    if (route.request().method() === 'POST') request = route.request().postDataJSON()
    return mockJson(route, { content: JSON.stringify({ displayText: 'Respuesta de prueba', state: {}, next_action: 'continue' }) })
  })
  await page.goto('/demos/lead-qualifier')
  await page.locator('textarea').fill('Quiero reformar un baño')
  await page.locator('textarea').locator('..').getByRole('button').click()
  await expect(page.getByText('Respuesta de prueba', { exact: true })).toBeVisible()
  expect(request.language).toBe('es')
  expect(request.messages.at(-1).content).toBe('Quiero reformar un baño')
  expect(await page.evaluate(() => window.__MY_PAGE_DIAGNOSTICS__.some(e => e.name === 'demo_request' && e.parameters.result === 'success'))).toBe(true)
})

test('chat surfaces HTTP failure and allows recovery', async ({ page }) => {
  await page.route('**/api/v1/demo/chat', route => mockJson(route, { error: 'Servicio de prueba no disponible' }, 503))
  await page.goto('/demos/lead-qualifier')
  await page.locator('textarea').fill('Mensaje de prueba')
  await page.locator('textarea').locator('..').getByRole('button').click()
  await expect(page.getByText('Servicio de prueba no disponible')).toBeVisible()
  await expect(page.locator('textarea')).toBeEditable()
  expect(await page.evaluate(() => window.__MY_PAGE_DIAGNOSTICS__.some(e => e.parameters.result === 'http_error'))).toBe(true)
})

test('CV preview opens a real local asset and emits cv_open', async ({ page }) => {
  await page.goto('/resume')
  const button = page.locator('main button').filter({ has: page.locator('img[src*="CVthumb"]') }).first()
  await button.click()
  const frame = page.locator('iframe[src*="Tony_Rodriguez_CV"]')
  await expect(frame).toBeVisible()
  const url = await frame.getAttribute('src')
  expect(new URL(url, page.url()).origin).toBe(new URL(page.url()).origin)
  const response = await page.request.get(url.split('#')[0])
  expect(response.headers()['content-type']).toContain('pdf')
  await expect.poll(() => page.evaluate(() => window.__QA_TELEMETRY__.filter(e => e.name === 'cv_open').length)).toBe(1)
  await page.keyboard.press('Escape')
  await expect(frame).toHaveCount(0)
})

test('page telemetry does not retain query content', async ({ page }) => {
  await page.goto('/contact?email=private@example.test')
  await expect(page.locator('main h1')).toHaveText('Contacto')
  const events = await page.evaluate(() => window.__QA_TELEMETRY__.filter(e => e.name === 'page_view'))
  expect(events).toHaveLength(1)
  expect(events[0].parameters.path).toBe('/contact')
  expect(JSON.stringify(events)).not.toContain('private')
})

test('shared navigation and language switching work with keyboard and touch', async ({ page }, testInfo) => {
  const mobile = testInfo.project.name === 'mobile'
  await page.goto('/')
  if (mobile) await page.getByRole('button', { name: 'Toggle menu' }).click()
  const projects = page.locator('header a[href="/projects"]:visible').first()
  if (mobile) await projects.tap()
  else { await projects.focus(); await page.keyboard.press('Enter') }
  await expect(page).toHaveURL(/\/projects$/)
  await expect(page.locator('main h1')).toBeVisible()
  if (mobile) await page.getByRole('button', { name: 'Toggle menu' }).click()
  await page.getByRole('button', { name: 'ES', exact: true }).click()
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page.locator('main h1')).toContainText('Projects')
})

test('a failed route download preserves navigation and offers recovery', async ({ page }) => {
  await page.route('**/assets/Projects-*.js', route => route.abort('failed'))
  await page.goto('/projects')
  await expect(page.getByRole('alert')).toContainText('No hemos podido cargar esta página')
  await expect(page.getByRole('button', { name: 'Recargar', exact: true })).toBeVisible()
  await expect(page.locator('header')).toBeVisible()
  const menu = page.getByRole('button', { name: 'Toggle menu' })
  if (await menu.isVisible()) await menu.click()
  await page.locator('header a[href="/contact"]:visible').first().click()
  await expect(page.locator('main h1')).toHaveText('Contacto')
  await expect(page.getByRole('alert')).toHaveCount(0)
})
