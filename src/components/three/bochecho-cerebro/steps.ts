import { C } from '../../sims/kit/palette';
import type { Pose, StepInfo, StepLabel, Vec3 } from '../shared/modal/types';
import type { StepTarget, Window as Span } from '../shared/tween';
import {
    ACC, ARROW_TIP, BUD_LOCAL, COLORS, INSULA, INTEGRATION_AT, LIPS, M1_AT, NTS, OFC, PAPILLA, STRIATUM, budWorld,
} from './layout';

/*
 * As 6 etapas do bochecho: a boca, o sensor, o nervo, o gosto no cérebro, a recompensa e o comando
 * motor. Números e frases só do dossiê 03, bloco H (CART2004B, CHAM2009, BRIE2019) e da subseção
 * "Mecanismo potencial do bochecho" (JEUK2010, LAPIS2016, ROPER2017, GANT2010, TURN2014).
 * Mecanismo POTENCIAL: receptor não identificado e cadeia inteira nunca medida junta.
 */

const CART = 'Carter JM, Jeukendrup AE, Jones DA. Med Sci Sports Exerc 2004;36(12):2107-11.';
const LAPIS = 'Lapis TJ, Penner MH, Lim J. Chem Senses 2016;41(9):755-62.';
const JEUK = 'Jeukendrup AE, Chambers ES. Curr Opin Clin Nutr Metab Care 2010;13(4):447-51.';
const CHAM = 'Chambers ES, Bridge MW, Jones DA. J Physiol 2009;587(Pt 8):1779-94.';
const ROPER = 'Roper SD, Chaudhari N. Nat Rev Neurosci 2017;18(8):485-97.';
const TURN = 'Turner CE, Byblow WD, Stinear CM, Gant N. Appetite 2014;80:212-9.';
const GANT = 'Gant N, Stinear CM, Byblow WD. Brain Res 2010;1350:151-8.';
const BRIE = 'Brietzke C et al. Sports Med 2019;49(1):57-66.';

const lab = (id: string, text: string, sub: string | undefined, color: string, at: Vec3, dx: number, dy: number, delay?: number): StepLabel =>
    ({ id, text, sub, color, at, dx, dy, delay });

const top = (e: { c: Vec3; r: Vec3 }, k = 1): Vec3 => [e.c[0], e.c[1] + e.r[1] * k, e.c[2]];

const MOUTH: Pose = { pos: [11.0, 4.0, 23], tgt: [4.8, -0.4, -1.2] };
const SENSOR: Pose = { pos: [14.0, 4.6, 26.0], tgt: [10.6, 1.2, 0.6] };
const NERVE: Pose = { pos: [5.5, 3.2, 28.5], tgt: [1.6, -1.0, -0.8] };
const TASTE: Pose = { pos: [6.6, 9.0, 15.0], tgt: [2.6, 4.2, -2.6] };
const REWARD: Pose = { pos: [5.8, 8.6, 17.5], tgt: [2.9, 6.1, -1.5] };
const MOTOR: Pose = { pos: [10.0, 6.5, 50.0], tgt: [0.6, 0.4, -2.0] };

