import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import './Site.css'

export default function SitePage({ title, intro, kicker, aside, children, className = '' }) {
  return <div className={`site-page ${className}`}>
    <div className="site-width">
      <header className={`site-page-heading${aside ? ' has-aside' : ''}`}>
        <div>{kicker && <p className="site-kicker">{kicker}</p>}<h1>{title}</h1>{intro && <p className="site-intro">{intro}</p>}</div>
        {aside && <div className="site-heading-aside">{aside}</div>}
      </header>
      {children}
    </div>
  </div>
}

export function PageLink({ to, children, primary = false, ...props }) {
  const className = primary ? 'site-button' : 'site-link'
  return to.startsWith('/') && !to.endsWith('.pdf') ? <Link to={to} className={className} {...props}>{children}<ArrowUpRight size={17} /></Link> : <a href={to} className={className} {...props}>{children}<ArrowUpRight size={17} /></a>
}
