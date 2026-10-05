import test from 'node:test'
import assert from 'node:assert/strict'
import { formatPeriod } from '../../src/utils/formatPeriod.js'
import { profile } from '../../src/data/profile.js'

test('year ranges use one spaced en dash and the localized "now" label', () => {
  assert.equal(formatPeriod('2019-2025', 'es', 'Ahora'), '2019 – 2025')
  assert.equal(formatPeriod('2003-2019', 'en', 'Now'), '2003 – 2019')
  assert.equal(formatPeriod('2026 – Present', 'es', 'Ahora'), '2026 – Ahora')
  assert.equal(formatPeriod('2026 – Present', 'ca', 'Ara'), '2026 – Ara')
  assert.equal(formatPeriod('2026', 'es', 'Ahora'), '2026')
})

test('month ranges are localized instead of showing English month names', () => {
  assert.equal(formatPeriod('Jun 2025 – Sep 2025', 'es', 'Ahora'), 'jun – sept 2025')
  assert.equal(formatPeriod('Jun 2025 – Sep 2025', 'ca', 'Ara'), 'juny – set 2025')
  assert.equal(formatPeriod('Jun 2025 – Sep 2025', 'en', 'Now'), 'Jun – Sept 2025')
  assert.equal(formatPeriod('Nov 2024 – Feb 2025', 'es', 'Ahora'), 'nov 2024 – feb 2025')
  assert.equal(formatPeriod('Jul 2025 – Present', 'es', 'Ahora'), 'jul 2025 – Ahora')
})

test('every period in the profile is recognised and unknown text is left untouched', () => {
  const recognised = value => !/Present|[A-Z][a-z]{2} \d{4}|\d{4}-\d{4}/.test(value)
  for (const item of [...profile.experience, ...profile.education]) {
    for (const language of ['es', 'en', 'ca']) assert.ok(recognised(formatPeriod(item.period, language, 'Now')), `${item.id} ${language}`)
  }
  assert.equal(formatPeriod('Spring term', 'es', 'Ahora'), 'Spring term')
})
