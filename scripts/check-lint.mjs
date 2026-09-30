import { readFileSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { ESLint } from 'eslint'
import { ROOT } from './ai-memory.mjs'
import { compareBaseline } from './check-design.mjs'

const eslint = new ESLint({ cwd: ROOT, extensions: ['.js', '.jsx', '.mjs'] })
const results = await eslint.lintFiles(['src', 'scripts', 'tests', 'playwright.config.js', 'playwright.visual.config.js'])
const counts = {}
for (const file of results) for (const message of file.messages) {
  const key = `${relative(ROOT, file.filePath).replaceAll('\\', '/')}|${message.ruleId || 'parse-error'}|${message.severity}`
  counts[key] = (counts[key] || 0) + 1
}
const baseline = JSON.parse(readFileSync(resolve(ROOT, '.agents/lint-baseline.json'), 'utf8'))
const regressions = compareBaseline(counts, baseline.counts)
console.log(JSON.stringify({ status: regressions.length ? 'fail' : 'pass', existing_debt: Object.values(counts).reduce((a, b) => a + b, 0), regressions, notice: 'New issues fail; existing issues remain visible and must be reduced during scoped cleanup.' }, null, 2))
process.exitCode = regressions.length ? 1 : 0
