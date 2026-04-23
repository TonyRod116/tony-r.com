import { motion } from 'framer-motion'
import { ArrowUpRight, Clock, FileText, Github, Smartphone, Star } from 'lucide-react'
import { projects } from '../data/projects'
import { projectShowcaseImages } from '../assets/images.js'
import { useLanguage } from '../hooks/useLanguage.jsx'
import { cn } from '../utils/cn'

function formatProjectDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none">
      <path d="M3.5 2.8L13.9 13.2L3.5 21.2C3.2 20.9 3 20.5 3 20V4C3 3.5 3.2 3.1 3.5 2.8Z" fill="#00C2FF" />
      <path d="M13.9 13.2L17.2 16.5L6.8 22.2C6.3 22.5 5.7 22.4 5.2 22.1L13.9 13.2Z" fill="#31D17C" />
      <path d="M17.2 7.5L13.9 10.8L5.2 1.9C5.7 1.6 6.3 1.5 6.8 1.8L17.2 7.5Z" fill="#FFD84D" />
      <path d="M21 10.6C21.7 11 21.7 12 21 12.4L17.2 14.5L13.9 11.2L17.2 7.9L21 10.6Z" fill="#FF6B57" />
    </svg>
  )
}

function StoreBadge({ href, topLabel, bottomLabel, variant = 'appStore' }) {
  const isAppStore = variant === 'appStore'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex min-h-[68px] items-center gap-3 rounded-2xl border px-4 py-3 transition',
        isAppStore
          ? 'border-slate-900 bg-slate-900 text-white hover:border-slate-800 hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600 dark:hover:bg-slate-900'
          : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-950 dark:text-white dark:hover:border-slate-500 dark:hover:bg-slate-900'
      )}
    >
      <div className={cn(
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
        isAppStore ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
      )}>
        {isAppStore ? <Smartphone className="h-5 w-5" /> : <GooglePlayIcon />}
      </div>

      <div className="flex min-w-0 flex-col leading-none">
        <span className={cn(
          'text-[10px] font-semibold uppercase tracking-[0.18em]',
          isAppStore ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
        )}>
          {topLabel}
        </span>
        <span className="mt-1 text-base font-semibold">
          {bottomLabel}
        </span>
      </div>
    </a>
  )
}

function getProjectLinks(project, t) {
  const links = []

  const pushLink = (href, label, Icon, kind = 'default') => {
    if (href) {
      links.push({ href, label, Icon, kind })
    }
  }

  pushLink(project.appStoreUrl, t('projects.appStore'), Smartphone, 'appStore')
  pushLink(project.googlePlayUrl, t('projects.googlePlay'), GooglePlayIcon, 'googlePlay')
  pushLink(project.samplePdfUrl, t('projects.samplePdf'), FileText, 'default')
  pushLink(project.backendUrl, t('projects.backend'), Github, 'default')
  pushLink(project.frontendUrl, t('projects.frontend'), Github, 'default')
  pushLink(project.mobileUrl, t('projects.mobile'), Github, 'default')

  if (links.length === 0 && project.githubUrl) {
    pushLink(project.githubUrl, t('projects.github'), Github, 'default')
  }

  return links
}

