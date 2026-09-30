export async function readDemoResponse(response, fallback) {
  if (!(response.headers.get('content-type') || '').toLowerCase().includes('application/json')) throw new Error(fallback)
  let data
  try { data = await response.json() } catch { throw new Error(fallback) }
  if (!response.ok) {
    const message = [data?.detail,data?.message,data?.error].find(value => typeof value === 'string' && value.trim())
    throw new Error(message || fallback)
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(fallback)
  return data
}
export function imageUrl(value, origin = globalThis.location?.origin || 'https://localhost') {
  if (typeof value !== 'string') return null
  if (/^data:image\/(?:png|jpeg|webp);base64,/i.test(value)) return value
  try { const url = new URL(value, origin); return !url.username && !url.password && ['https:','http:'].includes(url.protocol) ? url.href : null } catch { return null }
}
