import { motion } from 'framer-motion'
import { Download, Mail, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react'
import { profile } from '../data/profile'
import { useLanguage } from '../hooks/useLanguage.jsx'
import cvPdfEn from '../assets/CV Tony Rodriguez EN.pdf'
import cvPdfEs from '../assets/_CV Tony Rodriguez ES.pdf'
import cvThumbnail from '../assets/CVthmb.png'

export default function Resume() {
  const { t, language } = useLanguage()
  
  const handleDownloadPDF = () => {
    // Select CV based on language
    const cvPdf = (language === 'es' || language === 'ca') ? cvPdfEs : cvPdfEn
    const fileName = (language === 'es' || language === 'ca') ? 'Tony_Rodriguez_CV_ES.pdf' : 'Tony_Rodriguez_CV_EN.pdf'
    
    // Create a temporary link to download the PDF
    const link = document.createElement('a')
    link.href = cvPdf
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
                  {profile.experience.map((exp, index) => (
                    <div key={exp.company} className="border-l-2 border-primary-200 dark:border-primary-800 pl-4 pl-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-base text-gray-900 dark:text-white">{exp.position}</h3>
                          {exp.url ? (
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
                      {exp.stack && exp.stack.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                            {getText('resume.keySkills', 'Key Skills')}:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {exp.stack.map((tech) => (
                              <span key={tech} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
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
                      {getText('resume.achievement1', 'Built 4 complete applications during intensive bootcamp, including TradeLab project highlighted by instructor')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {getText('resume.achievement2', 'Founded and managed construction company, delivering high-quality residential projects')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {getText('resume.achievement3', 'Led cross-functional teams and managed budgets from concept to delivery')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {getText('resume.achievement4', 'Developed digital workflows to improve transparency and efficiency in projects')}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 grid-cols-2 gap-2">
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

              {/* PDF Download Section */}
              <div className="mb-8 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-lg">
                  {getText('resume.download', 'Download CV')}
                </h2>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group cursor-pointer" onClick={handleDownloadPDF}>
                    <div className="relative overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-primary-500 transition-all duration-300 group-hover:shadow-xl">
                      <img 
                        src={cvThumbnail} 
                        alt="Tony Rodriguez CV Preview" 
                        className="w-48 h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                          <Download className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center">
                      {getText('resume.downloadText', 'Click to download PDF version')}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}