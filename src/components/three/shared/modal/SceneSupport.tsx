import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { ClockRef } from './types';

/*
 * Peças invisíveis que todo modal põe dentro do Canvas (frameloop "demand"): o relógio da etapa,
 * que só pede quadros enquanto a animação corre, e o sinal de pronto, que compila os shaders antes
 * do primeiro quadro (sem travada na primeira troca de etapa) e só então tira o véu.
 */

interface ClockProps { clock: ClockRef; step: number; anim: number; settled: boolean; reduced: boolean }

export const StepClockDriver = ({ clock, step, anim, settled, reduced }: ClockProps) => {
    const invalidate = useThree(s => s.invalidate);
    useEffect(() => {
        clock.reset(step, anim, settled, reduced);
        invalidate();
    }, [clock, step, anim, settled, reduced, invalidate]);

    useFrame((_, dt) => {
        if (clock.tick(dt)) invalidate();
    }, -2);
    return null;
};

/** Compila tudo o que a cena desenha e avisa quando os primeiros quadros saíram. */
export const ReadySignal = ({ onReady }: { onReady: () => void }) => {
    const gl = useThree(s => s.gl);
    const scene = useThree(s => s.scene);
    const camera = useThree(s => s.camera);
    const invalidate = useThree(s => s.invalidate);
    const frames = useRef(-1);

    useEffect(() => {
        let alive = true;
        gl.compileAsync(scene, camera)
            .catch(() => undefined) // sem a extensão paralela: compila no primeiro quadro, como sempre
            .then(() => {
                if (!alive) return;
                frames.current = 0;
                invalidate();
            });
        return () => { alive = false; };
    }, [gl, scene, camera, invalidate]);

    useFrame(() => {
        if (frames.current < 0) return;
        frames.current += 1;
        if (frames.current === 3) onReady();
        else if (frames.current < 3) invalidate();
    });
    return null;
};
