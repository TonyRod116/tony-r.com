// Use the regular restart action; scenarios must not depend on hidden game controls.
export async function restartWithDraws(page, firstDraw, followingDraw, label = 'Nueva partida') {
  await page.evaluate(({ firstDraw, followingDraw }) => {
    let first = true
    Math.random = () => {
      if (first) { first = false; return firstDraw }
      return followingDraw
    }
  }, { firstDraw, followingDraw })
  await page.getByRole('button', { name: label, exact: true }).click()
}
