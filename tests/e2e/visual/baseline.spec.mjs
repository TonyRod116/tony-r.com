import { test, expect } from '../fixtures.mjs'

for (const [name, path] of [['home', '/'], ['projects', '/projects'], ['contact', '/contact']]) test(`visual ${name}`, async ({ page }, testInfo) => {
  await page.goto(path)
  await expect(page.locator('main h1')).toBeVisible()
  // Decorative canvas/motion is excluded so composition/text stays reproducible.
  await page.addStyleTag({ content: 'canvas{visibility:hidden!important} *{animation:none!important;transition:none!important;caret-color:transparent!important}' })
  await page.mouse.move(0, 0)
  await page.waitForTimeout(2400)
  if (process.env.MY_PAGE_VISUAL_CAPTURE === '1') {
    await testInfo.attach(`${name}.png`, { body: await page.screenshot({ animations: 'disabled' }), contentType: 'image/png' })
  } else await expect(page).toHaveScreenshot(`${name}.png`, { animations: 'disabled' })
})
