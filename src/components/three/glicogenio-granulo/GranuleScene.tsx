import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import type { ShellState } from '../shared/modal/types';
import { STUDIO_LIGHT, useToonRamp } from '../shared/toon';
import { advanceTween, makeTween } from '../shared/tween';
import { RADIUS, SHELL } from './build';
import { Enzymes } from './Enzymes';
import { Glucoses } from './Glucoses';
import { GRANULE_TARGETS, type SceneKey } from './steps';

/*
 * Cena do grânulo: glicogenina (proteína, laranja) no centro, as glicoses, as enzimas e duas réguas
 * (anéis voltados para a câmera) de ~25 nm e 44 nm. Um tween central guarda os parâmetros da etapa.
 */

const RING_25 = 7 * SHELL + 0.7;
const RING_44 = RADIUS + 0.8;

/** Anel-régua sempre de frente para a câmera (tubo grosso: ≥ 4 px no quadro aberto). */
const Ring = ({ radius, value }: { radius: number; value: () => number }) => {
    const g = useRef<THREE.Group>(null);
    const geo = useMemo(() => new THREE.TorusGeometry(radius, 0.24, 6, 160), [radius]);
    useEffect(() => () => geo.dispose(), [geo]);
    useFrame(({ camera }) => {
        const grp = g.current;
        if (!grp) return;
        const v = value();
        grp.visible = v > 0.02;
        grp.quaternion.copy(camera.quaternion);
        grp.scale.setScalar(0.97 + 0.03 * v);
    });
    return (
        <group ref={g}>
            <mesh geometry={geo}><meshBasicMaterial color={C.caveat} /></mesh>
        </group>
    );
};

export const GranuleScene = ({ clock }: ShellState) => {
    const ramp = useToonRamp();
    const tween = useMemo(() => makeTween<SceneKey>(GRANULE_TARGETS[0].to), []);
    useFrame(() => {
        const c = clock;
        advanceTween(tween, GRANULE_TARGETS, c.step, c.t, c.anim);
    }, -1);
    const params = tween.cur;

    return (
        <>
            <ambientLight intensity={STUDIO_LIGHT.ambient} />
            <directionalLight position={[...STUDIO_LIGHT.keyPos]} intensity={STUDIO_LIGHT.key} />
            <directionalLight position={[...STUDIO_LIGHT.fillPos]} intensity={STUDIO_LIGHT.fill} />
            {/* glicogenina: um dímero de proteína no centro */}
            <mesh><icosahedronGeometry args={[0.82, 3]} /><meshToonMaterial color={C.protein} gradientMap={ramp} /></mesh>
            <mesh position={[-1.25, -0.5, 0.2]}><icosahedronGeometry args={[0.76, 3]} /><meshToonMaterial color={C.protein} gradientMap={ramp} /></mesh>
            <Glucoses clock={clock} ramp={ramp} params={params} />
            <Enzymes clock={clock} ramp={ramp} />
            <Ring radius={RING_25} value={() => params.ring25} />
            <Ring radius={RING_44} value={() => params.ring44} />
        </>
    );
};
