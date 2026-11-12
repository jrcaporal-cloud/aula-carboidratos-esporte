import { C } from '../kit/palette';

/**
 * Slide 149 · O osso sente falta (dossiê 05·FENSHAM2022, HEIKURA2019, HAMMOND2019, MOUNTJOY2023).
 * REDs 2023 entra SEM limiar numérico (os limiares não foram lidos).
 */

export const BONE_BEATS = [
    'Seis dias, três dietas. O marcador: P1NP, a formação de osso.',
    'Sem carboidrato, a formação óssea caiu mais do que com pouca energia.',
    'Com energia adequada, cortar só o carboidrato já mexe no osso.',
    'O consenso REDs 2023 põe a falta de carboidrato ao lado da falta de energia.',
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

export const BONE_CARDS = [
    { who: 'Heikura 2019', text: 'LCHF com energia igual, 3,5 semanas: P1NP e osteocalcina caem; voltar ao CHO não normaliza.' },
    { who: 'Hammond 2019', text: 'Mesma energia: com CHO alto, menos reabsorção óssea (βCTX).' },
] as const;

export const BONE_SOURCES = [
    'Fensham NC et al. J Bone Miner Res 2022;37(10):1915-1925.',
    'Fensham NC et al. J Bone Miner Res 2022;37(10):1915-1925.',
    'Heikura IA et al. Front Endocrinol 2019;10:880; Hammond KM et al. J Physiol 2019;597(18):4779-96.',
    'Mountjoy M et al. Br J Sports Med 2023;57(17):1073-1097.',
] as const;
