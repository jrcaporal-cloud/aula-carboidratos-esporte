import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Source } from './kit/ui';
import { Beat } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { StudyTiles } from './ato5/StudyTiles';
import { BEATS, BURDON, DESIGNS, FOODS, SOURCES, THOMAS } from './ato5/preGI.content';

/**
 * Slide 86 · IG Antes do Treino (curto). O estudo-fundador (lentilha × batata) vira um quadrado âmbar entre
 * os 19 da meta-análise; no último passo os 19 deslizam para uma pilha só sobre a linha "sem efeito".
 */
const FoodCards = () => (
    <div className="flex h-full items-center justify-center gap-8">
        {FOODS.map((f, i) => (
            <motion.div key={f.id} className="flex h-[220px] w-[230px] flex-col items-center justify-center gap-3 rounded-2xl border-[3px]"
                style={{ borderColor: f.win ? C.glucose : 'rgba(255,255,255,0.25)' }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stagger(i, 0.05, 0.12), duration: DUR.enter, ease: EASE_OUT }}>
                <span className="font-display text-[40px] font-bold text-white">{f.name}</span>
                <span className="rounded-lg px-3 py-1 font-mono text-[20px] font-bold"
                    style={{ background: f.win ? C.glucose : 'rgba(255,255,255,0.12)', color: f.win ? '#04080F' : C.text }}>{f.gi}</span>
            </motion.div>
        ))}
    </div>
);

const SideText = ({ step }: { step: number }) => {
    if (step === 0) {
        return (
            <div className="flex flex-col gap-3">
                <CountUp text={THOMAS.value} delay={0.2} className="font-display text-[80px] font-bold leading-none" style={{ color: C.glucose }} />
                <span className="text-[22px] text-gray-100">{THOMAS.caption}</span>
            </div>
        );
    }
    if (step === 1) {
        return (
            <div className="flex flex-col gap-3">
                <CountUp text={BURDON.value} className="font-display text-[64px] font-bold leading-none text-white" />
                <span className="text-[22px] text-gray-100">{BURDON.caption}</span>
                <span className="mt-2 flex items-center gap-3 text-[20px] text-gray-100">
                    <span className="h-5 w-5 rounded" style={{ background: C.glucose }} />{BURDON.founder}
                </span>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-4">
            <span className="font-display text-[48px] font-bold leading-[1.05]" style={{ color: C.stone }}>{BURDON.pooled}</span>
            <span className="text-[22px] leading-snug text-gray-100">{BURDON.modifiers}</span>
        </div>
    );
};

export default function PreGISim() {
    const { step } = useSlideSteps(BEATS.length);
    return (
        <div className="not-prose flex w-full flex-col gap-3" style={{ maxHeight: 516 }}>
            <div className="flex min-h-[80px] items-start justify-between gap-6">
                <Beat beat={step} className="max-w-[820px] text-[28px] font-semibold leading-snug text-white">{BEATS[step]}</Beat>
                <Beat beat={`d${step}`} className="flex flex-col items-end gap-2">
                    <DesignChip>{DESIGNS[step]}</DesignChip>
                    {step === 2 && <IllustrativeChip />}
                </Beat>
            </div>
            <div className="flex items-stretch overflow-hidden rounded-2xl" style={{ ...PANEL_BG, height: 380 }}>
                <div className="relative flex w-[660px] shrink-0 items-center justify-center">
                    {step === 0
                        ? <Beat beat="food" className="h-full w-full"><FoodCards /></Beat>
                        : <StudyTiles count={BURDON.studies} show pooled={step === 2} text={BURDON} />}
                </div>
                <span className="my-8 w-[3px] shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }} />
                <div className="flex flex-1 flex-col justify-center px-10">
                    <Beat beat={step}><SideText step={step} /></Beat>
                </div>
            </div>
            <Source>{SOURCES[step]}</Source>
        </div>
    );
}
