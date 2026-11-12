import { motion, useReducedMotion } from 'framer-motion';
import { Timer } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Source, SvgText } from './kit/ui';
import { CountUp } from './kit/CountUp';
import { Wipe } from './kit/Beat';
import { CalcChip, DesignChip } from './kit/chips';
import { HeadRow, Phrase } from './ato7/parts';
import { ARMS, DESIGN, FACTS, FLOOR, FLOOR_BAND, PHRASES, SOURCE, X_MAX, Y_MAX, type ArmId } from './ato7/shortRecovery.content';

/**
 * Slide 121 · Quatro horas entre duas sessões.
 * Um dia em faixa (corrida → 4 h → corrida) e, embaixo, a segunda corrida: o glicogênio de cada braço desce
 * até o mesmo piso enquanto os cronômetros correm; 48 min param primeiro, 80 min seguem.
 */
const W = 700;
const H = 290;
const PAD = { l: 64, r: 24, t: 20, b: 44 };
const RUN_S = 1.2;
const sx = (m: number) => PAD.l + (m / X_MAX) * (W - PAD.l - PAD.r);
const sy = (g: number) => PAD.t + (1 - g / Y_MAX) * (H - PAD.t - PAD.b);
const COLOR: Record<ArmId, string> = { high: C.glucose, low: C.co2 };
/** Segundos até a revelação linear chegar ao minuto m (os cronômetros param junto com a linha). */
const reachAt = (m: number) => (sx(m) / W) * RUN_S;

const DayStrip = ({ step }: { step: number }) => (
    <div className="flex gap-3">
        {['corrida 1 até a exaustão', '4 h de recuperação · CHO a cada 30 min', 'corrida 2 até a exaustão'].map((label, i) => {
            const on = i === 1 ? step <= 1 : i === 2 ? step === 2 : step === 0;
            const recovery = i === 1;
            return (
                <div key={label} className="flex h-14 items-center justify-center rounded-xl border-2 px-4 text-[20px] font-semibold transition-colors duration-300"
                    style={{
                        flex: recovery ? 2 : 1,
                        borderColor: on ? (recovery ? C.glucose : C.text) : 'rgba(255,255,255,0.18)',
                        color: on ? '#fff' : '#9CA3AF', ...PANEL_BG,
                    }}>
                    {label}
                </div>
            );
        })}
    </div>
);

