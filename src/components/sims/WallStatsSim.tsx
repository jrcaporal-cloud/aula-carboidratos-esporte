import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { castOf } from './kit/cast';
import { DesignChip, FictionChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { WALL_W, WallChart } from './ato4/wallChart';
import { Ledger, PanelFoot, StageLayout, StepText } from './ato4/tankBLayout';
import { WAFFLES, WALL_CHIPS, WALL_LEDGER, WALL_STEPS } from './ato4/wall.content';

/**
 * Slide 68 · O muro em números: gráfico grande + painel. No palco, a volta da Marina (fictícia) vira a curva do muro
 * por morfose, com a zona dos ~10 km lentos; embaixo, a Marina e, a partir do passo 3, os dois quadros de 100
 * corredores (28% × 17%). O selo "caso fictício" da curva fica até o fim. No painel, o texto e o livro-caixa de Smyth.
 */

const ACCENT = [C.stone, C.risk, C.risk, C.stone] as const;

const Marina = () => {
    const m = castOf('marina');
    const Icon = m.icon;
    return (
        <div className="flex w-[250px] shrink-0 flex-col gap-2">
            <div className="flex items-center gap-3">
                <Icon size={34} strokeWidth={2.2} color="#FFFFFF" aria-hidden />
                <span className="font-display text-[30px] font-semibold leading-none text-white">{m.name}</span>
            </div>
            <span className="text-[17px] text-gray-200">{m.age} anos · {m.kg} kg · {m.sport}</span>
            <span className="text-[17px] italic leading-snug text-gray-100">{m.dilemma}</span>
            <span className="flex items-center gap-2 whitespace-nowrap text-[16px] text-gray-300">curva da Marina <FictionChip /></span>
        </div>
    );
};

/** 100 corredores; os que bateram no muro se pintam em sequência (atraso com teto). */
const Waffle = ({ pct, who, show }: { pct: number; who: string; show: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-2">
            <span className="flex items-baseline gap-2">
                <span className="font-display text-[30px] font-bold leading-none tabular-nums" style={{ color: C.risk }}>{pct}%</span>
                <span className="text-[17px] text-gray-200">dos {who}</span>
            </span>
            <div className="grid grid-cols-10 gap-[3px]">
                {Array.from({ length: 100 }, (_, i) => (
                    <motion.span key={i} className="block h-[11px] w-[11px] rounded-[2px]" initial={false}
                        animate={{ backgroundColor: show && i < pct ? C.risk : '#2A3140' }}
                        transition={{ duration: reduce ? 0 : DUR.text, delay: reduce || !show ? 0 : 0.2 + Math.min(i * 0.025, 0.7), ease: EASE_OUT }} />
                ))}
            </div>
        </div>
    );
};

const Stage = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col px-1 pt-2">
        <WallChart step={step} />
        <div className="mt-1 flex items-start gap-6 px-3">
            <Marina />
            <motion.div className="flex gap-8" initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                {WAFFLES.map(w => <Waffle key={w.who} pct={w.pct} who={w.who} show={step >= 2} />)}
            </motion.div>
        </div>
    </div>
);

export default function WallStatsSim() {
    const { step, setStep } = useSlideSteps(WALL_STEPS.length);
    const s = WALL_STEPS[step];
    return (
        <StageLayout tabs={WALL_STEPS.map(w => w.tab)} step={step} onSelect={setStep} layoutId="wall-tabs" stageWidth={WALL_W + 8}
            chips={<DesignChip>{WALL_CHIPS[step]}</DesignChip>}
            stage={<Stage step={step} />}
            panel={<>
                <StepText step={step} color={ACCENT[step]} headline={s.headline} text={s.text} />
                <PanelFoot source={sourcesUpTo(WALL_STEPS.map(w => w.sources), step)}>
                    {step >= 1 && (
                        <div className="flex flex-col gap-1">
                            <Ledger step={step} head={['Smyth 2021', 'homens', 'mulheres']} cols={['46%', '27%', '27%']}
                                rows={WALL_LEDGER.map(r => ({ at: r.at, cells: r.cells, color: r.at === 2 && r.cells[1] === '28%' ? C.risk : undefined }))} />
                            {step >= 2 && <span className="text-[15px] text-gray-300">N = 1.928.813 corredores · mais de 4 milhões de registros</span>}
                        </div>
                    )}
                </PanelFoot>
            </>}
        />
    );
}
