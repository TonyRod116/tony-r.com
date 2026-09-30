import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { MLP } from '../../src/components/games/NeuralNetwork/mlp.js'
import { NAMES, emptyBoard, spawn, fits, cellsFor, previewCells, landing, rotate, lockPiece, reachableLandings, newGame, gameReducer, suggestMove } from '../../src/components/games/tetrisEngine.js'

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
  const played=gameReducer(game,{type:'drop',next:'L'})
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
  const board=emptyBoard();board[1][4]='O'
  const target=landing(board,spawn('I'))
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
