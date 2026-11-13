import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CountSvgText } from '../kit/CountUp';
import { DIETS, FIT, OUT_OF_ORDER } from './threeDiets.content';

/**
 * Palco do slide 62 (Bergström 1967): no topo, a ordem do protocolo; embaixo, o gráfico que se monta e não perde nada.
 * Passo 0: glicogênio de cada dieta no eixo · 1: os cronômetros sobem até o tempo · 2: a reta e o r ·
 * 3: a caixa dos 3 fora da ordem · 4: o selo "associação, não causa" (as limitações ficam no texto do painel).
 * viewBox = tamanho na tela (1:1): fonte SVG = fonte real.
 */

export const CHART_W = 636;
export const CHART_H = 436;
const P = { x0: 64, x1: 610, y0: 392, y1: 124 } as const;
const X_MAX = 5;
const Y_MAX = 240;
const sx = (g: number) => P.x0 + (g / X_MAX) * (P.x1 - P.x0);
const sy = (m: number) => P.y0 - (m / Y_MAX) * (P.y0 - P.y1);

/** A ordem do protocolo, como no estudo: três fases de 3 dias, e depois de cada uma, biópsia + teste até a exaustão. */
const PHASES = [
    { x: 10, w: 150, label: 'dieta mista', color: C.stone },
    { x: 214, w: 210, label: 'gordura + proteína', color: C.fat },
    { x: 478, w: 150, label: 'carboidrato', color: C.glucose },
] as const;

const Protocol = () => (
    <g>
        {PHASES.map((ph, i) => (
            <g key={ph.label}>
                <rect x={ph.x} y={12} width={ph.w} height={34} rx={8} fill={ph.color} fillOpacity={0.16} stroke={ph.color} strokeWidth={2} />
                <SvgText x={ph.x + ph.w / 2} y={35} text={`${i + 1} · ${ph.label}`} size={16} weight={700} anchor="middle" color={ph.color === C.glucose ? C.glucoseSoft : ph.color} />
                {i < PHASES.length - 1 && <SvgText x={ph.x + ph.w + 27} y={36} text="→" size={20} weight={700} anchor="middle" color="#D1D5DB" />}
            </g>
        ))}
        <SvgText x={10} y={76} text="cada fase: 3 dias de dieta → biópsia → pedalar a 75% do VO₂máx até a exaustão" size={16} color="#D1D5DB" />
    </g>
);

const Axes = () => (
    <g>
        <line x1={P.x0} y1={P.y0} x2={P.x1} y2={P.y0} stroke={C.co2} strokeWidth={2} />
        <line x1={P.x0} y1={P.y0} x2={P.x0} y2={P.y1} stroke={C.co2} strokeWidth={2} />
        {[0, 1, 2, 3, 4, 5].map(g => <SvgText key={g} x={sx(g)} y={P.y0 + 22} text={String(g)} size={16} anchor="middle" color={C.muted} />)}
        {[60, 120, 180, 240].map(m => <SvgText key={m} x={P.x0 - 10} y={sy(m) + 6} text={String(m)} size={16} anchor="end" color={C.muted} />)}
        <SvgText x={(P.x0 + P.x1) / 2} y={P.y0 + 42} text="glicogênio inicial, g/100 g de músculo úmido" size={16} anchor="middle" color={C.caveat} />
        <g transform={`translate(20 ${(P.y0 + P.y1) / 2}) rotate(-90)`}>
            <SvgText x={0} y={0} text="min até a exaustão" size={16} anchor="middle" color={C.caveat} />
        </g>
    </g>
);

/** Rótulo do tempo de cada dieta, posto onde não cruza a reta nem a caixa. */
const TIME_LABEL = [
    { dx: 14, dy: 26, anchor: 'start' },
    { dx: -16, dy: 6, anchor: 'end' },
    { dx: 16, dy: 6, anchor: 'start' },
] as const;

