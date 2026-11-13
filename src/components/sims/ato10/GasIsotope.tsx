import { motion, useReducedMotion } from 'framer-motion';
import { BicepsFlexed, CupSoda, Wheat, Wind, type LucideIcon } from 'lucide-react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { ScaleBar } from '../ato3/chainStrip';
import { GAS_RECAP, ISOTOPE_CHAIN, SARIS } from './gas.content';

/**
 * Slide 184 · último passo: o palco vira a cadeia do isótopo (milho/cana C4 → bebida marcada → músculo oxida → ¹³CO₂ no
 * ar mede o exógeno), com o ¹³C correndo pela cadeia (único laço do passo) e as barras de Saris 1993 (0,84 × 0,50 g/min).
 * O que veio antes (RER, equação, erro, limiar) fica num resumo compacto no alto.
 */

const ICONS: readonly LucideIcon[] = [Wheat, CupSoda, BicepsFlexed, Wind];
const NODE_W = 132;
const GAP = 40;

/** Resumo dos passos 1–4: uma linha por ideia, termo colorido + o que ele diz. */
const Recap = () => (
    <div className="flex flex-col gap-1 rounded-lg border-2 border-white/15 px-3 py-2">
        <span className="text-[16px] font-semibold text-gray-300">Até aqui, pela troca de gases</span>
        {GAS_RECAP.map(r => (
            <div key={r.term} className="flex items-baseline gap-2 leading-tight">
                <span className="w-[170px] shrink-0 whitespace-nowrap text-[16px] font-semibold tabular-nums" style={{ color: r.color }}>{r.term}</span>
                <span className="text-[16px] text-gray-200">{r.text}</span>
            </div>
        ))}
    </div>
);

/** O ¹³C (bolinha âmbar com rótulo) percorre a cadeia da planta ao ar; com movimento reduzido, fica pousado no ar. */
const Tracer = () => {
    const reduce = useReducedMotion() ?? false;
    const end = (NODE_W + GAP) * 3;
    return (
        <motion.span className="absolute top-[-14px] flex h-[26px] items-center rounded-full border-2 border-[#04080F] px-1.5 text-[16px] font-bold text-[#04080F]"
            style={{ left: NODE_W / 2 - 22, background: C.glucose }}
            initial={{ x: reduce ? end : 0, opacity: reduce ? 1 : 0 }}
            animate={reduce ? undefined : { x: [0, end], opacity: [0, 1, 1, 0] }}
            transition={reduce ? undefined : { duration: 3.2, times: [0, 0.1, 0.9, 1], repeat: Infinity, repeatDelay: 0.8, delay: 0.8, ease: 'easeInOut' }}>
            ¹³C
        </motion.span>
    );
};

const Chain = () => (
    <div className="relative flex items-stretch pt-4" style={{ gap: GAP }}>
        <Tracer />
        {ISOTOPE_CHAIN.map((s, i) => {
            const Icon = ICONS[i];
            const last = i === ISOTOPE_CHAIN.length - 1;
            return (
                <motion.div key={s.title} className="relative flex flex-col items-center gap-0.5 rounded-xl border-2 px-2 py-1.5 text-center leading-tight"
                    style={{ width: NODE_W, borderColor: last ? C.glucose : 'rgba(255,255,255,0.28)' }}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stagger(i, 0.15, 0.12), duration: DUR.enter, ease: EASE_OUT }}>
                    <Icon size={30} strokeWidth={2.4} color={last ? C.glucose : C.caveat} aria-hidden />
                    <span className="text-[17px] font-semibold text-white">{s.title}</span>
                    <span className="text-[16px] text-gray-300">{s.sub}</span>
                    {!last && <span className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded bg-white/40" style={{ left: NODE_W - 2, width: GAP }} />}
                </motion.div>
            );
        })}
    </div>
);

/** Saris 1993: oxidação exógena média, com escala real a partir do zero. */
const SarisBars = () => (
    <div className="flex flex-col gap-1.5">
        <span className="text-[17px] font-semibold text-gray-100">Saris 1993 · oxidação exógena média, g/min</span>
        {SARIS.map((b, i) => (
            <ScaleBar key={b.label} label={b.label} value={b.value} text={b.text} max={1} color={b.color} delay={0.6 + i * 0.15} labelWidth={150} />
        ))}
        <span className="text-[16px] leading-snug" style={{ color: C.caveat }}>150 min a 60% · glicose marcada somada ao amido insolúvel inflou a conta</span>
    </div>
);

export const IsotopeScene = () => (
    <div className="flex h-full flex-col gap-2.5">
        <Recap />
        <Chain />
        <div className="mt-auto border-t-2 border-white/15 pt-2"><SarisBars /></div>
    </div>
);
