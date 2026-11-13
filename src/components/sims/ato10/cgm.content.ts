import { C } from '../kit/palette';
import type { LedgerRow } from './MedirShell';

/**
 * Slide 185 · Glicose Contínua em Atleta (CGM-ATLETAS: THOMASF2016, BOWLER2025, MATKIN2026, FLOCKHART-LARSEN2024 — dossiê 07).
 * Cadeia em 4 elos (um estudo por elo); a curva de 24 h é ilustrativa (o selo fica preso a ela até o fim). 6,0 mmol/L ≈ 108 mg/dL: conversão (× 18).
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
        text: 'O filamento sob a pele fica no líquido intersticial: a glicose difunde do capilar, uma enzima no filamento a oxida e a corrente vira mmol/L. A leitura chega com atraso em relação ao sangue, maior quando a glicose muda depressa, como no exercício.',
        design: 'princípio do sensor',
        sources: [FL],
    },
    {
        tab: 'Saudáveis',
        headline: 'Glicemia “alta” em atleta saudável',
        text: 'Thomas 2016: 10 atletas subelite, 6 dias de vida livre com CGM. 4 passaram mais de 70% do tempo acima de 6,0 mmol/L (108 mg/dL), mesmo sem contar as 2 h após as refeições; 3 tinham jejum na faixa de pré-diabetes pelo critério da ADA. Ninguém ali estava doente.',
        design: 'vida livre · 6 dias · n = 10 subelite',
        sources: [FL, 'Thomas 2016'],
    },
    {
        tab: 'REDs',
        headline: 'Nem a doença ele separa',
        text: 'Matkin-Hussey 2026: 18 atletas mulheres, 9 com REDs diagnosticada clinicamente. O CGM não as separou das controles: glicose noturna P = 0,21; variabilidade (MAGE) P = 0,92. Se a curva varia no saudável e não muda no doente, ela não diagnostica.',
        design: 'n = 18 mulheres, 9 com REDs',
        sources: [FL, 'Thomas 2016', 'Matkin-Hussey 2026'],
    },
    {
        tab: 'Sem régua',
        headline: 'Ainda falta régua para atleta',
        text: 'Flockhart e Larsen (2024): não há consenso para interpretar a medida. Só há descrição: 12 marchadores de elite a 8,4 g/kg/d (Bowler 2025) ficaram com perfil de pessoa saudável. Sem referência, a curva não diagnostica nem prescreve.',
        design: 'Bowler: n = 12 elite · dieta padronizada',
        sources: [FL, 'Thomas 2016', 'Matkin-Hussey 2026', 'Bowler 2025'],
    },
];

export const LEDGER: readonly LedgerRow[] = [
    { at: 0, term: 'intersticial', text: 'atrasa; mais no exercício', color: C.glucose },
    { at: 1, term: '4 de 10', text: '> 70% do tempo acima de 108 mg/dL', color: C.glucoseSoft },
    { at: 2, term: 'P 0,21 · 0,92', text: 'REDs × controles: não separou', color: C.stone },
    { at: 3, term: '102,6 mg/dL', text: 'elite a 8,4 g/kg/d: descrição', color: C.ok },
];

export const THOMAS = { lit: 4, prediab: 3 } as const;
export const BOWLER = { mean: '102,6', night: '91,8', mage: '36', diet: '8,4 g/kg/d' } as const;
export const MATKIN = { night: 'P = 0,21', mage: 'P = 0,92' } as const;
