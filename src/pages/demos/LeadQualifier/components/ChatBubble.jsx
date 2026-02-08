import { motion } from 'framer-motion'
import { Check, CheckCheck } from 'lucide-react'

const LOCALE_MAP = { en: 'en-US', es: 'es-ES', ca: 'ca-ES' }

function formatTime(timestamp, language) {
  try {
    const locale = LOCALE_MAP[language] || 'es-ES'
    const date = new Date(timestamp)
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export default function ChatBubble({ message, language = 'es' }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`
          relative max-w-[80%] px-4 py-2 rounded-2xl shadow-sm
          ${isUser
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-gray-700 text-gray-100 rounded-bl-md'
          }
        `}
      >
        {/* Message tail */}
        <div
          className={`
            absolute bottom-0 w-3 h-3
            ${isUser
              ? 'right-[-6px] bg-primary-600'
              : 'left-[-6px] bg-gray-700'
            }
          `}
          style={{
            clipPath: isUser
              ? 'polygon(0 0, 100% 0, 0 100%)'
              : 'polygon(100% 0, 100% 100%, 0 0)',
          }}
        />

        {/* Message content */}
        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
          {message.displayText || message.content}
        </p>

        {/* Timestamp and status */}
        <div className={`flex items-center gap-1 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-xs ${isUser ? 'text-white/70' : 'text-gray-400'}`}>
            {formatTime(message.timestamp, language)}
          </span>
          {isUser && (
            <CheckCheck className="h-4 w-4 text-blue-300" />
          )}
        </div>
      </div>
    </motion.div>
  )
}
