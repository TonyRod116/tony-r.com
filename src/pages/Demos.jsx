import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage.jsx'
import { siteContent, solutionPages } from '../data/siteContent'
import SitePage, { PageLink } from '../components/site/SitePage'

export default function Demos() {
  const { language, t } = useLanguage()
  const copy = siteContent[language]
  const budgetLabels = ['materials','labor','other'].map(key => t(`solutions.presupuestoOrientativo.result.${key}`))
  return <SitePage title={copy.solutions.title} intro={copy.solutions.intro} kicker={copy.solutions.kicker}>
    <section className="site-solutions-list">{solutionPages.map(item => <Link key={item.id} to={`/demos/${item.id}`} className="site-solution"><span className="site-kicker">{item.number}</span>
      {item.id==='render-presupuesto'?<img src="/gallery/totalhomes-06.jpg" alt="" width="600" height="450" loading="lazy" />:<div className={`site-solution-art ${item.id==='lead-qualifier'?'is-chat':''}`} aria-hidden="true">{item.id==='presupuesto-orientativo'?budgetLabels.map(label=><div key={label}><span>{label}</span><span>—</span></div>):<><span className="site-art-message"><i /></span><span className="site-art-message"><i /><i /></span><span className="site-art-message"><i /><i /></span></>}</div>}
      <div><h2>{item.title[language]}</h2><p>{item.intro[language]}</p><dl className="site-solution-io"><div><dt>{copy.input}<span className="sr-only">:</span></dt><dd>{item.input[language]}</dd></div><div><dt>{copy.output}<span className="sr-only">:</span></dt><dd>{item.output[language]}</dd></div></dl><span className="site-link">{copy.tryDemo}</span></div><ArrowUpRight size={24} /></Link>)}</section>
    <section className="site-section site-two-column"><h2>{copy.solutions.footerTitle}</h2><div className="site-prose"><p>{copy.solutions.footerText}</p><div className="site-actions"><PageLink to="https://buildapp.es/pro" primary target="_blank" rel="noopener noreferrer">{copy.openBuildApp}</PageLink><PageLink to="/projects#buildapp-pro">{copy.buildAppCase}</PageLink></div></div></section>
  </SitePage>
}
