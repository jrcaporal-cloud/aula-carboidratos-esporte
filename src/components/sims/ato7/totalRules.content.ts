/** Slide 123 · 24 Horas: o Total Manda. Números: dossiê 04 (KEIZER1987, BURKE1996, BURKE1993, BURKE2003). */

export type Layout = 'packed' | 'meals' | 'snacks';
export type Alcohol = 'none' | 'replace' | 'add';
export type RowIcon = 'solid' | 'liquid' | 'meals' | 'snacks' | 'plate' | 'wine';

export interface RowSpec {
    label: string;
    icon: RowIcon;
    layout: Layout;
    lowGi?: boolean;
    alcohol?: Alcohol;
    value: string;
}

export interface Rule {
    phrase: string;
    design: string;
    /** O que o número da direita mede. */
    measure: string;
    a: RowSpec;
    b: RowSpec;
    verdict: string;
    /** Diferença real entre os braços (muda a cor do veredito). */
    differs: boolean;
}

export const RULES: readonly Rule[] = [
    {
        phrase: 'Sólido ou líquido? Com a mesma quantidade de carboidrato, tanto faz.',
        design: 'Keizer 1987 · cruzado · n = 8',
        measure: 'glicogênio às 5 h (de ~70), mmol/kg',
        a: { label: 'sólido', icon: 'solid', layout: 'packed', value: '198' },
        b: { label: 'líquido', icon: 'liquid', layout: 'packed', value: '192' },
        verdict: 'igual',
        differs: false,
    },
    {
        phrase: 'Quatro refeições grandes ou dezesseis lanches? Com 10 g/kg no dia, sem diferença.',
        design: 'Burke 1996 · n = 8 triatletas',
        measure: 'glicogênio às 24 h, mmol/kg',
        a: { label: '4 refeições', icon: 'meals', layout: 'meals', value: '74,1' },
        b: { label: '16 lanches', icon: 'snacks', layout: 'snacks', value: '94,5' },
        verdict: 'diferença não significativa',
        differs: false,
    },
    {
        phrase: 'Na recuperação de 24 h, alimento de alto IG repõe mais.',
        design: 'Burke 1993 · cruzado · n = 5 · 10 g/kg',
        measure: 'aumento do glicogênio em 24 h, mmol/kg',
        a: { label: 'alto IG', icon: 'plate', layout: 'packed', value: '106' },
        b: { label: 'baixo IG', icon: 'plate', layout: 'packed', lowGi: true, value: '71,5' },
        verdict: 'alto IG repõe mais · P = 0,02',
        differs: true,
    },
    {
        phrase: 'Álcool no lugar do carboidrato: menos glicogênio no dia seguinte.',
        design: 'Burke 2003 · cruzado · n = 9 · 24 h',
        measure: 'glicogênio às 24 h, mmol/kg',
        a: { label: 'controle', icon: 'plate', layout: 'packed', value: '82' },
        b: { label: 'álcool no lugar', icon: 'wine', layout: 'packed', alcohol: 'replace', value: '68' },
        verdict: 'menos glicogênio',
        differs: true,
    },
    {
        phrase: 'Álcool somado, com o carboidrato intacto: 24 h iguais. O estrago é tirar o CHO do prato.',
        design: 'Burke 2003 · cruzado · n = 9 · 24 h',
        measure: 'glicogênio às 24 h, mmol/kg',
        a: { label: 'controle', icon: 'plate', layout: 'packed', value: '82' },
        b: { label: 'álcool somado', icon: 'wine', layout: 'packed', alcohol: 'add', value: '85' },
        verdict: 'igual',
        differs: false,
    },
];

/** Blocos do prato (pictograma, não dose): 16 de carboidrato; 5 de álcool trocam ou somam. */
export const CHO_TILES = 16;
export const ALC_TILES = 5;

export const SOURCE = 'Keizer HA et al. Int J Sports Med 1987;8(2):99-104 · Burke LM et al. Am J Clin Nutr 1996;64(1):115-9 · Burke LM et al. J Appl Physiol 1993;75(2):1019-23 · Burke LM et al. J Appl Physiol 2003;95(3):983-90';
