import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import { experiments, labCopy } from '../../data/aiExperiments'
import GameLearning from './GameLearning'
import './AiLab.css'

export default function AiExperimentLayout({ id, children, learningState }) {
  const { language } = useLanguage()
  const copy = labCopy[language]
  const experiment = experiments.find(item => item.id === id)
  const next = experiments[(experiments.indexOf(experiment) + 1) % experiments.length]
  const tabs = useRef(null)
  useEffect(() => {
    const bar = tabs.current
    const current = bar.querySelector('[aria-current="page"]')
    bar.scrollLeft += current.getBoundingClientRect().left - bar.getBoundingClientRect().left - bar.clientWidth / 2 + current.clientWidth / 2
  }, [id, language])
  return <div className="ai-lab ai-experiment" data-experiment={id}>
    <div className="ai-width">
      <Link className="ai-back" to="/ai"><ArrowLeft size={16} />{copy.back}</Link>
      <header className="ai-experiment-heading">
        <p className="ai-kicker">{experiment.number} / {experiment.technique}</p>
        <h1>{experiment.title[language]}</h1>
        <p>{experiment.description[language]}</p>
      </header>
      <nav ref={tabs} className="ai-tabs" aria-label={copy.index}>
        {experiments.map(item => <Link key={item.id} to={`/ai/${item.id}`} aria-current={id === item.id ? 'page' : undefined}><span>{item.number}</span>{item.title[language]}</Link>)}
      </nav>
      <section className="ai-stage" aria-label={copy.try}>{children}</section>
      <section className={`ai-method${id === 'neural-network' ? '' : ' ai-method-educational'}`}>
        <div><p className="ai-kicker">{copy.method}</p><h2>{experiment.technique}</h2></div>
        <div><p>{experiment.method[language]}</p>{experiment.source && <a className="ai-text-link" href={experiment.source} target="_blank" rel="noopener noreferrer">{copy.source}<ArrowUpRight size={16} /></a>}</div>
        <GameLearning id={id} language={language} state={learningState}/>
      </section>
      <Link className="ai-next" to={`/ai/${next.id}`}><span>{copy.next}<strong>{next.title[language]}</strong></span><ArrowUpRight size={28} /></Link>
    </div>
  </div>
}
