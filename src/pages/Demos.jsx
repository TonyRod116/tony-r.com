import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { FileText, ArrowRight, MessageSquare } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage.jsx'
import budgetImg from '../assets/budget.jpg'
import leadImg from '../assets/leadq.jpg'

export default function Demos() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const intent = searchParams.get('intent')
  const getText = (key, fallback) => {
    const value = t(key)
    return value === key ? fallback : value
  }

  const demos = [
    {
      id: 'presupuesto-orientativo',
      slug: 'presupuesto-orientativo',
      title: t('solutions.presupuestoOrientativo.title'),
      description: t('solutions.presupuestoOrientativo.description'),
      href: '/demos/presupuesto-orientativo',
      icon: FileText,
      bgImage: budgetImg,
    },
    {
      id: 'lead-qualifier',
      slug: 'lead-qualifier',
      title: t('solutions.leadQualifier.title'),
      description: t('solutions.leadQualifier.description'),
      href: '/demos/lead-qualifier',
      icon: MessageSquare,
      bgImage: leadImg,
    },
  ]

  return (
    <div className="pt-16">
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-blue-50/20 dark:from-primary-900/10 dark:via-transparent dark:to-blue-900/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('solutions.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t('solutions.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto"
          >
            {demos.map((demo) => (
              <Link
                key={demo.id}
                to={demo.href}
                className="group block rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 shadow-sm hover:shadow-md hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all relative overflow-hidden"
                style={{
                  backgroundImage: `url(${demo.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div
                  className="absolute inset-0 bg-white/80 dark:bg-gray-800/80"
                  style={{ backdropFilter: 'blur(2px)' }}
                />
                <div className="relative flex items-start gap-4 z-10">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <demo.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {demo.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {demo.description}
                    </p>
                    {(() => {
                      const bulletsKey = demo.id === 'presupuesto-orientativo' 
                        ? 'solutions.presupuestoOrientativo.bullets'
                        : 'solutions.leadQualifier.bullets'
                      const bullets = t(bulletsKey)
                      const bulletsArray = Array.isArray(bullets) && bullets.length > 0 && typeof bullets[0] === 'string' ? bullets : []
                      return bulletsArray.length > 0 ? (
                        <ul className="mt-3 space-y-1.5">
                          {bulletsArray.map((bullet, idx) => (
                            <li key={idx} className="text-xs text-gray-600 dark:text-gray-300 flex items-start">
                              <span className="mr-1.5 text-primary-600 dark:text-primary-400">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null
                    })()}
                    <span className="mt-3 inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400">
                      {(() => {
                        if (demo.id === 'presupuesto-orientativo') {
                          const cta = t('solutions.presupuestoOrientativo.cta')
                          return cta && cta !== 'solutions.presupuestoOrientativo.cta' ? cta : 'Probar ahora gratis'
                        } else if (demo.id === 'lead-qualifier') {
                          const cta = t('solutions.leadQualifier.cta')
                          return cta && cta !== 'solutions.leadQualifier.cta' ? cta : 'Ver demo en vivo'
                        }
                        return t('solutions.openDemo')
                      })()}
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <p className="mt-4 inline-flex items-center text-xs font-semibold text-gray-700 dark:text-gray-200">
                      {getText('solutions.implementCta', 'Implement this in my company')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="max-w-4xl mx-auto mt-8"
          >
            <div className="rounded-lg border border-primary-200 dark:border-primary-700 bg-primary-50/70 dark:bg-primary-900/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                  {intent === 'company'
                    ? getText('solutions.companyBannerTitle', 'Company mode: implementation-focused')
                    : getText('solutions.companyBannerTitleDefault', 'Want this running in your company?')}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {getText('solutions.companyBannerDesc', 'I can adapt these workflows to your process, team, and sales pipeline.')}
                </p>
              </div>
              <Link
                to="/contact?intent=company"
                className="btn-primary inline-flex items-center whitespace-nowrap"
              >
                {getText('solutions.companyBannerCta', 'Talk implementation')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
