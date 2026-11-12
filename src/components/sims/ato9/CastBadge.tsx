import { castOf, type CastId } from '../kit/cast';
import { FictionChip } from '../kit/chips';
import { C } from '../kit/palette';

/** Ficha do personagem fictício na lateral do slide: ícone, nome, esporte, o dilema na voz dele e o selo. */
export const CastBadge = ({ id }: { id: CastId }) => {
    const m = castOf(id);
    const Icon = m.icon;
    return (
        <div className="flex flex-col gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Icon size={36} strokeWidth={2.2} color={C.text} aria-hidden />
            </span>
            <div className="flex flex-col gap-1">
                <span className="font-display text-[34px] font-semibold leading-none text-white">{m.name}</span>
                <span className="text-[18px] text-gray-300">{m.age} anos · {m.kg} kg · {m.sport}</span>
            </div>
            <p className="m-0 text-[22px] italic leading-snug text-gray-100">{m.dilemma}</p>
            <span className="self-start"><FictionChip /></span>
        </div>
    );
};
