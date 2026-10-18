import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
 testDir: './tests',
 fullyParallel: true,
 workers: 2,
 reporter: 'list',
 use: {
  baseURL: 'http://127.0.0.1:5173',
  trace: 'retain-on-failure',
  launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
 },
 projects: [
  { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  { name: 'touch', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
 ],
 webServer: {
  command: 'npm run dev -- --port 5173 --strictPort',
  url: 'http://127.0.0.1:5173',
  reuseExistingServer: !process.env.CI,
 },
});
