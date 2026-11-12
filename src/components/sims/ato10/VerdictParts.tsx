import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { CountUp } from '../kit/CountUp';
import { C, PANEL_BG } from '../kit/palette';
import { Reveal } from '../kit/rhythm';
import { Stamp, type Verdict } from '../kit/Stamp';
import { MYTHS } from '../ato1/myth.content';
import { MINI, type Vote } from './verdictVotes';
import { INTRO, SCORE, VERDICTS } from './verdict.content';

/**
 * Peças do slide 189 (Mito ou Verdade?): o quadro das 8 afirmações que se preenche (veredito, número, estudo e voto
 * da turma) e os três painéis da direita (abertura, veredito da vez, placar).
 */

interface BoardProps {
    step: number;
    votes: readonly (Vote | null)[];
    onSelect: (step: number) => void;
}

/** O quadro: a linha da vez acende na cor do veredito; as já julgadas ficam com número, estudo e voto. */
export const Board = ({ step, votes, onSelect }: BoardProps) => {
    const anyVote = votes.some(Boolean);
    return (
        <div className="flex h-full flex-col gap-[5px]">
            <div className="flex items-center gap-3 px-3 text-[15px] text-gray-300">
                <span className="flex-1">afirmação · o número que decide</span>
                {anyVote && <span className="w-[64px] text-right">turma</span>}
                <span className="w-[34px]" />
            </div>
            {MYTHS.map((m, i) => {
                const shown = step > i;
                const current = step === i + 1;
                const v = VERDICTS[i];
                const { color, Icon } = MINI[v.verdict];
                const vote = votes[i];
                return (
                    <motion.button key={m.short} type="button" onClick={() => onSelect(i + 1)}
                        className="flex min-h-0 flex-1 cursor-pointer items-center gap-3 rounded-xl border-2 px-3 text-left" style={PANEL_BG}
                        animate={{ borderColor: current ? color : 'rgba(255,255,255,0.10)' }} transition={{ duration: DUR.text }}>
                        <span className="w-5 shrink-0 font-mono text-[15px] tabular-nums text-gray-300">{i + 1}</span>
                        <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-[17px] font-semibold leading-tight text-gray-100">{m.short}</span>
                            {shown && (
                                <motion.span className="truncate text-[15px] leading-tight text-gray-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ delay: current ? 0.45 : 0, duration: DUR.enter }}>
                                    <b className="tabular-nums" style={{ color: v.verdict === 'mito' ? '#FDA4AF' : C.stone }}>{v.number}</b> · {v.source}
                                </motion.span>
                            )}
                        </span>
                        {anyVote && (
                            <span className="w-[64px] shrink-0 text-right text-[17px] font-semibold tabular-nums text-gray-200">
                                {shown && vote ? `${vote.pct}%` : ''}
                            </span>
                        )}
                        <span className="flex h-[30px] w-[34px] shrink-0 items-center justify-center">
                            {shown && (
                                <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 520, damping: 28, delay: current ? 0.15 : 0 }}
                                    className="flex h-[30px] w-[30px] items-center justify-center rounded-lg" style={{ background: color }}>
                                    <Icon size={19} strokeWidth={3} color="#04080F" aria-label={v.verdict} />
                                </motion.span>
                            )}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
};

export const IntroPanel = ({ votedCount }: { votedCount: number }) => (
    <div className="flex h-full flex-col justify-center gap-5">
        <Reveal><p className="m-0 font-display text-[30px] font-semibold leading-[1.15] text-white">{INTRO.line}</p></Reveal>
        <Reveal order={1}><p className="m-0 text-[18px] leading-snug text-gray-200">{INTRO.how}</p></Reveal>
        <Reveal order={2}>
            <p className="m-0 text-[17px] text-gray-300">
                {votedCount > 0 ? `Votos guardados: ${votedCount} de 8 afirmações votadas.` : SCORE.noVotes}
            </p>
        </Reveal>
    </div>
);

/** Veredito da vez: carimbo, a afirmação, o número que decide (conta até o valor), o porquê e o voto da turma. */
export const VerdictPanel = ({ index, vote }: { index: number; vote: Vote | null }) => {
    const v = VERDICTS[index];
    const { color } = MINI[v.verdict];
    return (
        <div className="flex h-full flex-col gap-3">
            <div className="flex items-center justify-end pt-1">
                <Stamp key={index} verdict={v.verdict} size="lg" />
            </div>
            <p className="m-0 text-[22px] font-semibold leading-snug text-white">“{MYTHS[index].text}”</p>
            <Reveal order={1} className="flex flex-col gap-1">
                <CountUp text={v.number} delay={0.3} className="font-display text-[40px] font-bold leading-none" style={{ color: v.verdict === 'mito' ? '#FDA4AF' : color }} />
                <span className="text-[16px] leading-snug text-gray-200">{v.caption}</span>
            </Reveal>
            <Reveal order={2}><p className="m-0 text-[17px] leading-snug text-gray-100">{v.why}</p></Reveal>
            {vote && (
                <Reveal order={2} className="mt-auto flex flex-col gap-1">
                    <span className="text-[17px] text-gray-200">a turma: <b className="text-white">{vote.pct}%</b> concordou ({vote.total} votos)</span>
                    <div className="relative h-[10px] overflow-hidden rounded bg-slate-800">
                        <motion.div className="absolute inset-y-0 left-0 w-full origin-left" style={{ background: C.co2 }}
                            initial={{ scaleX: 0 }} animate={{ scaleX: vote.pct / 100 }} transition={{ delay: 0.5, duration: DUR.bar, ease: EASE_OUT }} />
                    </div>
                </Reveal>
            )}
        </div>
    );
};

const LABEL: Record<Verdict, string> = { mito: 'mitos', depende: 'depende', verdade: 'verdades' };
const ORDER: readonly Verdict[] = ['mito', 'depende', 'verdade'];

/** Placar final: 7 / 1 / 0, a frase da virada e o resultado da votação da turma (se houve). */
export const ScorePanel = ({ crowd }: { crowd: { hit: number; of: number } | null }) => {
    const reduce = useReducedMotion() ?? false;
    const count = (v: Verdict) => VERDICTS.filter(x => x.verdict === v).length;
    return (
        <div className="flex h-full flex-col justify-center gap-5">
            <div className="flex items-end gap-10">
                {ORDER.map((v, i) => (
                    <motion.div key={v} className="flex flex-col gap-1" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stagger(i, 0.1, 0.15), duration: DUR.enter, ease: EASE_OUT }}>
                        <CountUp text={String(count(v))} delay={0.1 + i * 0.15} className="font-display text-[80px] font-bold leading-none" style={{ color: MINI[v].color }} />
                        <span className="text-[20px] text-gray-200">{LABEL[v]}</span>
                    </motion.div>
                ))}
            </div>
            <Reveal order={1}><p className="m-0 font-display text-[30px] font-semibold leading-[1.15] text-white">{SCORE.line}</p></Reveal>
            <Reveal order={2}><p className="m-0 text-[17px] leading-snug text-gray-200">{SCORE.note}</p></Reveal>
            <Reveal order={2}>
                <p className="m-0 text-[19px] font-semibold leading-snug" style={{ color: crowd ? C.glucoseSoft : C.caveat }}>
                    {crowd ? SCORE.crowd(crowd.hit, crowd.of) : SCORE.noVotes}
                </p>
            </Reveal>
        </div>
    );
};
