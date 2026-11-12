import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CountSvgText } from '../kit/CountUp';
import { ARMS, FLOOR, FLOOR_BAND, X_MAX, Y_MAX, type ArmId } from './shortRecovery.content';

/**
 * Slide 121 · o protocolo em faixa (corrida → 4 h com CHO a cada 30 min → corrida) e, embaixo, o glicogênio:
 * as duas barras do fim da recuperação e as retas da 2ª corrida até o mesmo piso. A reta de cada braço
 * se desenha em tempo proporcional aos minutos (cronômetro): 48 min chega antes, 80 min depois.
 */

export const STRIP_W = 616;
export const STRIP_H = 86;
export const CHART_W = 616;
export const CHART_H = 326;
const AXIS_Y = 284;
const TOP = 50;
const Y = (g: number) => AXIS_Y - (g / Y_MAX) * (AXIS_Y - TOP);
const RUN_X0 = 222;
const RUN_X1 = 600;
const X = (m: number) => RUN_X0 + (m / X_MAX) * (RUN_X1 - RUN_X0);
const BAR_W = 52;
const BAR_X: Record<ArmId, number> = { high: 98, low: 158 };
const RUN_S = 1.2;

const solid = (id: ArmId) => id === 'high';

const Segment = ({ x, w, label, on, color }: { x: number; w: number; label: string; on: boolean; color: string }) => (
    <g style={{ opacity: on ? 1 : 0.6, transition: 'opacity 300ms ease-out' }}>
        <rect x={x} y={4} width={w} height={38} rx={10} fill={on ? `${color}22` : 'transparent'} stroke={color} strokeWidth={on ? 3 : 2} />
        <SvgText x={x + w / 2} y={29} text={label} size={16} anchor="middle" color="#F9FAFB" />
    </g>
);

export const ProtocolStrip = ({ step }: { step: number }) => {
    const all = step === 0 || step >= 3;
    return (
        <svg viewBox={`0 0 ${STRIP_W} ${STRIP_H}`} width={STRIP_W} height={STRIP_H} className="block" role="img"
            aria-label="Protocolo: corrida até a exaustão, 4 h de recuperação com carboidrato a cada 30 min, nova corrida">
            <Segment x={0} w={148} label="corrida 1" on={all} color={C.stone} />
            <Segment x={158} w={300} label="4 h de recuperação" on={all || step === 1} color={C.glucose} />
            <Segment x={468} w={148} label="corrida 2" on={all || step === 2} color={C.stone} />
            {Array.from({ length: 8 }, (_, i) => {
                const x = 158 + (i + 0.5) * (300 / 8);
                return <path key={i} d={`M ${x - 8} 62 L ${x} 48 L ${x + 8} 62 Z`} fill={C.glucose} />;
            })}
            <SvgText x={308} y={80} text="a cada 30 min: 0,6 ou 0,15 g/kg" size={16} anchor="middle" color={C.glucoseSoft} />
            <SvgText x={74} y={64} text="até a exaustão" size={16} anchor="middle" color={C.caveat} weight={500} />
            <SvgText x={542} y={64} text="até a exaustão" size={16} anchor="middle" color={C.caveat} weight={500} />
        </svg>
    );
};

const Swatch = ({ x, id, text }: { x: number; id: ArmId; text: string }) => (
    <g>
        <rect x={x} y={5} width={14} height={14} rx={3} fill={solid(id) ? C.glycogen : 'rgba(139,92,246,0.3)'} stroke={C.glycogen} strokeWidth={2.5} />
        <SvgText x={x + 20} y={18} text={text} size={16} color="#E5E7EB" weight={500} />
    </g>
);

