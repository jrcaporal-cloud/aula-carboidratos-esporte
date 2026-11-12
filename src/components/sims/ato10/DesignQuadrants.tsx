import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow, Wipe } from '../kit/Beat';
import { C } from '../kit/palette';
import { sample, useMorphPath, type Pt } from '../kit/useMorphPath';
import { DecideSlot } from './DecideShell';
import { COLOMBANI, CV, EFFECT, RULER_MAX, THRESHOLDS, X_RANGE } from './design.content';

/**
 * Os quatro quadros do slide 186 (O Desenho Decide o Efeito). Cada um entra num passo e fica:
 * contrarrelógio × tempo até a exaustão (a mesma curva alarga pelo ruído), Colombani 2013 e Vandenbogaerde 2011.
 */

const CW = 292;
const CH = 84;
const BASE = CH - 3;
const N = 70;

/** Curva normal ilustrativa: o ruído maior alarga e achata (mesma área). */
const bell = (mean: number, sd: number): Pt[] => {
    const top = sd === CV.tt ? CH - 10 : (CH - 10) * 0.42;
    const pts = sample(N, -X_RANGE, X_RANGE, x => Math.exp(-((x - mean) ** 2) / (2 * sd ** 2)),
        (x, y) => [((x + X_RANGE) / (2 * X_RANGE)) * CW, BASE - y * top]);
    return [...pts, [CW, BASE], [0, BASE]];
};

const Curves = ({ sd }: { sd: number }) => {
    const placebo = useMorphPath(bell(0, sd), 900);
    const cho = useMorphPath(bell(EFFECT, sd), 900);
    const zero = CW / 2;
    return (
        <svg viewBox={`0 0 ${CW} ${CH}`} width={CW} height={CH} className="block" aria-hidden>
            <line x1={zero} x2={zero} y1={0} y2={BASE} stroke="#475569" strokeWidth={2} strokeDasharray="5 5" />
            <path ref={placebo} fill="rgba(148,163,184,0.28)" stroke={C.co2} strokeWidth={3.5} strokeLinejoin="round" />
            <path ref={cho} fill="rgba(245,158,11,0.28)" stroke={C.glucose} strokeWidth={3.5} strokeLinejoin="round" />
            <line x1={0} x2={CW} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
        </svg>
    );
};

const Axis = () => (
    <div className="flex justify-between text-[15px] tabular-nums text-gray-300" style={{ width: CW }}>
        <span>−30%</span><span>0</span><span>+30%</span>
    </div>
);

interface QuadProps {
    show: boolean;
    slot: string;
    /** Monta o conteúdo antes do passo (escondido): a curva do TTE nasce estreita e alarga ao aparecer. */
    premount?: boolean;
    children: ReactNode;
}

/** Quadro do palco: moldura tracejada até o passo dele; depois, revelação da esquerda para a direita. */
const Quad = ({ show, slot, premount = false, children }: QuadProps) => (
    <div className="relative min-h-0 min-w-0">
        {!show && <DecideSlot label={slot} />}
        {(show || premount) && (
            <Wipe show={show} from="left" className="absolute inset-0 flex flex-col gap-1.5 rounded-xl border-2 border-white/15 px-3 py-2.5">
                {children}
            </Wipe>
        )}
    </div>
);

const QuadHead = ({ title, value, color }: { title: string; value?: string; color?: string }) => (
    <div className="flex items-baseline justify-between gap-2">
        <span className="text-[17px] font-semibold leading-tight text-white">{title}</span>
        {value && <span className="shrink-0 text-[20px] font-bold leading-none tabular-nums" style={{ color }}>{value}</span>}
    </div>
);

