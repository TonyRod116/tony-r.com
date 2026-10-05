import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolvePageMeta, demoMeta, experimentMeta } from '../../src/data/pageMeta.js'
import { solutionPages } from '../../src/data/siteContent.js'
import { experiments } from '../../src/data/aiExperiments.js'

const languages = ['es', 'en', 'ca']
const staticRoutes = ['/', '/about', '/projects', '/resume', '/contact', '/demos', '/ai']
const allRoutes = [...staticRoutes, ...solutionPages.map(item => `/demos/${item.id}`), ...experiments.map(item => `/ai/${item.id}`)]

test('every public route has its own bounded title and description in every language', () => {
  for (const language of languages) {
    const titles = new Set()
    for (const route of allRoutes) {
      const meta = resolvePageMeta(route, language)
      assert.ok(meta.title.length >= 10 && meta.title.length <= 70, `${language} ${route} title length: ${meta.title}`)
      assert.ok(meta.description.length >= 40 && meta.description.length <= 175, `${language} ${route} description length: ${meta.description}`)
      assert.equal(meta.robots, 'index, follow')
      assert.equal(meta.canonical, route === '/' ? 'https://tony-r.com/' : `https://tony-r.com${route}`)
      assert.ok(!titles.has(meta.title), `${language} duplicated title: ${meta.title}`)
      titles.add(meta.title)
    }
  }
})

test('every route declared in App.jsx has metadata, otherwise a new page would be titled "not found" and marked noindex', () => {
  const source = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8')
  const paths = [...source.matchAll(/<Route\s+path="([^"]+)"/g)].map(match => match[1]).filter(path => path !== '*')
  assert.ok(paths.length >= 16, `expected the 16 known routes, found ${paths.length}`)
  for (const path of paths) for (const language of languages) {
    assert.equal(resolvePageMeta(path, language).robots, 'index, follow', `route ${path} (${language}) needs an entry in src/data/pageMeta.js`)
  }
})

test('demo and experiment titles stay aligned with the page content', () => {
  const sentence = text => text.replace(/\.$/, '')
  for (const item of solutionPages) for (const language of languages) {
    assert.equal(demoMeta[item.id][language][0], sentence(item.title[language]), `demo ${item.id} ${language}`)
    assert.equal(demoMeta[item.id][language][1], item.intro[language], `demo intro ${item.id} ${language}`)
  }
  for (const item of experiments) for (const language of languages) {
    assert.equal(experimentMeta[item.id][language][0], item.title[language], `experiment ${item.id} ${language}`)
    assert.equal(experimentMeta[item.id][language][1], item.description[language], `experiment description ${item.id} ${language}`)
  }
  assert.deepEqual(Object.keys(demoMeta).sort(), solutionPages.map(item => item.id).sort())
  assert.deepEqual(Object.keys(experimentMeta).sort(), experiments.map(item => item.id).sort())
})

test('unknown addresses are not indexed, carry no canonical and trailing slashes do not create duplicates', () => {
  for (const language of languages) {
    const missing = resolvePageMeta('/does-not-exist', language)
    assert.equal(missing.robots, 'noindex, follow')
    assert.equal(missing.canonical, null)
    assert.equal(resolvePageMeta('/ai/unknown', language).robots, 'noindex, follow')
    assert.equal(resolvePageMeta('/projects/', language).canonical, 'https://tony-r.com/projects')
    assert.deepEqual(resolvePageMeta('/projects/', language), resolvePageMeta('/projects', language))
  }
  assert.equal(resolvePageMeta('/about', 'xx').title, resolvePageMeta('/about', 'es').title)
})

test('inherited Object property names are just unknown addresses and can never throw', () => {
  for (const key of ['constructor', '__proto__', 'valueOf', 'toString', 'hasOwnProperty', 'isPrototypeOf']) {
    for (const route of [`/ai/${key}`, `/demos/${key}`, `/${key}`]) {
      for (const language of [...languages, key]) {
        const meta = resolvePageMeta(route, language)
        assert.equal(meta.robots, 'noindex, follow', `${route} ${language}`)
        assert.equal(meta.canonical, null)
      }
    }
  }
  assert.equal(resolvePageMeta('/about', 'constructor').title, resolvePageMeta('/about', 'es').title)
  assert.doesNotThrow(() => resolvePageMeta(undefined, 'es'))
  assert.doesNotThrow(() => resolvePageMeta('//', 'es'))
})

test('the router ignores case, so the metadata must too and point to the lowercase address', () => {
  for (const language of languages) {
    assert.deepEqual(resolvePageMeta('/Projects', language), resolvePageMeta('/projects', language))
    assert.deepEqual(resolvePageMeta('/AI/Nim', language), resolvePageMeta('/ai/nim', language))
    assert.deepEqual(resolvePageMeta('/Demos/Lead-Qualifier/', language), resolvePageMeta('/demos/lead-qualifier', language))
  }
  assert.equal(resolvePageMeta('/AI/Nim', 'es').canonical, 'https://tony-r.com/ai/nim')
})
