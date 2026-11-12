/**
 * Slide 43 · Lactato é Moeda, não Lixo. Fonte única dos textos e do livro-caixa.
 * BROOKS2018 (revisão; formação contínua, combustível, precursor gliconeogênico, sinal) · Brooks 2009 (lançadeiras
 * célula-célula: fibra glicolítica → oxidativa, músculo → coração e fígado; MCT1) · HUI2017 (camundongo, ¹³C, repouso) ·
 * Lehninger caps. 14 e 23 (gliconeogênese 4 ATP + 2 GTP; ciclo de Cori).
 */

export interface LactateStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

const BROOKS = 'Brooks 2018 (revisão)';

export const LACTATE_STEPS: readonly LactateStep[] = [
    {
        tab: 'Leitura antiga',
        headline: 'A leitura antiga: resíduo',
        text: 'Por décadas, o lactato foi lido como sinal de falta de oxigênio: produto da fibra glicolítica no esforço intenso, a ser descartado. Nessa leitura, glicólise e oxidação seriam caminhos alternativos: ou uma, ou outra.',
        sources: ['Brooks 2009 (revisão)'],
    },
    {
        tab: 'Lançadeira',
        headline: 'Forma-se o tempo todo, com oxigênio',
        text: 'O lactato se forma continuamente em aerobiose e circula entre células que produzem e que consomem. Sai da fibra glicolítica pelos transportadores MCT e é oxidado na fibra oxidativa do mesmo músculo e no coração, onde a LDH o devolve a piruvato. Glicólise e oxidação são ligadas: o produto de uma é o substrato da outra.',
        sources: [BROOKS],
    },
    {
        tab: 'Ciclo de Cori',
        headline: 'No fígado, vira glicose de novo',
        text: 'O lactato é o principal precursor da gliconeogênese. No ciclo de Cori, o fígado refaz 1 glicose a partir de 2 lactatos e a devolve ao sangue. A conta não fecha no zero: a glicólise rendeu 2 ATP no músculo, e refazer a glicose custa ao fígado 4 ATP + 2 GTP.',
        sources: ['Lehninger, 7ª ed., 2017 (caps. 14 e 23)'],
    },
    {
        tab: 'Nos números',
        headline: 'Mais fluxo que a própria glicose',
        text: 'Hui 2017, ¹³C em camundongos em repouso: o lactato tem o maior fluxo circulante entre os metabólitos, 1,1× o da glicose alimentado e 2,5× em jejum; em jejum, a glicose chega ao Krebs dos tecidos (exceto o cérebro) sobretudo como lactato. Dado em animal: a ideia vale, o número não.',
        sources: ['Hui 2017 (camundongo)'],
    },
];

/** O livro-caixa do lactato: cada linha entra num passo e fica. `myth` = a linha da leitura antiga (recebe o carimbo). */
export interface LactateRow {
    at: number;
    label: string;
    value: string;
    tone: 'old' | 'lactate' | 'glucose';
}

export const LACTATE_ROWS: readonly LactateRow[] = [
    { at: 0, label: 'lactato', value: 'resíduo (falta de O₂)', tone: 'old' },
    { at: 1, label: 'destino 1 · fibra oxidativa, coração', value: 'combustível', tone: 'lactate' },
    { at: 2, label: 'destino 2 · fígado (Cori)', value: '2 lactato → 1 glicose', tone: 'glucose' },
    { at: 2, label: 'saldo do ciclo', value: 'músculo +2 · fígado −6 ATP', tone: 'glucose' },
    { at: 3, label: 'fluxo × glicose (camundongo)', value: '1,1× · 2,5× jejum', tone: 'lactate' },
];
