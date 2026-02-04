import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Mail, MapPin, Github, Linkedin, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { profile } from '../data/profile'
import { useLanguage } from '../hooks/useLanguage.jsx'
import cvPdfEn from '../assets/Tony_Rodriguez_Solutions_Engineer_EN.pdf'
import cvPdfEs from '../assets/Tony_Rodriguez_Solutions_Engineer_ES.pdf'
import cvThumbnail from '../assets/CVthumb.png'
import cvThumbnailEs from '../assets/CVthumb_ES.png'
import harvardAIPdf from '../assets/CS50_Harvard_AI.pdf'
import harvardAIThumbnail from '../assets/Harvard_AI.png'
import gaPdf from '../assets/General_Assembly.pdf'
import gaThumbnail from '../assets/GA.png'
import stanfordMLAdvancedAlgosPdf from '../assets/Stanford_ML_ Advanced_Algos.pdf'
import stanfordMLSupervisedLearningPdf from '../assets/Stanford_ML_ Supervised_Learning.pdf'
import stanfordMLUnsupervisedLearningPdf from '../assets/Stanford_ML_ Unsupervised_Learning.pdf'
import mlSpecializationPdf from '../assets/ML_Specialization.pdf'
import stanfordThumbnail from '../assets/Stanford_thumb.png'
import mlSpecThumbnail from '../assets/ML_Spec_thumb.png'
import { totalhomesGallery } from '../data/totalhomesGallery'

const skillFallbackLabels = {
  // TotalHomes skills
  'Project & Operations Management': 'Project & Operations Management',
  'Cross-Functional Team Leadership': 'Cross-Functional Team Leadership',
  'Client Discovery & Needs Analysis': 'Client Discovery & Needs Analysis',
  'High-Stakes Decision Making': 'High-Stakes Decision Making',
  'Scope Definition & Requirements Gathering': 'Scope Definition & Requirements Gathering',
  'Negotiation & Conflict Resolution': 'Negotiation & Conflict Resolution',
  'Process Optimization & Digital Workflow Design': 'Process Optimization & Digital Workflow Design',
  'Turning Ambiguous Needs into Clear Execution Plans': 'Turning Ambiguous Needs into Clear Execution Plans',
  // Casex skills
  'Project Management': 'Project Management',
  'Client Relations': 'Client Relations',
  'Sales Strategy': 'Sales Strategy',
  // General Assembly skills (technologies - keep as is)
  'JavaScript': 'JavaScript',
  'React': 'React',
  'Node.js': 'Node.js',
  'Express': 'Express',
  'Python': 'Python',
  'Django': 'Django',
  'PostgreSQL': 'PostgreSQL',
  'MongoDB': 'MongoDB',
  'REST APIs': 'REST APIs',
  'Git/GitHub': 'Git/GitHub',
  'UNIX': 'CLI',
  'TDD': 'TDD',
  // Languages
  'SQL': 'SQL',
  // Frameworks
  'TensorFlow': 'TensorFlow',
  'scikit-learn': 'scikit-learn',
  'pandas': 'pandas',
  'numpy': 'numpy',
  // Tools
  'Git': 'Git',
  'GitHub': 'GitHub',
  'Postman': 'Postman',
  'Netlify': 'Netlify',
  'Heroku': 'Heroku',
  'Neon.tech': 'Neon.tech',
  'Agile/Scrum': 'Agile/Scrum',
  'OpenCV': 'OpenCV',
  'NLTK': 'NLTK'
}

