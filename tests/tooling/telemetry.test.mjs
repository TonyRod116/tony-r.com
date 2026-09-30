import { test } from 'node:test'
import assert from 'node:assert/strict'
import { classifyLink, safeRoute, recordEvent, observeDemoRequest, captureRuntimeError } from '../../src/utils/telemetry.js'

test('telemetry strips unknown fields and raw URL queries', () => {
  const calls = []
  globalThis.window = { location: { origin: 'https://tony-r.com', pathname: '/contact' }, gtag: (...args) => calls.push(args), dispatchEvent: () => {} }
  globalThis.document = { referrer: 'https://tony-r.com/projects?email=private@example.com' }
  const event = recordEvent('contact_success', { path: '/contact?email=private@example.com', email: 'private@example.com', message: 'secret', method: 'form' })
  assert.deepEqual(event.parameters, { path: '/contact', method: 'form' })
  assert.ok(!JSON.stringify(calls).includes('private'))
  assert.equal(recordEvent('unknown', { email: 'private' }), null)
  delete globalThis.window
  delete globalThis.document
})

test('diagnostic buffers are bounded and broken analytics cannot break the app', () => {
  globalThis.window = { location: { pathname: '/contact' }, gtag: () => { throw new Error('blocked') }, dispatchEvent: () => {} }
  for (let i = 0; i < 80; i++) captureRuntimeError('runtime_error')
  assert.equal(window.__MY_PAGE_DIAGNOSTICS__.length, 50)
  assert.equal(safeRoute('/unknown/private/email'), '/other')
  assert.doesNotThrow(() => recordEvent('contact_success', { method: 'form' }))
  delete globalThis.window
})

test('links are classified without retaining emails, external paths or queries', () => {
  assert.deepEqual(classifyLink('mailto:private@example.com', 'https://tony-r.com'), { name: 'contact_click', parameters: { method: 'email' } })
  assert.deepEqual(classifyLink('https://github.com/TonyRod116/repo?token=secret', 'https://tony-r.com'), { name: 'project_open', parameters: { target: 'github_repository' } })
  assert.equal(classifyLink('/assets/Tony_Rodriguez_CV_EN_Final-hash.pdf', 'https://tony-r.com').name, 'cv_open')
  assert.equal(classifyLink('/assets/CS50_Harvard_AI.pdf', 'https://tony-r.com'), null)
  assert.equal(classifyLink('javascript:alert(1)', 'https://tony-r.com'), null)
})

test('demo instrumentation preserves responses and original errors without recording content', async () => {
  globalThis.window = { location: { pathname: '/demos/lead-qualifier' }, dispatchEvent: () => {} }
  const response = { ok: false, status: 503 }
  assert.equal(await observeDemoRequest('lead_qualifier', async () => response), response)
  const original = new Error('contains private prompt')
  await assert.rejects(() => observeDemoRequest('lead_qualifier', async () => { throw original }), error => error === original)
  assert.ok(!JSON.stringify(window.__MY_PAGE_DIAGNOSTICS__).includes('private prompt'))
  assert.equal(window.__MY_PAGE_DIAGNOSTICS__.at(-1).parameters.result, 'network_error')
  delete globalThis.window
})
