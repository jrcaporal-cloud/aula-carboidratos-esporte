import { motion } from 'framer-motion';
import { Flame, Footprints } from 'lucide-react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Beat, Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { br, signed } from '../kit/format';
import { C } from '../kit/palette';
import { Appear, TrackMark } from './parts';
import { DOMAIN, FAT_PEAK, LANES, O2, TIMELINE, type Lane } from './supernova.content';

/**
 * Palco do Supernova: a linha do tempo da virada (2006 → 2015–16), as três raias com a dieta em % da energia,
 * a chama do LCHF, a faixa do preço do O₂ e, por fim, a prova: cada marchador anda até a sua melhora no 10 km
 * (por x em cqw) e, no último passo, o IC90% aparece atrás dele. Tudo o que entra fica.
 */

const LANE_COLOR: Record<Lane['id'], string> = { hcho: C.glucose, pcho: C.glucoseSoft, lchf: C.fat };
const MIX_COLOR = [C.glucose, C.protein, C.fat] as const;
const TICKS = [-8, -4, 0, 4, 8];
const pct = (v: number) => ((v - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * 100;
const INK = '#04080F';

const Timeline = () => (
    <div className="relative grid grid-cols-4 gap-2 pt-2">
        <div className="absolute left-[6px] right-[6px] top-[8px] h-[3px] rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />
        {TIMELINE.map((t, i) => {
            const now = 'now' in t;
            return (
                <motion.div key={t.year} className="relative flex flex-col pl-1"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.enter, delay: stagger(i, 0.05, 0.12), ease: EASE_OUT }}>
                    <span className="absolute -top-[10px] left-0 h-[14px] w-[14px] rounded-full border-[3px]"
                        style={{ borderColor: now ? '#fff' : C.co2, background: now ? '#fff' : INK }} />
                    <span className="pt-2 text-[16px] font-bold leading-tight" style={{ color: now ? '#fff' : C.caveat }}>{t.year}</span>
                    <span className="text-[16px] leading-tight" style={{ color: now ? '#fff' : '#CBD5E1' }}>{t.label}</span>
                </motion.div>
            );
        })}
    </div>
);

/** Barra de % da energia: carboidrato · proteína · gordura (cálculo). */
const MixBar = ({ mix }: { mix: Lane['mix'] }) => (
    <div className="flex h-[22px] w-[226px] overflow-hidden rounded-md">
        {mix.map((v, i) => (
            <div key={i} className="flex items-center justify-center text-[14px] font-bold" style={{ width: `${v}%`, background: MIX_COLOR[i], color: INK }}>
                {v >= 14 ? `${v}%` : ''}
            </div>
        ))}
    </div>
);

interface LaneProps { lane: Lane; i: number; step: number }

