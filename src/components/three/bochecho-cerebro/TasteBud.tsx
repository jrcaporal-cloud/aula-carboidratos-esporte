import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { phase } from '../shared/math';
import type { ClockRef } from '../shared/modal/types';
import type { Params } from '../shared/tween';
import { touch } from './geometry';
import { BUD, BUD_LOCAL, COLORS, PAPILLA } from './layout';
import { STEP, type RinseKey } from './steps';

/*
 * O botão gustativo ampliado, fora do rosto, ligado à papila por uma lupa (como o feixe da biópsia):
 * células em gomo convergindo para o poro, microvilosidades, o receptor do doce T1R2/T1R3 (dois lobos,
 * neutro) e o sensor de carboidrato hipotético (pedra, com "?"). Duas cadeias de maltodextrina
 * (7 glicoses, hexágonos âmbar) descem até perto do sensor. Fora de escala.
 */

const CELLS = 10;
const UNITS = 7;
const CHAINS: readonly { from: THREE.Vector3; to: THREE.Vector3; dir: THREE.Vector3; at: number }[] = [
    { from: new THREE.Vector3(1.6, 3.4, 0.5), to: new THREE.Vector3(0.95, 2.45, 0.25), dir: new THREE.Vector3(1, 0.35, 0).normalize(), at: 0.7 },
    { from: new THREE.Vector3(2.2, 2.7, -0.2), to: new THREE.Vector3(1.3, 1.95, 0.1), dir: new THREE.Vector3(1, -0.25, 0).normalize(), at: 1.0 },
];
const UNIT_GAP = 0.25;
const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const FACE = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
const UP = new THREE.Vector3(0, 1, 0);
const SCALE_ONE = new THREE.Vector3(1, 1, 1);

/** Células do botão: gomos inclinados, as pontas juntas no poro. */
const CELL_MATS: readonly THREE.Matrix4[] = Array.from({ length: CELLS }, (_, k) => {
    const a = (k / CELLS) * Math.PI * 2;
    const base = new THREE.Vector3(0.66 * Math.cos(a), -0.15, 0.66 * Math.sin(a));
    const tip = new THREE.Vector3(0.14 * Math.cos(a), 1.12, 0.14 * Math.sin(a));
    const d = tip.clone().sub(base);
    const center = base.clone().addScaledVector(d, 0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize());
    return new THREE.Matrix4().compose(center, q, new THREE.Vector3(0.3, d.length() / 2, 0.3));
});
const VILLI: readonly (readonly [number, number])[] = [[-0.12, 0], [0.12, 0.05], [0, -0.12], [0.02, 0.13], [-0.1, 0.1]];

/** Linhas da lupa: do alto e de baixo do anel na papila até a borda do epitélio e o fundo do botão ampliado. */
const LUPA_R = 0.42;
const LUPA_Z = PAPILLA[2] + 0.6;
const ZOOM_LINES: readonly [number, number, number][][] = [
    [[PAPILLA[0], PAPILLA[1] + LUPA_R, LUPA_Z], [BUD.c[0] - 2.1 * BUD.scale, BUD.c[1] + 1.12 * BUD.scale, BUD.c[2]]],
    [[PAPILLA[0], PAPILLA[1] - LUPA_R, LUPA_Z], [BUD.c[0] - 0.5 * BUD.scale, BUD.c[1] - 0.75 * BUD.scale, BUD.c[2]]],
];

const useChains = () => {
    const built = useMemo(() => {
        const geo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 6);
        const mat = new THREE.MeshBasicMaterial({ color: C.glucose });
        const mesh = new THREE.InstancedMesh(geo, mat, CHAINS.length * UNITS);
        mesh.frustumCulled = false;
        return { mesh, geo, mat };
    }, []);
    useEffect(() => () => { built.geo.dispose(); built.mat.dispose(); built.mesh.dispose(); }, [built]);
    return built.mesh;
};

interface Props { clock: ClockRef; params: Params<RinseKey>; ramp: THREE.Texture }

