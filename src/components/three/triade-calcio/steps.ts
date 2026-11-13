import { C } from '../../sims/kit/palette';
import type { Pose, StepInfo, StepLabel, Vec3 } from '../shared/modal/types';
import type { StepTarget } from '../shared/tween';
import { CIST_DX, CIST_TUBE, COLORS, FRONT_Z, INTRA_LEFT, JUNCTION_ANGLES, LONG_R, MEM_Y, RING_R, SERCA_ANGLES, SERCA_X, T_TUBE, TRIAD_X, Z_REST, Z_SHIFT, ringPoint } from './layout';

/*
 * As 7 etapas da tríade: a anatomia, o gatilho (DHPR → RyR1), o Ca²⁺ na troponina C e a contração,
 * a SERCA, os três endereços do glicogênio, o braço seco (ORTENBLAD2011) e o "?" do elo
 * glicogênio → RyR1 (GEJL2014, ORTENBLAD2013). Números só do dossiê 02 e do slide 66.
 */

const ORT11 = 'Ørtenblad N et al. J Physiol 2011;589(Pt 3):711-25.';
const NIEL = 'Nielsen J et al. J Physiol 2011;589(Pt 11):2871-85.';
const GEJL = 'Gejl KD et al. Med Sci Sports Exerc 2014;46(3):496-505.';
const ORT13 = 'Ørtenblad N, Westerblad H, Nielsen J. J Physiol 2013;591(18):4405-13.';

const lab = (id: string, text: string, sub: string | undefined, color: string, at: Vec3, dx: number, dy: number): StepLabel =>
    ({ id, text, sub, color, at, dx, dy });

const LEFT = TRIAD_X[0];
const TOP_A = JUNCTION_ANGLES[3];
/** Pontos de ancoragem dos rótulos (miofibrila da frente, tríade da esquerda). */
const AT = {
    mem: [0.6, MEM_Y + 0.18, -2] as Vec3,
    stub: [-LEFT, MEM_Y - 0.5, 0] as Vec3,
    cist: ringPoint(LEFT - CIST_DX, RING_R + CIST_TUBE, 1.3),
    zline: ringPoint(-Z_REST, 0.8, -0.5),
    zlineIn: ringPoint(-(Z_REST - Z_SHIFT), 0.8, -0.5),
    myosin: [1.4, -0.45, FRONT_Z + 0.45] as Vec3,
    dhpr: ringPoint(LEFT - T_TUBE - 0.1, RING_R, TOP_A),
    ryr: ringPoint(LEFT + 0.41, RING_R, JUNCTION_ANGLES[0]),
    calcium: ringPoint(-2.4 + Z_SHIFT, 0.8, 0.55),
    serca: ringPoint(-SERCA_X[1], LONG_R - 0.25, SERCA_ANGLES[0]),
    sub: [2.4, MEM_Y - 0.4, 1.4] as Vec3,
    inter: [1.4, -0.6, 1.6] as Vec3,
    intra: INTRA_LEFT,
};

const OVERVIEW: Pose = { pos: [0.4, 5.6, 18.5], tgt: [0, 0.1, 1.2] };
const TRIAD: Pose = { pos: [-1.4, 4.4, 12], tgt: [-3.2, 0.8, 3.0] };
const SARC: Pose = { pos: [0.2, 5, 16.5], tgt: [0, 0.2, 2.4] };
const POOLS: Pose = { pos: [0.5, 3.8, 18], tgt: [-0.5, 0.6, 1] };
const DOUBT: Pose = { pos: [-1.2, 3.6, 13.5], tgt: [-2.4, 0.3, 2.8] };

