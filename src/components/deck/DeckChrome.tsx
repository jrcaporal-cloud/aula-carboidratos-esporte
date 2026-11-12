import { ChevronLeft, ChevronRight, LayoutGrid, Maximize, Minimize, Box, MonitorSpeaker, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSlideStepStore } from '../../store/useSlideSteps';
import { useDetailsStore } from '../../lib/detailsStore';
import { toggleDetails } from '../../lib/detailsEvent';
import { chapterOfSection } from './acts';
import { IS_PREVIEW } from './presenterChannel';
import { MarathonBar } from './MarathonBar';
import { StageTools, StageToolButtons } from './stage/StageTools';

interface DeckChromeProps {
    index: number;
    total: number;
    section: string;
    /** Mouse parado: o indicador das ferramentas de palco fica mais discreto. */
    idle: boolean;
    has3D: boolean;
    /** Abertura de ato na tela: a pílula de passos sai para não ficar por cima da cortina. */
    covered?: boolean;
    onPrev: () => void;
    onNext: () => void;
    onOverview: () => void;
    on3D: () => void;
    onPresenter: () => void;
}

const useFullscreen = () => {
    const [isFull, setIsFull] = useState(Boolean(document.fullscreenElement));
    useEffect(() => {
        const sync = () => setIsFull(Boolean(document.fullscreenElement));
        document.addEventListener('fullscreenchange', sync);
        return () => document.removeEventListener('fullscreenchange', sync);
    }, []);
    const toggle = () => {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen?.();
    };
    return { isFull, toggle };
};

const pad = (n: number) => String(n).padStart(2, '0');

const ICON_BUTTON = 'w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-25 disabled:pointer-events-none transition-colors focus-visible:outline-2 focus-visible:outline-brand-accent';

const IconButton = ({ label, onClick, disabled, children }: {
    label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode;
}) => (
    <button
        type="button"
        aria-label={label}
        title={label}
        onClick={onClick}
        disabled={disabled}
        className={`${ICON_BUTTON} text-gray-300 hover:text-white hover:bg-white/10`}
    >
        {children}
    </button>
);

/**
 * Barra da maratona (progresso em km), seção atual, contador e controles. Botões e navegação somem com o
 * mouse parado (`.hide-when-idle`, em index.css) — menos quando têm foco de teclado, para quem navega por Tab.
 * Também monta as ferramentas de palco (holofote L, caneta K). Na prévia do apresentador (?previa) só fica
 * o que a plateia vê: sem botões nem ferramentas.
 */
export const DeckChrome = ({ index, total, section, idle, has3D, covered = false, onPrev, onNext, onOverview, on3D, onPresenter }: DeckChromeProps) => {
    const { isFull, toggle } = useFullscreen();
    const step = useSlideStepStore(s => s.step);
    const stepCount = useSlideStepStore(s => s.count);
    const detailsAvailable = useDetailsStore(s => s.available > 0);
    const detailsOpen = useDetailsStore(s => s.open);
    const actColor = chapterOfSection(section)?.color;

    return (
        <>
            {!IS_PREVIEW && <StageTools index={index} idle={idle} />}

            <MarathonBar index={index} total={total} />

            {section && (
                <div className="absolute top-6 left-7 z-30 flex items-center gap-3 text-[16px] uppercase tracking-[0.18em] text-gray-100 pointer-events-none">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-accent" style={actColor ? { background: actColor } : undefined} />
                    <span>{section}</span>
                </div>
            )}

            {stepCount > 1 && !covered && (
                <div
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 rounded-full bg-black/55 border border-white/10 backdrop-blur-md pointer-events-none [contain:layout_paint]"
                    aria-label={`Passo ${step + 1} de ${stepCount}`}
                >
                    <span className="text-[14px] font-mono text-gray-200 tabular-nums">Passo {step + 1} de {stepCount}</span>
                    {/* Exceção deliberada: o ponto ativo cresce em largura (vira pílula) e empurra os vizinhos — scaleX
                        distorceria o arredondado. O `contain` da pílula isola esse layout/pintura dentro dela. */}
                    <span className="flex items-center gap-1.5" aria-hidden>
                        {Array.from({ length: stepCount }, (_, i) => (
                            <span key={i} className={`h-2 rounded-full transition-[width,background-color] duration-300 ease-[var(--ease-out)] ${i === step ? 'w-5 bg-brand-accent' : i < step ? 'w-2 bg-brand-accent/70' : 'w-2 bg-white/30'}`} />
                        ))}
                    </span>
                </div>
            )}

            {!IS_PREVIEW && (has3D || detailsAvailable) && (
                // Em tela estreita (projetor 4:3) estes botões sobem e deixam a faixa de baixo para o contador de passos,
                // que fica sempre colado na base (o palco reserva essa faixa).
                <div className="hide-when-idle absolute bottom-20 min-[1180px]:bottom-6 left-7 z-30 flex items-center gap-3">
                    {has3D && (
                        <button
                            type="button"
                            onClick={on3D}
                            className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-full text-sm text-white bg-amber-500/20 border border-amber-300/40 hover:border-amber-200/80 backdrop-blur-md"
                        >
                            <Box size={16} className="text-amber-300" />
                            Ver mecanismo em 3D
                            <kbd className="deck-kbd ml-1">3</kbd>
                        </button>
                    )}
                    {detailsAvailable && (
                        <button
                            type="button"
                            onClick={toggleDetails}
                            aria-expanded={detailsOpen}
                            className="flex items-center gap-2 pl-4 pr-3 py-2 rounded-full text-sm text-gray-100 bg-black/55 border border-white/15 hover:border-brand-accent/60 hover:text-white backdrop-blur-md"
                        >
                            {detailsOpen ? 'Ocultar detalhamento' : 'Mostrar detalhamento'}
                            <ChevronDown size={16} className={`transition-transform duration-300 ${detailsOpen ? 'rotate-180' : ''}`} />
                            <kbd className="deck-kbd">D</kbd>
                        </button>
                    )}
                </div>
            )}

            {!IS_PREVIEW && <nav
                aria-label="Navegação dos slides"
                className="hide-when-idle absolute bottom-5 right-6 z-30 flex items-center gap-1 px-2 py-1.5 rounded-full bg-black/55 border border-white/10 backdrop-blur-md"
            >
                <IconButton label="Slide anterior (←)" onClick={onPrev} disabled={index === 0}>
                    <ChevronLeft size={18} />
                </IconButton>
                <span className="px-2 font-mono text-xs text-gray-300 tabular-nums select-none">
                    {pad(index + 1)}<span className="text-gray-400"> / {pad(total)}</span>
                </span>
                <IconButton label="Próximo slide (→)" onClick={onNext} disabled={index === total - 1}>
                    <ChevronRight size={18} />
                </IconButton>
                <span className="w-[2px] h-5 bg-white/15 mx-1" />
                <StageToolButtons className={ICON_BUTTON} />
                <IconButton label="Modo apresentador (P)" onClick={onPresenter}>
                    <MonitorSpeaker size={16} />
                </IconButton>
                <IconButton label="Visão geral (G)" onClick={onOverview}>
                    <LayoutGrid size={16} />
                </IconButton>
                <IconButton label={isFull ? 'Sair da tela cheia (F)' : 'Tela cheia (F)'} onClick={toggle}>
                    {isFull ? <Minimize size={16} /> : <Maximize size={16} />}
                </IconButton>
            </nav>}
        </>
    );
};
