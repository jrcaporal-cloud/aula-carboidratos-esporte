import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { Model3DHint } from './kit/Model3DHint';
import { KeyFact, Reveal } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { FIBER_W, PoolsFiber } from './ato4/poolsFiber';
import { Ledger, PanelFoot, StageLayout, StepText, type LedgerRow } from './ato4/tankBLayout';
import { EXHAUSTED_STEP, POOL_CHIPS, POOL_LEDGER, POOL_NAMES, POOL_ORDER, POOL_STEPS, WATER_STEP } from './ato4/pools.content';

/**
 * Slide 65 · Três endereços na fibra, em palco + painel. À esquerda, a fibra em corte longitudinal (MET desenhada):
 * cada passo acende um endereço do glicogênio e deixa o número dele na margem; depois a exaustão esvazia o
 * intramiofibrilar e a recuperação só com água não o devolve. À direita, o texto do passo e o livro-caixa que acumula.
 * A tecla 3 abre o modelo 3D `fibra-glicogenio`.
 */

const ACCENT = [C.stone, C.glycogenSoft, C.glycogenSoft, C.glycogenSoft, C.risk, C.lactateSoft] as const;

const ledgerRows = (step: number): LedgerRow[] => POOL_ORDER.map((p, i) => ({
    at: i + 1,
    color: p === 'intra' ? C.glycogenSoft : undefined,
    strong: p === 'intra' && step >= EXHAUSTED_STEP,
    cells: [
        `${i + 1} ${POOL_NAMES[p]}`,
        step >= EXHAUSTED_STEP ? POOL_LEDGER[p].exhausted : '',
        step >= WATER_STEP ? POOL_LEDGER[p].water : '',
    ],
}));

export default function GlycogenPoolsSim() {
    const { step, setStep } = useSlideSteps(POOL_STEPS.length);
    const s = POOL_STEPS[step];
    return (
        <StageLayout tabs={POOL_STEPS.map(p => p.tab)} step={step} onSelect={setStep} layoutId="pools-tabs" stageWidth={FIBER_W}
            chips={<>
                <DesignChip>{POOL_CHIPS[step]}</DesignChip>
                <Model3DHint label="a fibra em 3D" />
            </>}
            stage={<>
                <PoolsFiber step={step} />
                <div className="absolute bottom-3 right-3"><IllustrativeChip>nº de grânulos: ilustrativo</IllustrativeChip></div>
            </>}
            panel={<>
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} />
                {step >= 3 && (
                    <Reveal key={step === 3 ? 'k3' : 'k'} order={1} className="flex items-baseline gap-3">
                        <KeyFact color={C.glycogenSoft} delay={step === 3 ? 0.3 : 0}>
                            <span className="whitespace-nowrap font-display text-[40px] font-bold leading-none tabular-nums" style={{ color: C.glycogenSoft }}>10–15%</span>
                        </KeyFact>
                        <span className="text-[17px] leading-snug text-gray-200">do glicogênio total mora dentro da miofibrila</span>
                    </Reveal>
                )}
                <PanelFoot source={sourcesUpTo(POOL_STEPS.map(p => p.sources), step)}>
                    {step >= 1 && (
                        <Ledger step={step} head={['endereço', step >= EXHAUSTED_STEP ? 'na exaustão' : '', step >= WATER_STEP ? 'só água' : '']} cols={['46%', '24%', '30%']} rows={ledgerRows(step)} />
                    )}
                </PanelFoot>
            </>}
        />
    );
}
