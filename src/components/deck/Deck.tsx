import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
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
import { useSlideStepStore } from '../../store/useSlideSteps';
import { PRESENTER_CHANNEL, openPresenterWindow, type PresenterMessage } from './presenterChannel';
import { toggleDetails } from '../../lib/detailsEvent';
import { MODALS_3D, preloadAll3D } from '../three/registry';
import { ActCurtain, CURTAIN_HOLD_MS } from './ActCurtain';
import { curtainForCrossing } from './acts';
import type { Chapter } from '../../data/chapters';
import { DUR, EASE_OUT } from '../../lib/motion';

const renderSlide = ({ slide, section }: DeckSlide) => {
    if (slide.id === 0) return <TitleSlide slide={slide} />;
    if (!slide.title.trim()) return <QuoteSlide slide={slide} />;
    return <ProseSlide slide={slide} section={section} />;
};

/** Slide de conteúdo (título + simulador): a capa e as citações têm diagramação própria, centralizada. */
const isContentSlide = ({ slide }: DeckSlide): boolean => slide.id !== 0 && slide.title.trim() !== '';

const IDLE_MS = 2600;

/** Cliques mais rápidos que isto (passador) tiram o slide anterior na hora: nunca empilham 2–3 simuladores saindo. */
const RAPID_NAV_MS = 260;

/** Teclas de avançar/voltar (as mesmas do useDeckNavigation): qualquer uma fecha a cortina do ato. */
const NAV_KEYS = new Set(['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Enter', 'Backspace']);

interface SlideMotion {
    direction: number;
    /** Lido quando a saída começa (efeito do framer-motion, depois do render): instante em que o slide que sai entrou. */
    nav: { current: number };
}

/**
 * Troca de slide: entra subindo 16 px e esmaecendo; sai só esmaecendo, rápido. Sem transição compartilhada:
 * cada lado tem a sua duração. Se o slide que sai mal acabou de entrar (clique em rajada), sai sem animação.
 */
const SLIDE_VARIANTS = {
    enter: ({ direction }: SlideMotion) => ({ opacity: 0, y: direction * 16 }),
    center: { opacity: 1, y: 0, transition: { duration: DUR.enter, ease: EASE_OUT } },
    exit: ({ nav }: SlideMotion) => ({
        opacity: 0,
        transition: { duration: performance.now() - nav.current < RAPID_NAV_MS ? 0 : DUR.exit, ease: EASE_OUT },
    }),
};

// Os modelos 3D (cena + pós-processamento) só são baixados quando alguém os abre (ou na pré-carga).
// Cada arquivo de `three/models/` é um modelo: export default de um modal que recebe `onClose`.

