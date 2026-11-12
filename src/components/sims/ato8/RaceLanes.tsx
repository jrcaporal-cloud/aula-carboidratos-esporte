import { motion } from 'framer-motion';
import { Flame, Footprints } from 'lucide-react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { signed } from '../kit/format';
import { C } from '../kit/palette';
import { Appear, TrackMark } from './parts';
import { DOMAIN, FAT_PEAK, LANES, type Lane } from './supernova.content';

/**
 * As três raias do Supernova. Cada marchador sai do zero e anda até a sua melhora no 10 km
 * (desliza por x em cqw). No último passo, o IC90% aparece atrás do marcador.
 */

const LANE_COLOR: Record<Lane['id'], string> = { hcho: C.glucose, pcho: C.glucoseSoft, lchf: C.fat };

const pct = (v: number) => ((v - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * 100;
const TICKS = [-8, -4, 0, 4, 8];

interface LanesProps { raced: boolean; showFat: boolean; showCi: boolean; showDiet: boolean }

const LaneRow = ({ lane, i, raced, showFat, showCi, showDiet }: LanesProps & { lane: Lane; i: number }) => {
    const color = LANE_COLOR[lane.id];
    const at = raced ? pct(lane.gain) : pct(0);
    return (
        <div className="flex items-center gap-5">
            <div className="w-[270px] shrink-0">
                <p className="m-0 text-[24px] font-bold leading-tight" style={{ color }}>{lane.name} {showDiet && <span className="text-[17px] font-normal text-gray-400">n = {lane.n}</span>}</p>
                {showDiet && <p className="m-0 text-[17px] text-gray-300">{lane.diet}</p>}
            </div>
            <div className="relative h-[56px] flex-1 rounded-xl [container-type:inline-size]" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="absolute inset-y-1 border-l-2 border-dashed border-white/40" style={{ left: `${pct(0)}%` }} />
                <motion.div className="absolute top-1/2 h-[6px] -translate-y-1/2 rounded-full" initial={false}
                    style={{ left: `${pct(lane.lo)}%`, width: `${pct(lane.hi) - pct(lane.lo)}%`, background: color }}
                    animate={{ opacity: showCi ? 0.7 : 0 }} transition={{ duration: DUR.enter }} />
                {lane.id === 'lchf' && (
                    <Appear show={showFat} className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-lg px-3 py-1 text-[18px] font-bold"
                        style={{ background: C.fat, color: '#04080F' }}>
                        <Flame size={20} strokeWidth={2.5} /> gordura: {FAT_PEAK}
                    </Appear>
                )}
                <TrackMark at={at} delay={raced ? i * 0.12 : 0}>
                    <span className="absolute top-1/2 flex h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                        style={{ background: color, color: '#04080F' }}>
                        <Footprints size={24} strokeWidth={2.5} />
                    </span>
                    <motion.span className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-2 font-display text-[32px] font-bold leading-tight"
                        style={{ color, background: '#0B1220', ...(lane.gain < 0 ? { right: 30 } : { left: 30 }) }}
                        initial={false} animate={{ opacity: raced ? 1 : 0 }}
                        transition={{ duration: DUR.enter, delay: raced ? 0.7 + i * 0.12 : 0, ease: EASE_OUT }}>
                        {signed(lane.gain, 1)}%
                    </motion.span>
                </TrackMark>
            </div>
        </div>
    );
};

export const RaceLanes = (props: LanesProps) => (
    <div className="flex flex-col gap-2">
        {LANES.map((lane, i) => <LaneRow key={lane.id} lane={lane} i={i} {...props} />)}
        <div className="relative ml-[290px] h-[44px]">
            {TICKS.map(t => (
                <span key={t} className="absolute top-0 -translate-x-1/2 text-[16px] tabular-nums text-gray-400" style={{ left: `${pct(t)}%` }}>
                    {t === 0 ? '0' : `${signed(t)}%`}
                </span>
            ))}
            <span className="absolute right-0 top-[22px] text-[16px] text-gray-300">melhora no 10 km (%) →</span>
        </div>
    </div>
);
