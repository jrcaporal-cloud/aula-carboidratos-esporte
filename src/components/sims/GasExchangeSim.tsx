import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Wipe } from './kit/Beat';
import { BigStat } from './kit/Stamp';
import { CalcChip, DesignChip } from './kit/chips';
import { Frame } from './ato10/Frame';
import { DESIGNS, ERROR, ISOTOPE_STEPS, LINES, NEEDLE, RER_ONE, SARIS, SOURCE } from './ato10/gas.content';

/**
 * Slide 184 · Calorimetria e Isótopos. Esquema chapado O₂ → músculo → CO₂ com o mostrador do RER embaixo.
 * Passo 3: o tampão (bicarbonato) acende e empurra a agulha para além de 1,0. Passo 4: a trilha do 13C, do milho ao ar.
 */
const Pill = ({ label, color }: { label: string; color: string }) => (
    <span className="rounded-xl border-[3px] px-5 py-3 font-display text-[30px] font-bold" style={{ borderColor: color, color }}>{label}</span>
);

const Arrow = ({ color = C.co2 }: { color?: string }) => <ArrowRight size={40} strokeWidth={2.6} color={color} aria-hidden />;

const Diagram = ({ buffer }: { buffer: boolean }) => (
    <div className="flex items-center justify-center gap-5">
        <Pill label="O₂ entra" color={C.caveat} />
        <Arrow />
        <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-white/20 px-6 py-3" style={PANEL_BG}>
            <span className="text-[18px] text-gray-300">músculo</span>
            <div className="flex gap-2">
                <span className="rounded-lg px-3 py-1 text-[19px] font-semibold text-[#04080F]" style={{ background: C.glucose }}>carboidrato</span>
                <span className="rounded-lg px-3 py-1 text-[19px] font-semibold text-[#04080F]" style={{ background: C.fat }}>gordura</span>
            </div>
        </div>
        <Arrow />
        <Pill label="CO₂ sai" color={C.co2} />
        <motion.div className="flex items-center gap-3" initial={false}
            animate={{ opacity: buffer ? 1 : 0, x: buffer ? 0 : 12 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <span className="text-[30px] font-bold" style={{ color: C.stone }}>+</span>
            <span className="rounded-xl px-4 py-2 text-[20px] font-semibold text-[#04080F]" style={{ background: C.stone }}>CO₂ do bicarbonato</span>
        </motion.div>
    </div>
);

const RerGauge = ({ needle }: { needle: number }) => (
    <div className="flex flex-col gap-3 px-6">
        <div className="relative h-[28px]">
            <span className="absolute left-0 text-[20px] text-gray-200">RER = CO₂ que sai ÷ O₂ que entra</span>
            <span className="absolute -translate-x-1/2 font-mono text-[20px] font-semibold text-white" style={{ left: `${RER_ONE * 100}%` }}>1,0</span>
        </div>
        <div className="relative h-[54px] [container-type:inline-size]">
            <div className="absolute inset-y-[12px] left-0 rounded-l-xl" style={{ width: `${RER_ONE * 100}%`, background: 'rgba(190,242,100,0.22)' }} />
            <div className="absolute inset-y-[12px] right-0 rounded-r-xl" style={{ left: `${RER_ONE * 100}%`, background: 'rgba(244,63,94,0.30)' }} />
            <div className="absolute inset-y-0 w-[3px] bg-white" style={{ left: `${RER_ONE * 100}%` }} />
            <motion.div className="absolute inset-y-0 left-0 w-0" initial={false} animate={{ x: `${needle * 100}cqw` }}
                transition={{ duration: DUR.draw, ease: EASE_IN_OUT }}>
                <span className="absolute -left-[10px] top-0 block h-[54px] w-[20px] rounded-full border-[3px] border-[#04080F]" style={{ background: C.glucose }} />
            </motion.div>
        </div>
        <div className="relative h-[28px] text-[18px]">
            <span className="absolute left-0 text-gray-200">mais gordura</span>
            <span className="absolute -translate-x-full pr-4 text-gray-200" style={{ left: `${RER_ONE * 100}%` }}>mais carboidrato</span>
            <span className="absolute right-0" style={{ color: C.risk }}>a conta deixa de valer</span>
        </div>
    </div>
);

const ErrorView = () => (
    <div className="flex items-center gap-16 px-6">
        <BigStat value={ERROR.value} caption="erro na oxidação de carboidrato estimada" color={C.glucose} size={76} />
        <BigStat value={ERROR.perHour} caption="de incerteza por hora de exercício" color={C.glucoseSoft} size={56} delay={0.15} />
    </div>
);

const IsotopeFlow = () => (
    <div className="flex h-full flex-col justify-center gap-10 px-8">
        <div className="flex items-center justify-between">
            {ISOTOPE_STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-4">
                    <motion.div className="flex w-[210px] flex-col gap-1 rounded-2xl border-2 px-4 py-3" style={{ ...PANEL_BG, borderColor: i === 3 ? C.glucose : 'rgba(255,255,255,0.22)' }}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stagger(i, 0.25, 0.15), duration: DUR.enter, ease: EASE_OUT }}>
                        <span className="text-[24px] font-semibold text-white">{s.title}</span>
                        <span className="text-[17px] leading-snug text-gray-300">{s.sub}</span>
                    </motion.div>
                    {i < ISOTOPE_STEPS.length - 1 && <Arrow color={C.glucose} />}
                </div>
            ))}
        </div>
        <div className="flex flex-col gap-3">
            <span className="text-[20px] text-gray-200">Oxidação exógena média, medida pelo ¹³C:</span>
            <div className="flex items-end gap-14">
                <BigStat value={SARIS.soluble.value} caption={SARIS.soluble.caption} color={C.glucose} size={60} delay={0.6} />
                <BigStat value={SARIS.insoluble.value} caption={SARIS.insoluble.caption} color={C.co2} size={60} delay={0.75} />
            </div>
        </div>
    </div>
);

export default function GasExchangeSim() {
    const { step } = useSlideSteps(LINES.length);
    return (
        <Frame step={step} line={LINES[step]} chips={<><DesignChip>{DESIGNS[step]}</DesignChip>{step === 1 && <CalcChip>cálculo: × 60 min</CalcChip>}</>} source={SOURCE}>
            <div className="relative h-full">
                <div className="flex h-full flex-col justify-center gap-10">
                    <Diagram buffer={step === 2} />
                    {step === 1 ? <ErrorView /> : <RerGauge needle={NEEDLE[step]} />}
                </div>
                <Wipe show={step === 3} from="right" className="absolute inset-0 rounded-2xl border-2" style={{ background: '#060C17', borderColor: C.glucose }}>
                    {step === 3 && <IsotopeFlow />}
                </Wipe>
            </div>
        </Frame>
    );
}
