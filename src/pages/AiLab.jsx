import { motion, useScroll, useTransform } from 'framer-motion'
import { ExternalLink, Github, Play, Brain } from 'lucide-react'
import tttIcon from '../assets/tictactoe.png'
import msIcon from '../assets/buscaminas.png'
import nimIcon from '../assets/nim.png'
import tetrisIcon from '../assets/ttris.png'
import parallaxBg from '../assets/04.png'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage.jsx'

export default function AiLab() {
  const { t } = useLanguage()
  
  // Parallax effect setup
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  
  // Local neon helpers for buttons
  const neonSolidButtonStyle = (from, to, border) => ({
    backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
    border: `1px solid ${border}`,
    boxShadow: '0 0 6px rgba(59,130,246,0.22), 0 0 10px rgba(99,102,241,0.14), inset 0 0 4px rgba(255,255,255,0.06)',
    filter: 'none',
    color: '#fff',
    textShadow: '0 0 2px rgba(255,255,255,0.16)'
  })

  const neonOutlineButtonStyle = (border, glow) => ({
    backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.32) 100%)',
    border: `2px solid ${border}`,
    boxShadow: `0 0 6px ${glow.replace('0.35', '0.22')}, inset 0 0 4px rgba(255,255,255,0.06)`,
    color: 'rgba(229,231,235,0.92)'
  })

  const aiProjects = [
    {
      id: 'ttt',
      title: t('aiLab.projects.ttt.title'),
      description: t('aiLab.projects.ttt.description'),
      icon: null,
      demoUrl: '/ai/tictactoe',
      githubUrl: 'https://github.com/TonyRod116/Ai-Tic-Tac-Toe',
      status: 'completed',
      tech: ['JavaScript', 'Minimax', 'AI']
    },
    {
      id: 'minesweeper',
      title: t('aiLab.projects.minesweeper.title'),
      description: t('aiLab.projects.minesweeper.description'),
      icon: null,
      demoUrl: '/ai/minesweeper',
      githubUrl: 'https://github.com/TonyRod116/Ai-Minesweeper',
      status: 'completed',
      tech: ['JavaScript', 'Algorithm', 'Logic']
    },
    {
      id: 'nim',
      title: t('aiLab.projects.nim.title'),
      description: t('aiLab.projects.nim.description'),
      icon: null,
      demoUrl: '/ai/nim',
      githubUrl: 'https://github.com/TonyRod116/AI-Nim',
      status: 'completed',
      tech: ['JavaScript', 'Q-Learning', 'Reinforcement Learning']
    },
    {
      id: 'tetris',
      title: t('aiLab.projects.tetris.title'),
      description: t('aiLab.projects.tetris.description'),
      icon: null,
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
    <div className="min-h-screen relative pt-20 overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[120%] z-0"
      >
        <img 
          src={parallaxBg}
          alt="Background"
          className="w-full h-full object-cover"
          style={{
            filter: 'brightness(0.3) blur(2px)'
          }}
        />
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10">
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
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-6">
                  {project.id === 'ttt' && (
                    <img src={tttIcon} alt="Tic-Tac-Toe" className="h-14 w-14" />
                  )}
                  {project.id === 'minesweeper' && (
                    <img src={msIcon} alt="Minesweeper" className="h-14 w-14" />
                  )}
                  {project.id === 'nim' && (
                    <img src={nimIcon} alt="Nim" className="h-14 w-14" />
                  )}
    {project.id === 'tetris' && (
      <img src={tetrisIcon} alt="Tetris" className="h-14 w-14" />
    )}
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
                    className="flex-1 px-4 py-2 rounded-lg font-medium transition-transform duration-200 flex items-center justify-center gap-2 active:scale-95 relative overflow-hidden group"
                    style={neonSolidButtonStyle('rgba(11, 60, 219, 0.95)', 'rgba(81, 12, 134, 0.95)', 'rgba(88,28,135,0.5)')}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 -left-[120%] w-[200%] skew-x-12 transition-transform duration-500 ease-out group-hover:translate-x-[140%]"
                      style={{
                        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 100%)',
                        clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)',
                        filter: 'blur(0.6px)'
                      }}
                    />
                    <Play className="h-4 w-4" />
                    {t('aiLab.playDemo')}
                  </Link>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg transition-transform duration-200 flex items-center justify-center active:scale-95 relative overflow-hidden group"
                    style={neonOutlineButtonStyle('rgba(99,102,241,0.55)', 'rgba(59,130,246,0.35)')}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 -left-[120%] w-[200%] skew-x-12 transition-transform duration-500 ease-out group-hover:translate-x-[140%]"
                      style={{
                        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 100%)',
                        clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)',
                        filter: 'blur(0.6px)'
                      }}
                    />
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
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
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
    </div>
  )
}
