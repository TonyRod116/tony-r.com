import test from 'node:test'
import assert from 'node:assert/strict'
import { PIECES, emptyBoard, spawn, fits, cellsFor, previewCells, rotate, reachableLandings, landing, lockPiece, cellKind, crystalRemaining, newGame, gameReducer, analyzeMove, randomPiece } from '../../src/components/games/tetrisEngine.js'

function finish(state) {
  for (let i = 0; state.resolution && i < 100; i++) {
    const action = state.clearing ? { type: 'clear-complete', result: state.clearing.result }
      : state.cracking ? { type: 'crack-complete', token: state.cracking }
        : state.drilling ? { type: 'drill-tick', token: state.drilling.token }
          : { type: 'settle-tick', token: state.settling.token }
    state = gameReducer(state, action)
  }
  assert.equal(state.resolution, null)
  return state
}
const count = (board, name) => board.flat().filter(cell => cellKind(cell) === name).length
const crystal = (expiresAt, id = 'old') => ({ kind: 'C', expiresAt, id })

test('five-block Crystal cross and Drill spawn fully visible with matching previews and centered rotations', () => {
  const sorted = cells => cells.map(cell=>cell.join(',')).sort()
  const expected = { C:[[0,4],[1,3],[1,4],[1,5],[2,4]], D:[[0,4],[1,4],[2,4],[3,4],[4,4]] }
  for (const name of ['C','D']) {
    const initial=spawn(name),preview=previewCells(name)
    assert.deepEqual(sorted(cellsFor(initial)),sorted(expected[name]))
    assert.equal(preview.length,5);assert.equal(new Set(preview.map(cell=>cell.join(','))).size,5)
    assert.ok(preview.every(([r,c])=>r>=0&&r<5&&c>=0&&c<5))
    for(let rotation=0;rotation<4;rotation++) {
      const cells=cellsFor({...initial,rotation})
      assert.equal(cells.length,5);assert.ok(fits(emptyBoard(),{...initial,rotation}))
      for(const [axis,center] of [[0,initial.r],[1,initial.c]])assert.equal((Math.min(...cells.map(cell=>cell[axis]))+Math.max(...cells.map(cell=>cell[axis])))/2,center)
      if(name==='C')assert.deepEqual(sorted(cells),sorted(expected.C))
    }
  }
})

test('five-block Drill turns against either wall without wrapping and the AI result matches the animated transaction', () => {
  for(const [column,kicked] of [[0,2],[9,7]]) {
    const turned=rotate(emptyBoard(),{...spawn('D'),c:column})
    assert.equal(turned.rotation,1);assert.equal(turned.c,kicked)
    const cells=cellsFor(turned)
    assert.equal(new Set(cells.map(([r])=>r)).size,1);assert.equal(new Set(cells.map(([,c])=>c)).size,5)
    assert.ok(fits(emptyBoard(),turned));assert.ok(cells.every(([,c])=>c>=0&&c<10))
  }
  const board=emptyBoard()
  for(let r=16;r<20;r++)for(const c of [0,1,2])board[r][c]='L'
  for(const c of [6,7,8,9])board[19][c]='O'
  const initial={...newGame('D','I',{},'C'),board},saved=JSON.stringify(board)
  const decision=analyzeMove(board,initial.piece,initial.next,true,initial.turn,initial.following)
  assert.ok(decision);assert.equal(cellsFor(decision.target).length,5)
  assert.ok(reachableLandings(board,initial.piece).some(target=>JSON.stringify(target)===JSON.stringify(decision.target)))
  assert.ok(decision.drilled<=2);assert.equal(decision.forecastSteps,2)
  const played=finish(gameReducer(initial,{type:'ai-move',next:'O'}))
  assert.deepEqual(played.board,decision.result.board);assert.equal(played.score,10+decision.cleared*100)
  assert.equal(JSON.stringify(board),saved)
})

