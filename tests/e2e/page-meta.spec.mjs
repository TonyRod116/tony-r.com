import { test, expect } from './fixtures.mjs'

const head = page => page.evaluate(() => ({
  description: document.querySelector('meta[name="description"]')?.content ?? null,
  robots: document.querySelector('meta[name="robots"]')?.content ?? null,
  canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
}))

test('every route sets its own title, description and canonical address', async ({ page }) => {
  for (const [path, title, canonical] of [
    ['/', 'Tony Rodríguez | BuildApp, producto y software', 'https://tony-r.com/'],
    ['/projects', 'Proyectos | Tony Rodríguez', 'https://tony-r.com/projects'],
    ['/demos/lead-qualifier', 'Una consulta, con contexto | Tony Rodríguez', 'https://tony-r.com/demos/lead-qualifier'],
    ['/ai/tetris', 'T-Tris · Lab de IA | Tony Rodríguez', 'https://tony-r.com/ai/tetris'],
  ]) {
    await page.goto(path)
    await expect(page.locator('main h1')).toBeVisible()
    await expect(page).toHaveTitle(title)
    const meta = await head(page)
    expect(meta.robots).toBe('index, follow')
    expect(meta.canonical).toBe(canonical)
    expect(meta.description.length).toBeGreaterThan(40)
  }
})

for (const [language, title, description] of [
  ['en', 'Projects | Tony Rodríguez', 'BuildApp Pro and other projects: the problem each one solved'],
  ['ca', 'Projectes | Tony Rodríguez', 'BuildApp Pro i altres projectes: quin problema resolia cadascun'],
]) test(`the title and description follow the selected language (${language})`, async ({ page }) => {
  await page.addInitScript(value => localStorage.setItem('portfolio-language', value), language)
  await page.goto('/projects')
  await expect(page).toHaveTitle(title)
  expect((await head(page)).description).toContain(description)
})

test('an unknown address shows a friendly 404 that is not indexed and recovers on navigation', async ({ page }) => {
  await page.goto('/nope')
  await expect(page.locator('main h1')).toHaveText('No encuentro esta página.')
  await expect(page).toHaveTitle('Página no encontrada | Tony Rodríguez')
  expect(await head(page)).toMatchObject({ robots: 'noindex, follow', canonical: null })
  await page.getByRole('link', { name: 'Volver al inicio' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page).toHaveTitle('Tony Rodríguez | BuildApp, producto y software')
  expect(await head(page)).toMatchObject({ robots: 'index, follow', canonical: 'https://tony-r.com/' })
})

test('addresses named like inherited object properties show the 404 instead of blanking the app', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(String(error)))
  for (const path of ['/ai/constructor', '/demos/toString', '/ai/__proto__']) {
    await page.goto(path)
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.locator('main h1')).toHaveText('No encuentro esta página.')
    expect((await head(page)).robots).toBe('noindex, follow')
  }
  expect(errors).toEqual([])
})

test('the router ignores letter case, so the metadata describes the real page', async ({ page }) => {
  await page.goto('/Projects')
  await expect(page.locator('main h1')).toHaveText('Proyectos.')
  await expect(page).toHaveTitle('Proyectos | Tony Rodríguez')
  expect(await head(page)).toMatchObject({ robots: 'index, follow', canonical: 'https://tony-r.com/projects' })
})

test('navigation exposes the current page and the mobile menu state to assistive technology', async ({ page }, testInfo) => {
  await page.goto('/projects')
  await expect(page.locator('main h1')).toBeVisible()
  if (testInfo.project.name === 'mobile') {
    const menu = page.getByRole('button', { name: 'Menú', exact: true })
    await expect(menu).toHaveAttribute('aria-expanded', 'false')
    await menu.click()
    await expect(menu).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('.site-mobile-panel a[aria-current="page"]')).toHaveText('Proyectos')
  } else {
    await expect(page.locator('header nav a[aria-current="page"]')).toHaveText('Proyectos')
    // Dentro de un experimento, "Lab de IA" se marca como sección actual ("true"), no como la página exacta.
    await page.goto('/ai/tetris')
    await expect(page.locator('main h1')).toBeVisible()
    await expect(page.locator('header nav a[aria-current="true"]')).toHaveText('Lab de IA')
  }
})
