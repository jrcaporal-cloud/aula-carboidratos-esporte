/**
 * Slide 22 · A Árvore de Glicose. Modelo de camadas do glicogênio (Roach et al. 2012, revisão bioquímica):
 * glicogenina se autoglicosila numa tirosina até 10–20 glicoses; cadeias de ~13 glicoses; ramificação α-1,6
 * pela enzima ramificadora; número de cadeias dobra por camada; máximo teórico de 12 camadas (~55.000 glicoses,
 * ~44 nm); camada externa = 50% da glicose. A quebra (fosforilase, desramificadora) fica no slide de Leloir.
 * No músculo, média ~25 nm (~7 camadas); contínuo de 10 a 44 nm (Marchand 2002, MET, 11 homens).
 */
export const MAX_TIERS = 12;

export interface GranuleStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    sources: readonly string[];
}

const ROACH = 'Roach 2012 (revisão)';

export const STEPS: readonly GranuleStep[] = [
    {
        tab: 'Glicogenina', color: '#FDBA74',
        headline: 'Tudo começa numa proteína',
        text: 'A glicogenina prende a primeira glicose numa tirosina dela mesma e alonga a cadeia até 10–20 glicoses, com UDP-glicose como doador. Esse é o primer: daí em diante, quem alonga (α-1,4) é a glicogênio sintase.',
        sources: [ROACH],
    },
    {
        tab: 'Ramos', color: '#C4B5FD',
        headline: 'Cada cadeia carrega dois ramos',
        text: 'A enzima ramificadora cria os pontos α-1,6. As cadeias têm ~13 glicoses e, no modelo de camadas, cada cadeia interna carrega dois ramos. Por isso o número de cadeias dobra a cada camada: 1, 2, 4, 8…',
        sources: [ROACH],
    },
    {
        tab: '12 camadas', color: '#C4B5FD',
        headline: 'No máximo, 12 camadas',
        text: 'Dobrando a cada camada, o modelo chega a um teto teórico de 12 camadas: ~55.000 glicoses, ~10⁷ kDa, ~44 nm. E cada camada nova tem mais cadeias do que todas as de dentro somadas.',
        sources: [ROACH],
    },
    {
        tab: 'A casca', color: '#F59E0B',
        headline: 'Metade da glicose fica na casca',
        text: 'A camada externa guarda 50% da glicose do grânulo, em cadeias sem ramo: um estoque com muitas pontas expostas, ao alcance das enzimas.',
        sources: [ROACH, 'Marchand 2002 (MET, n = 11)'],
    },
];

/**
 * % da glicose do grânulo em cada camada no modelo (cálculo): as cadeias dobram (1, 2, 4 … 2048), todas com ~13 glicoses,
 * então a camada k guarda 2^(k−1) / (2^12 − 1). A camada 12 dá 50,0%, o número do Roach.
 */
const TOTAL_CHAINS = 2 ** MAX_TIERS - 1;
export const TIER_PCT: readonly number[] = Array.from({ length: MAX_TIERS }, (_, i) => (100 * 2 ** i) / TOTAL_CHAINS);
