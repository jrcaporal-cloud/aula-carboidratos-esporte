import { C } from '../../sims/kit/palette';
import { onScreenCircle } from '../shared/modal/screenCircle';
import type { Pose, StepInfo, StepLabel } from '../shared/modal/types';
import type { StepTarget } from '../shared/tween';
import { RADIUS, SHELL } from './build';
import { ANCHOR } from './data';

/*
 * As 6 etapas do grânulo: da glicogenina à casca, depois a quebra e a síntese. Números só de
 * ROACH2012 (dossiê 01), MARCHAND2002 e Leloir 1959 (histórias do dossiê 01).
 */

const ROACH = 'Roach PJ et al. Biochem J 2012;441(3):763-87.';
const MARCHAND = 'Marchand I et al. J Appl Physiol 2002;93(5):1598-607.';
const LELOIR = 'Leloir LF et al. Arch Biochem Biophys 1959;81:508-20.';

const lab = (id: string, text: string, sub: string | undefined, color: string, at: readonly [number, number, number], dx: number, dy: number): StepLabel =>
    ({ id, text, sub, color, at, dx, dy });

const POSE_RAMOS: Pose = { pos: [25, 17, 41], tgt: [0, 0, 0] };
const POSE_CASCA: Pose = { pos: [42, 34, 74], tgt: [0, 0, 0] };
const POSE_ENZ: Pose = { pos: [50, 30, -12], tgt: [12.6, 5.3, -3.1] };
const ORIGIN = [0, 0, 0] as const;

export const ENZYME_COLOR = { phosphorylase: C.stone, synthase: C.proteinSoft } as const;

export const GRANULE_STEPS: readonly StepInfo[] = [
    {
        badge: 'SEMENTE', short: 'Glicogenina', title: 'Tudo começa numa proteína',
        text: 'No centro do grânulo está a glicogenina. Ela prende em si mesma uma cadeia curta de 10 a 20 glicoses: o primer de onde todo o resto cresce.',
        sources: [ROACH], anim: 1.9,
        pose: { pos: [5.6, 3.6, 10.2], tgt: [0.1, 1.3, 0.2] },
        labels: [
            lab('gyg', 'Glicogenina', 'proteína, no centro', C.protein, ANCHOR.glycogenin, -80, 70),
            lab('primer', 'Primer de glicose', 'a glicogenina se autoglicosila', C.glycogenSoft, ANCHOR.primerTip, -110, 30),
        ],
    },
    {
        badge: 'CADEIAS', short: 'Cadeias', title: 'Fios α-1,4, ramos α-1,6',
        text: 'Cada cadeia tem ~13 glicoses ligadas em α-1,4. As cadeias internas abrem dois ramos em α-1,6; a ponta que cresce aparece em âmbar.',
        sources: [ROACH], anim: 2.3,
        pose: { pos: [8.5, 6.5, 14], tgt: [0.2, 0.8, 0] },
        labels: [
            lab('a14', 'Ligação α-1,4', 'ao longo da cadeia', C.glycogenSoft, ANCHOR.alpha14, 80, -60),
            lab('a16', 'Ramo α-1,6', 'uma cadeia nasce da outra', C.glycogenSoft, ANCHOR.alpha16, -90, -80),
        ],
    },
    {
        badge: 'RAMOS', short: 'Ramos', title: 'No músculo, ~25 nm',
        text: 'A cada camada, o número de pontas dobra. No músculo, a partícula média tem ~25 nm, cerca de 7 camadas; os tamanhos formam um contínuo de 10 a 44 nm.',
        sources: [ROACH, MARCHAND], anim: 2.6,
        chips: [{ kind: 'model', text: 'modelo de camadas · estilizado' }],
        pose: POSE_RAMOS,
        labels: [
            lab('r25', '~25 nm', 'média no músculo · ~7 camadas', C.caveat, onScreenCircle(POSE_RAMOS, ORIGIN, 7 * SHELL + 0.7, 215), 40, 90),
        ],
    },
    {
        badge: 'CASCA', short: 'Casca', title: 'Metade da glicose fica na casca',
        text: 'No máximo teórico: 12 camadas, ~55.000 glicoses, ~44 nm. A camada externa, sem ramos, guarda metade da glicose. É ela que a fosforilase alcança primeiro.',
        sources: [ROACH], anim: 3.2,
        chips: [{ kind: 'calc', text: 'modelo: 13 × (2¹² − 1) = 53.235' }, { kind: 'model', text: 'corte para ver o interior' }],
        pose: POSE_CASCA,
        labels: [
            lab('shell', 'Casca externa', 'cadeias sem ramo · 50% da glicose', C.glucoseSoft, ANCHOR.shell12, -30, 150),
            lab('r44', '44 nm', 'máximo teórico · 12 camadas', C.caveat, onScreenCircle(POSE_CASCA, ORIGIN, RADIUS + 0.8, 215), 40, 90),
        ],
    },
    {
        badge: 'QUEBRA', short: 'Fosforilase', title: 'A fosforilase morde as pontas',
        text: 'A fosforilase solta glicose-1-fosfato pelas pontas e para 4 glicoses antes do ramo; dali, só com a enzima desramificadora. Muitas pontas: muita glicose ao mesmo tempo.',
        sources: [ROACH], anim: 3.4,
        chips: [{ kind: 'calc', text: 'no modelo: 9 de 13 por ponta' }],
        pose: POSE_ENZ,
        labels: [
            lab('phos', 'Fosforilase', 'come da ponta para dentro', ENZYME_COLOR.phosphorylase, ANCHOR.enzyme, -80, -40),
            lab('stump', 'Para a 4 do ramo', 'espera a desramificadora', C.glycogenSoft, ANCHOR.stump, -60, -150),
        ],
    },
    {
        badge: 'SÍNTESE', short: 'Sintase', title: 'A síntese é outro caminho',
        text: 'Para refazer, a glicogênio sintase alonga as pontas a partir de UDP-glicose. Leloir mostrou que a síntese não é a quebra andando ao contrário.',
        sources: [LELOIR, ROACH], anim: 3.4,
        pose: POSE_ENZ,
        labels: [
            lab('gs', 'Glicogênio sintase', 'alonga em α-1,4', ENZYME_COLOR.synthase, ANCHOR.enzyme, -80, -40),
            lab('udp', 'UDP-glicose', 'a glicose chega ativada', C.glucose, ANCHOR.stump, -60, -150),
        ],
    },
];

