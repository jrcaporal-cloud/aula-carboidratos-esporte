import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Panel } from './kit/ui';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { InfoPanel, ShellA } from './ato4/shellA';
import { RulerTrack } from './ato4/RulerTrack';
import { RULER_ROWS, RULER_STEPS } from './ato4/ruler.content';

/**
 * Slide 63 · Quanto é "normal". Uma régua só (Areta & Hopkins 2018, mmol/kg de músculo seco): o normal fica como
 * referência e cada passo leva o marcador a um novo estado (carga → depleção → treino), que fica. À direita, o texto
 * do passo e o livro-caixa do estoque em repouso, com o tamanho do efeito pelos limiares de Areta.
 */

const Rows = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <table className="w-full border-separate border-spacing-0 text-left text-[16px]">
            <thead>
                <tr className="text-[15px] text-gray-300">
                    <th className="pb-1 font-normal">em repouso · mmol/kg seco</th>
                    <th className="pb-1 text-right font-normal">valor</th>
                    <th className="pb-1 text-right font-normal">tamanho</th>
                </tr>
            </thead>
            <tbody>
                {RULER_ROWS.filter(r => r.at <= step).map((r, i) => (
                    <motion.tr key={r.factor} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, delay: r.at === step && !reduce ? stagger(i, 0.4, 0.1) : 0, ease: EASE_OUT }}>
                        <td className="py-0.5 font-semibold" style={{ color: r.color }}>{r.factor}</td>
                        <td className="whitespace-nowrap py-0.5 text-right font-semibold tabular-nums text-white">{r.effect}</td>
                        <td className="whitespace-nowrap py-0.5 pl-2 text-right text-gray-200">{r.size}</td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
    );
};

export default function GlycogenRulerSim() {
    const { step, setStep } = useSlideSteps(RULER_STEPS.length);
    const s = RULER_STEPS[step];
    return (
        <ShellA tabs={RULER_STEPS.map(r => r.tab)} step={step} onSelect={setStep} layoutId="ruler-tabs"
            chips={<>
                <DesignChip>{s.design}</DesignChip>
                {step >= 1 && <CalcChip>{step === 1 ? '564' : step === 2 ? '564 · 209' : '564 · 209 · 529'}: normal + efeito (cálculo)</CalcChip>}
            </>}>
            <Panel className="shrink-0"><RulerTrack step={step} /></Panel>
            <InfoPanel step={step} color={s.color} headline={s.headline} text={s.text}
                source={sourcesUpTo(RULER_STEPS.map(r => r.sources), step)}>
                <Rows step={step} />
                <span className="text-[15px] leading-snug text-gray-300">tamanho (Areta): 25 pequeno · 75 moderado · 150 grande · 250 muito grande</span>
            </InfoPanel>
        </ShellA>
    );
}
