export const WIDTH = 10
export const HEIGHT = 20
// Keep Tony's eight shapes, including the five-cell Magic T. Offsets are
// explicit [row,column] pairs everywhere: rendering, preview, play and search.
export const PIECES = {
  L: { color: '#719cfa', cells: [[-2,0],[-1,0],[0,0],[0,1]] },
  Li: { color: '#e999be', cells: [[-2,1],[-1,1],[0,0],[0,1]] },
  S: { color: '#a3c880', cells: [[-2,0],[-1,0],[-1,1],[0,1]] },
  Si: { color: '#ebd37d', cells: [[-2,1],[-1,1],[-1,0],[0,0]] },
  M: { color: '#b59ae9', cells: [[-2,0],[-1,0],[-1,1],[0,0]] },
  O: { color: '#efa46c', cells: [[-1,0],[-1,1],[0,0],[0,1]] },
  I: { color: '#a7d9d5', cells: [[-2,0],[-1,0],[0,0],[1,0]] },
  T: { color: '#d3f56b', cells: [[0,-1],[0,0],[0,1],[1,0],[2,0]] },
}
export const NAMES = Object.keys(PIECES)
export const emptyBoard = () => Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(null))
export const randomPiece = () => NAMES[Math.floor(Math.random() * NAMES.length)]
export function cellsFor(piece) {
  let offsets = PIECES[piece.name].cells
  // O retains its shape and origin in every rotation.
  for (let i = 0; i < (piece.name === 'O' ? 0 : piece.rotation % 4); i++) offsets = offsets.map(([r,c]) => [c,-r])
  return offsets.map(([r,c]) => [r + piece.r,c + piece.c])
}
export const spawn = name => ({ name, rotation: 0, r: 0, c: 4 })
export function fits(board, piece) {
  return cellsFor(piece).every(([r,c]) => c >= 0 && c < WIDTH && r < HEIGHT && r >= -4 && (r < 0 || board[r][c] === null))
}
export function rotate(board, piece) {
  const candidate = { ...piece, rotation: (piece.rotation + 1) % 4 }
  for (const [dr,dc] of [[0,0],[0,-1],[0,1],[0,-2],[0,2],[-1,0],[-1,-1],[-1,1]]) {
    const kicked = { ...candidate, r: candidate.r + dr, c: candidate.c + dc }
    if (fits(board, kicked)) return kicked
  }
  return piece
}
export function landing(board, piece) {
  let target = { ...piece }
  while (fits(board, { ...target, r: target.r + 1 })) target.r++
  return target
}
export function previewCells(name) {
  const cells = PIECES[name].cells
  const minR = Math.min(...cells.map(([r]) => r)), minC = Math.min(...cells.map(([,c]) => c))
  const rows = Math.max(...cells.map(([r]) => r)) - minR + 1, columns = Math.max(...cells.map(([,c]) => c)) - minC + 1
  return cells.map(([r,c]) => [r - minR + Math.floor((5 - rows) / 2), c - minC + Math.floor((5 - columns) / 2)])
}
export function lockPiece(board, piece, magic = true) {
  if (!fits(board, piece) || cellsFor(piece).some(([r]) => r < 0)) return { board, cleared: 0, over: true }
  const next = board.map(row => [...row])
  cellsFor(piece).forEach(([r,c]) => { next[r][c] = piece.name })
  if (magic && piece.name === 'T') {
    // Settle existing and new T blocks together, bottom-first, exactly as play.
    for (let c = 0; c < WIDTH; c++) for (let r = HEIGHT - 2; r >= 0; r--) {
      if (next[r][c] !== 'T') continue
      let target = r
      while (target + 1 < HEIGHT && next[target + 1][c] === null) target++
      if (target !== r) { next[target][c] = 'T'; next[r][c] = null }
    }
  }
  const remaining = next.filter(row => row.some(value => value === null))
  const cleared = HEIGHT - remaining.length
  while (remaining.length < HEIGHT) remaining.unshift(Array(WIDTH).fill(null))
  return { board: remaining, cleared, over: false }
}
export function reachableLandings(board, piece) {
  if (!fits(board, piece)) return []
  const queue = [piece], seen = new Set([`${piece.r},${piece.c},${piece.rotation}`]), results = new Map()
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head], key = `${current.r},${current.c},${current.rotation}`
    const down = { ...current, r: current.r + 1 }
    if (!fits(board, down)) results.set(key, current)
    for (const candidate of [{ ...current, c: current.c - 1 }, { ...current, c: current.c + 1 }, down, rotate(board, current)]) {
      const candidateKey = `${candidate.r},${candidate.c},${candidate.rotation}`
      if (!seen.has(candidateKey) && fits(board, candidate)) { seen.add(candidateKey); queue.push(candidate) }
    }
  }
  return [...results.values()]
}
export function features(board) {
  const heights = board[0].map((_, c) => { const index = board.findIndex(row => row[c] !== null); return index < 0 ? 0 : HEIGHT - index })
  let holes = 0
  for (let c = 0; c < WIDTH; c++) for (let r = HEIGHT - heights[c]; r < HEIGHT; r++) if (board[r][c] === null) holes++
  return { height: Math.max(...heights), holes, bumpiness: heights.slice(1).reduce((sum, h, i) => sum + Math.abs(h - heights[i]), 0) }
}
const evaluate = result => {
  if (result.over) return -Infinity
  const f = features(result.board)
  return result.cleared * 8 - f.height * 4.5 - f.holes * 9.5 - f.bumpiness * 1.8
}
export function suggestMove(board, piece, nextName, magic) {
  let best = null, bestScore = -Infinity
  // Look-ahead is bounded to the six best current placements.
  const candidates = reachableLandings(board, piece).map(target => ({ target, result: lockPiece(board, target, magic) }))
    .filter(candidate => !candidate.result.over).sort((a,b) => evaluate(b.result) - evaluate(a.result)).slice(0,6)
  for (const candidate of candidates) {
    const replies = nextName ? reachableLandings(candidate.result.board, spawn(nextName)).map(target => evaluate(lockPiece(candidate.result.board, target, magic))) : []
    const score = evaluate(candidate.result) + (nextName ? 0.6 * (replies.length ? Math.max(...replies) : -10000) : 0)
    if (score > bestScore) { bestScore = score; best = candidate.target }
  }
  return best
}
export function newGame(first, next, previous = {}) {
  return { board: emptyBoard(), piece: spawn(first), next, score: 0, lines: 0, level: 1, paused: false, over: false, magic: previous.magic ?? true, ai: previous.ai ?? false, aiMoves: 0 }
}
function commit(state, target, nextName, isAi = false) {
  const result = lockPiece(state.board, target, state.magic)
  if (result.over) return { ...state, over: true }
  const piece = spawn(state.next), lines = state.lines + result.cleared
  return { ...state, board: result.board, piece, next: nextName, score: state.score + 10 + result.cleared * 100, lines,
    level: Math.floor(lines / 10) + 1, over: !fits(result.board, piece), aiMoves: state.aiMoves + Number(isAi) }
}
export function gameReducer(state, action) {
  if (action.type === 'restart') return newGame(action.first, action.next, state)
  if (action.type === 'pause') return state.over ? state : { ...state, paused: !state.paused }
  if (action.type === 'visibility-pause') return { ...state, paused: true }
  if (action.type === 'ai') return { ...state, ai: !state.ai }
  if (action.type === 'magic') return { ...state, magic: !state.magic }
  if (state.over || state.paused) return state
  if (action.type === 'ai-move') {
    if (!state.ai) return state
    const target = suggestMove(state.board, state.piece, state.next, state.magic)
    return target ? commit(state, target, action.next, true) : { ...state, over: true }
  }
  if (action.type === 'drop') return commit(state, landing(state.board, state.piece), action.next)
  if (action.type === 'rotate') return { ...state, piece: rotate(state.board, state.piece) }
  const piece = { ...state.piece, c: state.piece.c + (action.type === 'left' ? -1 : action.type === 'right' ? 1 : 0), r: state.piece.r + (action.type === 'tick' ? 1 : 0) }
  if (fits(state.board, piece)) return { ...state, piece }
  return action.type === 'tick' ? commit(state, state.piece, action.next) : state
}
