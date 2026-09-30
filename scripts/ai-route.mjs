import { existsSync, mkdtempSync, writeFileSync, openSync, closeSync, rmSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { ROOT } from './ai-memory.mjs'

// Delegate model policy to the existing global selector; never classify models here.
const { values } = parseArgs({ options: { query: { type: 'string' }, mode: { type: 'string', default: 'execute' }, 'code-review': { type: 'boolean' } } })
if (!values.query?.trim() || !['execute', 'review', 'ideas'].includes(values.mode)) {
  console.error('Use --query "objective" [--mode execute|review|ideas] [--code-review]')
  process.exit(1)
}
const selector = resolve(homedir(), 'litellm/ai_route.py')
if (!existsSync(selector)) {
  console.log(JSON.stringify({ status: 'unavailable', reason: 'Global selector is not installed on this machine', dispatch: 'not_started', authority: 'none' }))
  process.exit(2)
}
const args = [selector, '--stdin', '--repo', ROOT, '--surface', 'codex', '--mode', values.mode]
if (values['code-review']) args.push('--code-review')
// An input FD and inherited output also work in environments that restrict captured pipes.
const directory = mkdtempSync(resolve(tmpdir(), 'my-page-route-'))
let fd
try {
  const input = resolve(directory, 'objective.txt')
  writeFileSync(input, values.query, { mode: 0o600 })
  fd = openSync(input, 'r')
  const result = spawnSync('python3', args, { stdio: [fd, 'inherit', 'inherit'], timeout: 15000 })
  if (result.error) console.error(result.error.message)
  process.exitCode = result.error ? 1 : result.status ?? 1
} finally {
  if (fd != null) closeSync(fd)
  rmSync(directory, { recursive: true })
}
