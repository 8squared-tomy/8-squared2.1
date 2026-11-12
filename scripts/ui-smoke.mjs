// UI regression check for the club site.
//
// Usage:
//   node scripts/ui-smoke.mjs                      # boots the built node server locally
//   node scripts/ui-smoke.mjs https://your-app     # checks a running deployment
//
// The local mode needs `NITRO_PRESET=node-server npm run build` first and the
// hosting Supabase variables, which the deployed container provides.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire('/opt/appjet/browser/node_modules/');
const { chromium } = require('/opt/appjet/browser/node_modules/playwright');

const PORT = 3212;
const target = process.argv[2] ?? `http://127.0.0.1:${PORT}`;
const localMode = !process.argv[2];
const failures = [];
const notes = { target };

let server;
let serverLog = '';
if (localMode) {
  server = spawn('node', ['.output/server/index.mjs'], {
    env: { ...process.env, PORT: String(PORT), HOST: '0.0.0.0', NITRO_PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', (d) => (serverLog += d.toString()));
  server.stderr.on('data', (d) => (serverLog += d.toString()));
}

async function waitForServer() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(target, { redirect: 'follow' });
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not become ready at ${target}`);
}

function parseColor(value) {
  const rgb = value.match(/\d+(\.\d+)?/g);
  if (!rgb) return null;
  const [r, g, b] = rgb.map(Number);
  return { r, g, b };
}

function luminance({ r, g, b }) {
  const a = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function hexToRgb(hex) {
  const m = hex.trim().replace('#', '');
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

let browser;
try {
  if (localMode) await waitForServer();
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

  await page.goto(target, { waitUntil: 'networkidle', timeout: 45000 });
  notes.title = await page.title();

  // 1. Hydration: the theme toggle must really flip the <html> class list.
  const themeButton = page.locator('header button').first();
  const before = await page.evaluate(() => document.documentElement.className);
  await themeButton.click();
  await page.waitForTimeout(400);
  const after = await page.evaluate(() => document.documentElement.className);
  notes.themeClassBefore = before;
  notes.themeClassAfter = after;
  if (before === after) failures.push('theme toggle did not change the html class (no hydration)');

  // Force light mode for the palette and hover assertions.
  if (await page.evaluate(() => document.documentElement.classList.contains('dark'))) {
    await themeButton.click();
    await page.waitForTimeout(300);
  }
  notes.isLight = await page.evaluate(() => !document.documentElement.classList.contains('dark'));
  if (!notes.isLight) failures.push('could not reach light mode');

  // 2. Menu overlay opens (interactivity proof).
  await page.locator('header button').nth(1).click();
  const dialog = page.locator('[role="dialog"]').first();
  await dialog.waitFor({ state: 'visible', timeout: 6000 }).catch(() => {});
  notes.menuOpened = await dialog.isVisible().catch(() => false);
  if (!notes.menuOpened) failures.push('menu overlay did not open');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 3. Light-mode surfaces must be softer than pure white.
  const tokens = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return {
      app: s.getPropertyValue('--app').trim(),
      surface: s.getPropertyValue('--surface').trim(),
      gold: s.getPropertyValue('--gold').trim(),
    };
  });
  notes.tokens = tokens;
  notes.appLuminance = Number(luminance(hexToRgb(tokens.app)).toFixed(3));
  notes.surfaceLuminance = Number(luminance(hexToRgb(tokens.surface)).toFixed(3));
  if (notes.appLuminance > 0.92) failures.push(`light --app still too bright: ${tokens.app}`);
  if (notes.surfaceLuminance > 0.95) failures.push(`light --surface still too bright: ${tokens.surface}`);

  // 4. "See upcoming events" keeps a steady gold hover in light mode.
  const link = page.locator('a.btn-gold-link').first();
  await link.scrollIntoViewIfNeeded();
  const idle = await link.evaluate((el) => getComputedStyle(el).color);
  await link.hover();
  await page.waitForTimeout(400);
  const hover = await link.evaluate((el) => getComputedStyle(el).color);
  await page.waitForTimeout(1200);
  const hoverLater = await link.evaluate((el) => getComputedStyle(el).color);
  notes.linkIdleColor = idle;
  notes.linkHoverColor = hover;
  notes.linkHoverColorAfter1200ms = hoverLater;

  const goldRgb = hexToRgb(tokens.gold);
  const hoverRgb = parseColor(hover);
  const sameAsGold =
    hoverRgb &&
    Math.abs(hoverRgb.r - goldRgb.r) <= 2 &&
    Math.abs(hoverRgb.g - goldRgb.g) <= 2 &&
    Math.abs(hoverRgb.b - goldRgb.b) <= 2;
  notes.hoverMatchesGoldToken = Boolean(sameAsGold);

  if (hover === idle) failures.push(`hover did not change colour (${idle})`);
  if (hover !== hoverLater) failures.push(`hover colour not steady: ${hover} -> ${hoverLater}`);
  if (!sameAsGold) failures.push(`hover colour is not the gold token ${tokens.gold}: ${hover}`);

  // 5. The rook art exists and finishes assembling from base to crown.
  await page.evaluate(() => window.scrollTo({ top: 0 }));
  notes.rookPieces = await page.locator('.rook-build .rook-piece').count();
  if (notes.rookPieces !== 5) failures.push(`expected 5 rook segments, found ${notes.rookPieces}`);
  await page.waitForTimeout(2600);
  notes.rookClips = await page.locator('.rook-build .rook-piece').evaluateAll((els) =>
    els.map((el) => getComputedStyle(el).clipPath),
  );
  const unrevealed = notes.rookClips.filter((clip) => /inset\(\s*100%/.test(clip));
  if (unrevealed.length) failures.push(`rook segments still hidden after animation: ${unrevealed.length}`);

  notes.consoleErrors = consoleErrors.slice(0, 6);
  if (consoleErrors.length) failures.push(`console errors: ${consoleErrors.slice(0, 3).join(' | ')}`);
} catch (error) {
  failures.push(`exception: ${error.message}`);
  if (localMode) notes.serverLog = serverLog.slice(-600);
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) server.kill('SIGTERM');
}

console.log(JSON.stringify({ passed: failures.length === 0, failures, notes }, null, 2));
process.exit(failures.length === 0 ? 0 : 1);
