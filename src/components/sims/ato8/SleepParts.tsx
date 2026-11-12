import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CLOCK, STUDIES, type ClockArc, type Metric, type StudyCard } from './sleeplow.content';

/** Peças do slide 142: o relógio de 24 h do sleep low e a pilha de estudos que acumula. */

const S = 300;
const O = S / 2;
const R_OUT = 112;
const R_IN = 76;

const ARC_STYLE: Record<ClockArc['id'], { fill: string; stroke: string }> = {
    hit: { fill: C.glucose, stroke: C.glucose },
    refuel: { fill: `${C.glucose}66`, stroke: C.glucose },
    easy: { fill: '#04080F', stroke: C.stone },
    night: { fill: '#1E293B', stroke: C.co2 },
};

const polar = (h: number, r: number): [number, number] => {
    const a = ((h / 24) * 360 - 90) * (Math.PI / 180);
    return [O + r * Math.cos(a), O + r * Math.sin(a)];
};

const arcPath = (from: number, to: number) => {
    const span = (to - from + 24) % 24;
    const large = span > 12 ? 1 : 0;
    const [x1, y1] = polar(from, R_OUT);
    const [x2, y2] = polar(from + span, R_OUT);
    const [x3, y3] = polar(from + span, R_IN);
    const [x4, y4] = polar(from, R_IN);
    return `M ${x1} ${y1} A ${R_OUT} ${R_OUT} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${R_IN} ${R_IN} 0 ${large} 0 ${x4} ${y4} Z`;
};

/** Ponteiro: no passo 1 percorre uma vez a noite do sleep low (17 h → 7 h). */
const Hand = ({ run }: { run: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    const deg = (h: number) => (h / 24) * 360;
    return (
        <motion.g style={{ transformOrigin: `${O}px ${O}px`, transformBox: 'view-box' }}
            initial={false} animate={{ rotate: run && !reduce ? [deg(17), deg(31)] : deg(31) }}
            transition={{ duration: run && !reduce ? 1.15 : 0, ease: EASE_IN_OUT }}>
            <line x1={O} y1={O - 60} x2={O} y2={O - R_OUT - 8} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" />
        </motion.g>
    );
};

export const DayClock = ({ step }: { step: number }) => (
    <div className="flex flex-col items-center gap-2">
        <svg viewBox={`0 0 ${S} ${S}`} width={S} height={S} role="img" aria-label="Relógio de 24 horas do sleep low">
            {CLOCK.map((a, i) => (
                <motion.path key={a.id} d={arcPath(a.from, a.to)} fill={ARC_STYLE[a.id].fill} stroke={ARC_STYLE[a.id].stroke} strokeWidth={3}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter, delay: stagger(i, 0.05, 0.12), ease: EASE_OUT }} />
            ))}
            {[0, 6, 12, 18].map(h => {
                const [x, y] = polar(h, 132);
                return <SvgText key={h} x={x} y={y + 6} text={`${h} h`} size={16} anchor="middle" color={C.muted} weight={700} />;
            })}
            <circle cx={O} cy={O} r={58} fill="#04080F" />
            <Hand run={step === 0} />
            <SvgText x={O} y={O - 2} text="6 g/kg/d" size={24} anchor="middle" color={C.glucoseSoft} weight={800} />
            <SvgText x={O} y={O + 22} text="nos dois grupos" size={16} anchor="middle" color="#E5E7EB" weight={600} />
        </svg>
        <ul className="m-0 flex w-full list-none flex-col gap-1 p-0 px-3">
            {CLOCK.map(a => (
                <li key={a.id} className="flex items-center gap-3 text-[17px] font-semibold text-gray-100">
                    <span className="h-[16px] w-[26px] shrink-0 rounded-[4px] border-[3px]" style={{ background: ARC_STYLE[a.id].fill, borderColor: ARC_STYLE[a.id].stroke }} />
                    {a.label}
                </li>
            ))}
        </ul>
    </div>
);

const MetricRow = ({ m, delay }: { m: Metric; delay: number }) => (
    <div className="flex items-center gap-2">
        <span className="w-[112px] shrink-0 text-[16px] font-semibold text-gray-200">{m.label}</span>
        <div className="flex flex-1 flex-col gap-[3px]">
            {([['low', m.low, C.stone], ['ctl', m.ctl, C.glucose]] as const).map(([k, v, color]) => (
                <div key={k} className="flex items-center gap-2">
                    <div className="relative h-[12px] flex-1 overflow-hidden rounded-[4px]" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <Grow value={Math.abs(v) / m.max} color={color} delay={delay} />
                    </div>
                    <span className="w-[66px] text-right text-[16px] font-bold tabular-nums" style={{ color }}>{`${br(v, m.unit === '%' ? 1 : 0)}${m.unit}`}</span>
                </div>
            ))}
        </div>
    </div>
);

const Card = ({ c, step }: { c: StudyCard; step: number }) => {
    const cur = step === c.at;
    const delay = cur ? 0.25 + STUDIES.filter(s => s.at === c.at).indexOf(c) * 0.15 : 0;
    return (
        <motion.div className="flex flex-col gap-1 rounded-xl border-2 px-3 py-1.5" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: DUR.enter, delay, ease: EASE_OUT }}
            style={{ borderColor: cur ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.04)' }}>
            <p className="m-0 text-[16px] leading-tight text-gray-300">
                <span className="text-[18px] font-bold text-white">{c.who}</span> · {c.design}
            </p>
            {c.metrics.map(m => <MetricRow key={m.label} m={m} delay={delay + 0.2} />)}
            {c.notes?.map(n => <p key={n} className="m-0 text-[16px] font-semibold leading-tight" style={{ color: C.stone }}>{n}</p>)}
        </motion.div>
    );
};

export const StudyStack = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-[6px]">
        <div className="flex items-center gap-4 text-[16px] font-semibold text-gray-200">
            <span className="flex items-center gap-2"><span className="h-[14px] w-[22px] rounded-[3px]" style={{ background: C.stone }} />sleep / train low</span>
            <span className="flex items-center gap-2"><span className="h-[14px] w-[22px] rounded-[3px]" style={{ background: C.glucose }} />controle</span>
        </div>
        {STUDIES.filter(c => step >= c.at).map(c => <Card key={c.id} c={c} step={step} />)}
    </div>
);
