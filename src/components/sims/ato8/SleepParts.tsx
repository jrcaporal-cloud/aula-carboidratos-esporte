import { motion } from 'framer-motion';
import { Equal, Moon, Sun, UtensilsCrossed, Zap, type LucideIcon } from 'lucide-react';
import { EASE_OUT, stagger } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { DAY, HULSTON, STUDIES, type DaySegment, type StudyRow } from './sleeplow.content';

/** Peças do slide 142: o trilho do dia de sleep low, as linhas dos estudos e a cena do custo. */

const SEG_STYLE: Record<DaySegment['id'], { bg: string; fg: string; Icon: LucideIcon }> = {
    hit: { bg: C.glucose, fg: '#04080F', Icon: Zap },
    night: { bg: '#1E293B', fg: C.text, Icon: Moon },
    easy: { bg: 'transparent', fg: C.stone, Icon: Sun },
    refuel: { bg: C.glucose, fg: '#04080F', Icon: UtensilsCrossed },
};

/** O dia de sleep low. `compact` = faixa fina que fica no topo como legenda (só ícone + o quê). */
export const DayStrip = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex w-full gap-2">
        {DAY.map((seg, i) => {
            const s = SEG_STYLE[seg.id];
            return (
                <motion.div key={seg.id} className={`flex flex-col justify-center gap-1 rounded-2xl px-5 ${compact ? 'h-[52px]' : 'h-[110px]'}`}
                    style={{ flex: seg.span, background: s.bg, color: s.fg, border: seg.id === 'easy' ? `3px solid ${C.stone}` : 'none' }}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stagger(i, 0.05, 0.12), duration: 0.35, ease: EASE_OUT }}>
                    {compact ? (
                        <span className="flex items-center gap-2 text-[18px] font-semibold"><s.Icon size={18} strokeWidth={2.5} />{seg.what}</span>
                    ) : (
                        <>
                            <span className="flex items-center gap-2 text-[18px] font-semibold opacity-90"><s.Icon size={20} strokeWidth={2.5} />{seg.when}</span>
                            <span className="text-[24px] font-bold leading-tight">{seg.what}</span>
                        </>
                    )}
                </motion.div>
            );
        })}
    </div>
);

/** Largura máxima das barras: 6% de melhora. */
const MAX = 6;

const Bar = ({ value, color, label }: { value: number; color: string; label: string }) => (
    <div className="flex items-center gap-3">
        <div className="relative h-[22px] w-[300px] overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <Grow value={value / MAX} color={color} />
        </div>
        <span className="w-[150px] text-[18px] tabular-nums" style={{ color }}>{label}</span>
    </div>
);

const Row = ({ row, dim, i }: { row: StudyRow; dim: boolean; i: number }) => (
    <motion.div className="flex items-center gap-6 rounded-xl px-4 py-2" style={{ background: 'rgba(255,255,255,0.05)' }}
        initial={{ opacity: 0, x: -14 }} animate={{ opacity: dim ? 0.6 : 1, x: 0 }}
        transition={{ delay: dim ? 0 : stagger(i, 0.1, 0.18), duration: 0.35, ease: EASE_OUT }}>
        <div className="w-[300px] shrink-0">
            <p className="m-0 text-[21px] font-bold text-white">{row.who}</p>
            <p className="m-0 text-[17px] text-gray-300">{row.design} · {row.test}</p>
        </div>
        {row.low !== null && row.ctl !== null ? (
            <div className="flex flex-col gap-1.5">
                <Bar value={row.low} color={C.stone} label={`sleep low +${br(row.low, row.low % 1 ? 1 : 0)}%`} />
                <Bar value={row.ctl} color={C.glucose} label={`controle +${br(row.ctl, row.ctl % 1 ? 1 : 0)}%`} />
            </div>
        ) : (
            <span className="flex w-[462px] items-center gap-3 text-[20px] text-gray-100"><Equal size={24} strokeWidth={3} /> sem diferença entre os grupos</span>
        )}
        <span className="text-[17px] leading-snug text-gray-300">{row.note}</span>
    </motion.div>
);

export const StudyRows = ({ count, dimFirst }: { count: number; dimFirst: boolean }) => (
    <div className="flex flex-col gap-2.5">
        <span className="ml-[340px] text-[16px] text-gray-300">melhora no teste final (pré → pós)</span>
        {STUDIES.slice(0, count).map((r, i) => <Row key={r.id} row={r} i={i} dim={dimFirst && i === 0} />)}
    </div>
);

/** Duas colunas de potência no treino intenso: 323 × 297 W. */
export const CostScene = () => (
    <div className="flex items-end gap-14 pl-4">
        {([['com CHO', HULSTON.high, C.glucose], ['train low', HULSTON.low, C.stone]] as const).map(([label, w, color], i) => (
            <div key={label} className="flex flex-col items-center gap-2">
                <CountUp text={`${w} W`} delay={0.1 + i * 0.15} className="font-display text-[44px] font-bold leading-none" style={{ color }} />
                <div className="relative w-[120px] overflow-hidden rounded-t-xl" style={{ height: 230 * (w / HULSTON.high) }}>
                    <Grow value={1} axis="y" color={color} delay={i * 0.15} />
                </div>
                <span className="text-[20px] text-gray-200">{label}</span>
            </div>
        ))}
        <div className="mb-10 flex max-w-[460px] flex-col gap-3 pl-6">
            <CountUp text="−8%" delay={0.4} className="font-display text-[88px] font-bold leading-none" style={{ color: C.risk }} />
            <span className="text-[22px] leading-snug text-gray-100">de potência nas sessões intensas feitas com pouco glicogênio</span>
            <span className="text-[20px] leading-snug text-gray-300">No contrarrelógio final, os dois grupos melhoraram ~10%.</span>
        </div>
    </div>
);
