/**
 * Slide 81 · Carga em 24 Horas (o pico do Ato V). Fonte única: dossiê 04 (todos confirmados no abstract).
 * Passada de clareza (12/11/2026): o Solem 2025 saiu do palco (3–5 dias, peso SECO: outra escala, outra pergunta);
 * fica nas notas. O palco é só a pergunta do título: 24 h, peso úmido, Bussau e Fairchild.
 *   BUSSAU2002: n = 8 homens treinados em endurance, fisicamente inativos, 10 g/kg/d de CHO de alto IG por 3 dias;
 *     95 (5) → 180 (15) mmol/kg ww após 1 dia (P < 0,05), "remained stable" até o dia 3 (biópsias só antes, no dia 1 e no dia 3;
 *     o abstract não dá o número do dia 3: o platô tracejado é ilustrativo); pico nas fibras I, IIa e IIb (PAS).
 *   FAIRCHILD2002: n = 7; 150 s a 130% do VO2pico + 30 s máximos (3 min) e 24 h com 12 g/kg de massa magra
 *     (≈ 10,3 g/kg) de alto IG; 109,1 → 198,2 mmol/kg ww, comparável ou acima de regimes de 2–6 dias. Sem comparador.
 *   SOLEM2025 (só nas notas): 30 estudos, 3–5 dias, +269,7 (ciclismo) × +156,5 (corrida) mmol/kg dw.
 *   Cálculos próprios (selo): 10 g/kg × 70 kg = 700 g/dia; 180 / 95 ≈ 1,9.
 */
export interface OneDayStep {
    tab: string;
    headline: string;
    text: string;
    design: string;
    calc?: string;
    source: string;
}

export const STEPS: readonly OneDayStep[] = [
    {
        tab: 'O protocolo',
        headline: 'Um dia, 10 g/kg, sem treinar',
        text: 'Bussau e colegas (2002): 8 homens treinados em endurance, fisicamente inativos, comendo 10 g/kg de carboidrato de alto índice glicêmico por dia, por 3 dias. Desfecho: glicogênio por biópsia, com coloração por tipo de fibra. Ponto de partida: 95 mmol/kg de peso úmido.',
        design: 'série temporal · n = 8 homens · biópsia',
        calc: '700 g: cálculo',
        source: 'Bussau et al. Eur J Appl Physiol 2002',
    },
    {
        tab: '24 horas',
        headline: 'Em 24 horas, o tanque quase dobra',
        text: 'De 95 para 180 mmol/kg no primeiro dia (P < 0,05); na biópsia do 3º dia, o glicogênio estava estável. O pico apareceu nas fibras tipo I, IIa e IIb. Para o atleta treinado em repouso, a carga é de 1 a 3 dias, não de uma semana. Limites: só homens, sem desempenho.',
        design: 'série temporal · n = 8 homens · biópsia',
        calc: '×1,9: cálculo',
        source: 'Bussau et al. Eur J Appl Physiol 2002',
    },
    {
        tab: '3 minutos antes',
        headline: 'Três minutos de esforço, o mesmo dia',
        text: 'Fairchild e colegas (2002): 7 atletas pedalaram 150 s a 130% do VO₂pico e mais 30 s no máximo, e então comeram 12 g/kg de massa magra (≈ 10,3 g/kg) em 24 h. De 109 para 198 mmol/kg, igual ou acima de regimes de 2 a 6 dias. Sem grupo só dieta: compara-se com o Bussau.',
        design: 'sem comparador · n = 7 · biópsia',
        source: 'Fairchild et al. Med Sci Sports Exerc 2002',
    },
];

/** Escala do eixo e do tanque (mmol/kg ww): só desenho. */
export const Y_MIN = 80;
export const Y_MAX = 220;

export interface LoadRun {
    id: 'bussau' | 'fairchild';
    label: string;
    from: number;
    to: number;
    /** Passo em que entra. */
    at: number;
    /** Platô até o dia 3 (só o Bussau): "estável" no abstract, sem número; desenhado tracejado e com selo. */
    plateau: boolean;
}

export const RUNS: readonly LoadRun[] = [
    { id: 'bussau', label: 'Bussau', from: 95, to: 180, at: 1, plateau: true },
    { id: 'fairchild', label: 'Fairchild', from: 109, to: 198, at: 2, plateau: false },
];

export const LEDGER = [
    { at: 1, label: 'Bussau 2002 · n = 8 · 10 g/kg/d', value: '95 → 180' },
    { at: 2, label: 'Fairchild 2002 · n = 7 · 3 min + 24 h', value: '109 → 198' },
] as const;

export const TEXT = {
    /** Linha do tempo do dia de carga. */
    day: 'o dia de carga: 24 h em repouso',
    sprint: '3 min de esforço',
    sprintWho: 'só Fairchild',
    yAxis: 'glicogênio muscular, mmol/kg de peso úmido',
    xAxis: 'horas desde o início da carga',
    band: 'dia de carga',
    plateau: 'até o dia 3: estável',
    /** Selo do platô tracejado: o abstract diz "estável", sem número. */
    plateauChip: 'platô: ilustrativo',
    recipe: ['10 g/kg/d', 'alto IG', 'repouso'],
    perDay: '70 kg → 700 g/dia',
    double: '×1,9',
    doubleCaption: 'em 24 h; depois, estável',
    lbm: '12 g/kg de massa magra ≈ 10,3 g/kg',
    ledger: 'glicogênio, mmol/kg de peso úmido',
} as const;
