/**
 * Slide 82 · Quanto a Carga Rende. Fonte única: dossiê 04 (confirmados no abstract).
 *   MCLAY2007: 9 mulheres, contrarrelógio de 16 km (~26 min, depois de 75 min intermitentes): 26,10 × 26,16 min, P = 0,494.
 *   SHERMAN1981: 20,9 km (~1h20, "prova de cerca de 1h20" no dossiê): sem diferença de tempo.
 *   HAWLEY1997 (revisão NARRATIVA): > 90 min, +2–3% no contrarrelógio; ~20% é tempo até a exaustão.
 *   BURKE2000: ECR cruzado com placebo, n = 7; 100 km (~2h30): 147,5 × 149,1 min (P = 0,4);
 *     glicogênio 572 × 485 mmol/kg dw; controle já com 6 g/kg/d e 1 g/kg/h de CHO durante nas duas condições.
 */
export const AXIS_MAX = 180;
export const SPLIT = 90;
export const TICKS: readonly number[] = [0, 30, 60, 90, 120, 150, 180];

export interface StudyPin {
    id: string;
    /** Duração da parte medida (min), posição no eixo. */
    at: number;
    title: string;
    result: string;
    /** Passo em que aparece. */
    from: number;
}

export const PINS: readonly StudyPin[] = [
    { id: 'mclay', at: 26, title: '16 km · McLay 2007', result: '26,10 × 26,16 min', from: 0 },
    { id: 'sherman', at: 80, title: '20,9 km · Sherman 1981', result: 'tempo igual', from: 0 },
];

export const BURKE = {
    at: 148,
    title: '100 km · Burke 2000',
    rows: [
        { label: '9 g/kg/d', min: '147,5 min', glycogen: '572' },
        { label: '6 g/kg/d', min: '149,1 min', glycogen: '485' },
    ],
    p: 'P = 0,4',
    glycogenUnit: 'glicogênio, mmol/kg seco',
} as const;

export const HAWLEY = { value: '+2–3%', caption: 'no contrarrelógio', caveat: '~20% é tempo até a exaustão' } as const;

export const BEATS: readonly string[] = [
    'Em provas de até ~90 minutos, a carga não mudou o tempo.',
    'Acima de ~90 minutos, a revisão de Hawley estima 2 a 3% no contrarrelógio.',
    'Burke, 2000, com placebo: 100 km de bicicleta e o mesmo tempo.',
    'O tanque encheu mais e o tempo não mudou: o controle já comia 6 g/kg e todos tomaram CHO durante.',
];

export const DESIGNS: readonly string[] = [
    'cruzados · resultado nulo',
    'revisão narrativa, não meta-análise',
    'ECR cruzado · placebo · n = 7',
    'ECR cruzado · placebo · n = 7',
];

export const SOURCES: readonly string[] = [
    'Sherman WM et al. Int J Sports Med 1981;2:114-118 · McLay RT et al. Int J Sport Nutr Exerc Metab 2007;17:189-205.',
    'Hawley JA, Schabort EJ, Noakes TD, Dennis SC. Sports Med 1997;24(2):73-81.',
    'Burke LM et al. J Appl Physiol 2000;88(4):1284-1290.',
    'Burke LM et al. J Appl Physiol 2000;88(4):1284-1290.',
];

export const TEXT = {
    axis: 'duração da parte medida (min)',
    short: 'até ~90 min',
    long: 'acima de ~90 min',
    nil: 'nulo',
} as const;
