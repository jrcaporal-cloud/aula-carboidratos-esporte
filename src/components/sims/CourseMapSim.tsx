import { Atom, Battery, BatteryLow, Cog, Flag, Microscope, RotateCcw, Timer, Trophy, Utensils, type LucideIcon } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { CHAPTERS, type ChapterIcon } from '../../data/chapters';
import { Panel } from './kit/ui';
import { Beat } from './kit/Beat';
import { Reveal } from './kit/rhythm';
import { castOf } from './kit/cast';
import { FictionsChip } from './kit/chips';
import { CourseMap } from './ato1/CourseMap';
import { ACT_PLAN } from './ato1/course.content';
import { ROLES } from './ato1/roles.content';

/**
 * Slide 14 · O Mapa da Aula. Os 10 atos como marcos de um percurso de prova; a cada passo a estrada se desenha até o
 * próximo marco (na cor do ato) e cada marco mostra os papéis que acende (Combustível, Sinal, Escolha). Embaixo, o ato
 * da vez: a pergunta, três estações (slides do roteiro), os papéis acesos e os personagens que voltam nele.
 */
const ICONS: Record<ChapterIcon, LucideIcon> = {
    flag: Flag, atom: Atom, cog: Cog, battery: Battery, utensils: Utensils,
    timer: Timer, 'rotate-ccw': RotateCcw, 'battery-low': BatteryLow, trophy: Trophy, microscope: Microscope,
};

export default function CourseMapSim() {
    const { step, setStep } = useSlideSteps(CHAPTERS.length);
    const ch = CHAPTERS[step];
    const plan = ACT_PLAN[step];
    const Icon = ICONS[ch.icon];
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-3">
            <Panel className="shrink-0"><CourseMap current={step} onSelect={setStep} /></Panel>
            <Panel className="flex min-h-0 flex-1 gap-6 px-6 py-4" state="active" glow={ch.color}>
                <Beat beat={`a-${step}`} className="flex w-[190px] shrink-0 flex-col gap-1.5">
                    <Icon size={36} color={ch.color} strokeWidth={2.2} aria-hidden />
                    <span className="font-display text-[64px] font-bold leading-none" style={{ color: ch.color }}>{ch.roman}</span>
                    <span className="text-[22px] font-semibold leading-tight text-white">{ch.title}</span>
                </Beat>
                <div key={`q-${step}`} className="flex min-w-0 flex-1 flex-col gap-3">
                    <Reveal order={0}>
                        <span className="block text-[26px] font-semibold leading-tight text-white">{ch.question}</span>
                    </Reveal>
                    <Reveal order={1} className="flex flex-col gap-1.5">
                        <span className="text-[16px] text-gray-300">três estações do ato</span>
                        <div className="flex flex-wrap gap-2">
                            {plan.stations.map(s => (
                                <span key={s} className="rounded-lg border-2 px-2.5 py-0.5 text-[17px] text-gray-100" style={{ borderColor: `${ch.color}80` }}>{s}</span>
                            ))}
                        </div>
                    </Reveal>
                </div>
                <div key={`r-${step}`} className="flex w-[250px] shrink-0 flex-col gap-2">
                    <span className="text-[16px] text-gray-300">papéis acesos</span>
                    {ROLES.map(r => {
                        const on = plan.roles.includes(r.id);
                        const RIcon = r.icon;
                        return (
                            <div key={r.id} className="flex items-center gap-2" style={{ opacity: on ? 1 : 0.6 }}>
                                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2"
                                    style={{ borderColor: r.color, background: on ? r.color : 'transparent' }}>
                                    <RIcon size={16} color={on ? '#04080F' : r.color} strokeWidth={2.4} aria-hidden />
                                </span>
                                <span className="text-[18px] font-semibold" style={{ color: on ? r.color : '#D1D5DB' }}>{r.name}</span>
                            </div>
                        );
                    })}
                    {plan.cast.length > 0 && (
                        <div className="mt-auto flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[16px] text-gray-300">quem volta</span>
                                <FictionsChip />
                            </div>
                            <span className="text-[17px] leading-snug text-gray-100">{plan.cast.map(id => castOf(id).name).join(', ')}</span>
                        </div>
                    )}
                </div>
            </Panel>
        </div>
    );
}
