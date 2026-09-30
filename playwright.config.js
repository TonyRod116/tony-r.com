import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: '**/visual/**',
  timeout: 30000,
  retries: 0,
  workers: 2,
  reporter: [['list'], ['html', { outputFolder: '.artifacts/playwright-report', open: 'never' }]],
  outputDir: '.artifacts/test-results',
  use: { baseURL: 'http://127.0.0.1:4179', screenshot: 'only-on-failure', trace: 'retain-on-failure', reducedMotion: 'reduce', serviceWorkers: 'block' },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4179 --strictPort --outDir .artifacts/build',
    url: 'http://127.0.0.1:4179',
    reuseExistingServer: false,
    timeout: 30000,
  },
})
