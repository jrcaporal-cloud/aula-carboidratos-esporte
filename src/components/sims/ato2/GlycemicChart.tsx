import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { CountSvgText } from '../kit/CountUp';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { toPath, useMorphPath } from '../kit/useMorphPath';
import { BASE, FOODS, GROUPS, H, TICKS, W, X0, X1 } from './glycemic.content';

/**
 * Slide 29 · palco (viewBox 680 × 424). Em cima, a curva de glicemia que se transforma de alimento em alimento
 * (useMorphPath), com a área preenchida; as curvas já vistas ficam tracejadas. Embaixo, a régua de Jenkins
 * (IG médio por grupo) entra no passo 3 e ganha as faixas de IG baixo e alto no passo 4. Nada some.
 */
const R0 = 74, R1 = 660, RY = 336, RH = 22; // régua
const rx = (gi: number): number => R0 + ((R1 - R0) * gi) / 100;
const LABEL_Y = [RY - 12, RY + RH + 26, RY + RH + 50] as const;

const Ghost = ({ i, show }: { i: number; show: boolean }) => (
    <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter }}>
        <path d={toPath(FOODS[i].line)} fill="none" stroke={i === 0 ? '#E5E7EB' : C.glucoseSoft} strokeWidth={3} strokeDasharray="9 7" />
        <SvgText x={FOODS[i].peak[0] + 10} y={FOODS[i].peak[1] - 8} text={`${FOODS[i].name} ${FOODS[i].gi}`} size={16}
            color={i === 0 ? '#E5E7EB' : C.glucoseSoft} weight={700} />
    </motion.g>
);

const Curve = ({ food }: { food: number }) => {
    const f = FOODS[food];
    const lineRef = useMorphPath(f.line, 700);
    const areaRef = useMorphPath(f.area, 700);
    return (
        <g>
            <path ref={areaRef} fill={C.glucose} fillOpacity={0.32} />
            <path ref={lineRef} fill="none" stroke={C.glucose} strokeWidth={6} strokeLinejoin="round" />
            <motion.g key={food} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter, delay: 0.6 }}>
                <SvgText x={X0 + 300} y={BASE - 12} text="área sob a curva" size={16} color="#FDE68A" weight={700} anchor="middle" />
                <CountSvgText x={X1} y={70} text={`IG ${f.gi}`} size={34} color="#FFFFFF" weight={800} anchor="end" delay={0.6} />
                <SvgText x={X1} y={94} text={f.name} size={16} color={C.glucoseSoft} weight={700} anchor="end" />
            </motion.g>
        </g>
    );
};

const Axes = () => (
    <g>
        <SvgText x={8} y={22} text="GLICEMIA ACIMA DO JEJUM" size={16} color={C.muted} weight={700} />
        <line x1={X0} y1={BASE} x2={X1} y2={BASE} stroke="#94A3B8" strokeWidth={3} />
        <line x1={X0} y1={40} x2={X0} y2={BASE} stroke="#94A3B8" strokeWidth={3} />
        {TICKS.map(t => <SvgText key={t.t} x={t.x} y={BASE + 24} text={String(t.t)} size={16} anchor="middle" color="#D1D5DB" />)}
        <SvgText x={X0 - 10} y={BASE + 24} text="min" size={16} anchor="end" color="#D1D5DB" />
    </g>
);

/** Régua do IG médio por grupo (passo 3) e faixas de corte (passo 4). */
const Ruler = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const on = step >= 2, bands = step >= 3;
    return (
        <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 2 ? 0.5 : 0 }}>
            <SvgText x={8} y={290} text="IG MÉDIO POR GRUPO · JENKINS 1981" size={16} color={C.muted} weight={700} />
            <rect x={R0} y={RY} width={R1 - R0} height={RH} rx={6} fill="#1E293B" />
            <motion.g initial={false} animate={{ opacity: bands ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 3 ? 0.4 : 0 }}>
                <rect x={R0} y={RY} width={rx(55) - R0} height={RH} rx={6} fill="#475569" />
                <rect x={rx(70)} y={RY} width={R1 - rx(70)} height={RH} rx={6} fill={C.glucoseDeep} />
                <SvgText x={R0 + 8} y={RY + 17} text="baixo ≤ 55" size={16} color="#F3F4F6" weight={700} />
                <SvgText x={R1 - 10} y={RY + 17} text="alto ≥ 70" size={16} color="#F3F4F6" weight={700} anchor="end" />
            </motion.g>
            {GROUPS.map((g, i) => {
                const x = rx(g.gi);
                const dx = g.anchor === 'start' ? -4 : g.anchor === 'end' ? 4 : 0;
                return (
                    <motion.g key={g.name} initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 6 }}
                        transition={{ duration: reduce ? 0 : DUR.enter, delay: step === 2 ? stagger(i, 0.7, 0.08) : 0, ease: EASE_OUT }}>
                        <rect x={x - 3} y={RY - 6} width={6} height={RH + 12} rx={3} fill={g.gi === 100 ? '#E5E7EB' : C.glucose} />
                        <SvgText x={x + dx} y={LABEL_Y[g.row]} text={`${g.name} ${g.gi}`} size={16} anchor={g.anchor}
                            color={g.gi === 100 ? '#E5E7EB' : '#F3F4F6'} weight={g.gi === 31 || g.gi === 65 ? 800 : 600} />
                    </motion.g>
                );
            })}
        </motion.g>
    );
};

export const GlycemicChart = ({ step, food }: { step: number; food: number }) => (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block" role="img"
        aria-label="Curva de glicemia de 2 horas: glicose 100, cereal matinal 65, leguminosa seca 31; régua do IG médio por grupo">
        <Axes />
        <Ghost i={0} show={food > 0} />
        <Ghost i={1} show={food > 1} />
        <Curve food={food} />
        <Ruler step={step} />
    </svg>
);
