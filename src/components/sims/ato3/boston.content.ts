/**
 * Slide 48 · Boston, 1923. A história em três marcos, com a evidência subindo de degrau.
 * 1923: Levine, Gordon & Derick (JAMA 1924), citado em HEARRIS2018 (< 4 mmol/L): original NÃO lido.
 * 1939: CHRISTENSEN1939: 210 × 80 min segundo BERGSTROM1967; 200 g em 2 atletas, ~+1 h segundo NOAKES2022. Original não lido.
 * 1987: COGGAN1987 (cruzado, placebo, n = 7): só o desenho; os números ficam no slide seguinte.
 */

export interface BostonStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

export const BOSTON_STEPS: readonly BostonStep[] = [
    {
        tab: 'Boston, 1923',
        headline: 'Uma medida na linha de chegada',
        text: 'Levine, Gordon e Derick mediram a glicose no sangue de maratonistas de Boston ao cruzar a chegada: abaixo de 4 mmol/L, faixa de hipoglicemia. O artigo (JAMA 1924) não foi lido no original; o dado vem da revisão de Hearris 2018. Uma medida na chegada mostra associação, não causa.',
        sources: ['Levine 1924 (via Hearris 2018)'],
    },
    {
        tab: 'Copenhague, 1939',
        headline: 'Copenhague devolve a glicose',
        text: 'Christensen e Hansen, no laboratório de Krogh: depois de dieta rica em carboidrato, 210 min de trabalho; depois de dieta gordurosa, 80 min (segundo Bergström 1967). Na exaustão, 200 g de glicose em 2 atletas: cerca de mais 1 h (segundo Noakes 2022). Sem biópsia, a explicação era a hipoglicemia.',
        sources: ['Christensen 1939 (via Bergström 1967; Noakes 2022)'],
    },
    {
        tab: 'Austin, 1987',
        headline: 'Austin fecha o desenho',
        text: 'Nos anos 1960, a biópsia levou o foco ao glicogênio do músculo. Em 1987, Coggan e Coyle voltaram ao sangue com o desenho que faltava: cruzado, com placebo, glicose direto na veia. A evidência sobe um degrau por marco.',
        sources: ['Coggan & Coyle 1987'],
    },
];

/** Os marcos na linha do tempo (x em anos) e o degrau de evidência de cada um. */
export const MILESTONES = [
    { at: 0, year: 1923, place: 'Boston', what: 'maratona', fact: '< 4 mmol/L', factSub: 'glicemia na chegada', level: 1, evidence: 'observação' },
    { at: 1, year: 1939, place: 'Copenhague', what: 'cicloergômetro', fact: '210 × 80 min', factSub: 'dieta CHO × gordura', level: 2, evidence: 'intervenção · n = 2' },
    { at: 2, year: 1987, place: 'Austin', what: 'glicose IV', fact: 'n = 7', factSub: 'cruzado · placebo', level: 3, evidence: 'ensaio cruzado' },
] as const;

/** Livro-caixa do painel: um cartão por marco, que fica. */
export const BOSTON_LEDGER = [
    { at: 0, year: '1923', design: 'medida na chegada · sem controle', result: 'glicemia < 4 mmol/L' },
    { at: 1, year: '1939', design: 'dieta cruzada; glicose na exaustão (n = 2)', result: '210 × 80 min; ~+1 h com 200 g' },
    { at: 2, year: '1987', design: 'cruzado · placebo · n = 7 · não cego', result: 'resgate pela veia (próximo slide)' },
] as const;
