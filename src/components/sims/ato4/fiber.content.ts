/**
 * Slide 64 · Quem esvazia primeiro. Fonte: dossiê 02 · GOLLNICK1974 (2,7× e 7,4× a 64% e 84% vs 31% do VO₂máx;
 * lentas primeiro no moderado, todas no intenso). O mosaico é ilustrativo, montado nessas proporções.
 */

export type FiberType = 'I' | 'II';

export interface Fiber {
    x: number;
    y: number;
    r: number;
    type: FiberType;
    /** Glicogênio que sobra (0–1) em cada estágio: repouso, 31%, 64%, 84%. */
    left: readonly [number, number, number, number];
}

export const STAGES = [
    { label: 'repouso', ratio: '', lead: 'Corte de biópsia: o PAS pinta de roxo a fibra com glicogênio. Anel claro = fibra lenta (tipo I).' },
    { label: '31%', ratio: '1×', lead: 'A 31% do VO₂máx, pouco esvazia, e só nas fibras lentas.' },
    { label: '64%', ratio: '2,7×', lead: 'A 64%, 2,7 vezes mais: as lentas se apagam, as rápidas seguem cheias. A média engana.' },
    { label: '84%', ratio: '7,4×', lead: 'A 84%, 7,4 vezes mais: as rápidas entram, e o corte inteiro se apaga.' },
] as const;

/** Perda média por tipo em cada estágio (soma geral ≈ 10%, 27% e 74%: razão 1 : 2,7 : 7,4). */
const LOSS: Record<FiberType, readonly [number, number, number, number]> = {
    I: [0, 0.2, 0.5, 0.8],
    II: [0, 0, 0.04, 0.68],
};

const VB = { w: 520, h: 400 } as const;
export const FIBER_VB = VB;

const hash = (n: number) => {
    const s = Math.sin(n * 127.1) * 43758.5453;
    return s - Math.floor(s);
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Mosaico hexagonal recortado numa elipse (o contorno de um corte de biópsia). */
export const FIBERS: readonly Fiber[] = (() => {
    const out: Fiber[] = [];
    const gap = 46;
    let n = 0;
    for (let row = 0; row * gap * 0.87 < VB.h + gap; row++) {
        for (let col = 0; col * gap < VB.w + gap; col++) {
            n += 1;
            const x = col * gap + (row % 2 ? gap / 2 : 0) + (hash(n) - 0.5) * 8;
            const y = row * gap * 0.87 + (hash(n + 99) - 0.5) * 8;
            const dx = (x - VB.w / 2) / (VB.w / 2 - 20);
            const dy = (y - VB.h / 2) / (VB.h / 2 - 16);
            if (dx * dx + dy * dy > 1) continue;
            const type: FiberType = hash(n + 7) < 0.5 ? 'I' : 'II';
            const jitter = (hash(n + 31) - 0.5) * 0.7;
            const keep = (i: number) => {
                const l = LOSS[type][i];
                return l > 0 ? clamp01(1 - (l + jitter)) : 1;
            };
            const left: Fiber['left'] = [1, keep(1), keep(2), keep(3)];
            out.push({ x, y, r: 19 + hash(n + 3) * 4, type, left });
        }
    }
    return out;
})();

/** Glicogênio médio que sobra por tipo de fibra, no estágio. */
export const meanLeft = (type: FiberType, stage: number): number => {
    const list = FIBERS.filter(f => f.type === type);
    return list.reduce((s, f) => s + f.left[stage], 0) / Math.max(1, list.length);
};

export const FIBER_SOURCE = 'Gollnick, Piehl & Saltin, J Physiol 1974';
