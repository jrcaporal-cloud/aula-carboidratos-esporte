import { Magnet, Syringe, Waves, type LucideIcon } from 'lucide-react';
import { C } from '../kit/palette';

/** Slide 183 · Como se Mede o Glicogênio (TAYLOR1992, ROUTLEDGE2019 com HILL2014 — dossiê 07). */

export interface Method {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    big: string;
    bigCaption: string;
    notes: readonly string[];
}

export const METHODS: readonly Method[] = [
    {
        id: 'biopsia', name: 'Biópsia', icon: Syringe, color: C.glycogen,
        big: 'CV 9,3%', bigCaption: 'entre medidas repetidas',
        notes: ['invasiva: um fragmento da coxa', 'só músculo, só aquele ponto'],
    },
    {
        id: 'mrs', name: 'Ressonância ¹³C', icon: Magnet, color: C.caveat,
        big: 'CV 4,3%', bigCaption: 'R = 0,95 contra a biópsia',
        notes: ['não invasiva; cara e rara', 'mede também o fígado'],
    },
    {
        id: 'us', name: 'Ultrassom', icon: Waves, color: C.stone,
        big: 'r = 0,93', bigCaption: 'validação feita pelos criadores',
        notes: ['estima pela água do músculo'],
    },
];

export const LINES = [
    'A biópsia fundou a área e ainda é a referência, mas varia e só vê um pedaço do músculo.',
    'A ressonância de ¹³C é mais precisa que a biópsia, e é como se mede o glicogênio do fígado.',
    'O ultrassom prometeu medir sem agulha, e a validação veio da própria empresa.',
    'Num estudo independente, o jogo esvaziou o glicogênio e o ultrassom não viu nada.',
] as const;

/** Routledge 2019, estudo 1: rugby league, antes e depois do jogo. */
export const ROUTLEDGE = {
    glycogen: { before: 443, after: 271, unit: 'mmol/kg ps' },
    score: { before: 47, after: 49 },
    p: 'P = 0,4',
    design: 'biópsia × ultrassom · n = 14',
} as const;

export const DESIGNS = [
    'Bergström, anos 1960',
    'validação · n = 8 · biópsia no mesmo dia',
    'fabricante · n = 22',
    ROUTLEDGE.design,
] as const;

export const SOURCE = 'Taylor R et al. Magn Reson Med 1992 · Hill JC, San Millán I. Phys Sportsmed 2014 · Routledge HE et al. Med Sci Sports Exerc 2019.';
