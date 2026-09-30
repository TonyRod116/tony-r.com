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
  const suggestion = useMemo(() => game.ai && !game.over ? suggestMove(game.board, game.piece, game.next, game.magic) : null, [game.ai, game.over, game.board, game.piece, game.next, game.magic])
  const act = type => dispatch({ type, first: type === 'restart' ? randomPiece() : undefined, next: randomPiece() })
  useEffect(() => {
    if (game.over || game.paused) return
    const timer = setInterval(() => dispatch({ type: 'tick', next: randomPiece() }), Math.max(90, 1000 / game.level))
    return () => clearInterval(timer)
  }, [game.over, game.paused, game.level])
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
  const keyboard = event => {
    if (event.target !== boardRef.current) return
    const action = { ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'tick', ArrowUp: 'rotate', ' ': 'drop', p: 'pause', P: 'pause' }[event.key]
    if (!action) return
    event.preventDefault()
    if (!event.repeat || !['drop','pause'].includes(action)) act(action)
  }
  const active = new Map(cellsFor(game.piece).filter(([r]) => r >= 0).map(([r,c]) => [`${r}-${c}`, game.piece.name]))
  const ghost = new Set(cellsFor(landing(game.board, game.piece)).map(([r,c]) => `${r}-${c}`))
  const suggested = new Set(suggestion ? cellsFor(suggestion).map(([r,c]) => `${r}-${c}`) : [])
  const preview = new Set(previewCells(game.next).map(([r,c]) => `${r}-${c}`))
  return <AiExperimentLayout id="tetris">
    <audio ref={audio} loop preload="none" src="/assets/ttris/TetrisStrings.mp3" />
    <div className="ai-toolbar">
      <button className="ai-button" onClick={() => act('restart')}>{copy.restart}</button>
      <button className="ai-button ai-button-secondary" disabled={game.over} onClick={() => act('pause')}>{game.paused ? copy.resume : copy.pause}</button>
      <button className="ai-button ai-button-secondary" aria-pressed={game.ai} onClick={() => act('ai')}>{game.ai ? copy.aiOn : copy.aiOff}</button>
      <button className="ai-button ai-button-secondary" aria-pressed={game.magic} onClick={() => act('magic')}>{copy.magic}</button>
      <button className="ai-button ai-button-secondary" aria-pressed={!muted} onClick={() => setMuted(value => !value)}>{copy.music}</button>
    </div>
    <div className="ai-tetris-workspace">
      <div>
        <div className="ai-tetris-board" ref={boardRef} tabIndex={0} role="group" aria-label="T-Tris" aria-describedby="tetris-keys" onKeyDown={keyboard} data-testid="tetris-board" data-position={`${game.piece.r},${game.piece.c},${game.piece.rotation}`} data-score={game.score} data-paused={game.paused}>
          {game.board.flatMap((row,r) => row.map((settled,c) => {
            const key = `${r}-${c}`, name = settled || (!game.over ? active.get(key) : null)
            return <span key={key} className={`ai-tetris-cell${name ? ' is-filled' : suggested.has(key) ? ' is-suggestion' : ghost.has(key) ? ' is-ghost' : ''}`} style={name ? { '--piece-color': PIECES[name].color } : undefined} data-filled={name || ''} data-settled={settled || ''} />
          }))}
          {(game.paused || game.over) && <div className="ai-tetris-overlay"><h2>{game.over ? copy.over : copy.paused}</h2><button className="ai-button" onClick={() => act(game.over ? 'restart' : 'pause')}>{game.over ? copy.restart : copy.resume}</button></div>}
        </div>
        <div className="ai-touch-controls">
          {[[copy.left,'left',ArrowLeft],[copy.rotate,'rotate',RotateCw],[copy.right,'right',ArrowRight],[copy.down,'tick',ArrowDown],[copy.drop,'drop',ChevronsDown]].map(([label,type,Icon]) => <button key={type} className="ai-button ai-button-secondary" aria-label={label} disabled={game.paused || game.over} onClick={() => act(type)}><Icon size={20} /></button>)}
        </div>
        <p className="ai-help" id="tetris-keys">{copy.tetrisHint}</p>
        <button className="ai-button ai-button-secondary" disabled={!suggestion || game.paused || game.over} onClick={() => act('ai-move')}>{copy.aiMove}</button>
      </div>
      <aside className="ai-tetris-sidebar">
        <div><p className="ai-kicker">{copy.nextPiece}</p><div className="ai-tetris-preview" aria-label={`${copy.nextPiece}: ${game.next}`}>{Array.from({length:25},(_,i) => <span key={i} data-preview-filled={preview.has(`${Math.floor(i/5)}-${i%5}`)} style={preview.has(`${Math.floor(i/5)}-${i%5}`) ? { background: PIECES[game.next].color } : undefined} />)}</div></div>
        <dl className="ai-tetris-stats">{[[copy.score,game.score],[copy.lines,game.lines],[copy.level,game.level],[copy.record,record],[copy.aiMoves,aiMoves]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <p className="ai-help">{copy.aiHint}</p><p className="ai-help">{copy.magicHint}</p>
      </aside>
    </div>
  </AiExperimentLayout>
}
