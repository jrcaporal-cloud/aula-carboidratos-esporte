import { motion, useReducedMotion } from 'framer-motion';
import { Minus, ThumbsDown, ThumbsUp } from 'lucide-react';
import type { PointerEvent } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { CHAPTERS } from '../../../data/chapters';
import { MYTH_WHERE, MYTHS, agreeShare, type Tally } from './myth.content';

/** Cores dos dois lados: neutras de propósito (verde × vermelho sugeriria a resposta certa). */
export const AGREE = C.glucose;
export const DISAGREE = C.insulinSoft;

/** Clique não rouba o foco: a barra de espaço e as setas continuam com o passador. */
const keepFocus = (e: PointerEvent) => e.preventDefault();

interface CounterProps {
    side: 'agree' | 'disagree';
    count: number;
    onAdd: () => void;
    onUndo: () => void;
    /** Altura do botão (px de projeto). */
    height?: number;
}

/** Botão grande que conta um voto do chat; o "−" embaixo desfaz um clique a mais. */
export const Counter = ({ side, count, onAdd, onUndo, height = 176 }: CounterProps) => {
    const reduce = useReducedMotion();
    const agree = side === 'agree';
    const color = agree ? AGREE : DISAGREE;
    const Icon = agree ? ThumbsUp : ThumbsDown;
    const label = agree ? 'concordo' : 'discordo';
    return (
        <div className="flex flex-1 flex-col gap-2">
            <button type="button" onPointerDown={keepFocus} onClick={onAdd} aria-label={`mais um voto: ${label}`}
                className="flex cursor-pointer items-center justify-between rounded-2xl border-[3px] px-8 transition-transform duration-150 ease-out active:scale-[0.97]"
                style={{ height, borderColor: color, background: 'rgba(4,10,20,0.85)' }}>
                <span className="flex flex-col items-start gap-2">
                    <Icon size={40} color={color} strokeWidth={2.2} aria-hidden />
                    <span className="text-[26px] font-semibold" style={{ color }}>{label}</span>
                </span>
                <motion.span key={count} className="font-display text-[96px] font-bold leading-none tabular-nums" style={{ color }}
                    initial={reduce || count === 0 ? false : { scale: 1.18, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 28 }}>
                    {count}
                </motion.span>
            </button>
            <button type="button" onPointerDown={keepFocus} onClick={onUndo} disabled={count === 0} aria-label={`tirar um voto: ${label}`}
                className="flex cursor-pointer items-center gap-1 self-end rounded-lg px-3 py-1 text-[16px] text-gray-300 disabled:cursor-default disabled:opacity-30">
                <Minus size={16} aria-hidden /> desfazer
            </button>
        </div>
    );
};

/** Barra dividida concordo × discordo (some quando ainda não há voto). */
export const SplitBar = ({ tally, height = 14 }: { tally: Tally; height?: number }) => {
    const total = tally.agree + tally.disagree;
    const share = total ? tally.agree / total : 0;
    return (
        <div className="relative w-full overflow-hidden rounded-md" style={{ height, background: total ? DISAGREE : 'rgba(255,255,255,0.08)' }}>
            {total > 0 && (
                <motion.div className="absolute inset-0" style={{ background: AGREE, transformOrigin: 'left center' }}
                    initial={false} animate={{ scaleX: share }} transition={{ duration: DUR.morph, ease: EASE_OUT }} />
            )}
        </div>
    );
};

const colorOf = (roman: string): string => CHAPTERS.find(c => c.roman === roman)?.color ?? C.text;

/** Quadro final: as oito afirmações com a divisão da turma e o ato que responde, sem veredito. */
export const Summary = ({ tallies }: { tallies: readonly Tally[] }) => (
    <div className="flex flex-col gap-3">
        {MYTHS.map((m, i) => {
            const t = tallies[i];
            const share = agreeShare(t);
            const act = MYTH_WHERE[i].act;
            return (
                <motion.div key={m.short} className="grid grid-cols-[24px_1fr_56px_150px_80px] items-center gap-3"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.35), duration: DUR.enter, ease: EASE_OUT }}>
                    <span className="font-mono text-[16px] text-gray-400">{i + 1}</span>
                    <span className="truncate text-[20px] text-gray-100">{m.short}</span>
                    <span className="rounded-md border-2 text-center font-mono text-[14px] font-bold leading-5" style={{ borderColor: colorOf(act), color: colorOf(act) }}>{act}</span>
                    <SplitBar tally={t} height={16} />
                    <span className="text-right font-mono text-[18px] tabular-nums">
                        {share === null ? <span className="text-gray-400">—</span> : (
                            <><span style={{ color: AGREE }}>{t.agree}</span><span className="text-gray-400"> × </span><span style={{ color: DISAGREE }}>{t.disagree}</span></>
                        )}
                    </span>
                </motion.div>
            );
        })}
    </div>
);
