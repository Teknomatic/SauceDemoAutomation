import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { defineConfig, devices } from '@playwright/test';
import { STORAGE_STATE } from './tests/support/paths';

// Load .env when present. CI provides real environment variables instead.
// process.loadEnvFile never overrides variables that are already set, so a value left in the shell
// silently wins over .env. Say so (once, not in every worker). Only names are printed, never values.
if (existsSync('.env')) {
  const fileVars = parseEnv(readFileSync('.env', 'utf8'));
  const shellOverrides = Object.keys(fileVars).filter(
    (name) => process.env[name] !== undefined && process.env[name] !== fileVars[name],
  );
  if (shellOverrides.length > 0 && process.env.TEST_WORKER_INDEX === undefined) {
    console.warn(
      `[config] These variables come from the shell and override .env: ${shellOverrides.join(', ')}.\n` +
        `[config] If that is not intended, clear them (PowerShell: Remove-Item Env:${shellOverrides[0]}).` +
        (shellOverrides.includes('BASE_URL') ? `\n[config] BASE_URL in use: ${process.env.BASE_URL}` : ''),
    );
  }
  process.loadEnvFile('.env');
}

const baseURL = process.env.BASE_URL;
if (!baseURL) {
  throw new Error('BASE_URL is not set. Copy .env.example to .env or export BASE_URL.');
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL,
    // app-map.md > Conventions > Test id attribute: this site marks elements with data-test.
    testIdAttribute: 'data-test',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
  ],
});
