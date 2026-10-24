import { test, expect } from './fixtures.mjs'

test('home keeps AI in the main navigation and solutions in the footer', async ({ page }, testInfo) => {
  await page.goto('/')
  if (testInfo.project.name === 'mobile') await page.getByRole('button', { name: 'Menú', exact: true }).click()
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
  if (testInfo.project.name === 'mobile') await expect(header.getByRole('button', { name: 'Idioma: ES', exact: true })).not.toBeVisible()
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
  const projectLinks=page.locator('.home-feature-copy .home-actions')
  await expect(projectLinks.getByRole('link',{name:'Abrir BuildApp',exact:true})).toHaveAttribute('href','https://buildapp.es/')
  await expect(projectLinks.getByRole('link',{name:'Ver el proyecto',exact:true})).toHaveAttribute('href','/projects')
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

for (const [language, fact] of [['es', 'al primer intento'], ['en', 'on the first attempt'], ['ca', 'al primer intent']]) test(`showroom copy ${language} preserves the confirmed fact`, async ({ page }) => {
  await page.addInitScript(value => localStorage.setItem('portfolio-language', value), language)
  await page.goto('/')
  await expect(page.locator('main')).toContainText(fact)
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
  if (testInfo.project.name === 'mobile') await page.getByRole('button', { name: 'Menú', exact: true }).click()
  const language = page.getByRole('button', { name: 'Idioma: ES', exact: true })
  await language.focus()
  await page.keyboard.press('Enter')
  const english = page.getByRole('button', { name: 'English', exact: true })
  await expect(english).toBeVisible()
  await english.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toContainText('on the first attempt')
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


test('home does not show earnings, payout certificates or income claims', async ({ page }) => {
  const requested = []
  page.on('request', request => { if (/\/payouts\//.test(request.url())) requested.push(request.url()) })
  for (const language of ['es', 'en', 'ca']) {
    await page.addInitScript(value => localStorage.setItem('portfolio-language', value), language)
    await page.goto('/')
    await expect(page.locator('#home-trading')).toBeVisible()
    await expect(page.locator('.home-showroom')).not.toContainText(/payout|justificante|certificat|\bUSD\b|\d[\d.,]*\s?(€|\$)|ingresos|ingressos|income/i)
  }
  expect(requested).toHaveLength(0)
})

test('the construction story links to totalhomes.es from the photo and the caption, safely and in a new tab', async ({ page }) => {
  await page.addInitScript(value => localStorage.setItem('portfolio-language', value), 'es')
  await page.goto('/')
  const links = page.locator('.home-story-photo a')
  await expect(links).toHaveCount(2)
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('href', 'https://www.totalhomes.es/')
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
  await expect(page.getByRole('link', { name: 'Ver más obras en totalhomes.es' })).toBeVisible()
  await expect(page.locator('.home-story-photo-link')).toHaveAttribute('tabindex', '-1')
})