export const Deck = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const setSlide = useStore(s => s.setSlide);
    const modalOpen = useStore(s => s.modalOpen);
    const setModalOpen = useStore(s => s.setModalOpen);
    const [overview, setOverview] = useState(false);
    const [open3D, setOpen3D] = useState<Model3D | null>(null);
    const [idle, setIdle] = useState(false);

    const toggleOverview = useCallback(() => setOverview(o => !o), []);
    const closeOverlays = useCallback(() => setOverview(false), []);

    const { index, direction, goTo, next, prev } = useDeckNavigation({
        total: DECK.length,
        paused: modalOpen,
        rootRef,
        onToggleOverview: toggleOverview,
        onCloseOverlays: closeOverlays,
    });

    // Cortina do ato: ao avançar um slide e entrar num ato posterior, sobe junto com o 1º slide do ato novo
    // e abre depois de um instante. Guarda o slide de destino: qualquer outra troca de slide a tira na hora.
    // (Saltos pela visão geral ou pelo endereço não tocam a cortina: só o avanço em sequência.)
    const [curtain, setCurtain] = useState<{ chapter: Chapter; index: number } | null>(null);
    const [shownIndex, setShownIndex] = useState(index);
    if (shownIndex !== index) {
        setShownIndex(index);
        const chapter = index === shownIndex + 1 ? curtainForCrossing(DECK[shownIndex].section, DECK[index].section) : null;
        setCurtain(chapter ? { chapter, index } : null);
    }
    useEffect(() => {
        if (!curtain) return undefined;
        const t = window.setTimeout(() => setCurtain(null), CURTAIN_HOLD_MS);
        return () => window.clearTimeout(t);
    }, [curtain]);

    // Qualquer comando de avançar/voltar (passo ou slide) fecha a cortina na hora: ela nunca esconde o que o clique mudou.
    useEffect(() => {
        if (!curtain) return undefined;
        const onKey = (e: KeyboardEvent) => { if (NAV_KEYS.has(e.key)) setCurtain(null); };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [curtain]);

    // Instante da última troca de slide (ver SLIDE_VARIANTS.exit). Atualizado depois que a saída já começou.
    const navAtRef = useRef(0);
    useEffect(() => { navAtRef.current = performance.now(); }, [index]);

    // Passador, botões e janela do apresentador: avançar ou voltar fecha a cortina na hora.
    const advance = useCallback(() => {
        setCurtain(null);
        next();
    }, [next]);
    const back = useCallback(() => {
        setCurtain(null);
        prev();
    }, [prev]);

    const current = DECK[index];
    const model3D = MODEL_3D_BY_SLIDE.get(current.slide.id) ?? null;
    const has3D = model3D !== null;
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

    // Sincroniza com a janela do apresentador (P): envia estado, recebe comandos.
    const step = useSlideStepStore(st => st.step);
    const stepCount = useSlideStepStore(st => st.count);
    const channelRef = useRef<BroadcastChannel | null>(null);
    const navRef = useRef({ next: advance, prev: back, goTo });
    useEffect(() => { navRef.current = { next: advance, prev: back, goTo }; }, [advance, back, goTo]);
    const stateRef = useRef({ index, step, stepCount });

    useEffect(() => {
        stateRef.current = { index, step, stepCount };
        channelRef.current?.postMessage({ type: 'state', index, step, stepCount } satisfies PresenterMessage);
    }, [index, step, stepCount]);

    useEffect(() => {
        const channel = new BroadcastChannel(PRESENTER_CHANNEL);
        channelRef.current = channel;
        channel.onmessage = (e: MessageEvent<PresenterMessage>) => {
            const msg = e.data;
            if (msg.type === 'next') navRef.current.next();
            else if (msg.type === 'prev') navRef.current.prev();
            else if (msg.type === 'goto') navRef.current.goTo(msg.index);
            else if (msg.type === 'hello') channel.postMessage({ type: 'state', ...stateRef.current } satisfies PresenterMessage);
        };
        return () => { channel.close(); channelRef.current = null; };
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (modalOpen || e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.key === 'p' || e.key === 'P') openPresenterWindow(stateRef.current.index);
            if (e.key === 'd' || e.key === 'D') toggleDetails();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [modalOpen]);
    useEffect(() => setModalOpen(show3D), [show3D, setModalOpen]);

    // Atalho "3" abre o modelo 3D do slide, quando ele tem um.
    useEffect(() => {
        if (!model3D || modalOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === '3') setOpen3D(model3D); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [model3D, modalOpen]);

    // Controles e cursor somem quando o mouse fica parado (projeção limpa).
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

    return (
        <div
            ref={rootRef}
            data-idle={idle || undefined}
            className={`deck-root absolute inset-0 z-10 overflow-hidden font-body selection:bg-brand-deep selection:text-white ${idle && !overview ? 'cursor-none' : ''}`}
        >
            <AnimatePresence initial={false} custom={{ direction, nav: navAtRef } satisfies SlideMotion}>
                <motion.section
                    key={index}
                    custom={{ direction, nav: navAtRef } satisfies SlideMotion}
                    className="absolute inset-0"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} de ${DECK.length}: ${current.label}`}
                    variants={SLIDE_VARIANTS}
                    initial="enter"
                    animate="center"
                    exit="exit"
                >
                    <FitStage width={SLIDE_WIDTH} padX={PAD_X_SELF} minHeight={isContentSlide(current) ? CONTENT_MIN_HEIGHT : 0}><SlideErrorBoundary resetKey={index}>{renderSlide(current)}</SlideErrorBoundary></FitStage>
                </motion.section>
            </AnimatePresence>

            {/* Leitor de tela: anuncia o slide novo a cada troca (o <section> que sai e entra não é anunciado sozinho). */}
            <p className="sr-only" aria-live="polite" aria-atomic="true">
                {`Slide ${index + 1} de ${DECK.length}: ${current.label}`}
            </p>

            <DeckChrome
                index={index}
                total={DECK.length}
                section={current.section}
                has3D={has3D}
                onPrev={back}
                onNext={advance}
                onOverview={toggleOverview}
                on3D={() => setOpen3D(model3D)}
                onPresenter={() => openPresenterWindow(index)}
            />

            <AnimatePresence>
                {curtain && <ActCurtain key={curtain.chapter.roman} chapter={curtain.chapter} />}
            </AnimatePresence>

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
                <AnimatePresence>
                    {Open3D && <Open3D key={open3D} onClose={() => setOpen3D(null)} />}
                </AnimatePresence>
            </Suspense>
        </div>
    );
};
