import { C } from '../kit/palette';
import type { LedgerRow } from './MedirShell';

/**
 * Slide 185 · Glicose Contínua em Atleta (CGM-ATLETAS: THOMASF2016, BOWLER2025, MATKIN2026, FLOCKHART-LARSEN2024 — dossiê 07).
 * A curva de 24 h é ilustrativa (o selo fica preso a ela até o fim). 6,0 mmol/L ≈ 108 mg/dL: conversão (× 18).
 */

export const THRESHOLD = 6.0;

/** Curva ilustrativa de 24 h (mmol/L): refeições às 7h30, 12h30 e 20h, treino intenso às 17h. */
const BUMPS = [
    { at: 7.5, h: 2.6, w: 0.7 },
    { at: 12.5, h: 2.9, w: 0.8 },
    { at: 17, h: 2.0, w: 0.35 },
    { at: 20, h: 2.3, w: 0.8 },
] as const;
export const glucoseAt = (hour: number): number =>
    5.1 + BUMPS.reduce((sum, b) => sum + b.h * Math.exp(-((hour - b.at) ** 2) / (2 * b.w ** 2)), 0);

export const EVENTS = [
    { at: 7.5, label: 'café' },
    { at: 12.5, label: 'almoço' },
    { at: 17, label: 'treino' },
    { at: 20.4, label: 'jantar' },
] as const;

export interface CgmStep {
    tab: string;
    headline: string;
    text: string;
    design: string;
    sources: readonly string[];
}

const FL = 'Flockhart & Larsen 2024';

export const STEPS: readonly CgmStep[] = [
    {
        tab: 'O sensor',
        headline: 'O sensor não lê o sangue',
        text: 'O filamento sob a pele fica no líquido intersticial: a glicose difunde do capilar, uma enzima no filamento a oxida e a corrente vira mmol/L. A leitura vem com atraso em relação ao sangue, maior quando a glicose muda depressa, como no exercício. A curva ao lado é ilustrativa.',
        design: 'princípio do sensor',
        sources: [FL],
    },
    {
        tab: 'Subelite',
        headline: 'Glicemia “alta” em atleta saudável',
        text: 'Thomas 2016: 10 atletas subelite, 6 dias de vida livre com CGM. 4 passaram mais de 70% do tempo acima de 6,0 mmol/L, mesmo sem contar as 2 h após as refeições; 3 tinham jejum na faixa de pré-diabetes pelo critério da ADA. Ninguém ali estava doente.',
        design: 'vida livre · 6 dias · n = 10 subelite',
        sources: [FL, 'Thomas 2016'],
    },
    {
        tab: 'Elite',
        headline: 'Muito carboidrato, curva comum',
        text: 'Bowler 2025: 12 marchadores de elite (7 homens) com dieta padronizada de 8,4 g/kg/d de carboidrato. Média de 24 h de 102,6 mg/dL, noturna de 91,8 e variabilidade (MAGE) de 36 mg/dL: o perfil de pessoas saudáveis.',
        design: 'padronizado · n = 12 marchadores de elite',
        sources: [FL, 'Thomas 2016', 'Bowler 2025'],
    },
    {
        tab: 'REDs e consenso',
        headline: 'Ainda falta régua para atleta',
        text: 'Matkin-Hussey 2026: 18 atletas mulheres, 9 com REDs diagnosticada; o CGM não as separou dos controles. Flockhart e Larsen (2024): não há consenso sobre como interpretar a medida. Sem valor de referência para atleta, a curva não diagnostica nem prescreve.',
        design: 'n = 18 mulheres, 9 com REDs',
        sources: [FL, 'Thomas 2016', 'Bowler 2025', 'Matkin-Hussey 2026'],
    },
];

export const LEDGER: readonly LedgerRow[] = [
    { at: 0, term: 'intersticial', text: 'com atraso, maior no exercício', color: C.glucose },
    { at: 1, term: '4 de 10', text: '> 70% do tempo acima de 6,0 mmol/L (108 mg/dL)', color: C.glucoseSoft },
    { at: 2, term: '102,6 mg/dL', text: 'média de 24 h na elite (8,4 g/kg/d)', color: C.ok },
    { at: 3, term: 'P 0,21 · 0,92', text: 'REDs × controles: sem diferença', color: C.stone },
];

export const THOMAS = { lit: 4, prediab: 3 } as const;
export const BOWLER = { mean: '102,6', night: '91,8', mage: '36', diet: '8,4 g/kg/d' } as const;
export const MATKIN = { night: 'P = 0,21', mage: 'P = 0,92' } as const;
