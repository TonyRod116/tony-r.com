import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage.jsx'
import { experiments, labCopy } from '../data/aiExperiments'
import NetworkDiagram from '../components/ai/NetworkDiagram'
import '../components/ai/AiLab.css'

function ExperimentMark({ id }) {
  if (id === 'tictactoe') return <div className="ai-mark-ttt" aria-hidden="true">{['×', '', '○', '', '×', '', '○', '', '×'].map((cell, i) => <span key={i}>{cell}</span>)}</div>
  if (id === 'minesweeper') return <div className="ai-mark-mines" aria-hidden="true">{['', '1', '1', '', '1', '2', '', '', '', '', '1', '', '1', '', '', ''].map((cell, i) => <span key={i}>{cell}</span>)}</div>
  if (id === 'nim') return <div className="ai-mark-nim" aria-hidden="true">{[1, 3, 5, 7].map(size => <div key={size}>{Array.from({ length: size }, (_, i) => <span key={i} />)}</div>)}</div>
  if (id === 'tetris') return <div className="ai-mark-tetris" aria-hidden="true">{Array.from({ length: 30 }, (_, i) => <span key={i} className={[2, 3, 4, 8, 14].includes(i) ? 'magic' : i > 23 && i !== 27 ? 'solid' : ''} />)}</div>
  return <svg viewBox="0 0 160 120" aria-hidden="true" className="ai-mark-graph"><path d="M20 70L60 25L95 65L140 45M20 70L65 105L95 65L60 25" />{[[20,70],[60,25],[95,65],[140,45],[65,105]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="7" />)}</svg>
}

export default function AiLab() {
  const { language } = useLanguage()
  const copy = labCopy[language]
  const featured = experiments[0]
  return <div className="ai-lab ai-hub">
    <section className="ai-hub-hero ai-width">
      <div className="ai-hub-intro"><p className="ai-kicker">{copy.eyebrow}</p><h1>{copy.title.split('\n').map(line => <span key={line}>{line}</span>)}</h1><p>{copy.intro}</p><a href="#experiments" className="ai-text-link">{copy.collection}<ArrowDown size={18} /></a></div>
      <div className="ai-hub-figure"><NetworkDiagram title={copy.figure} /><p>{copy.figure}<span>{copy.figureNote}</span></p></div>
    </section>
    <div className="ai-collection">
      <div className="ai-width">
        <Link to="/ai/neural-network" className="ai-featured">
          <div><span className="ai-kicker">01 / {copy.featured}</span><h2>{featured.title[language]}</h2><p>{featured.description[language]}</p></div><span className="ai-featured-action">{copy.open}<ArrowUpRight size={28} /></span>
        </Link>
        <section id="experiments" className="ai-catalog">
          <header><h2>{copy.collection}</h2><p>{copy.collectionIntro}</p></header>
          {experiments.slice(1).map(item => <Link key={item.id} to={`/ai/${item.id}`} className="ai-catalog-item">
            <span className="ai-item-number">{item.number}</span><div className="ai-item-art"><ExperimentMark id={item.id} /></div><div className="ai-item-copy"><span className="ai-kicker">{item.technique}</span><h3>{item.title[language]}</h3><p>{item.description[language]}</p></div><ArrowUpRight className="ai-item-arrow" size={26} />
          </Link>)}
        </section>
      </div>
    </div>
  </div>
}