export type SceneKey = 'tiers' | 'shell' | 'cut' | 'ring25' | 'ring44' | 'gyg';

/** Alvos de cena por etapa (o corte vai de 30 nm, nada cortado, a 0, meio grânulo). */
export const GRANULE_TARGETS: readonly StepTarget<SceneKey>[] = [
    { to: { tiers: 1, shell: 0, cut: 30, ring25: 0, ring44: 0, gyg: 1 }, win: { tiers: [0.1, 1.4] } },
    { to: { tiers: 3, shell: 0, cut: 30, ring25: 0, ring44: 0, gyg: 1 }, win: { tiers: [0, 1.8] } },
    { to: { tiers: 7, shell: 0, cut: 30, ring25: 1, ring44: 0, gyg: 1 }, win: { tiers: [0, 2.0], ring25: [1.8, 2.4] } },
    { to: { tiers: 12, shell: 1, cut: 0, ring25: 0.45, ring44: 1, gyg: 1 }, win: { tiers: [0, 1.8], cut: [1.4, 2.4], shell: [2.2, 3.0], ring44: [2.4, 3.2], ring25: [0, 0.4] } },
    { to: { tiers: 12, shell: 1, cut: 0, ring25: 0, ring44: 0, gyg: 1 }, win: { ring44: [0, 0.3] } },
    { to: { tiers: 12, shell: 0, cut: 0, ring25: 0, ring44: 0, gyg: 1 }, win: { shell: [0.1, 0.9] } },
];

/** Fim do crescimento em cada etapa (a frente âmbar esmaece depois dele). */
export const GROW_END: readonly number[] = [1.4, 1.8, 2.0, 1.8, 0, 0];
/** A frente âmbar some em 0,5 s depois do crescimento (cabe na animação da etapa). */
export const FRESH_FADE = 0.5;
