/**
 * Slide 46 · O Preço do Oxigênio. Fonte única dos textos e números.
 * P/O 2,5 × 1,5: HINKLE2005. Carreadores por molécula (10 NADH + 2 FADH₂ por glicose; 31 + 15 por palmitato):
 * livro-texto (Lehninger 7ª ed., caps. 16–17; conferido em busca web, Tymoczko 3ª ed. cap. 27).
 * 21,1 × 19,6 kJ/L: SCOTT2012; 5,05 × 4,69 kcal/L: PLEWS2026; ~7,7%: cálculo. Ritmo de prova: BURKE2017.
 * ATP por O₂ (glicose × gordura) NÃO aparece: não confirmado em fonte.
 */

export interface OxyStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
    /** Selos de desenho do passo (canto superior direito). */
    design: readonly string[];
    calc?: string;
    /** Dado-chave do passo, quando o livro-caixa ainda não ocupa o painel. */
    stat?: { value: string; caption: string };
}

export const OXY_STEPS: readonly OxyStep[] = [
    {
        tab: 'Duas portas',
        headline: 'O FADH₂ entra pela porta lateral',
        text: 'O NADH entrega os elétrons ao complexo I; o FADH₂ entrega direto à ubiquinona (Q), pelo complexo II ou pela ETF da β-oxidação, e pula o primeiro bombeamento de H⁺. Menos H⁺ por par de elétrons, menos ATP por átomo de O: P/O ≈ 2,5 para o NADH e ≈ 1,5 para o FADH₂ (2,3 e 1,4 se a ATP-sintase gastar 10/3 H⁺ por ATP).',
        sources: ['Hinkle 2005 (P/O, revisão quantitativa)'],
        design: ['P/O: revisão quantitativa'],
        stat: { value: '2,5 × 1,5', caption: 'ATP por átomo de O: porta do NADH × porta do FADH₂' },
    },
    {
        tab: 'Dois combustíveis',
        headline: 'A gordura usa mais a porta lateral',
        text: 'Contando os carreadores (livro-texto): 1 glicose oxidada até CO₂ gera 10 NADH e 2 FADH₂; 1 palmitato, 31 NADH e 15 FADH₂. Na glicose, 1 em cada 6 pares de elétrons entra pela porta de rendimento menor; no palmitato, 1 em cada 3.',
        sources: ['Lehninger, 7ª ed., 2017 (caps. 16–17)'],
        design: ['carreadores: livro-texto'],
        calc: 'proporção: contagem',
    },
    {
        tab: 'O litro de O₂',
        headline: 'O mesmo litro rende menos com gordura',
        text: '1 L de O₂ libera ~21,1 kJ queimando glicose e ~19,6 kJ queimando gordura (Scott 2012, artigo teórico; Plews 2026: 5,05 × 4,69 kcal). 21,1 ÷ 19,6 = 1,077: para o mesmo trabalho, ~7,7% mais O₂. É energia por O₂; a diferença em ATP por O₂ não foi confirmada em fonte.',
        sources: ['Scott 2012 (artigo teórico)', 'Plews 2026 (opinião)'],
        design: ['artigo teórico'],
        calc: '~7,7%: cálculo',
    },
    {
        tab: 'Ritmo de prova',
        headline: 'Na prova, o oxigênio é o teto',
        text: 'Burke 2017 (marchadores de elite, 3 semanas, não randomizado, n = 9/10/10): a dieta cetogênica (LCHF) levou a oxidação de gordura a 1,57 g/min, mas subiu o custo de O₂ no ritmo de 20 km. Nos 10 km, o CHO periodizado também melhorou (+5,3%). Volta no slide do Supernova (Ato VIII).',
        sources: ['Burke 2017 (J Physiol)'],
        design: ['elite · não randomizado · n = 29'],
    },
];

/** Linhas do palco: carreadores por molécula e O₂ para o mesmo trabalho. */
export const FUELS = [
    { key: 'cho', label: 'glicose', nadh: 10, fadh: 2, share: '1 em 6', o2: 1, o2Text: '1,00 L' },
    { key: 'fat', label: 'palmitato', nadh: 31, fadh: 15, share: '1 em 3', o2: 21.1 / 19.6, o2Text: '1,08 L' },
] as const;

/** Livro-caixa do painel (carboidrato × gordura): cada linha entra num passo e fica. */
export interface OxyRow {
    at: number;
    label: string;
    cho: string;
    fat: string;
    total?: boolean;
}

export const OXY_LEDGER: readonly OxyRow[] = [
    { at: 1, label: 'pela porta FADH₂', cho: '1 em 6', fat: '1 em 3' },
    { at: 2, label: 'kJ por litro de O₂', cho: '21,1', fat: '19,6' },
    { at: 2, label: 'O₂ a mais, mesma carga', cho: '—', fat: '+7,7%', total: true },
    { at: 3, label: '10 km · HCHO × LCHF', cho: '+6,6%', fat: '−1,6%' },
];