export default function Resume() {
  const { t, language } = useLanguage()
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null)

  const totalGalleryItems = totalhomesGallery.length
  const galleryMidpoint = Math.ceil(totalGalleryItems / 2)
  
  // For mobile: show 6 photos (3 per row)
  const mobileGalleryItems = totalhomesGallery.slice(0, 6)
  const mobileGalleryRows = [
    mobileGalleryItems.slice(0, 3),
    mobileGalleryItems.slice(3)
  ]
  const mobileHiddenCount = Math.max(0, totalGalleryItems - mobileGalleryItems.length)
  
  // For tablet: show 8 photos (4 per row)
  const tabletGalleryItems = totalhomesGallery.slice(0, 8)
  const tabletGalleryRows = [
    tabletGalleryItems.slice(0, 4),
    tabletGalleryItems.slice(4)
  ]
  const tabletHiddenCount = Math.max(0, totalGalleryItems - tabletGalleryItems.length)
  
  // For desktop: show all photos in 2 rows
  const galleryRows = [
    totalhomesGallery.slice(0, galleryMidpoint),
    totalhomesGallery.slice(galleryMidpoint)
  ]
  const currentPhoto = selectedPhotoIndex !== null ? totalhomesGallery[selectedPhotoIndex] : null

  const openPhoto = (index) => setSelectedPhotoIndex(index)
  const closePhoto = () => setSelectedPhotoIndex(null)
  const goToPreviousPhoto = () => {
    if (!totalGalleryItems) return
    setSelectedPhotoIndex((prev) => (prev === null ? 0 : (prev - 1 + totalGalleryItems) % totalGalleryItems))
  }
  const goToNextPhoto = () => {
    if (!totalGalleryItems) return
    setSelectedPhotoIndex((prev) => (prev === null ? 0 : (prev + 1) % totalGalleryItems))
  }

  useEffect(() => {
    if (selectedPhotoIndex === null) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedPhotoIndex(null)
      } else if (event.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev === null ? 0 : (prev - 1 + totalGalleryItems) % totalGalleryItems))
      } else if (event.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev === null ? 0 : (prev + 1) % totalGalleryItems))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPhotoIndex, totalGalleryItems])
  
  const handleDownloadPDF = (type) => {
    let pdf, fileName, thumbnail
    
    switch(type) {
      case 'resume':
        pdf = (language === 'es' || language === 'ca') ? cvPdfEs : cvPdfEn
        fileName = (language === 'es' || language === 'ca') ? 'Tony_Rodriguez_Solutions_Engineer_ES.pdf' : 'Tony_Rodriguez_Solutions_Engineer_EN.pdf'
        thumbnail = (language === 'es' || language === 'ca') ? cvThumbnailEs : cvThumbnail
        break
      case 'harvard':
        pdf = harvardAIPdf
        fileName = 'Tony_Rodriguez_Harvard_AI_Certificate.pdf'
        thumbnail = harvardAIThumbnail
        break
      case 'ga':
        pdf = gaPdf
        fileName = 'Tony_Rodriguez_General_Assembly_Certificate.pdf'
        thumbnail = gaThumbnail
        break
      case 'stanford-advanced-algos':
        pdf = stanfordMLAdvancedAlgosPdf
        fileName = 'Tony_Rodriguez_Stanford_ML_Advanced_Algorithms_Certificate.pdf'
        thumbnail = stanfordThumbnail
        break
      case 'stanford-supervised-learning':
        pdf = stanfordMLSupervisedLearningPdf
        fileName = 'Tony_Rodriguez_Stanford_ML_Supervised_Learning_Certificate.pdf'
        thumbnail = stanfordThumbnail
        break
      case 'stanford-unsupervised-learning':
        pdf = stanfordMLUnsupervisedLearningPdf
        fileName = 'Tony_Rodriguez_Stanford_ML_Unsupervised_Learning_Certificate.pdf'
        thumbnail = stanfordThumbnail
        break
      case 'stanford-ml-specialization':
        pdf = mlSpecializationPdf
        fileName = 'Tony_Rodriguez_Machine_Learning_Specialization_Certificate.pdf'
        thumbnail = mlSpecThumbnail
        break
      default:
        return
    }
    
    // Create a temporary link to download the PDF
    const link = document.createElement('a')
    link.href = pdf
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Fallback translations
  const getText = (key, fallback) => {
    const translation = t(key)
    return translation !== key ? translation : fallback
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-8 sm:py-12 lg:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-transparent to-blue-50 dark:from-primary-900/20 dark:via-transparent dark:to-blue-900/20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {getText('resume.title', 'Resume')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              {getText('resume.subtitle', 'Professional Experience & Skills')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resume Content */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{profile.name}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{getText('resume.nameTitle', 'Solutions Engineer focused on AI, automation, and business impact')}</p>
                
                {/* Contact Info */}
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <a 
                      href={`mailto:${profile.email}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Github className="h-4 w-4" />
                    <a 
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-600 transition-colors flex items-center gap-1"
                    >
                      github.com/TonyRod116
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Linkedin className="h-4 w-4" />
                    <a 
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-600 transition-colors flex items-center gap-1"
                    >
                      linkedin.com/in/tony-rod
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* About Me */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {getText('resume.aboutMe', 'About Me')}
                </h2>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
                  {getText('resume.aboutMeContent', profile.currentBio).split('\n\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph.trim()}
                      </p>
                    )
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {getText('resume.experience', 'Experience')}
                </h2>
                <div className="space-y-6 space-y-4">
                  {profile.experience.map((exp) => {
                    const hasStack = Array.isArray(exp.stack) && exp.stack.length > 0
                    const keySkillsBlock = hasStack && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                          {getText('resume.keySkills', 'Key Skills')}:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {exp.stack.map((skill) => {
                            const fallbackSkillLabel = skillFallbackLabels[skill] || skill
                            const label = getText(`resume.skillsMap.${skill}`, fallbackSkillLabel)
                            return (
                              <span
                                key={skill}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-xs"
                              >
                                {label}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )

                    return (
                      <div key={exp.company} className="border-l-2 border-primary-200 dark:border-primary-800 pl-4 pl-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-base text-gray-900 dark:text-white">{exp.position}</h3>
                          {exp.links && exp.links.length > 0 ? (
                            <div className="space-y-1">
                              <p className="text-primary-600 font-medium">{exp.company}</p>
                              <div className="flex flex-wrap gap-2">
                                {exp.links.map((link) => (
                                  <a
                                    key={link.url}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors group"
                                  >
                                    {link.label || link.url}
                                    <ExternalLink className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          ) : exp.url ? (
                            <a 
                              href={exp.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-600 font-medium hover:text-primary-700 transition-colors inline-flex items-center gap-1 group"
                            >
                              {exp.company}
                              <ExternalLink className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                            </a>
                          ) : (
                            <p className="text-primary-600 font-medium">{exp.company}</p>
                          )}
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 w-fit mt-1 sm:mt-0 text-xs">
                          {exp.period}
                        </span>
                      </div>
                      <div className="text-gray-600 dark:text-gray-300 mb-3 text-sm space-y-3">
                        {getText(`resume.experienceDetails.${exp.id}.description`, exp.description).split('\n\n').map((paragraph, index) => (
                          paragraph.trim() && (
                            <p key={index} className="mb-3 last:mb-0">
                              {paragraph.trim()}
                            </p>
                          )
                        ))}
                      </div>
                      {keySkillsBlock}
                      {exp.id === 'totalhomes' && totalhomesGallery.length > 0 && (
                        <div className="mt-5">
                          <div className="mb-3">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              {getText('resume.totalhomes.title', 'TotalHomes Signature Builds')}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              {getText(
                                'resume.totalhomes.subtitle',
                                'Tap any thumbnail to view it full-screen and navigate through the gallery.'
                              )}
                            </p>
                          </div>

                          <div className="space-y-3 md:space-y-2">
                            {/* Mobile: Show 6 photos (3 per row) */}
                            <div className="sm:hidden space-y-3">
                              {mobileGalleryRows.map((row, rowIndex) => (
                                <div key={`mobile-gallery-row-${rowIndex}`} className="flex gap-3">
                                  {row.map((project, index) => {
                                    const absoluteIndex = rowIndex === 0 ? index : 3 + index
                                    const isLastMobileThumb = (rowIndex * 3 + index) === mobileGalleryItems.length - 1
                                    const showMoreBadge = isLastMobileThumb && mobileHiddenCount > 0
                                    return (
                                      <button
                                        type="button"
                                        key={project.id}
                                        onClick={() => openPhoto(absoluteIndex)}
                                        className="group relative flex-1 aspect-square min-w-0 overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 transition-all duration-300 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-lg"
                                        aria-label={`${project.title} (${project.year})`}
                                      >
                                        <img
                                          src={project.image}
                                          alt={project.description || project.title}
                                          loading="lazy"
                                          className="h-full w-full object-cover transition-transform duration-500 ease-out scale-125 group-hover:scale-100"
                                        />
                                        {showMoreBadge && (
                                          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm font-semibold">
                                            +{mobileHiddenCount} {getText('resume.totalhomes.moreImagesLabel', 'images')}
                                          </span>
                                        )}
                                        <span className="sr-only">{project.description}</span>
                                      </button>
                                    )
                                  })}
                                </div>
                              ))}
                            </div>
                            
                            {/* Tablet: Show 8 photos (4 per row) */}
                            <div className="hidden sm:block md:hidden space-y-2">
                              {tabletGalleryRows.map((row, rowIndex) => (
                                <div key={`tablet-gallery-row-${rowIndex}`} className="flex gap-2">
                                  {row.map((project, index) => {
                                    const absoluteIndex = rowIndex === 0 ? index : 4 + index
                                    const isLastTabletThumb = (rowIndex * 4 + index) === tabletGalleryItems.length - 1
                                    const showMoreBadge = isLastTabletThumb && tabletHiddenCount > 0
                                    return (
                                      <button
                                        type="button"
                                        key={project.id}
                                        onClick={() => openPhoto(absoluteIndex)}
                                        className="group relative flex-1 aspect-square min-w-0 overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 transition-all duration-300 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-lg"
                                        aria-label={`${project.title} (${project.year})`}
                                      >
                                        <img
                                          src={project.image}
                                          alt={project.description || project.title}
                                          loading="lazy"
                                          className="h-full w-full object-cover transition-transform duration-500 ease-out scale-125 group-hover:scale-100"
                                        />
                                        {showMoreBadge && (
                                          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm font-semibold">
                                            +{tabletHiddenCount} {getText('resume.totalhomes.moreImagesLabel', 'images')}
                                          </span>
                                        )}
                                        <span className="sr-only">{project.description}</span>
                                      </button>
                                    )
                                  })}
                                </div>
                              ))}
                            </div>
                            
                            {/* Desktop: Show all photos */}
                            <div className="hidden md:block">
                              {galleryRows.map((row, rowIndex) => (
                                <div key={`gallery-row-${rowIndex}`} className="flex gap-2">
                                  {row.map((project, index) => {
                                    const absoluteIndex = rowIndex === 0 ? index : galleryMidpoint + index
                                    return (
                                      <button
                                        type="button"
                                        key={project.id}
                                        onClick={() => openPhoto(absoluteIndex)}
                                        className="group relative flex-1 aspect-square min-w-0 overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 transition-all duration-300 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-lg"
                                        aria-label={`${project.title} (${project.year})`}
                                      >
                                        <img
                                          src={project.image}
                                          alt={project.description || project.title}
                                          loading="lazy"
                                          className="h-full w-full object-cover transition-transform duration-500 ease-out scale-125 group-hover:scale-100"
                                        />
                                        <span className="sr-only">{project.description}</span>
                                      </button>
                                    )
                                  })}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    )
                  })}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-lg">
                  {getText('resume.skills', 'Skills')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">
                      {getText('resume.skillsCore', 'Core')}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {[
                        getText('resume.coreSolutionsEngineering', 'Solutions Engineering'),
                        getText('resume.corePreSales', 'Pre-Sales / Sales Engineering'),
                        getText('resume.coreProductDiscovery', 'Product Discovery'),
                        getText('resume.coreBusinessAlignment', 'Business & Technical Alignment'),
                        getText('resume.coreAutomationAI', 'Automation & AI')
                      ].map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">
                      {getText('resume.skillsTechnical', 'Technical')}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {[
                        getText('resume.technicalPython', 'Python'),
                        getText('resume.technicalJavaScript', 'JavaScript'),
                        getText('resume.technicalSQL', 'SQL'),
                        getText('resume.technicalML', 'TensorFlow, scikit-learn'),
                        getText('resume.technicalAPIs', 'APIs, Automation (Zapier, n8n)')
                      ].map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Achievements */}
              <div className="mb-8 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-lg">
                  {getText('resume.achievements', 'Key Achievements')}
                </h2>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {getText('resume.achievement1', 'Completed Harvard CS50 Introduction to Artificial Intelligence with Python, developing practical AI models for real-world applications')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {getText('resume.achievement2', 'Final project TradeLab recognized as one of the best by General Assembly instructor')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {getText('resume.achievement3', '3 out of 4 projects highlighted during Software Engineering bootcamp')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {getText('resume.achievement4', '6 years of experience leading teams and managing complex projects at TotalHomes')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {getText('resume.achievement5', '3 out of 4 projects highlighted during the Software Engineering bootcamp for product quality and execution.')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {getText('resume.achievement6', 'Founded and led a profitable company for 6+ years, managing teams, clients, budgets, and high-stakes decisions in complex environments.')}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Education */}
              <div className="mb-8 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-lg">
                  {getText('resume.educationTitle', 'Education')}
                </h2>
                <div className="space-y-4 space-y-2">
                  {profile.education.map((edu, index) => (
                    <div key={edu.institution} className="border-l-2 border-primary-200 dark:border-primary-800 pl-4 pl-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                            {getText(`resume.education.${edu.id}.degree`, edu.degree)}
                          </h3>
                          <p className="text-primary-600 font-medium text-sm">
                            {getText(`resume.education.${edu.id}.institution`, edu.institution)}
                          </p>
                          <div className="text-gray-600 dark:text-gray-300 text-xs mt-1 space-y-2">
                            {getText(`resume.education.${edu.id}.description`, edu.description).split('\n\n').map((paragraph, index) => (
                              paragraph.trim() && (
                                <p key={index} className="mb-2 last:mb-0">
                                  {paragraph.trim()}
                                </p>
                              )
                            ))}
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 w-fit mt-1 sm:mt-0 text-xs">
                          {edu.period}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="mb-8 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-lg">
                  {getText('resume.languages', 'Languages')}
                </h2>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {getText('resume.spanish', 'Spanish')}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm text-xs">
                      {getText('resume.native', 'Native')}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {getText('resume.english', 'English')}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm text-xs">
                      {getText('resume.advanced', 'Fluent')}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {getText('resume.catalan', 'Catalan')}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm text-xs">
                      {getText('resume.native', 'Native')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div className="mb-8 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-lg">
                  {getText('resume.interests', 'Interests')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  {getText('resume.interestsContent', profile.interests)}
                </p>
              </div>

              {/* Downloads Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-lg">
                  {getText('resume.downloads', 'Downloads')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {/* 1. Resume */}
                  <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer" onClick={() => handleDownloadPDF('resume')}>
                      <div className="relative overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-primary-500 transition-all duration-300 group-hover:shadow-xl">
                        <img 
                          src={(language === 'es' || language === 'ca') ? cvThumbnailEs : cvThumbnail} 
                          alt="Tony Rodriguez CV Preview" 
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                            <Download className="h-6 w-6 text-primary-600" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center font-medium">
                        {getText('resume.downloadResume', 'Download Resume')}
                      </p>
                    </div>
                  </div>

                  {/* 2. General Assembly Certificate */}
                  <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer" onClick={() => handleDownloadPDF('ga')}>
                      <div className="relative overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-primary-500 transition-all duration-300 group-hover:shadow-xl">
                        <img 
                          src={gaThumbnail} 
                          alt="General Assembly Certificate Preview" 
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                            <Download className="h-6 w-6 text-primary-600" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center font-medium">
                        {getText('resume.downloadGA', 'Download General Assembly Certificate')}
                      </p>
                    </div>
                  </div>

                  {/* 3. Stanford Machine Learning Specialization (Full Course) Certificate */}
                  <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer" onClick={() => handleDownloadPDF('stanford-ml-specialization')}>
                      <div className="relative overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-primary-500 transition-all duration-300 group-hover:shadow-xl">
                        <img 
                          src={mlSpecThumbnail} 
                          alt="Stanford Machine Learning Specialization Certificate Preview" 
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                            <Download className="h-6 w-6 text-primary-600" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center font-medium">
                        {getText('resume.downloadMLSpecialization', 'Download Stanford Machine Learning Specialization Certificate')}
                      </p>
                    </div>
                  </div>

                  {/* 4. Harvard AI Certificate */}
                  <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer" onClick={() => handleDownloadPDF('harvard')}>
                      <div className="relative overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-primary-500 transition-all duration-300 group-hover:shadow-xl">
                        <img 
                          src={harvardAIThumbnail} 
                          alt="Harvard AI Certificate Preview" 
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                            <Download className="h-6 w-6 text-primary-600" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center font-medium">
                        {getText('resume.downloadHarvardAI', 'Download Harvard AI Certificate')}
                      </p>
                    </div>
                  </div>

                  {/* 5. Stanford ML Advanced Algorithms Certificate */}
                  <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer" onClick={() => handleDownloadPDF('stanford-advanced-algos')}>
                      <div className="relative overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-primary-500 transition-all duration-300 group-hover:shadow-xl">
                        <img 
                          src={stanfordThumbnail} 
                          alt="Stanford ML Advanced Algorithms Certificate Preview" 
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                            <Download className="h-6 w-6 text-primary-600" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center font-medium">
                        {getText('resume.downloadStanfordAdvancedAlgos', 'Download Stanford ML Advanced Algorithms Certificate')}
                      </p>
                    </div>
                  </div>

                  {/* 6. Stanford ML Supervised Learning Certificate */}
                  <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer" onClick={() => handleDownloadPDF('stanford-supervised-learning')}>
                      <div className="relative overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-primary-500 transition-all duration-300 group-hover:shadow-xl">
                        <img 
                          src={stanfordThumbnail} 
                          alt="Stanford ML Supervised Learning Certificate Preview" 
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                            <Download className="h-6 w-6 text-primary-600" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center font-medium">
                        {getText('resume.downloadStanfordSupervisedLearning', 'Download Stanford ML Supervised Learning Certificate')}
                      </p>
                    </div>
                  </div>

                  {/* 7. Stanford ML Unsupervised Learning Certificate */}
                  <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer" onClick={() => handleDownloadPDF('stanford-unsupervised-learning')}>
                      <div className="relative overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-primary-500 transition-all duration-300 group-hover:shadow-xl">
                        <img 
                          src={stanfordThumbnail} 
                          alt="Stanford ML Unsupervised Learning Certificate Preview" 
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                            <Download className="h-6 w-6 text-primary-600" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center font-medium">
                        {getText('resume.downloadStanfordUnsupervisedLearning', 'Download Stanford ML Unsupervised Learning Certificate')}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  {getText('resume.downloadText', 'Click to download PDF')}
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </section>
      {currentPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <button
            type="button"
            onClick={closePhoto}
            className="absolute top-6 right-6 rounded-full border border-white/40 bg-black/40 p-2 text-white transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            aria-label={getText('resume.totalhomes.close', 'Close gallery')}
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goToPreviousPhoto}
            className="mr-4 rounded-full border border-white/30 bg-black/40 p-3 text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            aria-label={getText('resume.totalhomes.previous', 'Previous photo')}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="max-w-5xl w-full">
            <img
              src={currentPhoto.image}
              alt={currentPhoto.description || currentPhoto.title}
              className="w-full max-h-[80vh] object-contain shadow-2xl rounded-none"
            />
            <span className="sr-only">{currentPhoto.description}</span>
          </div>

          <button
            type="button"
            onClick={goToNextPhoto}
            className="ml-4 rounded-full border border-white/30 bg-black/40 p-3 text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            aria-label={getText('resume.totalhomes.next', 'Next photo')}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  )
}