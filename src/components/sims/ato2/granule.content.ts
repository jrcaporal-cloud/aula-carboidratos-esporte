/**
 * Slide 22 · A Árvore de Glicose. Modelo de camadas do glicogênio (Roach et al. 2012, revisão bioquímica):
 * glicogenina se autoglicosila numa tirosina até 10–20 glicoses; cadeias de ~13 glicoses; ramificação α-1,6
 * pela enzima ramificadora; número de cadeias dobra por camada; máximo teórico de 12 camadas (~55.000 glicoses,
 * ~44 nm); camada externa = 50% da glicose; fosforilase para 4 glicoses antes do ramo (desramificadora).
 * No músculo, média ~25 nm (~7 camadas); contínuo de 10 a 44 nm (Marchand 2002, MET, 11 homens).
 */
export const MAX_TIERS = 12;

export interface GranuleStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    /** Camadas acesas no grânulo inteiro. */
    tiers: number;
    sources: readonly string[];
}

const ROACH = 'Roach 2012 (revisão)';

export const STEPS: readonly GranuleStep[] = [
    {
        tab: 'Glicogenina', tiers: 1, color: '#FDBA74',
        headline: 'Tudo começa numa proteína',
        text: 'A glicogenina prende a primeira glicose numa tirosina dela mesma e alonga a cadeia até 10–20 glicoses, com UDP-glicose como doador. Daí em diante, quem alonga (α-1,4) é a glicogênio sintase.',
        sources: [ROACH],
    },
    {
        tab: 'Ramos', tiers: 4, color: '#C4B5FD',
        headline: 'Cada cadeia carrega dois ramos',
        text: 'A enzima ramificadora cria os pontos α-1,6. As cadeias têm ~13 glicoses e, no modelo de camadas, cada cadeia interna carrega dois ramos: o número de cadeias dobra a cada camada (1, 2, 4, 8…).',
        sources: [ROACH],
    },
    {
        tab: '12 camadas', tiers: 12, color: '#C4B5FD',
        headline: 'No máximo, 12 camadas',
        text: 'O modelo tem um teto teórico de 12 camadas: ~55.000 glicoses, ~10⁷ kDa, ~44 nm. Como as cadeias dobram a cada camada, a de fora é a mais cheia de todas.',
        sources: [ROACH],
    },
    {
        tab: 'A casca', tiers: 12, color: '#F59E0B',
        headline: 'Metade da glicose está na casca',
        text: 'A camada externa guarda 50% da glicose, em cadeias sem ramo. A fosforilase solta glicose-1-P pelas pontas e para 4 glicoses antes de um ramo; a desramificadora desfaz o ramo e libera glicose livre.',
        sources: [ROACH],
    },
    {
        tab: 'No músculo', tiers: 7, color: '#C4B5FD',
        headline: 'O grânulo real é menor',
        text: 'Na microscopia eletrônica (vasto lateral, 11 homens em repouso), as partículas vão de 10 a 44 nm num contínuo, média ~25 nm (~7 camadas). O próprio Roach chama o modelo de “altamente estilizado”.',
        sources: [ROACH, 'Marchand 2002 (MET, n = 11)'],
    },
];

/** Selos do canto, por passo. */
export const CHIPS: readonly (readonly string[])[] = [[], [], [], [], ['MET · n = 11 · repouso']];

/** Glicoses por camada no modelo (cadeias dobram: 1, 2, 4 … 2048), em fração da camada 12. */
export const TIER_SHARE: readonly number[] = Array.from({ length: MAX_TIERS }, (_, i) => 2 ** i / 2 ** (MAX_TIERS - 1));
