/** Slide 144 · A promessa da gordura (dossiê 05·PHINNEY1983, BURKE2021rev, VOLEK2016, BURKE2017, BURKE2021a). */

export const FAT_BEATS = [
    '1983: cinco ciclistas, quatro semanas de dieta cetogênica, resistência preservada.',
    'Mas a média foi puxada por um único ciclista.',
    'A adaptação é real: o pico de oxidação de gordura passa do dobro.',
    'E é rápida. Falta saber se o cronômetro acompanha.',
] as const;

export const PHINNEY = { n: 5, before: 147, after: 151, intensity: '62–64% do VO₂máx' } as const;

export interface FatBar {
    id: string;
    label: string;
    sub: string;
    gmin: number;
    /** Valor aproximado no resumo ("~1,43"). */
    approx?: boolean;
    /** Passo em que entra. */
    from: number;
}

export const FAT_BARS: readonly FatBar[] = [
    { id: 'hc', label: 'dieta rica em CHO', sub: 'ultramaratonistas', gmin: 0.67, from: 2 },
    { id: 'lc', label: 'keto há ~20 meses', sub: 'ultramaratonistas', gmin: 1.54, from: 2 },
    { id: 'd5', label: 'após 5–6 dias', sub: 'marchadores', gmin: 1.43, approx: true, from: 3 },
    { id: 'w3', label: 'após 3 semanas', sub: 'marchadores', gmin: 1.57, from: 3 },
];

export const FAT_SOURCES = [
    'Phinney SD et al. Metabolism 1983;32(8):769-776.',
    'Phinney 1983, via Burke LM. J Physiol 2021;599(3):819-843.',
    'Volek JS et al. Metabolism 2016;65(3):100-110.',
    'Burke LM et al. J Physiol 2017;595(9):2785-2807; Burke LM et al. J Physiol 2021;599(3):771-790.',
] as const;
