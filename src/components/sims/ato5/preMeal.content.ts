/**
 * Slide 84 · A Refeição de 3–4 Horas. Fonte única: dossiê 04 (confirmados no abstract).
 *   COYLE1985: cruzado, n = 7 ciclistas; refeição rica em CHO 4 h antes × jejum de 16 h; 105 min a 70% do VO₂máx.
 *     Vasto lateral +42% de glicogênio no início; 1ª hora: glicemia 13–25% menor, oxidação de CHO +45%;
 *     uso de glicogênio 97 ± 18 × 64 ± 8 mmol/kg; aos 105 min, sem diferença. Sem desempenho. Dose não confirmada.
 *   SHERMAN1989: cruzado, CHO líquido 4 h antes: 0, 45, 156, 312 g; 95 min intervalado + contrarrelógio;
 *     só 312 g: +15% × placebo; insulina +84% no início; queda transitória da glicemia nos primeiros 15 min.
 *     n não consta; ~4,5 g/kg (70 kg) é cálculo do dossiê.
 *   SCHABORT1999: cruzado, n = 7; café com 100 g de CHO 3 h antes × jejum noturno; 70% do VO₂máx até a fadiga:
 *     136 ± 14 × 109 ± 12 min; glicogênio muscular, QR e oxidação iguais → o candidato é o fígado.
 *   AIRD2018: revisão sistemática + meta-análise, 46 estudos: alimentado melhora o aeróbio prolongado (P = 0,012),
 *     não o de menor duração (P = 0,687). Corte de duração e efeito agrupado não constam no abstract.
 */
import { C } from '../kit/palette';

export interface PreMealStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    limit: string;
    sources: string;
    /** Uma linha "para a prática": acumula no painel. */
    takeaway: string;
    /** Selos de desenho do passo (canto superior direito). */
    chips: readonly string[];
}

export const PRE_STEPS: readonly PreMealStep[] = [
    {
        tab: 'Enche o músculo',
        headline: '4 h antes: o músculo enche',
        color: C.glycogenSoft,
        text: 'Coyle 1985, cruzado, 7 ciclistas: refeição rica em carboidrato 4 h antes × 16 h de jejum, depois 105 min a 70% do VO₂máx. O vasto lateral largou com 42% mais glicogênio e gastou mais (97 × 64 mmol/kg); aos 105 min, iguais.',
        limit: 'sem teste de desempenho; dose da refeição não consta no abstract.',
        sources: 'Coyle 1985',
        takeaway: '4 h antes: o tanque enche e gasta mais.',
        chips: ['cruzado · n = 7 · metabólico'],
    },
    {
        tab: 'A dose',
        headline: 'Só a maior dose rendeu',
        color: C.glucose,
        text: 'Sherman 1989, cruzado: carboidrato líquido 4 h antes (0, 45, 156 ou 312 g), 95 min intervalados e contrarrelógio. Só 312 g rendeu: +15% contra placebo. A insulina largou 84% acima; a glicemia caiu nos primeiros 15 min e depois se manteve.',
        limit: 'o abstract não traz o n.',
        sources: 'Sherman 1989',
        takeaway: 'Dose que rendeu: 312 g (~4,5 g/kg, cálculo).',
        chips: ['cruzado · 4 doses · contra placebo'],
    },
    {
        tab: 'O café',
        headline: '3 h antes: o ganho é do fígado',
        color: C.glucoseSoft,
        text: 'Schabort 1999, cruzado, n = 7: café com 100 g de carboidrato 3 h antes × jejum da noite, 70% do VO₂máx até a fadiga: 136 × 109 min. Glicogênio muscular, QR e oxidação iguais: o candidato é o fígado, que a noite esvazia.',
        limit: 'tempo até a fadiga, sem carboidrato durante, n = 7.',
        sources: 'Schabort 1999',
        takeaway: 'Café de 100 g, 3 h antes, repõe o fígado.',
        chips: ['cruzado · n = 7 · até a fadiga'],
    },
    {
        tab: 'Para quem rende',
        headline: 'Rende no longo, não no curto',
        color: C.ok,
        text: 'Aird 2018, meta-análise de 46 estudos, alimentado × jejum: comer antes melhorou o aeróbio prolongado (P = 0,012), não o de menor duração (P = 0,687). Treinar em jejum vira escolha de adaptação, não de desempenho.',
        limit: 'estudos heterogêneos, sem cegamento; o corte de duração não consta no abstract.',
        sources: 'Aird 2018 (meta-análise)',
        takeaway: 'Longo: comer antes. Curto: tanto faz.',
        chips: ['meta-análise · 46 estudos'],
    },
];

/** Linha do tempo: horas antes da largada. */
export const HOURS = [-4, -3, -2, -1, 0] as const;

/** Estudos pendurados no relógio: cada hora mostra o rótulo mais recente já revelado. */
export const PINS = [
    { hour: -4, labels: [{ at: 0, text: 'Coyle · refeição' }, { at: 1, text: 'Coyle · Sherman' }] },
    { hour: -3, labels: [{ at: 2, text: 'Schabort · café 100 g' }] },
] as const;

/** Hora da refeição do estudo de cada passo (o passo 4 olha a prova inteira). */
export const STEP_HOUR: readonly (number | undefined)[] = [-4, -4, -3, undefined];

export const COYLE = {
    title: 'Coyle 1985 · 4 h antes',
    value: '+42%',
    caption: 'glicogênio na largada',
    use: 'uso: 97 × 64 mmol/kg',
    firstHour: '1ª h: glicemia −13–25%, CHO oxidado +45%',
    end: 'igual aos 105 min',
    tanks: [
        { label: 'jejum', level: 0.5 },
        { label: 'refeição', level: 0.5 * 1.42 },
    ],
} as const;

export const SHERMAN = {
    title: 'Sherman 1989 · 4 h antes',
    doses: [0, 45, 156, 312] as const,
    value: '+15%',
    note: 'insulina +84% na largada',
} as const;

export const SCHABORT = {
    title: 'Schabort 1999 · 3 h antes',
    rows: [
        { label: 'café 100 g', min: 136, sd: 14 },
        { label: 'jejum', min: 109, sd: 12 },
    ],
    max: 160,
    unit: 'min até a fadiga',
    note: 'músculo igual → fígado',
} as const;

export const AIRD = {
    title: 'Aird 2018 · 46 estudos',
    rows: [
        { label: 'aeróbio prolongado', verdict: 'ajuda', p: 'P = 0,012', yes: true },
        { label: 'menor duração', verdict: 'tanto faz', p: 'P = 0,687', yes: false },
    ],
} as const;

export const ILLUSTRATIVE_AT = 0;
export const ILLUSTRATIVE_TEXT = 'tanques: nível ilustrativo';
