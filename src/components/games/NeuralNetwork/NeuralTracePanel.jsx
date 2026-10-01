import { neuralControls, neuralDynamics } from '../../../data/neuralDynamics'

export default function NeuralTracePanel({ playback, training, phase, language, onStep, onStop }) {
  const copy=neuralDynamics[language],controls=neuralControls[language], [title,formula,description]=copy.phases[phase.key]
  return <section className="neural-trace-panel" data-testid="neural-trace-panel" data-trace-phase={phase.key} data-trace-mode={playback?.type??'inspection'}>
    <div className="neural-trace-caption"><span className="ai-kicker">{playback?copy.modeInference:controls.inspection}</span>{playback&&<span>{String(playback.index+1).padStart(2,'0')} / {playback.steps.length}</span>}</div>
    <h3 aria-live="polite">{title}</h3><code>{formula}</code><p>{description}</p>
    {training&&<dl className="neural-loss-values"><div><dt>{copy.loss}</dt><dd data-testid="loss-before">{training.lossBefore.toPrecision(6)}</dd></div></dl>}
    {playback&&<div className="neural-trace-controls"><button className="ai-text-button" disabled={playback.index===playback.steps.length-1} onClick={onStep}>{copy.step}</button><button className="ai-text-button" onClick={onStop}>{copy.stop}</button></div>}
    <p className="neural-trace-note">{copy.animationNote}</p>
  </section>
}
