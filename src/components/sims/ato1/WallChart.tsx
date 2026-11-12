import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { toPath, type Pt } from '../kit/useMorphPath';
import { PACE_S, RUNNER_KM } from './wall.content';

/**
 * Curva de ritmo da Marina (ilustrativa) com a corredora andando sobre ela.
 * viewBox = tamanho da caixa (1:1): fonte 16 do SVG = 16 px de projeto.
 */
export const CHART_W = 648;
export const CHART_H = 274;
const PAD = { left: 62, right: 22, top: 44, bottom: 40 };
const PACE_MIN = 270; // 4:30/km no topo
const PACE_MAX = 450; // 7:30/km embaixo (mais lento = mais baixo: a queda se vê como queda)

const x = (km: number): number => PAD.left + (km / 42) * (CHART_W - PAD.left - PAD.right);
const y = (s: number): number => PAD.top + ((s - PACE_MIN) / (PACE_MAX - PACE_MIN)) * (CHART_H - PAD.top - PAD.bottom);
const mmss = (s: number): string => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const pts = (from: number, to: number): Pt[] => PACE_S.slice(from, to + 1).map((s, i): Pt => [x(from + i), y(s)]);
const STEADY_PTS = pts(0, 30);
const DROP_PTS = pts(30, 42);
const STEADY = toPath(STEADY_PTS);
const DROP = toPath(DROP_PTS);
const Y_TICKS = [300, 360, 420] as const;
const X_TICKS = [0, 10, 20, 30, 42] as const;
const DRAW_S = 1.0;

/** Tempos dos quadros-chave proporcionais ao comprimento do traço: a corredora anda junto com a linha que se desenha. */
const timesAlong = (p: readonly Pt[]): number[] => {
    const acc = p.reduce<number[]>((out, pt, i) => {
        if (i === 0) return [0];
        const [px, py] = p[i - 1];
        return [...out, out[i - 1] + Math.hypot(pt[0] - px, pt[1] - py)];
    }, []);
    const total = acc[acc.length - 1] || 1;
    return acc.map(a => a / total);
};
const DROP_TIMES = timesAlong(DROP_PTS);

/** Posição (x, y) da corredora em cada passo, com o caminho que ela percorre até lá. */
const runnerMotion = (step: number, reduce: boolean) => {
    const km = RUNNER_KM[step];
    if (km === 42 && RUNNER_KM[Math.max(0, step - 1)] === 30 && !reduce) {
        return {
            animate: { x: DROP_PTS.map(p => p[0]), y: DROP_PTS.map(p => p[1]) },
            transition: { duration: DRAW_S, ease: 'linear' as const, times: DROP_TIMES },
        };
    }
    return {
        animate: { x: x(km), y: y(PACE_S[km]) },
        transition: { duration: reduce ? 0 : DRAW_S, ease: EASE_IN_OUT },
    };
};

export const WallChart = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const ran = step >= 1;
    const fell = step >= 2;
    const smyth = step >= 4;
    const draw = (on: boolean, ease: 'linear' | typeof EASE_IN_OUT) => ({
        // a ponta arredondada de um traço de comprimento zero ainda aparece como um ponto: some junto
        initial: { pathLength: reduce && on ? 1 : 0, opacity: reduce && on ? 1 : 0 },
        animate: { pathLength: on ? 1 : 0, opacity: on ? 1 : 0 },
        transition: {
            pathLength: { duration: reduce ? 0 : DRAW_S, ease },
            opacity: { duration: 0.01, delay: on ? 0 : DRAW_S },
        },
    });
    const run = runnerMotion(step, reduce);
    const km = RUNNER_KM[step];
    return (
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width={CHART_W} height={CHART_H} role="img"
            aria-label="Ritmo da Marina por quilômetro (ilustrativo): 5:00 por km até o km 30, cai para cerca de 6:50 no km 32">
            <SvgText x={PAD.left - 46} y={22} text="ritmo (min/km) · mais baixo = mais lento" color={C.caveat} />
            <SvgText x={CHART_W - PAD.right} y={22} anchor="end" weight={700} size={20}
                color={fell ? C.risk : C.text} text={`km ${km} · ${mmss(PACE_S[km])}/km`} />

            {Y_TICKS.map(s => (
                <g key={s}>
                    <line x1={PAD.left} x2={CHART_W - PAD.right} y1={y(s)} y2={y(s)} stroke="rgba(255,255,255,0.16)" strokeWidth={2} />
                    <SvgText x={PAD.left - 12} y={y(s) + 6} text={mmss(s)} anchor="end" color={C.muted} />
                </g>
            ))}
            {X_TICKS.map(k => (
                <SvgText key={k} x={x(k)} y={CHART_H - 12} text={k === 0 ? 'km 0' : String(k)} anchor="middle" color={C.muted} />
            ))}

            {/* o muro: faixa chapada no km 32, aparece com a queda */}
            <motion.g initial={false} animate={{ opacity: fell ? 1 : 0 }}
                transition={{ duration: DUR.enter, ease: EASE_OUT, delay: fell ? 0.45 : 0 }}>
                <rect x={x(31.4)} y={PAD.top} width={x(33) - x(31.4)} height={CHART_H - PAD.top - PAD.bottom} fill={C.risk} opacity={0.24} />
                <SvgText x={x(32.2)} y={PAD.top + 22} text="o muro" anchor="middle" color={C.risk} size={18} weight={700} />
                <SvgText x={x(35.5)} y={y(408) + 30} text="~6:50/km" anchor="middle" color={C.risk} size={18} weight={700} />
            </motion.g>

            {/* Smyth: quem bate perde ~40% do ritmo por ~10 km */}
            <motion.g initial={false} animate={{ opacity: smyth ? 1 : 0 }}
                transition={{ duration: DUR.enter, ease: EASE_OUT, delay: smyth ? 0.2 : 0 }}>
                <path d={`M${x(32)} ${y(345) + 10} V${y(345)} H${x(42)} V${y(345) + 10}`} fill="none" stroke={C.glucoseSoft} strokeWidth={3} />
                <SvgText x={x(37)} y={y(345) - 10} text="~10 km mais lenta" anchor="middle" color={C.glucoseSoft} />
            </motion.g>

            <motion.path d={STEADY} fill="none" stroke={C.text} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" {...draw(ran, EASE_IN_OUT)} />
            <motion.path d={DROP} fill="none" stroke={C.risk} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" {...draw(fell, 'linear')} />

            {/* a corredora: anda sobre a curva a cada passo */}
            <motion.g initial={{ x: x(0), y: y(PACE_S[0]) }} {...run}>
                <circle r={11} fill={fell ? C.risk : C.text} stroke="#04080F" strokeWidth={3} />
                <SvgText x={km >= 40 ? 10 : 0} y={km >= 40 ? -22 : -20} text="Marina" anchor={km >= 40 ? 'end' : 'middle'} color={fell ? C.risk : C.text} weight={700} />
            </motion.g>
        </svg>
    );
};
