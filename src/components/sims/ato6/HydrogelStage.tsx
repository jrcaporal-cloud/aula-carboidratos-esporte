import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { EMPTYING, FORMATS, NULL_PILE, OX_MAX } from './hydrogel.content';

/**
 * Peças do palco do slide 108 (Formato e Hidrogel): as barras dos 4 formatos (ficam até o fim), o estômago com o
 * hidrogel virando gel e a meia-vida de esvaziamento, e a gangorra "1 positivo × pilha de nulos".
 */

const Caption = ({ children }: { children: string }) => (
    <span className="text-[16px] font-bold uppercase tracking-wide text-gray-300">{children}</span>
);

/** Hearris 2022: as 4 barras quase iguais, em grade 2 × 2. Ficam do 1º ao último passo. */
export const FormatBars = () => (
    <div className="flex flex-col gap-1.5">
        <Caption>pico de oxidação exógena a 120 g/h · g/min · diferença ns</Caption>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {FORMATS.map((f, i) => (
                <div key={f.name} className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-between">
                        <span className="text-[18px] font-semibold text-gray-100">{f.name}</span>
                        <CountUp text={f.text} delay={stagger(i, 0.1, 0.08)} className="font-display text-[22px] font-bold leading-none text-white" />
                    </div>
                    <div className="relative h-[14px] overflow-hidden rounded bg-white/10">
                        <div className="absolute inset-y-0 left-0" style={{ width: `${(f.ox / OX_MAX) * 100}%` }}>
                            <Grow value={1} color={C.glucose} delay={stagger(i, 0.1, 0.08)} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

/** Estômago em J: fundo, corpo, antro, piloro e o duodeno saindo à direita (viewBox 270 × 172). */
const STOMACH = 'M 92 0 L 92 30 C 60 18, 28 40, 32 82 C 36 132, 80 162, 132 160 C 182 158, 218 140, 232 108 L 268 108 L 268 92 L 230 92 C 212 112, 160 122, 128 100 C 114 88, 110 60, 110 30 L 110 0';
const GEL = [[80, 128], [112, 142], [146, 140], [180, 128]] as const;

/** A bebida desce, o alginato + pectina gelificam no ácido, o gel sai pelo piloro. Abaixo, a meia-vida em repouso. */
export const Stomach = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-1.5">
            <Caption>estômago em repouso · t½</Caption>
            <svg viewBox="0 0 270 172" width={270} height={172} role="img" aria-label="Estômago: o hidrogel vira gel no ácido e esvazia mais rápido, em repouso">
                <path d={STOMACH} fill="#111827" stroke="#94A3B8" strokeWidth={3} strokeLinejoin="round" />
                {GEL.map(([x, y], i) => (
                    <motion.ellipse key={x} cx={x} cy={y} rx={16} ry={10} fill={C.glucose} stroke="#04080F" strokeWidth={2}
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                        initial={reduce ? false : { opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: step === 1 ? stagger(i, 0.35, 0.1) : 0, duration: DUR.morph, ease: EASE_OUT }} />
                ))}
                {!reduce && step === 1 && (
                    <motion.ellipse cx={0} cy={0} rx={10} ry={7} fill={C.glucose} stroke="#04080F" strokeWidth={2}
                        initial={{ x: 200, y: 118, opacity: 0 }} animate={{ x: [200, 236, 262], y: [118, 100, 100], opacity: [0, 1, 0] }}
                        transition={{ delay: 0.8, duration: 0.4, ease: EASE_IN_OUT }} />
                )}
                <SvgText x={118} y={16} text="alginato + pectina" size={16} color={C.glucoseSoft} />
                <SvgText x={70} y={70} text="ácido" size={16} color={C.caveat} anchor="middle" />
                <SvgText x={4} y={152} text="gel" size={16} color={C.glucoseSoft} weight={700} />
                <SvgText x={246} y={136} text="piloro" size={16} color={C.muted} anchor="middle" />
            </svg>
            {EMPTYING.map((r, i) => (
                <div key={r.label} className="grid grid-cols-[72px_1fr_76px] items-center gap-2">
                    <span className="text-[16px] text-gray-100">{r.label}</span>
                    <div className="relative h-[14px] overflow-hidden rounded bg-white/10">
                        <div className="absolute inset-y-0 left-0" style={{ width: `${(r.min / 40) * 100}%` }}>
                            <Grow value={1} color={i === 0 ? C.glucose : C.co2} delay={stagger(i, 0.4, 0.15)} />
                        </div>
                    </div>
                    <span className="text-right font-display text-[19px] font-bold leading-none" style={{ color: i === 0 ? C.glucoseSoft : '#E5E7EB' }}>{r.min} min</span>
                </div>
            ))}
        </div>
    );
};

const BLOCK_W = 124;

/** Gangorra em HTML (rotação de div, sem SVG girando): a pilha de nulos (passo 3) e o positivo isolado (passo 4). */
export const NullSeesaw = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const angle = step >= 3 ? -5 : -9;
    return (
        <div className="flex flex-col gap-1.5">
            <Caption>no exercício · × bebida igual</Caption>
            <div className="relative h-[186px]">
                <span className="absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[22px] border-b-[34px] border-x-transparent border-b-slate-500" />
                <motion.div className="absolute inset-x-1 bottom-[34px] flex h-[160px] items-end justify-between px-1"
                    style={{ transformOrigin: '50% 100%' }} initial={reduce ? false : { rotate: 0 }}
                    animate={{ rotate: angle }} transition={{ delay: 0.5, duration: 0.7, ease: EASE_IN_OUT }}>
                    <span className="absolute inset-x-0 bottom-0 h-[8px] rounded-full bg-gray-200" />
                    <div className="mb-[10px] flex flex-col-reverse gap-[3px]" style={{ width: BLOCK_W }}>
                        {NULL_PILE.map((label, i) => (
                            <motion.span key={label} className="flex h-[30px] items-center justify-center whitespace-nowrap rounded-md text-[15px] font-bold"
                                style={{ background: i === 0 ? C.caveat : '#475569', color: i === 0 ? '#04080F' : '#F9FAFB' }}
                                initial={reduce ? false : { opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: step === 2 ? stagger(i, 0.05, 0.1) : 0, duration: DUR.enter, ease: EASE_OUT }}>
                                {label}
                            </motion.span>
                        ))}
                    </div>
                    {step >= 3 && (
                        <motion.span className="mb-[10px] flex h-[48px] flex-col items-center justify-center rounded-md leading-tight text-[#04080F]"
                            style={{ width: BLOCK_W, background: C.ok }}
                            initial={reduce ? false : { opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: DUR.enter, ease: EASE_OUT }}>
                            <span className="text-[16px] font-bold">Rowe 2022</span>
                            <span className="font-display text-[20px] font-bold">+2,1%</span>
                        </motion.span>
                    )}
                </motion.div>
            </div>
            <span className="text-[16px] text-gray-200">{step >= 3 ? '1 positivo × 4 nulos' : '4 nulos para desempenho'}</span>
        </div>
    );
};
