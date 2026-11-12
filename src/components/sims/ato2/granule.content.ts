/**
 * Slide 22 · A Árvore de Glicose. Modelo de camadas do glicogênio (Roach et al. 2012):
 * cadeias de ~13 glicoses, o número de cadeias dobra a cada camada, máximo teórico de 12 camadas
 * (~55.000 glicoses, ~44 nm); no músculo, média de ~25 nm (~7 camadas).
 */
export const MAX_TIERS = 12;

export interface GranuleStep {
    tab: string;
    /** Camadas desenhadas neste passo. */
    tiers: number;
    line: string;
    /** A casca externa acende (metade da glicose). */
    shell: boolean;
    /** Mostra o tamanho real médio no músculo. */
    real: boolean;
}

export const STEPS: readonly GranuleStep[] = [
    {
        tab: 'Glicogenina', tiers: 1, shell: false, real: false,
        line: 'Tudo começa numa proteína, a glicogenina, que prende em si mesma a primeira cadeia de glicose.',
    },
    {
        tab: 'Ramos', tiers: 4, shell: false, real: false,
        line: 'Cadeias de ~13 glicoses abrem ramos (α-1,6). No modelo de camadas, o número de cadeias dobra a cada camada.',
    },
    {
        tab: '12 camadas', tiers: 12, shell: false, real: false,
        line: 'No máximo teórico são 12 camadas: cerca de 55.000 glicoses numa partícula de ~44 nm.',
    },
    {
        tab: 'A casca', tiers: 12, shell: true, real: false,
        line: 'A última camada guarda metade da glicose: são as pontas que a fosforilase alcança primeiro.',
    },
    {
        tab: 'No músculo', tiers: 7, shell: false, real: true,
        line: 'No músculo, a média real é ~25 nm (cerca de 7 camadas), num contínuo de 10 a 44 nm.',
    },
];

/** Glicoses por camada no modelo (cadeias dobram: 1, 2, 4 … 2048), em fração da camada 12. */
export const TIER_SHARE: readonly number[] = Array.from({ length: MAX_TIERS }, (_, i) => 2 ** i / 2 ** (MAX_TIERS - 1));

export const SOURCE = 'Roach PJ et al. Biochem J 2012;441:763-87 · Marchand I et al. J Appl Physiol 2002;93:1598-607';
