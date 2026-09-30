import { test, expect } from './fixtures.mjs'
import { experiments } from '../../src/data/aiExperiments.js'

for (const language of ['es','en','ca']) test(`all AI experiments share layout and language ${language}`, async ({ page }) => {
  await page.addInitScript(value => localStorage.setItem('portfolio-language',value),language)
  for (const experiment of experiments) {
    await page.goto(`/ai/${experiment.id}`)
    await expect(page.locator('main h1')).toHaveText(experiment.title[language])
    await expect(page.locator('.ai-tabs a[aria-current="page"]')).toHaveAttribute('href',`/ai/${experiment.id}`)
    await expect(page.locator('.ai-tabs a')).toHaveCount(6)
    await expect(page.locator('.ai-tabs a[aria-current="page"]')).toBeInViewport()
    await expect(page.locator('.ai-method')).toContainText(experiment.method[language])
    expect(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  }
  await page.locator('.ai-back').click();await expect(page).toHaveURL(/\/ai$/)
  await expect(page.locator('.ai-featured')).toHaveAttribute('href','/ai/neural-network')
  await expect(page.locator('.ai-catalog-item')).toHaveCount(5)
})

test('neural model loads locally, gives real probabilities and clears without a prediction', async ({ page }) => {
  await page.goto('/ai/neural-network')
  await expect(page.getByTestId('model-state')).toContainText('Modelo cargado')
  await page.locator('.ai-samples').getByRole('button',{name:'7',exact:true}).click()
  await expect(page.getByTestId('predicted-digit')).toBeVisible()
  const probabilities=await page.locator('[data-probability]').evaluateAll(elements => elements.map(e=>Number(e.dataset.probability)))
  expect(probabilities).toHaveLength(10);expect(probabilities.every(v=>Number.isFinite(v)&&v>=0&&v<=1)).toBe(true)
  expect(probabilities.reduce((a,b)=>a+b,0)).toBeCloseTo(1,8)
  expect(await page.locator('.ai-network-diagram circle').count()).toBe(986)
  await page.getByRole('button',{name:'Limpiar',exact:true}).click()
  await expect(page.getByTestId('predicted-digit')).toHaveCount(0)
  await expect(page).toHaveURL(/\/ai\/neural-network$/)
})

test('neural load failure never returns random predictions and retry recovers', async ({ page }) => {
  let fail=true
  await page.route('**/models/mnist/*.json',route => fail ? route.fulfill({status:503,body:'Unavailable'}) : route.continue())
  await page.goto('/ai/neural-network')
  await expect(page.getByTestId('model-state')).toContainText('No se pudo cargar')
  await page.locator('.ai-samples').getByRole('button',{name:'1',exact:true}).click()
  await expect(page.getByTestId('predicted-digit')).toHaveCount(0)
  fail=false;await page.getByRole('button',{name:'Reintentar',exact:true}).click()
  await expect(page.getByTestId('model-state')).toContainText('Modelo cargado')
  await expect(page.getByTestId('predicted-digit')).toBeVisible()
})

test('scaled drawing canvas accepts mouse and touch and erases', async ({ page },testInfo) => {
  await page.goto('/ai/neural-network')
  await expect(page.getByTestId('model-state')).toContainText('Modelo cargado')
  const canvas=page.locator('.ai-drawing-canvas')
  await canvas.evaluate(element => { element.style.width='140px' })
  await canvas.scrollIntoViewIfNeeded();const box=await canvas.boundingBox()
  if(testInfo.project.name==='mobile') await page.touchscreen.tap(box.x+70,box.y+70)
  else { await page.mouse.move(box.x+70,box.y+30);await page.mouse.down();await page.mouse.move(box.x+70,box.y+100,{steps:6});await page.mouse.up() }
  await expect(page.getByTestId('predicted-digit')).toBeVisible()
  const center=await canvas.evaluate(element => {const ctx=element.getContext('2d');return ctx.getImageData(140,140,1,1).data[0]})
  expect(center).toBeGreaterThan(0)
  await page.getByRole('button',{name:'Limpiar',exact:true}).click()
  await expect(page.getByTestId('predicted-digit')).toHaveCount(0)
})

test('network view works by keyboard and returns to its initial angle', async ({ page }) => {
  await page.goto('/ai/neural-network')
  const angle=page.getByLabel('Ángulo de la vista')
  await angle.focus();await page.keyboard.press('ArrowRight');await expect(angle).toHaveValue('29')
  await page.getByRole('button',{name:'Restablecer vista',exact:true}).click();await expect(angle).toHaveValue('28')
})

test('Tetris pause freezes gravity and AI, and resume keeps the same game', async ({ page }) => {
  await page.goto('/ai/tetris')
  const board=page.getByTestId('tetris-board')
  await page.getByRole('button',{name:'IA desactivada',exact:true}).click()
  await page.getByRole('button',{name:'Pausar',exact:true}).click()
  const position=await board.getAttribute('data-position')
  await page.waitForTimeout(1200)
  await expect(board).toHaveAttribute('data-position',position)
  await expect(page.getByRole('button',{name:'Aplicar jugada de IA',exact:true})).toBeDisabled()
  await page.getByRole('button',{name:'Continuar',exact:true}).first().click()
  await board.focus();await page.keyboard.press('ArrowLeft')
  await expect(board).not.toHaveAttribute('data-position',position)
})

test('Tetris keyboard drop, AI placement and restart use valid settled pieces', async ({ page }) => {
  await page.goto('/ai/tetris')
  const board=page.getByTestId('tetris-board')
  await board.focus();await page.keyboard.press(' ')
  await expect(board).toHaveAttribute('data-score','10')
  expect(await board.locator('[data-settled]:not([data-settled=""])').count()).toBeGreaterThanOrEqual(4)
  await page.getByRole('button',{name:'IA desactivada',exact:true}).click()
  await page.getByRole('button',{name:'Aplicar jugada de IA',exact:true}).click()
  await expect(board).toHaveAttribute('data-score',/^(20|120|220|320|420)$/)
  await page.getByRole('button',{name:'Nueva partida',exact:true}).click()
  await expect(board).toHaveAttribute('data-score','0')
  await expect(board.locator('[data-settled]:not([data-settled=""])')).toHaveCount(0)
  await expect(page.locator('[data-preview-filled="true"]')).toHaveCount(await page.locator('.ai-tetris-preview').getAttribute('aria-label').then(label=>label.endsWith(': T')?5:4))
})

test('Tetris game shortcuts do not hijack header or toolbar keyboard actions', async ({ page }) => {
  await page.goto('/ai/tetris')
  await page.getByRole('button',{name:'Pausar',exact:true}).click()
  const board=page.getByTestId('tetris-board'),position=await board.getAttribute('data-position')
  const music=page.getByRole('button',{name:'Música',exact:true})
  await music.focus();await page.keyboard.press(' ')
  await expect(board).toHaveAttribute('data-position',position)
  await expect(board).toHaveAttribute('data-paused','true')
})

test('tic-tac-toe locks the opponent turn and reset cancels its old reply', async ({ page }) => {
  await page.goto('/ai/tictactoe')
  const cells=page.locator('.ai-cell')
  await cells.first().click()
  await expect(cells.nth(1)).toBeDisabled()
  await page.getByRole('button',{name:'Nuevo Juego',exact:true}).click()
  await page.waitForTimeout(700)
  expect((await cells.allTextContents()).join('').trim()).toBe('')
})

test('Minesweeper flag mode works by touch and removes the flag', async ({ page }) => {
  await page.goto('/ai/minesweeper')
  await page.getByRole('button',{name:'Marcar banderas',exact:true}).click()
  const cell=page.locator('.ai-mines-board .ai-cell').first()
  await cell.click();await expect(cell).toContainText('🚩')
  await cell.click();await expect(cell).not.toContainText('🚩')
})

test('Nim reset cancels a pending opponent move', async ({ page }) => {
  await page.goto('/ai/nim')
  await page.getByRole('button',{name:'Retirar 1 · Montón 1',exact:true}).click()
  await page.getByRole('button',{name:'Nuevo Juego',exact:true}).click()
  await page.waitForTimeout(1200)
  await expect(page.locator('.ai-nim-piles > div > div')).toHaveText(['1','3','5','7'])
})

test('Six Degrees exposes examples, trims input, reports errors and finds a sample path', async ({ page }) => {
  await page.goto('/ai/sixdegrees')
  await page.getByRole('button',{name:'Kevin Bacon → Tom Hanks',exact:true}).click()
  await page.locator('#graph-source').fill(' Kevin Bacon ')
  await page.getByRole('button',{name:'Encontrar Camino',exact:true}).click()
  await expect(page.getByText('¡Encontrado!',{exact:false})).toBeVisible()
  await page.locator('#graph-source').fill('Unknown QA name')
  await page.getByRole('button',{name:'Encontrar Camino',exact:true}).click()
  await expect(page.getByText('No está en el conjunto de muestra: Unknown QA name',{exact:true})).toBeVisible()
})

test('old neural URL leads to the integrated visualization', async ({ page }) => {
  await page.goto('/neural-network.html')
  await expect(page).toHaveURL(/\/ai\/neural-network$/)
  await expect(page.locator('main h1')).toHaveText('Red neuronal')
})

test('Nim trains the expert locally and re-enables play when complete', async ({ page }) => {
  await page.goto('/ai/nim')
  await expect(page.locator('.ai-help').first()).toContainText('pierde')
  await page.getByRole('button',{name:'IA Experta (10,000 juegos)',exact:true}).click()
  await expect(page.locator('.ai-pile-move').first()).toBeDisabled()
  await expect(page.locator('.ai-pile-move').first()).toBeEnabled({timeout:15000})
})

test('Six Degrees uses verified film edges to find a multi-step path', async ({ page }) => {
  await page.goto('/ai/sixdegrees')
  await page.locator('#graph-source').fill('Tom Cruise');await page.locator('#graph-target').fill('Helen Hunt')
  await page.getByRole('button',{name:'Encontrar Camino',exact:true}).click()
  await expect(page.getByText('¡Encontrado! 3 grados de separación.',{exact:true})).toBeVisible()
  await expect(page.locator('.ai-stage a[href="https://www.sonypictures.com/movies/afewgoodmen"]')).toBeVisible()
  await expect(page.locator('.ai-stage a[href="https://amblin.com/movie/cast-away/"]')).toBeVisible()
})
