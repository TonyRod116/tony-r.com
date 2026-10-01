import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { test, expect } from './fixtures.mjs'

const labPaths = ['/ai', '/ai/neural-network', '/ai/tictactoe', '/ai/minesweeper', '/ai/sixdegrees', '/ai/nim', '/ai/tetris']

test('an unavailable optional easter egg cannot blank the lab or break navigation', async ({ page }, testInfo) => {
  await page.route(/\/assets\/LabEasterEgg-[^/]+\.js$/, route => route.abort('failed'))
  await page.goto('/ai')
  await expect(page.locator('main h1')).toBeVisible()
  await expect(page.locator('.lab-easter')).toHaveCount(0)
  if (testInfo.project.name === 'mobile') await page.getByRole('button', { name: 'Toggle menu' }).click()
  await page.locator('header').getByRole('link', { name: 'Proyectos', exact: true }).click()
  await expect(page).toHaveURL(/\/projects$/)
  await expect(page.locator('main h1')).toBeVisible()
})

test('the easter egg appears only across the seven lab pages and contacts no game service on reveal', async ({ page }) => {
  const external = []
  page.on('request', request => { if (request.url().includes('spritefusion.com')) external.push(request.url()) })
  for (const path of labPaths) {
    await page.goto(path)
    await expect(page.locator('main h1')).toBeVisible()
    await page.getByRole('button', { name: 'No pulses aquí', exact: true }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'Hugo Duprez / Sprite Fusion', exact: true })).toHaveAttribute('href', 'https://www.spritefusion.com/games/destroy-any-website')
    const href = await dialog.getByRole('link', { name: 'Destruir esta página', exact: true }).getAttribute('href')
    expect(new URL(href).searchParams.get('url')).toBe(`https://tony-r.com${path}`)
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'No pulses aquí', exact: true })).toBeFocused()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  for (const path of ['/', '/projects', '/contact']) {
    await page.goto(path)
    await expect(page.locator('.lab-easter')).toHaveCount(0)
  }
  expect(external).toEqual([])
})

for (const [language, trigger, launch] of [
  ['es', 'No pulses aquí', 'Destruir esta página'],
  ['en', 'Don’t press this', 'Destroy this page'],
  ['ca', 'No premis aquí', 'Destruir aquesta pàgina'],
]) test(`the ${language} launcher shares only a public route and keeps the original page intact`, async ({ page }) => {
  await page.addInitScript(value => localStorage.setItem('portfolio-language', value), language)
  await page.context().route('https://destroy.spritefusion.com/**', route => route.fulfill({ contentType: 'text/html', body: '<p>Official game fixture</p>' }))
  await page.goto('/ai/neural-network/?private_token=do-not-share#private-note')
  const button = page.getByRole('button', { name: trigger, exact: true })
  await button.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog'), link = dialog.getByRole('link', { name: launch, exact: true })
  await expect(dialog).toBeVisible()
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  const popupPromise = page.waitForEvent('popup')
  await link.click()
  const popup = await popupPromise
  await popup.waitForLoadState('domcontentloaded')
  const url = new URL(popup.url())
  expect(url.origin).toBe('https://destroy.spritefusion.com')
  expect(url.searchParams.get('url')).toBe('https://tony-r.com/ai/neural-network')
  expect(await popup.evaluate(() => window.opener)).toBeNull()
  expect(await popup.evaluate(() => document.referrer)).toBe('')
  await popup.close()
  await expect(page).toHaveURL(/private_token=do-not-share#private-note$/)
  await expect(page.locator('main h1')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(button).toBeFocused()
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
})

for (const path of ['/ai/', '/ai/neural-network/']) test(`the official viewer prefix renders the actual content of ${path}`, async ({ page }) => {
  const prefix = '/p/https/tony-r.com', build = resolve('.artifacts/build')
  await page.route('https://destroy.spritefusion.com/**', async route => {
    const url = new URL(route.request().url())
    // The game origin's /assets and /models are not My Page's resources.
    if (!url.pathname.startsWith(`${prefix}/`)) return route.fulfill({ status: 404, body: '' })
    let file = url.pathname.slice(prefix.length)
    if (file === path) file = '/index.html'
    const resolved = resolve(build, `.${file}`)
    if (!resolved.startsWith(`${build}/`)) return route.abort()
    const type = file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.json') ? 'application/json' : file.endsWith('.html') ? 'text/html' : undefined
    try {
      let body = await readFile(resolved)
      if (file === '/index.html') body = body.toString().replaceAll('src="/', `src="${prefix}/`).replaceAll('href="/', `href="${prefix}/`)
      return route.fulfill({ body, ...(type ? { contentType: type } : {}) })
    }
    catch { return route.fulfill({ status: 404, body: '' }) }
  })
  await page.goto(`https://destroy.spritefusion.com${prefix}${path}`)
  await expect(page.locator('main h1')).toBeVisible()
  await expect(page.locator('main .ai-lab')).toBeVisible()
  if (path.includes('neural-network')) await expect(page.getByTestId('model-state')).toContainText('Modelo cargado')
  else await expect(page.locator('.ai-hub h1')).toContainText('La inteligencia')
})
