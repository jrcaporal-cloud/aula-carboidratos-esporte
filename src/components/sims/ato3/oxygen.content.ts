/** Slide 46 · O Preço do Oxigênio. SCOTT2012 (21,1 × 19,6 kJ/L), PLEWS2026 (5,05 × 4,69 kcal/L), BURKE2017 (gancho). */

export const OXY_STEPS = [
    {
        phrase: 'Mesmo motor, dois combustíveis. Quanto trabalho paga um litro de oxigênio?',
        source: 'Scott CB. ScientificWorldJournal 2012 (PMC3345970).',
    },
    {
        phrase: 'Queimando carboidrato, o litro rende 21,1 kJ. Queimando gordura, 19,6 kJ.',
        source: 'Scott CB. ScientificWorldJournal 2012 · Plews DJ et al. Sports Med 2026;56(10):2367-88.',
    },
    {
        phrase: 'Para o mesmo trabalho, o motor a gordura precisa de ~7,7% mais oxigênio.',
        source: 'Cálculo: 21,1 ÷ 19,6 = 1,077 (valores de Scott 2012).',
    },
    {
        phrase: 'No ritmo de prova, o oxigênio é o recurso escasso. A conta reaparece no cronômetro dos marchadores de elite.',
        source: 'Burke LM et al. J Physiol 2017;595(9):2785-807.',
    },
] as const;

export const ENGINES = [
    { key: 'cho', label: 'motor a carboidrato', kj: '21,1 kJ', kcal: '5,05 kcal', value: 21.1, need: '1,00 L', scale: 1 },
    { key: 'fat', label: 'motor a gordura', kj: '19,6 kJ', kcal: '4,69 kcal', value: 19.6, need: '1,08 L', scale: 21.1 / 19.6 },
] as const;
