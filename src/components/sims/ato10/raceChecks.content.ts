import { C } from '../kit/palette';
import type { DecideRow } from './DecideShell';

/**
 * Slide 193 · Quatro Perguntas Antes da Prova. O "como fazer" que faltava ao Relógio da Prova e aos Cinco Planos.
 * 1) Bochecho: CART2004B (5 s, maltodextrina 6,4%, a cada 12,5%; 59,57 × 61,37 min), LANE2013 (10 s, 10%; +3,4% em
 *    jejum × +1,8% alimentado), BRIE2019 (SMD 0,25 na potência, tempo ns) — dossiê 03, bloco H.
 * 2) Treino intestinal: COST2017 (n = 25; 2 h a 60% do VO₂máx, gel de 30 g 2:1 a cada 20 min; sintomas −60%; H₂ 12 → 6 ppm),
 *    MART2023 (8 estudos, desconforto −47%), KING2022 (elite, sem vantagem extra) — dossiê 03, blocos G e K;
 *    "testar no treino que imita a prova": MAUGHAN2018 (texto completo, dossiê 07).
 * 3) Recuperação curta: KERK2017 (ISSN, 1,2 g/kg/h em < 4 h), ALGHANNAM2016 (n = 10; 80 × 48 min), VANLOON2000/JENTJENS2003
 *    (proteína não soma com CHO ≥ 1,2 g/kg/h), PARKIN1997 (8–24 h: o total) — dossiê 04. "70 kg ≈ 84 g/h" = cálculo.
 * 4) Lote: MAUGHAN2018 (texto completo): ~15% de > 600 produtos com pró-hormônio não declarado (Geyer 2004, VIA REVISÃO);
 *    auditoria por terceiros reduz o risco, sem garantia absoluta; ingredientes extras aumentam o risco. Sem marca comercial.
 */

export interface CheckRow {
    at: number;
    question: string;
    hint: string;
    action: string;
    lines: readonly string[];
    key: string;
    color: string;
}

export const CHECK_ROWS: readonly CheckRow[] = [
    {
        at: 0, question: 'Prova de ~1 h, intensa?', hint: 'o efeito é da boca',
        action: 'Bochecho, sem engolir', color: C.glucose,
        lines: ['5–10 s · maltodextrina a 6,4–10% · cuspir', 'a cada 1/8 da prova · não troca o café'],
        key: '+3,4% em jejum × +1,8% alimentado',
    },
    {
        at: 1, question: 'Meta acima de 60 g/h?', hint: 'ou queixa GI em prova',
        action: 'Treinar o intestino antes de subir', color: C.fructose,
        lines: ['2 semanas · 2 h a 60% do VO₂máx', 'gel de 30 g (2:1) a cada 20 min = 90 g/h'],
        key: 'sintomas GI −60%',
    },
    {
        at: 2, question: 'Nova sessão em menos de 4 h?', hint: 'se não: o total das 24 h',
        action: '1,2 g/kg/h, a cada 30 min', color: C.ok,
        lines: ['70 kg ≈ 84 g/h (cálculo)', 'proteína só soma se o CHO ficar abaixo'],
        key: '2ª corrida: 80 × 48 min',
    },
    {
        at: 3, question: 'Produto pronto (gel, pó, barra)?', hint: 'atleta sujeito a antidoping',
        action: 'Certificação por terceiros', color: C.risk,
        lines: ['fórmula simples, sem ingredientes extras', 'testar no treino; reduz o risco, não zera'],
        key: '~15% de > 600 com pró-hormônio oculto',
    },
];

export interface ChecksStep {
    tab: string;
    headline: string;
    text: string;
    color: string;
    sources: readonly string[];
}

export const CHECKS_STEPS: readonly ChecksStep[] = [
    {
        tab: 'Bochecho', color: C.glucose,
        headline: 'Prova de ~1 h: o bochecho basta',
        text: 'Em ~1 h intensa, o efeito é central. Carter 2004: bochecho de 5 s com maltodextrina a 6,4%, cuspido a cada 12,5% da prova, levou o contrarrelógio de 61,4 para 59,6 min (n = 9). Lane 2013: +3,4% em jejum, +1,8% alimentado, e a maior potência veio de alimentado + bochecho.',
        sources: ['Carter 2004', 'Lane 2013', 'Brietzke 2019'],
    },
    {
        tab: 'Intestino', color: C.fructose,
        headline: 'Acima de 60 g/h: treine o intestino antes',
        text: 'Costa 2017 (25 corredores, 3 grupos): 2 semanas de desafio a 90 g/h cortaram os sintomas GI em 60% e o H₂ expirado de 12 para 6 ppm; distância em 1 h +5,2% (~8 por grupo). Em elite, sem vantagem extra (King 2022). Suba a dose no treino longo, nunca na prova.',
        sources: ['Costa 2017', 'Martinez 2023', 'King 2022', 'Maughan 2018 (COI)'],
    },
    {
        tab: 'Recuperação', color: C.ok,
        headline: 'Só com pressa a conta vira g/kg/h',
        text: 'Com menos de 4 h até a próxima sessão, a ISSN pede 1,2 g/kg/h. Alghannam 2016 (n = 10): 1,2 contra 0,3 g/kg/h em 4 h, e a 2ª corrida durou 80 × 48 min. Com 1,2 g/kg/h, a proteína não acelera; abaixo disso, compensa. Com 8 h ou mais, feche o total do dia.',
        sources: ['Kerksick 2017 (ISSN)', 'Alghannam 2016', 'van Loon 2000', 'Parkin 1997'],
    },
    {
        tab: 'O lote', color: C.risk,
        headline: 'Produto pronto: doping sem querer',
        text: 'No estudo seminal, ~15% de mais de 600 suplementos tinham pró-hormônio não declarado; traços sem efeito já podem dar teste positivo. O COI indica produtos auditados por terceiros: reduzem o risco, sem garantia absoluta. Ingredientes extras aumentam o risco: prefira a fórmula simples.',
        sources: ['Maughan 2018 (COI)', 'Geyer 2004 (via revisão)'],
    },
];

export const CHECKS_DESIGNS = [
    'ECRs cruzados · n = 9 e n = 12',
    'ECR paralelo · n = 25 · 3 grupos',
    'medidas repetidas · n = 10',
    'consenso do COI 2018',
] as const;

export const CHECKS_LEDGER: readonly DecideRow[] = [
    { at: 0, term: 'bochecho: potência (13 estudos)', value: 'SMD 0,25', color: C.glucose },
    { at: 1, term: 'treino intestinal: desconforto (8 estudos)', value: '−47%', color: C.fructoseSoft },
    { at: 2, term: 'recuperação em menos de 4 h', value: '1,2 g/kg/h', color: C.ok },
    { at: 3, term: 'certificação por terceiros', value: 'reduz, não zera', color: C.risk },
];
