import type { Lesson } from './paFrame';
import { C } from '../kit/palette';

/**
 * Slide 105 · 120 g/h: o que se sabe (dossiê 03, bloco D). RAVI2025 (barras, GI e custo de O₂), HEAR2022 (tolerância),
 * PODL2022 (exógena × endógena), VIRI2020 (dano e PSE, sem tempo), MORTON2026 (eficácia ainda não comprovada).
 * A fonte do rodapé acumula: cita todos os estudos que estão na tela.
 */

/** Ravikanti 2025: oxidação na 2ª hora (g/min). Dose e proporção mudam juntas. */
export const RAVI = [
    { gh: 60, ratio: 'só malto', exo: 0.89, total: 2.09, gi: 'frequentes' },
    { gh: 90, ratio: '2:1', exo: 1.31, total: 2.46, gi: 'frequentes' },
    { gh: 120, ratio: '1:1', exo: 1.68, total: 3.07, gi: 'pico' },
] as const;

/** Podlogar 2022: oxidação endógena + exógena, 120–180 min (g/min). ratio = maltodextrina:frutose (o abstract escreve frutose:maltodextrina 0,8:1 e 1:2). */
export const PODL = [
    { gh: 90, ratio: '2:1', endo: 2.2, exo: 1.29 },
    { gh: 120, ratio: '1:0,8', endo: 2.15, exo: 1.51 },
] as const;

/** Viribay 2020: carga interna (PSE da sessão, UA) por grupo. O tempo de prova não foi medido. */
export const VIRI = [
    { gh: 120, load: 3805 },
    { gh: 90, load: 4692 },
    { gh: 60, load: 4688 },
] as const;

/** Morton 2026: faixa de g/h com eficácia ainda não demonstrada. */
export const MORTON_BAND = [120, 200] as const;

export interface HighStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    design: string;
    sources: readonly string[];
}

export const STEPS: readonly HighStep[] = [
    {
        tab: 'Oxida mais',
        headline: 'Entra mais, oxida mais',
        color: C.glucose,
        text: 'Ravikanti 2025: 8 maratonistas de elite, ECR cruzado com ¹³C, 120 min de corrida perto do limiar. Exógena na 2ª hora: 0,89, 1,31 e 1,68 g/min a 60, 90 e 120 g/h; dose e proporção mudam juntas. Custo de O₂ 8,1 mL/kg/km menor com 120 × 60 g/h (p = 0,039), mas sintomas GI moderados ou graves em todas as doses, com pico nos 120. Em ciclistas preparados (Hearris 2022, n = 9), sintomas mínimos.',
        design: 'ECR cruzado · n = 8 · elite · ¹³C',
        sources: ['Ravikanti 2025 (J Appl Physiol)', 'Hearris 2022 (J Appl Physiol)'],
    },
    {
        tab: 'O estoque',
        headline: 'Mais da bebida, o mesmo do estoque',
        color: C.glycogenSoft,
        text: 'Podlogar 2022: 11 ciclistas muito treinados, 3 h a 95% do limiar de trocas gasosas, em jejum. 120 g/h com maltodextrina:frutose 1:0,8 (o artigo escreve frutose:maltodextrina 0,8:1) × 90 g/h com maltodextrina:frutose 2:1: exógena 1,51 × 1,29 g/min (p = 0,026); endógena 2,15 × 2,20 (p = 0,786). O glicogênio não foi poupado. Sem desfecho de desempenho.',
        design: 'ECR cruzado · n = 11 · ¹³C · jejum',
        sources: ['Podlogar 2022 (Eur J Appl Physiol)'],
    },
    {
        tab: 'O tempo',
        headline: 'O estudo viral não mediu o tempo',
        color: C.stone,
        text: 'Viribay 2020, o estudo que viralizou: ECR paralelo, 20 corredores de elite (~6–7 por grupo), maratona de montanha. Com 120 g/h, carga interna de 3805 UA × 4692 (90 g/h) e 4688 (60 g/h), e CK, LDH e TGO menores. O tempo de prova, o desfecho que interessa ao atleta, não foi medido.',
        design: 'ECR paralelo · n = 20 · ~6–7 por grupo',
        sources: ['Viribay 2020 (Nutrients)'],
    },
    {
        tab: 'Desempenho',
        headline: 'Desempenho: ainda não demonstrado',
        color: '#FFFFFF',
        text: 'Somando os elos: com 120 g/h entra e se oxida mais (Ravikanti), o estoque não é poupado (Podlogar) e o estudo de campo não cronometrou a prova (Viribay). A revisão de Morton 2026 fecha a conta: para 120–200 g/h, eficácia “not yet substantiated”.',
        design: 'revisão · Morton 2026 (J Nutr)',
        sources: ['Morton 2026 (J Nutr)'],
    },
];

export const LESSONS: readonly Lesson[] = [
    { at: 0, text: 'Exógena sobe com a dose: 0,89 → 1,31 → 1,68 g/min.', color: C.glucose },
    { at: 0, text: 'O₂ −8,1 mL/kg/km (120 × 60); sintomas GI no pico.', color: C.risk },
    { at: 1, text: '120 × 90 g/h: endógena igual (2,15 × 2,20).', color: C.glycogen },
    { at: 2, text: 'Carga interna e dano menores; tempo não medido.', color: C.stone },
    { at: 3, text: 'Desempenho com 120 g/h: não demonstrado.', color: '#FFFFFF' },
];
