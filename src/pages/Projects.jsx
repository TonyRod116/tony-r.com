import { useRef, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage.jsx'
import { projects } from '../data/projects'
import { projectShowcaseImages, buildappCaptureCaptions, buildappComparisonImages } from '../assets/images.js'
import { siteContent } from '../data/siteContent'
import SitePage, { PageLink } from '../components/site/SitePage'
import Modal from '../components/site/Modal'
import BuildAppScreenshot from '../components/site/BuildAppScreenshot'
import BeforeAfterSlider from '../components/BeforeAfterSlider'

function ProjectLinks({ project, copy }) {
  const links = [[project.liveUrl,copy.openProject],[project.frontendUrl,copy.frontend],[project.backendUrl,copy.backend],[project.githubUrl,copy.code]]
  const seen = new Set()
  return <div className="site-actions">{links.filter(([href]) => href && !seen.has(href) && seen.add(href)).map(([href,label]) => <PageLink key={href} to={href} target="_blank" rel="noopener noreferrer">{label}</PageLink>)}</div>
}

export default function Projects() {
  const { language } = useLanguage()
  const copy = siteContent[language], text = copy.projects
  const featured = projects.find(project => project.id === 'buildapp-pro')
  const captures = projectShowcaseImages['buildapp-pro']
  const [capture, setCapture] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const captureTrigger = useRef(null)
  return <SitePage title={text.title} intro={text.intro} kicker="TONY RODRÍGUEZ / PORTFOLIO">
    <article className="site-featured-project" id="buildapp-pro">
      <figure className="site-project-images">
        {capture===0 ? <div className="site-project-comparison">
          <BeforeAfterSlider originalImageUrl={buildappComparisonImages.before} renderedImageUrl={buildappComparisonImages.after} />
          <button ref={captureTrigger} className="site-button site-button-secondary" onClick={() => setLightbox(true)}>{text.captures}</button>
        </div> : <button ref={captureTrigger} onClick={() => setLightbox(true)} aria-label={text.captures}><BuildAppScreenshot trimHeader src={captures[capture]} alt={buildappCaptureCaptions[language][capture]} width="390" height="844" fetchPriority="high" /></button>}
        <div className="site-project-thumbnails">{captures.map((image,index) => <button key={image} onClick={() => setCapture(index)} aria-label={`${text.captures} ${index+1}`} aria-pressed={capture===index}><BuildAppScreenshot trimHeader={index>0} src={image} alt="" width="90" height="70" loading="lazy" /></button>)}</div>
        <figcaption>{buildappCaptureCaptions[language][capture]}</figcaption>
      </figure>
      <div><p className="site-kicker">{text.flagship}</p><h2>BuildApp Pro</h2><p>{text.buildDescription}</p><div className="site-project-role"><p className="site-kicker">{copy.role}</p><h3>{text.buildRole}</h3><p>{text.buildRoleText}</p></div><ul className="site-project-deliverables">{text.buildDeliverables.map(item => <li key={item}>{item}</li>)}</ul><p className="site-stack">{featured.stack.join(' · ')}</p><div className="site-actions"><PageLink to={featured.liveUrl} primary target="_blank" rel="noopener noreferrer">{copy.openBuildApp}</PageLink><PageLink to="/projects/buildapp-pro-sample-quote.pdf" target="_blank" rel="noopener noreferrer">{text.sample}</PageLink></div><div className="site-actions"><PageLink to={featured.appStoreUrl} target="_blank" rel="noopener noreferrer">App Store</PageLink><PageLink to={featured.googlePlayUrl} target="_blank" rel="noopener noreferrer">Google Play</PageLink></div></div>
    </article>
    <section className="site-section"><div className="site-section-heading"><h2>{copy.more}</h2></div>{projects.filter(project => project.id !== featured.id).map((project,index) => {
      const story = text.cases[project.id]
      return <article key={project.id} className="site-case" id={project.id}><img src={project.image} alt={project.title} className="site-case-image" loading="lazy" width="600" height="450" /><div className="site-case-copy"><span className="site-kicker">0{index+2} / {project.title}</span><h3>{story[0]}</h3><p>{story[1]}</p><details><summary>{copy.details}</summary><p>{story[2]}</p><p className="site-stack">{project.stack.join(' · ')}</p></details><ProjectLinks project={project} copy={copy} /></div></article>
    })}</section>
    <Modal open={lightbox} title={`${text.captures} · ${capture+1}/${captures.length}`} closeLabel={copy.close} onClose={() => {setLightbox(false);captureTrigger.current?.focus({preventScroll:true})}} large
      footer={<><button className="site-button site-button-secondary" onClick={() => setCapture(index => (index+captures.length-1)%captures.length)}>{copy.previous}</button><button className="site-button site-button-secondary" onClick={() => setCapture(index => (index+1)%captures.length)}>{copy.next}</button></>}>
      {capture===0 ? <div className="site-project-comparison"><BeforeAfterSlider originalImageUrl={buildappComparisonImages.before} renderedImageUrl={buildappComparisonImages.after} /></div> : <BuildAppScreenshot trimHeader src={captures[capture]} alt={buildappCaptureCaptions[language][capture]} />}
      <p className="site-note site-project-capture-note">{buildappCaptureCaptions[language][capture]}</p>
    </Modal>
  </SitePage>
}
