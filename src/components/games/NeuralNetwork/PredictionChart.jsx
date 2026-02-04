export default function PredictionChart({ predictions }) {
  const maxProb = Math.max(...predictions)
  const predictedDigit = predictions.indexOf(maxProb)

  return (
    <div className="space-y-2">
      {predictions.map((prob, digit) => (
        <div key={digit} className="flex items-center gap-3">
          <div className="w-8 text-sm font-semibold text-gray-300">
            {digit}
          </div>
          <div className="flex-1 relative">
            <div className="h-6 bg-gray-700 rounded overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  digit === predictedDigit
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'bg-gradient-to-r from-gray-600 to-gray-500'
                }`}
                style={{ width: `${prob * 100}%` }}
              />
            </div>
          </div>
          <div className="w-16 text-right text-sm text-gray-300">
            {(prob * 100).toFixed(1)}%
          </div>
        </div>
      ))}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400 mb-1">
            {predictedDigit}
          </div>
          <div className="text-xs text-gray-400">
            {(maxProb * 100).toFixed(1)}% confidence
          </div>
        </div>
      </div>
    </div>
  )
}
