import { motion, useReducedMotion } from 'framer-motion';
import { Droplet } from 'lucide-react';
import type { ReactNode } from 'react';
import { DUR } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { castOf } from '../kit/cast';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { KeyFact } from '../kit/rhythm';
import { useTween } from '../kit/useTween';
import {
    AFTER_GLY, AFTER_GUT, GLY_KG, PLASMA_GAIN_ML, REST_KG, SCALE_AT, SWEAT_ML, TIAGO_START, TIAGO_TARGET, WATER_MAX, WATER_PER_G,
} from './weightCut.content';

/**
 * Palco do slide 164 (640 × 420): uma cena só, a balança do Tiago (fictício). No alto, o visor e o quanto falta.
 * No meio, a conta em cascata na régua de kg (76,5 → 73,0): 1 glicogênio com a água dele → 2 conteúdo do intestino →
 * 3 o que falta, que só sairia como água do corpo (fora: ACSM). Embaixo, a ressalva rotulada: essa água não é cantil.
 */

export const STAGE_W = 640;
export const STAGE_H = 420;
const WATER = C.caveat;
const GUT = C.co2;

/** Régua da cascata: 76,5 kg à esquerda, 73,0 (alvo) à direita. */
const LABEL_W = 176;
const BAR_W = STAGE_W - LABEL_W - 16 - 14;
const kx = (kg: number) => ((TIAGO_START - kg) / (TIAGO_START - TIAGO_TARGET)) * BAR_W;
const TICKS = [76.5, 76, 75, 74, 73] as const;

const Top = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const kg = useTween(SCALE_AT[step], reduce, 900);
    const t = castOf('tiago');
    const Icon = t.icon;
    return (
        <div className="flex items-stretch gap-4">
            <div className="flex w-[300px] shrink-0 items-center gap-3 rounded-2xl px-3 py-2" style={{ background: '#1E293B', border: `3px solid ${C.co2}` }}>
                <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5"><Icon size={22} strokeWidth={2.2} color={C.text} aria-hidden /><b className="text-[20px] text-white">{t.name}</b></span>
                    <span className="text-[16px] text-gray-300">judô, −73 kg</span>
                </div>
                <div className="ml-auto flex flex-col items-end">
                    <span className="rounded-lg px-2 font-mono text-[40px] font-bold leading-tight tabular-nums text-white" style={{ background: '#04080F' }}>{br(kg, 2)}</span>
                    <span className="text-[15px] text-gray-300">kg na balança</span>
                </div>
            </div>
            <div className="flex flex-1 flex-col justify-center">
                <span className="text-[16px] text-gray-300">alvo na pesagem: <b className="text-white">73,0 kg</b></span>
                <span className="flex items-baseline gap-2">
                    <span className="text-[17px] text-gray-200">faltam</span>
                    <span className="font-display text-[40px] font-bold leading-none tabular-nums" style={{ color: step >= 3 ? C.risk : C.text }}>{br(kg - TIAGO_TARGET, 2)}</span>
                    <span className="text-[17px] text-gray-200">kg</span>
                </span>
            </div>
        </div>
    );
};

/** Segmento da cascata, entre dois pesos; cresce da esquerda quando o passo chega. */
const Seg = ({ from, to, color, show, delay = 0.2, children }: { from: number; to: number; color: string; show: boolean; delay?: number; children?: ReactNode }) => (
    <div className="absolute inset-y-[6px] overflow-hidden rounded-[4px]" style={{ left: kx(from), width: kx(to) - kx(from) }}>
        <Grow value={show ? 1 : 0} color={color} delay={delay} />
        {show && children}
    </div>
);

interface RowProps {
    n: number;
    title: string;
    note: string;
    show: boolean;
    children: ReactNode;
}

const Row = ({ n, title, note, show, children }: RowProps) => (
    <div className="flex h-[54px] items-center gap-4">
        <div className="flex shrink-0 flex-col leading-tight" style={{ width: LABEL_W }}>
            <span className="text-[17px] font-bold" style={{ color: show ? '#FFFFFF' : '#94A3B8' }}>{n} · {title}</span>
            <motion.span className="text-[15px] text-gray-300" initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter }}>{note}</motion.span>
        </div>
        <div className="relative h-full" style={{ width: BAR_W }}>{children}</div>
    </div>
);

/** Valor escrito logo depois do fim do segmento. */
const After = ({ kg, text, show, color = C.text }: { kg: number; text: string; show: boolean; color?: string }) => (
    <motion.span className="absolute top-1/2 z-10 -translate-y-1/2 whitespace-nowrap rounded px-1 font-mono text-[18px] font-bold tabular-nums" style={{ left: kx(kg) + 6, color, background: '#04080F' }}
        initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter, delay: show ? 0.7 : 0 }}>{text}</motion.span>
);

