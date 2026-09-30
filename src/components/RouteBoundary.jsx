import { Component } from 'react'
import { useLocation } from 'react-router-dom'
import { captureRuntimeError } from '../utils/telemetry'

const messages = {
  es: { title: 'No hemos podido cargar esta página.', body: 'Puedes recargarla o ir a otra sección desde el menú.', action: 'Recargar' },
  en: { title: 'We could not load this page.', body: 'You can reload it or open another section from the menu.', action: 'Reload' },
  ca: { title: 'No hem pogut carregar aquesta pàgina.', body: 'Pots tornar-la a carregar o anar a una altra secció des del menú.', action: 'Torna a carregar' },
}

class PageErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { captureRuntimeError('runtime_error') }
  render() {
    if (!this.state.failed) return this.props.children
    const copy = messages[this.props.language] || messages.es
    return (
      <section role="alert" className="pt-24 px-6 pb-16 text-gray-200">
        <h1 className="text-2xl font-semibold mb-4">{copy.title}</h1>
        <p className="mb-6">{copy.body}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>{copy.action}</button>
      </section>
    )
  }
}

export default function RouteBoundary({ language, children }) {
  const location = useLocation()
  return <PageErrorBoundary key={location.pathname} language={language}>{children}</PageErrorBoundary>
}
