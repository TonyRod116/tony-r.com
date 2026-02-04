import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './hooks/useLanguage.jsx'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import GoogleAnalytics from './components/GoogleAnalytics'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Resume from './pages/Resume'
import AiLab from './pages/AiLab'
import Demos from './pages/Demos'
import PresupuestoOrientativo from './pages/demos/PresupuestoOrientativo'
import RenderPresupuesto from './pages/demos/RenderPresupuesto'
import TicTacToe from './components/games/TicTacToe'
import Minesweeper from './components/games/Minesweeper'
import SixDegrees from './components/games/SixDegrees'
import Nim from './components/games/Nim'
import Tetris from './components/games/Tetris'
import { lazy, Suspense } from 'react'

const NeuralNetworkVisualization = lazy(() => import('./components/games/NeuralNetworkVisualization'))

function App() {
  // Prevenir overflow horizontal globalmente y forzar modo oscuro
  useEffect(() => {
    document.body.style.overflowX = 'hidden'
    document.documentElement.style.overflowX = 'hidden'
    
    // Forzar modo oscuro siempre
    document.documentElement.classList.add('dark')
    document.documentElement.setAttribute('data-theme', 'dark')
    
    return () => {
      document.body.style.overflowX = ''
      document.documentElement.style.overflowX = ''
    }
  }, [])

  return (
    <LanguageProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-gray-900 overflow-x-hidden">
          <ScrollToTop />
          <GoogleAnalytics />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/ai" element={<AiLab />} />
              <Route path="/demos" element={<Demos />} />
              <Route path="/demos/presupuesto-orientativo" element={<PresupuestoOrientativo />} />
              <Route path="/demos/render-presupuesto" element={<RenderPresupuesto />} />
              <Route path="/ai/tictactoe" element={<TicTacToe />} />
              <Route path="/ai/minesweeper" element={<Minesweeper />} />
              <Route path="/ai/sixdegrees" element={<SixDegrees />} />
              <Route path="/ai/nim" element={<Nim />} />
              <Route path="/ai/tetris" element={<Tetris />} />
              <Route 
                path="/ai/neural-network" 
                element={
                  <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>}>
                    <NeuralNetworkVisualization />
                  </Suspense>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
