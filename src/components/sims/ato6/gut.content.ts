/**
 * Slide 109 · O Intestino Treina. COST2017, COX2010, KING2022 e MIAL2018 (tabela K), dossiê 03, blocos G e K.
 * Diego é caso fictício. "Mais transportadores" é a explicação provável (COX2010), não medida: o intestino é esquema.
 */

export const DAYS = 14;

export interface GutStep {
    tab: string;
    headline: string;
    text: string;
    /** Selo de desenho do passo (o "caso fictício" e o "esquema" ficam fixos). */
    chip?: string;
    sources: readonly string[];
}

export const GUT_STEPS: readonly GutStep[] = [
    {
        tab: 'Diego',
        headline: 'Diego trava acima de 60 g/h',
        text: 'Ironman de ~10 h: a diretriz para provas acima de 2,5 h chega a 90 g/h, mas acima de 60 g/h o intestino dele reclama. O carboidrato que não é absorvido fica no lúmen, fermenta e gera H₂, que sai no ar expirado: o hálito mede a má absorção.',
        sources: ['Diego: personagem da aula'],
    },
    {
        tab: 'Protocolo',
        headline: 'O protocolo de Costa 2017',
        text: '25 corredores em 3 grupos paralelos. Desafio: 2 h a 60% do VO₂máx com gel de 30 g de glicose:frutose 2:1 a cada 20 min (90 g/h). Depois, 2 semanas de treino intestinal com gel, com comida rica em carboidrato ou com placebo, e o desafio de novo.',
        chip: 'ECR paralelo · n = 25 · 3 grupos',
        sources: ['Costa 2017, Appl Physiol Nutr Metab'],
    },
    {
        tab: 'Resultado',
        headline: 'O intestino aprende',
        text: 'Depois das 2 semanas: sintomas GI −60% com gel e −63% com comida; pico de H₂ de 6 × 12 ppm (gel × placebo), menos má absorção; glicemia 7,2 × 6,2 mmol/L. Distância em 1 h: +5,2% com gel, −2,1% com placebo. A oxidação não mudou. ~8 por grupo.',
        chip: 'ECR paralelo · ~8 por grupo',
        sources: ['Costa 2017, Appl Physiol Nutr Metab'],
    },
    {
        tab: 'Vira prova?',
        headline: 'Vira tempo de prova? Depende',
        text: 'Miall 2018 replica o hálito (H₂ de 13 para 6 ppm). Cox 2010: 28 dias de carboidrato alto nos treinos elevaram a oxidação exógena, mas o desempenho subiu ~6% nos dois grupos. King 2022, em elite: ganho igual ao controle e mais sintomas na 2ª metade da prova.',
        chip: 'ECRs paralelos · n = 16 e n = 37',
        sources: ['Miall 2018, Scand J Med Sci Sports', 'Cox 2010, J Appl Physiol', 'King 2022, Nutrients'],
    },
];

/** Costa 2017, por grupo, depois das 2 semanas. */
export const GROUPS = [
    { group: 'gel', symptoms: '−60%', distance: '+5,2%', good: true },
    { group: 'comida', symptoms: '−63%', distance: '+4,3%', good: true },
    { group: 'placebo', symptoms: '—', distance: '−2,1%', good: false },
] as const;

/** E vira prova? (passo 4) */
export const TRANSFER = [
    { study: 'Cox 2010 · 28 dias · n = 16', lines: ['oxidação exógena 54,6 → 63,6 g', 'desempenho: ~6% nos dois grupos'] },
    { study: 'King 2022 · elite · n = 37', lines: ['ganho de 36 s × 39 s no controle', 'mais sintomas na 2ª metade'] },
] as const;

/** O hálito antes × depois, no esquema (Costa 2017: gel × placebo depois das 2 semanas). */
export const BREATH = { before: '12 ppm', after: '6 ppm' } as const;
