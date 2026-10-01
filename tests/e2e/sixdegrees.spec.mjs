import { test, expect } from './fixtures.mjs'

async function ready(page) {
  await page.goto('/ai/sixdegrees')
  await expect(page.getByTestId('catalog-state')).toHaveAttribute('data-state', 'ready', { timeout: 45000 })
  await expect(page.locator('.degrees-counts')).toContainText('1.044.499')
}

test('complete catalogue finds misspelled names and a real shared-film connection', async ({ page }) => {
  await ready(page)
  await page.locator('#graph-source').fill('Leonrado DiCaprio')
  await expect(page.getByRole('option', { name: /Leonardo DiCaprio/ })).toBeVisible({ timeout: 10000 })
  await page.locator('#graph-source').press('ArrowDown')
  await page.locator('#graph-source').press('Enter')
  await expect(page.locator('#graph-source')).toHaveValue('Leonardo DiCaprio')
  await page.locator('#graph-target').fill('Margot Robbie')
  await expect(page.locator('.degrees-input-note').last()).toContainText('Seleccionado: Margot Robbie')
  await page.getByRole('button', { name: 'Encontrar conexión', exact: true }).click()
  await expect(page.locator('.degrees-result')).toContainText('The Wolf of Wall Street')
  await expect(page.locator('.degrees-result')).toContainText('1 grado de separación')
  await expect(page.locator('.degrees-result a')).toHaveAttribute('href', 'https://www.imdb.com/title/tt0993846/')
  await page.locator('#graph-source').fill('Scarlet Johanson')
  await expect(page.locator('.degrees-result')).toHaveCount(0)
  await expect(page.getByRole('option', { name: /^Scarlett Johansson/ })).toBeVisible({ timeout: 10000 })
  await expect(page.getByRole('option', { name: /^Scarlett Johansson/ })).toContainText('Coincidencia aproximada')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('duplicate names are distinguishable and examples select the actual artist identity', async ({ page }) => {
  await ready(page)
  await page.locator('#graph-source').fill('Kevin Bacon')
  await expect(page.getByRole('option', { name: /Kevin Bacon/ }).first()).toContainText('1958')
  await expect(page.getByRole('option', { name: /Kevin Bacon/ })).toHaveCount(3)
  await page.getByRole('button', { name: 'Kevin Bacon → Tom Hanks', exact: true }).click()
  await expect(page.locator('#graph-source')).toHaveValue('Kevin Bacon')
  await expect(page.locator('.degrees-input-note').first()).toContainText('1958')
  await page.getByRole('button', { name: 'Encontrar conexión', exact: true }).click()
  await expect(page.locator('.degrees-result')).toContainText('Apollo 13')
  await page.locator('#graph-source').fill('zzzzunfindableqa')
  await expect(page.locator('.degrees-result')).toHaveCount(0)
  await expect(page.locator('.degrees-input-note').first()).toContainText('No hay coincidencias', { timeout: 10000 })
})

test('failed data loading is visible and a retry loads the full catalogue rather than a small fallback', async ({ page }) => {
  await page.route('**/demos-data/degrees/manifest.json', route => route.fulfill({ status: 503, body: '' }))
  await page.goto('/ai/sixdegrees')
  await expect(page.getByTestId('catalog-state')).toHaveAttribute('data-state', 'error')
  await expect(page.locator('#graph-source')).toBeDisabled()
  await page.unroute('**/demos-data/degrees/manifest.json')
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click()
  await expect(page.getByTestId('catalog-state')).toHaveAttribute('data-state', 'ready', { timeout: 45000 })
  await expect(page.locator('.degrees-counts')).toContainText('1.044.499')
})
