/**
 * Slide 40 · Duas Chaves para a Mesma Porta. Fonte única dos textos, do livro-caixa e do estado da cena.
 * Números: LUND1995, SYLOW2017-REV, MIKINES1988, RICHTER1989 (dossiê 01). Cascatas: RICHTER2013 (Ca²⁺/AMPK proximal;
 * Rab/SNARE distal), Lehninger cap. 12 (receptor → IRS-1 → PI3K → Akt) e Sakamoto & Holman 2008 (AS160 = Rab-GAP, alvo da Akt).
 */

export type KeyState = 'off' | 'on' | 'blocked';

export interface Glut4Step {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
    insulin: KeyState;
    contraction: KeyState;
    /** Quantas vesículas de GLUT4 estão na superfície (sarcolema + túbulo T). */
    docked: number;
}

const LUND = 'Lund 1995';

export const GLUT4_STEPS: readonly Glut4Step[] = [
    {
        tab: 'A porta',
        headline: 'Uma porta só: o GLUT4',
        text: 'A glicose entra na fibra por difusão facilitada, pelo GLUT4. Em repouso, ele fica em vesículas dentro da fibra. Na contração, sobe para a sarcolema e para os túbulos T. No exercício, a captação aumenta até 50×: entrega, transporte e metabolismo sobem juntos.',
        sources: ['Richter & Hargreaves 2013', 'Sylow 2017 (revisão)'],
        insulin: 'off', contraction: 'off', docked: 0,
    },
    {
        tab: 'Insulina',
        headline: 'Chave 1: insulina, pela PI3K',
        text: 'O receptor ativa o IRS-1 e a PI3K; a Akt fosforila a AS160, que solta o freio das Rab nas vesículas. Lund bloqueou a PI3K com wortmanina: o transporte por insulina caiu de 8,8 para 1,4 e o GLUT4 na superfície, de 2,79 para 0,49 pmol/g.',
        sources: ['Lehninger 2017 (cap. 12)', 'Sakamoto & Holman 2008', LUND],
        insulin: 'blocked', contraction: 'off', docked: 0,
    },
    {
        tab: 'Contração',
        headline: 'Chave 2: contração, outro caminho',
        text: 'Ca²⁺ do retículo, AMPK e Rac1 abrem a mesma porta sem a PI3K. Com wortmanina, a contração seguiu igual: 4,4 × 4,1. Qual sinal é indispensável segue em debate: em camundongo, Rac1 pesou e α2-AMPK não (Sylow 2017); no knockout β1β2, a AMPK fez falta (O’Neill 2011).',
        sources: ['Sylow 2017 (Diabetes)', 'O’Neill 2011'],
        insulin: 'blocked', contraction: 'on', docked: 4,
    },
    {
        tab: 'As duas somam',
        headline: 'Juntas, as chaves somam',
        text: 'Noutro lote, insulina máxima com contração deu 11,5, contra 9,0 e 5,6 sozinhas; o GLUT4 na superfície, 4,10 pmol/g, contra 3,15 e 1,75. Efeitos que somam indicam vias distintas: por isso o exercício capta glicose mesmo no músculo resistente à insulina.',
        sources: [LUND],
        insulin: 'on', contraction: 'on', docked: 8,
    },
    {
        tab: '48 horas',
        headline: 'A insulina rende mais por ~48 h',
        text: 'Mikines 1988 (n = 7, clamps após 60 min a 150 W): Km da insulina 52 → 40 µU/mL às 48 h; some em 5 dias (n = 3). Richter 1989 (uma perna, n = 6): só a coxa treinada captou mais. A pressa de comer pós-treino pesa com outra sessão no mesmo dia.',
        sources: ['Mikines 1988', 'Richter 1989'],
        insulin: 'on', contraction: 'on', docked: 8,
    },
];

/** Selos do canto, por passo. */
export const GLUT4_CHIPS: readonly (readonly string[])[] = [
    ['revisões'],
    ['cascata: livro-texto + revisão'],
    ['AMPK × Rac1: em debate'],
    [],
    ['clamp · n = 7', 'uma perna · n = 6'],
];

/** Cores ficam no componente (por `tone`): aqui só o significado. */
export type Glut4Tone = 'glucose' | 'insulin' | 'contraction';

/** O livro de bancada: cada linha entra num passo e fica. */
export interface Glut4Row {
    at: number;
    label: string;
    value: string;
    tone: Glut4Tone;
}

export const GLUT4_ROWS: readonly Glut4Row[] = [
    { at: 0, label: 'captação no exercício', value: 'até 50×', tone: 'glucose' },
    { at: 1, label: 'insulina → + wortmanina', value: '8,8 → 1,4', tone: 'insulin' },
    { at: 2, label: 'contração → + wortmanina', value: '4,4 → 4,1', tone: 'contraction' },
    { at: 3, label: 'as duas (só ins. · só contr.)', value: '11,5 (9,0 · 5,6)', tone: 'glucose' },
    { at: 4, label: 'Km da insulina, 48 h depois', value: '52 → 40', tone: 'insulin' },
];

/** Legenda das unidades sob o livro (cresce com as linhas). */
export const GLUT4_UNITS: readonly string[] = [
    'até 50×: revisão (Sylow 2017)',
    'transporte em µmol·mL⁻¹·h⁻¹, sóleo de rato isolado',
    'transporte em µmol·mL⁻¹·h⁻¹, sóleo de rato isolado',
    'transporte em µmol·mL⁻¹·h⁻¹, sóleo de rato isolado',
    'µmol·mL⁻¹·h⁻¹ (rato) · Km em µU/mL (clamp, humanos)',
];
