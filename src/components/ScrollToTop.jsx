import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) { window.scrollTo({ top: 0, behavior: 'instant' }); return }
    let id
    try { id = decodeURIComponent(hash.slice(1)) } catch { id = hash.slice(1) }
    const scroll = () => {
      const target = document.getElementById(id)
      if (!target) return false
      target.scrollIntoView({ block: 'start', behavior: 'instant' })
      return true
    }
    if (scroll()) return
    const observer = new MutationObserver(() => { if (scroll()) observer.disconnect() })
    observer.observe(document.body, { childList: true, subtree: true })
    const timeout = setTimeout(() => observer.disconnect(), 3000)
    return () => { observer.disconnect(); clearTimeout(timeout) }
  }, [pathname, hash])

  return null
}
