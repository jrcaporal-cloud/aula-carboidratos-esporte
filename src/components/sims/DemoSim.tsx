import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Chip, Panel, StepTabs } from './kit/ui';
import { CountUp } from './kit/CountUp';

/**
 * Simulador de demonstração do motor (será apagado quando o roteiro trouxer os de verdade).
 * Passo 1: a linguagem de cor da aula. Passo 2: um número-chave que conta até o valor.
 */
const SWATCHES = [
    { name: 'glicose', color: C.glucose },
    { name: 'glicogênio', color: C.glycogen },
    { name: 'frutose', color: C.fructose },
    { name: 'gordura', color: C.fat },
    { name: 'lactato', color: C.lactate },
    { name: 'insulina', color: C.insulin },
    { name: 'proteína', color: C.protein },
    { name: 'risco', color: C.risk },
] as const;

const STEPS = ['Linguagem de cor', 'Número-chave'] as const;

const Swatches = () => (
    <div className="grid grid-cols-4 gap-4 p-6">
        {SWATCHES.map((s, i) => (
            <motion.div key={s.name} className="flex items-center gap-3"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stagger(i), duration: 0.3, ease: EASE_OUT }}>
                <span className="h-8 w-8 shrink-0 rounded-lg" style={{ background: s.color }} />
                <span className="text-[20px] text-gray-100">{s.name}</span>
            </motion.div>
        ))}
    </div>
);

const KeyNumber = () => (
    <div className="flex items-center gap-8 p-8">
        <CountUp text="90 g/h" className="font-display text-[88px] font-bold leading-none" style={{ color: C.glucose }} />
        <div className="flex flex-col gap-3">
            <p className="m-0 text-[22px] leading-snug text-gray-100">Exemplo de número-chave animado (contagem até o valor).</p>
            <span className="self-start"><Chip>valor ilustrativo · demonstração do motor</Chip></span>
        </div>
    </div>
);

export default function DemoSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    return (
        <div className="flex flex-col gap-5 not-prose">
            <StepTabs labels={STEPS} step={step} onSelect={setStep} layoutId="demo-tabs" />
            <Panel state="active" glow={C.glucose}>
                {step === 0 ? <Swatches /> : <KeyNumber />}
            </Panel>
        </div>
    );
}
