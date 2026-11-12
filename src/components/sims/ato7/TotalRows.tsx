import { motion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { C } from '../kit/palette';
import { ROWS, type StudyRow } from './totalRules.content';

/**
 * Slide 123 · o livro-caixa das 24 h: uma linha por estudo (pergunta, estudo, unidade), as barras dos braços
 * na escala da própria linha e o veredito. As linhas entram em ordem e ficam; no último passo, a faixa do total.
 */

/** Um braço: a barra cresce (escala) e o nome fica escrito dentro da trilha, sem esticar. */
const Arm = ({ label, text, frac, solid, on, delay }: { label: string; text: string; frac: number; solid: boolean; on: boolean; delay: number }) => (
    <div className="flex h-[25px] items-center gap-2">
        <div className="relative h-full flex-1">
            <div className="absolute inset-y-0 left-0 overflow-hidden rounded-[5px]" style={{ width: `${frac * 100}%` }}>
                <Grow value={on ? 1 : 0} color={solid ? C.glycogen : 'rgba(139,92,246,0.3)'} delay={delay}
                    className="rounded-[5px]" style={{ border: `3px solid ${C.glycogen}` }} />
            </div>
            <motion.span className="absolute inset-y-0 left-2.5 flex items-center text-[16px] font-semibold text-white"
                initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter, delay: on ? delay + 0.3 : 0 }}>
                {label}
            </motion.span>
        </div>
        <CountUp text={text} run={on} delay={delay} duration={0.6}
            className="w-[50px] shrink-0 text-right font-display text-[20px] font-bold" style={{ color: solid ? C.glycogenSoft : '#F3F4F6' }} />
    </div>
);

const Row = ({ row, step }: { row: StudyRow; step: number }) => {
    const on = step >= row.at;
    const current = step === row.at;
    const max = Math.max(...row.arms.map(a => a.value)) * 1.05;
    const color = row.kind === 'differs' ? C.glycogenSoft : C.stone;
    return (
        <motion.div className="flex items-center gap-3 rounded-xl border-2 px-3 py-1.5"
            style={{ borderColor: current ? `${C.glycogen}aa` : 'rgba(255,255,255,0.12)' }}
            initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 8 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <div className="flex w-[206px] shrink-0 flex-col">
                <span className="text-[19px] font-bold leading-tight text-white">{row.question}</span>
                <span className="text-[15px] leading-tight text-gray-300">{row.study} · {row.unit}</span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                {row.arms.map((a, i) => (
                    <Arm key={a.label} label={a.label} text={a.text} frac={a.value / max} solid={a.solid} on={on}
                        delay={current ? 0.15 + i * 0.12 : 0} />
                ))}
            </div>
            <motion.span className="w-[104px] shrink-0 rounded-lg border-[3px] px-1.5 py-1 text-center text-[16px] font-bold leading-tight"
                style={{ borderColor: color, color }}
                initial={false} animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.9 }}
                transition={{ duration: DUR.enter, delay: on && current ? 0.7 : 0, ease: EASE_OUT }}>
                {row.verdict}
            </motion.span>
        </motion.div>
    );
};

export const TotalRows = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-1.5">
        <div className="flex items-center gap-5 text-[15px] text-gray-300">
            <span>mmol/kg · ww = peso úmido · escala própria por linha</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-[3px] border-2" style={{ borderColor: C.glycogen, background: C.glycogen }} />referência</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-[3px] border-2" style={{ borderColor: C.glycogen, background: 'rgba(139,92,246,0.3)' }} />comparação</span>
        </div>
        {ROWS.map(r => <Row key={r.study} row={r} step={step} />)}
        <motion.div className="mt-auto flex items-baseline justify-between rounded-xl border-[3px] px-4 py-1"
            style={{ borderColor: C.glucose }}
            initial={false} animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : 8 }}
            transition={{ duration: DUR.enter, delay: step === 4 ? 0.2 : 0, ease: EASE_OUT }}>
            <span className="font-display text-[24px] font-bold" style={{ color: C.glucose }}>o que manda: o total do dia</span>
            <span className="text-[18px] font-semibold text-white">8–12 g/kg/d · ISSN 2017</span>
        </motion.div>
    </div>
);
