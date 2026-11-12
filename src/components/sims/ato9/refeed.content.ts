/**
 * Slide 165 · Depois da Pesagem — KONDO2021, REALE2016-JUDO, REALE2017-BOXE, CDC1998 + OPPLIGER2006 (dossiê 06).
 * A curva do glicogênio é desenho (só os marcos são do estudo): −36,5% na pesagem, ainda abaixo da base 13 h depois.
 */
import { C } from '../kit/palette';

export const KONDO = { lossPct: 6, hours: 53, choGkg: '7,1', dropPct: '36,5', after: 13 } as const;

export const SPORTS = [
    { key: 'judo', sport: 'Judô', weighIn: 'pesagem na véspera · 15–20 h antes', n: 'n = 86', result: 'medalhistas reganharam 1,4 ponto % a mais', verdict: 'associado à vitória', color: C.ok },
    { key: 'boxe', sport: 'Boxe', weighIn: 'pesagem diária, perto da luta', n: 'n = 100', result: 'reganharam ~2%, vencendo ou não', verdict: 'sem relação com vencer', color: C.stone },
] as const;

export const NCAA = { deaths: 3, from: '7 nov', to: '9 dez 1997', after: '1,7%', wrestlers: 811 } as const;

export const STEPS = [
    'Perder 6% em 53 h e comer 7,1 g/kg de CHO: 13 h depois, o glicogênio ainda não voltou.',
    'Mesma pergunta, dois regulamentos: o reganho prevê a vitória só no judô.',
    'Entre 7/11 e 9/12/1997, três lutadores universitários morreram cortando peso.',
    'A NCAA mudou a regra. Nas 20 h antes da pesagem, a perda ficou em 1,7% do peso.',
] as const;

export const DESIGNS = [
    'intervenção · n = 10 · 13C-MRS',
    'observacionais · associação, não causa',
    'relato de casos · CDC',
    'observacional · 811 lutadores · 1999–2004',
] as const;

export const SOURCES = [
    'Kondo E et al. BMC Sports Sci Med Rehabil 2021;13(1):96.',
    'Reale R et al. IJSNEM 2016;26(6):525-30 · Reale R et al. IJSPP 2017;12(7):856-63.',
    'CDC. MMWR 1998;47(6):105-8.',
    'Oppliger RA et al. Med Sci Sports Exerc 2006;38(5):963-70.',
] as const;
