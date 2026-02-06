import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RotateCcw, Settings, Users, Key, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'
import ChatBubble from './components/ChatBubble'
import TypingIndicator from './components/TypingIndicator'
import TokenInput from './components/TokenInput'
import LeadSummaryCard from './components/LeadSummaryCard'
import ConfigPanel from './components/ConfigPanel'
import { useChat } from './hooks/useChat'
import { DEFAULT_CONFIG } from './utils/config'
import { generateLeadId, saveLeadToStorage } from './utils/storage'
import { resetMockFlow } from './utils/mockResponses'

const INITIAL_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: '¡Hola! Soy el asistente de Total Homes. Estoy aquí para ayudarte con tu proyecto de reforma. ¿Podrías contarme qué tipo de reforma estás considerando?',
  timestamp: new Date().toISOString(),
}

export default function LeadQualifier() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [apiToken, setApiToken] = useState('')
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [leadData, setLeadData] = useState(null)
  const [isComplete, setIsComplete] = useState(false)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const { 
    sendMessage, 
    isLoading, 
    error, 
    clearError,
    lastCooldown,
    isMockMode 
  } = useChat(apiToken, config)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return
    
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
      
      // Update lead data from structured response
      if (response.structured) {
        setLeadData(prev => ({
          ...prev,
          ...response.structured.leadFields,
          score: response.structured.score,
          tier: response.structured.tier,
          reasons: response.structured.reasons,
        }))
        
        // Check if conversation is complete (tier assigned and no more questions)
        if (response.structured.tier && !response.structured.nextQuestion) {
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
    inputRef.current?.focus()
  }

  const handleSaveLead = () => {
    if (!leadData) return
    
    const lead = {
      id: generateLeadId(),
      createdAt: new Date().toISOString(),
      summary: `${leadData.projectType || 'Reforma'} en ${leadData.city || 'Barcelona'}`,
      tier: leadData.tier || 0,
      score: leadData.score || 0,
      reasons: leadData.reasons || [],
      fields: leadData,
      transcript: messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      })),
    }
    
    saveLeadToStorage(lead)
    alert('Lead guardado correctamente')
  }

  const handleTokenSubmit = (token) => {
    setApiToken(token)
    setShowTokenInput(false)
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
              Calificador de Leads IA
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTokenInput(true)}
                className={`p-2 rounded-lg transition-colors ${
                  apiToken 
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
                title={apiToken ? 'Token configurado' : 'Configurar token'}
              >
                <Key className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowConfig(true)}
                className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 transition-colors"
                title="Configuración"
              >
                <Settings className="h-5 w-5" />
              </button>
              <a
                href="/demos/lead-qualifier/admin"
                className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 transition-colors"
                title="Panel Admin"
              >
                <Users className="h-5 w-5" />
              </a>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Chat conversacional para calificar leads de reformas. 
            {isMockMode && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-400">
                <AlertCircle className="h-4 w-4" />
                Modo simulado (sin token)
              </span>
            )}
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
                    <h3 className="font-semibold text-white">Total Homes</h3>
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFmMjkzNyIgb3BhY2l0eT0iMC4zIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]">
                <AnimatePresence>
                  {messages.map((message) => (
                    <ChatBubble key={message.id} message={message} />
                  ))}
                </AnimatePresence>
                
                {isLoading && <TypingIndicator />}
                
                <div ref={messagesEndRef} />
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
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveLead}
                        className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
                      >
                        Guardar Lead
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
                      >
                        Nueva conversación
                      </button>
                    </div>
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

      {/* Token Input Modal */}
      <AnimatePresence>
        {showTokenInput && (
          <TokenInput
            currentToken={apiToken}
            onSubmit={handleTokenSubmit}
            onClose={() => setShowTokenInput(false)}
          />
        )}
      </AnimatePresence>

      {/* Config Panel Modal */}
      <AnimatePresence>
        {showConfig && (
          <ConfigPanel
            config={config}
            onSave={setConfig}
            onClose={() => setShowConfig(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
