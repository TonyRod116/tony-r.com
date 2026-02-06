import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileText, ImagePlus, ArrowRight, MessageSquare } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage.jsx'

export default function Demos() {
  const { t } = useLanguage()

  const demos = [
    {
      id: 'presupuesto-orientativo',
      slug: 'presupuesto-orientativo',
      title: t('demos.presupuestoOrientativo.title'),
      description: t('demos.presupuestoOrientativo.description'),
      href: '/demos/presupuesto-orientativo',
      icon: FileText,
    },
    {
      id: 'render-presupuesto',
      slug: 'render-presupuesto',
      title: t('demos.renderPresupuesto.title'),
      description: t('demos.renderPresupuesto.description'),
      href: '/demos/render-presupuesto',
      icon: ImagePlus,
    },
    {
      id: 'lead-qualifier',
      slug: 'lead-qualifier',
      title: t('demos.leadQualifier.title'),
      description: t('demos.leadQualifier.description'),
      href: '/demos/lead-qualifier',
      icon: MessageSquare,
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
              {t('demos.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t('demos.subtitle')}
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
                className="group block rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 shadow-sm hover:shadow-md hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all"
              >
                <div className="flex items-start gap-4">
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
                    <span className="mt-3 inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400">
                      {t('demos.openDemo')}
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
