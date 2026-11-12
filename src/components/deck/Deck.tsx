import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { TitleSlide } from '../presentation/TitleSlide';
import { ProseSlide } from '../presentation/ProseSlide';
import { QuoteSlide } from '../presentation/QuoteSlide';
import { CONTENT_MIN_HEIGHT, FitStage, PAD_X_SELF, SLIDE_WIDTH } from './FitStage';
import { SlideErrorBoundary } from './SlideErrorBoundary';
import { preloadAllSims } from '../presentation/slideContent';
import { DeckChrome } from './DeckChrome';
import { Overview } from './Overview';
import { DECK, MODEL_3D_BY_SLIDE, type DeckSlide, type Model3D } from './slides';
import { useDeckNavigation } from './useDeckNavigation';
import { openPresenterWindow } from './presenterChannel';
import { usePresenterSync } from './usePresenterSync';
import { toggleDetails } from '../../lib/detailsEvent';
import { MODALS_3D, preloadAll3D } from '../three/registry';
import { Morph3D } from '../three/morph/Morph3D';
import { accentOf } from '../three/morph/accent';
import { useMorph3D } from '../three/morph/useMorph3D';
import { ActCurtain } from './ActCurtain';
import { ActTint } from './motion/ActTint';
import { GlucoseCharacter } from './motion/GlucoseCharacter';
import { KEEP_JS_ANIMATION, SECTION_VARIANTS, SlideMotionContext } from './motion/transitions';
import { useSlideTransition } from './motion/useSlideTransition';

const renderSlide = ({ slide, section }: DeckSlide) => {
    if (slide.id === 0) return <TitleSlide slide={slide} />;
    if (!slide.title.trim()) return <QuoteSlide slide={slide} />;
    return <ProseSlide slide={slide} section={section} />;
};

/** Slide de conteúdo (título + simulador): a capa e as citações têm diagramação própria, centralizada. */
const isContentSlide = ({ slide }: DeckSlide): boolean => slide.id !== 0 && slide.title.trim() !== '';

const IDLE_MS = 2600;

/** Controles e cursor somem quando o mouse fica parado (projeção limpa). */
const useIdle = () => {
    const [idle, setIdle] = useState(false);
    useEffect(() => {
        let timer = window.setTimeout(() => setIdle(true), IDLE_MS);
        const wake = () => {
            setIdle(false);
            window.clearTimeout(timer);
            timer = window.setTimeout(() => setIdle(true), IDLE_MS);
        };
        window.addEventListener('mousemove', wake);
        window.addEventListener('mousedown', wake);
        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('mousemove', wake);
            window.removeEventListener('mousedown', wake);
        };
    }, []);
    return idle;
};

// Os modelos 3D (cena + pós-processamento) só são baixados quando alguém os abre (ou na pré-carga).
// Cada arquivo de `three/models/` é um modelo: export default de um modal que recebe `onClose`.

