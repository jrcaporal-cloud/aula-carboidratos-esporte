/** Slide 102 · A Curva de Smith (SMITH2013): ganhos estimados no contrarrelógio a 9, 19, 31, 48 e 78 g/h. */

export const POINTS = [
    { dose: 0, gain: 0 },
    { dose: 9, gain: 1.0 },
    { dose: 19, gain: 2.0 },
    { dose: 31, gain: 3.0 },
    { dose: 48, gain: 4.0 },
    { dose: 78, gain: 4.7 },
] as const;

/** As 12 doses testadas (10 a 120 g/h, a cada 10 g). */
export const DOSES = Array.from({ length: 12 }, (_, i) => (i + 1) * 10);

export const LEADS = [
    '51 ciclistas e triatletas, 12 doses de 10 a 120 g/h e placebo. Cada um fez só 4 ensaios.',
    'O ganho sobe rápido: a maior parte vem dos primeiros ~50 g/h.',
    'O ótimo desse protocolo: ~78 g/h, em 2 h de carga e 20 km contra o relógio.',
    'Acima de 78 g/h, cada grama rende menos. E é um estudo só, num protocolo só.',
] as const;

/** Número grande de cada passo e a dose a que ele se refere. */
export const HEADLINE = [
    { value: '12 doses', caption: 'de 10 a 120 g/h, e placebo' },
    { value: '+4,0%', caption: 'a 48 g/h' },
    { value: '+4,7%', caption: 'a 78 g/h' },
    { value: '+4,7%', caption: 'teto do ganho; acima, menos por grama' },
] as const;

export const SOURCE = 'Smith JW et al., Med Sci Sports Exerc 2013 · ganhos estimados (modelo misto)';
