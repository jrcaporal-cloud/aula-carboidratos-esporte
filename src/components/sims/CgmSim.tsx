import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { MedirLedger, MedirShell } from './ato10/MedirShell';
import { CgmChain } from './ato10/CgmChain';
import { LEDGER, STEPS } from './ato10/cgm.content';

/**
 * Slide 185 · Glicose Contínua em Atleta (palco + painel). O palco é a cadeia de causa em 4 faixas (ato10/CgmChain):
 * o sensor atrasa (intersticial) → saudáveis passam de 6,0 boa parte do dia → o CGM não separa REDs → logo, não há régua
 * para atleta. A curva de 24 h é ilustrativa e o selo fica preso a ela. Painel: texto do passo + livro-caixa que acumula.
 */
const STAGE_W = 680;
const ACCENT = [C.glucose, C.glucoseSoft, C.stone, C.ok] as const;

export default function CgmSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <MedirShell tabs={STEPS.map(t => t.tab)} step={step} setStep={setStep} layoutId="ato10-cgm-tabs"
            chips={<><DesignChip>{s.design}</DesignChip>{step >= 1 && <IllustrativeChip>curva de 24 h: ilustrativa</IllustrativeChip>}</>}
            stageWidth={STAGE_W} stage={<div className="h-full p-2"><CgmChain step={step} /></div>} accent={ACCENT[step]} headline={s.headline} text={s.text}
            ledger={<MedirLedger rows={LEDGER} step={step} termWidth={120} />}
            sources={sourcesUpTo(STEPS.map(t => t.sources), step)} />
    );
}
