import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import { siteContent, solutionPages } from '../../data/siteContent'
import SitePage from './SitePage'

export default function DemoPage({ id, children }) {
  const { language } = useLanguage()
  const copy = siteContent[language]
  const demo = solutionPages.find(item => item.id===id)
  const navigation = useRef(null)
  useEffect(() => {
    const bar = navigation.current
    const current = bar.querySelector('[aria-current="page"]')
    bar.scrollLeft += current.getBoundingClientRect().left - bar.getBoundingClientRect().left - bar.clientWidth/2 + current.clientWidth/2
  }, [id,language])
  return <SitePage title={demo.title[language]} intro={demo.intro[language]} kicker={`${demo.number} / ${copy.solutions.kicker}`} className="site-demo">
    <Link className="site-demo-back" to="/demos"><ArrowLeft size={16} />{copy.backSolutions}</Link>
    <nav ref={navigation} className="site-demo-nav" aria-label={copy.solutions.title}>{solutionPages.map(item => <Link key={item.id} to={`/demos/${item.id}`} aria-current={item.id===id?'page':undefined}>{item.number} / {item.title[language]}</Link>)}</nav>
    <div className="site-demo-stage">{children}</div>
    <section className="site-demo-method"><div><p className="site-kicker">{copy.input}</p><p>{demo.input[language]}</p></div><div><p className="site-kicker">{copy.output}</p><p>{demo.output[language]}</p></div></section>
    <p className="site-note">{id==='render-presupuesto'?copy.renderNote:id==='presupuesto-orientativo'?copy.resultNote:copy.serviceNote}</p>
  </SitePage>
}
