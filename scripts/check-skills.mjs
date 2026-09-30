import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { ROOT } from './ai-memory.mjs'

const catalog = JSON.parse(readFileSync(resolve(ROOT, '.agents/skills/catalog.json'), 'utf8'))
const expected = catalog.skills.map(x => x.name)
const actual = readdirSync(resolve(ROOT, '.agents/skills'), { withFileTypes: true }).filter(x => x.isDirectory()).map(x => x.name)
const errors = []
if (new Set(expected).size !== expected.length || [...expected, ...actual].some(name => !expected.includes(name) || !actual.includes(name))) errors.push('Skill catalog and discovery differ')
for (const { name, description } of catalog.skills) {
  if (!/^[a-z0-9-]{1,64}$/.test(name)) { errors.push(`Invalid skill name: ${name}`); continue }
  const path = resolve(ROOT, '.agents/skills', name)
  const text = readFileSync(resolve(path, 'SKILL.md'), 'utf8')
  const front = text.match(/^---\n([\s\S]*?)\n---\n/)
  if (!front || !front[1].includes(`name: ${name}\n`) || !front[1].includes(`description: ${JSON.stringify(description)}`)) errors.push(`Invalid frontmatter: ${name}`)
  if (/TODO|\[INSERT|PLACEHOLDER/.test(text)) errors.push(`Unfinished skill: ${name}`)
  const metadata = readFileSync(resolve(path, 'agents/openai.yaml'), 'utf8')
  if (!metadata.includes(`$${name}`)) errors.push(`Missing invocation prompt: ${name}`)
  const unexpected = readdirSync(path).filter(file => !['SKILL.md', 'agents'].includes(file))
  if (unexpected.length) errors.push(`Unreviewed resources in skill ${name}: ${unexpected.join(', ')}`)
  for (const reference of text.matchAll(/(?:docs|\.agents)\/[a-zA-Z0-9./_-]+\.(?:md|json)/g)) if (!existsSync(resolve(ROOT, reference[0]))) errors.push(`Missing reference in ${name}: ${reference[0]}`)
}
const manifest = JSON.parse(readFileSync(resolve(ROOT, '.agents/adoption-manifest.json'), 'utf8'))
if (manifest.strategy !== 'hand_adapted_static_workflows' || !manifest.sources.every(x => x.commit && x.path && /^[a-f0-9]{64}$/.test(x.sha256)) || !existsSync(resolve(ROOT, '.agents/skills/MARKETINGSKILLS_LICENSE'))) errors.push('Missing adoption provenance/license')
try { execFileSync(process.execPath, [resolve(ROOT, 'scripts/sync-skills.mjs'), '--check'], { stdio: 'inherit' }) } catch { errors.push('Skill mirrors differ') }
console.log(JSON.stringify({ status: errors.length ? 'fail' : 'pass', skills: expected.length, errors, evidence: 'Structural/provenance checks only; not independent behavioral review' }, null, 2))
process.exitCode = errors.length ? 1 : 0
