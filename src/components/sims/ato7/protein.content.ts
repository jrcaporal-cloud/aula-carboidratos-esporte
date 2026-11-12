/**
 * Slide 122 · Proteína Ajuda? Depende. Números: dossiê 04 (VANLOON2000, MARGOLIS2021, CRAVEN2021, KERKSICK2017,
 * BEELEN2010 do "apoio conferido"). van Loon em µmol/g ps/h = mmol/kg ps/h, a mesma unidade do Craven.
 * Cálculo próprio (rotulado): 0,8 + 0,4 = 1,2 g/kg/h, os mesmos gramas (e ~as mesmas kcal) do braço CHO 1,2.
 */

export interface ProteinStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

export const PROTEIN_STEPS: readonly ProteinStep[] = [
    {
        tab: 'CHO baixo',
        headline: 'Com pouco carboidrato, a proteína mais que dobra',
        text: 'van Loon 2000, cruzado, 8 ciclistas, bebida a cada 30 min por 5 h. Com 0,8 g/kg/h de CHO, a ressíntese foi 16,6 mmol/kg ps/h; somando 0,4 g/kg/h de proteína (hidrolisado com leucina e fenilalanina), 35,4. A insulina subiu 88% em relação ao CHO 0,8.',
        sources: ['van Loon 2000'],
    },
    {
        tab: 'CHO suficiente',
        headline: 'Com carboidrato suficiente, o carboidrato resolve',
        text: 'O terceiro braço tomou 1,2 g/kg/h só de CHO: 44,8, acima da mistura, com insulina 46% maior. São os mesmos gramas de 0,8 + 0,4 (cálculo). A proteína resgatou a dose baixa; não superou a dose cheia. Limites: n = 8 e depleção feita em laboratório.',
        sources: ['van Loon 2000'],
    },
    {
        tab: 'Margolis',
        headline: 'Na meta-análise, depende de quem paga a conta',
        text: 'Margolis 2021, 20 estudos cruzados, g de Hedges. No geral, g = 0,13 (−0,04 a 0,29): sem efeito. Quando a proteína somava energia, 0,26 (0,04 a 0,49); quando trocava CHO pelas mesmas kcal, −0,05 (−0,23 a 0,13). Com CHO baixo, 0,21 (−0,08 a 0,50), sem significância.',
        sources: ['Margolis 2021'],
    },
    {
        tab: 'Craven',
        headline: 'Na recuperação curta, a proteína não acelera',
        text: 'Craven 2021, 19 ensaios (n = 160), recuperação de até 8 h: CHO + proteína contra CHO, +0,4 mmol/kg ps/h (IC95% −2,7 a 3,4; p = 0,805). Na mesma revisão, CHO contra água deu +23,5. Quem move a ressíntese é o carboidrato; somar proteína não acelera nem atrapalha.',
        sources: ['Craven 2021'],
    },
    {
        tab: 'Na prática',
        headline: 'No shake: somar, não trocar',
        text: 'A ISSN 2017 resume: a proteína só aumenta a ressíntese quando o CHO fica abaixo de 1,2 g/kg/h. Quem não consegue comer tanto CHO pode usar 0,8 de CHO + 0,2–0,4 g/kg/h de proteína, que se aproxima de 1,2 de CHO (Beelen 2010, revisão). Fora disso, a proteína serve à síntese proteica (~20 g), não ao glicogênio.',
        sources: ['ISSN 2017', 'Beelen 2010 (revisão)'],
    },
];

export const PROTEIN_CHIPS: readonly (readonly string[])[] = [
    ['van Loon 2000 · cruzado · n = 8'],
    ['van Loon 2000 · cruzado · n = 8'],
    ['meta-análise · 20 estudos'],
    ['meta-análise · 19 ensaios, n = 160'],
    ['posicionamento ISSN', 'revisão'],
];

export const PROTEIN_CALC: Readonly<Record<number, string>> = { 1: 'mesmos gramas: cálculo' };

/** Os três braços do van Loon 2000 (taxa em mmol/kg ps/h; doses em g/kg/h). */
export interface VanLoonArm {
    id: string;
    label: string;
    cho: number;
    pro: number;
    rate: number;
    rateText: string;
    insulin?: string;
    at: number;
}

export const VANLOON: readonly VanLoonArm[] = [
    { id: 'low', label: 'CHO 0,8', cho: 0.8, pro: 0, rate: 16.6, rateText: '16,6', at: 0 },
    { id: 'mix', label: '0,8 + PTN 0,4', cho: 0.8, pro: 0.4, rate: 35.4, rateText: '35,4', insulin: 'insulina +88%', at: 0 },
    { id: 'high', label: 'CHO 1,2', cho: 1.2, pro: 0, rate: 44.8, rateText: '44,8', insulin: 'insulina +46%', at: 1 },
];

/** Linhas de efeito (Margolis em g de Hedges; Craven em mmol/kg ps/h). */
export interface EffectRow {
    id: string;
    label: string;
    est: number;
    lo: number;
    hi: number;
    text: string;
    tone: 'protein' | 'neutral' | 'cho' | 'muted';
}

export const MARGOLIS: readonly EffectRow[] = [
    { id: 'all', label: 'geral', est: 0.13, lo: -0.04, hi: 0.29, text: '0,13', tone: 'muted' },
    { id: 'add', label: 'proteína soma kcal', est: 0.26, lo: 0.04, hi: 0.49, text: '0,26', tone: 'protein' },
    { id: 'iso', label: 'mesmas kcal', est: -0.05, lo: -0.23, hi: 0.13, text: '−0,05', tone: 'neutral' },
    { id: 'low', label: 'CHO baixo', est: 0.21, lo: -0.08, hi: 0.5, text: '0,21', tone: 'muted' },
];

export const CRAVEN: readonly EffectRow[] = [
    { id: 'water', label: 'CHO × água · 10 ensaios', est: 23.5, lo: 19.0, hi: 27.9, text: '+23,5', tone: 'cho' },
    { id: 'pro', label: '+ proteína × CHO · 19 ensaios', est: 0.4, lo: -2.7, hi: 3.4, text: '+0,4', tone: 'protein' },
];

/** O caderno "só ajuda se…": cada condição acende num passo e fica. */
export const CONDITIONS: readonly { text: string; at: number }[] = [
    { text: 'o CHO está abaixo de ~1,2 g/kg/h', at: 1 },
    { text: 'a proteína soma calorias, não substitui', at: 2 },
];
