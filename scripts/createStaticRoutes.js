import { promises as fs } from 'fs'
import path from 'path'

const routes = [
  'about',
  'projects',
  'contact',
  'resume',
  'ai',
  'ai/tictactoe',
  'ai/minesweeper',
  'ai/sixdegrees',
  'ai/nim',
  'ai/tetris',
  'demos',
  'demos/presupuesto-orientativo',
  'demos/render-presupuesto'
]

async function ensureStaticRoutes() {
  const distDir = path.resolve(process.cwd(), 'dist')
  const sourceFile = path.join(distDir, 'index.html')

  try {
    const html = await fs.readFile(sourceFile, 'utf-8')

    await Promise.all(routes.map(async (route) => {
      const targetDir = path.join(distDir, route)
      await fs.mkdir(targetDir, { recursive: true })
      const targetFile = path.join(targetDir, 'index.html')
      await fs.writeFile(targetFile, html, 'utf-8')
    }))

    console.log(`Static copies created for routes: ${routes.join(', ')}`)
  } catch (error) {
    console.error('Failed to create static route copies:', error)
    process.exitCode = 1
  }
}

ensureStaticRoutes()

