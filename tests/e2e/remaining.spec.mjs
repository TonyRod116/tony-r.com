import { test, expect, mockJson } from './fixtures.mjs'

const pixel='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII='
test('before-after comparison exposes a keyboard control and follows pointer drag', async ({page}) => {
  await page.route('**/api/v1/get-inspired/process',route => mockJson(route,{budget:{min:500,max:900},originalImageUrl:pixel,editedImageUrl:pixel}))
  await page.goto('/demos/render-presupuesto')
  await page.locator('input[type="file"]').setInputFiles('src/assets/projects/buildapp-pro-quote-visual.png')
  await page.locator('textarea').fill('Ejemplo sintético de una reforma')
  await page.getByRole('button',{name:'Generar Render y Presupuesto',exact:true}).click()
  const range=page.getByLabel('Posición del separador')
  await expect(range).toBeVisible()
  await range.focus();await page.keyboard.press('ArrowRight');await expect(range).toHaveValue('51')
  const canvas=page.locator('.site-comparison')
  await canvas.scrollIntoViewIfNeeded()
  const box=await canvas.boundingBox()
  await page.mouse.move(box.x+box.width*0.5,box.y+box.height*0.5);await page.mouse.down();await page.mouse.move(box.x+box.width*0.8,box.y+box.height*0.5,{steps:8});await page.mouse.up()
  expect(Number(await range.inputValue())).toBeGreaterThan(70)
})

const pages=[['/about','about'],['/projects','projects'],['/resume','resume'],['/contact','contact'],['/demos','solutions']]
for(const language of ['es','en','ca'])test(`remaining pages and demo headings keep language ${language}`,async({page})=>{
  await page.addInitScript(value=>localStorage.setItem('portfolio-language',value),language)
  const {siteContent,solutionPages}=await import('../../src/data/siteContent.js')
  for(const [path,key] of pages){await page.goto(path);await expect(page.locator('main h1')).toHaveText(siteContent[language][key].title);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.locator('main')).not.toContainText(/solutions\.\w+|resume\.\w+|contact\.form/)}
  for(const demo of solutionPages){await page.goto(`/demos/${demo.id}`);await expect(page.locator('main h1')).toHaveText(demo.title[language]);await expect(page.locator('.site-demo-nav a')).toHaveCount(3);await expect(page.locator('.site-demo-nav a[aria-current="page"]')).toBeInViewport();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)}
})

test('projects preserve every case, product captures and source/store links',async({page})=>{
  await page.goto('/projects')
  await expect(page.locator('.site-case')).toHaveCount(4)
  await expect(page.locator('a[href*="apps.apple.com"]')).toBeVisible()
  await expect(page.locator('a[href*="play.google.com"]')).toBeVisible()
  const sample=page.locator('a[href="/projects/buildapp-pro-sample-quote.pdf"]')
  await expect(sample).toBeVisible();expect((await page.request.get(await sample.getAttribute('href'))).headers()['content-type']).toContain('pdf')
  const picture=page.locator('.site-project-images > button img'),before=await picture.getAttribute('src')
  await page.locator('.site-project-thumbnails button').nth(1).click();await expect(picture).not.toHaveAttribute('src',before)
  await page.locator('.site-project-images > button').click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible()
  await page.locator('#tradelab summary').click();await expect(page.locator('#tradelab details')).toContainText('distinto de mis bots de trading actuales')
  await expect(page.locator('main')).not.toContainText(/Lighthouse|SEO Score|rentabilidad garantizada/)
})

test('CV preserves all documents and full photo gallery with keyboard navigation',async({page})=>{
  await page.goto('/resume')
  await expect(page.locator('.site-document')).toHaveCount(7)
  const thumb=page.locator('.site-gallery button').first();await thumb.click()
  const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await expect(dialog.locator('h2')).toContainText('1/24')
  await page.keyboard.press('ArrowLeft');await expect(dialog.locator('h2')).toContainText('24/24')
  await page.keyboard.press('ArrowRight');await expect(dialog.locator('h2')).toContainText('1/24')
  await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(thumb).toBeFocused()
  for(let index=0;index<7;index++){await page.locator('.site-document').nth(index).click();const frame=page.locator('dialog iframe');await expect(frame).toBeVisible();const url=await frame.getAttribute('src');expect((await page.request.get(url.split('#')[0])).headers()['content-type']).toContain('pdf');await page.getByRole('button',{name:'Cerrar',exact:true}).click();await expect(frame).toHaveCount(0)}
})

