import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { Beat, Grow, Wipe } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { BigStat } from './kit/Stamp';
import { AnimalChip, DesignChip } from './kit/chips';
import { Source } from './kit/ui';
import { BODY_FONT, C, PANEL_BG } from './kit/palette';
import { FructoseMap, type Focus } from './ato2/FructoseMap';

/**
 * Slide 27 · O Caminho da Frutose. Um mapa de destinos (oxidada, glicose, lactato) que muda de foco:
 * o músculo recebe metade como lactato, o intestino é a primeira estação (camundongo); fecha com a galactose.
 */
interface Step {
    focus: Focus | 'galactose'; line: string; stat: string; caption: string; color: string;
    chips: readonly ('review' | 'lecoultre' | 'animal' | 'leijssen')[];
}

const STEPS: readonly Step[] = [
    { focus: 'all', chips: ['review'], stat: '≠ 100%', color: C.caveat, caption: 'as frações se sobrepõem: parte vira glicose e depois é oxidada', line: 'A frutose não vai direto ao músculo: parte é oxidada, parte vira glicose, parte vira lactato.' },
    { focus: 'muscle', chips: ['lecoultre'], stat: '½ + ½', color: C.lactate, caption: 'da frutose oxidada: via lactato e via glicose', line: 'No exercício, a frutose oxidada chega ao músculo meio a meio: como lactato e como glicose.' },
    { focus: 'gut', chips: ['animal'], stat: '≥ 1 g/kg', color: C.fructoseSoft, caption: 'satura o intestino: a frutose passa e chega ao fígado', line: 'A primeira estação é o intestino. Doses de 1 g/kg ou mais saturam e seguem para o fígado.' },
    { focus: 'galactose', chips: ['leijssen'], stat: '~½', color: C.caveat, caption: 'a galactose oxida cerca de metade do que a glicose oxida', line: 'A galactose também desvia: entra pelo SGLT1, mas oxida metade. Volta em “O Fígado Prefere Sacarose”.' },
];

const CHIP = {
    review: <DesignChip>revisão de estudos com traçadores · humanos</DesignChip>,
    lecoultre: <DesignChip>cruzado · n = 7 · traçadores</DesignChip>,
    animal: <AnimalChip>camundongo · traçadores</AnimalChip>,
    leijssen: <DesignChip>cruzado randomizado · n = 8 · ¹³C</DesignChip>,
} as const;

const BARS = [
    { name: 'glicose', value: 0.85, text: '0,85', color: C.glucose },
    { name: 'galactose', value: 0.41, text: '0,41', color: C.caveat },
] as const;

const Galactose = () => (
    <div className="flex h-[346px] w-[640px] flex-col justify-center gap-7 pr-6">
        <span className="text-[20px] text-gray-200">pico de oxidação exógena (g/min), 120 min a 65% Wmáx</span>
        {BARS.map((b, i) => (
            <div key={b.name} className="grid grid-cols-[140px_1fr_110px] items-center gap-4">
                <span className="text-[24px] font-semibold" style={{ color: b.color }}>{b.name}</span>
                <div className="relative h-[54px] overflow-hidden rounded-lg bg-slate-800">
                    <Grow value={b.value / 0.9} color={b.color} delay={0.2 + i * 0.15} />
                </div>
                <CountUp text={b.text} delay={0.2 + i * 0.15} className="font-display text-[44px] font-bold" style={{ color: b.color }} />
            </div>
        ))}
    </div>
);

export default function FructosePathSim() {
    const { step } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <div className="not-prose flex flex-col gap-3" style={BODY_FONT}>
            <div className="flex min-h-[76px] items-start justify-between gap-6">
                <Beat beat={step} className="min-w-0 flex-1">
                    <p className="m-0 text-[28px] leading-snug text-gray-100">{s.line}</p>
                </Beat>
                <motion.div key={`chips-${step}`} className="mt-1 flex shrink-0 flex-col items-end gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: DUR.enter, ease: EASE_OUT }}>
                    {s.chips.map(c => <span key={c}>{CHIP[c]}</span>)}
                </motion.div>
            </div>
            <div className="grid grid-cols-[640px_1fr] items-center gap-6 rounded-2xl px-5 py-2" style={PANEL_BG}>
                {s.focus === 'galactose'
                    ? <Wipe from="left"><Galactose /></Wipe>
                    : <FructoseMap focus={s.focus} />}
                <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: DUR.enter, ease: EASE_OUT }}>
                    <BigStat value={s.stat} caption={s.caption} color={s.color} size={68} />
                </motion.div>
            </div>
            <Source>Sun SZ, Empie MW. Nutr Metab 2012 · Lecoultre V et al. Am J Clin Nutr 2010 · Jang C et al. Cell Metab 2018 · Leijssen DP et al. J Appl Physiol 1995</Source>
        </div>
    );
}
