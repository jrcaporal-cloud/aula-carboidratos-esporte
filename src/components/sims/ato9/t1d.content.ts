/**
 * Slide 169 · Diabetes Tipo 1 em Campo — MOSER2025 (posicionamento EASD/ISPAD, texto completo, Tabela 2).
 * Riddell 2017 NÃO entra: os números dele só existem em fontes secundárias (dossiê 06, "Não citar").
 * Os valores do sensor na tela são ilustrativos; as doses de CHO e os limiares são os do posicionamento.
 */

export type Trend = 'flat' | 'slight' | 'down' | 'double';

export interface Rule {
    id: string;
    group: 'antes' | 'durante';
    when: string;
    trend?: Trend;
    action: string;
    /** Passo em que a linha acende pela primeira vez (e fica). */
    at: number;
}

export const RULES: readonly Rule[] = [
    { id: 'target', group: 'antes', when: '5,0–15,0 mmol/L, 1–2 h antes', action: 'alvo temporário mais alto', at: 0 },
    { id: 'bolus', group: 'antes', when: 'exercício < 2 h após refeição', action: 'bolus −25 a −33%', at: 0 },
    { id: 'snack', group: 'antes', when: '< 5,0 mmol/L no início', action: '10–20 g, sem insulina', at: 0 },
    { id: 'flat', group: 'durante', when: 'estável', trend: 'flat', action: '3–6 g', at: 1 },
    { id: 'slight', group: 'durante', when: 'caindo devagar', trend: 'slight', action: '6–9 g', at: 2 },
    { id: 'down', group: 'durante', when: 'caindo', trend: 'down', action: '9–12 g', at: 3 },
    { id: 'double', group: 'durante', when: '2–3 setas para baixo', trend: 'double', action: '12–20 g', at: 4 },
];

export interface T1DStep {
    tab: string;
    headline: string;
    text: string;
    /** Dado-chave do passo (painel). */
    key: string;
    keyCaption: string;
    /** Linha da tabela em foco. */
    active: string;
    reading: string;
    trend: Trend;
    /** Traçado ilustrativo do sensor (12 valores, mmol/L). */
    trace: readonly number[];
}

export const STEPS: readonly T1DStep[] = [
    {
        tab: 'Antes',
        headline: 'Antes: menos insulina, às vezes um lanche',
        text: 'Posicionamento EASD/ISPAD 2025, para quem usa sistema automatizado de insulina (AID). Com glicose de 5,0 a 15,0 mmol/L, ativar o alvo temporário mais alto 1–2 h antes. Exercício menos de 2 h após a refeição: reduzir o bolus. Abaixo de 5,0 mmol/L no início: lanche de 10–20 g de CHO, sem insulina.',
        key: '−25 a −33%', keyCaption: 'no bolus da refeição até 2 h antes',
        active: 'bolus', reading: '4,8', trend: 'flat', trace: [6.4, 6.2, 5.9, 5.6, 5.3, 5.1, 5.0, 4.9, 4.9, 4.8, 4.8, 4.8],
    },
    {
        tab: 'Estável',
        headline: 'Durante: a seta decide a dose',
        text: 'Abaixo de 7,0 mmol/L, o CHO rápido vira dose de correção, e quem escolhe a dose é a seta do sensor, não só o número. Com a seta horizontal, glicose estável, bastam 3–6 g: doses pequenas e repetidas, não a garrafa inteira de uma vez.',
        key: '3–6 g', keyCaption: 'seta horizontal, abaixo de 7,0 mmol/L',
        active: 'flat', reading: '6,6', trend: 'flat', trace: [7.4, 7.2, 7.0, 6.9, 6.8, 6.7, 6.7, 6.6, 6.6, 6.6, 6.6, 6.6],
    },
    {
        tab: 'Devagar',
        headline: 'Seta inclinada: a dose sobe',
        text: 'Glicose caindo devagar: 6–9 g. A mesma leitura pede doses diferentes conforme a tendência; por isso a tabela usa a seta do sensor contínuo. A dose cresce com a velocidade da queda: o músculo em contração capta glicose também pela via que não depende de insulina.',
        key: '6–9 g', keyCaption: 'seta inclinada para baixo',
        active: 'slight', reading: '6,2', trend: 'slight', trace: [7.4, 7.3, 7.2, 7.1, 7.0, 6.9, 6.8, 6.7, 6.5, 6.4, 6.3, 6.2],
    },
    {
        tab: 'Caindo',
        headline: 'Seta para baixo: 9–12 g',
        text: 'Glicose caindo: 9–12 g. Repare na escala: a tabela inteira vai de 3 a 20 g por correção. No atleta com DM1, o carboidrato do treino deixa de ser só combustível e passa a ser dose, contada em gramas e guiada por tendência.',
        key: '9–12 g', keyCaption: 'seta para baixo',
        active: 'down', reading: '5,6', trend: 'down', trace: [7.4, 7.3, 7.2, 7.0, 6.8, 6.6, 6.4, 6.2, 6.0, 5.9, 5.7, 5.6],
    },
    {
        tab: 'Duas setas',
        headline: 'Queda rápida: 12–20 g e reavaliar',
        text: 'Duas ou três setas para baixo: 12–20 g e nova leitura em 20–30 min. Acima de 15,0 mmol/L, checar cateter e cetonas antes de seguir. É consenso, com graus de evidência C–D em parte, para usuários de AID: ponto de partida a ajustar com a equipe, não prescrição individual.',
        key: '12–20 g', keyCaption: 'reavaliar em 20–30 min',
        active: 'double', reading: '5,0', trend: 'double', trace: [7.4, 7.3, 7.1, 6.9, 6.6, 6.3, 6.0, 5.8, 5.5, 5.3, 5.1, 5.0],
    },
];

/** O que o professor deixa claro sobre o documento (fica no pé do painel). */
export const LIMITS: readonly string[] = [
    'consenso para usuários de AID; graus C–D em parte',
    'leituras do sensor na tela: ilustrativas',
    'Riddell 2017: números só em fontes secundárias, fora',
];

export const DESIGN = 'EASD/ISPAD 2025 · usuários de AID';
export const SOURCE = 'Moser 2025 (Diabetologia), Tabela 2';
