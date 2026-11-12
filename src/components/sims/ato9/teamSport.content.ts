/**
 * Slide 161 · CHO no Jogo — LEATT1989 e XIE2026 (dossiê 06), BALSOM1999a (dossiê 02); todos confirmados no abstract.
 * Atenção: 111 → 294 tiros é 2,6 vezes (+165%), não "+265%" como está no dossiê; o slide mostra a razão, com selo de cálculo.
 */

export const LEATT = { placebo: 181, cho: 111, unit: 'mmol/kg ps gastos' } as const;
export const LEATT_SAVED = Math.round((1 - LEATT.cho / LEATT.placebo) * 100); // 39 (cálculo)

export const BALSOM = { low: 111, high: 294 } as const;
export const BALSOM_RATIO = BALSOM.high / BALSOM.low; // ≈ 2,65 (cálculo)

export const XIE = { g: 0.256, lo: -0.094, hi: 0.605 } as const;
/** Rótulo arredondado à mão: 0,605 em ponto flutuante viraria "0,60". */
export const XIE_CI = 'IC 95% −0,09 a 0,61';

export const COLUMNS = [
    { key: 'musculo', title: 'No músculo', design: 'ECR paralelo · n = 5 + 5 · jogo real' },
    { key: 'tiro', title: 'No tiro', design: 'cruzado · n = 7 · tiros de 6 s' },
    { key: 'jogada', title: 'Na jogada', design: 'MA multinível · 341 atletas' },
] as const;

export const STEPS = [
    'Meio litro de CHO a 7% antes do jogo e no intervalo: o músculo gastou menos glicogênio.',
    'Com glicogênio alto, os tiros de 6 s duraram muito mais no laboratório.',
    'Na habilidade e na decisão sob fadiga, o efeito encolhe.',
    'Claro no músculo e no tiro; na jogada, o intervalo cruza o zero.',
] as const;

export const SOURCE = 'Leatt PB, Jacobs I. Can J Sport Sci 1989;14(2):112-6 · Balsom PD et al. Acta Physiol Scand 1999;165(4):337-45 · Xie S, Wen X. JISSN 2026;23(1):2731524.';
