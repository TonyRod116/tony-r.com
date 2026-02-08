import { useState, useCallback, useRef } from 'react'
import { callOpenAI } from '../utils/openai'
import { parseStructuredResponse, calculateFallbackScore } from '../utils/scoring'
import { SYSTEM_PROMPT } from '../utils/prompts'

const COOLDOWN_MS = 2000

export function useChat(apiToken, config, t, language) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastCooldown, setLastCooldown] = useState(0)

  const lastSendTime = useRef(0)
  const cooldownInterval = useRef(null)

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

      throw new Error(t('demos.leadQualifier.errors.cooldown').replace('{seconds}', Math.ceil(remaining / 1000)))
    }

    setIsLoading(true)
    setError(null)
    lastSendTime.current = Date.now()

    try {
      let displayText
      let structured = null
      let raw

      console.log('[useChat] Sending to ChatGPT, messages:', messages.length)

      const systemPrompt = SYSTEM_PROMPT(config, language)
      raw = await callOpenAI(apiToken, systemPrompt, messages, config, language)
      displayText = raw

      try {
        const parsed = parseStructuredResponse(raw, t)
        if (parsed) {
          structured = parsed
          displayText = parsed.displayText || raw
        }
      } catch (parseError) {
        console.warn('Could not parse structured response, using fallback scoring')
        structured = calculateFallbackScore(messages, config, t)
      }

      return {
        displayText,
        structured,
        raw,
      }
    } catch (err) {
      const errorMessage = err.message || t('demos.leadQualifier.errors.processingError')
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [apiToken, config, t, language])

  return {
    sendMessage,
    isLoading,
    error,
    clearError,
    lastCooldown,
  }
}
