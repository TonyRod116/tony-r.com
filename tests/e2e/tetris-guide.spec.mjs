import { test, expect } from './fixtures.mjs'
import { tetrisSpecials } from '../../src/data/tetrisSpecials.js'
import { labCopy } from '../../src/data/aiExperiments.js'

test('special pieces opens all three rules and exclusions survive new games and reload',async({page})=>{
  await page.addInitScript(()=>{Math.random=()=>0.95})
  await page.goto('/ai/tetris');await page.getByRole('button',{name:'Pausar',exact:true}).click()
  const menu=page.getByRole('button',{name:'Piezas especiales',exact:true}),board=page.getByTestId('tetris-board')
  await expect(menu).toHaveAttribute('aria-expanded','false');await menu.click();await expect(menu).toHaveAttribute('aria-expanded','true')
  const cards=page.locator('.ai-tetris-special-toggle');await expect(cards).toHaveCount(3)
  for(const name of ['T mágica','Cristal','Taladro']){const card=page.getByRole('button',{name,exact:true});await expect(card).toHaveAttribute('aria-pressed','true');await card.click();await expect(card).toHaveAttribute('aria-pressed','false')}
  await expect(board).toHaveAttribute('data-piece-name','T');await expect(board).toHaveAttribute('data-score','0')
  await expect(board).toHaveAttribute('data-next','I');await expect(board).toHaveAttribute('data-following','I')
  await expect(page.locator('.ai-tetris-specials button')).toHaveCount(3)
  await expect(page.getByRole('button',{name:/Empezar con|Start with|Començar amb/i})).toHaveCount(0)
  await page.getByRole('button',{name:'Nueva partida',exact:true}).click()
  await expect(board).toHaveAttribute('data-piece-name','I');await expect(board).toHaveAttribute('data-next','I')
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('tetris_special_pieces')))).toEqual({T:false,C:false,D:false})
  await page.reload();await expect(board).toHaveAttribute('data-piece-name','I');await expect(board).toHaveAttribute('data-following','I')
})

test('special piece cards work by keyboard without dropping or resetting the active piece',async({page})=>{
  await page.addInitScript(()=>{Math.random=()=>0.58})
  await page.goto('/ai/tetris');await page.getByRole('button',{name:'Pausar',exact:true}).click()
  const board=page.getByTestId('tetris-board'),position=await board.getAttribute('data-position')
  const menu=page.getByRole('button',{name:'Piezas especiales',exact:true});await menu.focus();await page.keyboard.press(' ')
  await expect(menu).toHaveAttribute('aria-expanded','true')
  const card=page.getByRole('button',{name:'Cristal',exact:true});await card.focus();await page.keyboard.press(' ')
  await expect(card).toHaveAttribute('aria-pressed','false');await expect(board).toHaveAttribute('data-position',position);await expect(board).toHaveAttribute('data-score','0')
  await expect(board).not.toHaveAttribute('data-next','C');await expect(board).not.toHaveAttribute('data-following','C')
  await page.locator('.ai-tetris-specials summary').focus();await page.keyboard.press(' ');await expect(menu).toHaveAttribute('aria-expanded','false')
})

test('disabling a queued piece during pause keeps the reaction and the AI uses the updated queue',async({page})=>{
  await page.addInitScript(()=>{Math.random=()=>0.86})
  await page.goto('/ai/tetris');await page.getByRole('button',{name:'IA desactivada',exact:true}).click()
  const board=page.getByTestId('tetris-board');await board.focus();await page.keyboard.press(' ');await page.keyboard.press('p')
  await expect(board).toHaveAttribute('data-drilling','true')
  await page.getByRole('button',{name:'Piezas especiales',exact:true}).click();await page.getByRole('button',{name:'Taladro',exact:true}).click()
  await expect(board).toHaveAttribute('data-drilling','true');await expect(board).toHaveAttribute('data-turn','0')
  await expect(board).toHaveAttribute('data-next','I');await expect(board).toHaveAttribute('data-following','I')
  await expect(page.locator('.ai-tetris-forecast summary')).not.toContainText('Taladro')
  await board.getByRole('button',{name:'Continuar',exact:true}).click();await expect(board).toHaveAttribute('data-turn','1')
  await expect(board).toHaveAttribute('data-piece-name','I');await expect(board.locator('[data-settled="D"]')).toHaveCount(3)
})

test('the guide and piece states are translated in all languages',async({page})=>{
  for(const language of ['es','en','ca']){
    await page.addInitScript(language=>localStorage.setItem('portfolio-language',language),language)
    await page.goto('/ai/tetris');const copy={...labCopy[language],...tetrisSpecials[language]}
    await page.getByRole('button',{name:copy.magic,exact:true}).click()
    await expect(page.locator('.ai-tetris-specials')).toContainText(copy.guideHint)
    for(const name of ['T','C','D'])await expect(page.getByRole('button',{name:copy[name],exact:true})).toContainText(copy.enabled)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  }
})
