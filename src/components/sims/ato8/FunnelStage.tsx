import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { br, signed } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { META, STAGES, TIMELINE, type FunnelStage } from './funnel.content';

/**
 * Palco do slide 141. Em cima, o funil deitado (SVG 1:1, 676 × 230): a altura de cada trecho é a fração de estudos
 * positivos, e as bolinhas são os estudos (cheia = positivo). Na ponta, a régua da meta-análise com o zero.
 * Embaixo, a linha do tempo 2005 → 2021 com o n de cada estudo.
 */

const W = 676;
const H = 230;
const CY = 112;
const half = (pct: number) => pct;

/** Faixa horizontal de cada trecho [x0, x1] e altura de entrada. */
const SPAN: Record<string, { x0: number; x1: number; taper?: number; from: number }> = {
    sig: { x0: 0, x1: 128, from: 73 },
    gene: { x0: 128, x1: 256, from: 73 },
    enz: { x0: 256, x1: 384, from: 75 },
    perf: { x0: 384, x1: 540, taper: 36, from: 78 },
};

const shape = (st: FunnelStage) => {
    const s = SPAN[st.id];
    const t = s.x0 + (s.taper ?? 0);
    const h0 = half(s.from);
    const h1 = half(st.pct);
    return `${s.x0},${CY - h0} ${t},${CY - h1} ${s.x1},${CY - h1} ${s.x1},${CY + h1} ${t},${CY + h1} ${s.x0},${CY + h0}`;
};

const Dots = ({ st, cx, y, show, delay }: { st: FunnelStage; cx: number; y: number; show: boolean; delay: number }) => {
    const row1 = Math.ceil(st.n / 2);
    return (
        <g>
            {Array.from({ length: st.n }, (_, i) => {
                const row = i < row1 ? 0 : 1;
                const k = row === 0 ? i : i - row1;
                const count = row === 0 ? row1 : st.n - row1;
                const x = cx + (k - (count - 1) / 2) * 17;
                const on = i < st.pos;
                return (
                    <motion.circle key={i} cx={x} cy={y + row * 17} r={6.5} fill={on ? '#FFFFFF' : '#04080F'}
                        stroke={on ? '#FFFFFF' : C.co2} strokeWidth={2.5}
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                        initial={false} animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.4 }}
                        transition={{ duration: DUR.enter, delay: show ? stagger(i, delay, 0.03) : 0, ease: EASE_OUT }} />
                );
            })}
        </g>
    );
};

const Segment = ({ st, step }: { st: FunnelStage; step: number }) => {
    const s = SPAN[st.id];
    const show = step >= st.at;
    const cur = step === st.at;
    const color = st.id === 'perf' ? C.stone : C.insulin;
    const cx = (s.x0 + (s.taper ?? 0) + s.x1) / 2;
    const perf = st.id === 'perf';
    return (
        <motion.g initial={false} animate={{ opacity: show ? 1 : 0, x: show ? 0 : -16 }}
            transition={{ duration: DUR.morph, delay: show && cur ? stagger(STAGES.indexOf(st), 0, 0.12) : 0, ease: EASE_OUT }}>
            <polygon points={shape(st)} fill={`${color}2E`} stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
            <SvgText x={cx} y={18} text={st.label} size={17} anchor="middle" color={perf ? C.stone : C.insulinSoft} weight={700} />
            <SvgText x={cx} y={perf ? CY - 8 : CY - 22} text={`${st.pct}%`} size={perf ? 26 : 32} anchor="middle" color="#FFFFFF" weight={800} />
            <Dots st={st} cx={cx} y={perf ? CY + 10 : CY + 6} show={show} delay={cur ? 0.35 : 0} />
            <SvgText x={cx} y={222} text={`${st.pos} de ${st.n}`} size={17} anchor="middle" color="#E5E7EB" weight={700} />
        </motion.g>
    );
};

const sx = (v: number) => 572 + ((v + 0.3) / 0.9) * 96;

