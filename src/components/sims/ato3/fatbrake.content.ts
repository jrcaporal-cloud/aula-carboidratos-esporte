/**
 * Slide 45 · Por que a Gordura Trava no Alto. Fonte única dos textos, do livro-caixa e dos dados das barras.
 * VANLOON2001 (n = 8 ciclistas; gordura 32 → 19 kJ/min; PDH ↑, carnitina acetilada, carnitina livre ↓; CPT-I não medida)
 * e HOWLETT1998 (n = 7 não treinados; PDH ativa e fosforilase a). As fichas de carnitina/acetil-CoA da cena são ilustrativas.
 */

export interface FatStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

const VANLOON = 'van Loon 2001 (n = 8)';
const HOWLETT = 'Howlett 1998 (n = 7)';

export const FAT_STEPS: readonly FatStep[] = [
    {
        tab: '55% Wmáx',
        headline: 'A 55%, a carnitina está livre',
        text: 'Van Loon 2001 (n = 8 ciclistas, isótopos + biópsias): a 55% da Wmáx, a gordura oxidada chega ao pico, 32 ± 2 kJ/min. Para entrar na mitocôndria, o acil-CoA troca a CoA pela carnitina na CPT-I. Com carnitina livre sobrando, a porta funciona.',
        sources: [VANLOON],
    },
    {
        tab: '75% Wmáx',
        headline: 'A 75%, a acetil-CoA prende a carnitina',
        text: 'A PDH mais ativa produz acetil-CoA mais depressa do que o Krebs consome. A carnitina-acetiltransferase (CAT) guarda o excesso como acetilcarnitina, e a carnitina livre cai. A gordura oxidada desce a 19 ± 2 kJ/min. A CPT-I não foi medida: o gargalo é inferido.',
        sources: [VANLOON],
    },
    {
        tab: 'PDH',
        headline: 'A PDH acompanha a potência',
        text: 'Howlett 1998 (n = 7 não treinados, biópsias no 1º e no 10º min): PDH ativa de 0,53 em repouso para 1,60, 2,77 e 3,33 a 35, 65 e 90% do VO₂máx, e 4,45 aos 10 min a 90%. Acetil-CoA e acetilcarnitina só sobem a 65 e 90%.',
        sources: [HOWLETT],
    },
    {
        tab: 'Fosforilase',
        headline: 'A fosforilase não precisa de mais enzima ativa',
        text: 'No mesmo estudo, a fosforilase na forma a ficou em 21,4–29,6% nas três intensidades e caiu a 15,3% aos 10 min a 90%, mesmo com mais glicogenólise. O fluxo é ajustado por Pi e AMP livres, não por mais enzima fosforilada.',
        sources: [HOWLETT],
    },
];

export interface FatRow {
    at: number;
    label: string;
    value: string;
    tone: 'fat' | 'glucose' | 'glycogen' | 'neutral';
}

export const FAT_ROWS: readonly FatRow[] = [
    { at: 0, label: 'gordura oxidada · 55% Wmáx', value: '32 kJ/min', tone: 'fat' },
    { at: 1, label: 'gordura oxidada · 75% Wmáx', value: '19 kJ/min', tone: 'fat' },
    { at: 1, label: 'carnitina livre, 55 → 75%', value: 'cai (acetilada)', tone: 'neutral' },
    { at: 2, label: 'PDH ativa, repouso → 90%', value: '0,53 → 3,33', tone: 'glucose' },
    { at: 3, label: 'fosforilase a, 1º min · 10 min', value: '21–30% · 15,3%', tone: 'glycogen' },
];

/** PDH ativa, mmol·kg peso úmido⁻¹·min⁻¹, no 1º minuto (HOWLETT1998). Aos 10 min a 90%: 4,45. */
export const PDH_BARS = [
    { label: 'rep.', value: 0.53, text: '0,53' },
    { label: '35%', value: 1.6, text: '1,60' },
    { label: '65%', value: 2.77, text: '2,77' },
    { label: '90%', value: 3.33, text: '3,33' },
] as const;
export const PDH_10MIN = { value: 4.45, text: '4,45' } as const;

/** Fosforilase a, % do total (HOWLETT1998): faixa nas três intensidades e o valor aos 10 min a 90%. */
export const PHOS = { low: 21.4, high: 29.6, drop: 15.3 } as const;
