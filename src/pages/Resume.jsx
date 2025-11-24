import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Mail, MapPin, Github, Linkedin, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { profile } from '../data/profile'
import { useLanguage } from '../hooks/useLanguage.jsx'
import cvPdfEn from '../assets/CV Tony Rodriguez EN.pdf'
import cvPdfEs from '../assets/_CV Tony Rodriguez ES.pdf'
import cvThumbnail from '../assets/CVthumb.png'
import cvThumbnailEs from '../assets/CVthumb_ES.png'
import harvardAIPdf from '../assets/CS50_Harvard_AI.pdf'
import harvardAIThumbnail from '../assets/Harvard_AI.png'
import gaPdf from '../assets/General_Assembly.pdf'
import gaThumbnail from '../assets/GA.png'
import { totalhomesGallery } from '../data/totalhomesGallery'

const skillFallbackLabels = {
  strategicPlanning: 'Strategic Planning',
  budgetManagement: 'Budget Management',
  operationalEfficiency: 'Operational Efficiency',
  endToEndDelivery: 'End-to-End Project Delivery',
  riskManagement: 'Risk Management',
  qualityAssurance: 'Quality Assurance & Standards Compliance',
  vendorCoordination: 'Vendor & Supplier Coordination',
  stakeholderManagement: 'Stakeholder Management',
  negotiationConflictResolution: 'Negotiation & Conflict Resolution',
  clientDiscovery: 'Client Discovery & Needs Analysis',
  crossFunctionalLeadership: 'Cross-Functional Team Leadership',
  digitalWorkflow: 'Digital Workflow Implementation',
  ambiguousNeedsToSolutions: 'Turning Ambiguous Needs into Concrete Solutions'
}

export default function Resume() {
  const { t, language } = useLanguage()
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null)

  const totalGalleryItems = totalhomesGallery.length
  const galleryMidpoint = Math.ceil(totalGalleryItems / 2)
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
        fileName = (language === 'es' || language === 'ca') ? 'Tony_Rodriguez_CV_ES.pdf' : 'Tony_Rodriguez_CV_EN.pdf'
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
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{profile.title}</p>
                
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
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {getText('resume.aboutMeContent', profile.currentBio)}
                </p>
              </div>

              {/* Experience */}
              <div className="mb-8">
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
                      <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                        {getText(`resume.experienceDetails.${exp.id}.description`, exp.description)}
                      </p>
                      {exp.id === 'totalhomes' && (
                        <div className="space-y-5 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                              Selected Total Homes Builds
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {totalhomesGallery.map((project) => (
                                <figure
                                  key={project.id}
                                  className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/30"
                                >
                                  <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-40 object-cover"
                                    loading="lazy"
                                  />
                                  <figcaption className="p-3">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                      {project.title}
                                    </p>
                                    {(project.scope || project.description) && (
                                      <p className="text-xs text-gray-600 dark:text-gray-300">
                                        {project.scope || project.description}
                                      </p>
                                    )}
                                  </figcaption>
                                </figure>
                              ))}
                            </div>
                          </div>
                          {keySkillsBlock}
                        </div>
                      )}
                      {exp.id !== 'totalhomes' && keySkillsBlock}
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
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                      {getText('resume.languages', 'Languages')}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.languages.map((skill) => (
                        <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                      {getText('resume.frameworks', 'Frameworks')}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.frameworks.map((skill) => (
                        <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                      {getText('resume.tools', 'Tools')}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.tools.map((skill) => (
                        <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                      {getText('resume.soft', 'Soft Skills')}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.soft.map((skill) => (
                        <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-xs">
                          {getText(`resume.softSkills.${skill}`, skill)}
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
                      {getText('resume.achievement5', 'Successful founder with exceptional reputation in the construction sector')}
                    </span>
                  </li>
                </ul>
              </div>

              {/* TotalHomes Highlights */}
              {totalhomesGallery.length > 0 && (
                <div className="mb-10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {getText('resume.totalhomes.title', 'TotalHomes Signature Builds')}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {getText(
                          'resume.totalhomes.subtitle',
                          'Tap any thumbnail to view it full-screen and navigate through the gallery.'
                        )}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200 border border-primary-100 dark:border-primary-800">
                      {totalhomesGallery.length} photos
                    </span>
                  </div>

                  <div className="space-y-3">
                    {galleryRows.map((row, rowIndex) => (
                      <div key={`gallery-row-${rowIndex}`} className="flex gap-2">
                        {row.map((project, index) => {
                          const absoluteIndex = rowIndex === 0 ? index : galleryMidpoint + index
                          return (
                            <button
                              type="button"
                              key={project.id}
                              onClick={() => openPhoto(absoluteIndex)}
                              className="group relative flex-1 h-24 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                              aria-label={`${project.title} (${project.year})`}
                            >
                              <img
                                src={project.image}
                                alt={project.description || project.title}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <span className="sr-only">{project.description}</span>
                            </button>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                          <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                            {getText(`resume.education.${edu.id}.description`, edu.description)}
                          </p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Resume */}
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

                  {/* General Assembly Certificate */}
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

                  {/* Harvard AI Certificate */}
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
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
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