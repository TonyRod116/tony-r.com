import { useState, useCallback, useRef } from 'react'
import { callOpenAI } from '../utils/openai'
import { getMockResponse, resetMockFlow } from '../utils/mockResponses'
import { parseStructuredResponse, calculateFallbackScore } from '../utils/scoring'
import { SYSTEM_PROMPT } from '../utils/prompts'

const COOLDOWN_MS = 2000

export function useChat(apiToken, config) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastCooldown, setLastCooldown] = useState(0)
  
  const lastSendTime = useRef(0)
  const cooldownInterval = useRef(null)

  // Detectar modo: producción usa proxy, desarrollo usa token o mock
  const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost'
  const hasManualToken = !!apiToken
  const isMockMode = !isProduction && !hasManualToken

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const sendMessage = useCallback(async (messages) => {
    // Check cooldown
    const now = Date.now()
    const timeSinceLast = now - lastSendTime.current
    
    if (timeSinceLast < COOLDOWN_MS) {
      const remaining = COOLDOWN_MS - timeSinceLast
      setLastCooldown(remaining)
      
      // Start countdown
      if (cooldownInterval.current) clearInterval(cooldownInterval.current)
      cooldownInterval.current = setInterval(() => {
        const elapsed = Date.now() - now
        const left = Math.max(0, remaining - elapsed)
        setLastCooldown(left)
        if (left <= 0) {
          clearInterval(cooldownInterval.current)
          cooldownInterval.current = null
        }
      }, 100)
      
      throw new Error(`Espera ${Math.ceil(remaining / 1000)} segundos antes de enviar otro mensaje`)
    }

    setIsLoading(true)
    setError(null)
    lastSendTime.current = Date.now()

    try {
      let displayText
      let structured = null
      let raw

      if (isMockMode) {
        // Modo mock local - respuestas simuladas
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))
        const mockResponse = getMockResponse(messages, config)
        displayText = mockResponse.displayText
        structured = {
          displayText: mockResponse.displayText,
          leadFields: mockResponse.leadFields || {},
          score: mockResponse.score || 0,
          tier: mockResponse.tier || 5,
          reasons: mockResponse.reasons || [],
          nextQuestion: mockResponse.nextQuestion || null,
        }
        raw = mockResponse
      } else {
        // Modo real - OpenAI (vía proxy en prod, o directo con token en dev)
        const systemPrompt = SYSTEM_PROMPT(config)
        raw = await callOpenAI(apiToken, systemPrompt, messages, config)
        displayText = raw
        
        console.log('[LeadQualifier] Raw GPT response:', raw)

        try {
          const parsed = parseStructuredResponse(raw)
          console.log('[LeadQualifier] Parsed response:', parsed)
          if (parsed) {
            structured = parsed
            displayText = parsed.displayText || raw
          }
        } catch (parseError) {
          console.warn('Could not parse structured response, using fallback scoring')
          structured = calculateFallbackScore(messages, config)
        }
      }

      return {
        displayText,
        structured,
        raw,
      }
    } catch (err) {
      const errorMessage = err.message || 'Error al procesar el mensaje'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [apiToken, config, isMockMode])

  return {
    sendMessage,
    isLoading,
    error,
    clearError,
    lastCooldown,
    isMockMode,
  }
}
