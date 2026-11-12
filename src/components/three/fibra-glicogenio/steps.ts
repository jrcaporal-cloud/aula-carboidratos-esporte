import { C } from '../../sims/kit/palette';
import type { Pose, StepInfo, StepLabel, Vec3 } from '../shared/modal/types';
import type { StepTarget } from '../shared/tween';
import { COLORS, FIBER_R, MYOFIBRILS, MYO_R } from './layout';

/*
 * As 6 etapas da fibra: o corte, os três endereços, o que acaba primeiro, as duas chaves do GLUT4 e
 * o cálcio do RS. Números de ORTENBLAD2011, NIELSEN2011, LUND1995 e SYLOW2017-REV (dossiê 01).
 */

const ORT = 'Ørtenblad N et al. J Physiol 2011;589(Pt 3):711-25.';
const NIEL = 'Nielsen J et al. J Physiol 2011;589(Pt 11):2871-85.';
const LUND = 'Lund S et al. Proc Natl Acad Sci USA 1995;92(13):5817-21.';
const SYLOW = 'Sylow L et al. Nat Rev Endocrinol 2017;13(3):133-48.';

const lab = (id: string, text: string, sub: string | undefined, color: string, at: Vec3, dx: number, dy: number): StepLabel =>
    ({ id, text, sub, color, at, dx, dy });

/** Miofibrila mais à direita e acima (onde a câmera dos endereços olha). */
const MYO_EDGE = MYOFIBRILS.reduce((best, p) => (p[0] + p[1] > best[0] + best[1] ? p : best));
/** Miofibrila mais à esquerda. */
const MYO_LEFT = MYOFIBRILS.reduce((best, p) => (p[0] < best[0] ? p : best));
const onRim = (a: number, dr = 0, z = 0.2): Vec3 => [Math.cos(a) * (FIBER_R + dr), Math.sin(a) * (FIBER_R + dr), z];

const OVERVIEW: Pose = { pos: [15, 9, 25], tgt: [0.5, -0.5, -2.5] };
const POOLS: Pose = { pos: [12, 10, 16], tgt: [4.2, 3.0, -0.3] };
const SIDE: Pose = { pos: [22, 13, 9], tgt: [5, 2.5, -4.5] };

export const FIBER_STEPS: readonly StepInfo[] = [
    {
        badge: 'O CORTE', short: 'Fibra', title: 'Uma fibra muscular em corte',
        text: 'Por fora, o sarcolema. Dentro, as miofibrilas em feixe; em volta de cada uma, o retículo sarcoplasmático (RS), que guarda o Ca²⁺. Os túbulos T entram pela membrana.',
        sources: [ORT], anim: 0.6, pose: OVERVIEW,
        chips: [{ kind: 'model', text: 'grânulos ampliados ~7×' }],
        labels: [
            lab('sarc', 'Sarcolema', 'membrana da fibra', COLORS.sarcolemmaEdge, onRim(-0.35, 0.2), 30, 80),
            lab('myo', 'Miofibrila', 'feixe de filamentos', C.proteinSoft, [MYO_EDGE[0], MYO_EDGE[1], 0.05], 70, -60),
            lab('sr', 'Retículo sarcoplasmático', 'guarda o Ca²⁺', COLORS.sr, [MYO_LEFT[0] + MYO_R + 0.1, MYO_LEFT[1], 0.05], 40, -120),
            lab('tt', 'Túbulo T', 'a membrana entrando', COLORS.ttubule, [Math.cos(5.45) * (FIBER_R - 1.5), Math.sin(5.45) * (FIBER_R - 1.5), -0.6], 70, 50),
        ],
    },
    {
        badge: 'ENDEREÇOS', short: 'Endereços', title: 'Três endereços do glicogênio',
        text: 'Sob a membrana (subsarcolemal), entre as miofibrilas (intermiofibrilar) e dentro delas, entre os filamentos (intramiofibrilar: 10–15% do total). Mesmo glicogênio, vizinhanças diferentes.',
        sources: [ORT, NIEL], anim: 2.2, pose: POOLS,
        chips: [{ kind: 'model', text: 'grânulos ampliados ~7×' }],
        labels: [
            lab('ss', 'Subsarcolemal', 'sob a membrana', C.glycogenSoft, onRim(0.75, -0.75, 0.2), 40, 120),
            lab('imf', 'Intermiofibrilar', 'entre as miofibrilas', C.glycogenSoft, [MYO_EDGE[0] - 1.0, MYO_EDGE[1] - 0.9, 0.2], -60, 70),
            lab('intra', 'Intramiofibrilar', '10–15% do total', C.glycogenSoft, [MYO_EDGE[0], MYO_EDGE[1], 0.2], -90, -70),
        ],
    },
    {
        badge: '1 h EXAUSTIVA', short: '1 h', title: 'O de dentro acaba primeiro',
        text: 'Depois de 1 h de exercício exaustivo, o intramiofibrilar foi o que mais caiu, em fibras I e II. Só com água na recuperação, foi ele que menos voltou.',
        sources: [NIEL], anim: 2.4, pose: POOLS,
        chips: [{ kind: 'design', text: 'n = 10 · elite · microscopia' }, { kind: 'illustrative' }],
        labels: [
            lab('intra2', 'Intramiofibrilar', 'a maior queda', C.glycogenSoft, [MYO_EDGE[0], MYO_EDGE[1], 0.2], -90, -70),
        ],
    },
    {
        badge: '1ª CHAVE', short: 'Insulina', title: 'Insulina: a via da PI3K',
        text: 'A insulina no receptor ativa a PI3K e o GLUT4 sobe à membrana. No sóleo de rato, a wortmanina (bloqueia a PI3K) derrubou esse transporte de 8,8 para 1,4.',
        sources: [LUND], anim: 3.0, pose: SIDE,
        chips: [{ kind: 'animal', text: 'rato · músculo isolado' }],
        labels: [
            lab('ins', 'Insulina', 'no receptor', C.insulin, onRim(0.55, 1.2, -6), 50, -60),
            lab('glut4', 'GLUT4', 'na membrana', C.insulinSoft, onRim(0.15, 0.4, -3), 60, 60),
        ],
    },
    {
        badge: '2ª CHAVE', short: 'Contração', title: 'Contração: outra via, mesma porta',
        text: 'A contração também leva o GLUT4 à membrana, sem passar pela PI3K: com wortmanina, 4,4 → 4,1. As duas chaves somam (11,5). No exercício, a captação sobe até 50×.',
        sources: [LUND, SYLOW], anim: 3.0, pose: SIDE,
        chips: [{ kind: 'animal', text: 'rato · músculo isolado' }],
        labels: [
            lab('ca1', 'Ca²⁺ do RS', 'sinal da contração', COLORS.calcium, [MYO_EDGE[0] + MYO_R, MYO_EDGE[1], 0.1], -80, 70),
            lab('glut4b', 'GLUT4', 'na membrana', C.insulinSoft, onRim(0.15, 0.4, -3), 60, 60),
        ],
    },
    {
        badge: 'CÁLCIO', short: 'Ca²⁺', title: 'Glicogênio baixo, Ca²⁺ mais lento',
        text: 'Em esquiadores de elite, após 1 h de prova o glicogênio do braço caiu a 31% e a liberação de Ca²⁺ do RS a 85%. O intramiofibrilar foi o que mais se associou. Associação, não prova.',
        sources: [ORT], anim: 3.4, pose: POOLS,
        chips: [{ kind: 'design', text: 'n = 10 · esquiadores de elite' }],
        labels: [
            lab('ca2', 'Ca²⁺ liberado', 'RS medido isolado', COLORS.calcium, [MYO_EDGE[0] + MYO_R, MYO_EDGE[1], 0.1], -90, -70),
        ],
    },
];

