import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { GLYC_POINTS, GLYC_TICKS, LIVER_STEPS, SIGNALS } from './liver.content';

/**
 * Slide 47 · o palco: fígado (torneira) → sangue (copo de ~4 g) → músculo (ralo), viewBox 620 × 420.
 * Torneira e ralo na MESMA escala (1× = 8 px de jato): 7–8× contra 3–4× aparece como o dobro da largura.
 * Loop permitido (fluxo que é o conteúdo): gotas de glicose caindo e saindo, ≤ 8, ciclo de 2,6 s; parado com movimento reduzido.
 * À direita, a glicemia ilustrativa ganha um ponto por passo (o histórico fica). À esquerda, os sinais hormonais acumulam.
 */

const W = 620;
const H = 420;
const PX = 8;
const TAP_X = 330;
const SPOUT = 112;
const CUP = { x: 262, y: 196, w: 136, h: 140 };
const DRAIN = { x: CUP.x + CUP.w, cy: CUP.y + CUP.h - 22, len: 104, max: 3.5 };
const MUSCLE = { x: 502, y: CUP.y + CUP.h - 52, w: 112, h: 60 };
const CYCLE = 2.6;
const DROP = 12;

const SIGNAL_COLOR = { insulin: C.insulinSoft, stone: C.stone } as const;

const LIVER_D = 'M 22 74 C 22 42 66 26 140 28 L 252 32 C 286 34 292 60 266 82 C 222 122 154 152 82 152 C 40 152 22 112 22 74 Z';

/** Gotas em laço: da boca da torneira até o copo, e do ralo até o músculo. */
const Drops = ({ n, from, to, phase }: { n: number; from: readonly [number, number]; to: readonly [number, number]; phase: number }) => (
    <g>
        {Array.from({ length: n }, (_, i) => (
            <motion.g key={i} initial={{ x: from[0], y: from[1], opacity: 0 }}
                animate={{ x: [from[0], to[0]], y: [from[1], to[1]], opacity: [0, 1, 1, 0] }}
                transition={{ duration: CYCLE, ease: 'linear', repeat: Infinity, repeatDelay: 0.3, delay: phase + (i * CYCLE) / n,
                    opacity: { duration: CYCLE, times: [0, 0.12, 0.85, 1], repeat: Infinity, repeatDelay: 0.3, delay: phase + (i * CYCLE) / n } }}>
                <rect x={-DROP / 2} y={-DROP / 2} width={DROP} height={DROP} rx={3} fill={C.glucoseSoft} stroke="#04080F" strokeWidth={2} />
            </motion.g>
        ))}
    </g>
);

const GlycChart = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const x0 = 462;
    const dx = 42;
    const top = 44;
    const h = 104;
    const pts = GLYC_POINTS.slice(0, step + 1).map((v, i) => [x0 + 12 + i * dx, top + v * h] as const);
    const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
    return (
        <g>
            <SvgText x={x0} y={24} text="glicemia (ilustrativa)" size={16} color={C.muted} weight={700} />
            <path d={`M ${x0} ${top} L ${x0} ${top + h} L ${x0 + 166} ${top + h}`} stroke={C.co2} strokeWidth={2.5} fill="none" />
            <path d={`M ${x0} ${top + 0.62 * h} L ${x0 + 152} ${top + 0.62 * h}`} stroke={C.co2} strokeWidth={2} strokeDasharray="5 5" fill="none" />
            <motion.path key={`l${step}`} d={d} stroke={C.glucose} strokeWidth={4} fill="none" strokeLinejoin="round"
                initial={reduce || step === 0 ? false : { pathLength: (step) / (step + 1) }} animate={{ pathLength: 1 }}
                transition={{ duration: DUR.bar, delay: 0.3, ease: EASE_OUT }} />
            {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={7} fill={i === 2 ? C.glucose : '#04080F'} stroke={C.glucose} strokeWidth={3} />)}
            {GLYC_TICKS.map((t, i) => (
                <SvgText key={t} x={x0 + 12 + i * dx} y={top + h + 22} text={t} size={16} anchor="middle" color={i <= step ? '#E5E7EB' : C.co2} weight={600} />
            ))}
        </g>
    );
};