/** `wide` liga o ruído do TTE: a curva sai da largura do contrarrelógio e alarga (useMorphPath). */
const TestQuad = ({ tte, wide = tte }: { tte: boolean; wide?: boolean }) => (
    <>
        <QuadHead title={tte ? 'Tempo até a exaustão' : 'Contrarrelógio'} value={`CV ${tte ? '26,6' : '3,35'}%`} color={tte ? C.stone : C.ok} />
        <Curves sd={wide ? CV.tte : CV.tt} />
        <Axis />
        <span className="text-[15px] leading-snug text-gray-200">
            {tte ? 'o mesmo +5% some no ruído: um “+20%” de TTE pode ser esse mesmo efeito' : 'o mesmo atleta, 6 vezes: placebo (cinza) e carboidrato (âmbar, +5%) se separam'}
        </span>
    </>
);

const Dot = ({ lit, i, base }: { lit: boolean; i: number; base: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.span className="block h-[17px] w-[17px] rounded-full border-[3px]"
            style={{ borderColor: C.glucose, background: lit ? C.glucose : 'transparent' }}
            initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: stagger(i, base, 0.025), duration: DUR.text, ease: EASE_OUT }} />
    );
};

const ColombaniQuad = () => (
    <>
        <QuadHead title="Alimentado, teste como a prova" />
        {COLOMBANI.map((r, ri) => (
            <div key={r.label} className="flex items-center gap-2.5">
                <span className="flex w-[92px] shrink-0 flex-col">
                    <span className="whitespace-nowrap text-[21px] font-bold leading-tight tabular-nums text-white">{r.lit} de {r.total}</span>
                    <span className="text-[15px] leading-tight text-gray-200">{r.label}</span>
                </span>
                <div className="flex w-[190px] flex-wrap gap-[4px]">
                    {Array.from({ length: r.total }, (_, i) => <Dot key={i} lit={i < r.lit} i={i} base={0.3 + ri * 0.2} />)}
                </div>
            </div>
        ))}
        <span className="mt-auto text-[15px] leading-snug text-gray-200">cheio = melhorou (11 de 22); quem melhorou: +1% a +13%</span>
    </>
);

const RulerQuad = () => (
    <>
        <QuadHead title="Meta-análise de 88 estudos" />
        <span className="text-[15px] leading-tight text-gray-300">limiares em potência de contrarrelógio</span>
        <div className="relative mb-6 mt-6 h-[14px] overflow-visible rounded" style={{ width: CW, background: '#1E293B' }}>
            <Grow value={1} color="#334155" delay={0.3} className="rounded" />
            {THRESHOLDS.map((t, i) => {
                const left = (t.at / RULER_MAX) * CW;
                return (
                    <motion.div key={t.word} className="absolute top-[-22px] flex -translate-x-1/2 flex-col items-center" style={{ left }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: stagger(i, 0.5, 0.12), duration: DUR.enter }}>
                        <span className="text-[15px] font-bold tabular-nums leading-none" style={{ color: C.caveat }}>{String(t.at).replace('.', ',')}%</span>
                        <span className="mt-[4px] block h-[22px] w-[3px]" style={{ background: C.caveat }} />
                        <span className="mt-[3px] text-[15px] leading-none text-gray-200">{t.word}</span>
                    </motion.div>
                );
            })}
        </div>
        <div className="mt-auto flex flex-col text-[15px] leading-snug text-gray-200">
            <span>corte de viés: <b className="text-white">155 → 122</b> estimativas</span>
            <span>9 h de jejum a mais: efeito <b className="text-white">maior</b></span>
        </div>
    </>
);

export const DesignQuadrants = ({ step }: { step: number }) => (
    <div className="grid h-full grid-cols-2 grid-rows-2 gap-3 p-3">
        <Quad show slot="contrarrelógio"><TestQuad tte={false} /></Quad>
        <Quad show={step >= 1} premount slot="tempo até a exaustão"><TestQuad tte wide={step >= 1} /></Quad>
        <Quad show={step >= 2} slot="atleta alimentado"><ColombaniQuad /></Quad>
        <Quad show={step >= 3} slot="jejum e viés"><RulerQuad /></Quad>
    </div>
);
