/** Slides 110–111 · bochecho. CART2004I, CART2004B, CHAM2009, BRIE2019, LANE2013, TROM2015 (dossiê 03, bloco H). */

export interface TimeRow {
    label: string;
    min: number;
    text: string;
    strong: boolean;
}

export const IV_ROWS: readonly TimeRow[] = [
    { label: 'glicose na veia', min: 59.9, text: '59,90 min', strong: true },
    { label: 'soro fisiológico', min: 60.04, text: '60,04 min', strong: false },
];

export const RINSE_ROWS: readonly TimeRow[] = [
    { label: 'bochecho, cuspido', min: 59.57, text: '59,57 min', strong: true },
    { label: 'água', min: 61.37, text: '61,37 min', strong: false },
];

/** Eixo dos cronômetros (zoom honesto: o eixo não começa no zero). */
export const AXIS = [58, 62] as const;

export const BRAINS = [
    { name: 'glicose', taste: 'doce', active: true },
    { name: 'maltodextrina', taste: 'sem gosto doce', active: true },
    { name: 'sacarina', taste: 'doce, sem carboidrato', active: false },
] as const;

export const RINSE_LEADS = [
    'Glicose direto na veia, 1 g/min: glicemia de 12,4 contra 5,9 mmol/L. O contrarrelógio de 1 h não muda.',
    'Agora sem engolir nada: 5 s de bochecho com maltodextrina, cuspido. Quase 2 minutos mais rápido.',
    'Na ressonância funcional, o carboidrato na boca acende áreas de recompensa. O gosto doce sozinho, não.',
] as const;

export const RINSE_DESIGN = [
    'ECR cruzado · n = 6 · contrarrelógio ~1 h',
    'ECR cruzado · n = 9 · placebo de água',
    'ECRs cruzados + fMRI · n = 8 + 8',
] as const;

export const RINSE_SOURCES = [
    'Carter, Jeukendrup, Mann & Jones, MSSE 2004 (infusão)',
    'Carter, Jeukendrup & Jones, MSSE 2004 (bochecho) · ~2,9%: cálculo',
    'Chambers, Bridge & Jones, J Physiol 2009',
] as const;

export const META_LEADS = [
    'Meta-análise, 13 estudos: a potência sobe pouco, SMD 0,25.',
    'O tempo para completar a prova não muda de forma significativa.',
    'O efeito encolhe com o café da manhã. Alimentado + bochecho deu a maior potência.',
    'E um ensaio duplo-cego bem feito não achou nada. O bochecho é real, pequeno e inconstante.',
] as const;

export const META_DESIGN = [
    'meta-análise · 16 ensaios · n = 175 · I² = 0%',
    'meta-análise · n = 151 (tempo) · I² = 0%',
    'ECR duplo-cego · n = 12 · quadrado latino',
    'ECR cruzado duplo-cego · n = 14',
] as const;

export const META_SOURCES = [
    'Brietzke et al., Sports Med 2019',
    'Brietzke et al., Sports Med 2019',
    'Lane et al., Appl Physiol Nutr Metab 2013',
    'Trommelen et al., Int J Sport Nutr Exerc Metab 2015',
] as const;

export const FED = [
    { label: 'em jejum', value: '+3,4%', watts: '282 × 273 W' },
    { label: 'alimentado', value: '+1,8%', watts: '286 × 281 W' },
] as const;
