import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { br } from './kit/format';
import { CalcChip, DesignChip } from './kit/chips';
import { Foot, Lead, SimBox } from './ato4/frame';
import { DIMMER, IMPEY, LAMPS, SIGNAL_LEADS, SIGNAL_SOURCE, type Lamp } from './ato4/signal.content';

/**
 * Slide 69 · o glicogênio como dimmer: à esquerda, o botão desliza entre 467 e 103 mmol/kg (clicável);
 * à direita, as lâmpadas AMPK → p53 → PGC-1α acendem pela força do sinal. No fim, a conta de Impey: sinal × desempenho.
 */

const TRACK_H = 300;
const knobY = (v: number) => TRACK_H * (1 - v / DIMMER.max);

const Dimmer = ({ low, onPick }: { low: boolean; onPick: (low: boolean) => void }) => {
    const reduce = useReducedMotion() ?? false;
    const value = low ? DIMMER.low : DIMMER.high;
    return (
        <div className="flex items-start gap-5">
            <div className="relative w-[44px] rounded-full bg-white/[0.08]" style={{ height: TRACK_H }}>
                <motion.div className="absolute bottom-0 left-0 right-0 origin-bottom rounded-full" style={{ height: TRACK_H, background: C.glycogen }}
                    initial={false} animate={{ scaleY: value / DIMMER.max }} transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }} />
                <motion.div className="absolute left-[-10px] top-0 h-[22px] w-[64px] rounded-md border-[3px] border-[#04080F]" style={{ background: C.stone }}
                    initial={false} animate={{ y: knobY(value) - 11 }} transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }} />
            </div>
            <div className="relative" style={{ height: TRACK_H, width: 150 }}>
                {([['alto', DIMMER.high, false], ['baixo', DIMMER.low, true]] as const).map(([label, v, isLow]) => (
                    <button key={label} type="button" onClick={() => onPick(isLow)} aria-pressed={low === isLow}
                        className="absolute left-0 flex -translate-y-1/2 cursor-pointer flex-col items-start text-left"
                        style={{ top: knobY(v), opacity: low === isLow ? 1 : 0.6 }}>
                        <span className="font-display text-[34px] font-semibold leading-none text-white">{v}</span>
                        <span className="text-[17px] text-gray-300">glicogênio {label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const LampView = ({ lamp, low, shown }: { lamp: Lamp; low: boolean; shown: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    const fold = low ? lamp.low : lamp.high;
    return (
        <div className="flex flex-col items-center gap-3 transition-opacity duration-300" style={{ opacity: shown ? 1 : 0.6 }}>
            <div className="relative h-[104px] w-[104px] rounded-full border-[3px]" style={{ borderColor: C.caveat, background: '#0B1220' }}>
                <motion.div className="absolute inset-[6px] rounded-full" style={{ background: C.stone }} initial={false}
                    animate={{ opacity: shown ? Math.min(1, fold / 3) : 0 }} transition={{ duration: reduce ? 0 : DUR.morph, ease: EASE_OUT }} />
            </div>
            <span className="font-display text-[34px] font-semibold leading-none text-white">{shown ? `${br(fold, fold % 1 ? 1 : 0)}×` : '?'}</span>
            <span className="font-display text-[26px] font-semibold text-white">{lamp.name}</span>
            <span className="text-[17px] text-gray-300">
                {low && shown && lamp.low !== lamp.high ? `alto: ${br(lamp.high, 1)}×` : lamp.id === 'pgc' && shown ? 'igual nos dois' : lamp.note}
            </span>
        </div>
    );
};

const Lamps = ({ step }: { step: number }) => (
    <div className="flex items-start gap-6">
        {LAMPS.map((l, i) => (
            <div key={l.id} className="flex items-start gap-6">
                {i > 0 && <ArrowRight size={34} strokeWidth={3} color={C.co2} className="mt-[36px]" aria-hidden />}
                <LampView lamp={l} low={step >= 1} shown={step >= l.from} />
            </div>
        ))}
    </div>
);

/** Impey 2018 em pontos: 11 estudos por linha, acesos os que mostraram efeito. */
const Count = () => (
    <div className="flex flex-col gap-6">
        {IMPEY.map((row, r) => (
            <div key={row.label} className="flex items-center gap-5">
                <span className="w-[96px] font-display text-[44px] font-semibold leading-none" style={{ color: r === 0 ? C.stone : C.ok }}>{row.pct}%</span>
                <div className="flex gap-[6px]">
                    {Array.from({ length: 11 }, (_, i) => (
                        <motion.span key={i} className="block h-[26px] w-[26px] rounded-full" initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, backgroundColor: i < row.of11 ? (r === 0 ? C.stone : C.ok) : '#2A3140' }}
                            transition={{ delay: Math.min(i * 0.03, 0.3) + r * 0.2, duration: DUR.enter, ease: EASE_OUT }} />
                    ))}
                </div>
                <span className="text-[20px] text-gray-100">{row.label}</span>
            </div>
        ))}
        <span className="text-[22px] text-gray-200">O sinal vira tempo no cronômetro? É a pergunta do Ato VIII.</span>
    </div>
);

export default function GlycogenSignalSim() {
    const { step, setStep } = useSlideSteps(SIGNAL_LEADS.length);
    return (
        <SimBox>
            <Lead beat={step} chips={step === 3
                ? <><DesignChip>revisão · contagem de 11 estudos</DesignChip><CalcChip>≈ 8 e 4 de 11: arredondamento</CalcChip></>
                : <DesignChip>n = 8 homens ativos · corrida intervalada</DesignChip>} className="min-h-[72px]">{SIGNAL_LEADS[step]}</Lead>
            <div className="mt-5 flex flex-1 items-start gap-14">
                <Dimmer low={step >= 1} onPick={isLow => setStep(isLow ? 1 : 0)} />
                <div className="flex flex-1 items-center self-stretch pb-8">
                    {step === 3 ? <Count /> : <Lamps step={step} />}
                </div>
            </div>
            <Foot source={SIGNAL_SOURCE} />
        </SimBox>
    );
}
