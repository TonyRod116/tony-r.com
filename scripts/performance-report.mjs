import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
import { parseArgs } from 'node:util'
import { ROOT } from './ai-memory.mjs'

const { values } = parseArgs({ options: { directory: { type: 'string', default: '.artifacts/build' } } })
try {
  const directory = resolve(ROOT, values.directory)
  const html = readFileSync(resolve(directory, 'index.html'), 'utf8')
  const entry = html.match(/<script[^>]+src="([^"]+\.js)"/)?.[1]
  const chunks = readdirSync(resolve(directory, 'assets')).filter(name => name.endsWith('.js')).map(name => {
    const bytes = readFileSync(resolve(directory, 'assets', name))
    return { name, bytes: bytes.length, gzip_bytes: gzipSync(bytes).length, entry: entry?.endsWith(name) || false }
  }).sort((a, b) => b.bytes - a.bytes)
  console.log(JSON.stringify({ measurement: 'Local build artifacts; not runtime Core Web Vitals or task savings', chunks, total_js_bytes: chunks.reduce((n, c) => n + c.bytes, 0) }, null, 2))
} catch (error) { console.error(`Build first: npm run build -- --outDir .artifacts/build. ${error.message}`); process.exitCode = 1 }
