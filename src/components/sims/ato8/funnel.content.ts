/** Slide 141 · do sinal ao cronômetro (dossiê 05·IMPEY2018 e 05·GEJLNYBO2021). */

export const FUNNEL_BEATS = [
    'No músculo, o sinal aparece em 3 de cada 4 estudos.',
    'No cronômetro, em pouco mais de 1 de cada 3.',
    'Em atletas treinados, a meta‑análise não separa o efeito do zero.',
] as const;

export const MOLECULAR = [
    { label: 'sinalização', value: '73%', of: '11 estudos' },
    { label: 'genes', value: '75%', of: '12' },
    { label: 'enzimas', value: '78%', of: '9' },
] as const;

/** Meta-análise de Gejl & Nybo 2021: SMD com IC95%. */
export const META = { est: 0.17, lo: -0.15, hi: 0.49, p: '0,29', k: 9 } as const;

export const FUNNEL_SOURCES = {
    impey: 'Impey SG et al. Sports Med 2018;48(5):1031-1048.',
    gejl: 'Gejl KD, Nybo L. J Int Soc Sports Nutr 2021;18(1):37.',
} as const;
