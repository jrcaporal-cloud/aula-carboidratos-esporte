import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { BigStat } from './kit/Stamp';
import { CalcChip, DesignChip } from './kit/chips';
import { Frame } from './ato10/Frame';
import { LENSES, MILESTONES, SOURCE, type Lens } from './ato10/sbme.content';

/**
 * Slide 181 · A Diretriz Brasileira Parou em 2009. Linha do tempo 2000 → 2011 no alto; o ano aceso abre a "lente"
 * embaixo com os números daquele documento. A virada: a diretriz de 2009 veio cinco anos depois da mistura de 2004.
 */
const Y0 = 1998;
const Y1 = 2013;
const xOf = (year: number) => `${((year - Y0) / (Y1 - Y0)) * 100}%`;

const Timeline = ({ focus }: { focus: readonly number[] }) => (
    <div className="relative h-[92px] [container-type:inline-size]">
        <div className="absolute inset-x-0 top-[22px] h-[3px] rounded bg-white/25" />
        {MILESTONES.map(m => {
            const on = focus.includes(m.year);
            const color = m.year === 2009 ? C.stone : m.year === 2011 ? C.ok : m.year === 2004 ? C.fructose : C.co2;
            return (
                <div key={m.year} className="absolute top-0 flex w-0 flex-col items-center" style={{ left: xOf(m.year) }}>
                    <motion.span className="mt-[12px] block h-[22px] w-[22px] rounded-full border-[3px]"
                        style={{ borderColor: color }}
                        animate={{ scale: on ? 1.25 : 1, backgroundColor: on ? color : '#04080F' }}
                        transition={{ duration: DUR.enter, ease: EASE_OUT }} />
                    <motion.span className="mt-2 whitespace-nowrap font-display text-[26px] font-bold tabular-nums leading-none"
                        animate={{ color: on ? '#FFFFFF' : '#6B7280' }} transition={{ duration: DUR.text }}>
                        {m.year}
                    </motion.span>
                    <motion.span className="mt-1 whitespace-nowrap text-[16px]"
                        animate={{ color: on ? '#E5E7EB' : '#6B7280' }} transition={{ duration: DUR.text }}>
                        {m.who}
                    </motion.span>
                </div>
            );
        })}
    </div>
);

const LensView = ({ lens, index }: { lens: Lens; index: number }) => (
    <motion.div key={index} className="flex h-full flex-col justify-center gap-10 rounded-2xl border-2 border-white/12 px-10 py-7" style={PANEL_BG}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
        <div className="flex items-start gap-14">
            {lens.stats.map((s, i) => (
                <BigStat key={s.value} value={s.value} caption={s.caption} color={s.color} size={68} delay={stagger(i, 0.1, 0.12)} />
            ))}
        </div>
        {lens.quote && <p className="m-0 text-[21px] italic leading-snug" style={{ color: C.stone }}>{lens.quote}</p>}
    </motion.div>
);

export default function SbmeSim() {
    const { step } = useSlideSteps(LENSES.length);
    const lens = LENSES[step];
    return (
        <Frame step={step} line={lens.line} source={SOURCE}
            chips={<>{lens.design && <DesignChip>{lens.design}</DesignChip>}{lens.chip && <CalcChip>{lens.chip}</CalcChip>}</>}>
            <div className="flex h-full flex-col gap-3">
                <div className="px-6"><Timeline focus={lens.focus} /></div>
                <div className="min-h-0 flex-1"><LensView lens={lens} index={step} /></div>
            </div>
        </Frame>
    );
}
