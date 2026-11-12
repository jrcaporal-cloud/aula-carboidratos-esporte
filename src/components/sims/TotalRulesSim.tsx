import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { Narration, RecTop } from './ato7/RecFrame';
import { TotalRows } from './ato7/TotalRows';
import { MATTERS, MATTERS_LITTLE, TOTAL_CHIPS, TOTAL_STEPS } from './ato7/totalRules.content';

/**
 * Slide 123 · 24 Horas: o Total Manda. Composição de livro-caixa: à esquerda, uma linha por estudo (Keizer 1987,
 * Burke 1996, 1993, 2003), cada uma com os braços na própria escala e o veredito; no fim, a faixa do total.
 * À direita, o texto do passo e o resumo "importa pouco × importa", que acumula.
 */

const ACCENT = [C.stone, C.stone, C.glycogenSoft, C.glycogenSoft, C.glucose] as const;

const Item = ({ text, on, current, strong }: { text: string; on: boolean; current: boolean; strong: boolean }) => (
    <motion.li className="flex items-center gap-2 text-[17px] leading-tight text-white"
        initial={false} animate={{ opacity: on ? 1 : 0, x: on ? 0 : -6 }}
        transition={{ duration: DUR.enter, delay: on && current ? 0.8 : 0, ease: EASE_OUT }}>
        {strong
            ? <Check size={18} strokeWidth={3} color={C.ok} aria-hidden className="shrink-0" />
            : <Minus size={18} strokeWidth={3} color={C.stone} aria-hidden className="shrink-0" />}
        {text}
    </motion.li>
);

const Summary = ({ step }: { step: number }) => (
    <div className="grid grid-cols-2 gap-4">
        {[{ title: 'importa pouco', items: MATTERS_LITTLE, strong: false }, { title: 'importa', items: MATTERS, strong: true }].map(col => (
            <div key={col.title} className="flex flex-col gap-1.5">
                <span className="text-[15px] text-gray-300">{col.title}</span>
                <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                    {col.items.map(i => <Item key={i.text} text={i.text} on={step >= i.at} current={step === i.at} strong={col.strong} />)}
                </ul>
            </div>
        ))}
    </div>
);

export default function TotalRulesSim() {
    const { step, setStep } = useSlideSteps(TOTAL_STEPS.length);
    const s = TOTAL_STEPS[step];
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-3">
            <RecTop tabs={TOTAL_STEPS.map(t => t.tab)} step={step} setStep={setStep} layoutId="total-tabs"
                chips={TOTAL_CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)} />
            <div className="flex min-h-0 flex-1 gap-4">
                <Panel className="w-[690px] shrink-0 px-3 py-2"><TotalRows step={step} /></Panel>
                <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
                    <Narration step={step} headline={s.headline} color={ACCENT[step]}>{s.text}</Narration>
                    <div className="mt-auto flex flex-col gap-3">
                        <Summary step={step} />
                        <Source>{sourcesUpTo(TOTAL_STEPS.map(t => t.sources), step)}</Source>
                    </div>
                </Panel>
            </div>
        </div>
    );
}
