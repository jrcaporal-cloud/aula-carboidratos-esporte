import { C } from '../kit/palette';
import type { LedgerRow } from './MedirShell';

/**
 * Slide 184 · Calorimetria e Isótopos. JEUKENDRUP-WALLIS2005 (coeficientes lidos na tabela de GONZALEZHARO2019, não no
 * original: selo "via"), GONZALEZHARO2019, SARIS1993 — dossiê 07; KROGH1920 — dossiê 02. Estequiometria da glicose e do
 * palmitato: livro-texto (Lehninger); RER 16/23 ≈ 0,70, o exemplo de VO₂/VCO₂ e ±18 g/h são cálculo próprio.
 */

export interface GasStep {
    tab: string;
    headline: string;
    text: string;
    design: string;
    sources: readonly string[];
}

const LEH = 'Lehninger 2017 (estequiometria)';
const JW = 'Jeukendrup & Wallis 2005';
const GH = 'González-Haro 2019';

export const STEPS: readonly GasStep[] = [
    {
        tab: 'Princípio',
        headline: 'O combustível se lê no ar',
        text: 'A glicose gasta 6 O₂ e solta 6 CO₂: razão 1,00. O palmitato gasta 23 O₂ para 16 CO₂: ~0,70. Medindo o O₂ que entra e o CO₂ que sai, a razão de troca respiratória (RER) diz a mistura queimada. Krogh e Lindhard já raciocinavam assim em 1920, 40 anos antes da agulha.',
        design: 'estequiometria · livro-texto',
        sources: [LEH, 'Krogh & Lindhard 1920'],
    },
    {
        tab: 'Equações',
        headline: 'Da razão aos gramas por minuto',
        text: 'Equações estequiométricas convertem VO₂ e VCO₂ (L/min) em g/min. Jeukendrup e Wallis usam glicogênio, não glicose, como substrato; a de gordura é a de Péronnet e Massicotte (1991). Ignoram a proteína e pedem estado estável. Exemplo: RER 0,90 → 2,48 g/min de carboidrato e 0,49 de gordura.',
        design: 'revisão de método',
        sources: [LEH, 'Krogh & Lindhard 1920', JW, GH],
    },
    {
        tab: 'Erro',
        headline: 'Boa, não perfeita',
        text: 'Contra o glicogênio marcado com ¹³C, o intervalo de concordância foi de ±0,31 g/min para carboidrato e ±0,03 para gordura, em triatletas. Nenhuma equação concordou perfeitamente; a de Jeukendrup e Wallis foi a melhor para carboidrato. ±0,3 g/min são quase 20 g/h de incerteza.',
        design: 'concordância × glicogênio marcado com ¹³C',
        sources: [LEH, 'Krogh & Lindhard 1920', JW, GH],
    },
    {
        tab: 'Limiar',
        headline: 'RER acima de 1,0 não é “só carboidrato”',
        text: 'Acima do limiar, o bicarbonato tampona o H⁺ do esforço: H⁺ + HCO₃⁻ → H₂CO₃ → CO₂ + H₂O. Esse CO₂ não veio de combustível nenhum; sai pelo pulmão e infla o RER. A conta superestima o carboidrato e, acima de 1,0, deixa de valer.',
        design: 'revisão de método',
        sources: [LEH, 'Krogh & Lindhard 1920', JW, GH],
    },
    {
        tab: 'Isótopo ¹³C',
        headline: 'O isótopo segue o açúcar até o ar',
        text: 'Milho e cana (plantas C4) nascem mais ricos em ¹³C; quando esse carboidrato é oxidado, o CO₂ expirado enriquece em ¹³C: é a oxidação exógena. Saris 1993 (150 min a 60%): amido solúvel 0,84 × insolúvel 0,50 g/min. Glicose marcada somada ao amido insolúvel inflou a conta.',
        design: 'cruzado · ¹³C natural · 150 min',
        sources: [LEH, 'Krogh & Lindhard 1920', JW, GH, 'Saris 1993'],
    },
];

export const LEDGER: readonly LedgerRow[] = [
    { at: 0, term: '1,00 · 0,70', text: 'RER da glicose · do palmitato', color: C.glucose },
    { at: 1, term: '2,48 g/min', text: 'de carboidrato no exemplo (cálculo)', color: C.glucoseSoft },
    { at: 2, term: '±0,3 g/min', text: '≈ ±18 g/h de carboidrato (cálculo)', color: C.stone },
    { at: 3, term: 'RER > 1,0', text: 'CO₂ do bicarbonato: a conta não vale', color: C.risk },
    { at: 4, term: '0,84 × 0,50', text: 'g/min: amido solúvel × insolúvel', color: C.glucose },
];

/** Estequiometria (passo 1). */
export const STOICH = [
    { fuel: 'glicose', eq: 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O', rer: '6 ÷ 6 = 1,00', color: C.glucose },
    { fuel: 'palmitato', eq: 'C₁₆H₃₂O₂ + 23 O₂ → 16 CO₂ + 16 H₂O', rer: '16 ÷ 23 ≈ 0,70', color: C.fat },
] as const;

/** Equações (passo 2), 50–75% do VO₂máx; exemplo com VO₂ 3,0 e VCO₂ 2,7 L/min (cálculo). */
export const EQUATIONS = [
    { what: 'CHO', eq: '4,210·VCO₂ − 2,962·VO₂', ex: '2,48', err: '0,31', color: C.glucose },
    { what: 'gordura', eq: '1,695·VO₂ − 1,701·VCO₂', ex: '0,49', err: '0,03', color: C.fat },
] as const;

/** Mostrador do RER: escala de 0,70 a 1,15; agulhas de exemplo. */
export const RER_MIN = 0.7;
export const RER_MAX = 1.15;
export const NEEDLES = { steady: 0.9, sprint: 1.08 } as const;

export const ISOTOPE_CHAIN = [
    { title: 'Milho, cana', sub: 'C4: mais ¹³C' },
    { title: 'Bebida', sub: 'já marcada' },
    { title: 'Músculo', sub: 'oxida' },
    { title: '¹³CO₂ no ar', sub: 'mede o exógeno' },
] as const;
