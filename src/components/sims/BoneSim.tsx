import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Beat } from './kit/Beat';
import { DesignChip } from './kit/chips';
import { SvgText } from './kit/ui';
import { useMorphPath, type Pt } from './kit/useMorphPath';
import { Appear, Foot, Frame, Headline } from './ato8/parts';
import { BONE_BEATS, BONE_CARDS, BONE_LINES, BONE_SOURCES, type BoneLine } from './ato8/bone.content';

/**
 * Slide 149 · O osso sente falta. Gráfico de inclinação (dia 0 → dia 6) do P1NP: as três linhas saem planas
 * e se dobram no passo 2 (useMorphPath). Só os extremos são dados; a reta entre eles é só a ligação.
 */

const W = 620;
const H = 340;
const X0 = 70;
const X1 = 400;
/** y do gráfico para P1NP em % do início (100% no alto, 70% embaixo). */
const sy = (p: number) => 50 + (100 - p) * 8.6;

const LinePath = ({ line, bent }: { line: BoneLine; bent: boolean }) => {
    const end = bent ? line.end : 100;
    const pts: Pt[] = [[X0, sy(100)], [(X0 + X1) / 2, sy((100 + end) / 2)], [X1, sy(end)]];
    const ref = useMorphPath(pts, 800);
    return <path ref={ref} fill="none" stroke={line.color} strokeWidth={6} strokeLinecap="round" />;
};

const Chart = ({ bent }: { bent: boolean }) => (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="P1NP do dia 0 ao dia 6 nas três dietas">
        {[100, 90, 80].map(p => (
            <g key={p}>
                <line x1={X0} x2={X1} y1={sy(p)} y2={sy(p)} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
                <SvgText x={X0 - 12} y={sy(p) + 6} text={`${p}%`} anchor="end" size={16} color={C.muted} weight={500} />
            </g>
        ))}
        <SvgText x={X0} y={H - 8} text="dia 0" anchor="middle" size={18} color="#CBD5E1" />
        <SvgText x={X1} y={H - 8} text="dia 6" anchor="middle" size={18} color="#CBD5E1" />
        {BONE_LINES.map(l => <LinePath key={l.id} line={l} bent={bent} />)}
        {BONE_LINES.map((l, i) => (
            <motion.g key={l.id} initial={false} animate={{ opacity: bent ? 1 : 0, x: bent ? 0 : -8 }}
                transition={{ duration: DUR.enter, delay: bent ? stagger(i, 0.6) : 0, ease: EASE_OUT }}>
                <SvgText x={X1 + 18} y={sy(l.end) - 4} text={l.effect} size={20} weight={700} color={l.color} />
                <SvgText x={X1 + 18} y={sy(l.end) + 18} text={l.label} size={16} weight={500} color="#CBD5E1" />
            </motion.g>
        ))}
        {!bent && BONE_LINES.map((l, i) => (
            <SvgText key={l.id} x={X1 + 18} y={sy(100) - 18 + i * 24} text={l.label} size={17} weight={600} color={l.color} />
        ))}
    </svg>
);

const Side = ({ step }: { step: number }) => {
    if (step < 2) {
        return (
            <div className="flex flex-col gap-3 pt-8">
                <span className="text-[18px] text-gray-300">P1NP em jejum</span>
                <span className="text-[22px] leading-snug text-gray-100">Marcador de formação óssea: sobe quando o osso é construído.</span>
                <Appear show={step >= 1} className="text-[22px] leading-snug" style={{ color: C.fat }}>Com LCHF, a queda foi maior que com pouca energia.</Appear>
            </div>
        );
    }
    if (step === 2) {
        return (
            <div className="flex flex-col gap-3 pt-2">
                {BONE_CARDS.map((c, i) => (
                    <motion.div key={c.who} className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.06)' }}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stagger(i, 0.05, 0.15), duration: DUR.enter, ease: EASE_OUT }}>
                        <p className="m-0 text-[20px] font-bold text-white">{c.who}</p>
                        <p className="m-0 text-[19px] leading-snug text-gray-200">{c.text}</p>
                    </motion.div>
                ))}
            </div>
        );
    }
    return (
        <Beat beat="reds" className="flex flex-col gap-4 pt-6">
            <span className="font-display text-[56px] font-bold leading-none text-white">REDs 2023</span>
            <span className="text-[22px] leading-snug text-gray-100">Consenso do COI: a baixa disponibilidade de carboidrato entra no modelo, ao lado da energia.</span>
            <span className="text-[20px] leading-snug text-gray-300">São marcadores, não fraturas.</span>
        </Beat>
    );
};

export default function BoneSim() {
    const { step } = useSlideSteps(BONE_BEATS.length);
    return (
        <Frame>
            <Headline beat={step} chips={<DesignChip>{step < 2 ? 'paralelo · 28 marchadores de elite · 6 dias' : step === 2 ? 'mecanísticos · marcadores ósseos' : 'consenso COI 2023'}</DesignChip>} size={28}>{BONE_BEATS[step]}</Headline>
            <div className="mt-4 flex gap-8">
                <Chart bent={step >= 1} />
                <div className="flex-1"><Side step={step} /></div>
            </div>
            <Foot source={BONE_SOURCES[step]} />
        </Frame>
    );
}
