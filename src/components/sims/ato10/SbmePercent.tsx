import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { br } from '../kit/format';
import { KeyFact } from '../kit/rhythm';
import { PERCENT_HEAD, PERCENT_ROWS, RECAP, SBME_GKG } from './sbme.content';

/**
 * Slide 181 · último passo: o palco deixa o gráfico de g/h (que fica resumido numa linha no alto) e vira a conta dos 60%.
 * Duas linhas, coluna a coluna (kcal → kcal de CHO → g → g/kg/d), e a régua de g/kg/d com a faixa da própria SBME (5–8):
 * a mesma % cai abaixo num dia e acima no outro. Tudo cálculo (4 kcal/g, 70 kg).
 */

const GKG_MAX = 12;
const gx = (v: number) => `${(v / GKG_MAX) * 100}%`;
const COLS = 'grid-cols-[1fr_28px_1fr_28px_1fr_28px_1.25fr]';

/** Linha-resumo do que o gráfico de g/h mostrou nos passos anteriores. */
const Recap = () => (
    <div className="flex items-center gap-2 rounded-lg border-2 border-white/15 px-3 py-1.5">
        <span className="whitespace-nowrap text-[16px] font-semibold text-gray-200">Durante (g/h):</span>
        {RECAP.map(r => (
            <span key={r.term} className="flex items-baseline gap-1.5 whitespace-nowrap pl-3">
                <b className="text-[17px] tabular-nums" style={{ color: r.color }}>{r.term}</b>
                <span className="text-[16px] text-gray-300">{r.text}</span>
            </span>
        ))}
    </div>
);

const Cell = ({ text, delay, strong, color }: { text: string; delay: number; strong?: boolean; color?: string }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.span className={`flex h-[44px] items-center justify-center rounded-lg border-2 tabular-nums ${strong ? 'text-[22px] font-bold' : 'text-[19px] font-semibold text-white'}`}
            style={{ borderColor: color ?? 'rgba(255,255,255,0.22)', color }}
            initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: DUR.enter, delay, ease: EASE_OUT }}>
            {text}
        </motion.span>
    );
};

const Arrow = () => <span className="flex items-center justify-center"><ArrowRight size={22} strokeWidth={2.6} color={C.caveat} aria-hidden /></span>;

/** A conta: cabeçalho com a operação de cada coluna; duas linhas, os mesmos 60%. */
const Table = () => (
    <div className="flex flex-col gap-1.5">
        <div className={`grid ${COLS} gap-x-1 text-center text-[16px] font-semibold text-gray-300`}>
            {PERCENT_HEAD.map((h, i) => [i > 0 && <span key={`a${h}`} />, <span key={h}>{h}</span>])}
        </div>
        {PERCENT_ROWS.map((r, row) => (
            <div key={r.gkg} className={`grid ${COLS} gap-x-1`}>
                {r.cells.map((c, i) => [i > 0 && <Arrow key={`a${c}`} />, <Cell key={c} text={c} delay={stagger(i + row * 4, 0.15, 0.08)} />])}
                <Arrow />
                <Cell text={`${br(r.gkg, 1)} g/kg/d`} delay={stagger(3 + row * 4, 0.15, 0.08)} strong color={r.color} />
            </div>
        ))}
    </div>
);

/** Régua de g/kg/d: a faixa da própria SBME (5–8, recuperação) e os dois dias marcados. */
const Ruler = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[17px] font-semibold text-gray-100">Na régua de g/kg/d, o mesmo atleta de 70 kg</span>
            <div className="relative mt-7 h-[30px] [container-type:inline-size]">
                <div className="absolute inset-x-0 top-[12px] h-[6px] rounded-full bg-white/15" />
                <div className="absolute inset-y-0 flex items-center justify-center rounded-md border-2 text-[16px] font-semibold text-[#04080F]"
                    style={{ left: gx(SBME_GKG.lo), width: gx(SBME_GKG.hi - SBME_GKG.lo), background: C.stone, borderColor: C.stone }}>
                    SBME: 5–8
                </div>
                {PERCENT_ROWS.map((r, i) => (
                    <motion.div key={r.gkg} className="absolute inset-y-0 left-0 w-0"
                        initial={reduce ? false : { x: '0cqw', opacity: 0 }} animate={{ x: `${(r.gkg / GKG_MAX) * 100}cqw`, opacity: 1 }}
                        transition={{ duration: DUR.draw, delay: 0.5 + i * 0.12, ease: EASE_OUT }}>
                        <span className="absolute -left-[4px] -top-[4px] block h-[38px] w-[8px] rounded-sm" style={{ background: r.color }} />
                        <span className="absolute -top-[30px] -translate-x-1/2 whitespace-nowrap font-display text-[20px] font-bold tabular-nums" style={{ color: r.color }}>
                            {i === 1 ? <KeyFact color={r.color} delay={1.1}>{br(r.gkg, 1)}</KeyFact> : br(r.gkg, 1)}
                        </span>
                    </motion.div>
                ))}
            </div>
            <div className="relative h-[20px]">
                {[0, 2, 4, 6, 8, 10, 12].map(v => (
                    <span key={v} className={`absolute font-mono text-[16px] tabular-nums text-gray-300 ${v === 0 ? '' : v === GKG_MAX ? '-translate-x-full' : '-translate-x-1/2'}`} style={{ left: gx(v) }}>{v}</span>
                ))}
            </div>
            <span className="text-[16px] leading-snug text-gray-200">
                A mesma % cai <b style={{ color: C.glucoseSoft }}>abaixo</b> num dia e <b style={{ color: C.glucose }}>acima</b> no outro da faixa de recuperação da própria diretriz.
            </span>
        </div>
    );
};

export const PercentScene = () => (
    <div className="flex h-full flex-col gap-3">
        <Recap />
        <span className="text-[18px] font-semibold text-white">60% da energia, atleta de 70 kg, dois dias</span>
        <Table />
        <div className="mt-auto border-t-2 border-white/15 pt-2"><Ruler /></div>
    </div>
);