export const Deck = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const setSlide = useStore(s => s.setSlide);
    const modalOpen = useStore(s => s.modalOpen);
    const setModalOpen = useStore(s => s.setModalOpen);
    const [overview, setOverview] = useState(false);
    const idle = useIdle();

    const toggleOverview = useCallback(() => setOverview(o => !o), []);
    const closeOverlays = useCallback(() => setOverview(false), []);

    const { index, goTo, next, prev } = useDeckNavigation({
        total: DECK.length,
        paused: modalOpen,
        rootRef,
        onToggleOverview: toggleOverview,
        onCloseOverlays: closeOverlays,
    });

    // Direção da troca, saída instantânea em rajada e abertura de ato (camadas em ./motion).
    const { motion: slideMotion, opening, closeOpening } = useSlideTransition(index);

    // Passador, botões e janela do apresentador: avançar ou voltar fecha a abertura do ato na hora.
    const advance = useCallback(() => { closeOpening(); next(); }, [closeOpening, next]);
    const back = useCallback(() => { closeOpening(); prev(); }, [closeOpening, prev]);

    const current = DECK[index];
    const model3D: Model3D | null = MODEL_3D_BY_SLIDE.get(current.slide.id) ?? null;
    const has3D = model3D !== null;
    // Tecla 3: a arte do slide cresce e vira a cena 3D (e volta para ela ao fechar).
    const morph = useMorph3D(rootRef, index);
    const openMorph = morph.open;
    const open3D = morph.name;
    const show3D = open3D !== null;
    const Open3D = open3D ? MODALS_3D[open3D] : undefined;

    useEffect(() => setSlide(index), [index, setSlide]);

    // Depois que a capa aparece, baixa o resto da aula em segundo plano.
    useEffect(() => {
        const start = window.setTimeout(() => {
            void preloadAllSims().then(preloadAll3D);
        }, 2500);
        return () => window.clearTimeout(start);
    }, []);

    const nav = useMemo(() => ({ next: advance, prev: back, goTo }), [advance, back, goTo]);
    const presenterState = usePresenterSync(index, nav);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (modalOpen || e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.key === 'p' || e.key === 'P') openPresenterWindow(presenterState.current.index);
            if (e.key === 'd' || e.key === 'D') toggleDetails();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [modalOpen, presenterState]);
    useEffect(() => setModalOpen(show3D), [show3D, setModalOpen]);

    // Atalho "3" abre o modelo 3D do slide, quando ele tem um.
    useEffect(() => {
        if (!model3D || modalOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== '3' || e.metaKey || e.ctrlKey || e.altKey || useStore.getState().modalOpen) return;
            openMorph(model3D);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [model3D, modalOpen, openMorph]);

    const liveText = `${opening ? `Ato ${opening.chapter.roman}: ${opening.chapter.title}. ` : ''}Slide ${index + 1} de ${DECK.length}: ${current.label}`;

    return (
        <div
            ref={rootRef}
            data-idle={idle || undefined}
            className={`deck-root absolute inset-0 z-10 overflow-hidden font-body selection:bg-brand-deep selection:text-white ${idle && !overview ? 'cursor-none' : ''}`}
        >
            <ActTint section={current.section} />

            {/* Troca de slide: lateral com parallax no mesmo ato; a abertura cobre a troca entre atos. */}
            <AnimatePresence initial={false} custom={slideMotion}>
                <motion.section
                    key={index}
                    custom={slideMotion}
                    data-deck-index={index}
                    className="absolute inset-0"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} de ${DECK.length}: ${current.label}`}
                    variants={SECTION_VARIANTS}
                    onUpdate={KEEP_JS_ANIMATION}
                    initial="enter"
                    animate="center"
                    exit="exit"
                >
                    <SlideMotionContext.Provider value={slideMotion}>
                        <FitStage width={SLIDE_WIDTH} padX={PAD_X_SELF} minHeight={isContentSlide(current) ? CONTENT_MIN_HEIGHT : 0}><SlideErrorBoundary resetKey={index}>{renderSlide(current)}</SlideErrorBoundary></FitStage>
                    </SlideMotionContext.Provider>
                </motion.section>
            </AnimatePresence>

            {/* Leitor de tela: anuncia o slide novo a cada troca (o <section> que sai e entra não é anunciado sozinho). */}
            <p className="sr-only" aria-live="polite" aria-atomic="true">{liveText}</p>

            <AnimatePresence>
                {opening && <ActCurtain key={opening.key} chapter={opening.chapter} />}
            </AnimatePresence>
            <GlucoseCharacter index={index} hidden={overview || modalOpen} />

            <DeckChrome
                index={index}
                total={DECK.length}
                section={current.section}
                idle={idle}
                has3D={has3D}
                covered={Boolean(opening)}
                onPrev={back}
                onNext={advance}
                onOverview={toggleOverview}
                on3D={() => openMorph(model3D)}
                onPresenter={() => openPresenterWindow(index)}
            />

            <AnimatePresence>
                {overview && (
                    <Overview
                        current={index}
                        onSelect={i => { goTo(i); setOverview(false); }}
                        onClose={() => setOverview(false)}
                    />
                )}
            </AnimatePresence>

            <Suspense fallback={null}>
                <AnimatePresence custom={morph.from} onExitComplete={morph.onExitComplete}>
                    {Open3D && (
                        <Morph3D key={open3D} from={morph.from} accent={accentOf(open3D)} onClose={morph.close}>
                            <Open3D onClose={morph.close} />
                        </Morph3D>
                    )}
                </AnimatePresence>
            </Suspense>
        </div>
    );
};
