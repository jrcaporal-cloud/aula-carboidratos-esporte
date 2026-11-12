import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { KeyFact, Reveal } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { CoyleTimeline } from './ato4/twoTanksCoyle';
import { SCENE_W, TwoTanksScene } from './ato4/twoTanksScene';
import { Ledger, PanelFoot, StageLayout, StepText } from './ato4/tankBLayout';
import { GONZALEZ_ROWS, TANK_STEPS } from './ato4/twoTanks.content';

/**
 * Slide 67 · O fígado, o segundo limite, como mapa + livro-caixa. No palco, os dois tanques ligados pelo sangue, com o
 * mostrador da glicemia e a glicose circulando; embaixo, a régua de tempo de Coyle 1986. No painel, o texto do passo,
 * a tabela de Gonzalez 2015 (fígado e músculo medidos) e o ~24 mmol/kg de Rothschild 2026, que é dado real.
 */

const ACCENT = [C.glycogenSoft, C.risk, C.glucoseSoft, C.ok, C.glycogenSoft] as const;

export default function TwoTanksSim() {
    const { step, setStep } = useSlideSteps(TANK_STEPS.length);
    const s = TANK_STEPS[step];
    return (
        <StageLayout tabs={TANK_STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="tanks-tabs" stageWidth={SCENE_W}
            chips={<DesignChip>{s.design}</DesignChip>}
            stage={<>
                <TwoTanksScene s={s} step={step} />
                <CoyleTimeline step={step} />
                <div className="absolute left-1/2 top-[212px] -translate-x-1/2"><IllustrativeChip>nível dos tanques: ilustrativo</IllustrativeChip></div>
            </>}
            panel={<>
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} />
                <PanelFoot source={sourcesUpTo(TANK_STEPS.map(t => t.sources), step)}>
                    {step >= 4 && (
                        <Reveal order={1} className="flex items-center gap-4">
                            <KeyFact color={C.glycogenSoft}>
                                <span className="whitespace-nowrap font-display text-[48px] font-bold leading-none tabular-nums" style={{ color: C.glycogenSoft }}>~24</span>
                            </KeyFact>
                            <span className="text-[16px] leading-snug text-gray-200">mmol/kg ps poupados em ~100 min (IC 4–45) · SMD −0,16 (IC −0,30 a −0,02)</span>
                        </Reveal>
                    )}
                    {step >= 3 && (
                        <Ledger step={step} head={['¹³C-RM, mmol/L', 'fígado', 'músculo']} cols={['42%', '29%', '29%']}
                            rows={GONZALEZ_ROWS.map((r, i) => ({ at: 3, cells: r, color: i === 2 ? C.caveat : undefined }))} />
                    )}
                </PanelFoot>
            </>}
        />
    );
}
