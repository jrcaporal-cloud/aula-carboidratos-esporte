import { C } from '../kit/palette';
import type { LedgerRow } from './MedirShell';

/**
 * Slide 180 · A Régua das Diretrizes. Faixas diárias de BURKE2011/THOMAS2016 (dossiê 07, lidas em tabelas secundárias:
 * PMC6950062 e PMC6019055, que também traz o "teste da fala"); g/h durante: BURKE2011 (abstract) e JEUKENDRUP2014.
 * Gramas por peso: cálculo próprio.
 */

export interface Band {
    id: string;
    name: string;
    load: string;
    /** Como a carga soa na fala (tabela secundária de Thomas 2016). */
    talk: string;
    lo: number;
    hi: number;
}

export const RULER_MAX = 12;

export const BANDS: readonly Band[] = [
    { id: 'leve', name: 'Leve', load: 'leve ou de habilidade', talk: 'conversa e canta', lo: 3, hi: 5 },
    { id: 'moderado', name: 'Moderado', load: '~1 h por dia', talk: 'conversa, não canta', lo: 5, hi: 7 },
    { id: 'alto', name: 'Alto', load: '1–3 h/d, moderada a alta', talk: 'só frases curtas', lo: 6, hi: 10 },
    { id: 'muito', name: 'Muito alto', load: 'mais de 4–5 h por dia', talk: 'não consegue falar', lo: 8, hi: 12 },
];

/** Onde duas faixas vizinhas se cobrem (5–7 ∩ 6–10 e 6–10 ∩ 8–12). */
export const OVERLAPS = [{ lo: 6, hi: 7, lastRow: 2 }, { lo: 8, hi: 10, lastRow: 3 }] as const;

export const WEIGHTS = [58, 70, 85] as const;
export const DEFAULT_KG = 70;

/** Durante a sessão (g/h), escala de 0 a 100. */
export const GH_MAX = 100;
export const DURING = {
    short: { label: '~1 h intensa: bochecho ou pouco' },
    mid: { lo: 30, hi: 60, label: '30–60 g/h · provas mais longas' },
    long: { lo: 60, hi: 90, label: 'até 90 g/h · > 2,5 h, com mistura' },
} as const;

export interface GuideStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

const BURKE = 'Burke 2011 (consenso COI)';
const THOMAS = 'Thomas 2016 (ACSM/AND/DC)';

export const STEPS: readonly GuideStep[] = [
    {
        tab: 'Quatro faixas',
        headline: 'Por peso e por carga, não por %',
        text: 'Burke 2011, o artigo de carboidrato do consenso do COI, escalonou a meta diária pela carga de treino: 3–5, 5–7, 6–10 e 8–12 g/kg/d. O posicionamento ACSM/AND/DC de 2016 repetiu as mesmas faixas: a régua está parada há 15 anos. Uma tabela secundária traduz a carga pela fala do atleta durante o esforço.',
        sources: [BURKE, THOMAS],
    },
    {
        tab: 'Sobreposição',
        headline: 'As faixas se cobrem de propósito',
        text: '6–7 e 8–10 g/kg/d cabem em duas faixas. É recomendação de painel, sem graduação formal de evidência, para o atleta "médio". A régua dá o ponto de partida; a sessão do dia, a fase da temporada e a meta de composição corporal decidem onde o atleta fica dentro dela.',
        sources: [BURKE, THOMAS],
    },
    {
        tab: 'Em gramas',
        headline: 'Em gramas, para o atleta à sua frente',
        text: 'Para 70 kg, a régua vai de 210 g (3 g/kg, dia leve) a 840 g (12 g/kg, volume de Volta da França). O mesmo atleta pode atravessar três faixas na mesma semana: é a periodização pela sessão. Clique no peso para refazer a conta.',
        sources: [BURKE, THOMAS, 'gramas: cálculo (g/kg × peso)'],
    },
    {
        tab: 'Durante: g/h',
        headline: 'Durante a sessão, a unidade muda',
        text: 'Na hora do treino a meta é em g/h, não em g/kg: quem limita é o intestino, não o tamanho do atleta (Jeukendrup 2014). Burke 2011: ~1 h intensa pede bochecho ou pouco; provas mais longas, 30–60 g/h; acima de 2,5 h, até 90 g/h com carboidratos de transportadores diferentes.',
        sources: [BURKE, THOMAS, 'gramas: cálculo (g/kg × peso)', 'Jeukendrup 2014 (revisão)'],
    },
];

export const LEDGER: readonly LedgerRow[] = [
    { at: 0, term: 'g/kg/d', text: 'a meta diária segue o peso e a carga de treino', color: C.glucose },
    { at: 1, term: '6–7 · 8–10', text: 'zonas de duas faixas: ponto de partida, não receita', color: C.stone },
    { at: 2, term: '210–840 g', text: 'de 3 a 12 g/kg num atleta de 70 kg (cálculo)', color: C.glucoseSoft },
    { at: 3, term: 'g/h', text: 'durante: independe do peso; até 90 g/h acima de 2,5 h', color: C.ok },
];
