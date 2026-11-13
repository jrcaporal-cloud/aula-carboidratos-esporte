import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ShellState } from '../shared/modal/types';
import { STUDIO_LIGHT, useToonRamp } from '../shared/toon';
import { advanceTween, makeTween } from '../shared/tween';
import { Bundle } from './Bundle';
import { Fragment, Needle } from './Needle';
import { Thigh } from './Thigh';
import { BIOPSY_TARGETS, type BiopsyKey } from './steps';

/* Cena da biópsia: a coxa fixa, a agulha e o fragmento movidos por um tween central, o feixe ampliado no fim. */
export const BiopsyScene = ({ clock }: ShellState) => {
    const ramp = useToonRamp();
    const tween = useMemo(() => makeTween<BiopsyKey>(BIOPSY_TARGETS[0].to), []);
    useFrame(() => { advanceTween(tween, BIOPSY_TARGETS, clock.step, clock.t, clock.anim); }, -1);
    return (
        <>
            <ambientLight intensity={STUDIO_LIGHT.ambient} />
            <directionalLight position={[...STUDIO_LIGHT.keyPos]} intensity={STUDIO_LIGHT.key} />
            <directionalLight position={[...STUDIO_LIGHT.fillPos]} intensity={STUDIO_LIGHT.fill} />
            <Thigh ramp={ramp} />
            <Needle params={tween.cur} ramp={ramp} />
            <Fragment params={tween.cur} ramp={ramp} />
            <Bundle params={tween.cur} ramp={ramp} />
        </>
    );
};
