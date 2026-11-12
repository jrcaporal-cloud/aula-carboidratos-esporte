import type { Lesson } from './paFrame';
import { C } from '../kit/palette';

/**
 * Slide 100 · Gainesville, 1965. Fatos das páginas da UF (dossiê 07 GATORADE-UF e dossiê 03, histórias):
 * Douglas → Shires → Cade; Ray Graves aprovou o teste; equipe Cade, H. James Free, Dana Shires, Alex de Quesada;
 * "salts and sugars", limão; 1º/10/1965 calouros × time B; 2/10 Flórida 14 × 7 LSU (5ª do ranking); 1967 licença à
 * Stokely-Van Camp (Indianápolis); > US$ 280 mi desde 1972. Não usar: "Orange Bowl 1967"; a lenda da Geórgia (1966).
 */

export const STATIONS = ['ago 1965', '1965', '1º–2 out 1965', '1967 → hoje'] as const;

export const QUESTION = 'Por que os jogadores não urinavam depois do jogo?';

export const CHAIN = [
    { name: 'Dwayne Douglas', role: 'auxiliar técnico' },
    { name: 'Dana Shires', role: 'médico' },
    { name: 'Robert Cade', role: 'nefrologista' },
] as const;

/** Camadas do copo (de baixo para cima). */
export const LAYERS = [
    { name: 'água', color: C.co2 },
    { name: 'sais (sódio)', color: C.stone },
    { name: 'açúcar', color: C.glucose },
    { name: 'limão', color: C.fat },
] as const;

export const TEAM = 'Cade, H. James Free, Dana Shires, Alex de Quesada';

export interface GatoradeStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
}

export const STEPS: readonly GatoradeStep[] = [
    {
        tab: 'A pergunta',
        headline: 'Uma pergunta de nefrologia',
        color: C.glucoseSoft,
        text: 'Agosto de 1965, Universidade da Flórida: jogadores internados por doença do calor. O auxiliar técnico Dwayne Douglas leva o problema ao médico Dana Shires, que chama o nefrologista Robert Cade. A pergunta que ficou: por que os jogadores não urinavam depois do jogo? Era uma pergunta sobre água e sódio.',
    },
    {
        tab: 'A bebida',
        headline: 'Sais, açúcar e, depois, limão',
        color: C.glucose,
        text: 'A equipe de Cade testou soluções de sais e açúcares na água. Intragáveis, até a esposa de Cade sugerir limão. A fórmula nasceu da pergunta sobre água e sódio: o carboidrato veio junto, não como a estrela. O que ele faz durante a prova, os ensaios só mostrariam décadas depois.',
    },
    {
        tab: 'O teste',
        headline: 'Um teste de véspera, não um ensaio',
        color: C.stone,
        text: 'Com o aval do técnico Ray Graves, em 1º/10/1965 os calouros beberam a mistura e dominaram o 2º tempo contra o time B, que jogou sem ela. No dia seguinte, a Flórida venceu a LSU, 5ª do ranking, por 14 a 7. Um jogo não é um ensaio: é a história de origem.',
    },
    {
        tab: 'O produto',
        headline: 'A pergunta virou indústria',
        color: C.glucose,
        text: 'Na primavera de 1967, a bebida foi licenciada à Stokely-Van Camp, de Indianápolis. Desde 1972, a universidade recebeu mais de US$ 280 milhões em royalties. Fonte institucional da UF, não artigo revisado: serve para a história, não como evidência de efeito.',
    },
];

export const LESSONS: readonly Lesson[] = [
    { at: 0, text: 'A origem é renal: água, sódio, urina.', color: C.co2 },
    { at: 1, text: 'O açúcar veio junto com o sal.', color: C.glucose },
    { at: 2, text: 'O primeiro “teste” foi um jogo, não um ensaio.', color: C.stone },
    { at: 3, text: 'Os ensaios vieram depois: é o próximo slide.', color: C.glucoseSoft },
];

export const SOURCE = 'UF Research (research.ufl.edu) · UF Health, “Profiles in history: Dr. Robert Cade”';
