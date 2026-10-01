import { useCallback, useEffect, useRef, useState } from 'react'
import { publicAssetUrl } from '../../../utils/siteRouting.js'

const aborted = () => new DOMException('Cancelled', 'AbortError')

export default function useCatalog() {
  const worker = useRef(null), pending = useRef(new Map()), sequence = useRef(0)
  const [attempt, setAttempt] = useState(0), [status, setStatus] = useState('loading'), [stats, setStats] = useState(null)
  useEffect(() => {
    let live = true
    const requests = pending.current
    const controller = new AbortController()
    setStatus('loading'); setStats(null)
    const fail = () => { if (live) setStatus('error'); for (const request of pending.current.values()) request.reject(new Error('Catalog unavailable')); pending.current.clear() }
    try {
      const instance = new Worker(new URL('./catalog.worker.js', import.meta.url), { type: 'module' })
      worker.current = instance
      instance.onmessage = ({ data }) => {
        if (!live) return
        if (data.type === 'ready') { setStats(data); setStatus('ready'); return }
        if (data.type === 'error' && data.scope === 'init') { fail(); return }
        const request = pending.current.get(data.id)
        if (!request) return
        pending.current.delete(data.id)
        if (data.type === 'error') request.reject(new Error('Search unavailable'))
        else request.resolve(data)
      }
      instance.onerror = fail
      fetch(publicAssetUrl('/demos-data/degrees/manifest.json'), { signal: controller.signal }).then(response => {
        if (!response.ok) throw new Error('Manifest unavailable')
        return response.json()
      }).then(manifest => {
        if (!live) return
        if (!manifest.asset?.startsWith('/demos-data/degrees/catalog-') || manifest.binary_bytes > 180_000_000 || !/^[a-f0-9]{64}$/.test(manifest.binary_sha256)) throw new Error('Invalid manifest')
        instance.postMessage({ type: 'init', asset: publicAssetUrl(manifest.asset), binaryBytes: manifest.binary_bytes, sha256: manifest.binary_sha256 })
      }).catch(error => { if (error.name !== 'AbortError') fail() })
    } catch { fail() }
    return () => {
      live = false; controller.abort(); worker.current?.terminate(); worker.current = null
      for (const request of requests.values()) request.reject(aborted())
      requests.clear()
    }
  }, [attempt])
  const cancel = useCallback((type, slot) => {
    for (const [id, request] of pending.current) if (request.type === type && (!slot || request.slot === slot)) { request.reject(aborted()); pending.current.delete(id) }
    worker.current?.postMessage({ type: `cancel-${type}`, slot })
  }, [])
  const call = useCallback((type, data) => {
    if (!worker.current || status !== 'ready') return Promise.reject(new Error('Catalog unavailable'))
    if (type === 'search' || type === 'path') cancel(type, data.slot)
    const id = ++sequence.current
    return new Promise((resolve, reject) => {
      pending.current.set(id, { type, slot: data.slot, resolve, reject })
      worker.current.postMessage({ ...data, type, id })
    })
  }, [status, cancel])
  return { status, stats, call, cancel, retry: () => setAttempt(value => value + 1) }
}
