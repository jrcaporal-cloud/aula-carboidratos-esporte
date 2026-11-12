/**
 * Slide 65 · Três endereços na fibra. Fontes: dossiê 01/02 · NIELSEN2011 (MET, n = 10 atletas de endurance de elite,
 * VO₂máx 68; intramiofibrilar esvazia mais, igual em tipo I e II; em repouso tipo I com mais intra e subsarcolemal;
 * só com água, a ressíntese falha sobretudo no intra), ORTENBLAD2011 (intra = 10–15% do total), NIELSEN2013
 * (β-partículas de 10–45 nm). As proporções por endereço no desenho são didáticas (não estão no resumo).
 */

export type Pool = 'sub' | 'inter' | 'intra';

export interface PoolStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

const NIELSEN11 = 'Nielsen 2011 (J Physiol, MET)';

export const POOL_STEPS: readonly PoolStep[] = [
    {
        tab: 'Escala',
        headline: 'Uma fibra vista por dentro',
        text: 'A biópsia tira centímetros de coxa; a fibra se mede em micrômetros; o grânulo de glicogênio, a β-partícula, tem 10–45 nm. Só a microscopia eletrônica (MET) mostra onde ele fica. Nielsen 2011 contou os grânulos em 10 atletas de endurance de elite (VO₂máx 68).',
        sources: ['Nielsen & Ørtenblad 2013 (revisão)', NIELSEN11],
    },
    {
        tab: 'Subsarcolemal',
        headline: '① Logo abaixo da membrana',
        text: 'Entre o sarcolema e a primeira miofibrila, ao lado das mitocôndrias subsarcolemais e do núcleo. Em repouso, as fibras tipo I tinham mais glicogênio aqui e dentro das miofibrilas que as tipo II.',
        sources: [NIELSEN11],
    },
    {
        tab: 'Intermiofibrilar',
        headline: '② Entre as miofibrilas',
        text: 'No corredor entre duas miofibrilas, na altura da banda I: encostado no retículo sarcoplasmático, nas tríades (túbulo T entre duas cisternas) e nas mitocôndrias intermiofibrilares. Perto de quem gasta ATP e de quem guarda o cálcio.',
        sources: [NIELSEN11],
    },
    {
        tab: 'Intramiofibrilar',
        headline: '③ Dentro da miofibrila',
        text: 'Entre os filamentos de actina e miosina, sobretudo na banda I, junto à linha Z. É o menor dos três endereços, mas o único dentro da maquinaria que encurta a fibra.',
        sources: ['Ørtenblad 2011 (J Physiol)'],
    },
    {
        tab: 'Exaustão',
        headline: 'O pequeno acaba primeiro',
        text: 'Após 1 h de exercício exaustivo de braço e perna, o intramiofibrilar caiu mais que os outros dois, igual nas fibras tipo I e II. A média do músculo pode parecer razoável enquanto o endereço colado às miofibrilas já secou.',
        sources: [NIELSEN11],
    },
    {
        tab: 'Só água',
        headline: 'E é o último a voltar',
        text: 'Na recuperação com refeição rica em carboidrato, os endereços se refazem. Só com água, a ressíntese falhou sobretudo no intramiofibrilar. Limites: n = 10; a MET olha poucas fibras por biópsia; as quantidades do desenho são ilustrativas.',
        sources: [NIELSEN11],
    },
];

export const EXHAUSTED_STEP = 4;
export const WATER_STEP = 5;

/** Passo → endereço em foco (null = todos acesos). */
export const POOL_FOCUS: readonly (Pool | null)[] = [null, 'sub', 'inter', 'intra', null, null];

/**
 * Fração de grânulos que sobra em cada endereço (desenho didático): após a exaustão e na recuperação só com água.
 * Só a ordem é dado (intra cai mais e custa a voltar); os números são do desenho.
 */
export const LEFT_AFTER: Record<'exhausted' | 'water', Record<Pool, number>> = {
    exhausted: { sub: 0.6, inter: 0.55, intra: 0.15 },
    water: { sub: 0.8, inter: 0.75, intra: 0.2 },
};

export const POOL_NAMES: Record<Pool, string> = { sub: 'subsarcolemal', inter: 'intermiofibrilar', intra: 'intramiofibrilar' };
export const POOL_ORDER: readonly Pool[] = ['sub', 'inter', 'intra'];

/** Livro-caixa do painel: o que cada endereço fez (texto do resumo de Nielsen 2011). */
export const POOL_LEDGER: Record<Pool, { exhausted: string; water: string }> = {
    sub: { exhausted: 'cai menos', water: 'menos afetada' },
    inter: { exhausted: 'cai menos', water: 'menos afetada' },
    intra: { exhausted: 'cai mais', water: 'custa a voltar' },
};

export const POOL_CHIPS: readonly string[] = [
    'MET · n = 10', 'MET · n = 10', 'MET · n = 10', 'MET · n = 10', 'MET · n = 10', 'MET · n = 10',
];
