import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, symlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { validateBuildOutput } from '../../scripts/build.mjs'

test('build destinations cannot erase source, instructions or unrelated work', () => {
  const root = mkdtempSync(join(tmpdir(), 'my-page-build-'))
  assert.equal(validateBuildOutput('dist', root), join(root, 'dist'))
  assert.equal(validateBuildOutput('.artifacts/build', root), join(root, '.artifacts/build'))
  for (const path of ['src', 'public', '.agents', '.git', '../outside', '/etc']) assert.throws(() => validateBuildOutput(path, root), /Unsafe/)
  mkdirSync(join(root, 'src'))
  symlinkSync(join(root, 'src'), join(root, '.artifacts'))
  assert.throws(() => validateBuildOutput('.artifacts/build', root), /Unsafe/)
})
