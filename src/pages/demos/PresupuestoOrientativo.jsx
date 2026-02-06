import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle, FileText } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import LoadingProgressBar from '../../components/LoadingProgressBar.jsx'

const BUILDAPP_BUDGET_URL = 'https://buildapp-v1-backend.onrender.com/api/v1/budget/generate-detailed'

export default function PresupuestoOrientativo() {
  const { t } = useLanguage()
  
  const PROJECT_TYPES = [
    { value: 'baño', label: t('demos.projectTypes.baño') },
    { value: 'cocina', label: t('demos.projectTypes.cocina') },
    { value: 'integral', label: t('demos.projectTypes.integral') },
    { value: 'pintura', label: t('demos.projectTypes.pintura') },
    { value: 'suelo', label: t('demos.projectTypes.suelo') },
    { value: 'otros', label: t('demos.projectTypes.otros') },
  ]
  const [formData, setFormData] = useState({
    projectType: '',
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
    // Para sqm, solo filtrar caracteres no numéricos (más rápido que regex)
    if (name === 'sqm') {
      // Permitir vacío o solo dígitos (sin regex para mejor rendimiento)
      const numericValue = value === '' ? '' : value.replace(/\D/g, '')
      setFormData((prev) => ({ ...prev, [name]: numericValue }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    setError(null)
  }

  const generateBudget = async () => {
    if (!formData.projectType) {
      setError(t('demos.presupuestoOrientativo.form.projectTypeRequired'))
      return
    }
    
    // Clear any existing timeouts
    progressTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    progressTimeoutsRef.current = []
    
    setLoading(true)
    setLoadingStage(0)
    setError(null)
    setResult(null)
    
    // Create abort controller
    abortControllerRef.current = new AbortController()

    // Simulate progress stages
    const stages = [500, 1000, 1500, 2000]
    stages.forEach((delay, index) => {
      const timeout = setTimeout(() => {
        setLoadingStage(index + 1)
      }, delay)
      progressTimeoutsRef.current.push(timeout)
    })

    try {
      // Construir body: description es obligatorio según el backend
      const body = {
        projectType: formData.projectType,
        locale: 'es-ES',
        description: formData.notes?.trim() || t('demos.presupuestoOrientativo.form.autoDescription')
          .replace('{type}', PROJECT_TYPES.find(p => p.value === formData.projectType)?.label || formData.projectType)
          .replace('{sqm}', formData.sqm ? ` de ${formData.sqm} m²` : '')
          .replace('{city}', formData.city ? ` en ${formData.city}` : ''),
      }
      if (formData.sqm) body.sqm = Number(formData.sqm)
      if (formData.city) body.city = formData.city

      console.log('🔍 DEBUG - Request URL:', BUILDAPP_BUDGET_URL)
      console.log('🔍 DEBUG - Request Body:', JSON.stringify(body, null, 2))
      console.log('🔍 DEBUG - Form Data:', formData)

      const res = await fetch(BUILDAPP_BUDGET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: abortControllerRef.current.signal,
      })

      console.log('🔍 DEBUG - Response Status:', res.status, res.statusText)
      console.log('🔍 DEBUG - Response Headers:', Object.fromEntries(res.headers.entries()))

      const data = await res.json()
      console.log('🔍 DEBUG - Response Data:', JSON.stringify(data, null, 2))

      if (!res.ok) {
        // Mostrar detalles del error de validación si están disponibles
        const errorMsg = data.message || data.detail || data.error
        const validationDetails = data.details || data.errors || data.validation_errors
        console.error('🔍 DEBUG - Error Details:', {
          errorMsg,
          validationDetails,
          fullData: data,
        })
        if (validationDetails && Array.isArray(validationDetails) && validationDetails.length > 0) {
          const errorDetails = validationDetails
            .map(e => `${e.field || t('demos.presupuestoOrientativo.form.field')}: ${e.message || JSON.stringify(e)}`)
            .join('; ')
          throw new Error(`${errorMsg || t('demos.presupuestoOrientativo.form.errorValidation')}. ${errorDetails}`)
        }
        throw new Error(errorMsg || `Error ${res.status}`)
      }
      
      // Clear progress timeouts
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
      // Clear progress timeouts
      progressTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      progressTimeoutsRef.current = []
      setLoading(false)
      setLoadingStage(0)
    }
  }
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      progressTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('demos.presupuestoOrientativo.pageTitle')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {t('demos.presupuestoOrientativo.pageSubtitle')}
          </p>
        </motion.div>

        {/* Form */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 shadow-sm mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('demos.presupuestoOrientativo.form.projectType')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('demos.presupuestoOrientativo.form.projectType')} *
              </label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">{t('demos.presupuestoOrientativo.form.projectType')}</option>
                {PROJECT_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('demos.presupuestoOrientativo.form.sqm')}
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="sqm"
                value={formData.sqm}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t('demos.presupuestoOrientativo.form.sqmPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('demos.presupuestoOrientativo.form.city')}
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t('demos.presupuestoOrientativo.form.cityPlaceholder')}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('demos.presupuestoOrientativo.form.notes')}
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={t('demos.presupuestoOrientativo.form.notesPlaceholder')}
            />
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-2 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-6">
            <button
              type="button"
              onClick={generateBudget}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-4 py-2.5 text-sm font-medium transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('demos.presupuestoOrientativo.form.generating')}
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  {t('demos.presupuestoOrientativo.form.generate')}
                </>
              )}
            </button>
          </div>
        </motion.section>

        {/* Result - BuildApp API format: items, total, summary, timeline, notes */}
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('demos.presupuestoOrientativo.result.title')}
            </h2>
            <div className="space-y-4 text-sm">
              {/* Total (BuildApp format) */}
              {(result.total != null || result.items?.length > 0) && (
                <div className="mb-4">
                  <p className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                    {t('demos.presupuestoOrientativo.result.total')}: {result.total != null ? `${Number(result.total).toLocaleString('es-ES')} ${result.currency || '€'}` : '—'}
                  </p>
                </div>
              )}

              {/* Partidas: API devuelve items[] con concept, description, quantity, unit, unitPrice, total, category */}
              {result.items?.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {t('demos.presupuestoOrientativo.result.lineItems')}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="py-2 pr-2">{t('demos.presupuestoOrientativo.result.category')}</th>
                          <th className="py-2 pr-2">{t('demos.presupuestoOrientativo.result.item')}</th>
                          <th className="py-2 pr-2">{t('demos.presupuestoOrientativo.result.qty')}</th>
                          <th className="py-2 pr-2">{t('demos.presupuestoOrientativo.result.unit')}</th>
                          <th className="py-2 pr-2">{t('demos.presupuestoOrientativo.result.unitPrice')}</th>
                          <th className="py-2">{t('demos.presupuestoOrientativo.result.total')}</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 dark:text-gray-300">
                        {result.items.map((row, i) => (
                          <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-2 pr-2">{row.category ?? '-'}</td>
                            <td className="py-2 pr-2">
                              <span className="font-medium">{row.concept}</span>
                              {row.description && <span className="block text-xs text-gray-500 dark:text-gray-400">{row.description}</span>}
                            </td>
                            <td className="py-2 pr-2">{row.quantity ?? '-'}</td>
                            <td className="py-2 pr-2">{row.unit ?? '-'}</td>
                            <td className="py-2 pr-2">{row.unitPrice != null ? `${Number(row.unitPrice).toLocaleString('es-ES')} €` : '-'}</td>
                            <td className="py-2">{row.total != null ? `${Number(row.total).toLocaleString('es-ES')} €` : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Resumen materiales / mano de obra / otros */}
              {result.summary && (
                <div className="flex flex-wrap gap-4 pt-2">
                  {result.summary.materials != null && (
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('demos.presupuestoOrientativo.result.materials')}: {Number(result.summary.materials).toLocaleString('es-ES')} €
                    </span>
                  )}
                  {result.summary.labor != null && (
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('demos.presupuestoOrientativo.result.labor')}: {Number(result.summary.labor).toLocaleString('es-ES')} €
                    </span>
                  )}
                  {result.summary.other != null && (
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('demos.presupuestoOrientativo.result.other')}: {Number(result.summary.other).toLocaleString('es-ES')} €
                    </span>
                  )}
                </div>
              )}

              {/* Duración estimada */}
              {result.estimatedDuration && (
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">{t('demos.presupuestoOrientativo.result.estimatedDuration')}:</span> {result.estimatedDuration}
                </p>
              )}

              {/* Timeline */}
              {result.timeline?.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('demos.presupuestoOrientativo.result.timeline')}</h3>
                  <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                    {result.timeline.map((phase, i) => (
                      <li key={i}>
                        <span className="font-medium">{phase.period} {phase.periodType}</span>: {phase.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notas */}
              {result.notes?.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('demos.presupuestoOrientativo.result.notes')}</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                    {result.notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formato alternativo: assumptions, exclusions, lineItems (rangos) */}
              {!result.items?.length && result.assumptions?.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('demos.presupuestoOrientativo.result.assumptions')}</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                    {result.assumptions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!result.items?.length && result.exclusions?.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('demos.presupuestoOrientativo.result.exclusions')}</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                    {result.exclusions.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!result.items?.length && result.lineItems?.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('demos.presupuestoOrientativo.result.lineItems')}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="py-2 pr-2">{t('demos.presupuestoOrientativo.result.category')}</th>
                          <th className="py-2 pr-2">{t('demos.presupuestoOrientativo.result.item')}</th>
                          <th className="py-2 pr-2">{t('demos.presupuestoOrientativo.result.qty')}</th>
                          <th className="py-2 pr-2">{t('demos.presupuestoOrientativo.result.unit')}</th>
                          <th className="py-2 pr-2">{t('demos.presupuestoOrientativo.result.min')}</th>
                          <th className="py-2 pr-2">{t('demos.presupuestoOrientativo.result.max')}</th>
                          <th className="py-2">{t('demos.presupuestoOrientativo.result.notes')}</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 dark:text-gray-300">
                        {result.lineItems.map((row, i) => (
                          <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-2 pr-2">{row.category}</td>
                            <td className="py-2 pr-2">{row.item}</td>
                            <td className="py-2 pr-2">{row.qty ?? '-'}</td>
                            <td className="py-2 pr-2">{row.unit ?? '-'}</td>
                            <td className="py-2 pr-2">{row.rangeMin ?? row.min ?? '-'}</td>
                            <td className="py-2 pr-2">{row.rangeMax ?? row.max ?? '-'}</td>
                            <td className="py-2">{row.notes ?? '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {(result.totalMin || result.totalMax || result.total) && (
                    <p className="mt-3 font-medium text-gray-900 dark:text-white">
                      {t('demos.presupuestoOrientativo.result.total')}:{' '}
                      {result.totalMin != null && result.totalMax != null ? `${result.totalMin} € – ${result.totalMax} €` : result.total != null ? `${result.total} €` : '—'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </div>
      
      {/* Loading Modal */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4 max-w-md w-full shadow-2xl">
            <LoadingProgressBar stage={loadingStage} t={t} />
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  // Cancel the operation
                  if (abortControllerRef.current) {
                    abortControllerRef.current.abort()
                  }
                  // Clear all progress timeouts
                  progressTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
                  progressTimeoutsRef.current = []
                  // Reset state
                  setLoadingStage(0)
                  setLoading(false)
                  setError(null)
                }}
                className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                {t('demos.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
