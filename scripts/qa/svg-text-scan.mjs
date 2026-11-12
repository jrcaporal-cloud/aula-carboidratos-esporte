// Varre todos os simuladores (?sim=Nome) no último passo e mede o texto de SVG pelo tamanho REAL na tela
// (altura da caixa do glifo ÷ escala do palco). Pega o caso que o sim-check não vê: SVG encolhido pelo layout.
// Uso: node scripts/qa/svg-text-scan.mjs <porta> [limite-px=13]
import { chromium } from 'playwright';
import { readdirSync } from 'node:fs';

const [port = '5360', limit = '13'] = process.argv.slice(2);
const CHROME = '/Users/mac/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const sims = readdirSync('src/components/sims').filter(f => f.endsWith('Sim.tsx')).map(f => f.replace('.tsx', ''));
const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const bad = [];
for (const sim of sims) {
    await page.goto(`http://localhost:${port}/aula-carboidratos-esporte/?sim=${sim}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    for (let i = 0; i < 12; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(120); }
    await page.waitForTimeout(1600);
    const found = await page.evaluate((lim) => {
        const stageEl = [...document.querySelectorAll('[style*="scale("]')].find(e => /scale\(/.test(e.style.transform));
        const k = stageEl ? parseFloat(stageEl.style.transform.match(/scale\(([^)]+)\)/)[1]) || 1 : 1;
        const out = [];
        for (const t of document.querySelectorAll('svg text')) {
            const txt = t.textContent.trim();
            if (!txt) continue;
            const cs = getComputedStyle(t);
            if (cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
            const svg = t.ownerSVGElement;
            const vb = svg?.viewBox?.baseVal;
            const box = svg.getBoundingClientRect();
            if (!box.width) continue;
            const scale = vb && vb.width ? box.width / vb.width : 1;
            const px = parseFloat(cs.fontSize) * scale / k;
            if (px < lim) out.push(`${txt.slice(0, 24)} ${px.toFixed(1)}px`);
        }
        return [...new Set(out)].slice(0, 6);
    }, Number(limit));
    if (found.length) bad.push(`${sim}: ${found.join(' | ')}`);
}
await browser.close();
console.log(bad.length ? bad.join('\n') : 'nenhum texto de SVG abaixo do limite');
