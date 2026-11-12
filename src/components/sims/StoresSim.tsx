import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { CalcChip, DesignChip } from './kit/chips';
import { KeyFact } from './kit/rhythm';
import { C } from './kit/palette';
import { sourcesUpTo } from './kit/sources';
import { Accrue, MolFrame, StepText } from './ato2/moleculaA.ui';
import { LEDGER, STEPS, STORES, type Store, type StoreId } from './ato2/stores.content';

/**
 * Slide 24 · Quanto Cabe no Corpo. Palco: quadrados com área ∝ massa sobre um chão; a cada clique a câmera
 * se afasta (escala) e entra um estoque maior (sangue → fígado → músculo → gordura, só para escala).
 * Painel: livro-caixa em gramas e kcal que acumula, e o ~40× no fim. Só transform e opacidade.
 */
const STAGE_W = 640;
const GROUND = 64; // distância do chão até a base do palco (px)
const LEFT = 40;
const GAP = 30;
const SLOTS: readonly StoreId[] = ['blood', 'liver', 'muscle', 'fat'];

const side = (grams: number, k: number) => Math.sqrt(grams) * k;
const slotGrams = (id: StoreId) => (id === 'muscle' ? 500 : STORES.find(s => s.id === id)!.grams);

/** x de cada vaga no passo (os quadrados seguem lado a lado, com vão fixo em px). */
const slotX = (step: number): Record<StoreId, number> => {
    const k = STEPS[step].k;
    const out = {} as Record<StoreId, number>;
    let x = LEFT;
    SLOTS.forEach(id => {
        out[id] = x;
        x += side(slotGrams(id), k) + GAP;
    });
    return { ...out, muscleMax: out.muscle };
};

const NAMES: Record<Exclude<StoreId, 'muscleMax'>, { name: string; grams: string }> = {
    blood: { name: 'sangue', grams: '4 g' },
    liver: { name: 'fígado', grams: '~100 g' },
    muscle: { name: 'músculo', grams: '~400–500 g' },
    fat: { name: 'gordura', grams: '10,5 kg' },
};

const Square = ({ s, step, x, reduce }: { s: Store; step: number; x: number; reduce: boolean }) => {
    const on = step >= s.from;
    const base = Math.sqrt(s.grams);
    return (
        <motion.div className="absolute left-0" aria-hidden
            style={{ bottom: GROUND, width: base, height: base, background: s.color, transformOrigin: 'left bottom' }}
            initial={false}
            animate={{ x: Math.min(x, STAGE_W - 40), scale: on ? STEPS[step].k : 0.02, opacity: on ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: EASE_IN_OUT, opacity: { duration: DUR.enter, delay: on && step === s.from ? 0.45 : 0 } }} />
    );
};

const Label = ({ id, step, x }: { id: Exclude<StoreId, 'muscleMax'>; step: number; x: number }) => {
    const k = STEPS[step].k;
    const w = side(slotGrams(id), k);
    const store = STORES.find(s => s.id === id)!;
    const small = step === 3 && id !== 'fat';
    const on = step >= store.from && !small;
    const top = 456 - GROUND - w;
    return (
        <>
            <motion.span className="absolute left-0 whitespace-nowrap text-center text-[18px] font-semibold text-gray-100"
                style={{ top: 456 - GROUND + 8, width: 160, marginLeft: -80 }} initial={false}
                animate={{ x: Math.min(x + w / 2, STAGE_W - 100), opacity: on ? 1 : 0 }} transition={{ duration: 0.9, ease: EASE_IN_OUT, opacity: { duration: DUR.text } }}>
                {NAMES[id].name}
            </motion.span>
            <motion.span className="absolute left-0 whitespace-nowrap text-center font-display text-[22px] font-bold"
                style={{ top: 0, width: 200, marginLeft: -100, color: id === 'fat' ? C.fat : id === 'blood' ? C.glucoseSoft : C.glycogenSoft }}
                initial={false} animate={{ x: Math.min(x + w / 2, STAGE_W - 100), y: Math.max(top - 34, 6), opacity: on ? 1 : 0 }}
                transition={{ duration: 0.9, ease: EASE_IN_OUT, opacity: { duration: DUR.text, delay: on ? 0.5 : 0 } }}>
                {NAMES[id].grams}
            </motion.span>
        </>
    );
};

