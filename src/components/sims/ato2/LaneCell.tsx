import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { SugarShape, type SugarKind } from './shapes';

/**
 * Slide 26 · o enterócito de pé (viewBox 290 × 432): luz em cima, SGLT1 e GLUT5 na membrana apical,
 * GLUT2 na basolateral, veia porta embaixo. As moléculas FLUEM em laço (o fluxo é o conteúdo): uma pista
 * de glicose; a segunda pista, de frutose, abre com o GLUT5. ≤ 6 formas em movimento, ciclo de 2,8 s
 * com pausa; com movimento reduzido, fica a pose parada. A fila diante do SGLT1 cresce quando a dose passa do teto.
 */
export const CELL_W = 290;
export const CELL_H = 424;

const APICAL = 124, BASAL = 316;
const SGLT = 78, GLUT5 = 214, GLUT2 = 146;
const CYCLE = 2.8;

type Pt = readonly [number, number];

const GLC_PATH: readonly Pt[] = [[SGLT, 96], [SGLT, APICAL], [GLUT2 - 8, BASAL], [GLUT2 - 8, 386]];
const FRU_PATH: readonly Pt[] = [[GLUT5, 96], [GLUT5, APICAL], [GLUT2 + 8, BASAL], [GLUT2 + 8, 386]];

const Flow = ({ kind, path, delay, reduce }: { kind: SugarKind; path: readonly Pt[]; delay: number; reduce: boolean }) => {
    const pose = path[2];
    if (reduce) {
        return <g transform={`translate(${pose[0]} ${pose[1] - 60 + delay * 30}) scale(0.48)`}><SugarShape kind={kind} /></g>;
    }
    return (
        <motion.g initial={{ x: path[0][0], y: path[0][1], opacity: 0 }}
            animate={{ x: path.map(p => p[0]), y: path.map(p => p[1]), opacity: [0, 1, 1, 0] }}
            transition={{ duration: CYCLE, delay, repeat: Infinity, repeatDelay: 0.6, ease: 'linear', times: [0, 0.18, 0.78, 1] }}>
            <g transform="scale(0.48)"><SugarShape kind={kind} /></g>
        </motion.g>
    );
};

const Carrier = ({ x, y, color, on = true }: { x: number; y: number; color: string; on?: boolean }) => (
    <motion.rect x={x - 18} y={y - 20} width={36} height={40} rx={8} fill={color} stroke="#04080F" strokeWidth={2}
        initial={false} animate={{ opacity: on ? 1 : 0.25 }} transition={{ duration: DUR.enter }} />
);

/** Fila parada na luz, diante do SGLT1 (4 por linha, empilhando para cima). */
const queue = (n: number): Pt[] => Array.from({ length: n }, (_, i) => [SGLT - 45 + (i % 4) * 30, 96 - Math.floor(i / 4) * 30]);

interface LaneCellProps { queueSize: number; fructose: boolean; apicalGlut2: boolean }

