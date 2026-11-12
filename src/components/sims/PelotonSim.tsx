import { motion, useReducedMotion } from 'framer-motion';
import { Bike, FlaskConical } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../lib/motion';
import { Grow } from './kit/Beat';
import { DesignChip } from './kit/chips';
import { C } from './kit/palette';
import { KeyFact } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { Panel } from './kit/ui';
import { PbRow, PbShell, PbSidePanel } from './ato6/pbShell';
import {
    MILESTONES, PELOTON_LEDGER, PELOTON_STEPS, TOUR_DAY, YEAR_MAX, YEAR_MIN, type Milestone,
} from './ato6/peloton.content';

/**
 * Slide 106 · O Pelotão na Frente da Ciência, como linha do tempo + painel. No palco, duas pistas no tempo
 * (pelotão × laboratório e diretriz) que acumulam marcos, o vão de 22 anos e, embaixo, o dia de Tour de 1989
 * em números (Saris). No painel, o texto do passo e o livro-caixa "quem disse quanto, e quando".
 */

const pct = (year: number) => ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100;
const TRACK_Y = { peloton: 108, lab: 210 } as const;
const TRACK_COLOR = { peloton: C.glucose, lab: C.caveat } as const;
const ACCENT = [C.glucose, C.caveat, C.ok, C.glucoseSoft] as const;

const lastOf = (track: Milestone['track'], step: number): number => {
    const reached = MILESTONES.filter(m => m.track === track && m.step <= step);
    return reached.length ? reached[reached.length - 1].year : YEAR_MIN;
};

const labelTop = (m: Milestone): number => {
    if (m.track === 'peloton') return TRACK_Y.peloton - 78;
    /** O "hoje" do laboratório vai entre as pistas: embaixo, ao lado de 2011, não cabe. */
    return m.year === 2026 ? TRACK_Y.lab - 76 : TRACK_Y.lab + 24;
};

const MarkerLabel = ({ m, current }: { m: Milestone; current: boolean }) => {
    const right = pct(m.year) > 80;
    const value = <span className="whitespace-nowrap font-display text-[30px] font-bold leading-none" style={{ color: TRACK_COLOR[m.track] }}>{m.value}</span>;
    return (
        <motion.div className="absolute w-0" style={{ left: `${pct(m.year)}%`, top: labelTop(m) }}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: current ? 0.5 : 0, duration: DUR.enter, ease: EASE_OUT }}>
            {/* âncora de largura zero: o rótulo cresce para a direita (ou, perto do fim, para a esquerda) sem estourar o palco */}
            <div className="absolute top-0 flex flex-col gap-0.5" style={right ? { right: -12, alignItems: 'flex-end' } : { left: -12, alignItems: 'flex-start' }}>
                {current && !right ? <KeyFact color={TRACK_COLOR[m.track]} delay={0.6}>{value}</KeyFact> : value}
                <span className="whitespace-nowrap text-[16px] text-gray-200"><b className="font-mono text-white">{m.year === 2026 ? 'hoje' : m.year}</b> · {m.note}</span>
            </div>
        </motion.div>
    );
};

const Rider = ({ track, year }: { track: Milestone['track']; year: number }) => {
    const reduce = useReducedMotion();
    const Icon = track === 'peloton' ? Bike : FlaskConical;
    return (
        <div className="pointer-events-none absolute left-0 right-0 [container-type:inline-size]" style={{ top: TRACK_Y[track] - 20 }}>
            <motion.div className="w-0" initial={false} animate={{ x: `${pct(year)}cqw` }} transition={{ duration: reduce ? 0 : 0.9, ease: EASE_IN_OUT }}>
                <span className="flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full" style={{ background: TRACK_COLOR[track] }}>
                    <Icon size={24} strokeWidth={2.5} color="#04080F" aria-hidden />
                </span>
            </motion.div>
        </div>
    );
};

const Track = ({ track, step, label }: { track: Milestone['track']; step: number; label: string }) => (
    <>
        {/* o rótulo do laboratório vai embaixo da pista, à esquerda: em cima, o ícone que anda o cobriria */}
        <span className={`absolute left-0 text-[16px] font-bold uppercase leading-tight tracking-wide ${track === 'lab' ? 'w-[120px]' : 'whitespace-nowrap'}`} style={{ top: track === 'lab' ? TRACK_Y.lab + 22 : 0, color: TRACK_COLOR[track] }}>{label}</span>
        <div className="absolute left-0 right-0 h-[6px] overflow-hidden rounded-full bg-white/15" style={{ top: TRACK_Y[track] - 3 }}>
            <Grow value={pct(lastOf(track, step)) / 100} color={TRACK_COLOR[track]} />
        </div>
    </>
);

