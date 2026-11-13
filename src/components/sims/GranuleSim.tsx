import { useSlideSteps } from '../../store/useSlideSteps';
import { CalcChip, IllustrativeChip } from './kit/chips';
import { C } from './kit/palette';
import { sourcesUpTo } from './kit/sources';
import { Model3DHint } from './kit/Model3DHint';
import { Accrue, MolFrame, StepText } from './ato2/moleculaA.ui';
import { GR_W, GranuleStage } from './ato2/granuleArt';
import { STEPS } from './ato2/granule.content';

/**
 * Slide 22 · A Árvore de Glicose. Palco: a cadeia de construção em 4 quadros numerados (glicogenina → ramos →
 * até 12 camadas → a casca com metade da glicose). Painel: texto do passo, livro-caixa que acumula um elo por passo
 * e, no último, a nota curta da microscopia (o grânulo real é menor que o teto do modelo).
 */
interface FichaRow { at: number; label: string; value: string; color: string }

const FICHA: readonly FichaRow[] = [
    { at: 0, label: '1 · primer da glicogenina', value: '10–20 glicoses', color: C.proteinSoft },
    { at: 1, label: '2 · cada cadeia', value: '~13 glicoses · 2 ramos', color: C.glycogenSoft },
    { at: 2, label: '3 · teto do modelo', value: '12 camadas · ~44 nm', color: C.glycogenSoft },
    { at: 3, label: '4 · camada externa', value: '50% da glicose', color: C.glucoseSoft },
];

const Ficha = ({ step }: { step: number }) => (
    <div className="flex flex-col">
        {FICHA.filter(r => r.at <= step).map(r => (
            <Accrue key={r.label} at={r.at} step={step} delay={0.5}
                className="flex items-baseline justify-between gap-3 border-b-2 border-white/10 py-0.5">
                <span className="text-[16px] text-gray-200">{r.label}</span>
                <span className="text-right text-[18px] font-bold tabular-nums" style={{ color: r.color }}>{r.value}</span>
            </Accrue>
        ))}
    </div>
);

const LAST = STEPS.length - 1;

export default function GranuleSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <MolFrame tabs={STEPS.map(x => x.tab)} step={step} setStep={setStep} layoutId="granule-tabs" stageWidth={GR_W}
            stage={<GranuleStage step={step} />}
            chips={<>
                <IllustrativeChip>modelo estilizado</IllustrativeChip>
                {step === LAST && <CalcChip>% por camada: cálculo do modelo</CalcChip>}
            </>}
            footer={<Model3DHint label="grânulo em 3D" />}
            source={sourcesUpTo(STEPS.map(x => x.sources), step)}>
            <StepText step={step} color={s.color} headline={s.headline} text={s.text} />
            <Ficha step={step} />
            {step === LAST && (
                <Accrue at={LAST} step={step} delay={0.9}>
                    <p className="m-0 text-[16px] leading-snug text-gray-300">
                        <b className="text-gray-200">Nota:</b> no músculo real (microscopia eletrônica, 11 homens em repouso), o grânulo
                        tem ~25 nm em média (~7 camadas), de 10 a 44 nm. O modelo é um teto teórico.
                    </p>
                </Accrue>
            )}
        </MolFrame>
    );
}
