/**
 * Slide 68 · O muro em números. Fonte: dossiê 02 · SMYTH2021 (> 4 milhões de registros; N = 1.928.813; 28% × 17%,
 * OR 1,43; quem bate fica ~40% × ~37% mais lento por km (DoS = aumento do min/km sobre o ritmo-base; conferido no artigo em 12/11/2026) por ~10,7 × 9,6 km; risco maior nos anos em torno do recorde pessoal;
 * muro inferido pelo ritmo, glicogênio não medido), TARNOPOLSKY1990 (6 + 6, 15,5 km a ~65% do VO₂máx: RER 0,87 × 0,94, homens +25% de glicogênio; correlação).
 * A volta da Marina é fictícia; a queda desenhada é a média de Smyth.
 */

export interface WallStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

const SMYTH = 'Smyth 2021 (PLoS One)';

export const WALL_STEPS: readonly WallStep[] = [
    {
        tab: 'O plano',
        headline: 'Um ritmo só, do 0 ao 42',
        text: 'Marina (caso fictício) planejou ritmo constante a prova inteira. É contra esse tipo de linha que Smyth mede o muro: não pela sensação do corredor, mas por uma queda de ritmo sustentada no fim da prova, lida nos tempos de passagem.',
        sources: [SMYTH],
    },
    {
        tab: 'Km 32',
        headline: 'No km 32, o ritmo desaba',
        text: 'Quem bate no muro fica cerca de 40% mais lento: cada km leva ~40% mais tempo que no ritmo do início (homens; 37% nas mulheres). Em velocidade, é cair para ~71% da planejada (1 ÷ 1,4). E dura uns 10 km (10,7 e 9,6 km): o último quarto da maratona inteiro mais devagar.',
        sources: [SMYTH],
    },
    {
        tab: 'Quantos batem',
        headline: 'Um em cada quatro homens',
        text: 'Mais de 4 milhões de registros de maratonas recreativas, 1.928.813 corredores: 28% dos homens e 17% das mulheres bateram no muro (OR 1,43). Combina com Tarnopolsky 1990 (6 + 6 igualmente treinados, 15,5 km a ~65% do VO₂máx): elas usaram mais gordura (RER 0,87 × 0,94) e eles, 25% mais glicogênio. Mas é correlação.',
        sources: [SMYTH, 'Tarnopolsky 1990 (J Appl Physiol)'],
    },
    {
        tab: 'Quem arrisca',
        headline: 'Quem arrisca o ritmo paga',
        text: 'O muro foi mais comum nos anos em torno de um recorde pessoal, quando o corredor arrisca um ritmo mais alto. Limite central: o muro foi inferido só pelo ritmo; o estudo não mediu glicogênio nem glicemia. A causa energética é a hipótese, não a medida.',
        sources: [SMYTH],
    },
];

/** Velocidade relativa ao ritmo planejado (1 = plano), por km. Ritmo (min/km) 40% mais lento = velocidade ÷ 1,4 ≈ 71%. */
export const SLOW = 1 / 1.4;
export const planSpeed = (): number => 1;
export const wallSpeed = (km: number): number => {
    if (km <= 30) return 1;
    if (km >= 32.5) return SLOW;
    return 1 - ((km - 30) / 2.5) * (1 - SLOW);
};

export const WAFFLES = [
    { who: 'homens', pct: 28 },
    { who: 'mulheres', pct: 17 },
] as const;

export const WALL_LEDGER: readonly { at: number; cells: readonly [string, string, string] }[] = [
    { at: 1, cells: ['min/km a mais', '+40%', '+37%'] },
    { at: 1, cells: ['por quanto', '10,7 km', '9,6 km'] },
    { at: 2, cells: ['bateram no muro', '28%', '17%'] },
    { at: 2, cells: ['razão de chances', 'OR 1,43', ''] },
];

export const WALL_CHIPS: readonly string[] = [
    'a queda desenhada é a média de Smyth 2021',
    'a queda desenhada é a média de Smyth 2021',
    'observacional · N = 1.928.813',
    'observacional · glicogênio não medido',
];
