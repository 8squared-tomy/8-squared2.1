import pw from '/opt/appjet/browser/node_modules/playwright/index.js';
import { execSync } from 'node:child_process';

const { chromium } = pw;
const URL = process.env.HERO_URL || 'https://eqf2aqob8q.dev.ap-jt.com/';
const EXE = '/opt/appjet/browser-binaries/chromium-1234/chrome-linux64/chrome';
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); console.log((cond ? 'PASS ' : 'FAIL ') + msg); };

const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const info = await page.evaluate(() => {
  const bg = document.querySelector('.hero-backdrop img');
  const headerImgs = [...document.querySelectorAll('header img')].map((i) => ({
    src: i.getAttribute('src'), nw: i.naturalWidth, nh: i.naturalHeight,
  }));
  const hero = document.querySelector('.hero-backdrop');
  return {
    bgSrc: bg?.getAttribute('src') ?? null,
    bgNw: bg?.naturalWidth ?? 0,
    bgNh: bg?.naturalHeight ?? 0,
    bgComplete: !!bg?.complete,
    bgFit: bg ? getComputedStyle(bg).objectFit : null,
    headerImgs,
    heroHeight: hero ? Math.round(hero.getBoundingClientRect().height) : 0,
    hasCrownSvg: !!document.querySelector('header svg[viewBox="0 0 48 40"]'),
  };
});
console.log(JSON.stringify(info, null, 2));

ok(!!info.bgSrc && info.bgSrc.includes('hero-chess'), 'hero uses the ready-made photographic backdrop');
ok(info.bgNw === 2560 && info.bgNh === 1440 && info.bgComplete, 'backdrop image decoded at 2560x1440');
ok(info.bgFit === 'cover', 'backdrop fills the hero (object-fit: cover)');
ok(info.headerImgs.length > 0 && info.headerImgs.every((i) => i.nw > 0), 'header shows the club crest image');
ok(info.headerImgs.some((i) => (i.src || '').includes('club-logo')), 'crest is the original club logo file');
ok(!info.hasCrownSvg, 'no hand-drawn crown placeholder in the header');
ok(info.heroHeight > 500, 'hero fills the viewport height (' + info.heroHeight + 'px)');

await page.screenshot({ path: '/tmp/hero-live.png' });
const [sd, mean] = execSync(
  "convert /tmp/hero-live.png -crop 620x700+780+120 +repage -format '%[fx:standard_deviation] %[fx:mean]' info:"
).toString().trim().split(' ').map(Number);
console.log('rendered right region: sd=' + sd.toFixed(4) + ' mean=' + mean.toFixed(4));
ok(sd > 0.03, 'rendered backdrop shows photographic depth, not a flat fill');

ok(errors.length === 0, 'no console/page errors' + (errors.length ? ': ' + errors.join(' | ') : ''));

await browser.close();
if (fails.length) { console.error('FAILED: ' + fails.join('; ')); process.exit(1); }
console.log('ALL CHECKS PASSED');
