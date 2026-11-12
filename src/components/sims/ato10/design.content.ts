/** Slide 186 · O Desenho Decide o Efeito (JEUKENDRUP1996, COLOMBANI2013, VANDENBOGAERDE2011 — dossiê 07). */

export const LINES = [
    'No contrarrelógio, um efeito pequeno e real se destaca do ruído.',
    'No tempo até a exaustão, o mesmo efeito afunda no ruído do próprio teste.',
    'Quando o ensaio imita a prova, o efeito encolhe; abaixo de ~70 min, quase some.',
] as const;

/** Coeficiente de variação de cada teste, repetido 6 vezes pelos mesmos atletas (n = 30). */
export const CV = { tt: 3.35, tte: 26.6 } as const;
/** Efeito ilustrativo (%), igual nos dois testes. */
export const EFFECT = 5;
export const X_RANGE = 35;

export const STATS = [
    { value: 'CV 3,35%', caption: 'contrarrelógio: o mesmo atleta repete quase igual', color: '#34D399' },
    { value: 'CV 26,6%', caption: 'tempo até a exaustão: a repetição varia mais que o efeito', color: '#E7E5E4' },
] as const;

export const COLOMBANI = {
    headline: { value: '11 de 22', caption: 'intervenções sem melhora com atleta alimentado e teste que imita a prova' },
    rows: [
        { lit: 1, total: 5, label: 'até ~70 min' },
        { lit: 10, total: 17, label: '70 a 241 min' },
    ],
    note: 'jejum noturno e placebo de água inflam o efeito nos ensaios clássicos',
    design: 'RS · 17 estudos · 22 intervenções',
} as const;

export const DESIGNS = ['reprodutibilidade · n = 30 · 6 repetições', 'reprodutibilidade · n = 30 · 6 repetições', COLOMBANI.design] as const;

export const SOURCE = 'Jeukendrup A et al. Med Sci Sports Exerc 1996 · Colombani PC et al. Nutr J 2013 · Vandenbogaerde TJ, Hopkins WG. Sports Med 2011.';
