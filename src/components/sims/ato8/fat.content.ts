/** Slide 144 · A promessa da gordura (dossiê 05·PHINNEY1983, BURKE2021rev, VOLEK2016, BURKE2017, BURKE2021a). */

export interface FatStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

export const FAT_STEPS: readonly FatStep[] = [
    {
        tab: '1983',
        headline: 'Cinco ciclistas, nenhum controle',
        text: 'Phinney 1983: 5 ciclistas bem treinados, 1 semana de dieta balanceada e 4 semanas de cetogênica eucalórica (< 20 g de CHO/d). Tempo até a exaustão a 62–64% do VO₂máx: 147 → 151 min. RQ 0,83 → 0,72; o uso de glicogênio caiu 4×. Pré-pós, sem grupo controle, intensidade baixa.',
        sources: ['Phinney 1983 (Metabolism)'],
    },
    {
        tab: 'Um ciclista',
        headline: 'A média tinha dono',
        text: 'Segundo a revisão de Burke 2021, que leu o texto completo, a média foi puxada por um aumento grande em um único ciclista. Com n = 5, um respondedor muda a conclusão. E é esse estudo que sustenta, há 40 anos, a frase "keto não piora o endurance".',
        sources: ['Burke 2021, revisão (J Physiol)'],
    },
    {
        tab: '2,3×',
        headline: 'A adaptação é real',
        text: 'Volek 2016 (FASTER): ultramaratonistas e triatletas de elite, 10 em dieta rica em CHO e 10 em low-carb há ~20 meses (9–36). Pico de oxidação de gordura 1,54 × 0,67 g/min, a 70,3% × 54,9% do VO₂máx; glicogênio de repouso igual. Transversal, autosselecionado, sem teste de desempenho.',
        sources: ['Volek 2016 (Metabolism)'],
    },
    {
        tab: 'Rápida',
        headline: 'E não precisa de meses',
        text: '~1,43 g/min em 5–6 dias (Burke 2021, 7 marchadores no LCHF) e 1,57 g/min em 3 semanas (Burke 2017, 10 no LCHF). O pico de oxidação passa de ~45% para ~70% do VO₂máx. Falta a pergunta que importa: o cronômetro acompanha?',
        sources: ['Burke 2017 (J Physiol)', 'Burke 2021 (J Physiol)'],
    },
];

export const PHINNEY = {
    n: 5,
    rows: [
        { label: 'exaustão a 62–64%', value: '147 → 151 min' },
        { label: 'RQ', value: '0,83 → 0,72' },
        { label: 'glicogênio, mmol/kg/min', value: '0,61 → 0,13' },
    ],
} as const;

export interface FatBar {
    id: string;
    year: string;
    label: string;
    design: string;
    gmin: number;
    /** Valor aproximado no resumo ("~1,43"). */
    approx?: boolean;
    /** Barra da dieta rica em CHO (cor neutra). */
    cho?: boolean;
    at: number;
}

export const FAT_BARS: readonly FatBar[] = [
    { id: 'hc', year: '2016', label: 'rica em CHO', design: 'n = 10', gmin: 0.67, cho: true, at: 2 },
    { id: 'lc', year: '2016', label: 'keto ~20 meses', design: 'n = 10', gmin: 1.54, at: 2 },
    { id: 'w3', year: '2017', label: '3 semanas', design: 'n = 10', gmin: 1.57, at: 3 },
    { id: 'd5', year: '2021', label: '5–6 dias', design: 'n = 7', gmin: 1.43, approx: true, at: 3 },
];

/** Legenda de cada grupo de barras (o estudo e o desenho). */
export const GROUP_CAPTION: Record<string, readonly [string, string]> = {
    '2016': ['Volek · transversal', 'sem medir desempenho'],
    '2017': ['Burke', 'Supernova 1'],
    '2021': ['Burke', 'Supernova 3'],
};
