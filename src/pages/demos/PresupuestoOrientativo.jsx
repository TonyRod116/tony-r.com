import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2,
  AlertCircle,
  FileText,
  Calculator,
  MapPin,
  Ruler,
  StickyNote,
  Bath,
  UtensilsCrossed,
  Home,
  Paintbrush,
  Grid3X3,
  Wrench,
  Clock,
  Package,
  HardHat,
  Boxes,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  Check,
  Info,
  XCircle,
  CheckCircle2,
} from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import LoadingProgressBar from '../../components/LoadingProgressBar.jsx'

const BUILDAPP_BASE = 'https://buildapp-v1-backend.onrender.com'

// Usar backend BuildApp siempre (env, producción por defecto, o desarrollo si no hay env)
function getBuildappBudgetUrl() {
  const base = import.meta.env.VITE_BUILDAPP_DEMO_API_URL || BUILDAPP_BASE
  const url = base.replace(/\/$/, '')
  return `${url}/api/v1/budget/generate-detailed`
}

const PROJECT_TYPE_ICONS = {
  baño: Bath,
  cocina: UtensilsCrossed,
  integral: Home,
  pintura: Paintbrush,
  suelo: Grid3X3,
  otros: Wrench,
}

export default function PresupuestoOrientativo() {
  const { t, language } = useLanguage()
  
  // Traducir periodType del backend
  const translatePeriodType = (periodType) => {
    if (!periodType) return ''
    const translations = {
      en: {
        weeks: 'weeks',
        days: 'days',
        months: 'months',
        week: 'week',
        day: 'day',
        month: 'month'
      },
      es: {
        weeks: 'semanas',
        days: 'días',
        months: 'meses',
        week: 'semana',
        day: 'día',
        month: 'mes'
      },
      ca: {
        weeks: 'setmanes',
        days: 'dies',
        months: 'mesos',
        week: 'setmana',
        day: 'dia',
        month: 'mes'
      }
    }
    const lang = language || 'es'
    return translations[lang]?.[periodType.toLowerCase()] || periodType
  }

  const PROJECT_TYPES = [
    { value: 'baño', label: t('demos.projectTypes.baño') },
    { value: 'cocina', label: t('demos.projectTypes.cocina') },
    { value: 'integral', label: t('demos.projectTypes.integral') },
    { value: 'pintura', label: t('demos.projectTypes.pintura') },
    { value: 'suelo', label: t('demos.projectTypes.suelo') },
    { value: 'otros', label: t('demos.projectTypes.otros') },
  ]
  const [formData, setFormData] = useState({
    projectType: [],
    sqm: '',
    city: 'Barcelona',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState(0)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const progressTimeoutsRef = useRef([])
  const abortControllerRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'sqm') {
      const numericValue = value === '' ? '' : value.replace(/\D/g, '')
      setFormData((prev) => ({ ...prev, [name]: numericValue }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    setError(null)
  }

  const toggleProjectType = (value) => {
    setFormData((prev) => ({
      ...prev,
      projectType: prev.projectType.includes(value)
        ? prev.projectType.filter(v => v !== value)
        : [...prev.projectType, value],
    }))
    setError(null)
  }

  const generateBudget = async () => {
    if (formData.projectType.length === 0) {
      setError(t('demos.presupuestoOrientativo.form.projectTypeRequired'))
      return
    }

    progressTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    progressTimeoutsRef.current = []

    setLoading(true)
    setLoadingStage(0)
    setError(null)
    setResult(null)

    abortControllerRef.current = new AbortController()

    // Timings diferentes para cada paso: total ~10 segundos
    // Stage 1 (analyzing): 1500ms - más lento al inicio
    // Stage 2 (processing): 3000ms acumulado (1500 + 1500)
    // Stage 3 (generating): 5500ms acumulado (3000 + 2500)
    // Stage 4 (preparing): 8000ms acumulado (5500 + 2500)
    // Stage 5 (finalizing): 10000ms acumulado (8000 + 2000)
    const stages = [1500, 3000, 5500, 8000]
    stages.forEach((delay, index) => {
      const timeout = setTimeout(() => {
        setLoadingStage(index + 1)
      }, delay)
      progressTimeoutsRef.current.push(timeout)
    })

    try {
      const selectedLabels = formData.projectType
        .map(v => PROJECT_TYPES.find(p => p.value === v)?.label || v)
        .join(', ')
      const projectTypeValue = formData.projectType.length === 1 
        ? formData.projectType[0] 
        : formData.projectType.join(', ')
      
      const body = {
        projectType: projectTypeValue,
        locale: 'es-ES',
        description: formData.notes?.trim() || t('demos.presupuestoOrientativo.form.autoDescription')
          .replace('{type}', selectedLabels)
          .replace('{sqm}', formData.sqm ? ` de ${formData.sqm} m²` : '')
          .replace('{city}', formData.city ? ` en ${formData.city}` : ''),
      }
      if (formData.sqm) body.sqm = Number(formData.sqm)
      if (formData.city) body.city = formData.city
      
      // Debug: verificar que projectType se envía correctamente
      console.log('Sending projectType to backend:', projectTypeValue, 'Selected types:', formData.projectType)

      const res = await fetch(getBuildappBudgetUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: abortControllerRef.current.signal,
      })

      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data.message || data.detail || data.error
        const validationDetails = data.details || data.errors || data.validation_errors
        if (validationDetails && Array.isArray(validationDetails) && validationDetails.length > 0) {
          const errorDetails = validationDetails
            .map(e => `${e.field || t('demos.presupuestoOrientativo.form.field')}: ${e.message || JSON.stringify(e)}`)
            .join('; ')
          throw new Error(`${errorMsg || t('demos.presupuestoOrientativo.form.errorValidation')}. ${errorDetails}`)
        }
        throw new Error(errorMsg || `Error ${res.status}`)
      }

      progressTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      progressTimeoutsRef.current = []

      setLoadingStage(4)
      setResult(data)
    } catch (err) {
      if (err.name === 'AbortError') {
        return
      }
      console.error('Error generating budget:', err)
      setError(err.message || t('demos.presupuestoOrientativo.form.errorGenerating'))
    } finally {
      progressTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      progressTimeoutsRef.current = []
      setLoading(false)
      setLoadingStage(0)
    }
  }

  useEffect(() => {
    return () => {
      progressTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Page header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-8 sm:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-2">Demo</p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
              {t('demos.presupuestoOrientativo.pageTitle')}
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xl">
              {t('demos.presupuestoOrientativo.pageSubtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12">
            {/* Left: Project type selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-3">
                {t('demos.presupuestoOrientativo.form.projectType')} <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {PROJECT_TYPES.map((opt) => {
                  const Icon = PROJECT_TYPE_ICONS[opt.value] || Wrench
                  const isSelected = formData.projectType.includes(opt.value)
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleProjectType(opt.value)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-md border text-left text-sm transition-all duration-150
                        ${isSelected
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-500 text-gray-900 dark:text-white'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                        }
                      `}
                    >
                      <div className={`
                        flex items-center justify-center w-5 h-5 rounded border flex-shrink-0 transition-colors
                        ${isSelected
                          ? 'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                        }
                      `}>
                        {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                      </div>
                      <Icon className={`h-4 w-4 flex-shrink-0 ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`} />
                      <span className="font-medium">{opt.label}</span>
                    </button>
                  )
                })}
              </div>
              {formData.projectType.length > 0 && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {formData.projectType.length} {formData.projectType.length === 1 ? 'tipo seleccionado' : 'tipos seleccionados'}
                </p>
              )}
            </div>

            {/* Right: Form details */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">
                    {t('demos.presupuestoOrientativo.form.sqm')}
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="sqm"
                      value={formData.sqm}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 dark:focus:border-primary-400 outline-none transition-colors"
                      placeholder={t('demos.presupuestoOrientativo.form.sqmPlaceholder')}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">
                    {t('demos.presupuestoOrientativo.form.city')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 dark:focus:border-primary-400 outline-none transition-colors"
                      placeholder={t('demos.presupuestoOrientativo.form.cityPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">
                  {t('demos.presupuestoOrientativo.form.notes')}
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 dark:focus:border-primary-400 outline-none transition-colors resize-none"
                  placeholder={t('demos.presupuestoOrientativo.form.notesPlaceholder')}
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2.5 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-300 px-3 py-2.5 text-sm"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA */}
              <button
                type="button"
                onClick={generateBudget}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 text-sm font-medium transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('demos.presupuestoOrientativo.form.generating')}
                  </>
                ) : (
                  <>
                    {t('demos.presupuestoOrientativo.form.generate')}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        {result && <div className="border-t border-gray-200 dark:border-gray-800 my-10" />}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Results header row */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">{t('demos.presupuestoOrientativo.result.title')}</p>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  {t('demos.presupuestoOrientativo.result.title')}
                </h2>
                {result.estimatedDuration && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {t('demos.presupuestoOrientativo.result.estimatedDuration')}: {result.estimatedDuration}
                  </p>
                )}
              </div>
              {result.total != null && (
                <div className="sm:text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">{t('demos.presupuestoOrientativo.result.total')}</p>
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {Number(result.total).toLocaleString('es-ES')} <span className="text-lg font-medium text-gray-400">{result.currency || '€'}</span>
                  </p>
                </div>
              )}
            </div>

            {/* KPI cards */}
            {result.summary && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 rounded-md overflow-hidden mb-8 border border-gray-200 dark:border-gray-800">
                {[
                  { key: 'materials', value: result.summary.materials, icon: Package, color: 'text-blue-600 dark:text-blue-400' },
                  { key: 'labor', value: result.summary.labor, icon: HardHat, color: 'text-amber-600 dark:text-amber-400' },
                  { key: 'other', value: result.summary.other, icon: Boxes, color: 'text-gray-600 dark:text-gray-400' },
                ].filter(c => c.value != null).map((card) => (
                  <div key={card.key} className="bg-white dark:bg-gray-900 px-5 py-4 flex items-center gap-4">
                    <card.icon className={`h-5 w-5 ${card.color} flex-shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{t(`demos.presupuestoOrientativo.result.${card.key}`)}</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white tabular-nums">{Number(card.value).toLocaleString('es-ES')} €</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Items table */}
            {result.items?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  {t('demos.presupuestoOrientativo.result.lineItems')}
                </h3>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-md">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900 text-left">
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t('demos.presupuestoOrientativo.result.category')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t('demos.presupuestoOrientativo.result.item')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">{t('demos.presupuestoOrientativo.result.qty')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t('demos.presupuestoOrientativo.result.unit')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">{t('demos.presupuestoOrientativo.result.unitPrice')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">{t('demos.presupuestoOrientativo.result.total')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {result.items.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                          <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{row.category ?? '-'}</td>
                          <td className="py-2.5 px-4">
                            <span className="font-medium text-gray-900 dark:text-white">{row.concept}</span>
                            {row.description && <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">{row.description}</span>}
                          </td>
                          <td className="py-2.5 px-4 text-right text-gray-700 dark:text-gray-300 tabular-nums">{row.quantity ?? '-'}</td>
                          <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400">{row.unit ?? '-'}</td>
                          <td className="py-2.5 px-4 text-right text-gray-700 dark:text-gray-300 tabular-nums">{row.unitPrice != null ? `${Number(row.unitPrice).toLocaleString('es-ES')} €` : '-'}</td>
                          <td className="py-2.5 px-4 text-right font-medium text-gray-900 dark:text-white tabular-nums">{row.total != null ? `${Number(row.total).toLocaleString('es-ES')} €` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                    {result.total != null && (
                      <tfoot>
                        <tr className="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                          <td colSpan={5} className="py-2.5 px-4 text-right text-sm font-medium text-gray-900 dark:text-white">{t('demos.presupuestoOrientativo.result.total')}</td>
                          <td className="py-2.5 px-4 text-right font-bold text-gray-900 dark:text-white tabular-nums">{Number(result.total).toLocaleString('es-ES')} €</td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            )}

            {/* Timeline */}
            {result.timeline?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  {t('demos.presupuestoOrientativo.result.timeline')}
                </h3>
                <div className="space-y-0">
                  {result.timeline.map((phase, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-gray-600 dark:text-gray-300">
                          {i + 1}
                        </div>
                        {i < result.timeline.length - 1 && (
                          <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 min-h-[20px]" />
                        )}
                      </div>
                      <div className={i === result.timeline.length - 1 ? '' : 'pb-5'}>
                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-7">
                          {phase.period} {translatePeriodType(phase.periodType)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes / Assumptions / Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
              {(Array.isArray(result.notes) ? result.notes.length > 0 : typeof result.notes === 'string' && result.notes.trim()) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-gray-400" />
                    {t('demos.presupuestoOrientativo.result.notes')}
                  </h3>
                  {Array.isArray(result.notes) ? (
                    <ul className="space-y-1.5">
                      {result.notes.map((n, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300 dark:before:bg-gray-600">
                          {n}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{result.notes}</p>
                  )}
                </div>
              )}

              {!result.items?.length && result.assumptions?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gray-400" />
                    {t('demos.presupuestoOrientativo.result.assumptions')}
                  </h3>
                  <ul className="space-y-1.5">
                    {result.assumptions.map((a, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300 dark:before:bg-gray-600">
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!result.items?.length && result.exclusions?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-gray-400" />
                    {t('demos.presupuestoOrientativo.result.exclusions')}
                  </h3>
                  <ul className="space-y-1.5">
                    {result.exclusions.map((e, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300 dark:before:bg-gray-600">
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Alt lineItems with ranges */}
            {!result.items?.length && result.lineItems?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  {t('demos.presupuestoOrientativo.result.lineItems')}
                </h3>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-md">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900 text-left">
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t('demos.presupuestoOrientativo.result.category')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t('demos.presupuestoOrientativo.result.item')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">{t('demos.presupuestoOrientativo.result.qty')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t('demos.presupuestoOrientativo.result.unit')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">{t('demos.presupuestoOrientativo.result.min')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">{t('demos.presupuestoOrientativo.result.max')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t('demos.presupuestoOrientativo.result.notes')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {result.lineItems.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                          <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400">{row.category}</td>
                          <td className="py-2.5 px-4 font-medium text-gray-900 dark:text-white">{row.item}</td>
                          <td className="py-2.5 px-4 text-right text-gray-700 dark:text-gray-300 tabular-nums">{row.qty ?? '-'}</td>
                          <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400">{row.unit ?? '-'}</td>
                          <td className="py-2.5 px-4 text-right text-gray-700 dark:text-gray-300 tabular-nums">{row.rangeMin ?? row.min ?? '-'}</td>
                          <td className="py-2.5 px-4 text-right text-gray-700 dark:text-gray-300 tabular-nums">{row.rangeMax ?? row.max ?? '-'}</td>
                          <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400">{row.notes ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(result.totalMin || result.totalMax || result.total) && (
                  <div className="mt-3 text-right">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">{t('demos.presupuestoOrientativo.result.total')}:</span>
                    <span className="text-base font-bold text-gray-900 dark:text-white tabular-nums">
                      {result.totalMin != null && result.totalMax != null
                        ? `${Number(result.totalMin).toLocaleString('es-ES')} € – ${Number(result.totalMax).toLocaleString('es-ES')} €`
                        : result.total != null ? `${Number(result.total).toLocaleString('es-ES')} €` : '—'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Loading Modal */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-lg p-6 sm:p-8 mx-4 max-w-sm w-full shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <LoadingProgressBar stage={loadingStage} t={t} />
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  if (abortControllerRef.current) {
                    abortControllerRef.current.abort()
                  }
                  progressTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
                  progressTimeoutsRef.current = []
                  setLoadingStage(0)
                  setLoading(false)
                  setError(null)
                }}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
              >
                {t('demos.cancel')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
