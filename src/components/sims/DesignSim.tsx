import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Beat } from './kit/Beat';
import { BigStat } from './kit/Stamp';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sample, useMorphPath, type Pt } from './kit/useMorphPath';
import { Frame } from './ato10/Frame';
import { COLOMBANI, CV, DESIGNS, EFFECT, LINES, SOURCE, STATS, X_RANGE } from './ato10/design.content';

/**
 * Slide 186 · O Desenho Decide o Efeito. Duas curvas de resultado (placebo × carboidrato) com o mesmo efeito ilustrativo.
 * Com o ruído do contrarrelógio elas se separam; a curva se transforma (useMorphPath) no ruído do TTE e o efeito some.
 * Último passo: as contagens de Colombani 2013 (atleta alimentado, teste que imita a prova).
 */
const VB_W = 1136;
const VB_H = 220;
const BASE = VB_H - 4;
const PEAK = 190;
const N = 90;

/** Curva normal na mesma altura: o ruído maior alarga e as duas se sobrepõem. */
const bell = (mean: number, sd: number): Pt[] => {
    const top = sd === CV.tt ? PEAK : PEAK * 0.7;
    const pts = sample(N, -X_RANGE, X_RANGE, x => Math.exp(-((x - mean) ** 2) / (2 * sd ** 2)),
        (x, y) => [((x + X_RANGE) / (2 * X_RANGE)) * VB_W, BASE - y * top]);
    return [...pts, [VB_W, BASE], [0, BASE]];
};

const Curves = ({ sd }: { sd: number }) => {
    const placebo = useMorphPath(bell(0, sd), 800);
    const cho = useMorphPath(bell(EFFECT, sd), 800);
    return (
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height={VB_H} aria-label="Distribuição do resultado com placebo e com carboidrato">
            <path ref={placebo} fill="rgba(148,163,184,0.30)" stroke={C.co2} strokeWidth={4} strokeLinejoin="round" />
            <path ref={cho} fill="rgba(245,158,11,0.30)" stroke={C.glucose} strokeWidth={4} strokeLinejoin="round" />
            <line x1={0} x2={VB_W} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.45)" strokeWidth={2} />
        </svg>
    );
};

const Legend = () => (
    <div className="flex items-center gap-6 text-[18px] text-gray-200">
        <span className="flex items-center gap-2"><span className="h-3 w-7 rounded" style={{ background: C.co2 }} />placebo</span>
        <span className="flex items-center gap-2"><span className="h-3 w-7 rounded" style={{ background: C.glucose }} />carboidrato</span>
        <span className="text-gray-300">eixo: mudança no desempenho, de −{X_RANGE}% a +{X_RANGE}%</span>
    </div>
);

const Tallies = () => (
    <div className="flex h-full flex-col justify-center gap-9">
        <BigStat value={COLOMBANI.headline.value} caption={COLOMBANI.headline.caption} color={C.stone} size={88}
            style={{ flexDirection: 'row', alignItems: 'baseline', gap: 28 }} />
        <div className="flex items-start gap-16">
            {COLOMBANI.rows.map((r, ri) => (
                <div key={r.label} className="flex flex-col gap-3">
                    <span className="font-display text-[48px] font-bold tabular-nums leading-none text-white">{r.lit} de {r.total}</span>
                    <div className="flex flex-wrap gap-[8px]" style={{ maxWidth: 9 * 36 }}>
                        {Array.from({ length: r.total }, (_, i) => (
                            <motion.span key={i} className="block h-[28px] w-[28px] rounded-full border-[3px]"
                                style={{ borderColor: C.glucose, background: i < r.lit ? C.glucose : 'transparent' }}
                                initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: stagger(i, 0.15 + ri * 0.2, 0.025), duration: DUR.text, ease: EASE_OUT }} />
                        ))}
                    </div>
                    <span className="text-[19px] text-gray-200">{r.label}: melhoraram</span>
                </div>
            ))}
            <span className="max-w-[320px] pt-2 text-[21px] leading-snug text-gray-200">{COLOMBANI.note}</span>
        </div>
    </div>
);

export default function DesignSim() {
    const { step } = useSlideSteps(LINES.length);
    const sd = step === 0 ? CV.tt : CV.tte;
    const chips = step < 2
        ? <><IllustrativeChip /><DesignChip>{DESIGNS[step]}</DesignChip></>
        : <DesignChip>{DESIGNS[step]}</DesignChip>;
    return (
        <Frame step={step} line={LINES[step]} chips={chips} source={SOURCE}>
            <div className="relative flex h-full flex-col gap-3">
                <motion.div animate={{ opacity: step === 2 ? 0 : 1 }} transition={{ duration: DUR.enter }}>
                    <Curves sd={sd} />
                    <div className="mt-2"><Legend /></div>
                </motion.div>
                <div className="flex min-h-0 flex-1 items-center">
                    {step < 2 && <Beat beat={step}><BigStat value={STATS[step].value} caption={STATS[step].caption} color={STATS[step].color} size={60} style={{ flexDirection: 'row', alignItems: 'baseline', gap: 24 }} /></Beat>}
                </div>
                {step === 2 && <Beat beat={step} className="absolute inset-0 flex items-center"><Tallies /></Beat>}
            </div>
        </Frame>
    );
}
