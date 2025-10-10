import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Github, Linkedin, Mail, Star, Zap, Users, Code, ChevronDown, ChevronUp } from 'lucide-react'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { useLanguage } from '../hooks/useLanguage.jsx'
import profileImage from '../assets/pic1.jpg'

// Component for animated numbers
function AnimatedNumber({ value, suffix = '', duration = 2000, delay = 0 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        const startTime = Date.now()
        const startValue = 0
        const endValue = parseInt(value)

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Linear animation for smoother entry
          const currentValue = Math.floor(startValue + (endValue - startValue) * progress)
          
          setCount(currentValue)
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }
        
        animate()
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [isInView, value, duration, delay])

  return (
    <span ref={ref} className="inline-block">
      {count}{suffix}
    </span>
  )
}

// Component for cards with scroll and zoom effect (entry only)
function ScrollAnimatedCard({ children, delay = 0, className = "" }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  // Zoom effect from background (entry only) - optimized for mobile
  const scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.5, 1, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1])
  const y = useTransform(scrollYProgress, [0, 0.3, 1], [50, 0, 0])
  
  // Subtle rotation reduced for mobile
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, 0])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ 
        scale, 
        opacity, 
        y,
        rotateX,
        transformOrigin: "center center",
        transformStyle: "preserve-3d"
      }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

// Component for section coming from the left (entry only)
function ScrollAnimatedSection({ children, delay = 0, className = "" }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  // Effect from left with zoom (entry only) - optimized for mobile
  const x = useTransform(scrollYProgress, [0, 0.3, 1], [-100, 0, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 1], [0.9, 1, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1])
  
  // Subtle rotation reduced for mobile
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 0, 0])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ 
        x, 
        scale, 
        opacity,
        rotateY,
        transformOrigin: "left center",
        transformStyle: "preserve-3d"
      }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

// Component for center project (from background)
function ScrollAnimatedProjectCenter({ children, delay = 0, className = "" }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  // Zoom effect from background (entry only) - optimized for mobile
  const scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.5, 1, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1])
  const y = useTransform(scrollYProgress, [0, 0.3, 1], [50, 0, 0])
  
  // Subtle rotation reduced for mobile
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, 0])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ 
        scale, 
        opacity, 
        y,
        rotateX,
        transformOrigin: "center center",
        transformStyle: "preserve-3d"
      }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

// Component for left project (from left)
function ScrollAnimatedProjectLeft({ children, delay = 0, className = "" }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  // Effect from left with zoom (entry only) - optimized for mobile
  const x = useTransform(scrollYProgress, [0, 0.3, 1], [-150, 0, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 1], [0.8, 1, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1])
  
  // Subtle rotation reduced for mobile
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-8, 0, 0])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ 
        x, 
        scale, 
        opacity,
        rotateY,
        transformOrigin: "left center",
        transformStyle: "preserve-3d"
      }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

