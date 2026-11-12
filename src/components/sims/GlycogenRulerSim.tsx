import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Panel } from './kit/ui';
import { CalcChip, DesignChip, ViaReviewChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { InfoPanel, ShellA } from './ato4/shellA';
import { RulerTrack } from './ato4/RulerTrack';
import { MODIFIERS, RULER_STEPS } from './ato4/ruler.content';

/**
 * Slide 63 · a régua do glicogênio, refeita como instrumento de leitura de biópsia: à esquerda, três réguas que se
 * empilham (1967 úmido → hoje seco → corpo todo em gramas), com os marcadores deslizando do normal; à direita, o
 * texto do passo e o livro-caixa "o que move o glicogênio" (Areta 2018), com o tamanho do efeito de cada fator.
 */

const Modifiers = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const rows = MODIFIERS.filter(r => r.at <= step);
    if (!rows.length) return null;
    return (
        <table className="w-full border-separate border-spacing-0 text-left text-[16px]">
            <thead>
                <tr className="text-[15px] text-gray-300">
                    <th className="pb-1 font-normal">mmol/kg seco</th>
                    <th className="pb-1 text-right font-normal">efeito</th>
                    <th className="pb-1 text-right font-normal">tamanho (Areta)</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((r, i) => (
                    <motion.tr key={r.factor} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, delay: r.at === step && !reduce ? stagger(i, 0.4, 0.1) : 0, ease: EASE_OUT }}>
                        <td className="py-0.5 font-semibold" style={{ color: r.color }}>{r.factor}</td>
                        <td className="py-0.5 text-right font-semibold tabular-nums text-white">{r.effect}</td>
                        <td className="py-0.5 text-right text-gray-200">{r.size}</td>
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
                <DesignChip>{step >= 1 ? 'Areta 2018 · 181 estudos' : 'Bergström 1967 · n = 9'}</DesignChip>
                <CalcChip>204: cálculo</CalcChip>
                {step === 4 && <ViaReviewChip>gramas: revisão</ViaReviewChip>}
            </>}>
            <Panel className="shrink-0"><RulerTrack step={step} /></Panel>
            <InfoPanel step={step} color={s.color} headline={s.headline} text={s.text}
                source={sourcesUpTo(RULER_STEPS.map(r => r.sources), step)}>
                <Modifiers step={step} />
            </InfoPanel>
        </ShellA>
    );
}
