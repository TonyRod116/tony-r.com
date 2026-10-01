import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { createHash } from 'node:crypto'
import { ActorCatalog, editDistance } from '../../src/components/games/SixDegrees/catalog.js'

const manifest = JSON.parse(readFileSync('public/demos-data/degrees/manifest.json', 'utf8'))
const packed = readFileSync(`public${manifest.asset}`), bytes = gunzipSync(packed)
const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.binary_sha256)
const catalog = new ActorCatalog(buffer)

test('the packed catalogue preserves every historical artist and real relational integrity', () => {
  assert.equal(catalog.peopleCount, 1044499)
  assert.equal(catalog.movieCount, 344276)
  assert.equal(catalog.creditCount, manifest.credits)
  const historical = JSON.parse(readFileSync('src/assets/large/sample-data.json', 'utf8'))
  const ids = new Set(catalog.ids)
  for (const id of Object.keys(historical.people)) assert.ok(ids.has(Number(id)), `Missing historical person ${id}`)
  for (let person = 0; person < catalog.peopleCount; person++) {
    for (let j = catalog.personMovieOffsets[person]; j < catalog.personMovieOffsets[person + 1]; j++) {
      const movie = catalog.personMovies[j]; assert.ok(movie < catalog.movieCount)
      assert.ok(catalog.moviePeople.subarray(catalog.moviePersonOffsets[movie], catalog.moviePersonOffsets[movie + 1]).includes(person))
      assert.ok(catalog.years[movie] <= 2026, 'Future planned credits cannot create current connections')
    }
  }
})

test('full names, accents, missing spaces and common typos resolve to the actual artist', async () => {
  for (const [query, id] of [['Tom Hanks', 158], ['Leonrado DiCaprio', 138], ['Scarlet Johanson', 424060], ['Penelope Cruz', 4851], ['Arnold Shwarzenegger', 216], ['LeonardoDicaprio', 138], ['Robert DeNiro', 134]]) {
    const matches = await catalog.search(query)
    assert.equal(matches[0]?.id, id, query)
  }
  assert.equal(editDistance('tom', 'tmo', 1), 1)
  assert.deepEqual(await catalog.search('zzzzunfindableqa'), [])
})

test('duplicate names retain distinct identities and cancelled lookup cannot publish stale matches', async () => {
  const matches = (await catalog.search('Kevin Bacon')).filter(person => person.exact)
  assert.equal(matches.length, 2)
  assert.notEqual(matches[0].id, matches[1].id)
  assert.equal(matches[0].birth, 1958)
  assert.deepEqual(await catalog.search('Leonrado DiCaprio', { cancelled: () => true }), [])
})

test('shortest paths use shared actual film credits and handle a person connecting to themselves', async () => {
  const person = id => catalog.person(catalog.ids.indexOf(id))
  for (const [from, to, title] of [[158, 102, 'Apollo 13'], [138, 3053338, 'The Wolf of Wall Street']]) {
    const result = await catalog.shortestPath(person(from).index, person(to).index)
    assert.equal(result.steps.length, 1)
    assert.equal(result.steps[0].movie.title, title)
    for (const step of result.steps) {
      assert.ok(catalog.hasCredit(step.from.index, step.movie.index))
      assert.ok(catalog.hasCredit(step.to.index, step.movie.index))
    }
  }
  assert.deepEqual((await catalog.shortestPath(0, 0)).steps, [])
})

test('corrupt versions, dimensions and offsets are rejected before traversing the graph', () => {
  assert.throws(() => new ActorCatalog(new ArrayBuffer(20)), /size/)
  const header = buffer.slice(0, 200); new Uint8Array(header)[0] = 0
  assert.throws(() => new ActorCatalog(header), /version/)
  const bad = buffer.slice(0); new DataView(bad).setUint32(8, 0xffffffff, true)
  assert.throws(() => new ActorCatalog(bad), /dimensions/)
})
