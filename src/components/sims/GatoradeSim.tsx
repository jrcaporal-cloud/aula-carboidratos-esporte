import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Beat, Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { C, PANEL_BG } from './kit/palette';
import { Chip } from './kit/ui';
import { Lead, SimFrame } from './ato6/Frame';
import { CHAIN, INGREDIENTS, LEADS, QUESTION, SOURCE, STATIONS } from './ato6/gatorade.content';

/**
 * Slide 100 · Gainesville, 1965. A história como linha do tempo de quatro estações:
 * a pergunta de nefrologia → a bebida → o placar de 14 × 7 → o produto. Cada estação tem a sua cena.
 */

const Rail = ({ step }: { step: number }) => (
    <div className="relative mx-6 h-[64px]">
        <div className="absolute left-0 right-0 top-[14px] h-[4px] rounded-full bg-white/15">
            <Grow value={step / (STATIONS.length - 1)} color={C.glucose} className="rounded-full" />
        </div>
        {STATIONS.map((s, i) => {
            const on = i <= step;
            return (
                <div key={s.date} className="absolute top-0 flex w-0 flex-col items-center" style={{ left: `${(i / (STATIONS.length - 1)) * 100}%` }}>
                    <span className="h-8 w-8 shrink-0 rounded-full border-[3px] transition-colors duration-300"
                        style={{ borderColor: on ? C.glucose : 'rgba(255,255,255,0.3)', background: i === step ? C.glucose : '#04080F' }} />
                    <span className="mt-1 whitespace-nowrap font-mono text-[16px] tabular-nums"
                        style={{ color: i === step ? C.glucoseSoft : '#9CA3AF' }}>{s.date}</span>
                </div>
            );
        })}
    </div>
);

const rise = (i: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: stagger(i, 0.15), duration: DUR.enter, ease: EASE_OUT },
});

const QuestionScene = () => (
    <div className="flex flex-col gap-8">
        <p className="m-0 font-display text-[46px] font-semibold leading-[1.1] text-white" style={{ textWrap: 'balance' }}>
            <span style={{ color: C.glucose }}>“</span>{QUESTION}<span style={{ color: C.glucose }}>”</span>
        </p>
        <div className="flex items-center gap-4">
            {CHAIN.map((p, i) => (
                <motion.div key={p.name} className="flex items-center gap-4" {...rise(i)}>
                    {i > 0 && <ArrowRight size={28} color={C.muted} aria-hidden />}
                    <div className="rounded-xl px-5 py-3" style={PANEL_BG}>
                        <div className="text-[22px] font-semibold text-white">{p.name}</div>
                        <div className="text-[18px]" style={{ color: i === 2 ? C.glucoseSoft : '#9CA3AF' }}>{p.role}</div>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
);

const DrinkScene = () => (
    <div className="flex items-end gap-6">
        {INGREDIENTS.map((g, i) => (
            <motion.div key={g.name} className="flex h-[170px] w-[190px] flex-col justify-between rounded-2xl p-5" style={PANEL_BG} {...rise(i)}>
                <span className="h-12 w-12 rounded-full" style={{ background: g.color }} />
                <span className="text-[28px] font-semibold text-white">{g.name}</span>
            </motion.div>
        ))}
    </div>
);

const Team = ({ name, score, win }: { name: string; score: string; win: boolean }) => (
    <div className="flex w-[300px] flex-col items-center gap-1 rounded-2xl py-5" style={{ background: win ? C.glucose : 'rgba(255,255,255,0.08)' }}>
        <span className="text-[24px] font-bold tracking-wide" style={{ color: win ? '#04080F' : '#E5E7EB' }}>{name}</span>
        <span className="font-display text-[96px] font-bold leading-none tabular-nums" style={{ color: win ? '#04080F' : '#E5E7EB' }}>{score}</span>
    </div>
);

const ScoreScene = () => {
    const reduce = useReducedMotion();
    return (
        <div className="flex items-center gap-10">
            <motion.div className="flex items-center gap-5"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: DUR.morph, ease: EASE_OUT }}>
                <Team name="FLÓRIDA" score="14" win />
                <span className="font-display text-[48px] text-gray-400">×</span>
                <Team name="LSU" score="7" win={false} />
            </motion.div>
            <motion.p className="m-0 max-w-[300px] text-[22px] leading-snug text-gray-200" {...rise(3)}>
                2 de outubro de 1965. A LSU era a 5ª do ranking.
            </motion.p>
        </div>
    );
};

const ProductScene = () => (
    <div className="flex items-end gap-12">
        <div className="flex flex-col gap-2">
            <span className="text-[24px] text-gray-300">mais de</span>
            <CountUp text="US$ 280 mi" delay={0.2} className="font-display text-[92px] font-bold leading-none" style={{ color: C.glucose }} />
            <span className="text-[22px] text-gray-200">em royalties à universidade desde 1972</span>
        </div>
        <motion.div className="mb-2 rounded-xl px-5 py-3" style={PANEL_BG} {...rise(2)}>
            <div className="font-mono text-[18px] text-gray-400">1967</div>
            <div className="text-[22px] text-white">licença à Stokely-Van Camp</div>
        </motion.div>
    </div>
);

const SCENES = [QuestionScene, DrinkScene, ScoreScene, ProductScene] as const;

export default function GatoradeSim() {
    const { step } = useSlideSteps(STATIONS.length);
    const Scene = SCENES[step];
    return (
        <SimFrame
            lead={<Beat beat={`l${step}`}><Lead>{LEADS[step]}</Lead></Beat>}
            chips={<Chip color={C.stone}>fonte institucional · UF</Chip>}
            source={SOURCE}>
            <div className="flex h-full flex-col gap-5 pt-2">
                <Rail step={step} />
                <Beat beat={step} className="flex min-h-0 flex-1 flex-col px-6">
                    <Scene />
                </Beat>
            </div>
        </SimFrame>
    );
}
