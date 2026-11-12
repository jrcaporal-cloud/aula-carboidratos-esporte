/**
 * Slide 121 · Quatro Horas Entre Duas Sessões. Números: dossiê 04 (ALGHANNAM2016, CRAVEN2021, JENTJENS2003,
 * KERKSICK2017). Glicogênio em mmol/kg de peso SECO (ps). Cálculos próprios (rotulados): 0,15 e 0,6 g/kg por
 * tomada (dose/h ÷ 2); diferença 269 − 157 = 112 em 4 h ≈ 28 mmol/kg/h; 80/48 = +67% (o dossiê traz o 67%).
 */

export type ArmId = 'high' | 'low';

export interface Arm {
    id: ArmId;
    dose: string;
    /** Glicogênio no fim das 4 h de recuperação (mmol/kg ps). */
    start: number;
    /** Tempo da 2ª corrida até a exaustão (min). */
    minutes: number;
}

export const ARMS: readonly Arm[] = [
    { id: 'high', dose: '1,2 g/kg/h', start: 269, minutes: 80 },
    { id: 'low', dose: '0,3 g/kg/h', start: 157, minutes: 48 },
];

/** Glicogênio na exaustão, igual nos dois braços (~72–78 mmol/kg ps). */
export const FLOOR = 75;
export const FLOOR_BAND: readonly [number, number] = [72, 78];
export const X_MAX = 90;
export const Y_MAX = 300;

export interface ShortStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

export const SHORT_STEPS: readonly ShortStep[] = [
    {
        tab: 'Protocolo',
        headline: 'Duas corridas, 4 h no meio',
        text: 'Alghannam 2016, medidas repetidas, 10 corredores treinados: corrida a 70% do VO₂máx até a exaustão, 4 h de recuperação com carboidrato a cada 30 min (0,3 ou 1,2 g/kg/h) e nova corrida até a exaustão. A pergunta é de desempenho: quanto a segunda sessão aguenta.',
        sources: ['Alghannam 2016'],
    },
    {
        tab: 'Fim das 4 h',
        headline: '4× mais CHO, 112 a mais no tanque',
        text: 'No fim da recuperação, o glicogênio era 269 ± 84 mmol/kg de peso seco com 1,2 g/kg/h e 157 ± 37 com 0,3. A diferença, 112 em 4 h, é a ressíntese que o carboidrato a mais comprou: ~28 mmol/kg por hora (cálculo).',
        sources: ['Alghannam 2016'],
    },
    {
        tab: '2ª corrida',
        headline: 'Os dois param no mesmo piso',
        text: 'Na 2ª corrida, 80 ± 16 contra 48 ± 11 min (P < 0,001): 67% mais tempo. Na exaustão, o glicogênio era o mesmo nos dois braços (~72–78): o carboidrato não baixou o piso, fez o atleta largar mais alto. Retas entre duas medidas; sem cegamento declarado no resumo.',
        sources: ['Alghannam 2016'],
    },
    {
        tab: 'Quanto rende',
        headline: '+23,5 por hora contra água',
        text: 'Craven 2021, meta-análise de 10 ensaios (n = 86): na recuperação curta, o CHO rendeu +23,5 mmol/kg ps/h a mais que água (IC95% 19,0–27,9; I² = 66,8%). Doses de hora em hora ou mais frequentes renderam mais (R² = 0,44). Os ~28/h do Alghannam são da mesma ordem.',
        sources: ['Craven 2021'],
    },
    {
        tab: 'Na prática',
        headline: 'Intervalo curto: cedo e repetido',
        text: 'Menos de 4 h entre sessões: a ISSN 2017 recomenda 1,2 g/kg/h, de preferência alto IG. Jentjens 2003 (revisão) põe as maiores taxas entre 1,0 e 1,85 g/kg/h, logo após o exercício e a cada 15–60 min. Glicogênio cheio não é atleta recuperado, mas aqui rendeu 32 min de corrida.',
        sources: ['Jentjens 2003 (revisão)', 'ISSN 2017'],
    },
];

export const SHORT_CHIPS: readonly (readonly string[])[] = [
    ['Alghannam 2016 · n = 10'],
    ['Alghannam 2016 · n = 10'],
    ['Alghannam 2016 · n = 10'],
    ['meta-análise · 10 ensaios, n = 86'],
    ['revisão', 'posicionamento ISSN'],
];

/** Selo de cálculo por passo. */
export const SHORT_CALC: Readonly<Record<number, string>> = {
    0: 'g/kg por tomada: cálculo',
    1: '~28/h: cálculo',
    2: 'retas entre 2 medidas',
    3: '~28/h: cálculo',
};
