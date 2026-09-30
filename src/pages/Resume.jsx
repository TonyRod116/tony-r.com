import { useState } from 'react'
import { profile } from '../data/profile'
import { siteContent, galleryDescriptions } from '../data/siteContent'
import { totalhomesGallery } from '../data/totalhomesGallery'
import { cvDocuments, certificateDocuments } from '../data/documents'
import { useLanguage } from '../hooks/useLanguage.jsx'
import SitePage, { PageLink } from '../components/site/SitePage'
import Modal from '../components/site/Modal'

export default function Resume() {
  const { language, t } = useLanguage()
  const copy = siteContent[language]
  const [document, setDocument] = useState(null)
  const [photoIndex, setPhotoIndex] = useState(null)
  const cv = cvDocuments[language === 'en' ? 'en' : 'es']
  const documents = [cv,...certificateDocuments.map((item,index) => ({...item,title:copy.resume.certTitles[index]}))]
  const photo = photoIndex === null ? null : totalhomesGallery[photoIndex]
  const movePhoto = delta => setPhotoIndex(index => (index+delta+totalhomesGallery.length)%totalhomesGallery.length)
  const photoTitle = photoIndex === null ? '' : `${copy.gallery} · ${photoIndex+1}/${totalhomesGallery.length}`
  return <SitePage title={copy.resume.title} intro={copy.resume.intro} kicker={copy.resume.kicker}>
    <section className="site-section"><p className="site-resume-summary">{copy.resume.summary}</p><div className="site-actions">{Object.entries(cvDocuments).map(([lang,item]) => <a className="site-button" key={lang} href={item.pdf} download>{lang==='es'?copy.spanishPdf:copy.englishPdf}</a>)}</div><p className="site-note">{copy.languages}</p></section>
    <section className="site-section"><div className="site-section-heading"><h2>{copy.experience}</h2></div><div className="site-timeline">{profile.experience.map((item,index) => {
      const descriptionKey = `resume.experienceDetails.${item.id}.description`
      const description = t(descriptionKey)
      const paragraphs = typeof description === 'string' && description !== descriptionKey ? description.split('\n\n') : []
      const responsibilities = t(`resume.experienceDetails.${item.id}.responsibilities`)
      const achievements = t(`resume.experienceDetails.${item.id}.achievements`)
      const evidence = [...(Array.isArray(responsibilities)?responsibilities:[]),...(Array.isArray(achievements)?achievements:[])]
      return <article className="site-experience" key={item.id}><span className="site-period">{item.period.replace('Present',copy.now)}</span><div><h3>{item.company}</h3><h4>{copy.resume.roles[index]}</h4><p>{copy.resume.summaries[index]}</p>{(evidence.length>0 || paragraphs.length>0) && <details><summary>{copy.responsibilities}</summary>{evidence.length===0 && paragraphs.map(text => <p key={text}>{text}</p>)}<ul>{evidence.map(text => <li key={text}>{text}</li>)}</ul></details>}{item.url && <PageLink to={item.url} target="_blank" rel="noopener noreferrer">{item.company.split(' (')[0]}</PageLink>}{item.links && <div className="site-actions">{item.links.map(link => <PageLink key={link.url} to={link.url} target="_blank" rel="noopener noreferrer">{link.label}</PageLink>)}</div>}</div></article>
    })}</div></section>
    <section className="site-section site-two-column"><div><h2>{copy.education}</h2></div><div className="site-education">{profile.education.map(item => {
      const key=`resume.education.${item.id}`
      const degree=item.id==='uic'?copy.resume.studiedArchitecture:item.id==='asb'?copy.resume.school:t(`${key}.degree`)
      const institution=t(`${key}.institution`)
      return <article key={item.id}><span className="site-kicker">{item.period}</span><div><h3>{degree}</h3><p>{institution}</p></div></article>
    })}</div></section>
    <section className="site-section"><div className="site-section-heading"><h2>{copy.certificates}</h2></div><div className="site-documents">{documents.map(item => <button key={item.id} className="site-document" onClick={() => setDocument(item)} aria-label={`${copy.view} · ${item.title}`}><img src={item.thumbnail} alt={item.title} width="400" height="300" loading="lazy" /><span>{item.title}</span></button>)}</div></section>
    <section className="site-section"><div className="site-section-heading"><h2>{copy.gallery}</h2><p>{copy.galleryIntro}</p></div><div className="site-gallery">{totalhomesGallery.slice(0,6).map((item,index) => <button key={item.id} onClick={() => setPhotoIndex(index)} aria-label={`${copy.galleryItem} ${index+1}`}><img src={item.image} alt={galleryDescriptions[language][index]} width="600" height="450" loading="lazy" /></button>)}</div><div className="site-actions"><button className="site-button" onClick={() => setPhotoIndex(0)}>{copy.galleryAll} · {totalhomesGallery.length}</button></div></section>
    <section className="site-section site-two-column"><h2>{copy.stack}</h2><div><p>{copy.resume.workTools}</p><div className="site-actions"><PageLink to="/projects">{copy.allProjects}</PageLink><PageLink to="/contact">{copy.talk}</PageLink></div></div></section>
    <Modal open={Boolean(document)} title={document?.title} closeLabel={copy.close} onClose={() => setDocument(null)} large
      footer={document && <><p className="site-note">{copy.pdfHint}</p><a className="site-link" href={document.pdf} target="_blank" rel="noopener noreferrer">{copy.openOriginal}</a><a className="site-button" href={document.pdf} download>{copy.download}</a></>}>
      {document && <iframe title={document.title} src={`${document.pdf}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`} />}
    </Modal>
    <Modal open={Boolean(photo)} title={photoTitle} closeLabel={copy.close} onClose={() => setPhotoIndex(null)} large onKeyDown={event => {if(event.key==='ArrowLeft'){event.preventDefault();movePhoto(-1)}if(event.key==='ArrowRight'){event.preventDefault();movePhoto(1)}}}
      footer={<><button className="site-button site-button-secondary" onClick={() => movePhoto(-1)}>{copy.previous}</button><p className="site-note">{photo?.id==='th-photo-23'?copy.galleryRender:galleryDescriptions[language][photoIndex]}</p><button className="site-button site-button-secondary" onClick={() => movePhoto(1)}>{copy.next}</button></>}>
      {photo && <img src={photo.image} alt={galleryDescriptions[language][photoIndex]} />}
    </Modal>
  </SitePage>
}
