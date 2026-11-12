/** Slide 108 · Formato e Hidrogel. HEAR2022, PFEI2010G, SUTEHALL2020 (repouso), SUTE2022, ROWE2022 (dossiê 03, bloco E + K). */

export const FORMATS = [
    { name: 'bebida', ox: '1,56' },
    { name: 'gel', ox: '1,58' },
    { name: 'goma', ox: '1,59' },
    { name: 'combinação', ox: '1,66' },
] as const;

export const META = [
    { outcome: 'desempenho', p: '0,59', k: '5 estudos' },
    { outcome: 'oxidação', p: '0,71', k: '7 estudos' },
    { outcome: 'glicemia', p: '0,66', k: '7 estudos' },
] as const;

export const LEADS = [
    'Mesmos 120 g/h em quatro formatos: o pico de oxidação não muda (diferença ns).',
    'O hidrogel vira gel no ácido do estômago. Em repouso, esvazia mais rápido. Plausível.',
    'Na meta-análise contra bebida isocalórica: nada se move. I² = 0%.',
    'Um ensaio positivo isolado. Mecanismo plausível não é efeito medido.',
] as const;

export const DESIGN = [
    'medidas repetidas · n = 9 · 13C',
    'mecanismo medido em repouso',
    'meta-análise · 5–7 estudos · I² = 0%',
    'ECR cruzado · n = 11 · duplo-cego',
] as const;

export const SOURCES = [
    'Hearris et al., J Appl Physiol 2022 · Pfeiffer et al., MSSE 2010 (gel 1,44 × bebida 1,42 g/min)',
    'Sutehall et al., MSSE 2020 (t½ de esvaziamento, em repouso)',
    'Sutehall et al., Sports Med Open 2022',
    'Rowe et al., Med Sci Sports Exerc 2022 · Sutehall et al. 2022',
] as const;
