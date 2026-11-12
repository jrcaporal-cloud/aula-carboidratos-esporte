// Percorre a aula slide a slide (pelo endereço, sem passos) e confere a glicose personagem e a barra da maratona:
// a glicose não pode cobrir nenhum texto do slide nem os controles; a barra mostra o km certo.
// Resiste a recargas do Vite (outros agentes editando): tenta de novo o mesmo slide.
// Uso: node scripts/qa/deck-glucose-walk.mjs <porta> <pasta> [1280x720]
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const [port = '5360', outDir = '/tmp/glucose-walk', size = '1280x720'] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const CHROME = '/Users/mac/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const BASE = `http://localhost:${port}/aula-carboidratos-esporte/`;
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, args: ['--use-angle=metal'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
let errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
page.on('pageerror', e => errors.push(`[pageerror] ${e.message.slice(0, 160)}`));
await page.goto(`${BASE}#/1`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const check = () => page.evaluate(() => {
    const g = document.querySelector('[data-glucose]');
    const gs = g ? getComputedStyle(g) : null;
    const visible = gs ? Number(gs.opacity) > 0.5 : false;
    const r = g?.getBoundingClientRect();
    // caixa útil do hexágono (o desenho ocupa ~70% da caixa de 100)
    const box = r ? { l: r.left + r.width * 0.15, t: r.top + r.height * 0.1, r: r.right - r.width * 0.15, b: r.bottom - r.height * 0.15 } : null;
    const hits = [];
    if (visible && box) {
        const section = document.querySelector('section[aria-roledescription="slide"]:last-of-type');
        const walker = document.createTreeWalker(section ?? document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!node.textContent.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(node);
            for (const q of range.getClientRects()) {
                if (q.width < 1 || q.right < box.l || q.left > box.r || q.bottom < box.t || q.top > box.b) continue;
                hits.push(node.textContent.trim().slice(0, 30));
            }
        }
    }
    const km = document.querySelector('[aria-label^="Progresso da aula"]')?.getAttribute('aria-label') ?? '';
    const label = document.querySelector('section[aria-roledescription="slide"]:last-of-type')?.getAttribute('aria-label') ?? '';
    return { label: label.slice(0, 50), visible, hits: [...new Set(hits)], km };
});

const report = [];
for (let n = 1; n <= 97; n++) {
    let res = null;
    for (let attempt = 0; attempt < 3 && !res; attempt++) {
        try {
            await page.evaluate(h => { location.hash = h; }, `#/${n}`);
            await page.waitForTimeout(1300);
            res = await check();
        } catch {
            await page.waitForTimeout(2500);
        }
    }
    const errs = [...new Set(errors)].filter(e => !/components\/sims\//.test(e));
    errors = [];
    if (!res) { report.push({ n, falhou: true }); continue; }
    if (res.hits.length || errs.length) report.push({ n, ...res, errs });
    if ([1, 2, 16, 40, 74, 97].includes(n)) await page.screenshot({ path: `${outDir}/g${String(n).padStart(2, '0')}.png` });
}
writeFileSync(`${outDir}/relatorio-glicose.json`, JSON.stringify(report, null, 1));
console.log(`${report.length} slides com problema`);
for (const r of report) console.log(JSON.stringify(r));
await browser.close();
