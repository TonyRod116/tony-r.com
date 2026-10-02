import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { gameLearning, learningCopy } from '../../src/data/gameLearning.js'
import { analyzeMove, emptyBoard, spawn, lockPiece, gameReducer, newGame } from '../../src/components/games/tetrisEngine.js'

test('educational code excerpts exist in the real game sources and all languages are present', () => {
  const compact = text => text.replace(/\s+/g, '')
  for (const lesson of Object.values(gameLearning)) {
    const source = compact(readFileSync(new URL(`../../${lesson.source}`, import.meta.url), 'utf8'))
    for (const excerpt of [lesson.code, lesson.moreCode]) assert.ok(source.includes(compact(excerpt)), `${lesson.source}: excerpt drift`)
    for (const language of ['es', 'en', 'ca']) {
      assert.ok(lesson.title[language] && lesson.explanation[language] && lesson.glossary[language])
      assert.ok(learningCopy[language].code && learningCopy[language].more)
    }
  }
})
test('Tetris explains actual post-clear features and the next-piece value without mutating the board', () => {
  const board = emptyBoard(), saved = JSON.stringify(board)
  const decision = analyzeMove(board, spawn('O'), 'I', true)
  assert.equal(JSON.stringify(board), saved)
  assert.equal(decision.cleared, 0); assert.equal(decision.height, 2); assert.equal(decision.holes, 0); assert.equal(decision.bumpiness, 2)
  assert.equal(decision.immediate, -12.6); assert.equal(decision.future, -12.6)
  assert.ok(Math.abs(decision.score - (-20.16)) < 1e-12)
  const placed = lockPiece(board, decision.target, true)
  assert.equal(placed.over, false); assert.equal(placed.board.flat().filter(Boolean).length, 4)
})
test('one-off AI retains its own explanation through resolving phases and reset clears it', () => {
  let state = newGame('T', 'I')
  state = gameReducer(state, { type: 'ai-move', next: 'O' })
  const decision = state.lastAiDecision
  assert.ok(decision); assert.equal(decision.target.name, 'T'); assert.ok(state.settling)
  for (let step = 0; state.settling && step < 30; step++) state = gameReducer(state, { type: 'settle-tick' })
  assert.strictEqual(state.lastAiDecision, decision)
  state = gameReducer(state, { type: 'restart', first: 'O', next: 'I' })
  assert.equal(state.lastAiDecision, null)
})
test('Minesweeper explanation preserves a zero-mine subset deduction using revealed clues only', () => {
  const source = readFileSync(new URL('../../src/components/games/Minesweeper.jsx', import.meta.url), 'utf8')
    .split('const Minesweeper =')[0].replace(/^import .*$/gm, '')
  const AI = vm.runInNewContext(`${source}\nMinesweeperAI`)
  const ai = new AI(3, 3)
  ai.addKnowledge([0, 0], 1); ai.addKnowledge([0, 1], 1)
  const move = ai.makeSafeMove(), key = move.join(','), reason = ai.safeReasons.get(key)
  assert.equal(key, '0,2'); assert.equal(reason.count, 0)
  assert.deepEqual([...reason.cells].sort(), ['0,2', '1,2'])
  const snapshot = JSON.stringify(reason)
  ai.addKnowledge(move, 0)
  assert.equal(JSON.stringify(reason), snapshot, 'later knowledge cannot rewrite the displayed deduction')
})
