import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Beat, Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { useMorphPath } from './kit/useMorphPath';
import { CalcChip, DesignChip } from './kit/chips';
import { Foot, Lead, SimBox } from './ato4/frame';
import { CALCIUM_SOURCE, CALCIUM_STAGES, type Pair } from './ato4/calcium.content';

/**
 * Slide 66 · duas barras ligadas: glicogênio do braço (violeta) × liberação de Ca²⁺ do retículo (azul).
 * A linha entre os topos das barras se inclina quando uma cai mais que a outra. No fim, o aviso de que causa não está provada.
 */

const BAR_H = 232;
const BAR_W = 84;
const GAP = 40;
const PAIR_W = BAR_W * 2 + GAP;

const Bar = ({ value, color, text, label }: { value: number; color: string; text?: string; label: string }) => (
    <div className="flex flex-col items-center gap-2" style={{ width: BAR_W }}>
        <CountUp key={`${label}-${value}-${text}`} text={text ?? `${value}%`} className="font-display text-[30px] font-semibold leading-none text-white" />
        <div className="relative overflow-hidden rounded-lg bg-white/[0.07]" style={{ width: BAR_W, height: BAR_H }}>
            <Grow value={value / 100} axis="y" color={color} />
        </div>
        <span className="whitespace-nowrap text-[17px] text-gray-200">{label}</span>
    </div>
);

/** A ligação entre os topos: só a inclinação importa (cai o glicogênio mais que o cálcio). */
const Link = ({ pair }: { pair: Pair }) => {
    const ref = useMorphPath([[BAR_W / 2, BAR_H * (1 - pair.gly / 100)], [PAIR_W - BAR_W / 2, BAR_H * (1 - pair.ca / 100)]], 600);
    return (
        <svg className="pointer-events-none absolute left-0" style={{ top: 38, width: PAIR_W, height: BAR_H }} viewBox={`0 0 ${PAIR_W} ${BAR_H}`} aria-hidden>
            <path ref={ref} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
        </svg>
    );
};

const PairView = ({ pair }: { pair: Pair }) => (
    <div className="flex flex-col gap-3" style={{ width: PAIR_W }}>
        <Beat beat={pair.title}><span className="block whitespace-nowrap text-[20px] font-semibold text-gray-100">{pair.title}</span></Beat>
        <div className="relative flex justify-between">
            <Bar value={pair.gly} color={C.glycogen} label="glicogênio" />
            <Bar value={pair.ca} color={C.co2} text={pair.caText} label="liberação de Ca²⁺" />
            <Link pair={pair} />
        </div>
    </div>
);

/** Coluna da direita: o que o passo acrescenta (nota, r fraco ou o aviso dos autores). */
const Side = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const stage = CALCIUM_STAGES[step];
    if (step === 3) {
        return (
            <Beat beat="r" className="flex flex-col gap-2">
                <span className="font-display text-[80px] font-bold leading-none" style={{ color: '#FFFFFF' }}>r = 0,30</span>
                <span className="text-[22px] leading-snug text-gray-100">o glicogênio explica cerca de 9% da variação do cálcio</span>
            </Beat>
        );
    }
    if (step === 4) {
        return (
            <motion.div className="flex flex-col gap-3 rounded-2xl border-[3px] px-6 py-5" style={{ borderColor: C.stone, background: '#04080F' }}
                initial={reduce ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                <span className="font-display text-[34px] font-semibold leading-tight text-white">associação ≠ causa</span>
                <span className="text-[22px] leading-snug text-gray-100">"relação de causa e efeito ainda não estabelecida"</span>
                <span className="text-[17px] text-gray-300">Ørtenblad, Westerblad & Nielsen, 2013 · medida in vitro, em vesículas do retículo</span>
            </motion.div>
        );
    }
    return <Beat beat={step}><p className="m-0 text-[22px] leading-snug text-gray-200">{stage.note}</p></Beat>;
};

export default function CalciumReleaseSim() {
    const { step } = useSlideSteps(CALCIUM_STAGES.length);
    const stage = CALCIUM_STAGES[step];
    return (
        <SimBox>
            <Lead beat={step} chips={<>
                <DesignChip>{step >= 3 ? 'n = 10 esquiadores · n = 14 triatletas · in vitro' : 'n = 10 esquiadores de elite · CHO × água por 4 h'}</DesignChip>
                {step === 3 && <CalcChip>cálculo: 0,30² ≈ 0,09</CalcChip>}
            </>} className="min-h-[72px]">{stage.lead}</Lead>
            <div className="mt-4 flex flex-1 items-start gap-20">
                <PairView pair={stage.a} />
                <div style={{ width: PAIR_W }}>
                    {stage.b && (
                        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                            <PairView pair={stage.b} />
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-1 items-center self-stretch pb-10"><Side step={step} /></div>
            </div>
            <Foot source={CALCIUM_SOURCE} />
        </SimBox>
    );
}
