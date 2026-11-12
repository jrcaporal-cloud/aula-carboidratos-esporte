import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip } from './kit/chips';
import { Reveal } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { DecideLedger, DecideShell } from './ato10/DecideShell';
import { FundingStage } from './ato10/FundingStage';
import { CHECKS, DESIGNS, FUNDING_LEDGER, FUNDING_STEPS } from './ato10/funding.content';

/**
 * Slide 188 · Quem Paga o Estudo. Palco: o funil de Heneghan 2012 (431 alegações → 146 referências → 74 avaliáveis →
 * 3 de alta qualidade) e a qualidade dos 74 estudos. Painel: texto do passo, livro-caixa que acumula e, no fim, as quatro
 * perguntas de leitura com o exemplo de Smith 2013 (indústria, mas duplo-cego).
 */

const ACCENT = [C.stone, C.stone, C.risk, C.glucoseSoft] as const;

const Checks = () => (
    <Reveal order={1}>
        <div className="flex flex-col gap-1.5 border-t-2 border-white/15 pt-2">
            <span className="text-[15px] font-semibold text-gray-300">antes do efeito, pergunte</span>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {CHECKS.map(c => {
                    const Icon = c.icon;
                    return (
                        <span key={c.ask} className="flex items-center gap-2 text-[16px] font-semibold leading-tight text-white">
                            <Icon size={22} strokeWidth={2.4} color={C.glucose} className="shrink-0" aria-hidden />{c.ask}
                        </span>
                    );
                })}
            </div>
        </div>
    </Reveal>
);

export default function FundingSim() {
    const { step, setStep } = useSlideSteps(FUNDING_STEPS.length);
    const s = FUNDING_STEPS[step];
    return (
        <DecideShell tabs={FUNDING_STEPS.map(f => f.tab)} step={step} setStep={setStep} layoutId="funding-tabs"
            chips={<DesignChip>{DESIGNS[step]}</DesignChip>}
            stageWidth={620} stage={<FundingStage step={step} />}
            accent={ACCENT[step]} headline={s.headline} text={s.text}
            ledger={<><DecideLedger rows={FUNDING_LEDGER} step={step} />{step === 3 && <Checks />}</>}
            sources={sourcesUpTo(FUNDING_STEPS.map(f => f.sources), step)} />
    );
}