export const TRIAD_STEPS: readonly StepInfo[] = [
    {
        badge: 'A TRÍADE', short: 'Tríade', title: 'Onde o sinal vira cálcio',
        text: 'Um sarcômero de linha Z a linha Z. O túbulo T, a membrana entrando, passa entre duas cisternas do retículo sarcoplasmático (RS), que guarda o Ca²⁺: é a tríade.',
        sources: [ORT13], anim: 0.6, pose: OVERVIEW,
        chips: [{ kind: 'model', text: 'proteínas e íons ampliados' }],
        labels: [
            lab('mem', 'Sarcolema', 'membrana da fibra', COLORS.sarcolemmaEdge, AT.mem, 40, -80),
            lab('tt', 'Túbulo T', 'a membrana entrando', COLORS.ttubule, AT.stub, 50, -60),
            lab('cist', 'Cisternas do RS', 'guardam o Ca²⁺', C.caveat, AT.cist, 30, -115),
            lab('z', 'Linha Z', 'limite do sarcômero', COLORS.zline, AT.zline, 30, 115),
            lab('myo', 'Actina e miosina', 'miofibrila aberta', C.proteinSoft, AT.myosin, 30, 110),
        ],
    },
    {
        badge: 'O GATILHO', short: 'Gatilho', title: 'O sensor puxa o canal',
        text: 'O potencial de ação desce pelo túbulo T. O sensor de voltagem (DHPR), na parede do túbulo, muda de forma e abre o canal RyR1 da cisterna, encostado nele.',
        sources: [ORT13], anim: 2.2, pose: TRIAD,
        chips: [{ kind: 'model', text: 'proteínas ampliadas' }],
        labels: [
            lab('dhpr', 'DHPR', 'sensor de voltagem', COLORS.dhpr, AT.dhpr, -70, -70),
            lab('ryr', 'RyR1', 'canal de Ca²⁺ do RS', C.insulinSoft, AT.ryr, 80, 70),
        ],
    },
    {
        badge: 'Ca²⁺ SAI', short: 'Ca²⁺', title: 'O Ca²⁺ liga e a fibra encurta',
        text: 'O Ca²⁺ sai pelo RyR1 e liga na troponina C, na actina. A miosina puxa a actina para o centro: a banda I encurta e as linhas Z se aproximam.',
        sources: [ORT13], anim: 2.4, pose: SARC,
        chips: [{ kind: 'model', text: 'nº de íons ilustrativo' }],
        labels: [
            lab('ca', 'Ca²⁺', 'na troponina C', COLORS.calcium, AT.calcium, 70, -80),
            lab('z2', 'Linha Z', 'se aproxima', COLORS.zline, AT.zlineIn, 30, 115),
        ],
    },
    {
        badge: 'SERCA', short: 'SERCA', title: 'A bomba devolve o Ca²⁺',
        text: 'A SERCA bombeia o Ca²⁺ de volta para dentro do RS, gastando ATP. Sem Ca²⁺ na troponina, a miofibrila relaxa e o RS fica pronto para o próximo disparo.',
        sources: [ORT13], anim: 2.2, pose: SARC,
        chips: [{ kind: 'model', text: 'nº de íons ilustrativo' }],
        labels: [
            lab('serca', 'SERCA', 'gasta ATP', COLORS.serca, AT.serca, 60, 80),
        ],
    },
    {
        badge: 'ENDEREÇOS', short: 'Endereços', title: 'Três endereços do glicogênio',
        text: 'Sob a membrana (subsarcolemal), entre as miofibrilas (intermiofibrilar) e dentro delas, entre os filamentos (intramiofibrilar: 10–15% do total). O de dentro fica perto da tríade.',
        sources: [ORT11, NIEL], anim: 2.2, pose: POOLS,
        chips: [{ kind: 'model', text: 'grânulos ampliados' }],
        labels: [
            lab('ss', 'Subsarcolemal', 'sob a membrana', C.glycogenSoft, AT.sub, 60, -80),
            lab('imf', 'Intermiofibrilar', 'entre as miofibrilas', C.glycogenSoft, AT.inter, 80, 90),
            lab('intra', 'Intramiofibrilar', '10–15% do total', C.glycogenSoft, AT.intra, 40, 120),
        ],
    },
    {
        badge: 'BRAÇO SECO', short: 'Braço seco', title: 'O de dentro esvazia; o Ca²⁺ cai',
        text: 'Esquiadores de elite, ~1 h de prova: glicogênio do braço a 31% e liberação de Ca²⁺ do RS a 85%. O intramiofibrilar esvaziou mais e foi o que se associou ao Ca²⁺.',
        sources: [ORT11, NIEL], anim: 4.4, pose: DOUBT,
        chips: [{ kind: 'design', text: 'n = 10 · esquiadores de elite' }, { kind: 'illustrative' }],
        labels: [
            lab('intra2', 'Intramiofibrilar', 'o que mais esvazia', C.glycogenSoft, AT.intra, -60, 100),
        ],
    },
    {
        badge: 'CAUSA?', short: 'Causa?', title: 'Junto não é causa',
        text: 'Gejl 2014 repetiu o achado (32% e 86%), mas r = 0,30. Os autores, em 2013: causa e efeito "ainda não estabelecida". Ca²⁺ medido in vitro. O elo glicogênio → RyR1 é hipótese.',
        sources: [GEJL, ORT13], anim: 0.6, pose: DOUBT,
        chips: [{ kind: 'design', text: 'in vitro · associação' }],
        labels: [
            lab('doubt', 'Glicogênio → RyR1?', 'associação, não causa provada', C.stone, AT.intra, 40, 120),
        ],
    },
];

