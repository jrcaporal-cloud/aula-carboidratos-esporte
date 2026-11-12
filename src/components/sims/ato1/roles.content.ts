import { Flame, RadioTower, SlidersHorizontal, type LucideIcon } from 'lucide-react';
import { C } from '../kit/palette';

/**
 * Slide 11 · Três Papéis de uma Molécula (ThreeRolesSim). O fio da aula: Combustível, Sinal e Escolha.
 * Fontes: Scott 2012 (equivalente energético do O₂), Impey 2018 (contagem de estudos de train low),
 * Burke 2011 / Thomas 2016 (faixas diárias em g/kg, lidas em tabela secundária).
 */
export type RoleId = 'fuel' | 'signal' | 'choice';

export interface Role {
    id: RoleId;
    name: string;
    /** A pergunta que o papel responde (visível com o cartão fechado). */
    ask: string;
    /** O número-gancho (aparece grande no resumo do último passo) e a sua legenda. */
    hook: string;
    hookCaption: string;
    color: string;
    icon: LucideIcon;
}

export const ROLES: readonly Role[] = [
    { id: 'fuel', name: 'Combustível', ask: 'quanto rende?', hook: '+7,7%', hookCaption: 'de energia por litro de O₂', color: C.glucose, icon: Flame },
    { id: 'signal', name: 'Sinal', ask: 'o que ela liga?', hook: '73% × 37%', hookCaption: 'dos estudos: sinal × desempenho', color: C.insulin, icon: RadioTower },
    { id: 'choice', name: 'Escolha', ask: 'quanto comer?', hook: '3–5 → 8–12', hookCaption: 'g/kg por dia, conforme a carga', color: C.ok, icon: SlidersHorizontal },
];

export const ROLE_BEATS: readonly string[] = [
    'Uma molécula, três papéis.',
    'Combustível: rende mais por litro de oxigênio.',
    'Sinal: pouco glicogênio liga genes. Mas e o cronômetro?',
    'Escolha: a dose muda com o dia de treino.',
    'Os três papéis voltam em todos os atos.',
];

/** Equivalente energético do O₂ (kJ por litro): glicose × gordura. */
export const FUEL = {
    bars: [
        { label: 'glicose', value: 21.1, color: C.glucose },
        { label: 'gordura', value: 19.6, color: C.fat },
    ],
    max: 22,
    stat: '+7,7%',
    caption: 'mais energia por litro de O₂ queimando glicose',
    calc: 'cálculo: 21,1 ÷ 19,6',
    source: 'Scott 2012, Front Physiol',
} as const;

/** Train low: fração dos 11 estudos com o desfecho. */
export const SIGNAL = {
    bars: [
        { label: 'mais sinal no músculo', value: 0.73, text: '73%' },
        { label: 'melhor desempenho', value: 0.37, text: '37%' },
    ],
    design: 'revisão · contagem de 11 estudos',
    source: 'Impey et al. 2018, Sports Med',
} as const;

/** Faixas diárias de carboidrato por carga de treino (g/kg/d). */
export const CHOICE = {
    max: 12,
    bands: [
        { label: 'leve', from: 3, to: 5 },
        { label: '~1 h/dia', from: 5, to: 7 },
        { label: '1–3 h/dia', from: 6, to: 10 },
        { label: '> 4–5 h/dia', from: 8, to: 12 },
    ],
    stat: '3–5 → 8–12',
    caption: 'g/kg/dia, conforme a carga',
    via: 'faixas via tabela secundária',
    source: 'Burke et al. 2011; Thomas et al. 2016',
} as const;
