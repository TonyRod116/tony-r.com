import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { scanDesign, compareBaseline } from '../../scripts/check-design.mjs'

test('legacy allowance cannot hide a new occurrence or a new file', () => {
  const root = mkdtempSync(join(tmpdir(), 'my-page-design-'))
  mkdirSync(join(root, 'src'))
  writeFileSync(join(root, 'src/old.jsx'), 'text-[17px] bg-[#123456]')
  const baseline = scanDesign(root)
  assert.deepEqual(compareBaseline(baseline, baseline), [])
  writeFileSync(join(root, 'src/old.jsx'), 'text-[17px] bg-[#123456] text-[17px]')
  writeFileSync(join(root, 'src/new.jsx'), 'bg-[#123456]')
  assert.equal(compareBaseline(scanDesign(root), baseline).length, 2)
})

test('reducing debt is accepted without renewing a baseline', () => {
  assert.deepEqual(compareBaseline({ old: 1 }, { old: 2 }), [])
  assert.equal(compareBaseline({ fresh: 1 }, { old: 2 }).length, 1)
})
