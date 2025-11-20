import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';
import type { ConfigOptions } from '@nuxt/test-utils/playwright';
import { isCI, isWindows } from 'std-env';

const devicesToTest = [
  // 'Desktop Chrome',
  // 'Desktop Firefox',
  // 'Desktop Safari',
  // 'Pixel 5',
  // 'iPhone 12',
  // { ...devices['Desktop Edge'], channel: 'msedge' },
  // { ...devices['Desktop Chrome'], channel: 'chrome' },
  { name: 'setup', testMatch: /.*\.setup\.ts/ },

  // Chromium project using auth state
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/user.json',
    },
    launchOptions: {
      args: ['--disable-blink-features=AutomationControlled'],
    },
    // dependencies: ['setup'],
  },
];

export default defineConfig<ConfigOptions>({
  testDir: './app/test',
  fullyParallel: true,
  forbidOnly: !!isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  timeout: isWindows ? 60000 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    nuxt: {
      rootDir: fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  projects: devicesToTest.map((p) =>
    typeof p === 'string' ? { name: p, use: devices[p] } : p
  ),
});
