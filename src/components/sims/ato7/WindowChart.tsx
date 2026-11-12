import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { RATE_BARS, RATE_MAX, type ArmKind } from './window.content';

/**
 * Slide 120 · taxas de ressíntese do Ivy 1988 (mmol/kg peso úmido/h) em 0–4 h e, depois de um corte no eixo,
 * os dois pontos do Parkin 1997 (8 e 24 h: glicogênio igual). O corte deixa tudo na tela até o fim:
 * as barras do Ivy não somem quando a régua chega a 24 h. Faixa das fases (rápida × lenta) do Jentjens 2003.
 */

export const CHART_W = 616;
export const CHART_H = 240;
const X0 = 64;
const PX_H = 85;
const AXIS_Y = 182;
const PLOT_TOP = 46;
const BAR_W = 62;
const X = (h: number) => X0 + h * PX_H;
const Y = (v: number) => AXIS_Y - (v / RATE_MAX) * (AXIS_Y - PLOT_TOP);
const barX = (arm: ArmKind, win: number) => X(2 * win) + (arm === 'now' ? 18 : 90);
const PARKIN = [{ h: 8, x: 498 }, { h: 24, x: 576 }] as const;

const fade = (on: boolean, current: boolean, delay = 0.3) => ({
    initial: false as const,
    animate: { opacity: on ? 1 : 0 },
    transition: { duration: DUR.enter, delay: on && current ? delay : 0, ease: EASE_OUT },
});

const ArmSwatch = ({ x, arm, text }: { x: number; arm: ArmKind; text: string }) => (
    <g>
        <rect x={x} y={4} width={14} height={14} rx={3} fill={arm === 'now' ? C.glycogen : 'rgba(139,92,246,0.3)'} stroke={C.glycogen} strokeWidth={2.5} />
        <SvgText x={x + 20} y={17} text={text} size={16} color="#E5E7EB" weight={500} />
    </g>
);