export const LaneCell = ({ queueSize, fructose, apicalGlut2 }: LaneCellProps) => {
    const reduce = useReducedMotion() ?? false;
    const caption = fructose ? 'duas pistas, uma saída' : queueSize > 4 ? 'a fila cresce na porta' : 'uma pista só';
    return (
        <svg viewBox={`0 0 ${CELL_W} ${CELL_H}`} width={CELL_W} height={CELL_H} className="block" role="img"
            aria-label="Enterócito: glicose entra pelo SGLT1, frutose pelo GLUT5, as duas saem pelo GLUT2">
            <SvgText x={10} y={24} text="LUZ DO INTESTINO" size={16} color={C.muted} weight={700} />
            <rect x={6} y={APICAL} width={278} height={BASAL - APICAL} rx={8} fill={`${C.co2}1F`} />
            <rect x={6} y={APICAL - 4} width={278} height={8} rx={4} fill={C.co2} />
            <rect x={6} y={BASAL - 4} width={278} height={8} rx={4} fill={C.co2} />
            <SvgText x={14} y={BASAL - 14} text="enterócito" size={16} color={C.caveat} />
            <SvgText x={10} y={414} text="veia porta → fígado" size={16} color={C.caveat} />
            {!apicalGlut2 && (
                <motion.g key={caption} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter, delay: 0.4 }}>
                    <SvgText x={GLUT2} y={52} text={caption} size={16} color={C.caveat} anchor="middle" />
                </motion.g>
            )}

            {/* as duas pistas dentro da célula */}
            <path d={`M ${SGLT} ${APICAL + 20} L ${GLUT2 - 8} ${BASAL - 20}`} stroke={C.glucose} strokeOpacity={0.35} strokeWidth={14} strokeLinecap="round" />
            <motion.path d={`M ${GLUT5} ${APICAL + 20} L ${GLUT2 + 8} ${BASAL - 20}`} stroke={C.fructose} strokeOpacity={0.35} strokeWidth={14} strokeLinecap="round"
                initial={false} animate={{ opacity: fructose ? 1 : 0 }} transition={{ duration: DUR.enter, delay: fructose ? 0.3 : 0 }} />

            {queue(queueSize).map(([x, y], i) => (
                <motion.g key={i} initial={{ x, y: y - 24, opacity: 0 }} animate={{ x, y, opacity: 1 }}
                    transition={{ duration: DUR.enter, delay: reduce ? 0 : 0.1 + Math.min(i * 0.06, 0.4), ease: EASE_OUT }}>
                    <g transform="scale(0.5)"><SugarShape kind="glc" /></g>
                </motion.g>
            ))}
            {fructose && [GLUT5 - 30, GLUT5 + 30].map((x, i) => (
                <motion.g key={x} initial={{ x, y: 72, opacity: 0 }} animate={{ x, y: 96, opacity: 1 }}
                    transition={{ duration: DUR.enter, delay: reduce ? 0 : 0.2 + i * 0.08, ease: EASE_OUT }}>
                    <g transform="scale(0.5)"><SugarShape kind="fru" /></g>
                </motion.g>
            ))}

            {[0, 0.93, 1.86].map(d => <Flow key={`g${d}`} kind="glc" path={GLC_PATH} delay={d} reduce={reduce} />)}
            {fructose && [0.45, 1.38, 2.31].map(d => <Flow key={`f${d}`} kind="fru" path={FRU_PATH} delay={d} reduce={reduce} />)}

            <Carrier x={SGLT} y={APICAL} color={C.glucose} />
            <SvgText x={SGLT - 20} y={APICAL + 46} text="SGLT1" size={18} color={C.glucoseSoft} weight={800} anchor="middle" />
            <Carrier x={GLUT5} y={APICAL} color={C.fructose} on={fructose} />
            <motion.g initial={false} animate={{ opacity: fructose ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                <SvgText x={GLUT5 + 18} y={APICAL + 46} text="GLUT5" size={18} color={C.fructoseSoft} weight={800} anchor="middle" />
            </motion.g>
            <Carrier x={GLUT2} y={BASAL} color={C.stone} />
            <SvgText x={GLUT2 + 26} y={BASAL + 32} text="GLUT2" size={18} color={C.stone} weight={800} />

            <motion.g initial={false} animate={{ opacity: apicalGlut2 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: apicalGlut2 ? 0.3 : 0 }}>
                <rect x={GLUT2 - 18} y={APICAL - 20} width={36} height={40} rx={8} fill="none" stroke={C.stone} strokeWidth={3} strokeDasharray="6 5" />
                <line x1={GLUT2 - 22} y1={APICAL - 24} x2={GLUT2 + 22} y2={APICAL + 24} stroke={C.risk} strokeWidth={6} strokeLinecap="round" />
                <line x1={GLUT2 + 22} y1={APICAL - 24} x2={GLUT2 - 22} y2={APICAL + 24} stroke={C.risk} strokeWidth={6} strokeLinecap="round" />
                <SvgText x={GLUT2} y={52} text="GLUT2 apical?" size={16} color={C.risk} weight={700} anchor="middle" />
            </motion.g>
        </svg>
    );
};
