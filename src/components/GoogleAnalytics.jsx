import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { classifyLink, recordEvent, captureRuntimeError } from '../utils/telemetry'

export const trackPageView = path => recordEvent('page_view', { path })
export const trackContactForm = () => recordEvent('contact_success', { method: 'form' })
export const trackProjectView = () => recordEvent('project_open', { target: 'project' })
export const trackResumeDownload = () => recordEvent('cv_download', { language: 'unknown' })
export const trackSocialClick = platform => recordEvent('social_click', { platform })

export default function GoogleAnalytics() {
  const location = useLocation()
  const lastPath = useRef(null)
  useEffect(() => {
    if (lastPath.current !== location.pathname) trackPageView(location.pathname)
    lastPath.current = location.pathname
  }, [location.pathname])
  useEffect(() => {
    const onClick = event => {
      const anchor = event.target.closest?.('a[href]')
      if (!anchor) return
      const classified = classifyLink(anchor.href, window.location.origin)
      if (classified) recordEvent(classified.name === 'cv_open' && anchor.hasAttribute('download') ? 'cv_download' : classified.name, classified.parameters)
    }
    const onError = () => captureRuntimeError('runtime_error')
    const onRejection = () => captureRuntimeError('unhandled_rejection')
    // CV previews use an iframe; observe its source without changing Resume.
    const seenFrames = new WeakMap()
    const onFrames = () => {
      document.querySelectorAll('iframe[src]').forEach(frame => {
        if (seenFrames.get(frame) === frame.src) return
        seenFrames.set(frame, frame.src)
        const event = classifyLink(frame.src, window.location.origin)
        if (event?.name === 'cv_open') recordEvent(event.name, event.parameters)
      })
    }
    const observer = new MutationObserver(onFrames)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] })
    onFrames()
    document.addEventListener('click', onClick, true)
    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      observer.disconnect()
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])
  return null
}
