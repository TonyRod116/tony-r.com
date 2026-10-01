import { Link, useLocation } from 'react-router-dom'
import { profile } from '../data/profile'
import { useLanguage } from '../hooks/useLanguage.jsx'
import { lazy, Suspense } from 'react'

// A missing optional chunk must not take down the lab or its navigation.
const LabEasterEgg = lazy(() => import('./ai/LabEasterEgg').catch(() => ({ default: function UnavailableEasterEgg() { return null } })))

export default function Footer() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const isHome = pathname === '/', isAi = pathname === '/ai' || pathname.startsWith('/ai/')
  return <footer className={isHome ? 'home-footer' : isAi ? 'ai-footer' : 'site-footer'}>
    <div className={isHome ? 'home-width' : isAi ? 'ai-width' : 'site-width'}>
      {isAi ? <div className="ai-footer-meta"><p>© {new Date().getFullYear()} {profile.name} · Barcelona</p><Suspense fallback={null}><LabEasterEgg key={pathname} pathname={pathname} /></Suspense></div> : <p>© {new Date().getFullYear()} {profile.name} · Barcelona</p>}
      <nav aria-label={t('footer.quickLinks')}><Link to="/demos">{t('nav.solutions')}</Link><Link to="/resume">{t('nav.resume')}</Link><Link to="/ai">{t('nav.aiLab')}</Link></nav>
    </div>
  </footer>
}
