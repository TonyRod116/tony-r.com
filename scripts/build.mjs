import { mkdirSync, copyFileSync, existsSync, realpathSync } from 'node:fs'
import { resolve, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { ROOT } from './ai-memory.mjs'

export function validateBuildOutput(value, root = ROOT) {
  const base = realpathSync(root)
  const output = resolve(base, value)
  const allowed = path => path === 'dist' || path === '.artifacts' || path.startsWith('.artifacts/')
  if (!allowed(relative(base, output).replaceAll('\\', '/'))) throw new Error('Unsafe build destination; use dist or .artifacts/build')
  let ancestor = output
  while (!existsSync(ancestor)) ancestor = dirname(ancestor)
  const actual = realpathSync(ancestor)
  if (actual !== base && !allowed(relative(base, actual).replaceAll('\\', '/'))) throw new Error('Unsafe build destination through symlink')
  return output
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: { outDir: { type: 'string', default: 'dist' } } })
  const output = validateBuildOutput(values.outDir)
  execFileSync(process.execPath, [resolve(ROOT, 'node_modules/vite/bin/vite.js'), 'build', '--outDir', output], { cwd: ROOT, stdio: 'inherit' })
  mkdirSync(resolve(output, 'demos'), { recursive: true })
  copyFileSync(resolve(output, 'index.html'), resolve(output, 'demos/index.html'))
}
