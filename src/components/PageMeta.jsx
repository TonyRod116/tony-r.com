import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage.jsx'
import { resolvePageMeta } from '../data/pageMeta'

function headElement(selector, tag, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement(tag)
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
    document.head.appendChild(element)
  }
  return element
}

// La web es una SPA con un único index.html: cada ruta debe poner su propio título y descripción.
export default function PageMeta() {
  const { pathname } = useLocation()
  const { language } = useLanguage()
  useEffect(() => {
    // Está fuera de RouteBoundary: un fallo aquí desmontaría toda la app, así que nunca debe propagarse.
    try {
      const meta = resolvePageMeta(pathname, language)
      document.title = meta.title
      headElement('meta[name="description"]', 'meta', { name: 'description' }).setAttribute('content', meta.description)
      headElement('meta[name="robots"]', 'meta', { name: 'robots' }).setAttribute('content', meta.robots)
      if (meta.canonical) headElement('link[rel="canonical"]', 'link', { rel: 'canonical' }).setAttribute('href', meta.canonical)
      else document.head.querySelector('link[rel="canonical"]')?.remove()
    } catch { /* Los metadatos no deben afectar al producto. */ }
  }, [pathname, language])
  return null
}
