/** Slide 65 · Três endereços na fibra. Fonte: dossiê 01/02 · NIELSEN2011, ORTENBLAD2011 (intramiofibrilar = 10–15% do total). */

export type Pool = 'sub' | 'inter' | 'intra';

export const POOLS: readonly { id: Pool; name: string; where: string; share?: string }[] = [
    { id: 'sub', name: 'subsarcolemal', where: 'logo abaixo da membrana' },
    { id: 'inter', name: 'intermiofibrilar', where: 'entre as miofibrilas, junto ao retículo' },
    { id: 'intra', name: 'intramiofibrilar', where: 'dentro da miofibrila, entre os filamentos', share: '10–\u206015% do total' },
];

/** Passo → endereço em foco (null = todos). O último passo é o exercício exaustivo. */
export const POOL_FOCUS: readonly (Pool | null)[] = [null, 'sub', 'inter', 'intra', null];
export const EXHAUSTED_STEP = 4;

export const POOL_LEADS = [
    'O glicogênio não fica solto na fibra: tem três endereços.',
    'Subsarcolemal: logo abaixo da membrana.',
    'Intermiofibrilar: entre as miofibrilas, ao lado das mitocôndrias e do retículo.',
    'Intramiofibrilar: dentro da miofibrila. Só 10–\u206015% do total, colado à maquinaria da contração.',
    'No exercício exaustivo, o intramiofibrilar é o primeiro a acabar e, só com água, o último a voltar.',
] as const;

/** Quanto de cada endereço sobra após o exercício exaustivo (desenho didático). */
export const EXHAUSTED_LEFT: Record<Pool, number> = { sub: 0.55, inter: 0.5, intra: 0.1 };

export const POOLS_SOURCE = 'Nielsen et al. 2011; Ørtenblad et al. 2011 (J Physiol)';
