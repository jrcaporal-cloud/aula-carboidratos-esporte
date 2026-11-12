import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Beat } from './kit/Beat';
import { Tank } from './kit/Tank';
import { CAST, type CastMember } from './kit/cast';
import { FictionsChip, IllustrativeChip } from './kit/chips';
import { CAST_EXTRA, CAST_FINAL_BEAT } from './ato1/cast.content';

/**
 * Slide 12 · Cinco Atletas, Cinco Tanques. O elenco em fila; o foco caminha de um atleta para o outro
 * (moldura com layoutId, que pousa com mola) e o tanque dele esvazia até o nível do seu esforço típico.
 * Embaixo, a faixa com o dilema na voz do atleta. O último passo acende os cinco juntos.
 */
const STEPS = CAST.length + 1;
const FINAL = CAST.length;
const FOCUS_SPRING = { type: 'spring', stiffness: 420, damping: 36 } as const;

interface ColumnProps {
    member: CastMember;
    index: number;
    step: number;
}

const Column = ({ member, index, step }: ColumnProps) => {
    const focused = step === index;
    const visited = step >= index;
    const dim = step < FINAL && !focused;
    const extra = CAST_EXTRA[member.id];
    const Icon = member.icon;
    return (
        <div className="relative flex flex-1 flex-col items-center gap-3 px-2 pb-4 pt-5">
            {focused && (
                <motion.div layoutId="cast-focus" aria-hidden transition={FOCUS_SPRING}
                    className="absolute inset-0 rounded-2xl border-[3px]" style={{ borderColor: C.glycogen, background: 'rgba(139,92,246,0.10)', borderRadius: 16 }} />
            )}
            <motion.div className="relative flex flex-col items-center gap-1" animate={{ opacity: dim ? 0.5 : 1 }}
                transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                <Icon size={34} color={C.text} strokeWidth={2} aria-hidden />
                <span className="font-display text-[28px] font-semibold leading-tight text-white">{member.name}</span>
            </motion.div>
            <motion.div className="relative" animate={{ opacity: dim ? 0.45 : 1 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                <Tank level={visited ? extra.level : 1} width={68} height={176} active={focused} />
            </motion.div>
            <motion.span className="relative text-center text-[16px] leading-snug text-gray-200"
                animate={{ opacity: visited ? (dim ? 0.6 : 1) : 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                {step === FINAL ? member.sport : extra.when}
            </motion.span>
        </div>
    );
};

/** Aspas tipográficas na fala do atleta (o elenco guarda aspas retas). */
const curly = (text: string): string => text.replace(/^"/, '“').replace(/"$/, '”');

const Dilemma = ({ member }: { member: CastMember }) => {
    const extra = CAST_EXTRA[member.id];
    return (
        <div className="flex items-center justify-between gap-8">
            <span className="text-[32px] font-semibold leading-tight text-white">{curly(member.dilemma)}</span>
            <div className="flex shrink-0 flex-col items-end gap-1 text-[18px] text-gray-200">
                <span>{member.age} anos · {member.kg} kg · {member.sport}</span>
                <span className="text-gray-300">{member.effort} · {extra.returns}</span>
            </div>
        </div>
    );
};

export default function CastSim() {
    const { step } = useSlideSteps(STEPS);
    const member = step < FINAL ? CAST[step] : null;
    return (
        <div className="not-prose flex w-full flex-col gap-4" style={{ maxHeight: 516 }}>
            <div className="flex min-h-[44px] items-center justify-between gap-6">
                <Beat beat={step} className="text-[30px] font-semibold leading-tight text-white">
                    {member ? CAST_EXTRA[member.id].beat : CAST_FINAL_BEAT}
                </Beat>
                <div className="flex gap-2"><FictionsChip /><IllustrativeChip /></div>
            </div>

            <div className="flex gap-2 rounded-2xl p-2" style={PANEL_BG}>
                {CAST.map((m, i) => <Column key={m.id} member={m} index={i} step={step} />)}
            </div>

            <div className="flex min-h-[104px] flex-col justify-center rounded-2xl border-2 px-7 py-4"
                style={{ ...PANEL_BG, borderColor: member ? `${C.glycogen}99` : 'rgba(255,255,255,0.16)' }}>
                <Beat beat={member?.id ?? 'todos'}>
                    {member ? <Dilemma member={member} /> : (
                        <span className="text-[28px] leading-snug text-gray-100">Cada tanque volta no ato do seu problema.</span>
                    )}
                </Beat>
            </div>
        </div>
    );
}
