import { C } from '../kit/palette';
import type { LedgerRow } from './shellA';

/**
 * Slide 64 · Quem esvazia primeiro. Fonte: dossiê 02 · GOLLNICK1974 (dois artigos, J Physiol 1974;241):
 * ciclismo a 30–150% do VO₂máx; esvaziamento 2,7× e 7,4× a 64% e 84% vs 31%; lentas primeiro no submáximo, as
 * rápidas entram aos poucos; acima do VO₂máx as duas desde o início; cadência 30–120 rpm sem efeito; após 3 h leves
 * sobra glicogênio, quase todo nas rápidas; isométrico (n = 6): < 20% da CVM lentas, acima rápidas.
 * O mosaico é ilustrativo, montado nessas proporções; as barras 1 · 2,7 · 7,4 são dado.
 */

export type FiberType = 'I' | 'II';

export interface Fiber {
    x: number;
    y: number;
    r: number;
    type: FiberType;
    /** Glicogênio que sobra (0–1) em cada passo: repouso, 31%, 64%, 84%, > 100%. */
    left: readonly [number, number, number, number, number];
}

export interface FiberStep {
    tab: string;
    headline: string;
    text: string;
    color: string;
    sources: readonly string[];
}

const GOLLNICK = 'Gollnick, Piehl & Saltin, J Physiol 1974';

export const FIBER_STEPS: readonly FiberStep[] = [
    {
        tab: 'Os cortes',
        headline: 'Dois cortes do mesmo fragmento',
        text: 'Gollnick, Piehl e Saltin, 1974: homens pedalando de 30% a 150% do VO₂máx, com biópsias. Em cortes seriados do mesmo fragmento, a ATPase miofibrilar separa as fibras lentas (tipo I) das rápidas (tipo II), e o PAS cora a fibra que tem glicogênio. Em repouso, todas cheias.',
        color: C.stone,
        sources: [GOLLNICK],
    },
    {
        tab: '31%',
        headline: '31%: pouco, e só nas lentas',
        text: 'A 31% do VO₂máx, o esvaziamento é pequeno e aparece nas fibras lentas. É a referência (1×) dos números seguintes. Mesmo depois de 3 h em baixa intensidade, ainda sobrava muito glicogênio, quase todo nas fibras rápidas.',
        color: C.glycogenSoft,
        sources: [],
    },
    {
        tab: '64%',
        headline: '64%: 2,7 vezes mais',
        text: 'As lentas se apagam; as rápidas seguem cheias. A média do fragmento ainda parece razoável, mas as lentas já estão quase vazias: a média engana. No submáximo, as rápidas entram aos poucos, conforme as lentas se esgotam.',
        color: C.glycogenSoft,
        sources: [],
    },
    {
        tab: '84%',
        headline: '84%: 7,4 vezes mais',
        text: 'As rápidas entram, e o corte inteiro se apaga. A cadência (30–120 rpm) não mudou o padrão: quem escolhe as fibras é a intensidade. No isométrico, a mesma lógica: abaixo de 20% da contração voluntária máxima esvaziam as lentas; acima, as rápidas (n = 6).',
        color: C.glycogen,
        sources: ['Gollnick, Karlsson, Piehl & Saltin, J Physiol 1974 (isométrico)'],
    },
    {
        tab: '> 100%',
        headline: 'Acima do VO₂máx: as duas',
        text: 'Acima do VO₂máx, os dois tipos esvaziam desde o início. Lição: glicogênio "médio" razoável pode esconder fibras vazias. Limites: o PAS é semiquantitativo, o n é pequeno, e o mosaico daqui é ilustrativo, desenhado nas proporções do artigo.',
        color: C.risk,
        sources: [],
    },
];

/** Quem esvazia, por intensidade: uma linha por passo, e fica. */
export const FIBER_LEDGER: readonly LedgerRow[] = [
    { at: 1, label: '31%', text: 'pouco, só nas lentas', color: C.glycogenSoft },
    { at: 2, label: '64%', text: 'lentas se apagam; rápidas cheias', color: C.glycogenSoft },
    { at: 3, label: '84%', text: 'rápidas entram; o corte se apaga', color: C.glycogenSoft },
    { at: 4, label: '> 100%', text: 'os dois tipos desde o início', color: C.risk },
];

/** Esvaziamento relativo a 31% do VO₂máx (dado do artigo). */
export const DEPLETION = [
    { at: 1, label: '31%', ratio: 1, text: '1×' },
    { at: 2, label: '64%', ratio: 2.7, text: '2,7×' },
    { at: 3, label: '84%', ratio: 7.4, text: '7,4×' },
] as const;

/** Perda média por tipo em cada passo (soma ≈ 10%, 27% e 74% → razão 1 : 2,7 : 7,4); > 100%: as duas juntas. */
const LOSS: Record<FiberType, readonly [number, number, number, number, number]> = {
    I: [0, 0.2, 0.5, 0.8, 0.42],
    II: [0, 0, 0.04, 0.68, 0.42],
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
            const left: Fiber['left'] = [1, keep(1), keep(2), keep(3), keep(4)];
            out.push({ x, y, r: 19 + hash(n + 3) * 4, type, left });
        }
    }
    return out;
})();
