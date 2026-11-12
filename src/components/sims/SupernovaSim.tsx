import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel } from './kit/ui';
import { SnLedger, SnPanel, SnShell } from './ato8/SnShell';
import { SupernovaStage } from './ato8/SupernovaStage';
import { SUPERNOVA_CALC, SUPERNOVA_LEDGER, SUPERNOVA_STEPS } from './ato8/supernova.content';

/**
 * Slide 145 · Projeto Supernova (pico do Ato VIII), no formato palco + painel.
 * Palco: a virada da Burke (2006 → 2015–16), as três dietas em % da energia, a chama do LCHF, o preço do O₂
 * e a prova de 10 km com os marchadores andando até a sua melhora; no fim, o IC90%. Painel: texto do passo
 * e o livro-caixa que acumula. Nada some: o quadro final é a soma dos cinco passos.
 */

const ACCENT = [C.caveat, C.fat, C.fat, C.glucose, C.caveat] as const;

export default function SupernovaSim() {
    const { step, setStep } = useSlideSteps(SUPERNOVA_STEPS.length);
    const s = SUPERNOVA_STEPS[step];
    return (
        <SnShell tabs={SUPERNOVA_STEPS.map(x => x.tab)} step={step} setStep={setStep} layoutId="supernova-tabs"
            chips={<><DesignChip>paralelo · 3 semanas</DesignChip><CalcChip>{SUPERNOVA_CALC(step)}</CalcChip></>}>
            <Panel className="w-[640px] shrink-0 px-4 py-3"><SupernovaStage step={step} /></Panel>
            <SnPanel step={step} color={ACCENT[step]} headline={s.headline} text={s.text}
                source={sourcesUpTo(SUPERNOVA_STEPS.map(x => x.sources), step)}>
                <SnLedger rows={SUPERNOVA_LEDGER} step={step} />
            </SnPanel>
        </SnShell>
    );
}
