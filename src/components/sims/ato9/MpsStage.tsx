import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, Equal } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { CountSvgText, CountUp } from '../kit/CountUp';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { KeyFact } from '../kit/rhythm';
import { SvgText } from '../kit/ui';
import { ARMS, FSR_MAX, HOURS, INSULIN_FOLD, INSULIN_MAX, PROTEIN, REPLICAS } from './mps.content';

/**
 * Palco do slide 163 (690 × 420). À esquerda, o gráfico espelhado de Koopman 2007: a insulina cresce para cima do eixo
 * das doses de CHO, a síntese proteica para baixo, na mesma coluna de cada braço. À direita, os dois números que
 * desacoplam (~12× × sem diferença) e as duas réplicas. Tudo o que entra fica.
 */

export const STAGE_W = 690;
export const STAGE_H = 420;
const CW = 420;
const COLS = [122, 228, 334] as const;
const BAR_W = 70;
const UP = { top: 58, base: 196 };
const AXIS = { top: 202, bottom: 262 };
const DOWN = { base: 268, max: 90 };
const upH = (v: number) => ((UP.base - UP.top) * v) / INSULIN_MAX;
const downH = (v: number) => (DOWN.max * v) / FSR_MAX;

/** Barra que cresce por escala a partir da base (para cima) ou do topo (para baixo). */
const Bar = ({ x, y, h, color, show, delay, down = false }: { x: number; y: number; h: number; color: string; show: boolean; delay: number; down?: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <motion.rect x={x - BAR_W / 2} y={y} width={BAR_W} height={h} rx={4} fill={color}
            style={{ transformBox: 'fill-box', transformOrigin: down ? 'center top' : 'center bottom' }}
            initial={false} animate={{ scaleY: show ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : DUR.bar, delay: show ? delay : 0, ease: EASE_OUT }} />
    );
};

const Mirror = ({ step }: { step: number }) => (
    <svg viewBox={`0 0 ${CW} ${STAGE_H}`} width={CW} height={STAGE_H} className="absolute left-0 top-0" role="img"
        aria-label="Insulina 1,5, 3,7 e 18,4 U·6h/L; síntese 0,10, 0,10 e 0,11 %/h">
        <rect x={0} y={2} width={14} height={14} rx={3} fill={C.protein} />
        <SvgText x={22} y={15} text={`proteína ${br(PROTEIN)} g/kg/h nos três braços, ${HOURS} h`} size={16} color={C.proteinSoft} weight={700} />
        {/* insulina, para cima */}
        <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0.6 }}>
            <SvgText x={0} y={42} text="insulina · área em 6 h (U·6h/L)" size={16} color={C.insulinSoft} weight={700} />
            {[0, 10, 20].map(t => {
                const y = UP.base - upH(t);
                return (
                    <g key={t}>
                        <line x1={66} x2={CW - 20} y1={y} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
                        <SvgText x={60} y={y + 6} text={String(t)} size={16} anchor="end" color={C.muted} weight={500} />
                    </g>
                );
            })}
        </motion.g>
        {ARMS.map((a, i) => (
            <g key={a.doseLabel}>
                <Bar x={COLS[i]} y={UP.base - upH(a.insulin)} h={upH(a.insulin)} color={C.insulin} show={step >= 1} delay={0.15 + i * 0.15} />
                {step >= 1 && <CountSvgText x={COLS[i]} y={UP.base - upH(a.insulin) - 8} text={br(a.insulin)} size={20} anchor="middle" color="#F9FAFB" weight={700} delay={0.3 + i * 0.15} />}
            </g>
        ))}
        {/* eixo das doses de CHO */}
        <rect x={66} y={AXIS.top} width={CW - 86} height={AXIS.bottom - AXIS.top} rx={8} fill="rgba(255,255,255,0.08)" />
        {ARMS.map((a, i) => (
            <g key={`d${a.doseLabel}`}>
                <SvgText x={COLS[i]} y={AXIS.top + 26} text={a.doseLabel} size={22} anchor="middle" color={C.glucose} weight={800} />
                <SvgText x={COLS[i]} y={AXIS.top + 50} text={`${a.dose === 0 ? '0' : br(a.dose * HOURS, 1)} g/kg`} size={16} anchor="middle" color="#E5E7EB" weight={500} />
            </g>
        ))}
        <SvgText x={0} y={AXIS.top + 24} text="CHO/h" size={16} color={C.glucoseSoft} weight={700} />
        <SvgText x={0} y={AXIS.top + 50} text="em 6 h" size={16} color="#E5E7EB" weight={500} />
        {/* síntese, para baixo */}
        {ARMS.map((a, i) => (
            <g key={`f${a.doseLabel}`}>
                <Bar x={COLS[i]} y={DOWN.base} h={downH(a.fsr)} color={C.protein} show={step >= 2} delay={0.15 + i * 0.12} down />
                {step >= 2 && <CountSvgText x={COLS[i]} y={DOWN.base + downH(a.fsr) + 22} text={br(a.fsr, 2)} size={20} anchor="middle" color="#F9FAFB" weight={700} delay={0.4} />}
            </g>
        ))}
        <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 2 ? 0.8 : 0 }}>
            <line x1={COLS[0] - BAR_W / 2} x2={COLS[2] + BAR_W / 2} y1={386} y2={386} stroke={C.proteinSoft} strokeWidth={3} />
            {COLS.map(x => <line key={x} x1={x} x2={x} y1={380} y2={386} stroke={C.proteinSoft} strokeWidth={3} />)}
            <SvgText x={COLS[1]} y={410} text="sem diferença entre os braços" size={18} anchor="middle" color={C.proteinSoft} weight={700} />
        </motion.g>
        <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0.6 }}>
            <SvgText x={0} y={DOWN.base + 20} text="síntese" size={16} color={C.proteinSoft} weight={700} />
            <SvgText x={0} y={DOWN.base + 40} text="%/h" size={16} color={C.proteinSoft} weight={500} />
        </motion.g>
    </svg>
);

