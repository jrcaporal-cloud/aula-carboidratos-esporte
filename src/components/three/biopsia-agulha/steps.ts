import { C } from '../../sims/kit/palette';
import type { Pose, StepInfo, StepLabel, Vec3 } from '../shared/modal/types';
import type { StepTarget } from '../shared/tween';
import { BUNDLE, FASCIA, FAT, FEMUR, FRAG_OUT, NEEDLE, PRE, PULL, SKIN, TIP_IN, TISSUE, WIN_C, aroundFemur, onEllipse } from './layout';

/*
 * As 6 etapas da biópsia: a coxa em corte, a agulha, a entrada no vasto lateral, o corte, a saída
 * com o fragmento e o fragmento ampliado com os grânulos. Fontes do dossiê 02 (BIOPSIA-BERGSTROM,
 * BERGSTROM1967) e do content do slide 60; a técnica passo a passo é esquema, não medida.
 */

const STOUT = 'Stout JR et al. J Int Soc Sports Nutr 2025;22(sup1):2463373 (relato de Harris).';
const B1975 = 'Bergström J. Scand J Clin Lab Invest 1975;35(7):609-16 (técnica).';
const EKBLOM = 'Ekblom B. Scand J Med Sci Sports 2017;27(5):458-61.';
const B1967 = 'Bergström J et al. Acta Physiol Scand 1967;71(2):140-50.';

const lab = (id: string, text: string, sub: string | undefined, color: string, at: Vec3, dx: number, dy: number, delay?: number): StepLabel =>
    ({ id, text, sub, color, at, dx, dy, delay });

/** Ponto da agulha no mundo: ponta em `tipX`, `x` ao longo da cânula, `dy`/`dz` a partir do eixo. */
const onNeedle = (tipX: number, x: number, dy = 0, dz = 0): Vec3 => [tipX + x, NEEDLE.y + dy, NEEDLE.z + dz];
const TIP_OUT = TIP_IN + PRE;
const TIP_PULLED = TIP_IN + PULL;
const KNOB_OPEN = NEEDLE.cutOpen + NEEDLE.cutterLen + NEEDLE.knob.len / 2;
const KNOB_CLOSED = NEEDLE.cutClosed + NEEDLE.cutterLen + NEEDLE.knob.len / 2;

const OVERVIEW: Pose = { pos: [9, 8, 33], tgt: [0.4, -0.4, -1.2] };
const TOOL: Pose = { pos: [15.0, 5.5, 17.0], tgt: [14.0, 1.2, 0] };
const PATH: Pose = { pos: [10, 7, 22], tgt: [8.5, 0.8, -0.5] };
const WINDOW: Pose = { pos: [8.4, 4.8, 13.5], tgt: [7.4, 1.2, 0] };
const OUT: Pose = { pos: [11.5, 7.5, 21.5], tgt: [10.0, 1.6, -0.3] };
const ZOOM: Pose = { pos: [15.5, 9.5, 19.5], tgt: [13.4, 5.6, -0.4] };

