import { motion, useReducedMotion } from 'framer-motion';
import { Bike, FlaskConical } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { Beat, Grow } from './kit/Beat';
import { DesignChip } from './kit/chips';
import { C } from './kit/palette';
import { Lead, SimFrame } from './ato6/Frame';
import { DESIGN, LEADS, MILESTONES, SOURCES, YEAR_MAX, YEAR_MIN, type Milestone } from './ato6/peloton.content';

/**
 * Slide 106 · O Pelotão na Frente da Ciência. Duas pistas de corrida no tempo: em cima o pelotão (prática),
 * embaixo o laboratório e a diretriz. O ciclista sai na frente em 1989; o frasco só alcança os 90 g/h em 2011.
 */

const pct = (year: number) => ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100;
const TRACK_Y = { peloton: 120, lab: 250 } as const;
const TRACK_COLOR = { peloton: C.glucose, lab: C.caveat } as const;

const lastOf = (track: Milestone['track'], step: number): number => {
    const reached = MILESTONES.filter(m => m.track === track && m.step <= step);
    return reached.length ? reached[reached.length - 1].year : YEAR_MIN;
};

const MarkerLabel = ({ m }: { m: Milestone }) => {
    const right = pct(m.year) > 80;
    const above = m.track === 'peloton';
    /** O marco de hoje do laboratório vai entre as pistas: embaixo não cabe ao lado do de 2011. */
    const inline = m.track === 'lab' && m.year === 2026;
    return (
        <motion.div className="absolute flex flex-col"
            style={{
                left: `${pct(m.year)}%`, top: above ? TRACK_Y[m.track] - 112 : inline ? TRACK_Y[m.track] - 108 : TRACK_Y[m.track] + 26,
                alignItems: right ? 'flex-end' : 'flex-start', transform: right ? 'translateX(-100%)' : 'translateX(-12px)',
            }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: DUR.enter, ease: EASE_OUT }}>
            {!inline && <span className="font-mono text-[17px] text-gray-400">{m.year === 2026 ? 'hoje' : m.year}</span>}
            <span className="whitespace-nowrap font-display text-[40px] font-bold leading-none" style={{ color: TRACK_COLOR[m.track] }}>{m.value}</span>
            <span className="whitespace-nowrap text-[18px] text-gray-300">{m.note}</span>
        </motion.div>
    );
};

const Rider = ({ track, year }: { track: Milestone['track']; year: number }) => {
    const reduce = useReducedMotion();
    const Icon = track === 'peloton' ? Bike : FlaskConical;
    return (
        <div className="pointer-events-none absolute left-0 right-0 [container-type:inline-size]" style={{ top: TRACK_Y[track] - 22 }}>
            <motion.div className="w-0" initial={false} animate={{ x: `${pct(year)}cqw` }}
                transition={{ duration: reduce ? 0 : 0.9, ease: EASE_IN_OUT }}>
                <span className="flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full" style={{ background: TRACK_COLOR[track] }}>
                    <Icon size={26} strokeWidth={2.5} color="#04080F" aria-hidden />
                </span>
            </motion.div>
        </div>
    );
};

const Track = ({ track, step }: { track: Milestone['track']; step: number }) => (
    <div className="absolute left-0 right-0 h-[6px] overflow-hidden rounded-full bg-white/10" style={{ top: TRACK_Y[track] - 3 }}>
        <Grow value={pct(lastOf(track, step)) / 100} color={TRACK_COLOR[track]} />
    </div>
);

const Gap = () => (
    <motion.div className="absolute flex flex-col items-center" style={{ left: `${pct(1989)}%`, width: `${pct(2011) - pct(1989)}%`, top: 162 }}
        initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.6, duration: DUR.morph, ease: EASE_OUT }}>
        <span className="h-[14px] w-full border-x-[3px] border-b-[3px] border-white/70" />
        <span className="mt-1 text-[24px] font-bold text-white">22 anos</span>
    </motion.div>
);

export default function PelotonSim() {
    const { step } = useSlideSteps(4);
    return (
        <SimFrame source={SOURCES[step]}
            lead={<Beat beat={`l${step}`}><Lead>{LEADS[step]}</Lead></Beat>}
            chips={<DesignChip>{DESIGN[step]}</DesignChip>}
            className="flex flex-col">
            <div className="relative ml-[184px] mr-4 flex-1">
                <Track track="peloton" step={step} />
                <Track track="lab" step={step} />
                <span className="absolute -left-[176px] w-[150px] text-right text-[19px] font-semibold leading-tight" style={{ top: TRACK_Y.peloton - 24, color: C.glucoseSoft }}>pelotão<br />(prática)</span>
                <span className="absolute -left-[176px] w-[150px] text-right text-[19px] font-semibold leading-tight" style={{ top: TRACK_Y.lab - 24, color: C.caveat }}>laboratório e diretriz</span>
                {MILESTONES.filter(m => m.step <= step).map(m => <MarkerLabel key={`${m.track}-${m.year}`} m={m} />)}
                {step >= 2 && <Gap />}
                <Rider track="peloton" year={lastOf('peloton', step)} />
                <Rider track="lab" year={lastOf('lab', step)} />
            </div>
        </SimFrame>
    );
}
