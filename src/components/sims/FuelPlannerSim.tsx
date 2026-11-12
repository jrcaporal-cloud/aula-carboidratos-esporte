import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Grow } from './kit/Beat';
import { Tank } from './kit/Tank';
import { CalcChip, IllustrativeChip } from './kit/chips';
import { Appear, Foot, Frame, Headline } from './ato8/parts';
import {
    KIND, NEXT_KIND, PLANNER_BEATS, PLANNER_SOURCE, PRESETS, RULER, WEEK, type SessionKind,
} from './ato8/planner.content';

/**
 * Slide 143 · Combustível para o trabalho. Quadro da semana: cada coluna é um dia (sessão, glicogênio ao começar, CHO do dia).
 * O passador conta a história (prato igual → chave alto → leves selecionadas baixas → mão do professor);
 * o clique numa sessão troca o tipo (leve → chave → com pouco) e o tanque e a barra do dia acompanham.
 */

const CARD: Record<SessionKind, { bg: string; fg: string; border: string }> = {
    neutral: { bg: 'rgba(255,255,255,0.06)', fg: C.text, border: 'rgba(255,255,255,0.18)' },
    leve: { bg: 'rgba(255,255,255,0.06)', fg: C.text, border: 'rgba(255,255,255,0.32)' },
    chave: { bg: C.glucose, fg: '#04080F', border: C.glucose },
    low: { bg: '#04080F', fg: C.caveat, border: C.caveat },
};

interface Picks { step: number; map: Readonly<Record<number, SessionKind>> }

const DayColumn = ({ i, kind, onPick }: { i: number; kind: SessionKind; onPick: (i: number) => void }) => {
    const look = KIND[kind];
    const card = CARD[kind];
    return (
        <div className="flex w-[124px] flex-col items-center gap-3">
            <span className="text-[20px] font-semibold text-gray-200">{WEEK[i].day}</span>
            <button type="button" onClick={() => onPick(i)} aria-label={`${WEEK[i].day}: ${WEEK[i].session}, ${look.tag}`}
                className="flex h-[78px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-[3px] transition-[transform,background-color,color,border-color] duration-200 active:scale-[0.97]"
                style={{ background: card.bg, color: card.fg, borderColor: card.border }}>
                <span className="text-[20px] font-bold leading-tight">{WEEK[i].session}</span>
                <span className="text-[16px] font-semibold leading-tight opacity-90">{look.tag}</span>
            </button>
            <Tank level={look.glycogen} width={44} height={84} active={kind === 'chave'} />
            <div className="relative h-[96px] w-[54px] overflow-hidden rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Grow value={look.cho} axis="y" color={C.glucose} />
            </div>
        </div>
    );
};

export default function FuelPlannerSim() {
    const { step } = useSlideSteps(PLANNER_BEATS.length);
    const [picks, setPicks] = useState<Picks>({ step: -1, map: {} });
    // Os cliques valem só no passo em que foram feitos: o passador sempre volta à história.
    const kindOf = (i: number): SessionKind => (picks.step === step ? picks.map[i] : undefined) ?? PRESETS[step][i];
    const pick = (i: number) => {
        const current = kindOf(i);
        const base = picks.step === step ? picks.map : {};
        setPicks({ step, map: { ...base, [i]: NEXT_KIND[current] } });
    };
    const lowCount = WEEK.filter((_, i) => kindOf(i) === 'low').length;

    return (
        <Frame>
            <Headline beat={step} chips={<><IllustrativeChip /><CalcChip>régua: cálculo (Areta 2018)</CalcChip></>} size={28}>{PLANNER_BEATS[step]}</Headline>
            <div className="mt-4 flex gap-5">
                {/* legenda das linhas */}
                <div className="flex w-[150px] shrink-0 flex-col pt-[42px] text-[17px] leading-snug text-gray-300">
                    <span className="flex h-[78px] items-center">sessão</span>
                    <div className="mt-3 flex h-[84px] flex-col justify-center">
                        <span>glicogênio ao começar</span>
                        <Appear show={step >= 1} className="text-[16px] text-gray-400">{RULER.filter(r => r.label !== 'normal').map(r => `${r.label} ${r.value}`).join(' · ')}</Appear>
                    </div>
                    <span className="mt-3 flex h-[96px] items-center">CHO do dia</span>
                </div>
                <div className="flex gap-[10px]">
                    {WEEK.map((d, i) => <DayColumn key={d.day} i={i} kind={kindOf(i)} onPick={pick} />)}
                </div>
            </div>
            <Appear show={step >= 3} className="mt-3 ml-[170px] text-[20px] text-gray-100">
                sessões com pouco: <span className="font-bold tabular-nums" style={{ color: C.caveat }}>{lowCount} de 7</span>
            </Appear>
            <Foot source={PLANNER_SOURCE} />
        </Frame>
    );
}
