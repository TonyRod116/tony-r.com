import { defineConfig } from '@playwright/test'
import base from './playwright.config.js'

export default defineConfig({
  ...base,
  testDir: './tests/e2e/visual',
  testIgnore: [],
  workers: 1,
  reporter: [['list']],
  outputDir: '.artifacts/visual-results',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.005 } },
})