// Component for right project (from right)
function ScrollAnimatedProjectRight({ children, delay = 0, className = "" }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  // Effect from right with zoom (entry only) - optimized for mobile
  const x = useTransform(scrollYProgress, [0, 0.3, 1], [150, 0, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 1], [0.8, 1, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1])
  
  // Subtle rotation reduced for mobile
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, 0])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ 
        x, 
        scale, 
        opacity,
        rotateY,
        transformOrigin: "right center",
        transformStyle: "preserve-3d"
      }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const { t } = useLanguage()
  const featuredProjects = projects.filter(project => project.featured).slice(0, 3)
  const [expandedProjects, setExpandedProjects] = useState({})
  const [backgroundPosition, setBackgroundPosition] = useState('center 30%')

  const toggleExpanded = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }))
  }

  // Handle responsive background position
  useEffect(() => {
    const updateBackgroundPosition = () => {
      if (window.innerWidth <= 768) {
        setBackgroundPosition('95% 50%')
      } else {
        setBackgroundPosition('center 30%')
      }
    }

    updateBackgroundPosition()
    window.addEventListener('resize', updateBackgroundPosition)
    
    return () => window.removeEventListener('resize', updateBackgroundPosition)
  }, [])

  // Scroll effect that "eats" the photo synchronized with content
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      
      // Calculate progress based on window height
      // Make the background photo move much slower than scroll (parallax effect)
      const isMobile = window.innerWidth <= 768
      const parallaxMultiplier = 0.5 // Your photo moves at 30% of scroll speed
      const clipMultiplier = 4 // Clip effect moves at normal speed
      
      const parallaxProgress = Math.min(scrollY / (windowHeight * clipMultiplier), 1)
      const clipProgress = Math.min(scrollY / (windowHeight * clipMultiplier), 1)
      
      // Apply parallax effect and clip-path to photo
      const photoElement = document.getElementById('background-photo')
      if (photoElement) {
        // Parallax effect: photo moves slower than scroll
        const translateY = scrollY * parallaxMultiplier
        photoElement.style.transform = `translateY(${translateY}px)`
        
        // Create "bite" effect from bottom to top
        const clipBottom = 100 - (clipProgress * 100)
        photoElement.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipBottom}%, 0 ${clipBottom}%)`
        
        // Also reduce opacity gradually
        photoElement.style.opacity = Math.max(0.1, 1 - (clipProgress * 0.9))
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
      <section className="relative overflow-hidden pt-20 min-h-screen">
        
        {/* Background photo that gets "eaten" on scroll */}
        <div 
          className="
            absolute inset-x-0 bottom-0 
            top-[6rem] sm:top-[6rem] lg:top-[10vh]
            z-0 bg-cover bg-right-bottom bg-no-repeat sm:bg-center w-full h-full
            pointer-events-none
          "
          style={{
            backgroundImage: `url(${profileImage})`,
            backgroundPosition: '85% center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            transform: 'translateZ(0)',
            willChange: 'clip-path',
            maxWidth: '100vw',
            maxHeight: '100vh',
            minHeight: '85%',
            minWidth: '100%'
          }}
          id="background-photo"
        />
        
        <div className="container mx-auto px-8 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 bg-gradient-to-br from-white via-blue-50/80 to-indigo-50/60 backdrop-blur-xl rounded-3xl px-8 py-8 sm:p-10 shadow-2xl border border-blue-100/50 mt-8 sm:mt-0 w-full"
            >
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-slate-800 drop-shadow-sm"
                >
                  {t('home.hero.titlePart1')}{' '}
                  <span className="gradient-text">{t('home.hero.titlePart2')}</span>{' '}
                  {t('home.hero.titlePart3')}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl text-slate-600 max-w-2xl drop-shadow-sm"
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
                className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-slate-600"
              >
                <div className="flex items-center space-x-6">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:text-indigo-600 transition-colors drop-shadow-sm"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:text-indigo-600 transition-colors drop-shadow-sm"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </a>
                </div>
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center space-x-2 hover:text-primary-600 transition-colors drop-shadow-sm"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Scroll down arrow - Mobile only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="lg:hidden flex justify-center mt-8"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center space-y-2 text-gray-300 dark:text-gray-400"
              >
                <span className="text-sm font-medium">{t('home.hero.scrollDown')}</span>
                <ChevronDown className="h-6 w-6" />
              </motion.div>
            </motion.div>

            {/* Space for photo (will be filled with background effect) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-96 lg:h-[500px]"
            >
              {/* This space will be filled with the background photo */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimatedSection 
              className="space-y-6"
              delay={0.1}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('home.about.title')}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('home.about.description')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{t('home.skills.languages')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.languages.map((skill) => (
                      <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 border border-primary-200 dark:border-primary-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{t('home.skills.frameworks')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.frameworks.map((skill) => (
                      <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 border border-primary-200 dark:border-primary-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{t('about.technical.tools')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.tools.map((skill) => (
                      <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 border border-primary-200 dark:border-primary-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Link to="/about" className="btn-secondary inline-flex">
                {t('home.about.moreAboutMe')}
              </Link>
            </ScrollAnimatedSection>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <ScrollAnimatedCard 
                className="bg-gradient-to-br from-white to-blue-50/50 p-6 rounded-2xl shadow-lg border border-blue-100/60 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-indigo-200"
                delay={0.1}
              >
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  <AnimatedNumber value="35" suffix="+" duration={1500} delay={200} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.stats.repositories')}</div>
              </ScrollAnimatedCard>
              
              <ScrollAnimatedCard 
                className="bg-gradient-to-br from-white to-blue-50/50 p-6 rounded-2xl shadow-lg border border-blue-100/60 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-indigo-200"
                delay={0.2}
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{t('home.stats.problemSolving')}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.stats.orientedBy')}</div>
              </ScrollAnimatedCard>
              
              <ScrollAnimatedCard 
                className="bg-gradient-to-br from-white to-blue-50/50 p-6 rounded-2xl shadow-lg border border-blue-100/60 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-indigo-200"
                delay={0.3}
              >
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  <AnimatedNumber value="15" suffix="+" duration={1500} delay={400} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.stats.yearsLeading')}</div>
              </ScrollAnimatedCard>
              
              <ScrollAnimatedCard 
                className="bg-gradient-to-br from-white to-blue-50/50 p-6 rounded-2xl shadow-lg border border-blue-100/60 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-indigo-200"
                delay={0.4}
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{t('home.stats.continuousLearning')}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.stats.drivenBy')}</div>
              </ScrollAnimatedCard>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProjects.map((project, index) => {
              // Determine which component to use based on position
              const ProjectComponent = index === 0 ? ScrollAnimatedProjectLeft : 
                                     index === 1 ? ScrollAnimatedProjectCenter : 
                                     ScrollAnimatedProjectRight
              
              return (
                <ProjectComponent
                  key={project.id}
                  className="group"
                  delay={index * 0.1}
                >
                  <div className="bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-indigo-200">
                    <div className="relative h-80 bg-gradient-to-br from-primary-900/20 to-blue-900/20 overflow-hidden">
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
                        <span key={tech} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border border-violet-200 shadow-sm">
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
                              className="flex-1 px-4 py-2 text-sm font-medium text-gray-200 hover:text-gray-400 border border-gray-200 hover:border-gray-200 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                              <Github className="h-4 w-4" />
                              {t('home.projects.backend')}
                            </a>
                            <a
                              href="https://github.com/TonyRod116/TradingLab"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2 text-sm font-medium text-gray-200 hover:text-gray-400 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center justify-center gap-1"
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
                              className="flex-1 px-4 py-2 text-sm font-medium text-gray-200 hover:text-gray-400 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                              <Github className="h-4 w-4" />
                              {t('home.projects.backend')}
                            </a>
                            <a
                              href="https://github.com/TonyRod116/Re-Lux-frontend"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2 text-sm font-medium text-gray-200 hover:text-gray-400 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center justify-center gap-1"
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
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-200 hover:text-gray-400 border border-gray-200 hover:border-gray-300 rounded-md transition-colors flex items-center justify-center gap-1"
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
                          className="block w-full text-center px-4 py-2 text-sm font-medium text-blue-800 hover:text-blue-900 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 rounded-md transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          {t('home.projects.live')}
                        </a>
                      )}
                    </div>
                    </div>
                  </div>
                </ProjectComponent>
              )
            })}
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
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-primary-600 to-primary-700 relative z-20 mt-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl font-bold text-white">{t('home.cta.title')}</h2>
            <p className="text-xl text-primary-50 max-w-2xl mx-auto">
              {t('home.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/resume" className="btn-secondary bg-white/20 border-white/30 text-white hover:bg-white hover:text-primary-600 transition-all duration-300">
                {t('home.cta.viewResume')}
              </Link>
              <Link to="/contact" className="btn-secondary bg-gradient-to-r from-white to-blue-50 text-indigo-600 hover:from-blue-50 hover:to-indigo-50 hover:text-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
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
