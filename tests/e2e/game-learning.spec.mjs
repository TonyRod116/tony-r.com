import { test, expect } from './fixtures.mjs'
import { gameLearning, learningCopy } from '../../src/data/gameLearning.js'

for (const language of ['es', 'en', 'ca']) test(`game education has visible actual code and expandable details in ${language}`, async ({ page }) => {
  await page.addInitScript(language => localStorage.setItem('portfolio-language', language), language)
  for (const [id, lesson] of Object.entries(gameLearning)) {
    await page.goto(`/ai/${id}`)
    const panel = page.getByTestId('game-learning')
    await expect(panel).toContainText(lesson.title[language])
    await expect(panel.locator('.ai-learning-code code')).toHaveText(lesson.code)
    const details = panel.locator('details')
    await panel.getByText(learningCopy[language].more, { exact: true }).click()
    await expect(details).toHaveAttribute('open', '')
    await expect(details.locator('code')).toHaveText(lesson.moreCode)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await page.goto('/ai/neural-network')
  await expect(page.getByTestId('game-learning')).toHaveCount(0)
  await expect(page.locator('.ai-method a')).toHaveCount(0)
})

test('Tetris explanations follow the proposal and last actual move without hijacking code keys', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0.66 })
  await page.goto('/ai/tetris')
  await page.getByRole('button', { name: 'Pausar', exact: true }).click()
  const board = page.getByTestId('tetris-board'), position = await board.getAttribute('data-position')
  const summary = page.locator('.ai-learning-details summary')
  await summary.focus(); await page.keyboard.press(' ')
  await expect(page.locator('.ai-learning-details')).toHaveAttribute('open', '')
  await expect(board).toHaveAttribute('data-position', position)
  await expect(board).toHaveAttribute('data-score', '0')
  await page.getByRole('button', { name: 'IA desactivada', exact: true }).click()
  const live = page.getByTestId('learning-live')
  await expect(live).toHaveAttribute('data-mode', 'proposal')
  const values = await live.locator('[data-total]').evaluate(node => ({ immediate: Number(node.dataset.immediate), future: Number(node.dataset.future), total: Number(node.dataset.total) }))
  expect(values.total).toBeCloseTo(values.immediate + 0.6 * values.future, 12)
  await page.getByRole('button', { name: 'IA activada', exact: true }).click()
  await page.locator('.ai-toolbar').getByRole('button', { name: 'Continuar', exact: true }).click()
  await page.getByRole('button', { name: 'Que la IA decida', exact: true }).click()
  await expect(live).toHaveAttribute('data-mode', 'decision')
  await expect(board).toHaveAttribute('data-score', '10')
  await page.getByRole('button', { name: 'Nueva partida', exact: true }).click()
  await expect(live).toHaveAttribute('data-mode', 'waiting')
})

test('Minesweeper displays the actual safe constraint and clears it on reset', async ({ page }) => {
  await page.addInitScript(() => {
    // Both possible row/column alignments yield eight distinct cells.
    const mines = [[1,0],[4,4],[4,5],[5,4],[5,5],[6,6],[7,5],[7,7]]
    const values = mines.flatMap(([row,col]) => [(row + 0.1) / 8, (col + 0.1) / 8]); let index = 0
    Math.random = () => values[index++ % values.length]
  })
  await page.goto('/ai/minesweeper')
  const cells = page.locator('.ai-mines-board .ai-cell')
  await cells.nth(0).click(); await cells.nth(1).click()
  const solve = page.getByRole('button', { name: /Resolver.*IA|IA.*Resolver/ })
  await expect(solve).toBeEnabled(); await solve.click()
  const live = page.getByTestId('learning-live')
  await expect(live).toHaveAttribute('data-mode', 'decision')
  const safe = await live.locator('[data-safe-cell]').getAttribute('data-safe-cell')
  await expect(live.locator('[data-constraint-count]')).toHaveAttribute('data-constraint-count', '0')
  const members = (await live.locator('[data-constraint-cells]').getAttribute('data-constraint-cells')).split('|')
  expect(members).toContain(safe)
  const [row, col] = safe.split(',').map(Number)
  await expect(cells.nth(row * 8 + col)).toHaveClass(/bg-gray-600/)
  await expect(cells.nth(row * 8 + col)).not.toContainText('💣')
  await page.getByRole('button', { name: 'Nuevo juego', exact: true }).click()
  await expect(live).toHaveAttribute('data-mode', 'waiting')
})

test('Six Degrees educational values belong to the current shortest path', async ({ page }) => {
  await page.goto('/ai/sixdegrees')
  await expect(page.getByTestId('catalog-state')).toHaveAttribute('data-state', 'ready', { timeout: 45000 })
  await page.getByRole('button', { name: 'Kevin Bacon → Tom Hanks', exact: true }).click()
  await page.getByRole('button', { name: 'Encontrar conexión', exact: true }).click()
  const live = page.getByTestId('learning-live')
  await expect(live).toHaveAttribute('data-mode', 'result')
  await expect(live).toContainText('Kevin Bacon → Tom Hanks')
  await expect(live.locator('dd').first()).toHaveText('1')
  expect(Number((await live.locator('dd').nth(1).textContent()).replaceAll('.', ''))).toBeGreaterThan(1)
  await page.locator('#graph-source').fill('Otro nombre')
  await expect(live).toHaveCount(0)
})
