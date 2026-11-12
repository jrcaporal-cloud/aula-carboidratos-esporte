import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { CHAPTERS } from '../../../data/chapters';
import { C, PANEL_BG } from '../kit/palette';
import { Tank } from '../kit/Tank';
import { Reveal } from '../kit/rhythm';
import { CountUp } from '../kit/CountUp';
import type { CastMember } from '../kit/cast';
import { CAST_EXTRA } from './cast.content';

/**
 * Um cartão do elenco (slide 12). Fechado: só nome, ícone e tanque cheio, esmaecido.
 * Aberto: o tanque esvazia até o nível do esforço típico, a fala, a pergunta fisiológica e o dado do ato em que ele volta.
 * Depois de aberto, fica aberto (o último passo é a soma dos cinco).
 */
const colorOf = (roman: string): string => CHAPTERS.find(c => c.roman === roman)?.color ?? C.text;

/** Aspas tipográficas na fala do atleta (o elenco guarda aspas retas). */
const curly = (text: string): string => text.replace(/^"/, '“').replace(/"$/, '”');

interface CastCardProps {
    member: CastMember;
    /** O passo em que este cartão abre. */
    at: number;
    step: number;
    final: boolean;
}

export const CastCard = ({ member, at, step, final }: CastCardProps) => {
    const reduce = useReducedMotion();
    const extra = CAST_EXTRA[member.id];
    const open = step >= at;
    const focused = step === at;
    const Icon = member.icon;
    return (
        <div className="relative flex min-w-0 flex-1 flex-col gap-2 rounded-2xl border-2 px-3 py-3 transition-colors duration-300"
            style={{ ...PANEL_BG, borderColor: focused || final ? C.glycogen : open ? `${C.glycogen}66` : 'rgba(255,255,255,0.14)' }}>
            <motion.div className="flex flex-col" initial={false} animate={{ opacity: open ? 1 : 0.6 }}
                transition={{ duration: reduce ? 0 : DUR.enter, ease: EASE_OUT }}>
                <div className="flex items-center gap-2">
                    <Icon size={26} color={C.text} strokeWidth={2.2} aria-hidden />
                    <span className="font-display text-[24px] font-semibold leading-none text-white">{member.name}</span>
                </div>
                <span className="mt-1 text-[16px] leading-tight text-gray-300">{member.age} anos · {member.kg} kg</span>
                <span className="text-[16px] leading-tight text-gray-100">{member.sport}</span>
                <span className="font-mono text-[14px] leading-tight text-gray-300">{member.effort}</span>
            </motion.div>

            <div className="flex items-start gap-2.5">
                <motion.div className="shrink-0" initial={false} animate={{ opacity: open ? 1 : 0.6 }}>
                    <Tank level={open ? extra.level : 1} width={40} height={84} active={focused} />
                </motion.div>
                {open && (
                    <Reveal order={0} className="min-w-0">
                        <span className="text-[16px] italic leading-snug text-gray-100">{curly(member.dilemma)}</span>
                    </Reveal>
                )}
            </div>

            {open && (
                <>
                    <Reveal order={1}>
                        <span className="block text-[17px] font-semibold leading-snug" style={{ color: C.glycogenSoft }}>{extra.question}</span>
                    </Reveal>
                    <Reveal order={2} className="flex flex-col gap-0.5">
                        <CountUp text={extra.stat} delay={0.4} className="font-display text-[30px] font-bold leading-none" style={{ color: C.glucose }} />
                        <span className="text-[15px] leading-snug text-gray-200">{extra.statCaption}</span>
                        <span className="font-mono text-[14px] leading-snug text-gray-300">{extra.study}</span>
                    </Reveal>
                    <div className="mt-auto flex items-center gap-1.5">
                        <span className="text-[15px] text-gray-300">volta:</span>
                        {extra.acts.map(a => (
                            <span key={a} className="rounded-md border-2 px-1.5 font-mono text-[15px] font-bold leading-6"
                                style={{ borderColor: colorOf(a), color: colorOf(a) }}>Ato {a}</span>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
