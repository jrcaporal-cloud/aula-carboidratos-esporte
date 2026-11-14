import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seg } from '../shared/math';
import type { ClockRef, Vec3 } from '../shared/modal/types';
import type { Params } from '../shared/tween';
import { pathTable, samplePath, touch } from './geometry';
import { AFFERENT, ARROW_TIP, BRANCH, COLORS, DESCENT, TRUNK, type Branch } from './layout';
import { colorPair, toon, useOwned } from './materials';
import { MAX_PULSES, PULSES, STEP, type RinseKey, type Route } from './steps';

/*
 * As vias: aferente gustativa (língua → NTS, sobre a face do corte), o tronco comum e os ramos do NTS
 * para as regiões (via simplificada, sem tálamo) e a via motora descendente com a seta "para o
 * músculo". Em repouso, tubos em ardósia escura; a via da etapa fica clara e os pulsos âmbar correm
 * por ela uma vez (tabelas de pontos prontas: nenhum vetor novo por quadro).
 */

const PULSE_R = 0.26;
const RIM = 1.3;
const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const Q = new THREE.Quaternion();

const routeOf = (b: Branch) => [...TRUNK, ...BRANCH[b].slice(1)];
const TABLES: Readonly<Record<Route, Float32Array>> = {
    aff: pathTable(AFFERENT),
    ins: pathTable(routeOf('ins')),
    ofc: pathTable(routeOf('ofc')),
    str: pathTable(routeOf('str')),
    acc: pathTable(routeOf('acc')),
    desc: pathTable(DESCENT),
};

const tube = (pts: readonly Vec3[], r: number) =>
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), false, 'centripetal'), 72, r, 10, false);

/** Ramos que a etapa usa (a via clareia) — o resto fica escuro. */
const BRANCH_STEP: Readonly<Record<Branch, number>> = { ins: STEP.taste, ofc: STEP.taste, str: STEP.reward, acc: STEP.reward };
const BRANCHES = Object.keys(BRANCH) as Branch[];

const ARROW_DIR = new THREE.Vector3(...DESCENT[DESCENT.length - 1]).sub(new THREE.Vector3(...DESCENT[DESCENT.length - 2])).normalize();
const ARROW_Q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), ARROW_DIR);
const ARROW_LEN = 1.7;
const ARROW_BASE: Vec3 = [ARROW_TIP[0], ARROW_TIP[1] + ARROW_LEN, ARROW_TIP[2]];

interface Props { clock: ClockRef; params: Params<RinseKey>; ramp: THREE.Texture; carb: MutableRefObject<number> }

const usePulses = () => {
    const parts = useMemo(() => {
        const geo = new THREE.IcosahedronGeometry(PULSE_R, 2);
        const fill = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: COLORS.pulse }), MAX_PULSES);
        const rim = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: COLORS.hull, side: THREE.BackSide }), MAX_PULSES);
        for (const m of [fill, rim]) m.frustumCulled = false;
        return { fill, rim, geo };
    }, []);
    useEffect(() => () => {
        for (const m of [parts.fill, parts.rim]) { (m.material as THREE.Material).dispose(); m.dispose(); }
        parts.geo.dispose();
    }, [parts]);
    return parts;
};

export const Paths = ({ clock, params, ramp, carb }: Props) => {
    const geos = useOwned(() => {
        const g = {
            aff: tube(AFFERENT, 0.12), trunk: tube(TRUNK, 0.1), desc: tube(DESCENT, 0.12),
            ins: tube(BRANCH.ins, 0.09), ofc: tube(BRANCH.ofc, 0.09), str: tube(BRANCH.str, 0.09), acc: tube(BRANCH.acc, 0.09),
        };
        return { g, dispose: () => Object.values(g).forEach(x => x.dispose()) };
    }, []).g;
    const mats = useOwned(() => {
        const m = {
            aff: toon(COLORS.pathDim, ramp), trunk: toon(COLORS.pathDim, ramp), desc: toon(COLORS.pathDim, ramp),
            ins: toon(COLORS.pathDim, ramp), ofc: toon(COLORS.pathDim, ramp), str: toon(COLORS.pathDim, ramp), acc: toon(COLORS.pathDim, ramp),
            arrow: toon(COLORS.calm, ramp),
        };
        return { m, dispose: () => Object.values(m).forEach(x => x.dispose()) };
    }, [ramp]).m;
    const pair = useMemo(() => colorPair(COLORS.pathDim, COLORS.pathOn), []);
    const arrowPair = useMemo(() => colorPair(COLORS.calm, COLORS.lit), []);
    const arrow = useRef<THREE.Group>(null);
    const pulses = usePulses();

    useFrame(() => {
        const [dim, on] = pair;
        const step = clock.step;
        mats.aff.color.lerpColors(dim, on, params.aff);
        mats.trunk.color.lerpColors(dim, on, params.asc);
        mats.desc.color.lerpColors(dim, on, params.desc);
        for (const b of BRANCHES) {
            const k = BRANCH_STEP[b] === step ? params.asc * (b === 'str' || b === 'acc' ? carb.current : 1) : 0;
            mats[b].color.lerpColors(dim, on, k);
        }
        mats.arrow.color.lerpColors(arrowPair[0], arrowPair[1], params.arrow);
        const a = arrow.current;
        if (a) { a.visible = params.desc > 0.01; a.scale.setScalar(Math.max(params.desc, 0.001)); }

        const cues = PULSES[step] ?? [];
        for (let i = 0; i < MAX_PULSES; i++) {
            const cue = cues[i];
            let s = 0;
            if (cue && !(cue.carbOnly && carb.current < 0.5)) {
                const u = seg(clock.t, cue.at, cue.at + cue.dur);
                if (u > 0 && u < 1) { samplePath(TABLES[cue.route], u, P); s = 1; }
            }
            pulses.fill.setMatrixAt(i, M.compose(P, Q, S.setScalar(s)));
            pulses.rim.setMatrixAt(i, M.compose(P, Q, S.setScalar(s * RIM)));
        }
        touch(pulses.fill);
        touch(pulses.rim);
    });

    return (
        <group>
            <mesh geometry={geos.aff} material={mats.aff} />
            <mesh geometry={geos.trunk} material={mats.trunk} />
            {BRANCHES.map(b => <mesh key={b} geometry={geos[b]} material={mats[b]} />)}
            <mesh geometry={geos.desc} material={mats.desc} />
            <group ref={arrow} position={[...ARROW_BASE]} quaternion={ARROW_Q} visible={false}>
                <mesh position={[0, -ARROW_LEN * 0.35, 0]} material={mats.arrow}>
                    <cylinderGeometry args={[0.15, 0.15, ARROW_LEN * 0.7, 12]} />
                </mesh>
                <mesh position={[0, -ARROW_LEN * 0.85, 0]} rotation={[Math.PI, 0, 0]} material={mats.arrow}>
                    <coneGeometry args={[0.45, ARROW_LEN * 0.4, 20]} />
                </mesh>
            </group>
            <primitive object={pulses.fill} />
            <primitive object={pulses.rim} />
        </group>
    );
};
