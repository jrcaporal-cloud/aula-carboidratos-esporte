import type { Lesson } from './paFrame';
import { C } from '../kit/palette';

/**
 * Slide 104 · Quebrando o Teto (dossiê 03, bloco C). Pontos medidos com isótopo, de estudos diferentes
 * (curva composta): JENT2005 (72 g/h glicose → 1,06; 144 g/h 1:1 → 1,75), JENT2004 MSSE (144 g/h glicose → 1,18),
 * HULST2009 (48 g/h: 0,60 × 0,57), PFEI2010G (108 g/h 2:1 → 1,42–1,44). Desempenho: CURR2008. Proporção: OBRI2011/2013.
 */

export interface MixPoint {
    gh: number;
    ox: number;
    label: string;
}

/** Só glicose: liga os pontos medidos (a linha entre eles é ilustrativa). */
export const GLUCOSE_PTS: readonly MixPoint[] = [
    { gh: 48, ox: 0.6, label: '0,60' },
    { gh: 72, ox: 1.06, label: '1,06' },
    { gh: 144, ox: 1.18, label: '1,18' },
];

/** Glicose + frutose: 48 g/h (Hulston) e 144 g/h 1:1 (Jentjens 2005). */
export const MIX_PTS: readonly MixPoint[] = [
    { gh: 48, ox: 0.57, label: '0,57' },
    { gh: 144, ox: 1.75, label: '1,75 · 1:1' },
];

/** 2:1 a 108 g/h (Pfeiffer 2010, gel 1,44 e bebida 1,42 g/min). */
export const RATIO_21: MixPoint = { gh: 108, ox: 1.43, label: '2:1 · ~1,4' };

export interface MixStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    design: string;
    sources: readonly string[];
}

export const STEPS: readonly MixStep[] = [
    {
        tab: 'Uma pista',
        headline: 'Uma porta só para a glicose',
        color: C.glucose,
        text: 'Glicose e maltodextrina (que a borda em escova quebra em glicose) entram pela mesma porta, o SGLT1. Jentjens 2005: ciclistas treinados (n = 8), 150 min a 60% do VO₂máx, 72 g/h de glicose → pico de 1,06 g/min. A fila na luz é o teto do slide anterior; a pista da frutose está vazia.',
        design: 'ECR cruzado · n = 8 · ¹³C',
        sources: ['Jentjens 2005', 'Jentjens 2004', 'Hulston 2009'],
    },
    {
        tab: '2ª pista',
        headline: 'A frutose abre a segunda pista',
        color: C.fructose,
        text: 'Mesmo protocolo, 1,2 g/min de glicose + 1,2 de frutose (1:1, 144 g/h): pico de 1,75 g/min contra 1,06 só com glicose; nos últimos 90 min, 1,49 × 0,99. A frutose entra pelo GLUT5 e as duas saem pelo GLUT2. Atenção: o 1,75 veio de 1:1, não de 2:1.',
        design: 'ECR cruzado · n = 8 · ¹³C',
        sources: [],
    },
    {
        tab: 'Dose baixa',
        headline: 'Abaixo do teto, a mistura não acrescenta',
        color: C.stone,
        text: 'Hulston 2009 (n = 7, 150 min a 65% do VO₂máx): a 48 g/h, glicose + frutose (0,54 + 0,26 g/min) oxidou 0,57 g/min; só glicose, 0,60. Enquanto o SGLT1 tem folga, não há fila, e a segunda pista não muda nada. Para quem consome ~45 g/h, a mistura não aumenta a oxidação.',
        design: 'ECR cruzado · n = 7 · ¹³C',
        sources: [],
    },
    {
        tab: 'Desempenho',
        headline: 'A vantagem vira desempenho',
        color: C.ok,
        text: 'Currell 2008 (n = 8): 108 g/h por 120 min, depois contrarrelógio de ~1 h. A mistura 2:1 foi 8% mais rápida que só glicose e 19% que água. A 2:1 e 108 g/h, o pico fica perto de 1,4 g/min (Pfeiffer 2010). Proporção ótima: frutose:maltodextrina 0,8:1, com mais oxidação exógena, menos desconforto (O’Brien 2011 e 2013).',
        design: 'ECR cruzado · n = 8 · tempo',
        sources: ['Currell 2008', 'Pfeiffer 2010', 'O’Brien 2011; 2013'],
    },
];

export const LESSONS: readonly Lesson[] = [
    { at: 0, text: 'Glicose e maltodextrina: uma porta só, o SGLT1.', color: C.glucose },
    { at: 1, text: 'Frutose pelo GLUT5: 1,75 × 1,06 g/min (1:1, 144 g/h).', color: C.fructose },
    { at: 2, text: 'A ~48 g/h, a mistura não acrescenta (0,57 × 0,60).', color: C.stone },
    { at: 3, text: 'Vira desempenho: 8% mais rápido a 108 g/h (2:1).', color: C.ok },
];
