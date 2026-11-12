import type { CastId } from '../kit/cast';

/**
 * Slide 190 · Cinco Atletas, Cinco Planos. O plano final de cada caso FICTÍCIO, só com números já vistos na aula.
 * As faixas em g/kg/d viram gramas pelo peso do personagem (cálculo feito no componente).
 * Fontes: Burke 2011 (faixas e g/h); Bussau 2002; Schabort 1999; Parkin 1997; Coyle 1985; Costa 2017; Jentjens 2003;
 * Morton 2026; Anderson 2017; Leatt 1989; Krustrup 2011; Foo 2022; Kondo 2021; Reale 2016; CDC 1998;
 * Henselmans 2022/2026; Koopman 2007 (dossiês 03, 04, 06, 07).
 */
export interface PlanSlot {
    when: string;
    what: string;
}

export interface Plan {
    id: CastId;
    /** Faixa diária usada no cálculo (g/kg/d) e o que ela representa. */
    day: { lo: number; hi: number; unit: string };
    slots: readonly PlanSlot[];
    dont: string;
    /** Estudos de onde saem os números da coluna (rodapé acumulado). */
    sources: readonly string[];
}

export const PLANS: readonly Plan[] = [
    {
        id: 'marina', day: { lo: 5, hi: 7, unit: 'g/kg/d' },
        slots: [
            { when: 'Antes', what: '~10 g/kg em 24–48 h; café 3 h antes' },
            { when: 'Durante', what: '60–90 g/h, glicose + frutose' },
            { when: 'Depois', what: 'sem prova amanhã: total de 24 h' },
        ],
        dont: 'macarrão da véspera não é carga',
        sources: ['Marina: Bussau 2002, Schabort 1999, Parkin 1997'],
    },
    {
        id: 'diego', day: { lo: 6, hi: 10, unit: 'g/kg/d' },
        slots: [
            { when: 'Antes', what: 'refeição 3–4 h antes da largada' },
            { when: 'Durante', what: '90 g/h só após treino intestinal' },
            { when: 'Depois', what: 'sessão dupla: ~1,2 g/kg/h' },
        ],
        dont: '120 g/h: ganho não demonstrado',
        sources: ['Diego: Coyle 1985, Costa 2017, Jentjens 2003, Morton 2026'],
    },
    {
        id: 'lara', day: { lo: 6, hi: 10, unit: 'g/kg/d' },
        slots: [
            { when: 'Antes', what: 'véspera no alto, não 4,2 g/kg' },
            { when: 'Durante', what: 'gasta 111 em vez de 181 mmol/kg' },
            { when: 'Depois', what: 'começar já: 24 h depois, −27%' },
        ],
        dont: 'cortar carbo “para não inchar”',
        sources: ['Lara: Anderson 2017, Leatt 1989, Krustrup 2011'],
    },
    {
        id: 'tiago', day: { lo: 7.1, hi: 7.1, unit: 'g/kg pós-pesagem' },
        slots: [
            { when: 'Semana', what: 'baixo resíduo 4 dias: −0,74%' },
            { when: 'Pós-pesagem', what: '7,1 g/kg não repõe em 13 h' },
            { when: 'Na luta', what: 'medalhistas reganharam +1,4%' },
        ],
        dont: 'desidratar no calor (3 mortes, 1997)',
        sources: ['Tiago: Foo 2022, Kondo 2021, Reale 2016, CDC 1998'],
    },
    {
        id: 'paulo', day: { lo: 3, hi: 7, unit: 'g/kg/d' },
        slots: [
            { when: 'Antes', what: 'alimentado, ≤ 10 séries: força igual' },
            { when: 'Durante', what: '~1 h: bochecho ou pouco' },
            { when: 'Depois', what: 'proteína basta: 0,10 × 0,11 %/h' },
        ],
        dont: 'pagar pela “janela”: SMD 0,15',
        sources: ['Paulo: Henselmans 2022, Koopman 2007, Henselmans 2026'],
    },
];

export const BASE_SOURCE = 'Faixas diárias e g/h: Burke 2011';
