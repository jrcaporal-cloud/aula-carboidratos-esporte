import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Source } from './kit/ui';
import { DesignChip } from './kit/chips';
import { Phrase } from './ato7/parts';
import { CONDITIONS, SOURCE, STEPS, UNIT, type Pan } from './ato7/protein.content';

/**
 * Slide 122 · Proteína ajuda? Depende.
 * Uma balança: o prato que repõe mais glicogênio desce. Ela pende para a proteína só em duas condições,
 * que vão se acendendo no caderno à direita. Nas meta-análises, o travessão fica nivelado.
 */
const BOX_W = 780;
const BOX_H = 360;
const PIVOT = { x: BOX_W / 2, y: 70 };
const ARM = 250;
const HANG = 50;
const PAN_W = 270;
const settle = { type: 'spring', duration: 0.9, bounce: 0.15 } as const;

const PanBox = ({ pan, side, tilt }: { pan: Pan; side: -1 | 1; tilt: number }) => {
    const reduce = useReducedMotion();
    const dy = side * ARM * Math.sin((tilt * Math.PI) / 180);
    const color = pan.kind === 'cho' ? C.glucose : C.protein;
    return (
        <motion.div className="absolute flex flex-col items-center" style={{ left: PIVOT.x + side * ARM - PAN_W / 2, top: PIVOT.y, width: PAN_W }}
            animate={{ y: dy }} transition={reduce ? { duration: 0 } : settle}>
            <span aria-hidden className="block w-[3px] bg-white/60" style={{ height: HANG }} />
            <div className="flex w-full flex-col items-center gap-1 rounded-2xl border-[3px] px-3 py-3 text-center" style={{ ...PANEL_BG, background: '#04080F', borderColor: color }}>
                <span className="text-[20px] font-semibold leading-tight text-white">{pan.label}</span>
                {pan.value && (
                    <span className="flex items-baseline gap-2">
                        <span className="font-display text-[44px] font-bold leading-none tabular-nums" style={{ color }}>{pan.value}</span>
                        <span className="text-[16px] text-gray-300">{UNIT}</span>
                    </span>
                )}
            </div>
        </motion.div>
    );
};

const Balance = ({ step }: { step: number }) => {
    const reduce = useReducedMotion();
    const s = STEPS[step];
    return (
        <div className="relative shrink-0" style={{ width: BOX_W, height: BOX_H }}>
            {/* coluna e base */}
            <span aria-hidden className="absolute w-3 rounded-full" style={{ left: PIVOT.x - 6, top: PIVOT.y, height: BOX_H - PIVOT.y - 10, background: C.co2 }} />
            <span aria-hidden className="absolute h-3 rounded-full" style={{ left: PIVOT.x - 110, width: 220, bottom: 4, background: C.co2 }} />
            {/* travessão */}
            <motion.span aria-hidden className="absolute h-3 rounded-full"
                style={{ left: PIVOT.x - ARM - 8, width: 2 * ARM + 16, top: PIVOT.y - 6, background: C.text, transformOrigin: '50% 50%' }}
                animate={{ rotate: s.tilt }} transition={reduce ? { duration: 0 } : settle} />
            <span aria-hidden className="absolute h-6 w-6 rounded-full" style={{ left: PIVOT.x - 12, top: PIVOT.y - 12, background: C.co2 }} />
            <PanBox pan={s.left} side={-1} tilt={s.tilt} />
            <PanBox pan={s.right} side={1} tilt={s.tilt} />
            {s.effect && (
                <motion.div key={s.effect} className="absolute flex justify-center" style={{ left: 0, right: 0, bottom: 34 }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: DUR.enter, ease: EASE_OUT }}>
                    <span className="rounded-lg px-3 py-1 text-[20px] font-semibold tabular-nums" style={{ background: C.stone, color: '#04080F' }}>{s.effect}</span>
                </motion.div>
            )}
        </div>
    );
};

const Notebook = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-5 pt-4">
        <span className="font-display text-[32px] font-semibold leading-none text-white">Só ajuda se…</span>
        {CONDITIONS.map(c => {
            const on = step >= c.from;
            return (
                <div key={c.text} className="flex items-start gap-3 transition-opacity duration-300" style={{ opacity: on ? 1 : 0 }}>
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-[3px]"
                        style={{ borderColor: on ? C.ok : 'rgba(255,255,255,0.3)', background: on ? C.ok : 'transparent' }}>
                        {on && <Check size={20} strokeWidth={3.5} color="#04080F" aria-hidden />}
                    </span>
                    <span className="text-[22px] leading-snug text-white">{c.text}</span>
                </div>
            );
        })}
        <span className="text-[18px] leading-snug text-gray-300 transition-opacity duration-300" style={{ opacity: step === 4 ? 1 : 0 }}>
            Fora disso, a prioridade é carboidrato cedo e regular.
        </span>
    </div>
);

export default function ProteinCoSim() {
    const { step } = useSlideSteps(STEPS.length);
    return (
        <div className="not-prose flex flex-col gap-3">
            <div className="flex items-start justify-between gap-6">
                <div className="min-h-[68px]"><Phrase beat={step} width={780}>{STEPS[step].phrase}</Phrase></div>
                <div className="pt-1"><DesignChip>{STEPS[step].design}</DesignChip></div>
            </div>
            <div className="flex items-start gap-8">
                <Balance step={step} />
                <Notebook step={step} />
            </div>
            <Source>{SOURCE}</Source>
        </div>
    );
}
