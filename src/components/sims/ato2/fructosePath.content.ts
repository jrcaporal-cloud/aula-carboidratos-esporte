import { C } from '../kit/palette';

/**
 * Slide 27 · O Caminho da Frutose e da Galactose. Fonte única dos textos (dossiê 01, seção E).
 * JANG2018 (camundongo, ~90% da dose baixa no intestino) · SUN-EMPIE2012 (revisão de traçadores em humanos;
 * autores ligados à indústria de adoçantes) · LECOULTRE2010 (n = 7) · LEIJSSEN1995 (n = 8).
 */

export type PathChip = 'animal' | 'review' | 'lecoultre' | 'leijssen' | 'summary';

export interface PathStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    chips: readonly PathChip[];
    sources: readonly string[];
}

export const PATH_STEPS: readonly PathStep[] = [
    {
        tab: 'Intestino',
        headline: 'A primeira estação é o intestino',
        color: C.fructoseSoft,
        text: 'Em camundongo, com traçadores: uma dose baixa de frutose é ~90% depurada no próprio intestino, pela KHK, e o sangue portal leva glicose, lactato e glicerato feitos dela. Doses ≥ 1 g/kg saturam e seguem ao fígado. Em humano no exercício, a extrapolação é incerta.',
        chips: ['animal'],
        sources: ['Jang 2018 (camundongo)'],
    },
    {
        tab: 'Fígado',
        headline: 'O fígado devolve glicose',
        color: C.fructoseSoft,
        text: 'Revisão de traçadores em humanos: ~41% da frutose ingerida vira glicose em 3–6 h e ~¼ vira lactato; no fim, ~45% é oxidada (parte depois de virar glicose, por isso as frações não somam 100%). Autores ligados à indústria de adoçantes.',
        chips: ['review'],
        sources: ['Sun & Empie 2012 (revisão)'],
    },
    {
        tab: 'Músculo',
        headline: 'Logo, chega ao músculo de carona',
        color: C.lactate,
        text: 'Cruzado, 7 homens treinados, 120 min a ~60% do VO₂máx, gel com glicose + frutose: a oxidação da frutose se explicou meio a meio por lactato e por glicose feitos dela, e o lactato que entra no sangue subiu de 94 para 120 µmol/kg/min. Lactato alto com gel misto é combustível em trânsito.',
        chips: ['lecoultre'],
        sources: ['Lecoultre 2010 (n = 7)'],
    },
    {
        tab: 'Galactose',
        headline: 'Galactose: mesma porta, metade da oxidação',
        color: C.caveat,
        text: 'Entra pelo SGLT1, como a glicose, e passa pela via de Leloir no fígado. Cruzado randomizado, 8 atletas, solução a 8%, 120 min a 65% da Wmáx: pico de oxidação 0,41 g/min × 0,85 com glicose; 21% × 46% do ingerido oxidado.',
        chips: ['leijssen'],
        sources: ['Leijssen 1995 (n = 8)'],
    },
    {
        tab: 'Lado a lado',
        headline: 'Frutose abre pista; galactose entra na fila',
        color: C.glucoseSoft,
        text: 'As duas chegam ao músculo depois do intestino e do fígado. A diferença prática está na porta: a frutose usa o GLUT5 e soma capacidade à glicose; a galactose divide o SGLT1 com ela. O que o fígado faz com cada uma volta em “O Fígado Prefere Sacarose”.',
        chips: ['summary'],
        sources: [],
    },
];

/** Livro-caixa da cadeia: um elo por passo, acumula. */
export const PATH_LEDGER: readonly { at: number; what: string; value: string; color: string }[] = [
    { at: 0, what: 'frutose · intestino', value: '~90% fica', color: C.fructoseSoft },
    { at: 1, what: 'frutose · fígado', value: '~41% → glicose', color: C.glucoseSoft },
    { at: 2, what: 'frutose · músculo', value: '½ lactato + ½ glicose', color: C.lactate },
    { at: 3, what: 'galactose · músculo', value: '0,41 × 0,85 g/min', color: C.caveat },
    { at: 4, what: 'a porta', value: 'GLUT5 × SGLT1', color: C.glucoseSoft },
];
