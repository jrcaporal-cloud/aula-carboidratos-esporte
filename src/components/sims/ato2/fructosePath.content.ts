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
    key: string;
    keyCaption: string;
    chips: readonly PathChip[];
    sources: readonly string[];
}

export const PATH_STEPS: readonly PathStep[] = [
    {
        tab: 'Intestino',
        headline: 'A primeira estação é o intestino',
        color: C.fructoseSoft,
        text: 'Traçadores e espectrometria de massas em camundongo: uma dose baixa de frutose é ~90% depurada no próprio intestino, pela KHK. No sangue portal aparece pouca frutose e muita glicose, lactato e glicerato feitos dela. Doses ≥ 1 g/kg saturam e seguem ao fígado e à microbiota do cólon. Em humano no exercício, a extrapolação é incerta.',
        key: '~90%', keyCaption: 'da dose baixa fica no intestino (camundongo)',
        chips: ['animal'],
        sources: ['Jang 2018 (camundongo)'],
    },
    {
        tab: 'Fígado',
        headline: 'Três destinos que se sobrepõem',
        color: C.fructoseSoft,
        text: 'Revisão de estudos com traçadores em humanos: ~45% da frutose ingerida é oxidada (45,0% em repouso, em 3–6 h; 45,8% no exercício, em 2–3 h), ~41% vira glicose em 3–6 h e ~¼ vira lactato; menos de 1% vai direto a triglicerídeo plasmático. Não somam 100%: parte vira glicose e depois é oxidada. Autores ligados à indústria de adoçantes.',
        key: '~45%', keyCaption: 'oxidada; ~41% vira glicose e ~¼ vira lactato',
        chips: ['review'],
        sources: ['Sun & Empie 2012 (revisão)'],
    },
    {
        tab: 'Músculo',
        headline: 'Chega ao músculo de carona',
        color: C.lactate,
        text: 'Cruzado, 7 homens treinados, 120 min a ~60% do VO₂máx, 1,2 g/min de glicose + 0,8 de glicose ou de frutose. Com frutose, o lactato que entra no sangue subiu de 94 para 120 µmol/kg/min, e a oxidação da frutose se explicou meio a meio por lactato e por glicose feitos dela. Lactato alto com gel misto é combustível em trânsito.',
        key: '½ + ½', keyCaption: 'da frutose oxidada: via lactato e via glicose',
        chips: ['lecoultre'],
        sources: ['Lecoultre 2010 (n = 7)'],
    },
    {
        tab: 'Galactose',
        headline: 'Galactose: mesma porta, metade da oxidação',
        color: C.caveat,
        text: 'Cruzado randomizado, 8 atletas muito treinados, solução a 8%, 120 min a 65% da Wmáx: pico de oxidação exógena de 0,41 g/min com galactose × 0,85 com glicose; 21% × 46% do ingerido oxidado, e mais CHO endógeno gasto (124 × 100 g). Entra pelo SGLT1, como a glicose, mas precisa passar pela via de Leloir no fígado.',
        key: '0,41 × 0,85', keyCaption: 'g/min, pico de oxidação: galactose × glicose',
        chips: ['leijssen'],
        sources: ['Leijssen 1995 (n = 8)'],
    },
    {
        tab: 'Lado a lado',
        headline: 'Frutose abre pista; galactose entra na fila',
        color: C.glucoseSoft,
        text: 'As duas chegam ao músculo de carona, depois de passar pelo intestino e pelo fígado. A diferença prática está na porta: a frutose usa o GLUT5 e soma capacidade à glicose (1,26 × 0,83 g/min no slide anterior); a galactose divide o SGLT1 com ela. O que as duas fazem no fígado volta em “O Fígado Prefere Sacarose”.',
        key: 'GLUT5 × SGLT1', keyCaption: 'pista nova × a mesma fila da glicose',
        chips: ['summary'],
        sources: [],
    },
];