export const TasteBud = ({ clock, params, ramp }: Props) => {
    const group = useRef<THREE.Group>(null);
    const lupa = useRef<THREE.Group>(null);
    const cells = useRef<THREE.InstancedMesh>(null);
    const chains = useChains();

    useEffect(() => {
        const m = cells.current;
        if (!m) return;
        CELL_MATS.forEach((mat, i) => m.setMatrixAt(i, mat));
        m.instanceMatrix.needsUpdate = true;
        m.computeBoundingSphere();
    }, []);

    useFrame(() => {
        const g = group.current;
        const l = lupa.current;
        if (!g || !l) return;
        const z = params.bud;
        g.visible = z > 0.01;
        g.scale.setScalar(BUD.scale * Math.max(z, 0.001));
        l.visible = z > 0.15;
        const on = clock.step === STEP.sensor && z > 0.5;
        CHAINS.forEach((ch, c) => {
            const u = phase(clock.t, ch.at, ch.at + 1.3);
            P.lerpVectors(ch.from, ch.to, u);
            for (let k = 0; k < UNITS; k++) {
                const off = k * UNIT_GAP;
                S.set(P.x + ch.dir.x * off, P.y + ch.dir.y * off + 0.05 * Math.sin(k * 1.7), P.z + ch.dir.z * off);
                chains.setMatrixAt(c * UNITS + k, on ? M.compose(S, FACE, SCALE_ONE) : M.makeScale(0, 0, 0));
            }
        });
        touch(chains);
    });

    const toonOf = (color: string) => <meshToonMaterial color={color} gradientMap={ramp} />;
    return (
        <>
            <group ref={group} position={[...BUD.c]} visible={false}>
                {/* epitélio: a superfície da língua com o poro gustativo */}
                <mesh position={[0, 1.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.3, 2.1, 48]} />
                    <meshToonMaterial color={COLORS.budSurface} gradientMap={ramp} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0, 1.04, 0]}>
                    <cylinderGeometry args={[2.1, 2.1, 0.16, 48, 1, true]} />
                    <meshToonMaterial color={COLORS.tongueCut} gradientMap={ramp} side={THREE.DoubleSide} />
                </mesh>
                <instancedMesh ref={cells} args={[undefined, undefined, CELLS]}>
                    <sphereGeometry args={[1, 24, 16]} />
                    {toonOf(COLORS.budCell)}
                </instancedMesh>
                {VILLI.map(([x, z], i) => (
                    <mesh key={i} position={[x, 1.38, z]}>
                        <cylinderGeometry args={[0.035, 0.035, 0.36, 6]} />
                        {toonOf(COLORS.budCell)}
                    </mesh>
                ))}
                {/* receptor do doce T1R2/T1R3: dois lobos num pedúnculo */}
                <group position={[...BUD_LOCAL.sweet]}>
                    <mesh position={[0.18, -0.42, -0.05]} rotation={[0, 0, 0.55]}>
                        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
                        {toonOf(COLORS.sweet)}
                    </mesh>
                    <mesh position={[-0.15, 0, 0]}><sphereGeometry args={[0.24, 20, 14]} />{toonOf(COLORS.sweet)}</mesh>
                    <mesh position={[0.15, 0, 0]}><sphereGeometry args={[0.24, 20, 14]} />{toonOf(COLORS.sweetB)}</mesh>
                </group>
                {/* sensor de carboidrato hipotético: uma taça neutra (pedra) */}
                <group position={[...BUD_LOCAL.sensor]}>
                    <mesh position={[-0.18, -0.42, -0.05]} rotation={[0, 0, -0.55]}>
                        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
                        {toonOf(COLORS.sensor)}
                    </mesh>
                    <mesh rotation={[Math.PI, 0, 0]}>
                        <sphereGeometry args={[0.3, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                        <meshToonMaterial color={COLORS.sensor} gradientMap={ramp} side={THREE.DoubleSide} />
                    </mesh>
                </group>
                <primitive object={chains} />
            </group>
            <group ref={lupa} visible={false}>
                <mesh position={[PAPILLA[0], PAPILLA[1], LUPA_Z]}>
                    <ringGeometry args={[LUPA_R - 0.07, LUPA_R + 0.03, 40]} />
                    <meshBasicMaterial color={C.caveat} side={THREE.DoubleSide} />
                </mesh>
                {ZOOM_LINES.map((pts, i) => <Line key={i} points={pts} color={C.caveat} lineWidth={3} />)}
            </group>
        </>
    );
};
