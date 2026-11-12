import { motion } from 'framer-motion';
import { Bike } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip, ViaReviewChip } from './kit/chips';
import { br } from './kit/format';
import { Appear, Foot, Frame, Headline } from './ato8/parts';
import { FAT_BARS, FAT_BEATS, FAT_SOURCES, PHINNEY, type FatBar } from './ato8/fat.content';

/**
 * Slide 144 · A promessa da gordura. À esquerda, o arquivo de 1983 (cinco bicicletas, uma puxa a média);
 * à direita, as colunas da oxidação de gordura crescendo de 0,67 para 1,54 g/min e, depois, os marchadores do Supernova.
 */

const MAX_G = 1.6;
const BAR_H = 200;

const Cyclists = ({ step }: { step: number }) => (
    <div className="flex gap-4">
        {Array.from({ length: PHINNEY.n }, (_, i) => {
            const outlier = i === 3;
            const lit = step === 1 ? outlier : true;
            return (
                <motion.span key={i} initial={false}
                    animate={{ opacity: lit ? 1 : 0.3, y: step === 1 && outlier ? -10 : 0 }}
                    transition={{ duration: DUR.morph, ease: EASE_OUT }}
                    style={{ color: step === 1 && outlier ? C.fat : C.text }}>
                    <Bike size={52} strokeWidth={2} />
                </motion.span>
            );
        })}
    </div>
);

const Column = ({ bar, show, i, gapLeft }: { bar: FatBar; show: boolean; i: number; gapLeft: boolean }) => (
    <Appear show={show} delay={i * 0.12} className={`flex w-[118px] flex-col items-center gap-2 ${gapLeft ? 'ml-10' : ''}`}>
        <div className="relative w-[78px]" style={{ height: BAR_H + 44 }}>
            <div className="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-lg" style={{ height: (bar.gmin / MAX_G) * BAR_H }}>
                {show && <Grow value={1} axis="y" color={bar.id === 'hc' ? C.co2 : C.fat} delay={i * 0.12} />}
            </div>
            <div className="absolute -inset-x-6 text-center" style={{ bottom: (bar.gmin / MAX_G) * BAR_H + 8 }}>
                <CountUp text={`${bar.approx ? '~' : ''}${br(bar.gmin, 2)}`} run={show} delay={i * 0.12} className="font-display text-[34px] font-bold leading-none" style={{ color: bar.id === 'hc' ? C.co2 : C.fat }} />
            </div>
        </div>
        <span className="flex h-[44px] items-start text-center text-[17px] font-semibold leading-tight text-white">{bar.label}</span>
        <span className="text-[16px] text-gray-400">{bar.sub}</span>
    </Appear>
);

const CHIPS = [
    <DesignChip key="0">pré-pós sem controle · n = 5 · 4 semanas</DesignChip>,
    <><DesignChip key="1">pré-pós sem controle · n = 5</DesignChip><ViaReviewChip key="v">via revisão (Burke 2021)</ViaReviewChip></>,
    <DesignChip key="2">transversal · 10 × 10 · sem teste de desempenho</DesignChip>,
    <DesignChip key="3">marchadores de elite · dieta fornecida</DesignChip>,
];

export default function FatPromiseSim() {
    const { step } = useSlideSteps(FAT_BEATS.length);
    const archive = step < 2;
    return (
        <Frame>
            <Headline beat={step} chips={CHIPS[step]} size={28}>{FAT_BEATS[step]}</Headline>
            <div className="mt-5 flex flex-1 items-start gap-10">
                {/* o arquivo de 1983 */}
                <motion.div className="flex w-[400px] shrink-0 flex-col gap-4 rounded-2xl p-6" initial={false}
                    animate={{ opacity: archive ? 1 : 0.6 }} transition={{ duration: DUR.enter }}
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <span className="font-display text-[56px] font-bold leading-none text-white">1983</span>
                    <Cyclists step={step} />
                    <p className="m-0 text-[20px] leading-snug text-gray-200">
                        Exaustão a {PHINNEY.intensity}:<br />
                        <span className="text-[30px] font-bold text-white tabular-nums">{PHINNEY.before} → {PHINNEY.after} min</span>
                    </p>
                    <Appear show={step === 1} className="text-[20px] leading-snug" style={{ color: C.fat }}>
                        um ciclista melhorou muito; a média foi com ele
                    </Appear>
                </motion.div>
                {/* as colunas de gordura */}
                <div className="flex flex-col">
                    <Appear show={step >= 2} className="mb-2 text-[17px] text-gray-300">oxidação de gordura (g/min)</Appear>
                    <div className="flex items-end gap-5">
                        {FAT_BARS.map((b, i) => <Column key={b.id} bar={b} i={i % 2} gapLeft={i === 2} show={step >= b.from} />)}
                    </div>
                </div>
            </div>
            <Appear show={step === 2} delay={0.8} className="pointer-events-none absolute left-[690px] top-[110px] font-display text-[64px] font-bold" style={{ color: C.fat }}>
                2,3×
            </Appear>
            <Foot source={FAT_SOURCES[step]} />
        </Frame>
    );
}