export const WindowChart = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width={CHART_W} height={CHART_H} className="block" role="img"
            aria-label="Taxa de ressíntese de glicogênio: 7,7 contra 2,5 nas primeiras 2 h; 4,1 depois; glicogênio igual às 8 e 24 h">
            <SvgText x={0} y={17} text="mmol/kg ww/h" size={16} color={C.caveat} weight={600} />
            <ArmSwatch x={132} arm="now" text="logo após" />
            <ArmSwatch x={238} arm="late" text="2 h depois" />
            <path d="M 354 18 L 362 4 L 370 18 Z" fill={C.glucose} />
            <SvgText x={376} y={17} text="2 g/kg" size={16} color={C.glucoseSoft} weight={600} />
            {/* eixos */}
            <rect x={X0 - 1} y={PLOT_TOP - 8} width={2} height={AXIS_Y - PLOT_TOP + 9} fill="rgba(255,255,255,0.5)" />
            <rect x={X0} y={AXIS_Y - 1} width={418 - X0} height={2} fill="rgba(255,255,255,0.5)" />
            <rect x={438} y={AXIS_Y - 1} width={CHART_W - 438} height={2} fill="rgba(255,255,255,0.5)" />
            <path d="M 414 190 L 424 174 M 432 190 L 442 174" stroke="rgba(255,255,255,0.7)" strokeWidth={2.5} />
            {[0, 2, 4, 6, 8].map(v => <SvgText key={v} x={X0 - 10} y={Y(v) + 6} text={`${v}`} size={16} anchor="end" color="#D1D5DB" weight={500} />)}
            {[0, 1, 2, 3, 4].map(h => <SvgText key={h} x={X(h)} y={208} text={`${h} h`} size={16} anchor="middle" color="#D1D5DB" weight={500} />)}
            {PARKIN.map(p => <SvgText key={p.h} x={p.x} y={208} text={`${p.h} h`} size={16} anchor="middle" color="#D1D5DB" weight={500} />)}
            {/* fases da ressíntese (Jentjens 2003) */}
            <rect x={X(0)} y={216} width={PX_H - 3} height={22} rx={5} fill="rgba(148,163,184,0.28)" />
            <SvgText x={X(0.5)} y={233} text="rápida" size={16} anchor="middle" color="#F3F4F6" />
            <rect x={X(1)} y={216} width={3 * PX_H} height={22} rx={5} fill="rgba(96,165,250,0.22)" />
            <SvgText x={X(2.5)} y={233} text="lenta: depende de insulina →" size={16} anchor="middle" color={C.insulinSoft} />
            {/* doses de CHO */}
            <motion.g {...fade(step >= 1, step === 1, 0)}>
                <path d={`M ${X(0) + 41} 198 L ${X(0) + 49} 186 L ${X(0) + 57} 198 Z`} fill={C.glucose} />
                <path d={`M ${X(2) + 113} 198 L ${X(2) + 121} 186 L ${X(2) + 129} 198 Z`} fill={C.glucose} />
            </motion.g>
            {/* barras do Ivy */}
            {RATE_BARS.map(b => {
                const on = step >= b.at;
                const x = barX(b.arm, b.win);
                return (
                    <g key={`${b.arm}${b.win}`}>
                        <motion.rect x={x} y={Y(b.rate)} width={BAR_W} height={AXIS_Y - Y(b.rate)} rx={4}
                            fill={b.arm === 'now' ? C.glycogen : 'rgba(139,92,246,0.3)'} stroke={C.glycogen} strokeWidth={3}
                            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                            initial={false} animate={{ scaleY: on ? 1 : 0, opacity: on ? 1 : 0 }}
                            transition={{ duration: reduce ? 0 : DUR.bar, delay: on && step === b.at ? 0.1 : 0, ease: EASE_OUT }} />
                        <motion.g {...fade(on, step === b.at, 0.55)}>
                            <SvgText x={x + BAR_W / 2} y={Y(b.rate) - 10} text={b.label} size={26} anchor="middle"
                                color={b.arm === 'now' ? C.glycogenSoft : '#F3F4F6'} weight={800} />
                        </motion.g>
                    </g>
                );
            })}
            {/* 2–4 h do braço imediato: fora do resumo */}
            <motion.g {...fade(step >= 2, step === 2, 0.2)}>
                <rect x={barX('now', 1)} y={AXIS_Y - 64} width={BAR_W} height={64} rx={4} fill="none" stroke="rgba(203,213,225,0.7)" strokeWidth={2.5} strokeDasharray="7 6" />
                <SvgText x={barX('now', 1) + BAR_W / 2} y={AXIS_Y - 24} text="?" size={24} anchor="middle" color={C.caveat} weight={700} />
            </motion.g>
            {/* −45% */}
            <motion.g {...fade(step >= 2, step === 2, 0.7)}>
                <path d={`M ${barX('now', 0)} ${Y(7.7)} L 396 ${Y(7.7)}`} stroke={C.stone} strokeWidth={2.5} strokeDasharray="8 6" />
                <path d={`M 396 ${Y(4.1) - 2} L 396 ${Y(7.7) + 2}`} stroke={C.stone} strokeWidth={3} />
                <SvgText x={400} y={(Y(4.1) + Y(7.7)) / 2 + 8} text="−45%" size={19} color={C.stone} weight={800} />
            </motion.g>
            {/* Parkin 1997: 8 e 24 h */}
            <motion.g {...fade(step >= 3, step === 3, 0.2)}>
                <rect x={464} y={34} width={150} height={140} rx={12} fill="rgba(231,229,228,0.06)" stroke={C.co2} strokeWidth={2} />
                <SvgText x={539} y={58} text="Parkin 1997" size={17} anchor="middle" color="#FFFFFF" weight={700} />
                <SvgText x={539} y={78} text="glicogênio total" size={16} anchor="middle" color={C.caveat} weight={500} />
                {PARKIN.map(p => (
                    <g key={p.h}>
                        <rect x={p.x - 27} y={100} width={24} height={24} rx={4} fill={C.glycogen} stroke={C.glycogen} strokeWidth={2.5} />
                        <rect x={p.x + 3} y={100} width={24} height={24} rx={4} fill="rgba(139,92,246,0.3)" stroke={C.glycogen} strokeWidth={2.5} />
                        <SvgText x={p.x} y={156} text="igual" size={18} anchor="middle" color={C.stone} weight={800} />
                    </g>
                ))}
            </motion.g>
        </svg>
    );
};
