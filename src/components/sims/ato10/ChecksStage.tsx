import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { KeyFact } from '../kit/rhythm';
import { PANEL_BG } from '../kit/palette';
import { CHECK_ROWS, type CheckRow } from './raceChecks.content';

/**
 * Palco do slide 193 (Quatro Perguntas Antes da Prova): quadro de decisão em 4 linhas, uma por passo, que ficam.
 * Cada linha: pergunta (com o "se não" embaixo) → o que fazer, como fazer e o número que sustenta.
 * A linha do passo atual tem a borda na cor dela; as já vistas ficam legíveis; as que faltam são moldura tracejada.
 */

const Row = ({ row, step }: { row: CheckRow; step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const fresh = row.at === step;
    return (
        <motion.div className="grid min-h-0 flex-1 grid-cols-[226px_28px_1fr] items-stretch gap-2"
            initial={reduce || !fresh ? false : { opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <div className="flex items-center gap-2.5 rounded-xl border-2 px-3 py-1.5"
                style={{ ...PANEL_BG, borderColor: fresh ? row.color : 'rgba(255,255,255,0.16)' }}>
                <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full font-display text-[18px] font-bold text-[#04080F]"
                    style={{ background: row.color }}>{row.at + 1}</span>
                <span className="flex flex-col leading-tight">
                    <span className="text-[18px] font-semibold text-white">{row.question}</span>
                    <span className="text-[15px] text-gray-300">{row.hint}</span>
                </span>
            </div>
            <span className="flex flex-col items-center justify-center text-[14px] font-semibold text-gray-300">
                sim<ArrowRight size={24} strokeWidth={3} color={row.color} aria-hidden />
            </span>
            <div className="flex flex-col justify-center rounded-xl border-2 px-3 py-1"
                style={{ ...PANEL_BG, borderColor: fresh ? row.color : 'rgba(255,255,255,0.16)' }}>
                <span className="text-[18px] font-bold leading-tight" style={{ color: row.color }}>{row.action}</span>
                {row.lines.map(l => <span key={l} className="text-[15px] leading-tight text-gray-100">{l}</span>)}
                <span className="pt-0.5 text-[16px] font-bold leading-tight text-white">
                    {fresh ? <KeyFact color={row.color} delay={0.45}>{row.key}</KeyFact> : row.key}
                </span>
            </div>
        </motion.div>
    );
};

const Slot = ({ n }: { n: number }) => (
    <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-700">
        <span className="text-[16px] font-semibold text-slate-500">pergunta {n}</span>
    </div>
);

export const ChecksStage = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-2 p-3">
        {CHECK_ROWS.map(r => (r.at <= step ? <Row key={r.question} row={r} step={step} /> : <Slot key={r.question} n={r.at + 1} />))}
    </div>
);
