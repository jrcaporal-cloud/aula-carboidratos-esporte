/**
 * Slide 10 · O Km 32 (WallSim). Marina é personagem FICTÍCIA e a curva de ritmo é ilustrativa.
 * Números reais: estoques médios (Murray & Rosenbloom 2018, Tabela 1) e o muro em 1,9 milhão de maratonistas (Smyth 2021).
 */

/** Ritmo da Marina em segundos por km, do km 0 ao 42 (5:00/km até o 30; ~6:50/km depois do 32). ILUSTRATIVO. */
export const PACE_S: readonly number[] = Array.from({ length: 43 }, (_, km) => {
    if (km <= 30) return 300;
    if (km === 31) return 312;
    if (km === 32) return 372;
    return [408, 402, 410, 404, 412][km % 5];
});

/** Nível dos dois tanques (0 → 1) em cada passo: largada, km 30, km 32 e depois. ILUSTRATIVO. */
export const TANK_LEVELS: readonly { muscle: number; liver: number }[] = [
    { muscle: 1, liver: 1 },
    { muscle: 0.32, liver: 0.28 },
    { muscle: 0.08, liver: 0.06 },
    { muscle: 0.08, liver: 0.06 },
    { muscle: 0.08, liver: 0.06 },
];

/** Onde a Marina está em cada passo (km). */
export const RUNNER_KM: readonly number[] = [0, 30, 42, 42, 42];

export interface WallStep {
    tab: string;
    headline: string;
    color: 'glucose' | 'text' | 'risk' | 'glycogenSoft';
    text: string;
    sources: readonly string[];
}

const MURRAY = 'Murray & Rosenbloom 2018, Nutr Rev (Tabela 1)';

export const WALL_STEPS: readonly WallStep[] = [
    {
        tab: 'Largada',
        headline: 'Largada com os tanques cheios',
        color: 'glucose',
        text: 'Marina, 34 anos e 58 kg, quer baixar de 3h30. Larga com os estoques médios de um adulto: ~500 g de glicogênio no músculo (faixa 300–700 g) e ~80 g no fígado (0–160 g). No sangue inteiro circulam só ~4 g de glicose: quem segura a glicemia é o fígado.',
        sources: [MURRAY],
    },
    {
        tab: 'Km 30',
        headline: 'Até o km 30, ritmo de relógio',
        color: 'text',
        text: 'Duas horas e meia a 5:00 por km, sem variar. O músculo queima glicogênio e gordura ao mesmo tempo, e o fígado solta glicose para repor o que o músculo tira do sangue. Os dois tanques descem sem que o cronômetro perceba nada.',
        sources: [MURRAY],
    },
    {
        tab: 'Km 32',
        headline: 'Km 32: o ritmo despenca',
        color: 'risk',
        text: 'Em dois quilômetros o ritmo passa de 5:00 para ~6:50 por km e não volta até a chegada. É o que o corredor chama de muro: a perna não responde e o esforço percebido dispara. A curva é ilustrativa; a forma (queda sustentada no fim da prova) é a que os dados de prova mostram.',
        sources: [MURRAY],
    },
    {
        tab: 'A pergunta',
        headline: 'A pergunta que abre a aula',
        color: 'glycogenSoft',
        text: 'O glicogênio do músculo, o do fígado, a glicose do sangue ou o cérebro, que guarda nos astrócitos ~100× menos glicogênio que o músculo? Escreva uma palavra no chat. Cada ato da aula traz um pedaço da resposta.',
        sources: [MURRAY],
    },
    {
        tab: '1,9 milhão',
        headline: 'Não é só a Marina',
        color: 'glucose',
        text: 'Em 1.928.813 maratonistas amadores, o muro (queda sustentada do ritmo no fim da prova) atingiu 28% dos homens e 17% das mulheres (OR 1,43). Quem bate fica mais lento:',
        sources: ['Smyth 2021, PLoS One'],
    },
];

/** Os quatro candidatos da pergunta = os quatro lugares onde há glicose (Murray & Rosenbloom 2018). */
export interface Store {
    id: 'muscle' | 'liver' | 'blood' | 'brain';
    name: string;
    amount: string;
    note: string;
}

export const STORES: readonly Store[] = [
    { id: 'muscle', name: 'músculo', amount: '~500 g', note: '300–700 g' },
    { id: 'liver', name: 'fígado', amount: '~80 g', note: '0–160 g' },
    { id: 'blood', name: 'sangue', amount: '~4 g', note: 'circulante' },
    { id: 'brain', name: 'cérebro', amount: '~1/100', note: 'do músculo' },
];

/** O dado-chave de cada passo, no painel. */
export const WALL_KEY: readonly { value: string; caption: string; calc?: string }[] = [
    { value: '~4 g', caption: 'de glicose no sangue inteiro' },
    { value: '2h30', caption: 'a 5:00/km até o km 30', calc: '2h30: cálculo (30 × 5 min)' },
    { value: '6:50', caption: 'min/km depois do muro, contra 5:00 antes' },
    { value: 'O que\nacabou?', caption: '' },
    { value: '', caption: '' },
];

/** Smyth 2021: a grade de 100 corredores de cada sexo. */
export const SMYTH = {
    men: { lit: 28, label: 'homens', detail: '−40% por 10,7 km' },
    women: { lit: 17, label: 'mulheres', detail: '−37% por 9,6 km' },
    limit: 'Observacional: o muro foi inferido pelo ritmo; ninguém mediu glicogênio.',
    design: 'observacional · 1,9 milhão',
} as const;