const Gap = () => (
    <motion.div className="absolute flex flex-col items-center" style={{ left: `${pct(1989)}%`, width: `${pct(2011) - pct(1989)}%`, top: TRACK_Y.peloton + 22 }}
        initial={{ opacity: 0, scaleX: 0.4 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.7, duration: DUR.morph, ease: EASE_OUT }}>
        <span className="h-[12px] w-full border-x-[3px] border-b-[3px] border-white/80" />
        <span className="mt-0.5 text-[22px] font-bold text-white">22 anos de atraso</span>
    </motion.div>
);

/** Um dia de Tour em 1989: a barra da energia ingerida, com 49% dentro da etapa. Fica do 1º ao último passo. */
const TourDay = () => (
    <div className="flex flex-col gap-1.5 border-t-2 border-white/15 pt-2">
        <div className="flex items-baseline justify-between">
            <span className="text-[16px] font-bold uppercase tracking-wide text-gray-300">um dia de Tour, 1989 · média de 22 dias</span>
            <span className="text-[16px] text-gray-200">ingeridos <b className="text-white">{TOUR_DAY.intakeMJ} MJ/dia</b></span>
        </div>
        <div className="relative flex h-[30px] overflow-hidden rounded-md bg-white/10">
            <div className="relative h-full" style={{ width: `${TOUR_DAY.duringPct}%` }}>
                <Grow value={1} color={C.glucose} delay={0.2} />
                <span className="relative flex h-full items-center pl-3 text-[16px] font-bold text-[#04080F]">49% durante a etapa</span>
            </div>
            <span className="flex flex-1 items-center justify-end pr-3 text-[16px] text-gray-200">51% fora da bicicleta</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
            {TOUR_DAY.facts.map((f, i) => (
                <motion.div key={f.label} className="flex flex-col" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stagger(i, 0.4, 0.1), duration: DUR.enter, ease: EASE_OUT }}>
                    <span className="font-display text-[22px] font-bold leading-none text-white">{f.value}</span>
                    <span className="text-[16px] leading-tight text-gray-300">{f.label}</span>
                </motion.div>
            ))}
        </div>
    </div>
);

const Ledger = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-1 text-left">
        <thead>
            <tr className="text-[15px] text-gray-300">
                <th className="font-normal">ano</th>
                <th className="font-normal">quem</th>
                <th className="text-right font-normal">carboidrato</th>
            </tr>
        </thead>
        <tbody>
            {PELOTON_LEDGER.filter(r => r.at <= step).map(r => (
                <PbRow key={r.year} at={r.at} step={step} className="text-[18px] font-semibold text-gray-100">
                    <td className="font-mono text-[16px] text-gray-300">{r.year}</td>
                    <td>{r.who}</td>
                    <td className="text-right font-display text-[20px] font-bold tabular-nums" style={{ color: TRACK_COLOR[r.track] }}>{r.value}</td>
                </PbRow>
            ))}
        </tbody>
    </table>
);

export default function PelotonSim() {
    const { step, setStep } = useSlideSteps(PELOTON_STEPS.length);
    const s = PELOTON_STEPS[step];
    return (
        <PbShell tabs={PELOTON_STEPS.map(p => p.tab)} step={step} setStep={setStep} layoutId="peloton-tabs"
            chips={<DesignChip>{s.chip}</DesignChip>}>
            <Panel className="flex w-[650px] shrink-0 flex-col px-5 py-3">
                <div className="relative h-[294px] shrink-0">
                    <Track track="peloton" step={step} label="pelotão · a prática" />
                    <Track track="lab" step={step} label="laboratório e diretriz" />
                    {MILESTONES.filter(m => m.step <= step).map(m => <MarkerLabel key={`${m.track}-${m.year}`} m={m} current={m.step === step} />)}
                    {step >= 2 && <Gap />}
                    <Rider track="peloton" year={lastOf('peloton', step)} />
                    {step >= 1 && <Rider track="lab" year={lastOf('lab', step)} />}
                </div>
                <TourDay />
            </Panel>
            <PbSidePanel step={step} headline={s.headline} color={ACCENT[step]} text={s.text}
                source={sourcesUpTo(PELOTON_STEPS.map(p => p.source), step)}>
                <Ledger step={step} />
            </PbSidePanel>
        </PbShell>
    );
}
