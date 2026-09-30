import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { ROOT } from './ai-memory.mjs'

try {
  execFileSync('bash', ['scripts/check-ai-instructions.sh'], { cwd: ROOT, stdio: 'inherit' })
  for (const script of ['check-skills.mjs', 'ai-memory.mjs', 'check-agent-evals.mjs', 'check-lint.mjs', 'check-design.mjs']) {
    execFileSync(process.execPath, [resolve(ROOT, 'scripts', script), ...(script === 'ai-memory.mjs' ? ['health'] : [])], { cwd: ROOT, stdio: 'inherit' })
  }
  const tests = readdirSync(resolve(ROOT, 'tests/tooling')).filter(name => name.endsWith('.test.mjs')).map(name => `tests/tooling/${name}`)
  execFileSync(process.execPath, ['--test', '--test-isolation=none', ...tests], { cwd: ROOT, stdio: 'inherit' })
} catch { process.exitCode = 1 }
