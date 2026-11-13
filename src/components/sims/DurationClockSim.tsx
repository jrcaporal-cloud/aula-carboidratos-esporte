import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { DesignChip } from './kit/chips';
import { BODY_FONT, C } from './kit/palette';
import { KeyFact } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source, StepTabs } from './kit/ui';
import { DurationBar } from './ato6/DurationBar';
import { CLOCK_STEPS, ROWS, type ClockRow } from './ato6/clock.content';
import { PC_H, PcHead } from './ato6/pcFrame';

/**
 * Slide 112 · O Relógio da Prova, a síntese prática do Ato VI. Em cima, o palco em largura total: a barra da
 * DURAÇÃO da prova (0 a 10+ h), cujas faixas acendem uma por passo; a fronteira de 120 g/h e a ultramaratona
 * entram em trilhos rotulados; Marina e Diego viram pinos no 5º passo. Embaixo, o texto do passo e o quadro
 * "duração → quanto → o quê e por quê", que ganha uma linha por passo e nunca perde nenhuma (o que o aluno fotografa).
 */

const GRID = 'grid grid-cols-[104px_118px_1fr] items-center gap-x-3';

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
                <span className="flex items-center gap-2 whitespace-nowrap text-[18px] font-bold text-white">
                    <span aria-hidden className="h-3 w-3 shrink-0 rounded-full" style={{ background: r.color }} />
                    {r.duration}
                </span>
                <span className="pl-5 text-[16px] text-gray-300">{r.durationSub}</span>
            </span>
            <span className="font-display text-[20px] font-bold leading-none tabular-nums" style={{ color: r.color }}>
                {fresh ? <KeyFact color={r.color} delay={0.55}>{r.dose}</KeyFact> : r.dose}
            </span>
            <span className="flex flex-col leading-tight">
                <span className="text-[16px] text-gray-50">{r.how}</span>
                <span className="text-[16px] text-gray-300">{r.why}</span>
            </span>
        </motion.div>
    );
};

const Board = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-0.5">
        {ROWS.filter(r => r.at <= step).map(r => <BoardRow key={r.id} r={r} step={step} />)}
    </div>
);

export default function DurationClockSim() {
    const { step, setStep } = useSlideSteps(CLOCK_STEPS.length);
    const s = CLOCK_STEPS[step];
    return (
        <div className="not-prose flex w-full flex-col gap-3" style={{ ...BODY_FONT, height: PC_H }}>
            <div className="flex items-center justify-between gap-4">
                <StepTabs labels={CLOCK_STEPS.map(c => c.tab)} step={step} onSelect={setStep} layoutId="clock-tabs" />
                <div className="flex flex-wrap justify-end gap-2">{s.chips.map(c => <DesignChip key={c}>{c}</DesignChip>)}</div>
            </div>
            <Panel className="shrink-0 px-4 py-2"><DurationBar step={step} /></Panel>
            <div className="flex min-h-0 flex-1 gap-4">
                <Panel className="flex w-[372px] shrink-0 flex-col gap-2 px-5 py-2.5">
                    <PcHead step={step} color={s.color === C.text ? '#F9FAFB' : s.color} headline={s.headline} text={s.text} />
                    <div className="mt-auto"><Source>{sourcesUpTo(CLOCK_STEPS.map(c => c.sources), step)}</Source></div>
                </Panel>
                <Panel className="min-w-0 flex-1 px-3 py-2"><Board step={step} /></Panel>
            </div>
        </div>
    );
}
