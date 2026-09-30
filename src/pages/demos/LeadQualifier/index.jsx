import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, RotateCcw } from 'lucide-react'
import DemoPage from '../../../components/site/DemoPage'
import { siteContent } from '../../../data/siteContent'
import ChatBubble from './components/ChatBubble'
import TypingIndicator from './components/TypingIndicator'
import LeadSummaryCard from './components/LeadSummaryCard'
import ConfigPanel from './components/ConfigPanel'
import { useChat } from './hooks/useChat'
import { DEFAULT_CONFIG } from './utils/config'
import { useLanguage } from '../../../hooks/useLanguage'
import { translations } from '../../../data/translations'

export default function LeadQualifier() {
  const { t, language } = useLanguage()
  const copy = siteContent[language]
  const conversation = useRef(0)

  const [messages, setMessages] = useState(() => [{
    id: 'welcome',
    role: 'assistant',
    content: t('solutions.leadQualifier.ui.welcomeMessage'),
    timestamp: new Date().toISOString(),
  }])

  useEffect(() => {
    const welcome = translations[language].solutions.leadQualifier.ui.welcomeMessage
    setMessages(previous => previous.length === 1 && previous[0].role === 'assistant' && previous[0].content !== welcome ? [{...previous[0],content:welcome}] : previous)
  }, [language])
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

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const currentConversation = conversation.current
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
    messagesRef.current = currentMessages
    setMessages(currentMessages)
    clearError()

    try {
      const response = await sendMessage(currentMessages)
      if (currentConversation !== conversation.current) return

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

      if (response.structured) {
        setLeadData(prev => {
          const newFields = response.structured.leadFields || {}
          const merged = { ...prev }

          Object.entries(newFields).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '' && value !== 'null') {
              merged[key] = value
            }
          })

          if (response.structured.score !== undefined) merged.score = response.structured.score
          if (response.structured.tier !== undefined) merged.tier = response.structured.tier
          if (response.structured.reasons) merged.reasons = response.structured.reasons
          if (response.structured.rawState) merged.rawState = response.structured.rawState

          return merged
        })

        const nextAction = response.structured.nextAction
        if (nextAction === 'close_success' || nextAction === 'close_not_fit') {
          setIsComplete(true)
        }
      }
    } catch {
      if (currentConversation !== conversation.current) clearError()
    }
  }, [input, isLoading, sendMessage, clearError])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleReset = () => {
    conversation.current++
    userScrolledUp.current = false
    setInput('')
    setMessages([{
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: t('solutions.leadQualifier.ui.welcomeMessage'),
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

  return <DemoPage id="lead-qualifier">
    <div className="site-chat-grid">
      <div className="site-chat">
        <header className="site-chat-header"><div><h3>{t('solutions.leadQualifier.ui.chatTitle')}</h3><p>{isLoading?t('solutions.leadQualifier.ui.typing'):copy.readyChat}</p></div><button onClick={handleReset} aria-label={copy.reset}><RotateCcw size={20} /></button></header>
        <div ref={messagesContainerRef} onScroll={handleScroll} className="site-chat-messages" aria-live="polite" aria-relevant="additions text">
          {messages.map(message=><ChatBubble key={message.id} message={message} language={language} />)}
          {isLoading&&<TypingIndicator />}
        </div>
        {error&&<p role="alert" className="site-message is-error">{error}</p>}
        {lastCooldown>0&&<p className="site-note">{t('solutions.leadQualifier.ui.cooldownWait').replace('{seconds}',Math.ceil(lastCooldown/1000))}</p>}
        <div className="site-chat-input">
          {isComplete?<><p>{t('solutions.leadQualifier.ui.conversationComplete')}</p><button className="site-button" onClick={handleReset}>{copy.reset}</button></>:<><textarea ref={inputRef} aria-label={copy.message} value={input} onChange={event=>setInput(event.target.value)} onKeyDown={handleKeyDown} placeholder={t('solutions.leadQualifier.ui.placeholder')} rows={2} disabled={isLoading} /><button className="site-button" aria-label={copy.send} onClick={handleSend} disabled={!input.trim()||isLoading}><Send size={20} /></button></>}
        </div>
      </div>
      <aside><button className="site-button site-button-secondary" onClick={()=>setShowConfig(true)}>{copy.configuration}</button><div className="site-lead-summary"><LeadSummaryCard leadData={leadData} config={config} t={t} language={language} /></div></aside>
    </div>
    <ConfigPanel config={config} onSave={newConfig=>{setConfig(newConfig);setShowConfig(false)}} onClose={()=>setShowConfig(false)} t={t} open={showConfig} />
  </DemoPage>
}
