import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Source } from './kit/ui';
import { Beat, Wipe } from './kit/Beat';
import { Tank } from './kit/Tank';
import { BigStat } from './kit/Stamp';
import { DesignChip, FictionChip, IllustrativeChip } from './kit/chips';
import { WallChart } from './ato1/WallChart';
import { TANK_LEVELS, WALL_BEATS, WALL_QUESTION, WALL_SOURCES, WALL_STAT } from './ato1/wall.content';

/**
 * Slide 10 · O Km 32. A curva de ritmo da Marina é desenhada km a km e despenca no 32;
 * os dois tanques (músculo, fígado) esvaziam junto com o desenho. Depois a pergunta, e o dado real de Smyth 2021.
 */
const STEPS = WALL_BEATS.length;
const SOLID_BG = '#060C17';

const Question = () => (
    <div className="flex h-full flex-col justify-center gap-8 px-12">
        <span className="font-display font-bold leading-none tracking-tight text-white" style={{ fontSize: 80 }}>{WALL_QUESTION.big}</span>
        <div className="flex gap-3">
            {WALL_QUESTION.options.map((o, i) => (
                <motion.span key={o} className="whitespace-nowrap rounded-xl border-2 px-3 py-2 text-[20px] text-gray-100"
                    style={{ borderColor: 'rgba(255,255,255,0.28)' }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stagger(i, 0.35), duration: DUR.enter, ease: EASE_OUT }}>
                    {o}?
                </motion.span>
            ))}
        </div>
    </div>
);

const Verdict = () => (
    <div className="flex h-full flex-col justify-center gap-5 px-12">
        <span className="text-[30px] font-semibold leading-tight text-white">{WALL_STAT.lead}</span>
        <div className="flex items-start gap-14">
            <BigStat value={WALL_STAT.men.value} caption={WALL_STAT.men.caption} color={C.glucose} size={96} />
            <BigStat value={WALL_STAT.women.value} caption={WALL_STAT.women.caption} color={C.glucoseSoft} size={96} delay={0.15} />
        </div>
        <span className="text-[20px] text-gray-200">{WALL_STAT.foot}</span>
        <span className="self-start"><DesignChip>{WALL_STAT.design}</DesignChip></span>
    </div>
);

export default function WallSim() {
    const { step } = useSlideSteps(STEPS);
    const reduce = useReducedMotion();
    const levels = TANK_LEVELS[step];
    const overlay = step >= 3;
    const real = step === 4;

    return (
        <div className="not-prose flex w-full flex-col gap-4" style={{ maxHeight: 516 }}>
            <div className="flex min-h-[44px] items-center justify-between gap-6">
                <Beat beat={step} className="text-[30px] font-semibold leading-tight text-white">{WALL_BEATS[step]}</Beat>
                <div className="flex gap-2">
                    <FictionChip />
                    <IllustrativeChip />
                </div>
            </div>

            <div className="flex gap-5" style={{ height: 384 }}>
                <div className="relative overflow-hidden rounded-2xl p-3" style={PANEL_BG}>
                    <motion.div animate={{ opacity: overlay ? 0.25 : 1 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                        <WallChart stage={Math.min(step, 2)} />
                    </motion.div>
                    {overlay && (
                        <Wipe from="left" className="absolute inset-0" style={{ background: SOLID_BG }}>
                            <Beat beat={real ? 'real' : 'q'} className="h-full">
                                {real ? <Verdict /> : <Question />}
                            </Beat>
                        </Wipe>
                    )}
                </div>

                <div className="flex flex-1 flex-col justify-between rounded-2xl px-6 py-5" style={PANEL_BG}>
                    <span className="text-[20px] font-semibold text-gray-100">glicogênio da Marina</span>
                    <div className="flex items-end justify-center gap-10">
                        <Tank level={levels.muscle} label="músculo" value="~500 g" width={96} height={230} active />
                        <Tank level={levels.liver} label="fígado" value="~80 g" width={68} height={110} active />
                    </div>
                    <motion.span className="text-[16px] text-gray-300"
                        animate={{ opacity: real ? 0.4 : 1 }} transition={{ duration: reduce ? 0 : DUR.text }}>
                        média de adultos; faixa 300–700 g e 0–160 g
                    </motion.span>
                </div>
            </div>

            <Source>{real ? WALL_SOURCES.wall : WALL_SOURCES.stores}</Source>
        </div>
    );
}