const Chart = ({ step }: { step: number }) => {
    const reduce = useReducedMotion();
    const run = step >= 2;
    return (
        <div className="relative shrink-0" style={{ width: W, height: H }}>
            <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="absolute inset-0" aria-hidden>
                <g style={{ opacity: step >= 2 ? 1 : 0, transition: 'opacity 300ms ease-out' }}>
                <rect x={PAD.l} y={sy(FLOOR_BAND[1] + 6)} width={W - PAD.l - PAD.r} height={sy(FLOOR_BAND[0] - 6) - sy(FLOOR_BAND[1] + 6)} fill={`${C.stone}33`} />
                <SvgText x={W - PAD.r - 6} y={sy(FLOOR) + 34} text={`piso na exaustão: ~${FLOOR}`} anchor="end" color={C.stone} size={18} />
                </g>
                <line x1={PAD.l} x2={W - PAD.r} y1={sy(0)} y2={sy(0)} stroke="rgba(255,255,255,0.45)" strokeWidth={2} />
                <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={sy(0)} stroke="rgba(255,255,255,0.45)" strokeWidth={2} />
                {[0, 100, 200, 300].map(g => <SvgText key={g} x={PAD.l - 10} y={sy(g) + 6} text={`${g}`} anchor="end" size={16} color="#D1D5DB" />)}
                {[0, 30, 60, 90].map(m => <SvgText key={m} x={sx(m)} y={H - 14} text={`${m} min`} anchor="middle" size={16} color="#D1D5DB" />)}
                {ARMS.map(a => (
                    <g key={a.id} style={{ opacity: step >= 1 ? 1 : 0, transition: 'opacity 300ms ease-out' }}>
                        <circle cx={sx(0)} cy={sy(a.start)} r={8} fill={COLOR[a.id]} />
                        <SvgText x={sx(0) + 16} y={sy(a.start) + (a.id === 'high' ? -8 : 26)} text={`${a.start}`} color={COLOR[a.id]} size={28} weight={700} />
                    </g>
                ))}
            </svg>
            {/* a 2ª corrida: revelação linear da esquerda para a direita, como um cronômetro */}
            <motion.svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="absolute inset-0" aria-hidden
                initial={false}
                animate={{ clipPath: run ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)' }}
                transition={{ duration: reduce || !run ? 0 : RUN_S, ease: 'linear' }}>
                {ARMS.map(a => (
                    <g key={a.id}>
                        <line x1={sx(0)} y1={sy(a.start)} x2={sx(a.minutes)} y2={sy(FLOOR)} stroke={COLOR[a.id]} strokeWidth={6} strokeLinecap="round" />
                        <circle cx={sx(a.minutes)} cy={sy(FLOOR)} r={11} fill="#04080F" stroke={COLOR[a.id]} strokeWidth={5} />
                    </g>
                ))}
            </motion.svg>
            <span className="absolute left-0 top-0 -translate-y-1 text-[16px] text-gray-300" style={{ left: PAD.l + 12 }}>glicogênio, mmol/kg (peso seco)</span>
        </div>
    );
};

const Watch = ({ step, id }: { step: number; id: ArmId }) => {
    const arm = ARMS.find(a => a.id === id);
    if (!arm) return null;
    return (
        <div className="flex items-center gap-4">
            <Timer size={44} strokeWidth={2.5} color={COLOR[id]} aria-hidden />
            <div className="flex flex-col">
                <span className="text-[18px] text-gray-200">recuperou com {arm.dose}</span>
                <CountUp text={step >= 2 ? `${arm.minutes} min` : '0 min'} run={step >= 2} duration={reachAt(arm.minutes)}
                    className="font-display text-[68px] font-bold leading-none"
                    style={{ color: step >= 2 ? COLOR[id] : 'rgba(255,255,255,0.18)' }} />
            </div>
        </div>
    );
};

export default function ShortRecoverySim() {
    const { step } = useSlideSteps(PHRASES.length);
    const rule = step === 3;
    return (
        <div className="not-prose flex flex-col gap-3">
            <HeadRow chips={<><DesignChip>{DESIGN}</DesignChip>{step === 2 && <CalcChip>reta entre duas medidas</CalcChip>}</>}>
                <Phrase beat={step} width={780}>{PHRASES[step]}</Phrase>
            </HeadRow>
            <DayStrip step={step} />
            <div className="relative flex items-center gap-10">
                <motion.div animate={{ opacity: rule ? 0 : 1 }} transition={{ duration: DUR.enter }} className="flex items-center gap-10">
                    <Chart step={step} />
                    <div className="flex flex-col gap-6">
                        <Watch step={step} id="high" />
                        <Watch step={step} id="low" />
                    </div>
                </motion.div>
                {rule && (
                    <Wipe from="left" className="absolute inset-y-6 left-10 right-10 flex items-center gap-12 rounded-2xl border-2 px-10"
                        style={{ ...PANEL_BG, background: '#04080F', borderColor: `${C.glucose}99` }}>
                        {FACTS.map((f, i) => (
                            <motion.div key={f.big} className="flex flex-1 flex-col gap-2"
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 + i * 0.12, duration: DUR.enter, ease: EASE_OUT }}>
                                <span className="font-display text-[72px] font-bold leading-none" style={{ color: C.glucose }}>{f.big}</span>
                                <span className="text-[22px] leading-snug text-white">{f.text}</span>
                                <span className="text-[16px] text-gray-300">{f.ref}</span>
                            </motion.div>
                        ))}
                    </Wipe>
                )}
            </div>
            <Source>{SOURCE}</Source>
        </div>
    );
}
