/**
 * Slide 40 · Duas Chaves para a Mesma Porta. Fonte única dos textos, do gráfico e do estado da cena.
 * Gráfico: UMA série de LUND1995 (sóleo de rato isolado, a série das chaves somadas): transporte 9,0 · 5,6 · 11,5
 * µmol·mL⁻¹·h⁻¹ e GLUT4 na superfície 3,15 · 1,75 · 4,10 pmol/g. A série da wortmanina (8,8 → 1,4; 4,4 → 4,1) é outro
 * experimento: entra só em palavras na tela e com número nas notas. As 48 h (MIKINES1988, RICHTER1989) foram para as notas.
 * Cascatas: RICHTER2013, Lehninger cap. 12, Sakamoto & Holman 2008; debate AMPK × Rac1: SYLOW2017, ONEILL2011.
 */

export type KeyState = 'off' | 'on';

export interface Glut4Step {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
    insulin: KeyState;
    contraction: KeyState;
    /** Vesículas de GLUT4 na superfície (esquema, na proporção do GLUT4 medido: 3,15 · 1,75 · 4,10 pmol/g → 6 · 3 · 8). */
    docked: number;
}

const LUND = 'Lund 1995';

export const GLUT4_STEPS: readonly Glut4Step[] = [
    {
        tab: 'A porta',
        headline: 'Uma porta só: o GLUT4',
        text: 'A glicose entra na fibra por difusão facilitada, pelo GLUT4. Em repouso, ele fica guardado em vesículas dentro da fibra; para a glicose passar, a vesícula precisa subir e se fundir à sarcolema ou ao túbulo T. Duas chaves fazem isso.',
        sources: ['Richter & Hargreaves 2013'],
        insulin: 'off', contraction: 'off', docked: 0,
    },
    {
        tab: 'Insulina',
        headline: 'Chave 1: insulina, pela PI3K',
        text: 'O receptor ativa o IRS-1 e a PI3K; a Akt fosforila a AS160, que solta o freio das Rab nas vesículas, e o GLUT4 sobe. No sóleo de rato isolado (Lund 1995), insulina máxima levou o transporte de glicose a 9,0.',
        sources: ['Lehninger 2017 (cap. 12)', 'Sakamoto & Holman 2008', LUND],
        insulin: 'on', contraction: 'off', docked: 6,
    },
    {
        tab: 'Contração',
        headline: 'Chave 2: contração, outro caminho',
        text: 'Ca²⁺ do retículo, AMPK e Rac1 abrem a mesma porta sem passar pela PI3K: com a PI3K bloqueada (wortmanina), o efeito da insulina quase sumiu e o da contração ficou igual. Sozinha, a contração deu 5,6. Qual sinal é indispensável segue em debate (Sylow 2017 × O’Neill 2011).',
        sources: ['Sylow 2017 (Diabetes)', 'O’Neill 2011'],
        insulin: 'off', contraction: 'on', docked: 3,
    },
    {
        tab: 'As duas somam',
        headline: 'Juntas, as chaves somam',
        text: 'Insulina e contração juntas: 11,5, mais do que qualquer uma sozinha; o GLUT4 na superfície seguiu o mesmo desenho (4,10 contra 3,15 e 1,75 pmol/g). Somar indica vias distintas: por isso o exercício capta glicose até no músculo resistente à insulina.',
        sources: [LUND, 'Sylow 2017 (revisão)'],
        insulin: 'on', contraction: 'on', docked: 8,
    },
];

/** Selos do canto, por passo. */
export const GLUT4_CHIPS: readonly (readonly string[])[] = [
    ['revisão'],
    ['cascata: livro-texto'],
    ['AMPK × Rac1: debate'],
    [],
];

/** Cores ficam no componente (por `tone`): aqui só o significado. */
export type Glut4Tone = 'glucose' | 'insulin' | 'contraction';

/** O gráfico do painel: uma barra por chave, todas da mesma série de Lund 1995. */
export interface Glut4Bar {
    at: number;
    label: string;
    value: number;
    text: string;
    tone: Glut4Tone;
}

export const GLUT4_BARS: readonly Glut4Bar[] = [
    { at: 1, label: 'só insulina', value: 9.0, text: '9,0', tone: 'insulin' },
    { at: 2, label: 'só contração', value: 5.6, text: '5,6', tone: 'contraction' },
    { at: 3, label: 'as duas', value: 11.5, text: '11,5', tone: 'glucose' },
];

export const GLUT4_BAR_MAX = 12;
export const GLUT4_CHART_TITLE = 'Lund 1995 · sóleo de rato isolado';
export const GLUT4_CHART_UNIT = 'transporte de glicose, µmol·mL⁻¹·h⁻¹';
