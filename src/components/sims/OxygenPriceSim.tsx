import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { CalcChip, DesignChip } from './kit/chips';
import { KeyFact, Reveal } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { MotorFrame, StepText } from './ato3/motorB';
import { rowEnter } from './ato3/motorBRow';
import { OxygenChain } from './ato3/OxygenChain';
import { FUELS, OXY_LEDGER, OXY_STEPS } from './ato3/oxygen.content';

/**
 * Slide 46 · O Preço do Oxigênio, no formato palco + painel. No palco, a cadeia respiratória com as duas portas
 * (NADH no complexo I, FADH₂ na ubiquinona) e, embaixo, quanto cada combustível usa cada porta e quanto O₂ pede
 * para o mesmo trabalho. No painel, o texto do passo e o livro-caixa carboidrato × gordura, que acumula.
 */

const ACCENT = [C.stone, C.fat, C.glucose, C.glucoseSoft] as const;
const SPACED = { wordSpacing: '0.18em' } as const;
const BAR_W = 200;
const O2_W = 80;

/** Barra de carreadores: parte cheia = NADH, parte vazada = FADH₂ (largura proporcional à contagem). */
const CarrierBar = ({ f, color, show }: { f: (typeof FUELS)[number]; color: string; show: boolean }) => {
    const total = f.nadh + f.fadh;
    return (
        <div className="flex flex-col gap-1">
            <div className="relative flex h-[30px] overflow-hidden rounded-md" style={{ width: BAR_W, background: 'rgba(255,255,255,0.06)' }}>
                {show && (
                    <>
                        <div className="relative h-full" style={{ width: `${(f.nadh / total) * 100}%` }}><Grow value={1} color={color} delay={0.15} /></div>
                        <motion.div className="h-full rounded-r-md border-[3px]" style={{ width: `${(f.fadh / total) * 100}%`, borderColor: color }}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter, delay: 0.7, ease: EASE_OUT }} />
                    </>
                )}
            </div>
            <span className="text-[16px] tabular-nums text-gray-200" style={{ opacity: show ? 1 : 0 }}>
                {f.nadh} NADH · <b style={{ color }}>{f.fadh} FADH₂</b>
            </span>
        </div>
    );
};

const FuelRows = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-2 px-3">
        <div className="grid items-end gap-3 text-[16px] font-semibold text-gray-300" style={{ gridTemplateColumns: `108px ${BAR_W}px 96px 1fr` }}>
            <span>por molécula</span>
            <span style={{ opacity: step >= 1 ? 1 : 0 }}>NADH (cheio) · FADH₂</span>
            <span style={{ opacity: step >= 1 ? 1 : 0 }}>porta FADH₂</span>
            <span className="whitespace-nowrap" style={{ opacity: step >= 2 ? 1 : 0 }}>O₂, mesma carga</span>
        </div>
        {FUELS.map((f, i) => {
            const color = f.key === 'cho' ? C.glucose : C.fat;
            return (
                <div key={f.key} className="grid items-center gap-3" style={{ gridTemplateColumns: `108px ${BAR_W}px 96px 1fr` }}>
                    <span className="text-[20px] font-bold" style={{ color }}>{f.label}</span>
                    <CarrierBar f={f} color={color} show={step >= 1} />
                    <span className="font-display text-[24px] font-bold" style={{ color, opacity: step >= 1 ? 1 : 0, ...SPACED }}>{f.share}</span>
                    <div className="flex items-center gap-3" style={{ opacity: step >= 2 ? 1 : 0 }}>
                        <div className="relative h-[30px] overflow-hidden rounded-md" style={{ width: O2_W, background: 'rgba(255,255,255,0.06)' }}>
                            {step >= 2 && <Grow value={f.o2 / 1.1} color="#CBD5E1" delay={0.2 + i * 0.15} />}
                        </div>
                        {step >= 2 && <CountUp text={f.o2Text} delay={0.2 + i * 0.15} className="whitespace-nowrap font-display text-[22px] font-bold text-white" style={SPACED} />}
                    </div>
                </div>
            );
        })}
    </div>
);

const Ledger = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-[3px] text-left">
        <thead>
            <tr className="text-[15px] text-gray-300">
                <th className="font-normal">P/O: NADH 2,5 · FADH₂ 1,5</th>
                <th className="text-right font-normal" style={{ color: C.glucoseSoft }}>carboidrato</th>
                <th className="text-right font-normal" style={{ color: C.fat }}>gordura</th>
            </tr>
        </thead>
        <tbody>
            {OXY_LEDGER.filter(r => r.at <= step).map((r, i) => (
                <motion.tr key={r.label} {...rowEnter(r.at === step, i)}
                    className={r.total ? 'text-[20px] font-bold' : 'text-[17px] font-semibold'} style={{ color: r.total ? C.glucoseSoft : '#F3F4F6' }}>
                    <td className="whitespace-nowrap">{r.label}</td>
                    <td className="whitespace-nowrap text-right tabular-nums">{r.cho}</td>
                    <td className="whitespace-nowrap text-right tabular-nums">{r.total && r.at === step ? <KeyFact color={C.fat} delay={0.8}>{r.fat}</KeyFact> : r.fat}</td>
                </motion.tr>
            ))}
        </tbody>
    </table>
);

export default function OxygenPriceSim() {
    const { step, setStep } = useSlideSteps(OXY_STEPS.length);
    const s = OXY_STEPS[step];
    const chips = (
        <>
            {s.design.map(d => <DesignChip key={d}>{d}</DesignChip>)}
            {s.calc && <CalcChip>{s.calc}</CalcChip>}
        </>
    );
    return (
        <MotorFrame tabs={OXY_STEPS.map(o => o.tab)} step={step} setStep={setStep} layoutId="oxy-tabs" chips={chips}>
            <Panel className="flex w-[640px] shrink-0 flex-col gap-2 px-2 pb-3 pt-2">
                <OxygenChain step={step} />
                <FuelRows step={step} />
            </Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} />
                {s.stat && (
                    <Reveal key={`stat-${step}`} order={1} className="flex items-baseline gap-3">
                        <KeyFact color={C.stone} delay={0.3}>
                            <span className="whitespace-nowrap font-display text-[48px] font-bold leading-none text-white" style={SPACED}>{s.stat.value}</span>
                        </KeyFact>
                        <span className="text-[17px] leading-snug text-gray-200">{s.stat.caption}</span>
                    </Reveal>
                )}
                <div className="mt-auto flex flex-col gap-2">
                    <Ledger step={step} />
                    <Source>{sourcesUpTo(OXY_STEPS.map(o => o.sources), step)}</Source>
                </div>
            </Panel>
        </MotorFrame>
    );
}
