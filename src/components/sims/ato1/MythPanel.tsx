import { CHAPTERS } from '../../../data/chapters';
import { C } from '../kit/palette';
import { Reveal } from '../kit/rhythm';
import { AGREE, DISAGREE, SplitBar } from './VoteParts';
import { MYTH_WHERE, MYTHS, agreeShare, type Tally } from './myth.content';

/**
 * Painel do slide 13. Durante a votação: onde a aula responde a afirmação (ato e pergunta do ato), o que vai decidir
 * (o tipo de dado, nunca o resultado) e a divisão da turma ao vivo. No resumo: onde a turma mais se dividiu.
 */
const chapterOf = (roman: string) => CHAPTERS.find(c => c.roman === roman) ?? CHAPTERS[0];
const pct = (x: number): string => `${Math.round(x * 100)}%`;

export const WherePanel = ({ index, tally }: { index: number; tally: Tally }) => {
    const where = MYTH_WHERE[index];
    const ch = chapterOf(where.act);
    const share = agreeShare(tally);
    const total = tally.agree + tally.disagree;
    return (
        <div className="flex h-full flex-col gap-3">
            <Reveal order={0} className="flex flex-col gap-1">
                <span className="text-[16px] text-gray-300">onde a aula responde</span>
                <div className="flex items-baseline gap-3">
                    <span className="font-display text-[44px] font-bold leading-none" style={{ color: ch.color }}>{ch.roman}</span>
                    <span className="text-[22px] font-semibold leading-tight" style={{ color: ch.color }}>{ch.title}</span>
                </div>
                <span className="text-[17px] leading-snug text-gray-100">{ch.question}</span>
            </Reveal>
            <Reveal order={1} className="flex flex-col gap-1">
                <span className="text-[16px] text-gray-300">o que vai decidir</span>
                <span className="text-[18px] leading-snug text-white">{where.decides}</span>
            </Reveal>
            <div className="mt-auto flex flex-col gap-2">
                <span className="text-[16px] text-gray-300">a turma agora</span>
                <div className="flex items-baseline gap-3">
                    <span className="font-display text-[48px] font-bold leading-none tabular-nums" style={{ color: share === null ? C.muted : AGREE }}>
                        {share === null ? '—' : pct(share)}
                    </span>
                    <span className="text-[18px] text-gray-200">{share === null ? 'sem votos ainda' : `concordam · ${total} ${total === 1 ? 'voto' : 'votos'}`}</span>
                </div>
                <SplitBar tally={tally} height={16} />
            </div>
        </div>
    );
};

/** A afirmação mais dividida (mais perto de 50%) e a mais consensual, entre as que tiveram voto. */
const extremes = (tallies: readonly Tally[]) => {
    const voted = tallies.flatMap((t, i) => {
        const s = agreeShare(t);
        return s === null ? [] : [{ i, s, gap: Math.abs(s - 0.5) }];
    });
    if (!voted.length) return null;
    const byGap = [...voted].sort((a, b) => a.gap - b.gap);
    return { split: byGap[0], consensus: byGap[byGap.length - 1] };
};

export const SummaryPanel = ({ tallies }: { tallies: readonly Tally[] }) => {
    const ex = extremes(tallies);
    const total = tallies.reduce((n, t) => n + t.agree + t.disagree, 0);
    return (
        <div className="flex h-full flex-col gap-3">
            <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color: C.glucose }}>Onde a turma se dividiu</h3>
            {ex ? (
                <>
                    <Reveal order={0} className="flex flex-col gap-1">
                        <span className="text-[16px] text-gray-300">mais dividida</span>
                        <span className="text-[19px] font-semibold leading-snug text-white">{ex.split.i + 1}. {MYTHS[ex.split.i].short}</span>
                        <span className="font-mono text-[17px]" style={{ color: AGREE }}>{pct(ex.split.s)} concordam</span>
                    </Reveal>
                    <Reveal order={1} className="flex flex-col gap-1">
                        <span className="text-[16px] text-gray-300">mais consenso</span>
                        <span className="text-[19px] font-semibold leading-snug text-white">{ex.consensus.i + 1}. {MYTHS[ex.consensus.i].short}</span>
                        <span className="font-mono text-[17px]" style={{ color: ex.consensus.s >= 0.5 ? AGREE : DISAGREE }}>
                            {ex.consensus.s >= 0.5 ? `${pct(ex.consensus.s)} concordam` : `${pct(1 - ex.consensus.s)} discordam`}
                        </span>
                    </Reveal>
                </>
            ) : (
                <span className="text-[18px] leading-snug text-gray-200">Nenhum voto registrado nesta sessão.</span>
            )}
            <Reveal order={2} className="mt-auto flex flex-col gap-1">
                <span className="text-[17px] leading-snug text-gray-100">
                    {total} {total === 1 ? 'voto contado' : 'votos contados'}. A contagem fica guardada e volta no fim da aula, no slide Mito ou Verdade, ao lado do estudo e do desenho de cada afirmação.
                </span>
            </Reveal>
        </div>
    );
};
