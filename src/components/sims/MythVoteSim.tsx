import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C, PANEL_BG } from './kit/palette';
import { Beat } from './kit/Beat';
import { Chip } from './kit/ui';
import { Counter, SplitBar, Summary } from './ato1/VoteParts';
import { MYTHS, loadTallies, saveTallies, type Tally } from './ato1/myth.content';

/**
 * Slide 13 · O Que a Turma Já Acha. Uma afirmação por passo; o professor lê os votos do chat
 * e clica nos dois contadores grandes (concordo × discordo). O último passo mostra as oito divisões juntas.
 * Nenhuma resposta aparece aqui: os vereditos ficam para o slide 189.
 */
const STEPS = MYTHS.length + 1;
const SUMMARY = MYTHS.length;
const PILL_SPRING = { type: 'spring', stiffness: 420, damping: 36 } as const;

interface RailProps {
    step: number;
    tallies: readonly Tally[];
    onSelect: (i: number) => void;
}

/** Trilho das oito afirmações: onde estamos e quanto já foi votado em cada uma. */
const Rail = ({ step, tallies, onSelect }: RailProps) => (
    <div className="flex gap-2" role="tablist" aria-label="Afirmações">
        {MYTHS.map((m, i) => (
            <button key={m.short} type="button" role="tab" aria-selected={i === step} onClick={() => onSelect(i)}
                onPointerDown={e => e.preventDefault()}
                className="relative flex flex-1 cursor-pointer flex-col gap-1.5 rounded-xl px-3 pb-2 pt-1.5">
                {i === step && (
                    <motion.span layoutId="myth-pill" aria-hidden transition={PILL_SPRING}
                        className="absolute inset-0 rounded-xl border-2" style={{ borderColor: C.glucose, borderRadius: 12 }} />
                )}
                <span className="relative font-mono text-[16px]" style={{ color: i === step ? C.glucoseSoft : '#D1D5DB' }}>{i + 1}</span>
                <span className="relative"><SplitBar tally={tallies[i]} height={8} /></span>
            </button>
        ))}
    </div>
);

export default function MythVoteSim() {
    const { step, setStep } = useSlideSteps(STEPS);
    const [tallies, setTallies] = useState<readonly Tally[]>(loadTallies);

    const change = (index: number, side: keyof Tally, delta: number) => {
        setTallies(prev => {
            const next = prev.map((t, i) => (i === index ? { ...t, [side]: Math.max(0, t[side] + delta) } : t));
            saveTallies(next);
            return next;
        });
    };

    const summary = step === SUMMARY;
    const tally = summary ? null : tallies[step];

    return (
        <div className="not-prose flex w-full flex-col gap-5" style={{ maxHeight: 516 }}>
            <div className="rounded-2xl px-2 pt-1" style={PANEL_BG}>
                <Rail step={step} tallies={tallies} onSelect={setStep} />
            </div>

            {tally ? (
                <>
                    <Beat beat={step} className="flex min-h-[96px] items-center">
                        <span className="text-[34px] font-semibold leading-tight text-white">{MYTHS[step].text}</span>
                    </Beat>
                    <div className="flex gap-6">
                        <Counter side="agree" count={tally.agree} onAdd={() => change(step, 'agree', 1)} onUndo={() => change(step, 'agree', -1)} />
                        <Counter side="disagree" count={tally.disagree} onAdd={() => change(step, 'disagree', 1)} onUndo={() => change(step, 'disagree', -1)} />
                    </div>
                </>
            ) : (
                <Beat beat="resumo" className="flex flex-col gap-5">
                    <span className="text-[30px] font-semibold leading-tight text-white">Onde a turma se dividiu.</span>
                    <Summary tallies={tallies} />
                </Beat>
            )}

            <div className="flex items-center justify-between">
                <span className="text-[16px] text-gray-300">{summary ? 'Guardado nesta sessão do navegador.' : 'Vote no chat: concordo ou discordo.'}</span>
                <Chip>respostas no fim da aula</Chip>
            </div>
        </div>
    );
}
