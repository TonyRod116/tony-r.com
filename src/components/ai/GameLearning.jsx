import { gameLearning, learningCopy } from '../../data/gameLearning'
import './GameLearning.css'

export default function GameLearning({ id, language, state }) {
  const lesson = gameLearning[id], copy = learningCopy[language]
  if (!lesson) return null
  const number = value => new Intl.NumberFormat({ es: 'es-ES', en: 'en-GB', ca: 'ca-ES' }[language], { maximumFractionDigits: 2 }).format(value)
  const decision = state?.proposal ?? state?.decision
  const cell = key => { const [row, col] = key.split(',').map(Number); return copy.cell.replace('{row}', row + 1).replace('{col}', col + 1) }
  return <section className="ai-learning" data-testid="game-learning" data-game={id}>
    <div className="ai-learning-overview"><h3>{lesson.title[language]}</h3><p>{lesson.explanation[language]}</p>
    <div className="ai-learning-formula"><span className="ai-kicker">{copy.rule}</span><pre>{typeof lesson.formula === 'string' ? lesson.formula : lesson.formula[language]}</pre><p>{lesson.glossary[language]}</p></div>
    </div><div className="ai-learning-implementation"><div className="ai-learning-code"><header><span className="ai-kicker">{copy.code}</span><span>{lesson.function}</span></header><pre><code>{lesson.code}</code></pre></div>
    <details className="ai-learning-details"><summary>{copy.more}</summary><pre><code>{lesson.moreCode}</code></pre>{lesson.note && <p>{lesson.note[language]}</p>}<p>{copy.excerpt}</p></details></div>
    {id === 'tetris' && <div className="ai-learning-live" data-testid="learning-live" data-mode={state?.proposal ? 'proposal' : decision ? 'decision' : 'waiting'}>
      {decision ? <><p className="ai-kicker">{state?.proposal ? copy.proposal : copy.last} · {decision.target.name}</p>
        <dl className="ai-learning-metrics">{[[copy.lines, decision.cleared], [copy.height, decision.height], [copy.holes, decision.holes], [copy.roughness, decision.bumpiness]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{number(value)}</dd></div>)}</dl>
        <p className="ai-learning-equation" data-immediate={decision.immediate} data-future={decision.future} data-total={decision.score}>{number(decision.immediate)} + 0.6 × {number(decision.future)} = <strong>{number(decision.score)}</strong></p>
        <dl className="ai-learning-values"><div><dt>{copy.immediate}</dt><dd>{number(decision.immediate)}</dd></div><div><dt>{copy.future}{decision.nextName && ` · ${decision.nextName}`}</dt><dd>{number(decision.future)}</dd></div><div><dt>{copy.total}</dt><dd>{number(decision.score)}</dd></div></dl>
        <p>{copy.candidates.replace('{count}', decision.candidates)}</p></> : <p>{copy.waitingTetris}</p>}
      {decision?.forecastSteps > 0 && <p className="ai-learning-forecast" data-forecast-steps={decision.forecastSteps}>{({ es: 'Previsión de', en: 'Forecast of', ca: 'Previsió de' }[language])} {decision.forecastSteps} {({ es: 'piezas conocidas', en: 'known pieces', ca: 'peces conegudes' }[language])}: {decision.forecast.map(step => step.name).join(' → ')}. {({ es: 'La continuación incluye caducidad, perforación y líneas según las mismas reglas del juego.', en: 'The continuation includes expiry, drilling and lines under the same game rules.', ca: 'La continuació inclou caducitat, perforació i línies amb les mateixes regles del joc.' }[language])}</p>}
    </div>}
    {id === 'minesweeper' && <div className="ai-learning-live" data-testid="learning-live" data-mode={decision?.cells ? 'decision' : 'waiting'}>
      {decision?.cells ? <><p className="ai-kicker">{copy.safe} · {cell(decision.cell)}</p><p className="ai-learning-equation" data-safe-cell={decision.cell} data-constraint-count={decision.count} data-constraint-cells={decision.cells.join('|')}>{decision.cells.map(cell).join(' + ')} = {decision.count}</p><p>{copy.safeNote}</p></> : <p>{copy.waitingMines}</p>}
    </div>}
    {id === 'sixdegrees' && state?.result?.steps && <div className="ai-learning-live" data-testid="learning-live" data-mode="result"><p className="ai-kicker">{copy.path}</p><p>{state.source?.name} → {state.target?.name}</p><dl className="ai-learning-metrics"><div><dt>{copy.degrees}</dt><dd>{number(state.result.steps.length)}</dd></div><div><dt>{copy.discovered}</dt><dd>{number(state.result.visited)}</dd></div></dl><p>{copy.pathNote}</p></div>}
  </section>
}
