/**
 * Slide 169 · Diabetes Tipo 1 em Campo — MOSER2025 (posicionamento EASD/ISPAD, texto completo, Tabela 2).
 * Riddell 2017 NÃO entra: os números dele só existem em fontes secundárias (dossiê 06, "Não citar").
 * Os valores do sensor na tela são ilustrativos; as doses de CHO são as do posicionamento.
 */

export type Trend = 'flat' | 'slight' | 'down' | 'double';

export interface Rule {
    id: string;
    group: 'antes' | 'durante';
    when: string;
    trend?: Trend;
    action: string;
}

export const RULES: readonly Rule[] = [
    { id: 'bolus', group: 'antes', when: 'exercício < 2 h após refeição', action: 'bolus da refeição −25 a −33%' },
    { id: 'snack', group: 'antes', when: 'glicose < 5,0 mmol/L', action: 'lanche de 10–20 g, sem insulina' },
    { id: 'flat', group: 'durante', when: 'estável', trend: 'flat', action: '3–6 g' },
    { id: 'slight', group: 'durante', when: 'caindo devagar', trend: 'slight', action: '6–9 g' },
    { id: 'down', group: 'durante', when: 'caindo', trend: 'down', action: '9–12 g' },
    { id: 'double', group: 'durante', when: '2–3 setas para baixo', trend: 'double', action: '12–20 g' },
];

export interface T1DStep {
    say: string;
    /** Linhas acesas da tabela. */
    active: readonly string[];
    reading: string;
    trend: Trend;
    /** Traçado ilustrativo do sensor (12 valores, mmol/L). */
    trace: readonly number[];
}

export const STEPS: readonly T1DStep[] = [
    { say: 'Antes de começar: menos insulina na refeição e, se a glicose está baixa, um lanche.', active: ['bolus', 'snack'], reading: '4,8', trend: 'flat', trace: [6.4, 6.2, 5.9, 5.6, 5.3, 5.1, 5.0, 4.9, 4.9, 4.8, 4.8, 4.8] },
    { say: 'Durante, abaixo de 7,0 mmol/L, quem decide a dose é a seta do sensor.', active: ['flat'], reading: '6,6', trend: 'flat', trace: [7.4, 7.2, 7.0, 6.9, 6.8, 6.7, 6.7, 6.6, 6.6, 6.6, 6.6, 6.6] },
    { say: 'Seta inclinada: um pouco mais de carboidrato.', active: ['slight'], reading: '6,2', trend: 'slight', trace: [7.4, 7.3, 7.2, 7.1, 7.0, 6.9, 6.8, 6.7, 6.5, 6.4, 6.3, 6.2] },
    { say: 'Seta para baixo: a dose sobe de novo.', active: ['down'], reading: '5,6', trend: 'down', trace: [7.4, 7.3, 7.2, 7.0, 6.8, 6.6, 6.4, 6.2, 6.0, 5.9, 5.7, 5.6] },
    { say: 'Duas ou três setas: até 20 g. E reavaliar em 20–30 min.', active: ['double'], reading: '5,0', trend: 'double', trace: [7.4, 7.3, 7.1, 6.9, 6.6, 6.3, 6.0, 5.8, 5.5, 5.3, 5.1, 5.0] },
];

export const DESIGN = 'posicionamento EASD/ISPAD · usuários de AID';
export const SOURCE = 'Moser O et al. Diabetologia 2025;68(2):255-80.';
