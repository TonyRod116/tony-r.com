import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowDown, ChevronsDown, RotateCw } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import { labCopy } from '../../data/aiExperiments'
import { tetrisSpecials } from '../../data/tetrisSpecials'
import AiExperimentLayout from '../ai/AiExperimentLayout'
import { PIECES, LINE_CLEAR_MS, CRYSTAL_BREAK_MS, CRYSTAL_LIFETIME, REACTION_STEP_MS, cellsFor, cellKind, crystalRemaining, landing, lockPiece, previewCells, randomPiece, newGame, gameReducer, analyzeMove } from './tetrisEngine'

function MiniBoard({ result, title, testId }) {
  const fresh = new Set(result?.newCells?.map(([r,c]) => `${r}-${c}`))
  return <div className="ai-tetris-result"><p className="ai-kicker">{title}</p><div className="ai-tetris-plan-board" role="img" aria-label={title} data-testid={testId}>
    {(result?.board ?? Array.from({ length: 20 }, () => Array(10).fill(null))).flatMap((row,r) => row.map((cell,c) => {
      const name = cellKind(cell)
      return <span key={`${r}-${c}`} data-cell-kind={name ?? ''} data-life={crystalRemaining(cell, result?.turn)} className={fresh.has(`${r}-${c}`) ? 'is-target' : name ? 'is-occupied' : ''} style={name ? { '--preview-color': PIECES[name].color } : undefined}/>
    }))}</div></div>
}

