import { readFileSync, realpathSync, mkdtempSync, openSync, closeSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, relative, isAbsolute } from 'node:path'
import { execFileSync } from 'node:child_process'
import { context, ROOT } from './ai-memory.mjs'

try {
  // Hooks must not inject this repository's instructions into another checkout.
  const rel = relative(realpathSync(ROOT), realpathSync(process.cwd()))
  if (rel.startsWith('..') || isAbsolute(rel)) {
    if (process.argv.includes('--hook')) console.log('{}')
    else throw new Error('Run from the My Page checkout')
  } else {
    const map = JSON.parse(readFileSync(resolve(ROOT, '.agents/memory/map.json'), 'utf8'))
    const capsule = context(ROOT, map, process.argv.slice(2).filter(x => x !== '--hook').join(' ') || 'Retomar skills, memoria y trabajo del repo', { lane: 'ops', maxChars: 2400 })
    const directory = mkdtempSync(resolve(tmpdir(), 'my-page-brief-'))
    let dirty
    try {
      const path = resolve(directory, 'status.txt')
      const fd = openSync(path, 'w', 0o600)
      try { execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, timeout: 3000, stdio: ['ignore', fd, 'inherit'] }) }
      finally { closeSync(fd) }
      dirty = readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).length
    } finally { rmSync(directory, { recursive: true }) }
    const brief = `My Page: ${capsule.status}; ${dirty} rutas con cambios. Conserva trabajo previo. Fuente: AI_SHARED_INSTRUCTIONS.md. Skills: .agents/skills/my-page-agent/SKILL.md. Contexto: npm run ai:context -- --query "objetivo". Código actual > memoria; api/ y server/ tienen propietarios distintos; las demos también usan BuildApp. Sin autoridad nueva para publicar, enviar datos o consumir APIs.\n${capsule.items.map(x => `${x.path}: ${x.excerpt.slice(0, 500)}`).join('\n')}`
    console.log(process.argv.includes('--hook') ? JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: brief } }) : brief)
  }
} catch (error) {
  if (process.argv.includes('--hook')) { console.error(`My Page session brief unavailable: ${error.message}`); console.log('{}') }
  else { console.error(error.message); process.exitCode = 1 }
}