const Stage = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const xs = slotX(step);
    return (
        <div className="relative h-full overflow-hidden" style={{ width: STAGE_W }}>
            <div className="absolute inset-x-4 h-[3px] bg-slate-500" style={{ bottom: GROUND - 3 }} aria-hidden />
            {STORES.map(s => <Square key={s.id} s={s} step={step} x={xs[s.id]} reduce={reduce} />)}
            {(['blood', 'liver', 'muscle', 'fat'] as const).map(id => <Label key={id} id={id} step={step} x={xs[id]} />)}
            <motion.span className="absolute left-[24px] text-[18px] font-semibold text-gray-100" style={{ top: 456 - GROUND + 8 }}
                initial={false} animate={{ opacity: step === 3 ? 1 : 0 }} transition={{ duration: DUR.text, delay: step === 3 ? 0.6 : 0 }}>
                carboidrato
            </motion.span>
            <motion.span className="absolute left-4 top-3 text-[16px] text-gray-300" initial={false}
                animate={{ opacity: step === 2 ? 1 : 0 }} transition={{ duration: DUR.text, delay: step === 2 ? 0.6 : 0 }}>
                claro = 500 g · escuro = 400 g
            </motion.span>
            <motion.span className="absolute left-[230px] text-[20px] font-semibold text-amber-200" style={{ top: 456 - GROUND - 96 }}
                initial={false} animate={{ opacity: step === 0 ? 1 : 0 }} transition={{ duration: DUR.text, delay: step === 0 ? 0.6 : 0 }}>
                ≈ 1 colher de chá, no sangue inteiro
            </motion.span>
            <span className="absolute bottom-3 right-4 text-[16px] text-gray-300">área ∝ {step === 3 ? 'energia' : 'massa'}</span>
        </div>
    );
};

const Ledger = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-0 text-left">
        <thead>
            <tr className="text-[15px] text-gray-300">
                <th className="pb-1 font-normal">estoque (70 kg)</th>
                <th className="pb-1 text-right font-normal">massa</th>
                <th className="pb-1 text-right font-normal">kcal</th>
            </tr>
        </thead>
        <tbody>
            {LEDGER.filter(r => r.at <= step).map((r, i) => (
                <motion.tr key={r.label} initial={r.at === step ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.enter, delay: r.at === step ? 0.55 + i * 0.06 : 0, ease: EASE_OUT }}
                    className={r.total ? 'text-[17px] font-bold' : 'text-[16px]'}
                    style={{ color: r.total === 'fat' ? C.fat : r.total === 'cho' ? C.glucoseSoft : '#F3F4F6' }}>
                    <td className="py-0.5">{r.label}</td>
                    <td className="py-0.5 pl-3 text-right tabular-nums">{r.grams}</td>
                    <td className="py-0.5 pl-3 text-right tabular-nums">{r.kcal}</td>
                </motion.tr>
            ))}
        </tbody>
    </table>
);

export default function StoresSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <MolFrame tabs={STEPS.map(x => x.tab)} step={step} setStep={setStep} layoutId="stores-tabs" stageWidth={STAGE_W}
            stage={<Stage step={step} />}
            chips={<>
                <DesignChip>revisões · pessoa de 70 kg</DesignChip>
                {step === 3 && <CalcChip>kcal: 4 e 9 kcal/g; 70 kg, 15% de gordura</CalcChip>}
            </>}
            source={sourcesUpTo(STEPS.map(x => x.sources), step)}>
            <StepText step={step} color={s.color} headline={s.headline} text={s.text} />
            <Ledger step={step} />
            {step === 3 && (
                <Accrue at={3} step={step} delay={0.8} className="flex items-baseline gap-3">
                    <KeyFact color={C.fat} delay={0.9}>
                        <span className="font-display text-[48px] font-bold leading-none" style={{ color: C.fat }}>~40×</span>
                    </KeyFact>
                    <span className="text-[17px] leading-snug text-gray-100">mais energia na gordura do que em todo o carboidrato</span>
                </Accrue>
            )}
        </MolFrame>
    );
}
