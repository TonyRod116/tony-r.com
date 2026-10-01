import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { MLP } from '../../src/components/games/NeuralNetwork/mlp.js'
import { PIECES, NAMES, emptyBoard, spawn, fits, cellsFor, previewCells, landing, rotate, lockPiece, settleSandStep, reachableLandings, newGame, gameReducer, suggestMove } from '../../src/components/games/tetrisEngine.js'

const definition = JSON.parse(readFileSync(new URL('../../public/models/mnist/014_dataset-1x.json', import.meta.url), 'utf8'))
test('unloaded neural model cannot produce invented predictions', () => assert.throws(() => new MLP().forward(Array(784).fill(0)), /not loaded/))
test('real local weights have the actual architecture and stable probabilities', () => {
  const model = new MLP(definition)
  assert.deepEqual(model.layers.map(layer => layer.size), [784,128,64,10])
  const probabilities = model.softmax(model.forward(Array(784).fill(0)))
  assert.equal(probabilities.length,10)
  assert.ok(probabilities.every(value => Number.isFinite(value) && value >= 0 && value <= 1))
  assert.ok(Math.abs(probabilities.reduce((a,b) => a+b,0)-1) < 1e-10)
  assert.deepEqual(model.softmax([10000,9999]), model.softmax([1,0]))
})
test('corrupt and incompatible model tensors fail before becoming ready', () => {
  for (const mutate of [data => { data.layers = [] }, data => { data.layers[0].weights.data = 'AAAA' }, data => { data.layers[1].weights.shape = [64,127] }, data => { data.layers[0].weights.data = '/H8=' + data.layers[0].weights.data.slice(4) }]) {
    const data = structuredClone(definition); mutate(data)
    const model = new MLP()
    assert.throws(() => model.loadDefinition(data)); assert.equal(model.ready, false)
  }
})
test('neural input validation rejects wrong size and non-finite pixels', () => {
  const model = new MLP(definition)
  assert.throws(() => model.forward([1]))
  assert.throws(() => model.forward(Array(784).fill(NaN)))
})
test('all piece previews preserve every cell, including the five-block T', () => {
  for (const name of NAMES) {
    const cells = previewCells(name)
    assert.equal(cells.length, name === 'T' ? 5 : 4)
    assert.equal(new Set(cells.map(cell => cell.join(','))).size, cells.length)
    assert.ok(cells.every(([r,c]) => r>=0 && r<5 && c>=0 && c<5))
  }
})
test('rotations stay connected, return after four turns and never wrap a wall', () => {
  for (const name of NAMES) {
    const initial = { ...spawn(name), r: 8 }
    let piece = initial
    for (let i=0;i<4;i++) piece=rotate(emptyBoard(),piece)
    assert.deepEqual(cellsFor(piece),cellsFor(initial))
    for (let rotation=0;rotation<4;rotation++) {
      const cells = cellsFor({...initial, rotation})
      const visited = new Set([cells[0].join(',')])
      for (let pass=0;pass<cells.length;pass++) for (const [r,c] of cells) if (cells.some(([rr,cc]) => Math.abs(r-rr)+Math.abs(c-cc)===1 && visited.has(`${rr},${cc}`))) visited.add(`${r},${c}`)
      assert.equal(visited.size,cells.length)
      assert.equal(fits(emptyBoard(),{...initial,rotation,c:-5}),false)
      assert.equal(fits(emptyBoard(),{...initial,rotation,c:15}),false)
    }
  }
})
test('manual drop and AI simulation share Magic T sand settlement', () => {
  const board=emptyBoard();board[19][4]='O'
  const game={...newGame('T','I'),board}
  const target=landing(board,game.piece), simulated=lockPiece(board,target,true)
  let played=gameReducer(game,{type:'drop',next:'L'})
  for(let frame=0;played.settling&&frame<30;frame++)played=gameReducer(played,{type:'settle-tick'})
  assert.deepEqual(played.board,simulated.board)
  assert.equal(played.board.flat().filter(cell => cell==='T').length,5)
  assert.equal(simulated.over,false)
})
test('line clearing conserves board size and moves settled rows correctly', () => {
  const board=emptyBoard(); board[19].fill('L');board[19][4]=null;board[19][5]=null
  const result=lockPiece(board, {name:'O',rotation:0,r:19,c:4},false)
  assert.equal(result.cleared,1);assert.equal(result.board.length,20)
  assert.equal(result.board[19][4],'O');assert.equal(result.board[19][5],'O')
})
test('locking above the ceiling loses instead of deleting invisible cells', () => {
  const board=emptyBoard();board[2][4]='O'
  const target=landing(board,{...spawn('I'),r:-1})
  assert.equal(lockPiece(board,target).over,true)
})
test('AI placements are reachable and cannot overwrite settled cells', () => {
  const board=emptyBoard();board[19].fill('L');board[19][0]=null;board[19][1]=null
  const piece=spawn('O'),suggestion=suggestMove(board,piece,'T',true)
  assert.ok(suggestion); assert.ok(reachableLandings(board,piece).some(target => JSON.stringify(target)===JSON.stringify(suggestion)))
  assert.ok(fits(board,suggestion)); assert.equal(lockPiece(board,suggestion).over,false)
})
test('pause blocks gravity, drops and AI; reset cannot be overwritten by timers', () => {
  let game={...newGame('T','L'),ai:true};game=gameReducer(game,{type:'pause'})
  for (const type of ['tick','drop','left','rotate','ai-move']) assert.strictEqual(gameReducer(game,{type,next:'I'}),game)
  const restarted=gameReducer(game,{type:'restart',first:'O',next:'I'})
  assert.equal(restarted.score,0);assert.equal(restarted.paused,false);assert.equal(restarted.board.flat().filter(Boolean).length,0)
})

