import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '../utils/cn'
import { useLanguage } from '../hooks/useLanguage.jsx'
import LanguageSelector from './LanguageSelector'

const navigation = [
  { name: 'home', href: '/' },
  { name: 'about', href: '/about' },
  { name: 'projects', href: '/projects' },
  { name: 'aiLab', href: '/ai' },
  { name: 'demos', href: '/demos' },
  { name: 'resume', href: '/resume' },
  { name: 'contact', href: '/contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const translatedNavigation = navigation.map(item => {
    const translatedName = t(`nav.${item.name}`)
    // Fallback si la traducción falla
    const displayName = translatedName && translatedName !== `nav.${item.name}` ? translatedName : item.name
    return {
      ...item,
      name: displayName
    }
  })

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700'
          : 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-bold text-sm md:text-sm lg:text-sm text-gray-900 dark:text-white drop-shadow-sm">Tony Rodríguez</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {translatedNavigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600 drop-shadow-sm',
                  location.pathname === item.href
                    ? 'text-primary-600'
                    : 'text-gray-700 dark:text-gray-200'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center">
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5 text-gray-700 dark:text-gray-200" /> : <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Outside container for proper positioning */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] md:hidden"
              style={{ top: '80px' }}
            />
            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="fixed top-20 right-0 w-64 max-w-[70vw] bg-white dark:bg-gray-900 backdrop-blur-md border-l border-gray-200 dark:border-gray-700 shadow-2xl z-[9999] md:hidden max-h-[calc(100vh-5rem)] flex flex-col"
            >
              {/* Navigation */}
              <nav className="flex-1 py-4 space-y-2 overflow-y-auto min-h-0">
                {translatedNavigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-4 py-2 text-sm font-medium rounded-md transition-colors mx-2',
                      location.pathname === item.href
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="px-4 pt-4 pb-4 flex-shrink-0">
                  <LanguageSelector onLanguageChange={() => setIsOpen(false)} />
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
