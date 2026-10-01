import { ActorCatalog } from './catalog.js'

let catalog = null, pathVersion = 0
const searchVersions = { source: 0, target: 0 }

self.onmessage = async ({ data }) => {
  try {
    if (data.type === 'init') {
      const start = performance.now(), response = await fetch(data.asset)
      if (!response.ok) throw new Error('Catalog unavailable')
      let buffer = await response.arrayBuffer()
      const bytes = new Uint8Array(buffer, 0, Math.min(2, buffer.byteLength))
      if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
        buffer = await new Response(new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()
      }
      if (buffer.byteLength !== data.binaryBytes) throw new Error('Catalog size mismatch')
      const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', buffer)), byte => byte.toString(16).padStart(2, '0')).join('')
      if (digest !== data.sha256) throw new Error('Catalog integrity mismatch')
      catalog = new ActorCatalog(buffer)
      self.postMessage({ type: 'ready', people: catalog.peopleCount, movies: catalog.movieCount, credits: catalog.creditCount, bytes: catalog.binaryBytes, elapsed: performance.now() - start })
    } else if (data.type === 'search' && catalog && ['source', 'target'].includes(data.slot)) {
      const version = ++searchVersions[data.slot], start = performance.now()
      const results = await catalog.search(String(data.query).slice(0, 100), { cancelled: () => version !== searchVersions[data.slot] })
      if (version === searchVersions[data.slot]) self.postMessage({ type: 'results', slot: data.slot, id: data.id, query: data.query, results, elapsed: performance.now() - start })
    } else if (data.type === 'person' && catalog) {
      const index = catalog.ids.indexOf(data.originalId)
      if (index < 0) throw new Error('Unknown person')
      self.postMessage({ type: 'person', id: data.id, person: catalog.person(index) })
    } else if (data.type === 'path' && catalog) {
      const version = ++pathVersion, start = performance.now()
      const result = await catalog.shortestPath(data.source, data.target, () => version !== pathVersion)
      if (version === pathVersion && !result.cancelled) self.postMessage({ type: 'path', id: data.id, ...result, elapsed: performance.now() - start })
    } else if (data.type === 'cancel-path') pathVersion++
    else if (data.type === 'cancel-search' && ['source', 'target'].includes(data.slot)) searchVersions[data.slot]++
  } catch {
    self.postMessage({ type: 'error', id: data.id, scope: data.type })
  }
}
