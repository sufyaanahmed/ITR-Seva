// Visual QA helper: node scripts/shot.mjs <url> <outfile> [width] [height] [flags]
// flags: zoom200, reducedmotion, offline, dark
import { chromium } from '@playwright/test';

const [, , url, out, w = '1440', h = '900', ...flags] = process.argv;
const reduced = flags.includes('reducedmotion');
const zoom200 = flags.includes('zoom200');

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: +w, height: +h },
  deviceScaleFactor: 2,
  reducedMotion: reduced ? 'reduce' : 'no-preference',
});
const page = await context.newPage();
const errs = [];
page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));

// 200% zoom is emulated by halving the viewport CSS pixels (same reflow result).
if (zoom200) await page.setViewportSize({ width: Math.round(+w / 2), height: Math.round(+h / 2) });
if (flags.includes('offline')) await context.setOffline(true);

await page.goto(url, { waitUntil: 'networkidle' }).catch((e) => errs.push('NAV: ' + e.message));
// Allow route chunks and web fonts to settle before capturing the full page.
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: true });

const metrics = await page.evaluate(() => ({
  overflow:
    document.documentElement.scrollWidth > document.documentElement.clientWidth
      ? `${document.documentElement.scrollWidth}px content in ${document.documentElement.clientWidth}px viewport`
      : 'none',
  height: document.documentElement.scrollHeight,
  title: document.title,
  h1: [...document.querySelectorAll('h1')].map((n) => n.textContent.trim()),
}));

console.log(JSON.stringify({ url, out, ...metrics, errs }, null, 1));
await browser.close();
