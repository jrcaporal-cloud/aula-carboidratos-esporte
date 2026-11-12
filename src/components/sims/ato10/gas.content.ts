/** Slide 184 · Calorimetria e Isótopos (JEUKENDRUP-WALLIS2005, GONZALEZHARO2019, SARIS1993 — dossiê 07). Só o princípio: sem coeficientes. */

export const LINES = [
    'A calorimetria lê o combustível pelo ar: quanto CO₂ sai para cada O₂ que entra.',
    'É boa, não perfeita: o erro na oxidação de carboidrato é de cerca de ±0,3 g/min.',
    'Acima do limiar, o bicarbonato solta CO₂ extra: RER acima de 1,0 não é “só carboidrato”.',
    'O isótopo segue o açúcar do copo ao ar: milho e cana já nascem mais ricos em ¹³C.',
] as const;

/** Posição da agulha do RER na escala (0 → 1; 1,0 fica em RER_ONE). */
export const RER_ONE = 0.72;
export const NEEDLE = [0.48, 0.48, 0.88, 0.48] as const;

export const ERROR = { value: '±0,3 g/min', perHour: '≈ ±18 g/h', design: 'concordância × glicogênio marcado com ¹³C' } as const;

export const ISOTOPE_STEPS = [
    { id: 'c4', title: 'Milho, cana', sub: 'plantas C4: mais ¹³C' },
    { id: 'gole', title: 'Bebida', sub: 'carboidrato “marcado” de fábrica' },
    { id: 'musculo', title: 'Músculo', sub: 'oxida o que chegou' },
    { id: 'ar', title: '¹³CO₂ no ar', sub: 'mede a oxidação exógena' },
] as const;

export const SARIS = {
    soluble: { value: '0,84 g/min', caption: 'amido de milho solúvel' },
    insoluble: { value: '0,50 g/min', caption: 'amido insolúvel' },
    design: 'cruzado · ¹³C natural · 150 min',
} as const;

export const DESIGNS = ['revisão de método', ERROR.design, 'revisão de método', SARIS.design] as const;

export const SOURCE = 'Jeukendrup AE, Wallis GA. Int J Sports Med 2005 · González-Haro C. Physiol Rep 2019 · Saris WH et al. J Appl Physiol 1993.';
