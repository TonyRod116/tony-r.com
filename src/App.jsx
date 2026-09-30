import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider, useLanguage } from './hooks/useLanguage.jsx'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import GoogleAnalytics from './components/GoogleAnalytics'
import RouteBoundary from './components/RouteBoundary'
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const Contact = lazy(() => import('./pages/Contact'))
const Resume = lazy(() => import('./pages/Resume'))
const AiLab = lazy(() => import('./pages/AiLab'))
const Demos = lazy(() => import('./pages/Demos'))
const PresupuestoOrientativo = lazy(() => import('./pages/demos/PresupuestoOrientativo'))
const RenderPresupuesto = lazy(() => import('./pages/demos/RenderPresupuesto'))
const LeadQualifier = lazy(() => import('./pages/demos/LeadQualifier'))
const TicTacToe = lazy(() => import('./components/games/TicTacToe'))
const Minesweeper = lazy(() => import('./components/games/Minesweeper'))
const SixDegrees = lazy(() => import('./components/games/SixDegrees'))
const Nim = lazy(() => import('./components/games/Nim'))
const Tetris = lazy(() => import('./components/games/Tetris'))
const NeuralNetworkVisualization = lazy(() => import('./components/games/NeuralNetworkVisualization'))

function AppContent() {
  const { isTransitioning, language } = useLanguage()
  const loadingLabel = { es: 'Cargando…', en: 'Loading…', ca: 'Carregant…' }[language]

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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-900 overflow-x-hidden">
        <ScrollToTop />
        <GoogleAnalytics />
        <Header />
        <main
          className={`min-h-[70vh] flex-1 transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        >
          <RouteBoundary language={language}>
          <Suspense fallback={<div role="status" className="pt-24 px-6 text-gray-300">{loadingLabel}</div>}>
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
            <Route path="/demos/lead-qualifier" element={<LeadQualifier />} />
            <Route path="/ai/tictactoe" element={<TicTacToe />} />
            <Route path="/ai/minesweeper" element={<Minesweeper />} />
            <Route path="/ai/sixdegrees" element={<SixDegrees />} />
            <Route path="/ai/nim" element={<Nim />} />
            <Route path="/ai/tetris" element={<Tetris />} />
            <Route
              path="/ai/neural-network"
              element={<NeuralNetworkVisualization />}
            />
          </Routes>
          </Suspense>
          </RouteBoundary>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
