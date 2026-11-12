import { chromium } from 'playwright';
const CHROME = '/Users/mac/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const sims = process.argv.slice(2);
const b = await chromium.launch({ executablePath: CHROME });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
for (const s of sims) {
  await p.goto(`http://localhost:5377/aula-carboidratos-esporte/?sim=${s}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const n = await p.evaluate(() => +(document.querySelector('[data-testid="sim-step"]')?.textContent.match(/\/(\d+)/)?.[1] ?? 1));
  const hs = [];
  for (let i = 0; i < n; i++) {
    await p.waitForTimeout(1300);
    hs.push(await p.evaluate(() => { const el = document.querySelector('.not-prose'); const st = [...document.querySelectorAll('[style*="scale("]')].find(e => /scale\(/.test(e.style.transform)); const sc = st ? parseFloat(st.style.transform.match(/scale\(([^)]+)\)/)[1]) : 1; const r = el.getBoundingClientRect(); return `${Math.round(r.width/sc)}x${Math.round(r.height/sc)}@${sc.toFixed(3)}`; }));
    await p.keyboard.press('ArrowRight');
  }
  console.log(s, hs.join(' '));
}
await b.close();
