import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './hooks/useLanguage.jsx'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Resume from './pages/Resume'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <ScrollToTop />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/resume" element={<Resume />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
