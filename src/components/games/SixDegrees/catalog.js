const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8', { fatal: true })
export const normalizeName = value => value.normalize('NFKD').toLowerCase().replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
const wordsOf = value => normalizeName(value).split(' ').filter(Boolean)
// Yield to incoming cancellation messages without nested timer clamping.
const wait = () => new Promise(resolve => {
  const channel = new MessageChannel()
  channel.port1.onmessage = () => { channel.port1.close(); channel.port2.close(); resolve() }
  channel.port2.postMessage(null)
})

export function editDistance(left, right, limit = 2) {
  const a = Array.from(left), b = Array.from(right)
  if (Math.abs(a.length - b.length) > limit) return limit + 1
  let before = null, previous = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const row = [i]
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(row[j - 1] + 1, previous[j] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      if (before && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) row[j] = Math.min(row[j], before[j - 2] + 1)
    }
    if (Math.min(...row) > limit) return limit + 1
    before = previous; previous = row
  }
  return previous[b.length]
}

function maskOf(word) { let mask = 0; for (const char of word) mask |= 1 << (char.codePointAt(0) & 31); return mask >>> 0 }
function bitCount(value) { value -= (value >>> 1) & 0x55555555; value = (value & 0x33333333) + ((value >>> 2) & 0x33333333); return (((value + (value >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24 }

export class ActorCatalog {
  constructor(buffer) {
    if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 176 || buffer.byteLength > 180_000_000) throw new Error('Invalid catalog size')
    const header = new DataView(buffer)
    if (decoder.decode(new Uint8Array(buffer, 0, 8)) !== 'MPDEG001') throw new Error('Invalid catalog version')
    this.peopleCount = header.getUint32(8, true); this.movieCount = header.getUint32(12, true)
    this.creditCount = header.getUint32(16, true); this.wordCount = header.getUint32(20, true)
    const postings = header.getUint32(24, true)
    if (header.getUint32(28, true) !== 18 || this.peopleCount > 2_000_000 || this.movieCount > 1_000_000 || this.creditCount > 5_000_000 || this.wordCount > 3_000_000 || postings > 10_000_000) throw new Error('Invalid catalog dimensions')
    const lengths = [this.peopleCount, this.peopleCount, this.peopleCount + 1, null, this.movieCount, this.movieCount, this.movieCount + 1, null, this.peopleCount + 1, this.creditCount, this.movieCount + 1, this.creditCount, this.wordCount + 1, null, this.wordCount, this.wordCount, this.wordCount + 1, postings]
    const types = [Uint32Array, Uint16Array, Uint32Array, Uint8Array, Uint32Array, Uint16Array, Uint32Array, Uint8Array, Uint32Array, Uint32Array, Uint32Array, Uint32Array, Uint32Array, Uint8Array, Uint32Array, Uint16Array, Uint32Array, Uint32Array]
    const fields = ['ids', 'births', 'nameOffsets', 'nameBytes', 'movieIds', 'years', 'titleOffsets', 'titleBytes', 'personMovieOffsets', 'personMovies', 'moviePersonOffsets', 'moviePeople', 'wordOffsets', 'wordBytes', 'wordMasks', 'wordLengths', 'wordPeopleOffsets', 'wordPeople']
    let end = 176
    fields.forEach((field, i) => {
      const offset = header.getUint32(32 + i * 8, true), bytes = header.getUint32(36 + i * 8, true), Type = types[i]
      if (offset < end || offset % 4 || offset + bytes > buffer.byteLength || bytes % Type.BYTES_PER_ELEMENT || (lengths[i] !== null && bytes !== lengths[i] * Type.BYTES_PER_ELEMENT)) throw new Error('Invalid catalog section')
      this[field] = new Type(buffer, offset, bytes / Type.BYTES_PER_ELEMENT); end = offset + bytes
    })
    for (const field of ['ids', 'movieIds', 'nameOffsets', 'titleOffsets', 'personMovieOffsets', 'moviePersonOffsets', 'wordOffsets', 'wordPeopleOffsets']) {
      const values = this[field]; let value = 0
      for (let i = 0; i < values.length; i++) { value = (value + values[i]) >>> 0; values[i] = value }
    }
    for (const [offsets, size] of [[this.nameOffsets, this.nameBytes.length], [this.titleOffsets, this.titleBytes.length], [this.wordOffsets, this.wordBytes.length], [this.personMovieOffsets, this.creditCount], [this.moviePersonOffsets, this.creditCount], [this.wordPeopleOffsets, postings]]) {
      if (offsets[0] !== 0 || offsets.at(-1) !== size) throw new Error('Invalid offsets')
      for (let i = 1; i < offsets.length; i++) if (offsets[i] < offsets[i - 1] || offsets[i] > size) throw new Error('Invalid offsets')
    }
    for (const [offsets, values] of [[this.personMovieOffsets, this.personMovies], [this.moviePersonOffsets, this.moviePeople], [this.wordPeopleOffsets, this.wordPeople]]) {
      for (let row = 0; row < offsets.length - 1; row++) {
        let value = 0
        for (let i = offsets[row]; i < offsets[row + 1]; i++) { value += values[i]; values[i] = value }
      }
    }
    for (const [offsets, bytes] of [[this.nameOffsets, this.nameBytes], [this.titleOffsets, this.titleBytes], [this.wordOffsets, this.wordBytes]]) if (offsets[0] !== 0 || offsets.at(-1) !== bytes.length) throw new Error('Invalid string offsets')
    if (this.personMovieOffsets.at(-1) !== this.creditCount || this.moviePersonOffsets.at(-1) !== this.creditCount || this.wordPeopleOffsets.at(-1) !== postings) throw new Error('Invalid relation offsets')
    this.binaryBytes = buffer.byteLength
  }
  text(bytes, offsets, i) { return decoder.decode(bytes.subarray(offsets[i], offsets[i + 1])) }
  person(i) {
    if (!Number.isInteger(i) || i < 0 || i >= this.peopleCount) throw new Error('Unknown person')
    return { index: i, id: this.ids[i], name: this.text(this.nameBytes, this.nameOffsets, i), birth: this.births[i] || null, credits: this.personMovieOffsets[i + 1] - this.personMovieOffsets[i] }
  }
  movie(i) { return { index: i, id: this.movieIds[i], title: this.text(this.titleBytes, this.titleOffsets, i), year: this.years[i] || null } }
  word(i) { return this.text(this.wordBytes, this.wordOffsets, i) }
  compareWord(i, bytes) {
    const start = this.wordOffsets[i], length = this.wordOffsets[i + 1] - start
    for (let j = 0; j < Math.min(length, bytes.length); j++) if (this.wordBytes[start + j] !== bytes[j]) return this.wordBytes[start + j] - bytes[j]
    return length - bytes.length
  }
  wordStart(word) {
    const bytes = encoder.encode(word); let low = 0, high = this.wordCount
    while (low < high) { const middle = (low + high) >>> 1; if (this.compareWord(middle, bytes) < 0) low = middle + 1; else high = middle }
    return low
  }
  prefixWords(token, limit = 256) {
    const result = [], bytes = encoder.encode(token)
    for (let i = this.wordStart(token); i < this.wordCount && result.length < limit; i++) {
      const start = this.wordOffsets[i]
      if (this.wordOffsets[i + 1] - start < bytes.length || !bytes.every((value, j) => this.wordBytes[start + j] === value)) break
      result.push({ word: i, distance: this.wordOffsets[i + 1] - start === bytes.length ? 0 : 0.35 })
    }
    return result
  }
  async matchingWords(token, cancelled, fuzzy = false) {
    const prefix = this.prefixWords(token)
    if (prefix.length && !fuzzy) return prefix
    const result = [...prefix], mask = maskOf(token), size = Array.from(token).length, limit = size <= 3 ? 1 : 2
    for (let i = 0; i < this.wordCount; i++) {
      if (Math.abs(this.wordLengths[i] - size) <= limit && bitCount(this.wordMasks[i] ^ mask) <= 2 * limit) {
        const distance = editDistance(token, this.word(i), limit)
        if (distance <= limit) result.push({ word: i, distance })
      }
      if (i % 8192 === 0) { if (cancelled()) return []; await wait() }
    }
    return result.sort((a, b) => a.distance - b.distance || a.word - b.word).slice(0, 40)
  }
  async search(query, { limit = 8, cancelled = () => false, fuzzy = false, split = false } = {}) {
    let tokens = wordsOf(query).slice(0, 8)
    if (split) {
      const token = tokens.at(-1)
      for (let i = 2; i < token.length - 1; i++) {
        const left = token.slice(0, i), right = token.slice(i)
        if (this.prefixWords(left).some(word => word.distance === 0) && this.prefixWords(right).some(word => word.distance === 0)) { tokens.splice(tokens.length - 1, 1, left, right); break }
      }
    }
    if (!tokens.length || query.length > 100) return []
    const groups = []
    for (const token of tokens) {
      const candidates = await this.matchingWords(token, cancelled, fuzzy)
      if (cancelled()) return []
      const people = new Map()
      for (const candidate of candidates) {
        const start = this.wordPeopleOffsets[candidate.word], end = Math.min(this.wordPeopleOffsets[candidate.word + 1], start + 20_000)
        for (let j = start; j < end; j++) {
          const index = this.wordPeople[j], previous = people.get(index)
          if (previous === undefined || previous > candidate.distance) people.set(index, candidate.distance)
        }
      }
      if (!people.size) return !split ? this.search(query, { limit, cancelled, fuzzy, split: true }) : []
      groups.push(people)
    }
    groups.sort((a, b) => a.size - b.size)
    const hits = []
    for (const [index, distance] of groups[0]) {
      if (!groups.every(group => group.has(index))) continue
      const person = this.person(index), normalized = normalizeName(person.name), exact = normalized === normalizeName(query)
      const error = distance + groups.slice(1).reduce((sum, group) => sum + group.get(index), 0) + Math.max(0, wordsOf(person.name).length - tokens.length) * 0.4
      hits.push({ ...person, exact, approximate: error >= 1, error, prefix: normalized.startsWith(normalizeName(query)) })
    }
    if (!hits.length && !fuzzy) return this.search(query, { limit, cancelled, fuzzy: true, split })
    if (!hits.length && !split) return this.search(query, { limit, cancelled, fuzzy, split: true })
    return hits.sort((a, b) => Number(b.exact) - Number(a.exact) || a.error - b.error || Number(b.prefix) - Number(a.prefix) || b.credits - a.credits || a.index - b.index).slice(0, limit)
  }
  hasCredit(person, movie) {
    let low = this.personMovieOffsets[person], high = this.personMovieOffsets[person + 1]
    while (low < high) { const middle = (low + high) >>> 1; if (this.personMovies[middle] < movie) low = middle + 1; else high = middle }
    return low < this.personMovieOffsets[person + 1] && this.personMovies[low] === movie
  }
  async shortestPath(source, target, cancelled = () => false) {
    this.person(source); this.person(target)
    if (source === target) return { steps: [], visited: 1 }
    const parents = new Int32Array(this.peopleCount).fill(-1), via = new Uint32Array(this.peopleCount), seenMovies = new Uint8Array(this.movieCount), queue = new Uint32Array(this.peopleCount)
    parents[source] = source; queue[0] = source; let head = 0, tail = 1
    while (head < tail) {
      const person = queue[head++]
      for (let j = this.personMovieOffsets[person]; j < this.personMovieOffsets[person + 1]; j++) {
        const movie = this.personMovies[j]
        if (seenMovies[movie]) continue
        seenMovies[movie] = 1
        for (let k = this.moviePersonOffsets[movie]; k < this.moviePersonOffsets[movie + 1]; k++) {
          const next = this.moviePeople[k]
          if (parents[next] !== -1) continue
          parents[next] = person; via[next] = movie; queue[tail++] = next
          if (next === target) {
            const steps = []; let current = target
            while (current !== source) { steps.push({ from: this.person(parents[current]), to: this.person(current), movie: this.movie(via[current]) }); current = parents[current] }
            return { steps: steps.reverse(), visited: tail }
          }
        }
      }
      if (head % 1024 === 0) { if (cancelled()) return { cancelled: true }; await wait() }
    }
    return { steps: null, visited: tail }
  }
}
