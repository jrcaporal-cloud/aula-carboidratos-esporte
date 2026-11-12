/**
 * Slide 163 · Insulina Sobe, Síntese Não — KOOPMAN2007, STAPLES2011, GLYNN2010 (dossiê 06, confirmados no abstract).
 * Insulina = área sob a curva em 6 h (U·6h/L), na ordem crescente da dose de CHO; síntese = FSR mista (%/h).
 */

export const ARMS = [
    { dose: '0', insulin: 1.5, fsr: '0,10', fsrN: 0.10 },
    { dose: '0,15', insulin: 3.7, fsr: '0,10', fsrN: 0.10 },
    { dose: '0,6', insulin: 18.4, fsr: '0,11', fsrN: 0.11 },
] as const;

export const INSULIN_MAX = 18.4;
export const FSR_MAX = 0.11;
/** Cálculo nosso: 18,4 / 1,5. */
export const INSULIN_FOLD = Math.round(ARMS[2].insulin / ARMS[0].insulin);

export const REPLICAS = [
    { who: 'Staples 2011', what: '25 g de whey ± 50 g de malto: insulina 5× maior, síntese igual', n: 'cruzado · n = 9' },
    { who: 'Glynn 2010', what: 'aminoácidos + 30 ou 90 g de CHO: quebra proteica igual', n: 'paralelo · n = 13' },
] as const;

export const STEPS = [
    'Mesma proteína, 0,3 g/kg/h por 6 h após o treino. Três doses de carboidrato.',
    'Com a dose alta, a insulina subiu cerca de 12 vezes.',
    'A síntese proteica não saiu do lugar.',
    'Dois outros estudos, o mesmo desacoplamento.',
] as const;

export const DESIGN = 'cruzado · n = 10 · isótopos estáveis';
export const SOURCE_MAIN = 'Koopman R et al. Am J Physiol Endocrinol Metab 2007;293(3):E833-42.';
export const SOURCE_REPLICAS = 'Staples AW et al. Med Sci Sports Exerc 2011;43(7):1154-61 · Glynn EL et al. Am J Physiol Regul Integr Comp Physiol 2010;299(2):R533-40.';
