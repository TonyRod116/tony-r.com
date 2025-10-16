import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './hooks/useLanguage.jsx'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import GoogleAnalytics from './components/GoogleAnalytics'
import CookieConsent from './components/CookieConsent'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Resume from './pages/Resume'
import AiLab from './pages/AiLab'
import TicTacToe from './components/games/TicTacToe'
import Minesweeper from './components/games/Minesweeper'
import SixDegrees from './components/games/SixDegrees'
import Nim from './components/games/Nim'

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
              <Route path="/ai/tictactoe" element={<TicTacToe />} />
              <Route path="/ai/minesweeper" element={<Minesweeper />} />
              <Route path="/ai/sixdegrees" element={<SixDegrees />} />
              <Route path="/ai/nim" element={<Nim />} />
            </Routes>
          </main>
          <Footer />
          <CookieConsent />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
