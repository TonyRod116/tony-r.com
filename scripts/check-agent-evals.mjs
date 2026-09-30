import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { ROOT, context, selectLanes } from './ai-memory.mjs'

const map = JSON.parse(readFileSync(resolve(ROOT, '.agents/memory/map.json'), 'utf8'))
const cases = JSON.parse(readFileSync(resolve(ROOT, '.agents/evals/cases.json'), 'utf8'))
const failures = []
for (const item of cases) {
  const result = selectLanes(item.query, map)
  if (JSON.stringify([...result].sort()) !== JSON.stringify([...item.expected_lanes].sort())) failures.push({ id: item.id, actual: result, expected: item.expected_lanes })
  const capsule = context(ROOT, map, item.query)
  if (capsule.query !== item.query || Object.values(capsule.authority).some(Boolean)) failures.push({ id: item.id, issue: 'Query/authority changed' })
}
console.log(JSON.stringify({ status: failures.length ? 'fail' : 'pass', cases: cases.length, failures, evaluation: 'Deterministic local routing and authority. Independent model behavior is not evaluated by this command.' }, null, 2))
process.exitCode = failures.length ? 1 : 0
