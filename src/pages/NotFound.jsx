import { useLanguage } from '../hooks/useLanguage.jsx'
import { siteContent } from '../data/siteContent'
import SitePage, { PageLink } from '../components/site/SitePage'

export default function NotFound() {
  const { language } = useLanguage()
  const copy = siteContent[language].notFound
  return <SitePage title={copy.title} intro={copy.intro} kicker={copy.kicker} className="site-not-found">
    <section className="site-section">
      <div className="site-actions">
        <PageLink to="/" primary>{copy.home}</PageLink>
        <PageLink to="/projects">{copy.projects}</PageLink>
      </div>
    </section>
  </SitePage>
}
