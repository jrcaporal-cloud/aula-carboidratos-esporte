import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Chip, Source } from './kit/ui';
import { Tank } from './kit/Tank';
import { BigStat } from './kit/Stamp';
import { DesignChip } from './kit/chips';
import { HeadRow, Phrase } from './ato7/parts';
import { DESIGN, MOMENTS, PROTOCOL, SOURCE, STOPS, TANK_MAX, UNIT } from './ato7/fuchs.content';

/**
 * Slide 125 · Nem 10 g/kg em 12 horas.
 * Uma régua de tempo no alto (antes → fim do exercício → 6 h → 12 h) e dois tanques com a linha do "nível de antes":
 * o fígado passa da linha em 6 h; o músculo fica abaixo dela até o fim.
 */
const TRACK_W = 1000;
const TANK_W = 116;
const TANK_H = 250;
const PRE_Y = TANK_H / TANK_MAX;

const TimeTrack = ({ at }: { at: number }) => {
    const reduce = useReducedMotion();
    const x = (i: number) => (i / (STOPS.length - 1)) * TRACK_W;
    return (
        <div className="relative mx-auto h-[58px]" style={{ width: TRACK_W }}>
            <span aria-hidden className="absolute left-0 top-[10px] h-[3px] rounded-full bg-white/30" style={{ width: TRACK_W }} />
            <motion.span aria-hidden className="absolute left-0 top-[10px] h-[3px] rounded-full" style={{ width: TRACK_W, background: C.glucose, transformOrigin: 'left center' }}
                initial={false} animate={{ scaleX: at / (STOPS.length - 1) }} transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }} />
            {STOPS.map((s, i) => (
                <div key={s} className="absolute top-0 w-0" style={{ left: x(i) }}>
                    <span className="absolute left-0 top-[2px] h-5 w-5 -translate-x-1/2 rounded-full border-[3px]"
                        style={{ borderColor: i <= at ? C.glucose : 'rgba(255,255,255,0.4)', background: i === at ? C.glucose : '#04080F' }} />
                    <span className="absolute top-7 w-max text-[18px] font-semibold"
                        style={{ color: i === at ? '#fff' : '#9CA3AF', transform: i === 0 ? 'none' : i === STOPS.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)' }}>
                        {s}
                    </span>
                </div>
            ))}
        </div>
    );
};

const TankWithLine = ({ level, name, text, color }: { level: number; name: string; text: string; color: string }) => (
    <div className="flex flex-col items-center gap-2">
        <span className="text-[22px] font-semibold text-white">{name}</span>
        <div className="relative">
            <Tank level={level / TANK_MAX} color={color} width={TANK_W} height={TANK_H} active />
            {/* a linha do nível de antes (100%) */}
            <span aria-hidden className="absolute -left-4 -right-4 h-[3px]" style={{ bottom: PRE_Y - 1, background: C.text }} />
        </div>
        <span className="text-[20px] tabular-nums text-gray-100">{text}</span>
    </div>
);

export default function Fuchs2025Sim() {
    const { step } = useSlideSteps(MOMENTS.length);
    const m = MOMENTS[step];
    const at = Math.min(step + 1, STOPS.length - 1);
    return (
        <div className="not-prose flex flex-col gap-3">
            <HeadRow chips={<DesignChip>{DESIGN}</DesignChip>}>
                <Phrase beat={step} width={680}>{m.phrase}</Phrase>
            </HeadRow>
            <TimeTrack at={at} />
            <div className="flex items-center gap-12 pl-6">
                <div className="flex items-end gap-4">
                    <span className="w-[86px] text-right text-[18px] leading-tight text-gray-200" style={{ marginBottom: 36 + PRE_Y - 24 }}>
                        nível de antes
                    </span>
                    <TankWithLine level={m.liver} name="fígado" text={m.liverText} color={C.glycogenSoft} />
                    <span className="w-6" />
                    <TankWithLine level={m.muscle} name="músculo" text={m.muscleText} color={C.glycogen} />
                </div>
                <div className="flex flex-1 flex-col gap-6">
                    <BigStat key={m.stat.value} value={m.stat.value} caption={m.stat.caption} size={96}
                        color={m.stat.value === '142%' ? C.glycogenSoft : m.stat.value === '69%' ? C.stone : C.glycogen} />
                    <div className="flex flex-col items-start gap-2">
                        <Chip color={C.glucose}>{PROTOCOL}</Chip>
                        <span className="text-[16px] text-gray-300">{UNIT}</span>
                    </div>
                </div>
            </div>
            <Source>{SOURCE}</Source>
        </div>
    );
}
