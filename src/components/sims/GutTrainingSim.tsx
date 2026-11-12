import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../lib/motion';
import { Beat, Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { castOf } from './kit/cast';
import { DesignChip, FictionChip } from './kit/chips';
import { C, PANEL_BG } from './kit/palette';
import { SvgText } from './kit/ui';
import { Lead, SimFrame } from './ato6/Frame';
import { COX, DAYS, DESIGN, DISTANCE, LEADS, SIDE_STATS, SOURCES } from './ato6/gut.content';

/**
 * Slide 109 · O Intestino Treina. Faixa do Diego (caso fictício) no alto; embaixo, a imagem principal de cada passo:
 * o calendário de 14 dias que se preenche, as barras de distância dos três grupos (Costa 2017) e a rampa da oxidação
 * exógena em 28 dias (Cox 2010), com a ressalva da elite ao lado.
 */

const diego = castOf('diego');

const Banner = () => {
    const Icon = diego.icon;
    return (
        <div className="flex items-center gap-5 rounded-2xl px-6 py-3" style={PANEL_BG}>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Icon size={28} color="#E5E7EB" aria-hidden />
            </span>
            <div className="flex flex-col">
                <span className="text-[22px] font-bold text-white">{diego.name}, {diego.age} anos</span>
                <span className="text-[17px] text-gray-400">{diego.sport} · {diego.effort} de prova</span>
            </div>
            <span className="ml-auto text-[24px] italic text-gray-100">{diego.dilemma}</span>
        </div>
    );
};

const Calendar = ({ filled }: { filled: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-7 gap-3">
                {Array.from({ length: DAYS }, (_, i) => (
                    <div key={i} className="relative flex h-[76px] items-end overflow-hidden rounded-xl bg-white/8 p-2">
                        <motion.span className="absolute inset-0 rounded-xl" style={{ background: C.stone, transformOrigin: 'center bottom' }}
                            initial={{ scaleY: 0 }} animate={{ scaleY: filled ? 1 : 0 }}
                            transition={{ duration: reduce ? 0 : DUR.enter, delay: filled ? stagger(i, 0.1, 0.05) : 0, ease: EASE_OUT }} />
                        <span className="relative font-mono text-[16px]" style={{ color: filled ? '#04080F' : '#9CA3AF' }}>dia {i + 1}</span>
                    </div>
                ))}
            </div>
            <span className="text-[18px] text-gray-400">2 semanas de treino com gel durante o exercício</span>
        </div>
    );
};

/** Barras divergentes: variação da distância em 1 h por grupo; o zero no meio. */
const DistanceBars = () => {
    const max = 6;
    return (
        <div className="flex flex-1 flex-col gap-3">
            <span className="text-[19px] text-gray-300">distância em 1 h, depois das 2 semanas</span>
            {DISTANCE.map((d, i) => {
                const pos = d.value >= 0;
                const color = d.group === 'placebo' ? C.co2 : C.glucose;
                return (
                    <div key={d.group} className="grid grid-cols-[110px_1fr] items-center gap-4">
                        <span className="text-[21px] font-semibold text-gray-100">{d.group}</span>
                        <div className="relative h-[46px]">
                            <span className="absolute inset-y-0 left-[30%] w-[3px] bg-white/60" />
                            <div className="absolute inset-y-[6px] overflow-hidden rounded-md"
                                style={pos ? { left: '30%', width: `${(d.value / max) * 70}%` } : { right: '70%', width: `${(-d.value / max) * 70}%` }}>
                                <div className="absolute inset-0" style={{ transform: pos ? undefined : 'scaleX(-1)' }}>
                                    <Grow value={1} color={color} delay={stagger(i, 0.15, 0.12)} />
                                </div>
                            </div>
                            <span className="absolute top-1/2 -translate-y-1/2 font-display text-[30px] font-bold"
                                style={pos ? { left: `calc(30% + ${(d.value / max) * 70}% + 12px)`, color } : { left: 'calc(30% + 12px)', color: '#D1D5DB' }}>
                                {d.text}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const SideStats = () => (
    <div className="flex w-[300px] shrink-0 flex-col gap-3">
        {SIDE_STATS.map((s, i) => (
            <motion.div key={s.label} className="flex flex-col rounded-2xl px-5 py-3" style={PANEL_BG}
                initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stagger(i, 0.3, 0.12), duration: DUR.enter, ease: EASE_OUT }}>
                <CountUp text={s.value} delay={stagger(i, 0.3, 0.12)} className="font-display text-[48px] font-bold leading-none text-white" />
                <span className="text-[18px] leading-snug text-gray-300">{s.label}</span>
            </motion.div>
        ))}
    </div>
);

/** Rampa de Cox 2010: oxidação exógena antes × depois de 28 dias de CHO alto. */
const CoxSlope = () => {
    const reduce = useReducedMotion();
    const W = 560;
    const H = 230;
    const y = (g: number) => H - 40 - ((g - 50) / 16) * (H - 80);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="Oxidação exógena antes e depois de 28 dias">
            <SvgText x={0} y={20} text="oxidação exógena de glicose no teste (g)" size={18} color="#CBD5E1" weight={500} />
            <line x1={110} x2={110} y1={40} y2={H - 30} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
            <line x1={450} x2={450} y1={40} y2={H - 30} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
            <SvgText x={110} y={H - 6} text="antes" anchor="middle" size={18} color={C.muted} />
            <SvgText x={450} y={H - 6} text="28 dias depois" anchor="middle" size={18} color={C.muted} />
            <motion.path d={`M110 ${y(COX.before)} L450 ${y(COX.after)}`} stroke={C.glucose} strokeWidth={6} strokeLinecap="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }} />
            <circle cx={110} cy={y(COX.before)} r={10} fill={C.glucose} />
            <circle cx={450} cy={y(COX.after)} r={10} fill={C.glucose} />
            <SvgText x={96} y={y(COX.before) + 7} text="54,6" anchor="end" size={26} color="#F9FAFB" weight={700} />
            <SvgText x={466} y={y(COX.after) + 7} text="63,6" size={26} color="#F9FAFB" weight={700} />
        </svg>
    );
};

const Elite = () => (
    <div className="flex flex-1 flex-col gap-3">
        <div className="rounded-2xl px-5 py-4" style={PANEL_BG}>
            <span className="block text-[20px] font-semibold text-white">mas o desempenho</span>
            <span className="block text-[19px] leading-snug text-gray-300">melhorou igual no grupo controle</span>
        </div>
        <div className="rounded-2xl px-5 py-4" style={PANEL_BG}>
            <span className="block text-[20px] font-semibold text-white">em atletas de elite</span>
            <span className="block text-[19px] leading-snug text-gray-300">ganho igual ao controle, mais sintomas</span>
        </div>
    </div>
);

export default function GutTrainingSim() {
    const { step } = useSlideSteps(4);
    return (
        <SimFrame
            lead={<Beat beat={`l${step}`}><Lead>{LEADS[step]}</Lead></Beat>}
            chips={<><FictionChip />{step > 0 && <DesignChip>{DESIGN[step]}</DesignChip>}</>}
            source={SOURCES[step]}>
            <div className="flex h-full flex-col gap-4">
                <Banner />
                <Beat beat={step} className="flex min-h-0 flex-1 items-center gap-8">
                    {step <= 1 && <div className="w-full"><Calendar filled={step === 1} /></div>}
                    {step === 2 && <><DistanceBars /><SideStats /></>}
                    {step === 3 && <><CoxSlope /><Elite /></>}
                </Beat>
            </div>
        </SimFrame>
    );
}
