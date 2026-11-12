import { motion, useReducedMotion } from 'framer-motion';
import { Syringe } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Beat } from './kit/Beat';
import { CalcChip, DesignChip } from './kit/chips';
import { Foot, Lead, SimBox } from './ato4/frame';
import { DietLanes } from './ato4/DietLanes';
import { DietChart } from './ato4/DietChart';
import { DIET_LEADS, DIETS_SOURCE, LIMITS, PROTOCOL } from './ato4/threeDiets.content';

/**
 * Slide 62 · Bergström 1967, o estudo-âncora do ato. À esquerda, três raias fixas (dieta → tanque → cronômetro);
 * à direita, a leitura muda a cada passo: o protocolo, a razão de tempos, a correlação, os 3 "fora da ordem", os limites.
 */

const Protocol = () => (
    <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {PROTOCOL.map((p, i) => (
            <motion.li key={p.what} className="flex items-center gap-3" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stagger(i, 0.1), duration: DUR.enter, ease: EASE_OUT }}>
                <Syringe size={22} strokeWidth={2.5} color={C.glycogenSoft} aria-hidden />
                <span className="text-[21px] leading-snug text-gray-100">{p.what}<span className="text-gray-400"> → {p.then}</span></span>
            </motion.li>
        ))}
    </ol>
);

const Ratio = () => (
    <Beat beat="ratio" className="flex flex-col gap-2">
        <span className="font-display text-[96px] font-bold leading-none" style={{ color: C.glucose }}>≈ 3×</span>
        <span className="max-w-[380px] text-[22px] leading-snug text-gray-100">mais tempo com o tanque cheio que com o vazio</span>
    </Beat>
);

const Limits = () => (
    <ul className="absolute inset-0 m-0 flex list-none flex-col justify-center gap-4 p-0 pl-4">
        {LIMITS.map((l, i) => (
            <motion.li key={l} className="flex items-baseline gap-3 text-[23px] leading-snug text-white" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stagger(i, 0.05), duration: DUR.enter, ease: EASE_OUT }}>
                <span className="inline-block h-3 w-3 shrink-0 rounded-sm" style={{ background: C.stone }} aria-hidden />{l}
            </motion.li>
        ))}
    </ul>
);

/** Coluna da direita: o que se lê das raias neste passo. */
const Reading = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    if (step === 0) return <Protocol />;
    if (step === 1) return <Ratio />;
    return (
        <div className="relative">
            <motion.div initial={false} animate={{ opacity: step === 4 ? 0 : 1 }} transition={{ duration: reduce ? 0 : DUR.enter }}>
                <DietChart step={step} />
            </motion.div>
            {step === 4 && <Limits />}
        </div>
    );
};

export default function ThreeDietsSim() {
    const { step } = useSlideSteps(DIET_LEADS.length);
    return (
        <SimBox>
            <Lead beat={step} chips={<><DesignChip>cruzado · n = 9 · não cego · 75% do VO₂máx</DesignChip>{step === 1 && <CalcChip>cálculo: 167 ÷ 57 min</CalcChip>}</>} className="min-h-[72px]">{DIET_LEADS[step]}</Lead>
            <div className="mt-3 flex flex-1 items-center gap-8">
                <div className="w-[600px] shrink-0"><DietLanes step={step} /></div>
                <div className="flex min-h-[330px] flex-1 items-center">
                    <Reading step={step} />
                </div>
            </div>
            <Foot source={DIETS_SOURCE} />
        </SimBox>
    );
}
