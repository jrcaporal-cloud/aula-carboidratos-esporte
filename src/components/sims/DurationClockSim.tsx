import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { DesignChip, FictionsChip } from './kit/chips';
import { C } from './kit/palette';
import { KeyFact } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { Source } from './kit/ui';
import { ClockDial, DIAL_RENDER } from './ato6/ClockDial';
import { CASES, CLOCK_STEPS, ROWS, type ClockRow } from './ato6/clock.content';
import { PcFrame, PcHead } from './ato6/pcFrame';

/**
 * Slide 112 · O Relógio da Prova, a síntese prática do Ato VI. À esquerda, um relógio de 12 h: as faixas do
 * consenso acendem uma por passo, o anel tracejado dos 120 g/h entra no 4º e Marina e Diego pousam no 5º.
 * À direita, o quadro "duração → quanto → o quê e por quê", que ganha uma linha por passo e nunca perde nenhuma.
 * O quadro final é o que o aluno fotografaria.
 */

const STAGE_W = DIAL_RENDER + 28;
const GRID = 'grid grid-cols-[118px_136px_1fr] items-center gap-x-3';

const BoardRow = ({ r, step }: { r: ClockRow; step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const fresh = r.at === step;
    const current = r.at === step || (step === 4 && r.id === 'longa');
    return (
        <motion.div className={`${GRID} rounded-xl px-2 py-0.5`}
            style={{ background: current ? `${r.color}24` : 'transparent', transition: 'background-color 300ms' }}
            initial={reduce ? false : { opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: DUR.enter, delay: fresh ? 0.35 : 0, ease: EASE_OUT }}>
            <span className="flex flex-col leading-tight">
                <span className="flex items-center gap-2 whitespace-nowrap text-[20px] font-bold text-white">
                    <span aria-hidden className="h-3 w-3 shrink-0 rounded-full" style={{ background: r.color }} />
                    {r.duration}
                </span>
                <span className="pl-5 text-[16px] text-gray-300">{r.durationSub}</span>
            </span>
            <span className="font-display text-[23px] font-bold leading-none tabular-nums" style={{ color: r.color }}>
                {fresh ? <KeyFact color={r.color} delay={0.55}>{r.dose}</KeyFact> : r.dose}
            </span>
            <span className="flex flex-col leading-tight">
                <span className="text-[17px] text-gray-50">{r.how}</span>
                <span className="text-[16px] text-gray-300">{r.why}</span>
            </span>
        </motion.div>
    );
};

const Board = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-0.5 border-t-2 border-white/15 pt-1.5">
        {ROWS.filter(r => r.at <= step).map(r => <BoardRow key={r.id} r={r} step={step} />)}
    </div>
);

/** Legenda sob o mostrador: o que é o anel, o tracejado e as letras. */
const DialLegend = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-1 px-4 text-[16px] leading-snug text-gray-200">
        {step < 4 && <span>o anel é a duração da prova: a largada é no 12</span>}
        {step >= 4 && CASES.map(c => (
            <motion.span key={c.id} className="flex items-center gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR.enter, delay: 0.5, ease: EASE_OUT }}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-50 text-[16px] font-extrabold text-[#04080F]">{c.letter}</span>
                <span><strong className="text-white">{c.label}</strong> · {c.detail}</span>
            </motion.span>
        ))}
        {step >= 4 && <span className="pl-8 text-gray-300">os dois: &gt; 2,5 h → até 90 g/h, com mistura</span>}
    </div>
);

export default function DurationClockSim() {
    const { step, setStep } = useSlideSteps(CLOCK_STEPS.length);
    const s = CLOCK_STEPS[step];
    return (
        <PcFrame tabs={CLOCK_STEPS.map(c => c.tab)} step={step} onSelect={setStep} layoutId="clock-tabs" stageWidth={STAGE_W}
            chips={<>
                {s.chips.map(c => <DesignChip key={c}>{c}</DesignChip>)}
                {step === 4 && <FictionsChip />}
            </>}
            stage={
                <div className="flex h-full flex-col items-center justify-center gap-1 pt-1">
                    <ClockDial step={step} />
                    <DialLegend step={step} />
                </div>
            }
            panel={<>
                <PcHead step={step} color={s.color === C.text ? '#F9FAFB' : s.color} headline={s.headline} text={s.text} />
                <Board step={step} />
                <div className="mt-auto"><Source>{sourcesUpTo(CLOCK_STEPS.map(c => c.sources), step)}</Source></div>
            </>}
        />
    );
}