const LaneRow = ({ lane, i, step }: LaneProps) => {
    const color = LANE_COLOR[lane.id];
    const raced = step >= 3;
    return (
        <div className="flex h-[76px] items-center gap-3">
            <div className="flex w-[230px] shrink-0 flex-col gap-[3px]">
                <div className="flex items-center gap-2">
                    <span className="text-[22px] font-bold leading-none" style={{ color }}>{lane.name}</span>
                    <span className="whitespace-nowrap text-[16px] leading-none text-gray-300">n = {lane.n}</span>
                    {lane.id === 'lchf' && (
                        <Appear show={step >= 1} className="ml-auto flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-[1px] text-[16px] font-bold"
                            style={{ background: C.fat, color: INK }}>
                            <Flame size={16} strokeWidth={2.75} /> {FAT_PEAK}
                        </Appear>
                    )}
                </div>
                <span className="whitespace-nowrap text-[16px] leading-tight text-gray-200">{lane.diet}</span>
                <MixBar mix={lane.mix} />
            </div>
            <div className="relative h-[54px] flex-1 rounded-xl [container-type:inline-size]" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="absolute inset-y-1 border-l-2 border-dashed border-white/45" style={{ left: `${pct(0)}%` }} />
                <motion.div className="absolute top-1/2 h-[8px] -translate-y-1/2 rounded-full" initial={false}
                    style={{ left: `${pct(lane.lo)}%`, width: `${pct(lane.hi) - pct(lane.lo)}%`, background: color, transformOrigin: `${((pct(lane.gain) - pct(lane.lo)) / (pct(lane.hi) - pct(lane.lo))) * 100}% 50%` }}
                    animate={{ opacity: step >= 4 ? 0.75 : 0, scaleX: step >= 4 ? 1 : 0 }} transition={{ duration: DUR.bar, delay: stagger(i, 0.1), ease: EASE_OUT }} />
                <TrackMark at={pct(raced ? lane.gain : 0)} delay={raced ? stagger(i, 0, 0.14) : 0}>
                    <span className="absolute top-1/2 flex h-[42px] w-[42px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                        style={{ background: color, color: INK, opacity: raced ? 1 : 0.6 }}>
                        <Footprints size={22} strokeWidth={2.5} />
                    </span>
                </TrackMark>
            </div>
            <div className="flex w-[86px] shrink-0 flex-col items-end gap-1 leading-none" style={{ color }}>
                {raced && <CountUp text={`${signed(lane.gain, 1)}%`} delay={0.75 + i * 0.12} className="font-display text-[26px] font-bold" />}
                {step >= 4 && (
                    <motion.span className="whitespace-nowrap text-[16px] font-semibold text-gray-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: DUR.enter, delay: 0.4 + i * 0.1 }}>{br(lane.lo, 1)} a {br(lane.hi, 1)}</motion.span>
                )}
            </div>
        </div>
    );
};

const O2Strip = () => (
    <div className="flex items-center gap-4 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <span className="w-[108px] shrink-0 text-[16px] font-semibold leading-tight text-white">1 litro de O₂ rende</span>
        <div className="flex flex-1 flex-col gap-[5px]">
            {([['carboidrato', O2.cho, C.glucose], ['gordura', O2.fat, C.fat]] as const).map(([label, v, color], i) => (
                <div key={label} className="flex items-center gap-2">
                    <span className="w-[96px] text-[16px] text-gray-200">{label}</span>
                    <div className="relative h-[16px] flex-1 overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <Grow value={v / 22} color={color} delay={i * 0.15} />
                    </div>
                    <span className="w-[74px] text-right text-[18px] font-bold tabular-nums" style={{ color }}>{br(v, 1)} kJ</span>
                </div>
            ))}
        </div>
        <span className="shrink-0 rounded-md border-2 px-2 py-1 text-[18px] font-bold" style={{ borderColor: C.fat, color: C.fat }}>−7,7%</span>
    </div>
);

export const SupernovaStage = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-[6px]">
        <Timeline />
        <div className="mt-1 flex items-end gap-3 text-[16px] leading-none text-gray-300">
            <span className="w-[230px]">dieta · % da energia</span>
            <Beat beat={step >= 3 ? 'prova' : 'dieta'} className="flex-1">
                {step >= 3 ? <span>prova oficial de 10 km: melhora (%) →</span> : (
                    <span className="flex gap-3 font-semibold">
                        {(['carboidrato', 'proteína', 'gordura'] as const).map((l, i) => <span key={l} style={{ color: MIX_COLOR[i] }}>■ {l}</span>)}
                    </span>
                )}
            </Beat>
        </div>
        <div className="flex flex-col">
            {LANES.map((lane, i) => <LaneRow key={lane.id} lane={lane} i={i} step={step} />)}
        </div>
        <Appear show={step >= 3} y={4} className="relative ml-[242px] mr-[98px] h-[22px]">
            {TICKS.map(t => (
                <span key={t} className="absolute top-0 -translate-x-1/2 text-[16px] leading-none tabular-nums text-gray-300" style={{ left: `${pct(t)}%` }}>
                    {t === 0 ? '0' : `${signed(t)}`}
                </span>
            ))}
        </Appear>
        {step >= 2 && (
            <motion.div className="mt-auto" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                <O2Strip />
            </motion.div>
        )}
    </div>
);