test('every shape rotates around its central frame, rather than an end block', () => {
  for (const name of NAMES) for (let rotation=0;rotation<4;rotation++) {
    const piece={...spawn(name),r:8,rotation}, cells=cellsFor(piece)
    const pivot=PIECES[name].pivot || [0,0]
    for(const [axis,origin]of [[0,piece.r+pivot[0]],[1,piece.c+pivot[1]]]) {
      const center=(Math.min(...cells.map(cell=>cell[axis]))+Math.max(...cells.map(cell=>cell[axis])))/2
      assert.ok(Math.abs(center-origin)<=0.5,`${name}/${rotation} pivots at its end: center ${center}, origin ${origin}`)
    }
  }
})
test('one requested AI move works independently of the suggestion display toggle', () => {
  const state=newGame('L','O'), moved=gameReducer(state,{type:'ai-move',next:'I'})
  assert.equal(state.ai,false);assert.equal(moved.ai,false)
  assert.equal(moved.aiMoves,1);assert.ok(moved.score>=10)
  assert.equal(moved.board.flat().filter(Boolean).length,4)
})
test('edge rotations and AI placements cannot split a single shape across both walls', () => {
  for(const name of NAMES) {
    for(const c of [0,1,8,9])for(let rotation=0;rotation<4;rotation++) {
      const piece={name,r:12,c,rotation},board=emptyBoard()
      if(!fits(board,piece))continue
      const turned=rotate(board,piece),cells=cellsFor(turned)
      assert.ok(fits(board,turned));assert.ok(cells.every(([r,col])=>Number.isInteger(r)&&Number.isInteger(col)&&col>=0&&col<10))
      assert.ok(Math.max(...cells.map(([,col])=>col))-Math.min(...cells.map(([,col])=>col))<=3)
    }
    for(const gap of [0,8]) {
      const board=emptyBoard();board[19].fill('O');board[19][gap]=null;board[19][gap+1]=null
      const target=suggestMove(board,spawn(name),null,false)
      assert.ok(target);assert.ok(fits(board,target))
      const cells=cellsFor(target)
      assert.ok(Math.max(...cells.map(([,col])=>col))-Math.min(...cells.map(([,col])=>col))<=3)
      assert.equal(lockPiece(board,target,false).over,false)
    }
  }
})
test('Magic T touches first, settles visibly, and pauses without accepting other moves', () => {
  const board=emptyBoard();board[12][4]='O'
  const initial={...newGame('T','L'),board},target=landing(board,initial.piece),expected=lockPiece(board,target,true)
  let state=gameReducer(initial,{type:'drop',next:'O'})
  assert.ok(state.settling,'contact cannot jump directly to the final sand result')
  assert.notDeepEqual(state.board,expected.board)
  assert.equal(state.next,initial.next);assert.equal(state.score,0)
  for(const type of ['tick','drop','left','right','rotate','ai-move'])assert.strictEqual(gameReducer(state,{type,next:'I'}),state)
  state=gameReducer(state,{type:'pause'})
  assert.strictEqual(gameReducer(state,{type:'settle-tick'}),state)
  state=gameReducer(state,{type:'pause'})
  let frames=0
  while(state.settling&&frames<30){state=gameReducer(state,{type:'settle-tick'});frames++}
  assert.ok(frames>2&&frames<30);assert.equal(state.settling,null)
  assert.deepEqual(state.board,expected.board);assert.equal(state.piece.name,'L');assert.equal(state.next,'O')
  assert.equal(state.score,10+expected.cleared*100)
})

