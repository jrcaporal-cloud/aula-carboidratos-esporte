import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { Beat } from './kit/Beat';
import { C } from './kit/palette';
import { Chip, SvgText } from './kit/ui';
import { Lead, SimFrame } from './ato6/Frame';
import { BANDS, DIAL_HOURS, FRONTIER, SOURCES } from './ato6/clock.content';

/**
 * Slide 112 · O Relógio da Prova. Um mostrador de 0 a 6 h: o ponteiro gira até cada faixa de duração,
 * a faixa acende e a recomendação aparece ao lado. O último passo acende o anel externo dos 120 g/h.
 * Ponto de partida do Ato X.
 */

const S = 400;
const CX = S / 2;
const R = 136;
const angle = (h: number) => (h / DIAL_HOURS) * 360 - 90;
const polar = (h: number, r: number): [number, number] => {
    const a = (angle(h) * Math.PI) / 180;
    return [CX + r * Math.cos(a), CX + r * Math.sin(a)];
};
const arc = (h0: number, h1: number, r: number) => {
    const [x0, y0] = polar(h0, r);
    const [x1, y1] = polar(h1, r);
    const large = h1 - h0 > DIAL_HOURS / 2 ? 1 : 0;
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

const Dial = ({ step }: { step: number }) => {
    const reduce = useReducedMotion();
    const band = BANDS[Math.min(step, 2)];
    const handHour = (band.from + band.to) / 2;
    return (
        <svg viewBox={`0 0 ${S} ${S}`} width={S} height={S} role="img" aria-label="Mostrador de duração da prova">
            {BANDS.map((b, i) => (
                <motion.path key={b.duration} d={arc(b.from + 0.04, b.to - 0.04, R)} fill="none" stroke={b.color}
                    strokeWidth={i === Math.min(step, 2) && step < 3 ? 52 : 34}
                    initial={false} animate={{ opacity: i === Math.min(step, 2) && step < 3 ? 1 : 0.6 }} transition={{ duration: DUR.enter }} />
            ))}
            {/* anel externo: a fronteira experimental de 120 g/h, nas provas longas */}
            <motion.path d={arc(2.54, 5.96, R + 42)} fill="none" stroke={C.fructose} strokeWidth={10} strokeDasharray="14 10"
                initial={false} animate={{ opacity: step === 3 ? 1 : 0 }} transition={{ duration: DUR.enter }} />
            {Array.from({ length: DIAL_HOURS }, (_, h) => {
                const [x, y] = polar(h, R - 50);
                return <SvgText key={h} x={x} y={y + 6} text={`${h} h`} anchor="middle" size={18} color="#CBD5E1" weight={600} />;
            })}
            <motion.g initial={false} animate={{ rotate: angle(handHour) + 90 }}
                transition={{ duration: reduce ? 0 : 0.8, ease: EASE_IN_OUT }}>
                {/* círculo invisível centrado no eixo: o giro acontece em torno do centro do mostrador */}
                <circle cx={CX} cy={CX} r={R} fill="transparent" />
                <line x1={CX} y1={CX} x2={CX} y2={CX - R + 30} stroke="#F9FAFB" strokeWidth={6} strokeLinecap="round" />
            </motion.g>
            <circle cx={CX} cy={CX} r={12} fill="#F9FAFB" />
        </svg>
    );
};

export default function DurationClockSim() {
    const { step } = useSlideSteps(4);
    const info = step === 3 ? { ...FRONTIER, color: C.fructose } : BANDS[step];
    return (
        <SimFrame chips={step === 3 ? <Chip color={C.stone}>experimental</Chip> : <Chip color={C.co2}>consenso do COI 2010/2011</Chip>} source={SOURCES[step]}>
            <div className="flex h-full items-center gap-14 pl-6">
                <div className="shrink-0"><Dial step={step} /></div>
                <Beat beat={step} className="flex min-w-0 flex-1 flex-col gap-4">
                    <span className="text-[26px] font-semibold text-gray-200">{info.duration}</span>
                    <span className="font-display text-[84px] font-bold leading-[0.95]" style={{ color: info.color }}>{info.dose}</span>
                    <Lead size={28}>{info.how}</Lead>
                    <motion.span className="self-start rounded-lg px-4 py-2 text-[20px] font-semibold"
                        style={{ background: `${info.color}26`, color: '#F3F4F6' }}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: DUR.enter, ease: EASE_OUT }}>
                        {info.mechanism}
                    </motion.span>
                </Beat>
            </div>
        </SimFrame>
    );
}
