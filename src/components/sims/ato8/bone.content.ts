import { C } from '../kit/palette';
import type { LedgerRow } from './SnShell';
import type { SnStep } from './supernova.content';

/**
 * Slide 149 · O osso sente falta (dossiê 05·FENSHAM2022, HEIKURA2019, HAMMOND2019, MOUNTJOY2023).
 * REDs 2023 entra SEM limiar numérico (os limiares não foram lidos). No gráfico, só os extremos (dia 0 e dia 6)
 * são dados; a reta entre eles é só a ligação.
 */

export const BONE_STEPS: readonly SnStep[] = [
    {
        tab: 'O desenho',
        headline: 'Seis dias, três dietas, um marcador',
        text: 'Fensham 2022: 28 marchadores de elite, duas fases de 6 dias. Controle (CHO alto, energia alta) × LCHF com energia alta × baixa energia. O marcador é o P1NP em jejum, que sobe quando o osso é construído; houve ainda uma sessão de 25 km de marcha.',
        sources: ['Fensham 2022, J Bone Miner Res'],
    },
    {
        tab: 'O resultado',
        headline: 'Sem CHO, o osso forma menos',
        text: 'Com LCHF e energia alta, o P1NP caiu ~26% (d = 3,6), a osteocalcina gla ~22% e a glu ~41%. Com pouca energia, P1NP −14% (d = 1,7). Só o LCHF baixou o P1NP também durante o exercício; o controle não mudou. A falta de carboidrato pesou mais que a de energia.',
        sources: ['Fensham 2022, J Bone Miner Res'],
    },
    {
        tab: 'Heikura 2019',
        headline: 'Energia igual, osso diferente',
        text: '30 marchadores de classe mundial (subanálise do Supernova), 3,5 semanas com a mesma energia (220 kJ/kg/d): CHO 8,6 × 0,5 g/kg/d. Com LCHF, P1NP e osteocalcina caíram e o CTX subiu. A volta ao CHO normalizou só o CTX: a formação seguiu suprimida.',
        sources: ['Heikura 2019, Front Endocrinol'],
    },
    {
        tab: 'Hammond 2019',
        headline: 'O carboidrato freia a reabsorção',
        text: '9 homens, dois treinos intervalados de corrida no mesmo dia; depois, CHO alto (~12 g/kg) × CHO baixo (~3 g/kg) com energia alta × CHO baixo com pouca energia. O βCTX (reabsorção) foi menor só com CHO alto, independente da energia; a sinalização muscular foi igual.',
        sources: ['Hammond 2019, J Physiol'],
    },
    {
        tab: 'REDs 2023',
        headline: 'Duas portas para o mesmo déficit',
        text: 'O consenso do COI sobre REDs (2023) inclui o papel crescente da baixa disponibilidade de carboidrato, ao lado da baixa energia. Não citamos limiares numéricos. São marcadores em dias ou semanas, não fraturas.',
        sources: ['Mountjoy 2023, Br J Sports Med'],
    },
];

export const BONE_CHIPS = [
    'paralelo · n = 28 · 6 dias',
    'paralelo · n = 28 · 6 dias',
    'subanálise · n = 30 · 3,5 semanas',
    'medidas repetidas · n = 9',
    'consenso COI 2023',
] as const;

export interface BoneLine {
    id: 'con' | 'lea' | 'lchf';
    label: string;
    /** P1NP em jejum no 6º dia, % do início. */
    end: number;
    effect: string;
    color: string;
}

export const BONE_LINES: readonly BoneLine[] = [
    { id: 'con', label: 'CHO alto, energia alta', end: 100, effect: 'inalterado', color: C.glucose },
    { id: 'lea', label: 'pouca energia', end: 86, effect: '−14% · d = 1,7', color: C.stone },
    { id: 'lchf', label: 'LCHF, energia alta', end: 74, effect: '−26% · d = 3,6', color: C.fat },
];

/** Heikura 2019: tamanho de efeito (d) do LCHF × CHO alto, em jejum. */
export const HEIKURA_BARS = [
    { label: 'osteocalcina ↓', d: 1.39, text: '1,39' },
    { label: 'P1NP ↓', d: 0.99, text: '0,99' },
    { label: 'CTX ↑', d: 0.69, text: '0,69' },
] as const;

/** Hammond 2019: glicogênio muscular 17 h depois do treino da tarde (mmol/kg ps). */
export const HAMMOND_BARS = [
    { label: 'CHO alto', v: 316, color: C.glucose },
    { label: 'CHO baixo', v: 171, color: C.fat },
    { label: '+ pouca energia', v: 194, color: C.stone },
] as const;

export const BONE_LEDGER: readonly LedgerRow[] = [
    { at: 1, label: 'P1NP: LCHF · pouca energia', value: '−26% · −14%', color: C.fat },
    { at: 2, label: 'volta ao CHO (Heikura)', value: 'só o CTX normaliza' },
    { at: 3, label: 'βCTX (Hammond)', value: 'menor com CHO alto', color: C.glucose },
];
