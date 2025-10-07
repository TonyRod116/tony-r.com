import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Github, Linkedin, Mail, Star, Zap, Users, Code, ChevronDown, ChevronUp } from 'lucide-react'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { useLanguage } from '../hooks/useLanguage.jsx'
import profileImage from '../assets/pic1.jpg'

export default function Home() {
  const { t } = useLanguage()
  const featuredProjects = projects.filter(project => project.featured).slice(0, 3)
  const [expandedProjects, setExpandedProjects] = useState({})

  const toggleExpanded = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }))
  }

  // Efecto de scroll que "come" la foto sincronizado con el contenido
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      
      // Calcular progreso basado en la altura de la ventana (más rápido)
      // La foto se "come" completamente en aproximadamente 1 ventana de scroll
      const scrollProgress = Math.min(scrollY / (windowHeight * 1), 1)
      
      // Aplicar clip-path que "come" la foto desde abajo
      const photoElement = document.getElementById('background-photo')
      if (photoElement) {
        // Crear efecto de "mordida" desde abajo hacia arriba
        const clipBottom = 100 - (scrollProgress * 100)
        photoElement.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipBottom}%, 0 ${clipBottom}%)`
        
        // También reducir opacidad gradualmente
        photoElement.style.opacity = Math.max(0.1, 1 - (scrollProgress * 0.9))
      }
    }

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="flex flex-col">
      {/* Main Content */}
      <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-transparent to-blue-50 dark:from-primary-900/20 dark:via-transparent dark:to-blue-900/20" />
        
        {/* Foto de fondo que se "come" al hacer scroll */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${profileImage})`,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            transform: 'translateZ(0)',
            willChange: 'clip-path'
          }}
          id="background-photo"
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20"
            >
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white drop-shadow-sm"
                >
                  {t('home.hero.titlePart1')}{' '}
                  <span className="gradient-text">{t('home.hero.titlePart2')}</span>{' '}
                  {t('home.hero.titlePart3')}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl text-gray-700 dark:text-gray-200 max-w-2xl drop-shadow-sm"
                >
                  {t('home.hero.subtitle')}
                </motion.p>
              </div>


              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/projects"
                  className="btn-primary group inline-flex items-center justify-center"
                >
                  {t('home.hero.cta.viewProjects')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={`mailto:${profile.email}?subject=Hiring Inquiry - ${profile.name}`}
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  {t('nav.hireMe')}
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center space-x-6 text-sm text-gray-700 dark:text-gray-200"
              >
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-primary-600 transition-colors drop-shadow-sm"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-primary-600 transition-colors drop-shadow-sm"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center space-x-2 hover:text-primary-600 transition-colors drop-shadow-sm"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Espacio para la foto (se llenará con el efecto de fondo) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-96 lg:h-[500px]"
            >
              {/* Este espacio se llenará con la foto de fondo */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('home.about.title')}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('home.about.description')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{t('home.skills.languages')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.languages.map((skill) => (
                      <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{t('home.skills.frameworks')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.frameworks.map((skill) => (
                      <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{t('about.technical.tools')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.tools.map((skill) => (
                      <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Link to="/about" className="btn-secondary inline-flex">
                {t('home.about.moreAboutMe')}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">35+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.stats.repositories')}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{t('home.stats.problemSolving')}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.stats.orientedBy')}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">15+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.stats.yearsLeading')}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{t('home.stats.continuousLearning')}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.stats.drivenBy')}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('home.projects.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('home.projects.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-80 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/20 dark:to-blue-900/20 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    {project.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                    <div className="mb-4">
                      <p className={`text-gray-600 dark:text-gray-300 text-sm ${!expandedProjects[project.id] ? 'line-clamp-2' : ''}`}>
                        {project.description}
                      </p>
                      {project.description.length > 100 && (
                        <button
                          onClick={() => toggleExpanded(project.id)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 flex items-center gap-1"
                        >
                          {expandedProjects[project.id] ? (
                            <>
                              <ChevronUp className="h-3 w-3" />
                              {t('home.projects.readLess')}
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3" />
                              {t('home.projects.readMore')}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.stack.slice(0, 3).map((tech) => (
                        <span key={tech} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* Backend and Frontend buttons row */}
                      <div className="flex gap-2">
                        {project.id === 'tradelab' && (
                          <>
                            <a
                              href="https://github.com/TonyRod116/TradingLab-Backend"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                              <Github className="h-4 w-4" />
                              {t('home.projects.backend')}
                            </a>
                            <a
                              href="https://github.com/TonyRod116/TradingLab"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                              <Github className="h-4 w-4" />
                              {t('home.projects.frontend')}
                            </a>
                          </>
                        )}
                        {project.id === 're-lux' && (
                          <>
                            <a
                              href="https://github.com/TonyRod116/Re-Lux-backend"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                              <Github className="h-4 w-4" />
                              {t('home.projects.backend')}
                            </a>
                            <a
                              href="https://github.com/TonyRod116/Re-Lux-frontend"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                              <Github className="h-4 w-4" />
                              {t('home.projects.frontend')}
                            </a>
                          </>
                        )}
                        {project.id === 'buildapp' && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center justify-center gap-1"
                          >
                            <Github className="h-4 w-4" />
                            {t('home.projects.github')}
                          </a>
                        )}
                      </div>
                      
                      {/* Live button row - full width below */}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-300 rounded-md transition-colors"
                        >
                          {t('home.projects.live')}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/projects" className="btn-primary inline-flex items-center">
              {t('home.projects.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl font-bold text-white">{t('home.cta.title')}</h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              {t('home.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/resume" className="btn-secondary bg-white/10 border-white text-white hover:bg-white hover:text-primary-600">
                {t('home.cta.viewResume')}
              </Link>
              <Link to="/contact" className="btn-secondary bg-white text-primary-600 hover:bg-gray-50">
                {t('home.cta.startProject')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </div>
  )
}
