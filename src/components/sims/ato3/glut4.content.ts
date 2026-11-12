/** Slide 40 · Duas Chaves para a Mesma Porta. Números: LUND1995, SYLOW2017-REV, MIKINES1988, RICHTER1989 (dossiê 01). */

export type KeyState = 'off' | 'on' | 'blocked';

export interface Glut4Step {
    phrase: string;
    insulin: KeyState;
    contraction: KeyState;
    /** Quantas glicoses atravessam a porta neste passo (0 = porta fechada). */
    pass: number;
    source: string;
}

export const GLUT4_STEPS: readonly Glut4Step[] = [
    {
        phrase: 'No exercício, o músculo capta até 50 vezes mais glicose. E ela só entra por uma porta: o GLUT4.',
        insulin: 'off', contraction: 'off', pass: 0,
        source: 'Sylow L et al. Nat Rev Endocrinol 2017;13:133-48 (revisão).',
    },
    {
        phrase: 'A insulina abre a porta pela via da PI3K. A wortmanina bloqueia a PI3K, e essa chave para de girar.',
        insulin: 'blocked', contraction: 'off', pass: 0,
        source: 'Lund S et al. PNAS 1995;92:5817-21 · transporte de glicose, µmol·mL⁻¹·h⁻¹.',
    },
    {
        phrase: 'A contração abre a mesma porta por outro caminho, e a wortmanina não a trava.',
        insulin: 'blocked', contraction: 'on', pass: 2,
        source: 'Lund S et al. PNAS 1995;92:5817-21 · transporte de glicose, µmol·mL⁻¹·h⁻¹.',
    },
    {
        phrase: 'As duas chaves juntas abrem mais que cada uma sozinha: são vias distintas.',
        insulin: 'on', contraction: 'on', pass: 5,
        source: 'Lund 1995 · Sylow L et al. Diabetes 2017 · O’Neill HM et al. PNAS 2011.',
    },
    {
        phrase: 'Depois do treino, a chave da insulina fica mais sensível por ~48 h, e só no músculo que trabalhou.',
        insulin: 'on', contraction: 'off', pass: 3,
        source: 'Mikines KJ et al. Am J Physiol 1988;254:E248-59 · Richter EA et al. J Appl Physiol 1989;66:876-85.',
    },
];

/** Barras do LUND1995 (sóleo de rato isolado). O experimento da soma é outro lote: 5,6 · 9,0 · 11,5. */
export const BLOCK_ROWS = [
    { label: 'insulina', value: 8.8, text: '8,8', key: 'ins' },
    { label: 'insulina + wortmanina', value: 1.4, text: '1,4', key: 'insW' },
    { label: 'contração', value: 4.4, text: '4,4', key: 'con' },
    { label: 'contração + wortmanina', value: 4.1, text: '4,1', key: 'conW' },
] as const;

export const SUM_ROWS = [
    { label: 'só contração', value: 5.6, text: '5,6', key: 'c' },
    { label: 'só insulina', value: 9.0, text: '9,0', key: 'i' },
    { label: 'as duas juntas', value: 11.5, text: '11,5', key: 'ci' },
] as const;

export const BAR_MAX = 12;
