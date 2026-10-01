import test from 'node:test'
import assert from 'node:assert/strict'
import { spriteFusionRouteBase, publicAssetUrl } from '../../src/utils/siteRouting.js'
import { destroyLabUrl } from '../../src/data/labEasterEgg.js'

test('the official capture prefix preserves deep React routes including Apache trailing slashes', () => {
  for (const path of ['/ai/', '/ai/neural-network/', '/ai/tetris']) {
    const base = spriteFusionRouteBase({ origin: 'https://destroy.spritefusion.com', pathname: `/p/https/tony-r.com${path}` })
    assert.equal(base, '/p/https/tony-r.com')
    assert.equal(`/p/https/tony-r.com${path}`.slice(base.length), path)
  }
})

test('normal hosting, localhost and lookalike origins never acquire the viewer prefix', () => {
  for (const origin of ['https://tony-r.com', 'http://127.0.0.1:4179', 'https://destroy.spritefusion.com.evil.test', 'http://destroy.spritefusion.com']) {
    assert.equal(spriteFusionRouteBase({ origin, pathname: '/p/https/tony-r.com/ai/' }), undefined)
  }
  assert.equal(spriteFusionRouteBase({ origin: 'https://destroy.spritefusion.com', pathname: '/p/https/tony-r.com.evil.test/ai' }), undefined)
  assert.equal(spriteFusionRouteBase({ origin: 'https://destroy.spritefusion.com', pathname: '/ai' }), undefined)
})

test('play links contain only canonical public lab routes without query, fragment or preview origin', () => {
  for (const path of ['/ai', '/ai/', '/ai/neural-network/', '/ai/tetris']) {
    const url = new URL(destroyLabUrl(path))
    assert.equal(url.origin, 'https://destroy.spritefusion.com')
    assert.deepEqual([...url.searchParams.keys()], ['url'])
    assert.equal(url.searchParams.get('url'), `https://tony-r.com${path.replace(/\/+$/, '')}`)
    assert.equal(url.hash, '')
  }
  for (const path of ['/', '/contact', '/ai/private', '/ai?secret=value', '/ai#draft', '//evil.test/ai', '/ai/../contact']) assert.equal(destroyLabUrl(path), null)
})

test('public model assets follow only the recognized viewer base and retain normal URLs elsewhere', () => {
  const path = '/models/mnist/014_dataset-1x.json'
  assert.equal(publicAssetUrl(path), path)
  assert.equal(publicAssetUrl(path, { origin: 'https://tony-r.com', pathname: '/ai/neural-network/' }), path)
  assert.equal(publicAssetUrl(path, { origin: 'https://destroy.spritefusion.com', pathname: '/p/https/tony-r.com/ai/neural-network/' }), `/p/https/tony-r.com${path}`)
  assert.equal(publicAssetUrl(path, { origin: 'https://destroy.spritefusion.com.evil.test', pathname: '/p/https/tony-r.com/ai' }), path)
})