const Diets = ({ step, reduce }: { step: number; reduce: boolean }) => (
    <g>
        {DIETS.map((d, i) => {
            const x = sx(d.glycogen);
            const lab = TIME_LABEL[i];
            const timed = step >= 1;
            return (
                <g key={d.name}>
                    <motion.rect x={x - 3} y={sy(d.minutes)} width={6} height={P.y0 - sy(d.minutes)} fill={d.color} fillOpacity={0.8}
                        style={{ originX: 0.5, originY: 1 }} initial={false} animate={{ scaleY: timed ? 1 : 0 }}
                        transition={{ duration: reduce ? 0 : 0.9, delay: timed && !reduce && step === 1 ? stagger(i, 0, 0.1) : 0, ease: EASE_OUT }} />
                    <polygon points={`${x},${P.y0 - 9} ${x + 8},${P.y0} ${x},${P.y0 + 9} ${x - 8},${P.y0}`} fill={d.color} />
                    <SvgText x={x + 10} y={P.y0 - 12} text={d.glycogen.toFixed(2).replace('.', ',')} size={16} weight={700} color={d.soft} />
                    <motion.g initial={false} animate={{ opacity: timed ? 1 : 0 }}
                        transition={{ duration: DUR.enter, delay: timed && step === 1 && !reduce ? 0.75 + i * 0.1 : 0 }}>
                        <circle cx={x} cy={sy(d.minutes)} r={10} fill={d.color} stroke="#04080F" strokeWidth={3} />
                        <CountSvgText x={x + lab.dx} y={sy(d.minutes) + lab.dy} text={`${d.minutes} min`} size={18} weight={700}
                            anchor={lab.anchor} color={d.soft} run={timed} delay={reduce ? 0 : 0.1} duration={0.9} />
                    </motion.g>
                </g>
            );
        })}
        <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 1 ? 1 : 0 }}>
            <SvgText x={sx(3.31) + 16} y={sy(167) + 30} text="≈ 3× o tempo de 0,63" size={16} color={C.glucoseSoft} />
        </motion.g>
    </g>
);

const Fit = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const on = step >= 2;
    return (
        <g>
            <motion.g initial={false} animate={{ clipPath: on ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
                transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }}>
                <line x1={sx(FIT.x0)} y1={sy(FIT.slope * FIT.x0 + FIT.intercept)} x2={sx(FIT.x1)} y2={sy(FIT.slope * FIT.x1 + FIT.intercept)}
                    stroke={C.glycogenSoft} strokeWidth={4} strokeLinecap="round" />
            </motion.g>
            <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter, delay: on && step === 2 ? 0.8 : 0 }}>
                <SvgText x={P.x0 + 22} y={166} text="r = 0,92" size={34} weight={700} color={C.glycogenSoft} />
                <SvgText x={P.x0 + 22} y={190} text="p < 0,001 · y = 41,6x + 36,8" size={16} color={C.caveat} />
            </motion.g>
            <motion.g initial={false} animate={{ opacity: step >= 4 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 4 ? 0.3 : 0 }}>
                <rect x={P.x0 + 22} y={202} width={196} height={30} rx={8} fill="#04080F" stroke={C.stone} strokeWidth={3} />
                <SvgText x={P.x0 + 120} y={223} text="associação, não causa" size={16} weight={700} anchor="middle" color={C.stone} />
            </motion.g>
        </g>
    );
};

const OutOfOrder = ({ step }: { step: number }) => {
    const x = sx(OUT_OF_ORDER.gly[0]);
    const w = sx(OUT_OF_ORDER.gly[1]) - x;
    const y = sy(OUT_OF_ORDER.min[1]) - 9;
    const h = sy(OUT_OF_ORDER.min[0]) - sy(OUT_OF_ORDER.min[1]) + 18;
    return (
        <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: DUR.enter }}>
            <rect x={x} y={y} width={w} height={h} rx={6} fill={C.glucose} fillOpacity={0.3} stroke={C.glucoseSoft} strokeWidth={3} />
            <SvgText x={x + w / 2} y={y + h + 46} text="3 sem esvaziar" size={16} weight={700} anchor="middle" color={C.glucoseSoft} />
            <SvgText x={x + w / 2} y={y + h + 66} text="antes: 2,1–3,0 g" size={16} anchor="middle" color={C.glucoseSoft} />
            <SvgText x={x + w / 2} y={y + h + 86} text="119–124 min" size={16} anchor="middle" color={C.glucoseSoft} />
        </motion.g>
    );
};

export const DietChart = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width={CHART_W} height={CHART_H} className="block" role="img"
            aria-label="Protocolo de Bergström 1967 e o gráfico do glicogênio inicial contra o tempo até a exaustão: 0,63, 1,75 e 3,31 g/100 g; 57, 114 e 167 min; r = 0,92">
            <Protocol />
            <Axes />
            <Fit step={step} reduce={reduce} />
            <OutOfOrder step={step} />
            <Diets step={step} reduce={reduce} />
        </svg>
    );
};
