import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CountSvgText } from '../kit/CountUp';
import { PCT_MAX, SERIES, type Organ, type Point } from './fuchs.content';

/**
 * Palco do slide 125: dois gráficos empilhados com o mesmo eixo de tempo (antes · 0 · 6 · 12 h) e a mesma escala
 * (% do valor de antes). Em cima o fígado, que passa da linha de 100% em 6 h (área "transbordou"); embaixo o músculo,
 * que fica abaixo dela até as 12 h. Tracejado = braço em jejum (esquema: o resumo diz só "nada se recuperou").
 * Geometria em px do palco (viewBox 1:1 com a caixa).
 */

export const CHART_W = 676;
export const CHART_H = 440;

const X: Record<Point['at'], number> = { pre: 112, 0: 198, 6: 396, 12: 592 };
const CHART: Record<Organ, { top: number; bottom: number }> = {
    liver: { top: 36, bottom: 176 },
    muscle: { top: 214, bottom: 354 },
};
const BAND_FONT = { fontFamily: 'var(--font-body)' } as const;
const yOf = (organ: Organ, pct: number): number => {
    const { top, bottom } = CHART[organ];
    return bottom - (pct / PCT_MAX) * (bottom - top);
};
const pt = (organ: Organ, p: Point): readonly [number, number] => [X[p.at], yOf(organ, p.pct)];
const line = (pts: readonly (readonly [number, number])[]): string => pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');

/** Onde a linha do fígado cruza os 100% entre 0 e 6 h (para a área que transborda). */
const liverCross = (): number => {
    const [a, b] = [SERIES.liver.points[1], SERIES.liver.points[2]];
    return X[0] + ((100 - a.pct) / (b.pct - a.pct)) * (X[6] - X[0]);
};

const Draw = ({ d, color, show, delay = 0, dash }: { d: string; color: string; show: boolean; delay?: number; dash?: string }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        // tracejado: o pathLength do framer sobrescreve o dasharray, então o traço cresce por scaleX a partir da esquerda
        <motion.path d={d} fill="none" stroke={color} strokeWidth={dash ? 4 : 6} strokeLinecap={dash ? 'butt' : 'round'} strokeLinejoin="round"
            strokeDasharray={dash} style={dash ? { originX: 0 } : undefined}
            initial={false} animate={dash ? { scaleX: show ? 1 : 0, opacity: show ? 1 : 0 } : { pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : DUR.draw, delay: show ? delay : 0, ease: EASE_OUT }} />
    );
};

const Fade = ({ show, delay = 0, children }: { show: boolean; delay?: number; children: React.ReactNode }) => (
    <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter, delay: show ? delay : 0, ease: EASE_OUT }}>
        {children}
    </motion.g>
);

/** `line` > 0 quebra o rótulo em duas linhas ("110" / "69%") separadas por esse passo vertical. */
interface LabelSpec { dx: number; dy: number; anchor: 'start' | 'middle' | 'end'; line: number }
const LABELS: Record<Organ, readonly LabelSpec[]> = {
    liver: [{ dx: 0, dy: -16, anchor: 'middle', line: 0 }, { dx: 0, dy: 30, anchor: 'middle', line: 0 }, { dx: 0, dy: -18, anchor: 'middle', line: 0 }, { dx: 0, dy: -18, anchor: 'middle', line: 0 }],
    muscle: [{ dx: 0, dy: -16, anchor: 'middle', line: 0 }, { dx: 0, dy: -16, anchor: 'start', line: 0 }, { dx: 0, dy: -18, anchor: 'middle', line: 0 }, { dx: 22, dy: -3, anchor: 'start', line: 19 }],
};

/** Pontos e rótulos de uma série; o trecho de recuperação entra no passo `recoverAt`. */
const Series = ({ organ, step, recoverAt }: { organ: Organ; step: number; recoverAt: number }) => {
    const s = SERIES[organ];
    const pts = s.points.map(p => pt(organ, p));
    const recovered = step >= recoverAt;
    return (
        <g>
            <Draw d={line(pts.slice(0, 2))} color={s.color} show />
            <Draw d={line(pts.slice(1))} color={s.color} show={recovered} delay={0.1} />
            {s.points.map((p, i) => {
                const show = i < 2 || recovered;
                const [x, y] = pts[i];
                const l = LABELS[organ][i];
                const fresh = i >= 2 && step === recoverAt;
                return (
                    <Fade key={p.at} show={show} delay={i >= 2 ? 0.3 + (i - 2) * 0.35 : 0}>
                        <circle cx={x} cy={y} r={8} fill={s.color} stroke="#04080F" strokeWidth={3} />
                        {(l.line ? p.label.split(' · ') : [p.label]).map((part, k) => fresh
                            ? <CountSvgText key={part} x={x + l.dx} y={y + l.dy + k * l.line} text={part} anchor={l.anchor} size={18} color="#F9FAFB" weight={700} delay={0.35 + (i - 2) * 0.35} />
                            : <SvgText key={part} x={x + l.dx} y={y + l.dy + k * l.line} text={part} anchor={l.anchor} size={18} color="#F9FAFB" weight={700} />)}
                    </Fade>
                );
            })}
        </g>
    );
};

