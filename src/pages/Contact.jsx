import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { profile } from '../data/profile'
import { useLanguage } from '../hooks/useLanguage.jsx'
import { trackContactForm } from '../components/GoogleAnalytics'

export default function Contact() {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialIntent = searchParams.get('intent') === 'recruiter' ? 'recruiter' : 'company'
  const solution = searchParams.get('solution') || ''
  const [intent, setIntent] = useState(initialIntent)
  const getText = (key, fallback) => {
    const value = t(key)
    return value === key ? fallback : value
  }
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitError('')
    const form = e.currentTarget

    try {
      const response = await fetch(form.action, {
        method: form.method,
        headers: {
          'Accept': 'application/json',
        },
        body: new FormData(form)
      })

      let responseData = null
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        responseData = await response.json()
      }

      const hasApiErrors = Array.isArray(responseData?.errors) && responseData.errors.length > 0

      if (response.ok && !hasApiErrors) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
        trackContactForm() // Track successful form submission
      } else {
        setSubmitStatus('error')
        if (hasApiErrors) {
          setSubmitError(responseData.errors.map((err) => err.message).join(', '))
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setSubmitStatus('error')
      setSubmitError(t('contact.form.networkError', 'Network error. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-transparent to-blue-50 dark:from-primary-900/20 dark:via-transparent dark:to-blue-900/20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('contact.title')}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {intent === 'recruiter'
                ? getText('contact.subtitleRecruiter', 'Recruiter? I am open to roles in Solutions Engineering, AI automation, and product-focused software.')
                : getText('contact.subtitleCompany', 'Company? Let\'s talk about implementing AI and automation solutions tailored to your business.')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <form
                onSubmit={handleSubmit}
                action="https://formspree.io/f/mvgbjbvw"
                method="POST"
                className="space-y-6"
              >
                <div className="space-y-3 pt-1">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    {getText('contact.form.intentLabel', 'I am contacting you as')}
                  </label>
                  <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setIntent('recruiter')
                        const nextParams = new URLSearchParams(searchParams)
                        nextParams.set('intent', 'recruiter')
                        setSearchParams(nextParams)
                      }}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${intent === 'recruiter' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                    >
                      {getText('contact.form.intentRecruiter', 'Recruiter')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIntent('company')
                        const nextParams = new URLSearchParams(searchParams)
                        nextParams.set('intent', 'company')
                        setSearchParams(nextParams)
                      }}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${intent === 'company' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                    >
                      {getText('contact.form.intentCompany', 'Company')}
                    </button>
                  </div>
                  <input type="hidden" name="intent" value={intent} />
                  <input type="hidden" name="solution" value={solution} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('contact.form.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                    placeholder={t('contact.form.namePlaceholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('contact.form.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                    placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('contact.form.message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                    placeholder={intent === 'recruiter'
                      ? getText('contact.form.messagePlaceholderRecruiter', 'Share role, team, location/remote policy, and hiring timeline...')
                      : getText('contact.form.messagePlaceholderCompany', 'Share your process, goals, bottlenecks, and what you want to automate...')}
                  />
                </div>

                {/* Submit Status */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>{t('contact.form.successMessage')}</span>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg"
                  >
                    <AlertCircle className="h-5 w-5" />
                    <span>{submitError || t('contact.form.errorMessage')}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t('contact.form.sendMessage')}
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('contact.info.title')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{t('contact.info.email')}</p>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{t('contact.info.location')}</p>
                      <p className="text-gray-600 dark:text-gray-300">{profile.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('contact.social.title')}</h3>
                <div className="space-y-4">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Github className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">GitHub</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">@TonyRod116</p>
                    </div>
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Linkedin className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">LinkedIn</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Tony Rodríguez</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('contact.availability.title')}</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t('contact.availability.available')}</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {t('contact.availability.responseTime')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
