import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { MILESTONES } from './boston.content';

/**
 * Slide 48 · o palco: linha do tempo em ESCALA de anos (1915–1995, 7,2 px/ano; o vão de 48 anos entre 1939 e 1987 é real),
 * um objeto chapado por marco (chegada da maratona, cicloergômetro, bolsa de soro) e, embaixo, a escada da evidência:
 * observação → intervenção com n = 2 → ensaio cruzado com placebo. Cada marco entra no seu passo e fica. viewBox 620 × 420.
 */

const W = 620;
const H = 420;
const AXIS = 236;
const X0 = 24;
const Y0 = 1915;
const PPY = 7.2;
const xOf = (year: number): number => X0 + (year - Y0) * PPY;
const BASE = 404;
const STEP_H = 36;
const BAR_W = 72;
const EVIDENCE_FILL = ['#475569', '#94A3B8', '#E5E7EB'] as const;
const INK = '#E5E7EB';

const show = (on: boolean, now: boolean, delay = 0.2) => ({
    initial: false as const,
    animate: { opacity: on ? 1 : 0, y: on ? 0 : 8 },
    transition: { duration: DUR.enter, delay: on && now ? delay : 0, ease: EASE_OUT },
});

/** Chegada da maratona: faixa e corredor (o corredor entra correndo uma vez). */
const Finish = ({ x, now, reduce }: { x: number; now: boolean; reduce: boolean }) => (
    <g>
        <path d={`M ${x - 40} ${AXIS} L ${x - 40} 122 M ${x + 40} ${AXIS} L ${x + 40} 122`} stroke={INK} strokeWidth={4} />
        <rect x={x - 40} y={122} width={80} height={22} fill={C.risk} />
        <SvgText x={x} y={139} text="42 km" size={16} anchor="middle" color="#FFFFFF" weight={800} />
        <motion.g initial={reduce || !now ? false : { x: -70, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, ease: EASE_IN_OUT }}>
            <circle cx={x} cy={166} r={9} fill={INK} />
            <path d={`M ${x} 176 L ${x - 4} 204 M ${x - 2} 184 L ${x + 14} 192 M ${x - 2} 184 L ${x - 16} 194 M ${x - 4} 204 L ${x + 10} ${AXIS - 4} M ${x - 4} 204 L ${x - 18} ${AXIS - 6}`}
                stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none" />
        </motion.g>
    </g>
);

/** Cicloergômetro do laboratório de Krogh, com o saco de 200 g de glicose. */
const Ergometer = ({ x }: { x: number }) => (
    <g>
        <circle cx={x + 18} cy={206} r={22} fill="none" stroke={INK} strokeWidth={5} />
        <path d={`M ${x + 18} 206 L ${x - 16} 176 L ${x - 22} 160 M ${x - 32} 160 L ${x - 10} 160 M ${x - 16} 176 L ${x + 22} 160 L ${x + 28} 150 M ${x - 16} 176 L ${x - 20} ${AXIS}`}
            stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
        <rect x={x + 44} y={166} width={36} height={44} rx={8} fill={C.glucose} />
        <SvgText x={x + 62} y={226} text="200 g" size={16} anchor="middle" color={C.glucoseSoft} weight={800} />
    </g>
);

/** Bolsa de glicose na veia (Austin): suporte, bolsa e equipo; uma gota cai uma vez. */
const Drip = ({ x, now, reduce }: { x: number; now: boolean; reduce: boolean }) => (
    <g>
        <path d={`M ${x - 26} 120 L ${x - 26} ${AXIS} M ${x - 40} 120 L ${x - 12} 120`} stroke={INK} strokeWidth={4} />
        <rect x={x - 14} y={118} width={36} height={50} rx={8} fill={C.glucose} />
        <text x={x + 4} y={149} textAnchor="middle" fontSize={17} fontWeight={800} fill="#04080F" style={{ fontFamily: 'var(--font-body)' }}>IV</text>
        <path d={`M ${x + 4} 168 L ${x + 4} 196 Q ${x + 4} 212 ${x + 22} 212 L ${x + 40} 212`} stroke={C.glucoseSoft} strokeWidth={4} fill="none" />
        {now && !reduce && (
            <motion.circle cx={x + 4} cy={172} r={6} fill={C.glucoseSoft} initial={{ y: 0, opacity: 0 }}
                animate={{ y: [0, 22], opacity: [0, 1, 0] }} transition={{ duration: 1, delay: 0.4, ease: EASE_IN_OUT }} />
        )}
    </g>
);

