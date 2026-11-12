import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Beat } from './kit/Beat';
import { Chip, Panel } from './kit/ui';
import { Counter, SplitBar, Summary } from './ato1/VoteParts';
import { SummaryPanel, WherePanel } from './ato1/MythPanel';
import { MYTHS, loadTallies, saveTallies, type Tally } from './ato1/myth.content';

/**
 * Slide 13 · O Que a Turma Já Acha. Uma afirmação por passo; o professor lê os votos do chat e clica nos dois
 * contadores grandes (concordo × discordo). O painel diz em que ato a aula responde e que tipo de dado vai decidir,
 * sem pista do resultado. O último passo mostra as oito divisões com o ato de cada uma e onde a turma se dividiu.
 * Os votos ficam na sessionStorage (myth.content.ts): o slide Mito ou Verdade (Ato X) lê a mesma contagem.
 */
const STEPS = MYTHS.length + 1;
const SUMMARY = MYTHS.length;
const PILL_SPRING = { type: 'spring', stiffness: 420, damping: 36 } as const;

interface RailProps {
    step: number;
    tallies: readonly Tally[];
    onSelect: (i: number) => void;
}

/** Trilho das oito afirmações + resumo: onde estamos e quanto já foi votado em cada uma. */
const Rail = ({ step, tallies, onSelect }: RailProps) => (
    <div className="flex gap-2" role="tablist" aria-label="Afirmações">
        {[...MYTHS.map((m, i) => ({ key: m.short, label: String(i + 1), i })), { key: 'resumo', label: 'resumo', i: SUMMARY }].map(({ key, label, i }) => (
            <button key={key} type="button" role="tab" aria-selected={i === step} onClick={() => onSelect(i)}
                onPointerDown={e => e.preventDefault()}
                className={`relative flex cursor-pointer flex-col gap-1.5 rounded-xl px-3 pb-2 pt-1.5 ${i === SUMMARY ? 'w-[110px] justify-center' : 'flex-1'}`}>
                {i === step && (
                    <motion.span layoutId="myth-pill" aria-hidden transition={PILL_SPRING}
                        className="absolute inset-0 rounded-xl border-2" style={{ borderColor: C.glucose, borderRadius: 12 }} />
                )}
                <span className="relative font-mono text-[16px]" style={{ color: i === step ? C.glucoseSoft : '#D1D5DB' }}>{label}</span>
                {i < SUMMARY && <span className="relative"><SplitBar tally={tallies[i]} height={8} /></span>}
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
        <div className="not-prose flex h-[500px] w-full flex-col gap-3">
            <Panel className="shrink-0 px-2 pt-1"><Rail step={step} tallies={tallies} onSelect={setStep} /></Panel>

            <div className="flex min-h-0 flex-1 gap-4">
                <div className="flex w-[690px] shrink-0 flex-col gap-4">
                    {tally ? (
                        <>
                            <Beat beat={step} className="flex min-h-[132px] items-center">
                                <span className="text-[34px] font-semibold leading-tight text-white">{MYTHS[step].text}</span>
                            </Beat>
                            <div className="flex gap-5">
                                <Counter side="agree" height={168} count={tally.agree} onAdd={() => change(step, 'agree', 1)} onUndo={() => change(step, 'agree', -1)} />
                                <Counter side="disagree" height={168} count={tally.disagree} onAdd={() => change(step, 'disagree', 1)} onUndo={() => change(step, 'disagree', -1)} />
                            </div>
                        </>
                    ) : (
                        <Beat beat="resumo" className="flex flex-col gap-3">
                            <span className="text-[28px] font-semibold leading-tight text-white">As oito afirmações, como a turma votou.</span>
                            <Summary tallies={tallies} />
                        </Beat>
                    )}
                </div>
                <Panel className="min-w-0 flex-1 px-5 py-4">
                    {tally ? <WherePanel key={step} index={step} tally={tally} /> : <SummaryPanel tallies={tallies} />}
                </Panel>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-[16px] text-gray-300">{summary ? 'Guardado nesta sessão do navegador.' : 'Vote no chat: C para concordo, D para discordo.'}</span>
                <Chip>respostas no fim da aula</Chip>
            </div>
        </div>
    );
}
