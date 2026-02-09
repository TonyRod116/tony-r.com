import { useState, useEffect, createContext, useContext } from 'react'
import { translations } from '../data/translations'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es')

  useEffect(() => {
    // Get language from localStorage or default to 'es' (Spanish)
    const savedLanguage = localStorage.getItem('portfolio-language')
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage)
      localStorage.setItem('portfolio-language', newLanguage)
    }
  }

  const t = (key) => {
    try {
      const keys = key.split('.')
      let value = translations[language]
      
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k]
        } else {
          return key // Return key if translation not found
        }
      }
      
      return value || key
    } catch (error) {
      console.error('Translation error:', error)
      return key
    }
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
