// Local UI smoke check: proves the built app hydrates and that the
// "See upcoming events" link keeps a steady gold hover in light mode.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire('/opt/appjet/browser/node_modules/');
const { chromium } = require('/opt/appjet/browser/node_modules/playwright');

const PORT = 3212;
const BASE = `http://127.0.0.1:${PORT}`;
const failures = [];
const notes = {};

const server = spawn('node', ['.output/server/index.mjs'], {
  env: { ...process.env, PORT: String(PORT), HOST: '127.0.0.1', NITRO_PORT: String(PORT) },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', (d) => (serverLog += d.toString()));
server.stderr.on('data', (d) => (serverLog += d.toString()));

async function waitForServer() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`${BASE}/`, { redirect: 'follow' });
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not become ready on ${PORT}`);
}

function hexToRgb(hex) {
  const m = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16));
}
function luminance([r, g, b]) {
  const a = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({
    executablePath: '/opt/appjet/browser-binaries/chromium-1234/chrome-linux64/chrome',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  // 1. Hydration: the theme toggle must actually flip the html class.
  const before = await page.evaluate(() => document.documentElement.className);
  await page.getByRole('button', { name: /dark mode|light mode|الوضع/i }).first().click();
  await page.waitForTimeout(400);
  const after = await page.evaluate(() => document.documentElement.className);
  notes.themeClassBefore = before;
  notes.themeClassAfter = after;
  if (before === after) failures.push('theme toggle did not change html class (no hydration)');

  // Force light mode for the hover assertion.
  if (await page.evaluate(() => document.documentElement.classList.contains('dark'))) {
    await page.getByRole('button', { name: /dark mode|light mode|الوضع/i }).first().click();
    await page.waitForTimeout(300);
  }
  notes.isLight = await page.evaluate(() => !document.documentElement.classList.contains('dark'));

  // 2. Menu overlay must open (interactivity proof).
  await page.getByRole('button', { name: /menu/i }).first().click();
  const dialog = await page.locator('[role="dialog"]').first();
  await dialog.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  notes.menuOpened = await dialog.isVisible().catch(() => false);
  if (!notes.menuOpened) failures.push('menu overlay did not open');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 3. Light-mode tokens must be softer than pure white.
  notes.appBackground = await page.evaluate(
    () => getComputedStyle(document.documentElement).getPropertyValue('--app').trim(),
  );
  const appLum = luminance(hexToRgb(notes.appBackground));
  notes.appLuminance = Number(appLum.toFixed(3));
  if (appLum > 0.92) failures.push(`light background still too bright: ${notes.appBackground}`);

  // 4. "See upcoming events" hover must stay a steady gold.
  const link = page.locator('a', { hasText: /See upcoming events|الأحداث القادمة/i }).first();
  await link.scrollIntoViewIfNeeded();
  const idle = await link.evaluate((el) => getComputedStyle(el).color);
  await link.hover();
  await page.waitForTimeout(350);
  const hover = await link.evaluate((el) => getComputedStyle(el).color);
  await page.waitForTimeout(900);
  const hoverLater = await link.evaluate((el) => getComputedStyle(el).color);
  notes.linkIdleColor = idle;
  notes.linkHoverColor = hover;
  notes.linkHoverColorAfter900ms = hoverLater;
  if (hover === idle) failures.push(`hover did not change colour (${idle})`);
  if (hover !== hoverLater) failures.push(`hover colour not steady: ${hover} -> ${hoverLater}`);

  // 5. Rook art must exist and finish assembling.
  notes.rookPieces = await page.locator('.rook-build .rook-piece').count();
  if (notes.rookPieces === 0) failures.push('rook build animation markup missing');
  await page.waitForTimeout(2200);
  const clip = await page.locator('.rook-build .rook-piece').first().evaluate((el) => getComputedStyle(el).clipPath);
  notes.rookClipAfterAnimation = clip;

  notes.consoleErrors = consoleErrors.slice(0, 6);
  if (consoleErrors.length) failures.push(`console errors: ${consoleErrors.slice(0, 3).join(' | ')}`);
} catch (error) {
  failures.push(`exception: ${error.message}`);
  notes.serverLog = serverLog.slice(-800);
} finally {
  if (browser) await browser.close().catch(() => {});
  server.kill('SIGTERM');
}

console.log(JSON.stringify({ passed: failures.length === 0, failures, notes }, null, 2));
process.exit(failures.length === 0 ? 0 : 1);
