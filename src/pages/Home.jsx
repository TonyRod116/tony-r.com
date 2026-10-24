import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage.jsx'
import { profile } from '../data/profile'
import { projectImages, buildappMobileImages, buildappCaptureCaptions } from '../assets/images'
import portrait from '../assets/pic3 (2).jpg'
import BuildAppScreenshot from '../components/site/BuildAppScreenshot'
import { totalhomesGallery } from '../data/totalhomesGallery'
import { galleryDescriptions } from '../data/siteContent'
import './Home.css'

function OutboundLink({ href, children, className = '' }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`home-link ${className}`}>
      {children}<ArrowUpRight aria-hidden="true" size={17} />
    </a>
  )
}

const totalHomesUrl = 'https://www.totalhomes.es/'

// Marcas pequeñas del laboratorio: mismo lenguaje (oscuro y lima) que las miniaturas de /ai, solo decorativas.
function NeuralMark() {
  const layers = [[12, 28, 44], [8, 20, 32, 44], [20, 36]]
  return <svg viewBox="0 0 56 56" aria-hidden="true" focusable="false">
    {layers.slice(0, -1).flatMap((ys, layer) => ys.flatMap(y1 => layers[layer + 1].map(y2 => <line key={`${layer}-${y1}-${y2}`} x1={10 + layer * 18} y1={y1} x2={28 + layer * 18} y2={y2} />)))}
    {layers.flatMap((ys, layer) => ys.map(y => <circle key={`${layer}-${y}`} cx={10 + layer * 18} cy={y} r="2.6" />))}
  </svg>
}

function TetrisMark() {
  return <span className="home-mark-tetris" aria-hidden="true">
    {Array.from({ length: 30 }, (_, i) => <i key={i} className={[2, 3, 4, 8, 14].includes(i) ? 'magic' : i > 23 && i !== 27 ? 'solid' : undefined} />)}
  </span>
}

