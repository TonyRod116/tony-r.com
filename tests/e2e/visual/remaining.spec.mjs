import { test, expect } from '../fixtures.mjs'

test.use({timezoneId:'Europe/Madrid'})
for(const[name,path]of[['about','/about'],['resume','/resume'],['solutions','/demos'],['budget','/demos/presupuesto-orientativo'],['render','/demos/render-presupuesto'],['lead','/demos/lead-qualifier']])test(`visual ${name}`,async({page},testInfo)=>{
  await page.clock.setFixedTime(new Date('2026-09-30T12:00:00Z'))
  await page.goto(path);await expect(page.locator('main h1')).toBeVisible()
  await page.addStyleTag({content:'*{animation:none!important;transition:none!important;caret-color:transparent!important}'})
  const height=await page.evaluate(()=>document.documentElement.scrollHeight)
  for(let top=0;top<height;top+=700){await page.evaluate(value=>window.scrollTo({top:value,behavior:'instant'}),top);await page.waitForTimeout(50)}
  await page.evaluate(()=>Promise.all([...document.querySelectorAll('main img')].map(image=>image.decode().catch(()=>{}))))
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.mouse.move(0,0);await page.waitForTimeout(300)
  if(process.env.MY_PAGE_VISUAL_CAPTURE==='1')await testInfo.attach(`${name}.png`,{body:await page.screenshot({animations:'disabled',fullPage:true}),contentType:'image/png'})
  else await expect(page).toHaveScreenshot(`${name}.png`,{animations:'disabled',fullPage:true})
})
