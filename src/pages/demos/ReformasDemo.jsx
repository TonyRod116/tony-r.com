import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, Loader2, CheckCircle, AlertCircle, ListChecks, MessageCircle, FileText, MessageSquare, History, ImagePlus } from 'lucide-react'

// BuildApp API: foto + prompt → render + presupuesto
const BUILDAPP_GET_INSPIRED_URL = 'https://buildapp-v1-backend.onrender.com/api/v1/get-inspired/process'
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_IMAGE_DIMENSION = 8192

const PROJECT_TYPES = [
  { value: 'baño', label: 'Baño' },
  { value: 'cocina', label: 'Cocina' },
  { value: 'integral', label: 'Reforma integral' },
  { value: 'pintura', label: 'Pintura' },
  { value: 'suelo', label: 'Suelo' },
  { value: 'otros', label: 'Otros' },
]

const initialLead = {
  name: '',
  phone: '',
  city: 'Barcelona',
  projectType: '',
  sqm: '',
  targetBudget: '',
  notes: '',
}

function getApiBase() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  return ''
}

export default function ReformasDemo() {
  const [lead, setLead] = useState(initialLead)
  const [photos, setPhotos] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('checklist')
  const [historyList, setHistoryList] = useState([])
  const [selectedHistory, setSelectedHistory] = useState(null)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)

  // Render + presupuesto (BuildApp): 1 foto + prompt → render + budget
  const [renderImageDataUrl, setRenderImageDataUrl] = useState(null)
  const [renderPrompt, setRenderPrompt] = useState('')
  const [renderLoading, setRenderLoading] = useState(false)
  const [renderResult, setRenderResult] = useState(null)
  const [renderError, setRenderError] = useState(null)
  const renderFileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setLead((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (photos.length + files.length > 5) {
      setError('Máximo 5 fotos.')
      return
    }
    setPhotos((prev) => [...prev.slice(0, 5 - files.length), ...files].slice(0, 5))
    setError(null)
  }

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  // Validar imagen para BuildApp: tamaño ≤10MB, tipo jpeg/png/webp, dimensión máx 8192px
  const validateRenderImage = (file) => {
    if (file.size > MAX_IMAGE_SIZE) {
      return `La imagen no puede superar ${MAX_IMAGE_SIZE / 1024 / 1024} MB.`
    }
    const type = (file.type || '').toLowerCase()
    if (!ALLOWED_IMAGE_TYPES.includes(type)) {
      return 'Formato no válido. Usa JPEG, PNG o WebP.'
    }
    return null
  }

  const checkImageDimensions = (file) =>
    new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        const ok = img.naturalWidth <= MAX_IMAGE_DIMENSION && img.naturalHeight <= MAX_IMAGE_DIMENSION
        resolve(ok ? null : `La imagen no puede superar ${MAX_IMAGE_DIMENSION}px de ancho o alto.`)
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve('No se pudo leer la imagen.')
      }
      img.src = url
    })

  const handleRenderImageChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    setRenderError(null)
    setRenderResult(null)
    if (!file) return
    const sizeTypeError = validateRenderImage(file)
    if (sizeTypeError) {
      setRenderError(sizeTypeError)
      return
    }
    const dimError = await checkImageDimensions(file)
    if (dimError) {
      setRenderError(dimError)
      return
    }
    const reader = new FileReader()
    reader.onload = () => setRenderImageDataUrl(reader.result)
    reader.readAsDataURL(file)
  }

  const generateRenderAndBudget = async () => {
    if (!renderImageDataUrl || !renderPrompt.trim()) {
      setRenderError('Necesitas una imagen y un texto descriptivo (ej. reforma estilo mediterráneo).')
      return
    }
    setRenderLoading(true)
    setRenderError(null)
    setRenderResult(null)
    try {
      const res = await fetch(BUILDAPP_GET_INSPIRED_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: renderImageDataUrl,
          prompt: renderPrompt.trim(),
          locale: 'es-ES',
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || data.message || data.error || `Error ${res.status}`)
      }
      setRenderResult(data)
    } catch (err) {
      setRenderError(err.message || 'Error al generar render. Comprueba CORS si usas tony-r.com.')
    } finally {
      setRenderLoading(false)
    }
  }

  const generateDraft = async () => {
    if (!lead.name.trim()) {
      setError('Nombre obligatorio.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    setSelectedHistory(null)

    try {
      const body = {
        lead: {
          name: lead.name.trim(),
          phone: lead.phone.trim() || undefined,
          city: lead.city.trim() || 'Barcelona',
          projectType: lead.projectType || 'otros',
          sqm: lead.sqm ? Number(lead.sqm) : undefined,
          targetBudget: lead.targetBudget ? Number(lead.targetBudget) : undefined,
          notes: lead.notes.trim() || undefined,
        },
        photoNames: photos.map((f) => f.name),
      }

      const res = await fetch(`${getApiBase()}/api/generate-quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Error al generar el borrador')
      }
      setResult(data)

      // Guardar en histórico (llamada al backend)
      await fetch(`${getApiBase()}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: body.lead, result: data }),
      })
      loadHistory()
    } catch (err) {
      setError(err.message || 'Error de conexión. ¿Está el servidor de la API en marcha?')
    } finally {
      setLoading(false)
    }
  }

  const loadHistory = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/leads`)
      const data = await res.json()
      if (res.ok && Array.isArray(data)) setHistoryList(data)
    } catch {
      setHistoryList([])
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const copyWhatsApp = () => {
    if (!result?.whatsappMessage) return
    navigator.clipboard.writeText(result.whatsappMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { id: 'checklist', label: 'Checklist visita', icon: ListChecks },
    { id: 'questions', label: 'Preguntas faltantes', icon: MessageCircle },
    { id: 'budget', label: 'Presupuesto', icon: FileText },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  ]

  const displayResult = selectedHistory || result

  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Demo: Presupuestos Reformas
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Lead → borrador de presupuesto en 2 minutos. Enfocado a reformas en Barcelona.
          </p>
        </motion.div>

        {/* Form */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 shadow-sm mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Datos del lead</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                value={lead.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Nombre del cliente"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={lead.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+34 600 000 000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                name="city"
                value={lead.city}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Barcelona"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de reforma
              </label>
              <select
                name="projectType"
                value={lead.projectType}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Seleccionar</option>
                {PROJECT_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                m² (aprox.)
              </label>
              <input
                type="number"
                name="sqm"
                value={lead.sqm}
                onChange={handleChange}
                min="1"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ej. 45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Presupuesto objetivo (€)
              </label>
              <input
                type="number"
                name="targetBudget"
                value={lead.targetBudget}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Opcional"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notas
            </label>
            <textarea
              name="notes"
              value={lead.notes}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Detalles adicionales, calidades deseadas, etc."
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fotos (0–5, opcional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Añadir fotos
            </button>
            {photos.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {photos.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs"
                  >
                    {f.name}
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Quitar"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
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
              onClick={generateDraft}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-4 py-2.5 text-sm font-medium transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generando…
                </>
              ) : (
                'Generar borrador'
              )}
            </button>
          </div>
        </motion.section>

        {/* Resultados */}
        {displayResult && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm overflow-hidden mb-8"
          >
            <div className="border-b border-gray-200 dark:border-gray-700 flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-6">
              {activeTab === 'checklist' && (
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  {(displayResult.siteVisitChecklist || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === 'questions' && (
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm list-disc list-inside">
                  {(displayResult.missingQuestions || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {activeTab === 'budget' && displayResult.budgetDraft && (
                <div className="space-y-4 text-sm">
                  {displayResult.budgetDraft.assumptions?.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Supuestos</h3>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                        {displayResult.budgetDraft.assumptions.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {displayResult.budgetDraft.exclusions?.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Exclusiones</h3>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                        {displayResult.budgetDraft.exclusions.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Partidas</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-600">
                            <th className="py-2 pr-2">Partida</th>
                            <th className="py-2 pr-2">Cant.</th>
                            <th className="py-2 pr-2">Unidad</th>
                            <th className="py-2 pr-2">Min (€)</th>
                            <th className="py-2 pr-2">Max (€)</th>
                            <th className="py-2">Notas</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 dark:text-gray-300">
                          {(displayResult.budgetDraft.lineItems || []).map((row, i) => (
                            <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
                              <td className="py-2 pr-2">{row.category} – {row.item}</td>
                              <td className="py-2 pr-2">{row.qty ?? '-'}</td>
                              <td className="py-2 pr-2">{row.unit ?? '-'}</td>
                              <td className="py-2 pr-2">{row.rangeMin}</td>
                              <td className="py-2 pr-2">{row.rangeMax}</td>
                              <td className="py-2">{row.notes ?? '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 font-medium text-gray-900 dark:text-white">
                      Total: {displayResult.budgetDraft.totalMin} € – {displayResult.budgetDraft.totalMax} €
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'whatsapp' && (
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">Mensaje para WhatsApp</h3>
                    <button
                      type="button"
                      onClick={copyWhatsApp}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 dark:bg-gray-800 p-4 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                    {displayResult.whatsappMessage || '—'}
                  </pre>
                </div>
              )}
            </div>
            {selectedHistory && (
              <div className="px-6 pb-4">
                <button
                  type="button"
                  onClick={() => setSelectedHistory(null)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Volver al resultado actual
                </button>
              </div>
            )}
          </motion.section>
        )}

        {/* Inspírate con IA: foto + prompt → render + presupuesto (BuildApp) */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 shadow-sm mb-8"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-2">
            <ImagePlus className="h-5 w-5" />
            Inspírate con IA (render + presupuesto)
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Sube una foto y describe la reforma. Máx. 10 MB · JPEG, PNG o WebP · máx. 8192 px.
          </p>
          <input
            ref={renderFileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleRenderImageChange}
            className="hidden"
          />
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              type="button"
              onClick={() => renderFileInputRef.current?.click()}
              className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {renderImageDataUrl ? 'Cambiar imagen' : 'Elegir imagen'}
            </button>
            {renderImageDataUrl && (
              <div className="flex-1 max-w-[200px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <img src={renderImageDataUrl} alt="Vista previa" className="w-full h-auto object-cover max-h-32" />
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Describe la reforma (ej. Reforma completa estilo mediterráneo, cocina blanca con isla)
            </label>
            <textarea
              value={renderPrompt}
              onChange={(e) => { setRenderPrompt(e.target.value); setRenderError(null) }}
              rows={2}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Reforma completa estilo mediterráneo..."
            />
          </div>
          {renderError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-2 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {renderError}
            </div>
          )}
          <button
            type="button"
            onClick={generateRenderAndBudget}
            disabled={renderLoading || !renderImageDataUrl || !renderPrompt.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-4 py-2.5 text-sm font-medium transition-colors"
          >
            {renderLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando render y presupuesto…
              </>
            ) : (
              'Generar render y presupuesto'
            )}
          </button>

          {renderResult && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
              {renderResult.budget != null && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Presupuesto estimado</h3>
                  <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {typeof renderResult.budget === 'object'
                      ? `${renderResult.budget.min ?? renderResult.budget.rangeMin ?? '—'} – ${renderResult.budget.max ?? renderResult.budget.rangeMax ?? '—'} €`
                      : `${renderResult.budget} €`}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderResult.originalImageUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Imagen original</h3>
                    <img
                      src={renderResult.originalImageUrl}
                      alt="Original"
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-600 max-h-64 object-contain bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                )}
                {renderResult.editedImageUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Render generado</h3>
                    <img
                      src={renderResult.editedImageUrl}
                      alt="Render"
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-600 max-h-64 object-contain bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                )}
              </div>
              {renderResult.editPrompt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Prompt usado para el render</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{renderResult.editPrompt}</p>
                </div>
              )}
            </div>
          )}
        </motion.section>

        {/* Histórico */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 shadow-sm"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
            <History className="h-5 w-5" />
            Histórico (últimos 10)
          </h2>
          {historyList.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aún no hay leads guardados. Genera un borrador para ver el histórico aquí.
            </p>
          ) : (
            <ul className="space-y-2">
              {historyList.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHistory(item.result)
                      setActiveTab('checklist')
                    }}
                    className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.lead?.name || 'Sin nombre'}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      {item.lead?.projectType || '—'} · {item.createdAt ? new Date(item.createdAt).toLocaleString('es-ES') : ''}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </motion.section>
      </div>
    </div>
  )
}
