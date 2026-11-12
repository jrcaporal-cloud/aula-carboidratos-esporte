/** Slide 109 · O Intestino Treina. COST2017 (+ MIAL2018 no K), COX2010, KING2022. Diego é caso fictício. */

export const DAYS = 14;

export const LEADS = [
    'Diego quer subir de 60 para 90 g/h no Ironman. O intestino dele discorda.',
    'O protocolo: gel de 30 g a cada 20 min (90 g/h) durante a corrida, por 2 semanas.',
    'Duas semanas depois: menos sintomas e mais distância que o placebo.',
    'O intestino aprende. Se isso vira tempo de prova, depende de quem e de como.',
] as const;

/** Costa 2017: variação da distância em 1 h após as 2 semanas, por grupo. */
export const DISTANCE = [
    { group: 'gel', value: 5.2, text: '+5,2%' },
    { group: 'comida', value: 4.3, text: '+4,3%' },
    { group: 'placebo', value: -2.1, text: '−2,1%' },
] as const;

export const SIDE_STATS = [
    { value: '−60%', label: 'sintomas GI (gel)' },
    { value: '6 × 12', label: 'ppm de H₂ no pico, gel × placebo' },
] as const;

/** Cox 2010: oxidação exógena de glicose no teste, antes e depois de 28 dias de CHO alto. */
export const COX = { before: 54.6, after: 63.6 } as const;

export const DESIGN = [
    'caso fictício',
    'ECR paralelo · n = 25 · 3 grupos',
    'ECR paralelo · n = 25 · ~8 por grupo',
    'ECRs paralelos · n = 16 e n = 37',
] as const;

export const SOURCES = [
    'Personagem da aula',
    'Costa et al., Appl Physiol Nutr Metab 2017',
    'Costa et al., Appl Physiol Nutr Metab 2017',
    'Cox et al., J Appl Physiol 2010 · King et al., Nutrients 2022',
] as const;
