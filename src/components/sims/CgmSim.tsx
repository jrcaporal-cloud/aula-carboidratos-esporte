import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Beat, Wipe } from './kit/Beat';
import { BigStat } from './kit/Stamp';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sample, toPath } from './kit/useMorphPath';
import { Frame } from './ato10/Frame';
import { BOWLER, DESIGNS, glucoseAt, LINES, MATKIN, SOURCE, THOMAS, THRESHOLD } from './ato10/cgm.content';

/**
 * Slide 185 · Glicose Contínua em Atleta. Uma faixa de monitor no alto (curva ilustrativa de 24 h, área acima de 6 mmol/L
 * pintada); embaixo, o que os estudos acharam: picos comuns em subelite, elite "normal", e o CGM que não separa REDs.
 */
const VB_W = 1136;
const VB_H = 170;
const Y_MIN = 3.5;
const Y_MAX = 9;
const yOf = (mmol: number) => VB_H - ((mmol - Y_MIN) / (Y_MAX - Y_MIN)) * VB_H;
const CURVE = sample(120, 0, 24, glucoseAt, (h, g) => [(h / 24) * VB_W, yOf(g)]);
const LINE_D = toPath(CURVE);
const AREA_D = `${LINE_D} L${VB_W} ${VB_H} L0 ${VB_H} Z`;
const Y_TH = yOf(THRESHOLD);

const EVENTS = [
    { at: 7.5, label: 'café' },
    { at: 12.5, label: 'almoço' },
    { at: 17, label: 'treino intenso' },
    { at: 20, label: 'jantar' },
] as const;

const Monitor = ({ lit }: { lit: boolean }) => (
    <div className="relative">
        <div className="relative h-[28px]">
            {EVENTS.map(e => (
                <span key={e.label} className="absolute -translate-x-1/2 whitespace-nowrap text-[17px] text-gray-200" style={{ left: `${(e.at / 24) * 100}%` }}>{e.label}</span>
            ))}
        </div>
        <Wipe from="left" duration={DUR.draw}>
            <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height={VB_H} aria-label="Curva ilustrativa de glicose em 24 h">
                <defs><clipPath id="cgm-above"><rect x={0} y={0} width={VB_W} height={Y_TH} /></clipPath></defs>
                <motion.path d={AREA_D} fill={C.glucose} clipPath="url(#cgm-above)" initial={false}
                    animate={{ opacity: lit ? 0.45 : 0.18 }} transition={{ duration: DUR.enter }} />
                <line x1={0} x2={VB_W} y1={Y_TH} y2={Y_TH} stroke={C.stone} strokeWidth={2} strokeDasharray="10 8" />
                <path d={LINE_D} fill="none" stroke={C.glucose} strokeWidth={4} strokeLinejoin="round" />
            </svg>
        </Wipe>
        <span className="absolute right-0 font-mono text-[16px]" style={{ top: Y_TH - 26, color: C.stone }}>6,0 mmol/L</span>
        <div className="mt-1 flex justify-between font-mono text-[16px] text-gray-300">
            {['0 h', '6 h', '12 h', '18 h', '24 h'].map(t => <span key={t}>{t}</span>)}
        </div>
    </div>
);

const People = () => (
    <div className="flex flex-col gap-4">
        {THOMAS.rows.map((row, r) => (
            <div key={row.text} className="flex items-center gap-6">
                <div className="flex gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                        <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: stagger(i, r * 0.3, 0.03), duration: DUR.text }}>
                            <User size={34} strokeWidth={2.6} color={i < row.lit ? C.glucose : '#4B5563'} fill={i < row.lit ? C.glucose : 'none'} aria-hidden />
                        </motion.span>
                    ))}
                </div>
                <span className="font-display text-[40px] font-bold tabular-nums leading-none text-white">{row.lit} de 10</span>
                <span className="max-w-[360px] text-[19px] leading-snug text-gray-200">{row.text}</span>
            </div>
        ))}
    </div>
);

const Elite = () => (
    <div className="flex items-end gap-14">
        <BigStat value={BOWLER.mean.value} caption={BOWLER.mean.caption} color={C.ok} size={64} />
        <BigStat value={BOWLER.mage.value} caption={BOWLER.mage.caption} color={C.ok} size={64} delay={0.15} />
        <span className="pb-1 text-[20px] text-gray-200">{BOWLER.note}</span>
    </div>
);

const Reds = () => (
    <div className="flex flex-col gap-4">
        <div className="flex items-end gap-14">
            {MATKIN.stats.map((s, i) => <BigStat key={s.value} value={s.value} caption={s.caption} color={C.stone} size={60} delay={i * 0.15} />)}
        </div>
        <span className="text-[20px] italic text-gray-200">{MATKIN.quote}</span>
    </div>
);

const BODY = [null, <People key="p" />, <Elite key="e" />, <Reds key="r" />];

export default function CgmSim() {
    const { step } = useSlideSteps(LINES.length);
    const chip = step === 0 ? <IllustrativeChip /> : <DesignChip>{DESIGNS[step]}</DesignChip>;
    return (
        <Frame step={step} line={LINES[step]} chips={chip} source={SOURCE}>
            <div className="flex h-full flex-col gap-6">
                <motion.div animate={{ opacity: step >= 2 ? 0.65 : 1 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                    <Monitor lit={step === 1} />
                </motion.div>
                <div className="min-h-0 flex-1">
                    {step > 0 && <Beat beat={step}>{BODY[step]}</Beat>}
                </div>
            </div>
        </Frame>
    );
}
