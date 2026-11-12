import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CircleHelp, X } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Beat } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { Stamp, type Verdict } from './kit/Stamp';
import { DesignChip } from './kit/chips';
import { Source } from './kit/ui';
import { loadTallies, MYTHS, type Tally } from './ato1/myth.content';
import { SIM_H } from './ato10/units';
import { INTRO, SOURCE, VERDICTS } from './ato10/verdict.content';

/**
 * Slide 189 · Mito ou Verdade? O clímax da aula. À esquerda, as 8 afirmações do slide 13 em trilho (texto e ordem de ato1/);
 * à direita, o palco da afirmação da vez: o carimbo cai, o número que decide conta até o valor, a fonte com o desenho.
 * Se a turma votou no slide 13 (sessionStorage), o palco mostra quanto ela concordou.
 */
const STEPS = VERDICTS.length + 1;
const MINI: Record<Verdict, { color: string; Icon: typeof Check }> = {
    mito: { color: C.risk, Icon: X },
    verdade: { color: C.ok, Icon: Check },
    depende: { color: C.stone, Icon: CircleHelp },
};

const agreeOf = (t: Tally | undefined): { pct: number; total: number } | null => {
    const total = t ? t.agree + t.disagree : 0;
    return t && total > 0 ? { pct: Math.round((t.agree / total) * 100), total } : null;
};

const Rail = ({ step }: { step: number }) => (
    <ol className="m-0 flex w-[350px] shrink-0 list-none flex-col justify-between p-0">
        {MYTHS.map((m, i) => {
            const shown = step > i;
            const current = step === i + 1;
            const { color, Icon } = MINI[VERDICTS[i].verdict];
            return (
                <motion.li key={m.short} className="flex h-[50px] items-center gap-3 rounded-xl border-2 px-3" style={PANEL_BG}
                    animate={{ borderColor: current ? color : 'rgba(255,255,255,0.10)', opacity: step === 0 || shown ? 1 : 0.6 }}
                    transition={{ duration: DUR.text }}>
                    <span className="w-6 shrink-0 font-mono text-[16px] tabular-nums text-gray-300">{i + 1}</span>
                    <span className="flex-1 text-[18px] leading-tight text-gray-100">{m.short}</span>
                    {shown && (
                        <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 520, damping: 28 }}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: color }}>
                            <Icon size={20} strokeWidth={3} color="#04080F" aria-label={VERDICTS[i].verdict} />
                        </motion.span>
                    )}
                </motion.li>
            );
        })}
    </ol>
);

const Intro = ({ voted }: { voted: boolean }) => (
    <div className="flex h-full flex-col justify-center gap-6">
        <p className="m-0 font-display text-[44px] font-semibold leading-[1.1] text-white">{INTRO.line}</p>
        {!voted && <p className="m-0 text-[18px] text-gray-300">{INTRO.noVotes}</p>}
    </div>
);

const Verdict8 = ({ index, tally }: { index: number; tally: Tally | undefined }) => {
    const v = VERDICTS[index];
    const vote = agreeOf(tally);
    return (
        <div className="flex h-full flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-6">
                    <span className="font-mono text-[18px] tabular-nums text-gray-300">{index + 1}/8</span>
                    <DesignChip>{v.source}</DesignChip>
                </div>
                <p className="m-0 text-[32px] font-semibold leading-[1.2] text-white">{MYTHS[index].text}</p>
            </div>
            <div className="flex items-center gap-8">
                <Stamp key={index} verdict={v.verdict} size="lg" />
                {vote && (
                    <motion.span className="text-[20px] text-gray-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: DUR.enter }}>
                        a turma: <span className="font-semibold text-white">{vote.pct}%</span> concordou ({vote.total} votos)
                    </motion.span>
                )}
            </div>
            <motion.div className="flex flex-col gap-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: DUR.enter, ease: EASE_OUT }}>
                <CountUp text={v.number} delay={0.3} className="font-display text-[54px] font-bold leading-none" style={{ color: MINI[v.verdict].color }} />
                <span className="text-[20px] leading-snug text-gray-200">{v.caption}</span>
            </motion.div>
        </div>
    );
};

export default function MythVerdictSim() {
    const { step } = useSlideSteps(STEPS);
    // Votos do slide 13: lidos uma vez ao abrir; sem votos (ou storage bloqueado) o slide funciona igual.
    const [tallies] = useState(loadTallies);
    const voted = tallies.some(t => t.agree + t.disagree > 0);
    return (
        <div className="not-prose flex w-full flex-col gap-3" style={{ height: SIM_H }}>
            <div className="flex min-h-0 flex-1 gap-6">
                <Rail step={step} />
                <div className="min-w-0 flex-1 rounded-2xl border-2 border-white/12 px-9 py-6" style={PANEL_BG}>
                    <Beat beat={step} className="h-full">
                        {step === 0 ? <Intro voted={voted} /> : <Verdict8 index={step - 1} tally={voted ? tallies[step - 1] : undefined} />}
                    </Beat>
                </div>
            </div>
            <Source>{SOURCE}</Source>
        </div>
    );
}
