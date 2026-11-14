import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { ShellState } from '../shared/modal/types';
import { STUDIO_LIGHT, useToonRamp } from '../shared/toon';
import { advanceTween, makeTween } from '../shared/tween';
import { DoubtMark } from '../triade-calcio/TriadHud';
import { Brain } from './Brain';
import { Head } from './Head';
import { Mouth } from './Mouth';
import { Paths } from './Paths';
import { DOUBTS, REST, RINSE_TARGETS, type RinseKey } from './steps';
import { TasteBud } from './TasteBud';

/* Cena do bochecho: a cabeça em corte, a boca, o botão ampliado, o cérebro com as regiões e as vias. */

export type Rinse = 'carb' | 'sac';

const CARB_RATE = 6;

interface Props extends ShellState { rinse: Rinse }

export const RinseScene = ({ clock, step, settled, rinse }: Props) => {
    const ramp = useToonRamp();
    const tween = useMemo(() => makeTween<RinseKey>(REST), []);
    const invalidate = useThree(s => s.invalidate);
    // carboidrato (1) × sacarina (0): só muda estriado e cingulado anterior, com transição curta
    const carb = useRef(rinse === 'carb' ? 1 : 0);
    const goal = rinse === 'carb' ? 1 : 0;
    useEffect(() => { invalidate(); }, [goal, invalidate]);
    useFrame((_, dt) => {
        advanceTween(tween, RINSE_TARGETS, clock.step, clock.t, clock.anim);
        const d = goal - carb.current;
        if (Math.abs(d) < 0.002) { carb.current = goal; return; }
        carb.current += d * Math.min(1, Math.min(dt, 1 / 30) * CARB_RATE);
        invalidate();
    }, -1);
    const lights = useMemo(() => ({ params: tween.cur, carb }), [tween]);
    return (
        <>
            <ambientLight intensity={STUDIO_LIGHT.ambient} />
            <directionalLight position={[...STUDIO_LIGHT.keyPos]} intensity={STUDIO_LIGHT.key} />
            <directionalLight position={[...STUDIO_LIGHT.fillPos]} intensity={STUDIO_LIGHT.fill} />
            <Head ramp={ramp} />
            <Brain ramp={ramp} lights={lights} />
            <Mouth clock={clock} params={tween.cur} ramp={ramp} />
            <TasteBud clock={clock} params={tween.cur} ramp={ramp} />
            <Paths clock={clock} params={tween.cur} ramp={ramp} carb={carb} />
            {DOUBTS.map(d => <DoubtMark key={d.step} at={d.at} visible={settled && step === d.step} />)}
        </>
    );
};
