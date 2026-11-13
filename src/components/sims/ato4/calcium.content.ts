/**
 * Slide 66 · O cálcio que falha. Fontes: dossiê 01/02 · ORTENBLAD2011 (n = 10 esquiadores de elite; braço 540 → 167
 * mmol/kg ps = 31%, Ca²⁺ 85%; perna 485 → 331 = 71%, Ca²⁺ sem mudança; +4 h CHO 59% e Ca²⁺ normal; água 29% e 77%,
 * normal só após mais 18 h com CHO), GEJL2014 (n = 14 triatletas; 32% = 225 mmol/kg ps, 86%; CHO 61% e normal;
 * r = 0,30; Wpeak −5,5 a −8,9%), ORTENBLAD2013 (revisão: causa e efeito não estabelecidos; acoplamento
 * excitação-contração). r² ≈ 0,09 é conta nossa. Sem número de glicogênio às 22 h no dossiê: o slide não mostra.
 */

export interface CalciumStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

const ORT11 = 'Ørtenblad 2011 (J Physiol)';
const ORT13 = 'Ørtenblad, Westerblad & Nielsen 2013 (revisão)';
const GEJL14 = 'Gejl 2014 (MSSE)';

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
        text: '10 esquiadores de elite (VO₂máx 72), prova de ~1 h. No tríceps, o glicogênio foi de 540 a 167 mmol/kg ps (31%) e a liberação de Ca²⁺ do retículo caiu a 85%. A perna é o controle: 71% de glicogênio e Ca²⁺ sem mudança. O que acompanhou o Ca²⁺ foi a fração intramiofibrilar, ~10–15% do glicogênio total.',
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
        text: 'Gejl 2014: 14 triatletas, 4 h de ciclismo. Glicogênio a 32% (225 mmol/kg ps) e Ca²⁺ a 86%. Com 4 h de carboidrato, 61% e Ca²⁺ normal; com água, os dois ficaram baixos. A potência de pico caiu 5,5–8,9% e só voltou em 4 h com carboidrato.',
        sources: [GEJL14],
    },
    {
        tab: 'Causa?',
        headline: 'Junto não é causa',
        text: 'No Gejl, r = 0,30; ao quadrado, r² ≈ 0,09: o glicogênio acompanha ~9% da variação do Ca²⁺ (conta nossa). Ninguém viu o glicogênio abrir o RyR1: esse elo é o "?". O grupo, em 2013: causa e efeito "ainda não foi estabelecida". Ca²⁺ medido in vitro; só homens.',
        sources: [GEJL14, ORT13],
    },
];

export interface CaLedgerRow { at: number; cells: readonly [string, string]; caveat?: boolean }

/** Livro-caixa do painel: um elo por linha, glicogênio → Ca²⁺ liberado (% do valor antes). */
export const CA_LEDGER: readonly CaLedgerRow[] = [
    { at: 1, cells: ['braço, fim da prova', '31% → 85%'] },
    { at: 1, cells: ['perna (controle)', '71% → igual'] },
    { at: 2, cells: ['braço +4 h, CHO', '59% → normal'] },
    { at: 2, cells: ['braço +4 h, água', '29% → 77%'] },
    { at: 3, cells: ['Gejl, fim (4 h)', '32% → 86%'] },
    { at: 4, cells: ['Gejl, r', '0,30 → r² ≈ 0,09'], caveat: true },
];

export const CA_CHIPS: readonly string[] = [
    'acoplamento: revisão',
    'n = 10 esquiadores de elite',
    'n = 10 · sorteio CHO × água',
    'n = 14 triatletas',
    'in vitro · associação',
];

/** Linha das faixas 2–4: glicogênio total e liberação de Ca²⁺ do RS, em % do valor antes. `null` = o estudo diz em palavras. */
export interface GlyCaRow { label: string; gly: number; ca: number | null; caText?: string }

export const ARM_ROWS: readonly GlyCaRow[] = [
    { label: 'braço', gly: 31, ca: 85 },
    { label: 'perna (controle)', gly: 71, ca: null, caText: 'sem mudança' },
];

export const RECOVERY_ROWS: readonly GlyCaRow[] = [
    { label: 'braço, CHO', gly: 59, ca: null, caText: 'normal' },
    { label: 'braço, água', gly: 29, ca: 77 },
];

export const GEJL_ROWS: readonly GlyCaRow[] = [
    { label: 'fim dos 4 h', gly: 32, ca: 86 },
];
