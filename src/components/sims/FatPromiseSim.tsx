import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip, ViaReviewChip } from './kit/chips';
import { KeyFact } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { Panel } from './kit/ui';
import { FatStage } from './ato8/FatStage';
import { StepPanel, TrainLowShell } from './ato8/TrainLowShell';
import { FAT_STEPS } from './ato8/fat.content';

/**
 * Slide 144 · A promessa da gordura. Linha do tempo + painel: o arquivo de 1983 (n = 5, sem controle, um ciclista
 * puxa a média) e, à direita, as colunas do pico de gordura (Volek 2016, Burke 2017, Burke 2021) com o desenho
 * embaixo de cada barra. Nada some: no fim, os quatro estudos lado a lado na régua do tempo.
 */

const ACCENT = [C.text, C.stone, C.fat, C.fat] as const;

const CHIPS = [
    <DesignChip key="p">Phinney: pré-pós sem controle · n = 5</DesignChip>,
    <><DesignChip key="p">Phinney: pré-pós sem controle · n = 5</DesignChip><ViaReviewChip key="v">via revisão (Burke 2021)</ViaReviewChip></>,
    <DesignChip key="v">Volek: transversal · 10 × 10 · sem desempenho</DesignChip>,
    <DesignChip key="b">Burke: paralelo · LCHF n = 10 e n = 7</DesignChip>,
];

export default function FatPromiseSim() {
    const { step, setStep } = useSlideSteps(FAT_STEPS.length);
    const s = FAT_STEPS[step];
    return (
        <TrainLowShell tabs={FAT_STEPS.map(f => f.tab)} step={step} setStep={setStep} layoutId="fat-tabs" chips={CHIPS[step]}>
            <Panel className="w-[700px] shrink-0 px-4 py-3"><FatStage step={step} /></Panel>
            <StepPanel step={step} color={ACCENT[step]} headline={s.headline} text={s.text}
                source={sourcesUpTo(FAT_STEPS.map(f => f.sources), step)} className="flex-1">
                {step >= 2 && (
                    <div className="flex items-end gap-3">
                        <KeyFact color={C.fat} delay={step === 2 ? 0.6 : 0}>
                            <span className="font-display text-[60px] font-bold leading-none" style={{ color: C.fat }}>2,3×</span>
                        </KeyFact>
                        <span className="pb-1 text-[17px] leading-snug text-gray-100">mais gordura no pico, keto × CHO (Volek)</span>
                    </div>
                )}
            </StepPanel>
        </TrainLowShell>
    );
}