export type FiberKey = 'show0' | 'show1' | 'show2' | 'dep0' | 'dep1' | 'dep2';

const ALL = { show0: 1, show1: 1, show2: 1 };
/** Revelação e esvaziamento por endereço (frações ilustrativas; só a ordem vem do estudo). */
export const FIBER_TARGETS: readonly StepTarget<FiberKey>[] = [
    { to: { show0: 0, show1: 0, show2: 0, dep0: 0, dep1: 0, dep2: 0 } },
    { to: { ...ALL, dep0: 0, dep1: 0, dep2: 0 }, win: { show0: [0, 0.8], show1: [0.6, 1.4], show2: [1.2, 2.0] } },
    { to: { ...ALL, dep0: 0.35, dep1: 0.45, dep2: 0.8 }, win: { dep0: [0.2, 2.2], dep1: [0.2, 2.2], dep2: [0.2, 2.2] } },
    { to: { ...ALL, dep0: 0, dep1: 0, dep2: 0 }, win: { dep0: [0, 0.6], dep1: [0, 0.6], dep2: [0, 0.6] } },
    { to: { ...ALL, dep0: 0, dep1: 0, dep2: 0 }, win: { dep0: [0, 0.6], dep1: [0, 0.6], dep2: [0, 0.6] } },
    { to: { ...ALL, dep0: 0.6, dep1: 0.65, dep2: 0.88 }, win: { dep0: [0, 1.4], dep1: [0, 1.4], dep2: [0, 1.4] } },
];

/** Chaves do GLUT4 (LUND1995, µmol·mL⁻¹·h⁻¹). Com as duas e wortmanina: não medido. */
export type KeyMode = 'insulina' | 'contracao' | 'ambas';
export interface Keys { mode: KeyMode; wort: boolean }
export const TRANSPORT: Readonly<Record<KeyMode, { off: number; wort: number | null }>> = {
    insulina: { off: 8.8, wort: 1.4 },
    contracao: { off: 4.4, wort: 4.1 },
    ambas: { off: 11.5, wort: null },
};
export const KEY_PRESET: Readonly<Record<number, Keys>> = { 3: { mode: 'insulina', wort: false }, 4: { mode: 'ambas', wort: false } };
export const transportOf = (k: Keys): number => (k.wort ? TRANSPORT[k.mode].wort ?? TRANSPORT[k.mode].off : TRANSPORT[k.mode].off);