const Fade = ({ show, children, className = '', style }: { show: boolean; children: ReactNode; className?: string; style?: CSSProperties }) => (
    <motion.div className={className} style={style} initial={false} animate={{ opacity: show ? 1 : 0, x: show ? 0 : 10 }}
        transition={{ duration: DUR.enter, delay: show ? 0.3 : 0, ease: EASE_OUT }}>
        {children}
    </motion.div>
);

/** O ~12× mora no vazio acima das barras baixas da insulina. */
const Fold = ({ show }: { show: boolean }) => (
    <Fade show={show} className="absolute flex items-baseline gap-3" style={{ left: 76, top: 62 }}>
        {show && <KeyFact color={C.insulin} delay={0.6}><CountUp text={`~${INSULIN_FOLD}×`} delay={0.4} className="font-display text-[52px] font-bold leading-none" style={{ color: C.insulinSoft }} /></KeyFact>}
        <span className="text-[16px] leading-tight text-gray-200">18,4 ÷ 1,5</span>
    </Fade>
);

const Replicas = ({ show }: { show: boolean }) => (
    <div className="absolute top-0 flex flex-col gap-3" style={{ left: CW + 12, width: STAGE_W - CW - 12, height: STAGE_H }}>
        {REPLICAS.map(r => (
            <Fade key={r.key} show={show} className="flex flex-1 flex-col gap-[2px] rounded-xl border-2 border-white/15 px-3 py-2">
                <span className="text-[19px] font-semibold text-white">{r.who}</span>
                <span className="font-mono text-[14px] text-gray-300">{r.design}</span>
                <span className="text-[16px] leading-snug text-gray-200">{r.what}</span>
                <div className="mt-auto flex flex-col gap-[2px] text-[17px] font-semibold">
                    <span className="flex items-center gap-1" style={{ color: r.up[0].label === 'insulina' ? C.insulinSoft : C.glucoseSoft }}>
                        <ArrowUp size={17} strokeWidth={3} aria-hidden />{r.up.map(u => `${u.label} ${u.value}`).join(' · ')}
                    </span>
                    <span className="flex items-center gap-1" style={{ color: C.proteinSoft }}><Equal size={17} strokeWidth={3} aria-hidden />{r.same}</span>
                </div>
            </Fade>
        ))}
    </div>
);

export const MpsStage = ({ step }: { step: number }) => (
    <div className="relative" style={{ width: STAGE_W, height: STAGE_H }}>
        <Mirror step={step} />
        <Fold show={step >= 1} />
        <Replicas show={step >= 3} />
    </div>
);