const Bar = ({ x, level, label, on, now }: { x: number; level: number; label: string; on: boolean; now: boolean }) => {
    const h = level * STEP_H;
    return (
        <g>
            <motion.rect x={x - BAR_W / 2} y={BASE - h} width={BAR_W} height={h} rx={6} fill={EVIDENCE_FILL[level - 1]}
                style={{ originX: 0.5, originY: 1 }}
                initial={false} animate={{ scaleY: on ? 1 : 0 }} transition={{ duration: DUR.bar, delay: on && now ? 0.45 : 0, ease: EASE_OUT }} />
            <motion.g {...show(on, now, 0.7)}>
                <SvgText x={x} y={BASE - h - 10} text={label} size={16} anchor="middle" color="#FFFFFF" weight={700} />
            </motion.g>
        </g>
    );
};

export const BostonTimeline = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const xs = MILESTONES.map(m => xOf(m.year));
    const tops = MILESTONES.map(m => BASE - m.level * STEP_H);
    const stair = xs.slice(0, step + 1).map((x, i) => (i ? `L ${x - BAR_W / 2} ${tops[i]} L ${x + BAR_W / 2} ${tops[i]}` : `M ${x + BAR_W / 2 + 10} ${tops[i]}`)).join(' ');
    const needle = xOf(1964);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img"
            aria-label="Linha do tempo em escala: Boston 1923, Copenhague 1939, Austin 1987; a evidência sobe de degrau">
            <SvgText x={4} y={20} text="linha do tempo · escala em anos" size={16} color={C.muted} weight={700} />
            <path d={`M ${X0} ${AXIS} L ${xOf(1995)} ${AXIS}`} stroke={C.co2} strokeWidth={4} />
            {[1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990].map(y => (
                <g key={y}>
                    <path d={`M ${xOf(y)} ${AXIS} L ${xOf(y)} ${AXIS + 8}`} stroke={C.co2} strokeWidth={3} />
                    <SvgText x={xOf(y)} y={AXIS + 26} text={String(y)} size={16} anchor="middle" color={C.muted} weight={600} />
                </g>
            ))}
            <SvgText x={4} y={290} text="escada da evidência" size={16} color={C.muted} weight={700} />

            {MILESTONES.map((m, i) => {
                const on = step >= m.at;
                const now = step === m.at;
                return (
                    <g key={m.year}>
                        <motion.g {...show(on, now, 0.05)}>
                            <SvgText x={xs[i]} y={56} text={String(m.year)} size={28} anchor="middle" color="#FFFFFF" weight={800} />
                            <SvgText x={xs[i]} y={80} text={m.place} size={18} anchor="middle" color={C.glucoseSoft} weight={700} />
                            <SvgText x={xs[i]} y={106} text={m.fact} size={18} anchor="middle" color={i === 0 ? C.risk : '#FFFFFF'} weight={800} />
                            {i === 0 && <Finish x={xs[i]} now={now} reduce={reduce} />}
                            {i === 1 && <Ergometer x={xs[i]} />}
                            {i === 2 && <Drip x={xs[i]} now={now} reduce={reduce} />}
                            <circle cx={xs[i]} cy={AXIS} r={9} fill="#04080F" stroke={C.glucose} strokeWidth={4} />
                        </motion.g>
                        <Bar x={xs[i]} level={m.level} label={m.evidence} on={on} now={now} />
                    </g>
                );
            })}

            {/* anos 1960: a agulha leva o foco para o glicogênio do músculo */}
            <motion.g {...show(step >= 2, step === 2, 0.25)}>
                <path d={`M ${needle} 150 L ${needle} 214`} stroke={C.glycogen} strokeWidth={5} strokeLinecap="round" />
                <rect x={needle - 8} y={128} width={16} height={24} rx={3} fill={C.glycogen} />
                <SvgText x={needle} y={104} text="anos 1960" size={16} anchor="middle" color={C.glycogenSoft} weight={800} />
                <SvgText x={needle} y={122} text="agulha de biópsia" size={16} anchor="middle" color={C.glycogenSoft} weight={600} />
            </motion.g>

            {step >= 1 && (
                <motion.path key={`stair-${step}`} d={stair} stroke={C.glucoseSoft} strokeWidth={3} strokeDasharray="7 6" fill="none"
                    initial={reduce ? false : { pathLength: (step) / (step + 1) }} animate={{ pathLength: 1 }}
                    transition={{ duration: DUR.bar, delay: 0.8, ease: EASE_OUT }} />
            )}
        </svg>
    );
};
