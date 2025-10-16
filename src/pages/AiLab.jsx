import { motion } from 'framer-motion'
import { ExternalLink, Github, Play, Brain, Zap, Target, Network, Gamepad2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage.jsx'

export default function AiLab() {
  const { t } = useLanguage()

  const aiProjects = [
    {
      id: 'ttt',
      title: t('aiLab.projects.ttt.title'),
      description: t('aiLab.projects.ttt.description'),
      icon: Target,
      demoUrl: '/ai/tictactoe',
      githubUrl: 'https://github.com/TonyRod116/Ai-Tic-Tac-Toe',
      status: 'completed',
      tech: ['JavaScript', 'Minimax', 'AI']
    },
    {
      id: 'minesweeper',
      title: t('aiLab.projects.minesweeper.title'),
      description: t('aiLab.projects.minesweeper.description'),
      icon: Zap,
      demoUrl: '/ai/minesweeper',
      githubUrl: 'https://github.com/TonyRod116/Ai-Minesweeper',
      status: 'completed',
      tech: ['JavaScript', 'Algorithm', 'Logic']
    },
    {
      id: 'nim',
      title: t('aiLab.projects.nim.title'),
      description: t('aiLab.projects.nim.description'),
      icon: Brain,
      demoUrl: '/ai/nim',
      githubUrl: 'https://github.com/TonyRod116/AI-Nim',
      status: 'completed',
      tech: ['JavaScript', 'Q-Learning', 'Reinforcement Learning']
    },
    {
      id: 'tetris',
      title: t('aiLab.projects.tetris.title'),
      description: t('aiLab.projects.tetris.description'),
      icon: Gamepad2,
      demoUrl: '/ai/tetris',
      githubUrl: 'https://github.com/TonyRod116/T-Tetris',
      status: 'completed',
      tech: ['JavaScript', 'Custom Physics', 'AI Simulation']
    },
    // {
    //   id: 'six-degrees',
    //   title: t('aiLab.projects.sixDegrees.title'),
    //   description: t('aiLab.projects.sixDegrees.description'),
    //   icon: Network,
    //   demoUrl: '/ai/sixdegrees',
    //   githubUrl: 'https://github.com/TonyRod116/AI-degrees-of-KB',
    //   status: 'completed',
    //   tech: ['JavaScript', 'Graph Theory', 'BFS']
    // }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('aiLab.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('aiLab.subtitle')}
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {aiProjects.map((project, index) => {
            const IconComponent = project.icon
            return (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-6">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    to={project.demoUrl}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {t('aiLab.playDemo')}
                  </Link>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('aiLab.comingSoon.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('aiLab.comingSoon.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Computer Vision', 'NLP', 'Reinforcement Learning', 'Neural Networks'].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-800 dark:text-purple-200 text-sm font-medium rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              {t('aiLab.cta.title')}
            </h2>
            <p className="text-blue-100 mb-6">
              {t('aiLab.cta.description')}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              {t('aiLab.cta.button')}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
