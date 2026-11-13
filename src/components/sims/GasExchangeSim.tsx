import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Wipe } from './kit/Beat';
import { DesignChip, ViaReviewChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { MedirLedger, MedirShell } from './ato10/MedirShell';
import { Equations, GasCircuit, RerGauge, Stoichiometry } from './ato10/GasParts';
import { IsotopeScene } from './ato10/GasIsotope';
import { LEDGER, STEPS } from './ato10/gas.content';

/**
 * Slide 184 · Calorimetria e Isótopos (palco + painel). O palco se monta em camadas que ficam: o circuito do gás (O₂ entra,
 * CO₂ sai, em laço lento), a estequiometria que dá o RER, as equações em g/min com um exemplo calculado, o mostrador do RER
 * (no passo do limiar ganha a agulha do tiro, além de 1,0). No último passo o palco VIRA a cadeia do ¹³C (milho → bebida
 * → músculo → ar) com as barras de Saris 1993; RER, equação e limiar ficam num resumo compacto no alto (ato10/GasIsotope).
 */
const STAGE_W = 680;
const ACCENT = [C.glucose, C.glucoseSoft, C.stone, C.risk, C.glucose] as const;

export default function GasExchangeSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const chips = (
        <>
            <DesignChip>{s.design}</DesignChip>
            {step >= 1 && <ViaReviewChip>coeficientes via González-Haro</ViaReviewChip>}
        </>
    );
    const stage = step < 4 ? (
        <div className="flex h-full flex-col gap-2 px-4 py-2">
            <GasCircuit buffer={step >= 3} />
            <div className="grid grid-cols-[1.15fr_1fr] gap-4 border-t-2 border-white/15 pt-2">
                <Stoichiometry />
                <Wipe show={step >= 1} from="left"><Equations error={step >= 2} /></Wipe>
            </div>
            <RerGauge sprint={step >= 3} />
        </div>
    ) : (
        <div className="h-full px-4 py-3"><IsotopeScene /></div>
    );
    return (
        <MedirShell tabs={STEPS.map(t => t.tab)} step={step} setStep={setStep} layoutId="ato10-gas-tabs" chips={chips}
            stageWidth={STAGE_W} stage={stage} accent={ACCENT[step]} headline={s.headline} text={s.text}
            ledger={<MedirLedger rows={LEDGER} step={step} termWidth={104} />}
            sources={sourcesUpTo(STEPS.map(t => t.sources), step)} />
    );
}