test('contact preserves intent and referral with exact form fields and draft on errors',async({page})=>{
  let body
  await page.route('https://formspree.io/**',route=>{body=route.request().postData();return mockJson(route,{errors:[{message:'Error de prueba'}]},503)})
  await page.goto('/contact?intent=recruiter&solution=lead-qualifier')
  await expect(page.getByRole('radio',{name:'Sobre una oportunidad profesional'})).toBeChecked()
  await page.locator('#name').fill('QA Synthetic');await page.locator('#email').fill('qa@example.test');await page.locator('#message').fill('Draft synthetic QA')
  await page.locator('form button[type="submit"]').click();await expect(page.getByRole('alert')).toContainText('Error de prueba')
  await expect(page.locator('#message')).toHaveValue('Draft synthetic QA')
  expect(body).toContain('recruiter');expect(body).toContain('lead-qualifier');expect(body).not.toContain('contact-context')
  expect(await page.evaluate(()=>window.__QA_TELEMETRY__.some(e=>e.name==='contact_success'))).toBe(false)
})

test('contact network failure uses readable copy instead of an untranslated key',async({page})=>{
  await page.route('https://formspree.io/**',route=>route.abort('failed'))
  await page.goto('/contact');await page.locator('#name').fill('QA');await page.locator('#email').fill('qa@example.test');await page.locator('#message').fill('Network test')
  await page.locator('form button[type="submit"]').click();await expect(page.getByRole('alert')).toContainText('No se ha podido enviar');await expect(page.getByRole('alert')).not.toContainText('contact.form')
})

for(const language of ['es','en','ca'])test(`budget input/output contract and locale ${language}`,async({page})=>{
  let request
  await page.addInitScript(value=>localStorage.setItem('portfolio-language',value),language)
  await page.route('**/api/v1/budget/generate-detailed',route=>{if(route.request().method()==='POST')request=route.request().postDataJSON();return mockJson(route,{total:1200,currency:'€',summary:{materials:400,labor:700,other:100},items:[{category:'QA',concept:'Synthetic fixture',quantity:6,unit:'m²',unitPrice:200,total:1200}],assumptions:['Synthetic assumption']})})
  await page.goto('/demos/presupuesto-orientativo');await page.locator('.site-budget-types button').first().click();await page.locator('#budget-sqm').fill('6');await page.locator('#budget-notes').fill('Synthetic scope')
  await page.locator('button[type="submit"]').click();await expect(page.locator('.site-budget-result')).toContainText('Synthetic fixture')
  expect(request).toMatchObject({projectType:'baño',sqm:6,city:'Barcelona',description:'Synthetic scope',locale:{es:'es-ES',en:'en-US',ca:'ca-ES'}[language]})
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})

test('budget alternate range response remains readable',async({page})=>{
  await page.route('**/api/v1/budget/generate-detailed',route=>mockJson(route,{totalMin:900,totalMax:1400,lineItems:[{category:'QA',item:'Synthetic range',qty:2,unit:'u',min:450,max:700}],notes:['Synthetic note']}))
  await page.goto('/demos/presupuesto-orientativo');await page.locator('.site-budget-types button').first().click();await page.locator('button[type="submit"]').click()
  await expect(page.locator('.site-budget-result')).toContainText('Synthetic range');await expect(page.locator('.site-budget-result')).toContainText('900')
})

