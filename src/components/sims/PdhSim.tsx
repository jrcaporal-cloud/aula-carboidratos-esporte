import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CalcChip, DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel } from './kit/ui';
import { PdhStage } from './ato8/PdhStage';
import { SnLedger, SnPanel, SnShell } from './ato8/SnShell';
import { PDH_CHIPS, PDH_LEDGER, PDH_STEPS } from './ato8/pdh.content';

/**
 * Slide 147 · A torneira fechada, no formato palco + painel. Palco: as duas vias do glicogênio ao ciclo de Krebs
 * (CHO alto × gordura → CHO), com a PDH como porta da mitocôndria, a PDK que a fecha, o sprint e a prova de
 * Havemann. Painel: o texto do passo e o livro-caixa (CHO alto × gordura → CHO) que acumula.
 */

const ACCENT = [C.glycogenSoft, C.fat, C.stone, C.fat, C.fat] as const;

export default function PdhSim() {
    const { step, setStep } = useSlideSteps(PDH_STEPS.length);
    const s = PDH_STEPS[step];
    return (
        <SnShell tabs={PDH_STEPS.map(x => x.tab)} step={step} setStep={setStep} layoutId="pdh-tabs"
            chips={<>
                {PDH_CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
                {step >= 1 && step < 4 && <CalcChip>{step >= 3 ? 'cálculo: −29%, −26%' : 'cálculo: −29%'}</CalcChip>}
                {step >= 4 && <IllustrativeChip>perfil ilustrativo</IllustrativeChip>}
            </>}>
            <Panel className="w-[640px] shrink-0 px-4 py-3"><PdhStage step={step} /></Panel>
            <SnPanel step={step} color={ACCENT[step]} headline={s.headline} text={s.text}
                source={sourcesUpTo(PDH_STEPS.map(x => x.sources), step)}>
                <SnLedger rows={PDH_LEDGER} step={step} />
            </SnPanel>
        </SnShell>
    );
}
