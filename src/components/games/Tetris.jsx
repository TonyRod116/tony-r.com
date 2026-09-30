import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowDown, ChevronsDown, RotateCw } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import { labCopy } from '../../data/aiExperiments'
import AiExperimentLayout from '../ai/AiExperimentLayout'
import { PIECES, cellsFor, landing, previewCells, randomPiece, newGame, gameReducer, suggestMove } from './tetrisEngine'

const readNumber = key => { try { const value = Number(localStorage.getItem(key)); return Number.isFinite(value) ? Math.max(0, value) : 0 } catch { return 0 } }
export default function Tetris() {
  const { language } = useLanguage()
  const copy = labCopy[language]
  const [game, dispatch] = useReducer(gameReducer, null, () => newGame(randomPiece(), randomPiece()))
  const [record, setRecord] = useState(() => readNumber('tetris_maxScore'))
  const [muted, setMuted] = useState(true)
  const [aiMoves, setAiMoves] = useState(() => readNumber('tetris_ai_moves'))
  const audio = useRef(null)
  const boardRef = useRef(null)
  const finished = useRef(false)
  const lastAiMoves = useRef(0)
  const isSettling = Boolean(game.settling)
  const suggestion = useMemo(() => game.ai && !game.over && !isSettling ? suggestMove(game.board, game.piece, game.next, game.magic) : null, [game.ai, game.over, isSettling, game.board, game.piece, game.next, game.magic])
  const act = type => {
    dispatch({ type, first: type === 'restart' ? randomPiece() : undefined, next: randomPiece() })
    if (['left','right','tick','rotate','drop','ai-move','restart'].includes(type)) boardRef.current?.focus({ preventScroll: true })
  }
  useEffect(() => {
    const keyboard = event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest?.('a, button, input, textarea, select, [contenteditable="true"]')) return
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
    if (game.over || game.paused || isSettling) return
    const timer = setInterval(() => dispatch({ type: 'tick', next: randomPiece() }), Math.max(90, 1000 / game.level))
    return () => clearInterval(timer)
  }, [game.over, game.paused, game.level, isSettling])
  useEffect(() => {
    if (!isSettling || game.paused || game.over) return
    const timer = setInterval(() => dispatch({ type: 'settle-tick' }), 115)
    return () => clearInterval(timer)
  }, [isSettling, game.paused, game.over])
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
  const active = new Map(!isSettling ? cellsFor(game.piece).filter(([r]) => r >= 0).map(([r,c]) => [`${r}-${c}`, game.piece.name]) : [])
  const ghost = new Set(!isSettling ? cellsFor(landing(game.board, game.piece)).map(([r,c]) => `${r}-${c}`) : [])
  const flowing = new Set(game.settling?.moved.map(([r,c]) => `${r}-${c}`) || [])
  const suggested = new Set(suggestion ? cellsFor(suggestion).map(([r,c]) => `${r}-${c}`) : [])
  const preview = new Set(previewCells(game.next).map(([r,c]) => `${r}-${c}`))
  return <AiExperimentLayout id="tetris">
    <audio ref={audio} loop preload="none" src="/assets/ttris/TetrisStrings.mp3" />
    <div className="ai-toolbar">
      <button className="ai-button" onClick={() => act('restart')}>{copy.restart}</button>
      <button className="ai-button ai-button-secondary" disabled={game.over} onClick={() => act('pause')}>{game.paused ? copy.resume : copy.pause}</button>
      <button className="ai-button ai-button-secondary" aria-pressed={game.ai} onClick={() => act('ai')}>{game.ai ? copy.aiOn : copy.aiOff}</button>
      <button className="ai-button ai-button-secondary" aria-pressed={game.magic} disabled={isSettling} onClick={() => act('magic')}>{copy.magic}</button>
      <button className="ai-button ai-button-secondary" aria-pressed={!muted} onClick={() => setMuted(value => !value)}>{copy.music}</button>
    </div>
    <div className="ai-tetris-workspace">
      <div>
        <div className="ai-tetris-board" ref={boardRef} tabIndex={0} role="group" aria-label="T-Tris" aria-describedby="tetris-keys" data-testid="tetris-board" data-position={`${game.piece.r},${game.piece.c},${game.piece.rotation}`} data-score={game.score} data-paused={game.paused} data-settling={isSettling} data-settle-frame={game.settling?.step ?? 0} data-piece-name={game.piece.name}>
          {game.board.flatMap((row,r) => row.map((settled,c) => {
            const key = `${r}-${c}`, name = settled || (!game.over ? active.get(key) : null)
            return <span key={key} className={`ai-tetris-cell${name ? ` is-filled${name==='T'?' is-magic':''}` : ghost.has(key) ? ' is-ghost' : ''}`} style={name ? { '--piece-color': PIECES[name].color } : undefined} data-filled={name || ''} data-settled={settled || ''} data-active={!game.over && !settled && active.has(key) ? `${r},${c}` : ''}>{name==='T' && <span aria-hidden="true" key={flowing.has(key)?game.settling.step:'rest'} className={`ai-magic-voxel${flowing.has(key)?' is-flowing':isSettling&&game.settling.step<=2?' is-contact':''}`} />}</span>
          }))}
          {(game.paused || game.over) && <div className="ai-tetris-overlay"><h2>{game.over ? copy.over : copy.paused}</h2><button className="ai-button" onClick={() => act(game.over ? 'restart' : 'pause')}>{game.over ? copy.restart : copy.resume}</button></div>}
        </div>
        <div className="ai-touch-controls">
          {[[copy.left,'left',ArrowLeft],[copy.rotate,'rotate',RotateCw],[copy.right,'right',ArrowRight],[copy.down,'tick',ArrowDown],[copy.drop,'drop',ChevronsDown]].map(([label,type,Icon]) => <button key={type} className="ai-button ai-button-secondary" aria-label={label} disabled={game.paused || game.over || isSettling} onClick={() => act(type)}><Icon size={20} /></button>)}
        </div>
        <p className="ai-help" id="tetris-keys">{copy.tetrisHint}</p>
        <button className="ai-button ai-decide-button" aria-keyshortcuts="A" disabled={game.paused || game.over || isSettling} onClick={() => act('ai-move')}>{copy.aiMove}<kbd aria-hidden="true">A</kbd></button>
        {isSettling && <p className="ai-help ai-magic-status" role="status">{copy.magicFlow}</p>}
      </div>
      <aside className="ai-tetris-sidebar">
        {game.ai && <div className="ai-tetris-plan"><p className="ai-kicker">{copy.aiProposal}</p><div className="ai-tetris-plan-board" role="img" aria-label={copy.aiProposal} data-testid="tetris-ai-plan">{game.board.flatMap((row,r) => row.map((cell,c) => <span key={`${r}-${c}`} className={suggested.has(`${r}-${c}`) ? 'is-target' : cell ? 'is-occupied' : ''} />))}</div><p className="ai-help">{copy.aiPlanHint}</p></div>}
        <div><p className="ai-kicker">{copy.nextPiece}</p><div className="ai-tetris-preview" aria-label={`${copy.nextPiece}: ${game.next}`}>{Array.from({length:25},(_,i) => <span key={i} data-preview-filled={preview.has(`${Math.floor(i/5)}-${i%5}`)} style={preview.has(`${Math.floor(i/5)}-${i%5}`) ? { background: PIECES[game.next].color } : undefined} />)}</div></div>
        <dl className="ai-tetris-stats">{[[copy.score,game.score],[copy.lines,game.lines],[copy.level,game.level],[copy.record,record],[copy.aiMoves,aiMoves]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <p className="ai-help">{copy.aiHint}</p><p className="ai-help">{copy.magicHint}</p>
      </aside>
    </div>
  </AiExperimentLayout>
}