test('Crystal survives three subsequent placements, expires after their lines, and never ages during pause', () => {
  let state = newGame('C', 'I', {}, 'O')
  state = finish(gameReducer(state, { type: 'drop', next: 'L' }))
  assert.equal(state.turn, 1); assert.equal(count(state.board, 'C'), 5)
  assert.ok(state.board.flat().filter(cell => cellKind(cell) === 'C').every(cell => crystalRemaining(cell, state.turn) === 3))
  const paused = gameReducer(state, { type: 'pause' })
  for (const type of ['tick','drop','crack-complete','drill-tick']) assert.strictEqual(gameReducer(paused, { type }), paused)
  state = finish(gameReducer({ ...state, piece: { ...state.piece, c: 8 } }, { type: 'drop', next: 'D' }))
  assert.equal(state.turn, 2); assert.equal(count(state.board, 'C'), 5)
  state = gameReducer({ ...state, piece: { ...state.piece, c: 0 } }, { type: 'drop', next: 'I' })
  state = finish(state)
  assert.equal(state.turn, 3); assert.equal(count(state.board, 'C'), 5); assert.equal(state.score, 30)
  assert.ok(state.board.flat().filter(cell => cellKind(cell) === 'C').every(cell => crystalRemaining(cell, state.turn) === 1))
  state = gameReducer({ ...state, piece: { ...state.piece, c: 2 } }, { type: 'drop', next: 'L' })
  assert.ok(state.cracking); assert.equal(state.turn, 3); assert.equal(state.score, 30)
  state = finish(state)
  assert.equal(state.turn, 4); assert.equal(count(state.board, 'C'), 0); assert.equal(state.score, 40)
})
test('a last-turn Crystal can complete a line before its remaining cells break', () => {
  const board = emptyBoard(); board[19].fill('L'); board[19][8] = null
  for (const r of [18,19]) for (const c of [4,5]) board[r][c] = crystal(3, `${r}-${c}`)
  const plan = lockPiece(board, landing(board, { ...spawn('I'), c: 8 }), true, 2, true)
  assert.equal(plan.cleared, 1); assert.equal(plan.expired.length, 2); assert.equal(count(plan.board, 'C'), 0)
  assert.equal(plan.phases[0].kind, 'clear'); assert.equal(plan.phases[1].kind, 'crack')
  const played = finish(gameReducer({ ...newGame('I','L'), board, turn: 2, piece: { ...spawn('I'), c: 8 } }, { type: 'drop', next: 'O' }))
  assert.equal(played.score, 110); assert.deepEqual(played.board, plan.board)
})
test('line shifts retain absolute Crystal lifetime and cell identity', () => {
  const board = emptyBoard(), cell = crystal(5)
  board[17][0] = cell; board[19].fill('L'); board[19][8] = null
  const plan = lockPiece(board, landing(board, { ...spawn('I'), c: 8 }), false, 0)
  assert.strictEqual(plan.board[18][0], cell); assert.equal(plan.board[18][0].expiresAt, 5)
})
test('Drill consumes at most two blocks, falls through gaps and stops at the third obstacle', () => {
  const board = emptyBoard(); board[12][4] = 'L'; board[15][4] = 'O'; board[18][4] = 'S'
  const saved = JSON.stringify(board), contact = landing(board, spawn('D'))
  const plan = lockPiece(board, contact, true, 0, true)
  assert.equal(JSON.stringify(board), saved)
  assert.deepEqual(plan.drilled.map(({r,c}) => [r,c]), [[12,4],[15,4]])
  assert.equal(plan.board[18][4], 'S'); assert.equal(count(plan.board, 'D'), 5)
  assert.deepEqual(plan.ghostCells, [[13,4],[14,4],[15,4],[16,4],[17,4]])
  const frames = plan.phases[0].frames
  for (let i = 1; i < frames.length; i++) assert.equal(frames[i].piece.r - frames[i-1].piece.r, 1)
  const played = finish(gameReducer({ ...newGame('D','O'), board }, { type: 'drop', next: 'I' }))
  assert.deepEqual(played.board, plan.board); assert.equal(played.score, 10); assert.equal(played.lines, 0)
})
test('horizontal Drill cannot destroy three supports or overwrite a block', () => {
  const board = emptyBoard(); for (const c of [3,4,5]) board[19][c] = 'L'
  const plan = lockPiece(board, landing(board, { ...spawn('D'), rotation: 1 }), false)
  assert.equal(plan.drilled.length, 0); assert.ok(board[19].every((cell,c) => ![3,4,5].includes(c) || plan.board[19][c] === cell))
  assert.equal(count(plan.board, 'D'), 5)
})
test('Drill can rescue an above-ceiling contact without deleting hidden piece cells', () => {
  const board = emptyBoard(); board[2][4] = 'L'; board[3][4] = 'O'
  const contact = landing(board, { ...spawn('D'), r: -1 }), plan = lockPiece(board, contact, false)
  assert.equal(plan.over, false); assert.equal(plan.drilled.length, 2); assert.equal(count(plan.board, 'D'), 5)
})
test('Crystal expiry releases fluid T blocks and resolves their resulting line', () => {
  const board = emptyBoard(); board[19].fill('L'); board[19][3] = null; board[19][4] = crystal(2)
  board[18][3] = 'T'; board[18][4] = 'T'
  const plan = lockPiece(board, landing(board, { ...spawn('O'), c: 8 }), true, 1, true)
  assert.deepEqual(plan.phases.map(phase => phase.kind), ['crack','settle','clear'])
  assert.equal(plan.expired.length, 1); assert.equal(plan.cleared, 1)
  const played = finish(gameReducer({ ...newGame('O','L'), board, turn: 1, piece: { ...spawn('O'), c: 8 } }, { type: 'drop', next: 'I' }))
  assert.deepEqual(played.board, plan.board); assert.equal(played.score, 110)
})
test('pause/reset and stale phase callbacks cannot perforate, expire or score another turn', () => {
  const board = emptyBoard(); board[12][4] = 'L'
  let state = gameReducer({ ...newGame('D','O'), board }, { type: 'drop', next: 'I' })
  const old = { type: 'drill-tick', token: state.drilling.token }
  const paused = gameReducer(state, { type: 'pause' })
  assert.strictEqual(gameReducer(paused, old), paused)
  state = gameReducer(state, { type: 'restart', first: 'D', next: 'C', following: 'I' })
  state = gameReducer(state, { type: 'drop', next: 'L' })
  assert.strictEqual(gameReducer(state, old), state)
  const crystalBoard = emptyBoard(); crystalBoard[19][0] = crystal(1)
  const cracking = gameReducer({ ...newGame('O','L'), board: crystalBoard }, { type: 'drop', next: 'I' })
  const reset = gameReducer(cracking, { type: 'restart', first: 'C', next: 'D' })
  assert.strictEqual(gameReducer(reset, { type: 'crack-complete', token: cracking.cracking }), reset)
})
test('AI uses the three-placement Crystal lifetime without inventing a third future piece', () => {
  const decision = analyzeMove(emptyBoard(), spawn('C'), 'I', true, 0, 'O')
  assert.equal(decision.forecastSteps, 2)
  assert.equal(decision.forecast[0].name, 'I'); assert.equal(decision.forecast[1].name, 'O')
  assert.equal(decision.forecast[1].result.expired.length, 0)
  assert.equal(count(decision.forecast[1].result.board, 'C'), 5)
  assert.ok(decision.forecast[1].result.board.flat().filter(cell => cellKind(cell) === 'C').every(cell => crystalRemaining(cell, decision.forecast[1].result.turn) === 1))
  assert.ok(Math.abs(decision.future - decision.forecast[0].value - 0.6 * decision.forecast[1].value) < 1e-10)
  const base = { ...newGame('C','I',{},'O') }
  const played = finish(gameReducer(base, { type: 'ai-move', next: 'D' }))
  assert.deepEqual(played.board, decision.result.board)
  assert.equal(played.next, 'O'); assert.equal(played.following, 'D'); assert.equal(played.aiMoves, 1)
})
test('manual animated transactions and simulation match for every piece with live Crystal clocks', () => {
  for (const name of Object.keys(PIECES)) for (const magic of [false,true]) {
    const board = emptyBoard(); board[19][0] = crystal(2); board[19][4] = 'L'; board[18][4] = 'O'
    const initial = { ...newGame(name,'I'), board, turn: 1 }
    const expected = lockPiece(board, landing(board, initial.piece), magic, initial.turn)
    const played = finish(gameReducer({ ...initial, magic }, { type: 'drop', next: 'C' }))
    assert.deepEqual(played.board, expected.board, `${name}/${magic}`)
    assert.equal(played.score, 10 + expected.cleared * 100)
    assert.equal(played.turn, expected.turn)
  }
})
test('AI preview inputs retain the pre-move board and known queue across reactions and reset clears them', () => {
  const board=emptyBoard();for(const r of [18,19])for(let c=0;c<8;c++)board[r][c]='O'
  board[17][0]=crystal(1);board[16][0]='T'
  const initial={...newGame('O','I',{ai:true},'C'),board,piece:{...spawn('O'),c:8}},saved=JSON.stringify(board)
  let state=gameReducer(initial,{type:'drop',next:'D'})
  const source=state.resolution.source
  assert.deepEqual(source,{board,piece:initial.piece,next:'I',following:'C',magic:true,turn:0})
  for(let step=0;state.resolution&&step<100;step++){
    assert.strictEqual(state.resolution.source,source)
    const action=state.clearing?{type:'clear-complete',result:state.clearing.result}:state.cracking?{type:'crack-complete',token:state.cracking}:{type:'settle-tick',token:state.settling.token}
    state=gameReducer(state,action)
  }
  assert.equal(state.resolution,null)
  assert.equal(JSON.stringify(source.board),saved);assert.equal(state.next,'C');assert.equal(state.following,'D')
  const reset=gameReducer(gameReducer(initial,{type:'drop',next:'D'}),{type:'restart',first:'I',next:'O',following:'L'})
  assert.equal(reset.resolution,null)
})
test('new special pieces are half as frequent as each normal piece and preserve legacy demo draws', () => {
  const original = Math.random, counts = {}
  try {
    for (let i = 0; i < 900; i++) { Math.random = () => (i + 0.5) / 900; const name = randomPiece(); counts[name] = (counts[name] ?? 0) + 1 }
    assert.equal(counts.C, 50); assert.equal(counts.D, 50); assert.equal(counts.O, 100)
    Math.random = () => 0.66; assert.equal(randomPiece(), 'O')
    Math.random = () => 0.95; assert.equal(randomPiece(), 'T')
  } finally { Math.random = original }
})
test('every special-piece selection draws only its eligible pool, including all-off with a fixed RNG', () => {
  const original=Math.random,names=Object.keys(PIECES),specials=['T','C','D']
  try {
    for(let mask=0;mask<8;mask++){
      const enabled=Object.fromEntries(specials.map((name,index)=>[name,Boolean(mask&(1<<index))])),seen=new Set()
      for(let i=0;i<900;i++){Math.random=()=>(i+0.5)/900;const name=randomPiece(enabled);assert.ok(!specials.includes(name)||enabled[name],`${mask}/${name}`);seen.add(name)}
      assert.deepEqual(seen,new Set(names.filter(name=>!specials.includes(name)||enabled[name])))
    }
    Math.random=()=>0.95
    assert.ok(!specials.includes(randomPiece({T:false,C:false,D:false})))
  } finally {Math.random=original}
})
test('disabling specials cleans the known queue without replacing the active piece and survives restart', () => {
  let state=newGame('T','C',{},'D'),piece=state.piece,board=state.board
  for(const name of ['T','C','D'])state=gameReducer(state,{type:'toggle-special',name,next:'I',following:'O',drawn:'L'})
  assert.deepEqual(state.enabledSpecials,{T:false,C:false,D:false})
  assert.strictEqual(state.piece,piece);assert.strictEqual(state.board,board);assert.equal(state.magic,true);assert.equal(state.turn,0);assert.equal(state.score,0)
  assert.equal(state.next,'I');assert.equal(state.following,'O')
  state=gameReducer(state,{type:'restart',first:'T',next:'C',following:'D'})
  assert.deepEqual(state.enabledSpecials,{T:false,C:false,D:false})
  for(const name of [state.piece.name,state.next,state.following])assert.ok(!['T','C','D'].includes(name))
  state=finish(gameReducer(state,{type:'drop',next:'D'}))
  for(const name of [state.piece.name,state.next,state.following])assert.ok(!['T','C','D'].includes(name))
})
test('selection changes during a paused reaction keep its physics and resample both known and deferred pieces', () => {
  let state=gameReducer(newGame('D','C',{},'T'),{type:'drop',next:'D'})
  state=gameReducer(state,{type:'pause'})
  const result=state.resolution.result,board=state.board,piece=state.piece
  for(const name of ['C','T','D'])state=gameReducer(state,{type:'toggle-special',name,next:'I',following:'O',drawn:'L'})
  assert.strictEqual(state.resolution.result,result);assert.strictEqual(state.board,board);assert.strictEqual(state.piece,piece)
  assert.equal(state.paused,true);assert.equal(state.score,0);assert.equal(state.turn,0)
  assert.equal(state.resolution.source.next,'I');assert.equal(state.resolution.source.following,'O');assert.equal(state.resolution.nextName,'L')
  state=finish(gameReducer(state,{type:'pause'}))
  assert.equal(state.piece.name,'I');assert.equal(state.next,'O');assert.equal(state.following,'L')
  assert.equal(count(state.board,'D'),5);assert.equal(state.score,10)
})
