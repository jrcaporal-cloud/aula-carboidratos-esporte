/**
 * Slide 45 · Por que a Gordura Trava no Alto. Uma cadeia de causa numa cena só (ato3/FatGate.tsx):
 * mais carboidrato → PDH aberta → acetil-CoA em excesso → a CAT prende a carnitina → a CPT-I fica sem carnitina livre.
 * VANLOON2001 (n = 8 ciclistas; gordura 32 → 19 kJ/min a 55 → 75% Wmáx; PDH ↑, carnitina acetilada, carnitina livre ↓;
 * CPT-I não medida) e HOWLETT1998 (n = 7 não treinados; PDH ativa por % do VO₂máx). Contagem de fichas: esquema.
 */

export interface FatStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

const VANLOON = 'van Loon 2001 (n = 8)';
const HOWLETT = 'Howlett 1998 (n = 7)';

export const FAT_STEPS: readonly FatStep[] = [
    {
        tab: 'A porta',
        headline: 'A 55% da Wmáx, a porta da gordura está aberta',
        text: 'O ácido graxo só entra na mitocôndria pela CPT-I, trocando a CoA pela carnitina livre. Van Loon 2001 (n = 8 ciclistas, isótopos + biópsias): a 55% da Wmáx, com carnitina livre sobrando, a oxidação de gordura chega ao pico, 32 ± 2 kJ/min.',
        sources: [VANLOON],
    },
    {
        tab: 'Mais carboidrato',
        headline: 'A 75%, a PDH despeja acetil-CoA',
        text: 'Com a potência, a glicogenólise e a PDH aceleram. Em outro estudo (Howlett 1998, n = 7 não treinados, intensidade em % do VO₂máx), a PDH ativa foi de 0,53 em repouso a 3,33 mmol·kg⁻¹·min⁻¹ a 90%. Sai mais acetil-CoA do que o ciclo de Krebs consome.',
        sources: [HOWLETT],
    },
    {
        tab: 'Carnitina presa',
        headline: 'O excesso de acetil-CoA prende a carnitina',
        text: 'A carnitina-acetiltransferase (CAT) tampona o excesso: acetil-CoA + carnitina → acetilcarnitina. A 75% da Wmáx, van Loon mediu mais acetilação do pool de carnitina e queda da carnitina livre. A PDH segue trabalhando, mas a carnitina sai da porta da gordura.',
        sources: [VANLOON],
    },
    {
        tab: 'A porta trava',
        headline: 'Sem carnitina livre, a gordura cai',
        text: 'A oxidação de gordura desce a 19 ± 2 kJ/min. No alto, o carboidrato não só ganha: ele fecha a entrada da gordura. Limitação: a CPT-I não foi medida, o gargalo é inferido pela carnitina; n = 8, só homens.',
        sources: [VANLOON],
    },
];

export interface FatRow {
    at: number;
    label: string;
    value: string;
    tone: 'fat' | 'glucose' | 'neutral';
}

export const FAT_ROWS: readonly FatRow[] = [
    { at: 0, label: 'gordura oxidada · 55% Wmáx', value: '32 kJ/min', tone: 'fat' },
    { at: 1, label: 'PDH ativa (Howlett) · repouso → 90% VO₂máx', value: '0,53 → 3,33', tone: 'glucose' },
    { at: 2, label: 'carnitina livre · 55 → 75% Wmáx', value: 'cai', tone: 'neutral' },
    { at: 3, label: 'gordura oxidada · 75% Wmáx', value: '19 kJ/min', tone: 'fat' },
    { at: 3, label: 'queda da gordura (cálculo)', value: '−41%', tone: 'fat' },
];

/** Estado da cena por passo. Contagens de fichas são esquema; os kJ/min são de VANLOON2001. */
export interface GateState {
    intensity: string;
    pdh: string;
    /** Fichas de acetil-CoA na matriz (de 8). */
    acetyl: number;
    /** Carnitinas presas como acetilcarnitina (de 8). */
    bound: number;
    /** AGL entrando pela CPT-I ao mesmo tempo. */
    stream: number;
    jammed: boolean;
    cat: boolean;
    fat: string | null;
    /** Espessura do fluxo de carboidrato (glicólise → PDH). */
    flux: number;
}

export const GATE: readonly GateState[] = [
    { intensity: '55% Wmáx', pdh: 'PDH · pouco ativa', acetyl: 2, bound: 1, stream: 3, jammed: false, cat: false, fat: '32 kJ/min', flux: 4 },
    { intensity: '75% Wmáx', pdh: 'PDH · muito ativa', acetyl: 8, bound: 1, stream: 3, jammed: false, cat: false, fat: null, flux: 11 },
    { intensity: '75% Wmáx', pdh: 'PDH · muito ativa', acetyl: 8, bound: 6, stream: 3, jammed: false, cat: true, fat: null, flux: 11 },
    { intensity: '75% Wmáx', pdh: 'PDH · muito ativa', acetyl: 8, bound: 6, stream: 1, jammed: true, cat: true, fat: '19 kJ/min', flux: 11 },
];
