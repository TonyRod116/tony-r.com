import { test } from 'node:test'
import assert from 'node:assert/strict'
import { assessProgress } from '../../scripts/ai-loop.mjs'

test('bounded loop stops at success, limits or repeated lack of evidence', () => {
  assert.equal(assessProgress({ completed: true, cycles: [] }).next, 'complete')
  assert.equal(assessProgress({ maxCycles: 2, cycles: [{ evidence: ['a'] }, { evidence: ['b'] }] }).next, 'stop_budget')
  assert.equal(assessProgress({ maxCycles: 8, cycles: [{ evidence: ['a'] }, { evidence: ['a'] }, { evidence: ['a'] }] }).next, 'stop_no_progress')
  assert.equal(assessProgress({ maxCycles: 4, cycles: [{ evidence: ['a'] }, { evidence: ['b'] }] }).next, 'continue_authorized_work')
})

test('new output names alone do not count as progress', () => {
  assert.equal(assessProgress({ cycles: [{ evidence: ['same-hash'], output: 'v1' }, { evidence: ['same-hash'], output: 'v2' }, { evidence: ['same-hash'], output: 'v3' }] }).next, 'stop_no_progress')
})

test('external gates remain pending, and malformed budgets fail', () => {
  assert.equal(assessProgress({ pendingExternalAction: 'publish', cycles: [] }).next, 'owner_gate')
  assert.throws(() => assessProgress({ maxCycles: 0, cycles: [] }), /budget/)
})
