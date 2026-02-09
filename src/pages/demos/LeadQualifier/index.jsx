import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Send, RotateCcw, AlertCircle, CheckCircle2, Sparkles, Settings, ChevronDown } from 'lucide-react'
import ChatBubble from './components/ChatBubble'
import TypingIndicator from './components/TypingIndicator'
import LeadSummaryCard from './components/LeadSummaryCard'
import ConfigPanel from './components/ConfigPanel'
import { useChat } from './hooks/useChat'
import { DEFAULT_CONFIG } from './utils/config'
import { useLanguage } from '../../../hooks/useLanguage'
import { translations } from '../../../data/translations'

// Mensaje de bienvenida del chat siempre en español al cargar
const WELCOME_MESSAGE_ES = translations?.es?.solutions?.leadQualifier?.ui?.welcomeMessage ?? '¡Hola! Soy el asistente de proyectos. Estoy aquí para ayudarte a definir tu reforma y resolver cualquier duda. ¿Qué tipo de proyecto tienes en mente?'

export default function LeadQualifier() {
  const { t, language } = useLanguage()

  const [messages, setMessages] = useState(() => [{
    id: 'welcome',
    role: 'assistant',
    content: WELCOME_MESSAGE_ES,
    timestamp: new Date().toISOString(),
  }])
  const [input, setInput] = useState('')
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [showConfig, setShowConfig] = useState(false)
  const [leadData, setLeadData] = useState({})
  const [isComplete, setIsComplete] = useState(false)

  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)
  const userScrolledUp = useRef(false)
  const prevIsLoading = useRef(false)
  const messagesRef = useRef(messages)

  // Keep messagesRef in sync
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const {
    sendMessage,
    isLoading,
    error,
    clearError,
    lastCooldown,
  } = useChat(null, config, t, language)

  // Detect if user scrolled up manually
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    userScrolledUp.current = distanceFromBottom > 100
  }, [])

  // Scroll chat container to bottom
  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current
    if (container && !userScrolledUp.current) {
      container.scrollTop = container.scrollHeight
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  // Auto-focus input when loading finishes
  useEffect(() => {
    if (prevIsLoading.current && !isLoading && !isComplete) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus({ preventScroll: true })
        }
      }, 100)
    }
    prevIsLoading.current = isLoading
  }, [isLoading, isComplete])

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const messageContent = input.trim()
    setInput('')
    userScrolledUp.current = false

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    }

    const currentMessages = [...messagesRef.current, userMessage]
    setMessages(currentMessages)
    clearError()

    console.log('[INDEX] messagesRef.current length:', messagesRef.current.length)
    console.log('[INDEX] currentMessages length:', currentMessages.length)
    console.log('[INDEX] Sending to API:', currentMessages.map(m => {
      const contentStr = typeof m.content === 'string' ? m.content : m.displayText || JSON.stringify(m.content)
      return `${m.role}: ${contentStr.substring(0, 30)}...`
    }))

    try {
      console.log('[INDEX] Calling sendMessage...')
      const response = await sendMessage(currentMessages)
      console.log('[INDEX] sendMessage returned:', response)

      const contentForApi = typeof response.raw === 'string' ? response.raw : response.displayText

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: contentForApi,
        displayText: response.displayText,
        timestamp: new Date().toISOString(),
        structured: response.structured,
      }

      setMessages(prev => [...prev, assistantMessage])

      console.log('[LeadQualifier INDEX] response.structured:', response.structured)
      if (response.structured) {
        console.log('[LeadQualifier INDEX] leadFields from structured:', response.structured.leadFields)
        setLeadData(prev => {
          const newFields = response.structured.leadFields || {}
          const merged = { ...prev }

          console.log('[LeadQualifier INDEX] prev leadData:', prev)
          console.log('[LeadQualifier INDEX] newFields to merge:', newFields)

          Object.entries(newFields).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '' && value !== 'null') {
              merged[key] = value
            }
          })

          if (response.structured.score !== undefined) merged.score = response.structured.score
          if (response.structured.tier !== undefined) merged.tier = response.structured.tier
          if (response.structured.reasons) merged.reasons = response.structured.reasons
          if (response.structured.rawState) merged.rawState = response.structured.rawState

          console.log('[LeadQualifier INDEX] merged leadData:', merged)
          return merged
        })

        const nextAction = response.structured.nextAction
        if (nextAction === 'close_success' || nextAction === 'close_not_fit') {
          setIsComplete(true)
        }
      }
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }, [input, isLoading, sendMessage, clearError])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleReset = () => {
    setMessages([{
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: WELCOME_MESSAGE_ES,
      timestamp: new Date().toISOString(),
    }])
    setLeadData({})
    setIsComplete(false)
    clearError()
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true })
      }
    }, 100)
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-white">
              {t('solutions.leadQualifier.ui.pageTitle')}
            </h1>
          </div>
          <p className="text-amber-400 text-sm mb-3">
            {t('solutions.leadQualifier.ui.pageSubtitle')}
          </p>
          <p className="text-gray-400 text-sm mb-4">
            {t('solutions.leadQualifier.ui.painPoint')}
          </p>
        </motion.div>

        {/* Main Chat Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-gray-700 bg-gray-800/50 overflow-hidden flex flex-col h-[600px]"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{t('solutions.leadQualifier.ui.chatTitle')}</h3>
                    <p className="text-xs text-white/70">
                      {isLoading ? t('solutions.leadQualifier.ui.typing') : t('solutions.leadQualifier.ui.online')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  title={t('solutions.leadQualifier.ui.resetChat')}
                >
                  <RotateCcw className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFmMjkzNyIgb3BhY2l0eT0iMC4zIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"
              >
                <AnimatePresence>
                  {messages.map((message) => (
                    <ChatBubble key={message.id} message={message} language={language} />
                  ))}
                </AnimatePresence>

                {isLoading && <TypingIndicator />}
              </div>

              {/* Error Display */}
              {error && (
                <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20">
                  <p className="text-sm text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </p>
                </div>
              )}

              {/* Cooldown indicator */}
              {lastCooldown > 0 && (
                <div className="px-4 py-2 bg-amber-500/10 border-t border-amber-500/20">
                  <p className="text-sm text-amber-400">
                    {t('solutions.leadQualifier.ui.cooldownWait').replace('{seconds}', Math.ceil(lastCooldown / 1000))}
                  </p>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 bg-gray-800 border-t border-gray-700">
                {isComplete ? (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      {t('solutions.leadQualifier.ui.conversationComplete')}
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
                    >
                      {t('solutions.leadQualifier.ui.newConversation')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-end gap-2">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t('solutions.leadQualifier.ui.placeholder')}
                      rows={1}
                      className="flex-1 resize-none rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      style={{ maxHeight: '120px' }}
                      disabled={isLoading}
                      autoFocus
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="p-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar: Config + Lead Summary */}
          <div className="lg:col-span-1 space-y-4">
            {/* Config button: abre modal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-gray-700 bg-gray-800/50 overflow-hidden"
            >
              <button
                onClick={() => setShowConfig(true)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-700/50 transition-colors"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Settings className="h-4 w-4 text-primary-400" />
                  {t('solutions.leadQualifier.ui.configBtn')}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </motion.div>

            {/* Modal de configuración */}
            <AnimatePresence>
              {showConfig && (
                <ConfigPanel
                  config={config}
                  onSave={(newConfig) => { setConfig(newConfig); setShowConfig(false) }}
                  onClose={() => setShowConfig(false)}
                  t={t}
                  inline={false}
                />
              )}
            </AnimatePresence>

            <LeadSummaryCard leadData={leadData} config={config} t={t} language={language} />
          </div>
        </div>
      </div>
    </div>
  )
}
