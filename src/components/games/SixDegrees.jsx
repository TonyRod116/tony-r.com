import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import AiExperimentLayout from '../ai/AiExperimentLayout'
import useCatalog from './SixDegrees/useCatalog'
import ActorInput from './SixDegrees/ActorInput'
import { sixDegreesCopy } from '../../data/sixDegreesCopy'
import './SixDegrees/SixDegrees.css'

export default function SixDegrees() {
  const { language } = useLanguage(), copy = sixDegreesCopy[language]
  const { status, stats, call, cancel, retry } = useCatalog()
  const [values, setValues] = useState({ source: '', target: '' }), [selected, setSelected] = useState({ source: null, target: null })
  const [result, setResult] = useState(null), [searching, setSearching] = useState(false), [error, setError] = useState('')
  const run = useRef(0)
  useEffect(() => () => { run.current++ }, [])
  const clear = useCallback(() => { run.current++; cancel('path'); setResult(null); setSearching(false); setError('') }, [cancel])
  const chooseSource = useCallback(person => { clear(); setSelected(current => ({ ...current, source: person })); setValues(current => ({ ...current, source: person.name })) }, [clear])
  const chooseTarget = useCallback(person => { clear(); setSelected(current => ({ ...current, target: person })); setValues(current => ({ ...current, target: person.name })) }, [clear])
  const change = (slot, value) => { clear(); setSelected(current => ({ ...current, [slot]: null })); setValues(current => ({ ...current, [slot]: value })) }
  const resolvePerson = async slot => {
    if (selected[slot]) return selected[slot]
    const response = await call('search', { slot, query: values[slot] }), matches = response.results
    if (!matches.length) throw new Error(copy.choose)
    const exact = matches.filter(person => person.exact)
    if (exact.length > 1 || (!exact.length && matches.length > 1 && matches[1].error - matches[0].error < 0.3)) throw new Error(copy.ambiguous)
    return exact[0] || matches[0]
  }
  const find = async event => {
    event.preventDefault(); clear(); const version = run.current; setSearching(true)
    try {
      const [source, target] = await Promise.all([resolvePerson('source'), resolvePerson('target')])
      if (version !== run.current) return
      setSelected({ source, target }); setValues({ source: source.name, target: target.name })
      const path = await call('path', { source: source.index, target: target.index })
      if (version !== run.current) return
      setResult(path); setSearching(false)
      if (path.steps === null) setError(copy.noPath)
    } catch (reason) { if (version === run.current) { setSearching(false); if (reason.name !== 'AbortError') setError([copy.choose, copy.ambiguous].includes(reason.message) ? reason.message : copy.searchFailed) } }
  }
  const example = async (sourceId, targetId) => {
    clear(); const version = run.current
    try {
      const [from, to] = await Promise.all([call('person', { originalId: sourceId }), call('person', { originalId: targetId })])
      if (version !== run.current) return
      setSelected({ source: from.person, target: to.person }); setValues({ source: from.person.name, target: to.person.name })
    } catch { if (version === run.current) setError(copy.searchFailed) }
  }
  const number = value => new Intl.NumberFormat({ es: 'es-ES', en: 'en-GB', ca: 'ca-ES' }[language]).format(value)
  return <AiExperimentLayout id="sixdegrees"><div className="degrees-stage">
    <header className="degrees-heading"><p className="ai-kicker">{copy.catalogue}</p><h2>{copy.title}</h2><p>{copy.intro}</p>
      {stats && <p className="degrees-counts"><strong>{number(stats.people)}</strong> {copy.people}<span>·</span><strong>{number(stats.movies)}</strong> {copy.movies}</p>}
    </header>
    <div className="degrees-catalog-state" data-testid="catalog-state" data-state={status} data-loaded-ms={stats?.elapsed} data-bytes={stats?.bytes} role="status">
      {status === 'loading' && <><p>{copy.loading}</p><small>{copy.loadingHint}</small></>}
      {status === 'error' && <><p>{copy.failed}</p><button className="ai-button ai-button-secondary" onClick={() => { clear(); setSelected({ source: null, target: null }); retry() }}>{copy.retry}</button></>}
    </div>
    <form onSubmit={find} className="degrees-form">
      <div className="degrees-fields">
        <ActorInput slot="source" label={copy.source} value={values.source} person={selected.source} onChange={value => change('source', value)} onSelect={chooseSource} call={call} ready={status === 'ready'} resolving={searching} copy={copy} />
        <ArrowRight className="degrees-fields-arrow" size={24} aria-hidden="true" />
        <ActorInput slot="target" label={copy.target} value={values.target} person={selected.target} onChange={value => change('target', value)} onSelect={chooseTarget} call={call} ready={status === 'ready'} resolving={searching} copy={copy} />
      </div>
      <div className="degrees-actions"><button className="ai-button" disabled={status !== 'ready' || searching || !values.source.trim() || !values.target.trim()}>{searching ? copy.searching : copy.find}<ArrowRight size={18} aria-hidden="true" /></button>
        <div className="degrees-examples"><span>{copy.example}</span><button type="button" disabled={status !== 'ready'} onClick={() => example(102, 158)}>Kevin Bacon → Tom Hanks</button><button type="button" disabled={status !== 'ready'} onClick={() => example(138, 3053338)}>Leonardo DiCaprio → Margot Robbie</button></div>
      </div>
    </form>
    {error && <p className="degrees-error" role="alert">{error}</p>}
    {result?.steps && <section className="degrees-result" aria-live="polite">
      <header><h3><strong>{result.steps.length}</strong> {result.steps.length === 1 ? { es: 'grado de separación', en: 'degree of separation', ca: 'grau de separació' }[language] : copy.found}</h3>{result.steps.length === 0 && <p>{copy.same}</p>}</header>
      <ol>{result.steps.map((step, i) => <li key={`${step.movie.id}-${i}`}>
        <span className="degrees-step-number">{String(i + 1).padStart(2, '0')}</span><div><p className="degrees-pair">{step.from.name}<ArrowRight size={18} aria-hidden="true" />{step.to.name}</p><p className="degrees-shared">{copy.shared}</p><p className="degrees-film">{step.movie.title}{step.movie.year && <span> ({step.movie.year})</span>}</p></div>
        <a href={`https://www.imdb.com/title/tt${String(step.movie.id).padStart(7, '0')}/`} target="_blank" rel="noopener noreferrer">{copy.movieLink}<ArrowUpRight size={16} aria-hidden="true" /></a>
      </li>)}</ol>
    </section>}
    <footer className="degrees-note"><p>{copy.note}</p><a href="https://cs50.harvard.edu/ai/projects/0/degrees/" target="_blank" rel="noopener noreferrer">{copy.sourceLink}<ArrowUpRight size={16} aria-hidden="true" /></a></footer>
  </div></AiExperimentLayout>
}
