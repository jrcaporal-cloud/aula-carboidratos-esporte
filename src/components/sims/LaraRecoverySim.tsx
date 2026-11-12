import { useSlideSteps } from '../../store/useSlideSteps';
import { CalcChip, DesignChip, FictionChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, StepTabs } from './kit/ui';
import { LaraWeek } from './ato7/LaraWeek';
import { RefillPanel } from './ato7/RefillPanel';
import { LARA_DESIGN, LARA_LEDGER, LARA_STEPS } from './ato7/lara.content';

/**
 * Slide 126 · Lara, Jogo a Cada 72 Horas (caso fictício, dados de homens). Palco à esquerda: a semana dela em sete
 * colunas, com o tanque que não volta em 24 h (Krustrup 2011) e o carboidrato do dia da Premier League (Anderson 2017)
 * contra a faixa de 6–10 g/kg/d (Burke 2011). No fim, a conta em gramas para 60 kg. Painel com texto e livro-caixa.
 */
export default function LaraRecoverySim() {
    const { step, setStep } = useSlideSteps(LARA_STEPS.length);
    const s = LARA_STEPS[step];
    const design = LARA_DESIGN[step];
    return (
        <div className="not-prose flex h-[512px] w-full flex-col gap-2.5">
            <div className="flex items-center justify-between gap-4">
                <StepTabs labels={LARA_STEPS.map(x => x.tab)} step={step} onSelect={setStep} layoutId="lara-recovery-tabs" />
                <div className="flex flex-wrap justify-end gap-2">
                    <FictionChip />
                    {design && <DesignChip>{design}</DesignChip>}
                    {step === 4 && <CalcChip />}
                </div>
            </div>
            <div className="flex min-h-0 flex-1 gap-3.5">
                <Panel className="w-[684px] shrink-0"><LaraWeek step={step} /></Panel>
                <RefillPanel className="flex-1" step={step} headline={s.headline} color={s.color} text={s.text} note={s.note} size={16}
                    rows={LARA_LEDGER} source={sourcesUpTo(LARA_STEPS.map(x => x.sources), step)} />
            </div>
        </div>
    );
}