const MetaTip = ({ show, cur }: { show: boolean; cur: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter, delay: show && cur ? 0.15 : 0 }}>
            <polygon points={`540,${CY - 37} 556,${CY - 5} 556,${CY + 5} 540,${CY + 37}`} fill={`${C.stone}2E`} stroke={C.stone} strokeWidth={2.5} />
            <SvgText x={616} y={18} text="meta-análise" size={17} anchor="middle" color="#FFFFFF" weight={700} />
            <line x1={sx(0)} x2={sx(0)} y1={CY - 52} y2={CY + 40} stroke="#E5E7EB" strokeWidth={2} strokeDasharray="5 5" />
            <motion.line x1={sx(META.lo)} x2={sx(META.hi)} y1={CY} y2={CY} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round"
                initial={false} animate={{ pathLength: show ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.bar, delay: show && cur ? 0.4 : 0 }} />
            <polygon fill="#FFFFFF" points={`${sx(META.est) - 11},${CY} ${sx(META.est)},${CY - 11} ${sx(META.est) + 11},${CY} ${sx(META.est)},${CY + 11}`} />
            <SvgText x={616} y={CY - 62} text={`SMD ${br(META.est, 2)}`} size={20} anchor="middle" color="#FFFFFF" weight={800} />
            <SvgText x={sx(META.lo)} y={CY + 30} text={signed(META.lo, 2)} size={16} anchor="middle" color="#E5E7EB" />
            <SvgText x={sx(META.hi)} y={CY + 30} text={br(META.hi, 2)} size={16} anchor="middle" color="#E5E7EB" />
            <SvgText x={sx(0)} y={CY + 60} text="zero" size={16} anchor="middle" color={C.muted} />
            <SvgText x={616} y={222} text={`P = ${META.p} · ${META.k} est.`} size={17} anchor="middle" color="#E5E7EB" weight={700} />
        </motion.g>
    );
};

export const FunnelPlot = ({ step }: { step: number }) => (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block shrink-0" role="img"
        aria-label="Funil: sinalização 73%, genes 75%, enzimas 78%, desempenho 37%; meta-análise SMD 0,17, IC 95% −0,15 a 0,49">
        {STAGES.map(st => <Segment key={st.id} st={st} step={step} />)}
        <MetaTip show={step >= 2} cur={step === 2} />
    </svg>
);

/** A linha do tempo "até o nulo": cartões com o n; verde = o desempenho se separou do controle. */
export const Timeline = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-2 px-1">
        <div className="grid grid-cols-5 gap-2">
            {TIMELINE.map(t => {
                const show = step >= t.at;
                const color = t.positive ? C.ok : C.stone;
                return (
                    <motion.div key={t.year} className="flex flex-col rounded-xl border-2 px-2.5 py-1 leading-tight"
                        style={{ borderColor: `${color}99`, background: `${color}14` }}
                        initial={false} animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }}
                        transition={{ duration: DUR.enter, delay: show && step === t.at ? 0.5 + TIMELINE.indexOf(t) * 0.06 : 0, ease: EASE_OUT }}>
                        <span className="text-[18px] font-bold" style={{ color }}>{t.year}</span>
                        <span className="text-[17px] font-bold text-white">{t.who}</span>
                        <span className="text-[16px] text-gray-300">{t.n}</span>
                        <span className="text-[16px] font-semibold" style={{ color }}>{t.result}</span>
                        {t.extra && (
                            <motion.span className="text-[16px] font-semibold" style={{ color: C.stone }} initial={false}
                                animate={{ opacity: step >= (t.extraAt ?? 0) ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === t.extraAt ? 0.4 : 0 }}>
                                {t.extra}
                            </motion.span>
                        )}
                    </motion.div>
                );
            })}
        </div>
        <motion.div className="flex items-center gap-3 text-[17px] font-semibold text-gray-100" initial={false}
            animate={{ opacity: step >= 3 ? 1 : 0, x: step >= 3 ? 0 : -12 }} transition={{ duration: DUR.morph, ease: EASE_OUT }}>
            <span className="h-[4px] flex-1 rounded-full" style={{ background: C.stone }} />
            <span>quanto melhor o desenho e mais treinado o atleta, menor o efeito</span>
            <span className="h-0 w-0 border-y-[8px] border-l-[12px] border-y-transparent" style={{ borderLeftColor: C.stone }} />
        </motion.div>
    </div>
);