export const BIOPSY_STEPS: readonly StepInfo[] = [
    {
        badge: 'A COXA', short: 'Coxa', title: 'A coxa em corte',
        text: 'Por fora, pele, gordura subcutânea e a fáscia. Dentro, os vastos em volta do fêmur. O vasto lateral, do lado de fora da coxa, é o músculo das biópsias clássicas.',
        sources: [B1967, B1975], anim: 0.6, pose: OVERVIEW,
        chips: [{ kind: 'model', text: 'corte esquemático' }],
        labels: [
            lab('skin', 'Pele', undefined, TISSUE.skin, onEllipse(62, SKIN.rx - 0.05, SKIN.ry - 0.05), 50, -50),
            lab('fat', 'Gordura subcutânea', undefined, TISSUE.fat, onEllipse(222, FAT.rx - 0.4, FAT.ry - 0.4), -30, 75),
            lab('fascia', 'Fáscia', 'envolve os músculos', TISSUE.fascia, onEllipse(168, FASCIA.rx - 0.06, FASCIA.ry - 0.06), -60, 10),
            lab('vl', 'Vasto lateral', 'lado de fora da coxa', TISSUE.vlLabel, aroundFemur(10, 4.4), 120, -110),
            lab('others', 'Outros vastos', 'medial e intermédio', C.caveat, aroundFemur(150, 4.0), -40, -95),
            lab('femur', 'Fêmur', undefined, TISSUE.bone, aroundFemur(-60, FEMUR.r * 0.7), 70, 120),
        ],
    },
    {
        badge: 'A AGULHA', short: 'Agulha', title: 'Uma cânula com janela',
        text: 'A cânula tem a ponta fechada e uma janela lateral perto da ponta. Por dentro desliza um cilindro cortante, empurrado pelo êmbolo. Bergström, nefrologista, chegou a ela em 1959.',
        sources: [STOUT, B1975, EKBLOM], anim: 0.6, pose: TOOL,
        labels: [
            lab('window', 'Janela lateral', 'perto da ponta', C.glucoseSoft, onNeedle(TIP_OUT, WIN_C, -0.05, NEEDLE.r), -30, -95),
            lab('cannula', 'Cânula', 'ponta fechada', C.stone, onNeedle(TIP_OUT, 4.6, -NEEDLE.r), -20, 85),
            lab('cutter', 'Cilindro cortante', 'desliza por dentro', C.co2, onNeedle(TIP_OUT, 8.35, 0, NEEDLE.cutterR), -40, -105),
            lab('knob', 'Êmbolo', 'empurra o cilindro', C.caveat, onNeedle(TIP_OUT, KNOB_OPEN, -NEEDLE.knob.r), -30, 85),
        ],
    },
    {
        badge: 'A ENTRADA', short: 'Entrada', title: 'Pela pele, até o vasto lateral',
        text: 'Com a janela fechada, a agulha atravessa pele, gordura e fáscia e entra no vasto lateral. Lá dentro, o cilindro recua, a janela abre e o músculo cai nela.',
        sources: [B1975, EKBLOM], anim: 4.2, pose: PATH,
        chips: [{ kind: 'model', text: 'sequência esquemática' }],
        labels: [
            lab('layers', 'Pele, gordura, fáscia', 'atravessadas', TISSUE.skin, [SKIN.rx - 0.45, NEEDLE.y - 0.9, 0.1], 40, 100),
            lab('fall', 'O músculo cai na janela', 'vasto lateral', TISSUE.vlLabel, onNeedle(TIP_IN, WIN_C, 0, 0.2), 40, -130, 3.6),
        ],
    },
    {
        badge: 'O CORTE', short: 'Corte', title: 'O cilindro corta o fragmento',
        text: 'O êmbolo empurra o cilindro cortante para a frente. Ele fecha a janela e corta o músculo que entrou: o fragmento fica preso dentro da agulha.',
        sources: [B1975, EKBLOM], anim: 1.4, pose: WINDOW,
        chips: [{ kind: 'model', text: 'sequência esquemática' }],
        labels: [
            lab('cut', 'Cilindro cortante', 'fecha a janela e corta', C.co2, onNeedle(TIP_IN, WIN_C, -0.1, NEEDLE.cutterR), -40, 110),
            lab('knob2', 'Êmbolo', 'empurrado para a frente', C.caveat, onNeedle(TIP_IN, KNOB_CLOSED, NEEDLE.knob.r), -10, -90),
        ],
    },
    {
        badge: 'A SAÍDA', short: 'Saída', title: 'Músculo humano na mão',
        text: 'A agulha sai com o fragmento. Antes dela, só trocas gasosas e glicemia; agora havia amostra do músculo para medir antes e depois do exercício.',
        sources: [STOUT, B1967], anim: 3.4, pose: OUT,
        chips: [{ kind: 'model', text: 'tamanho fora de escala' }],
        labels: [
            lab('frag', 'Fragmento', 'um pedaço do vasto lateral', TISSUE.vlLabel, [FRAG_OUT[0], FRAG_OUT[1], FRAG_OUT[2]], -60, -90, 3.2),
            lab('needle', 'Agulha', 'já fora da coxa', C.stone, onNeedle(TIP_PULLED, 4.6, -NEEDLE.r), 30, 80, 1.6),
        ],
    },
    {
        badge: 'AMPLIADO', short: 'Glicogênio', title: 'Dentro das fibras, os grânulos',
        text: 'Ampliado, o fragmento é um feixe de fibras com grânulos de glicogênio. A dosagem de Hultman quebra esse glicogênio até glicose e mede: g/100 g de músculo úmido.',
        sources: [STOUT, B1967], anim: 1.6, pose: ZOOM,
        chips: [{ kind: 'model', text: 'grânulos ampliados, fora de escala' }],
        labels: [
            lab('frag2', 'Fragmento', undefined, TISSUE.vlLabel, [FRAG_OUT[0] - 0.5, FRAG_OUT[1], FRAG_OUT[2]], -70, -20, 1.2),
            lab('fibers', 'Fibras musculares', 'o fragmento ampliado', '#E8B4AE', [BUNDLE.c[0] + 2.2, BUNDLE.c[1] - 2.4, BUNDLE.c[2]], 60, 70, 1.2),
            lab('gran', 'Grânulos de glicogênio', 'os da “Árvore de Glicose”', C.glycogenSoft, [BUNDLE.c[0] - 0.6, BUNDLE.c[1] + 1.2, BUNDLE.c[2] + BUNDLE.len / 2], 150, -40, 1.3),
        ],
    },
];

export type BiopsyKey = 'show' | 'push' | 'seal' | 'open' | 'cut' | 'reopen' | 'tissue' | 'pull' | 'lift' | 'zoom';

const REST: Record<BiopsyKey, number> = { show: 0, push: 0, seal: 0, open: 0, cut: 0, reopen: 0, tissue: 0, pull: 0, lift: 0, zoom: 0 };
const INSIDE = { ...REST, show: 1, push: 1, seal: 1, open: 1, tissue: 1 };
const CUT = { ...INSIDE, cut: 1 };
const OUTSIDE = { ...CUT, pull: 1, reopen: 1, lift: 1 };

/**
 * Parâmetros por etapa. Cilindro fechado = seal − open + cut − reopen (0 = janela aberta, 1 = fechada):
 * entra fechado, abre no músculo, corta, e reabre fora só para mostrar o fragmento.
 */
export const BIOPSY_TARGETS: readonly StepTarget<BiopsyKey>[] = [
    { to: REST },
    { to: { ...REST, show: 1 }, win: { show: [0, 0.2] } },
    { to: INSIDE, win: { show: [0, 0.1], seal: [0, 0.5], push: [0.6, 2.7], open: [2.9, 3.4], tissue: [3.3, 4.2] } },
    { to: CUT, win: { cut: [0.2, 1.1] } },
    { to: OUTSIDE, win: { pull: [0, 1.8], reopen: [2.0, 2.4], lift: [2.4, 3.4] } },
    { to: { ...OUTSIDE, zoom: 1 }, win: { zoom: [0.1, 1.4] } },
];

/** O feixe ampliado e o número da dosagem só aparecem na última etapa. */
export const LAST_STEP = BIOPSY_STEPS.length - 1;
