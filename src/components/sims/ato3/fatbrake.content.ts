/** Slide 45 · Por que a Gordura Trava no Alto. VANLOON2001 (n = 8 ciclistas) e HOWLETT1998 (n = 7 não treinados). */

export const FAT_STEPS = [
    {
        phrase: 'A 55% da Wmáx, a carnitina está livre e leva a gordura pela porta da mitocôndria (CPT-I).',
        high: false,
        source: 'van Loon LJ et al. J Physiol 2001;536(Pt 1):295-304.',
    },
    {
        phrase: 'A 75%, a PDH despeja acetil-CoA. A carnitina fica presa como acetilcarnitina, e a gordura espera do lado de fora.',
        high: true,
        source: 'van Loon LJ et al. J Physiol 2001;536(Pt 1):295-304.',
    },
    {
        phrase: 'A PDH ativa sobe junto com a potência: o carboidrato ganha a entrada da mitocôndria.',
        high: true,
        source: 'Howlett RA et al. Am J Physiol 1998;275(2):R418-25 · biópsia no 1º min.',
    },
    {
        phrase: 'Já a fosforilase a não sobe com a intensidade. O glicogênio se quebra mais por Pi e AMP, não por mais enzima ativa.',
        high: true,
        source: 'Howlett RA et al. Am J Physiol 1998;275(2):R418-25.',
    },
] as const;

/** PDH ativa, mmol·kg peso úmido⁻¹·min⁻¹, no 1º minuto (HOWLETT1998). */
export const PDH_BARS = [
    { label: 'repouso', value: 0.53, text: '0,53' },
    { label: '35%', value: 1.6, text: '1,60' },
    { label: '65%', value: 2.77, text: '2,77' },
    { label: '90%', value: 3.33, text: '3,33' },
] as const;
