import { Atom, Battery, BatteryLow, Cog, Flag, Microscope, RotateCcw, Timer, Trophy, Utensils, type LucideIcon } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { CHAPTERS, type ChapterIcon } from '../../data/chapters';
import { PANEL_BG } from './kit/palette';
import { Beat } from './kit/Beat';
import { CourseMap } from './ato1/CourseMap';

/**
 * Slide 14 · O Mapa da Aula. Os 10 atos como marcos de um percurso de prova; a cada passo a estrada
 * se desenha até o próximo marco e a pergunta daquele ato (de data/chapters.ts) aparece embaixo.
 */
const ICONS: Record<ChapterIcon, LucideIcon> = {
    flag: Flag, atom: Atom, cog: Cog, battery: Battery, utensils: Utensils,
    timer: Timer, 'rotate-ccw': RotateCcw, 'battery-low': BatteryLow, trophy: Trophy, microscope: Microscope,
};

export default function CourseMapSim() {
    const { step } = useSlideSteps(CHAPTERS.length);
    const ch = CHAPTERS[step];
    const Icon = ICONS[ch.icon];
    return (
        <div className="not-prose flex w-full flex-col gap-4" style={{ maxHeight: 516 }}>
            <div className="rounded-2xl" style={PANEL_BG}>
                <CourseMap current={step} />
            </div>
            <div className="flex min-h-[150px] items-center gap-7 rounded-2xl border-2 px-8 py-5"
                style={{ ...PANEL_BG, borderColor: ch.color }}>
                <Beat beat={`icone-${step}`} className="shrink-0">
                    <Icon size={64} color={ch.color} strokeWidth={2} aria-hidden />
                </Beat>
                <Beat beat={step} className="flex flex-col gap-2">
                    <span className="text-[20px] font-semibold" style={{ color: ch.color }}>Ato {ch.roman} · {ch.title}</span>
                    <span className="text-[32px] font-semibold leading-tight text-white">{ch.question}</span>
                </Beat>
            </div>
        </div>
    );
}
