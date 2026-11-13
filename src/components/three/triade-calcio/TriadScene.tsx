import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Glycogen } from '../fibra-glicogenio/Glycogen';
import type { ShellState, Vec3 } from '../shared/modal/types';
import { STUDIO_LIGHT, useToonRamp } from '../shared/toon';
import { advanceTween, makeTween } from '../shared/tween';
import { Coupling } from './Coupling';
import { Ions } from './Ions';
import { GRANULES } from './layout';
import { Myofibrils } from './Myofibrils';
import { STEP, TRIAD_TARGETS, type TriadKey } from './steps';
import { Structure } from './Structure';
import { DoubtMark } from './TriadHud';

/* Cena da tríade: estrutura fixa, miofibrilas que encurtam, DHPR/RyR1, íons de Ca²⁺ e o glicogênio. */

/** Onde fica o "?": no vão entre o grupo intramiofibrilar e os RyR1 da cisterna de fora. */
const DOUBT_AT: Vec3 = [-4.05, 0.75, 4.45];
const GRANULE_R = 0.17;

export const TriadScene = ({ clock, step, settled }: ShellState) => {
    const ramp = useToonRamp();
    const tween = useMemo(() => makeTween<TriadKey>(TRIAD_TARGETS[0].to), []);
    useFrame(() => { advanceTween(tween, TRIAD_TARGETS, clock.step, clock.t, clock.anim); }, -1);
    return (
        <>
            <ambientLight intensity={STUDIO_LIGHT.ambient} />
            <directionalLight position={[...STUDIO_LIGHT.keyPos]} intensity={STUDIO_LIGHT.key} />
            <directionalLight position={[...STUDIO_LIGHT.fillPos]} intensity={STUDIO_LIGHT.fill} />
            <Structure ramp={ramp} />
            <Myofibrils params={tween.cur} ramp={ramp} />
            <Coupling clock={clock} params={tween.cur} ramp={ramp} />
            <Ions clock={clock} params={tween.cur} />
            <Glycogen params={tween.cur} ramp={ramp} granules={GRANULES} radius={GRANULE_R} />
            <DoubtMark at={DOUBT_AT} visible={settled && step >= STEP.low} />
        </>
    );
};