test('animated sand frames conserve blocks, move only down, and match final AI physics', () => {
  const board=emptyBoard();board[12][4]='O';board[18][3]='L';board[17][5]='Li'
  const piece=landing(board,spawn('T')),expected=lockPiece(board,piece,true)
  let contact=board.map(row=>[...row]);cellsFor(piece).forEach(([r,c])=>{contact[r][c]='T'})
  const counts=Array.from({length:10},(_,c)=>contact.filter(row=>row[c]==='T').length)
  let frames=0
  while(frames<30){
    const frame=settleSandStep(contact)
    assert.deepEqual(Array.from({length:10},(_,c)=>frame.board.filter(row=>row[c]==='T').length),counts)
    for(const [r,c]of frame.moved){assert.equal(contact[r-1][c],'T');assert.equal(frame.board[r][c],'T')}
    contact=frame.board;frames++
    if(!frame.moved.length)break
  }
  assert.ok(frames<30);assert.deepEqual(contact,expected.board)
  const state=gameReducer({...newGame('T','L'),board},{type:'drop',next:'O'})
  const reset=gameReducer(state,{type:'restart',first:'I',next:'O'})
  assert.equal(reset.settling,null);assert.strictEqual(gameReducer(reset,{type:'settle-tick'}),reset)
})

test('centered pieces spawn fully visible, including all five Magic T cells',()=>{
  for(const name of NAMES){const piece=spawn(name);assert.ok(fits(emptyBoard(),piece));assert.ok(cellsFor(piece).every(([r])=>r>=0))}
  assert.equal(cellsFor(spawn('T')).length,5)
})
test('full rows remain visible during the flash and commit together exactly once',()=>{
  const board=emptyBoard();board[17][0]='S'
  for(const row of [18,19]){board[row].fill('L');board[row][4]=null;board[row][5]=null}
  const initial={...newGame('O','L'),board},expected=lockPiece(board,landing(board,initial.piece),true)
  const flashing=gameReducer(initial,{type:'drop',next:'I'})
  assert.ok(flashing.clearing,'full lines cannot vanish before the flash')
  assert.deepEqual(flashing.clearing.rows,[18,19]);assert.equal(flashing.score,0);assert.equal(flashing.lines,0)
  assert.ok(flashing.board[18].every(Boolean));assert.ok(flashing.board[19].every(Boolean))
  for(const type of ['tick','drop','left','right','rotate','ai-move','settle-tick'])assert.strictEqual(gameReducer(flashing,{type,next:'T'}),flashing)
  const complete={type:'clear-complete',result:flashing.clearing.result},paused=gameReducer(flashing,{type:'pause'})
  assert.strictEqual(gameReducer(paused,complete),paused)
  const finished=gameReducer(gameReducer(paused,{type:'pause'}),complete)
  assert.deepEqual(finished.board,expected.board);assert.equal(finished.lines,2);assert.equal(finished.score,210)
  assert.equal(finished.piece.name,'L');assert.equal(finished.clearing,null)
  assert.strictEqual(gameReducer(finished,complete),finished)
  const reset=gameReducer(flashing,{type:'restart',first:'O',next:'L'})
  const freshFlash=gameReducer({...reset,board},{type:'drop',next:'T'})
  assert.strictEqual(gameReducer(freshFlash,complete),freshFlash,'an old timer cannot finish a new flash')
})
test('Magic T finishes dissolving before its completed row flashes',()=>{
  const board=emptyBoard();board[19].fill('L');for(const c of [3,4,5])board[19][c]=null
  const initial={...newGame('T','L'),board},expected=lockPiece(board,landing(board,initial.piece),true)
  let state=gameReducer(initial,{type:'drop',next:'O'})
  assert.ok(state.settling);assert.equal(state.clearing,null)
  for(let frame=0;state.settling&&frame<30;frame++)state=gameReducer(state,{type:'settle-tick'})
  assert.ok(state.clearing);assert.deepEqual(state.clearing.rows,[19]);assert.equal(state.score,0)
  const finished=gameReducer(state,{type:'clear-complete',result:state.clearing.result})
  assert.deepEqual(finished.board,expected.board);assert.equal(finished.score,110);assert.equal(finished.lines,1)
})
test('AI line clears use the same flash phase and count the move only on completion',()=>{
  const board=emptyBoard();board[19].fill('L');board[19][4]=null;board[19][5]=null
  const initial={...newGame('O','L'),board},state=gameReducer(initial,{type:'ai-move',next:'I'})
  assert.ok(state.clearing);assert.equal(state.aiMoves,0)
  const finished=gameReducer(state,{type:'clear-complete',result:state.clearing.result})
  assert.equal(finished.aiMoves,1);assert.equal(finished.score,110);assert.equal(finished.lines,1)
})
