import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Equal, HelpCircle } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Beat, Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { br } from './kit/format';
import { C, PANEL_BG } from './kit/palette';
import { Lead, SimFrame } from './ato6/Frame';
import { DESIGN, DOSES, LEADS, LEDGER, SOURCES, type Mark } from './ato6/highdose.content';

/**
 * Slide 105 · 120 g/h: o que se sabe. À esquerda, três colunas de dose (oxidação exógena sobe; sintomas GI sobem junto);
 * à direita, um livro-caixa que se preenche: o que foi medido, o que não mudou e o que ninguém demonstrou.
 */

const OX_MAX = 1.8;
const BAR_H = 210;

const MARK: Record<Mark, { Icon: typeof ArrowUp; color: string }> = {
    up: { Icon: ArrowUp, color: C.glucose },
    down: { Icon: ArrowDown, color: C.ok },
    same: { Icon: Equal, color: C.co2 },
    none: { Icon: HelpCircle, color: C.stone },
};

const Columns = ({ step }: { step: number }) => (
    <div className="flex items-end gap-7">
        {DOSES.map((d, i) => (
            <div key={d.gh} className="flex w-[130px] flex-col items-center gap-2">
                <CountUp text={br(d.ox, 2)} delay={stagger(i, 0.2, 0.15)} className="font-display text-[34px] font-bold leading-none" style={{ color: C.glucose }} />
                <div className="relative w-full overflow-hidden rounded-t-xl bg-white/5" style={{ height: BAR_H }}>
                    <div className="absolute inset-x-0 bottom-0" style={{ height: `${(d.ox / OX_MAX) * 100}%` }}>
                        <Grow value={1} axis="y" color={C.glucose} delay={stagger(i, 0.1, 0.15)} />
                    </div>
                </div>
                <span className="text-[22px] font-semibold text-white">{d.gh} g/h</span>
                <motion.span className="whitespace-nowrap rounded-lg px-3 py-1 text-[17px] font-semibold"
                    style={{ background: d.gi === 'pico' ? C.risk : 'rgba(244,63,94,0.18)', color: d.gi === 'pico' ? '#04080F' : '#FDA4AF' }}
                    initial={false} animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 6 }}
                    transition={{ delay: step >= 1 ? stagger(i, 0.15, 0.12) : 0, duration: DUR.enter, ease: EASE_OUT }}>
                    {d.gi}
                </motion.span>
            </div>
        ))}
        <span className="flex w-[118px] flex-col gap-[60px] text-[18px] leading-snug text-gray-400">
            <span>g/min oxidados, 2ª hora</span>
            <motion.span initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} style={{ color: '#FDA4AF' }}>sintomas GI</motion.span>
        </span>
    </div>
);

const Ledger = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-2">
        {LEDGER.filter(r => r.from <= step).map((r, i) => {
            const { Icon, color } = MARK[r.mark];
            const verdict = r.mark === 'none';
            return (
                <motion.div key={r.label} className="flex items-center gap-4 rounded-xl px-4 py-2.5"
                    style={verdict ? { background: C.stone } : PANEL_BG}
                    initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: stagger(i, 0.15, 0.1), duration: DUR.enter, ease: EASE_OUT }}>
                    <Icon size={26} strokeWidth={3} color={verdict ? '#04080F' : color} aria-hidden />
                    <span className="flex flex-col">
                        <span className="text-[21px] font-semibold" style={{ color: verdict ? '#04080F' : '#fff' }}>{r.label}</span>
                        <span className="text-[18px]" style={{ color: verdict ? '#1F2937' : '#D1D5DB' }}>{r.value}</span>
                    </span>
                </motion.div>
            );
        })}
    </div>
);

export default function HighDoseSim() {
    const { step } = useSlideSteps(4);
    return (
        <SimFrame
            lead={<Beat beat={`l${step}`}><Lead>{LEADS[step]}</Lead></Beat>}
            chips={<DesignChip>{DESIGN[step]}</DesignChip>}
            source={SOURCES[step]}>
            <div className="flex h-full items-center gap-10">
                <div className="shrink-0"><Columns step={step} /></div>
                <div className="flex min-w-0 flex-1 flex-col gap-3"><Ledger step={step} /></div>
            </div>
        </SimFrame>
    );
}
