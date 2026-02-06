import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Key, AlertTriangle, Info } from 'lucide-react'

export default function TokenInput({ currentToken, onSubmit, onClose }) {
  const [token, setToken] = useState('')
  const [showToken, setShowToken] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(token.trim())
  }

  const handleClear = () => {
    setToken('')
    onSubmit('')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-800 rounded-2xl border border-gray-700 max-w-md w-full p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-primary-400" />
            Configurar Token OpenAI
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Security notice */}
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-200">
              <p className="font-medium mb-1">Importante sobre seguridad:</p>
              <ul className="list-disc list-inside space-y-1 text-amber-200/80">
                <li>El token solo se guarda en memoria (se pierde al recargar)</li>
                <li>Nunca se envía a ningún servidor excepto OpenAI</li>
                <li>Usa un token de API de pruebas con límites bajos</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Info about mock mode */}
        <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex gap-2">
            <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-200">
              Sin token, la demo funciona en <strong>modo simulado</strong> con respuestas 
              predefinidas para que puedas probar la interfaz.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Key de OpenAI
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="sk-..."
                className="w-full rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-20"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {showToken ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          {currentToken && (
            <p className="text-sm text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Token actualmente configurado
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary-600 hover:bg-primary-700 text-white py-3 text-sm font-medium transition-colors"
            >
              {token ? 'Guardar Token' : 'Usar Modo Simulado'}
            </button>
            {currentToken && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 text-sm font-medium transition-colors"
              >
                Borrar
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
