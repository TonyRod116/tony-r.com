import { motion } from 'framer-motion'
import { Github, Star, Clock } from 'lucide-react'
import { projects } from '../data/projects'

export default function Projects() {

  return (
    <div className="pt-16">
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Projects</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A selection of my most recent work, from value propositions 
              to complete implementation. Each project represents a unique challenge 
              and an opportunity to learn and grow.
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
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <div className="relative h-48 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/20 dark:to-blue-900/20 overflow-hidden">
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
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(project.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.stack.slice(0, 4).map((tech) => (
                          <span key={tech} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            {tech}
                          </span>
                        ))}
                        {project.stack.length > 4 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            +{project.stack.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {project.id === 'tradelab' && (
                        <>
                          <a
                            href="https://github.com/TonyRod116/TradingLab-Backend"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center gap-1"
                          >
                            <Github className="h-4 w-4" />
                            Backend
                          </a>
                          <a
                            href="https://github.com/TonyRod116/TradingLab"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center gap-1"
                          >
                            <Github className="h-4 w-4" />
                            Frontend
                          </a>
                        </>
                      )}
                      {project.id === 're-lux' && (
                        <>
                          <a
                            href="https://github.com/TonyRod116/Re-Lux-backend"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center gap-1"
                          >
                            <Github className="h-4 w-4" />
                            Backend
                          </a>
                          <a
                            href="https://github.com/TonyRod116/Re-Lux-frontend"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center gap-1"
                          >
                            <Github className="h-4 w-4" />
                            Frontend
                          </a>
                        </>
                      )}
                      {project.id === 'buildapp' && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center gap-1"
                        >
                          <Github className="h-4 w-4" />
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-300 rounded-md transition-colors"
                        >
                          Live
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
