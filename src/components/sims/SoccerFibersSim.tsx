import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { SvgText } from './kit/ui';
import { CountUp } from './kit/CountUp';
import { Grow } from './kit/Beat';
import { br } from './kit/format';
import { CalcChip, DesignChip, IllustrativeChip } from './kit/chips';
import { FiberMosaic } from './ato9/FiberMosaic';
import { Big, Chips, Reveal, Say, SimBox, SourceLine } from './ato9/parts';
import { DESIGN, EMPTY_PCT, GLY_POST, GLY_PRE, LAG_M, MEAN_DROP, SOURCE, STEPS } from './ato9/soccerFibers.content';

/**
 * Slide 160 · 47% das Fibras. O corte do músculo esvazia fibra a fibra do minuto 0 ao 90;
 * depois a média (que engana) e a consequência no tiro de 30 m. Recurso: mosaico que se apaga + relógio que conta.
 */

const Legend = () => (
    <div className="flex items-center gap-5 text-[16px] text-gray-200">
        <span className="flex items-center gap-2"><span className="inline-block h-4 w-4 shrink-0 rounded-sm" style={{ background: C.glycogen }} />com glicogênio</span>
        <span className="flex items-center gap-2"><span className="inline-block h-4 w-4 shrink-0 rounded-sm" style={{ background: '#1E293B', outline: `2px solid ${C.co2}` }} />vazia ou quase</span>
    </div>
);

const MeanBars = () => (
    <div className="flex flex-col gap-4">
        {[{ label: 'antes', v: GLY_PRE }, { label: "90'", v: GLY_POST }].map((r, i) => (
            <div key={r.label} className="flex items-center gap-4">
                <span className="w-14 text-[18px] text-gray-300">{r.label}</span>
                <div className="relative h-9 w-[380px] overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <Grow value={r.v / GLY_PRE} color={C.glycogen} delay={i * 0.15} />
                </div>
                <span className="font-mono text-[20px] tabular-nums text-white">{r.v}</span>
            </div>
        ))}
        <div className="flex items-center gap-3 pl-[72px]">
            <span className="text-[22px] font-semibold" style={{ color: C.glycogenSoft }}>−{MEAN_DROP}% na média do músculo</span>
        </div>
    </div>
);

/** Dois tiros de 30 m largam juntos; o do fim do jogo chega ~0,8 m atrás. */
const Sprint = ({ run }: { run: boolean }) => {
    const reduce = useReducedMotion();
    const x0 = 24;
    const x1 = 520;
    const at = (m: number) => x0 + ((x1 - x0) * m) / 30;
    const lanes = [{ y: 52, label: 'início do jogo', end: 30, color: C.text }, { y: 122, label: 'fim do jogo', end: 30 - LAG_M, color: C.risk }];
    return (
        <svg viewBox="0 0 560 170" width={560} height={170} role="img" aria-label="Tiro de 30 m: o do fim do jogo chega cerca de 0,8 m atrás">
            {[0, 10, 20, 30].map(m => <SvgText key={m} x={at(m)} y={166} text={`${m} m`} anchor="middle" size={16} color={C.muted} weight={500} />)}
            <line x1={at(30)} x2={at(30)} y1={20} y2={146} stroke={C.text} strokeWidth={3} strokeDasharray="6 6" />
            {lanes.map(l => (
                <g key={l.label}>
                    <SvgText x={x0} y={l.y - 22} text={l.label} size={17} color={l.color} />
                    <line x1={x0} x2={x1} y1={l.y} y2={l.y} stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
                    <motion.g initial={false} animate={{ x: run ? at(l.end) - x0 : 0 }}
                        transition={{ duration: run && !reduce ? 1.1 : 0, ease: EASE_OUT }}>
                        <rect x={x0 - 7} y={l.y - 16} width={14} height={32} rx={4} fill={l.color} />
                    </motion.g>
                </g>
            ))}
        </svg>
    );
};

export default function SoccerFibersSim() {
    const { step } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <SimBox className="flex flex-col">
            <div className="flex min-h-0 flex-1 gap-10">
                <div className="flex flex-col gap-3">
                    <span className="text-[16px] text-gray-300">corte do vasto lateral · 1 fibra = 1%</span>
                    <FiberMosaic emptied={step >= 1} emptyCount={EMPTY_PCT} />
                    <Legend />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-baseline gap-3">
                            <CountUp text={s.minute} duration={1.1} className="font-display font-bold leading-none text-white" style={{ fontSize: 80 }} />
                            <span className="text-[20px] text-gray-300">minuto</span>
                        </div>
                        <Chips beat={step}>
                            <DesignChip>{DESIGN}</DesignChip>
                            <IllustrativeChip />
                            {step >= 2 && <CalcChip />}
                        </Chips>
                    </div>
                    <Say beat={step} className="mt-4 min-h-[68px]">{s.say}</Say>

                    <div className="relative mt-5 flex-1">
                        <Reveal show={step === 0} className="absolute inset-0 flex flex-col gap-2">
                            <Big color={C.glycogenSoft} size={80}>{GLY_PRE}</Big>
                            <span className="text-[20px] text-gray-200">mmol/kg de peso seco antes do jogo</span>
                        </Reveal>
                        <Reveal show={step === 1} className="absolute inset-0 flex flex-col gap-2">
                            <CountUp text={`${EMPTY_PCT}%`} run={step === 1} className="font-display font-bold leading-none" style={{ color: C.glycogenSoft, fontSize: 96 }} />
                            <span className="text-[20px] text-gray-200">das fibras vazias ou quase vazias</span>
                        </Reveal>
                        <Reveal show={step === 2} className="absolute inset-0">{step === 2 && <MeanBars />}</Reveal>
                        <Reveal show={step === 3} className="absolute inset-0 flex flex-col gap-2">
                            <Sprint run={step === 3} />
                            <span className="text-[20px] font-semibold" style={{ color: C.risk }}>~{br(LAG_M)} m atrás na chegada</span>
                        </Reveal>
                    </div>
                </div>
            </div>
            <SourceLine>{SOURCE}</SourceLine>
        </SimBox>
    );
}
