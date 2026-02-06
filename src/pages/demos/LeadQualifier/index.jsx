import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RotateCcw, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'
import ChatBubble from './components/ChatBubble'
import TypingIndicator from './components/TypingIndicator'
import LeadSummaryCard from './components/LeadSummaryCard'
import { useChat } from './hooks/useChat'
import { DEFAULT_CONFIG } from './utils/config'
import { resetMockFlow } from './utils/mockResponses'

const INITIAL_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: '¡Hola! Soy el asistente de proyectos. Estoy aquí para ayudarte a definir tu reforma y resolver cualquier duda. ¿Qué tipo de proyecto tienes en mente?',
  timestamp: new Date().toISOString(),
}

export default function LeadQualifier() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [config] = useState(DEFAULT_CONFIG)
  const [leadData, setLeadData] = useState(null)
  const [isComplete, setIsComplete] = useState(false)
  
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)
  const userScrolledUp = useRef(false)
  
  const { 
    sendMessage, 
    isLoading, 
    error, 
    clearError,
    lastCooldown,
  } = useChat(null, config) // null token = usa proxy en producción

  // Detect if user scrolled up manually
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return
    
    const { scrollTop, scrollHeight, clientHeight } = container
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    userScrolledUp.current = distanceFromBottom > 100
  }, [])

  // Scroll chat container to bottom (not the page!)
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

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return
    
    // Reset scroll flag when user sends message
    userScrolledUp.current = false
    
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    clearError()
    
    try {
      const response = await sendMessage([...messages, userMessage])
      
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.displayText,
        timestamp: new Date().toISOString(),
        structured: response.structured,
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      // Update lead data from structured response - accumulate progressively
      if (response.structured) {
        setLeadData(prev => {
          const newFields = response.structured.leadFields || {}
          const merged = { ...prev }
          
          // Only update fields that have actual values (not null/undefined)
          Object.entries(newFields).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
              merged[key] = value
            }
          })
          
          // Always update score/tier/reasons as they reflect current state
          merged.score = response.structured.score
          merged.tier = response.structured.tier
          merged.reasons = response.structured.reasons
          
          // Keep rawState for advanced view
          if (response.structured.rawState) {
            merged.rawState = response.structured.rawState
          }
          
          return merged
        })
        
        // Check if conversation is complete
        const nextAction = response.structured.nextAction
        if (nextAction === 'close_success' || nextAction === 'close_not_fit') {
          setIsComplete(true)
        }
      }
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }, [input, isLoading, messages, sendMessage, clearError])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleReset = () => {
    resetMockFlow() // Reset mock state
    setMessages([{
      ...INITIAL_MESSAGE,
      id: `welcome-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }])
    setLeadData(null)
    setIsComplete(false)
    clearError()
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary-400" />
              Asistente de Proyectos
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Chat conversacional para definir tu proyecto de reforma
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
                    <h3 className="font-semibold text-white">Tu Empresa de Reforma</h3>
                    <p className="text-xs text-white/70">
                      {isLoading ? 'Escribiendo...' : 'En línea'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  title="Reiniciar chat"
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
                    <ChatBubble key={message.id} message={message} />
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
                    Espera {Math.ceil(lastCooldown / 1000)}s antes del siguiente mensaje...
                  </p>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 bg-gray-800 border-t border-gray-700">
                {isComplete ? (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      Conversación completada
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
                    >
                      Nueva conversación
                    </button>
                  </div>
                ) : (
                  <div className="flex items-end gap-2">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Escribe tu mensaje..."
                      rows={1}
                      className="flex-1 resize-none rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      style={{ maxHeight: '120px' }}
                      disabled={isLoading}
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

          {/* Lead Summary Sidebar */}
          <div className="lg:col-span-1">
            <LeadSummaryCard leadData={leadData} />
          </div>
        </div>
      </div>
    </div>
  )
}
