import { C } from '../kit/palette';

/** Slide 191 · O Que Levar para a Segunda-feira. Seis mensagens, cada uma presa ao número que a sustenta (já visto na aula). */
export interface Takeaway {
    number: string;
    message: string;
    /** O que o número é (só aparece na mensagem da vez). */
    what: string;
    source: string;
    color: string;
}

export const TAKEAWAYS: readonly Takeaway[] = [
    { number: '21,1 × 19,6', message: 'A intensidade escolhe o combustível.', what: 'kJ por litro de O₂: carboidrato × gordura', source: 'Scott 2012', color: C.glucose },
    { number: '28% × 17%', message: 'Tanque vazio perde a prova.', what: 'homens × mulheres que bateram no muro', source: 'Smyth 2021', color: C.glycogenSoft },
    { number: '30–60 · 90', message: 'Durante: gramas por hora, pela duração.', what: 'g/h em 1 a 2,5 h × acima de 2,5 h, com mistura', source: 'Burke 2011', color: C.glucoseSoft },
    { number: '8–24 h', message: 'Recuperação longa: o total do dia manda.', what: 'horário da refeição sem diferença no glicogênio', source: 'Parkin 1997', color: C.ok },
    { number: '73% × 37%', message: 'Treino com pouco: ferramenta, não dieta.', what: 'estudos com sinal no músculo × com ganho de desempenho', source: 'Impey 2018', color: C.caveat },
    { number: '26,6% × 3,35%', message: 'Leia o desenho antes do efeito.', what: 'ruído do tempo até a exaustão × do contrarrelógio', source: 'Jeukendrup 1996', color: C.stone },
];

export const SOURCE = 'Scott CB. ScientificWorldJournal 2012 · Smyth B. PLoS One 2021 · Burke LM et al. J Sports Sci 2011 · Parkin JA et al. Med Sci Sports Exerc 1997 · Impey SG et al. Sports Med 2018 · Jeukendrup A et al. Med Sci Sports Exerc 1996.';
