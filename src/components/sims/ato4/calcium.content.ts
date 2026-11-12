/**
 * Slide 66 · O cálcio que falha. Fontes: dossiê 01/02 · ORTENBLAD2011 (n = 10 esquiadores de elite; braço 540 → 167
 * mmol/kg ps = 31%, Ca²⁺ 85%; perna 485 → 331 = 71%, Ca²⁺ sem mudança; +4 h CHO 59% e Ca²⁺ normal; água 29% e 77%,
 * normal só após mais 18 h com CHO), GEJL2014 (n = 14 triatletas; 32% = 225 mmol/kg ps, 86%; CHO 61% e normal;
 * r = 0,30; Wpeak −5,5 a −8,9%), ORTENBLAD2013 (revisão: causa e efeito não estabelecidos; acoplamento
 * excitação-contração). r² ≈ 0,09 é conta nossa.
 */

export interface CalciumStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

const ORT11 = 'Ørtenblad 2011 (J Physiol)';
const ORT13 = 'Ørtenblad, Westerblad & Nielsen 2013 (revisão)';

export const CALCIUM_STEPS: readonly CalciumStep[] = [
    {
        tab: 'O gatilho',
        headline: 'Sem cálcio, a fibra não puxa',
        text: 'O potencial de ação desce pelo túbulo T; o sensor de voltagem (DHPR) abre o canal RyR1 da cisterna do retículo; o Ca²⁺ sai, liga a troponina C e a miosina puxa a actina. A bomba SERCA devolve o Ca²⁺ ao retículo, gastando ATP.',
        sources: [ORT13],
    },
    {
        tab: '1 h de esqui',
        headline: 'O braço seca; o cálcio cai',
        text: '10 esquiadores de cross-country de elite (VO₂máx 72), prova de ~1 h. No tríceps, o glicogênio foi de 540 a 167 mmol/kg ps (31%) e a taxa de liberação de Ca²⁺ do retículo caiu a 85%. Na perna, 485 → 331 (71%), e o Ca²⁺ não mudou.',
        sources: [ORT11],
    },
    {
        tab: '4 h depois',
        headline: 'A recuperação decide',
        text: 'Recuperação sorteada nas 4 h seguintes. Com carboidrato, o glicogênio voltou a 59% e a liberação de Ca²⁺ normalizou. Só com água, 29% e 77%; o Ca²⁺ só voltou ao normal depois de mais 18 h com carboidrato (biópsia de 22 h).',
        sources: [ORT11],
    },
    {
        tab: 'Replicação',
        headline: 'Outro grupo, mesmo achado',
        text: 'Gejl 2014: 14 triatletas, 4 h de ciclismo. Glicogênio a 32% (225 mmol/kg ps) e Ca²⁺ a 86%; a potência de pico caiu 5,5–8,9% e só voltou em 4 h com carboidrato. Mas r = 0,30: o glicogênio explica cerca de 9% da variação do Ca²⁺.',
        sources: ['Gejl 2014 (MSSE)'],
    },
    {
        tab: 'Causa?',
        headline: 'Junto não é causa',
        text: 'O próprio grupo, em 2013: uma relação direta de causa e efeito "ainda não foi estabelecida". Limites: Ca²⁺ medido in vitro, em vesículas do retículo; n = 10 e 14, só homens; correlação fraca. É a melhor hipótese mecanística, não um fato.',
        sources: [ORT13],
    },
];

/** Grupo de barras do gráfico (% do valor antes). `gly` null = o slide não mostra o glicogênio desse ponto. */
export interface BarGroup {
    label: string;
    gly: number | null;
    ca: number;
    /** Texto do Ca²⁺ quando o estudo diz "normal" em vez de um número. */
    caText?: string;
    at: number;
}

export const BAR_GROUPS: readonly BarGroup[] = [
    { label: 'antes', gly: 100, ca: 100, at: 0 },
    { label: 'fim', gly: 31, ca: 85, at: 1 },
    { label: '4 h CHO', gly: 59, ca: 100, caText: 'normal', at: 2 },
    { label: '4 h água', gly: 29, ca: 77, at: 2 },
    { label: '22 h', gly: null, ca: 100, caText: 'normal', at: 2 },
    { label: 'Gejl, fim', gly: 32, ca: 86, at: 3 },
];

export interface CaLedgerRow { at: number; cells: readonly [string, string, string] }

export const CA_LEDGER: readonly CaLedgerRow[] = [
    { at: 1, cells: ['braço, fim', '167 · 31%', '85%'] },
    { at: 1, cells: ['perna, fim', '331 · 71%', 'igual'] },
    { at: 2, cells: ['braço +4 h, CHO', '59%', 'normal'] },
    { at: 2, cells: ['braço +4 h, água', '29%', '77%'] },
    { at: 3, cells: ['Gejl, fim (4 h)', '225 · 32%', '86%'] },
];

export const CA_CHIPS: readonly string[] = [
    'acoplamento: revisão',
    'n = 10 esquiadores de elite',
    'n = 10 · sorteio CHO × água',
    'n = 14 triatletas',
    'in vitro · associação',
];
