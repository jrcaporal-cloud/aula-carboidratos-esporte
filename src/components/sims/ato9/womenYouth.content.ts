/**
 * Slide 167 · Mulheres e Jovens — WALLIS2006, MCNULTY2020, TARNOPOLSKY1995/2001, JAMES2001, TIMMONS2003, LEITES2016
 * (dossiê 06; JAMES2001 e TARNOPOLSKY2001 também no 04). Todos confirmados no abstract.
 */
import { C } from '../kit/palette';

export interface DuelSide {
    label: string;
    value: number;
    /** Valor antes (só no passo da carga): vira uma marca tracejada na barra. */
    before?: number;
    color: string;
}

export interface DuelStep {
    say: string;
    unit: string;
    max: number;
    decimals: number;
    sides: readonly [DuelSide, DuelSide];
    note: string;
    design: string;
    source: string;
}

const W = C.glucose;
const N = C.co2;

export const STEPS: readonly DuelStep[] = [
    {
        say: 'Bebendo 90 g/h, homens e mulheres oxidaram o CHO ingerido em ritmo semelhante.',
        unit: 'pico de oxidação do CHO ingerido · g/min', max: 1, decimals: 2,
        sides: [{ label: 'homens', value: 0.70, color: N }, { label: 'mulheres', value: 0.65, color: W }],
        note: 'A meta em g/h vale para os dois sexos.',
        design: 'cruzado · 8 H + 8 M · 13C', source: 'Wallis GA et al. Am J Physiol Endocrinol Metab 2006;290(4):E708-15.',
    },
    {
        say: 'E a fase do ciclo? O efeito no desempenho é trivial.',
        unit: 'pico de oxidação do CHO ingerido · g/min', max: 1, decimals: 2,
        sides: [{ label: 'homens', value: 0.70, color: N }, { label: 'mulheres', value: 0.65, color: W }],
        note: 'Não dá para prescrever CHO por fase do ciclo.',
        design: 'meta-análise · 78 estudos', source: 'McNulty KL et al. Sports Med 2020;50(10):1813-27.',
    },
    {
        say: '"Mulher não supercompensa" era dose: com 12 g/kg de massa magra, ela carrega como ele.',
        unit: 'glicogênio após 3 dias · mmol/kg peso úmido', max: 220, decimals: 0,
        sides: [{ label: 'homens', value: 183, before: 109, color: N }, { label: 'mulheres', value: 193, before: 108, color: W }],
        note: 'Em 1995, a dieta em % da energia deu a elas menos CHO por kg.',
        design: 'comparação entre sexos · biópsia', source: 'James AP et al. Eur J Appl Physiol 2001;85(6):533-8 · Tarnopolsky MA et al. J Appl Physiol 2001;91(1):225-30.',
    },
    {
        say: 'Meninos oxidam mais CHO ingerido por kg do que homens.',
        unit: 'CHO ingerido oxidado · mg/kg/min', max: 10, decimals: 1,
        sides: [{ label: 'homens', value: 6.2, color: N }, { label: 'meninos', value: 8.8, color: W }],
        note: 'E usam menos do próprio glicogênio.',
        design: 'cruzado · 12 meninos + 10 homens · 13C', source: 'Timmons BW et al. J Appl Physiol 2003;94(1):278-84.',
    },
    {
        say: 'A 38 °C, a vantagem inverte: os meninos oxidam menos que os homens.',
        unit: 'CHO ingerido oxidado · mg/kg de massa magra/min', max: 3, decimals: 1,
        sides: [{ label: 'homens', value: 2.5, color: N }, { label: 'meninos', value: 2.0, color: W }],
        note: 'O contexto inverte o achado.',
        design: 'cruzado duplo-cego · 7 meninos + 9 homens', source: 'Leites GT et al. J Appl Physiol 2016;121(5):1127-34.',
    },
];

/** McNulty 2020: folicular inicial × demais fases (ES0,5 e intervalo de credibilidade 95%). */
export const CYCLE = { es: -0.06, lo: -0.16, hi: 0.04 } as const;

/** Cálculo nosso: 8,8 / 6,2. */
export const BOYS_EDGE = Math.round((8.8 / 6.2 - 1) * 100);