export const ShortChart = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const filled = step >= 1;
    const run = step >= 2;
    return (
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width={CHART_W} height={CHART_H} className="block" role="img"
            aria-label="Glicogênio 269 contra 157 mmol/kg no fim da recuperação; 2ª corrida de 80 contra 48 min até o mesmo piso">
            <SvgText x={0} y={18} text="glicogênio, mmol/kg ps" size={16} color={C.caveat} weight={600} />
            <Swatch x={318} id="high" text="1,2 g/kg/h" />
            <Swatch x={452} id="low" text="0,3 g/kg/h" />
            {/* eixos */}
            <rect x={63} y={TOP - 8} width={2} height={AXIS_Y - TOP + 9} fill="rgba(255,255,255,0.5)" />
            <rect x={64} y={AXIS_Y - 1} width={RUN_X1 - 64 + 10} height={2} fill="rgba(255,255,255,0.5)" />
            {[0, 100, 200, 300].map(g => <SvgText key={g} x={54} y={Y(g) + 6} text={`${g}`} size={16} anchor="end" color="#D1D5DB" weight={500} />)}
            {[0, 30, 60, 90].map(m => <SvgText key={m} x={X(m)} y={306} text={`${m}`} size={16} anchor="middle" color="#D1D5DB" weight={500} />)}
            <SvgText x={(RUN_X0 + RUN_X1) / 2} y={CHART_H - 2} text="minutos da 2ª corrida" size={16} anchor="middle" color={C.caveat} weight={500} />
            <SvgText x={154} y={306} text="fim das 4 h" size={16} anchor="middle" color={C.caveat} weight={500} />
            <rect x={203} y={TOP} width={2} height={AXIS_Y - TOP} fill="rgba(255,255,255,0.18)" />
            {/* piso na exaustão */}
            <motion.g initial={false} animate={{ opacity: run ? 1 : 0 }} transition={{ duration: DUR.enter, delay: run && step === 2 ? 0.2 : 0 }}>
                <rect x={RUN_X0} y={Y(FLOOR_BAND[1] + 4)} width={RUN_X1 - RUN_X0 + 10} height={Y(FLOOR_BAND[0] - 4) - Y(FLOOR_BAND[1] + 4)} fill="rgba(231,229,228,0.22)" />
                <SvgText x={RUN_X1 + 8} y={Y(FLOOR) + 30} text="piso na exaustão: ~72–78" size={16} anchor="end" color={C.stone} weight={700} />
            </motion.g>
            {ARMS.map(a => {
                const top = Y(a.start);
                const draw = (a.minutes / 80) * RUN_S;
                return (
                    <g key={a.id}>
                        <motion.rect x={BAR_X[a.id]} y={top} width={BAR_W} height={AXIS_Y - top} rx={5}
                            fill={solid(a.id) ? C.glycogen : 'rgba(139,92,246,0.3)'} stroke={C.glycogen} strokeWidth={3}
                            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                            initial={false} animate={{ scaleY: filled ? 1 : 0, opacity: filled ? 1 : 0 }}
                            transition={{ duration: reduce ? 0 : DUR.bar, ease: EASE_OUT }} />
                        <motion.g initial={false} animate={{ opacity: filled ? 1 : 0 }} transition={{ duration: DUR.enter, delay: filled && step === 1 ? 0.3 : 0 }}>
                            <CountSvgText x={BAR_X[a.id] + BAR_W / 2} y={top - 10} text={`${a.start}`} run={filled} delay={0.2} duration={0.7}
                                size={26} anchor="middle" color={solid(a.id) ? C.glycogenSoft : '#F3F4F6'} weight={800} />
                            <path d={`M ${BAR_X[a.id] + BAR_W} ${top} L ${RUN_X0} ${top}`} stroke={C.glycogenSoft} strokeWidth={2} strokeDasharray="5 5" />
                        </motion.g>
                        <motion.path d={`M ${RUN_X0} ${top} L ${X(a.minutes)} ${Y(FLOOR)}`} fill="none" stroke={C.glycogen} strokeWidth={5}
                            strokeLinecap="round" strokeDasharray={solid(a.id) ? undefined : '10 8'}
                            initial={false} animate={{ pathLength: run ? 1 : 0, opacity: run ? 1 : 0 }}
                            transition={{ pathLength: { duration: reduce || !run ? 0 : draw, ease: 'linear' }, opacity: { duration: 0.1 } }} />
                        <motion.g initial={false} animate={{ opacity: run ? 1 : 0 }}
                            transition={{ duration: DUR.text, delay: run && step === 2 && !reduce ? draw : 0 }}>
                            <circle cx={X(a.minutes)} cy={Y(FLOOR)} r={10} fill="#04080F" stroke={C.glycogenSoft} strokeWidth={4} />
                            <SvgText x={X(a.minutes)} y={Y(FLOOR) - 22} text={`${a.minutes} min`} size={26} anchor="middle" color="#FFFFFF" weight={800} />
                        </motion.g>
                    </g>
                );
            })}
            {/* o que o CHO a mais comprou: a parte de cima da barra cheia */}
            <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 1 ? 0.8 : 0 }}>
                <rect x={BAR_X.high - 4} y={Y(269)} width={BAR_W + 8} height={Y(157) - Y(269)} rx={6} fill="none" stroke={C.stone} strokeWidth={3} strokeDasharray="6 5" />
                <SvgText x={BAR_X.high + BAR_W / 2} y={(Y(269) + Y(157)) / 2 + 8} text="+112" size={22} anchor="middle" color="#FFFFFF" weight={800} />
            </motion.g>
        </svg>
    );
};
