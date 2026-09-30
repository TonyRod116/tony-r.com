import { useLanguage } from '../hooks/useLanguage.jsx'
import { profile } from '../data/profile'
import { siteContent } from '../data/siteContent'
import SitePage, { PageLink } from '../components/site/SitePage'
import portrait from '../assets/surf.jpg'

export default function About() {
  const { language } = useLanguage()
  const copy = siteContent[language]
  const about = copy.about
  return <SitePage title={about.title} intro={about.intro} kicker={about.kicker} className="site-about"
    aside={<figure className="site-about-photo"><img src={portrait} alt={about.photoAlt} width="720" height="720" /></figure>}>
    <section className="site-section site-two-column"><h2>{about.story}</h2><div className="site-prose">{about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></section>
    <section className="site-section site-two-column"><h2>{about.lessonsTitle}</h2><div className="site-lessons">{about.lessons.map(([title,text],index) => <article key={title} className="site-lesson"><span>0{index+1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>
    <section className="site-section site-two-column"><div><p className="site-kicker">{copy.now}</p><h2>{about.presentTitle}</h2></div><div className="site-prose"><p>{about.present}</p><p className="site-stack">{profile.skills.languages.join(' · ')}<br />React · FastAPI · PostgreSQL · Capacitor · AWS S3 · Playwright</p><div className="site-actions"><PageLink to="/projects" primary>{copy.allProjects}</PageLink><PageLink to="/resume">{copy.cv}</PageLink></div></div></section>
  </SitePage>
}