export const RINSE_STEPS: readonly StepInfo[] = [
    {
        badge: 'A BOCA', short: 'Boca', title: 'Na boca, e cuspido',
        text: 'Bochecho de 5 s com maltodextrina a 6,4%, cuspido: nada é engolido. Mesmo assim, o contrarrelógio de ~1 h foi ~1,8 min mais rápido que com água.',
        sources: [CART], anim: 4.4, pose: MOUTH,
        chips: [{ kind: 'design', text: 'ECR cruzado · n = 9 · em jejum' }, { kind: 'calc', text: '−1,8 min: cálculo' }, { kind: 'model', text: 'corte sagital esquemático' }],
        labels: [
            lab('rinse', 'Maltodextrina a 6,4%', 'bochecho de 5 s', C.glucoseSoft, [6.0, -1.0, -0.2], -40, -120),
            lab('tongue', 'Língua', undefined, COLORS.papilla, [4.4, -3.0, 0], -70, 70),
            lab('spit', 'Cuspido', 'nada é engolido', C.glucoseSoft, [LIPS[0] + 1.1, LIPS[1] - 0.6, LIPS[2]], 40, 70, 3.4),
        ],
    },
    {
        badge: 'O SENSOR', short: 'Sensor', title: 'Um sensor que não é o do doce',
        text: 'A maltodextrina não é doce e mesmo assim age. Humanos detectam oligômeros de glicose com o receptor do doce bloqueado; descrevem o gosto como “starchy” (de amido). O receptor dessa via não foi identificado.',
        sources: [LAPIS, JEUK, CHAM], anim: 2.6, pose: SENSOR,
        chips: [{ kind: 'model', text: 'receptor não identificado' }, { kind: 'model', text: 'sensor hipotético' }, { kind: 'model', text: 'botão gustativo ampliado' }],
        labels: [
            lab('sweet', 'T1R2/T1R3', 'receptor do doce', COLORS.sweetB, budWorld(BUD_LOCAL.sweet, 0.2), -90, -30, 1.0),
            lab('sensor', 'Sensor de carboidrato ?', 'hipotético · não identificado', C.stone, budWorld(BUD_LOCAL.sensor, 0.9), 40, -75, 1.0),
            lab('bud', 'Botão gustativo', 'ampliado', COLORS.budCell, budWorld(BUD_LOCAL.body), 70, 60, 1.0),
            lab('pap', 'Papila da língua', undefined, COLORS.papilla, PAPILLA, -60, 80),
        ],
    },
    {
        badge: 'O NERVO', short: 'Nervo', title: 'Do botão ao tronco cerebral',
        text: 'O sinal dos botões gustativos segue por fibras aferentes (gânglios geniculado e petroso; ex.: corda do tímpano) até os neurônios do núcleo do trato solitário (NTS), no tronco cerebral.',
        sources: [ROPER], anim: 2.6, pose: NERVE,
        chips: [{ kind: 'model', text: 'trajeto do nervo simplificado' }],
        labels: [
            lab('aff', 'Fibras gustativas aferentes', 'ex.: corda do tímpano', COLORS.pathOn, [3.2, -3.0, 0.06], 30, 95),
            lab('nts', 'Núcleo do trato solitário', 'NTS · tronco cerebral', C.glucoseSoft, NTS.c, -60, -110, 1.6),
        ],
    },
    {
        badge: 'O GOSTO', short: 'Gosto', title: 'O gosto chega ao córtex',
        text: 'Na ressonância funcional, glicose e maltodextrina acenderam a ínsula/opérculo frontal (córtex gustativo primário) e o córtex orbitofrontal. Contra placebo de mesmo gosto, o gustativo primário acendeu só com carboidrato.',
        sources: [CHAM, TURN], anim: 1.6, pose: TASTE,
        chips: [{ kind: 'design', text: 'fMRI' }, { kind: 'model', text: 'via NTS → córtex simplificada' }],
        labels: [
            lab('ins', 'Ínsula / opérculo frontal', 'córtex gustativo primário', C.glucoseSoft, [INSULA.c[0] - 0.6, INSULA.c[1] - 0.6, INSULA.c[2] + 0.4], 40, 120, 0.7),
            lab('ofc', 'Córtex orbitofrontal', undefined, C.glucoseSoft, top(OFC), 40, -110, 0.7),
        ],
    },
    {
        badge: 'A RECOMPENSA', short: 'Recompensa', title: 'Carboidrato, não só doce',
        text: 'Com glicose, o estriado e o cingulado anterior (áreas de recompensa) acenderam; com sacarina, doce e sem carboidrato, não. A maltodextrina também acendeu o estriado. Compare no botão acima.',
        sources: [CHAM], anim: 1.6, pose: REWARD,
        chips: [{ kind: 'design', text: 'fMRI · placebo com sacarina' }],
        labels: [
            lab('str', 'Estriado', 'recompensa', C.glucoseSoft, top(STRIATUM[1], -0.4), -90, 100, 0.7),
            lab('acc', 'Cingulado anterior', 'recompensa', C.glucoseSoft, ACC[3], 50, 90, 0.7),
        ],
    },
    {
        badge: 'O COMANDO', short: 'Motor', title: 'O córtex motor responde',
        text: 'Com carboidrato na boca, o MEP do M1 (TMS) subiu 9% no bochecho com o músculo ativo (30% bebendo) e o córtex sensório-motor ativou mais na preensão. Integração proposta: “talvez via núcleos do tronco”.',
        sources: [GANT, TURN, BRIE], anim: 3.4, pose: MOTOR,
        chips: [{ kind: 'model', text: 'cada elo tem estudo' }, { kind: 'model', text: 'a cadeia inteira não foi medida junta' }],
        labels: [
            lab('m1', 'Córtex motor primário (M1)', 'excitabilidade maior', C.glucoseSoft, M1_AT, 120, 50, 0.3),
            lab('int', 'Integração no tronco?', 'proposta, não medida', C.stone, INTEGRATION_AT, 90, -20, 1.0),
            lab('muscle', 'Para o músculo', 'potência: sobe pouco', C.glucoseSoft, ARROW_TIP, 70, -10, 2.4),
        ],
    },
];

