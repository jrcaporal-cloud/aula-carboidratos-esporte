import { C } from '../kit/palette';

/** Slide 100 · Gainesville, 1965. Fatos das páginas da UF (dossiês 03 e 07, histórias). "Orange Bowl 1967": não usar. */

export const STATIONS = [
    { date: 'ago 1965', label: 'a pergunta' },
    { date: '1965', label: 'a bebida' },
    { date: '1º–2 out 1965', label: 'o teste' },
    { date: '1967 → hoje', label: 'o produto' },
] as const;

export const QUESTION = 'Por que os jogadores não urinavam depois do jogo?';

export const CHAIN = [
    { name: 'Dwayne Douglas', role: 'auxiliar técnico' },
    { name: 'Dana Shires', role: 'médico' },
    { name: 'Robert Cade', role: 'nefrologista' },
] as const;

export const INGREDIENTS = [
    { name: 'água', color: C.co2 },
    { name: 'sais', color: C.stone },
    { name: 'açúcar', color: C.glucose },
    { name: 'limão', color: C.caveat },
] as const;

export const LEADS = [
    'Agosto de 1965: jogadores internados por calor. A dúvida subiu até a nefrologia.',
    'Sais e açúcar na água. Intragável, até a esposa de Cade sugerir limão.',
    'Na véspera, os calouros com a bebida dominaram o 2º tempo contra o time B.',
    'Licenciado em 1967. Nasceu de uma pergunta sobre água e sódio; o carboidrato veio junto.',
] as const;

export const SOURCE = 'UF Research (research.ufl.edu) · UF Health, "Profiles in history: Dr. Robert Cade"';
