import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROOT } from './ai-memory.mjs'

export function compareBaseline(counts, baseline) {
  return Object.entries(counts).filter(([key, count]) => count > (baseline[key] || 0)).map(([key, count]) => ({ key, count, allowed: baseline[key] || 0 }))
}

export function scanDesign(root) {
  const counts = {}
  const walk = dir => {
    for (const entry of readdirSync(dir)) {
      const path = resolve(dir, entry)
      if (statSync(path).isDirectory()) walk(path)
      else if (/\.(?:jsx?|tsx?|css)$/.test(entry)) {
        const text = readFileSync(path, 'utf8')
        for (const [rule, pattern] of [
          ['arbitrary-color', /\b(?:bg|text|border|from|via|to|ring)-\[#[a-f0-9]+\]/gi],
          ['arbitrary-type', /\btext-\[\d+(?:\.\d+)?px\]/g],
          ['arbitrary-radius', /\brounded-\[\d+(?:\.\d+)?px\]/g],
        ]) for (const match of text.matchAll(pattern)) {
          const key = `${relative(root, path).replaceAll('\\', '/')}|${rule}|${match[0]}`
          counts[key] = (counts[key] || 0) + 1
        }
      }
    }
  }
  walk(resolve(root, 'src'))
  return counts
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const baseline = JSON.parse(readFileSync(resolve(ROOT, '.agents/design-policy.json'), 'utf8'))
  const counts = scanDesign(ROOT)
  const regressions = compareBaseline(counts, baseline.legacy_counts)
  console.log(JSON.stringify({ status: regressions.length ? 'fail' : 'pass', legacy_occurrences: Object.values(counts).reduce((a, b) => a + b, 0), regressions, notice: 'Existing debt is tolerated; new arbitrary colors/type/radii fail. This is not a complete visual/accessibility audit.' }, null, 2))
  process.exitCode = regressions.length ? 1 : 0
}
