/**
 * Versões da aula por tempo disponível (`?tempo=<minutos>` na URL).
 * Cada versão curta guarda os ids do JSON que ela MANTÉM; nada é apagado.
 * Sem o parâmetro (ou com valor desconhecido) a aula vem completa (~290 min).
 */
export type Tempo = 'completa' | '180' | '120';

/** 120 min: o fio da aula. Capa, abertura, o mecanismo essencial, um estudo-âncora por ato e o fechamento. */
const KEEP_120: readonly number[] = [
    0, 10, 11, 12, 13,
    20, 26, 29,
    43, 44, 45, 51,
    62, 68, 69, 70,
    81, 83, 84, 87,
    101, 103, 104,
    120, 123, 126,
    140, 141, 145,
    160, 162, 164,
    180, 186, 187, 189, 190, 191, 199,
];

/** 180 min: a de 120 mais os slides de mecanismo e de evidência que sustentam cada recomendação. */
const KEEP_180: readonly number[] = [
    ...KEEP_120,
    22, 24,
    40, 42, 49,
    64, 67,
    80, 85,
    105, 112,
    121, 124,
    143, 148, 149,
    161, 165, 169,
    181,
];

const SHORT_VERSIONS: ReadonlyMap<string, ReadonlySet<number>> = new Map([
    ['180', new Set(KEEP_180)],
    ['120', new Set(KEEP_120)],
]);

export const readTempo = (search: string): Tempo => {
    const value = new URLSearchParams(search).get('tempo');
    return value && SHORT_VERSIONS.has(value) ? (value as Tempo) : 'completa';
};

export const keepsSlide = (tempo: Tempo, slideId: number): boolean => {
    const keep = SHORT_VERSIONS.get(tempo);
    return keep ? keep.has(slideId) : true;
};
