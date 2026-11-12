import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { CountSvgText } from '../kit/CountUp';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CASES, CLOCK_HOURS, DIAL_BANDS, DIAL_CENTER_EXTRA } from './clock.content';

/**
 * Slide 112 · o mostrador. Um relógio de 12 h em que a prova começa no 12: as faixas do consenso
 * acendem uma por passo e ficam; o ponteiro de borda gira até a faixa nova; o centro mostra a dose.
 * No passo 4 o anel tracejado dos 120 g/h aparece sobre a faixa longa; no 5, Marina e Diego pousam no anel.
 */

export const DIAL_W = 380;
export const DIAL_H = 392;
/** Tamanho na tela (o texto do viewBox é ≥ 18 para ficar ≥ 16 px efetivos). */
export const DIAL_RENDER = 348;
const CX = DIAL_W / 2;
const CY = 190;
const R = 124;
const R_FRONT = 162;

const deg = (h: number) => (h / CLOCK_HOURS) * 360;
const polar = (h: number, r: number): [number, number] => {
    const a = ((deg(h) - 90) * Math.PI) / 180;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};
const arc = (h0: number, h1: number, r: number) => {
    const [x0, y0] = polar(h0, r);
    const [x1, y1] = polar(h1, r);
    const large = h1 - h0 > CLOCK_HOURS / 2 ? 1 : 0;
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

/** Para onde o ponteiro aponta em cada passo (horas de prova). */
const HAND_AT = [0.5, 1.75, 6.5, 6.5, 6.5] as const;

const centerOf = (step: number) => {
    if (step <= 2) return DIAL_BANDS[step];
    return DIAL_CENTER_EXTRA[step - 3];
};

export const ClockDial = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const center = centerOf(step);
    const big = /\d/.test(center.center) ? 36 : 27;
    return (
        <svg viewBox={`0 0 ${DIAL_W} ${DIAL_H}`} width={DIAL_RENDER} height={(DIAL_RENDER * DIAL_H) / DIAL_W} role="img"
            aria-label="Relógio da prova: carboidrato por hora conforme a duração">
            {/* trilho: o relógio inteiro já está lá; a faixa só ganha cor quando entra */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#1E293B" strokeWidth={34} />
            {DIAL_BANDS.map((b, i) => (
                <motion.path key={b.id} d={arc(b.from + 0.06, b.to - 0.06, R)} fill="none" stroke={b.color} strokeWidth={34}
                    initial={false} animate={{ opacity: i <= step ? 1 : 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }} />
            ))}
            {/* realce da faixa do passo: um anel mais largo por cima, só por opacidade */}
            {DIAL_BANDS.map((b, i) => (
                <motion.path key={`hi-${b.id}`} d={arc(b.from + 0.06, b.to - 0.06, R)} fill="none" stroke={b.color} strokeWidth={48}
                    initial={false} animate={{ opacity: i === step ? 1 : 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }} />
            ))}
            {/* anel externo: a fronteira de 120 g/h, só nas provas longas e em treinados */}
            <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: DUR.morph, ease: EASE_OUT }}>
                <path d={arc(2.56, CLOCK_HOURS - 0.06, R_FRONT)} fill="none" stroke={C.stone} strokeWidth={7} strokeDasharray="14 10" />
                <SvgText x={CX} y={DIAL_H - 6} text="120 g/h · treinados" anchor="middle" size={18} color={C.stone} weight={700} />
            </motion.g>
            {Array.from({ length: CLOCK_HOURS }, (_, h) => {
                const [x, y] = polar(h, R - 46);
                return <SvgText key={h} x={x} y={y + 6} text={h === 0 ? '12' : String(h)} anchor="middle" size={18} color="#CBD5E1" weight={600} />;
            })}
            {/* ponteiro de borda: gira em torno do centro (círculo invisível centra a caixa do grupo) */}
            <motion.g initial={false} animate={{ rotate: deg(HAND_AT[step]) }}
                transition={{ duration: reduce ? 0 : 0.8, ease: EASE_IN_OUT }}>
                <circle cx={CX} cy={CY} r={R + 30} fill="transparent" />
                {/* contorno escuro por baixo: o ponteiro branco não some sobre a faixa branca do ~1 h */}
                <line x1={CX} y1={CY - R + 28} x2={CX} y2={CY - R - 30} stroke="#04080F" strokeWidth={13} strokeLinecap="round" />
                <line x1={CX} y1={CY - R + 28} x2={CX} y2={CY - R - 30} stroke="#F9FAFB" strokeWidth={7} strokeLinecap="round" />
                <circle cx={CX} cy={CY - R + 28} r={8} fill="#F9FAFB" stroke="#04080F" strokeWidth={3} />
            </motion.g>
            {/* centro: a dose do passo, contando até o valor */}
            <g key={`c${step}`}>
                <CountSvgText x={CX} y={CY + (big > 30 ? 6 : 3)} text={center.center} anchor="middle" size={big} color={center.color} weight={700} />
                <SvgText x={CX} y={CY + 34} text={center.centerSub} anchor="middle" size={18} color="#E5E7EB" weight={500} />
            </g>
            {CASES.map((c, i) => {
                const [x, y] = polar(c.hours, R);
                return (
                    <motion.g key={c.id} initial={false}
                        animate={step >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 24, delay: 0.25 + i * 0.15 }}>
                        <circle cx={x} cy={y} r={17} fill="#F9FAFB" stroke="#04080F" strokeWidth={3} />
                        <text x={x} y={y + 6} textAnchor="middle" fontSize={19} fontWeight={800} fill="#04080F"
                            style={{ fontFamily: 'var(--font-body)' }}>{c.letter}</text>
                    </motion.g>
                );
            })}
        </svg>
    );
};
