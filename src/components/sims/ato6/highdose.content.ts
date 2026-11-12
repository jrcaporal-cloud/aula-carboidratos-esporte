/** Slide 105 · 120 g/h: o que se sabe. RAVI2025, PODL2022, VIRI2020, MORTON2026 (dossiê 03, bloco D). */

export const DOSES = [
    { gh: 60, ox: 0.89, gi: 'frequentes' },
    { gh: 90, ox: 1.31, gi: 'frequentes' },
    { gh: 120, ox: 1.68, gi: 'pico' },
] as const;

export const LEADS = [
    'Maratonistas de elite: mais entra, mais se oxida.',
    'O intestino cobra: sintomas moderados a graves em todas as doses.',
    'Ciclistas, 120 × 90 g/h: entra mais, não poupa o estoque.',
    'O estudo viral mediu dano e esforço, não o tempo.',
] as const;

export type Mark = 'up' | 'down' | 'same' | 'none';

export const LEDGER = [
    { from: 0, label: 'exógena', value: '0,89 → 1,68 g/min', mark: 'up' as Mark },
    { from: 2, label: 'endógena igual', value: '2,15 × 2,20 g/min', mark: 'same' as Mark },
    { from: 3, label: 'dano e esforço menores', value: 'maratona de montanha', mark: 'down' as Mark },
    { from: 3, label: 'desempenho', value: 'não demonstrado', mark: 'none' as Mark },
] as const;

export const DESIGN = [
    'ECR cruzado · n = 8 · elite · 13C',
    'ECR cruzado · n = 8 · elite · 13C',
    'ECR cruzado · n = 11 · 13C · jejum',
    'ECR paralelo · n = 20 · ~6–7 por grupo',
] as const;

export const SOURCES = [
    'Ravikanti et al., J Appl Physiol 2025',
    'Ravikanti et al., J Appl Physiol 2025',
    'Podlogar et al., Eur J Appl Physiol 2022',
    'Viribay et al., Nutrients 2020 · Morton et al., J Nutr 2026',
] as const;
