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
    /** Texto de pós do cartão aberto (estudo, desenho, limitação). */
    text: string;
    color: string;
    icon: LucideIcon;
    /** Atos (romanos) em que o papel volta: acende no último passo. */
    acts: readonly string[];
    /** Fonte curta do rodapé. */
    source: string;
}

export const ROLES: readonly Role[] = [
    {
        id: 'fuel', name: 'Combustível', ask: 'quanto rende?', color: C.glucose, icon: Flame,
        text: 'Equivalente energético do O₂: ~21,1 kJ/L queimando glicose, ~19,6 kJ/L queimando gordura. Com o oxigênio como gargalo, a glicose rende mais trabalho pelo mesmo fôlego.',
        acts: ['II', 'III', 'IV', 'VI'],
        source: 'Scott 2012',
    },
    {
        id: 'signal', name: 'Sinal', ask: 'o que ela liga?', color: C.insulin, icon: RadioTower,
        text: 'Train low: treinar com glicogênio baixo em 30–50% das sessões. O músculo responde em 3 de cada 4 estudos; o cronômetro, em 1 de cada 3 (63% sem mudança).',
        acts: ['IV', 'VI', 'VIII'],
        source: 'Impey et al. 2018',
    },
    {
        id: 'choice', name: 'Escolha', ask: 'quanto comer?', color: C.ok, icon: SlidersHorizontal,
        text: 'As diretrizes trocaram "% da energia" por g/kg ajustado à carga do dia: a mesma pessoa muda de faixa conforme o treino. Consenso, sem graduação formal de evidência.',
        acts: ['V', 'VII', 'IX', 'X'],
        source: 'Burke et al. 2011; Thomas et al. 2016',
    },
];

export const ROLE_TABS: readonly string[] = ['Uma molécula', 'Combustível', 'Sinal', 'Escolha', 'O fio da aula'];

/** Passo em que cada papel abre (e fica aberto). */
export const OPEN_AT: Readonly<Record<RoleId, number>> = { fuel: 1, signal: 2, choice: 3 };

/** Equivalente energético do O₂ (kJ por litro): glicose × gordura (Scott 2012). */
export const FUEL = {
    bars: [
        { label: 'glicose', value: 21.1, color: C.glucose },
        { label: 'gordura', value: 19.6, color: C.fat },
    ],
    max: 22,
    stat: '+7,7%',
    caption: 'por litro de O₂ com glicose',
    calc: 'cálculo: 21,1 ÷ 19,6',
} as const;

/** Train low (Impey 2018): estudos com o desfecho / estudos que mediram. Contagem = % × n, arredondada. */
export const SIGNAL = {
    rows: [
        { label: 'sinalização', hit: 8, n: 11, pct: '73%' },
        { label: 'genes', hit: 9, n: 12, pct: '75%' },
        { label: 'enzimas', hit: 7, n: 9, pct: '78%' },
        { label: 'desempenho', hit: 4, n: 11, pct: '37%' },
    ],
    calc: 'cálculo: % × n',
    design: 'revisão · contagem',
} as const;

/** Faixas diárias de carboidrato por carga de treino (g/kg/d), Burke 2011 = Thomas 2016. */
export const CHOICE = {
    max: 12,
    bands: [
        { label: 'leve', from: 3, to: 5 },
        { label: '~1 h/dia', from: 5, to: 7 },
        { label: '1–3 h/dia', from: 6, to: 10 },
        { label: '> 4–5 h/dia', from: 8, to: 12 },
    ],
    /** Marina (fictícia, 58 kg): 3 × 58 e 12 × 58. */
    marina: '174 → 696 g/dia',
    marinaCaption: 'Marina, 58 kg',
    calc: 'cálculo · fictício',
    via: 'via revisão',
} as const;

export const ROLE_FINAL = 'Cada slide da aula acende um desses papéis.';
