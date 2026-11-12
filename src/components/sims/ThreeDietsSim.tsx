import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { InfoPanel, ShellA } from './ato4/shellA';
import { DietChart, LimitStamps } from './ato4/DietChart';
import { DIET_STEPS, DIETS, OUT_OF_ORDER } from './ato4/threeDiets.content';

/**
 * Slide 62 · Bergström 1967, o estudo-âncora do ato, como caderno de laboratório: à esquerda o protocolo e o
 * gráfico que se monta (glicogênio → cronômetros → reta → os 3 fora da ordem → limitações carimbadas, sem apagar
 * a dispersão); à direita o texto do passo e a Tabela III, com o resumo (59/126/189) riscado.
 */

const cell = 'py-0.5 text-right tabular-nums';

const Table = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const timed = step >= 1;
    const enter = (on: boolean) => ({ initial: false as const, animate: { opacity: on ? 1 : 0 }, transition: { duration: reduce ? 0 : DUR.enter, ease: EASE_OUT } });
    return (
        <table className="w-full border-separate border-spacing-0 text-left text-[17px]">
            <thead>
                <tr className="text-[15px] text-gray-300">
                    <th className="pb-1 font-normal">Tabela III · n = 9</th>
                    <th className="pb-1 text-right font-normal">g/100 g</th>
                    <motion.th className="pb-1 text-right font-normal" {...enter(timed)}>min</motion.th>
                    <motion.th className="pb-1 text-right font-normal" {...enter(timed)}>resumo</motion.th>
                </tr>
            </thead>
            <tbody>
                {DIETS.map(d => (
                    <tr key={d.name} className="font-semibold">
                        <td className="py-0.5" style={{ color: d.soft }}>{d.name}</td>
                        <td className={cell} style={{ color: d.soft }}>{d.glycogen.toFixed(2).replace('.', ',')}</td>
                        <motion.td className={`${cell} text-white`} {...enter(timed)}>{d.minutes}</motion.td>
                        <motion.td className={`${cell} font-normal text-gray-400 line-through decoration-2`} {...enter(timed)}>{d.abstract}</motion.td>
                    </tr>
                ))}
                <motion.tr className="font-semibold" style={{ color: C.glucoseSoft }} {...enter(step >= 3)}>
                    <td className="py-0.5">3 sem esvaziar</td>
                    <td className={cell}>{`${OUT_OF_ORDER.gly[0].toFixed(2)}–${OUT_OF_ORDER.gly[1].toFixed(2)}`.replace(/\./g, ',')}</td>
                    <td className={cell}>{`${OUT_OF_ORDER.min[0]}–${OUT_OF_ORDER.min[1]}`}</td>
                    <td className={cell} />
                </motion.tr>
            </tbody>
        </table>
    );
};

export default function ThreeDietsSim() {
    const { step, setStep } = useSlideSteps(DIET_STEPS.length);
    const s = DIET_STEPS[step];
    return (
        <ShellA tabs={DIET_STEPS.map(d => d.tab)} step={step} onSelect={setStep} layoutId="three-diets-tabs"
            chips={<>
                <DesignChip>cruzado · n = 9 · não cego</DesignChip>
                {step >= 1 && <CalcChip>≈ 3×: cálculo (167 ÷ 57)</CalcChip>}
            </>}>
            <Panel className="relative shrink-0">
                <DietChart step={step} />
                <LimitStamps show={step >= 4} />
            </Panel>
            <InfoPanel step={step} color={s.color} headline={s.headline} text={s.text}
                source={sourcesUpTo(DIET_STEPS.map(d => d.sources), step)}>
                <Table step={step} />
            </InfoPanel>
        </ShellA>
    );
}
