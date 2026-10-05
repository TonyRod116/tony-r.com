import { useEffect, useRef } from 'react'
import { useLanguage } from '../hooks/useLanguage.jsx'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'en', name: 'EN', label: 'English' },
  { code: 'es', name: 'ES', label: 'Español' },
  { code: 'ca', name: 'CAT', label: 'Català' }
]

export default function LanguageSelector({ onLanguageChange }) {
  const { language, changeLanguage, t } = useLanguage()
  const details = useRef(null)

  useEffect(() => {
    const closeOutside = event => {
      if (details.current && !details.current.contains(event.target)) details.current.open = false
    }
    const closeWithEscape = event => {
      if (event.key === 'Escape' && details.current?.open) {
        details.current.open = false
        details.current.querySelector('summary').focus()
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeWithEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [])

  return (
    <details ref={details} className="relative">
      <summary role="button" className="flex cursor-pointer list-none items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
        <Globe aria-hidden="true" className="h-4 w-4" />
        <span className="text-sm font-medium text-center"><span className="sr-only">{t('nav.language')}: </span>{languages.find(item => item.code === language)?.name}</span>
      </summary>
      <div className={`absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 ${onLanguageChange ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
        <div className="py-2">
          {languages.map(item => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                changeLanguage(item.code)
                details.current.open = false
                onLanguageChange?.()
              }}
              lang={item.code}
              aria-current={language === item.code ? 'true' : undefined}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-400 ${language === item.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}
            >
              <span className="text-sm">{item.label}</span>
              {language === item.code && <span aria-hidden="true" className="ml-auto text-primary-600 dark:text-primary-400">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </details>
  )
}