/** Índices de etapa usados pela cena. */
export const STEP = { anatomy: 0, trigger: 1, release: 2, serca: 3, pools: 4, low: 5, doubt: 6 } as const;

export type TriadKey = 'gate' | 'con' | 'show0' | 'show1' | 'show2' | 'dep0' | 'dep1' | 'dep2';

const HIDE = { show0: 0, show1: 0, show2: 0, dep0: 0, dep1: 0, dep2: 0 };
const ALL = { show0: 1, show1: 1, show2: 1, dep0: 0, dep1: 0, dep2: 0 };
/** Frações de esvaziamento ilustrativas (só a ordem vem de NIELSEN2011: o intramiofibrilar cai mais). */
const LOW = { show0: 1, show1: 1, show2: 1, dep0: 0.4, dep1: 0.5, dep2: 0.86 };

/** Canal (gate), contração (con) e glicogênio por etapa, com a janela (s) de cada mudança. */
export const TRIAD_TARGETS: readonly StepTarget<TriadKey>[] = [
    { to: { gate: 0, con: 0, ...HIDE }, win: { gate: [0, 0.4], con: [0, 0.4] } },
    { to: { gate: 1, con: 0, ...HIDE }, win: { gate: [1.3, 1.9], con: [0, 0.4] } },
    { to: { gate: 1, con: 1, ...HIDE }, win: { gate: [0, 0.3], con: [1.1, 2.3] } },
    { to: { gate: 0, con: 0, ...HIDE }, win: { gate: [0, 0.6], con: [0.9, 2.1] } },
    { to: { gate: 0, con: 0, ...ALL }, win: { gate: [0, 0.4], con: [0, 0.4], show0: [0, 0.8], show1: [0.6, 1.4], show2: [1.2, 2.0] } },
    {
        to: { gate: 1, con: 1, ...LOW },
        win: { gate: [2.2, 2.7], con: [3.3, 4.4], show0: [0, 0.4], show1: [0, 0.4], show2: [0, 0.4], dep0: [0.2, 1.6], dep1: [0.2, 1.6], dep2: [0.2, 1.6] },
    },
    { to: { gate: 1, con: 1, ...LOW }, win: { gate: [0, 0.3], con: [0, 0.3] } },
];

/** Potencial de ação descendo o túbulo T: janela (s) por etapa. */
export const AP_WINDOW: Readonly<Record<number, readonly [number, number]>> = { [STEP.trigger]: [0.1, 1.4], [STEP.low]: [1.0, 2.3] };

/** Íons: janela da saída (RyR1 → troponina) e da volta (troponina → SERCA) por etapa; fração que sai. */
export const ION_RELEASE: Readonly<Record<number, { at: number; share: number }>> = {
    [STEP.release]: { at: 0.1, share: 1 },
    [STEP.low]: { at: 2.4, share: 0.85 },
};
export const ION_UPTAKE_AT = 0.1;
