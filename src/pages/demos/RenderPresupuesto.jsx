import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle, ImagePlus } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import BeforeAfterSlider from '../../components/BeforeAfterSlider.jsx'

// BuildApp API: foto + prompt → render + presupuesto (spec: 5 min timeout recommended)
const BUILDAPP_GET_INSPIRED_URL = 'https://buildapp-v1-backend.onrender.com/api/v1/get-inspired/process'
const BUILDAPP_FETCH_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_IMAGE_DIMENSION = 8192

function localeFromLanguage(lang) {
  if (lang === 'en') return 'en-US'
  if (lang === 'ca') return 'ca-ES'
  return 'es-ES'
}

export default function RenderPresupuesto() {
  const { t, language } = useLanguage()
  const [renderImageDataUrl, setRenderImageDataUrl] = useState(null)
  const [renderPrompt, setRenderPrompt] = useState('')
  const [renderLoading, setRenderLoading] = useState(false)
  const [renderResult, setRenderResult] = useState(null)
  const [renderError, setRenderError] = useState(null)
  const renderFileInputRef = useRef(null)

  // Validar imagen para BuildApp: tamaño ≤10MB, tipo jpeg/png/webp, dimensión máx 8192px
  const validateRenderImage = (file) => {
    if (file.size > MAX_IMAGE_SIZE) {
      return t('solutions.renderPresupuesto.upload.imageTooLarge').replace('{size}', MAX_IMAGE_SIZE / 1024 / 1024)
    }
    const type = (file.type || '').toLowerCase()
    if (!ALLOWED_IMAGE_TYPES.includes(type)) {
      return t('solutions.renderPresupuesto.upload.invalidFormat')
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
        resolve(ok ? null : t('solutions.renderPresupuesto.upload.imageTooBig').replace('{size}', MAX_IMAGE_DIMENSION))
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(t('solutions.renderPresupuesto.upload.imageReadError'))
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
    console.log('🚀 [DEBUG] generateRenderAndBudget called')
    console.log('🚀 [DEBUG] renderImageDataUrl exists:', !!renderImageDataUrl)
    console.log('🚀 [DEBUG] renderPrompt:', renderPrompt)
    console.log('🚀 [DEBUG] renderPrompt.trim():', renderPrompt.trim())
    console.log('🚀 [DEBUG] language:', language)
    
    if (!renderImageDataUrl || !renderPrompt.trim()) {
      console.error('❌ [DEBUG] Validation failed - missing image or prompt')
      setRenderError(t('solutions.renderPresupuesto.upload.imageAndPromptRequired'))
      return
    }
    
    // Validate image data URL format
    if (!renderImageDataUrl.startsWith('data:image/')) {
      console.error('❌ [DEBUG] Invalid image format:', renderImageDataUrl.substring(0, 100))
      setRenderError('Invalid image format')
      return
    }
    
    // Extract image info
    const imageType = renderImageDataUrl.match(/data:image\/([^;]+)/)?.[1] || 'unknown'
    const base64Data = renderImageDataUrl.split(',')[1] || ''
    const base64Length = base64Data.length
    const estimatedSizeMB = (base64Length * 3) / 4 / 1024 / 1024
    
    console.log('📸 [DEBUG] Image info:', {
      type: imageType,
      dataUrlLength: renderImageDataUrl.length,
      base64Length: base64Length,
      estimatedSizeMB: estimatedSizeMB.toFixed(2),
      dataUrlPrefix: renderImageDataUrl.substring(0, 50),
    })
    
    const requestBody = {
      image: renderImageDataUrl,
      prompt: renderPrompt.trim(),
      locale: localeFromLanguage(language),
    }
    
    const requestBodyString = JSON.stringify(requestBody)
    const requestBodySizeKB = requestBodyString.length / 1024
    
    console.log('📤 [DEBUG] Request details:', {
      url: BUILDAPP_GET_INSPIRED_URL,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      bodySizeKB: requestBodySizeKB.toFixed(2),
      imageLength: renderImageDataUrl.length,
      promptLength: requestBody.prompt.length,
      locale: requestBody.locale,
      promptPreview: requestBody.prompt.substring(0, 50),
    })
    
    console.log('📤 [DEBUG] Full request body (first 200 chars):', requestBodyString.substring(0, 200))
    
    setRenderLoading(true)
    setRenderError(null)
    setRenderResult(null)
    
    try {
      console.log('🌐 [DEBUG] Starting fetch request...')
      const startTime = Date.now()
      
      const res = await fetch(BUILDAPP_GET_INSPIRED_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBodyString,
      })
      
      const fetchDuration = Date.now() - startTime
      console.log('🌐 [DEBUG] Fetch completed:', {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        durationMs: fetchDuration,
        headers: Object.fromEntries(res.headers.entries()),
      })
      
      console.log('📥 [DEBUG] Reading response...')
      const responseText = await res.text()
      console.log('📥 [DEBUG] Response text (first 500 chars):', responseText.substring(0, 500))
      console.log('📥 [DEBUG] Response text length:', responseText.length)
      
      let data
      try {
        data = JSON.parse(responseText)
        console.log('✅ [DEBUG] Response parsed as JSON:', {
          keys: Object.keys(data),
          budget: data.budget,
          originalImageUrl: data.originalImageUrl ? data.originalImageUrl.substring(0, 100) : null,
          editedImageUrl: data.editedImageUrl ? data.editedImageUrl.substring(0, 100) : null,
        })
      } catch (parseError) {
        console.error('❌ [DEBUG] Failed to parse response as JSON:', parseError)
        console.error('❌ [DEBUG] Response was:', responseText)
        throw new Error(`Invalid JSON response: ${parseError.message}`)
      }
      
      if (!res.ok) {
        console.error('❌ [DEBUG] Response not OK:', {
          status: res.status,
          statusText: res.statusText,
          data: data,
          error: data.detail || data.message || data.error,
        })
        throw new Error(data.detail || data.message || data.error || `Error ${res.status}`)
      }
      
      console.log('✅ [DEBUG] Success! Setting result:', {
        hasBudget: !!data.budget,
        hasOriginalImageUrl: !!data.originalImageUrl,
        hasEditedImageUrl: !!data.editedImageUrl,
      })
      
      setRenderResult(data)
    } catch (err) {
      console.error('❌ [DEBUG] Error caught:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
      })
      setRenderError(err.message || t('solutions.renderPresupuesto.upload.errorGenerating'))
    } finally {
      console.log('🏁 [DEBUG] Finally block - setting loading to false')
      setRenderLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('solutions.renderPresupuesto.pageTitle')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {t('solutions.renderPresupuesto.pageSubtitle')}
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
              {renderImageDataUrl ? t('solutions.renderPresupuesto.upload.changeImage') : t('solutions.renderPresupuesto.upload.selectImage')}
            </button>
            {renderImageDataUrl && (
              <div className="flex-1 max-w-[200px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <img src={renderImageDataUrl} alt={t('solutions.renderPresupuesto.upload.previewAlt')} className="w-full h-auto object-cover max-h-32" />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {t('solutions.renderPresupuesto.upload.maxSize')}
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('solutions.renderPresupuesto.upload.promptLabel')}
            </label>
            <textarea
              value={renderPrompt}
              onChange={(e) => { setRenderPrompt(e.target.value); setRenderError(null) }}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={t('solutions.renderPresupuesto.upload.promptPlaceholder')}
            />
          </div>
          {renderError && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-1">{renderError}</p>
                </div>
              </div>
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
                {t('solutions.renderPresupuesto.upload.generating')}
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" />
                {t('solutions.renderPresupuesto.upload.generate')}
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
              {t('solutions.renderPresupuesto.result.budget')}
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
                        {t('solutions.renderPresupuesto.result.originalImage')}
                      </h3>
                      <div className="relative rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 max-h-96 overflow-hidden">
                        <img
                          src={renderResult.originalImageUrl}
                          alt={t('solutions.renderPresupuesto.result.originalImageAlt')}
                          className="w-full h-auto object-contain"
                          onError={(e) => {
                            console.error('❌ Error loading original image:', renderResult.originalImageUrl)
                            e.target.style.display = 'none'
                            const parent = e.target.parentElement
                            if (parent) {
                              parent.innerHTML = `
                                <div class="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                                  <p class="text-sm">Error loading image</p>
                                </div>
                              `
                            }
                          }}
                          onLoad={() => {
                            console.log('✅ Original image loaded:', renderResult.originalImageUrl)
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {renderResult.editedImageUrl && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {t('solutions.renderPresupuesto.result.render')}
                      </h3>
                      <div className="relative rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 max-h-96 overflow-hidden">
                        <img
                          src={renderResult.editedImageUrl}
                          alt={t('solutions.renderPresupuesto.result.renderAlt')}
                          className="w-full h-auto object-contain"
                          onError={(e) => {
                            console.error('❌ Error loading edited image:', renderResult.editedImageUrl)
                            e.target.style.display = 'none'
                            const parent = e.target.parentElement
                            if (parent) {
                              parent.innerHTML = `
                                <div class="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                                  <p class="text-sm">Error loading image</p>
                                </div>
                              `
                            }
                          }}
                          onLoad={() => {
                            console.log('✅ Edited image loaded:', renderResult.editedImageUrl)
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {!renderResult.originalImageUrl && !renderResult.editedImageUrl && (
                    <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                      <p className="text-sm">No images available in response</p>
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
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
              <p className="text-gray-900 dark:text-white font-medium">
                {t('solutions.renderPresupuesto.upload.generating')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
