// Capturas do "pacote de experiência" do deck: troca lateral (meio), abertura de ato, tecla 3 (morph),
// holofote e caneta, barra da maratona (início, km 32, fim) e a troca com movimento reduzido.
// Uso: node scripts/qa/deck-motion.mjs <porta> <pasta> [1280x720]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [port = '5360', outDir = '/tmp/deck-motion', size = '1280x720'] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const CHROME = '/Users/mac/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const BASE = `http://localhost:${port}/aula-carboidratos-esporte/`;
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, args: ['--use-angle=metal'] });
const errors = [];
const open = async (reduced = false) => {
    const page = await browser.newPage({ viewport: { width: W, height: H }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
    page.on('pageerror', e => errors.push(`[pageerror] ${e.message.slice(0, 200)}`));
    return page;
};
const shot = (page, name) => page.screenshot({ path: `${outDir}/${name}.png` });
const go = async (page, n, wait = 1800) => { await page.evaluate(h => { location.hash = h; }, `#/${n}`); await page.waitForTimeout(wait); };

const page = await open();
await page.goto(`${BASE}#/3`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await shot(page, '01-slide3-repouso');

// 1. troca no mesmo ato (3 → 4), no meio da transição
await page.evaluate(() => { location.hash = '#/4'; });
await page.waitForTimeout(60);
await shot(page, '02-lateral-meio');
await page.waitForTimeout(1500);
await shot(page, '03-slide4-pousado');

// 2. entrada de ato novo (15 → 16 abre o Ato III)
await go(page, 15);
await page.evaluate(() => { location.hash = '#/16'; });
await page.waitForTimeout(260);
await shot(page, '04-abertura-varrendo');
await page.waitForTimeout(900);
await shot(page, '05-abertura-cheia');
const glucose = await page.evaluate(() => getComputedStyle(document.querySelector('[data-glucose]')).transform);
console.log('glicose na abertura:', glucose);
await page.waitForTimeout(2200);
await shot(page, '06-ato3-primeiro-slide');

// 3. tecla 3 no slide com modelo 3D (índice 8, id 22: grânulo de glicogênio)
await go(page, 9, 2500);
await shot(page, '07-slide-3d-antes');
await page.keyboard.press('3');
await page.waitForTimeout(110);
await shot(page, '08-morph-crescendo');
await page.waitForTimeout(4000);
await shot(page, '09-morph-cena');
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
await shot(page, '10-morph-voltando');
await page.waitForTimeout(1200);
await shot(page, '11-morph-fechado');

// 4. holofote e caneta
await page.mouse.move(640, 380);
await page.keyboard.press('l');
await page.mouse.move(700, 400);
await page.waitForTimeout(300);
await shot(page, '12-holofote');
await page.keyboard.press('l');
await page.keyboard.press('k');
await page.mouse.move(300, 300);
await page.mouse.down();
for (let i = 0; i <= 20; i++) await page.mouse.move(300 + i * 25, 300 + Math.sin(i / 3) * 40);
await page.mouse.up();
await page.mouse.click(900, 520);
await page.waitForTimeout(150);
await shot(page, '13-caneta');
await page.keyboard.press('Escape');

// 4b. rajada (passador rápido): o slide que sai mal entrou sai na hora, sem empilhar seções
for (const n of [20, 21, 22, 23]) { await page.evaluate(h => { location.hash = h; }, `#/${n}`); await page.waitForTimeout(90); }
const stacked = await page.evaluate(() => document.querySelectorAll('section[aria-roledescription="slide"]').length);
console.log('seções na tela durante a rajada:', stacked);
await page.waitForTimeout(800);

// 5. barra da maratona: início, km 32 e chegada
await go(page, 1);
await shot(page, '14-km0');
await go(page, 74);
await shot(page, '15-km32');
await page.keyboard.press('End');
await page.waitForTimeout(1800);
await shot(page, '16-chegada');
await page.close();

// 6. movimento reduzido: só esmaecer
const calm = await open(true);
await calm.goto(`${BASE}#/3`, { waitUntil: 'networkidle' });
await calm.waitForTimeout(2000);
await calm.evaluate(() => { location.hash = '#/4'; });
await calm.waitForTimeout(100);
await shot(calm, '17-reduzido-meio');
const xs = await calm.evaluate(() => [...document.querySelectorAll('section[aria-roledescription="slide"]')].map(s => s.style.transform || 'none'));
console.log('reduzido, transform das seções:', xs);
await calm.close();

// 7. janela do apresentador com a prévia do próximo passo (mesmo contexto: o BroadcastChannel conversa)
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const deck = await ctx.newPage();
const presenter = await ctx.newPage();
for (const p of [deck, presenter]) p.on('pageerror', e => errors.push(`[pageerror] ${e.message.slice(0, 200)}`));
await deck.goto(`${BASE}#/9`, { waitUntil: 'networkidle' });
await presenter.goto(`${BASE}?apresentador#/9`, { waitUntil: 'networkidle' });
await presenter.waitForTimeout(7000);
await shot(presenter, '18-apresentador-previa');
await deck.keyboard.press('g');
await deck.waitForTimeout(800);
await shot(deck, '19-visao-geral-teclas');
await ctx.close();

await browser.close();
console.log(errors.length ? `ERROS:\n${[...new Set(errors)].join('\n')}` : 'console limpo');
