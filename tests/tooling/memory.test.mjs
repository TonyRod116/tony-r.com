import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, symlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { context, health, outcome, selectLanes, safePath } from '../../scripts/ai-memory.mjs'

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'my-page-memory-'))
  mkdirSync(join(root, 'docs'))
  mkdirSync(join(root, '.agents/memory'), { recursive: true })
  writeFileSync(join(root, 'docs/current.md'), '# Current\nLast updated: 2026-09-30\nThe current demo uses BuildApp.\n')
  writeFileSync(join(root, 'docs/old.md'), '# Historical\nThe demo used another API.\n')
  const map = {
    schema_version: 1,
    lanes: { ops: ['skills', 'router', 'memoria', 'hooks'], marketing: ['copy', 'seo', 'posicionamiento'], design: ['diseño', 'visual'], demos: ['demo', 'chat'], api: ['endpoint', 'api'], site: ['portada', 'home', 'web'], explain: [] },
    sources: [
      { id: 'current', path: 'docs/current.md', status: 'current', authority: 100, lanes: ['all'], required: true, freshness_days: 30 },
      { id: 'old', path: 'docs/old.md', status: 'historical', authority: 20, lanes: ['all'] },
    ],
  }
  return { root, map }
}

test('routing composes affirmative topics and preserves excluded actions', () => {
  assert.deepEqual(selectLanes('Cambiar portada y SEO, no toques API', fixture().map), ['marketing', 'site'])
  assert.deepEqual(selectLanes('El chat no funciona', fixture().map), ['demos'])
  assert.deepEqual(selectLanes('Revisa las skills y memoria', fixture().map), ['ops'])
})

test('context returns current primary sources without historical or write authority', () => {
  const { root, map } = fixture()
  const result = context(root, map, 'Explica el chat; no implementes')
  assert.equal(result.query, 'Explica el chat; no implementes')
  assert.equal(result.status, 'ready')
  assert.equal(result.authority.writes, false)
  assert.equal(result.items.length, 1)
  assert.match(result.items[0].excerpt, /BuildApp/)
  assert.ok(!result.items.some(x => x.path.endsWith('old.md')))
})

test('missing required sources block claims instead of inventing context', () => {
  const { root, map } = fixture()
  map.sources[0].path = 'docs/missing.md'
  assert.equal(context(root, map, 'chat').status, 'blocked_missing_sources')
  assert.equal(health(root, map).status, 'blocked')
})

test('bodyless required Markdown is invalid memory', () => {
  const { root, map } = fixture()
  writeFileSync(join(root, 'docs/current.md'), '# Heading only\n\n')
  assert.equal(context(root, map, 'chat').status, 'blocked_invalid_sources')
})

test('stale dates degrade freshness without overriding authority', () => {
  const { root, map } = fixture()
  writeFileSync(join(root, 'docs/current.md'), '# Current\nLast updated: 2020-01-01\nStill needs verification.\n')
  assert.equal(context(root, map, 'chat', { now: '2026-09-30' }).status, 'degraded_stale_sources')
})

test('bounded capsules report unread required material', () => {
  const { root, map } = fixture()
  writeFileSync(join(root, 'docs/second.md'), '# Second\nAnother required source.\n')
  map.sources.push({ ...map.sources[0], id: 'second', path: 'docs/second.md' })
  const result = context(root, map, 'chat', { maxChars: 30 })
  assert.equal(result.status, 'degraded_context_budget')
  assert.ok(JSON.stringify(result.items).length < 1500)
  assert.ok(result.unrepresented_required_sources.length > 0)
})

test('unknown manual lanes fail rather than selecting generic context', () => {
  const { root, map } = fixture()
  assert.throws(() => context(root, map, 'chat', { lane: 'funded' }), /Unknown lane/)
})

test('traversal, secrets, generated output and external symlinks are rejected', () => {
  const { root } = fixture()
  for (const path of ['../outside.md', '/etc/passwd', '.env', 'server/.env', '.claude/settings.local.json', 'dist/index.html', '.git/config']) {
    assert.throws(() => safePath(root, path), /not allowed|outside/)
  }
  symlinkSync('/etc/passwd', join(root, 'docs/external.md'))
  assert.throws(() => safePath(root, 'docs/external.md'), /outside/)
  writeFileSync(join(root, '.env'), 'synthetic secret')
  symlinkSync(join(root, '.env'), join(root, 'docs/secret.md'))
  assert.throws(() => safePath(root, 'docs/secret.md'), /not allowed/)
})

test('outcome preview does not create a ledger; record binds actual evidence', () => {
  const { root } = fixture()
  const input = { kind: 'software_change', claim: 'The route works', decision: 'Use current route', observed: 'Verified local response', evidence: ['docs/current.md'], task: 'test-1' }
  const preview = outcome(root, input)
  assert.equal(preview.recorded, false)
  assert.throws(() => readFileSync(join(root, '.agents/memory/outcomes.jsonl')))
  const recorded = outcome(root, input, { record: true })
  assert.equal(recorded.authority, 'proposal_only')
  assert.match(recorded.evidence[0].sha256, /^[a-f0-9]{64}$/)
  assert.throws(() => outcome(root, input, { record: true }), /Duplicate outcome/)
})

test('invalid evidence and unsupported outcome kinds do not append observations', () => {
  const { root } = fixture()
  const input = { kind: 'software_change', claim: 'Works', decision: 'Keep', observed: 'Observed', evidence: ['docs/missing.md'] }
  assert.throws(() => outcome(root, input, { record: true }), /ENOENT|missing/)
  assert.throws(() => outcome(root, { ...input, kind: 'live_approval' }), /Unsupported/)
})

test('health catches evidence drift and malformed ledgers', () => {
  const { root, map } = fixture()
  outcome(root, { kind: 'agent_evaluation', claim: 'Expected', decision: 'Test', observed: 'Actual', evidence: ['docs/current.md'] }, { record: true })
  writeFileSync(join(root, 'docs/current.md'), '# Changed\nDifferent bytes.\n')
  assert.ok(health(root, map).errors.some(x => x.includes('Evidence drift')))
  writeFileSync(join(root, '.agents/memory/outcomes.jsonl'), '{broken}\n')
  assert.ok(health(root, map).errors.some(x => x.includes('Invalid outcome ledger')))
})

test('malformed manifest and duplicate source identities fail visibly', () => {
  const { root, map } = fixture()
  map.sources.push({ ...map.sources[0] })
  assert.throws(() => context(root, map, 'chat'), /Duplicate source/)
})

test('documented endpoint drift is detected against the current client', () => {
  const { root, map } = fixture()
  writeFileSync(join(root, 'docs/client.js'), 'fetch(`/api/v1/demo/chat`)')
  writeFileSync(join(root, 'docs/current.md'), '# Contract\n| Chat | `/api/v1/demo/chat` |\n')
  map.contract_checks = [{ id: 'chat', code: 'docs/client.js', documentation: 'docs/current.md', row_contains: '| Chat |', expected_endpoint: '/api/v1/demo/chat', lanes: ['demos'] }]
  assert.equal(health(root, map).status, 'ready')
  writeFileSync(join(root, 'docs/current.md'), '# Contract\n| Chat | `/api/chat` |\n')
  assert.equal(health(root, map).status, 'blocked')
  assert.equal(context(root, map, 'chat').status, 'blocked_contract_conflict')
})