test('budget HTML errors stay readable and cancellation ignores a late response',async({page})=>{
  await page.route('**/api/v1/budget/generate-detailed',route=>route.fulfill({status:502,contentType:'text/html',body:'<h1>Private diagnostic detail</h1>'}))
  await page.goto('/demos/presupuesto-orientativo');await page.locator('.site-budget-types button').first().click();await page.locator('button[type="submit"]').click()
  await expect(page.getByRole('alert')).toContainText('respuesta válida');await expect(page.locator('main')).not.toContainText('Private diagnostic')
  await page.unroute('**/api/v1/budget/generate-detailed')
  await page.route('**/api/v1/budget/generate-detailed',async route=>{await new Promise(resolve=>setTimeout(resolve,700));try{return await mockJson(route,{total:900,items:[]})}catch{/* The UI canceled its local request. */}})
  await page.locator('button[type="submit"]').click();await page.getByRole('button',{name:'Cancelar',exact:true}).click();await page.waitForTimeout(900)
  await expect(page.getByRole('status')).toHaveCount(0);await expect(page.locator('.site-budget-result')).not.toBeVisible();await expect(page.locator('button[type="submit"]')).toBeEnabled()
})

test('render rejects an invalid file and preserves the request schema for a valid one',async({page})=>{
  let request
  await page.route('**/api/v1/get-inspired/process',route=>{if(route.request().method()==='POST')request=route.request().postDataJSON();return mockJson(route,{budget:{rangeMin:500,rangeMax:900},originalImageUrl:pixel,editedImageUrl:pixel})})
  await page.goto('/demos/render-presupuesto')
  await page.locator('input[type="file"]').setInputFiles({name:'test.txt',mimeType:'text/plain',buffer:Buffer.from('synthetic')})
  await expect(page.getByRole('alert')).toBeVisible();await expect(page.locator('button[type="submit"]')).toBeDisabled()
  await page.locator('input[type="file"]').setInputFiles('src/assets/projects/buildapp-pro-quote-visual.png');await page.locator('#render-prompt').fill('Synthetic renovation');await page.locator('button[type="submit"]').click()
  await expect(page.locator('.site-comparison')).toBeVisible();expect(request.locale).toBe('es-ES');expect(request.prompt).toBe('Synthetic renovation');expect(request.image).toMatch(/^data:image\/png;base64,/)
  await expect(page.locator('main')).toContainText('visualización, no una obra ejecutada')
})

test('chat configuration is a keyboard-operable dialog and reaches the existing client',async({page})=>{
  let request
  await page.route('**/api/v1/demo/chat',route=>{if(route.request().method()==='POST')request=route.request().postDataJSON();return mockJson(route,{content:JSON.stringify({displayText:'Synthetic config answer',state:{city:'Barcelona'},next_action:'continue'})})})
  await page.goto('/demos/lead-qualifier');await page.getByRole('button',{name:'Criterios de la demo',exact:true}).click()
  const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await dialog.locator('textarea').fill('Barcelona, Badalona');await dialog.locator('input[type="number"]').first().fill('6000')
  await dialog.locator('button[type="submit"]').click();await expect(dialog).not.toBeVisible()
  await page.getByLabel('Tu mensaje',{exact:true}).fill('Synthetic config test');await page.getByRole('button',{name:'Enviar mensaje',exact:true}).click();await expect(page.getByText('Synthetic config answer',{exact:true})).toBeVisible()
  expect(request.config.coveredCities).toEqual(['Barcelona','Badalona']);expect(request.config.budgetRanges.baño.min).toBe(6000)
})

test('chat reset never inserts a reply from the previous conversation',async({page})=>{
  await page.route('**/api/v1/demo/chat',async route=>{await new Promise(resolve=>setTimeout(resolve,500));return mockJson(route,{content:JSON.stringify({displayText:'STALE synthetic reply',state:{},next_action:'continue'})})})
  await page.goto('/demos/lead-qualifier');await page.getByLabel('Tu mensaje',{exact:true}).fill('Synthetic delayed question');await page.getByRole('button',{name:'Enviar mensaje',exact:true}).click();await page.getByRole('button',{name:'Nueva conversación',exact:true}).click()
  await page.waitForTimeout(900);await expect(page.locator('.site-chat-messages')).not.toContainText('STALE');await expect(page.locator('.site-chat-message')).toHaveCount(1)
})

test('links into a project case position it below the fixed header',async({page})=>{
  await page.goto('/demos')
  await page.locator('a[href="/projects#buildapp-pro"]').click()
  await expect(page).toHaveURL(/\/projects#buildapp-pro$/)
  await expect.poll(()=>page.locator('#buildapp-pro').evaluate(element=>Math.round(element.getBoundingClientRect().top))).toBe(96)
})
