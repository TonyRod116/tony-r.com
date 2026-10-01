import { neuralDynamics } from '../../../data/neuralDynamics'

export default function NeuralTracePanel({ playback, phase, language, onPause, onStep, onStop }) {
  if(!playback)return null
  const copy=neuralDynamics[language], [title,formula,description]=copy.phases[phase.key]
  const training=playback.type==='training'
  return <section className="neural-trace-panel" data-testid="neural-trace-panel" data-trace-phase={phase.key} data-trace-mode={playback.type}>
    <div className="neural-trace-caption"><span className="ai-kicker">{training?copy.modeTraining:copy.modeInference}</span><span>{String(playback.index+1).padStart(2,'0')} / {playback.steps.length}</span></div>
    <h3 aria-live="polite">{title}</h3><code>{formula}</code><p>{description}</p>
    {training&&<dl className="neural-loss-values"><div><dt>{copy.lossBefore}</dt><dd data-testid="loss-before">{playback.snapshot.lossBefore.toPrecision(6)}</dd></div><div><dt>{copy.lossAfter}</dt><dd data-testid="loss-after">{phase.kind==='after'?playback.snapshot.lossAfter.toPrecision(6):'—'}</dd></div></dl>}
    <div className="neural-trace-controls"><button className="ai-text-button" onClick={onPause}>{playback.playing?copy.pause:copy.play}</button><button className="ai-text-button" disabled={playback.index===playback.steps.length-1} onClick={onStep}>{copy.step}</button><button className="ai-text-button" onClick={onStop}>{copy.stop}</button></div>
    <p className="neural-trace-note">{copy.animationNote}</p>
  </section>
}
