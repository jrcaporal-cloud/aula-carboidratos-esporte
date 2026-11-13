/**
 * Slide 142 · Sleep low (dossiê 05·MARQUET2016a, LANE2015, GEJL2017, RIIS2019, HULSTON2010).
 * Os horários da linha do dia são ilustrativos; o desenho (mesmo CHO no dia, outro horário) é o de Marquet 2016.
 */
import { C } from '../kit/palette';
import type { LedgerRow } from './SnShell';

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
        text: 'Hulston 2010: 14 ciclistas bem treinados, 3 semanas, HIT 1 h depois do treino aeróbio (2 sessões no dia). Nas sessões intensas com pouco glicogênio, 297 × 323 W: ~8% menos potência justo na sessão de qualidade. O contrarrelógio final melhorou ~10% nos dois.',
        sources: ['Hulston 2010 (MSSE)'],
    },
];

/** O dia em blocos (17 h → 17 h do dia seguinte). Horários ilustrativos; largura didática, não proporcional. */
export interface DayBlock {
    id: 'easy' | 'refuel' | 'hit' | 'night';
    label: string;
    /** Hora de início, sob o bloco. */
    start: string;
    flex: number;
}

export const DAY: readonly DayBlock[] = [
    { id: 'hit', label: 'treino intenso com CHO', start: '17 h', flex: 2.2 },
    { id: 'night', label: 'noite sem CHO', start: '19 h', flex: 2.2 },
    { id: 'easy', label: 'treino leve em jejum', start: '7 h', flex: 2 },
    { id: 'refuel', label: 'CHO de volta', start: '8h30', flex: 2 },
];

/** Livro-caixa do painel: a cadeia em uma linha por elo (entra no passo e fica). */
export const SLEEP_LEDGER: readonly LedgerRow[] = [
    { at: 0, label: 'Lane 2015, jejum', value: 'sinal ↑ · biogênese igual' },
    { at: 1, label: '1 · Marquet, 10 km (não cego)', value: '−2,9% × −0,1%', color: C.stone },
    { at: 2, label: '2 · Gejl e Riis, contrarrelógio', value: 'igual ao controle', color: C.stone },
    { at: 3, label: '3 · custo: Hulston, HIT', value: '297 × 323 W (−8%)', color: C.risk },
];