const Frame = ({ organ }: { organ: Organ }) => {
    const { top, bottom } = CHART[organ];
    const y100 = yOf(organ, 100);
    return (
        <g>
            <rect x={X.pre} y={top - 6} width={X[0] - X.pre} height={bottom - top + 6} fill="rgba(148,163,184,0.12)" />
            <line x1={100} x2={644} y1={bottom} y2={bottom} stroke={C.co2} strokeWidth={2} />
            <line x1={100} x2={644} y1={y100} y2={y100} stroke="rgba(243,244,246,0.75)" strokeWidth={3} strokeDasharray="10 8" />
            <SvgText x={92} y={y100 + 6} text="100%" anchor="end" size={17} color="#F3F4F6" />
            <SvgText x={92} y={bottom + 5} text="0" anchor="end" size={16} color={C.muted} />
            <SvgText x={10} y={top + 14} text={SERIES[organ].name} size={21} weight={700} color={SERIES[organ].color} />
        </g>
    );
};

export const Fuchs25Chart = ({ step }: { step: number }) => {
    const cross = liverCross();
    const lp = SERIES.liver.points.map(p => pt('liver', p));
    const yL100 = yOf('liver', 100);
    const yM100 = yOf('muscle', 100);
    const [mx12, my12] = pt('muscle', SERIES.muscle.points[3]);
    return (
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width={CHART_W} height={CHART_H} role="img"
            aria-label="Glicogênio do fígado e do músculo em % do valor de antes, do fim do exercício até 12 h (Fuchs 2025)">
            <Frame organ="liver" />
            <Frame organ="muscle" />
            <SvgText x={(X.pre + X[0]) / 2} y={CHART.liver.top + 8} text="exercício" anchor="middle" size={16} color={C.caveat} />
            <SvgText x={X[0] + 14} y={yM100 - 8} text="nível de antes" size={16} color={C.caveat} />

            {/* fígado acima do nível de antes: o transbordo */}
            <Fade show={step >= 2} delay={0.9}>
                <path d={`M ${cross} ${yL100} L ${lp[2][0]} ${lp[2][1]} L ${lp[3][0]} ${lp[3][1]} L ${lp[3][0]} ${yL100} Z`} fill={C.glycogenSoft} fillOpacity={0.24} />
                <SvgText x={(X[6] + X[12]) / 2 + 4} y={yL100 - 10} text="transbordou" anchor="middle" size={18} weight={700} color={C.glycogenSoft} />
            </Fade>

            {/* braço em jejum: plano no nível do fim do exercício (esquema) */}
            {(['liver', 'muscle'] as const).map(o => {
                const [x0, y0] = pt(o, SERIES[o].points[1]);
                return (
                    <g key={o}>
                        <Draw d={`M ${x0} ${y0} L ${X[12]} ${y0}`} color={C.stone} show={step >= 1} dash="9 9" />
                        <Fade show={step >= 1} delay={0.6}>
                            <SvgText x={X[12] + 8} y={y0 + 6} text="jejum" size={16} color={C.stone} />
                        </Fade>
                    </g>
                );
            })}

            <Series organ="liver" step={step} recoverAt={2} />
            <Series organ="muscle" step={step} recoverAt={3} />

            {/* o que falta ao músculo às 12 h */}
            <Fade show={step >= 3} delay={1.0}>
                <line x1={mx12} x2={mx12} y1={yM100} y2={my12 - 9} stroke={C.risk} strokeWidth={5} />
                <SvgText x={mx12 + 6} y={yM100 - 10} text="faltam 31%" anchor="end" size={17} weight={700} color="#FDA4AF" />
            </Fade>

            {/* segunda prova no mesmo dia: os dois pontos do músculo ganham um anel */}
            <Fade show={step >= 4} delay={0.2}>
                {([[6, 55], [12, 69]] as const).map(([h, p]) => (
                    <circle key={h} cx={X[h]} cy={yOf('muscle', p)} r={17} fill="none" stroke="#F9FAFB" strokeWidth={4} />
                ))}
                <SvgText x={(X[6] + X[12]) / 2} y={CHART.muscle.top + 10} text="2ª prova aqui: músculo em 55–69%" anchor="middle" size={18} weight={700} color="#F9FAFB" />
            </Fade>

            {/* eixo de tempo e o protocolo do braço com carboidrato */}
            {(['pre', 0, 6, 12] as const).map(at => (
                <SvgText key={at} x={X[at]} y={378} text={at === 'pre' ? 'antes' : `${at} h`} anchor="middle" size={18} color="#E5E7EB" weight={600} />
            ))}
            <Fade show={step >= 2} delay={0.1}>
                <rect x={X[0]} y={392} width={X[6] - X[0] - 3} height={30} rx={6} fill={C.glucose} />
                <rect x={X[6] + 3} y={392} width={X[12] - X[6] - 3} height={30} rx={6} fill={C.glucoseDeep} />
                <text x={(X[0] + X[6]) / 2} y={413} textAnchor="middle" fontSize={16} fontWeight={700} fill="#04080F" style={BAND_FONT}>sacarose 1,2 g/kg/h</text>
                <text x={(X[6] + X[12]) / 2} y={413} textAnchor="middle" fontSize={16} fontWeight={700} fill="#F9FAFB" style={BAND_FONT}>refeições ricas em CHO</text>
                <SvgText x={X[0] - 10} y={413} text="10 g/kg" anchor="end" size={18} weight={700} color={C.glucoseSoft} />
            </Fade>
        </svg>
    );
};
