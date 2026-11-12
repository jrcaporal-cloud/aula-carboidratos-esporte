import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { castOf } from './kit/cast';
import { br } from './kit/format';
import { CalcChip, DesignChip, FictionChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Narration, PanelFoot, PreRaceFrame } from './ato5/PreRaceFrame';
import { MarinaChart, MarinaList } from './ato5/MarinaStage';
import { breakfastTotal, choOf, DAY_FOODS, KG, MARINA_STEPS, PASTA, TARGET_G_PER_KG } from './ato5/marinaPlan.content';

/**
 * Slide 87 · Marina, Três Dias Antes (caso fictício + cálculo com a TACO), palco + painel.
 * Palco: régua em g de CHO com a régua em g/kg ao lado; o prato da véspera (101 g), o contorno da meta (580 g),
 * a pilha do dia de carga alimento por alimento (~578 g) e o café da prova (~100 g), todos na mesma escala.
 * A lista do cardápio é clicável: tirar um alimento baixa a pilha e a conta. Painel: ficha da Marina, texto e conta.
 */
const marina = castOf('marina');
const Icon = marina.icon;

const Profile = () => (
    <div className="flex items-center gap-3">
        <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl border-2" style={{ borderColor: C.stone }}>
            <Icon size={28} color={C.stone} strokeWidth={2.2} aria-hidden />
        </span>
        <div className="flex flex-col leading-tight">
            <span className="font-display text-[26px] font-bold text-white">{marina.name}</span>
            <span className="text-[16px] text-gray-200">{marina.age} anos · {marina.kg} kg · {marina.sport} · muro no km 32</span>
        </div>
    </div>
);

const Conta = ({ step, total }: { step: number; total: number }) => {
    const rows = [
        { at: 0, k: 'véspera', v: `${PASTA.grams} g de macarrão = ${Math.round(choOf(PASTA))} g · ${br(choOf(PASTA) / KG)} g/kg` },
        { at: 1, k: 'meta', v: `${KG} kg × ${TARGET_G_PER_KG} g/kg = ${KG * TARGET_G_PER_KG} g por dia` },
        { at: 2, k: 'cardápio', v: `${Math.round(total)} g · ${br(total / KG)} g/kg` },
        { at: 3, k: 'café', v: `~${Math.round(breakfastTotal())} g · ${br(breakfastTotal() / KG)} g/kg, 3 h antes` },
    ];
    return (
        <table className="w-full border-separate border-spacing-y-0.5 text-left">
            <tbody>
                {rows.filter(r => r.at <= step).map((r, i) => (
                    <motion.tr key={r.k} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.4, 0.08) : 0, ease: EASE_OUT }}>
                        <td className="w-[84px] text-[16px] font-semibold" style={{ color: C.glucoseSoft }}>{r.k}</td>
                        <td className="text-[16px] tabular-nums text-gray-100">{r.v}</td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
    );
};

export default function MarinaPlanSim() {
    const { step, setStep } = useSlideSteps(MARINA_STEPS.length);
    const [off, setOff] = useState<readonly string[]>([]);
    const toggle = (name: string) => setOff(prev => (prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]));
    const total = DAY_FOODS.filter(f => !off.includes(f.name)).reduce((sum, f) => sum + choOf(f), 0);
    const s = MARINA_STEPS[step];
    return (
        <PreRaceFrame tabs={MARINA_STEPS.map(m => m.tab)} step={step} setStep={setStep} layoutId="marina-tabs" stageWidth={664}
            chips={<>
                {s.chips.map(c => <DesignChip key={c}>{c}</DesignChip>)}
                <FictionChip />
                <CalcChip>gramas: cálculo TACO</CalcChip>
            </>}
            stage={
                <div className="flex h-full gap-3 px-3 py-2">
                    <MarinaChart step={step} off={off} />
                    <MarinaList step={step} off={off} total={total} onToggle={toggle} />
                </div>
            }
            panel={<>
                <Profile />
                <Narration step={step} headline={s.headline} color={s.color} text={s.text} limit={s.limit} />
                <PanelFoot sources={sourcesUpTo(MARINA_STEPS.map(m => m.sources), step)}>
                    <Conta step={step} total={total} />
                </PanelFoot>
            </>} />
    );
}