const Cascade = ({ step }: { step: number }) => (
    <div className="relative flex flex-col">
        {/* régua de kg e linhas-guia da cascata */}
        <div className="flex h-[22px] items-end gap-4">
            <span className="shrink-0 text-[15px] text-gray-300" style={{ width: LABEL_W }}>régua: kg na balança</span>
            <div className="relative h-full" style={{ width: BAR_W }}>
                {TICKS.map(t => (
                    <span key={t} className={`absolute bottom-0 whitespace-nowrap text-[15px] tabular-nums ${t === TIAGO_TARGET ? '-translate-x-[85%]' : '-translate-x-1/2'}`}
                        style={{ left: kx(t), color: t === TIAGO_TARGET ? C.text : C.muted, fontWeight: t === TIAGO_TARGET ? 700 : 500 }}>
                        {t === TIAGO_TARGET ? 'alvo 73' : br(t, t % 1 ? 1 : 0)}
                    </span>
                ))}
            </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 top-[24px]" style={{ left: LABEL_W + 16, width: BAR_W }}>
            {[TIAGO_START, AFTER_GLY, AFTER_GUT].map((kg, i) => (
                <span key={kg} className="absolute inset-y-0 border-l-2 border-dashed" style={{ left: kx(kg), borderColor: step > i ? 'rgba(255,255,255,0.22)' : 'transparent' }} />
            ))}
            <span className="absolute inset-y-0 border-l-[3px]" style={{ left: kx(TIAGO_TARGET) - 3, borderColor: C.text }} />
        </div>
        <Row n={1} title="glicogênio + água" note={`1 g leva ≥ ${WATER_PER_G} g (até ${WATER_MAX})`} show={step >= 1}>
            <Seg from={TIAGO_START} to={TIAGO_START - GLY_KG} color={C.glycogen} show={step >= 1} />
            <Seg from={TIAGO_START - GLY_KG} to={AFTER_GLY} color={WATER} show={step >= 1} delay={0.45}>
                <span className="absolute inset-0 flex items-center justify-center"><Droplet size={18} strokeWidth={2.6} color="#04080F" aria-hidden /></span>
            </Seg>
            <After kg={AFTER_GLY} text="−0,72 kg" show={step >= 1} color={C.glycogenSoft} />
        </Row>
        <Row n={2} title="intestino" note="fibra < 10 g/dia, 4 dias" show={step >= 2}>
            <Seg from={AFTER_GLY} to={AFTER_GUT} color={GUT} show={step >= 2} />
            <After kg={AFTER_GUT} text="−0,57 kg" show={step >= 2} />
        </Row>
        <Row n={3} title="o que falta" note="o ACSM pede regra contra" show={step >= 3}>
            <motion.div className="absolute inset-y-[6px] flex items-center justify-center rounded-[4px] border-[3px] border-dashed"
                style={{ left: kx(AFTER_GUT), width: kx(TIAGO_TARGET) - kx(AFTER_GUT), borderColor: C.risk }}
                initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 3 ? 0.2 : 0 }}>
                {step >= 3 && (
                    <KeyFact color={C.risk} delay={step === 3 ? 0.6 : 0}>
                        <span className="whitespace-nowrap text-[17px] font-bold" style={{ color: C.text }}>≈{br(REST_KG, 1)} kg · só água do corpo</span>
                    </KeyFact>
                )}
            </motion.div>
        </Row>
    </div>
);

/** A ressalva rotulada (King 2018): 2 L de suor × ~55 mL devolvidos ao plasma, na mesma escala de mL. */
const Caveat = ({ show }: { show: boolean }) => (
    <div className="flex flex-col gap-1 rounded-xl border-2 px-3 py-2"
        style={{ borderColor: show ? C.caveat : '#334155', borderStyle: show ? 'solid' : 'dashed', transition: 'border-color 300ms' }}>
        <span className="text-[16px] font-bold" style={{ color: show ? C.text : '#94A3B8' }}>
            ressalva · essa água não protege da desidratação <span className="font-normal text-gray-300">(King 2018)</span>
        </span>
        <motion.div className="flex flex-col gap-1" initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter }}>
            {[{ label: '2 L de suor', ml: SWEAT_ML, color: C.co2 }, { label: 'volta ao plasma', ml: PLASMA_GAIN_ML, color: WATER }].map((r, i) => (
                <div key={r.label} className="flex items-center gap-3">
                    <span className="w-[130px] shrink-0 text-[16px] text-gray-200">{r.label}</span>
                    <div className="relative h-[20px] flex-1 overflow-hidden rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <Grow value={show ? r.ml / SWEAT_ML : 0} color={r.color} delay={0.2 + i * 0.3} />
                    </div>
                    <span className="w-[92px] shrink-0 text-right font-mono text-[17px] font-semibold tabular-nums text-white">{i ? '~' : ''}{r.ml.toLocaleString('pt-BR')} mL</span>
                </div>
            ))}
        </motion.div>
    </div>
);

export const WeightStage = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-3" style={{ width: STAGE_W, height: STAGE_H }}>
        <Top step={step} />
        <Cascade step={step} />
        <div className="mt-auto"><Caveat show={step >= 4} /></div>
    </div>
);