function ProjectLinks({ project, t, compact = false }) {
  const links = getProjectLinks(project, t)
  const visibleLinks = compact ? links.slice(0, 4) : links
  const hasSingleLink = visibleLinks.length === 1

  return (
    <div className="flex flex-col gap-3">
      {visibleLinks.length > 0 && (
        <div className={cn(
          'grid gap-2',
          hasSingleLink
            ? 'grid-cols-1'
            : compact
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}>
          {visibleLinks.map((link) => {
            const Icon = link.Icon

            if (link.kind === 'appStore' || link.kind === 'googlePlay') {
              return (
                <StoreBadge
                  key={`${project.id}-${link.label}`}
                  href={link.href}
                  topLabel={t(link.kind === 'appStore' ? 'projects.appStoreTop' : 'projects.googlePlayTop')}
                  bottomLabel={link.label}
                  variant={link.kind}
                />
              )
            }

            return (
              <a
                key={`${project.id}-${link.label}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:text-blue-300',
                  hasSingleLink && 'w-full'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </a>
            )
          })}
        </div>
      )}

      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <ArrowUpRight className="h-4 w-4" />
          {t('projects.live')}
        </a>
      )}
    </div>
  )
}

function FeaturedMedia({ project, t }) {
  const images = projectShowcaseImages[project.id] || [project.image]
  const [primary, secondary, tertiary] = images

  return (
    <div className="relative isolate overflow-hidden rounded-[30px] border border-white/10 bg-slate-950 p-4 sm:p-5 lg:min-h-[560px]">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.18),transparent_30%)]" />

      <div className="relative flex h-full flex-col justify-between gap-6">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <Star className="mr-1.5 h-3 w-3" />
            {t('projects.featuredProject')}
          </span>
          <span className="inline-flex items-center rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-100 backdrop-blur">
            {t(`projects.projects.${project.id}.badge`)}
          </span>
        </div>

        <div className="grid min-h-[320px] gap-4 lg:min-h-[430px] lg:grid-cols-[minmax(0,1fr)_minmax(160px,0.36fr)] lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 shadow-[0_32px_90px_-36px_rgba(15,23,42,0.95)] lg:row-span-2">
            <img
              src={primary}
              alt={`${project.title} primary showcase`}
              className="h-full w-full object-cover object-top"
            />
          </div>

          {secondary && (
            <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/80 shadow-[0_28px_70px_-32px_rgba(15,23,42,0.95)] aspect-[9/16] lg:col-start-2 lg:row-start-1">
              <img
                src={secondary}
                alt={`${project.title} secondary showcase`}
                className="h-full w-full object-cover object-top"
              />
            </div>
          )}

          {tertiary && (
            <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-slate-900/85 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.95)] aspect-[9/16] lg:col-start-2 lg:row-start-2">
              <img
                src={tertiary}
                alt={`${project.title} supporting showcase`}
                className="h-full w-full object-cover object-top"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CompactProjectCard({ project, t, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 * index }}
      className="group h-full"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-700 dark:bg-slate-900">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={project.image}
            alt={project.title}
            className={cn(
              'h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]',
              project.id === 'buildapp' ? 'object-left-top' : 'object-top'
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:bg-slate-900/80 dark:text-slate-200">
              {t(`projects.projects.${project.id}.badge`)}
            </span>
          </div>

          <div className="absolute right-4 top-4">
            <span className="inline-flex items-center rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur">
              <Clock className="mr-1.5 h-3 w-3" />
              {formatProjectDate(project.date)}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 lg:p-7">
          <div className="mb-4">
            <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">{project.title}</h3>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {t(`projects.projects.${project.id}.description`)}
            </p>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {project.stack.slice(0, 4).map((tech) => (
              <span
                key={`${project.id}-${tech}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mb-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {t(`projects.projects.${project.id}.highlights`, { returnObjects: true }).slice(0, 2).map((item, itemIndex) => (
              <div key={`${project.id}-highlight-${itemIndex}`} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <ProjectLinks project={project} t={t} compact />
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const { t } = useLanguage()

  const heroProject = projects.find((project) => project.id === 'buildapp-pro') ?? projects[0]
  const projectOrder = {
    buildapp: 0,
    tradelab: 1,
    're-lux': 2,
    'buildapp-marketplace': 3,
  }

  const otherProjects = projects
    .filter((project) => project.id !== heroProject.id)
    .sort((a, b) => (projectOrder[a.id] ?? 99) - (projectOrder[b.id] ?? 99))

  return (
    <div className="pt-16">
      <section className="py-20 sm:py-24 lg:py-[120px]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-12 max-w-4xl text-center"
          >
            <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">{t('projects.title')}</h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {t('projects.subtitle')}
            </p>
          </motion.div>

          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="mb-12 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_20px_80px_-40px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="grid gap-0 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
              <div className="border-b border-slate-200/80 bg-slate-950 p-4 sm:p-5 lg:p-6 xl:border-b-0 xl:border-r dark:border-slate-700">
                <FeaturedMedia project={heroProject} t={t} />
              </div>

              <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    {t(`projects.projects.${heroProject.id}.badge`)}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Clock className="mr-1.5 h-3 w-3" />
                    {formatProjectDate(heroProject.date)}
                  </span>
                </div>

                <h2 className="mb-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[2.2rem]">
                  {heroProject.title}
                </h2>
                <p className="mb-4 text-base font-medium leading-7 text-slate-700 dark:text-slate-200">
                  {t(`projects.projects.${heroProject.id}.description`)}
                </p>
                <p className="mb-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {t(`projects.projects.${heroProject.id}.longDescription`)}
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {heroProject.stack.map((tech) => (
                    <span
                      key={`${heroProject.id}-${tech}`}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mb-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {t('projects.features')}
                    </h3>
                    <div className="space-y-3">
                      {t(`projects.projects.${heroProject.id}.highlights`, { returnObjects: true }).map((item, index) => (
                        <div key={`${heroProject.id}-hero-highlight-${index}`} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {t('projects.challenges')}
                    </h3>
                    <div className="space-y-3">
                      {t(`projects.projects.${heroProject.id}.challenges`, { returnObjects: true }).map((item, index) => (
                        <div key={`${heroProject.id}-hero-challenge-${index}`} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <ProjectLinks project={heroProject} t={t} />
                </div>
              </div>
            </div>
          </motion.article>

          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{t('projects.moreProjectsTitle')}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {t('projects.moreProjectsDescription')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {otherProjects.map((project, index) => (
              <CompactProjectCard key={project.id} project={project} t={t} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
