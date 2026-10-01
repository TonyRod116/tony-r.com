// Sprite Fusion renders public pages under this prefix in its official viewer.
// Normal hosting and lookalike origins keep the standard BrowserRouter base.
export function spriteFusionRouteBase({ origin, pathname }) {
  const base = '/p/https/tony-r.com'
  return origin === 'https://destroy.spritefusion.com' && (pathname === base || pathname.startsWith(`${base}/`)) ? base : undefined
}

export function publicAssetUrl(path, location = globalThis.location) {
  const base = location ? spriteFusionRouteBase(location) : undefined
  return `${base || ''}${path}`
}
