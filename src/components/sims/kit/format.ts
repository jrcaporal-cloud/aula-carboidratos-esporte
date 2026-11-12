/** Número com vírgula decimal: o slide é lido em português. */
export const br = (n: number, casas = 1): string => {
    const fixed = n.toFixed(casas);
    // Sinal de menos tipográfico (−, não hífen); "-0,0" vira "0,0".
    const negative = fixed.startsWith('-') && Number(fixed) !== 0;
    return `${negative ? '−' : ''}${fixed.replace('-', '').replace('.', ',')}`;
};

/** Diferença com sinal explícito (sinal de menos tipográfico). Zero não leva sinal. */
export const signed = (n: number, casas = 0): string => {
    const rounded = Number(n.toFixed(casas));
    if (rounded === 0) return br(0, casas);
    return `${rounded > 0 ? '+' : '−'}${br(Math.abs(rounded), casas)}`;
};

/** Porcentagem em português ("1,7%"). */
export const pct = (n: number, casas = 1): string => `${br(n, casas)}%`;
