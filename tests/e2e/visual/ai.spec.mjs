import { test, expect } from '../fixtures.mjs'

for (const [name,path] of [['ai-lab','/ai'],['ai-neural','/ai/neural-network'],['ai-tetris','/ai/tetris'],['ai-sixdegrees','/ai/sixdegrees'],['ai-tictactoe','/ai/tictactoe'],['ai-minesweeper','/ai/minesweeper'],['ai-nim','/ai/nim']]) test(`visual ${name}`, async ({page},testInfo) => {
  if(name==='ai-tetris') await page.addInitScript(()=>{Math.random=()=>0.95})
  await page.goto(path)
  await expect(page.locator('main h1')).toBeVisible()
  if(name==='ai-neural') { await expect(page.getByTestId('model-state')).toContainText('Modelo cargado');await page.locator('.ai-samples').getByRole('button',{name:'7',exact:true}).click();await page.getByRole('button',{name:'Restablecer vista',exact:true}).click() }
  if(name==='ai-tetris') await page.getByRole('button',{name:'Pausar',exact:true}).click()
  if(name==='ai-sixdegrees') { await expect(page.getByTestId('catalog-state')).toHaveAttribute('data-state','ready',{timeout:45000});await page.getByRole('button',{name:'Kevin Bacon → Tom Hanks',exact:true}).click();await expect(page.locator('#graph-source')).toHaveValue('Kevin Bacon');await page.getByRole('button',{name:'Encontrar conexión',exact:true}).click();await expect(page.locator('.degrees-result')).toContainText('Apollo 13') }
  await page.addStyleTag({content:'*{animation:none!important;transition:none!important;caret-color:transparent!important}'})
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}))
  await page.mouse.move(0,0)
  await page.waitForTimeout(500)
  if(process.env.MY_PAGE_VISUAL_CAPTURE==='1') await testInfo.attach(`${name}.png`,{body:await page.screenshot({animations:'disabled',fullPage:true}),contentType:'image/png'})
  else await expect(page).toHaveScreenshot(`${name}.png`,{animations:'disabled',fullPage:true})
})
