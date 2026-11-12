import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ShellState } from '../shared/modal/types';
import { STUDIO_LIGHT, useToonRamp } from '../shared/toon';
import { advanceTween, makeTween } from '../shared/tween';
import { Calcium } from './Calcium';
import { Fiber } from './Fiber';
import { Glut4 } from './Glut4';
import { Glycogen } from './Glycogen';
import { FIBER_TARGETS, type FiberKey, type Keys } from './steps';

/* Cena da fibra: corpo fixo, glicogênio por endereço (tween central), GLUT4 pelas chaves e o Ca²⁺. */
export const FiberScene = ({ clock, keys }: ShellState & { keys: Keys | null }) => {
    const ramp = useToonRamp();
    const tween = useMemo(() => makeTween<FiberKey>(FIBER_TARGETS[0].to), []);
    useFrame(() => { advanceTween(tween, FIBER_TARGETS, clock.step, clock.t, clock.anim); }, -1);
    return (
        <>
            <ambientLight intensity={STUDIO_LIGHT.ambient} />
            <directionalLight position={[...STUDIO_LIGHT.keyPos]} intensity={STUDIO_LIGHT.key} />
            <directionalLight position={[...STUDIO_LIGHT.fillPos]} intensity={STUDIO_LIGHT.fill} />
            <Fiber ramp={ramp} />
            <Glycogen params={tween.cur} ramp={ramp} />
            <Glut4 keys={keys} ramp={ramp} />
            <Calcium clock={clock} ramp={ramp} contraction={keys !== null && keys.mode !== 'insulina'} />
        </>
    );
};
