import { useEffect } from 'react'

export default function NeuralNetworkRedirect() {
  useEffect(() => {
    // Redirect to static HTML page
    window.location.href = '/neural-network.html'
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="text-center">
        <p>Redirecting to Neural Network visualization...</p>
      </div>
    </div>
  )
}
