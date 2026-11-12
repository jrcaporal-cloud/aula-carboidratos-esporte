/**
 * Slide 142 · Sleep low (dossiê 05·MARQUET2016a, LANE2015, GEJL2017, RIIS2019, HULSTON2010).
 * Os horários do relógio são ilustrativos; o desenho (mesmo CHO no dia, outro horário) é o de Marquet 2016.
 */

export interface SleepStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

export const SLEEP_STEPS: readonly SleepStep[] = [
    {
        tab: 'O dia',
        headline: 'Mesmo carboidrato, outro horário',
        text: 'Treino intenso no fim da tarde com carboidrato, noite sem carboidrato, treino leve em jejum na manhã seguinte; depois o carboidrato volta. O total não muda: 6 g/kg/d nos dois grupos. Em 7 ciclistas (Lane 2015), a manhã em jejum começou com AMPK, p38 e ACC mais fosforiladas e mais gordura oxidada, mas sem mais marcadores de biogênese mitocondrial.',
        sources: ['Marquet 2016 (MSSE)', 'Lane 2015 (J Appl Physiol)'],
    },
    {
        tab: 'Marquet 2016',
        headline: '−2,9% no 10 km, sem cegamento',
        text: 'ECR paralelo, 21 triatletas (VO₂máx 58,7), 11 × 10, 3 semanas. O tempo no 10 km caiu 2,9% × 0,1%. Mas o grupo sleep low também perdeu mais gordura (−8,5% × −2,6%) e sabia que estava no grupo "novo". As duas coisas podem explicar parte do ganho.',
        sources: [],
    },
    {
        tab: 'Réplicas',
        headline: 'Em atletas mais treinados, o ganho sumiu',
        text: 'Gejl 2017: 26 homens de elite (VO₂máx 65), 4 semanas: VO₂máx e contrarrelógio +5% nos dois grupos; glicogênio e citrato sintase sem diferença. Riis 2019: 13 treinados, 4 semanas de sleep low: ~36% mais gordura oxidada no agudo, sem efeito sustentado, e o contrarrelógio melhorou igual.',
        sources: ['Gejl 2017 (MSSE)', 'Riis 2019 (Scand J Med Sci Sports)'],
    },
    {
        tab: 'O custo',
        headline: 'O preço aparece no treino intenso',
        text: 'Hulston 2010: 14 ciclistas bem treinados, 3 semanas, HIT 1 h depois do treino aeróbio (o modelo de 2 sessões no dia). Nas sessões intensas feitas com pouco glicogênio, 297 × 323 W. O contrarrelógio final melhorou ~10% nos dois.',
        sources: ['Hulston 2010 (MSSE)'],
    },
];

/** Relógio de 24 h: arcos [início, fim] em horas. */
export interface ClockArc {
    id: 'easy' | 'refuel' | 'hit' | 'night';
    from: number;
    to: number;
    label: string;
}

export const CLOCK: readonly ClockArc[] = [
    { id: 'hit', from: 17, to: 19, label: 'treino intenso com CHO' },
    { id: 'night', from: 19, to: 7, label: 'noite sem carboidrato' },
    { id: 'easy', from: 7, to: 8.5, label: 'treino leve em jejum' },
    { id: 'refuel', from: 8.5, to: 17, label: 'carboidrato de volta' },
];

/** Barras dos estudos: sleep low (ou train low) × controle. */
export interface Metric {
    label: string;
    low: number;
    ctl: number;
    unit: string;
    max: number;
}

export interface StudyCard {
    id: string;
    who: string;
    design: string;
    at: number;
    metrics: readonly Metric[];
    /** Linhas de texto quando não há número para barra. */
    notes?: readonly string[];
}

export const STUDIES: readonly StudyCard[] = [
    { id: 'lane', who: 'Lane 2015', design: '7 ciclistas · cruzado', at: 0, metrics: [], notes: ['manhã em jejum: AMPK, p38, ACC ↑', 'marcadores de biogênese: iguais'] },
    {
        id: 'marquet', who: 'Marquet 2016', design: '21 triatletas · 3 sem', at: 1,
        metrics: [
            { label: '10 km', low: -2.9, ctl: -0.1, unit: '%', max: 3 },
        ],
        notes: ['massa gorda: −8,5% × −2,6%'],
    },
    {
        id: 'rep', who: 'Réplicas', design: '4 semanas', at: 2, metrics: [],
        notes: ['Gejl 2017 · 26 de elite: +5% nos dois', 'Riis 2019 · 13 treinados: prova igual'],
    },
    {
        id: 'hulston', who: 'Hulston 2010', design: '14 ciclistas · potência no HIT', at: 3,
        metrics: [{ label: 'HIT', low: 297, ctl: 323, unit: ' W', max: 340 }],
    },
];
