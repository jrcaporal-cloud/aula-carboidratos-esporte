import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * O enterócito em corte, com as pistas de entrada (slides 103 e 104). Luz do intestino à esquerda, membrana
 * apical com SGLT1 (glicose, depende do Na⁺) e GLUT5 (frutose), membrana basolateral com GLUT2, sangue portal à direita.
 * O fluxo é o conteúdo: moléculas grandes e chapadas atravessam em laço lento (≤ 8 em movimento, ciclo 2,8 s + pausa).
 * Com movimento reduzido, ficam paradas no meio do caminho. Coordenadas locais: 640 × 176.
 */

export const GUT_W = 640;
export const GUT_H = 176;

const APICAL = 196;
const BASAL = 440;
const LANE_G = 58;
const LANE_F = 128;
const EXIT_Y = 93;

const HEX = 'M 0 -11 L 9.5 -5.5 L 9.5 5.5 L 0 11 L -9.5 5.5 L -9.5 -5.5 Z';
const PENTA = 'M 0 -11 L 10.5 -3.4 L 6.5 9 L -6.5 9 L -10.5 -3.4 Z';

type Pt = readonly [number, number];
const PATH_G: readonly Pt[] = [[60, LANE_G], [APICAL, LANE_G], [318, LANE_G + 6], [BASAL, EXIT_Y], [600, EXIT_Y]];
const PATH_F: readonly Pt[] = [[60, LANE_F], [APICAL, LANE_F], [318, LANE_F - 6], [BASAL, EXIT_Y], [600, EXIT_Y]];

/** Fila parada na luz: a glicose que chega mais rápido do que o SGLT1 consegue levar. */
const QUEUE: readonly Pt[] = [[104, LANE_G - 14], [128, LANE_G - 14], [152, LANE_G - 14], [92, LANE_G + 12], [116, LANE_G + 12], [140, LANE_G + 12], [164, LANE_G + 12]];

const CYCLE = 2.8;
const PAUSE = 0.6;
const PER_LANE = 4;

const Token = ({ d, color, pts, i }: { d: string; color: string; pts: readonly Pt[]; i: number }) => (
    <motion.path d={d} fill={color} stroke="#04080F" strokeWidth={2}
        initial={{ x: pts[0][0], y: pts[0][1], opacity: 0 }}
        animate={{ x: pts.map(p => p[0]), y: pts.map(p => p[1]), opacity: [0, 1, 1, 1, 0] }}
        transition={{ duration: CYCLE, delay: i * ((CYCLE + PAUSE) / PER_LANE), repeat: Infinity, repeatDelay: PAUSE, ease: 'linear', times: [0, 0.3, 0.55, 0.78, 1] }} />
);

/** Pose parada (movimento reduzido): uma molécula em cada trecho. */
const Still = ({ d, color, pts }: { d: string; color: string; pts: readonly Pt[] }) => (
    <g>{pts.slice(0, 4).map(([x, y]) => <path key={`${x}-${y}`} d={d} fill={color} stroke="#04080F" strokeWidth={2} transform={`translate(${x} ${y})`} />)}</g>
);

const Flow = ({ d, color, pts, reduce }: { d: string; color: string; pts: readonly Pt[]; reduce: boolean }) =>
    reduce ? <Still d={d} color={color} pts={pts} />
        : <g>{Array.from({ length: PER_LANE }, (_, i) => <Token key={i} d={d} color={color} pts={pts} i={i} />)}</g>;

interface DoorProps {
    y: number;
    x: number;
    color: string;
    label: string;
    open: boolean;
    strong?: boolean;
    /** Lado do rótulo: dentro da célula (à direita da apical) ou no sangue (à direita da basolateral). */
    labelDx?: number;
}

/** Transportador na membrana: canal chapado; fechado = tracejado cinza. */
const Door = ({ x, y, color, label, open, strong = false, labelDx = 22 }: DoorProps) => (
    <g>
        <rect x={x - 15} y={y - 20} width={30} height={40} rx={8} fill={open ? `${color}40` : 'transparent'}
            stroke={open ? color : '#64748B'} strokeWidth={strong ? 5 : 3} strokeDasharray={open ? undefined : '6 5'} />
        <SvgText x={x + labelDx} y={y - 22} text={label} size={16} color={open ? color : '#94A3B8'} weight={800} />
    </g>
);

export interface GutProps {
    /** A pista da frutose (GLUT5) está aberta e com fluxo. */
    fructose: boolean;
    /** Fila de glicose parada na luz (SGLT1 saturado). */
    queue: boolean;
    /** Realça o SGLT1 (o gargalo). */
    stressSglt1?: boolean;
    /** Texto ao lado da fila. */
    queueLabel?: string;
}

export const Gut = ({ fructose, queue, stressSglt1 = false, queueLabel = 'fila: SGLT1 saturado' }: GutProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <g>
            {/* compartimentos */}
            <rect x={APICAL} y={18} width={BASAL - APICAL} height={GUT_H - 26} rx={14} fill={`${C.co2}1F`} />
            <line x1={APICAL} x2={APICAL} y1={18} y2={GUT_H - 8} stroke={C.co2} strokeWidth={4} />
            <line x1={BASAL} x2={BASAL} y1={18} y2={GUT_H - 8} stroke={C.co2} strokeWidth={4} />
            <SvgText x={8} y={GUT_H - 6} text="luz do intestino" size={16} color={C.muted} weight={700} />
            <SvgText x={(APICAL + BASAL) / 2} y={GUT_H - 16} text="enterócito" size={16} anchor="middle" color={C.muted} weight={700} />
            <SvgText x={GUT_W - 4} y={GUT_H - 6} text="sangue portal → fígado" size={16} anchor="end" color={C.muted} weight={700} />

            {/* fila na luz */}
            <motion.g initial={false} animate={{ opacity: queue ? 1 : 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                {QUEUE.map(([x, y]) => <path key={`${x}-${y}`} d={HEX} fill={`${C.glucose}99`} stroke={C.glucose} strokeWidth={2} transform={`translate(${x} ${y})`} />)}
                <SvgText x={8} y={18} text={queueLabel} size={16} color={C.glucoseSoft} weight={700} />
            </motion.g>

            <Door x={APICAL} y={LANE_G} color={C.glucose} label="SGLT1 · Na⁺" open strong={stressSglt1} />
            <Door x={APICAL} y={LANE_F} color={C.fructose} label={fructose ? 'GLUT5' : 'GLUT5 · sem frutose'} open={fructose} />
            <Door x={BASAL} y={EXIT_Y} color={C.stone} label="GLUT2" open />

            <Flow d={HEX} color={C.glucose} pts={PATH_G} reduce={reduce} />
            {fructose && <Flow d={PENTA} color={C.fructose} pts={PATH_F} reduce={reduce} />}
        </g>
    );
};
