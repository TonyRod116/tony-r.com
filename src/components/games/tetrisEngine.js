export const WIDTH = 10
export const HEIGHT = 20
export const LINE_CLEAR_MS = 320
export const CRYSTAL_BREAK_MS = 360
export const REACTION_STEP_MS = 115
export const CRYSTAL_LIFETIME = 5
export const DRILL_BUDGET = 2
// Keep Tony's original shapes and add Crystal/Drill. Offsets are
// explicit [row,column] pairs everywhere: rendering, preview, play and search.
export const PIECES = {
  L: { color: '#719cfa', cells: [[-1,0],[0,0],[1,0],[1,1]], pivot: [0,0] },
  Li: { color: '#e999be', cells: [[-1,0],[0,0],[1,-1],[1,0]], pivot: [0,0] },
  S: { color: '#a3c880', cells: [[-1,0],[0,0],[0,1],[1,1]], pivot: [0,0] },
  Si: { color: '#ebd37d', cells: [[-1,1],[0,1],[0,0],[1,0]], pivot: [0,0] },
  M: { color: '#b59ae9', cells: [[-1,0],[0,0],[0,1],[1,0]], pivot: [0,0] },
  C: { color: '#b4e9ff', cells: [[-1,0],[0,-1],[0,0],[0,1],[1,0]], pivot: [0,0], weight: 0.5 },
  O: { color: '#efa46c', cells: [[-1,0],[-1,1],[0,0],[0,1]], pivot: [-0.5,0.5] },
  I: { color: '#a7d9d5', cells: [[-1,0],[0,0],[1,0],[2,0]], pivot: [0.5,0.5] },
  D: { color: '#ffba68', cells: [[-2,0],[-1,0],[0,0],[1,0],[2,0]], pivot: [0,0], weight: 0.5 },
  T: { color: '#d3f56b', cells: [[-1,-1],[-1,0],[-1,1],[0,0],[1,0]], pivot: [0,0] },
}
export const NAMES = Object.keys(PIECES)
export const SPECIAL_NAMES = ['T','C','D']
export const normalizeSpecials = selection => Object.fromEntries(SPECIAL_NAMES.map(name => [name, typeof selection?.[name] === 'boolean' ? selection[name] : true]))
export const isPieceEnabled = (name, selection) => Boolean(PIECES[name]) && (!SPECIAL_NAMES.includes(name) || selection?.[name] !== false)
const safePiece = (name, selection) => isPieceEnabled(name, selection) ? name : 'O'
export const emptyBoard = () => Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(null))
export const randomPiece = (selection = {}) => {
  const pool = NAMES.filter(name => isPieceEnabled(name, selection))
  let draw = Math.random() * pool.reduce((sum, name) => sum + (PIECES[name].weight ?? 1), 0)
  for (const name of pool) { draw -= PIECES[name].weight ?? 1; if (draw < 0) return name }
  return pool.at(-1)
}
export const cellKind = cell => typeof cell === 'string' ? cell : cell?.kind ?? null
export const crystalRemaining = (cell, turn) => cellKind(cell) === 'C' && typeof cell === 'object' ? Math.max(0, cell.expiresAt - turn) : null
const cloneBoard = board => board.map(row => [...row])
const coordinateKey = ([r,c]) => `${r},${c}`
const coordinates = keys => [...keys].map(key => key.split(',').map(Number))
export function cellsFor(piece) {
  let offsets = PIECES[piece.name].cells
  const [pivotR,pivotC] = PIECES[piece.name].pivot
  // O retains its shape and origin in every rotation.
  for (let i = 0; i < (piece.name === 'O' ? 0 : piece.rotation % 4); i++) offsets = offsets.map(([r,c]) => [pivotR+c-pivotC,pivotC-r+pivotR])
  return offsets.map(([r,c]) => [r + piece.r,c + piece.c])
}
export const spawn = name => ({ name, rotation: 0, r: -Math.min(...PIECES[name].cells.map(([r]) => r)), c: 4 })
export function fits(board, piece) {
  if (!PIECES[piece.name] || !Number.isInteger(piece.r) || !Number.isInteger(piece.c) || !Number.isInteger(piece.rotation) || piece.rotation < 0 || piece.rotation > 3) return false
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
// One transaction is shared by ghosts, search and animated manual/AI play.
// A Crystal can score on its fifth subsequent placement, before it expires.
export function lockPiece(board, piece, magic = true, turn = 0, capture = false) {
  if (!fits(board, piece)) return { board, cleared: 0, over: true }
  const nextTurn = turn + 1, phases = [], drilled = [], expired = []
  let next = cloneBoard(board), target = piece, fresh = new Set(), ghostCells = null
  let cleared = 0, clearingRows = [], beforeClear
  if (piece.name === 'D') {
    let remaining = DRILL_BUDGET
    const frames = capture ? [{ board: cloneBoard(next), piece: target, removed: [], remaining }] : []
    for (let depth = 0; depth < HEIGHT + 4; depth++) {
      const candidate = { ...target, r: target.r + 1 }, cells = cellsFor(candidate)
      if (cells.some(([r,c]) => r >= HEIGHT || r < -4 || c < 0 || c >= WIDTH)) break
      const collisions = cells.filter(([r,c]) => r >= 0 && next[r][c] !== null)
      if (collisions.length > remaining) break
      const removed = collisions.map(([r,c]) => ({ r, c, cell: next[r][c] }))
      collisions.forEach(([r,c]) => { next[r][c] = null })
      drilled.push(...removed); remaining -= collisions.length; target = candidate
      if (capture) frames.push({ board: cloneBoard(next), piece: target, removed, remaining })
    }
    if (cellsFor(target).some(([r]) => r < 0)) return { board, cleared: 0, over: true }
    cellsFor(target).forEach(([r,c]) => { next[r][c] = 'D' })
    if (capture) phases.push({ kind: 'drill', frames, board: cloneBoard(next), piece: target })
  } else {
    if (cellsFor(target).some(([r]) => r < 0)) return { board, cleared: 0, over: true }
    cellsFor(target).forEach(([r,c], index) => {
      next[r][c] = piece.name === 'C' ? { kind: 'C', expiresAt: nextTurn + CRYSTAL_LIFETIME, id: `${nextTurn}:${index}` } : piece.name
    })
  }
  fresh = new Set(cellsFor(target).map(coordinateKey))
  const settle = () => {
    const frames = capture ? [0,1,2].map(() => ({ board: cloneBoard(next), piece: target, moved: [] })) : []
    for (let frameIndex = 0; frameIndex < HEIGHT; frameIndex++) {
      const frame = settleSandStep(next)
      if (!frame.moved.length) break
      for (const move of frame.moves) if (fresh.delete(coordinateKey(move.from))) fresh.add(coordinateKey(move.to))
      next = frame.board
      if (capture) frames.push({ board: next, piece: target, moved: frame.moved })
    }
    if (capture) phases.push({ kind: 'settle', frames, board: cloneBoard(next), piece: target })
  }
  const clear = () => {
    const rows = next.flatMap((row,r) => row.every(value => value !== null) ? [r] : [])
    if (!rows.length) return
    if (!ghostCells) ghostCells = coordinates(fresh)
    const original = next
    if (!beforeClear) { beforeClear = cloneBoard(original); clearingRows = rows }
    next = next.filter((_,r) => !rows.includes(r))
    while (next.length < HEIGHT) next.unshift(Array(WIDTH).fill(null))
    fresh = new Set(coordinates(fresh).filter(([r]) => !rows.includes(r)).map(([r,c]) => coordinateKey([r + rows.filter(row => row > r).length,c])))
    cleared += rows.length
    if (capture) phases.push({ kind: 'clear', before: original, board: next, rows, piece: target })
  }
  if (magic && piece.name === 'T') settle()
  if (!ghostCells) ghostCells = coordinates(fresh)
  clear()
  for (let r = 0; r < HEIGHT; r++) for (let c = 0; c < WIDTH; c++) {
    const cell = next[r][c]
    if (cellKind(cell) === 'C' && typeof cell === 'object' && cell.expiresAt <= nextTurn) expired.push({ r, c, cell })
  }
  if (expired.length) {
    const before = next
    next = cloneBoard(next)
    expired.forEach(({r,c}) => { next[r][c] = null; fresh.delete(coordinateKey([r,c])) })
    if (capture) phases.push({ kind: 'crack', before, board: next, cells: expired, piece: target })
    // Fluid T blocks respond when a temporary support disappears.
    if (magic && next.some(row => row.includes('T'))) settle()
    clear()
  }
  return { board: next, cleared, over: false, clearingRows, beforeClear: beforeClear ?? cloneBoard(next),
    turn: nextTurn, target, contact: piece, ghostCells, newCells: coordinates(fresh), drilled, expired, phases }
}
// One visible frame of the same bottom-first sand physics used by the AI.
// Blocks only move down one row; columns never change during dissolution.
export function settleSandStep(board) {
  const next = cloneBoard(board), moved = [], moves = []
  for (let c = 0; c < WIDTH; c++) for (let r = HEIGHT - 2; r >= 0; r--) {
    if (next[r][c] !== 'T' || next[r+1][c] !== null) continue
    next[r+1][c] = 'T'; next[r][c] = null; moved.push([r+1,c]); moves.push({ from: [r,c], to: [r+1,c] })
  }
  return { board: next, moved, moves }
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
export function analyzeMove(board, piece, nextName, magic, turn = 0, followingName = null) {
  let best = null, bestScore = -Infinity
  const temporary = board.some(row => row.some(cell => cellKind(cell) === 'C'))
  const special = name => name === 'C' || name === 'D'
  const second = followingName && (temporary || [piece.name,nextName,followingName].some(special)) ? followingName : null
  const cache = new Map()
  const continuations = (current, name, currentTurn, further = null) => {
    if (!name) return { value: 0, steps: [] }
    const signature = `${name}/${currentTurn}/${further}/${current.flat().map(cell => cellKind(cell) === 'C' ? `C${cell.expiresAt}` : cell ?? '.').join('|')}`
    if (cache.has(signature)) return cache.get(signature)
    let options = reachableLandings(current, spawn(name)).map(target => ({ target, result: lockPiece(current, target, magic, currentTurn) }))
      .filter(option => !option.result.over)
    if (further) options = options.sort((a,b) => evaluate(b.result) - evaluate(a.result)).slice(0,6)
    let choice = { value: -10000, steps: [] }
    for (const option of options) {
      const tail = further ? continuations(option.result.board, further, option.result.turn) : { value: 0, steps: [] }
      const value = evaluate(option.result) + (further ? 0.6 * tail.value : 0)
      if (value > choice.value) choice = { value, steps: [{ name, target: option.target, result: option.result, value: evaluate(option.result) }, ...tail.steps] }
    }
    cache.set(signature, choice)
    return choice
  }
  // Expand the same six-position beam when an actual known special/expiry matters.
  const candidates = reachableLandings(board, piece).map(target => ({ target, result: lockPiece(board, target, magic, turn) }))
    .filter(candidate => !candidate.result.over).sort((a,b) => evaluate(b.result) - evaluate(a.result)).slice(0,6)
  for (const candidate of candidates) {
    const immediate = evaluate(candidate.result)
    const continuation = continuations(candidate.result.board, nextName, candidate.result.turn, second)
    const future = continuation.value
    const score = immediate + (nextName ? 0.6 * future : 0)
    if (score > bestScore) {
      bestScore = score
      best = { target: candidate.target, immediate, future, score, cleared: candidate.result.cleared,
        ...features(candidate.result.board), candidates: candidates.length, nextName, followingName: second,
        result: candidate.result, forecast: continuation.steps, forecastSteps: continuation.steps.length,
        drilled: candidate.result.drilled.length, expired: candidate.result.expired.length }
    }
  }
  return best
}
export function suggestMove(board, piece, nextName, magic, turn = 0, followingName = null) {
  return analyzeMove(board, piece, nextName, magic, turn, followingName)?.target ?? null
}
export function newGame(first, next, previous = {}, following = null) {
  const enabledSpecials = normalizeSpecials(previous.enabledSpecials)
  return { board: emptyBoard(), piece: spawn(safePiece(first, enabledSpecials)), next: safePiece(next, enabledSpecials), following: following ? safePiece(following, enabledSpecials) : null, enabledSpecials, turn: 0, score: 0, lines: 0, level: 1,
    paused: false, over: false, magic: previous.magic ?? true, ai: previous.ai ?? false, aiMoves: 0,
    resolution: null, settling: null, drilling: null, cracking: null, clearing: null, lastAiDecision: null }
}
function finishCommit(state, result, nextName, isAi) {
  const piece = spawn(safePiece(state.next, state.enabledSpecials)), lines = state.lines + result.cleared
  return { ...state, board: result.board, piece, next: safePiece(state.following ?? nextName, state.enabledSpecials), following: state.following ? safePiece(nextName, state.enabledSpecials) : null,
    turn: result.turn, resolution: null, settling: null, drilling: null, cracking: null, clearing: null, score: state.score + 10 + result.cleared * 100, lines,
    level: Math.floor(lines / 10) + 1, over: !fits(result.board, piece), aiMoves: state.aiMoves + Number(isAi) }
}
function enterPhase(state, resolution, index) {
  const phase = resolution.result.phases[index]
  if (!phase) return finishCommit(state, resolution.result, resolution.nextName, resolution.isAi)
  const base = { ...state, resolution: { ...resolution, index }, settling: null, drilling: null, cracking: null, clearing: null }
  if (phase.kind === 'clear') return { ...base, board: phase.before, piece: phase.piece,
    clearing: { rows: phase.rows, result: phase, nextName: resolution.nextName, isAi: resolution.isAi } }
  if (phase.kind === 'crack') return { ...base, board: phase.before, piece: phase.piece, cracking: phase }
  const frame = phase.frames[0], descriptor = { ...frame, step: 0, token: phase }
  return { ...base, board: frame.board, piece: frame.piece, [phase.kind === 'settle' ? 'settling' : 'drilling']: descriptor }
}
function commit(state, target, nextName, isAi = false) {
  const result = lockPiece(state.board, target, state.magic, state.turn, true)
  if (result.over) return { ...state, over: true }
  const source = { board: state.board, piece: state.piece, next: state.next, following: state.following, magic: state.magic, turn: state.turn }
  return enterPhase(state, { result, source, nextName, isAi }, 0)
}
export function gameReducer(state, action) {
  if (action.type === 'restart') return newGame(action.first, action.next, state, action.following ?? null)
  if (action.type === 'toggle-special') {
    if (!SPECIAL_NAMES.includes(action.name)) return state
    const previous = normalizeSpecials(state.enabledSpecials), enabledSpecials = { ...previous, [action.name]: !previous[action.name] }
    const next = isPieceEnabled(state.next, enabledSpecials) ? state.next : safePiece(action.next, enabledSpecials)
    const following = state.following ? isPieceEnabled(state.following, enabledSpecials) ? state.following : safePiece(action.following, enabledSpecials) : null
    const resolution = state.resolution ? { ...state.resolution,
      nextName: isPieceEnabled(state.resolution.nextName, enabledSpecials) ? state.resolution.nextName : safePiece(action.drawn, enabledSpecials),
      source: { ...state.resolution.source, next, following } } : null
    return { ...state, enabledSpecials, next, following, resolution, lastAiDecision: null }
  }
  if (action.type === 'pause') return state.over ? state : { ...state, paused: !state.paused }
  if (action.type === 'visibility-pause') return { ...state, paused: true }
  if (action.type === 'ai') return { ...state, ai: !state.ai }
  if (action.type === 'magic') return { ...state, magic: !state.magic }
  if (state.over || state.paused) return state
  if (state.resolution) {
    const flow = state.resolution, phase = flow.result.phases[flow.index]
    if (state.clearing) {
      if (action.type !== 'clear-complete' || action.result !== phase) return state
    } else if (state.cracking) {
      if (action.type !== 'crack-complete' || action.token !== phase) return state
    } else {
      const key = state.settling ? 'settling' : 'drilling'
      if (action.type !== (key === 'settling' ? 'settle-tick' : 'drill-tick') || (action.token && action.token !== phase)) return state
      const step = state[key].step + 1, frame = phase.frames[step]
      if (frame) return { ...state, board: frame.board, piece: frame.piece, [key]: { ...frame, step, token: phase } }
    }
    return enterPhase({ ...state, board: phase.board }, flow, flow.index + 1)
  }
  if (['settle-tick','drill-tick','crack-complete','clear-complete'].includes(action.type)) return state
  if (action.type === 'ai-move') {
    const decision = analyzeMove(state.board, state.piece, state.next, state.magic, state.turn, state.following)
    return decision ? commit({ ...state, lastAiDecision: decision }, decision.target, action.next, true) : { ...state, over: true }
  }
  if (action.type === 'drop') return commit(state, landing(state.board, state.piece), action.next)
  if (action.type === 'rotate') return { ...state, piece: rotate(state.board, state.piece) }
  const piece = { ...state.piece, c: state.piece.c + (action.type === 'left' ? -1 : action.type === 'right' ? 1 : 0), r: state.piece.r + (action.type === 'tick' ? 1 : 0) }
  if (fits(state.board, piece)) return { ...state, piece }
  return action.type === 'tick' ? commit(state, state.piece, action.next) : state
}
