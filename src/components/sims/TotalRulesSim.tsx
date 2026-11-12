import { motion, useReducedMotion } from 'framer-motion';
import { CupSoda, LayoutGrid, Rows3, Sandwich, Utensils, Wine, type LucideIcon } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Source } from './kit/ui';
import { CountUp } from './kit/CountUp';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { HeadRow, Phrase, Swatch } from './ato7/parts';
import { ALC_TILES, CHO_TILES, RULES, SOURCE, type Layout, type RowIcon, type RowSpec } from './ato7/totalRules.content';

/**
 * Slide 123 · 24 horas: o total manda.
 * Dois "pratos do dia" feitos de blocos de carboidrato. A cada regra os blocos se reagrupam (refeições × lanches),
 * mudam de tom (IG) ou são empurrados para fora pelo álcool; o número da direita diz se o glicogênio mudou.
 */
const TILE = 26;
const SLOT = 30;
const TRACK_W = 640;
const MEAL_GAP = 26;
const ICONS: Record<RowIcon, LucideIcon> = { solid: Sandwich, liquid: CupSoda, meals: LayoutGrid, snacks: Rows3, plate: Utensils, wine: Wine };

const xOf = (i: number, layout: Layout): number => {
    if (layout === 'meals') return Math.floor(i / 4) * (4 * SLOT + MEAL_GAP) + (i % 4) * SLOT;
    if (layout === 'snacks') return (i * (TRACK_W - TILE)) / (CHO_TILES - 1);
    return i * SLOT;
};

/** Os blocos de álcool: no lugar dos 5 últimos de carboidrato, ou depois deles. */
const alcoholSlot = (k: number, mode: RowSpec['alcohol']) => (mode === 'add' ? CHO_TILES + k : CHO_TILES - ALC_TILES + k);

const Plate = ({ row }: { row: RowSpec }) => {
    const reduce = useReducedMotion();
    const move = { duration: reduce ? 0 : DUR.morph, ease: EASE_IN_OUT };
    const alcohol = row.alcohol ?? 'none';
    return (
        <div className="relative h-14" style={{ width: TRACK_W }}>
            {Array.from({ length: CHO_TILES }, (_, i) => {
                const pushed = alcohol === 'replace' && i >= CHO_TILES - ALC_TILES;
                return (
                    <motion.div key={i} className="absolute left-0 top-0 h-14 overflow-hidden rounded-md" style={{ width: TILE, background: C.glucose }}
                        animate={{ x: xOf(i, row.layout), y: pushed ? 34 : 0, opacity: pushed ? 0 : 1 }}
                        transition={{ ...move, delay: reduce ? 0 : (pushed ? 0.25 : 0) + Math.min(i * 0.015, 0.2) }}>
                        <motion.span className="absolute inset-0" style={{ background: C.glucoseDeep }}
                            animate={{ opacity: row.lowGi ? 1 : 0 }} transition={{ duration: DUR.enter }} />
                    </motion.div>
                );
            })}
            {Array.from({ length: ALC_TILES }, (_, k) => (
                <motion.div key={`a${k}`} className="absolute left-0 top-0 h-14 rounded-md" style={{ width: TILE, background: C.stone }}
                    initial={false}
                    animate={{ x: xOf(alcoholSlot(k, alcohol), 'packed'), y: alcohol === 'none' ? -30 : 0, opacity: alcohol === 'none' ? 0 : 1 }}
                    transition={{ ...move, delay: reduce || alcohol === 'none' ? 0 : 0.1 + k * 0.05 }} />
            ))}
        </div>
    );
};

const Row = ({ row, strong }: { row: RowSpec; strong: boolean }) => {
    const Icon = ICONS[row.icon];
    return (
        <div className="flex items-center gap-6">
            <div className="flex w-[210px] items-center gap-3">
                <Icon size={30} strokeWidth={2.25} color={C.text} aria-hidden />
                <span className="text-[24px] font-semibold leading-tight text-white">{row.label}</span>
            </div>
            <Plate row={row} />
            <CountUp text={row.value} duration={0.6} className="w-[150px] text-right font-display text-[52px] font-bold leading-none"
                style={{ color: strong ? C.glycogenSoft : C.text }} />
        </div>
    );
};

export default function TotalRulesSim() {
    const { step } = useSlideSteps(RULES.length);
    const rule = RULES[step];
    const alcohol = rule.b.alcohol !== undefined;
    return (
        <div className="not-prose flex flex-col gap-4">
            <HeadRow chips={<><DesignChip>{rule.design}</DesignChip>{alcohol && <IllustrativeChip />}</>}>
                <Phrase beat={step} width={800}>{rule.phrase}</Phrase>
            </HeadRow>

            <div className="flex items-center justify-between gap-6 pt-2">
                <div className="flex items-center gap-6 pl-[234px]">
                    <Swatch color={C.glucose}>carboidrato</Swatch>
                    {step === 2 && <Swatch color={C.glucoseDeep}>baixo IG</Swatch>}
                    {alcohol && <Swatch color={C.stone}>álcool</Swatch>}
                </div>
                <motion.span key={rule.measure} className="text-right text-[18px] text-gray-300"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.text }}>
                    {rule.measure}
                </motion.span>
            </div>

            <div className="flex flex-col gap-5">
                <Row row={rule.a} strong={rule.differs} />
                <Row row={rule.b} strong={false} />
            </div>

            <div className="flex items-center gap-4 pl-[234px] pt-1">
                <motion.span key={rule.verdict} className="rounded-xl border-[3px] px-4 py-1.5 font-display text-[28px] font-semibold"
                    style={{ borderColor: rule.differs ? C.glycogenSoft : C.stone, color: rule.differs ? C.glycogenSoft : C.stone }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: DUR.enter, ease: EASE_OUT }}>
                    {rule.verdict}
                </motion.span>
            </div>
            <div className="pt-2"><Source>{SOURCE}</Source></div>
        </div>
    );
}
