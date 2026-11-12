import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { DIETS, FIT, OUT_OF_ORDER } from './threeDiets.content';

/** Glicogênio inicial × tempo até a exaustão (Bergström 1967): as três médias, a reta do artigo e os 3 "fora da ordem". */

const W = 470;
const H = 330;
const PLOT = { x0: 64, x1: 455, y0: 290, y1: 18 } as const;
const X_MAX = 5;
const Y_MAX = 300;
const sx = (g: number) => PLOT.x0 + (g / X_MAX) * (PLOT.x1 - PLOT.x0);
const sy = (m: number) => PLOT.y0 - (m / Y_MAX) * (PLOT.y0 - PLOT.y1);

interface DietChartProps { step: number }

export const DietChart = ({ step }: DietChartProps) => {
    const reduce = useReducedMotion() ?? false;
    const focusBox = step === 3;
    const box = {
        x: sx(OUT_OF_ORDER.gly[0]), w: sx(OUT_OF_ORDER.gly[1]) - sx(OUT_OF_ORDER.gly[0]),
        y: sy(OUT_OF_ORDER.min[1]) - 8, h: sy(OUT_OF_ORDER.min[0]) - sy(OUT_OF_ORDER.min[1]) + 16,
    };
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="block" style={{ width: W, height: H }} role="img"
            aria-label="Gráfico do glicogênio inicial contra o tempo até a exaustão, com correlação r = 0,92">
            {/* eixos e marcas */}
            <line x1={PLOT.x0} y1={PLOT.y0} x2={PLOT.x1} y2={PLOT.y0} stroke={C.co2} strokeWidth={2} />
            <line x1={PLOT.x0} y1={PLOT.y0} x2={PLOT.x0} y2={PLOT.y1} stroke={C.co2} strokeWidth={2} />
            {[0, 1, 2, 3, 4, 5].map(g => <SvgText key={g} x={sx(g)} y={PLOT.y0 + 22} text={String(g)} size={16} anchor="middle" color={C.muted} />)}
            {[60, 120, 180, 240].map(m => <SvgText key={m} x={PLOT.x0 - 10} y={sy(m) + 6} text={String(m)} size={16} anchor="end" color={C.muted} />)}
            <SvgText x={PLOT.x1} y={PLOT.y0 - 10} text="glicogênio, g/100 g" size={16} anchor="end" color={C.caveat} />
            <SvgText x={PLOT.x0 + 8} y={PLOT.y1 + 4} text="min até a exaustão" size={16} color={C.caveat} />

            {/* a reta do artigo, desenhada da esquerda para a direita */}
            <motion.g initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }}>
                <line x1={sx(FIT.x0)} y1={sy(FIT.slope * FIT.x0 + FIT.intercept)} x2={sx(FIT.x1)} y2={sy(FIT.slope * FIT.x1 + FIT.intercept)}
                    stroke={C.glycogenSoft} strokeWidth={4} strokeLinecap="round" />
            </motion.g>

            {DIETS.map((d, i) => (
                <motion.circle key={d.name} cx={sx(d.glycogen)} cy={sy(d.minutes)} r={11} fill={d.color} stroke="#04080F" strokeWidth={3}
                    initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: focusBox ? 0.6 : 1, scale: 1 }}
                    style={{ transformOrigin: `${sx(d.glycogen)}px ${sy(d.minutes)}px` }}
                    transition={{ delay: reduce ? 0 : stagger(i, 0.2), duration: DUR.enter, ease: EASE_OUT }} />
            ))}

            {/* os 3 que fizeram carboidrato sem esvaziar antes */}
            <motion.g initial={false} animate={{ opacity: focusBox ? 1 : 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={6} fill={C.glucose} fillOpacity={0.25} stroke={C.glucoseSoft} strokeWidth={3} />
                <SvgText x={box.x + box.w / 2} y={box.y + box.h + 26} text="2,10–3,00 g · 119–124 min" size={17} anchor="middle" color={C.glucoseSoft} />
            </motion.g>

            <SvgText x={PLOT.x0 + 24} y={PLOT.y1 + 62} text="r = 0,92" size={40} weight={700} color={C.glycogenSoft} />
            <SvgText x={PLOT.x0 + 26} y={PLOT.y1 + 88} text="p < 0,001" size={17} color={C.caveat} />
        </svg>
    );
};
