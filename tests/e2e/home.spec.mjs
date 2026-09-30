import { test, expect } from './fixtures.mjs'

test('home keeps AI in the main navigation and solutions in the footer', async ({ page }, testInfo) => {
  await page.goto('/')
  if (testInfo.project.name === 'mobile') await page.getByRole('button', { name: 'Toggle menu' }).click()
  const header = page.locator('header')
  const lab = header.getByRole('link', { name: 'Lab de IA', exact: true })
  await expect(lab).toBeVisible()
  await expect(lab).toHaveAttribute('href', '/ai')
  await expect(header.locator('a[href="/demos"]')).toHaveCount(0)
  await expect(header.locator('canvas')).toHaveCount(0)
  const solutions = page.locator('footer').getByRole('link', { name: 'Soluciones', exact: true })
  await expect(solutions).toHaveAttribute('href', '/demos')
  await lab.click()
  await expect(page).toHaveURL(/\/ai$/)
  await expect(page.locator('main h1')).toBeVisible()
  if (testInfo.project.name === 'mobile') await expect(header.getByRole('button', { name: 'ES', exact: true })).not.toBeVisible()
  await page.goto('/')
  await page.locator('footer').getByRole('link', { name: 'Soluciones', exact: true }).click()
  await expect(page).toHaveURL(/\/demos$/)
  await expect(page.locator('main h1')).toBeVisible()
})

test('home puts current work first and the main action explores it', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('main h1')).toHaveText('Tony Rodríguez.')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  const action = page.getByRole('link', { name: 'Explorar mi trabajo', exact: true })
  await expect(action).toHaveAttribute('href', '#work')
  await action.click()
  await expect(page.getByRole('heading', { name: 'BuildApp', exact: true })).toBeVisible()
  const order = await page.locator('main h2').allTextContents()
  expect(order.indexOf('BuildApp')).toBeLessThan(order.indexOf('Antes del software, la obra.'))
  await expect(page.locator('main')).not.toContainText('Repositorios GitHub')
})

test('portrait remains visible after reading the whole page and returning', async ({ page }) => {
  await page.goto('/')
  const portrait = page.getByAltText('Tony Rodríguez', { exact: true })
  await expect(portrait).toBeVisible()
  const initial = await portrait.boundingBox()
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
  await page.waitForTimeout(300)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await expect(portrait).toBeVisible()
  const returned = await portrait.boundingBox()
  expect(Math.abs(returned.y - initial.y)).toBeLessThan(2)
  expect(Math.abs(returned.height - initial.height)).toBeLessThan(2)
})

for (const [language, income] of [['es', 'ya generan ingresos'], ['en', 'already generating income'], ['ca', 'ja generen ingressos']]) test(`showroom copy ${language} preserves the confirmed fact`, async ({ page }) => {
  await page.addInitScript(value => localStorage.setItem('portfolio-language', value), language)
  await page.goto('/')
  await expect(page.locator('main')).toContainText(income)
  await expect(page.locator('html')).toHaveAttribute('lang', language)
  await expect(page.locator('main')).not.toContainText(/rentabilidad garantizada|passive income|busco socios|looking for investors/i)
  await expect(page.locator('main h1')).toHaveText('Tony Rodríguez.')
})

test('reduced motion keeps showroom imagery static and work links readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const portrait = page.getByAltText('Tony Rodríguez', { exact: true })
  await expect(portrait).toBeVisible()
  expect(await portrait.evaluate(element => getComputedStyle(element).transform)).toBe('none')
  await expect(page.getByRole('link', { name: 'Escríbeme', exact: true })).toHaveAttribute('href', /^mailto:/)
})

test('language selector on the home can be opened and used with the keyboard', async ({ page }, testInfo) => {
  await page.goto('/')
  if (testInfo.project.name === 'mobile') await page.getByRole('button', { name: 'Toggle menu' }).click()
  const language = page.getByRole('button', { name: 'ES', exact: true })
  await language.focus()
  await page.keyboard.press('Enter')
  const english = page.getByRole('button', { name: 'EN', exact: true })
  await expect(english).toBeVisible()
  await english.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toContainText('already generating income')
})

test('normal-size showroom links have sufficient contrast on their actual backgrounds', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('main h1')).toHaveText('Tony Rodríguez.')
  const links = await page.locator('.home-showroom a').evaluateAll(elements => elements.map(element => {
    const style = getComputedStyle(element)
    let parent = element, background
    while (parent) {
      const color = getComputedStyle(parent).backgroundColor
      if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') { background = color; break }
      parent = parent.parentElement
    }
    return { text: element.textContent.trim(), color: style.color, background }
  }))
  const luminance = color => {
    const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
  }
  for (const link of links) {
    const foreground = luminance(link.color), background = luminance(link.background)
    const contrast = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)
    expect(contrast, link.text).toBeGreaterThanOrEqual(4.5)
  }
})
