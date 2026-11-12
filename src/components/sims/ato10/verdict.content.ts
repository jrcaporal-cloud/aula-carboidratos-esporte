import type { Verdict } from '../kit/Stamp';

/**
 * Slide 189 · Mito ou Verdade? Um veredito para cada afirmação do slide 13, NA MESMA ORDEM de `ato1/myth.content.ts`
 * (o texto das afirmações vem de lá; aqui só o veredito, o número e a fonte).
 */
export interface VerdictEntry {
    verdict: Verdict;
    /** O número que decide (vai grande). */
    number: string;
    /** O que o número é, em uma linha. */
    caption: string;
    /** Estudo e desenho. */
    source: string;
}

export const VERDICTS: readonly VerdictEntry[] = [
    { verdict: 'mito', number: 'p > 0,05', caption: '19 estudos: IG baixo × alto antes do exercício, sem efeito agrupado', source: 'Burdon 2017 · meta-análise · n = 188' },
    { verdict: 'mito', number: '1,75 × 1,06 g/min', caption: 'oxidação com glicose + frutose × só glicose: o teto vale para uma fonte só', source: 'Jentjens 2005 · cruzado · n = 8 · isótopo' },
    { verdict: 'mito', number: '+1 a 9%', caption: 'potência com frutose + glicose, contra a mesma energia só de glicose', source: 'Rowlands 2015 · revisão de 14 estudos' },
    { verdict: 'depende', number: '95 → 180 mmol/kg', caption: 'carga é ~10 g/kg por 24 h, não um prato; e não mudou prova de 20,9 km', source: 'Bussau 2002 · n = 8 · Sherman 1981' },
    { verdict: 'mito', number: '0,10 × 0,11 %/h', caption: 'síntese proteica com proteína, com e sem carboidrato junto', source: 'Koopman 2007 · cruzado · n = 10' },
    { verdict: 'mito', number: '+6,6% × −1,6%', caption: '10 km de marcha: carboidrato alto × low-carb; replicado em 2020', source: 'Burke 2017 · elite · não randomizado' },
    { verdict: 'mito', number: '268 · 269 · 276 W', caption: 'potência com glicose 15, 45 ou 75 min antes: sem diferença', source: 'Moseley 2003 · cruzado · n = 8' },
    { verdict: 'mito', number: '108 → 193 mmol/kg', caption: 'mulheres com dose por massa magra (homens: 109 → 183)', source: 'James 2001 · comparação entre sexos' },
];

export const INTRO = {
    line: 'Vocês votaram no começo da aula. Agora, o veredito de cada uma, com o número que decide.',
    noVotes: 'Sem votos guardados nesta sessão.',
} as const;

export const SOURCE = 'Burdon 2017 · Jentjens 2005 · Rowlands 2015 · Bussau 2002 · Sherman 1981 · Koopman 2007 · Burke 2017/2020 · Moseley 2003 · James 2001.';
