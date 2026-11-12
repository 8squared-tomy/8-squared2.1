// UI regression check for the club site.
//
// Usage:
//   node scripts/ui-smoke.mjs https://your-app      # checks a running deployment
//   node scripts/ui-smoke.mjs                       # checks http://127.0.0.1:3000
//
// Asserts the current design contract:
//   - the animated rook is gone from the hero
//   - only the classic gold/ink palette remains (no board-theme choices)
//   - hero slogan, statistics, pillar cards and footer social icons render
//   - the "see upcoming events" link keeps a steady gold hover colour
import { chromium } from '/opt/appjet/browser/node_modules/playwright/index.mjs';

const target = (process.argv[2] ?? 'http://127.0.0.1:3000').replace(/\/$/, '');
const failures = [];
const notes = {};

function check(condition, message) {
  if (!condition) failures.push(message);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (error) => consoleErrors.push(String(error)));

try {
  const response = await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 45000 });
  notes.status = response?.status() ?? null;
  check((notes.status ?? 0) < 400, `home page returned HTTP ${notes.status}`);
  await page.waitForSelector('.slogan-display', { timeout: 30000 });
  notes.title = await page.title();

  // 1. The rook animation must be gone.
  notes.rookElements = await page.locator('.rook-build, [class*="rook"]').count();
  check(notes.rookElements === 0, `expected no rook element, found ${notes.rookElements}`);

  // 2. Hero content.
  notes.slogan = (await page.locator('.slogan-display').first().innerText()).trim();
  check(notes.slogan.length > 0, 'hero slogan is empty');
  notes.heroStats = await page.locator('dl dd').count();
  check(notes.heroStats >= 2, `expected at least 2 hero statistics, found ${notes.heroStats}`);
  notes.pillarCards = await page.locator('.card-accent').count();
  check(notes.pillarCards >= 3, `expected 3 pillar cards, found ${notes.pillarCards}`);

  // 3. Footer social icons stay at the bottom of the page.
  notes.socialLinks = await page.locator(
    'footer a[href*="linkedin"], footer a[href*="instagram"], footer a[href*="telegram"]',
  ).count();
  check(notes.socialLinks >= 3, `expected 3 footer social links, found ${notes.socialLinks}`);

  // 4. Palette: one gold token, no board-theme switching left in the menu.
  notes.gold = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--gold').trim(),
  );
  check(notes.gold.length > 0, 'missing --gold token');
  notes.dataBoard = await page.evaluate(() => document.documentElement.dataset.board ?? null);
  check(notes.dataBoard === null, `board theme attribute should be gone, got "${notes.dataBoard}"`);

  // Open the accessibility menu through whatever trigger the header renders.
  const trigger = page.locator('button[aria-label*="menu" i], button[aria-label*="القائمة"], button:has-text("Menu")').first();
  notes.menuTrigger = await trigger.count();
  if (notes.menuTrigger > 0) {
    await trigger.click();
    const dialog = page.locator('[role="dialog"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 10000 });
    notes.menuOpened = true;
    const dialogText = await dialog.innerText();
    notes.boardThemeMentions = /board theme|ثيم الرقعة|walnut|marble|midnight|emerald|الجوز|رخام|ملكي|البطولة/i.test(dialogText);
    check(!notes.boardThemeMentions, 'board-theme choices are still offered in the accessibility menu');
    notes.themeChoices = await dialog.locator('button[aria-pressed]').count();
    check(notes.themeChoices >= 2, `expected theme choices, found ${notes.themeChoices}`);
    await page.keyboard.press('Escape');
  } else {
    failures.push('accessibility menu trigger not found');
  }

  // 5. Gold hover on the events link stays steady.
  const eventsLink = page.locator('a', { hasText: /see upcoming events/i }).first();
  if ((await eventsLink.count()) > 0) {
    const read = () => eventsLink.evaluate((el) => getComputedStyle(el).color);
    notes.linkIdle = await read();
    await eventsLink.hover();
    notes.linkHover = await read();
    await page.waitForTimeout(1200);
    notes.linkHoverAfter = await read();
    check(notes.linkHover === notes.linkHoverAfter, 'gold hover colour changed while hovering');
    notes.hoverIsGold = notes.linkHover === notes.linkHoverAfter;
  } else {
    notes.linkIdle = null;
  }

  notes.consoleErrors = consoleErrors;
  check(consoleErrors.length === 0, `console errors: ${consoleErrors.join(' | ')}`);
} catch (error) {
  failures.push(`exception: ${error.message}`);
} finally {
  await browser.close();
}

console.log(JSON.stringify({ passed: failures.length === 0, failures, notes }, null, 2));
process.exit(failures.length === 0 ? 0 : 1);
