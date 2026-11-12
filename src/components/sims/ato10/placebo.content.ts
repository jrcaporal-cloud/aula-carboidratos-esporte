import { C } from '../kit/palette';
import type { DecideRow } from './DecideShell';

/** Slide 187 · O Placebo que Pedalou Mais (CLARK2000 — dossiê 07, confirmado no abstract). O pico do Ato X. */

export interface PlaceboStep {
    tab: string;
    headline: string;
    text: string;
}

export const PLACEBO_STEPS: readonly PlaceboStep[] = [
    {
        tab: 'O desenho',
        headline: 'Um fatorial 2 × 3: a bebida e o que foi dito',
        text: 'Clark 2000: 43 ciclistas competitivos (41 homens, 2 mulheres) num contrarrelógio de 40 km (~58 min; 265 ± 46 W na linha de base). Bebida de 16 mL/kg com 7,6 g/100 mL de carboidrato ou placebo indistinguível. Cada subgrupo ouviu “carboidrato”, “placebo” ou nada: o desenho separa o copo da crença.',
    },
    {
        tab: 'O que ouviram',
        headline: 'O que eles ouviram mudou a potência',
        text: 'Quem ouviu “carboidrato” subiu a potência em 4,3 ± 4,8%; quem ouviu “placebo”, 0,5 ± 5,8%; quem não foi informado, −1,1 ± 8,5%. Entre ouvir “carboidrato” e ouvir “placebo”, 3,8% de diferença (faixa provável de 95%: −0,2 a 7,9%).',
    },
    {
        tab: 'O copo de verdade',
        headline: 'E o carboidrato do copo?',
        text: 'Comparando só o conteúdo do copo, o efeito real do carboidrato foi de −0,3% (−3,8 a 4,4%). Numa prova de ~1 h, com pouca demanda de carboidrato, isso conversa com Colombani 2013: alimentado e até ~70 min, efeito improvável.',
    },
    {
        tab: 'Por que importa',
        headline: 'O cegamento não é detalhe',
        text: 'Limitações: prova de ~1 h, comparação entre grupos (não cruzada), faixas largas e ~7 atletas por célula. Estudo sem cegamento do atleta mede a crença junto com o carboidrato; no consultório, parte do efeito relatado pode ser expectativa.',
    },
];

export const TOLD = [
    { id: 'cho', label: 'ouviu “carboidrato”', change: 4.3, sd: '4,8' },
    { id: 'pla', label: 'ouviu “placebo”', change: 0.5, sd: '5,8' },
    { id: 'nada', label: 'não foi informado', change: -1.1, sd: '8,5' },
] as const;

/** Intervalos da comparação (faixa provável de 95%), em % de potência. */
export const CONTRASTS = [
    { id: 'belief', at: 1, label: 'crença', detail: 'ouviu C − ouviu P', est: 3.8, lo: -0.2, hi: 7.9, color: C.stone },
    { id: 'drink', at: 2, label: 'carboidrato', detail: 'bebeu C − bebeu P', est: -0.3, lo: -3.8, hi: 4.4, color: C.glucose },
] as const;

export const AXIS = { min: -5, max: 9, ticks: [-4, 0, 4, 8] } as const;

/** A frase que fica no painel a partir do passo 3 (o pico do slide). */
export const PUNCH = 'Na mesma prova, o rótulo valeu mais do que o conteúdo.';

export const DESIGN = 'ECR fatorial 2 × 3 · n = 43';

export const PLACEBO_LEDGER: readonly DecideRow[] = [
    { at: 0, term: '43 ciclistas, contrarrelógio de 40 km', value: '~58 min', color: C.stone },
    { at: 1, term: 'crença: ouviu C − ouviu P', value: '+3,8%', color: C.stone },
    { at: 2, term: 'carboidrato: bebeu C − bebeu P', value: '−0,3%', color: C.glucose },
    { at: 3, term: 'atletas por célula (43 ÷ 6)', value: '~7', color: C.caveat },
];

export const SOURCE = 'Clark VR, Hopkins WG, Hawley JA, Burke LM. Med Sci Sports Exerc 2000;32(9):1642-7';
