/**
 * Slide 47 · Quem Defende os 4 Gramas. Fonte única dos textos e números.
 * ~4 g no sangue (70 kg): WASSERMAN2009. ≤2× (<60% VO₂máx), 7–8× produção e 3–4× utilização (>80%),
 * insulina 40–60 min na exaustão: MARLISS2002. A curva da glicemia no palco é ilustrativa (sem mmol/L na fonte).
 */

export interface LiverStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
    design: string;
    /** Taxa de produção (torneira) e de utilização (ralo), em múltiplos do repouso: a largura do jato. */
    tap: number;
    drain: number;
    tapLabel: string;
    drainLabel: string;
    /** Nível do copo (0–1; 0,5 = glicemia normal) e gotas em movimento (torneira, ralo): ≤ 8 no total. */
    level: number;
    drops: readonly [number, number];
    /** Dado-chave do passo (número grande no painel) e a legenda dele. */
    stat: string;
    statCaption: string;
}

const WASSERMAN = 'Wasserman 2009 (revisão)';
const MARLISS = 'Marliss & Vranic 2002 (revisão)';

export const LIVER_STEPS: readonly LiverStep[] = [
    {
        tab: '4 gramas',
        headline: 'Uma colher de chá no sangue',
        text: 'Circulam só ~4 g de glicose no sangue de uma pessoa de 70 kg (Wasserman 2009). O músculo em exercício capta essa glicose sem parar; o fígado repõe, por glicogenólise e gliconeogênese. Torneira e ralo estão na mesma escala: a largura do jato é a taxa.',
        sources: [WASSERMAN],
        design: 'revisão (palestra)',
        tap: 1, drain: 1, tapLabel: '×1', drainLabel: '×1', level: 0.5, drops: [1, 1],
        stat: '~4 g', statCaption: 'de glicose no sangue inteiro (70 kg)',
    },
    {
        tab: 'Moderado',
        headline: 'Moderado: a torneira acompanha o ralo',
        text: 'Abaixo de 60% do VO₂máx, a razão glucagon/insulina na veia porta sobe a produção hepática até 2 vezes; a secreção de insulina cai, inibida pelo receptor α-adrenérgico da célula β. Produção e consumo andam juntos, e a glicemia fica no lugar.',
        sources: [MARLISS],
        design: 'revisão · Marliss 2002',
        tap: 2, drain: 2, tapLabel: 'até ×2', drainLabel: 'acompanha', level: 0.5, drops: [2, 2],
        stat: 'até 2×', statCaption: 'produção hepática abaixo de 60% do VO₂máx',
    },
    {
        tab: 'Intenso',
        headline: 'Intenso: a torneira passa do ralo',
        text: 'Acima de 80% do VO₂máx, as catecolaminas assumem: a produção hepática sobe 7–8 vezes e a utilização só 3–4. O que sobra fica no sangue, e a glicemia sobe durante o esforço. No palco, o jato tem o dobro da largura do ralo.',
        sources: [MARLISS],
        design: 'revisão · Marliss 2002',
        tap: 7.5, drain: 3.5, tapLabel: '×7–8', drainLabel: '×3–4', level: 0.8, drops: [5, 3],
        stat: '7–8× / 3–4×', statCaption: 'produção do fígado contra uso do músculo, acima de 80%',
    },
    {
        tab: 'Depois do tiro',
        headline: 'Depois do tiro, a insulina corrige',
        text: 'Na exaustão, a hiperglicemia pede insulina alta por 40–60 min: glicemia alta logo após um tiro é fisiologia, não falha. No diabetes tipo 1, a insulina que corrige não vem do pâncreas, e o mesmo tiro vira problema (Ato IX).',
        sources: [MARLISS],
        design: 'revisão · Marliss 2002',
        tap: 7.5, drain: 3.5, tapLabel: '×7–8', drainLabel: '×3–4', level: 0.8, drops: [0, 0],
        stat: '40–60 min', statCaption: 'de insulina alta para corrigir a glicemia',
    },
];

/** Sinais hormonais que chegam ao fígado (ou ao sangue) e ficam na tela. */
export const SIGNALS = [
    { at: 1, text: 'glucagon ÷ insulina ↑', sub: 'na veia porta', color: 'insulin' },
    { at: 2, text: 'catecolaminas ↑↑', sub: 'adrenalina e noradrenalina', color: 'stone' },
    { at: 3, text: 'insulina ↑ 40–60 min', sub: 'depois da exaustão', color: 'insulin' },
] as const;

/** Livro-caixa do painel: produção × utilização × glicemia, uma linha por fase. */
export const LIVER_LEDGER = [
    { at: 0, phase: 'repouso', tap: '1×', drain: '1×', glyc: '~4 g' },
    { at: 1, phase: '< 60% VO₂máx', tap: 'até 2×', drain: '≈ produção', glyc: 'estável' },
    { at: 2, phase: '> 80% VO₂máx', tap: '7–8×', drain: '3–4×', glyc: 'sobe', total: true },
    { at: 3, phase: 'exaustão', tap: '', drain: '', glyc: 'insulina ↑ por 40–60 min' },
] as const;

/** Pontos da curva ilustrativa da glicemia (0 = topo do gráfico, 1 = base), um por passo. */
export const GLYC_POINTS = [0.62, 0.62, 0.18, 0.5] as const;
export const GLYC_TICKS = ['rep.', 'mod.', 'int.', 'pós'] as const;
