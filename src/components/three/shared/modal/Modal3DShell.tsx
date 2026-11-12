import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { LocateFixed } from 'lucide-react';
import { Chip } from '../../../sims/kit/ui';
import { C } from '../../../sims/kit/palette';
import { CameraRig } from './CameraRig';
import { ReadySignal, StepClockDriver } from './SceneSupport';
import { LABEL_KEYFRAMES, StepLabels } from './StepLabels';
import { LoadingVeil, StepPanel, StepRail } from './StepPanel';
import { StepClock } from './clock';
import type { ShellState, StepInfo } from './types';
import { useStepKeys } from './useStepKeys';

/*
 * Moldura comum dos três modelos 3D: etapas (passador, setas, trilha, ▶ automático), câmera que voa
 * até a pose da etapa, rótulos HTML depois do pouso, painel lateral com texto e fontes, véu de
 * carregamento. A cena roda em frameloop "demand": parada, não gasta GPU durante a chamada.
 */

const READ_MS = 6500;
const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface Modal3DShellProps {
    onClose: () => void;
    ariaLabel: string;
    kicker: string;
    title: string;
    scaleNote: string;
    accent: string;
    loadingText: string;
    steps: readonly StepInfo[];
    camera: { fov: number; near: number; far: number; minDistance: number; maxDistance: number };
    scene: (s: ShellState) => ReactNode;
    hud?: (s: ShellState) => ReactNode;
    panelExtra?: (s: ShellState) => ReactNode;
}

export const Modal3DShell = (p: Modal3DShellProps) => {
    const { steps, onClose } = p;
    const last = steps.length - 1;
    const [step, setStep] = useState(0);
    const [settledStep, setSettledStep] = useState(-1);
    const [playing, setPlaying] = useState(false);
    const [ready, setReady] = useState(false);
    const [recenterKey, setRecenterKey] = useState(0);
    const [reduced] = useState(prefersReduced);
    const [clock] = useState(() => new StepClock());
    const stepRef = useRef(0);
    const poses = useMemo(() => steps.map(s => s.pose), [steps]);

    const go = useCallback((target: number) => {
        const next = Math.min(Math.max(target, 0), last);
        if (next === stepRef.current) return;
        stepRef.current = next;
        setSettledStep(-1);
        setStep(next);
    }, [last]);
    const goManual = useCallback((i: number) => { setPlaying(false); go(i); }, [go]);
    const onSettled = useCallback((s: number) => setSettledStep(s), []);
    const onReady = useCallback(() => setReady(true), []);
    const togglePlay = useCallback(() => {
        if (!playing && stepRef.current === last) go(0);
        setPlaying(!playing);
    }, [go, last, playing]);

    // ▶: espera pousar, deixa a animação correr e o texto ser lido, avança; para na última
    const settled = settledStep === step;
    useEffect(() => {
        if (!playing || !settled) return;
        if (step >= last) { const t = window.setTimeout(() => setPlaying(false), 0); return () => window.clearTimeout(t); }
        const t = window.setTimeout(() => go(step + 1), steps[step].anim * 1000 + READ_MS);
        return () => window.clearTimeout(t);
    }, [playing, settled, step, last, steps, go]);

    useStepKeys({ next: () => goManual(stepRef.current + 1), prev: () => goManual(stepRef.current - 1), togglePlay, close: onClose });

    // depois de clicar num botão, o foco sai dele (Espaço não "reaperta" o botão)
    const dropFocus = useCallback(() => {
        const el = document.activeElement;
        if (el instanceof HTMLElement && el !== document.body) window.setTimeout(() => el.blur(), 0);
    }, []);

    const state: ShellState = { step, settled, reduced, clock };
    const data = steps[step];
    return (
        <motion.div
            role="dialog" aria-modal="true" aria-label={p.ariaLabel}
            className="absolute inset-0 z-50 overflow-hidden bg-[#04080F] font-body [--panel-w:clamp(380px,30vw,520px)]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            onPointerUp={dropFocus}
        >
            <style>{LABEL_KEYFRAMES}</style>
            <div className="absolute left-0 top-0 bottom-0 overflow-hidden" style={{ right: 'var(--panel-w)' }}>
                <Canvas
                    frameloop="demand"
                    dpr={[1, 1.5]}
                    camera={{ position: [...steps[0].pose.pos], fov: p.camera.fov, near: p.camera.near, far: p.camera.far }}
                    gl={{ antialias: true, powerPreference: 'high-performance' }}
                    resize={{ offsetSize: true }}
                    className="cursor-grab active:cursor-grabbing"
                >
                    <color attach="background" args={['#04080F']} />
                    <Suspense fallback={null}>
                        <CameraRig
                            poses={poses} step={step} recenterKey={recenterKey} reduced={reduced}
                            minDistance={p.camera.minDistance} maxDistance={p.camera.maxDistance} onSettled={onSettled}
                        />
                        <StepClockDriver clock={clock} step={step} anim={data.anim} settled={settled} reduced={reduced} />
                        {p.scene(state)}
                        <StepLabels key={step} labels={data.labels} visible={settled} />
                        <ReadySignal onReady={onReady} />
                    </Suspense>
                </Canvas>

                <header className="pointer-events-none absolute left-7 top-5 z-[45]">
                    <p className="mb-1 text-[14px] font-mono uppercase tracking-[0.24em]" style={{ color: p.accent }}>{p.kicker}</p>
                    <h2 className="text-[30px] font-semibold leading-tight text-white" style={{ fontFamily: 'var(--font-display)' }}>{p.title}</h2>
                    <div className="mt-2"><Chip color={C.caveat}>{p.scaleNote}</Chip></div>
                </header>
                <button
                    type="button" onClick={() => setRecenterKey(k => k + 1)} aria-label="Recentrar a câmera na pose da etapa"
                    className="absolute right-5 top-5 z-[46] flex h-10 items-center gap-2 rounded-full bg-[rgba(4,10,20,0.9)] pl-3.5 pr-4 text-[15px] font-semibold text-gray-100 transition-transform duration-150 ease-out hover:bg-[#1A2436] active:scale-[0.97]"
                >
                    <LocateFixed size={17} aria-hidden /> Recentrar
                </button>
                {p.hud && <div className="pointer-events-none absolute right-5 top-[72px] z-[45]">{p.hud(state)}</div>}
                <footer className="pointer-events-none absolute bottom-5 left-0 right-0 z-[45] flex justify-center px-4">
                    <StepRail steps={steps} step={step} playing={playing} accent={p.accent} onGo={goManual} onTogglePlay={togglePlay} />
                </footer>
                <AnimatePresence>{!ready && <LoadingVeil text={p.loadingText} />}</AnimatePresence>
            </div>
            <StepPanel data={data} step={step} total={steps.length} accent={p.accent} onClose={onClose}>
                {p.panelExtra?.(state)}
            </StepPanel>
        </motion.div>
    );
};