export default function Home() {
  const { t, language } = useLanguage()
  const copy = t('home')
  const storyPhotoIndex = 4, storyPhoto = totalhomesGallery[storyPhotoIndex]
  const selected = [
    { id: 're-lux', copy: copy.selected.relux, href: 'https://re-lux-frontend.netlify.app/' },
    { id: 'tradelab', copy: copy.selected.tradelab, href: 'https://trade-lab.netlify.app/' },
  ]

  return (
    <div className="home-showroom">
      <section className="home-hero home-width" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="home-role">{copy.hero.role}</p>
          <h1 id="home-title">{copy.hero.title}</h1>
          <p className="home-intro">{copy.hero.intro}</p>
          <div className="home-actions">
            <a href="#work" className="home-action">{copy.hero.work}<ArrowDown aria-hidden="true" size={18} /></a>
            <a href="#story" className="home-link">{copy.hero.story}</a>
          </div>
        </div>
        <figure className="home-portrait">
          <img src={portrait} alt={copy.hero.portraitAlt} width="719" height="720" fetchPriority="high" />
        </figure>
      </section>

      <section id="work" className="home-work" aria-labelledby="home-buildapp">
        <div className="home-width">
          <div className="home-work-heading">
            <p className="home-caption">{copy.work.label}</p>
            <h2 id="home-buildapp">{copy.work.title}</h2>
          </div>
          <div className="home-feature">
            <figure className="home-product">
              <div className="home-product-screens">{buildappMobileImages.map((image,index)=><BuildAppScreenshot key={image} src={image} alt={buildappCaptureCaptions[language][index+1]} width="598" height="1300" loading="lazy" />)}</div>
              <figcaption>{copy.work.caption}</figcaption>
            </figure>
            <div className="home-feature-copy">
              <h3>{copy.work.subtitle}</h3>
              <p>{copy.work.description}</p>
              <div className="home-responsibility">
                <span className="home-caption">{copy.work.roleLabel}</span>
                <p>{copy.work.role}</p>
              </div>
              <div className="home-actions">
                <Link to="/projects" className="home-action">{copy.work.detail}<ArrowUpRight aria-hidden="true" size={18} /></Link>
                <OutboundLink href="https://buildapp.es/">{copy.work.open}</OutboundLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-trading home-width" aria-labelledby="home-trading">
        <div>
          <p className="home-caption">{copy.trading.label}</p>
          <h2 id="home-trading">{copy.trading.title}</h2>
          <p className="home-tools">{copy.trading.tools}</p>
        </div>
        <div className="home-trading-copy">
          <p>{copy.trading.description}</p>
          <dl className="home-method">
            {copy.trading.points.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}
          </dl>
          <p className="home-note">{copy.trading.note}</p>
        </div>
      </section>

      <section className="home-selected home-width" aria-labelledby="home-selected">
        <div className="home-section-heading">
          <h2 id="home-selected">{copy.selected.title}</h2>
          <p>{copy.selected.intro}</p>
        </div>
        <div className="home-project-list">
          {selected.map(project => (
            <article className="home-project-row" key={project.id}>
              <img src={projectImages[project.id]} alt={project.copy.title} width="300" height="210" loading="lazy" />
              <div className="home-project-copy">
                <p className="home-caption">{project.copy.type}</p>
                <h3>{project.copy.title}</h3>
                <p>{project.copy.body}</p>
              </div>
              <OutboundLink href={project.href}>{project.copy.link}</OutboundLink>
            </article>
          ))}
        </div>
        <Link to="/projects" className="home-link home-list-link">{copy.selected.all}<ArrowUpRight aria-hidden="true" size={17} /></Link>
      </section>

      <section id="story" className="home-story" aria-labelledby="home-story">
        <div className="home-width home-story-layout">
          <div className="home-story-lead">
            <h2 id="home-story">{copy.about.title}</h2>
            <figure className="home-story-photo">
              <a href={totalHomesUrl} target="_blank" rel="noopener noreferrer" tabIndex={-1} className="home-story-photo-link">
                <img src={storyPhoto.image} alt={galleryDescriptions[language][storyPhotoIndex]} width="2560" height="2341" loading="lazy" decoding="async" />
              </a>
              <figcaption><OutboundLink href={totalHomesUrl}>{copy.about.photoLink}</OutboundLink></figcaption>
            </figure>
          </div>
          <div>
            <p>{copy.about.description}</p>
            <Link to="/about" className="home-link">{copy.about.more}<ArrowUpRight aria-hidden="true" size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="home-experiments home-width" aria-labelledby="home-experiments">
        <div className="home-experiments-copy">
          <h2 id="home-experiments">{copy.experiments.title}</h2>
          <p>{copy.experiments.body}</p>
          <Link to="/ai" className="home-link">{copy.experiments.all}<ArrowUpRight aria-hidden="true" size={17} /></Link>
        </div>
        <div className="home-experiment-links">
          <Link to="/ai/neural-network" className="home-experiment">
            <span className="home-experiment-mark"><NeuralMark /></span><span className="home-experiment-label">{copy.experiments.neural}</span><ArrowUpRight aria-hidden="true" size={18} />
          </Link>
          <Link to="/ai/tetris" className="home-experiment">
            <span className="home-experiment-mark"><TetrisMark /></span><span className="home-experiment-label">{copy.experiments.tetris}</span><ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>

      <section className="home-contact" aria-labelledby="home-contact">
        <div className="home-width home-contact-layout">
          <div>
            <h2 id="home-contact">{copy.contact.title}</h2>
            <p>{copy.contact.body}</p>
          </div>
          <div className="home-contact-links">
            <a href={`mailto:${profile.email}`} className="home-action">{copy.contact.action}<ArrowUpRight aria-hidden="true" size={18} /></a>
            <Link to="/resume" className="home-link">{copy.contact.cv}</Link>
            <div className="home-socials">
              <OutboundLink href={profile.github}>GitHub</OutboundLink>
              <OutboundLink href={profile.linkedin}>LinkedIn</OutboundLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