export const LiverTap = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const s = LIVER_STEPS[step];
    const t = { duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT };
    const surface = CUP.y + CUP.h * (1 - s.level);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img"
            aria-label="Fígado como torneira, sangue como copo de 4 gramas, músculo como ralo; a largura do jato é a taxa">
            {/* fígado + cano */}
            <path d={LIVER_D} fill={`${C.glycogen}2E`} stroke={C.glycogen} strokeWidth={3} />
            <SvgText x={144} y={72} text="fígado" size={22} anchor="middle" color="#FFFFFF" weight={800} />
            <SvgText x={144} y={98} text="glicogenólise +" size={16} anchor="middle" color={C.glycogenSoft} weight={600} />
            <SvgText x={144} y={118} text="gliconeogênese" size={16} anchor="middle" color={C.glycogenSoft} weight={600} />
            <rect x={262} y={60} width={TAP_X - 262 + 12} height={20} fill="#64748B" />
            <rect x={TAP_X - 12} y={60} width={24} height={SPOUT - 60} rx={4} fill="#64748B" />

            {/* jato da torneira: largura = taxa × 8 px */}
            <motion.rect x={TAP_X - (7.5 * PX) / 2} y={SPOUT} width={7.5 * PX} height={CUP.y + CUP.h - SPOUT - 6} fill={C.glucose}
                style={{ originX: 0.5, originY: 0.5 }}
                initial={false} animate={{ scaleX: s.tap / 7.5 }} transition={t} />
            <motion.g key={`tap-${step}`} initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, delay: 0.4, ease: EASE_OUT }}>
                <SvgText x={TAP_X + 40} y={150} text={s.tapLabel} size={30} color={C.glucoseSoft} weight={800} />
            </motion.g>

            {/* copo = sangue */}
            <motion.rect x={CUP.x + 2} y={CUP.y} width={CUP.w - 4} height={CUP.h - 2} fill={C.glucose}
                style={{ originX: 0.5, originY: 1 }}
                initial={false} animate={{ scaleY: s.level }} transition={t} />
            <path d={`M ${CUP.x} ${CUP.y - 8} L ${CUP.x} ${CUP.y + CUP.h} L ${CUP.x + CUP.w} ${CUP.y + CUP.h} L ${CUP.x + CUP.w} ${CUP.y - 8}`}
                stroke="#E5E7EB" strokeWidth={4} fill="none" strokeLinejoin="round" />
            <path d={`M ${CUP.x + CUP.w - 10} ${CUP.y + CUP.h * 0.5} L ${CUP.x + CUP.w + 10} ${CUP.y + CUP.h * 0.5}`} stroke="#E5E7EB" strokeWidth={3} />
            <SvgText x={CUP.x + CUP.w + 14} y={CUP.y + CUP.h * 0.5 + 6} text="normal" size={16} color="#E5E7EB" weight={600} />
            <SvgText x={CUP.x + CUP.w / 2} y={CUP.y + CUP.h + 30} text="sangue · ~4 g" size={20} anchor="middle" color="#FFFFFF" weight={800} />
            <SvgText x={CUP.x + CUP.w / 2} y={CUP.y + CUP.h + 52} text="≈ 1 colher de chá" size={16} anchor="middle" color={C.muted} weight={600} />

            {/* ralo → músculo, na mesma escala do jato (saída lateral do copo) */}
            <motion.rect x={DRAIN.x} y={DRAIN.cy - (DRAIN.max * PX) / 2} width={DRAIN.len} height={DRAIN.max * PX} fill={C.glucose}
                style={{ originX: 0, originY: 0.5 }}
                initial={false} animate={{ scaleY: s.drain / DRAIN.max }} transition={t} />
            <motion.g key={`drain-${step}`} initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, delay: 0.5, ease: EASE_OUT }}>
                <SvgText x={DRAIN.x + 12} y={DRAIN.cy + 54} text={s.drainLabel} size={24} color={C.glucoseSoft} weight={800} />
            </motion.g>
            <rect x={MUSCLE.x} y={MUSCLE.y} width={MUSCLE.w} height={MUSCLE.h} rx={22} fill="#1E293B" stroke={C.stone} strokeWidth={3} />
            {[12, MUSCLE.h - 12].map(dy => <path key={dy} d={`M ${MUSCLE.x + 18} ${MUSCLE.y + dy} L ${MUSCLE.x + MUSCLE.w - 18} ${MUSCLE.y + dy}`} stroke={C.co2} strokeWidth={3} />)}
            <SvgText x={MUSCLE.x + MUSCLE.w / 2} y={MUSCLE.y + MUSCLE.h / 2 + 7} text="músculo" size={20} anchor="middle" color="#FFFFFF" weight={800} />

            {/* sinais hormonais: entram e ficam */}
            {SIGNALS.map((g, i) => (
                <motion.g key={g.text} initial={false} animate={{ opacity: step >= g.at ? 1 : 0, x: step >= g.at ? 0 : -10 }}
                    transition={{ duration: DUR.enter, delay: step === g.at ? 0.2 : 0, ease: EASE_OUT }}>
                    <rect x={14} y={178 + i * 74} width={222} height={62} rx={12} fill="#04080F" stroke={SIGNAL_COLOR[g.color]} strokeWidth={2.5} />
                    <SvgText x={28} y={204 + i * 74} text={g.text} size={18} color={SIGNAL_COLOR[g.color]} weight={800} />
                    <SvgText x={28} y={226 + i * 74} text={g.sub} size={16} color="#D1D5DB" weight={600} />
                </motion.g>
            ))}

            <GlycChart step={step} reduce={reduce} />
            <motion.g initial={false} animate={{ opacity: s.level > 0.7 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: 0.6 }}>
                <SvgText x={CUP.x + CUP.w + 12} y={surface + 6} text="sobe" size={18} color={C.glucoseSoft} weight={800} />
            </motion.g>

            {!reduce && (
                <g key={`drops-${step}`}>
                    <Drops n={s.drops[0]} from={[TAP_X, SPOUT + 8]} to={[TAP_X, surface + 10]} phase={0.2} />
                    <Drops n={s.drops[1]} from={[DRAIN.x + 8, DRAIN.cy]} to={[DRAIN.x + DRAIN.len - 8, DRAIN.cy]} phase={0.6} />
                </g>
            )}
        </svg>
    );
};
