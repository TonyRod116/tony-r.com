import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Code, Users, Zap, Target, Lightbulb, Heart, Cpu, Brain, TrendingUp, Shield, BookOpen } from 'lucide-react'
import { profile } from '../data/profile'
import { useLanguage } from '../hooks/useLanguage.jsx'
import profileImage from '../assets/pic3.jpg'

// Typewriter component
function Typewriter({ text, speed = 20, delay = 0, className = "" }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Reset when text changes (language change)
  useEffect(() => {
    setDisplayText('')
    setCurrentIndex(0)
  }, [text])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }
    }, delay + (currentIndex * speed))

    return () => clearTimeout(timer)
  }, [currentIndex, text, speed, delay])

  // Convert newlines to <br> tags
  const formattedText = displayText.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      {index < displayText.split('\n').length - 1 && <br />}
    </span>
  ))

  return <span className={className}>{formattedText}</span>
}

export default function About() {
  const { t } = useLanguage()
  
  // Ensure images are loaded before positioning
  useEffect(() => {
    const img = new Image()
    img.src = profileImage
    img.onload = () => {
      // Force re-render after image loads
      const parallaxElement = document.querySelector('[data-parallax="about-bg-parallax"]')
      if (parallaxElement) {
        parallaxElement.style.backgroundImage = `url(${profileImage})`
      }
    }
  }, [])
  
  // Parallax effect for background images and skill cards animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop
      
      // Background photo parallax (faster on mobile)
      const bgParallaxElement = document.querySelector('[data-parallax="about-bg-parallax"]')
      if (bgParallaxElement) {
        const isMobile = window.innerWidth <= 768
        const parallaxSpeed = isMobile ? 0.3 : 0.5 // Faster on mobile (0.8 vs 0.5)
        const offset = scrollY * parallaxSpeed
        bgParallaxElement.style.setProperty('--parallax-offset', `${offset}px`)
      }

      // Skill cards animation
      const skillCards = document.querySelectorAll('[data-skill-card]')
      const skillsSection = document.querySelector('[data-skills-section]')
      
      if (skillsSection && skillCards.length > 0) {
        const sectionRect = skillsSection.getBoundingClientRect()
        const sectionTop = sectionRect.top
        const sectionBottom = sectionRect.bottom
        const viewportHeight = window.innerHeight
        const isMobile = window.innerWidth <= 768
        
        skillCards.forEach((card, index) => {
          const rect = card.getBoundingClientRect()
          const cardTop = rect.top
          const cardBottom = rect.bottom
          
          if (isMobile) {
            // Mobile: alternating entrance from sides, stay once entered
            const isInViewport = cardTop < viewportHeight && cardBottom > 0
            const isLeftCard = index % 2 === 0
            const baseOffset = isLeftCard ? -100 : 100
            
            // Check if card has been animated before
            const hasBeenAnimated = card.dataset.animated === 'true'
            
            if (isInViewport && !hasBeenAnimated) {
              // Card is visible and hasn't been animated - animate in from side
              const cardCenter = rect.top + rect.height / 2
              const viewportCenter = viewportHeight / 2
              const distanceFromCenter = Math.abs(cardCenter - viewportCenter)
              const maxDistance = viewportHeight / 2
              const scrollProgress = Math.max(0, 1 - (distanceFromCenter / maxDistance))
              
              const currentOffset = baseOffset * (1 - scrollProgress)
              card.style.transform = `translateX(${currentOffset}px)`
              card.style.opacity = '1'
              
              // Mark as animated
              card.dataset.animated = 'true'
            } else if (hasBeenAnimated) {
              // Card has been animated - keep it in center
              card.style.transform = 'translateX(0px)'
              card.style.opacity = '1'
            } else {
              // Card not visible and not animated - reset to side
              card.style.transform = `translateX(${baseOffset}px)`
              card.style.opacity = '0.3'
            }
          } else {
            // Desktop: scroll-anchored appearance
            const isSectionVisible = sectionTop < viewportHeight && sectionBottom > 0
            const isScrollingDown = scrollY > (window.lastScrollY || 0)
            
            if (isSectionVisible && isScrollingDown) {
              // Scrolling down - show cards
              const delay = index * 200
              setTimeout(() => {
                card.style.transform = 'translateY(0)'
                card.style.opacity = '1'
              }, delay)
            } else if (!isScrollingDown && sectionTop > viewportHeight / 2) {
              // Scrolling up and section is above viewport - hide cards
              card.style.transform = 'translateY(20px)'
              card.style.opacity = '0'
            }
          }
        })
        
        // Store current scroll position for next comparison
        window.lastScrollY = scrollY
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-blue-900/20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                <Typewriter text={t('about.hero.title')} speed={0.3} delay={3} />
              </h1>
              <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 text-justify">
                <Typewriter 
                  text={`${t('about.hero.description1')}\n\n${t('about.hero.description2')}\n\n${t('about.hero.description3')}\n\n${t('about.hero.description4')}`} 
                  speed={0.002} 
                  delay={1} 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Background Photo Parallax */}
      <section className="relative h-[50vh] sm:h-[70vh] lg:h-[90vh] overflow-hidden">
        <div 
          data-parallax="about-bg-parallax"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${profileImage})`,
            backgroundPosition: '75% center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            transform: 'translateY(calc(var(--parallax-offset, 0px) - 400px))',
            transition: 'transform 0.1s ease-out',
            willChange: 'transform',
            minHeight: '50%',
            minWidth: '100%'
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </section>

      {/* Technical Expertise */}
      <section data-skills-section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('about.technical.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('about.technical.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div 
                data-skill-card
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                style={{
                  transform: 'translateY(20px)',
                  opacity: '0',
                  transition: 'transform 0.6s ease-out, opacity 0.6s ease-out'
                }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('about.technical.languages')}</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.languages.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div 
                data-skill-card
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                style={{
                  transform: 'translateY(20px)',
                  opacity: '0',
                  transition: 'transform 0.6s ease-out, opacity 0.6s ease-out'
                }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('about.technical.frameworks')}</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.frameworks.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div 
                data-skill-card
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                style={{
                  transform: 'translateY(20px)',
                  opacity: '0',
                  transition: 'transform 0.6s ease-out, opacity 0.6s ease-out'
                }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('about.technical.tools')}</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.tools.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div 
                data-skill-card
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                style={{
                  transform: 'translateY(20px)',
                  opacity: '0',
                  transition: 'transform 0.6s ease-out, opacity 0.6s ease-out'
                }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('about.technical.softSkills')}</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.soft.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* What I Bring */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('about.whatIBring.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('about.whatIBring.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <Cpu className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('about.whatIBring.technicalStack.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('about.whatIBring.technicalStack.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <Brain className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('about.whatIBring.problemSolving.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('about.whatIBring.problemSolving.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('about.whatIBring.productThinking.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('about.whatIBring.productThinking.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('about.whatIBring.collaboration.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('about.whatIBring.collaboration.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('about.whatIBring.resilience.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('about.whatIBring.resilience.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('about.whatIBring.continuousLearning.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('about.whatIBring.continuousLearning.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What I'm Looking For */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('about.lookingFor.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              {t('about.lookingFor.description')}
            </p>
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                "{t('about.lookingFor.quote')}"
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 sm:py-20 lg:py-24 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl font-bold text-white">{t('about.cta.title')}</h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              {t('about.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {t('about.cta.sendMessage')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors"
              >
                {t('about.cta.viewGitHub')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
