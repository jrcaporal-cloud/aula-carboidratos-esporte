import { motion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { KeyFact } from '../kit/rhythm';
import { LIVER_GROUPS } from './liver.content';

/**
 * Livro-caixa do slide 124 agrupado por medida: cada grupo tem UMA unidade à esquerda (fígado em g/h, fígado em g
 * ganhos, músculo, revisão) e uma linha por estudo. Linha entra no passo `at` e fica; a primeira linha nova pulsa.
 */
export const LiverLedger = ({ step }: { step: number }) => {
    const groups = LIVER_GROUPS
        .map(g => ({ ...g, rows: g.rows.filter(r => r.at <= step && (r.upto === undefined || step <= r.upto)) }))
        .filter(g => g.rows.length > 0);
    const firstNew = groups.flatMap(g => g.rows).find(r => r.at === step);
    return (
        <div className="flex flex-col gap-1 border-t-2 border-white/15 pt-2">
            {groups.map(g => (
                <div key={g.title} className="grid grid-cols-[104px_1fr] gap-x-3">
                    <span className="pt-[2px] text-[16px] font-semibold leading-tight" style={{ color: g.color }}>{g.title}</span>
                    <div className="flex flex-col">
                        {g.rows.map((r, i) => {
                            const fresh = r.at === step;
                            const value = <span className="font-display text-[18px] font-semibold leading-snug tabular-nums" style={{ color: g.color }}>{r.value}</span>;
                            return (
                                <motion.div key={r.who} className="flex items-baseline justify-between gap-3"
                                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: DUR.enter, ease: EASE_OUT, delay: fresh ? stagger(i, 0.45, 0.12) : 0 }}>
                                    <span className="text-[16px] leading-tight text-gray-300">{r.who}</span>
                                    {r === firstNew ? <KeyFact color={g.color} delay={0.55}>{value}</KeyFact> : value}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};
