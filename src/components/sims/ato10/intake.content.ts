import { C } from '../kit/palette';
import type { LedgerRow } from './MedirShell';

/**
 * Slide 182 · O Que os Atletas Comem. MASSON2016, RAIZEL2017, BURKE2001, JENNER2019, HEIKURA2018 (Front Physiol) — dossiê 07;
 * ANDERSON2017 — dossiê 06. Faixa de referência: BURKE2011.
 */

export interface IntakeStep {
    tab: string;
    headline: string;
    text: string;
    design: string;
    sources: readonly string[];
}

export const STEPS: readonly IntakeStep[] = [
    {
        tab: 'Amadores',
        headline: 'Menos da metade chega à meta',
        text: 'Masson e Lamarche (2016): 116 amadores de triatlo de inverno, Ironman e 70.3, 14,8 h de treino por semana, questionário de frequência validado. Só 45,7% atingiam a meta de carboidrato (66,7% no Ironman); 87,1% comiam ≥ 1,2 g/kg/d de proteína. O amador inverte as prioridades.',
        design: 'transversal · n = 116 · QFA',
        sources: ['Masson & Lamarche 2016'],
    },
    {
        tab: 'Futebol no Brasil',
        headline: 'Energia fecha, carboidrato fica curto',
        text: 'Raizel 2017: 19 futebolistas profissionais, registro de 3 dias na pré-temporada. Energia de 40,7 kcal/kg, adequada; carboidrato em 5,44 g/kg/d, abaixo da faixa de treino alto; proteína 1,91 e gordura 1,27 g/kg/d. A conta de energia fecha com proteína e gordura.',
        design: 'registro de 3 dias · n = 19',
        sources: ['Masson & Lamarche 2016', 'Raizel 2017'],
    },
    {
        tab: 'Premier League',
        headline: 'Periodiza, mas falta na véspera',
        text: 'Anderson 2017: 6 jogadores, 7 dias com água duplamente marcada. Gasto de 3.566 e ingestão de 3.186 kcal/d (sem diferença). Carboidrato de 6,4 g/kg no dia de jogo e 4,2 no treino; a véspera e a recuperação ficaram abaixo das diretrizes. n pequeno, comida autorrelatada.',
        design: 'água duplamente marcada · n = 6',
        sources: ['Masson & Lamarche 2016', 'Raizel 2017', 'Anderson 2017'],
    },
    {
        tab: 'Quem fica abaixo',
        headline: 'O déficit tem endereço',
        text: 'Nos inquéritos, o homem de endurance tende a chegar à meta em g/kg (Burke 2001). Ficam abaixo a atleta em restrição energética crônica e o esporte coletivo profissional, que bate proteína e gordura, mas não energia nem carboidrato (Jenner 2019). Todo inquérito sofre com sub-relato.',
        design: 'revisões + inquérito de elite',
        sources: ['Masson & Lamarche 2016', 'Raizel 2017', 'Anderson 2017', 'Burke 2001', 'Jenner 2019', 'Heikura 2018'],
    },
];

export const LEDGER: readonly LedgerRow[] = [
    { at: 0, term: '45,7%', text: 'amadores na meta de carboidrato', color: C.glucoseSoft },
    { at: 0, term: '87,1%', text: 'os mesmos, com proteína ≥ 1,2 g/kg/d', color: C.proteinSoft },
    { at: 1, term: '5,44 g/kg', text: 'futebol brasileiro, energia adequada', color: C.text },
    { at: 2, term: '4,2 · 6,4', text: 'Premier League: treino · jogo (g/kg)', color: C.text },
    { at: 3, term: '32%', text: 'da elite tem nutricionista (n = 104)', color: C.caveat },
];

/** Masson & Lamarche 2016: cada quadrado = 1% dos 116 atletas. */
export const WAFFLES = [
    { id: 'cho', value: '45,7%', lit: 46, caption: 'na meta de carboidrato', color: C.glucose, text: C.glucoseSoft },
    { id: 'ptn', value: '87,1%', lit: 87, caption: 'proteína ≥ 1,2 g/kg/d', color: C.protein, text: C.proteinSoft },
] as const;

export interface Marker {
    id: string;
    value: number;
    label: string;
    from: number;
}

export const MARKERS: readonly Marker[] = [
    { id: 'pl-treino', value: 4.2, label: 'Premier, treino', from: 2 },
    { id: 'raizel', value: 5.44, label: 'Brasil', from: 1 },
    { id: 'pl-jogo', value: 6.4, label: 'Premier, jogo', from: 2 },
];

/** Faixa desenhada na régua (treino alto, 1–3 h/d — BURKE2011). */
export const REF_BAND = { lo: 6, hi: 10, label: '6–10 treino alto' } as const;
export const RULER_MAX = 12;

/** Quem fica abaixo (passo 4), uma linha por fonte. */
export const BELOW = [
    { who: 'Atleta em restrição energética', how: 'abaixo da meta mesmo em endurance', src: 'Burke 2001' },
    { who: 'Coletivo profissional', how: '21 estudos, n = 511: falta energia e carboidrato', src: 'Jenner 2019' },
    { who: 'Elite de fundo e marcha', how: '92% periodizam; só 32% com nutricionista', src: 'Heikura 2018' },
] as const;
