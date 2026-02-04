import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle, ImagePlus } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import LoadingProgressBar from '../../components/LoadingProgressBar.jsx'
import BeforeAfterSlider from '../../components/BeforeAfterSlider.jsx'

// BuildApp API: foto + prompt → render + presupuesto
const BUILDAPP_GET_INSPIRED_URL = 'https://buildapp-v1-backend.onrender.com/api/v1/get-inspired/process'
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_IMAGE_DIMENSION = 8192

export default function RenderPresupuesto() {
  const { t } = useLanguage()
  const [renderImageDataUrl, setRenderImageDataUrl] = useState(null)
  const [renderPrompt, setRenderPrompt] = useState('')
  const [renderLoading, setRenderLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState(0)
  const [renderResult, setRenderResult] = useState(null)
  const [renderError, setRenderError] = useState(null)
  const renderFileInputRef = useRef(null)
  const progressTimeoutsRef = useRef([])
  const abortControllerRef = useRef(null)

  // Validar imagen para BuildApp: tamaño ≤10MB, tipo jpeg/png/webp, dimensión máx 8192px
  const validateRenderImage = (file) => {
    if (file.size > MAX_IMAGE_SIZE) {
      return t('demos.renderPresupuesto.upload.imageTooLarge').replace('{size}', MAX_IMAGE_SIZE / 1024 / 1024)
    }
    const type = (file.type || '').toLowerCase()
    if (!ALLOWED_IMAGE_TYPES.includes(type)) {
      return t('demos.renderPresupuesto.upload.invalidFormat')
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
        resolve(ok ? null : t('demos.renderPresupuesto.upload.imageTooBig').replace('{size}', MAX_IMAGE_DIMENSION))
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(t('demos.renderPresupuesto.upload.imageReadError'))
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
      setRenderError(t('demos.renderPresupuesto.upload.imageAndPromptRequired'))
      return
    }
    
    // Clear any existing timeouts
    progressTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    progressTimeoutsRef.current = []
    
    setRenderLoading(true)
    setLoadingStage(0)
    setRenderError(null)
    setRenderResult(null)
    
    // Create abort controller
    abortControllerRef.current = new AbortController()

    // Simulate progress stages
    const stages = [1000, 2000, 3000, 4000]
    stages.forEach((delay, index) => {
      const timeout = setTimeout(() => {
        setLoadingStage(index + 1)
      }, delay)
      progressTimeoutsRef.current.push(timeout)
    })
    
    try {
      const res = await fetch(BUILDAPP_GET_INSPIRED_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: renderImageDataUrl,
          prompt: renderPrompt.trim(),
          locale: 'es-ES',
        }),
        signal: abortControllerRef.current.signal,
      })
      
      // Check if response is ok before trying to parse JSON
      if (!res.ok) {
        let errorMessage = t('demos.renderPresupuesto.upload.serverError').replace('{status}', res.status)
        try {
          const errorData = await res.json()
          errorMessage = errorData.detail || errorData.message || errorData.error || errorMessage
          console.error('🔍 DEBUG - Error Response:', JSON.stringify(errorData, null, 2))
        } catch (parseError) {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await res.text()
            console.error('🔍 DEBUG - Error Response (text):', errorText)
            errorMessage = errorText || errorMessage
          } catch (textError) {
            console.error('🔍 DEBUG - Could not parse error response')
          }
        }
        throw new Error(errorMessage)
      }
      
      const data = await res.json()
      
      // Clear progress timeouts
      progressTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      progressTimeoutsRef.current = []
      
      setLoadingStage(4)
      console.log('🔍 DEBUG - Render Result:', JSON.stringify(data, null, 2))
      console.log('🔍 DEBUG - originalImageUrl:', data.originalImageUrl)
      console.log('🔍 DEBUG - editedImageUrl:', data.editedImageUrl)
      setRenderResult(data)
    } catch (err) {
      if (err.name === 'AbortError') {
        return
      }
      console.error('🔍 DEBUG - Error generating render:', err)
      const errorMessage = err.message || t('demos.renderPresupuesto.upload.errorGenerating')
      setRenderError(errorMessage)
    } finally {
      // Clear progress timeouts
      progressTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      progressTimeoutsRef.current = []
      setRenderLoading(false)
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
            {t('demos.renderPresupuesto.pageTitle')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {t('demos.renderPresupuesto.pageSubtitle')}
          </p>
        </motion.div>

        {/* Form */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 shadow-sm mb-8"
        >
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
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ImagePlus className="h-4 w-4" />
              {renderImageDataUrl ? t('demos.renderPresupuesto.upload.changeImage') : t('demos.renderPresupuesto.upload.selectImage')}
            </button>
            {renderImageDataUrl && (
              <div className="flex-1 max-w-[200px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <img src={renderImageDataUrl} alt={t('demos.renderPresupuesto.upload.previewAlt')} className="w-full h-auto object-cover max-h-32" />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {t('demos.renderPresupuesto.upload.maxSize')}
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('demos.renderPresupuesto.upload.promptLabel')}
            </label>
            <textarea
              value={renderPrompt}
              onChange={(e) => { setRenderPrompt(e.target.value); setRenderError(null) }}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={t('demos.renderPresupuesto.upload.promptPlaceholder')}
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
                {t('demos.renderPresupuesto.upload.generating')}
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" />
                {t('demos.renderPresupuesto.upload.generate')}
              </>
            )}
          </button>
        </motion.section>

        {/* Result */}
        {renderResult && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('demos.renderPresupuesto.result.budget')}
            </h2>
            <div className="space-y-4">
              {renderResult.budget != null && (
                <div>
                  <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {typeof renderResult.budget === 'object'
                      ? `${renderResult.budget.min ?? renderResult.budget.rangeMin ?? '—'} – ${renderResult.budget.max ?? renderResult.budget.rangeMax ?? '—'} €`
                      : `${renderResult.budget} €`}
                  </p>
                </div>
              )}
              {/* Show slider if both images exist, otherwise show individual images */}
              {renderResult.originalImageUrl && renderResult.editedImageUrl ? (
                <div className="mb-4">
                  <BeforeAfterSlider
                    originalImageUrl={renderResult.originalImageUrl}
                    renderedImageUrl={renderResult.editedImageUrl}
                    t={t}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderResult.originalImageUrl && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {t('demos.renderPresupuesto.result.originalImage')}
                      </h3>
                      <img
                        src={renderResult.originalImageUrl}
                        alt="Original"
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-600 max-h-96 object-contain bg-gray-50 dark:bg-gray-800"
                      />
                    </div>
                  )}
                  {renderResult.editedImageUrl && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {t('demos.renderPresupuesto.result.render')}
                      </h3>
                      <img
                        src={renderResult.editedImageUrl}
                        alt="Render"
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-600 max-h-96 object-contain bg-gray-50 dark:bg-gray-800"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </div>
      
      {/* Loading Modal */}
      {renderLoading && (
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
                  setRenderLoading(false)
                  setRenderError(null)
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
