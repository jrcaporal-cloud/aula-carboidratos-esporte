import type { Verdict } from '../kit/Stamp';

/**
 * Slide 189 · Mito ou Verdade? Um veredito para cada afirmação do slide «O Que a Turma Já Acha», NA MESMA ORDEM de
 * `ato1/myth.content.ts` (o texto das afirmações vem de lá; aqui o veredito, o número, a fonte e o porquê).
 * Números: dossiês 07 (Burdon, Rowlands, Sherman/Bussau, James), 03 (Jentjens 2005), 04 (Moseley, Koopman), 05 (Burke).
 */
export interface VerdictEntry {
    verdict: Verdict;
    /** O número que decide (vai grande). */
    number: string;
    /** O que o número é, em uma linha. */
    caption: string;
    /** Estudo e desenho (selo do canto e linha do quadro). */
    source: string;
    /** O porquê, com o estudo (painel). */
    why: string;
}

export const VERDICTS: readonly VerdictEntry[] = [
    {
        verdict: 'mito', number: 'p > 0,05', caption: 'IG baixo × alto antes do exercício: sem efeito agrupado',
        source: 'Burdon 2017 · MA · 19 estudos, n = 188',
        why: 'Sem carboidrato durante, leve tendência a favor do IG baixo, mas o efeito agrupado não foi significativo (ES −0,17 a −0,36); com carboidrato durante, resultados conflitantes. Escolha o IG pela tolerância e pela logística.',
    },
    {
        verdict: 'mito', number: '1,75 × 1,06 g/min', caption: 'oxidação exógena: glicose + frutose × só glicose',
        source: 'Jentjens 2005 · isótopo · n = 8',
        why: 'O teto de ~1 g/min vale para uma fonte só, que satura o transportador de glicose. Com glicose + frutose a 144 g/h, o pico de oxidação chegou a 1,75 g/min; nos últimos 90 min, ~50% acima da glicose sozinha.',
    },
    {
        verdict: 'mito', number: '+1 a 9%', caption: 'potência com frutose + glicose × a mesma energia só de glicose',
        source: 'Rowlands 2015 · revisão de 14 estudos',
        why: 'Em provas de 2,5 a 3 h, frutose:glicose de 0,5 a 1:1, a 1,3–2,4 g/min, melhorou a potência média (IC95% 0 a 19%) e deu menos desconforto gastrointestinal. Quase só homens, ciclismo e laboratório.',
    },
    {
        verdict: 'depende', number: '95 → 180 mmol/kg', caption: 'glicogênio após 1 dia com ~10 g/kg',
        source: 'Bussau 2002 · Sherman 1981',
        why: 'A carga existe, mas é dose e tempo: ~10 g/kg em 24 h, não um prato na véspera (Bussau, só homens, sem desempenho). E nem sempre muda a prova: em 20,9 km de corrida, Sherman 1981 não viu diferença de tempo.',
    },
    {
        verdict: 'mito', number: '0,10 × 0,11 %/h', caption: 'síntese proteica com proteína, com e sem carboidrato junto',
        source: 'Koopman 2007 · cruzado · n = 10',
        why: 'Com proteína suficiente depois do treino, o pico de insulina que o carboidrato provoca não acrescentou síntese (10 homens ativos, isótopos). O carboidrato repõe glicogênio para a próxima sessão; não é o que faz crescer.',
    },
    {
        verdict: 'mito', number: '+6,6% × −1,6%', caption: '10 km de marcha: carboidrato alto × low-carb cetogênica',
        source: 'Burke 2017 · elite · não randomizado',
        why: 'Marchadores de elite, 3 semanas de treino intensificado: com carboidrato alto (n = 9) os 10 km melhoraram; com a dieta cetogênica (n = 10), pioraram, com economia pior. O grupo repetiu o estudo em 2020 e achou o mesmo.',
    },
    {
        verdict: 'mito', number: '268 · 269 · 276 W', caption: 'potência com glicose 15, 45 ou 75 min antes',
        source: 'Moseley 2003 · cruzado · n = 8',
        why: 'A glicemia antes do esforço caiu conforme o horário (6,6; 4,5; 3,7 mmol/L) e alguns tiveram hipoglicemia, sem relação com a potência nem com o esforço percebido. As diferenças sumiram em 10 min de exercício.',
    },
    {
        verdict: 'mito', number: '108 → 193 mmol/kg', caption: 'mulheres com dose por massa magra (homens: 109 → 183)',
        source: 'James 2001 · mulheres × homens',
        why: 'Com 12 g/kg de massa magra por dia, por 3 dias, as mulheres supercompensaram tanto quanto os homens, nas duas fases do ciclo. O “não supercompensa” de estudos antigos era dose relativa e energia baixas.',
    },
];

/** Passo final: o placar. Nenhuma das 8 se sustenta inteira; é a virada do slide. */
export const SCORE = {
    line: 'Nenhuma das oito se sustentou inteira.',
    note: 'O veredito vem do número, não do tom da afirmação. O único “depende” é a carga: ela existe, mas é ~10 g/kg em 24 h, não um prato.',
    crowd: (hit: number, of: number): string => `A turma derrubou ${hit} de ${of} mitos na votação do começo da aula.`,
    noVotes: 'Sem votos guardados nesta sessão do navegador.',
} as const;

export const INTRO = {
    line: 'Vocês votaram no começo da aula. Agora, o veredito de cada uma, com o número que decide.',
    how: 'Cada afirmação recebe um carimbo (mito, depende ou verdade), o número que decide, o estudo com o desenho e, se houve votação, quanto a turma concordou.',
} as const;

export const SOURCE = 'Burdon 2017 · Jentjens 2005 · Rowlands 2015 · Bussau 2002 · Sherman 1981 · Koopman 2007 · Burke 2017/2020 · Moseley 2003 · James 2001.';
