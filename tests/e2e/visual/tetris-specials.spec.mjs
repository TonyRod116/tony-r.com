import { test, expect } from '../fixtures.mjs'
import { restartWithDraws } from '../tetrisScenario.mjs'

for(const name of ['crystal','drill'])test(`visual tetris ${name} with exact forecasts`,async({page},testInfo)=>{
  await page.addInitScript(value=>{Math.random=()=>value},name==='crystal'?0.8:0.86)
  await page.goto('/ai/tetris')
  await page.locator('.ai-tetris-specials summary').click()
  await restartWithDraws(page,name==='crystal'?0.58:0.86,name==='crystal'?0.8:0.86)
  const board=page.getByTestId('tetris-board')
  await board.focus();await page.keyboard.press(' ');await expect(board).toHaveAttribute('data-turn','1')
  await page.getByRole('button',{name:'Pausar',exact:true}).click()
  await page.getByRole('button',{name:'IA desactivada',exact:true}).click()
  await page.locator('.ai-tetris-forecast summary').click()
  await expect(page.getByTestId('tetris-ai-forecast')).toBeVisible()
  await page.addStyleTag({content:'*{animation:none!important;transition:none!important;caret-color:transparent!important}'})
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.mouse.move(0,0);await page.waitForTimeout(500)
  if(process.env.MY_PAGE_VISUAL_CAPTURE==='1')await testInfo.attach(`tetris-${name}.png`,{body:await page.screenshot({animations:'disabled',fullPage:true}),contentType:'image/png'})
  else await expect(page).toHaveScreenshot(`tetris-${name}.png`,{animations:'disabled',fullPage:true})
})
