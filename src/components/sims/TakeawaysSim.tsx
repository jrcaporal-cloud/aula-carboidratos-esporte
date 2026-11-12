import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { CountUp } from './kit/CountUp';
import { Chip, StepTabs } from './kit/ui';
import { SIM_H } from './ato10/units';
import { TAKEAWAY_TABS, TAKEAWAYS, type Takeaway } from './ato10/takeaways.content';

/**
 * Slide 191 · O Que Levar para a Segunda-feira. O quadro que o aluno fotografa: 3 colunas × 2 mensagens.
 * Cada passo enche uma coluna (o combustível, o prato, a leitura); nada some. Cada cartão tem o número com unidade,
 * a mensagem, o que o número é, o que fazer na segunda-feira e o estudo com o slide de origem.
 */

const Tile = ({ t, fresh, order }: { t: Takeaway; fresh: boolean; order: number }) => {
    const reduce = useReducedMotion() ?? false;
    const Icon = t.icon;
    const delay = fresh ? 0.1 + order * 0.18 : 0;
    return (
        <motion.div className="flex min-h-0 flex-col gap-1 rounded-2xl border-2 px-4 py-3" style={{ ...PANEL_BG, borderColor: `${t.color}80` }}
            initial={reduce || !fresh ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: DUR.enter, ease: EASE_OUT }}>
            <div className="flex items-center gap-2.5">
                <Icon size={26} strokeWidth={2.4} color={t.color} className="shrink-0" aria-hidden />
                <CountUp text={t.number} delay={delay + 0.1} run={fresh} className="whitespace-nowrap font-display text-[28px] font-bold leading-none" style={{ color: t.color }} />
            </div>
            <span className="text-[20px] font-semibold leading-tight text-white">{t.message}</span>
            <span className="text-[16px] leading-snug text-gray-300">{t.what}</span>
            <span className="text-[16px] leading-snug text-gray-100"><b style={{ color: C.glucoseSoft }}>Na segunda: </b>{t.action}</span>
            <span className="mt-auto text-[14px] leading-snug text-gray-300">{t.source} · slide «{t.origin}»</span>
        </motion.div>
    );
};

const Slot = () => <div className="rounded-2xl border-2 border-dashed border-slate-700" />;

export default function TakeawaysSim() {
    const { step, setStep } = useSlideSteps(TAKEAWAY_TABS.length);
    return (
        <div className="not-prose flex w-full flex-col gap-3" style={{ height: SIM_H }}>
            <div className="flex min-h-[44px] items-center justify-between gap-4">
                <StepTabs labels={TAKEAWAY_TABS} step={step} onSelect={setStep} layoutId="takeaway-tabs" />
                <Chip>números já vistos na aula</Chip>
            </div>
            <div className="grid min-h-0 flex-1 grid-flow-col grid-cols-3 grid-rows-2 gap-3">
                {TAKEAWAYS.map((t, i) => (t.at <= step
                    ? <Tile key={t.origin} t={t} fresh={t.at === step} order={i % 2} />
                    : <Slot key={t.origin} />))}
            </div>
        </div>
    );
}
