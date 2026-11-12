/**
 * Slides 103–104 · oxidação exógena (g/min) × ingestão (g/h). Pontos medidos com isótopo, de estudos diferentes:
 * HULST2009 (48 g/h), JENT2005 (72 e 144 g/h, mistura 1:1), JENT2004 (144 g/h). A linha só liga os pontos.
 */

export interface OxPoint {
    gh: number;
    ox: number;
    label: string;
}

export const GLUCOSE: readonly OxPoint[] = [
    { gh: 48, ox: 0.6, label: 'Hulston 2009' },
    { gh: 72, ox: 1.06, label: 'Jentjens 2005' },
    { gh: 144, ox: 1.18, label: 'Jentjens 2004' },
];

export const MIX: readonly OxPoint[] = [
    { gh: 48, ox: 0.57, label: 'Hulston 2009' },
    { gh: 144, ox: 1.75, label: 'Jentjens 2005' },
];

/**
 * Forma da curva da mistura (ilustrativa entre os pontos medidos): igual à glicose enquanto o SGLT1 dá conta,
 * e seguindo até 1,75 g/min a 144 g/h quando a segunda pista abre.
 */
export const MIX_CURVE: readonly OxPoint[] = [
    { gh: 48, ox: 0.57, label: '' },
    { gh: 72, ox: 1.06, label: '' },
    { gh: 144, ox: 1.75, label: '' },
];

/** Interpola linearmente entre os pontos medidos (origem em 0,0); acima do último, mantém o valor. */
export const interp = (pts: readonly OxPoint[], gh: number): number => {
    const all = [{ gh: 0, ox: 0 }, ...pts];
    for (let i = 1; i < all.length; i++) {
        const a = all[i - 1];
        const b = all[i];
        if (gh <= b.gh) return a.ox + ((b.ox - a.ox) * (gh - a.gh)) / (b.gh - a.gh);
    }
    return all[all.length - 1].ox;
};

export const CEILING_LEADS = [
    'Só glicose, três ensaios com isótopo: entram 48, 72 ou 144 g/h. Quanto vira combustível?',
    'Com uma fonte só, a oxidação para em ~1,0–1,1 g/min, por mais que se beba.',
    'O que não é oxidado na hora fica pelo caminho, no intestino.',
    'O teto não é do músculo: é da absorção (SGLT1) e do fígado. Como abrir outra porta?',
] as const;

export const BOTTLENECK = [
    { organ: 'intestino', detail: 'SGLT1 satura', limit: true },
    { organ: 'fígado', detail: 'libera ~1 g/min', limit: true },
    { organ: 'músculo', detail: 'não é o limite', limit: false },
] as const;

export const MIX_LEADS = [
    'Uma pista só: o SGLT1 lota perto de 1 g/min.',
    'A frutose entra por outra porta, o GLUT5, e a oxidação passa do teto.',
    'Em dose moderada, a segunda pista não acrescenta nada.',
    'A vantagem vira desempenho a 108 g/h. Proporção ótima perto de 0,8:1.',
] as const;
