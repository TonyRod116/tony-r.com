import { test, expect } from './fixtures.mjs'
import { neuralDynamics, neuralControls } from '../../src/data/neuralDynamics.js'

const runningAnimations = instrument => instrument.evaluate(element=>document.getAnimations().filter(animation=>animation.playState==='running'&&animation.effect?.target&&element.contains(animation.effect.target)).length)

test.describe('neural motion defaults',()=>{
  test.use({reducedMotion:'no-preference'})
  test('desktop starts animated and mobile starts static, with working opt-in and zero running animations when off',async({page},testInfo)=>{
    await page.goto('/ai/neural-network');await expect(page.getByTestId('model-state')).toContainText('Modelo cargado')
    const instrument=page.locator('.ai-network-instrument'),desktop=testInfo.project.name==='desktop'
    const original=await page.locator('[data-probability]').evaluateAll(elements=>elements.map(e=>Number(e.dataset.probability)))
    await expect(instrument).toHaveAttribute('data-animation-enabled',String(desktop))
    if(desktop){await expect.poll(()=>runningAnimations(instrument)).toBeGreaterThan(0);await page.getByRole('switch',{name:'Apagar animación',exact:true}).click()}
    await expect.poll(()=>runningAnimations(instrument)).toBe(0)
    await page.getByRole('switch',{name:'Encender animación',exact:true}).click();await expect.poll(()=>runningAnimations(instrument)).toBeGreaterThan(0)
    await page.setViewportSize({width:800,height:900});await expect(instrument).toHaveAttribute('data-animation-enabled','true')
    await page.getByRole('switch',{name:'Apagar animación',exact:true}).click();await expect.poll(()=>runningAnimations(instrument)).toBe(0)
    expect(await page.locator('[data-probability]').evaluateAll(elements=>elements.map(e=>Number(e.dataset.probability)))).toEqual(original)
  })
})

for(const[name,viewport]of[['portrait',{width:768,height:1024}],['landscape',{width:1366,height:1024}]])test.describe(`tablet ${name}`,()=>{
  test.use({viewport,hasTouch:true,isMobile:false,reducedMotion:'no-preference'})
  test('starts without animated SVG work and can be enabled explicitly',async({page})=>{
    await page.goto('/ai/neural-network');await expect(page.getByTestId('model-state')).toContainText('Modelo cargado')
    const instrument=page.locator('.ai-network-instrument')
    await expect(instrument).toHaveAttribute('data-animation-enabled','false');await expect.poll(()=>runningAnimations(instrument)).toBe(0)
    await page.getByRole('switch',{name:'Encender animación',exact:true}).click();await expect.poll(()=>runningAnimations(instrument)).toBeGreaterThan(0)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  })
})

test('formulas use real fractions and superscripts while retaining their original expressions in every language',async({page})=>{
  for(const language of ['es','en','ca']){
    await page.addInitScript(language=>localStorage.setItem('portfolio-language',language),language)
    await page.goto('/ai/neural-network');await expect(page.getByTestId('model-state')).toHaveText(/(Model|Modelo) (cargado|loaded|carregat)/)
    const controls=neuralControls[language],copy=neuralDynamics[language]
    await page.getByRole('button',{name:new RegExp('01 /')}).click()
    const math=page.getByTestId('neural-equation').locator('math')
    await expect(math).toHaveAttribute('aria-label',copy.phases.input[1]);await expect(math.locator('mfrac')).toHaveCount(1)
    await page.getByRole('button',{name:controls.backward,exact:false}).click()
    await expect(math).toHaveAttribute('aria-label',copy.phases.b0[1]);await expect(math.locator('mfrac')).toHaveCount(2)
    await page.getByRole('button',{name:new RegExp('04 /')}).click();await expect(math.locator('msup')).not.toHaveCount(0)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  }
})