/** Índices de etapa usados pela cena. */
export const STEP = { mouth: 0, sensor: 1, nerve: 2, taste: 3, reward: 4, motor: 5 } as const;

/** Parâmetros da cena (0–1): líquido, botão ampliado, vias e regiões acesas. */
export type RinseKey = 'bud' | 'aff' | 'nts' | 'asc' | 'ins' | 'ofc' | 'str' | 'acc' | 'm1' | 'desc' | 'arrow' | 'spit';

/** Tudo apagado (estado inicial da interpolação). */
export const REST: Readonly<Record<RinseKey, number>> = { bud: 0, aff: 0, nts: 0, asc: 0, ins: 0, ofc: 0, str: 0, acc: 0, m1: 0, desc: 0, arrow: 0, spit: 0 };

/** O que apaga ao trocar de etapa sai rápido (0,35 s); só o que acende tem janela própria. */
const OUT: Partial<Record<RinseKey, Span>> = Object.fromEntries(Object.keys(REST).map(k => [k, [0, 0.35] as const]));
const target = (to: Partial<Record<RinseKey, number>>, win: Partial<Record<RinseKey, Span>> = {}): StepTarget<RinseKey> =>
    ({ to: { ...REST, ...to }, win: { ...OUT, ...win } });

export const RINSE_TARGETS: readonly StepTarget<RinseKey>[] = [
    target({ spit: 1 }, { spit: [3.0, 3.4] }),
    target({ bud: 1 }, { bud: [0.05, 0.9] }),
    target({ aff: 1, nts: 1 }, { aff: [0, 0.4], nts: [1.4, 1.8] }),
    target({ asc: 1, ins: 1, ofc: 1 }, { asc: [0, 0.3], ins: [0.55, 0.9], ofc: [0.55, 0.9] }),
    target({ asc: 1, str: 1, acc: 1 }, { asc: [0, 0.3], str: [0.55, 0.9], acc: [0.55, 0.9] }),
    target({ m1: 1, desc: 1, arrow: 1 }, { m1: [0.1, 0.5], desc: [0.3, 0.7], arrow: [2.2, 2.6] }),
];

/** Rotas dos pulsos (âmbar): 'aff' até o NTS; ramos do NTS; 'desc' do M1 para baixo. */
export type Route = 'aff' | 'ins' | 'ofc' | 'str' | 'acc' | 'desc';

export interface PulseCue { route: Route; at: number; dur: number; carbOnly?: boolean }

/** Pulsos de cada etapa: rota, início (s) e duração da viagem. */
export const PULSES: Readonly<Record<number, readonly PulseCue[]>> = {
    [STEP.nerve]: [0.1, 0.5, 0.9].map(at => ({ route: 'aff' as const, at, dur: 1.3 })),
    [STEP.taste]: [0.0, 0.3].flatMap(at => (['ins', 'ofc'] as const).map(route => ({ route, at, dur: 0.7 }))),
    [STEP.reward]: [0.0, 0.3].flatMap(at => (['str', 'acc'] as const).map(route => ({ route, at, dur: 0.7, carbOnly: true }))),
    [STEP.motor]: [0.5, 0.95, 1.4].map(at => ({ route: 'desc' as const, at, dur: 1.4 })),
};

/** Quantos pulsos no máximo numa etapa (tamanho da malha instanciada). */
export const MAX_PULSES = Math.max(...Object.values(PULSES).map(p => p.length));

/** O "?" do sensor (etapa 2) e o da integração no tronco (etapa 6). */
export const DOUBTS: readonly { step: number; at: Vec3 }[] = [
    { step: STEP.sensor, at: budWorld(BUD_LOCAL.sensor, 0.62) },
    { step: STEP.motor, at: INTEGRATION_AT },
];

/** Bochecho: mexe de 0,2 a 2,9 s; cuspido de 3,0 a 4,2 s (tempo de cena, comprimido). */
export const SWISH = { from: 0.2, to: 2.9, spitFrom: 3.0, spitTo: 4.2 } as const;
