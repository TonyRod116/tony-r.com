import { motion } from 'framer-motion'
import { Github, Clock, ExternalLink } from 'lucide-react'
import { projects } from '../data/projects'
import { useLanguage } from '../hooks/useLanguage.jsx'

export default function Projects() {
  const { t } = useLanguage()

  return (
    <div className="pt-16">
      <section className="py-20 sm:py-24 lg:py-[120px]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('projects.title')}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('projects.subtitle')}
            </p>
          </motion.div>


          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-2 hover:border-primary-500/30 transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-80 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/20 dark:to-blue-900/20 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(project.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{project.title}</h3>
                    
                    {/* Short Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 font-medium">
                      {t(`projects.projects.${project.id}.description`)}
                    </p>

                    {/* Detailed Description */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('projects.overview')}</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                        {t(`projects.projects.${project.id}.longDescription`)}
                      </p>
                    </div>

                    {/* Key Features */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('projects.features')}</h4>
                      <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                        {t(`projects.projects.${project.id}.highlights`, { returnObjects: true }).map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Challenges */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('projects.challenges')}</h4>
                      <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                        {t(`projects.projects.${project.id}.challenges`, { returnObjects: true }).map((challenge, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('projects.techStack')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
                          <span key={tech} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Spacer to push buttons to bottom */}
                    <div className="flex-1"></div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mt-6">
                      {/* Backend and Frontend buttons row */}
                      <div className="flex gap-2">
                        {project.id === 'tradelab' && (
                          <>
                            <a
                              href="https://github.com/TonyRod116/TradingLab-Backend"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-600 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                              <Github className="h-4 w-4" />
                              {t('projects.backend')}
                            </a>
                            <a
                              href="https://github.com/TonyRod116/TradingLab"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-600 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                              <Github className="h-4 w-4" />
                              {t('projects.frontend')}
                            </a>
                          </>
                        )}
                        {project.id === 're-lux' && (
                          <>
                            <a
                              href="https://github.com/TonyRod116/Re-Lux-backend"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-600 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                              <Github className="h-4 w-4" />
                              {t('projects.backend')}
                            </a>
                            <a
                              href="https://github.com/TonyRod116/Re-Lux-frontend"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-600 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                              <Github className="h-4 w-4" />
                              {t('projects.frontend')}
                            </a>
                          </>
                        )}
                        {project.id === 'buildapp' && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-600 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center justify-center gap-1"
                          >
                            <Github className="h-4 w-4" />
                            {t('projects.github')}
                          </a>
                        )}
                      </div>
                      
                      {/* Live button row - full width below */}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-white bg-gray-100 hover:bg-blue-600 border border-gray-200 hover:border-blue-600 rounded-md transition-all duration-300"
                        >
                          {t('projects.live')}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>
    </div>
  )
}
