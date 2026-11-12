import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { br } from '../kit/format';
import { Tank } from '../kit/Tank';
import { DIETS, GLY_MAX, MIN_MAX, type Diet } from './threeDiets.content';
import { useClock } from './useClock';

/** Segundos que o cronômetro mais longo (167 min) leva na tela; os outros param antes, no mesmo ritmo. */
const RACE_S = 1.15;

interface LaneProps { diet: Diet; running: boolean; dim: boolean; reduce: boolean }

/** Uma raia: dieta, tanque (glicogênio inicial) e o cronômetro correndo até a exaustão. */
const Lane = ({ diet, running, dim, reduce }: LaneProps) => {
    const seconds = (RACE_S * diet.minutes) / MIN_MAX;
    const shown = useClock(diet.minutes, seconds, running, reduce);
    return (
        <div className="flex items-center gap-4 transition-opacity duration-300" style={{ opacity: dim ? 0.6 : 1 }}>
            <div className="flex w-[150px] shrink-0 flex-col">
                <span className="text-[20px] font-semibold leading-tight" style={{ color: diet.color }}>{diet.name}</span>
                <span className="font-mono text-[18px] tabular-nums text-gray-100">{br(diet.glycogen, 2)} g/100 g</span>
            </div>
            <Tank level={diet.glycogen / GLY_MAX} width={44} height={86} />
            <div className="relative h-[34px] flex-1 overflow-hidden rounded-md bg-white/[0.06]">
                <motion.div className="absolute inset-0 origin-left" style={{ background: diet.color }}
                    initial={false} animate={{ scaleX: running ? diet.minutes / MIN_MAX : 0 }}
                    transition={{ duration: reduce || !running ? 0 : seconds, ease: 'linear' }} />
            </div>
            <span className="w-[92px] shrink-0 text-right font-display text-[30px] font-semibold tabular-nums leading-none text-white">
                {Math.round(shown)}<span className="ml-1 text-[18px] font-normal text-gray-300">min</span>
            </span>
        </div>
    );
};

interface DietLanesProps { step: number }

/** As três raias (sempre na tela): o tanque aparece no passo 1, os cronômetros correm a partir do passo 2. */
export const DietLanes = ({ step }: DietLanesProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div className="flex flex-col gap-5" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            {DIETS.map((d, i) => (
                <Lane key={d.name} diet={d} running={step >= 1} reduce={reduce} dim={step === 3 && i !== 2} />
            ))}
            <div className="ml-[226px] flex justify-between pr-[108px] font-mono text-[16px] text-gray-400">
                <span>0</span><span>1 h</span><span>2 h</span><span>3 h</span>
            </div>
        </motion.div>
    );
};
