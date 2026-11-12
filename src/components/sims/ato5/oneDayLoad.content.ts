/**
 * Slide 81 · Carga em 24 Horas. Fonte única: dossiê 04 (todos confirmados no abstract).
 *   BUSSAU2002: 10 g/kg/d de CHO de alto IG, atleta inativo; 95 → 180 mmol/kg ww após 1 dia; estável nos dias 2–3. n = 8.
 *   FAIRCHILD2002: 150 s a 130% do VO2pico + 30 s máximos (3 min) e 24 h com ~10,3 g/kg; 109,1 → 198,2 mmol/kg ww. n = 7.
 *   SOLEM2025: meta-análise, 30 estudos, 319 pessoas (48 mulheres): +269,7 (ciclismo) × +156,5 (corrida) mmol/kg dw.
 */
export interface DayLoad {
    from: number;
    to: number;
    /** Esforço curto antes das 24 h (Fairchild). */
    sprint: boolean;
}

/** Glicogênio por passo (passos 0–2). O passo 3 troca o relógio pela meta-análise. */
export const LOADS: readonly DayLoad[] = [
    { from: 95, to: 95, sprint: false },
    { from: 95, to: 180, sprint: false },
    { from: 109, to: 198, sprint: true },
];

/** Escala do tanque: 220 mmol/kg ww = cheio (só desenho). */
export const TANK_MAX = 220;

export const BEATS: readonly string[] = [
    'Bussau, 2002: atleta treinado, parado, comendo 10 g/kg de carboidrato por dia.',
    'Em 24 horas o tanque quase dobra. Nos dias 2 e 3, não sobe mais.',
    'Fairchild, 2002: 3 minutos de esforço quase máximo antes, e o mesmo dia de carga.',
    'Solem, 2025: a carga enche o músculo que trabalhou. Depois de pedalar, mais que depois de correr.',
];

export const DESIGNS: readonly string[] = [
    'série temporal · n = 8 homens · biópsia',
    'série temporal · n = 8 homens · biópsia',
    'sem comparador · n = 7 · biópsia',
    'meta-análise · 30 estudos · 319 pessoas',
];

export const SOURCES: readonly string[] = [
    'Bussau VA et al. Eur J Appl Physiol 2002;87(3):290-295.',
    'Bussau VA et al. Eur J Appl Physiol 2002;87(3):290-295.',
    'Fairchild TJ et al. Med Sci Sports Exerc 2002;34(6):980-986.',
    'Solem K, Clauss M, Jensen J. Front Physiol 2025;16:1620943.',
];

export const SOLEM = {
    rows: [
        { label: 'ciclismo', value: 270, text: '+270' },
        { label: 'corrida', value: 157, text: '+157' },
    ],
    max: 300,
    unit: 'mmol/kg de peso seco · não compare com o peso úmido',
    note: 'só 48 mulheres em 319',
} as const;

export const TEXT = {
    unit: 'mmol/kg (peso úmido)',
    hours: 'horas de carga',
    sprint: '3 min',
    days23: 'dias 2–3: estável',
    tank: 'glicogênio muscular',
} as const;
