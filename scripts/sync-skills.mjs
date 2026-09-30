import { readFileSync, readdirSync, existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { ROOT, safePath } from './ai-memory.mjs'

const check = process.argv.includes('--check')
const catalog = JSON.parse(readFileSync(resolve(ROOT, '.agents/skills/catalog.json'), 'utf8'))
const files = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  if (entry.isSymbolicLink()) throw new Error(`Symlink not allowed in skill: ${entry.name}`)
  const path = resolve(dir, entry.name)
  return entry.isDirectory() ? files(path) : [path]
})
let failed = false
for (const { name } of catalog.skills) {
  const source = safePath(ROOT, `.agents/skills/${name}`)
  const destination = safePath(ROOT, `.claude/skills/${name}`)
  const sources = files(source)
  const names = sources.map(p => relative(source, p))
  if (check && existsSync(destination) && files(destination).some(p => !names.includes(relative(destination, p)))) {
    console.error(`Unexpected files in mirror: ${name}`); failed = true
  }
  for (const file of sources) {
    const target = safePath(ROOT, `.claude/skills/${name}/${relative(source, file).replaceAll('\\', '/')}`)
    if (check) {
      if (!existsSync(target) || !readFileSync(file).equals(readFileSync(target))) { console.error(`Missing/mismatched mirror: ${name}/${relative(source, file)}`); failed = true }
    } else { mkdirSync(resolve(target, '..'), { recursive: true }); copyFileSync(file, target) }
  }
}
console.log(`${catalog.skills.length} skills: ${check ? 'mirror check' : 'synchronized'}`)
process.exitCode = failed ? 1 : 0
