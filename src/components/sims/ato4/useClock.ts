import { useEffect, useState } from 'react';

/**
 * Cronômetro linear: conta de 0 até `target` em `seconds` quando `run` liga (todos no mesmo ritmo,
 * então o menor para primeiro). Com `run` desligado volta a 0; com `reduce`, chega de uma vez.
 */
export const useClock = (target: number, seconds: number, run: boolean, reduce: boolean): number => {
    const [state, setState] = useState({ key: '', value: 0 });
    const key = `${target}|${seconds}|${run}`;
    const active = run && !reduce;

    useEffect(() => {
        if (!active) return undefined;
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const t = Math.min((now - start) / (seconds * 1000), 1);
            setState({ key, value: target * t });
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [key, active, target, seconds]);

    if (!run) return 0;
    if (reduce) return target;
    return state.key === key ? state.value : 0;
};
