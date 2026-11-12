/** Slide 187 · O Placebo que Pedalou Mais (CLARK2000 — dossiê 07). */

export const LINES = [
    '43 ciclistas, contrarrelógio de 40 km. Metade bebe carboidrato, metade placebo, e cada um ouve uma coisa.',
    'O que eles ouviram mudou a potência.',
    'E o carboidrato de verdade, na mesma prova?',
] as const;

export const TOLD = [
    { id: 'cho', label: 'ouviu “carboidrato”', change: 4.3 },
    { id: 'pla', label: 'ouviu “placebo”', change: 0.5 },
    { id: 'nada', label: 'não foi informado', change: -1.1 },
] as const;

export const DRINKS = ['bebeu carboidrato', 'bebeu placebo'] as const;

export const TWIST = {
    belief: { value: '+4,3%', caption: 'potência de quem ouviu “carboidrato”' },
    real: { value: '−0,3%', caption: 'efeito real do carboidrato na bebida' },
    note: 'Prova de ~1 h: pouca demanda de carboidrato. O cegamento não é detalhe.',
} as const;

export const DESIGN = 'ECR fatorial 2 × 3 · n = 43';

export const SOURCE = 'Clark VR, Hopkins WG, Hawley JA, Burke LM. Placebo effect of carbohydrate feedings during a 40-km cycling time trial. Med Sci Sports Exerc 2000.';
