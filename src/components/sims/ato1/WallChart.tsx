import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { toPath, type Pt } from '../kit/useMorphPath';
import { PACE_S } from './wall.content';

/** Curva de ritmo da Marina (ilustrativa). viewBox = tamanho da caixa (1:1): fonte 16 do SVG = 16 px de projeto. */
export const CHART_W = 700;
export const CHART_H = 360;
const PAD = { left: 76, right: 24, top: 28, bottom: 52 };
const PACE_MIN = 270; // 4:30/km no topo
const PACE_MAX = 450; // 7:30/km embaixo (mais lento = mais baixo: a queda se vê como queda)

const x = (km: number): number => PAD.left + (km / 42) * (CHART_W - PAD.left - PAD.right);
const y = (s: number): number => PAD.top + ((s - PACE_MIN) / (PACE_MAX - PACE_MIN)) * (CHART_H - PAD.top - PAD.bottom);
const mmss = (s: number): string => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const pts = (from: number, to: number): Pt[] => PACE_S.slice(from, to + 1).map((s, i): Pt => [x(from + i), y(s)]);
const STEADY = toPath(pts(0, 30));
const DROP = toPath(pts(30, 42));
const Y_TICKS = [300, 360, 420] as const;
const X_TICKS = [0, 10, 20, 30, 42] as const;

interface WallChartProps {
    /** 0 = só os eixos; 1 = km 0–30 desenhado; 2 = queda no 32 desenhada. */
    stage: number;
}

export const WallChart = ({ stage }: WallChartProps) => {
    const reduce = useReducedMotion();
    const draw = (on: boolean, delay = 0) => ({
        // a ponta arredondada de um traço de comprimento zero ainda aparece como um ponto: some junto
        initial: { pathLength: reduce && on ? 1 : 0, opacity: reduce && on ? 1 : 0 },
        animate: { pathLength: on ? 1 : 0, opacity: on ? 1 : 0 },
        transition: {
            pathLength: { duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT, delay: on ? delay : 0 },
            opacity: { duration: 0.01, delay: on ? delay : DUR.draw },
        },
    });
    return (
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width={CHART_W} height={CHART_H} role="img"
            aria-label="Ritmo da Marina por quilômetro: estável até o km 30, cai no km 32">
            {Y_TICKS.map(s => (
                <g key={s}>
                    <line x1={PAD.left} x2={CHART_W - PAD.right} y1={y(s)} y2={y(s)} stroke="rgba(255,255,255,0.14)" strokeWidth={2} />
                    <SvgText x={PAD.left - 20} y={y(s) + 6} text={mmss(s)} anchor="end" color={C.muted} />
                </g>
            ))}
            {X_TICKS.map(km => (
                <SvgText key={km} x={x(km)} y={CHART_H - 20} text={km === 0 ? 'km 0' : String(km)} anchor="middle" color={C.muted} />
            ))}
            <SvgText x={PAD.left} y={18} text="ritmo (min/km) · mais baixo = mais lento" color={C.caveat} />

            {/* o muro: faixa chapada no km 32, aparece com a queda */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: stage >= 2 ? 1 : 0 }}
                transition={{ duration: DUR.enter, ease: EASE_OUT, delay: stage >= 2 ? 0.55 : 0 }}>
                <rect x={x(31.6)} y={PAD.top} width={x(33) - x(31.6)} height={CHART_H - PAD.top - PAD.bottom} fill={C.risk} opacity={0.22} />
                <SvgText x={x(32.3)} y={PAD.top + 24} text="km 32" anchor="middle" color={C.risk} size={20} weight={700} />
            </motion.g>

            <motion.path d={STEADY} fill="none" stroke={C.text} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" {...draw(stage >= 1)} />
            <motion.path d={DROP} fill="none" stroke={C.risk} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" {...draw(stage >= 2)} />

            {/* a corredora na largada */}
            <circle cx={x(0)} cy={y(PACE_S[0])} r={9} fill={C.text} />
        </svg>
    );
};
