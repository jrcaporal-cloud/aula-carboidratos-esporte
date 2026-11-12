import type { CastId } from '../kit/cast';

/**
 * Slide 190 · Cinco Atletas, Cinco Planos. O plano final de cada caso FICTÍCIO, com números já vistos na aula.
 * As faixas em g/kg/d viram gramas pelo peso do personagem (cálculo feito no componente).
 */
export interface PlanSlot {
    when: string;
    what: string;
    /** Estudo/diretriz de onde veio o número (slide anterior). */
    from: string;
}

export interface Plan {
    id: CastId;
    /** Faixa diária usada no cálculo (g/kg/d) e o que ela representa. */
    day: { lo: number; hi: number; label: string };
    slots: readonly PlanSlot[];
    dont: { what: string; from: string };
}

export const PLANS: readonly Plan[] = [
    {
        id: 'marina', day: { lo: 5, hi: 7, label: 'por dia · treino ~1 h/d' },
        slots: [
            { when: 'Antes', what: 'carga de ~10 g/kg nas 24–48 h + café 3 h antes', from: 'Bussau 2002 · Schabort 1999' },
            { when: 'Durante', what: '60 a 90 g/h com glicose + frutose, ensaiado no longão', from: 'Burke 2011' },
            { when: 'Depois', what: 'sem prova no dia seguinte: o total de 24 h manda', from: 'Parkin 1997' },
        ],
        dont: { what: 'chamar o macarrão da véspera de carga', from: 'Bussau 2002' },
    },
    {
        id: 'diego', day: { lo: 6, hi: 10, label: 'por dia · treino 1–3 h/d' },
        slots: [
            { when: 'Antes', what: 'refeição 3–4 h antes da largada', from: 'Coyle 1985' },
            { when: 'Durante', what: 'subir a 90 g/h com mistura após 2 semanas de treino intestinal', from: 'Costa 2017 · Burke 2011' },
            { when: 'Depois', what: 'sessão dupla: ~1–1,2 g/kg/h nas primeiras horas', from: 'Jentjens 2003 · ISSN' },
        ],
        dont: { what: 'saltar para 120 g/h: ganho ainda não demonstrado', from: 'Morton 2026' },
    },
    {
        id: 'lara', day: { lo: 6, hi: 10, label: 'por dia · véspera e dia de jogo' },
        slots: [
            { when: 'Antes', what: 'véspera no alto da faixa, não no 4,2 de dia de treino', from: 'Anderson 2017' },
            { when: 'Durante', what: 'carboidrato no jogo poupa glicogênio (111 × 181 mmol/kg)', from: 'Leatt 1989' },
            { when: 'Depois', what: 'começar já: 24 h depois, glicogênio ainda −27%', from: 'Krustrup 2011' },
        ],
        dont: { what: 'cortar carboidrato “para não inchar”', from: 'Krustrup 2011' },
    },
    {
        id: 'tiago', day: { lo: 7.1, hi: 7.1, label: 'na refeição pós-pesagem' },
        slots: [
            { when: 'Semana', what: 'dieta pobre em fibra 4 dias: −0,74% da massa', from: 'Foo 2022' },
            { when: 'Pós-pesagem', what: '7,1 g/kg não repõe tudo em 13 h: começar na hora', from: 'Kondo 2021' },
            { when: 'Na luta', what: 'medalhistas reganharam 1,4% a mais de peso', from: 'Reale 2016' },
        ],
        dont: { what: 'desidratar com roupa impermeável no calor: 3 mortes em 1997', from: 'CDC 1998' },
    },
    {
        id: 'paulo', day: { lo: 3, hi: 7, label: 'por dia · leve a moderado' },
        slots: [
            { when: 'Antes', what: 'alimentado e ≤ 10 séries: carboidrato extra não muda a força', from: 'Henselmans 2022' },
            { when: 'Durante', what: 'sessão de ~1 h: no máximo pouco carboidrato ou bochecho', from: 'Burke 2011' },
            { when: 'Depois', what: 'proteína basta: síntese 0,10 × 0,11 %/h', from: 'Koopman 2007' },
        ],
        dont: { what: 'comprar a “janela de carbo” para crescer: SMD 0,15', from: 'Henselmans 2026' },
    },
];

export const INTRO_LINE = 'Cinco atletas, cinco dilemas. Cada plano usa só números que já vimos.';

export const SOURCE = 'Faixas: Burke 2011. Números de cada caso: slides dos Atos IV a IX (fontes na tecla D).';