const readNumber = key => { try { const value = Number(localStorage.getItem(key)); return Number.isFinite(value) ? Math.max(0, value) : 0 } catch { return 0 } }
export default function Tetris() {
  const { language } = useLanguage()
  const copy = { ...labCopy[language], ...tetrisSpecials[language] }
  const pieceName = name => copy[name] ?? name
  const [game, dispatch] = useReducer(gameReducer, null, () => newGame(randomPiece(), randomPiece(), {}, randomPiece()))
  const [record, setRecord] = useState(() => readNumber('tetris_maxScore'))
  const [muted, setMuted] = useState(true)
  const [aiMoves, setAiMoves] = useState(() => readNumber('tetris_ai_moves'))
  const audio = useRef(null)
  const boardRef = useRef(null)
  const finished = useRef(false)
  const lastAiMoves = useRef(0)
  const isSettling = Boolean(game.settling)
  const isResolving = Boolean(game.resolution)
  const reactionStatus = isSettling ? copy.magicFlow : game.drilling ? copy.drilling : game.cracking ? copy.crystalBreaking : ''
  const proposalSource = game.resolution?.source ?? game
  const proposal = useMemo(() => game.ai && !game.over ? analyzeMove(proposalSource.board, proposalSource.piece, proposalSource.next, proposalSource.magic, proposalSource.turn, proposalSource.following) : null, [game.ai, game.over, proposalSource.board, proposalSource.piece, proposalSource.next, proposalSource.magic, proposalSource.turn, proposalSource.following])
  const dropPlan = useMemo(() => !game.over && !isResolving ? lockPiece(game.board, landing(game.board, game.piece), game.magic, game.turn) : null, [game.over, isResolving, game.board, game.piece, game.magic, game.turn])
  const dropPreview = game.resolution?.result ?? (dropPlan && !dropPlan.over ? dropPlan : { board: game.board, turn: game.turn })
  const act = (type, first) => {
    dispatch({ type, first: type === 'restart' ? first ?? randomPiece() : undefined, next: randomPiece(), following: type === 'restart' ? randomPiece() : undefined })
    if (['left','right','tick','rotate','drop','ai-move','restart'].includes(type)) boardRef.current?.focus({ preventScroll: true })
  }
  useEffect(() => {
    const keyboard = event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest?.('a, button, input, textarea, select, [contenteditable="true"], .ai-learning, .ai-tetris-specials, .ai-tetris-forecast')) return
      const action = { ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'tick', ArrowUp: 'rotate', ' ': 'drop', p: 'pause', P: 'pause', a: 'ai-move', A: 'ai-move' }[event.key]
      if (!action) return
      event.preventDefault()
      if (event.repeat && ['drop','pause','ai-move'].includes(action)) return
      boardRef.current?.focus({ preventScroll: true })
      dispatch({ type: action, next: randomPiece() })
    }
    window.addEventListener('keydown', keyboard)
    return () => window.removeEventListener('keydown', keyboard)
  }, [])
  useEffect(() => {
    if (game.over || game.paused || isResolving) return
    const timer = setInterval(() => dispatch({ type: 'tick', next: randomPiece() }), Math.max(90, 1000 / game.level))
    return () => clearInterval(timer)
  }, [game.over, game.paused, game.level, isResolving])
  const reaction = game.settling ?? game.drilling
  useEffect(() => {
    if (!reaction?.token || game.paused || game.over) return
    const token = reaction.token
    const timer = setInterval(() => dispatch({ type: isSettling ? 'settle-tick' : 'drill-tick', token }), REACTION_STEP_MS)
    return () => clearInterval(timer)
  }, [reaction?.token, isSettling, game.paused, game.over])
  useEffect(() => {
    if (!game.clearing || game.paused || game.over) return
    const result = game.clearing.result
    const timer = setTimeout(() => dispatch({ type: 'clear-complete', result }), LINE_CLEAR_MS)
    return () => clearTimeout(timer)
  }, [game.clearing, game.paused, game.over])
  useEffect(() => {
    if (!game.cracking || game.paused || game.over) return
    const token = game.cracking
    const timer = setTimeout(() => dispatch({ type: 'crack-complete', token }), CRYSTAL_BREAK_MS)
    return () => clearTimeout(timer)
  }, [game.cracking, game.paused, game.over])
  useEffect(() => {
    const pause = () => { if (document.hidden) dispatch({ type: 'visibility-pause' }) }
    document.addEventListener('visibilitychange', pause)
    return () => document.removeEventListener('visibilitychange', pause)
  }, [])
  useEffect(() => {
    if (!audio.current) return
    if (muted || game.paused || game.over) audio.current.pause()
    else { audio.current.volume = 0.2; audio.current.play().catch(() => setMuted(true)) }
  }, [muted, game.paused, game.over])
  useEffect(() => {
    if (game.score > record) { setRecord(game.score); try { localStorage.setItem('tetris_maxScore', String(game.score)) } catch { /* Private mode may disable storage. */ } }
    if (game.over && !finished.current) { finished.current = true; try { localStorage.setItem('tetris_games', String(readNumber('tetris_games') + 1)) } catch { /* Optional persistence. */ } }
    if (!game.over) finished.current = false
  }, [game.score, game.over, record])
  useEffect(() => {
    const delta = Math.max(0, game.aiMoves - lastAiMoves.current)
    lastAiMoves.current = game.aiMoves
    if (!delta) return
    setAiMoves(value => {
      const total = value + delta
      try { localStorage.setItem('tetris_ai_moves', String(total)) } catch { /* Optional persistence. */ }
      return total
    })
  }, [game.aiMoves])
  const active = new Map(!isResolving || game.drilling ? cellsFor(game.piece).filter(([r]) => r >= 0).map(([r,c]) => [`${r}-${c}`, game.piece.name]) : [])
  const ghost = new Set(dropPlan?.ghostCells?.map(([r,c]) => `${r}-${c}`) ?? [])
  const willDrill = new Set(dropPlan?.drilled?.map(({r,c}) => `${r}-${c}`) ?? [])
  const expiredIds = new Set(dropPlan?.expired?.map(({cell}) => cell.id) ?? [])
  const cracking = new Set(game.cracking?.cells.map(({r,c}) => `${r}-${c}`) ?? [])
  const sparks = new Set(game.drilling?.removed.map(({r,c}) => `${r}-${c}`) ?? [])
  const displayTurn = game.resolution?.result.turn ?? game.turn
  const clearingRows = new Set(game.clearing?.rows || [])
  const flowing = new Set(game.settling?.moved.map(([r,c]) => `${r}-${c}`) || [])
  return <AiExperimentLayout id="tetris" learningState={{ proposal, decision: game.lastAiDecision }}>
    <audio ref={audio} loop preload="none" src="/assets/ttris/TetrisStrings.mp3" />
    <div className="ai-toolbar">
      <button className="ai-button" onClick={() => act('restart')}>{copy.restart}</button>
      <button className="ai-button ai-button-secondary" disabled={game.over} onClick={() => act('pause')}>{game.paused ? copy.resume : copy.pause}</button>
      <button className="ai-button ai-button-secondary" aria-pressed={game.ai} onClick={() => act('ai')}>{game.ai ? copy.aiOn : copy.aiOff}</button>
      <button className="ai-button ai-button-secondary" aria-pressed={game.magic} title={copy.magicTitle} disabled={isResolving} onClick={() => act('magic')}>{copy.magic}</button>
      <button className="ai-button ai-button-secondary" aria-pressed={!muted} onClick={() => setMuted(value => !value)}>{copy.music}</button>
    </div>
    <details className="ai-tetris-specials"><summary>{copy.C} / {copy.D} · {copy.specials}</summary><div className="ai-tetris-special-rules"><div><p className="ai-kicker">{copy.crystal}</p><p>{copy.crystalHint}</p><button className="ai-button ai-button-secondary" onClick={()=>act('restart','C')}>{copy.startCrystal}</button></div><div><p className="ai-kicker">{copy.drill}</p><p>{copy.drillHint}</p><button className="ai-button ai-button-secondary" onClick={()=>act('restart','D')}>{copy.startDrill}</button></div></div><p className="ai-help">{copy.restartNote}</p></details>
    <div className="ai-tetris-workspace">
      <div>
        <div className="ai-tetris-board" ref={boardRef} tabIndex={0} role="group" aria-label="T-Tris" aria-describedby="tetris-keys" data-testid="tetris-board" data-position={`${game.piece.r},${game.piece.c},${game.piece.rotation}`} data-score={game.score} data-game-over={game.over} data-turn={game.turn} data-next={game.next} data-following={game.following} data-paused={game.paused} data-settling={isSettling} data-drilling={Boolean(game.drilling)} data-cracking={Boolean(game.cracking)} data-clearing={Boolean(game.clearing)} data-clear-rows={[...clearingRows].join(',')} data-settle-frame={game.settling?.step ?? 0} data-drill-frame={game.drilling?.step ?? 0} data-piece-name={game.piece.name} style={{ '--line-clear-ms': `${LINE_CLEAR_MS}ms`, '--crystal-break-ms': `${CRYSTAL_BREAK_MS}ms` }}>
          {game.board.flatMap((row,r) => row.map((settled,c) => {
            const key = `${r}-${c}`, name = cellKind(settled) || (!game.over ? active.get(key) : null)
            const life = name === 'C' ? crystalRemaining(settled, displayTurn) ?? CRYSTAL_LIFETIME : null
            return <span key={key} className={`ai-tetris-cell${name ? ` is-filled${name==='T'?' is-magic':name==='C'?' is-crystal':name==='D'?' is-drill':''}` : ''}${ghost.has(key)?' is-ghost':''}${willDrill.has(key)?' will-drill':''}${settled?.id&&expiredIds.has(settled.id)?' will-expire':''}${cracking.has(key)?' is-breaking':''}${sparks.has(key)?' is-drilled':''}${clearingRows.has(r)?' is-clearing':''}`} style={{ '--piece-color': PIECES[name ?? game.piece.name].color, '--ghost-color': PIECES[game.piece.name].color }} data-filled={name || ''} data-settled={cellKind(settled) || ''} data-ghost={ghost.has(key)} data-will-drill={willDrill.has(key)} data-crystal-life={life ?? undefined} data-active={!game.over && !settled && active.has(key) ? `${r},${c}` : ''}>
              {name==='T' && <span aria-hidden="true" key={flowing.has(key)?game.settling.step:'rest'} className={`ai-magic-voxel${flowing.has(key)?' is-flowing':isSettling&&game.settling.step<=2?' is-contact':''}`} />}
              {name==='C' && <span className="ai-crystal-life" aria-hidden="true">{life}</span>}
              {name==='D' && <span className={`ai-drill-voxel${game.drilling&&!settled&&active.has(key)?' is-spinning':''}`} aria-hidden="true">↓</span>}
            </span>
          }))}
          {(game.paused || game.over) && <div className="ai-tetris-overlay"><h2>{game.over ? copy.over : copy.paused}</h2><button className="ai-button" onClick={() => act(game.over ? 'restart' : 'pause')}>{game.over ? copy.restart : copy.resume}</button></div>}
        </div>
        <div className="ai-touch-controls">
          {[[copy.left,'left',ArrowLeft],[copy.rotate,'rotate',RotateCw],[copy.right,'right',ArrowRight],[copy.down,'tick',ArrowDown],[copy.drop,'drop',ChevronsDown]].map(([label,type,Icon]) => <button key={type} className="ai-button ai-button-secondary" aria-label={label} disabled={game.paused || game.over || isResolving} onClick={() => act(type)}><Icon size={20} /></button>)}
        </div>
        <p className="ai-help" id="tetris-keys">{copy.tetrisHint}</p>
        <button className="ai-button ai-decide-button" aria-keyshortcuts="A" disabled={game.paused || game.over || isResolving} onClick={() => act('ai-move')}>{copy.aiMove}<kbd aria-hidden="true">A</kbd></button>
        <p className={`ai-help ai-tetris-reaction-status ${isSettling ? 'ai-magic-status' : 'ai-special-status'}`} role={reactionStatus ? 'status' : undefined}>{reactionStatus}</p>
        <p className="ai-help ai-effect-hint">{copy.effectHint}</p>
      </div>
      <aside className="ai-tetris-sidebar">
        {game.ai && <div className="ai-tetris-anticipation"><MiniBoard result={dropPreview} title={copy.afterDrop} testId="tetris-drop-plan"/><MiniBoard result={proposal?.result} title={copy.aiProposal} testId="tetris-ai-plan"/></div>}
        {proposal?.forecastSteps>0 && <details className="ai-tetris-forecast"><summary>{copy.forecast} · {proposal.forecast.map(step=>pieceName(step.name)).join(' + ')}</summary><MiniBoard result={proposal.forecast.at(-1).result} title={copy.forecast} testId="tetris-ai-forecast"/></details>}
        {game.ai && <p className="ai-help">{copy.aiPlanHint}{proposal?.forecastSteps>0 && ` ${copy.forecastHint}`}</p>}
        <div className="ai-tetris-queue"><p className="ai-kicker">{copy.nextTwo}</p>{[game.next,game.following].filter(Boolean).map((name,index)=>{
          const preview = new Set(previewCells(name).map(([r,c]) => `${r}-${c}`))
          return <div key={index}><p>{index===0?copy.nextPiece:copy.following} · {pieceName(name)}</p><div className="ai-tetris-preview" aria-label={`${index===0?copy.nextPiece:copy.following}: ${name}`}>{Array.from({length:25},(_,i) => <span key={i} data-preview-filled={preview.has(`${Math.floor(i/5)}-${i%5}`)} style={preview.has(`${Math.floor(i/5)}-${i%5}`) ? { background: PIECES[name].color } : undefined} />)}</div></div>
        })}</div>
        <dl className="ai-tetris-stats">{[[copy.score,game.score],[copy.lines,game.lines],[copy.level,game.level],[copy.record,record],[copy.aiMoves,aiMoves]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <p className="ai-help">{copy.aiHint}</p><p className="ai-help">{copy.magicHint}</p>
      </aside>
    </div>
  </AiExperimentLayout>
}
